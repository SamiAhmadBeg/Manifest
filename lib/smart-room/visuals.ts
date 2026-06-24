import type { SmartRoomState, SceneId } from './types'

export interface RoomVisuals {
  lampShadeBg:    string
  lampGlow:       string
  lampPoolOp:     number
  fanAnim:        string
  blindsBg:       string
  speakerRingOp:  number
  screenGlowOp:   number
  wash:           string
  vignO:          number
}

const WASH: Record<SceneId | 'manual', string> = {
  movie:  'radial-gradient(80% 70% at 62% 80%,rgba(255,180,100,0.18),transparent 60%)',
  focus:  'radial-gradient(120% 100% at 50% 22%,rgba(255,252,245,0.34),transparent 72%)',
  sleep:  'radial-gradient(90% 85% at 50% 55%,rgba(120,150,215,0.2),transparent 66%)',
  alloff: 'radial-gradient(100% 100% at 50% 40%,rgba(245,245,248,0.12),transparent 70%)',
  manual: 'radial-gradient(80% 70% at 60% 72%,rgba(255,205,150,0.08),transparent 60%)',
}

const VIGN: Record<SceneId | 'manual', number> = {
  movie:  0.34,
  focus:  0.04,
  sleep:  0.46,
  alloff: 0.12,
  manual: 0.16,
}

export function roomVisuals(state: SmartRoomState): RoomVisuals {
  const { lights, fan, blinds, speaker, activeScene } = state

  // lamp shade background
  const lampShadeBg =
    lights === 'off'
      ? 'linear-gradient(180deg,#e6e8ec,#cfd2d8)'
      : 'linear-gradient(180deg,#ffe2b0,#f3b66f)'

  // lamp glow (box-shadow)
  const lampGlow =
    lights === 'on'
      ? '0 0 42px 14px rgba(255,176,92,0.6)'
      : lights === 'dim'
        ? '0 0 26px 9px rgba(245,185,110,0.45)'
        : '0 0 0 0 rgba(0,0,0,0)'

  // lamp pool opacity
  const lampPoolOp =
    lights === 'on' ? 0.6 : lights === 'dim' ? 0.42 : 0

  // fan animation string (keyframe name: sr-spin)
  const fanAnim =
    fan === 'off'
      ? 'none'
      : fan === 'low'
        ? 'sr-spin 2.2s linear infinite'
        : 'sr-spin 0.85s linear infinite'

  // blinds background
  const blindsBg =
    blinds === 'closed'
      ? 'repeating-linear-gradient(180deg,#cdbfa9 0 6px,#c0b199 6px 11px)'
      : 'linear-gradient(160deg,#cfe0f2,#aac4e0)'

  // speaker ring opacity
  const speakerRingOp = speaker === 'on' ? 1 : 0

  // screen glow opacity
  const screenGlowOp = activeScene === 'movie' ? 1 : 0.22

  // wash gradient
  const wash = WASH[activeScene]

  // vignette opacity
  const vignO = VIGN[activeScene]

  return {
    lampShadeBg,
    lampGlow,
    lampPoolOp,
    fanAnim,
    blindsBg,
    speakerRingOp,
    screenGlowOp,
    wash,
    vignO,
  }
}
