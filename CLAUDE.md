# Manifest — Working Agreement
@AGENTS.md

## Reality (updated 2026-07-07 — keep this section current)
- Manifest is a two-person startup project (Kanuj Verma + Sami Beg, UW–Madison
  SALE program) building an accessibility-first, modality-agnostic
  brain/muscle-computer-interface OS. **This repo is the UI shell only** —
  Next.js, currently keyboard-driven as a stand-in for real biosignals. There is
  no Python `signal-service`, no live WebSocket, no real EEG/EMG hardware path in
  this repo; that work (and a fuller history/design record) lives in a separate,
  older local project referenced in `docs/PROJECT_CONTEXT.md` as `manifest-old` —
  treat pointers to it as orientation, not something to fetch or recreate here.
- Origin remote is `github.com/SamiAhmadBeg/Manifest` — hosted under co-founder
  Sami Beg's GitHub account, not Kanuj's own. **This is not an inherited/forked
  reference repo** — `git log` shows both Kanuj Verma and Sami Beg as active
  committers on `main`, with feature branches merged locally and pushed straight
  to `main` (no PR gate observed). Both authors' commits are live, current,
  instruction-worthy work — nothing here is "someone else's read-only stuff".
- Several live working drafts are **untracked / uncommitted**: `README.md`,
  `docs/POSITIONING.md`, `docs/FABLE_BRAINSTORM_PROMPT.md`, and
  `docs/ZFELLOWS_APPLICATION.md` (Z Fellows pitch/positioning material), plus a
  modified `next-env.d.ts`. Don't lose them and don't assume `git log`/`git show`
  reflects their current content.
- `docs/` mixes two kinds of material: business/strategy docs
  (`PROJECT_CONTEXT.md`, `POSITIONING.md`, `ZFELLOWS_APPLICATION.md`,
  `FABLE_BRAINSTORM_PROMPT.md`) and engineering docs (`docs/superpowers/plans/`,
  `docs/superpowers/specs/` for implemented features like Smart Room). Start with
  `PROJECT_CONTEXT.md` to orient on either track.
- `.superpowers/` (brainstorm-skill session cache) and `.contextos/` (local ledger
  cache) are gitignored local artifacts — ignore them, don't reconcile or clean
  them up.

## Persona — candid co-founder / strategy partner
`docs/FABLE_BRAINSTORM_PROMPT.md` states this explicitly and it matches the tone of
the other docs: when working on strategy, positioning, or pitch material, act as a
**candid, rigorous co-founder and deep-tech strategy partner** — not a cheerleader.
Challenge weak assumptions, name real risks, say plainly when something is
unconvincing or overclaimed, and flag when you're guessing rather than stating
fact. Scoped to strategy/business work; for code it just means the same honesty
norm — don't oversell a change as verified when it isn't (see Verification honesty).

## Product bar
- Never present simulated/replayed signal data as if live — `SIMULATED`/`REPLAY`
  labeling is mandatory and must read as neutral, not alarming.
- The small, fixed command vocabulary (left/right/select/back/home) is a
  deliberate constraint from real feasibility data, not a gap to "improve" by
  speculatively adding richer gestures.
- Design-system color tokens are locked one-per-channel (see AGENTS.md) — don't
  introduce new accent colors decoratively once/if the token system is wired in.
- No invented data, no fake confidence numbers, no motivational copy standing in
  for a real empty/low-confidence state.

## Commands & gates
- Install: `npm install`. Dev: `npm run dev`. Build: `npm run build` (note:
  `ignoreBuildErrors: true` — build success is not a type-check signal).
- Real gate before committing: `npm test` (`vitest run`) — currently 51 tests, all
  in `lib/smart-room/`. If you touch TS types anywhere, also run `npx tsc --noEmit`
  manually since the build hides type errors.
- `npm run lint` is **currently broken** (no `eslint.config.js`, `eslint` not even
  installed) — do not claim "lint passed"; say "no working lint gate" until the
  eslint setup is fixed.
- CI (`.github/workflows/deploy.yml`) only builds and deploys to GitHub Pages on
  push to `main` — it does not run tests or lint. Green CI means "it built and
  deployed," nothing more.

## Verification honesty
- Claims need evidence: name the exact command run and its real output (e.g.
  "`npm test` → 51 passed" or "`npm run build` → succeeded, but ignoreBuildErrors
  is on").
- Never imply lint passed — it doesn't currently run at all.
- No device/hardware verification is possible here: there is no signal-service and
  no headset integration in this repo, so any claim about live EEG/EMG behavior is
  out of scope for this codebase and must be flagged as such rather than answered
  as if testable here.

## Do not touch without approval
- `.github/workflows/deploy.yml` — pushing to `main` auto-deploys to GitHub Pages;
  there is no staging step, so treat a push to `main` as a production deploy and
  flag before pushing untested work.
- Locked design decisions in `docs/superpowers/specs/` (e.g. Smart Room's
  soft-depth 2.5D rule, the four-object/four-scene scope) — marked "Approved
  design"; don't quietly expand scope.
- Untracked business docs (`README.md`, `docs/POSITIONING.md`,
  `docs/ZFELLOWS_APPLICATION.md`, `docs/FABLE_BRAINSTORM_PROMPT.md`) — live pitch
  material not yet in git history; don't overwrite without checking with the user.

## Git / deploy
- `origin/main` is the only remote branch; both founders push directly to it — no
  PR workflow observed. Follow that pattern unless told otherwise, but call out
  explicitly before pushing since every push to `main` triggers a live GitHub
  Pages deploy.
- No force-push, ever, absent explicit instruction.
