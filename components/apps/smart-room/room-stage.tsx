'use client'

import type { CSSProperties } from 'react'
import type { SmartRoomState, Lights } from '@/lib/smart-room/types'
import { focusedItem } from '@/lib/smart-room/state'

const STAGE_BG: Record<string, string> = {
  movie: 'linear-gradient(180deg, #efe7db, #e7dccd)',
  sleep: 'linear-gradient(180deg, #e9ebf1, #dfe2eb)',
  focus: '#ffffff',
  alloff: '#fbfbfd',
  manual: '#ffffff',
}

function lampGlow(level: Lights): string {
  if (level === 'on') return '0 0 36px 14px rgba(245,190,110,0.55)'
  if (level === 'dim') return '0 0 18px 7px rgba(210,150,80,0.40)'
  return 'none'
}
function lampColor(level: Lights): string {
  if (level === 'on') return '#ffd083'
  if (level === 'dim') return '#e7b878'
  return '#c4c9d2'
}

const HALO: CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 0 0 2px var(--primary), 0 0 0 7px rgba(226,59,46,0.10)',
}
const CONTACT: CSSProperties = {
  borderRadius: '50%',
  background: 'rgba(20,22,30,0.10)',
  filter: 'blur(2px)',
}
// v1 = soft SIMULTANEOUS transitions with varied durations so elements settle at
// slightly different times (a gentle cascade). NOT delay-based onset-stagger.
const EASE_SLOW = 'transition-all duration-700 ease-out motion-reduce:transition-none' // stage bg, blinds
const EASE_FAST = 'transition-all duration-300 ease-out motion-reduce:transition-none' // lamp, speaker

export function RoomStage({ state }: { state: SmartRoomState }) {
  const focused = focusedItem(state)
  const fdev = focused.kind === 'device' ? focused.id : null

  return (
    <div
      className={`relative w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-border shadow-inner ${EASE_SLOW}`}
      style={{ aspectRatio: '16 / 10', background: STAGE_BG[state.activeScene] ?? '#ffffff' }}
    >
      {/* wall -> floor horizon */}
      <div className="pointer-events-none absolute inset-x-0 top-[64%] h-px bg-black/[0.06]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/[0.04]" />

      {/* WINDOW / BLINDS (wall, left) */}
      <div className="absolute" style={{ left: '9%', top: '15%', width: '24%', height: '34%' }}>
        {fdev === 'blinds' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`h-full w-full rounded-lg border ${EASE_SLOW}`}
          style={{
            borderColor: state.blinds === 'closed' ? '#bcae9c' : '#c4c9d2',
            background:
              state.blinds === 'closed'
                ? 'repeating-linear-gradient(180deg,#d0c2af 0 5px,#c2b49f 5px 9px)'
                : '#ffffff',
            boxShadow: '0 4px 10px rgba(20,22,30,0.08)',
          }}
        >
          {state.blinds === 'open' && (
            <>
              <div className="mx-auto mt-2 h-px w-3/4 bg-black/10" />
              <div className="mx-auto mt-2 h-px w-3/4 bg-black/10" />
            </>
          )}
        </div>
      </div>

      {/* FAN (wall, right) */}
      <div className="absolute" style={{ right: '13%', top: '17%', width: 40, height: 40 }}>
        {fdev === 'fan' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`relative grid h-full w-full place-items-center rounded-full border ${
            state.fanOn ? 'animate-spin motion-reduce:animate-none' : ''
          }`}
          style={{
            borderColor: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            boxShadow: '0 3px 8px rgba(20,22,30,0.10)',
            background: '#ffffff',
            animationDuration: state.fanOn ? '3s' : undefined,
          }}
        >
          <div
            style={{
              width: 16,
              height: 2,
              borderRadius: 2,
              background: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            }}
          />
          <div
            className="absolute"
            style={{
              width: 2,
              height: 16,
              borderRadius: 2,
              background: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            }}
          />
        </div>
      </div>

      {/* LAMP (floor, center-left) */}
      <div className="absolute" style={{ left: '38%', bottom: '17%', width: 36, height: 80 }}>
        {fdev === 'lights' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 0, width: 3, height: 46, background: '#d7dbe2', borderRadius: 2 }}
        />
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${EASE_FAST}`}
          style={{
            top: 0,
            width: 30,
            height: 22,
            borderRadius: '14px 14px 5px 5px',
            background: lampColor(state.lights),
            boxShadow: lampGlow(state.lights),
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: -4, width: 40, height: 8, ...CONTACT }}
        />
      </div>

      {/* SPEAKER (floor, right) */}
      <div className="absolute" style={{ right: '13%', bottom: '15%', width: 22, height: 30 }}>
        {fdev === 'speaker' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`h-full w-full rounded-md border ${EASE_FAST}`}
          style={{
            borderColor: state.speakerOn ? 'var(--primary)' : '#c4c9d2',
            background: state.speakerOn
              ? 'rgba(226,59,46,0.14)'
              : 'linear-gradient(#fbfbfd,#e9ebf0)',
            boxShadow: '0 4px 9px rgba(20,22,30,0.12)',
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: -4, width: 28, height: 6, ...CONTACT }}
        />
      </div>
    </div>
  )
}
