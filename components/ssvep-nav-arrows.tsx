'use client'

import { SSVEP } from '@/lib/ssvep'
import type { GazeSide } from '@/lib/gaze/config'

type Side = 'left' | 'right'

/** SSVEP square-wave disabled while gaze proxy is primary nav. */
function useSsvepFlicker(hz: number, enabled: boolean) {
  void hz
  void enabled
  return false
}

function Chevron({ side, lit }: { side: Side; lit: boolean }) {
  const isLeft = side === 'left'
  return (
    <svg
      viewBox="0 0 48 80"
      className="h-[72px] w-[44px] sm:h-[88px] sm:w-[52px]"
      aria-hidden
    >
      <rect
        x="4"
        y="8"
        width="40"
        height="64"
        rx="18"
        fill={
          lit ? 'oklch(0.22 0.01 255 / 0.55)' : 'oklch(0.22 0.01 255 / 0.08)'
        }
      />
      <path
        d={isLeft ? 'M30 18 L16 40 L30 62' : 'M18 18 L32 40 L18 62'}
        fill="none"
        stroke={lit ? 'oklch(0.99 0 0)' : 'oklch(0.22 0.01 255 / 0.22)'}
        strokeWidth={lit ? 5.5 : 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SsvepEdge({
  side,
  hz,
  enabled,
  onActivate,
  gazeActive,
}: {
  side: Side
  hz: number
  enabled: boolean
  onActivate: () => void
  gazeActive: boolean
}) {
  void hz
  const lit = useSsvepFlicker(hz, enabled)
  const label =
    side === 'left'
      ? 'Look left to scroll previous'
      : 'Look right to scroll next'

  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} · ${hz} Hz · webcam look or click`}
      onClick={onActivate}
      className={[
        'pointer-events-auto absolute top-1/2 z-[15] flex h-[42vh] max-h-[360px] min-h-[220px] w-[11vw] min-w-[72px] max-w-[120px] -translate-y-1/2 items-center',
        'border-0 bg-transparent outline-none transition-transform duration-300',
        'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        side === 'left'
          ? 'left-0 justify-start pl-3 sm:pl-5'
          : 'right-0 justify-end pr-3 sm:pr-5',
      ].join(' ')}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-[12%] w-full rounded-full blur-2xl transition-opacity duration-300"
        style={{
          opacity: gazeActive ? 0.95 : 0.7,
          background: gazeActive
            ? side === 'left'
              ? 'radial-gradient(ellipse at left, oklch(0.58 0.21 27 / 0.22), transparent 70%)'
              : 'radial-gradient(ellipse at right, oklch(0.58 0.21 27 / 0.22), transparent 70%)'
            : side === 'left'
              ? 'radial-gradient(ellipse at left, oklch(0.58 0.21 27 / 0.10), transparent 70%)'
              : 'radial-gradient(ellipse at right, oklch(0.58 0.21 27 / 0.10), transparent 70%)',
        }}
      />

      <span
        className="relative grid place-items-center rounded-[1.35rem] p-3 backdrop-blur-[2px] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]"
        style={{
          transform: gazeActive ? 'scale(1.06)' : undefined,
          background: lit
            ? 'linear-gradient(180deg, oklch(0.22 0.01 255 / 0.14), oklch(0.22 0.01 255 / 0.06))'
            : 'linear-gradient(180deg, oklch(1 0 0 / 0.55), oklch(1 0 0 / 0.28))',
          boxShadow: gazeActive
            ? '0 12px 44px -16px oklch(0.58 0.21 27 / 0.45), inset 0 1px 0 oklch(1 0 0 / 0.35)'
            : lit
              ? '0 10px 40px -18px oklch(0.22 0.01 255 / 0.45), inset 0 1px 0 oklch(1 0 0 / 0.18)'
              : '0 8px 28px -20px oklch(0.22 0.01 255 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.7)',
        }}
      >
        <Chevron side={side} lit={lit || gazeActive} />
        <span className="mt-2 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          {side === 'left' ? 'Look left' : 'Look right'}
        </span>
      </span>
    </button>
  )
}

export function SsvepNavArrows({
  visible,
  onLeft,
  onRight,
  gazeSide = 'center',
}: {
  visible: boolean
  onLeft: () => void
  onRight: () => void
  gazeSide?: GazeSide
  gazeDwell?: number
}) {
  if (!visible) return null

  return (
    <>
      <SsvepEdge
        side="left"
        hz={SSVEP.LEFT_HZ}
        enabled={visible}
        onActivate={onLeft}
        gazeActive={gazeSide === 'left'}
      />
      <SsvepEdge
        side="right"
        hz={SSVEP.RIGHT_HZ}
        enabled={visible}
        onActivate={onRight}
        gazeActive={gazeSide === 'right'}
      />
    </>
  )
}
