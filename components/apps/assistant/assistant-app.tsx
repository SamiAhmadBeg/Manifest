'use client'

import {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react'
import { Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { keyToSignal } from '@/lib/bci-controls'
import type { AssistantPhase, ChatMessage } from '@/lib/assistant/types'
import {
  isMicrophoneSupported,
  useVoiceSession,
  type VoiceListenPhase,
} from '@/hooks/use-voice-session'
import { VoiceIndicator } from '@/components/apps/assistant/voice-indicator'

export type AssistantAppHandle = {
  handleKey: (key: string) => boolean
}

export type AssistantAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

const PHASE_LABEL: Record<AssistantPhase, string> = {
  idle: 'Ready',
  listening: 'Listening',
  thinking: 'Thinking',
  ready: 'Reply ready',
  error: 'Error',
}

export const AssistantApp = forwardRef<AssistantAppHandle, AssistantAppProps>(
  function AssistantApp({ onClose, onNotify }, ref) {
    const [phase, setPhase] = useState<AssistantPhase>('idle')
    const [interimText, setInterimText] = useState('')
    const [lastPrompt, setLastPrompt] = useState('')
    const [lastReply, setLastReply] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [listenPhase, setListenPhase] = useState<VoiceListenPhase | null>(null)
    const [silenceMsLeft, setSilenceMsLeft] = useState(3000)
    const [audioLevel, setAudioLevel] = useState(0)
    const [micEnabled, setMicEnabled] = useState(false)
    const [micWarning, setMicWarning] = useState('')
    const messagesRef = useRef<ChatMessage[]>([])

    const startListening = useCallback(() => {
      if (!isMicrophoneSupported()) {
        setErrorMessage('Microphone not available. Use Chrome.')
        setPhase('error')
        onNotify('Mic not supported')
        return
      }
      setInterimText('')
      setListenPhase(null)
      setMicEnabled(false)
      setMicWarning('')
      setAudioLevel(0)
      setPhase('listening')
      onNotify('Requesting microphone…')
    }, [onNotify])

    const sendToGpt = useCallback(
      async (text: string) => {
        setListenPhase(null)
        setMicEnabled(false)
        setPhase('thinking')
        setLastPrompt(text)
        setInterimText('')
        onNotify('Sending to GPT')

        const nextMessages: ChatMessage[] = [
          ...messagesRef.current,
          { role: 'user', content: text },
        ]

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: nextMessages }),
          })

          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || 'Request failed')
          }

          messagesRef.current = [
            ...nextMessages,
            { role: 'assistant', content: data.reply },
          ]
          setLastReply(data.reply)
          setPhase('idle')
          onNotify('Reply ready — ↵ to speak again')
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Something went wrong'
          setErrorMessage(msg)
          setPhase('error')
          onNotify('Error')
        }
      },
      [onNotify],
    )

    const handlePhaseChange = useCallback(
      (voicePhase: VoiceListenPhase, msLeft?: number) => {
        setListenPhase(voicePhase)
        if (msLeft !== undefined) setSilenceMsLeft(msLeft)
      },
      [],
    )

    const handleVoiceError = useCallback(
      (message: string) => {
        setListenPhase(null)
        setMicEnabled(false)
        setErrorMessage(message)
        setPhase('error')
        onNotify(message.slice(0, 48))
      },
      [onNotify],
    )

    const handleMicReady = useCallback(() => {
      setMicEnabled(true)
      setMicWarning('')
      onNotify('Mic live — speak now')
    }, [onNotify])

    const handleNoAudioDetected = useCallback(() => {
      setMicWarning(
        'No mic signal detected. Open http://localhost:3000 in Chrome and allow microphone access.',
      )
    }, [])

    useVoiceSession({
      enabled: phase === 'listening',
      onUtterance: sendToGpt,
      onTranscript: setInterimText,
      onPhaseChange: handlePhaseChange,
      onAudioLevel: setAudioLevel,
      onMicReady: handleMicReady,
      onNoAudioDetected: handleNoAudioDetected,
      onError: handleVoiceError,
    })

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)

        if (signal === 'exit') {
          onClose()
          onNotify('Exited AI Assistant')
          return true
        }

        if (signal === 'jaw-clench') {
          if (phase === 'idle' || phase === 'ready') {
            startListening()
            return true
          }
          if (phase === 'listening' || phase === 'thinking') return true
          if (phase === 'error') {
            setErrorMessage('')
            setPhase('idle')
            return true
          }
        }

        if (phase === 'listening' || phase === 'thinking') return true
        return false
      },
      [phase, onClose, onNotify, startListening],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    return (
      <>
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Sparkles className="size-5" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-medium tracking-tight text-muted-foreground">
                Manifest
              </span>
              <p className="text-base font-semibold tracking-tight">AI Assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3.5" />
            Exit
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 w-2/3 max-w-md rounded-full opacity-60 blur-3xl"
            style={{
              background:
                phase === 'listening'
                  ? 'radial-gradient(circle, oklch(0.58 0.21 27 / 0.12), transparent 70%)'
                  : 'radial-gradient(circle, oklch(0.58 0.21 27 / 0.06), transparent 70%)',
            }}
          />

          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
            <div className="flex w-full max-w-md items-center justify-center gap-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Voice Assistant
              </p>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs font-medium text-muted-foreground">
                {PHASE_LABEL[phase]}
              </span>
            </div>

            {phase === 'listening' ? (
              <VoiceIndicator
                listenPhase={listenPhase}
                silenceMsLeft={silenceMsLeft}
                transcript={interimText}
                audioLevel={audioLevel}
                micEnabled={micEnabled}
                micWarning={micWarning}
              />
            ) : (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex w-full max-w-md flex-col items-center gap-5 text-center"
              >
                {phase === 'idle' && (
                  <>
                    <div className="grid size-20 place-items-center rounded-full border border-border/80 bg-card shadow-sm">
                      <Sparkles
                        className="size-9 text-primary/80"
                        strokeWidth={1.4}
                      />
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                      Press ↵ to open the mic, then speak your question
                    </p>
                  </>
                )}

                {phase === 'thinking' && (
                  <>
                    <div className="relative grid size-20 place-items-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                      <div className="relative grid size-20 place-items-center rounded-full border border-primary/20 bg-primary/5">
                        <Sparkles
                          className="size-9 animate-pulse text-primary"
                          strokeWidth={1.4}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Sending to GPT…
                    </p>
                  </>
                )}

                {phase === 'error' && (
                  <>
                    <div className="w-full rounded-[1.5rem] border border-primary/15 bg-primary/[0.04] px-6 py-5 text-center shadow-sm">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {errorMessage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('')
                        setPhase('idle')
                        onNotify('Ready')
                      }}
                      className="rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-opacity hover:opacity-90"
                    >
                      Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {(lastPrompt || lastReply) && phase !== 'listening' && (
              <div className="flex w-full max-w-md flex-col gap-4">
                {lastPrompt && (
                  <div className="rounded-[1.5rem] border border-border/80 bg-secondary/30 px-6 py-5 text-center shadow-sm">
                    <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      You said
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-foreground/90">
                      {lastPrompt}
                    </p>
                  </div>
                )}

                {lastReply && (
                  <div className="rounded-[1.5rem] border border-primary/15 bg-card px-6 py-5 text-center shadow-sm">
                    <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                      Assistant
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {lastReply}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )
  },
)
