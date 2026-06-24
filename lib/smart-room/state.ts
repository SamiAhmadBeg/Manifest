import type {
  SceneId,
  DeviceId,
  Lights,
  Fan,
  Pose,
  SmartRoomState,
} from './types'

export const SCENE_LABELS: Record<SceneId, string> = {
  focus:  'Focus',
  sleep:  'Sleep',
  alloff: 'All Off',
}

export const DEVICE_LABELS: Record<DeviceId, string> = {
  lights:  'Lights',
  fan:     'Fan',
  blinds:  'Blinds',
  monitor: 'Monitor',
}

type ScenePreset = Partial<Pick<SmartRoomState, 'monitor' | 'lights' | 'fan' | 'blinds'>>

// alloff intentionally OMITS blinds so applying it leaves blinds untouched.
const SCENES: Record<SceneId, ScenePreset> = {
  focus:  { monitor: 'on',  lights: 'on',  blinds: 'open',   fan: 'low' },
  sleep:  { monitor: 'off', lights: 'off', blinds: 'closed', fan: 'low' },
  alloff: { monitor: 'off', lights: 'off',                   fan: 'off' },
}

const POSE: Record<SceneId, Pose> = {
  focus:  'desk',
  sleep:  'bed',
  alloff: 'desk',
}

const HEADPHONES: Record<SceneId, boolean> = {
  focus:  true,
  sleep:  false,
  alloff: false,
}

export function initialState(startScene: SceneId = 'focus'): SmartRoomState {
  const base: SmartRoomState = {
    monitor: 'off',
    lights: 'off',
    fan: 'off',
    blinds: 'open',
    activeScene: 'manual',
    pose: 'desk',
    headphones: false,
    lastAction: '',
  }
  return applyScene(base, startScene)
}

export function applyScene(state: SmartRoomState, id: SceneId): SmartRoomState {
  return {
    ...state,
    ...SCENES[id],
    activeScene: id,
    pose: POSE[id],
    headphones: HEADPHONES[id],
    lastAction: `${SCENE_LABELS[id]} scene`,
  }
}

export function nextLights(v: Lights): Lights {
  if (v === 'off') return 'dim'
  if (v === 'dim') return 'on'
  return 'off'
}

export function nextFan(v: Fan): Fan {
  if (v === 'off') return 'low'
  if (v === 'low') return 'high'
  return 'off'
}

export function cycleDevice(state: SmartRoomState, id: DeviceId): SmartRoomState {
  const next: SmartRoomState = { ...state, activeScene: 'manual' }
  switch (id) {
    case 'lights':
      next.lights = nextLights(state.lights)
      break
    case 'fan':
      next.fan = nextFan(state.fan)
      break
    case 'blinds':
      next.blinds = state.blinds === 'open' ? 'closed' : 'open'
      break
    case 'monitor':
      next.monitor = state.monitor === 'on' ? 'off' : 'on'
      break
  }
  next.lastAction = `${DEVICE_LABELS[id]} ${deviceValue(next, id).toUpperCase()}`
  return next
}

export function deviceValue(state: SmartRoomState, id: DeviceId): string {
  switch (id) {
    case 'lights':  return state.lights
    case 'fan':     return state.fan
    case 'blinds':  return state.blinds
    case 'monitor': return state.monitor
  }
}

export function isDeviceActive(state: SmartRoomState, id: DeviceId): boolean {
  switch (id) {
    case 'lights':  return state.lights !== 'off'
    case 'fan':     return state.fan    !== 'off'
    case 'blinds':  return state.blinds === 'closed'
    case 'monitor': return state.monitor === 'on'
  }
}
