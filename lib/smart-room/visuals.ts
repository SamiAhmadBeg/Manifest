import type { SmartRoomState } from './types'

export interface RoomVisuals {
  monitorScreenBg: string
  monitorBloomOp: number
  pcLedBg: string
  pcLedGlow: string
  lampShadeBg: string
  lampGlow: string
  lampPoolOp: number
  blindsBg: string
  fanAnim: string
}

export function roomVisuals(state: SmartRoomState): RoomVisuals {
  const { monitor, lights, blinds, fan } = state

  const monitorOn = monitor === 'on'

  const monitorScreenBg = monitorOn
    ? 'radial-gradient(circle at 50% 42%, #5d8ad0, #28406e 55%, #14223c 100%)'
    : 'linear-gradient(160deg,#22252b,#15171c)'

  const monitorBloomOp = monitorOn ? 1 : 0

  const pcLedBg = monitorOn ? 'radial-gradient(circle,#ff6a4d,#e2402f)' : '#3a3d44'

  const pcLedGlow = monitorOn ? '0 0 8px 2px rgba(226,64,47,0.7)' : 'none'

  const lampShadeBg =
    lights !== 'off'
      ? 'linear-gradient(180deg,#ffe7be,#eec488)'
      : 'linear-gradient(180deg,#f1efeb,#d4cfc9)'

  const lampGlow =
    lights === 'on'
      ? '0 0 40px 14px rgba(255,196,110,0.55)'
      : lights === 'dim'
        ? '0 0 26px 9px rgba(255,196,110,0.4)'
        : 'none'

  const lampPoolOp = lights === 'on' ? 0.6 : lights === 'dim' ? 0.4 : 0

  const blindsBg =
    blinds === 'closed'
      ? 'repeating-linear-gradient(180deg,#cdbfa9 0 6px,#c0b199 6px 11px)'
      : 'linear-gradient(160deg,#cfe0f2,#aac4e0)'

  const fanAnim =
    fan === 'off'
      ? 'none'
      : fan === 'low'
        ? 'sr-spin 2.1s linear infinite'
        : 'sr-spin 0.8s linear infinite'

  return {
    monitorScreenBg,
    monitorBloomOp,
    pcLedBg,
    pcLedGlow,
    lampShadeBg,
    lampGlow,
    lampPoolOp,
    blindsBg,
    fanAnim,
  }
}
