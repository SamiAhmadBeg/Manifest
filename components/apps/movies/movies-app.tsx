'use client'

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react'
import { Film, X } from 'lucide-react'
import { isDeleteKey, keyToSignal } from '@/lib/bci-controls'
import type { MoviesView } from '@/lib/movies/types'
import { useMovies } from '@/hooks/use-movies'
import {
  MovieLibrary,
  getLibraryItemCount,
} from '@/components/apps/movies/movie-library'
import { MoviePlayer } from '@/components/apps/movies/movie-player'
import {
  AddMovieDialog,
  defaultNameFromFile,
  type AddMovieDialogHandle,
} from '@/components/apps/movies/add-movie-dialog'

function isMp4(file: File) {
  return file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4')
}

type NamingQueue = {
  file: File
  defaultName: string
  remaining: File[]
}

export type MoviesAppHandle = {
  handleKey: (key: string) => boolean
}

export type MoviesAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
  onViewChange?: (view: MoviesView) => void
}

export const MoviesApp = forwardRef<MoviesAppHandle, MoviesAppProps>(
  function MoviesApp({ onClose, onNotify, onViewChange }, ref) {
    const { movies, addMovie, removeMovie, isReady } = useMovies()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const namingDialogRef = useRef<AddMovieDialogHandle>(null)

    const [view, setView] = useState<MoviesView>('library')
    const [libraryIndex, setLibraryIndex] = useState(0)
    const [playingMovieId, setPlayingMovieId] = useState<string | null>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [naming, setNaming] = useState<NamingQueue | null>(null)

    const itemCount = getLibraryItemCount(movies.length)
    const playingMovie = movies.find((m) => m.id === playingMovieId) ?? null
    const activeView: MoviesView = naming ? 'naming' : view

    const openFilePicker = useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    const startNamingQueue = useCallback(
      (files: FileList | File[]) => {
        const incoming = Array.from(files).filter(isMp4)
        if (incoming.length === 0) {
          onNotify('No MP4 files found')
          return
        }
        const [first, ...rest] = incoming
        setNaming({
          file: first,
          defaultName: defaultNameFromFile(first),
          remaining: rest,
        })
        onNotify('Name your movie')
      },
      [onNotify],
    )

    const confirmName = useCallback(
      async (name: string) => {
        if (!naming) return

        const item = await addMovie(naming.file, name)
        onNotify(`Added ${item.name}`)

        if (naming.remaining.length > 0) {
          const [next, ...rest] = naming.remaining
          setNaming({
            file: next,
            defaultName: defaultNameFromFile(next),
            remaining: rest,
          })
          return
        }

        setNaming(null)
        setLibraryIndex(movies.length + 1)
      },
      [naming, addMovie, movies.length, onNotify],
    )

    const cancelNaming = useCallback(() => {
      if (!naming) return

      if (naming.remaining.length > 0) {
        const [next, ...rest] = naming.remaining
        setNaming({
          file: next,
          defaultName: defaultNameFromFile(next),
          remaining: rest,
        })
        onNotify('Skipped')
        return
      }

      setNaming(null)
      onNotify('Cancelled')
    }, [naming, onNotify])

    const deleteFocusedMovie = useCallback(async () => {
      if (libraryIndex === 0) return
      const movie = movies[libraryIndex - 1]
      if (!movie) return

      await removeMovie(movie.id)
      onNotify(`Deleted ${movie.name}`)
      setLibraryIndex((i) => Math.min(i, Math.max(0, movies.length - 1)))
    }, [libraryIndex, movies, removeMovie, onNotify])

    const playMovieAt = useCallback(
      (index: number) => {
        if (naming) return
        if (index === 0) {
          openFilePicker()
          onNotify('Add Movie')
          return
        }
        const movie = movies[index - 1]
        if (!movie) return
        setPlayingMovieId(movie.id)
        setIsPaused(false)
        setView('player')
        onNotify(`Playing ${movie.name}`)
      },
      [movies, naming, openFilePicker, onNotify],
    )

    const exitToLibrary = useCallback(() => {
      if (playingMovieId) {
        const movieIndex = movies.findIndex((m) => m.id === playingMovieId)
        if (movieIndex >= 0) setLibraryIndex(movieIndex + 1)
      }
      setView('library')
      setPlayingMovieId(null)
      setIsPaused(false)
      onNotify('Back to Library')
    }, [playingMovieId, movies, onNotify])

    const exitApp = useCallback(() => {
      setNaming(null)
      setView('library')
      setPlayingMovieId(null)
      setIsPaused(false)
      onClose()
      onNotify('Exited Movies')
    }, [onClose, onNotify])

    const togglePause = useCallback(() => {
      setIsPaused((p) => !p)
      onNotify(isPaused ? 'Play' : 'Pause')
    }, [isPaused, onNotify])

    const handleChromeExit = useCallback(() => {
      if (naming) {
        cancelNaming()
        return
      }
      if (view === 'player') exitToLibrary()
      else exitApp()
    }, [naming, view, cancelNaming, exitToLibrary, exitApp])

    const handleKey = useCallback(
      (key: string): boolean => {
        if (naming) {
          const signal = keyToSignal(key)
          if (signal === 'jaw-clench') {
            namingDialogRef.current?.submit()
            return true
          }
          if (signal === 'exit') {
            cancelNaming()
            return true
          }
          // Let all other keys through so the name input is editable
          return false
        }

        if (view === 'player') {
          const signal = keyToSignal(key)
          if (signal === 'exit') {
            exitToLibrary()
            return true
          }
          if (signal === 'jaw-clench') {
            togglePause()
            return true
          }
          return false
        }

        // Library — ← → scroll · ↵ play · Delete remove · Esc leave app
        if (isDeleteKey(key) && libraryIndex > 0) {
          deleteFocusedMovie()
          return true
        }

        const signal = keyToSignal(key)
        if (!signal) return false

        switch (signal) {
          case 'scroll-left': {
            const next = Math.max(0, libraryIndex - 1)
            if (next !== libraryIndex) {
              setLibraryIndex(next)
              onNotify('Scrolled Left')
            }
            return true
          }
          case 'scroll-right': {
            const next = Math.min(itemCount - 1, libraryIndex + 1)
            if (next !== libraryIndex) {
              setLibraryIndex(next)
              onNotify('Scrolled Right')
            }
            return true
          }
          case 'jaw-clench':
            playMovieAt(libraryIndex)
            return true
          case 'exit':
            exitApp()
            return true
          default:
            return false
        }
      },
      [
        naming,
        view,
        itemCount,
        libraryIndex,
        playMovieAt,
        exitToLibrary,
        exitApp,
        cancelNaming,
        deleteFocusedMovie,
        togglePause,
        onNotify,
      ],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    useEffect(() => {
      onViewChange?.(activeView)
    }, [activeView, onViewChange])

    useEffect(() => {
      setLibraryIndex((i) => Math.min(i, Math.max(0, itemCount - 1)))
    }, [itemCount])

    return (
      <>
        <MoviesAppChrome view={activeView} onExit={handleChromeExit} />

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,.mp4"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) startNamingQueue(e.target.files)
            e.target.value = ''
          }}
        />

        <div className="relative min-h-0 flex-1">
          {!isReady ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading library…
            </div>
          ) : view === 'library' ? (
            <MovieLibrary
              movies={movies}
              activeIndex={libraryIndex}
              isDragging={isDragging && !naming}
              onSelectIndex={setLibraryIndex}
              onOpenItem={playMovieAt}
              onAddClick={openFilePicker}
              onDropFiles={startNamingQueue}
              onDragState={setIsDragging}
              onDeleteFocused={deleteFocusedMovie}
            />
          ) : playingMovie ? (
            <MoviePlayer
              movie={playingMovie}
              isPaused={isPaused}
              onTogglePause={togglePause}
              onBackToLibrary={exitToLibrary}
            />
          ) : null}

          {naming && (
            <AddMovieDialog
              ref={namingDialogRef}
              key={naming.file.name + naming.file.size}
              defaultName={naming.defaultName}
              fileLabel={naming.file.name}
              queueRemaining={naming.remaining.length}
              onConfirm={confirmName}
              onCancel={cancelNaming}
            />
          )}
        </div>
      </>
    )
  },
)

function MoviesAppChrome({
  view,
  onExit,
}: {
  view: MoviesView
  onExit: () => void
}) {
  const inPlayer = view === 'player'
  const inNaming = view === 'naming'

  return (
    <div className="relative flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
          <Film className="size-5" strokeWidth={1.6} />
        </div>
        <div className="leading-tight">
          <span className="text-sm font-medium tracking-tight text-muted-foreground">
            Manifest
          </span>
          <p className="text-base font-semibold tracking-tight">
            {inPlayer ? 'Now Playing' : inNaming ? 'Add Movie' : 'Movies'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onExit}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <X className="size-3.5" />
        {inPlayer ? 'Library' : inNaming ? 'Cancel' : 'Exit'}
      </button>
    </div>
  )
}

export type MoviesViewState = MoviesView
