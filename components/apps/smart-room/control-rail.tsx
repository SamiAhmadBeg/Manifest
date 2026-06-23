'use client'

import { Fragment } from 'react'
import {
  FOCUS_ORDER,
  SCENE_LABELS,
  DEVICE_LABELS,
  isDeviceActive,
} from '@/lib/smart-room/state'
import type { SmartRoomState } from '@/lib/smart-room/types'

const GROUP_LABEL =
  'text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60'

export function ControlRail({ state }: { state: SmartRoomState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
      <span className={GROUP_LABEL}>Scenes</span>
      {FOCUS_ORDER.map((item, i) => {
        const isFocused = i === state.focusIndex
        const label =
          item.kind === 'scene' ? SCENE_LABELS[item.id] : DEVICE_LABELS[item.id]
        const active = item.kind === 'device' && isDeviceActive(state, item.id)
        return (
          <Fragment key={`${item.kind}-${item.id}`}>
            {i === 4 && (
              <>
                <span className="mx-1 h-4 w-px bg-border" />
                <span className={GROUP_LABEL}>Devices</span>
              </>
            )}
            <span
              className={[
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-medium transition-colors',
                isFocused
                  ? 'border-primary text-primary'
                  : 'border-border bg-card text-muted-foreground',
              ].join(' ')}
            >
              {item.kind === 'device' && (
                <span
                  className={`size-1.5 rounded-full ${active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                />
              )}
              {label}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
