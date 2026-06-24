# Smart Room BCI Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-add hands-free BCI control (focus cursor + signal activation) to the redesigned isometric Smart Room, at parity with the pre-redesign model, without disturbing the pure click-driven state machine or restoring dwell countdowns.

**Architecture:** Three layers. (1) Pure state (`lib/smart-room/state.ts`) gains focus-order data + bidirectional cycling, still no React and no cursor position. (2) The app component owns `focusIndex` + a transient `firing` flash and maps BCI signals via `keyToSignal`. (3) Presentational components render a neutral/dark focus ring (rail) and a projected glow halo (room) from props. Mouse clicks keep working and move the cursor.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), vitest, lucide-react, inline `React.CSSProperties` styling. Spec: `docs/superpowers/specs/2026-06-24-smart-room-bci-control-design.md`.

**Branch:** `feat/smart-room-isometric` (continue here; the handoff rebuild already landed).

---

## File Structure

- `lib/smart-room/types.ts` — add `FocusItem` union. (Modify)
- `lib/smart-room/state.ts` — add `FOCUS_ORDER`, `focusedItem`, `focusLabel`, `prevLights`, `prevFan`; give `cycleDevice` a `dir` param. (Modify)
- `lib/smart-room/state.test.ts` — add tests for the above. (Modify)
- `components/apps/smart-room/control-rail.tsx` — add `focusIndex`/`firing` props + focus ring on the focused tile. (Modify)
- `components/apps/smart-room/room-stage.tsx` — add `focusedDevice?` prop + projected glow halo per device object. (Modify)
- `components/apps/smart-room/smart-room-app.tsx` — add `focusIndex`/`firing` state, full `handleKey` signal map, click-moves-cursor, pass new props. (Modify)
- `components/controls-hint.tsx` — restore `smart-room` BCI legend. (Modify)

No new keyframes needed (rail ring is static + transition; the green flash is a state swap; room halo reuses the existing `sr-breathe` keyframe for a soft pulse).

---

## Task 1: State — focus order + bidirectional cycling

**Files:**
- Modify: `lib/smart-room/types.ts`
- Modify: `lib/smart-room/state.ts`
- Test: `lib/smart-room/state.test.ts`

- [ ] **Step 1: Read the current files**

Read `lib/smart-room/types.ts`, `lib/smart-room/state.ts`, and `lib/smart-room/state.test.ts` in full before editing.

- [ ] **Step 2: Write failing tests** (append to `lib/smart-room/state.test.ts`)

Add these imports to the existing import from `./state` (merge into the current import list): `FOCUS_ORDER`, `focusedItem`, `focusLabel`, `prevLights`, `prevFan`. Then append:

```ts
import type { FocusItem } from './types'

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
    const s = initialState('alloff') // lights off, fan off
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
```

- [ ] **Step 3: Run tests, verify they fail**

Run: `cd /Users/kanuj/manifest && npx vitest run lib/smart-room/state.test.ts`
Expected: FAIL (e.g. `FOCUS_ORDER is not exported` / `focusedItem is not a function`).

- [ ] **Step 4: Add `FocusItem` to `types.ts`**

Append to `lib/smart-room/types.ts`:

```ts
export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }
```

- [ ] **Step 5: Implement in `state.ts`**

Add `FocusItem` to the type import at the top of `lib/smart-room/state.ts` (merge into the existing `import type { ... } from './types'`).

Add after the `DEVICE_LABELS` declaration:

```ts
export const FOCUS_ORDER: FocusItem[] = [
  { kind: 'scene', id: 'focus' },
  { kind: 'scene', id: 'sleep' },
  { kind: 'scene', id: 'alloff' },
  { kind: 'device', id: 'lights' },
  { kind: 'device', id: 'fan' },
  { kind: 'device', id: 'blinds' },
  { kind: 'device', id: 'monitor' },
]

export function focusedItem(focusIndex: number): FocusItem {
  return FOCUS_ORDER[focusIndex]
}

export function focusLabel(focusIndex: number): string {
  const item = FOCUS_ORDER[focusIndex]
  return item.kind === 'scene'
    ? SCENE_LABELS[item.id]
    : DEVICE_LABELS[item.id]
}
```

Add after `nextFan`:

```ts
export function prevLights(v: Lights): Lights {
  if (v === 'off') return 'on'
  if (v === 'on') return 'dim'
  return 'off'
}

export function prevFan(v: Fan): Fan {
  if (v === 'off') return 'high'
  if (v === 'high') return 'low'
  return 'off'
}
```

Replace the existing `cycleDevice` function with this direction-aware version (default `dir = 1` keeps current call sites working):

```ts
export function cycleDevice(
  state: SmartRoomState,
  id: DeviceId,
  dir: 1 | -1 = 1,
): SmartRoomState {
  const next: SmartRoomState = { ...state, activeScene: 'manual' }
  switch (id) {
    case 'lights':
      next.lights = dir === 1 ? nextLights(state.lights) : prevLights(state.lights)
      break
    case 'fan':
      next.fan = dir === 1 ? nextFan(state.fan) : prevFan(state.fan)
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
```

- [ ] **Step 6: Run tests, verify they pass**

Run: `cd /Users/kanuj/manifest && npx vitest run lib/smart-room/state.test.ts`
Expected: PASS (all prior tests + the new ones).

- [ ] **Step 7: Run full suite + typecheck**

Run: `npm test` (expect all green) and `npx tsc --noEmit` (expect exit 0).

- [ ] **Step 8: Commit**

```bash
git add lib/smart-room/types.ts lib/smart-room/state.ts lib/smart-room/state.test.ts
git commit -m "feat: smart-room focus order + bidirectional device cycling

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Control rail — focus ring

**Files:**
- Modify: `components/apps/smart-room/control-rail.tsx`

The rail renders scenes (indices 0–2) then devices (global indices 3–6). A tile is "focused" when its global index equals `focusIndex`. The focus ring is a neutral/dark outer ring layered outside the existing active/inactive token styling, so a tile can be both focused (dark ring) and active (red inner). On `firing` the focused tile's ring turns green for the flash.

- [ ] **Step 1: Read the file**

Read `components/apps/smart-room/control-rail.tsx` in full.

- [ ] **Step 2: Add focus-ring constants** (after the `HOVER_BG` const, ~line 35)

```ts
const FOCUS_RING = '0 0 0 2px rgba(38,40,46,0.55), 0 0 0 6px rgba(38,40,46,0.12)'
const FIRING_RING = '0 0 0 2px #37b27d, 0 0 0 6px rgba(55,178,125,0.18)'
```

- [ ] **Step 3: Extend `TileProps` and `Tile`** to accept `focused` and `firing`

In the `TileProps` interface add:

```ts
  focused: boolean
  firing: boolean
```

In `Tile`, destructure `focused` and `firing`, and extend `tileStyle` with the ring + lift. Replace the `tileStyle` object so it includes:

```ts
  const tileStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 9px',
    borderRadius: '15px',
    border: '1px solid',
    borderColor: tok.borderColor,
    background,
    cursor: 'pointer',
    appearance: 'none',
    font: 'inherit',
    transform: focused ? 'scale(1.04)' : 'none',
    boxShadow: focused ? (firing ? FIRING_RING : FOCUS_RING) : 'none',
    transition: 'background .18s, border-color .18s, box-shadow .18s, transform .18s',
  }
```

(Keep the existing disc `<span>` and label markup unchanged.)

- [ ] **Step 4: Add `focusIndex` + `firing` to `ControlRail` props and pass `focused`/`firing` to each tile**

Update the `ControlRail` signature props object to add:

```ts
  focusIndex: number
  firing: boolean
```

(So the full destructure is `{ state, showStatusText = true, focusIndex, firing, onApplyScene, onToggleDevice }` with matching type members.)

In the SCENES `.map((id) => ...)`, change to `.map((id, i) => ...)` and pass `focused={focusIndex === i}` and `firing={firing}` to `<Tile>`.

In the DEVICES `.map((id) => ...)`, change to `.map((id, i) => ...)` and pass `focused={focusIndex === SCENE_ORDER.length + i}` and `firing={firing}` to `<Tile>`. (Device global index = 3 + i, matching `FOCUS_ORDER`.)

- [ ] **Step 5: Typecheck**

Run: `cd /Users/kanuj/manifest && npx tsc --noEmit 2>&1 | grep control-rail`
Expected: no output for control-rail (errors in smart-room-app.tsx are expected until Task 4).

- [ ] **Step 6: Commit**

```bash
git add components/apps/smart-room/control-rail.tsx
git commit -m "feat: smart-room rail focus ring (cursor + firing flash)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Room stage — focus halo on the focused device's object

**Files:**
- Modify: `components/apps/smart-room/room-stage.tsx`

Add an optional `focusedDevice?: DeviceId` prop. When set, render a soft glow halo over the matching object: `lights`→floor lamp, `blinds`→window, `fan`→ceiling fan, `monitor`→monitor screen + PC tower. The room is isometric 3D; anchor the halo using the existing `proj()` helper (the same mechanism the ZZZ overlay uses) at the object's room-unit coordinate, rendering a 2D radial-glow div in projected screen space. The glow is light/neutral (reads as "spotlighted", distinct from red-active and the dark rail ring) and may gently pulse via the existing `sr-breathe` keyframe with `data-sr-anim`.

- [ ] **Step 1: Read the file**

Read `components/apps/smart-room/room-stage.tsx` in full. Key facts you will rely on:
- `proj(x,y,z)` returns screen-space offsets `{x,y}` **from the room center**.
- The ZZZ overlay is a sibling of the `preserve-3d` stage, *inside* the
  `perspective: 1900px` grid div, positioned with
  `left: calc(50% + ${proj().x}px); top: calc(50% + ${proj().y}px); transform: translate(-50%,-50%)`.
  The halo overlay must use the **same** container and positioning pattern.
- Import `DeviceId` from `@/lib/smart-room/types` (merge into the existing type import).

The halo anchor coordinates below are the object centers read from `buildScene`:
- lamp shade `box(332,12,157,28,28,26)` → center `{ x: 346, y: 26, z: 170 }`
- window/blinds face `fx(7,90,122,108,82)` → center `{ x: 7, y: 144, z: 163 }`
- ceiling fan group `translate3d(135px,121px,214px)` → `{ x: 135, y: 121, z: 214 }`
- monitor screen `fy(258,53,76,56,32)` → center `{ x: 286, y: 53, z: 92 }`

- [ ] **Step 2: Add the prop**

Change the component signature from `{ state }: { state: SmartRoomState }` to:

```ts
export function RoomStage({
  state,
  focusedDevice,
}: {
  state: SmartRoomState
  focusedDevice?: DeviceId
}) {
```

- [ ] **Step 3: Define the halo anchor map** (module scope, after the `proj` function)

```ts
// Object centers (room units) read from buildScene, for the focus halo.
const HALO_ANCHORS: Record<DeviceId, { x: number; y: number; z: number }> = {
  lights:  { x: 346, y: 26,  z: 170 }, // floor lamp shade
  blinds:  { x: 7,   y: 144, z: 163 }, // window / blinds
  fan:     { x: 135, y: 121, z: 214 }, // ceiling fan
  monitor: { x: 286, y: 53,  z: 92 },  // monitor screen + PC tower
}
```

- [ ] **Step 4: Render the halo overlay**

Inside the `perspective: 1900px` grid div, as a sibling of the `preserve-3d` stage and the existing `{sleeping && (...)}` ZZZ overlay, add the halo (mirrors the ZZZ positioning convention exactly):

```tsx
{focusedDevice && (() => {
  const a = HALO_ANCHORS[focusedDevice]
  const p = proj(a.x, a.y, a.z)
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        data-sr-anim=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `calc(50% + ${Math.round(p.x)}px)`,
          top: `calc(50% + ${Math.round(p.y)}px)`,
          transform: 'translate(-50%,-50%)',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,255,255,0.14) 46%, transparent 70%)',
          mixBlendMode: 'screen',
          animation: 'sr-breathe 3s ease-in-out infinite',
        }}
      />
    </div>
  )
})()}
```

(The neutral white glow reads as "spotlighted", distinct from the red active accent and the dark rail ring. It sits beneath the faint uniform wash/vignette — that's fine; they're ~0.06–0.10 alpha.)

- [ ] **Step 5: Typecheck**

Run: `cd /Users/kanuj/manifest && npx tsc --noEmit 2>&1 | grep room-stage`
Expected: no output for room-stage (smart-room-app.tsx errors expected until Task 4).

- [ ] **Step 6: Commit**

```bash
git add components/apps/smart-room/room-stage.tsx
git commit -m "feat: smart-room room halo on focused device object

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: App wiring + controls hint

**Files:**
- Modify: `components/apps/smart-room/smart-room-app.tsx`
- Modify: `components/controls-hint.tsx`

Add `focusIndex` + `firing` state, the full BCI `handleKey` signal map, make clicks move the cursor, and pass the new props down. Restore the `smart-room` controls-hint legend.

- [ ] **Step 1: Read the files**

Read `components/apps/smart-room/smart-room-app.tsx` and `components/controls-hint.tsx` in full.

- [ ] **Step 2: Update imports in `smart-room-app.tsx`**

Replace the React import line and the state import block. New React import:

```ts
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
```

Update the bci-controls import to include `isDeleteKey`:

```ts
import { keyToSignal, isDeleteKey } from '@/lib/bci-controls'
```

Update the state import to add the focus helpers:

```ts
import {
  initialState,
  applyScene,
  cycleDevice,
  focusedItem,
  FOCUS_ORDER,
} from '@/lib/smart-room/state'
```

- [ ] **Step 3: Add focus + firing state and the activation logic**

Inside the component body, after the `const [state, setState] = useState(...)` line, add:

```ts
    const [focusIndex, setFocusIndex] = useState(0)
    const [firing, setFiring] = useState(false)
    const fireTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
      return () => {
        if (fireTimer.current) clearTimeout(fireTimer.current)
      }
    }, [])

    const fire = useCallback(() => {
      setFiring(true)
      if (fireTimer.current) clearTimeout(fireTimer.current)
      fireTimer.current = setTimeout(() => setFiring(false), 300)
    }, [])
```

- [ ] **Step 4: Replace `onApplyScene` / `onToggleDevice` so clicks move the cursor too**

Replace the existing `onApplyScene` and `onToggleDevice` callbacks with versions that also set `focusIndex` to the clicked tile (so the cursor follows mouse use):

```ts
    const onApplyScene = useCallback(
      (id: SceneId) => {
        const next = applyScene(state, id)
        setState(next)
        setFocusIndex(FOCUS_ORDER.findIndex((f) => f.kind === 'scene' && f.id === id))
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )

    const onToggleDevice = useCallback(
      (id: DeviceId) => {
        const next = cycleDevice(state, id)
        setState(next)
        setFocusIndex(FOCUS_ORDER.findIndex((f) => f.kind === 'device' && f.id === id))
        onNotify(next.lastAction)
      },
      [state, onNotify],
    )
```

- [ ] **Step 5: Add an `activate` helper and replace `handleKey`**

Add an `activate` helper (used by jaw-clench and reverse cycle) and rewrite `handleKey` with the full signal map. Replace the entire existing `handleKey` `useCallback` block with:

```ts
    const activate = useCallback(
      (dir: 1 | -1) => {
        const item = focusedItem(focusIndex)
        if (item.kind === 'scene') {
          if (dir === -1) return // reverse on a scene is a no-op
          const next = applyScene(state, item.id)
          setState(next)
          onNotify(next.lastAction)
          fire()
        } else {
          const next = cycleDevice(state, item.id, dir)
          setState(next)
          onNotify(next.lastAction)
          fire()
        }
      },
      [focusIndex, state, onNotify, fire],
    )

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Smart Room')
          return true
        }
        if (signal === 'scroll-left') {
          setFocusIndex((i) => (i - 1 + FOCUS_ORDER.length) % FOCUS_ORDER.length)
          return true
        }
        if (signal === 'scroll-right') {
          setFocusIndex((i) => (i + 1) % FOCUS_ORDER.length)
          return true
        }
        if (signal === 'jaw-clench') {
          activate(1)
          return true
        }
        if (signal === 'long-blink' || isDeleteKey(key)) {
          activate(-1)
          return true
        }
        return false
      },
      [onClose, onNotify, activate],
    )
```

- [ ] **Step 6: Derive `focusedDevice` and pass new props to children**

Just before the `return (`, add:

```ts
    const focused = focusedItem(focusIndex)
    const focusedDevice = focused.kind === 'device' ? focused.id : undefined
```

Change `<RoomStage state={state} />` to:

```tsx
          <RoomStage state={state} focusedDevice={focusedDevice} />
```

Change the `<ControlRail ... />` to add `focusIndex` and `firing`:

```tsx
          <ControlRail
            state={state}
            showStatusText={showStatusText}
            focusIndex={focusIndex}
            firing={firing}
            onApplyScene={onApplyScene}
            onToggleDevice={onToggleDevice}
          />
```

- [ ] **Step 7: Restore the `smart-room` controls-hint legend** (`components/controls-hint.tsx`)

Replace the `case 'smart-room':` return block with:

```ts
    case 'smart-room':
      return [
        { keys: '←', label: 'Prev' },
        { keys: '→', label: 'Next' },
        { keys: '↵', label: 'Select' },
        { keys: '↑', label: 'Exit' },
      ]
```

- [ ] **Step 8: Full verification**

Run each and confirm:
- `cd /Users/kanuj/manifest && npx tsc --noEmit; echo "exit: $?"` → exit 0.
- `npm test 2>&1 | tail -6` → all suites pass.
- `npm run build 2>&1 | tail -8` → Compiled successfully.

- [ ] **Step 9: Commit**

```bash
git add components/apps/smart-room/smart-room-app.tsx components/controls-hint.tsx
git commit -m "feat: smart-room BCI control wiring (focus cursor + signals)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final verification (after all tasks)

- [ ] `npx tsc --noEmit` exit 0; `npm test` all green; `npm run build` succeeds.
- [ ] Manual/visual (optional, via Playwright skill): open Smart Room, confirm ←/→ moves the dark focus ring across rail tiles and the glow halo across room objects (devices only); ↵ activates (green flash + room changes); `b`/Delete reverse-cycles a focused device; Esc/↑ exits. Clicking a tile still works and moves the cursor.
- [ ] Grep sanity: `grep -rn "dwell\|sr-dwellbar\|--dwell" app components | grep -v node_modules` → no countdown artifacts reintroduced.

## Notes / decisions baked in
- `onNotify` fires only on scene applied, device changed, and exit — **not** on scroll, **not** a separate "firing" toast.
- Focus ring is neutral/dark (`rgba(38,40,46,…)`); green only for the ~300ms firing flash; room halo is a light glow. Red stays reserved for active/on state.
- Reverse cycle on a focused scene is a silent no-op.
- `focusIndex` lives in the component, never in `SmartRoomState`.
