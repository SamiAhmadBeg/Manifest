import { describe, it, expect } from 'vitest'
import { roomVisuals } from './visuals'
import type { SmartRoomState } from './types'

// Build a base state; override per-case. Non-asserted fields are irrelevant.
function makeState(overrides: Partial<SmartRoomState> = {}): SmartRoomState {
  return {
    monitor: 'off',
    lights: 'off',
    fan: 'off',
    blinds: 'open',
    activeScene: 'manual',
    pose: 'desk',
    headphones: false,
    lastAction: '',
    ...overrides,
  }
}

// ── monitor ───────────────────────────────────────────────────────────────────
describe('monitor visuals', () => {
  it('on: monitorScreenBg is blue radial', () => {
    expect(roomVisuals(makeState({ monitor: 'on' })).monitorScreenBg).toBe(
      'radial-gradient(circle at 50% 42%, #5d8ad0, #28406e 55%, #14223c 100%)',
    )
  })

  it('off: monitorScreenBg is dark linear', () => {
    expect(roomVisuals(makeState({ monitor: 'off' })).monitorScreenBg).toBe(
      'linear-gradient(160deg,#22252b,#15171c)',
    )
  })

  it('monitorBloomOp: on=1, off=0', () => {
    expect(roomVisuals(makeState({ monitor: 'on' })).monitorBloomOp).toBe(1)
    expect(roomVisuals(makeState({ monitor: 'off' })).monitorBloomOp).toBe(0)
  })

  it('on: pcLedBg is red radial', () => {
    expect(roomVisuals(makeState({ monitor: 'on' })).pcLedBg).toBe(
      'radial-gradient(circle,#ff6a4d,#e2402f)',
    )
  })

  it('off: pcLedBg is grey', () => {
    expect(roomVisuals(makeState({ monitor: 'off' })).pcLedBg).toBe('#3a3d44')
  })

  it('on: pcLedGlow is red shadow', () => {
    expect(roomVisuals(makeState({ monitor: 'on' })).pcLedGlow).toBe(
      '0 0 8px 2px rgba(226,64,47,0.7)',
    )
  })

  it('off: pcLedGlow is none', () => {
    expect(roomVisuals(makeState({ monitor: 'off' })).pcLedGlow).toBe('none')
  })
})

// ── lamp (shade, glow, pool) ──────────────────────────────────────────────────
describe('lamp visuals', () => {
  it('on: lampShadeBg is warm gradient', () => {
    expect(roomVisuals(makeState({ lights: 'on' })).lampShadeBg).toBe(
      'linear-gradient(180deg,#ffe7be,#eec488)',
    )
  })

  it('dim: lampShadeBg is warm gradient', () => {
    expect(roomVisuals(makeState({ lights: 'dim' })).lampShadeBg).toBe(
      'linear-gradient(180deg,#ffe7be,#eec488)',
    )
  })

  it('off: lampShadeBg is neutral gradient', () => {
    expect(roomVisuals(makeState({ lights: 'off' })).lampShadeBg).toBe(
      'linear-gradient(180deg,#f1efeb,#d4cfc9)',
    )
  })

  it('on: lampGlow is strong amber', () => {
    expect(roomVisuals(makeState({ lights: 'on' })).lampGlow).toBe(
      '0 0 40px 14px rgba(255,196,110,0.55)',
    )
  })

  it('dim: lampGlow is softer amber', () => {
    expect(roomVisuals(makeState({ lights: 'dim' })).lampGlow).toBe(
      '0 0 26px 9px rgba(255,196,110,0.4)',
    )
  })

  it('off: lampGlow is none', () => {
    expect(roomVisuals(makeState({ lights: 'off' })).lampGlow).toBe('none')
  })

  it('lampPoolOp: on=0.6, dim=0.4, off=0', () => {
    expect(roomVisuals(makeState({ lights: 'on' })).lampPoolOp).toBe(0.6)
    expect(roomVisuals(makeState({ lights: 'dim' })).lampPoolOp).toBe(0.4)
    expect(roomVisuals(makeState({ lights: 'off' })).lampPoolOp).toBe(0)
  })
})

// ── blinds ────────────────────────────────────────────────────────────────────
describe('blinds visuals', () => {
  it('closed: repeating stripe gradient', () => {
    expect(roomVisuals(makeState({ blinds: 'closed' })).blindsBg).toBe(
      'repeating-linear-gradient(180deg,#cdbfa9 0 6px,#c0b199 6px 11px)',
    )
  })

  it('open: sky gradient', () => {
    expect(roomVisuals(makeState({ blinds: 'open' })).blindsBg).toBe(
      'linear-gradient(160deg,#cfe0f2,#aac4e0)',
    )
  })
})

// ── fan animation ─────────────────────────────────────────────────────────────
describe('fan visuals', () => {
  it('off: fanAnim is none', () => {
    expect(roomVisuals(makeState({ fan: 'off' })).fanAnim).toBe('none')
  })

  it('low: fanAnim is slow sr-spin', () => {
    expect(roomVisuals(makeState({ fan: 'low' })).fanAnim).toBe(
      'sr-spin 2.1s linear infinite',
    )
  })

  it('high: fanAnim is fast sr-spin', () => {
    expect(roomVisuals(makeState({ fan: 'high' })).fanAnim).toBe(
      'sr-spin 0.8s linear infinite',
    )
  })
})
