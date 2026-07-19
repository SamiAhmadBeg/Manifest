'use client'

import { motion } from 'framer-motion'

export function SignalMeter({
  label,
  value,
  active,
  threshold,
  accent = 'primary',
}: {
  label: string
  value: number
  active?: boolean
  /** Fire line 0–1 (shown as %) */
  threshold?: number
  accent?: 'primary' | 'violet'
}) {
  const pct = Math.round(Math.min(1, value) * 100)
  const thrPct =
    threshold != null ? Math.round(Math.min(1, Math.max(0, threshold)) * 100) : null
  const over = threshold != null ? value >= threshold : !!active
  const barColor =
    accent === 'violet'
      ? over
        ? 'bg-violet-500'
        : 'bg-violet-500/50'
      : over
        ? 'bg-primary'
        : 'bg-primary/60'

  return (
    <div className="w-full text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {pct}%
          {thrPct != null ? ` / ${thrPct}%` : ''}
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
        {thrPct != null && (
          <div
            className="absolute inset-y-0 z-10 w-px bg-foreground/35"
            style={{ left: `${thrPct}%` }}
            title={`Fire ≥ ${thrPct}%`}
          />
        )}
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.08 }}
        />
      </div>
    </div>
  )
}
