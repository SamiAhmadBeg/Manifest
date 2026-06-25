'use client'

import { motion } from 'framer-motion'
import type { VoiceListenPhase } from '@/hooks/use-voice-session'

const BAR_COUNT = 5

export function VoiceIndicator({
  listenPhase,
  silenceMsLeft,
  transcript,
  audioLevel,
  micEnabled,
  micWarning,
}: {
  listenPhase: VoiceListenPhase | null
  silenceMsLeft: number
  transcript: string
  audioLevel: number
  micEnabled: boolean
  micWarning?: string
}) {
  const isActive = listenPhase !== null
  const isHearing = listenPhase === 'hearing' || listenPhase === 'silence'
  const isSilence = listenPhase === 'silence'
  const silenceProgress = isSilence
    ? Math.min(100, ((3000 - silenceMsLeft) / 3000) * 100)
    : 0

  const levelBoost = Math.min(1, audioLevel * 12)
  const isLoud = audioLevel > 0.008

  const statusLabel = !micEnabled
    ? 'Requesting microphone…'
    : listenPhase === 'armed'
      ? 'Mic live — start speaking'
      : listenPhase === 'hearing' || isLoud
        ? 'Hearing you…'
        : listenPhase === 'silence'
          ? 'Finishing…'
          : 'Ready'

  const statusColor =
    isLoud || listenPhase === 'hearing'
      ? 'text-primary'
      : isActive
        ? 'text-amber-600'
        : 'text-muted-foreground'

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div
        className={`flex items-center justify-center gap-2 rounded-full border px-5 py-2 ${
          isLoud || isHearing
            ? 'border-primary/30 bg-primary/5 shadow-sm shadow-primary/10'
            : isActive
              ? 'border-amber-400/40 bg-amber-50/80'
              : 'border-border bg-secondary/60'
        }`}
      >
        {micEnabled && (
          <span className="relative flex size-2">
            {(isLoud || isHearing) && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            )}
            <span
              className={`relative inline-flex size-2 rounded-full ${
                isLoud || isHearing ? 'bg-primary' : 'bg-emerald-500'
              }`}
            />
          </span>
        )}
        <span className={`text-xs font-semibold tracking-wide ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <motion.div
        className={`relative grid size-32 place-items-center rounded-full border-2 bg-card shadow-md ${
          isLoud || isHearing
            ? 'border-primary shadow-primary/15'
            : micEnabled
              ? 'border-emerald-400/60 shadow-emerald-500/5'
              : 'border-border/80'
        }`}
        animate={
          isLoud || isHearing
            ? {
                boxShadow: [
                  '0 0 0 0 oklch(0.58 0.21 27 / 0.35)',
                  '0 0 0 20px oklch(0.58 0.21 27 / 0)',
                ],
              }
            : { boxShadow: '0 0 0 0 transparent' }
        }
        transition={
          isLoud || isHearing
            ? { duration: 1.2, repeat: Infinity, ease: 'easeOut' }
            : { duration: 0.3 }
        }
      >
        <div className="flex h-14 items-end justify-center gap-1.5">
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const barLevel = Math.min(
              1,
              levelBoost * (0.7 + ((i + 1) / BAR_COUNT) * 0.5),
            )
            const height = 10 + barLevel * 40
            return (
              <span
                key={i}
                className={`w-2 rounded-full transition-all duration-75 ${
                  isLoud || isHearing ? 'bg-primary' : 'bg-amber-400/80'
                }`}
                style={{ height: `${height}px` }}
              />
            )
          })}
        </div>
      </motion.div>

      {micEnabled && (
        <p className="text-center text-[11px] tracking-wide text-muted-foreground">
          Mic level · {Math.round(levelBoost * 100)}%
        </p>
      )}

      {micWarning && (
        <p className="max-w-sm text-center text-xs font-medium leading-relaxed text-amber-700">
          {micWarning}
        </p>
      )}

      {isSilence && (
        <div className="w-full">
          <div className="mb-2 flex justify-center gap-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>Send when bar fills</span>
            <span className="text-primary">{Math.ceil(silenceMsLeft / 1000)}s</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-75"
              style={{ width: `${silenceProgress}%` }}
            />
          </div>
        </div>
      )}

      <div
        className={`w-full rounded-[1.5rem] border px-6 py-5 text-center transition-colors ${
          isLoud || isHearing
            ? 'border-primary/30 bg-primary/[0.04] shadow-sm shadow-primary/5'
            : micEnabled
              ? 'border-emerald-400/25 bg-emerald-50/50'
              : 'border-border/80 bg-secondary/25'
        }`}
      >
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Live transcript
        </p>
        {transcript ? (
          <p className="text-sm font-medium leading-relaxed text-foreground/90">
            {transcript}
            {(isLoud || listenPhase === 'hearing') && (
              <span className="animate-pulse text-primary">|</span>
            )}
          </p>
        ) : (
          <p className="text-sm italic leading-relaxed text-muted-foreground">
            {micEnabled
              ? 'Speak — bars should move with your voice'
              : 'Allow microphone when prompted…'}
          </p>
        )}
      </div>
    </div>
  )
}
