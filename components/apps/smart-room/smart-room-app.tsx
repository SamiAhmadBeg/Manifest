'use client'

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { House, X } from 'lucide-react'
import { keyToSignal } from '@/lib/bci-controls'
import {
  initialState,
  applyScene,
  cycleDevice,
} from '@/lib/smart-room/state'
import type { SmartRoomState, SceneId, DeviceId } from '@/lib/smart-room/types'
import { RoomStage } from './room-stage'
import { ControlRail } from './control-rail'

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

    const onApplyScene = useCallback(
      (id: SceneId) => {
        const next = applyScene(state, id)
        setState(next)
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )

    const onToggleDevice = useCallback(
      (id: DeviceId) => {
        const next = cycleDevice(state, id)
        setState(next)
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        return false
      },
      [onClose, onNotify],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

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
          <RoomStage state={state} />

          {/* Last-action toast */}
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
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.62)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.4)',
                }}
              >
                LAST ACTION
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                }}
              >
                {state.lastAction}
              </span>
            </div>
          )}

          {/* Control rail — self-positions at bottom:22px */}
          <ControlRail
            state={state}
            showStatusText={showStatusText}
            onApplyScene={onApplyScene}
            onToggleDevice={onToggleDevice}
          />
        </div>
      </div>
    )
  },
)
