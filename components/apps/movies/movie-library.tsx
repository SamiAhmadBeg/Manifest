'use client'

import { motion } from 'framer-motion'
import { Film, Plus, Trash2, Upload } from 'lucide-react'
import type { MovieItem } from '@/lib/movies/types'

const TILE = 180
const SPACING = 208

function MovieThumbnail({ movie }: { movie: MovieItem }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-secondary">
      <video
        src={movie.objectUrl}
        className="h-full w-full object-cover"
        muted
        preload="metadata"
        onLoadedData={(e) => {
          const el = e.currentTarget
          el.currentTime = Math.min(2, el.duration * 0.1)
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
      <Film className="absolute right-2.5 top-2.5 size-4 text-primary-foreground/90 drop-shadow" />
    </div>
  )
}

function LibraryTile({
  label,
  sublabel,
  isActive,
  offset,
  onSelect,
  children,
}: {
  label: string
  sublabel?: string
  isActive: boolean
  offset: number
  onSelect: () => void
  children: React.ReactNode
}) {
  const abs = Math.abs(offset)

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-label={label}
      className="absolute left-1/2 top-1/2 origin-center cursor-pointer outline-none"
      style={{ zIndex: 50 - abs }}
      initial={false}
      animate={{
        x: offset * SPACING - TILE / 2,
        y: '-50%',
        scale: isActive ? 1 : Math.max(0.68, 0.84 - abs * 0.06),
        opacity: abs > 3 ? 0 : Math.max(0.35, 1 - abs * 0.2),
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[1.5rem] bg-card"
        style={{ height: TILE * 1.35, width: TILE }}
        animate={{
          boxShadow: isActive
            ? '0 24px 48px -20px oklch(0.58 0.21 27 / 0.4), 0 8px 20px -10px rgba(0,0,0,0.15)'
            : '0 10px 24px -16px rgba(0,0,0,0.2)',
        }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-inset"
          animate={{
            boxShadow: isActive
              ? '0 0 0 3px oklch(0.58 0.21 27)'
              : '0 0 0 1px oklch(0.22 0.01 255 / 0.08)',
          }}
        />
        {children}
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-full mt-4 text-center"
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
      >
        <p className="truncate px-2 text-base font-semibold tracking-tight">
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
        )}
      </motion.div>
    </motion.div>
  )
}

export function MovieLibrary({
  movies,
  activeIndex,
  isDragging,
  onSelectIndex,
  onOpenItem,
  onAddClick,
  onDropFiles,
  onDragState,
  onDeleteFocused,
}: {
  movies: MovieItem[]
  activeIndex: number
  isDragging: boolean
  onSelectIndex: (i: number) => void
  onOpenItem: (index: number) => void
  onAddClick: () => void
  onDropFiles: (files: FileList) => void
  onDragState: (dragging: boolean) => void
  onDeleteFocused: () => void
}) {
  const totalItems = movies.length + 1

  return (
    <div
      className="relative flex h-full flex-col"
      onDragEnter={(e) => {
        e.preventDefault()
        onDragState(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) onDragState(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDragState(false)
        if (e.dataTransfer.files.length) onDropFiles(e.dataTransfer.files)
      }}
    >
      {/* Drop overlay */}
      <motion.div
        className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-primary bg-primary/5"
        initial={false}
        animate={{ opacity: isDragging ? 1 : 0 }}
      >
        <div className="flex flex-col items-center gap-2 text-primary">
          <Upload className="size-8" />
          <p className="text-sm font-medium">Drop MP4 files here</p>
        </div>
      </motion.div>

      <div className="border-b border-border/80 px-6 py-5 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Your Library
        </p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight">
          {movies.length === 0
            ? 'Add movies to get started'
            : `${movies.length} movie${movies.length === 1 ? '' : 's'}`}
        </h3>
      </div>

      <div className="relative flex-1">
        {totalItems === 1 && !isDragging ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Film className="size-8" />
            </div>
            <div>
              <p className="font-medium">No movies yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Press ↵ on Add Movie, or drag MP4 files from Finder
              </p>
            </div>
            <button
              type="button"
              onClick={onAddClick}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              Add Movie
            </button>
          </div>
        ) : (
          <div className="relative h-full min-h-[280px]">
            {/* Add tile at index 0 */}
            <LibraryTile
              label="Add Movie"
              sublabel="MP4 from Finder"
              isActive={activeIndex === 0}
              offset={0 - activeIndex}
              onSelect={() =>
                activeIndex === 0 ? onAddClick() : onSelectIndex(0)
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-secondary/60">
                <div className="grid size-14 place-items-center rounded-2xl border border-dashed border-primary/40 bg-card text-primary shadow-sm">
                  <Plus className="size-7" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Jaw clench to add
                </span>
              </div>
            </LibraryTile>

            {movies.map((movie, i) => {
              const index = i + 1
              const isActive = activeIndex === index
              return (
                <LibraryTile
                  key={movie.id}
                  label={movie.name}
                  sublabel="MP4"
                  isActive={isActive}
                  offset={index - activeIndex}
                  onSelect={() =>
                    isActive ? onOpenItem(index) : onSelectIndex(index)
                  }
                >
                  <MovieThumbnail movie={movie} />
                  {isActive && (
                    <button
                      type="button"
                      aria-label={`Delete ${movie.name}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteFocused()
                      }}
                      className="absolute right-2.5 top-2.5 z-10 grid size-8 place-items-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-sm transition-colors hover:border-destructive hover:bg-destructive hover:text-primary-foreground"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </LibraryTile>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function getLibraryItemCount(movieCount: number) {
  return movieCount + 1
}
