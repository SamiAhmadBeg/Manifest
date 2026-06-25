'use client'

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Film } from 'lucide-react'

export type AddMovieDialogHandle = {
  submit: () => void
}

export function defaultNameFromFile(file: File) {
  return file.name.replace(/\.mp4$/i, '')
}

export const AddMovieDialog = forwardRef<
  AddMovieDialogHandle,
  {
    defaultName: string
    fileLabel: string
    queueRemaining: number
    onConfirm: (name: string) => void
    onCancel: () => void
  }
>(function AddMovieDialog(
  { defaultName, fileLabel, queueRemaining, onConfirm, onCancel },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    const value = inputRef.current?.value.trim()
    onConfirm(value || defaultName)
  }

  useImperativeHandle(ref, () => ({ submit }), [defaultName, onConfirm])

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [defaultName, fileLabel])

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-2xl"
      >
        <div className="border-b border-border/80 px-6 py-6 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
            <Film className="size-5" strokeWidth={1.6} />
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Add to Library
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight">
            Name your movie
          </h3>
        </div>

        <form
          className="space-y-5 px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div className="text-center">
            <label
              htmlFor="movie-name"
              className="mb-3 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground"
            >
              Movie name
            </label>
            <input
              ref={inputRef}
              id="movie-name"
              type="text"
              defaultValue={defaultName}
              placeholder="Enter a name…"
              autoComplete="off"
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full rounded-2xl border border-border/80 bg-secondary/40 px-5 py-3.5 text-center text-sm font-medium outline-none ring-primary transition-all placeholder:text-muted-foreground/60 focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-3 truncate text-[11px] text-muted-foreground">
              {fileLabel}
            </p>
          </div>

          {queueRemaining > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              +{queueRemaining} more file{queueRemaining === 1 ? '' : 's'} to name
            </p>
          )}

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-border bg-secondary px-5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-opacity hover:opacity-90"
            >
              Add to Library
            </button>
          </div>

          <p className="text-center text-[11px] tracking-wide text-muted-foreground">
            ↵ save · Esc cancel
          </p>
        </form>
      </motion.div>
    </motion.div>
  )
})
