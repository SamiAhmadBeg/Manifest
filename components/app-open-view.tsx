'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ManifestApp } from '@/lib/apps'

export function AppOpenView({
  app,
  onClose,
}: {
  app: ManifestApp | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {app && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* dim + blur backdrop */}
          <motion.button
            type="button"
            aria-label="Close app"
            onClick={onClose}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
          />

          {/* app surface ~80% of screen */}
          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, opacity: 0, y: 20, filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="relative flex h-[80%] w-[88%] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl"
          >
            {/* window bar */}
            <div className="relative flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
                  <app.icon className="size-5" strokeWidth={1.6} />
                </div>
                <span className="text-sm font-medium tracking-tight text-muted-foreground">
                  Manifest
                </span>
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

            {/* placeholder content */}
            <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 20 }}
                className="relative grid size-24 place-items-center overflow-hidden rounded-[1.7rem] border border-white/10 text-white shadow-xl"
                style={{
                  background: `linear-gradient(150deg, ${app.c1}, ${app.c2})`,
                }}
              >
                <span className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[radial-gradient(120%_70%_at_50%_-10%,rgba(255,255,255,0.4),transparent_55%)]" />
                <app.icon className="relative size-12" strokeWidth={1.5} />
              </motion.div>
              <div>
                <h2 className="font-sans text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {app.name}
                </h2>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  App Prototype
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
