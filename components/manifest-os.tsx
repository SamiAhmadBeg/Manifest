'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { APPS } from '@/lib/apps'
import type { BciSignal } from '@/lib/bci-controls'
import { BCI } from '@/lib/bci-controls'
import type { MoviesView } from '@/lib/movies/types'
import { BiosignalProvider, useBiosignal } from '@/components/biosignal-provider'
import { TopBar } from '@/components/top-bar'
import { AppCarousel } from '@/components/app-carousel'
import { ControlsHint, type ControlsMode } from '@/components/controls-hint'
import { AppOpenView } from '@/components/app-open-view'
import type { MoviesAppHandle } from '@/components/apps/movies/movies-app'
import type { SnakeAppHandle } from '@/components/apps/snake/snake-app'
import type { SmartRoomAppHandle } from '@/components/apps/smart-room/smart-room-app'
import type { AssistantAppHandle } from '@/components/apps/assistant/assistant-app'
import type { BiosignalLabAppHandle } from '@/components/apps/biosignal-lab/biosignal-lab-app'
import {
  NotificationPanel,
  type NotificationItem,
} from '@/components/notification-panel'
import { SsvepNavArrows } from '@/components/ssvep-nav-arrows'
import { GazeStatusChip } from '@/components/gaze-status-chip'
import { useFaceGaze } from '@/hooks/use-face-gaze'

export function ManifestOS() {
  return (
    <BiosignalProvider>
      <ManifestOSInner />
    </BiosignalProvider>
  )
}

function ManifestOSInner() {
  const { state: biosignal, controlOs, isLive } = useBiosignal()
  const [activeIndex, setActiveIndex] = useState(3)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [moviesView, setMoviesView] = useState<MoviesView | null>(null)
  const [gazeEnabled, setGazeEnabled] = useState(true)
  const [gazeRestartKey, setGazeRestartKey] = useState(0)
  const [note, setNote] = useState<NotificationItem>({
    id: 0,
    text: 'Emotiv not connected',
  })
  const noteId = useRef(1)
  const moviesRef = useRef<MoviesAppHandle>(null)
  const snakeRef = useRef<SnakeAppHandle>(null)
  const smartRoomRef = useRef<SmartRoomAppHandle>(null)
  const assistantRef = useRef<AssistantAppHandle>(null)
  const biosignalLabRef = useRef<BiosignalLabAppHandle>(null)
  const lastBiosignalAt = useRef(0)

  const openApp = openIndex !== null ? APPS[openIndex] : null

  const pushNote = useCallback((text: string) => {
    setNote({ id: noteId.current++, text })
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      const next = Math.max(0, i - 1)
      if (next !== i) pushNote('Scrolled Left')
      return next
    })
  }, [pushNote])

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      const next = Math.min(APPS.length - 1, i + 1)
      if (next !== i) pushNote('Scrolled Right')
      return next
    })
  }, [pushNote])

  const gaze = useFaceGaze({
    enabled: gazeEnabled && openIndex === null,
    restartKey: gazeRestartKey,
    onLookLeft: goPrev,
    onLookRight: goNext,
  })

  useEffect(() => {
    if (gaze.status === 'denied' || gaze.status === 'error') {
      pushNote(gaze.message)
    }
  }, [gaze.status, gaze.message, pushNote])

  const openActive = useCallback(
    (index?: number) => {
      const target = index ?? activeIndex
      setActiveIndex(target)
      setOpenIndex(target)
      pushNote(`Opened ${APPS[target].name}`)
    },
    [activeIndex, pushNote],
  )

  const closeApp = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) pushNote(`Exited ${APPS[current].name}`)
      return null
    })
    setMoviesView(null)
  }, [pushNote])

  const routeKeyToOpenApp = useCallback(
    (key: string): boolean => {
      if (openApp?.id === 'movies') {
        return moviesRef.current?.handleKey(key) ?? false
      }
      if (openApp?.id === 'snake') {
        return snakeRef.current?.handleKey(key) ?? false
      }
      if (openApp?.id === 'smartroom') {
        return smartRoomRef.current?.handleKey(key) ?? false
      }
      if (openApp?.id === 'assistant') {
        return assistantRef.current?.handleKey(key) ?? false
      }
      if (openApp?.id === 'biosignal-lab') {
        return biosignalLabRef.current?.handleKey(key) ?? false
      }
      return false
    },
    [openApp],
  )

  const dispatchBiosignal = useCallback(
    (signal: BciSignal) => {
      if (signal === 'scroll-left') {
        if (openIndex === null) {
          goPrev()
          return
        }
        routeKeyToOpenApp(BCI.SCROLL_LEFT)
        return
      }

      if (signal === 'scroll-right') {
        if (openIndex === null) {
          goNext()
          return
        }
        routeKeyToOpenApp(BCI.SCROLL_RIGHT)
        return
      }

      if (signal === 'jaw-clench') {
        if (openIndex === null) {
          openActive()
          return
        }
        routeKeyToOpenApp(BCI.JAW_CLENCH)
        return
      }

      if (signal === 'frown' || signal === 'brow-raise') {
        if (openIndex === null) return
        // In Assistant, brow raise starts asking — not exit.
        if (openApp?.id === 'assistant') {
          routeKeyToOpenApp(BCI.BROW_RAISE)
          return
        }
        const handled = routeKeyToOpenApp(BCI.EXIT)
        if (!handled) closeApp()
      }
    },
    [openIndex, openApp, openActive, closeApp, routeKeyToOpenApp, goPrev, goNext],
  )

  useEffect(() => {
    if (isLive) {
      pushNote('Emotiv live')
      return
    }
    if (biosignal.phase === 'error' || biosignal.phase === 'waiting-approval') {
      pushNote(biosignal.statusMessage)
    }
  }, [isLive, biosignal.phase, biosignal.statusMessage, pushNote])

  useEffect(() => {
    if (!controlOs || !biosignal.lastSignal || !biosignal.lastSignalAt) return
    if (biosignal.lastSignalAt === lastBiosignalAt.current) return
    lastBiosignalAt.current = biosignal.lastSignalAt
    dispatchBiosignal(biosignal.lastSignal)
    pushNote(
      biosignal.lastSignal === 'jaw-clench'
        ? 'Jaw clench'
        : biosignal.lastSignal === 'scroll-left'
          ? 'Look left'
          : biosignal.lastSignal === 'scroll-right'
            ? 'Look right'
            : 'Brow raise',
    )
  }, [
    controlOs,
    biosignal.lastSignal,
    biosignal.lastSignalAt,
    dispatchBiosignal,
    pushNote,
  ])

  const controlsMode: ControlsMode = (() => {
    if (openIndex === null) return 'home'
    if (openApp?.id === 'movies') {
      if (moviesView === 'player') return 'movies-player'
      if (moviesView === 'naming') return 'movies-naming'
      return 'movies-library'
    }
    if (openApp?.id === 'snake') return 'snake'
    if (openApp?.id === 'smartroom') return 'smart-room'
    if (openApp?.id === 'assistant') return 'assistant'
    if (openApp?.id === 'biosignal-lab') return 'biosignal-lab'
    return 'app'
  })()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex !== null) {
        const handled = routeKeyToOpenApp(e.key)
        if (handled) {
          e.preventDefault()
          return
        }

        if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') {
          closeApp()
          e.preventDefault()
        }
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
        case 'Enter':
          openActive()
          break
        case 'x':
        case 'X':
          pushNote('Exit')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, goPrev, goNext, openActive, closeApp, pushNote, routeKeyToOpenApp])

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, oklch(0.22 0.01 255 / 0.06) 1px, transparent 0)',
            backgroundSize: '44px 44px',
          }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, oklch(0.58 0.21 27 / 0.08), transparent 65%)',
          }}
        />
      </div>

      <TopBar
        emotivLive={isLive}
        emotivMessage={biosignal.statusMessage}
        trailing={
          openIndex === null ? (
            <GazeStatusChip
              status={gaze.status}
              message={gaze.message}
              enabled={gazeEnabled}
              onToggle={() => {
                if (
                  gazeEnabled &&
                  (gaze.status === 'denied' || gaze.status === 'error')
                ) {
                  setGazeRestartKey((k) => k + 1)
                  pushNote('Retrying camera…')
                  return
                }
                setGazeEnabled((v) => {
                  const next = !v
                  pushNote(next ? 'Look scroll on' : 'Look scroll off')
                  return next
                })
              }}
            />
          ) : null
        }
      />

      <SsvepNavArrows
        visible={openIndex === null}
        onLeft={goPrev}
        onRight={goNext}
        gazeSide={gaze.side}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center [isolation:isolate]">
        <div className="h-[420px] w-full">
          <AppCarousel
            activeIndex={activeIndex}
            onSelectIndex={(i) => {
              pushNote(i < activeIndex ? 'Scrolled Left' : 'Scrolled Right')
              setActiveIndex(i)
            }}
            onOpen={() => openActive()}
          />
        </div>
      </div>

      <NotificationPanel item={note} />
      <ControlsHint mode={controlsMode} />

      <AppOpenView
        app={openApp}
        onClose={closeApp}
        onNotify={pushNote}
        moviesRef={moviesRef}
        snakeRef={snakeRef}
        smartRoomRef={smartRoomRef}
        assistantRef={assistantRef}
        biosignalLabRef={biosignalLabRef}
        onMoviesViewChange={(view) => setMoviesView(view)}
        moviesView={moviesView}
      />
    </main>
  )
}
