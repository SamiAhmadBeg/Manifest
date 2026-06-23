import type {
  SceneId,
  DeviceId,
  Lights,
  Blinds,
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

interface SceneDef {
  lights: Lights
  blinds: Blinds
  fanOn: boolean
  speakerOn: boolean
}

export const SCENES: Record<SceneId, SceneDef> = {
  movie: { lights: 'dim', blinds: 'closed', fanOn: false, speakerOn: true },
  focus: { lights: 'on', blinds: 'open', fanOn: false, speakerOn: false },
  sleep: { lights: 'off', blinds: 'closed', fanOn: true, speakerOn: false },
  alloff: { lights: 'off', blinds: 'open', fanOn: false, speakerOn: false },
}

export const SCENE_LABELS: Record<SceneId, string> = {
  movie: 'Movie Night',
  focus: 'Focus',
  sleep: 'Sleep',
  alloff: 'All Off',
}

export const DEVICE_LABELS: Record<DeviceId, string> = {
  lights: 'Lights',
  fan: 'Fan',
  blinds: 'Blinds',
  speaker: 'Speaker',
}

export function initialState(): SmartRoomState {
  return { activeScene: 'focus', ...SCENES.focus, focusIndex: 0 }
}

export function applyScene(state: SmartRoomState, id: SceneId): SmartRoomState {
  const s = SCENES[id]
  return {
    ...state,
    activeScene: id,
    lights: s.lights,
    blinds: s.blinds,
    fanOn: s.fanOn,
    speakerOn: s.speakerOn,
  }
}

export function toggleDevice(state: SmartRoomState, id: DeviceId): SmartRoomState {
  const next: SmartRoomState = { ...state, activeScene: 'manual' }
  switch (id) {
    case 'lights':
      next.lights = state.lights === 'off' ? 'on' : 'off' // dim/on -> off
      break
    case 'fan':
      next.fanOn = !state.fanOn
      break
    case 'blinds':
      next.blinds = state.blinds === 'open' ? 'closed' : 'open'
      break
    case 'speaker':
      next.speakerOn = !state.speakerOn
      break
  }
  return next
}

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

export function activate(state: SmartRoomState): SmartRoomState {
  const item = focusedItem(state)
  return item.kind === 'scene'
    ? applyScene(state, item.id)
    : toggleDevice(state, item.id)
}

export function isDeviceActive(state: SmartRoomState, id: DeviceId): boolean {
  switch (id) {
    case 'lights':
      return state.lights !== 'off'
    case 'fan':
      return state.fanOn
    case 'blinds':
      return state.blinds === 'closed'
    case 'speaker':
      return state.speakerOn
  }
}
