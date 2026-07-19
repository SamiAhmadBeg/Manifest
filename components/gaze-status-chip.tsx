'use client'

import { Camera, CameraOff } from 'lucide-react'

export function GazeStatusChip({
  status,
  message,
  onToggle,
  enabled,
}: {
  status: 'off' | 'requesting' | 'tracking' | 'denied' | 'error'
  message: string
  enabled: boolean
  onToggle: () => void
}) {
  const live = status === 'tracking'
  const busy = status === 'requesting'

  return (
    <button
      type="button"
      onClick={onToggle}
      title={message}
      className={`pointer-events-auto flex max-w-[260px] items-center gap-2 rounded-full border px-3 py-1.5 text-left shadow-sm transition-colors ${
        live
          ? 'border-emerald-400/40 bg-emerald-50/80'
          : status === 'denied' || status === 'error'
            ? 'border-primary/30 bg-primary/5'
            : 'border-border bg-card hover:bg-secondary/80'
      }`}
    >
      <span className="relative flex size-2 shrink-0">
        {live && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${
            live
              ? 'bg-emerald-500'
              : busy
                ? 'bg-amber-400'
                : 'bg-muted-foreground/50'
          }`}
        />
      </span>
      {enabled && status !== 'denied' ? (
        <Camera className={`size-3.5 shrink-0 ${live ? 'text-emerald-600' : 'text-muted-foreground'}`} />
      ) : (
        <CameraOff className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate text-xs font-medium tracking-wide">
        {busy
          ? 'Allow camera…'
          : live
            ? message
            : status === 'denied' || status === 'error'
              ? 'Tap to retry cam'
              : enabled
                ? 'Gaze issue'
                : 'Look scroll'}
      </span>
    </button>
  )
}
