'use client'

import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Target, Moon, Power, Lightbulb, Fan, Blinds, Monitor } from 'lucide-react'
import {
  SCENE_LABELS,
  DEVICE_LABELS,
  isDeviceActive,
  deviceValue,
} from '@/lib/smart-room/state'
import type { SmartRoomState, SceneId, DeviceId } from '@/lib/smart-room/types'

/* ── Token table (README "Active vs inactive tile styling") ── */
const TOKENS = {
  active: {
    borderColor: 'rgba(226,64,47,0.28)',
    background: 'rgba(255,255,255,0.5)',
    discBg: '#ffffff',
    discShadow:
      '0 4px 12px -4px rgba(226,64,47,.5), inset 0 0 0 1.6px rgba(226,64,47,.5)',
    stroke: '#e2402f',
    statusColor: '#c4291d',
  },
  inactive: {
    borderColor: 'rgba(20,22,30,0.08)',
    background: 'rgba(255,255,255,0)',
    discBg: '#ededef',
    discShadow: 'inset 0 0 0 1px rgba(20,22,30,.07)',
    stroke: '#a6a8af',
    statusColor: '#9a9da4',
  },
} as const

const HOVER_BG = 'rgba(255,255,255,0.5)'

const railStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: '22px',
  transform: 'translateX(-50%)',
  zIndex: 30,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '10px 14px',
  borderRadius: '22px',
  background: 'rgba(252,251,250,0.66)',
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  border: '1px solid rgba(255,255,255,0.7)',
  boxShadow:
    '0 1px 1px rgba(255,255,255,0.6) inset, 0 18px 50px -18px rgba(20,22,30,0.4)',
}

const groupLabelStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: '9px',
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: '#a3a6ad',
}

const dividerStyle: CSSProperties = {
  width: '1px',
  height: '48px',
  background: 'rgba(20,22,30,0.1)',
  margin: '0 5px',
}

const discStyle: CSSProperties = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
}

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '10.5px',
  fontWeight: 600,
  color: '#56595f',
}

const statusStyleBase: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: '8.5px',
  fontWeight: 600,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
}

const SCENE_ORDER: SceneId[] = ['focus', 'sleep', 'alloff']
const DEVICE_ORDER: DeviceId[] = ['lights', 'fan', 'blinds', 'monitor']

/* Closed-blinds glyph: rounded square frame with 4 evenly spaced slat lines.
   Used because lucide-react@1.18 has no `BlindsClosed` export. */
function BlindsClosedIcon({ color }: { color: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="16" x2="21" y2="16" />
    </svg>
  )
}

function sceneIcon(id: SceneId, color: string): ReactNode {
  switch (id) {
    case 'focus':
      return <Target size={16} strokeWidth={1.7} color={color} />
    case 'sleep':
      return <Moon size={16} strokeWidth={1.7} color={color} />
    case 'alloff':
      return <Power size={16} strokeWidth={1.7} color={color} />
  }
}

function deviceIcon(
  state: SmartRoomState,
  id: DeviceId,
  color: string,
  active: boolean,
): ReactNode {
  switch (id) {
    case 'lights':
      return (
        <Lightbulb
          size={16}
          strokeWidth={1.7}
          color={color}
          fill={active ? 'rgba(226,64,47,0.16)' : 'none'}
        />
      )
    case 'fan':
      return (
        <span
          {...(active ? { 'data-sr-anim': '' } : {})}
          style={{
            display: 'grid',
            placeItems: 'center',
            ...(active
              ? { animation: 'sr-spin 1.6s linear infinite' }
              : {}),
          }}
        >
          <Fan size={16} strokeWidth={1.7} color={color} />
        </span>
      )
    case 'blinds':
      return state.blinds === 'closed' ? (
        <BlindsClosedIcon color={color} />
      ) : (
        <Blinds size={16} strokeWidth={1.7} color={color} />
      )
    case 'monitor':
      return <Monitor size={16} strokeWidth={1.7} color={color} />
  }
}

interface TileProps {
  active: boolean
  hovered: boolean
  icon: ReactNode
  label: string
  status?: string
  statusColor?: string
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function Tile({
  active,
  hovered,
  icon,
  label,
  status,
  statusColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TileProps) {
  const tok = active ? TOKENS.active : TOKENS.inactive
  // Hover only lightens an inactive tile; active tiles already use HOVER_BG.
  const background =
    !active && hovered ? HOVER_BG : tok.background

  const tileStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 9px',
    borderRadius: '15px',
    border: '1px solid',
    borderColor: tok.borderColor,
    background,
    cursor: 'pointer',
    appearance: 'none',
    font: 'inherit',
    transition: 'background .18s, border-color .18s',
  }

  return (
    <button
      type="button"
      style={tileStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        style={{
          ...discStyle,
          background: tok.discBg,
          boxShadow: tok.discShadow,
        }}
      >
        {icon}
      </span>
      <span style={labelStyle}>{label}</span>
      {status !== undefined && (
        <span style={{ ...statusStyleBase, color: statusColor }}>{status}</span>
      )}
    </button>
  )
}

export function ControlRail({
  state,
  showStatusText = true,
  onApplyScene,
  onToggleDevice,
}: {
  state: SmartRoomState
  showStatusText?: boolean
  onApplyScene: (id: SceneId) => void
  onToggleDevice: (id: DeviceId) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={railStyle}>
      <span style={groupLabelStyle}>SCENES</span>

      {SCENE_ORDER.map((id) => {
        const active = state.activeScene === id
        const tok = active ? TOKENS.active : TOKENS.inactive
        const key = `scene-${id}`
        return (
          <Tile
            key={key}
            active={active}
            hovered={hovered === key}
            icon={sceneIcon(id, tok.stroke)}
            label={SCENE_LABELS[id]}
            onClick={() => onApplyScene(id)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered((prev) => (prev === key ? null : prev))}
          />
        )
      })}

      <span style={dividerStyle} />

      <span style={groupLabelStyle}>DEVICES</span>

      {DEVICE_ORDER.map((id) => {
        const active = isDeviceActive(state, id)
        const tok = active ? TOKENS.active : TOKENS.inactive
        const key = `device-${id}`
        return (
          <Tile
            key={key}
            active={active}
            hovered={hovered === key}
            icon={deviceIcon(state, id, tok.stroke, active)}
            label={DEVICE_LABELS[id]}
            status={
              showStatusText ? deviceValue(state, id).toUpperCase() : undefined
            }
            statusColor={tok.statusColor}
            onClick={() => onToggleDevice(id)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered((prev) => (prev === key ? null : prev))}
          />
        )
      })}
    </div>
  )
}
