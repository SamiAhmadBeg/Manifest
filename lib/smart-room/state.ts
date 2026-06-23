import type {
  SceneId,
  DeviceId,
  Lights,
  Fan,
  SmartRoomState,
  FocusItem,
} from './types'

export const FOCUS_ORDER: FocusItem[] = [
  { kind: 'scene', id: 'movie' },
  { kind: 'scene', id: 'focus' },
  { kind: 'scene', id: 'sleep' },
  { kind: 'scene', id: 'alloff' },
  { kind: 'device', id: 'lights' },
  { kind: 'device', id: 'fan' },
  { kind: 'device', id: 'blinds' },
  { kind: 'device', id: 'speaker' },
]

type SceneDef = Pick<SmartRoomState, 'lights' | 'fan' | 'blinds' | 'speaker'>

export const SCENES: Record<SceneId, SceneDef> = {
  movie:  { lights: 'dim', blinds: 'closed', fan: 'off', speaker: 'on'  },
  focus:  { lights: 'on',  blinds: 'open',   fan: 'off', speaker: 'off' },
  sleep:  { lights: 'off', blinds: 'closed', fan: 'low', speaker: 'off' },
  alloff: { lights: 'off', blinds: 'open',   fan: 'off', speaker: 'off' },
}

export const SCENE_LABELS: Record<SceneId, string> = {
  movie:  'Movie Night',
  focus:  'Focus',
  sleep:  'Sleep',
  alloff: 'All Off',
}

export const DEVICE_LABELS: Record<DeviceId, string> = {
  lights:  'Lights',
  fan:     'Fan',
  blinds:  'Blinds',
  speaker: 'Speaker',
}

export function initialState(): SmartRoomState {
  return { activeScene: 'movie', ...SCENES.movie, focusIndex: 0 }
}

export function applyScene(state: SmartRoomState, id: SceneId): SmartRoomState {
  const s = SCENES[id]
  return {
    ...state,
    activeScene: id,
    lights:  s.lights,
    blinds:  s.blinds,
    fan:     s.fan,
    speaker: s.speaker,
  }
}

// ── Lights cycle ──────────────────────────────────────────────────────────────
export function nextLights(v: Lights): Lights {
  if (v === 'off') return 'dim'
  if (v === 'dim') return 'on'
  return 'off'
}

export function prevLights(v: Lights): Lights {
  if (v === 'off') return 'on'
  if (v === 'on')  return 'dim'
  return 'off'
}

// ── Fan cycle ─────────────────────────────────────────────────────────────────
export function nextFan(v: Fan): Fan {
  if (v === 'off')  return 'low'
  if (v === 'low')  return 'high'
  return 'off'
}

export function prevFan(v: Fan): Fan {
  if (v === 'off')  return 'high'
  if (v === 'high') return 'low'
  return 'off'
}

// ── cycleDevice ───────────────────────────────────────────────────────────────
export function cycleDevice(
  state: SmartRoomState,
  id: DeviceId,
  dir: 1 | -1,
): SmartRoomState {
  const next: SmartRoomState = { ...state, activeScene: 'manual' }
  switch (id) {
    case 'lights':
      next.lights = dir > 0 ? nextLights(state.lights) : prevLights(state.lights)
      break
    case 'fan':
      next.fan = dir > 0 ? nextFan(state.fan) : prevFan(state.fan)
      break
    case 'blinds':
      next.blinds = state.blinds === 'open' ? 'closed' : 'open'
      break
    case 'speaker':
      next.speaker = state.speaker === 'off' ? 'on' : 'off'
      break
  }
  return next
}

// ── cycle (dispatch on focused item) ─────────────────────────────────────────
export function cycle(state: SmartRoomState, dir: 1 | -1): SmartRoomState {
  const item = focusedItem(state)
  if (item.kind === 'scene') return applyScene(state, item.id)
  return cycleDevice(state, item.id, dir)
}

// ── deviceValue ───────────────────────────────────────────────────────────────
export function deviceValue(state: SmartRoomState, id: DeviceId): string {
  switch (id) {
    case 'lights':  return state.lights
    case 'fan':     return state.fan
    case 'blinds':  return state.blinds
    case 'speaker': return state.speaker
  }
}

// ── focus helpers ─────────────────────────────────────────────────────────────
export function focusedItem(state: SmartRoomState): FocusItem {
  return FOCUS_ORDER[state.focusIndex]
}

export function focusLabel(state: SmartRoomState): string {
  const item = focusedItem(state)
  return item.kind === 'scene' ? SCENE_LABELS[item.id] : DEVICE_LABELS[item.id]
}

export function focusPrev(state: SmartRoomState): SmartRoomState {
  const n = FOCUS_ORDER.length
  return { ...state, focusIndex: (state.focusIndex - 1 + n) % n }
}

export function focusNext(state: SmartRoomState): SmartRoomState {
  const n = FOCUS_ORDER.length
  return { ...state, focusIndex: (state.focusIndex + 1) % n }
}

// ── isDeviceActive ────────────────────────────────────────────────────────────
export function isDeviceActive(state: SmartRoomState, id: DeviceId): boolean {
  switch (id) {
    case 'lights':  return state.lights !== 'off'
    case 'fan':     return state.fan    !== 'off'
    case 'blinds':  return state.blinds === 'closed'
    case 'speaker': return state.speaker === 'on'
  }
}
