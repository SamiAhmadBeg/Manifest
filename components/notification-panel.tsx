'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Waves } from 'lucide-react'

export type NotificationItem = {
  id: number
  text: string
}

export function NotificationPanel({ item }: { item: NotificationItem }) {
  return (
    <div className="pointer-events-none absolute bottom-7 right-6 z-30 sm:right-10">
      <p className="mb-2 pl-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Recent Action
      </p>
      <div className="relative h-[58px] w-60 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="absolute inset-0 flex items-center gap-3 px-4"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Waves className="size-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold tracking-tight">
                {item.text}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Neural input · just now
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
