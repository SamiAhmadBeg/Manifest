# Manifest — Smart Room App Design

**Date:** 2026-06-23
**Status:** Approved design, pre-implementation
**Scope:** A new Manifest OS app, `smartroom`. Keyboard-driven (biosignal stand-ins) like the
rest of the OS today. Sits alongside Movies and Snake as a fully built-out app.

---

## 1. Overview

**Smart Room** lets the user control a small set of room devices (lights, fan, blinds, speaker)
and one-shot **scene** presets (Movie Night, Focus, Sleep, All Off) using the OS-wide biosignal
control vocabulary. The app's identity is **behavioral, not visual**: it is the one app whose
entire content surface — a soft-depth "room stage" — visibly transforms in response to a single
intent. That choreography (e.g. activating *Movie Night* dims the room, closes the blinds, and
turns the speaker on) is the demo payoff.

The app reuses the existing Manifest/Snake shell **exactly**. Only the centered content surface (the
room stage) introduces additional visual depth, and that depth is strictly elevation-based, never
perspective.

**Why it matters:** it demonstrates Manifest as a hands-free OS that controls an *environment*, not
a switchboard — while staying visually unified with the rest of the product.

---

## 2. Locked decisions

1. **Visual direction: Soft-Depth (2.5D).** Depth comes from soft shadows, elevation, warmth, and
   focus — **never** from perspective projection. No angled floor, no skewed wall, no vanishing
   point, no realistic 3D scene, no dense furniture.
2. **Chrome is identical to Snake.** Header (red rounded-xl icon + `Manifest` / `Smart Room`),
   pill-shaped Exit button, status row, segmented control rail, and the OS bottom control pill all
   match the existing app shell. Extra depth lives *only inside the stage card*.
3. **Four objects, four scenes.** Objects: window/blinds, lamp, fan, speaker. Scenes: Movie Night,
   Focus, Sleep, All Off. No thermostat, brightness slider, fan-speed, color temperature, blinds
   "half," nested menus, or long-blink adjust mode in v1.
4. **One 1D focus ring.** `Movie Night → Focus → Sleep → All Off → Lights → Fan → Blinds → Speaker`,
   visually grouped `SCENES | DEVICES` but navigated as one continuous left/right ring (wraps).
5. **Controls = OS vocabulary.** `←/→` previous/next · **jaw clench** activate scene / toggle device
   · **brow raise (or Esc)** exit/back. Long blink is **not** used in v1.
6. **Lights are tri-state** (`off | dim | on`); `dim` is reachable only via scenes (no brightness
   control). Blinds are binary (`open | closed`).
7. **Manual override rule:** toggling any device by hand sets `activeScene = 'manual'`.
8. **No live scene preview.** Focusing a scene only highlights its chip + shows its name in the
   status line. The room transforms **only** on jaw-clench. The transform is the reveal.
9. **Choreography is slow, soft, staggered** — never flashy. Big-area, low-speed easing reads as
   premium and is legible at a distance; no neon, particles, or harsh shadows.
10. **Pure CSS only for the stage.** Soft-depth objects are rounded `div`s with `box-shadow` +
    gradients. No SVG models, no 3D library, no canvas. One consistent (top-down) light direction.

---

## 3. Interaction model

### Focus ring (flat array, index `focusIndex`)

```
[ movie, focus, sleep, alloff,  lights, fan, blinds, speaker ]
   └────── scenes ──────┘        └────── devices ──────┘
```

- `←` / `scroll-left` → `focusIndex - 1` (wraps to last).
- `→` / `scroll-right` → `focusIndex + 1` (wraps to first).
- Wrapping (vs the home carousel's clamp) is intentional: a small fixed ring should let the user get
  from `Speaker` back to `Movie` in one step.

### Activate (jaw clench)

- If the focused item is a **scene** → `applyScene(id)` (runs the choreography).
- If the focused item is a **device** → `toggleDevice(id)` and set `activeScene = 'manual'`.

### Exit (brow raise / Esc)

- Closes the app back to the OS launcher (calls `onClose`).

### Edge behavior

- Re-activating the already-active scene is **idempotent** (state unchanged → no animation).
- Toggling a device that a scene set to `dim` treats `dim` as "on" → toggles to `off`.
- `prefers-reduced-motion`: skip transitions, snap to end states (state change still reads).

---

## 4. State model

```ts
type SceneId  = 'movie' | 'focus' | 'sleep' | 'alloff'
type DeviceId = 'lights' | 'fan' | 'blinds' | 'speaker'

type Lights = 'off' | 'dim' | 'on'
type Blinds = 'open' | 'closed'

interface SmartRoomState {
  activeScene: SceneId | 'manual'
  lights: Lights
  fanOn: boolean
  blinds: Blinds
  speakerOn: boolean
  focusIndex: number        // 0..7 over the focus ring
}
```

### Scene definitions

| Scene | lights | blinds | fan | speaker | stage mood |
|---|---|---|---|---|---|
| **Movie Night** | `dim` | `closed` | off | **on** | warm-dim |
| **Focus** | `on` | `open` | off | off | bright / neutral |
| **Sleep** | `off` | `closed` | **on** | off | cool-dim |
| **All Off** | `off` | `open` | off | off | neutral (all glyphs gray) |
| **Manual** | (follows last manual toggles) | — | — | — | neutral; glyphs reflect device state |

`applyScene(state, id)` returns a new state with the row's device values + `activeScene = id`.
`toggleDevice(state, id)` flips the one device and sets `activeScene = 'manual'`.

These are **pure functions** — no React, no DOM — so they are unit-testable in isolation.

---

## 5. Architecture & file layout

Follows the existing app pattern (Movies, Snake): a `forwardRef` component exposing
`handleKey(key): boolean`, with `onClose` / `onNotify` props, hosted by `AppOpenView`.

```
lib/smart-room/
  types.ts         # SceneId, DeviceId, SmartRoomState, FocusItem, etc.
  state.ts         # FOCUS_ORDER, SCENES, initialState, applyScene, toggleDevice,
                   #   focusPrev/focusNext, focusedItem(state) -> {kind:'scene'|'device', id}
components/apps/smart-room/
  smart-room-app.tsx   # forwardRef<SmartRoomAppHandle>; owns state, handleKey, chrome
  room-stage.tsx       # renders the soft-depth stage purely from SmartRoomState
  control-rail.tsx     # the segmented SCENES | DEVICES rail; highlights focusIndex
```

Keeping `state.ts` pure and splitting `room-stage` / `control-rail` out of the app component keeps
each file focused and the visual layer testable-by-inspection.

### Integration points (mirror Snake)

1. **`lib/apps.ts`** — add `{ id: 'smartroom', name: 'Smart Room', tagline: 'Set the scene', icon: House }`
   (Lucide `House`, matching the ⌂ identity in the mockups).
2. **`components/apps/smart-room/smart-room-app.tsx`** — export `SmartRoomAppHandle` (`{ handleKey }`).
   `handleKey` consumes `keyToSignal`: `scroll-left/right` → focus move (return true);
   `jaw-clench` → activate (return true); `exit` / `brow-raise` → `onClose` (return true).
3. **`components/app-open-view.tsx`** — add a `smartRoomRef` prop and an
   `app.id === 'smartroom'` branch rendering `<SmartRoomApp ref={smartRoomRef} .../>`.
4. **`components/manifest-os.tsx`** — add `smartRoomRef = useRef<SmartRoomAppHandle>(null)`; route
   keys to it in the `onKey` effect when `openApp?.id === 'smartroom'`; add
   `if (openApp?.id === 'smartroom') return 'smart-room'` to `controlsMode`; pass the ref to
   `AppOpenView`.
5. **`components/controls-hint.tsx`** — add `'smart-room'` to `ControlsMode` and a case returning
   `[← Previous, → Next, ↵ Select, Esc Exit]`.

No other OS code changes. Swapping/extending devices later touches only `lib/smart-room/` + the two
stage/rail components.

---

## 6. Visual / Soft-Depth spec (stage card only)

- **Stage container:** white card, `shadow-inner`, rounded (matching Snake's board geometry), with
  generous internal whitespace. A single soft **horizon** (wall→floor) via a gentle vertical
  gradient + a faint shadow band — *not* a tilted plane.
- **Objects:** front-facing rounded blocks/shapes echoing the app-icon tiles. Each floor object
  casts a soft, blurred **contact shadow** (one consistent top-down light). At most one object
  carries the **red focus halo** at a time (the focused device, or — when a scene is focused — no
  single-object halo; the whole stage is the subject).
- **State → appearance:**
  - **lamp (lights):** `on` = warm bulb + soft radial glow/cone; `dim` = faint warm glow; `off` = gray.
  - **window (blinds):** `open` = outline + slats near top; `closed` = slats filled, stage slightly
    darker.
  - **fan:** `on` = slow continuous rotation; `off` = gray, static.
  - **speaker:** `on` = red/active fill; `off` = gray. (Color is the signal — no sound-wave arcs.)
  - **stage mood:** background tint driven by `activeScene` per the §4 table (warm-dim / cool-dim /
    neutral). Big, low-contrast-within-light-theme area shift — readable at distance, never dark/cyber.
- **Palette:** existing tokens only — off-white bg, white/soft-gray surfaces, `--primary` red for
  focus/active accents, warm yellow reserved for lit lamp, gray for inactive. No new colors.

### Choreography (framer-motion, reuse existing springs)

On `applyScene`, transition affected elements with **staggered** offsets (~120–180ms apart): e.g.
Movie Night → blinds slide closed → lamp eases to dim-warm → speaker fills red → stage background
eases warm, plus the `ACTIVE` scene badge updates. Soft spring easing; respect reduced-motion.

---

## 7. Status row & rail (chrome — matches Snake's score row)

- **Status row** (above the stage, like Snake's Score / High Score):
  - left: `ACTIVE SCENE` → `Movie Night` (+ small `● ACTIVE` badge) / `Focus` / `Sleep` /
    `All Off` / `Manual`.
  - right: `SELECTED` → the focused item's name.
- **Segmented rail** (below the stage): `SCENES [Movie][Focus][Sleep][All Off] | DEVICES
  [Lights][Fan][Blinds][Speaker]`. The focused chip gets the OS red focus border. Device chips may
  show a subtle on/off dot; scene chips do not.
- **Bottom control pill:** the OS-level `ControlsHint` in `'smart-room'` mode (no new component).

---

## 8. Testing strategy

The repo currently has **no test runner** (only `dev`/`build`/`start`/`lint`). The state logic is
pure and genuinely worth testing per the project's TDD preference.

**Recommended (decision flagged for the user):** add `vitest` as a dev dependency + a `test` script,
and write `lib/smart-room/state.test.ts` first (TDD) covering:

- `applyScene` produces the exact device values in the §4 table for each scene + sets `activeScene`.
- `toggleDevice` flips only the target device and sets `activeScene = 'manual'`; `dim` toggles to `off`.
- focus navigation wraps correctly at both ends; `focusedItem` maps each index to the right
  kind/id.
- activate dispatches `applyScene` for scene indices and `toggleDevice` for device indices.

If the team prefers **no new tooling** for now, the functions are structured to be tested later with
zero refactor; the component layer is verified by inspection + manual demo run. This is the one open
decision in the spec — default is "add vitest for the state module."

Manual verification (always): `npm run dev`, open Smart Room, walk the ring, confirm each scene's
choreography + manual toggles + the `Manual` flip + exit.

---

## 9. Scope

**In v1:**
- `smartroom` app registered; soft-depth room stage rendering from state; 4 devices + 4 scenes;
  1D focus ring; status row; segmented rail; `'smart-room'` controls mode; scene choreography
  (staggered, reduced-motion aware); manual toggles with `Manual` flip; full OS-shell parity.
- Pure `lib/smart-room/state.ts` + (recommended) its vitest tests.

**Deferred:**
- Thermostat, brightness, fan-speed levels, color temperature, blinds "half."
- Long-blink adjust mode / any per-device detail view.
- Real biosignal/WebSocket wiring (handled by the broader signal-service path, not this app).

---

## 10. Risks

- **Soft-depth discipline.** Soft-depth only beats flat if shadow/light stay tight: one light
  direction, soft never harsh, never darkening into "cyber." A sloppy 2.5D looks worse than clean
  flat — so the §6 constraints are load-bearing, not decorative.
- **Choreography legibility.** The payoff must read across a room without being flashy — mitigated by
  big-area, slow, staggered easing (§6) over small bright effects.
- **Scene/device state coupling.** The `Manual` flip on any hand toggle (§2.7) keeps the status line
  honest; without it the badge would lie.
