'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ManifestApp } from '@/lib/apps'
import {
  MoviesApp,
  type MoviesAppHandle,
} from '@/components/apps/movies/movies-app'
import { SnakeApp, type SnakeAppHandle } from '@/components/apps/snake/snake-app'
import {
  SmartRoomApp,
  type SmartRoomAppHandle,
} from '@/components/apps/smart-room/smart-room-app'
import {
  AssistantApp,
  type AssistantAppHandle,
} from '@/components/apps/assistant/assistant-app'
import {
  BiosignalLabApp,
  type BiosignalLabAppHandle,
} from '@/components/apps/biosignal-lab/biosignal-lab-app'
import type { MoviesView } from '@/lib/movies/types'

export function AppOpenView({
  app,
  onClose,
  onNotify,
  moviesRef,
  snakeRef,
  smartRoomRef,
  assistantRef,
  biosignalLabRef,
  onMoviesViewChange,
  moviesView,
}: {
  app: ManifestApp | null
  onClose: () => void
  onNotify: (text: string) => void
  moviesRef: React.RefObject<MoviesAppHandle | null>
  snakeRef: React.RefObject<SnakeAppHandle | null>
  smartRoomRef: React.RefObject<SmartRoomAppHandle | null>
  assistantRef: React.RefObject<AssistantAppHandle | null>
  biosignalLabRef: React.RefObject<BiosignalLabAppHandle | null>
  onMoviesViewChange: (view: MoviesView | null) => void
  moviesView: MoviesView | null
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
          <motion.button
            type="button"
            aria-label="Close app"
            onClick={() => {
              if (
                app.id === 'movies' &&
                (moviesView === 'player' || moviesView === 'naming')
              )
                return
              onClose()
            }}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, opacity: 0, y: 20, filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="relative flex h-[80%] w-[88%] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-2xl shadow-foreground/5"
          >
            {app.id === 'movies' ? (
              <MoviesApp
                ref={moviesRef}
                onClose={onClose}
                onNotify={onNotify}
                onViewChange={onMoviesViewChange}
              />
            ) : app.id === 'snake' ? (
              <SnakeApp ref={snakeRef} onClose={onClose} onNotify={onNotify} />
            ) : app.id === 'smartroom' ? (
              <SmartRoomApp
                ref={smartRoomRef}
                onClose={onClose}
                onNotify={onNotify}
              />
            ) : app.id === 'assistant' ? (
              <AssistantApp
                ref={assistantRef}
                onClose={onClose}
                onNotify={onNotify}
              />
            ) : app.id === 'biosignal-lab' ? (
              <BiosignalLabApp
                ref={biosignalLabRef}
                onClose={onClose}
                onNotify={onNotify}
              />
            ) : (
              <GenericAppContent app={app} onClose={onClose} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function GenericAppContent({
  app,
  onClose,
}: {
  app: ManifestApp
  onClose: () => void
}) {
  return (
    <>
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

      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 20 }}
          className="relative grid size-24 place-items-center overflow-hidden rounded-[1.7rem] border border-border bg-primary text-primary-foreground shadow-xl shadow-primary/25"
        >
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
    </>
  )
}
