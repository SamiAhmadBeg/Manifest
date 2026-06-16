'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function TopBar() {
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
      {/* Account */}
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

      {/* Time + status */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 18 }}
        className="pointer-events-auto flex items-center gap-4"
      >
        <span className="font-mono text-lg font-medium tabular-nums tracking-tight">
          {time}
        </span>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <Activity className="size-3.5 text-primary" />
          <span className="text-xs font-medium tracking-wide">Emotiv not connected</span>
        </div>
      </motion.div>
    </header>
  )
}
