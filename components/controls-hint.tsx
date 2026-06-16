'use client'

import { motion } from 'framer-motion'

type Control = { keys: string; label: string }

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid min-w-7 place-items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-foreground/90 shadow-sm">
      {children}
    </kbd>
  )
}

export function ControlsHint({ isOpen }: { isOpen: boolean }) {
  const controls: Control[] = isOpen
    ? [
        { keys: 'X', label: 'Exit' },
        { keys: 'Esc', label: 'Close' },
      ]
    : [
        { keys: '←', label: 'Previous' },
        { keys: '→', label: 'Next' },
        { keys: '↵', label: 'Open' },
        { keys: 'X', label: 'Exit' },
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 18 }}
      className="pointer-events-none absolute inset-x-0 bottom-7 z-30 flex justify-center"
    >
      <div className="flex items-center gap-5 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm sm:gap-6">
        {controls.map((c) => (
          <div key={c.label} className="flex items-center gap-2">
            <KeyCap>{c.keys}</KeyCap>
            <span className="text-xs font-medium text-muted-foreground">
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
