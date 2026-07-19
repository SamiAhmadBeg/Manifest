'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  House,
  X,
  Target,
  Moon,
  Power,
  Lightbulb,
  Fan,
  Blinds,
  Monitor,
} from 'lucide-react'
import { keyToSignal, isDeleteKey } from '@/lib/bci-controls'
import {
  initialState,
  applyScene,
  cycleDevice,
  focusedItem,
  FOCUS_ORDER,
} from '@/lib/smart-room/state'
import type {
  SmartRoomState,
  SceneId,
  DeviceId,
  FocusItem,
} from '@/lib/smart-room/types'
import { RoomStage } from './room-stage'
import { ControlRail } from './control-rail'

/* Icon for the last-action pill — matches the rail icon for that scene/device. */
function actionIcon(item: FocusItem) {
  const props = { className: 'size-4', strokeWidth: 1.8 }
  if (item.kind === 'scene') {
    if (item.id === 'focus') return <Target {...props} />
    if (item.id === 'sleep') return <Moon {...props} />
    return <Power {...props} />
  }
  switch (item.id) {
    case 'lights':
      return <Lightbulb {...props} />
    case 'fan':
      return <Fan {...props} />
    case 'blinds':
      return <Blinds {...props} />
    case 'monitor':
      return <Monitor {...props} />
  }
}

export type SmartRoomAppHandle = { handleKey: (key: string) => boolean }
export type SmartRoomAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
  startScene?: SceneId
  showTelemetry?: boolean
  showStatusText?: boolean
}

export const SmartRoomApp = forwardRef<SmartRoomAppHandle, SmartRoomAppProps>(
  function SmartRoomApp(
    {
      onClose,
      onNotify,
      startScene = 'focus',
      showTelemetry = true,
      showStatusText = true,
    },
    ref,
  ) {
    const [state, setState] = useState<SmartRoomState>(() =>
      initialState(startScene),
    )
    const [focusIndex, setFocusIndex] = useState(0)
    const [firing, setFiring] = useState(false)
    const [lastItem, setLastItem] = useState<FocusItem>({
      kind: 'scene',
      id: startScene,
    })
    const fireTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
      return () => {
        if (fireTimer.current) clearTimeout(fireTimer.current)
      }
    }, [])

    const fire = useCallback(() => {
      setFiring(true)
      if (fireTimer.current) clearTimeout(fireTimer.current)
      fireTimer.current = setTimeout(() => setFiring(false), 300)
    }, [])

    const onApplyScene = useCallback(
      (id: SceneId) => {
        const next = applyScene(state, id)
        setState(next)
        setFocusIndex(FOCUS_ORDER.findIndex((f) => f.kind === 'scene' && f.id === id))
        setLastItem({ kind: 'scene', id })
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )

    const onToggleDevice = useCallback(
      (id: DeviceId) => {
        const next = cycleDevice(state, id)
        setState(next)
        setFocusIndex(FOCUS_ORDER.findIndex((f) => f.kind === 'device' && f.id === id))
        setLastItem({ kind: 'device', id })
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )

    const activate = useCallback(
      (dir: 1 | -1) => {
        const item = focusedItem(focusIndex)
        if (item.kind === 'scene') {
          if (dir === -1) return // reverse on a scene is a no-op
          const next = applyScene(state, item.id)
          setState(next)
          setLastItem(item)
          onNotify(next.lastAction)
          fire()
        } else {
          const next = cycleDevice(state, item.id, dir)
          setState(next)
          setLastItem(item)
          onNotify(next.lastAction)
          fire()
        }
      },
      [focusIndex, state, onNotify, fire],
    )

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'frown' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        if (signal === 'scroll-left') {
          setFocusIndex((i) => (i - 1 + FOCUS_ORDER.length) % FOCUS_ORDER.length)
          return true
        }
        if (signal === 'scroll-right') {
          setFocusIndex((i) => (i + 1) % FOCUS_ORDER.length)
          return true
        }
        if (signal === 'jaw-clench') {
          activate(1)
          return true
        }
        if (signal === 'long-blink' || isDeleteKey(key)) {
          activate(-1)
          return true
        }
        return false
      },
      [onClose, onNotify, activate],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    const focused = focusedItem(focusIndex)
    const focusedDevice = focused.kind === 'device' ? focused.id : undefined

    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          color: '#26282e',
          overflow: 'hidden',
        }}
      >
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
                background: '#e2402f',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 12px -2px rgba(226,64,47,0.5)',
              }}
            >
              <House size={17} color="#fff" strokeWidth={1.8} />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
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
                  fontFamily: 'var(--font-inter)',
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

          {/* Right: Exit pill */}
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

        {/* ── Room stage area ────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <RoomStage state={state} focusedDevice={focusedDevice} />

          {/* Last-action toast — matches the OS "Recent Action" pill */}
          {showTelemetry && (
            <div className="pointer-events-none absolute right-6 top-5 z-20">
              <p className="mb-2 pr-1 text-right text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Last Action
              </p>
              <div className="flex h-[58px] w-60 items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card px-4 shadow-sm">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
                  {actionIcon(lastItem)}
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                    {state.lastAction}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Neural input · just now
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Control rail — self-positions at bottom:22px */}
          <ControlRail
            state={state}
            showStatusText={showStatusText}
            focusIndex={focusIndex}
            firing={firing}
            onApplyScene={onApplyScene}
            onToggleDevice={onToggleDevice}
          />
        </div>
      </div>
    )
  },
)
