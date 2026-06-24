# Spec: BCI Control for the Isometric Smart Room

**Date:** 2026-06-24
**Status:** Approved direction (pending written-spec review)
**Branch base:** `feat/smart-room-isometric` (the handoff rebuild is merged/landed here)

## Goal

Reintroduce hands-free BCI control to the redesigned (isometric) Smart Room app,
at **parity** with the pre-redesign interaction model, adapted to the new visual
system. The handoff rebuild made the app click-only and stripped all BCI chrome.
This change layers a focus cursor + signal handling back on top **without**
disturbing the pure click-driven state machine, and **without** restoring dwell
countdowns or progress bars.

The app must remain fully usable with **left / right + jaw + brow** alone;
long-blink/Backspace (reverse device cycle) is a secondary convenience, not a
required path. Mouse clicks continue to work.

## Approved decisions (locked)

- Domain state (`SmartRoomState`) stays **pure and click-clean**. The focus cursor
  is **UI-local** to the app component — `focusIndex` does **not** go into
  `SmartRoomState`.
- Re-add `FOCUS_ORDER`, `FocusItem`, `focusedItem`, `focusLabel`.
- Bidirectional device cycling: re-add `prevLights`/`prevFan`; `cycleDevice` takes a
  direction.
- Two focus cues: **rail focus ring** + **room object halo**.
- **No** dwell bars / countdowns / auto-activation. Activation is **explicit** via
  jaw-clench. The rail focus ring is a position indicator, not a countdown.
- Global `ControlsHint` `smart-room` mode returns to the **BCI legend**.

### Decision A — long-blink / Backspace
- Focused **device** + long-blink/Backspace → `cycleDevice(id, -1)` (step backward).
- Focused **scene** + long-blink/Backspace → **silent no-op** (no toast, no focus
  movement). Long-blink means "cycle the focused device backward," never "navigate."

### Decision B — focus visual language (distinct channels)
- **neutral/dark outer ring** = cursor / focus position (NOT red).
- **red inner accent** (existing token set) = active / on / current device or scene.
- **green flash** (~250–400ms) = jaw-clench activation fired (transient, not a state).
- **room halo** = the focused physical object in the room.

### Additional tweaks (locked)
1. **No scroll toast.** scroll-left/right move the visible rail focus (and room halo
   for devices); they do **not** fire a global `onNotify` toast. `onNotify` is used
   for: **scene applied**, **device changed**, **exited Smart Room**. No separate
   "activation fired" toast — activation already produces the scene/device notify;
   the green flash is its visual confirmation.
2. **Long-blink optional.** Reverse cycle is convenience only.
3. **Green firing flash** ~300ms, restrained; confirms activation, never persists.
4. **Scene focus does not preview.** Focusing a scene changes only the rail focus +
   ring; it does **not** apply the scene and does **not** draw a room halo. The room
   transforms only on jaw-clench.
5. **Room halo mapping (device focus only):** lights → floor lamp; blinds → window;
   fan → ceiling fan; monitor → monitor screen + PC tower. (There is **no speaker**.)

### Open assumption for review
- "SELECTED status text": the device status line currently shows the device **value**
  (`ON`/`DIM`/`OFF`/`LOW`/`HIGH`/`OPEN`/`CLOSED`). This spec keeps that value visible
  and treats the **focus ring + room halo** as the sole focus indicator (no literal
  "SELECTED" word overwriting the value). Confirm at review if a textual focus marker
  is wanted instead.

---

## Architecture

Three layers, cleanly separated:

1. **Pure state (`lib/smart-room/state.ts`, `types.ts`)** — click API + focus-order
   data, all pure functions. No React, no focus *cursor position* (that's UI state),
   but it owns the *ordering* of focusable items and the bidirectional cycle logic.
2. **App component (`smart-room-app.tsx`)** — owns `focusIndex` (UI state) and
   `firing` (transient flash), maps BCI signals to actions via `keyToSignal`, and
   passes focus/halo props down. Activation calls the pure API (`applyScene` /
   `cycleDevice`).
3. **Presentational components (`control-rail.tsx`, `room-stage.tsx`)** — render the
   focus ring (rail) and the halo (room) from props. No logic.

### Signal map (`lib/bci-controls.ts` — existing, unchanged)
Available signals: `scroll-left`, `scroll-right`, `jaw-clench`, `brow-raise`,
`exit`, `long-blink`; plus `isDeleteKey` (Backspace = Mac Delete).

`handleKey(key)` in the app:

| Signal | Action | Notify? |
|---|---|---|
| `scroll-left` | `focusIndex = wrap(focusIndex - 1)` | no |
| `scroll-right` | `focusIndex = wrap(focusIndex + 1)` | no |
| `jaw-clench` | activate focused item (scene→`applyScene`; device→`cycleDevice(id,+1)`); trigger firing flash | yes (`lastAction`) |
| `long-blink` **or** Backspace | focused device → `cycleDevice(id,-1)` + flash; focused scene → no-op | yes if device acted, else no |
| `exit` **or** `brow-raise` | `onClose()` | yes ("Exited Smart Room") |
| otherwise | return `false` (unhandled) | — |

Return `true` for any handled signal so `ManifestOS` stops propagation. Wrap-around
navigation (modulo `FOCUS_ORDER.length`).

---

## Component changes

### `lib/smart-room/types.ts`
Add:
```ts
export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }
```
`SmartRoomState` is unchanged (no `focusIndex`).

### `lib/smart-room/state.ts`
Add (pure, named exports):
- `FOCUS_ORDER: FocusItem[]` — `[focus, sleep, alloff]` scenes then
  `[lights, fan, blinds, monitor]` devices (length 7; matches rail render order).
- `focusedItem(focusIndex: number): FocusItem` — `FOCUS_ORDER[focusIndex]`.
- `focusLabel(focusIndex: number): string` — scene → `SCENE_LABELS`, device →
  `DEVICE_LABELS`.
- `prevLights(v): Lights` — `off→on→dim→off` (reverse of `nextLights`).
- `prevFan(v): Fan` — `off→high→low→off` (reverse of `nextFan`).
- Change `cycleDevice(state, id, dir: 1 | -1 = 1)`: `dir === 1` uses
  `nextLights`/`nextFan`; `dir === -1` uses `prevLights`/`prevFan`. Monitor and
  Blinds are binary — both directions toggle (dir ignored for them). `activeScene`
  set to `'manual'`, `lastAction` = `"<Label> <NEWVALUE_UPPER>"` exactly as today.
  Default `dir = 1` preserves the existing click call sites (`cycleDevice(s, id)`).

`applyScene`, `initialState`, `deviceValue`, `isDeviceActive`, labels — unchanged.

### `components/apps/smart-room/control-rail.tsx`
Add props: `focusIndex: number`, `firing: boolean`. Keep `onApplyScene` /
`onToggleDevice` (clicks still work). Tile order already equals `FOCUS_ORDER`
(3 scenes, divider, 4 devices), so tile index `i` maps to `FOCUS_ORDER[i]`.
- Focused tile (`i === focusIndex`): apply a **neutral/dark outer focus ring** via
  `boxShadow` (e.g. `0 0 0 2px rgba(38,40,46,0.55), 0 0 0 6px rgba(38,40,46,0.12)`)
  plus a subtle lift `transform: scale(1.04)` and `transition` on transform. This is
  layered *outside* the existing active/inactive token styling, so a tile can be both
  focused (dark ring) and active (red inner border/disc) simultaneously and read
  clearly.
- When `firing && i === focusIndex`: swap the focus ring to a brief **green** ring
  (`#37b27d`) for the flash duration.
- Optional gentle pulse on the focus ring via a new `sr-focus` keyframe (with
  `data-sr-anim`). Pulse is cosmetic; not a countdown.

### `components/apps/smart-room/room-stage.tsx`
Add optional prop `focusedDevice?: DeviceId`. When set, draw a **subtle halo** on the
mapped object (lights→lamp, blinds→window, fan→ceiling fan, monitor→screen + PC
tower). Halo is a soft light/neutral glow outline (distinct from red active state and
from the dark rail ring — it reads as "spotlighted" against the room), positioned over
the existing object geometry. No halo when `focusedDevice` is undefined (i.e. a scene
is focused, or nothing). Halo must not animate harshly; if it pulses, use
`data-sr-anim`.

### `components/apps/smart-room/smart-room-app.tsx`
- Add `const [focusIndex, setFocusIndex] = useState(0)` and
  `const [firing, setFiring] = useState(false)` (+ a timeout ref cleared on unmount).
- `fire()`: set `firing=true`, clear+set a ~300ms timeout to `firing=false`.
- Rewrite `handleKey` per the signal map above (replace the current Esc-only handler).
  Use `keyToSignal` + `isDeleteKey`. `useCallback` deps include `focusIndex` and
  `state`.
- Activation helpers read the *current* `state`/`focusIndex` closure (compute `next`,
  `setState(next)`, `onNotify(next.lastAction)`, `fire()`), consistent with the
  existing click handlers.
- Derive `focusedDevice`: `const fi = focusedItem(focusIndex); const focusedDevice =
  fi.kind === 'device' ? fi.id : undefined`.
- Pass `focusIndex` + `firing` to `<ControlRail>`; pass `focusedDevice` to
  `<RoomStage>`.
- Mouse clicks on rail tiles should also move `focusIndex` to that tile (so the cursor
  follows clicks and stays consistent) in addition to applying/toggling.

### `components/controls-hint.tsx`
Restore the `smart-room` case to a BCI legend, e.g.:
```
[ ← Prev , → Next , ↵ Select , ↑ Exit ]
```
(Use `BCI_LABELS` for consistency with other modes. `b`/Delete reverse-cycle is
optional/secondary — omit from the hint to avoid clutter, or include a compact
`b Back` if it fits.) Other mode cases unchanged.

### `app/globals.css`
- Optionally add `@keyframes sr-focus` (a gentle ring pulse) near the other `sr-*`
  keyframes; ensure focus-ring/halo animated elements carry `data-sr-anim`.
- Do **not** restore `dwell`, `@property --dwell`, or `sr-dwellbar` (removed in the
  rebuild; no countdown in this design).

---

## Testing

Extend `lib/smart-room/state.test.ts` (vitest):
- `FOCUS_ORDER` length 7 and order (3 scenes then 4 devices).
- `focusedItem` / `focusLabel` for representative indices (scene and device).
- `prevLights` (`off→on→dim→off`) and `prevFan` (`off→high→low→off`) full reverse
  cycles.
- `cycleDevice(state, 'lights', -1)` steps backward; `cycleDevice(state,'fan',-1)`
  backward; default `dir` (omitted) still steps forward (existing behavior intact).
- Monitor/Blinds toggle regardless of `dir` (both `+1` and `-1` flip).
- `cycleDevice` with `dir=-1` still sets `activeScene='manual'` and correct
  `lastAction`.

`handleKey` interaction logic is exercised at the component layer; mirror the
pre-redesign app's approach. No new test framework needed.

`npm test` (all green), `npm run build` clean, `npx tsc --noEmit` exit 0.

---

## Out of scope
- Real Emotiv signal integration (still keyboard stand-ins via `bci-controls`).
- Dwell auto-activation, progress bars, telemetry chips.
- Any change to the click-driven visual fidelity of the handoff rebuild.

## Files touched
- `lib/smart-room/types.ts`
- `lib/smart-room/state.ts` (+ `state.test.ts`)
- `components/apps/smart-room/control-rail.tsx`
- `components/apps/smart-room/room-stage.tsx`
- `components/apps/smart-room/smart-room-app.tsx`
- `components/controls-hint.tsx`
- `app/globals.css`
