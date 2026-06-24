'use client'

import type { CSSProperties } from 'react'
import type { SmartRoomState } from '@/lib/smart-room/types'
import { roomVisuals } from '@/lib/smart-room/visuals'
import { SCENE_LABELS } from '@/lib/smart-room/state'

/* ── Face descriptor ──
   Each visible box face becomes one absolutely-positioned div inside the
   preserve-3d wrapper. Ported from the prototype's box/top/fx/fy helpers. */
interface Face {
  transform: string
  width: number
  height: number
  background: string
  borderRadius?: string
  boxShadow?: string
  opacity?: number
  border?: string
}

/* 3-tone palette triple (top lightest, side-x, side-y darker) */
interface Tone {
  t: string
  x: string
  y: string
}

interface FaceOpts {
  rad?: string
  sh?: string
  op?: number
  bd?: string
}

/* Builds the face array. A local closure over `faces` keeps the
   prototype's terse box/top/fx/fy authoring style. */
function buildScene(state: SmartRoomState, v: ReturnType<typeof roomVisuals>): Face[] {
  const faces: Face[] = []

  const push = (transform: string, w: number, h: number, background: string, o: FaceOpts = {}) => {
    faces.push({
      transform,
      width: w,
      height: h,
      background,
      borderRadius: o.rad,
      boxShadow: o.sh,
      opacity: o.op,
      border: o.bd,
    })
  }

  const top = (x: number, y: number, z: number, sx: number, sy: number, bg: string, o?: FaceOpts) =>
    push(`translate3d(${x}px,${y}px,${z}px)`, sx, sy, bg, o)

  const fx = (X0: number, y: number, z0: number, sy: number, sz: number, bg: string, o?: FaceOpts) =>
    push(`translate3d(${X0}px,${y}px,${z0 + sz}px) rotateY(90deg)`, sz, sy, bg, o)

  const fy = (x: number, Y0: number, z0: number, sx: number, sz: number, bg: string, o?: FaceOpts) =>
    push(`translate3d(${x}px,${Y0}px,${z0 + sz}px) rotateX(-90deg)`, sx, sz, bg, o)

  const box = (
    x: number,
    y: number,
    z0: number,
    sx: number,
    sy: number,
    sz: number,
    c: Tone,
    o?: FaceOpts,
  ) => {
    top(x, y, z0 + sz, sx, sy, c.t, o)
    fx(x + sx, y, z0, sy, sz, c.x, o)
    fy(x, y + sy, z0, sx, sz, c.y, o)
  }

  // ── Room palette (README "Room palette") ──
  const WOOD: Tone = { t: '#c9a36d', x: '#b58f59', y: '#9b7846' }
  const WOOD2: Tone = { t: '#b98f5c', x: '#a67e4c', y: '#8c6840' }
  const DUVET: Tone = { t: '#f5f3f0', x: '#e7e3de', y: '#d8d3cd' }
  const PILL: Tone = { t: '#fcfbf9', x: '#f0ede9', y: '#e3dfd9' }
  const WHITE: Tone = { t: '#eeece8', x: '#ded9d4', y: '#cbc6c0' }
  const DARK: Tone = { t: '#34373d', x: '#2a2d33', y: '#1f2228' }
  const CHAIR: Tone = { t: '#5b6068', x: '#4d525a', y: '#40454c' }
  const BASE: Tone = { t: '#cdc8c2', x: '#bdb8b2', y: '#aca7a1' }

  // ── Character palette (README "Character") ──
  const SKIN: Tone = { t: '#e8b98f', x: '#d9a87d', y: '#c8945f' }
  const HAIR: Tone = { t: '#42301f', x: '#37281a', y: '#2c2015' }
  const SHIRT: Tone = { t: '#34b1ab', x: '#2c9893', y: '#247f7b' } // teal
  const PANTS: Tone = { t: '#4850a8', x: '#3e4592', y: '#343a7c' } // indigo jeans
  const SHOE: Tone = { t: '#3a3d44', x: '#303238', y: '#26282d' }

  // lamp shade tone driven by lights state (matches v.lampShadeBg colors)
  const lightsOn = state.lights !== 'off'
  const SHADEon: Tone = { t: '#ffe7be', x: '#f7d59c', y: '#eec488' }
  const SHADEoff: Tone = { t: '#f1efeb', x: '#e3dfda', y: '#d4cfc9' }
  const lampShade = lightsOn ? SHADEon : SHADEoff

  const monOn = state.monitor === 'on'
  const blindsClosed = state.blinds === 'closed'
  const pose = state.pose

  const X = 360
  const Y = 360
  const H = 230
  const T = 10

  // ── base plinth + floor ──
  box(-T, -T, -16, X + 2 * T, Y + 2 * T, 14, BASE)
  top(
    0,
    0,
    0,
    X,
    Y,
    'repeating-linear-gradient(0deg, rgba(78,50,26,0.12) 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, rgba(78,50,26,0.07) 0 1px, transparent 1px 46px), linear-gradient(135deg,#bf9f76,#a9885e)',
  )

  // ── walls ──
  fy(0, 0, 0, X, H, 'linear-gradient(180deg,#e4dfd9,#d7d1cb)')
  fx(0, 0, 0, Y, H, 'linear-gradient(180deg,#ece8e3,#dfdad4)')
  top(0, -T, H, X, T, '#f2efeb')
  top(-T, 0, H, T, Y, '#f5f2ee')
  fy(0, -T, 0, X, H, '#cfc9c2')
  fx(-T, 0, 0, Y, H, '#d4cec7')

  // ── LEFT WALL: window + blinds + sill + shelves ──
  box(0, 84, 110, 18, 122, 6, WOOD2)
  fx(3, 82, 116, 124, 96, '#8a6f4c')
  if (blindsClosed) {
    fx(7, 90, 122, 108, 82, v.blindsBg, { bd: '4px solid #7c6243', rad: '2px' })
  } else {
    // open: blue sky upper + warm sill lower
    fx(
      7,
      90,
      122,
      108,
      82,
      'linear-gradient(180deg,#bfe0f5 0%,#dcecf6 58%,#cdbb9d 58%,#bda77f 100%)',
      { bd: '4px solid #7c6243', rad: '2px' },
    )
  }
  box(0, 214, 150, 24, 104, 9, WOOD2)
  box(0, 214, 116, 24, 104, 9, WOOD2)

  // ── RIGHT WALL: picture frames ──
  fy(238, 3, 152, 42, 48, '#dad5ce', { bd: '3px solid #c9a36d' })
  fy(286, 3, 152, 42, 48, '#dad5ce', { bd: '3px solid #c9a36d' })

  // ── BED ──
  box(54, 2, 0, 162, 14, 122, WOOD) // headboard
  box(54, 16, 0, 162, 214, 30, WOOD) // frame
  box(64, 18, 30, 68, 22, 18, PILL) // pillow 1
  box(138, 18, 30, 66, 22, 18, PILL) // pillow 2
  if (pose === 'bed') {
    box(96, 64, 40, 80, 156, 13, DUVET, { rad: '12px' }) // body mound under blanket
    box(60, 48, 30, 150, 172, 22, DUVET) // blanket pulled to chin
    // sleeping Steve: head only, face up
    box(120, 25, 48, 23, 22, 18, SKIN, { rad: '4px' }) // head cube
    fx(143.2, 25, 48, 11, 18, '#352617') // hair right side
    top(120, 25, 66.4, 23, 8, '#3a2a1c') // hair crown
    top(124, 36, 66.6, 7, 3.6, '#2a221b') // closed eye L
    top(134, 36, 66.6, 7, 3.6, '#2a221b') // closed eye R
    top(127, 42, 66.6, 8, 2.4, '#9c6a47') // mouth
  } else {
    box(60, 42, 30, 150, 178, 22, DUVET) // made bed
  }

  // ── DESK + MONITOR ──
  box(236, 8, 0, 106, 82, 62, WHITE)
  box(276, 44, 62, 8, 6, 14, DARK) // monitor stand
  top(258, 44, 108, 56, 9, DARK.t)
  fx(314, 44, 76, 9, 32, DARK.x)
  fy(258, 53, 76, 56, 32, v.monitorScreenBg, { bd: '3px solid #111317', rad: '2px' }) // screen
  fy(258, 53.4, 76, 56, 32, 'radial-gradient(circle at 50% 45%,rgba(130,175,255,0.85),transparent 68%)', {
    op: v.monitorBloomOp,
  }) // soft blue bloom overlay

  // ── PC TOWER (right of monitor) ──
  const TOWER: Tone = { t: '#2d3036', x: '#24272c', y: '#1b1d22' }
  box(316, 48, 62, 20, 36, 58, TOWER) // body
  fy(318, 84, 66, 16, 48, 'repeating-linear-gradient(0deg,#34373d 0 2px,#1d1f24 2px 6px)') // front vents
  fy(320, 84.3, 108, 5, 5, v.pcLedBg, { sh: v.pcLedGlow, rad: '50%' }) // power LED

  // ── KEYBOARD ──
  box(262, 70, 62, 50, 16, 3, { t: '#3a3d44', x: '#2f3137', y: '#26282d' })
  top(
    264,
    72,
    65.3,
    46,
    12,
    'repeating-linear-gradient(90deg,#4a4d54 0 5px,#34373d 5px 6px), repeating-linear-gradient(0deg,#4a4d54 0 4px,#34373d 4px 5px)',
  )

  // ── DESK CHAIR ──
  box(272, 104, 0, 4, 4, 28, CHAIR)
  box(306, 104, 0, 4, 4, 28, CHAIR)
  box(272, 132, 0, 4, 4, 28, CHAIR)
  box(306, 132, 0, 4, 4, 28, CHAIR)
  box(270, 102, 28, 40, 36, 6, CHAIR) // seat
  box(270, 132, 34, 40, 6, 44, CHAIR) // backrest

  // ── SEATED STEVE (desk pose) ──
  if (pose === 'desk') {
    box(280, 84, 0, 9, 9, 36, PANTS) // shin L
    box(298, 84, 0, 9, 9, 36, PANTS) // shin R
    box(279, 78, 0, 11, 9, 8, SHOE) // shoe L
    box(297, 78, 0, 11, 9, 8, SHOE) // shoe R
    box(280, 84, 36, 9, 28, 12, PANTS) // thigh L
    box(298, 84, 36, 9, 28, 12, PANTS) // thigh R
    box(279, 108, 36, 24, 18, 14, PANTS) // hips on seat
    box(280, 112, 50, 23, 15, 31, SHIRT) // torso
    box(279, 86, 60, 8, 28, 9, SHIRT, { rad: '2px' }) // arm L to desk
    box(303, 86, 60, 8, 28, 9, SHIRT, { rad: '2px' }) // arm R to desk
    box(280, 82, 60, 7, 8, 8, SKIN, { rad: '2px' }) // hand L
    box(303, 82, 60, 7, 8, 8, SKIN, { rad: '2px' }) // hand R
    box(282, 113, 81, 20, 18, 21, SKIN, { rad: '3px' }) // head
    box(281, 112, 97, 22, 19, 7, HAIR, { rad: '3px' }) // hair top cap
    box(281, 128, 81, 22, 4, 19, HAIR) // back-of-head hair
    box(301, 113, 81, 2, 18, 19, HAIR) // side hair strip
    if (state.headphones) {
      box(279, 116, 99, 26, 14, 6, SHOE, { rad: '3px' }) // band
      box(278, 117, 84, 5, 13, 15, SHOE, { rad: '2px' }) // ear cup L
      box(301, 117, 84, 5, 13, 15, SHOE, { rad: '2px' }) // ear cup R
    }
  }

  // ── FLOOR LAMP ──
  box(337, 17, 0, 18, 18, 7, DARK) // base
  box(343, 23, 7, 6, 6, 150, WOOD2) // pole
  box(332, 12, 157, 28, 28, 26, lampShade, lightsOn ? { sh: v.lampGlow } : {}) // shade

  // ── FAN motor ──
  box(126, 112, 204, 18, 18, 10, DARK)

  return faces
}

/* Isometric projection — mirrors CSS rotateX(58) rotateZ(45), scale 0.96.
   Used to anchor the flat ZZZ overlay to the sleeping head in 3D. */
function proj(x: number, y: number, z: number): { x: number; y: number } {
  const S = 0.96
  const c45 = 0.70711
  const s45 = 0.70711
  const c58 = 0.52992
  const s58 = 0.84805
  const cx = x - 180
  const cy = y - 180
  const cz = z
  const ax = cx * c45 - cy * s45
  const ay = cx * s45 + cy * c45
  return { x: ax * S, y: (ay * c58 - cz * s58) * S }
}

export function RoomStage({ state }: { state: SmartRoomState }) {
  const v = roomVisuals(state)
  const faces = buildScene(state, v)

  const sceneLabel =
    state.activeScene === 'manual' ? 'Manual' : SCENE_LABELS[state.activeScene]

  const sleeping = state.pose === 'bed'
  const head = proj(131, 30, 66)

  // face style mapper (indices used so the screen bloom + LED can animate)
  const faceStyle = (f: Face): CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: `${f.width}px`,
    height: `${f.height}px`,
    transform: f.transform,
    transformOrigin: '0 0',
    background: f.background,
    borderRadius: f.borderRadius,
    boxShadow: f.boxShadow,
    opacity: f.opacity,
    border: f.border,
    backfaceVisibility: 'hidden',
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(120% 100% at 50% 28%, #dedad5, #c5c0ba)',
      }}
    >
      {/* ISO STAGE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          perspective: '1900px',
          perspectiveOrigin: '50% 47%',
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: 'scale(0.96) rotateX(58deg) rotateZ(45deg)',
          }}
        >
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translate3d(-180px,-180px,0)',
            }}
          >
            {faces.map((f, i) => (
              <div key={i} style={faceStyle(f)} />
            ))}

            {/* breathing screen bloom (extra soft glow, on top of bloom face) */}
            <div
              data-sr-anim=""
              style={{
                ...faceStyle({
                  transform: 'translate3d(258px,53.4px,108px) rotateX(-90deg)',
                  width: 56,
                  height: 32,
                  background:
                    'radial-gradient(circle at 50% 45%,rgba(120,165,245,0.55),transparent 72%)',
                }),
                opacity: v.monitorBloomOp,
                animation: 'sr-breathe 4s ease-in-out infinite',
              }}
            />

            {/* warm floor light-pool from lamp (breathing) */}
            <div
              data-sr-anim=""
              style={{
                ...faceStyle({
                  transform: 'translate3d(286px,4px,1.5px)',
                  width: 120,
                  height: 120,
                  background:
                    'radial-gradient(circle,rgba(255,202,120,0.85),transparent 66%)',
                  borderRadius: '50%',
                }),
                opacity: v.lampPoolOp,
                animation: 'sr-breathe 5s ease-in-out infinite',
              }}
            />

            {/* CEILING FAN — hub group, blade group spins */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate3d(135px,121px,214px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                data-sr-anim=""
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  animation: v.fanAnim,
                }}
              >
                {[8, 128, 248].map((deg) => (
                  <div
                    key={deg}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 52,
                      height: 12,
                      borderRadius: 6,
                      background: 'linear-gradient(180deg,#d9d5d8,#bdb9bc)',
                      transformOrigin: '0 50%',
                      transform: `rotate(${deg}deg) translate(-3px,-6px)`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    left: -11,
                    top: -11,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#a8a5a8',
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.08)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* flat overlays anchored to 3D points (ZZZ) */}
        {sleeping && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `calc(50% + ${Math.round(head.x + 14)}px)`,
                top: `calc(50% + ${Math.round(head.y - 8)}px)`,
                transform: 'translate(-50%,-50%)',
                width: 60,
                height: 50,
              }}
            >
              <span
                data-sr-anim=""
                style={{
                  position: 'absolute',
                  left: 2,
                  top: 30,
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#7a7d84',
                  animation: 'sr-zzz 2.8s ease-in-out infinite',
                }}
              >
                z
              </span>
              <span
                data-sr-anim=""
                style={{
                  position: 'absolute',
                  left: 13,
                  top: 18,
                  fontWeight: 700,
                  fontSize: 21,
                  color: '#63666d',
                  animation: 'sr-zzz 2.8s ease-in-out infinite .9s',
                }}
              >
                z
              </span>
              <span
                data-sr-anim=""
                style={{
                  position: 'absolute',
                  left: 28,
                  top: 2,
                  fontWeight: 700,
                  fontSize: 28,
                  color: '#4f525a',
                  animation: 'sr-zzz 2.8s ease-in-out infinite 1.8s',
                }}
              >
                z
              </span>
            </div>
          </div>
        )}
      </div>

      {/* uniform neutral wash — SAME for every scene, never darkens per scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 14,
          pointerEvents: 'none',
          background:
            'radial-gradient(100% 90% at 50% 40%,rgba(252,250,247,0.10),transparent 72%)',
        }}
      />
      {/* faint uniform vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 14,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%,transparent 42%,rgba(18,15,12,1) 132%)',
          opacity: 0.06,
        }}
      />

      {/* scene caption */}
      <div style={{ position: 'absolute', left: 28, top: 24, zIndex: 20 }}>
        <div
          style={{
            fontFamily: "'Geist Mono',monospace",
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.72)',
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}
        >
          Active scene
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#fff',
            textShadow: '0 2px 14px rgba(0,0,0,0.5)',
          }}
        >
          {sceneLabel}
        </div>
      </div>
    </div>
  )
}
