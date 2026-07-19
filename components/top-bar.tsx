'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function TopBar({
  emotivLive = false,
  emotivMessage,
  trailing,
}: {
  emotivLive?: boolean
  emotivMessage?: string
  trailing?: ReactNode
}) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    update()
    const id = setInterval(update, 1000 * 15)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 18 }}
        className="pointer-events-auto flex items-center gap-3"
      >
        <div className="relative grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25">
          <span className="relative z-10">S</span>
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Welcome
          </p>
          <p className="text-base font-semibold tracking-tight">Sami</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 18 }}
        className="pointer-events-auto flex items-center gap-3"
      >
        {trailing}
        <span className="font-mono text-lg font-medium tabular-nums tracking-tight">
          {time}
        </span>
        <div
          className={`flex max-w-[220px] items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-sm ${
            emotivLive
              ? 'border-emerald-400/40 bg-emerald-50/80'
              : 'border-border bg-card'
          }`}
          title={emotivMessage}
        >
          <span className="relative flex size-2 shrink-0">
            {emotivLive && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            )}
            <span
              className={`relative inline-flex size-2 rounded-full ${
                emotivLive ? 'bg-emerald-500' : 'bg-primary'
              }`}
            />
          </span>
          <Activity
            className={`size-3.5 shrink-0 ${emotivLive ? 'text-emerald-600' : 'text-primary'}`}
          />
          <span className="truncate text-xs font-medium tracking-wide">
            {emotivLive ? 'Emotiv connected' : 'Emotiv not connected'}
          </span>
        </div>
      </motion.div>
    </header>
  )
}
