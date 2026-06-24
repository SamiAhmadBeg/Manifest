# Plan: Smart Room — Isometric Control Surface (handoff rebuild)

## Context

We are replacing the existing Smart Room app with the new design in
`/Users/kanuj/Downloads/design_handoff_smart_room 2/` (README.md = spec,
`Smart Room.dc.html` = visual/behavior source of truth). The prototype runtime
(`support.js`, `<x-dc>`, `{{ }}`) is **not** to be ported — re-express in this
repo's idioms.

**Target stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 +
lucide-react. Fonts already wired: `--font-inter` (Inter) and `--font-geist-mono`
(Geist Mono) via `app/globals.css`.

**Decision (user, this session):** Match the handoff pixel-for-pixel as a
**click/tap-driven** app. Defer BCI control (focus cursor, jaw/blink/brow signals,
DWELL bar, REPLAY chip) — it will be reintroduced later. Keep the component
mountable inside `ManifestOS`: retain the `forwardRef<SmartRoomAppHandle>` shape
with a minimal `handleKey` that handles only `Esc`/exit so the OS Exit path still
works. Do **not** render the old DWELL bar or BCI hint footer.

**Integration points (do not break):**
- `components/app-open-view.tsx` mounts `<SmartRoomApp ref={smartRoomRef} onClose onNotify />`.
- `components/manifest-os.tsx` calls `smartRoomRef.current?.handleKey(e.key)` and
  expects `SmartRoomAppHandle = { handleKey: (key: string) => boolean }`.
- `lib/apps.ts` already registers `{ id: 'smartroom', name: 'Smart Room', icon: House }`.
- Keep `SmartRoomApp` exported from `components/apps/smart-room/smart-room-app.tsx`
  and the `SmartRoomAppHandle` / `SmartRoomAppProps` type exports.

**State model (from README "Scenes & Devices"):**
- Devices: `monitor: 'on'|'off'`, `lights: 'off'|'dim'|'on'` (cycle off→dim→on→off),
  `fan: 'off'|'low'|'high'` (cycle off→low→high→off), `blinds: 'open'|'closed'`.
  **No speaker.**
- Scenes (presets):
  - `focus  → { monitor:'on',  lights:'on',  blinds:'open',   fan:'low' }`  pose desk, headphones true
  - `sleep  → { monitor:'off', lights:'off', blinds:'closed', fan:'low' }`  pose bed, headphones false
  - `alloff → { monitor:'off', lights:'off',                  fan:'off' }`  pose desk, headphones false
  - **`alloff` intentionally omits `blinds`** — leave blinds untouched on All Off.
- `activeScene: 'focus'|'sleep'|'alloff'|'manual'`. Applying a scene sets it to the
  scene id + sets `lastAction = "<Scene> scene"`. Toggling any device sets
  `activeScene='manual'` + `lastAction` e.g. `"Lights DIM"`, `"Fan HIGH"`,
  `"Blinds CLOSED"`, `"Monitor ON"`.
- `pose: 'desk'|'bed'` and `headphones: boolean` are set by scenes only; device
  toggles never change pose/headphones.
- Tile-active logic: scene tile active when `activeScene===id`; Lights/Fan active
  when `!== 'off'`; Monitor active when `=== 'on'`; Blinds active when `=== 'closed'`.
- Config props: `startScene` (default `'focus'`), `showTelemetry` (default true),
  `showStatusText` (default true).

**Reduced motion:** every animated element must carry `data-sr-anim=""` so the
existing `@media (prefers-reduced-motion: reduce) { [data-sr-anim]{animation:none} }`
rule in globals.css disables it.

---

## Task 1 — State model (`lib/smart-room/`)

Rewrite `types.ts`, `state.ts`, and `state.test.ts` for the new model. TDD.

**`types.ts`:**
- `SceneId = 'focus' | 'sleep' | 'alloff'`
- `DeviceId = 'lights' | 'fan' | 'blinds' | 'monitor'`
- `Lights = 'off'|'dim'|'on'`, `Fan = 'off'|'low'|'high'`, `Blinds = 'open'|'closed'`,
  `Monitor = 'on'|'off'`
- `Pose = 'desk'|'bed'`
- `interface SmartRoomState { monitor; lights; fan; blinds; activeScene: SceneId|'manual'; pose: Pose; headphones: boolean; lastAction: string }`
  (No `focusIndex`, no `speaker`, no `movie`.)

**`state.ts`:**
- `SCENE_LABELS: Record<SceneId,string>` = Focus / Sleep / All Off.
- `DEVICE_LABELS: Record<DeviceId,string>` = Lights / Fan / Blinds / Monitor.
- `SCENES` presets exactly as above (alloff omits blinds — type it as
  `Partial<Pick<...>>` or a dedicated shape so applyScene can spread without
  forcing blinds).
- `POSE: Record<SceneId,Pose>` = focus desk, sleep bed, alloff desk.
- `HEADPHONES: Record<SceneId,boolean>` = focus true, else false.
- `initialState(startScene: SceneId = 'focus'): SmartRoomState` — returns state with
  that scene applied (devices + pose + headphones + activeScene + lastAction
  `"<Scene> scene"`). Default focus.
- `applyScene(state, id): SmartRoomState` — spread scene preset (NOT forcing blinds
  for alloff), set activeScene=id, pose=POSE[id], headphones=HEADPHONES[id],
  lastAction=`"${SCENE_LABELS[id]} scene"`.
- `nextLights(off→dim→on→off)`, `nextFan(off→low→high→off)`.
- `cycleDevice(state, id): SmartRoomState` — advance that device only, set
  activeScene='manual', lastAction `"${DEVICE_LABELS[id]} ${VALUE_UPPER}"`.
  Lights/Fan cycle; Monitor toggles on/off; Blinds toggles open/closed.
  Pose & headphones unchanged.
- `deviceValue(state, id): string` — current value string for a device.
- `isDeviceActive(state, id): boolean` — lights!==off, fan!==off, blinds===closed,
  monitor===on.

**`state.test.ts` (vitest):** cover initialState/startScene; applyScene for all 3
scenes including **alloff leaving blinds untouched**; lights & fan cycles; blinds &
monitor toggles; manual activeScene + lastAction strings; isDeviceActive truth table;
pose/headphones unchanged by device toggles.

Run `npm test` — all green. Commit.

---

## Task 2 — Visual derivation (`lib/smart-room/visuals.ts` + test)

Rewrite `visuals.ts` + `visuals.test.ts` (TDD). Remove wash, vignette, and speaker.
**No room dimming** — there is no mood overlay at all. `roomVisuals(state)` returns a
`RoomVisuals` object of pure strings/numbers derived from device state (README
"How the room reacts to state"):

- `monitorScreenBg`: monitor on → `radial-gradient(circle at 50% 42%, #5d8ad0, #28406e 55%, #14223c 100%)`; off → `linear-gradient(160deg,#22252b,#15171c)`.
- `monitorBloomOp`: soft blue bloom overlay opacity — 1 when on, 0 when off.
- `pcLedBg`: monitor on → `radial-gradient(circle,#ff6a4d,#e2402f)`; off → `#3a3d44`.
- `pcLedGlow`: monitor on → a red glow box-shadow (e.g. `0 0 8px 2px rgba(226,64,47,0.7)`); off → `none`.
- `lampShadeBg`: lights !== off → warm `linear-gradient(180deg,#ffe7be,#eec488)` (use the
  3-tone on palette `#ffe7be/#f7d59c/#eec488`); off → neutral `#f1efeb/#e3dfda/#d4cfc9`.
- `lampGlow`: lights on → `0 0 40px 14px rgba(255,196,110,0.55)`; dim → a softer variant; off → `none`.
- `lampPoolOp`: on → 0.6, dim → 0.4, off → 0.
- `blindsBg`: closed → vertical striped pattern (`repeating-linear-gradient`); open →
  blue sky gradient `linear-gradient(160deg,#cfe0f2,#aac4e0)` (sill drawn in markup).
- `fanAnim`: off → `'none'`; low → `'sr-spin 2.1s linear infinite'`; high → `'sr-spin 0.8s linear infinite'`.

Keep the interface minimal and documented. Tests assert each branch. `npm test` green. Commit.

---

## Task 3 — Isometric room + character (`components/apps/smart-room/room-stage.tsx`)

**Largest task.** Replace the current flat clip-path room with the true isometric
box-rendered room from the prototype. **Read the prototype geometry directly:**
`/Users/kanuj/Downloads/design_handoff_smart_room 2/Smart Room.dc.html`,
`buildScene(st)` = **lines 197–336** (includes bed/headboard/pillows, desk, monitor +
stand, PC tower, keyboard, chair, floor lamp, window, shelves, picture frames,
ceiling fan, and the seated/sleeping character "Steve"). The `proj(x,y,z)` projection
helper is at lines 188–195. The stage transform is at line 48:
`transform: scale(0.96) rotateX(58deg) rotateZ(45deg)` inside a `perspective:1900px`
stage; room unit space is 360×360×230.

Implementation:
- Re-express `buildScene` as a React/TS function that returns an array of face
  descriptors, rendered as absolutely-positioned `<div>`s with `translate3d` +
  `rotateX/rotateY(90deg)`, inside the `preserve-3d` rotated wrapper. Port the
  `box/top/fx/fy` helpers and the 3-tone color triples (WOOD/WOOD2/DUVET/PILLOW/
  WHITE/DARK/CHAIR/lamp/base — see README "Room palette").
- Accept `state: SmartRoomState` and apply **state bindings** (use `roomVisuals` from
  Task 2 where it fits, or read state directly for geometry swaps):
  - Monitor screen face uses `monitorScreenBg` + blue bloom overlay (`monitorBloomOp`).
  - PC tower power LED uses `pcLedBg` + `pcLedGlow`.
  - Floor lamp shade `lampShadeBg` + `lampGlow`, and a warm floor light-pool
    (`lampPoolOp`).
  - Window blinds: closed → vertical striped pattern; open → blue sky + sill.
  - Ceiling fan blades wrapper spins via `fanAnim` (off static / low 2.1s / high 0.8s).
  - Character: `pose==='desk'` → seated Steve facing monitor (back of hair), arms on
    desk, headphones only when `headphones===true`; `pose==='bed'` → only the blocky
    head on the pillow (closed-eye marks `#2a221b`, mouth `#9c6a47`, dark hair cap),
    body hidden under the smooth duvet mound. Character palette in README "Steve".
- **Overlays anchored over the room (NOT part of the OS chrome):**
  - **Scene caption** top-left (`left:28px; top:24px`): eyebrow "ACTIVE SCENE" (Geist
    Mono 10px, .2em, uppercase, `rgba(255,255,255,0.72)`, text-shadow
    `0 1px 6px rgba(0,0,0,0.4)`) over scene name (Inter 28px/600 white, text-shadow
    `0 2px 14px rgba(0,0,0,0.5)`). Name = `Focus`/`Sleep`/`All Off`/`Manual`.
  - **ZZZ** when `pose==='bed'`: three rising-fade "z" glyphs above the head, sizes
    increasing, colors `#7a7d84`→`#63666d`→`#4f525a`, staggered delays 0/.9s/1.8s.
- Stage background: `radial-gradient(120% 100% at 50% 28%, #dedad5, #c5c0ba)`.
- A single subtle neutral wash + faint vignette (opacity ~0.03–0.08) applied
  **uniformly** (same for every scene — never darkens). No per-scene mood.
- Every animated element (fan wrapper, lamp pool breathe, screen bloom breathe, each
  ZZZ) gets `data-sr-anim=""`.

Add any new keyframe needed for the ZZZ rise-fade to `app/globals.css` (e.g.
`@keyframes sr-zzz`). Reuse existing `sr-spin`, `sr-breathe`.

Visual parity is the bar. Run `npm run build` (typecheck) — clean. Commit.

---

## Task 4 — Glass control rail (`components/apps/smart-room/control-rail.tsx`)

Restyle to the handoff "Floating glass rail" spec. Click-driven (no focus cursor).

- Container: `position:absolute; left:50%; bottom:22px; transform:translateX(-50%)`,
  flex row align-center, gap 4px, padding `10px 14px`, radius **22px**, background
  `rgba(252,251,250,0.66)`, `backdrop-filter: blur(28px) saturate(1.6)`, border
  `1px solid rgba(255,255,255,0.7)`, shadow
  `0 1px 1px rgba(255,255,255,0.6) inset, 0 18px 50px -18px rgba(20,22,30,0.4)`.
- Two groups separated by a label + vertical divider (1px × 48px, `rgba(20,22,30,0.1)`,
  margin `0 5px`). Group labels "SCENES" / "DEVICES": Geist Mono 9px, .16em, uppercase,
  `#a3a6ad`.
- **SCENES (3):** Focus, Sleep, All Off → call `onApplyScene(id)`.
- **DEVICES (4):** Lights, Fan, Blinds, Monitor → call `onToggleDevice(id)`.
- Tile: vertical flex, padding `6px 9px`, radius **15px**, border `1px solid`,
  cursor pointer, transition `background .18s, border-color .18s`, hover bg
  `rgba(255,255,255,0.5)`. Icon disc 38×38 circle grid-centered holding a 16px line
  icon (stroke 1.7). Label Inter 10.5px/600 `#56595f`. Device status line (gated by
  `showStatusText`): Geist Mono 8.5px/600, .06em, uppercase device value
  (ON/DIM/OFF/LOW/HIGH/OPEN/CLOSED).
- **Active vs inactive token table** (README): border-color
  `rgba(226,64,47,0.28)` vs `rgba(20,22,30,0.08)`; tile bg `rgba(255,255,255,0.5)` vs
  transparent; disc bg `#fff` vs `#ededef`; disc shadow
  `0 4px 12px -4px rgba(226,64,47,.5), inset 0 0 0 1.6px rgba(226,64,47,.5)` vs
  `inset 0 0 0 1px rgba(20,22,30,.07)`; icon stroke `#e2402f` vs `#a6a8af`; status
  color `#c4291d` vs `#9a9da4`. Active = `isDeviceActive` for devices,
  `activeScene===id` for scenes.
- Icons (lucide-react equivalents, 16px stroke 1.7): Focus → `Target`; Sleep → `Moon`;
  All Off → `Power`; Lights → `Lightbulb` (fill `rgba(226,64,47,0.16)` when on);
  Fan → `Fan` (icon spins, slightly faster than room, when fan running); Blinds →
  swap glyph by state (closed = 4 slats / open = top+bottom only — use `Blinds`/
  `BlindsClosed`-style or a small inline SVG if lucide lacks the open/closed pair);
  Monitor → `Monitor`.

Run `npm run build` — clean. Commit.

---

## Task 5 — App shell wiring (`components/apps/smart-room/smart-room-app.tsx`)

Rewrite to assemble the handoff screen and drive state. Click-driven.

- `forwardRef<SmartRoomAppHandle, SmartRoomAppProps>`; keep
  `SmartRoomAppProps = { onClose; onNotify }` and add optional config with defaults:
  `startScene='focus'`, `showTelemetry=true`, `showStatusText=true`.
- State: `useState<SmartRoomState>(() => initialState(startScene))`. On apply scene /
  toggle device, update state, set lastAction (from state), and call
  `onNotify(lastAction)`.
- `handleKey`: minimal — only `Esc`/exit signal → `onClose()` returns true; otherwise
  return false. (BCI nav deferred.)
- **Full-viewport column**, `100vh` (use `h-full` within the OS open view), min-height
  680px, white bg, base text `#26282e`.
- **Header (66px)** per README §1: logo tile 34×34 radius 11 bg `#e2402f` shadow
  `0 4px 12px -2px rgba(226,64,47,0.5)` with white 17px `House` icon (stroke 1.8);
  eyebrow "MANIFEST" (Geist Mono 10px .18em) over "Smart Room" (Inter 15px/600);
  translucent bg `rgba(255,255,255,0.72)` blur 12px, bottom border
  `1px solid rgba(20,22,30,0.07)`. Right: **Exit pill only** (inline-flex gap 7,
  12px/500 `#6b6e76`, padding `7px 13px`, border `1px solid rgba(20,22,30,0.1)`,
  radius 999, 13px `X` icon) → `onClose`. **No REPLAY chip.**
- **Room stage** fills remaining height (`flex:1; overflow:hidden`): `<RoomStage state>`.
- **Last-action toast** top-right (`right:24px; top:22px`), gated by `showTelemetry`:
  eyebrow "LAST ACTION" (Geist Mono 9px .18em `rgba(255,255,255,0.62)`) over
  `state.lastAction` (Geist Mono 12px/500 white).
- **Control rail** at bottom: `<ControlRail state showStatusText onApplyScene onToggleDevice />`.
- **Remove** the old DWELL bar + BCI control-hint footer from inside the app.

`onApplyScene(id)` → `setState(s => applyScene(s, id))` + notify. `onToggleDevice(id)`
→ `setState(s => cycleDevice(s, id))` + notify. Read `lastAction` from the resulting
state for the toast/notify.

Run `npm run build` — clean. Manually sanity-check no other file references removed
exports (`focusIndex`, `speaker`, `movie`, `FOCUS_ORDER`, `cycle`, `focusPrev/Next`,
`focusedItem`, `focusLabel`). Update `components/controls-hint.tsx` `smart-room` mode
if it references removed behavior (leave a simple Exit/select hint; BCI later).
Commit.

---

## Task 6 — Cleanup, keyframes, full verification

- Ensure `app/globals.css` has the ZZZ keyframe and the `sr-spin` durations referenced
  by `visuals.ts` exist; remove the now-unused `sr-pulse` (speaker) keyframe only if
  nothing references it.
- Grep the repo for dangling references to removed symbols and fix.
- Run `npm run lint`, `npm test`, `npm run build` — all green.
- Launch dev server and verify the screen renders: header, isometric room with Steve,
  glass rail, scene caption, toast; clicking scenes/devices changes the room (monitor
  glow, lamp warmth, blinds, fan spin, pose swap + ZZZ on Sleep).

---

## Done criteria
- Pixel-faithful to the handoff (header, room, character, glass rail, caption, toast).
- State machine matches README exactly (incl. alloff leaving blinds; manual on device
  toggle; pose/headphones from scenes only).
- `npm run lint && npm test && npm run build` all pass.
- Component still mounts in ManifestOS via `smartRoomRef`; Exit works.
- No leftover references to speaker/movie/focusIndex.
