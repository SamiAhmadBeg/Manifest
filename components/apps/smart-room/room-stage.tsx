'use client'

import type { SmartRoomState } from '@/lib/smart-room/types'
import { roomVisuals } from '@/lib/smart-room/visuals'
import { focusedItem, SCENE_LABELS } from '@/lib/smart-room/state'

export function RoomStage({ state }: { state: SmartRoomState }) {
  const v = roomVisuals(state)
  const focused = focusedItem(state)
  const fdev = focused.kind === 'device' ? focused.id : null

  const sceneLabel =
    state.activeScene === 'manual' ? 'Manual' : SCENE_LABELS[state.activeScene]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#d9d4ce',
      }}
    >
      {/* ceiling */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'polygon(0 0,100% 0,72% 22%,28% 22%)',
          background: 'linear-gradient(180deg,#eceaed,#e2e0e4)',
        }}
      />

      {/* left wall */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'polygon(0 0,28% 22%,28% 78%,0 100%)',
          background: 'linear-gradient(90deg,#cfccce,#e0dddf)',
        }}
      />

      {/* right wall */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'polygon(100% 0,72% 22%,72% 78%,100% 100%)',
          background: 'linear-gradient(270deg,#cfccce,#e0dddf)',
        }}
      />

      {/* floor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'polygon(0 100%,28% 78%,72% 78%,100% 100%)',
          background: 'linear-gradient(180deg,#d3cdc5,#c7c0b7)',
        }}
      />

      {/* back wall */}
      <div
        style={{
          position: 'absolute',
          left: '28%',
          right: '28%',
          top: '22%',
          bottom: '22%',
          background: 'linear-gradient(180deg,#e9e6e3,#ded9d4)',
          boxShadow: 'inset 0 0 60px rgba(20,22,30,0.05)',
        }}
      />

      {/* floor seam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '78%',
          height: 1,
          background: 'rgba(20,22,30,0.07)',
        }}
      />

      {/* WINDOW + BLINDS */}
      <div
        style={{
          position: 'absolute',
          left: '31.5%',
          top: '30%',
          width: '13%',
          height: '30%',
        }}
      >
        {fdev === 'blinds' && (
          <div
            style={{
              position: 'absolute',
              inset: -9,
              borderRadius: 14,
              boxShadow: '0 0 0 2px #e23b2e,0 0 0 8px rgba(226,59,46,0.12)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            border: '1px solid #b6a78f',
            boxShadow: '0 6px 16px -6px rgba(20,22,30,0.3)',
            background: v.blindsBg,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              background:
                'linear-gradient(120deg,rgba(255,255,255,0.25),transparent 50%)',
            }}
          />
        </div>
      </div>

      {/* SCREEN */}
      <div
        style={{
          position: 'absolute',
          left: '49%',
          top: '30%',
          width: '18%',
          height: '26%',
          borderRadius: 7,
          background: 'linear-gradient(160deg,#2a3550,#10141f)',
          border: '1px solid rgba(20,22,30,0.35)',
          boxShadow:
            '0 10px 30px -8px rgba(40,70,130,0.5),0 0 60px 6px rgba(70,110,190,0.24)',
          overflow: 'hidden',
        }}
      >
        <div
          data-sr-anim=""
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 90% at 50% 40%,rgba(120,160,235,0.5),transparent 70%)',
            animation: 'sr-breathe 4s ease-in-out infinite',
            opacity: v.screenGlowOp,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '34%',
            background:
              'linear-gradient(180deg,transparent,rgba(10,14,24,0.6))',
          }}
        />
      </div>

      {/* screen spill */}
      <div
        style={{
          position: 'absolute',
          left: '44%',
          top: '26%',
          width: '28%',
          height: '36%',
          background:
            'radial-gradient(60% 60% at 60% 50%,rgba(90,130,210,0.16),transparent 72%)',
          pointerEvents: 'none',
          opacity: v.screenGlowOp,
        }}
      />

      {/* FAN */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '12%',
          width: 96,
          height: 110,
          transform: 'translateX(-50%)',
        }}
      >
        {fdev === 'fan' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -9,
              width: 114,
              height: 114,
              transform: 'translateX(-50%)',
              borderRadius: 20,
              boxShadow: '0 0 0 2px #e23b2e,0 0 0 8px rgba(226,59,46,0.12)',
            }}
          />
        )}
        {/* stem */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 4,
            height: 14,
            background: '#b9b6b9',
            transform: 'translateX(-50%)',
            borderRadius: 2,
          }}
        />
        {/* blade area */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 14,
            width: 84,
            height: 84,
            transform: 'translateX(-50%)',
          }}
        >
          {/* spinning wrapper */}
          <div
            data-sr-anim=""
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'center',
              animation: v.fanAnim,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 36,
                height: 15,
                borderRadius: '3px 10px 10px 3px',
                background: 'linear-gradient(90deg,#bdb9bc,#d8d4d7)',
                transformOrigin: '0 50%',
                transform: 'translateY(-50%) rotate(10deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 36,
                height: 15,
                borderRadius: '3px 10px 10px 3px',
                background: 'linear-gradient(90deg,#bdb9bc,#d8d4d7)',
                transformOrigin: '0 50%',
                transform: 'translateY(-50%) rotate(130deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 36,
                height: 15,
                borderRadius: '3px 10px 10px 3px',
                background: 'linear-gradient(90deg,#bdb9bc,#d8d4d7)',
                transformOrigin: '0 50%',
                transform: 'translateY(-50%) rotate(250deg)',
              }}
            />
          </div>
          {/* hub */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 15,
              height: 15,
              background: '#a8a5a8',
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
              boxShadow: '0 1px 2px rgba(20,22,30,0.2)',
            }}
          />
        </div>
      </div>

      {/* FLOOR LAMP */}
      <div
        style={{
          position: 'absolute',
          left: '79%',
          top: '46%',
          width: 120,
          height: 240,
        }}
      >
        {/* warm pool */}
        <div
          data-sr-anim=""
          style={{
            position: 'absolute',
            left: '50%',
            top: -8,
            width: 300,
            height: 300,
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle,rgba(255,176,92,0.9),rgba(255,176,92,0.25) 42%,transparent 70%)',
            pointerEvents: 'none',
            animation: 'sr-breathe 5s ease-in-out infinite',
            opacity: v.lampPoolOp,
          }}
        />
        {/* pole */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 4,
            height: 150,
            background: 'linear-gradient(180deg,#b7b3b6,#9d9a9d)',
            transform: 'translateX(-50%)',
            borderRadius: 2,
          }}
        />
        {/* base shadow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -3,
            width: 46,
            height: 12,
            background: 'rgba(20,22,30,0.14)',
            filter: 'blur(3px)',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        {/* shade */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 42,
            width: 58,
            height: 46,
            transform: 'translateX(-50%)',
            borderRadius: '8px 8px 4px 4px',
            background: v.lampShadeBg,
            boxShadow: v.lampGlow,
          }}
        />
        {/* focus halo for lights */}
        {fdev === 'lights' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 32,
              width: 96,
              height: 96,
              transform: 'translateX(-50%)',
              borderRadius: 18,
              boxShadow: '0 0 0 2px #e23b2e,0 0 0 8px rgba(226,59,46,0.12)',
            }}
          />
        )}
      </div>

      {/* SPEAKER */}
      <div
        style={{
          position: 'absolute',
          left: '14%',
          top: '58%',
          width: 64,
          height: 120,
        }}
      >
        {fdev === 'speaker' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 6,
              width: 80,
              height: 108,
              transform: 'translateX(-50%)',
              borderRadius: 16,
              boxShadow: '0 0 0 2px #e23b2e,0 0 0 8px rgba(226,59,46,0.12)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 18,
            width: 54,
            height: 96,
            transform: 'translateX(-50%)',
            borderRadius: 9,
            background: 'linear-gradient(160deg,#3a3d45,#202228)',
            boxShadow: '0 14px 24px -10px rgba(20,22,30,0.5)',
          }}
        >
          {/* woofer */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 24,
              width: 30,
              height: 30,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle,#15171c,#2a2d34)',
              border: '2px solid #4a4d55',
            }}
          />
          {/* tweeter */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 64,
              width: 18,
              height: 18,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background: '#15171c',
              border: '1.5px solid #4a4d55',
            }}
          />
          {/* pulse ring — sr-pulse bakes translateX(-50%) into its transform; left:50% but no own transform */}
          <div
            data-sr-anim=""
            style={{
              position: 'absolute',
              left: '50%',
              top: 18,
              width: 46,
              height: 46,
              borderRadius: '50%',
              boxShadow: '0 0 0 2px rgba(226,59,46,0.55)',
              animation: 'sr-pulse 2.4s ease-in-out infinite',
              opacity: v.speakerRingOp,
            }}
          />
        </div>
        {/* base shadow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -4,
            width: 60,
            height: 12,
            background: 'rgba(20,22,30,0.16)',
            filter: 'blur(3px)',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* scene mood wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: v.wash,
        }}
      />

      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 30%,transparent 38%,rgba(24,20,16,1) 130%)',
          opacity: v.vignO,
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
            color: 'rgba(255,255,255,0.7)',
            textShadow: '0 1px 6px rgba(0,0,0,0.35)',
          }}
        >
          Active scene
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#fff',
            textShadow: '0 2px 14px rgba(0,0,0,0.45)',
          }}
        >
          {sceneLabel}
        </div>
      </div>
    </div>
  )
}
