'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { House, X } from 'lucide-react'
import { keyToSignal } from '@/lib/bci-controls'
import {
  initialState,
  focusPrev,
  focusNext,
  cycle,
  focusedItem,
  focusLabel,
  deviceValue,
  SCENE_LABELS,
  DEVICE_LABELS,
} from '@/lib/smart-room/state'
import type { SmartRoomState } from '@/lib/smart-room/types'
import { RoomStage } from './room-stage'
import { ControlRail } from './control-rail'

export type SmartRoomAppHandle = { handleKey: (key: string) => boolean }
export type SmartRoomAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

export const SmartRoomApp = forwardRef<SmartRoomAppHandle, SmartRoomAppProps>(
  function SmartRoomApp({ onClose, onNotify }, ref) {
    const [state, setState] = useState<SmartRoomState>(initialState)
    const [firing, setFiring] = useState(false)
    const [lastAction, setLastAction] = useState('Movie Night scene')

    const showTelemetry = true

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }, [])

    const fire = useCallback(() => {
      setFiring(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setFiring(false), 460)
    }, [])

    const commit = useCallback(
      (base: SmartRoomState, dir: 1 | -1) => {
        const item = focusedItem(base)
        const next = cycle(base, dir)
        const toast =
          item.kind === 'scene'
            ? `${SCENE_LABELS[item.id]} scene`
            : `${DEVICE_LABELS[item.id]} ${deviceValue(next, item.id)}`
        setState(next)
        setLastAction(toast)
        onNotify(toast)
        fire()
      },
      [onNotify, fire],
    )

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        if (signal === 'scroll-left') {
          setState(focusPrev)
          onNotify('Scrolled Left')
          return true
        }
        if (signal === 'scroll-right') {
          setState(focusNext)
          onNotify('Scrolled Right')
          return true
        }
        if (signal === 'jaw-clench') {
          commit(state, 1)
          return true
        }
        if (key === 'Backspace' || signal === 'long-blink') {
          commit(state, -1)
          return true
        }
        return false
      },
      [state, onClose, onNotify, commit],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    const onPick = useCallback(
      (i: number) => {
        commit({ ...state, focusIndex: i }, 1)
      },
      [state, commit],
    )

    return (
      <>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            zIndex: 50,
            flex: 'none',
            height: 66,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '1px solid rgba(20,22,30,0.07)',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Left: glyph + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                background: '#e23b2e',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 12px -2px rgba(226,59,46,0.5)',
              }}
            >
              <House size={17} color="#fff" strokeWidth={1.8} />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#9a9da4',
                }}
              >
                MANIFEST
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: '#26282e',
                }}
              >
                Smart Room
              </div>
            </div>
          </div>

          {/* Right: REPLAY chip + Exit pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {showTelemetry && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  color: '#83868d',
                  padding: '6px 11px',
                  background: '#f4f4f5',
                  borderRadius: 999,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#e2a23b',
                    boxShadow: '0 0 0 3px rgba(226,162,59,0.18)',
                  }}
                />
                REPLAY
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                fontWeight: 500,
                color: '#6b6e76',
                padding: '7px 13px',
                border: '1px solid rgba(20,22,30,0.1)',
                borderRadius: 999,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
              Exit
            </button>
          </div>
        </div>

        {/* ── Room container ─────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            minHeight: 0,
            overflow: 'hidden',
            background: '#d9d4ce',
          }}
        >
          {/* 1. Room stage fills container */}
          <RoomStage state={state} />

          {/* 2. Last-action toast */}
          {showTelemetry && (
            <div
              style={{
                position: 'absolute',
                right: 24,
                top: 22,
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 3,
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.35)',
                }}
              >
                LAST ACTION
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                }}
              >
                {lastAction}
              </span>
            </div>
          )}

          {/* 3. Control rail — self-positions at bottom:74px */}
          <ControlRail state={state} firing={firing} dwellShimmer onPick={onPick} />

          {/* 4. Controls + dwell strip */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 26,
              transform: 'translateX(-50%)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'rgba(255,255,255,0.82)',
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            {showTelemetry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ letterSpacing: '0.1em' }}>DWELL</span>
                {/* track */}
                <div
                  style={{
                    position: 'relative',
                    width: 90,
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.25)',
                    overflow: 'hidden',
                  }}
                >
                  {/* fill */}
                  <div
                    data-sr-anim=""
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      borderRadius: 3,
                      background: '#e23b2e',
                      animation: 'sr-dwellbar 1.7s linear infinite',
                    }}
                  />
                </div>
                <span style={{ color: '#ffd9c2' }}>{focusLabel(state)}</span>
              </div>
            )}
            <span style={{ opacity: 0.5 }}>·</span>
            <span>← → focus</span>
            <span>jaw <b style={{ color: '#fff', fontWeight: 600 }}>next</b></span>
            <span>blink <b style={{ color: '#fff', fontWeight: 600 }}>prev</b></span>
            <span>brow <b style={{ color: '#fff', fontWeight: 600 }}>back</b></span>
          </div>
        </div>
      </>
    )
  },
)
