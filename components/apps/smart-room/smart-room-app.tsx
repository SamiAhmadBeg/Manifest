'use client'

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
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
} from '@/lib/smart-room/state'
import type { SmartRoomState, DeviceId } from '@/lib/smart-room/types'
import { RoomStage } from './room-stage'
import { ControlRail } from './control-rail'

export type SmartRoomAppHandle = { handleKey: (key: string) => boolean }
export type SmartRoomAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

function describeToggle(state: SmartRoomState, id: DeviceId): string {
  return deviceValue(state, id)
}

export const SmartRoomApp = forwardRef<SmartRoomAppHandle, SmartRoomAppProps>(
  function SmartRoomApp({ onClose, onNotify }, ref) {
    const [state, setState] = useState<SmartRoomState>(initialState)

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        if (signal === 'scroll-left') {
          // matches the OS pattern (home carousel + Movies both notify 'Scrolled Left/Right')
          setState((s) => focusPrev(s))
          onNotify('Scrolled Left')
          return true
        }
        if (signal === 'scroll-right') {
          setState((s) => focusNext(s))
          onNotify('Scrolled Right')
          return true
        }
        if (signal === 'jaw-clench') {
          const item = focusedItem(state)
          const next = cycle(state, 1)
          onNotify(
            item.kind === 'scene'
              ? `${SCENE_LABELS[item.id]} scene`
              : `${focusLabel(state)} ${describeToggle(next, item.id)}`,
          )
          setState(next)
          return true
        }
        return false
      },
      [state, onClose, onNotify],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    const activeLabel =
      state.activeScene === 'manual' ? 'Manual' : SCENE_LABELS[state.activeScene]

    return (
      <>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <House className="size-5" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-medium tracking-tight text-muted-foreground">
                Manifest
              </span>
              <p className="text-base font-semibold tracking-tight">Smart Room</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3.5" />
            Exit
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-6">
          <div className="flex w-full max-w-lg items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Active Scene
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold tracking-tight">{activeLabel}</p>
                {state.activeScene !== 'manual' && (
                  <span className="rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    ● Active
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Selected
              </p>
              <p className="text-2xl font-semibold tracking-tight text-primary">
                {focusLabel(state)}
              </p>
            </div>
          </div>

          <RoomStage state={state} />

          <ControlRail
            state={state}
            firing={false}
            onPick={(i) => setState((s) => ({ ...s, focusIndex: i }))}
          />
        </div>
      </>
    )
  },
)
