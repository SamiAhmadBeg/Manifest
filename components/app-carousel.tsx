'use client'

import { motion } from 'framer-motion'
import { APPS, type ManifestApp } from '@/lib/apps'

const TILE = 216
const SPACING = 248

function AppTile({
  app,
  offset,
  isActive,
  onSelect,
}: {
  app: ManifestApp
  offset: number
  isActive: boolean
  onSelect: () => void
}) {
  const abs = Math.abs(offset)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`${app.name}${isActive ? ' (focused)' : ''}`}
      className="absolute left-1/2 top-1/2 origin-center outline-none"
      style={{ zIndex: 50 - abs }}
      initial={false}
      animate={{
        x: offset * SPACING - TILE / 2,
        y: '-50%',
        scale: isActive ? 1 : Math.max(0.66, 0.82 - abs * 0.06),
        opacity: abs > 3 ? 0 : Math.max(0.4, 1 - abs * 0.22),
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
    >
      {/* Tile body */}
      <motion.div
        className="relative grid place-items-center rounded-[2rem] bg-card"
        style={{ height: TILE, width: TILE }}
        animate={{
          boxShadow: isActive
            ? '0 30px 60px -24px oklch(0.58 0.21 27 / 0.45), 0 8px 20px -10px rgba(0,0,0,0.18)'
            : '0 10px 24px -16px rgba(0,0,0,0.25)',
        }}
        transition={{ duration: 0.45 }}
      >
        {/* Highlight ring when focused */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] ring-inset"
          animate={{
            boxShadow: isActive
              ? '0 0 0 3px oklch(0.58 0.21 27)'
              : '0 0 0 1px oklch(0.22 0.01 255 / 0.08)',
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Icon */}
        <motion.div
          className="relative"
          animate={{
            color: isActive ? 'oklch(0.58 0.21 27)' : 'oklch(0.45 0.01 255)',
            scale: isActive ? 1 : 0.92,
          }}
          transition={{ duration: 0.4 }}
        >
          <app.icon className="size-[3.75rem]" strokeWidth={1.6} />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute inset-x-0 top-full mt-6 text-center"
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {app.name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
      </motion.div>
    </motion.button>
  )
}

export function AppCarousel({
  activeIndex,
  onSelectIndex,
  onOpen,
}: {
  activeIndex: number
  onSelectIndex: (i: number) => void
  onOpen: () => void
}) {
  return (
    <div className="relative h-full w-full">
      {APPS.map((app, i) => {
        const offset = i - activeIndex
        const isActive = offset === 0
        return (
          <AppTile
            key={app.id}
            app={app}
            offset={offset}
            isActive={isActive}
            onSelect={() => (isActive ? onOpen() : onSelectIndex(i))}
          />
        )
      })}
    </div>
  )
}
