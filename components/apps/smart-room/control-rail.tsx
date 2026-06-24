'use client'

import { Fragment } from 'react'
import { Play, Crosshair, Moon, Power, Lightbulb, Fan, Blinds, Speaker } from 'lucide-react'
import {
  FOCUS_ORDER,
  DEVICE_LABELS,
  isDeviceActive,
  deviceValue,
} from '@/lib/smart-room/state'
import type { SmartRoomState, SceneId, DeviceId } from '@/lib/smart-room/types'

const RAIL_SCENE_LABEL: Record<SceneId, string> = {
  movie:  'Movie',
  focus:  'Focus',
  sleep:  'Sleep',
  alloff: 'All Off',
}

const SCENE_ICONS: Record<SceneId, React.ReactNode> = {
  movie:  <Play   size={17} color="#56595f" />,
  focus:  <Crosshair size={17} color="#56595f" />,
  sleep:  <Moon   size={17} color="#56595f" />,
  alloff: <Power  size={17} color="#56595f" />,
}

const DEVICE_ICONS: Record<DeviceId, React.ReactNode> = {
  lights:  <Lightbulb size={17} color="#56595f" strokeWidth={1.7} />,
  fan:     <Fan       size={17} color="#56595f" strokeWidth={1.7} />,
  blinds:  <Blinds    size={17} color="#56595f" strokeWidth={1.7} />,
  speaker: <Speaker   size={17} color="#56595f" strokeWidth={1.7} />,
}

const innerStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  background: '#fff',
  display: 'grid',
  placeItems: 'center',
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#56595f',
}

const badgeStyleBase: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '.06em',
}

export function ControlRail({
  state,
  firing,
  dwellShimmer = true,
  onPick,
}: {
  state: SmartRoomState
  firing: boolean
  dwellShimmer?: boolean
  onPick: (i: number) => void
}) {
  const railStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: '74px',
    transform: 'translateX(-50%)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    borderRadius: '24px',
    background: 'rgba(252,251,250,0.72)',
    backdropFilter: 'blur(26px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(26px) saturate(1.5)',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow:
      '0 1px 1px rgba(255,255,255,0.6) inset, 0 18px 50px -18px rgba(20,22,30,0.4)',
  }

  const groupLabelBase: React.CSSProperties = {
    fontFamily: "'Geist Mono', monospace",
    fontSize: '9.5px',
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    color: '#a3a6ad',
  }

  const scenesLabelStyle: React.CSSProperties = {
    ...groupLabelBase,
    padding: '0 6px 0 4px',
  }

  const devicesLabelStyle: React.CSSProperties = {
    ...groupLabelBase,
    padding: '0 6px 0 0',
  }

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '46px',
    background: 'rgba(20,22,30,0.1)',
    margin: '0 6px',
  }

  return (
    <div style={railStyle}>
      <span style={scenesLabelStyle}>SCENES</span>

      {FOCUS_ORDER.map((item, i) => {
        const foc = i === state.focusIndex

        const bc = foc
          ? firing ? '#37b27d' : '#e23b2e'
          : 'rgba(20,22,30,0.10)'

        const bg = foc
          ? firing ? 'rgba(55,178,125,0.10)' : 'rgba(226,59,46,0.07)'
          : 'rgba(255,255,255,0)'

        const showConic = foc && dwellShimmer
        const active = item.kind === 'device' && isDeviceActive(state, item.id)
        const badgeColor = active ? '#c4291d' : '#9a9da4'
        const rb = showConic
          ? firing
            ? 'conic-gradient(#37b27d var(--dwell),rgba(20,22,30,0.1) 0)'
            : 'conic-gradient(#e23b2e var(--dwell),rgba(20,22,30,0.1) 0)'
          : '#f1f1f2'

        const tileStyle: React.CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 11px',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: bc,
          background: bg,
          cursor: 'pointer',
          font: 'inherit',
          appearance: 'none',
        }

        const ringStyle: React.CSSProperties = {
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: rb,
          ...(showConic ? { animation: 'dwell 1.7s linear infinite' } : {}),
        }

        const label =
          item.kind === 'scene'
            ? RAIL_SCENE_LABEL[item.id]
            : DEVICE_LABELS[item.id]

        const icon =
          item.kind === 'scene'
            ? SCENE_ICONS[item.id]
            : DEVICE_ICONS[item.id]

        return (
          <Fragment key={`${item.kind}-${item.id}`}>
            {i === 4 && (
              <>
                <span style={dividerStyle} />
                <span style={devicesLabelStyle}>DEVICES</span>
              </>
            )}
            <button
              style={tileStyle}
              onClick={() => onPick(i)}
            >
              <div
                style={ringStyle}
                {...(showConic ? { 'data-sr-anim': '' } : {})}
              >
                <div style={innerStyle}>
                  {icon}
                </div>
              </div>
              <span style={labelStyle}>{label}</span>
              {item.kind === 'device' && (
                <span style={{ ...badgeStyleBase, color: badgeColor }}>
                  {deviceValue(state, item.id).toUpperCase()}
                </span>
              )}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
