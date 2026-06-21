'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import type { MovieItem } from '@/lib/movies/types'

export function MoviePlayer({
  movie,
  isPaused,
  onTogglePause,
  onBackToLibrary,
}: {
  movie: MovieItem
  isPaused: boolean
  onTogglePause: () => void
  onBackToLibrary: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isPaused) video.pause()
    else video.play().catch(() => {})
  }, [isPaused])

  return (
    <div className="relative flex h-full flex-col bg-foreground/95">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          src={movie.objectUrl}
          className="h-full w-full object-contain"
          playsInline
          onClick={onTogglePause}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/20"
          initial={false}
          animate={{ opacity: isPaused ? 1 : 0 }}
        >
          <div className="grid size-20 place-items-center rounded-full border border-primary-foreground/20 bg-foreground/40 text-primary-foreground backdrop-blur-sm">
            {isPaused ? (
              <Play className="size-10 fill-current" />
            ) : (
              <Pause className="size-10 fill-current" />
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between border-t border-primary-foreground/10 px-6 py-4 text-primary-foreground">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{movie.name}</p>
          <p className="text-[11px] text-primary-foreground/60">
            ↵ pause · Esc back to library
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToLibrary}
            className="rounded-full border border-primary-foreground/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary-foreground/10"
          >
            Library
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm"
          >
            {isPaused ? (
              <Play className="size-4 fill-current" />
            ) : (
              <Pause className="size-4 fill-current" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
