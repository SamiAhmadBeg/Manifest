'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MovieItem } from '@/lib/movies/types'
import { deleteMovie, loadAllMovies, saveMovie } from '@/lib/movies/db'

function stripExtension(name: string) {
  return name.replace(/\.mp4$/i, '')
}

export function useMovies() {
  const [movies, setMovies] = useState<MovieItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const urlsRef = useRef<Set<string>>(new Set())

  const trackUrl = useCallback((url: string) => {
    urlsRef.current.add(url)
  }, [])

  useEffect(() => {
    let cancelled = false

    loadAllMovies()
      .then((stored) => {
        if (cancelled) return
        const items: MovieItem[] = stored.map((entry) => {
          const objectUrl = URL.createObjectURL(entry.blob)
          trackUrl(objectUrl)
          return {
            id: entry.id,
            name: entry.name,
            objectUrl,
            addedAt: entry.addedAt,
          }
        })
        items.sort((a, b) => a.addedAt - b.addedAt)
        setMovies(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [trackUrl])

  const addMovie = useCallback(
    async (file: File, name: string) => {
      const id = crypto.randomUUID()
      const trimmed = name.trim() || stripExtension(file.name)
      const addedAt = Date.now()

      await saveMovie({ id, name: trimmed, blob: file, addedAt })

      const objectUrl = URL.createObjectURL(file)
      trackUrl(objectUrl)
      const item: MovieItem = { id, name: trimmed, objectUrl, addedAt }

      setMovies((prev) => [...prev, item])
      return item
    },
    [trackUrl],
  )

  const removeMovieById = useCallback(async (id: string) => {
    await deleteMovie(id)
    setMovies((prev) => {
      const target = prev.find((m) => m.id === id)
      if (target) {
        URL.revokeObjectURL(target.objectUrl)
        urlsRef.current.delete(target.objectUrl)
      }
      return prev.filter((m) => m.id !== id)
    })
  }, [])

  useEffect(() => {
    const urls = urlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  return { movies, addMovie, removeMovie: removeMovieById, isReady }
}
