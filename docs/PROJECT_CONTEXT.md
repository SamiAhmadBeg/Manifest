# Manifest — Project Context

> Local working notes. Distilled from the previous project iteration in
> `/Users/kanuj/manifest-old` (specs, protocol, Track A feasibility report) plus a
> read of the current repo. Not committed source-of-record — it's orientation for
> whoever (human or agent) picks this up.

---

## 1. What Manifest is

**A biosignal-controlled OS shell.** The vision: navigate a desktop-like UI (a
carousel of apps, lists inside each app) using **brain + face signals** from an
**Emotiv EPOC-X** headset instead of a mouse/keyboard.

Two signal channels map to the whole interaction model:

- **EEG / motor imagery (`nav`)** → left / right navigation (scroll the carousel,
  move through a list). Imagining a left- vs right-hand movement is the intended
  "left/right button."
- **EMG / facial gestures** → discrete actions: **jaw clench = select/play/pause**,
  **brow raise = exit/home**.

The product is deliberately driven by a *tiny* command vocabulary
(left, right, select, back, home) because that's all a dwell-based BCI can reliably
produce.

---

## 2. The two tracks (from the old repo)

The previous iteration split the work into two tracks. **This understanding still
governs the architecture even though the current repo is a fresh UI build.**

### Track A — "Can brain signals actually drive this?" (offline ML feasibility)
- Lives in `manifest-old/track-a/`. Pure offline analysis on public MOABB datasets
  (PhysioNet EEGMMIDB, BNCI 2b). No live headset.
- **Verdict: NO-GO for motor imagery on this headset.** Headset 14-electrode score
  was **0.563 balanced accuracy** (coin flip = 0.50; bar was ≥0.70). The headset is
  missing the key motor electrodes (C3/Cz/C4); even the full 64-electrode setup only
  reached 0.583, so it's a weak-signal problem, not just electrode placement.
- Pipeline was proven sound by a known-good control dataset (BNCI 2b → 0.711).
- **Recommended pivot: SSVEP** (flickering on-screen targets the user looks at —
  detected at the **back of the head**, O1/O2/P7/P8, where this headset *does* have
  coverage). P300 is a later option. Keyboard/replay stays as the guaranteed fallback.
- Key consequence baked into naming: the nav producer is called **`nav`**, not `mi`,
  so an **MI → SSVEP swap is zero-UI-change**. Scientific provenance lives only in a
  `source` string (e.g. `mi-replay`, `ssvep-live`).

### Track B — "Live demo skeleton" (the runtime path)
- Two processes joined **only by a WebSocket contract**:
  - Python **`signal-service`** — owns ALL signal logic: source → ring buffer →
    bandpass (8–30 Hz) → classifier → dwell/hysteresis/cooldown → emits messages.
  - React **`shell-ui`** — owns ALL nav/app state; never implements signal logic.
- v0 was driven entirely by **synthetic real-shaped EEG replay** + **fake EMG** +
  `inject` commands. No hardware, no real ML — the point was to stand up the entire
  path so Track A's real classifier and live hardware swap in behind fixed interfaces
  later (planned W3–W5).
- **Hard rule:** every protocol field must be populated for real by the synthetic
  source — no null/dead UI that reads as "broken" on stage.

---

## 3. The WebSocket protocol (v0.1) — the contract that matters

Source-of-record in old repo: `manifest-old/protocol/PROTOCOL.md` (+ canonical
examples in `manifest-old/protocol/examples/`). One bidirectional socket. Every
message has `t` (ms since start), `seq` (monotonic, for ordering + dedupe), `type`.

**Service → UI:**
- `hello` (once): `proto`, `intentSource`, `capabilities`.
- `telemetry` (~4 Hz): `nav{label,value,dwell,source}` + `emg{jaw,brow,active,source}`.
  - `nav.label` ∈ {left,right,none}; `nav.value` ∈ [-1,1] (needle); `nav.dwell` ∈ [0,1].
  - **No raw probabilities, no live confidence** in headline telemetry (avoids the
    "guessing/flicker" look). `quality` reserved for live-hardware phase.
- `event` (only on a real fire; **`none` is never an event**):
  `kind` ∈ {intent,action}, `value` (intents: left/right; actions: select/back/home),
  `source`, `confidence` (frozen at fire time).
- `error` (one-shot): `message`, `fatal`.

**UI → Service (exactly two commands):**
- `inject` — Wizard-of-Oz / dev / backup. Bypasses dwell+cooldown, fires the event
  immediately (`source:"inject"`) + a telemetry blip. **This is what the current
  keyboard control maps to.**
- `replay` — `action` ∈ {play,pause,seek}, `posMs`.

**UI event rules:** app state changes **only** on `event`; `telemetry` drives meters
only; `none` never moves anything.

---

## 4. Visual design system — "Restrained Glass Neural OS"

Old spec: `manifest-old/docs/superpowers/specs/2026-06-12-manifest-shell-ui-design-system.md`.
Locked principles worth preserving in the new UI:

- **Glass = future, solid = trust.** Glassmorphism on the focal carousel tile + app
  surfaces; **solid/tinted** on the data rail (truth panel) so telemetry stays legible
  from across a room.
- **One color per channel** (never reused decoratively):
  - `--c-intent` cyan `#74e0ff` — EEG intent needle, **dwell fill**, focus ring, nav arrows.
  - `--c-emg` magenta `#ff86cf` — EMG bars / flash / gesture events only.
  - `--c-go` green `#67e6a8` — the moment of fire/select/success (the event, not build-up).
  - `--c-warn` amber `#f5b454` — transient warnings only (never the standing REPLAY label).
- **Motion only on signal events** (no animated background). Cyan dwell fills → green fires.
- **Two type families:** mono for ALL telemetry (instrument voice), sans for app content
  (product voice).
- **Readable from the back of a room** — WCAG AA floor, survives projector + compression.
- **Honest labeling:** `REPLAY` / `SIMULATED` chips are neutral, not alarming. Copy never
  overclaims ("imagine left-hand movement when the cue appears", not "control with your mind").
- Avoid: tooltips, drawers, modals, segmented controls (un-drivable by a dwell BCI).
  Use: command ribbon (teaches the control model live), focus lens, source chips,
  recent-pulse timeline, 2-level breadcrumb.

---

## 5. THIS repo (current state — `/Users/kanuj/manifest`)

A fresh **Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4** rebuild of the
shell-ui. **Keyboard-driven only so far** — no `signal-service` / WebSocket yet; the
keyboard maps to the `inject`-style path.

- Stack: `next 16.2.6`, `react 19`, `framer-motion`, `lucide-react`, `@base-ui/react`,
  shadcn, Tailwind v4, `@vercel/analytics`. TypeScript.
- Entry: `app/page.tsx` → `components/manifest-os.tsx` (the shell).
- Control mapping: `lib/bci-controls.ts` — keyboard stand-ins for biosignals:
  - `←/→` = EEG left/right scroll, `Enter` = EMG jaw clench (select/play/pause),
    `↑` = brow raise (exit to home), `Esc`/`x` = exit, `Backspace`/Delete = remove.
- App registry: `lib/apps.ts` — carousel apps (Spotify, Browser, Calendar, Messages,
  Weather, Photos, **Movies**, **Snake**, AI Assistant, Music, Maps). Most are tiles;
  **Movies** and **Snake** are the real built-out apps.
  - Movies: `components/apps/movies/*` + `lib/movies/*` + `hooks/use-movies.ts`
    (library, player, add-movie dialog).
  - Snake: `components/apps/snake/*` + `lib/snake/score.ts`.
- Shell chrome: `top-bar.tsx`, `controls-hint.tsx`, `notification-panel.tsx`,
  `app-carousel.tsx`, `app-open-view.tsx`.
- Reference screenshots checked into repo root (`manifest.png`, `music.png`,
  `redesign-home.png`, `final.png`, etc.).
- Git remote: `origin → github.com/SamiAhmadBeg/Manifest`.

### Gap vs the old architecture
The current repo is the **UI half only**, and currently keyboard-driven. The
`signal-service` (Python WS server), the real protocol module, and the SSVEP live path
do **not** exist here yet. When/if they're added, they should land behind the same
WebSocket contract in §3 so the UI doesn't have to move.

---

## 6. Local dev

- Node: **v22.23.0 via nvm** (bumped from system v20.11.0 — see below). `default` alias
  set to 22; nvm wired into `~/.zshrc`.
- Install: `npm install` (npm — `pnpm` not installed locally; both lockfiles present).
- Run: `npm run dev` → http://localhost:3000. `npm run build` verified clean on Node 22.
- `~/.npmrc` had `prefix=~/.npm-global` (conflicts with nvm) — commented out;
  backup at `~/.npmrc.bak`. Old global CLIs (vercel, claude) still on PATH via
  `~/.zshrc` line 7 (`~/.npm-global/bin`).

---

## 7. Pointers (old repo)

| Topic | Path |
|---|---|
| Track B design (source-of-record) | `manifest-old/docs/superpowers/specs/2026-06-11-manifest-track-b-design.md` |
| Shell-UI visual design system | `manifest-old/docs/superpowers/specs/2026-06-12-manifest-shell-ui-design-system.md` |
| Track A design | `manifest-old/docs/superpowers/specs/2026-06-17-manifest-track-a-design.md` |
| Protocol v0.1 + examples | `manifest-old/protocol/PROTOCOL.md`, `manifest-old/protocol/examples/` |
| Track A feasibility writeup (NO-GO + SSVEP pivot) | `manifest-old/track-a/docs/2026-06-17-track-a-feasibility-writeup.md` |
| Track A machine report | `manifest-old/track-a/reports/track-a-feasibility-report.md` |
| Signal-service (Python) | `manifest-old/signal-service/` |
| Old shell-ui (React+Vite) | `manifest-old/shell-ui/` |
| Implementation plans | `manifest-old/docs/superpowers/plans/` |
