# Manifest — Agent Facts

## What this is
Manifest is a biosignal-controlled "OS shell" — a Next.js/React UI intended to be
driven by brain (EEG) and facial-muscle (EMG) signals from a consumer headset
(Emotiv EPOC-X), mapped to a deliberately tiny command vocabulary: left, right,
select, back, home. Today the UI is **keyboard-driven only** as a stand-in for
those signals; there is no live signal-service or WebSocket connection in this repo.

## Stack
- Next.js 16.2.6 (App Router, Turbopack), React 19, TypeScript 5.7.3 (strict mode)
- Tailwind CSS v4 + shadcn (`components.json` present) + `tw-animate-css`
- `framer-motion` for motion, `lucide-react` for icons, `@base-ui/react`
- `@vercel/analytics`
- Test runner: `vitest` (unit tests only, no e2e)
- Node: v22 locally via nvm; CI (GitHub Actions) builds on Node 20 — versions
  differ, be aware if a build behaves differently in CI vs local.

## Repo layout
- `app/` — Next.js App Router entry: `layout.tsx`, `page.tsx`, `globals.css`.
  Minimal; the real shell lives in `components/manifest-os.tsx`.
- `components/` — `manifest-os.tsx` (shell), `app-carousel.tsx`, `app-open-view.tsx`,
  `top-bar.tsx`, `controls-hint.tsx`, `notification-panel.tsx`, `ui/` (shadcn
  primitives), and `apps/` — one subfolder per carousel app: `movies/`,
  `smart-room/`, `snake/`. Most carousel entries in `lib/apps.ts` are placeholder
  tiles; **Movies, Snake, and Smart Room are the only fully built apps.**
- `lib/` — pure logic per app (`movies/`, `smart-room/`, `snake/score.ts`), plus
  `bci-controls.ts` (keyboard → intent mapping) and `apps.ts` (app registry).
  `lib/smart-room/` is the only directory with test coverage (`state.test.ts`,
  `visuals.test.ts`).
- `hooks/use-movies.ts` — Movies app data hook.
- `docs/` — mixed business + engineering docs (see CLAUDE.md for how to read these).
- `public/` — static assets. Reference screenshots (`manifest.png`, `music.png`,
  etc.) are checked into the **repo root**, not `public/`.
- `.github/workflows/deploy.yml` — GitHub Pages deploy on push to `main`.

## Commands
- Install: `npm install` (both `package-lock.json` and `pnpm-lock.yaml` exist, but
  only npm is actually installed/used — don't switch to pnpm without installing it
  first).
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build` (Turbopack). **`next.config.mjs` sets `typescript:
  { ignoreBuildErrors: true }`** — a successful build does NOT mean the code
  typechecks. Run `npx tsc --noEmit` separately for a real type check.
- Start (prod server): `npm run start`
- Test: `npm test` → `vitest run`. Currently 51 passing tests, all under
  `lib/smart-room/`. This is the only real automated gate in the repo.
- Lint: `npm run lint` → `eslint .` — **currently broken**: `eslint` is not a
  devDependency and there is no `eslint.config.js`/`.mjs`. Running it auto-installs
  a fresh `eslint@10` via npx and then fails with "couldn't find an eslint.config
  file." Do not treat lint as a gate until this is fixed.
- Static export for GitHub Pages: `GITHUB_PAGES=true npm run build` → outputs to
  `out/`, `basePath`/`assetPrefix` set to `/Manifest`. This is what CI runs on
  every push to `main`.

## Architecture / state model
- Intent contract (aspirational, documented in `docs/PROJECT_CONTEXT.md`, not yet
  implemented as a real service in this repo): a WebSocket protocol where a Python
  `signal-service` would emit `hello` / `telemetry` (~4 Hz, meters only) / `event`
  (the only thing that changes app state) / `error`, and the UI sends `inject`
  (bypass dwell/cooldown, fire immediately) and `replay`. **Today,
  `lib/bci-controls.ts` maps keyboard keys directly to the `inject`-style path**:
  `←`/`→` = nav left/right, `Enter` = EMG jaw clench (select/play/pause), `↑` =
  brow raise (exit/home), `Esc`/`x` = exit, `Backspace`/Delete = remove.
- App registry: `lib/apps.ts` drives the carousel. Adding a new "real" app means
  adding a registry entry plus a `components/apps/<name>/` + `lib/<name>/` pair,
  following the Movies/Snake/Smart Room pattern (pure logic in `lib/`, UI in
  `components/apps/`).
- Design-system color tokens (`--c-intent` cyan `#74e0ff`, `--c-emg` magenta
  `#ff86cf`, `--c-go` green `#67e6a8`, `--c-warn` amber `#f5b454` — one color per
  signal channel, never reused decoratively) are **documented as the target system
  in `docs/PROJECT_CONTEXT.md` but are not yet wired into `app/globals.css` or any
  component** — verified by grep, no hits. Don't assume they exist in code; check
  before referencing them as implemented.

## Conventions
- Path alias `@/*` → repo root (see `tsconfig.json`).
- TypeScript strict mode is on; `noEmit: true` (Next handles emission).
- "Honest labeling" is a coding convention, not just a UX one: any
  simulated/replayed signal data must carry an explicit `SIMULATED`/`REPLAY` label
  in the UI — never present synthetic data as if it were live. Prefer an explicit
  empty/low-confidence state over inventing output.
- Testing scope today is narrow (`lib/smart-room/` only) — new pure-logic modules
  (state reducers, scoring, visual-derivation helpers) should get the same
  `*.test.ts` treatment; UI components currently have no test coverage and no
  established pattern for adding it.
