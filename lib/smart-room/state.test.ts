import { describe, it, expect } from 'vitest'
import {
  initialState,
  applyScene,
  cycleDevice,
  deviceValue,
  isDeviceActive,
  nextLights,
  nextFan,
  SCENE_LABELS,
  DEVICE_LABELS,
  FOCUS_ORDER,
  focusedItem,
  focusLabel,
  prevLights,
  prevFan,
} from './state'
import type { FocusItem } from './types'

// ── labels ────────────────────────────────────────────────────────────────────
describe('labels', () => {
  it('SCENE_LABELS', () => {
    expect(SCENE_LABELS).toEqual({ focus: 'Focus', sleep: 'Sleep', alloff: 'All Off' })
  })

  it('DEVICE_LABELS', () => {
    expect(DEVICE_LABELS).toEqual({
      lights: 'Lights',
      fan: 'Fan',
      blinds: 'Blinds',
      monitor: 'Monitor',
    })
  })
})

// ── initialState ──────────────────────────────────────────────────────────────
describe('initialState', () => {
  it('defaults to focus', () => {
    expect(initialState()).toEqual({
      monitor: 'on',
      lights: 'on',
      fan: 'low',
      blinds: 'open',
      activeScene: 'focus',
      pose: 'desk',
      headphones: true,
      lastAction: 'Focus scene',
    })
  })

  it('sleep applies sleep preset/pose/headphones', () => {
    expect(initialState('sleep')).toEqual({
      monitor: 'off',
      lights: 'off',
      fan: 'low',
      blinds: 'closed',
      activeScene: 'sleep',
      pose: 'bed',
      headphones: false,
      lastAction: 'Sleep scene',
    })
  })

  it('alloff applies alloff preset; blinds takes base default open (preset omits blinds)', () => {
    expect(initialState('alloff')).toEqual({
      monitor: 'off',
      lights: 'off',
      fan: 'off',
      blinds: 'open',
      activeScene: 'alloff',
      pose: 'desk',
      headphones: false,
      lastAction: 'All Off scene',
    })
  })
})

// ── applyScene ────────────────────────────────────────────────────────────────
describe('applyScene', () => {
  it('focus', () => {
    expect(applyScene(initialState('sleep'), 'focus')).toMatchObject({
      monitor: 'on',
      lights: 'on',
      fan: 'low',
      blinds: 'open',
      activeScene: 'focus',
      pose: 'desk',
      headphones: true,
      lastAction: 'Focus scene',
    })
  })

  it('sleep', () => {
    expect(applyScene(initialState('focus'), 'sleep')).toMatchObject({
      monitor: 'off',
      lights: 'off',
      fan: 'low',
      blinds: 'closed',
      activeScene: 'sleep',
      pose: 'bed',
      headphones: false,
      lastAction: 'Sleep scene',
    })
  })

  it('alloff sets monitor/lights/fan, pose desk, headphones false', () => {
    expect(applyScene(initialState('focus'), 'alloff')).toMatchObject({
      monitor: 'off',
      lights: 'off',
      fan: 'off',
      activeScene: 'alloff',
      pose: 'desk',
      headphones: false,
      lastAction: 'All Off scene',
    })
  })

  it('alloff leaves blinds closed untouched', () => {
    const s = { ...initialState('focus'), blinds: 'closed' as const }
    expect(applyScene(s, 'alloff').blinds).toBe('closed')
  })

  it('alloff leaves blinds open untouched', () => {
    const s = { ...initialState('focus'), blinds: 'open' as const }
    expect(applyScene(s, 'alloff').blinds).toBe('open')
  })
})

// ── cycle helpers ─────────────────────────────────────────────────────────────
describe('nextLights', () => {
  it('off→dim→on→off', () => {
    expect(nextLights('off')).toBe('dim')
    expect(nextLights('dim')).toBe('on')
    expect(nextLights('on')).toBe('off')
  })
})

describe('nextFan', () => {
  it('off→low→high→off', () => {
    expect(nextFan('off')).toBe('low')
    expect(nextFan('low')).toBe('high')
    expect(nextFan('high')).toBe('off')
  })
})

// ── cycleDevice ───────────────────────────────────────────────────────────────
describe('cycleDevice', () => {
  it('lights cycles off→dim→on→off', () => {
    const off = initialState('sleep') // lights off
    const dim = cycleDevice(off, 'lights')
    expect(dim.lights).toBe('dim')
    const on = cycleDevice(dim, 'lights')
    expect(on.lights).toBe('on')
    const back = cycleDevice(on, 'lights')
    expect(back.lights).toBe('off')
  })

  it('fan cycles off→low→high→off', () => {
    const off = initialState('alloff') // fan off
    const low = cycleDevice(off, 'fan')
    expect(low.fan).toBe('low')
    const high = cycleDevice(low, 'fan')
    expect(high.fan).toBe('high')
    const back = cycleDevice(high, 'fan')
    expect(back.fan).toBe('off')
  })

  it('blinds toggles open↔closed', () => {
    const open = initialState('focus') // blinds open
    const closed = cycleDevice(open, 'blinds')
    expect(closed.blinds).toBe('closed')
    expect(cycleDevice(closed, 'blinds').blinds).toBe('open')
  })

  it('monitor toggles on↔off', () => {
    const on = initialState('focus') // monitor on
    const off = cycleDevice(on, 'monitor')
    expect(off.monitor).toBe('off')
    expect(cycleDevice(off, 'monitor').monitor).toBe('on')
  })

  it('sets activeScene to manual', () => {
    expect(cycleDevice(initialState('focus'), 'fan').activeScene).toBe('manual')
  })

  it('lastAction is device label + new value uppercased', () => {
    expect(cycleDevice(initialState('sleep'), 'lights').lastAction).toBe('Lights DIM')
    expect(cycleDevice(initialState('focus'), 'fan').lastAction).toBe('Fan HIGH')
    expect(cycleDevice(initialState('focus'), 'blinds').lastAction).toBe('Blinds CLOSED')
    expect(cycleDevice(initialState('focus'), 'monitor').lastAction).toBe('Monitor OFF')
  })

  it('does not change pose or headphones', () => {
    const base = initialState('focus')
    const next = cycleDevice(base, 'fan')
    expect(next.pose).toBe(base.pose)
    expect(next.headphones).toBe(base.headphones)
  })
})

// ── deviceValue ───────────────────────────────────────────────────────────────
describe('deviceValue', () => {
  it('returns current value string for each device', () => {
    const s = initialState('sleep')
    expect(deviceValue(s, 'lights')).toBe('off')
    expect(deviceValue(s, 'fan')).toBe('low')
    expect(deviceValue(s, 'blinds')).toBe('closed')
    expect(deviceValue(s, 'monitor')).toBe('off')
  })
})

// ── isDeviceActive ────────────────────────────────────────────────────────────
describe('isDeviceActive', () => {
  it('lights !== off', () => {
    expect(isDeviceActive(initialState('focus'), 'lights')).toBe(true) // on
    expect(isDeviceActive(initialState('sleep'), 'lights')).toBe(false) // off
  })

  it('fan !== off', () => {
    expect(isDeviceActive(initialState('focus'), 'fan')).toBe(true) // low
    expect(isDeviceActive(initialState('alloff'), 'fan')).toBe(false) // off
  })

  it('blinds === closed', () => {
    expect(isDeviceActive(initialState('sleep'), 'blinds')).toBe(true) // closed
    expect(isDeviceActive(initialState('focus'), 'blinds')).toBe(false) // open
  })

  it('monitor === on', () => {
    expect(isDeviceActive(initialState('focus'), 'monitor')).toBe(true) // on
    expect(isDeviceActive(initialState('sleep'), 'monitor')).toBe(false) // off
  })
})

describe('FOCUS_ORDER', () => {
  it('is 3 scenes then 4 devices in rail order', () => {
    expect(FOCUS_ORDER).toEqual<FocusItem[]>([
      { kind: 'scene', id: 'focus' },
      { kind: 'scene', id: 'sleep' },
      { kind: 'scene', id: 'alloff' },
      { kind: 'device', id: 'lights' },
      { kind: 'device', id: 'fan' },
      { kind: 'device', id: 'blinds' },
      { kind: 'device', id: 'monitor' },
    ])
  })
})

describe('focusedItem / focusLabel', () => {
  it('returns the item and label at an index', () => {
    expect(focusedItem(0)).toEqual({ kind: 'scene', id: 'focus' })
    expect(focusLabel(0)).toBe('Focus')
    expect(focusedItem(3)).toEqual({ kind: 'device', id: 'lights' })
    expect(focusLabel(3)).toBe('Lights')
    expect(focusLabel(6)).toBe('Monitor')
  })
})

describe('prevLights / prevFan (reverse cycles)', () => {
  it('prevLights goes off->on->dim->off', () => {
    expect(prevLights('off')).toBe('on')
    expect(prevLights('on')).toBe('dim')
    expect(prevLights('dim')).toBe('off')
  })
  it('prevFan goes off->high->low->off', () => {
    expect(prevFan('off')).toBe('high')
    expect(prevFan('high')).toBe('low')
    expect(prevFan('low')).toBe('off')
  })
})

describe('cycleDevice direction', () => {
  it('defaults to forward (dir omitted) unchanged', () => {
    const s = initialState('alloff') // lights off, fan off
    expect(cycleDevice(s, 'lights').lights).toBe('dim')
    expect(cycleDevice(s, 'fan').fan).toBe('low')
  })
  it('steps lights/fan backward with dir -1', () => {
    const s = initialState('alloff')
    expect(cycleDevice(s, 'lights', -1).lights).toBe('on')
    expect(cycleDevice(s, 'fan', -1).fan).toBe('high')
  })
  it('toggles binary monitor/blinds regardless of dir', () => {
    const s = initialState('focus') // monitor on, blinds open
    expect(cycleDevice(s, 'monitor', -1).monitor).toBe('off')
    expect(cycleDevice(s, 'blinds', -1).blinds).toBe('closed')
    expect(cycleDevice(s, 'monitor', 1).monitor).toBe('off')
  })
  it('dir -1 still sets manual + correct lastAction', () => {
    const s = initialState('alloff')
    const n = cycleDevice(s, 'lights', -1)
    expect(n.activeScene).toBe('manual')
    expect(n.lastAction).toBe('Lights ON')
  })
})
