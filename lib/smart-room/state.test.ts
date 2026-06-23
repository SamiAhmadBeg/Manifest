import { describe, it, expect } from 'vitest'
import {
  initialState,
  applyScene,
  cycleDevice,
  cycle,
  deviceValue,
  focusPrev,
  focusNext,
  focusedItem,
  isDeviceActive,
  nextLights,
  prevLights,
  nextFan,
  prevFan,
  FOCUS_ORDER,
} from './state'

// ── applyScene ────────────────────────────────────────────────────────────────
describe('applyScene', () => {
  it('movie: lights dim, blinds closed, fan off, speaker on', () => {
    expect(applyScene(initialState(), 'movie')).toMatchObject({
      activeScene: 'movie',
      lights: 'dim',
      blinds: 'closed',
      fan: 'off',
      speaker: 'on',
    })
  })

  it('focus: lights on, blinds open, fan off, speaker off', () => {
    expect(applyScene(initialState(), 'focus')).toMatchObject({
      activeScene: 'focus',
      lights: 'on',
      blinds: 'open',
      fan: 'off',
      speaker: 'off',
    })
  })

  it('sleep: lights off, blinds closed, fan low, speaker off', () => {
    expect(applyScene(initialState(), 'sleep')).toMatchObject({
      activeScene: 'sleep',
      lights: 'off',
      blinds: 'closed',
      fan: 'low',
      speaker: 'off',
    })
  })

  it('alloff: lights off, blinds open, fan off, speaker off', () => {
    expect(applyScene(initialState(), 'alloff')).toMatchObject({
      activeScene: 'alloff',
      lights: 'off',
      blinds: 'open',
      fan: 'off',
      speaker: 'off',
    })
  })

  it('preserves focusIndex', () => {
    const base = { ...initialState(), focusIndex: 6 }
    expect(applyScene(base, 'sleep').focusIndex).toBe(6)
  })
})

// ── lights cycle helpers ──────────────────────────────────────────────────────
describe('nextLights / prevLights', () => {
  it('next: off→dim→on→off', () => {
    expect(nextLights('off')).toBe('dim')
    expect(nextLights('dim')).toBe('on')
    expect(nextLights('on')).toBe('off')
  })

  it('prev: off→on→dim→off (mirror of next)', () => {
    expect(prevLights('off')).toBe('on')
    expect(prevLights('on')).toBe('dim')
    expect(prevLights('dim')).toBe('off')
  })
})

// ── fan cycle helpers ─────────────────────────────────────────────────────────
describe('nextFan / prevFan', () => {
  it('next: off→low→high→off', () => {
    expect(nextFan('off')).toBe('low')
    expect(nextFan('low')).toBe('high')
    expect(nextFan('high')).toBe('off')
  })

  it('prev: off→high→low→off (mirror of next)', () => {
    expect(prevFan('off')).toBe('high')
    expect(prevFan('high')).toBe('low')
    expect(prevFan('low')).toBe('off')
  })
})

// ── cycleDevice ───────────────────────────────────────────────────────────────
describe('cycleDevice', () => {
  it('sets activeScene to manual', () => {
    const s = cycleDevice(applyScene(initialState(), 'focus'), 'fan', 1)
    expect(s.activeScene).toBe('manual')
  })

  it('preserves focusIndex', () => {
    const base = { ...initialState(), focusIndex: 5 }
    expect(cycleDevice(base, 'fan', 1).focusIndex).toBe(5)
  })

  it('lights dir=1: off→dim→on→off', () => {
    const off = applyScene(initialState(), 'sleep') // lights off
    const dim = cycleDevice(off, 'lights', 1)
    expect(dim.lights).toBe('dim')
    const on = cycleDevice(dim, 'lights', 1)
    expect(on.lights).toBe('on')
    const back = cycleDevice(on, 'lights', 1)
    expect(back.lights).toBe('off')
  })

  it('lights dir=-1: off→on→dim→off', () => {
    const off = applyScene(initialState(), 'sleep')
    const on = cycleDevice(off, 'lights', -1)
    expect(on.lights).toBe('on')
    const dim = cycleDevice(on, 'lights', -1)
    expect(dim.lights).toBe('dim')
    const back = cycleDevice(dim, 'lights', -1)
    expect(back.lights).toBe('off')
  })

  it('fan dir=1: off→low→high→off', () => {
    const s0 = applyScene(initialState(), 'alloff') // fan off
    const s1 = cycleDevice(s0, 'fan', 1)
    expect(s1.fan).toBe('low')
    const s2 = cycleDevice(s1, 'fan', 1)
    expect(s2.fan).toBe('high')
    const s3 = cycleDevice(s2, 'fan', 1)
    expect(s3.fan).toBe('off')
  })

  it('fan dir=-1: off→high→low→off', () => {
    const s0 = applyScene(initialState(), 'alloff')
    const s1 = cycleDevice(s0, 'fan', -1)
    expect(s1.fan).toBe('high')
    const s2 = cycleDevice(s1, 'fan', -1)
    expect(s2.fan).toBe('low')
    const s3 = cycleDevice(s2, 'fan', -1)
    expect(s3.fan).toBe('off')
  })

  it('blinds toggles open→closed (dir ignored)', () => {
    const s = applyScene(initialState(), 'focus') // blinds open
    expect(cycleDevice(s, 'blinds', 1).blinds).toBe('closed')
    expect(cycleDevice(s, 'blinds', -1).blinds).toBe('closed')
  })

  it('blinds toggles closed→open', () => {
    const s = applyScene(initialState(), 'movie') // blinds closed
    expect(cycleDevice(s, 'blinds', 1).blinds).toBe('open')
  })

  it('speaker toggles off→on (dir ignored)', () => {
    const s = applyScene(initialState(), 'focus') // speaker off
    expect(cycleDevice(s, 'speaker', 1).speaker).toBe('on')
    expect(cycleDevice(s, 'speaker', -1).speaker).toBe('on')
  })

  it('speaker toggles on→off', () => {
    const s = applyScene(initialState(), 'movie') // speaker on
    expect(cycleDevice(s, 'speaker', 1).speaker).toBe('off')
  })
})

// ── cycle (dispatch) ──────────────────────────────────────────────────────────
describe('cycle', () => {
  it('applies scene when a scene is focused (focusIndex 0 = movie)', () => {
    const base = { ...applyScene(initialState(), 'sleep'), focusIndex: 0 }
    const next = cycle(base, 1)
    expect(next.activeScene).toBe('movie')
    expect(next.lights).toBe('dim')
  })

  it('applies scene regardless of dir', () => {
    const base = { ...initialState(), focusIndex: 2 } // sleep
    expect(cycle(base, 1).activeScene).toBe('sleep')
    expect(cycle(base, -1).activeScene).toBe('sleep')
  })

  it('cycles a device when a device is focused', () => {
    // focusIndex 4 = lights, start with 'off' (sleep scene)
    const base = { ...applyScene(initialState(), 'sleep'), focusIndex: 4 }
    const next = cycle(base, 1)
    expect(next.lights).toBe('dim')
    expect(next.activeScene).toBe('manual')
  })
})

// ── focus navigation ──────────────────────────────────────────────────────────
describe('focus navigation', () => {
  it('prev wraps from index 0 to last', () => {
    expect(focusPrev({ ...initialState(), focusIndex: 0 }).focusIndex).toBe(FOCUS_ORDER.length - 1)
  })

  it('next wraps from last to index 0', () => {
    expect(focusNext({ ...initialState(), focusIndex: FOCUS_ORDER.length - 1 }).focusIndex).toBe(0)
  })

  it('focusedItem: index 0 → movie scene', () => {
    expect(focusedItem({ ...initialState(), focusIndex: 0 })).toEqual({ kind: 'scene', id: 'movie' })
  })

  it('focusedItem: index 4 → lights device', () => {
    expect(focusedItem({ ...initialState(), focusIndex: 4 })).toEqual({ kind: 'device', id: 'lights' })
  })
})

// ── isDeviceActive ────────────────────────────────────────────────────────────
describe('isDeviceActive', () => {
  it('lights: dim → true', () => {
    expect(isDeviceActive(applyScene(initialState(), 'movie'), 'lights')).toBe(true)
  })

  it('lights: on → true', () => {
    expect(isDeviceActive(applyScene(initialState(), 'focus'), 'lights')).toBe(true)
  })

  it('lights: off → false', () => {
    expect(isDeviceActive(applyScene(initialState(), 'sleep'), 'lights')).toBe(false)
  })

  it('fan: low → true', () => {
    expect(isDeviceActive(applyScene(initialState(), 'sleep'), 'fan')).toBe(true)
  })

  it('fan: high → true', () => {
    const s = cycleDevice(applyScene(initialState(), 'sleep'), 'fan', 1) // low→high
    expect(isDeviceActive(s, 'fan')).toBe(true)
  })

  it('fan: off → false', () => {
    expect(isDeviceActive(applyScene(initialState(), 'alloff'), 'fan')).toBe(false)
  })

  it('blinds: closed → true (inverted semantics)', () => {
    expect(isDeviceActive(applyScene(initialState(), 'movie'), 'blinds')).toBe(true)
  })

  it('blinds: open → false', () => {
    expect(isDeviceActive(applyScene(initialState(), 'focus'), 'blinds')).toBe(false)
  })

  it('speaker: on → true', () => {
    expect(isDeviceActive(applyScene(initialState(), 'movie'), 'speaker')).toBe(true)
  })

  it('speaker: off → false', () => {
    expect(isDeviceActive(applyScene(initialState(), 'focus'), 'speaker')).toBe(false)
  })
})

// ── deviceValue ───────────────────────────────────────────────────────────────
describe('deviceValue', () => {
  it('returns current value string for each device', () => {
    const s = applyScene(initialState(), 'sleep')
    expect(deviceValue(s, 'lights')).toBe('off')
    expect(deviceValue(s, 'fan')).toBe('low')
    expect(deviceValue(s, 'blinds')).toBe('closed')
    expect(deviceValue(s, 'speaker')).toBe('off')
  })
})
