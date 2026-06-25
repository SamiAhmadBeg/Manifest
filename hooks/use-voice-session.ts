'use client'

import { useCallback, useEffect, useRef } from 'react'

const SILENCE_MS = 3000
const SPEECH_LEVEL = 0.008
const POLL_MS = 80
const NO_AUDIO_WARN_MS = 2500
const LEVEL_NOTIFY_MS = 100
const SILENCE_NOTIFY_MS = 200

export type VoiceListenPhase = 'armed' | 'hearing' | 'silence'

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionEventLike = {
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      [index: number]: { transcript: string }
    }
  }
}

type VoiceSessionCallbacks = {
  onUtterance: (text: string) => void
  onTranscript?: (text: string) => void
  onPhaseChange?: (phase: VoiceListenPhase, silenceMsLeft?: number) => void
  onAudioLevel?: (level: number) => void
  onMicReady?: () => void
  onError?: (message: string) => void
  onNoAudioDetected?: () => void
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function buildTranscript(event: SpeechRecognitionEventLike) {
  let text = ''
  for (let i = 0; i < event.results.length; i++) {
    text += event.results[i][0]?.transcript ?? ''
  }
  return text.trim()
}

function readAudioLevel(analyser: AnalyserNode): number {
  const timeData = new Uint8Array(analyser.fftSize)
  analyser.getByteTimeDomainData(timeData)
  let timeSum = 0
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    timeSum += v * v
  }
  const rms = Math.sqrt(timeSum / timeData.length)

  const freqData = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(freqData)
  let freqSum = 0
  const voiceStart = 2
  const voiceEnd = Math.min(freqData.length, 40)
  for (let i = voiceStart; i < voiceEnd; i++) {
    freqSum += freqData[i]
  }
  const voiceBand = freqSum / (voiceEnd - voiceStart) / 255

  return Math.max(rms, voiceBand * 0.35)
}

export function useVoiceSession({
  enabled,
  onUtterance,
  onTranscript,
  onPhaseChange,
  onAudioLevel,
  onMicReady,
  onError,
  onNoAudioDetected,
}: {
  enabled: boolean
} & VoiceSessionCallbacks) {
  const callbacksRef = useRef<VoiceSessionCallbacks>({
    onUtterance,
    onTranscript,
    onPhaseChange,
    onAudioLevel,
    onMicReady,
    onError,
    onNoAudioDetected,
  })
  callbacksRef.current = {
    onUtterance,
    onTranscript,
    onPhaseChange,
    onAudioLevel,
    onMicReady,
    onError,
    onNoAudioDetected,
  }

  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const transcriptRef = useRef('')
  const hasSpokenRef = useRef(false)
  const silenceStartRef = useRef<number | null>(null)
  const submittingRef = useRef(false)
  const enabledRef = useRef(enabled)
  const micReadyAtRef = useRef<number | null>(null)
  const maxLevelRef = useRef(0)
  const noAudioWarnedRef = useRef(false)
  const listenPhaseRef = useRef<VoiceListenPhase | null>(null)
  const lastLevelNotifyRef = useRef(0)
  const lastSilenceNotifyRef = useRef(0)
  const lastSilenceLeftRef = useRef(-1)
  const startingRef = useRef(false)
  const erroredRef = useRef(false)

  enabledRef.current = enabled

  const setListenPhase = useCallback(
    (phase: VoiceListenPhase, silenceMsLeft?: number) => {
      if (listenPhaseRef.current === phase && silenceMsLeft === undefined) return
      listenPhaseRef.current = phase
      callbacksRef.current.onPhaseChange?.(phase, silenceMsLeft)
    },
    [],
  )

  const cleanup = useCallback(() => {
    startingRef.current = false

    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    recognitionRef.current?.abort()
    recognitionRef.current = null
    if (recorderRef.current?.state !== 'inactive') {
      try {
        recorderRef.current?.stop()
      } catch {
        // ignore
      }
    }
    recorderRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
    chunksRef.current = []
    hasSpokenRef.current = false
    silenceStartRef.current = null
    transcriptRef.current = ''
    micReadyAtRef.current = null
    maxLevelRef.current = 0
    noAudioWarnedRef.current = false
    listenPhaseRef.current = null
    lastLevelNotifyRef.current = 0
    lastSilenceNotifyRef.current = 0
    lastSilenceLeftRef.current = -1
    callbacksRef.current.onAudioLevel?.(0)
  }, [])

  const markSpeechDetected = useCallback(() => {
    hasSpokenRef.current = true
    silenceStartRef.current = null
    setListenPhase('hearing')
  }, [setListenPhase])

  const transcribeBlob = useCallback(async (blob: Blob) => {
    const form = new FormData()
    form.append('file', blob, 'recording.webm')
    const res = await fetch('/api/transcribe', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Transcription failed')
    return data.text as string
  }, [])

  const reportError = useCallback((message: string) => {
    if (erroredRef.current) return
    erroredRef.current = true
    callbacksRef.current.onError?.(message)
  }, [])

  const finishAndSubmit = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true

    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }

    recognitionRef.current?.stop()
    recognitionRef.current = null

    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve()
        recorder.stop()
      })
    }

    const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const savedTranscript = transcriptRef.current.trim()

    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close().catch(() => {})
    callbacksRef.current.onAudioLevel?.(0)

    let text = savedTranscript

    try {
      if (!text && blob.size > 0) {
        text = await transcribeBlob(blob)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transcription failed'
      submittingRef.current = false
      reportError(msg)
      return
    }

    if (!text) {
      submittingRef.current = false
      reportError('No speech detected. Try speaking louder.')
      return
    }

    callbacksRef.current.onUtterance(text)
  }, [reportError, transcribeBlob])

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const text = buildTranscript(event)
      if (!text) return
      transcriptRef.current = text
      callbacksRef.current.onTranscript?.(text)
      markSpeechDetected()
    }

    recognition.onerror = (event) => {
      if (
        event.error === 'aborted' ||
        event.error === 'no-speech' ||
        event.error === 'network'
      ) {
        return
      }
    }

    recognition.onend = () => {
      if (enabledRef.current && !submittingRef.current && recognitionRef.current) {
        try {
          recognition.start()
        } catch {
          // speech API optional — mic + Whisper still works
        }
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      // speech API optional — mic + Whisper still works
    }
  }, [markSpeechDetected])

  const start = useCallback(async () => {
    if (startingRef.current || submittingRef.current) return
    startingRef.current = true
    erroredRef.current = false

    cleanup()

    if (!navigator.mediaDevices?.getUserMedia) {
      startingRef.current = false
      reportError('Microphone not available. Open in Chrome.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      if (!enabledRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        startingRef.current = false
        return
      }

      streamRef.current = stream
      micReadyAtRef.current = Date.now()
      maxLevelRef.current = 0
      noAudioWarnedRef.current = false
      callbacksRef.current.onMicReady?.()

      const audioCtx = new AudioContext()
      await audioCtx.resume()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      audioCtxRef.current = audioCtx
      analyserRef.current = analyser

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.start(250)
      recorderRef.current = recorder

      setListenPhase('armed')
      startSpeechRecognition()
      startingRef.current = false

      pollRef.current = setInterval(() => {
        if (!analyserRef.current || submittingRef.current) return

        const level = readAudioLevel(analyserRef.current)
        if (level > maxLevelRef.current) maxLevelRef.current = level

        const now = Date.now()
        if (now - lastLevelNotifyRef.current >= LEVEL_NOTIFY_MS) {
          lastLevelNotifyRef.current = now
          callbacksRef.current.onAudioLevel?.(level)
        }

        if (
          micReadyAtRef.current &&
          !noAudioWarnedRef.current &&
          !hasSpokenRef.current &&
          now - micReadyAtRef.current > NO_AUDIO_WARN_MS &&
          maxLevelRef.current < SPEECH_LEVEL * 0.5
        ) {
          noAudioWarnedRef.current = true
          callbacksRef.current.onNoAudioDetected?.()
        }

        if (level > SPEECH_LEVEL) {
          markSpeechDetected()
          return
        }

        if (!hasSpokenRef.current) return

        if (silenceStartRef.current === null) {
          silenceStartRef.current = now
        }

        const elapsed = now - silenceStartRef.current
        const left = Math.max(0, SILENCE_MS - elapsed)
        const leftBucket = Math.ceil(left / 250) * 250

        if (
          listenPhaseRef.current !== 'silence' ||
          leftBucket !== lastSilenceLeftRef.current ||
          now - lastSilenceNotifyRef.current >= SILENCE_NOTIFY_MS
        ) {
          lastSilenceLeftRef.current = leftBucket
          lastSilenceNotifyRef.current = now
          setListenPhase('silence', left)
        }

        if (elapsed >= SILENCE_MS) {
          finishAndSubmit()
        }
      }, POLL_MS)
    } catch {
      startingRef.current = false
      cleanup()
      reportError(
        'Microphone blocked. Open http://localhost:3000 in Chrome (not Cursor preview) and allow mic access.',
      )
    }
  }, [cleanup, finishAndSubmit, markSpeechDetected, reportError, setListenPhase, startSpeechRecognition])

  useEffect(() => {
    erroredRef.current = false
    if (enabled) {
      start()
    } else {
      cleanup()
      submittingRef.current = false
    }
    return () => cleanup()
  }, [enabled, start, cleanup])

  return { stop: cleanup }
}

export function isMicrophoneSupported() {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
}
