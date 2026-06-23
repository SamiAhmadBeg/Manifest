import { describe, it, expect } from 'vitest'
import {
  initialState,
  applyScene,
  toggleDevice,
  focusPrev,
  focusNext,
  focusedItem,
  activate,
  isDeviceActive,
  FOCUS_ORDER,
} from './state'

describe('applyScene', () => {
  it('movie night: lights dim, blinds closed, speaker on, fan off', () => {
    expect(applyScene(initialState(), 'movie')).toMatchObject({
      activeScene: 'movie', lights: 'dim', blinds: 'closed', fanOn: false, speakerOn: true,
    })
  })
  it('focus: lights on, blinds open, everything else off', () => {
    expect(applyScene(initialState(), 'focus')).toMatchObject({
      activeScene: 'focus', lights: 'on', blinds: 'open', fanOn: false, speakerOn: false,
    })
  })
  it('sleep: lights off, blinds closed, fan on', () => {
    expect(applyScene(initialState(), 'sleep')).toMatchObject({
      activeScene: 'sleep', lights: 'off', blinds: 'closed', fanOn: true, speakerOn: false,
    })
  })
  it('all off: every device cleared', () => {
    expect(applyScene(initialState(), 'alloff')).toMatchObject({
      activeScene: 'alloff', lights: 'off', blinds: 'open', fanOn: false, speakerOn: false,
    })
  })
})

describe('toggleDevice', () => {
  it('sets activeScene to manual', () => {
    const s = toggleDevice(applyScene(initialState(), 'focus'), 'fan')
    expect(s.activeScene).toBe('manual')
  })
  it('dim lights toggle to off', () => {
    expect(toggleDevice(applyScene(initialState(), 'movie'), 'lights').lights).toBe('off')
  })
  it('off lights toggle to on', () => {
    expect(toggleDevice(applyScene(initialState(), 'sleep'), 'lights').lights).toBe('on')
  })
  it('blinds toggle open <-> closed', () => {
    expect(toggleDevice(applyScene(initialState(), 'focus'), 'blinds').blinds).toBe('closed')
  })
  it('speaker toggles boolean', () => {
    expect(toggleDevice(applyScene(initialState(), 'focus'), 'speaker').speakerOn).toBe(true)
  })
})

describe('focus navigation', () => {
  it('prev wraps from first to last', () => {
    expect(focusPrev({ ...initialState(), focusIndex: 0 }).focusIndex).toBe(FOCUS_ORDER.length - 1)
  })
  it('next wraps from last to first', () => {
    expect(focusNext({ ...initialState(), focusIndex: FOCUS_ORDER.length - 1 }).focusIndex).toBe(0)
  })
  it('focusedItem maps index 0 -> movie scene, index 4 -> lights device', () => {
    expect(focusedItem({ ...initialState(), focusIndex: 0 })).toEqual({ kind: 'scene', id: 'movie' })
    expect(focusedItem({ ...initialState(), focusIndex: 4 })).toEqual({ kind: 'device', id: 'lights' })
  })
})

describe('activate', () => {
  it('applies a scene when a scene is focused', () => {
    expect(activate({ ...initialState(), focusIndex: 0 }).activeScene).toBe('movie')
  })
  it('toggles a device (and goes manual) when a device is focused', () => {
    const base = applyScene(initialState(), 'focus') // fan off
    const s = activate({ ...base, focusIndex: 5 }) // index 5 = fan
    expect(s.fanOn).toBe(true)
    expect(s.activeScene).toBe('manual')
  })
})

describe('state invariants', () => {
  it('re-applying the same scene yields the same device state', () => {
    const once = applyScene(initialState(), 'movie')
    const twice = applyScene(once, 'movie')
    expect(twice).toEqual(once)
  })
  it('applyScene preserves focusIndex', () => {
    const base = { ...initialState(), focusIndex: 6 }
    expect(applyScene(base, 'sleep').focusIndex).toBe(6)
  })
  it('toggleDevice preserves focusIndex', () => {
    const base = { ...initialState(), focusIndex: 5 }
    expect(toggleDevice(base, 'fan').focusIndex).toBe(5)
  })
})

describe('isDeviceActive', () => {
  it('returns true for lights when dim', () => {
    expect(isDeviceActive(applyScene(initialState(), 'movie'), 'lights')).toBe(true)
  })
  it('returns false for lights when off', () => {
    expect(isDeviceActive(applyScene(initialState(), 'sleep'), 'lights')).toBe(false)
  })
})
