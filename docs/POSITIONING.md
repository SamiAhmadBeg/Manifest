# Manifest — Positioning Strategy

*Durable internal strategy for product, messaging, and Z Fellows readiness. Not public README copy.*
*Last updated: 2026-07-19*

> **2026-07-19 correction.** The previous version of this document claimed a live three-gesture
> EMG prototype (jaw clench, eyebrow raise, long blink) navigating Manifest OS. **That claim was
> wrong and has been removed.** Verified against `bridge/emotiv-bridge.mjs` and
> `lib/bci-controls.ts`: two gestures are wired, not three (long blink exists only as the
> keyboard key `b`; the bridge reads Emotiv's `eyeAct` field and explicitly discards it), and
> both wired gestures are *threshold logic on top of Emotiv's own proprietary classifier*, not a
> Manifest model. See "What the evidence says today" below. Anyone who repeated the old claim
> externally should correct it.

---

## ⚠ Blocking constraints — read before writing code or recording anyone

*From the legal/business research, 2026-07-19. Full detail and quoted contract text in
`docs/research/LEGAL_AND_BUSINESS_MEMO.md`. Not legal advice.*

1. **Do not distribute anything that calls Emotiv Cortex.** Not a release, not a public build,
   not a link to a friend. Emotiv's published Distribution License Agreement (§1.6) covers
   *"MN8 devices and Insight devices (including their successors)"* — **EPOC X is not covered at
   all**, and §2.1 says research products need a separate licence that is published nowhere.
   Separately, DLA §2.4 requires that open-source distributions be submitted to Emotiv for
   *"review and approval, in EMOTIV's sole discretion"* — prior, discretionary approval, before
   publishing. Local use between the two of us is fine.
2. **Do not train a classifier on the Cortex `fac` stream.** API License §10.2(g) bars using the
   API *"in order to build a competitive product or service."* Building a replacement `fac`
   detector is a fair description of that. This was our stated next milestone; it is the
   worst-positioned plan under the documents.
3. **Do not record or retain a single user session** — face frames, landmark streams, or EEG —
   until the consent gate and public retention policy exist. Not for a demo, not "just for
   calibration." Under an hour of work; see the checklist in the memo.
4. **Do not put user accounts, logins, or a backend on the same surface as camera input.**
   Account linkage — not which landmarks we read — is the variable separating the BIPA cases
   that were dismissed from the ones that survived.
5. **Do not say "20% royalty," "reimbursable," "insurers pay," or "non-biometric."** The royalty
   is 15% in the executed instrument and applies to a device class we don't ship. E2511's 2026
   Medicare ceiling is **$0.00** and access software is expressly bundled. And landmark geometry
   demonstrably re-identifies (96.8% rank-1 from ten landmark distances, Gupta et al. 2010).

**The strategic consequence, which inverts the roadmap.** The camera path — which we had filed
as the commodity one — is the only path we can legally ship today: MediaPipe FaceLandmarker and
all three of its sub-models are Apache-2.0 with no field-of-use restriction, and BlazeFace's model
card names *"assistive technologies"* as an intended application. The EMG path — which we had
filed as the differentiated one — is blocked on distribution and blocked on the own-model plan.

Build the camera path. Treat EMG as research until there is a written answer from Emotiv or a
move to vendor-neutral hardware.

---

## The category insight

> **Under revision as of 2026-07-19.** The framing below predates the market research and is
> partly invalidated by it: Apple shipped the runtime contract in iOS 26, so "the open consumer
> biosignal runtime" is no longer an available category claim. The sharper replacement is
> proposed at the end of this document under "The revised position." Read both; the sections
> between them have been corrected but not yet fully rewritten around the new frame.

**Consumer biosignal hardware exists, but turning it into dependable software still feels like a
research project. Manifest is the open consumer biosignal runtime that closes that gap.**

Headsets can expose EEG, EMG, and related signals, but a stream of measurements is not yet a
usable control surface. Developers and headset owners still have to assemble device APIs,
calibration scripts, signal-specific heuristics, reliability logic, and application bindings.
The result may work once for one person, yet fail after a restart, for a new user, or on another
supported device.

Manifest's job is to turn supported biosignal hardware into a small set of dependable,
application-ready intents. It does not promise rich mind reading. It makes a deliberately tiny
control vocabulary useful by productizing everything between acquisition and the application.

---

## What Manifest is

Manifest is an open runtime with six connected responsibilities:

1. **Device adapters** connect supported headsets and operating systems without forcing each app
   to own device-specific integration.
2. **Guided per-user calibration** helps each person establish controls from the signals that are
   reliable for them.
3. **A small, stable intent contract** exposes application-ready commands such as left, right,
   select, back, and home while allowing the underlying signal source to change.
4. **Reliability controls** handle confidence, dwell, cooldown, rejection, and explicit
   low-confidence states instead of turning every noisy fluctuation into an action.
5. **OS and app integration** lets software consume intents through a consistent interface rather
   than interpret raw biosignals.
6. **Reference experiences** prove the contract in real interfaces and give builders patterns they
   can extend.

The runtime is modality-aware but not dependent on one modality. EMG is the working prototype
path. EEG remains an active feasibility frontier. A supported setup may use different signals,
but every path must meet the same standard: reliable intents, honest status, and no synthetic or
low-confidence output presented as live control.

### Adoption motion, flagship application, and vision

| Horizon | Focus | Why it matters |
|---|---|---|
| **Initial adoption** | Developers and headset owners who are already trying to turn consumer biosignal hardware into useful software. | They feel the integration and calibration problem directly, can reproduce the setup, and can contribute adapters, measurements, and apps. |
| **Flagship application** | Accessibility: a small dependable vocabulary can unlock meaningful computer control when conventional input is unavailable or unreliable. | It gives the runtime a demanding, consequential reference experience without claiming that disability users or clinical deployments have already validated the product. |
| **Long-term vision** | Broader consumer biosignal computing built on a common runtime across supported devices and operating systems. | Apps can target stable intents instead of rebuilding a research pipeline for every headset, user, and signal source. |

Accessibility is the first killer application, not the boundary of the company. The near-term
motion is an open tool that developers and headset owners can try. The broader ambition is a
trusted runtime for consumer biosignal software wherever a few dependable intents create value.

---

## What the evidence says today

### What actually runs today, ranked by strength of evidence

**1. Webcam head-pose navigation — the strongest working path.**
`hooks/use-face-gaze.ts` runs Google's MediaPipe `FaceLandmarker` locally in the browser and
derives a nose-versus-eye-line yaw score, gated by hysteresis (arm 0.036 / release 0.014), a
380 ms dwell, and a 1050 ms cooldown. It drives left/right carousel navigation. No cloud call, no
headset, no account. This is fully ours, fully reproducible on any laptop, and it is the only path
a stranger can try in under a minute.

It is also, honestly, **head pose rather than gaze** — the variable name says gaze, the math says
yaw. It requires voluntary head control, which excludes part of the population accessibility
implies. Both facts should be stated plainly rather than left for someone else to notice.

**2. Emotiv facial-expression bridge — real, but not our model.**
`bridge/emotiv-bridge.mjs` connects to the Emotiv Cortex API, subscribes to the `fac`
(facial-expression) stream, and converts **Emotiv's own classifier labels** — `lAct === 'clench'`
and `uAct === 'surprise'` — into `jaw-clench` and `brow-raise` events, using thresholds
(0.10 / 0.62), exponential smoothing, rising-edge re-arming, a 280 ms release hold, a 900 ms
cooldown, and a 750 ms cross-gesture lock.

Be exact about what this is and is not:

- **Ours:** the event-shaping layer. Thresholds, hysteresis, debouncing, cooldowns, the
  simultaneous-gesture guard, reconnect handling, and the intent contract the UI consumes. This is
  genuinely the "reliability controls" layer the strategy claims — it exists in code.
- **Not ours:** the classification. Deciding that a burst of signal *is* a jaw clench is done by
  Emotiv's proprietary, undocumented classifier. We consume a label; we do not produce one.
- **Two gestures, not three.** Long blink is not implemented in the signal path. `eyeAct` is
  parsed and discarded (`void eyeAct`). It exists only as keyboard `b` in `lib/bci-controls.ts`.
- **Offline validation, not live proof.** The gesture path was validated against Emotiv datasets.
  "It worked" means it worked on recorded data through the vendor classifier.

The honest one-line version: **we built dependable event shaping on top of someone else's
classifier, and we have not yet built a classifier of our own.**

**3. Voice assistant (OpenAI) and Biosignal Lab.** Real, working, and not part of the biosignal
thesis. The Lab is a useful telemetry/debug surface. Neither is evidence for the runtime claim.

**Not working: no Manifest model, no Manifest training data, no live EEG control.**

### Why the vendor-classifier dependency is the central strategic fact

The old framing — "a real prototype, overfit to founder data" — was more flattering than the
truth, and in a way that would not survive a technical investor asking one follow-up question.
"Overfit to founder data" implies we trained something that failed to generalize. We did not
train anything. The correct framing is narrower and more uncomfortable:

> On the EMG path, Manifest is currently a well-engineered debouncing layer over Emotiv's
> classifier. Remove Emotiv and the EMG path produces nothing.

This reframes the roadmap. The next milestone is not "make calibration repeatable" — calibration
presupposes a model to calibrate. The next milestone is **owning the signal-to-label step**:

- **Own model, own data.** Move from vendor labels to raw signal we classify ourselves. This is
  now the top technical priority and the largest unknown in the plan. Scope it honestly before
  committing — the research fan-out is specifically tasked with estimating what a credible
  cross-user facial-EMG classifier actually costs in subjects, sessions, and months.
- **Licensing check, before anything else.** Whether Emotiv's terms even permit training a
  replacement classifier on data captured through their hardware is an open question with a
  binary answer. Resolve it before collecting a single session.
- **Then** repeatable calibration, cross-session reliability, cross-user onboarding, and
  cross-device compatibility — the questions the old version of this document put first.

Nothing above kills the thesis. The event-shaping layer is real work and it is the layer the
strategy claims. But the sequencing was wrong, and the claim was overstated.

### EEG: an active frontier, not a working control claim

Live EEG control is not currently demonstrated. The motor-imagery feasibility study is valuable
because it narrowed the path instead of being hidden:

- **0.563** balanced accuracy on the EPOC-X headset, below the study's useful-control bar.
- **0.583** with the full-channel recording, suggesting that the limitation was not resolved by
  adding more electrodes.
- **0.711** on a known-good control dataset, evidence that the analysis pipeline could recover a
  stronger signal.

That result does not prove that consumer EEG can never provide control. It does show that this
motor-imagery approach did not meet the bar and should not be marketed as working. EEG remains an
active feasibility experiment; future approaches must earn their place through measured,
repeatable performance.

### The north-star product test

**A new user reaches three dependable controls on a supported headset without founder tuning,
through a classifier we own.**

The last clause is new and it is the whole point. Without it, the test can be passed by tuning
thresholds on a vendor classifier — which we have essentially already done, and which is not a
company. Supporting evidence should include calibration time, successful versus rejected actions,
false activations, performance across repeated sessions, and the exact hardware and
operating-system configuration.

Interim milestone, since the north star is now further away than the previous version implied:

**Milestone 0 — parity.** Our own classifier matches Emotiv's `fac` labels on the founders' own
recorded sessions for two gestures. Not better. Just ours, and equivalent. Until Milestone 0, the
"open runtime" story rests on the camera path plus an event-shaping layer, and the pitch should
say exactly that.

---

## Competitive position

The biosignal software ecosystem is not empty. Manifest should be precise about the layer it adds:

- **Lab Streaming Layer (LSL)** supports synchronized acquisition and interoperability across
  research tools and data sources.
- **BrainFlow** provides a common acquisition API for supported biosignal devices.
- **BCI2000** supports established BCI research and experimentation workflows.
- **Vendor SDKs** expose device capabilities and, in some cases, vendor-specific classifiers or
  commands.

Manifest can use or coexist with this infrastructure. Its differentiation is the consumer product
path above acquisition: guided per-user calibration, a small stable intent contract, reliability
controls, OS/app integration, and reference experiences. The honest claim is not that Manifest is
the first biosignal platform. It is that Manifest is productizing a different layer of the stack.

Implanted and regulated medical systems solve different problems with different hardware, risk,
and evidence requirements. They are useful context, not interchangeable competitors. Manifest
should not imply clinical readiness until clinical, regulatory, security, and user evidence exist.

### The competitors that actually matter — researched 2026-07-19

Full findings in `docs/research/MARKET_RESEARCH_MEMO.md`. The list above is the comfortable
comparison set: research infrastructure occupying a different layer, easy to differentiate from.
The load-bearing threats are these.

**Apple already shipped the runtime contract.** In iOS 26 (September 2025) Apple published a
**BCI HID descriptor** addressed to *"manufacturers of third-party brain-computer interface
hardware devices,"* covering *"implanted or external"* sensor arrays. 32 buttons, 22 named iOS
actions, a bidirectional signal-quality channel, and a default mapping of
**select / next / previous / menu**. That is our command vocabulary, shipped by Apple, open to
third parties with no MFi programme, entitlement, or NDA.

This is the single most important fact about our position. Any pitch built on "we invented the
biosignal-to-command layer" dies the moment someone opens that page.

**But Apple explicitly declined to build the decoder.** From the same document:

> *"It's up to the BCI hardware device manufacturer to decide how to interpret the relevant
> signals, and convert them to commands that the operating system can understand as user intent."*

Apple built the transport and the shell. Nobody built the decode-and-arbitration layer —
dwell, cooldown, confidence gating, false-activation suppression, graceful failover. And no
non-invasive BCI vendor has shipped against the descriptor at all. The door is unlocked and
nobody has walked through it.

That is a far narrower claim than "the layer is empty," and unlike the old claim it survives a
hostile search.

| Threat | Where it landed |
|---|---|
| **Apple BCI HID** | Runtime contract is *taken*. Decoder layer is *open*, in writing. Feed their transport rather than compete with it. |
| **Meta sEMG** | *Nature* 645:702, n≈11,236, up to 300 participants/day. Calibration-free generalization is real at Meta's scale and unreachable at ours. But emg2qwerty's 100-user generic model is still 35.7% CER (SplashNet, Jun 2025) against a ~10% usability bar — not solved, just better-funded. |
| **Project Gameface / OS built-ins** | Our camera path is commodity. Android Camera Switches already expresses our entire vocabulary with zero code, preinstalled, free. Camera Mouse has done head-pointing since 2007. |
| **Emotiv dependency** | Their `fac` classifier has **no published accuracy, no documented algorithm, no changelog, and no version pin.** Our thresholds have no test oracle — on software disabled people would depend on. Licensing under investigation. |
| **AAC market** | Tobii Dynavox FY2025 ≈ $260M revenue, 68% gross margin, ~400 insurance contracts, 61% delivery rate, 93-day latency. Entrenched and procurement-gated — but the latency and denial rate are themselves the opening. |
| **Platform absorption** | CTRL-labs → Meta, NextMind → Snap. The pattern is real. Mitigation is to be a client of the platform's transport, not a rival to it. |

Two corrections to earlier internal assumptions, both material:

- **The EPOC-X can do real EMG.** sEMG's lower bound is 5–10 Hz (ISEK); the EPOC-X passband is
  0.16–43 Hz; AF3/AF4 sit over frontalis and F7/F8/T7/T8 over anterior temporalis. `fac` is a
  **band-limited EMG classifier**, not an artifact hack. We lose the 50–150 Hz spectral peak, so
  standards-compliant sEMG is out — but a small pilot for a 5-command vocabulary on hardware we
  already own is not wasted spend.
- **Medicare reimburses software-only.** Policy Article A52469: *"Medicare will reimburse for
  speech generating software only (HCPCS code E2511) when installed on a general computing
  device."* LCD L33739, revised 2024-10-01, added electromyographic sensor accessories as
  covered. The laptop is excluded; qualifying software on it is not.

The second one exposes a self-inflicted problem. E2511 requires *speech generating* software.
We built Movies, Snake, and Smart Room — and A52469 explicitly names *"hardware or software used
to play games or music"* as non-covered. Meanwhile SCI users ranked **emergency communication
their #1 priority task** (Huggins 2015). We are not blocked by architecture. We are blocked by
having built a media carousel instead of a communication path.

---

## Defensibility: what can compound

An open intent contract alone is easy to copy. Defensibility must come from assets that improve as
more supported users, devices, and apps participate:

1. **Calibration performance and data.** Repeated calibration outcomes can improve onboarding,
   defaults, confidence thresholds, and reliability models. This only becomes an advantage with
   explicit consent, privacy-preserving collection, useful coverage, and demonstrably better
   performance.
2. **Adapter and app ecosystem.** Maintained device adapters, application integrations, reference
   experiences, and third-party contributions make the runtime more useful and make compatibility
   work reusable.
3. **Compatibility certification.** Published tests can eventually support a trusted
   "Manifest-compatible" standard for specific device, operating-system, signal, and intent
   combinations. Certification is a future trust layer, not a present credential.

This is a compounding strategy, not a claim that a moat already exists. Its strength depends on
measured calibration improvement, healthy external contribution, and credible compatibility
testing.

---

## Open source and possible business lines

Open source is the distribution and trust strategy. Builders should be able to inspect the signal
path, reproduce the demo, understand failures, add adapters, and build against the intent contract.
That transparency is especially important for software translating noisy human signals into
actions.

If adoption and reliability are demonstrated, possible paid lines include:

- supported deployments and integration support;
- OEM integration for headset and device makers;
- compatibility testing and certification; and
- security-, privacy-, accessibility-, or regulatory-oriented work for compliant deployments.

These are hypotheses, not validated revenue streams. Manifest should not imply paying customers,
partnerships, reimbursement, clinical deployment, or compliance certifications before they exist.
The business case becomes credible when the open runtime earns adoption and organizations ask for
support, integration, assurance, or accountability around it.

---

## How a movement is earned

"Open standard" and "movement" are outcomes, not launch language. Manifest earns them by making
progress easy to verify and extend:

- a reproducible clean-machine setup;
- honestly labeled live, simulated, and replay modes;
- public benchmarks with protocols, hardware details, and failure cases;
- a compatibility table scoped to tested devices, operating systems, signals, and intents;
- reference apps that exercise the stable contract;
- contribution paths for adapters, calibration methods, and applications; and
- independent third-party reproductions and improvements.

Stars and attention can help distribution, but the stronger signals are successful external
setup, repeatable performance, maintained integrations, and contributions that do not require
founder intervention.

---

## Safety and evidence boundaries

**SSVEP is decided against (2026-07-19).** Not deferred, not a constraint to design around —
dropped. The reasoning, ordered by how well each argument survives challenge:

1. **SSVEP is gaze-dependent — this is the architectural argument and it should lead.** SSVEP
   works by having the user *look at* a flickering target. We already get gaze direction from a
   webcam, for free, with no hardware. Paying $500 and a flickering screen to re-acquire a signal
   we already have is bad architecture regardless of the safety question.
2. **Unscreenable population.** Photosensitive-seizure risk is real, but stated plainly it is
   rebuttable — use ~40 Hz, low modulation depth, and Cognixion bet $25M+ and an FDA Breakthrough
   Designation on SSVEP. The version that holds: **we cannot screen users of a consumer
   accessibility product**, and an accessibility-first company shipping a UI contraindicated for
   an unscreenable fraction of its own target population is a positioning contradiction.
3. **Comfort.** Sustained flicker is fatiguing even at no seizure risk. An interface someone uses
   all day cannot be actively aversive.

**And the good SSVEP numbers were never available to us anyway.** The EPOC-X shares only 2 of 8
electrodes with a high-performing SSVEP montage and has no Oz. The headline accuracy and ITR
figures come from montages we do not have.

Do not lead with the seizure argument alone in an interview. Someone who knows the field will
name the mitigations, and the whole decision will look under-researched.

Residual code: `lib/ssvep.ts` and `components/ssvep-nav-arrows.tsx` still exist, with the flicker
disabled while the gaze proxy is primary nav. Either delete them or comment the decision at the
top of each file. Leaving live-looking SSVEP scaffolding in the repo invites exactly the
misreading this document is trying to stop.

General safety posture: any future paradigm affecting a vulnerable population requires
appropriate expert review before deployment, not after.

Across the product and its messaging:

- label simulated and replayed data explicitly;
- prefer an empty or low-confidence state to an invented intent;
- name the exact supported device and operating-system combinations;
- do not claim cross-user, cross-session, or cross-device reliability before measuring it;
- do not claim disability-user validation or clinical readiness without direct evidence; and
- distinguish a personalized live prototype from a reproducible onboarding product.

---

## Z Fellows readiness plan

The application should follow proof, not outrun it. Work in this order:

0. **Correct the record, first.** Both founders confirm the two-gesture, vendor-classifier
   reality above. If the three-gesture claim was made to anyone — advisors, the SALE program,
   a previous application draft, a README — correct it now, while correcting it is cheap and
   reads as rigor. Discovered later by an investor, the same fact reads as either sloppiness or
   dishonesty, and neither is recoverable in a one-week program.
1. **Founder alignment.** Agree on the category, evidence boundaries, roles, and the single story
   both founders will tell.
2. **Honestly labeled live demo.** Lead with the camera path — it is ours end to end and a
   stranger can run it. Show the Emotiv path second, and say on camera that the classification is
   Emotiv's and the event shaping is ours. Identify the user, hardware, and session conditions.
3. **Measurable repeatability.** Define success criteria and record calibration time, command
   accuracy, false activations, rejections, and repeated-session behavior for the current setup.
4. **Clean-machine setup.** Prove that a documented environment can install and run the demo from
   scratch without hidden local state.
5. **External onboarding attempts.** Ask new users to follow the guided path; record where founder
   tuning is still required and treat failures as product evidence.
6. **Second-device proof.** Add or validate one more supported headset through the adapter boundary
   and publish the exact compatibility limits. This is important evidence, not a claim of broad
   device support and not a precondition for submitting the application.
7. **Public packaging.** Align the repository, setup guide, demo, benchmark protocol,
   compatibility table, safety notes, and contribution path around the same honest status.
8. **Application submission.** Submit the concise runtime story with the strongest verified demo
   and measurements, clearly separating current proof, next risks, and long-term vision.

The readiness story is strongest when it shows disciplined movement from a founder-tuned
prototype toward the north-star test: **a new user reaches three dependable controls on a
supported headset without founder tuning.**

---

## Strategic summary

Manifest is not a claim that biosignal control is universally solved. It is an attempt to make a
small set of controls dependable on supported consumer hardware through open adapters, guided
calibration, reliability controls, and a stable application contract.

The near-term users are developers and headset owners. The first killer application is
accessibility.

The working evidence, stated at its true strength: **a locally-run webcam head-pose navigation
path that is entirely ours, plus a reliability/event-shaping layer over Emotiv's facial-expression
classifier for two gestures.** EEG is an experiment that has failed once, on motor imagery, and
whose failure is reported rather than disguised. SSVEP is decided against on seizure-risk and
comfort grounds.

The next proof is not repeatable onboarding — it is **owning the signal-to-label step**, because
until then the EMG half of the runtime story belongs to a vendor. The long-term opportunity is
broader consumer biosignal computing built on a runtime others can inspect, reproduce, and extend.

The single sentence both founders should be able to say without flinching:

> Today we own the interaction layer and one full camera-based modality; the EMG classification
> is still Emotiv's, and replacing it with our own model and our own data is the next thing we
> are building.

That sentence is less impressive than the one this document used to contain. It has the
advantage of being true, and of surviving the follow-up question.

---

## The revised position

*Proposed 2026-07-19 from the market research. Not yet adopted — this needs a founders'
decision, and one part of it needs user evidence we do not have.*

The old position had four pillars. Three are occupied: the runtime contract (Apple, shipped,
open), the camera modality (Apple, Google, Camera Mouse since 2007), and calibration-free EMG
(Meta, at a scale we cannot reach). The fourth — "we will build our own EMG model" — is the most
expensive and least differentiated item on the roadmap.

What survives, in descending order of defensibility:

**A. The decoder and arbitration policy that feeds someone else's transport.** Apple built the
pipe and said in writing that interpreting signals into intent is the device maker's job. LSL has
refused semantics for 14 years across 2,300 citations and zero revenue — that refusal is a
repeatedly reaffirmed choice, not an oversight. BrainFlow stops at filtered signal. Emotiv and
Neurosity ship intent APIs locked to their own hardware, with a structural incentive never to
interoperate. Nobody sits between them.

Be honest about what this is: a **product** wedge, not a **standard** wedge. Standards monetize
badly. Delete certification from the business model or move it past year five.

**B. Graceful multi-modal failover as a condition progresses.** In late-stage ALS, head control
degrades, eyelids droop, medications alter pupils, oculomotor function fails. Dedicated AAC
hardware answers this with multi-modal devices costing thousands. A software layer that degrades
gracefully — camera → EMG → switch — as each modality fails is the one claim nothing in the
entire research corpus covers.

**This is a hypothesis, not a finding.** It was constructed from clinical literature. No user has
validated it. Test it in the next 30 days before building anything on it.

**C. Honest confidence and false-activation discipline.** Neither BrainFlow, LSL, Emotiv nor
Neurosity exposes calibrated uncertainty or a principled low-confidence state. Emotiv publishes
no accuracy figure, no algorithm, no changelog, and no version pin. False activations are the
dominant failure mode in accessibility procurement, and **nobody in this space publishes their
false-activation rate.** We already have the discipline as a house rule — the SIMULATED/REPLAY
labelling convention is the same instinct applied to a different surface. Cheap to build,
genuinely absent everywhere.

**D. Zero-cost, cross-platform, runs on hardware people already own.** Against a 61% delivery
rate, 93-day procurement latency, and insurance denials, a free webcam tier requiring no prior
authorisation is a real answer to the actual bottleneck. Weak as technology, strong as
go-to-market.

**The sentence to test:**

> *Apple, Google, Meta and Emotiv each built a decoder for their own sensor and their own OS.
> Nobody built the layer that lets a user keep the same five commands as their condition changes
> and their working modality doesn't — and nobody built it for the user who owns none of that
> hardware. We feed Apple's BCI HID transport, we run everywhere Apple doesn't, and we're the
> only ones publishing our false-activation rate.*

Narrower, checkable, survives a hostile search, and buildable by two people in weeks rather than
through a 150-subject data programme.

### The critique to take seriously before posting anything publicly

The "disability dongle" critique (Jackson, Haagaard & Williams, 2022) is aimed explicitly at
*"design and engineering students prototyping innovative disability solutions."* Its three failure
modes — lack of fluency, knowledge extraction without benefit, perpetual replication — currently
describe this project on all three counts: two non-disabled students, a demo-shaped artifact, no
disabled collaborators, and a webcam head-tracker that reproduces Camera Mouse (2007).

Phillips & Zhao's strongest finding is that the **number one predictor of assistive technology
abandonment is lack of consideration of user opinion in selection.** We are currently maximising
that variable at the design stage. It is cheap to fix now and expensive to reverse after we have
posted publicly and asked disabled people to care.

Five structured conversations — an ALS Association chapter, an AAC-focused SLP at UW Health,
Team Gleason — outrank every remaining item on the technical roadmap.
