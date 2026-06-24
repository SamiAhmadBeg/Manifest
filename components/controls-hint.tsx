'use client'

import { motion } from 'framer-motion'
import { BCI_LABELS } from '@/lib/bci-controls'

type Control = { keys: string; label: string }

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid min-w-7 place-items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-foreground/90 shadow-sm">
      {children}
    </kbd>
  )
}

export type ControlsMode =
  | 'home'
  | 'app'
  | 'movies-library'
  | 'movies-player'
  | 'movies-naming'
  | 'snake'
  | 'smart-room'

function controlsForMode(mode: ControlsMode): Control[] {
  switch (mode) {
    case 'home':
      return [
        { keys: BCI_LABELS.scrollLeft.keys, label: 'Previous' },
        { keys: BCI_LABELS.scrollRight.keys, label: 'Next' },
        { keys: BCI_LABELS.jawClench.keys, label: 'Open' },
        { keys: 'X', label: 'Exit' },
      ]
    case 'movies-library':
      return [
        { keys: '←', label: 'Previous' },
        { keys: '→', label: 'Next' },
        { keys: '↵', label: 'Play' },
        { keys: 'Delete', label: 'Remove' },
        { keys: 'Esc', label: 'Close' },
      ]
    case 'movies-player':
      return [
        { keys: '↵', label: 'Pause' },
        { keys: 'Esc', label: 'Library' },
      ]
    case 'movies-naming':
      return [
        { keys: BCI_LABELS.jawClench.keys, label: 'Save' },
        { keys: BCI_LABELS.exit.keys, label: 'Cancel' },
      ]
    case 'snake':
      return [
        { keys: '↵', label: 'Turn left' },
        { keys: 'Esc', label: 'Exit' },
      ]
    case 'smart-room':
      return [
        { keys: '←', label: 'Prev' },
        { keys: '→', label: 'Next' },
        { keys: '↵', label: 'Select' },
        { keys: '↑', label: 'Exit' },
      ]
    case 'app':
    default:
      return [
        { keys: BCI_LABELS.exit.keys, label: 'Close' },
        { keys: 'X', label: 'Exit' },
      ]
  }
}

export function ControlsHint({ mode }: { mode: ControlsMode }) {
  const controls = controlsForMode(mode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 18 }}
      className="pointer-events-none absolute inset-x-0 bottom-7 z-50 flex justify-center"
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
