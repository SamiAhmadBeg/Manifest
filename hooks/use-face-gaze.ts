'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision'
import { GAZE, type GazeSide } from '@/lib/gaze/config'

export type GazeStatus = 'off' | 'requesting' | 'tracking' | 'denied' | 'error'

export type GazeState = {
  status: GazeStatus
  side: GazeSide
  /** 0–1 dwell progress toward a fire on the active side */
  dwell: number
  score: number
  message: string
}

const INITIAL: GazeState = {
  status: 'off',
  side: 'center',
  dwell: 0,
  score: 0,
  message: 'Gaze off',
}

/**
 * Look score from Face Landmarker.
 * Positive → screen left (‹); negative → screen right (›).
 * Nose vs eye-line yaw only — iris blend was cancelling slight looks.
 */
function lookScoreFromLandmarks(
  landmarks: { x: number; y: number; z?: number }[],
): number {
  const leftOuter = landmarks[33]
  const rightOuter = landmarks[263]
  const nose = landmarks[1]
  if (!leftOuter || !rightOuter || !nose) return 0

  const midX = (leftOuter.x + rightOuter.x) / 2
  const eyeDist = Math.abs(rightOuter.x - leftOuter.x) || 1e-6
  // Unmirrored selfie: head turn to user's left → nose x increases.
  return ((nose.x - midX) / eyeDist) * GAZE.SCORE_GAIN
}

function sideFromScore(score: number, armed: GazeSide): GazeSide {
  // Hysteresis: easier to enter left/right, harder to leave (breathing room to stop).
  if (armed === 'left') {
    if (score >= GAZE.RELEASE_THRESHOLD) return 'left'
    if (score <= -GAZE.ARM_THRESHOLD) return 'right'
    return 'center'
  }
  if (armed === 'right') {
    if (score <= -GAZE.RELEASE_THRESHOLD) return 'right'
    if (score >= GAZE.ARM_THRESHOLD) return 'left'
    return 'center'
  }
  if (score >= GAZE.ARM_THRESHOLD) return 'left'
  if (score <= -GAZE.ARM_THRESHOLD) return 'right'
  return 'center'
}

function cameraErrorMessage(err: unknown): { status: GazeStatus; message: string } {
  const name = err instanceof DOMException ? err.name : ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return {
      status: 'denied',
      message: 'Camera blocked — lock icon → allow, then tap retry',
    }
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return { status: 'error', message: 'No camera found' }
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      status: 'error',
      message: 'Camera in use elsewhere — close Zoom/FaceTime, tap retry',
    }
  }
  if (name === 'SecurityError') {
    return {
      status: 'error',
      message: 'Use http://localhost:3000 (not 127.0.0.1 file://)',
    }
  }
  return { status: 'error', message: 'Camera unavailable — tap to retry' }
}

export function useFaceGaze({
  enabled,
  restartKey = 0,
  onLookLeft,
  onLookRight,
}: {
  enabled: boolean
  /** Bump to force a fresh getUserMedia after deny/error */
  restartKey?: number
  onLookLeft: () => void
  onLookRight: () => void
}) {
  const [state, setState] = useState<GazeState>(INITIAL)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef(0)
  const lastVideoTime = useRef(-1)
  const smoothScore = useRef(0)
  const armedSide = useRef<GazeSide>('center')
  const dwellSide = useRef<GazeSide>('center')
  const dwellStarted = useRef(0)
  const lastFireAt = useRef(0)
  const leftCb = useRef(onLookLeft)
  const rightCb = useRef(onLookRight)
  leftCb.current = onLookLeft
  rightCb.current = onLookRight

  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }
    landmarkerRef.current?.close()
    landmarkerRef.current = null
    smoothScore.current = 0
    armedSide.current = 'center'
    dwellSide.current = 'center'
    dwellStarted.current = 0
    lastVideoTime.current = -1
  }, [])

  const stop = useCallback(() => {
    teardown()
    setState(INITIAL)
  }, [teardown])

  useEffect(() => {
    if (!enabled) {
      stop()
      return
    }

    let cancelled = false

    const boot = async () => {
      teardown()
      setState({
        status: 'requesting',
        side: 'center',
        dwell: 0,
        score: 0,
        message: 'Allow camera for look scroll',
      })

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new DOMException('getUserMedia missing', 'SecurityError')
        }

        // Small delay so React Strict Mode remount doesn't kill the prompt mid-flight.
        await new Promise((r) => setTimeout(r, 120))
        if (cancelled) return

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream

        const video = document.createElement('video')
        video.playsInline = true
        video.muted = true
        video.srcObject = stream
        videoRef.current = video
        await video.play()
        if (cancelled) return

        const fileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm',
        )
        if (cancelled) return

        let landmarker: FaceLandmarker
        try {
          landmarker = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
          })
        } catch {
          landmarker = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
          })
        }
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker

        setState((s) => ({
          ...s,
          status: 'tracking',
          message: 'Look at ‹ or › to scroll',
        }))

        const loop = () => {
          if (cancelled) return
          const v = videoRef.current
          const lm = landmarkerRef.current
          if (!v || !lm || v.readyState < 2) {
            rafRef.current = requestAnimationFrame(loop)
            return
          }

          if (v.currentTime !== lastVideoTime.current) {
            lastVideoTime.current = v.currentTime
            let result: FaceLandmarkerResult
            try {
              result = lm.detectForVideo(v, performance.now())
            } catch {
              rafRef.current = requestAnimationFrame(loop)
              return
            }

            const face = result.faceLandmarks[0]
            const now = performance.now()
            if (!face) {
              armedSide.current = 'center'
              dwellSide.current = 'center'
              dwellStarted.current = 0
              setState((s) => ({
                ...s,
                side: 'center',
                dwell: 0,
                score: smoothScore.current,
                message: 'Face the camera',
              }))
            } else {
              const raw = lookScoreFromLandmarks(face)
              smoothScore.current =
                smoothScore.current * (1 - GAZE.SMOOTH) + raw * GAZE.SMOOTH
              const side = sideFromScore(
                smoothScore.current,
                armedSide.current,
              )
              armedSide.current = side

              if (side === 'center') {
                dwellSide.current = 'center'
                dwellStarted.current = 0
                setState((s) => ({
                  ...s,
                  side: 'center',
                  dwell: 0,
                  score: smoothScore.current,
                  message: `Face center · tip head L/R (${smoothScore.current.toFixed(2)})`,
                }))
              } else {
                if (dwellSide.current !== side) {
                  dwellSide.current = side
                  dwellStarted.current = now
                }
                const held = now - dwellStarted.current
                const dwell = Math.min(1, held / GAZE.DWELL_MS)
                const cooled = now - lastFireAt.current >= GAZE.COOLDOWN_MS

                if (dwell >= 1 && cooled) {
                  lastFireAt.current = now
                  dwellStarted.current = now
                  if (side === 'left') leftCb.current()
                  else rightCb.current()
                }

                setState((s) => ({
                  ...s,
                  side,
                  dwell,
                  score: smoothScore.current,
                  message:
                    side === 'left'
                      ? `Looking left ${(dwell * 100).toFixed(0)}%`
                      : `Looking right ${(dwell * 100).toFixed(0)}%`,
                }))
              }
            }
          }

          rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)
      } catch (err) {
        if (cancelled) return
        const mapped = cameraErrorMessage(err)
        setState({
          status: mapped.status,
          side: 'center',
          dwell: 0,
          score: 0,
          message: mapped.message,
        })
      }
    }

    void boot()

    return () => {
      cancelled = true
      teardown()
    }
  }, [enabled, restartKey, stop, teardown])

  return state
}
