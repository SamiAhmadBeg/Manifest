# Manifest — Z Fellows Application Draft

*Internal application copy, evidence boundaries, interview preparation, and submission readiness.*
*Last updated: 2026-07-19. Derived from `POSITIONING.md`; verify every claim against the linked artifact before submitting.*

> **2026-07-19 — do not submit the previous drafts.** They claimed three live EMG gestures
> navigating Manifest OS. Verified against the code, that is false: two gestures are wired, long
> blink is keyboard-only, and both wired gestures are threshold logic over **Emotiv's own
> classifier** rather than a Manifest model. Every affected field below has been rewritten.
> Read the corrected "What is proven" section before touching any answer.
>
> **Also pending:** a competitor/market research fan-out commissioned 2026-07-19 covering Meta's
> sEMG work, Google Project Gameface, built-in OS accessibility, the Emotiv dependency, and AAC
> market structure. The competitor-insight answer below is provisional until that lands.

---

## The line to remember

> Manifest is the open consumer biosignal runtime that turns noisy signals from supported headsets into a few dependable software controls.

Use this as the category anchor. Accessibility is the first application; the company boundary is
the runtime for useful consumer biosignal software.

---

## Core application drafts

The current written fields allow 500 characters. Counts below include spaces and punctuation in
the answer text only, excluding the Markdown blockquote marker. Recount after every edit and after
pasting into the form.

### Project — 500-character draft

**Character count: 475/500 — verified by script 2026-07-19. Recount after any edit.**

> Manifest is an open runtime that turns messy biosignals into a few dependable controls: left, right, select, back, home. Two paths run today. A webcam head-pose tracker we built runs fully locally and navigates our OS shell. A second turns Emotiv's facial-expression classifier into reliable jaw-clench and brow-raise events — the reliability layer is ours, the classification is still theirs. Replacing it with our own EMG model and our own data is what we're building next.

*Why this wording:* it leads with the thing we own end to end, states the vendor dependency
before an investor finds it, and makes the next milestone concrete. It does not use the word
"intents" — jargon that invites "so what's an intent?" and burns interview time.

### Problem — 500-character draft

**Character count: 408/500**

> Consumer biosignal hardware can arrive in a box, yet making it useful still feels like a research project. A developer must combine device APIs, calibration scripts, signal-specific heuristics, reliability logic, and app bindings; a setup that works once may fail after a restart, for a new user, or on another supported device. Manifest productizes that missing path from signal stream to dependable intent.

### Founder expertise — founder input required

Do not submit a generic or inferred answer. The repository does not verify the personal facts this
prompt requires. Before drafting, both founders must supply:

- names, current roles, and the exact division of work on Manifest;
- relevant technical, research, product, accessibility, or lived experience;
- the specific parts of the prototype and study each founder personally built or ran;
- prior work or results that can be linked or independently verified; and
- current commitment, availability, and any other application-specific personal facts.

The final answer should connect verified founder experience to the two hard product problems:
calibration/reliability and making a constrained intent vocabulary useful in real software.

### Competitor insight — 500-character draft

**Character count: 428/500**

> BrainFlow and LSL help acquire or interoperate signal streams; BCI2000 supports research workflows; vendor SDKs expose device-specific capabilities. Manifest can use or coexist with them. We productize the layer above acquisition: consumer onboarding, guided calibration, a stable intent contract, reliability controls, OS/app integration, and reference experiences. We are not claiming the biosignal software category is empty.

### Founder insight from failure — 500-character draft

**Character count: 453/500**

> Our motor-imagery study failed its useful-control bar: 0.563 balanced accuracy on the EPOC-X and 0.583 with the full-channel recording. A known-good control reached 0.711, so the result narrowed the signal path rather than ending the product thesis. We stopped treating rich EEG control as proven. The insight is to productize calibration and reliability around a few dependable intents, while EEG remains an active experiment that must earn its claims.

---

## What is proven, and what is not

### Camera path — the strongest proof, and the one to lead with

- **Proven today:** `hooks/use-face-gaze.ts` runs MediaPipe `FaceLandmarker` locally in-browser,
  derives a nose-vs-eye-line yaw score, and drives left/right navigation through hysteresis
  (arm 0.036 / release 0.014), a 380 ms dwell, and a 1050 ms cooldown. Ours end to end. No cloud,
  no headset, no account. A stranger can run it on their own laptop in a minute.
- **Say it precisely:** this is **head pose**, not eye gaze. The variable is named gaze; the math
  is yaw. Call it head pose and nobody can catch you on it.
- **Limitation to state unprompted:** it requires voluntary head control, which excludes part of
  the population "accessibility" implies. Naming this yourself is worth more than the demo.
- **Open risk:** Google's Project Gameface may already occupy this exact space. Resolve before
  submitting — see the pending research note at the top.

### EMG path — real engineering, but the classifier is Emotiv's

- **Ours:** the event-shaping layer in `bridge/emotiv-bridge.mjs` — thresholds (0.10 / 0.62),
  exponential smoothing, rising-edge re-arming, a 280 ms release hold, a 900 ms cooldown, a
  750 ms cross-gesture lock, a simultaneous-gesture guard, and reconnect handling. This is
  genuinely the "reliability controls" layer the strategy claims, and it exists in code.
- **Not ours:** the classification. Deciding a signal burst *is* a jaw clench is done by Emotiv's
  proprietary `fac` classifier. We threshold a label; we do not produce one.
- **Two gestures, not three.** Long blink is not in the signal path — the bridge parses `eyeAct`
  and discards it (`void eyeAct`). It exists only as keyboard `b` in `lib/bci-controls.ts`.
- **Offline validation, not live proof.** Validated against Emotiv datasets. "It worked" means it
  worked on recorded data, through the vendor's classifier.
- **Do not say "overfit to founder data."** It implies we trained a model that failed to
  generalize. We did not train a model. The accurate phrase is: *the classification is Emotiv's;
  the reliability layer is ours.*
- **Product bet:** own the signal-to-label step. Calibration presupposes a model to calibrate, so
  "repeatable calibration" is the milestone *after* this one, not this one.

### The honest summary of technical status

> We own the interaction layer and one full camera-based modality. The EMG classification is
> still Emotiv's. Replacing it with our own model and data is the next thing we build.

If a single sentence in this application is memorized verbatim, make it that one.

### EEG evidence

- Live EEG control is **not currently demonstrated**. EEG is an active feasibility experiment.
- The motor-imagery study produced **0.563** headset balanced accuracy and **0.583** with the
  full-channel recording, below the useful-control bar.
- The **0.711** known-good control result supports the narrower statement that the analysis
  pipeline recovered a stronger signal on that dataset. It does not turn the failed approach into
  a working EEG-control claim.

### Accessibility and company scope

Accessibility is the first killer application because a few dependable controls can matter when
conventional input is unavailable or unreliable. It is not the boundary of the company. The
near-term adoption motion is developers and headset owners; the long-term opportunity is useful
consumer biosignal software across explicitly supported devices and operating systems. Do not
claim disability-user validation, clinical readiness, or a clinical deployment before direct
evidence exists.

---

## Evidence package for the application

Only link an item after it exists and the application wording matches what it proves.

| Claim | Minimum supporting artifact | Current boundary |
|---|---|---|
| Camera head-pose navigation | Uncut screen recording plus a link a stranger can run themselves | Head pose, not eye gaze; requires voluntary head control; overlap with Project Gameface unresolved |
| EMG event shaping | Uncut demo naming the headset and session conditions, stating on camera that classification is Emotiv's | Two gestures, not three; vendor classifier; validated offline on Emotiv datasets |
| Own EMG model | Nothing yet — this is the roadmap, not the evidence | Do not imply a Manifest classifier exists in any form |
| Basic reliability | Protocol plus calibration time, attempted actions, successful actions, false activations, and rejected actions | Report the tested session and configuration only |
| Repeatability | Same-person recalibration and a later cross-session attempt with failures retained | Do not generalize beyond measured sessions |
| External onboarding | Three to five new-user calibration attempts with founder interventions and failures recorded | Attempts are learning evidence, not validation unless the results support it |
| Device support | Public compatibility matrix naming exact headset, operating system, signal, intents, and test status | Untested combinations remain explicitly untested |
| EEG learning | Study protocol/results preserving 0.563, 0.583, and 0.711 | Failed motor-imagery result; no live EEG-control claim |
| Reproducibility | Clean-machine installation and onboarding record | Hidden local state or founder-only steps must be disclosed and fixed or listed |

Do not use repository stars, users, quotes, partnerships, customers, or clinical outcomes as
traction unless they exist at submission time and have a verifiable source.

---

## Interview preparation

### "So Emotiv already detects the jaw clench. What did you build?" — the question that decides the interview

Assume it gets asked. Do not let it be a surprise, and do not let it be the first time you sound
uncomfortable.

**The answer:**

> Emotiv detects it. Emotiv does not make it usable. Their raw classifier output fires and
> re-fires and flaps between labels — drop that straight into a UI and you get an interface that
> triggers three times when you clench once, and triggers on its own when you talk. What we built
> is everything between a label and a dependable action: thresholds, hysteresis so it re-arms only
> after sustained release, a cooldown, a cross-gesture lock so opening something can't
> instantly close it, and a guard for two gestures firing in one sample. That's the layer that
> makes it feel like an input device instead of a demo.
>
> And we're explicit that it's their classifier, not ours. That's the next thing we're replacing —
> our own model, our own data — because a runtime whose classification belongs to one vendor
> isn't a runtime.

**Why this works:** it is true, it is specific enough to prove you built it, and volunteering the
dependency before they find it converts your biggest weakness into evidence of self-awareness. An
investor who catches an unstated dependency stops believing everything else you said.

**What not to do:** do not blur "we got EMG gestures working" into implying you built the
detection. Do not say "overfit to founder data" — it is the wrong failure mode and a knowledgeable
investor will notice the mismatch and start probing. Do not claim three gestures.

### "Isn't this just Project Gameface?" — prepare a real answer

Google ships an open-source MediaPipe face-gesture accessibility tool. Our camera path may
overlap it substantially. **Do not improvise this answer.** The research fan-out commissioned
2026-07-19 covers it directly; read that output and write the answer here before submitting. If
the honest conclusion is that Gameface does the camera path better, the right move is to say so
and reposition around the multi-modality claim — not to pretend the overlap does not exist.

### Why is this not BrainFlow, LSL, or BCI2000?

Those tools address acquisition, interoperability, or research workflows. Manifest can build on
or coexist with them. Its product surface begins above acquisition: guide a consumer through
calibration, decide when a noisy signal is reliable enough to become an intent, expose a small
stable contract, and make that contract useful in OS and app experiences. The claim is a
different product layer, not an empty competitive field.

### Why start with accessibility if the company is broader?

Accessibility makes reliability consequential: a few trustworthy controls can be meaningful when
conventional input is unavailable or unreliable. It is the first killer application and a
demanding reference experience, not proof of disability-user adoption and not the company
boundary. Developers and headset owners are the initial adoption motion; the runtime can later
support other consumer biosignal applications wherever a few dependable intents create value.

### What does “overfit to founder data” mean?

The current gesture path was tuned around founder data and works in that personalized setup. It
proves possibility, not generalization. We have not yet shown that a new user can calibrate
without founder tuning, that performance survives later sessions, or that the path transfers to
another device. The company is productizing those missing steps: guided calibration, explicit
rejection, confidence controls, compatibility tests, and honest low-confidence states.

### Why does the EEG failure not kill the thesis?

The failed motor-imagery result killed a specific claim, not the need for a runtime. The EPOC-X
result was 0.563 and the full-channel recording was 0.583; the known-good control reached 0.711.
We therefore do not market live EEG control. EMG is our working control path. EEG remains an
experiment, and we will only add it when repeated tests show that it can produce dependable
intents.

### How can open source support a company?

Open source is the distribution and trust strategy: builders can inspect the signal path,
reproduce failures, add adapters, and build against the intent contract. The contract alone is not
a moat. If adoption and reliability are demonstrated, paid support, OEM integration,
compatibility testing/certification, and assurance work for compliant deployments are possible
business lines. These are hypotheses, not current customers, revenue, certifications, or clinical
readiness.

### What would validate the next stage?

The north-star test is: **a new user reaches three dependable controls on a supported headset
without founder tuning.** Evidence should include calibration time, successful and rejected
actions, false activations, repeated-session behavior, founder interventions, and the exact
hardware/operating-system configuration. Three to five external calibration attempts can reveal
the onboarding failures quickly; a second-headset test is important compatibility evidence but is
not a universality claim or a precondition for applying.

---

## 10–14 day evidence-first readiness sequence

Complete this in order. A failed attempt with a clear protocol is useful evidence; an unsupported
success claim is not.

1. **Day 1 — founder alignment.** Agree on the category, evidence boundaries, founder roles,
   application ownership, and one shared story. Collect the missing founder-expertise inputs.
2. **Days 1–2 — capture the live demo.** Lead with the camera head-pose path; it is ours end to
   end and reproducible by a stranger. Show the two-gesture Emotiv path second, and state on
   camera that the classification is Emotiv's and the reliability layer is ours. Identify the
   founder, exact headset, operating system, and session conditions. Do not imply EEG control,
   do not claim three gestures, and do not say "overfit."
3. **Day 2 — record basic metrics.** Before testing, define action attempts and errors. Record
   calibration time, successful actions, false activations, rejected actions, and the exact setup.
4. **Day 3 — repeat calibration.** Reset the personalized state and rerun the same-person guided
   calibration. Preserve failures and every founder-authored intervention.
5. **Day 4 — attempt cross-session use.** Reconnect or reposition the headset and test again in a
   later session. Report the result as one measured attempt, not cross-session reliability.
6. **Days 5–6 — prove clean-machine onboarding.** Install and run from a documented clean
   environment without hidden local state. Record every manual or founder-only step.
7. **Days 7–9 — run three to five external calibrations.** Ask new users to follow the same path.
   Record time, outcomes, failure points, and any founder tuning. Do not relabel attempts as
   cross-user validation unless the evidence supports it.
8. **Day 9 — publish the compatibility matrix.** Name the exact tested headset, operating system,
   signal path, intents, session count, and status. Mark all untested combinations as untested.
9. **Days 9–11 — attempt second-headset validation if feasible.** Test the adapter boundary and
   publish the exact outcome. This is important evidence, but broad compatibility is not required
   before applying.
10. **Days 10–11 — synchronize README and repository.** Align setup instructions, demo links,
    study figures, honest live/simulated/replay labels, safety notes, compatibility claims, and
    contribution paths. Remove placeholders and stale universality or clinical claims.
11. **Days 11–12 — finalize application answers.** Insert only verified metrics and links, obtain
    founder-personal answers, recount every limited field, and run the claim scan again.
12. **Days 12–13 — record a separate founder introduction video.** Keep this distinct from the
    product demo. Use verified founder backgrounds, roles, motivation, and division of work; do
    not substitute product footage for personal answers.
13. **Day 14 — submit.** Have both founders compare the form, videos, repository, compatibility
    matrix, and study artifact. Submit the strongest verified state even if second-device proof is
    incomplete; name the next test instead of implying universality.

**Ready-to-submit bar:** the application cleanly separates current proof, open risks, and future
vision; every factual claim maps to an artifact; the live demo is honestly labeled; founder facts
come from the founders; and no untested user, session, device, operating-system, accessibility, or
clinical claim is presented as achieved.

---

## Final submission audit

- [ ] Every 500-character field has been recounted after the final paste.
- [ ] The founder-expertise answer and introduction video use founder-supplied facts.
- [ ] **No answer, video, README, or slide claims three EMG gestures.** Two are wired.
- [ ] **Every EMG mention states that classification is Emotiv's and event shaping is ours.**
- [ ] **The phrase "overfit to founder data" appears nowhere** — we did not train a model.
- [ ] The camera path is described as head pose, not eye gaze.
- [ ] The Project Gameface overlap question has a written answer, not an improvised one.
- [ ] The market research output has been read and its corrections applied to the competitor answer.
- [ ] SSVEP is described as decided against on seizure-risk and comfort grounds — not as a
      future feature. Residual SSVEP code in the repo is deleted or clearly commented as disabled.
- [ ] EEG is described as an active experiment that has failed once, not working live control.
- [ ] Study figures remain 0.563, 0.583, and 0.711 with their correct meanings.
- [ ] Accessibility is the first application, not claimed user validation or the company boundary.
- [ ] Every supported-device and operating-system claim matches the public compatibility matrix.
- [ ] Every metric includes its protocol, configuration, and sample/session scope.
- [ ] The README, demo, repository status, application, and founder video tell the same story.
- [ ] Possible business lines are labeled hypotheses, not current revenue or customers.
- [ ] No placeholder link, invented quote, partnership, traction, biography, or clinical claim
      remains.
