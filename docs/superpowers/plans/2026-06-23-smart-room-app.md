# Smart Room App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `smartroom` Manifest OS app — a soft-depth "room stage" that toggles 4 devices and applies 4 scenes via the OS biosignal-stand-in keys.

**Architecture:** A pure state module (`lib/smart-room/`) holds all logic and is unit-tested with Vitest. Three React components (`smart-room-app`, `room-stage`, `control-rail`) render from that state and follow the existing Snake app pattern (`forwardRef` + `handleKey`). Four small integration edits wire it into the OS shell. Depth is elevation-only (soft shadows, warmth, focus) — never perspective.

**Tech Stack:** Next.js 16 / React 19, Tailwind v4, Lucide icons, framer-motion (already used; this app uses CSS transitions for the stage), Vitest (new, for the pure state module).

**Spec:** `docs/superpowers/specs/2026-06-23-smart-room-app-design.md`

---

## File Structure

**Create:**
- `lib/smart-room/types.ts` — type definitions (`SmartRoomState`, ids, `FocusItem`).
- `lib/smart-room/state.ts` — pure logic: focus ring, scenes, `applyScene`/`toggleDevice`/navigation.
- `lib/smart-room/state.test.ts` — Vitest unit tests for `state.ts`.
- `components/apps/smart-room/smart-room-app.tsx` — app shell + state owner + `handleKey`.
- `components/apps/smart-room/room-stage.tsx` — soft-depth stage rendered from state.
- `components/apps/smart-room/control-rail.tsx` — segmented `SCENES | DEVICES` rail.

**Modify:**
- `package.json` — add Vitest dev dep + `test` script.
- `lib/apps.ts` — register the `smartroom` app.
- `components/app-open-view.tsx` — host `SmartRoomApp`.
- `components/manifest-os.tsx` — ref + key routing + controls mode.
- `components/controls-hint.tsx` — `'smart-room'` controls mode.

---

## Task 1: Add Vitest tooling

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: adds `vitest` to `devDependencies`, no errors.

- [ ] **Step 2: Add the test script**

In `package.json`, add a `test` line to the `scripts` block so it reads:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Verify the runner is available**

Run: `npx vitest --version`
Expected: prints a version number (e.g. `vitest/3.x`).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest test runner"
```

---

## Task 2: Smart Room types + pure state module (TDD)

**Files:**
- Create: `lib/smart-room/types.ts`
- Create: `lib/smart-room/state.test.ts`
- Create: `lib/smart-room/state.ts`

- [ ] **Step 1: Create the types**

Create `lib/smart-room/types.ts`:

```ts
export type SceneId = 'movie' | 'focus' | 'sleep' | 'alloff'
export type DeviceId = 'lights' | 'fan' | 'blinds' | 'speaker'

export type Lights = 'off' | 'dim' | 'on'
export type Blinds = 'open' | 'closed'

export interface SmartRoomState {
  activeScene: SceneId | 'manual'
  lights: Lights
  fanOn: boolean
  blinds: Blinds
  speakerOn: boolean
  focusIndex: number
}

export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }
```

- [ ] **Step 2: Write the failing tests**

Create `lib/smart-room/state.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  initialState,
  applyScene,
  toggleDevice,
  focusPrev,
  focusNext,
  focusedItem,
  activate,
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `state.ts` has no exports yet (cannot find module / undefined functions).

- [ ] **Step 4: Implement the state module**

Create `lib/smart-room/state.ts`:

```ts
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests in `state.test.ts` green.

- [ ] **Step 6: Commit**

```bash
git add lib/smart-room/types.ts lib/smart-room/state.ts lib/smart-room/state.test.ts
git commit -m "feat: smart room pure state module + tests"
```

---

## Task 3: Control rail component

**Files:**
- Create: `components/apps/smart-room/control-rail.tsx`

- [ ] **Step 1: Create the component**

Create `components/apps/smart-room/control-rail.tsx`:

```tsx
'use client'

import {
  FOCUS_ORDER,
  SCENE_LABELS,
  DEVICE_LABELS,
  isDeviceActive,
} from '@/lib/smart-room/state'
import type { SmartRoomState } from '@/lib/smart-room/types'

export function ControlRail({ state }: { state: SmartRoomState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">
        Scenes
      </span>
      {FOCUS_ORDER.map((item, i) => {
        const isFocused = i === state.focusIndex
        const label =
          item.kind === 'scene' ? SCENE_LABELS[item.id] : DEVICE_LABELS[item.id]
        const active = item.kind === 'device' && isDeviceActive(state, item.id)
        return (
          <span key={`${item.kind}-${item.id}`} className="contents">
            {i === 4 && (
              <>
                <span className="mx-1 h-4 w-px bg-border" />
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">
                  Devices
                </span>
              </>
            )}
            <span
              className={[
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-medium transition-colors',
                isFocused
                  ? 'border-primary text-primary'
                  : 'border-border bg-card text-muted-foreground',
              ].join(' ')}
            >
              {item.kind === 'device' && (
                <span
                  className={`size-1.5 rounded-full ${active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                />
              )}
              {label}
            </span>
          </span>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/apps/smart-room/control-rail.tsx
git commit -m "feat: smart room control rail"
```

---

## Task 4: Room stage component (soft-depth)

**Files:**
- Create: `components/apps/smart-room/room-stage.tsx`

- [ ] **Step 1: Create the component**

Create `components/apps/smart-room/room-stage.tsx`. Depth is elevation-only: soft shadows, contact shadows, warm glow, one red focus halo. No perspective.

```tsx
'use client'

import type { CSSProperties } from 'react'
import type { SmartRoomState, Lights } from '@/lib/smart-room/types'
import { focusedItem } from '@/lib/smart-room/state'

const STAGE_BG: Record<string, string> = {
  movie: 'linear-gradient(180deg, #efe7db, #e7dccd)',
  sleep: 'linear-gradient(180deg, #e9ebf1, #dfe2eb)',
  focus: '#ffffff',
  alloff: '#fbfbfd',
  manual: '#ffffff',
}

function lampGlow(level: Lights): string {
  if (level === 'on') return '0 0 36px 14px rgba(245,190,110,0.55)'
  if (level === 'dim') return '0 0 18px 7px rgba(210,150,80,0.40)'
  return 'none'
}
function lampColor(level: Lights): string {
  if (level === 'on') return '#ffd083'
  if (level === 'dim') return '#e7b878'
  return '#c4c9d2'
}

const HALO: CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 0 0 2px var(--primary), 0 0 0 7px rgba(226,59,46,0.10)',
}
const CONTACT: CSSProperties = {
  borderRadius: '50%',
  background: 'rgba(20,22,30,0.10)',
  filter: 'blur(2px)',
}
const EASE = 'transition-all duration-700 ease-out motion-reduce:transition-none'

export function RoomStage({ state }: { state: SmartRoomState }) {
  const focused = focusedItem(state)
  const fdev = focused.kind === 'device' ? focused.id : null

  return (
    <div
      className={`relative w-full max-w-xl overflow-hidden rounded-[1.25rem] border border-border shadow-inner ${EASE}`}
      style={{ aspectRatio: '16 / 10', background: STAGE_BG[state.activeScene] ?? '#ffffff' }}
    >
      {/* wall -> floor horizon */}
      <div className="pointer-events-none absolute inset-x-0 top-[64%] h-px bg-black/[0.06]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/[0.04]" />

      {/* WINDOW / BLINDS (wall, left) */}
      <div className="absolute" style={{ left: '9%', top: '15%', width: '24%', height: '34%' }}>
        {fdev === 'blinds' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`h-full w-full rounded-lg border ${EASE}`}
          style={{
            borderColor: state.blinds === 'closed' ? '#bcae9c' : '#c4c9d2',
            background:
              state.blinds === 'closed'
                ? 'repeating-linear-gradient(180deg,#d0c2af 0 5px,#c2b49f 5px 9px)'
                : '#ffffff',
            boxShadow: '0 4px 10px rgba(20,22,30,0.08)',
          }}
        >
          {state.blinds === 'open' && (
            <>
              <div className="mx-auto mt-2 h-px w-3/4 bg-black/10" />
              <div className="mx-auto mt-2 h-px w-3/4 bg-black/10" />
            </>
          )}
        </div>
      </div>

      {/* FAN (wall, right) */}
      <div className="absolute" style={{ right: '13%', top: '17%', width: 40, height: 40 }}>
        {fdev === 'fan' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`relative grid h-full w-full place-items-center rounded-full border ${
            state.fanOn ? 'animate-[spin_3s_linear_infinite] motion-reduce:animate-none' : ''
          }`}
          style={{
            borderColor: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            boxShadow: '0 3px 8px rgba(20,22,30,0.10)',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              width: 16,
              height: 2,
              borderRadius: 2,
              background: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            }}
          />
          <div
            className="absolute"
            style={{
              width: 2,
              height: 16,
              borderRadius: 2,
              background: state.fanOn ? 'var(--primary)' : '#c4c9d2',
            }}
          />
        </div>
      </div>

      {/* LAMP (floor, center-left) */}
      <div className="absolute" style={{ left: '38%', bottom: '17%', width: 36, height: 80 }}>
        {fdev === 'lights' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 0, width: 3, height: 46, background: '#d7dbe2', borderRadius: 2 }}
        />
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${EASE}`}
          style={{
            top: 0,
            width: 30,
            height: 22,
            borderRadius: '14px 14px 5px 5px',
            background: lampColor(state.lights),
            boxShadow: lampGlow(state.lights),
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: -4, width: 40, height: 8, ...CONTACT }}
        />
      </div>

      {/* SPEAKER (floor, right) */}
      <div className="absolute" style={{ right: '13%', bottom: '15%', width: 22, height: 30 }}>
        {fdev === 'speaker' && <div className="absolute -inset-2" style={HALO} />}
        <div
          className={`h-full w-full rounded-md border ${EASE}`}
          style={{
            borderColor: state.speakerOn ? 'var(--primary)' : '#c4c9d2',
            background: state.speakerOn
              ? 'rgba(226,59,46,0.14)'
              : 'linear-gradient(#fbfbfd,#e9ebf0)',
            boxShadow: '0 4px 9px rgba(20,22,30,0.12)',
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: -4, width: 28, height: 6, ...CONTACT }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/apps/smart-room/room-stage.tsx
git commit -m "feat: smart room soft-depth room stage"
```

---

## Task 5: Smart Room app component

**Files:**
- Create: `components/apps/smart-room/smart-room-app.tsx`

- [ ] **Step 1: Create the component**

Create `components/apps/smart-room/smart-room-app.tsx`. Header/Exit pill mirror Snake exactly; status row mirrors Snake's score row.

```tsx
'use client'

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { House, X } from 'lucide-react'
import { keyToSignal } from '@/lib/bci-controls'
import {
  initialState,
  focusPrev,
  focusNext,
  activate,
  focusedItem,
  focusLabel,
  SCENE_LABELS,
} from '@/lib/smart-room/state'
import type { SmartRoomState, DeviceId } from '@/lib/smart-room/types'
import { RoomStage } from './room-stage'
import { ControlRail } from './control-rail'

export type SmartRoomAppHandle = { handleKey: (key: string) => boolean }
export type SmartRoomAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

function describeToggle(state: SmartRoomState, id: DeviceId): string {
  switch (id) {
    case 'lights':
      return state.lights === 'off' ? 'off' : 'on'
    case 'fan':
      return state.fanOn ? 'on' : 'off'
    case 'blinds':
      return state.blinds
    case 'speaker':
      return state.speakerOn ? 'on' : 'off'
  }
}

export const SmartRoomApp = forwardRef<SmartRoomAppHandle, SmartRoomAppProps>(
  function SmartRoomApp({ onClose, onNotify }, ref) {
    const [state, setState] = useState<SmartRoomState>(initialState)

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        if (signal === 'scroll-left') {
          setState((s) => {
            const n = focusPrev(s)
            onNotify(focusLabel(n))
            return n
          })
          return true
        }
        if (signal === 'scroll-right') {
          setState((s) => {
            const n = focusNext(s)
            onNotify(focusLabel(n))
            return n
          })
          return true
        }
        if (signal === 'jaw-clench') {
          setState((s) => {
            const item = focusedItem(s)
            const n = activate(s)
            onNotify(
              item.kind === 'scene'
                ? `${SCENE_LABELS[item.id]} scene`
                : `${focusLabel(s)} ${describeToggle(n, item.id)}`,
            )
            return n
          })
          return true
        }
        return false
      },
      [onClose, onNotify],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    const activeLabel =
      state.activeScene === 'manual' ? 'Manual' : SCENE_LABELS[state.activeScene]

    return (
      <>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <House className="size-5" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-medium tracking-tight text-muted-foreground">
                Manifest
              </span>
              <p className="text-base font-semibold tracking-tight">Smart Room</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3.5" />
            Exit
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-6">
          <div className="flex w-full max-w-xl items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Active Scene
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold tracking-tight">{activeLabel}</p>
                {state.activeScene !== 'manual' && (
                  <span className="rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    ● Active
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Selected
              </p>
              <p className="text-2xl font-semibold tracking-tight text-primary">
                {focusLabel(state)}
              </p>
            </div>
          </div>

          <RoomStage state={state} />

          <ControlRail state={state} />
        </div>
      </>
    )
  },
)
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/apps/smart-room/smart-room-app.tsx
git commit -m "feat: smart room app component"
```

---

## Task 6: Register the app

**Files:**
- Modify: `lib/apps.ts`

- [ ] **Step 1: Add the `House` icon import**

In `lib/apps.ts`, add `House` to the `lucide-react` import block (alongside the existing icons), e.g. add a line `  House,` before `  type LucideIcon,`.

- [ ] **Step 2: Add the app entry**

Append to the `APPS` array (after the `music`/`maps` entries) so it ends with:

```ts
  { id: 'smartroom', name: 'Smart Room', tagline: 'Set the scene', icon: House },
]
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/apps.ts
git commit -m "feat: register smart room app"
```

---

## Task 7: Host the app in AppOpenView

**Files:**
- Modify: `components/app-open-view.tsx`

- [ ] **Step 1: Import the app + handle type**

At the top of `components/app-open-view.tsx`, after the `SnakeApp` import, add:

```tsx
import {
  SmartRoomApp,
  type SmartRoomAppHandle,
} from '@/components/apps/smart-room/smart-room-app'
```

- [ ] **Step 2: Add the `smartRoomRef` prop**

In the `AppOpenView` props object (where `snakeRef` is declared), add:

```tsx
  smartRoomRef,
```

and in the destructured type signature, after `snakeRef: React.RefObject<SnakeAppHandle | null>`, add:

```tsx
  smartRoomRef: React.RefObject<SmartRoomAppHandle | null>
```

- [ ] **Step 3: Add the render branch**

In the app-content ternary, change the `snake` branch's `else` so the chain becomes:

```tsx
            {app.id === 'movies' ? (
              <MoviesApp
                ref={moviesRef}
                onClose={onClose}
                onNotify={onNotify}
                onViewChange={onMoviesViewChange}
              />
            ) : app.id === 'snake' ? (
              <SnakeApp ref={snakeRef} onClose={onClose} onNotify={onNotify} />
            ) : app.id === 'smartroom' ? (
              <SmartRoomApp
                ref={smartRoomRef}
                onClose={onClose}
                onNotify={onNotify}
              />
            ) : (
              <GenericAppContent app={app} onClose={onClose} />
            )}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/app-open-view.tsx
git commit -m "feat: host smart room in AppOpenView"
```

---

## Task 8: Wire key routing + ref in ManifestOS

**Files:**
- Modify: `components/manifest-os.tsx`

- [ ] **Step 1: Import the handle type**

After the `SnakeAppHandle` import, add:

```tsx
import type { SmartRoomAppHandle } from '@/components/apps/smart-room/smart-room-app'
```

- [ ] **Step 2: Create the ref**

After `const snakeRef = useRef<SnakeAppHandle>(null)`, add:

```tsx
  const smartRoomRef = useRef<SmartRoomAppHandle>(null)
```

- [ ] **Step 3: Add the controls mode**

In the `controlsMode` IIFE, after the `if (openApp?.id === 'snake') return 'snake'` line, add:

```tsx
    if (openApp?.id === 'smartroom') return 'smart-room'
```

- [ ] **Step 4: Route keys to the app**

In the `onKey` handler, after the `snake` routing block (the one that calls `snakeRef.current?.handleKey`), add:

```tsx
        if (openApp?.id === 'smartroom') {
          const handled = smartRoomRef.current?.handleKey(e.key) ?? false
          if (handled) {
            e.preventDefault()
            return
          }
        }
```

- [ ] **Step 5: Pass the ref to AppOpenView**

In the `<AppOpenView ... />` JSX, after `snakeRef={snakeRef}`, add:

```tsx
        smartRoomRef={smartRoomRef}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/manifest-os.tsx
git commit -m "feat: route keys to smart room app"
```

---

## Task 9: Add the smart-room controls mode

**Files:**
- Modify: `components/controls-hint.tsx`

- [ ] **Step 1: Extend the mode union**

In `components/controls-hint.tsx`, add `'smart-room'` to the `ControlsMode` union type so it reads:

```tsx
export type ControlsMode =
  | 'home'
  | 'app'
  | 'movies-library'
  | 'movies-player'
  | 'movies-naming'
  | 'snake'
  | 'smart-room'
```

- [ ] **Step 2: Add the case**

In `controlsForMode`, add a case before `case 'app':`:

```tsx
    case 'smart-room':
      return [
        { keys: '←', label: 'Previous' },
        { keys: '→', label: 'Next' },
        { keys: '↵', label: 'Select' },
        { keys: 'Esc', label: 'Exit' },
      ]
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/controls-hint.tsx
git commit -m "feat: smart room controls hint mode"
```

---

## Task 10: Visual QA + verification

**Files:** none (verification only; tune Task 4 positions/colors here if needed).

- [ ] **Step 1: Run the full test + typecheck + build**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: tests PASS, no type errors, build succeeds.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Open http://localhost:3000.

- [ ] **Step 3: Manual verification checklist**

Navigate to the Smart Room tile (`→` to it, `Enter`/`↵` to open), then verify:

- [ ] Header (red `House` icon + `Manifest` / `Smart Room`) and Exit pill match Snake's geometry.
- [ ] `←`/`→` move the red focus along the rail and wrap (Speaker → Movie in one `→`).
- [ ] The focused **device** gets the single red halo in the room (lamp / fan / blinds / speaker); focusing a **scene** shows no single-object halo.
- [ ] `↵` on **Movie Night**: stage warms/dims, blinds close, lamp dims, speaker turns red, badge shows `● Active`, transition is slow/soft/staggered (not flashy).
- [ ] `↵` on **Focus**: bright stage, blinds open, lamp on, speaker off.
- [ ] `↵` on **Sleep**: cool-dim stage, blinds closed, lights off, fan spins.
- [ ] `↵` on **All Off**: everything gray/off.
- [ ] `↵` on a **device** (e.g. Fan) toggles only it AND flips `ACTIVE SCENE` to `Manual` (badge disappears).
- [ ] `SELECTED` always shows the focused item's name; `ACTIVE SCENE` shows the applied scene or `Manual`.
- [ ] `Esc` / `↑` (brow raise) exits back to the launcher.
- [ ] Bottom control pill shows `← Previous · → Next · ↵ Select · Esc Exit`.
- [ ] Overall: reads as a Snake sibling (light bg, soft-gray cards, red focus) — no cyan/dark/perspective.

- [ ] **Step 4: Tune if needed, then commit**

If any room positions/shadows need adjusting, edit `components/apps/smart-room/room-stage.tsx` to match the locked soft-depth mockup, then:

```bash
git add -A
git commit -m "polish: smart room visual QA pass"
```

---

## Self-Review Notes

- **Spec coverage:** Vitest + tests (Tasks 1–2 ✓), pure state first (Task 2 ✓), app/stage/rail components (Tasks 3–5 ✓), AppOpenView (Task 7 ✓), ManifestOS routing/ref (Task 8 ✓), ControlsHint mode (Task 9 ✓), visual QA + manual checklist (Task 10 ✓). Scenes/devices, tri-state lights, dim→off toggle, manual-flip, wrap nav, no-live-preview, soft-depth/no-perspective all represented.
- **Type consistency:** `SmartRoomState`, `SceneId`, `DeviceId`, `Lights`, `Blinds`, `FocusItem` defined in Task 2 `types.ts` and used unchanged in Tasks 3–8. Functions `applyScene`, `toggleDevice`, `focusPrev/Next`, `focusedItem`, `focusLabel`, `activate`, `isDeviceActive`, and constants `FOCUS_ORDER`, `SCENE_LABELS`, `DEVICE_LABELS` are defined in Task 2 and referenced consistently.
- **Choreography:** uses CSS transitions (`transition-all duration-700` + `motion-reduce`) and `animate-[spin_…]` rather than framer-motion springs inside the stage — simpler, matches Snake's CSS-transition approach, still honors reduced-motion. (framer-motion remains available if a later polish pass wants spring staggering.)
