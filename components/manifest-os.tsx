'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { APPS } from '@/lib/apps'
import { TopBar } from '@/components/top-bar'
import { AppCarousel } from '@/components/app-carousel'
import { ControlsHint } from '@/components/controls-hint'
import { AppOpenView } from '@/components/app-open-view'
import {
  NotificationPanel,
  type NotificationItem,
} from '@/components/notification-panel'

export function ManifestOS() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [note, setNote] = useState<NotificationItem>({
    id: 0,
    text: 'Emotiv not connected',
  })
  const noteId = useRef(1)

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
  }, [pushNote])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex !== null) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'x') closeApp()
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
  }, [openIndex, goPrev, goNext, openActive, closeApp, pushNote])

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Clean, subtle backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, oklch(0.22 0.01 255 / 0.06) 1px, transparent 0)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <TopBar />

      {/* Carousel stage */}
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
      <ControlsHint isOpen={openIndex !== null} />

      <AppOpenView
        app={openIndex !== null ? APPS[openIndex] : null}
        onClose={closeApp}
      />
    </main>
  )
}
