import { describe, it, expect } from 'vitest'
import { roomVisuals } from './visuals'
import { initialState, applyScene, cycleDevice } from './state'

// ── lamp (shade, glow, pool) ──────────────────────────────────────────────────
describe('lamp visuals', () => {
  it('off: lampShadeBg is cool grey gradient', () => {
    const s = applyScene(initialState(), 'sleep') // lights off
    const v = roomVisuals(s)
    expect(v.lampShadeBg).toBe('linear-gradient(180deg,#e6e8ec,#cfd2d8)')
  })

  it('dim: lampShadeBg is warm gradient', () => {
    const s = applyScene(initialState(), 'movie') // lights dim
    expect(roomVisuals(s).lampShadeBg).toBe('linear-gradient(180deg,#ffe2b0,#f3b66f)')
  })

  it('on: lampShadeBg is warm gradient', () => {
    const s = applyScene(initialState(), 'focus') // lights on
    expect(roomVisuals(s).lampShadeBg).toBe('linear-gradient(180deg,#ffe2b0,#f3b66f)')
  })

  it('off: lampGlow is transparent zero', () => {
    const s = applyScene(initialState(), 'sleep')
    expect(roomVisuals(s).lampGlow).toBe('0 0 0 0 rgba(0,0,0,0)')
  })

  it('dim: lampGlow is softer amber', () => {
    const s = applyScene(initialState(), 'movie')
    expect(roomVisuals(s).lampGlow).toBe('0 0 26px 9px rgba(245,185,110,0.45)')
  })

  it('on: lampGlow is strong amber', () => {
    const s = applyScene(initialState(), 'focus')
    expect(roomVisuals(s).lampGlow).toBe('0 0 42px 14px rgba(255,176,92,0.6)')
  })

  it('lampPoolOp: off=0, dim=0.42, on=0.6', () => {
    expect(roomVisuals(applyScene(initialState(), 'sleep')).lampPoolOp).toBe(0)
    expect(roomVisuals(applyScene(initialState(), 'movie')).lampPoolOp).toBe(0.42)
    expect(roomVisuals(applyScene(initialState(), 'focus')).lampPoolOp).toBe(0.6)
  })
})

// ── fan animation ─────────────────────────────────────────────────────────────
describe('fan visuals', () => {
  it('off: fanAnim is none', () => {
    const s = applyScene(initialState(), 'alloff')
    expect(roomVisuals(s).fanAnim).toBe('none')
  })

  it('low: fanAnim is slow sr-spin', () => {
    const s = applyScene(initialState(), 'sleep') // fan low
    expect(roomVisuals(s).fanAnim).toBe('sr-spin 2.2s linear infinite')
  })

  it('high: fanAnim is fast sr-spin', () => {
    const s = cycleDevice(applyScene(initialState(), 'sleep'), 'fan', 1) // low→high
    expect(roomVisuals(s).fanAnim).toBe('sr-spin 0.85s linear infinite')
  })
})

// ── blinds ────────────────────────────────────────────────────────────────────
describe('blinds visuals', () => {
  it('closed: repeating stripe gradient', () => {
    const s = applyScene(initialState(), 'movie') // blinds closed
    expect(roomVisuals(s).blindsBg).toBe(
      'repeating-linear-gradient(180deg,#cdbfa9 0 6px,#c0b199 6px 11px)',
    )
  })

  it('open: sky gradient', () => {
    const s = applyScene(initialState(), 'focus') // blinds open
    expect(roomVisuals(s).blindsBg).toBe('linear-gradient(160deg,#cfe0f2,#aac4e0)')
  })
})

// ── speaker ───────────────────────────────────────────────────────────────────
describe('speaker visuals', () => {
  it('on: speakerRingOp=1', () => {
    expect(roomVisuals(applyScene(initialState(), 'movie')).speakerRingOp).toBe(1)
  })

  it('off: speakerRingOp=0', () => {
    expect(roomVisuals(applyScene(initialState(), 'focus')).speakerRingOp).toBe(0)
  })
})

// ── screenGlowOp ─────────────────────────────────────────────────────────────
describe('screenGlowOp', () => {
  it('movie scene → 1', () => {
    expect(roomVisuals(applyScene(initialState(), 'movie')).screenGlowOp).toBe(1)
  })

  it('non-movie scenes → 0.22', () => {
    expect(roomVisuals(applyScene(initialState(), 'focus')).screenGlowOp).toBe(0.22)
    expect(roomVisuals(applyScene(initialState(), 'sleep')).screenGlowOp).toBe(0.22)
    expect(roomVisuals(applyScene(initialState(), 'alloff')).screenGlowOp).toBe(0.22)
  })

  it('manual → 0.22', () => {
    const s = cycleDevice(applyScene(initialState(), 'movie'), 'blinds', 1)
    expect(s.activeScene).toBe('manual')
    expect(roomVisuals(s).screenGlowOp).toBe(0.22)
  })
})

// ── wash ──────────────────────────────────────────────────────────────────────
describe('wash', () => {
  it('movie wash', () => {
    expect(roomVisuals(applyScene(initialState(), 'movie')).wash).toBe(
      'radial-gradient(80% 70% at 62% 80%,rgba(255,180,100,0.18),transparent 60%)',
    )
  })

  it('focus wash', () => {
    expect(roomVisuals(applyScene(initialState(), 'focus')).wash).toBe(
      'radial-gradient(120% 100% at 50% 22%,rgba(255,252,245,0.34),transparent 72%)',
    )
  })

  it('sleep wash', () => {
    expect(roomVisuals(applyScene(initialState(), 'sleep')).wash).toBe(
      'radial-gradient(90% 85% at 50% 55%,rgba(120,150,215,0.2),transparent 66%)',
    )
  })

  it('alloff wash', () => {
    expect(roomVisuals(applyScene(initialState(), 'alloff')).wash).toBe(
      'radial-gradient(100% 100% at 50% 40%,rgba(245,245,248,0.12),transparent 70%)',
    )
  })

  it('manual wash', () => {
    const s = cycleDevice(applyScene(initialState(), 'focus'), 'fan', 1)
    expect(s.activeScene).toBe('manual')
    expect(roomVisuals(s).wash).toBe(
      'radial-gradient(80% 70% at 60% 72%,rgba(255,205,150,0.08),transparent 60%)',
    )
  })
})

// ── vignO ─────────────────────────────────────────────────────────────────────
describe('vignO', () => {
  it('movie=0.34, focus=0.04, sleep=0.46, alloff=0.12', () => {
    expect(roomVisuals(applyScene(initialState(), 'movie')).vignO).toBe(0.34)
    expect(roomVisuals(applyScene(initialState(), 'focus')).vignO).toBe(0.04)
    expect(roomVisuals(applyScene(initialState(), 'sleep')).vignO).toBe(0.46)
    expect(roomVisuals(applyScene(initialState(), 'alloff')).vignO).toBe(0.12)
  })

  it('manual=0.16', () => {
    const s = cycleDevice(applyScene(initialState(), 'focus'), 'lights', 1)
    expect(s.activeScene).toBe('manual')
    expect(roomVisuals(s).vignO).toBe(0.16)
  })
})
