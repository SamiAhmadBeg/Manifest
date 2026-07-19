# Manifest — Raw Research Briefs (2026-07-19)

*12 parallel agents. Unedited. The synthesized memo supersedes these where they conflict.*



---

# Meta sEMG wristband + cross-user generalization

# Meta sEMG Wristband & Cross-User Generalization — Adversarial Research Brief

**Prepared:** 2026-07-19 · **Posture:** threat-first, founder decision-making, not marketing

---

## 1. The Nature 2025 paper — what it actually showed

**Citation:** "A generic non-invasive neuromotor interface for human-computer interaction," *Nature* 645, 702 (2025), Reality Labs / CTRL-labs team. Published 2025-07-23. Free full text: PMC12443603. Preprint lineage: bioRxiv 2024.02.23.581779 (Feb 2024) → OpenReview → Nature.

### Hardware
- **48 electrode pins → 16 bipolar channels**, 2 kHz sampling, noise floor **2.46 µVrms**, >4 h battery, Bluetooth
- Four band sizes, 10.6–15 mm interelectrode spacing
- This is a *research* device ("sEMG-RD"), not the shipping Neural Band

### Sample sizes (this is the headline, and it is brutal)

| Task | Training participants | Closed-loop eval (naive users) |
|---|---|---|
| Discrete gestures | **4,900** | 24 |
| Wrist / cursor control | **162** | 17 |
| Handwriting | **6,627** | 20 |

Aggregate cited as ~**11,236 participants**. Data collection ran at "**up to 300 participants daily**" in controlled sessions of 2–3 hours each.

**Read this number twice.** The result is not an algorithmic trick. It is an industrial data-collection pipeline that a 2019 acquisition (~$500M–$1B) bought and then ran for six years.

### Performance — closed loop, zero per-user calibration
- Wrist continuous control: **0.66 target acquisitions/sec**
- Discrete gestures: **0.88 detections/sec**
- Handwriting: **20.9 words per minute**
- Offline: **>90% classification accuracy on held-out participants**; wrist angle velocity error **<13°/s**
- Gesture vocabulary: **9 discrete gestures** — thumb tap, index/middle finger press + release, thumb swipes left/right/up/down

### What did NOT generalize / what the authors themselves concede
1. **It still loses to a trackpad.** Target acquisition: **1.51 s (sEMG) vs 0.68 s (trackpad)** — 2.2× slower. This is not yet a better mouse.
2. **Personalization still helps materially.** 20 minutes of per-user handwriting data → **16% CER improvement** on top of a model trained on 6,527 people. Calibration did not become worthless; it became *optional and incremental* rather than *mandatory and foundational*.
3. **Personalized models do not transfer across participants** — they overfit to the individual. (Confirms the per-user model is a real, distinct object; it just stopped being the *only* path.)
4. **Explicit clinical-population caveat:** the paper states it is *unclear whether models trained on able-bodied participants will generalize to clinical populations.* ← **This is the single most load-bearing sentence in the paper for Manifest.**
5. Hardware improvements still required for broad deployment; user proficiency assumed to improve with practice (i.e., some of the closed-loop numbers reflect trained-user ceilings, not day-1 experience).

---

## 2. The open datasets — and the license trap

### emg2qwerty (NeurIPS 2024 D&B; arXiv 2410.20081)
- 1,135 session files, **108 users, 346 hours**
- Pretrained checkpoints released (Git LFS)
- **The killer table, and it cuts against Meta's own marketing:**

| Model | Test CER (w/ 6-gram LM) | Test CER (no LM) |
|---|---|---|
| Generic, zero-shot (trained on 100 users) | **51.78%** | 55.38% |
| Personalized, random init | 9.55% | 15.38% |
| **Personalized, fine-tuned from generic** | **6.95%** | 11.28% |

The paper's own usability threshold is ~10% CER. **At 100 training users, the calibration-free model is unusable (51.78% CER) and the personalized model is usable (6.95%).** A ~45-point gap. Personalization used ~6 sessions/user (~108 min).

**So the honest framing of Meta's own two papers together is: per-user calibration was decisively necessary at n=100 users, and became largely unnecessary at n≈5,000–6,600 users.** Scale — not a better architecture — is what killed calibration. That is the actual finding.

### emg2pose (NeurIPS 2024 D&B; arXiv 2412.02725)
- 25,253 HDF5 files, time-aligned 2 kHz sEMG + joint angles, ~1 min per stage
- Code: github.com/facebookresearch/emg2pose

### generic-neuromotor-interface (the Nature paper's release)
- **100 participants per task** (80/10/10 split) across discrete_gestures, handwriting, wrist — ~64 h to ~141 h per task, >100 h total
- **Pretrained checkpoints released**
- Note: Meta released a 100-participant slice, **not** the 4,900/6,627-participant training corpus. The thing that produced the result was not open-sourced. The reproducible artifact is the small version.

### Licensing — hard blocker
All three repos: **CC-BY-NC-4.0** (non-commercial). Checkpoints inherit the same terms.

**Manifest cannot ship a product built on Meta's data or weights.** Not "should be careful" — cannot, absent a separate negotiated license with Meta. Any plan of the form "fine-tune emg2qwerty for our users" is a research demo with no commercial exit.

*(Minor discrepancy: some secondary sources say CC-BY-NC-SA-4.0; the repo READMEs I fetched say CC-BY-NC-4.0. Either way, NC.)*

---

## 3. Productization timeline & third-party access

| Item | Status |
|---|---|
| CTRL-labs acquisition | Sept 2019, reported ~$500M–$1B (CNBC 2019-09-23). Thomas Reardon led neuromotor research at Reality Labs; has since left to found Flourish (raised $500M @ $2.5B). |
| Orion | Internal prototype AR glasses; sEMG band as primary input (2024) |
| **Meta Ray-Ban Display + Neural Band** | Shipped **$799/$800**, US, from Sept 2025. Canada/France/Italy/UK early 2026. |
| Neural Band standalone | **Not sold separately.** Bundled only. |
| SDK | **Yes, since ~May 2026.** Two paths: (a) **Wearables Device Access Toolkit** — native Swift/Kotlin, extends existing iOS/Android apps to the display; (b) **Web Apps** — HTML/CSS/JS, distributed by URL. Web app APIs list "input from the Meta Neural Band" alongside motion, orientation, GPS, local storage. |
| **Raw EMG to third parties** | **No evidence it is exposed.** Developers get *gesture events*, not signal. (See "could not verify.") |
| CES 2026 expansion | Neural Band beyond glasses: **Garmin** (automotive infotainment), **University of Utah** (ALS, muscular dystrophy, smart-home control), TetraSki. Engadget, 2026-01-06. |
| Accessibility research | **CMU + Meta** partnership (announced July 2024) on **spinal cord injury / hand paralysis** — explicitly: users with "very few motor signals" detectable by high-resolution sEMG, usable "as early as Day 1." |

### Real-world friction (the part Meta's press doesn't say)
Reviews of the shipping Neural Band report: inputs sometimes need to be sent twice; **accuracy depends materially on strap tightness**; the band stopped working "once or twice a day" requiring restart for at least one reviewer. Some Best Buy customer reviews reportedly cite it working "about 60% of the time" *(secondary, unverified — see below)*.

**Translation: donning variability and fit — the classic calibration problems — did not disappear in the product. They moved from "train a model" to "wear it correctly and restart it."** That is a real seam, but it is a *hardware/UX* seam, not a decoding-model seam.

---

## 4. THE KEY QUESTION: is "guided per-user calibration" still a defensible product layer?

### Case FOR (calibration is still a moat)
1. **Calibration-free requires ~5,000 subjects.** No one below FAANG scale gets there. If your competitor set is other startups, not Meta, calibration is still the only path — and doing it *well* (fast, non-tedious, guided) is a genuine differentiator against clumsy 20-minute calibration wizards.
2. **Meta's own numbers show personalization still adds 16%** even at n=6,527. Calibration never became worthless.
3. **Clinical populations are explicitly unresolved by the paper.** Someone with ALS, C5 SCI, or muscular dystrophy has residual signals that are *by definition* out-of-distribution for a model trained on 6,627 able-bodied people. Per-user adaptation is not optional there — it's the entire problem.
4. **Meta's stack is closed.** No raw EMG, no standalone band, NC-licensed data, gestures-only API. Anyone who wants to build a non-Meta accessibility input runtime has no shortcut through Meta's work.
5. **The generalization is per-*modality*, not universal.** Meta solved "sEMG on the wrist for hand gestures." A modality-agnostic runtime spanning face-tracking, EMG, EEG, voice has no equivalent pretrained prior to fall back on.

### Case AGAINST (calibration is a dead moat) — and this is the stronger case
1. **The direction of travel is unambiguous.** n=100 → 51.78% CER (unusable). n=6,627 → calibration-free, shipping in a consumer product. Every year that curve moves against you. Betting a company on "per-user calibration is hard" is betting that a well-capitalized incumbent's *already-demonstrated* scaling result stops scaling.
2. **Meta is already funding the clinical wedge.** CMU (spinal cord injury, since 2024) and Utah (ALS, MD, at CES 2026). The "they only did able-bodied users" gap is being closed *right now*, by them, with more money and IRB infrastructure than a two-person student team can assemble.
3. **Calibration UX is a feature, not a technology.** "Guided calibration" is onboarding design. Onboarding design is copyable in a sprint by anyone with the underlying decoder. It is not defensible IP.
4. **Manifest currently has no model at all.** Ground truth: no own EMG model, no own training data, no live EEG. The current EMG path is threshold + hysteresis on top of **Emotiv's proprietary classifier**. So the claimed moat is not even built — it's a plan, and the plan's first milestone (collect our own data) is the exact thing Meta did 5,000 subjects of.
5. **The failed motor-imagery study is confirmatory evidence, not noise.** 0.563 / 0.583 balanced accuracy on EPOC-X vs 0.711 on a public control dataset says the hardware+protocol combination is not producing decodable signal. That is a data/hardware problem, and data/hardware problems are exactly what scale money solves and student teams don't.

### VERDICT

**Cross-user sEMG generalization does not invalidate calibration as a *product surface*. It does invalidate calibration as a *technical moat*, and it invalidates it specifically for the modality Manifest says it wants to move into next.**

More precisely:
- **"Per-user calibration of a gesture decoder" as core IP: dead.** Meta published the recipe, shipped the product, and open-sourced enough to prove it. Say this out loud to Z Fellows before they say it to you — because a partner who has read the *Nature* paper will.
- **"Guided per-user calibration" as a thin UX layer: real but not fundable on its own.** It is a feature of a product, not a company.
- **The only surviving defensible position is the one Manifest's positioning already gestures at but does not yet execute:** the *runtime / arbitration layer above whatever decoder exists* — modality-agnostic fusion, dwell/cooldown/confidence policy, honest low-confidence states, graceful failure, and a fixed 5-command vocabulary that any signal source can drive. Meta gives you gesture events, not a runtime. Emotiv gives you classifier labels, not a runtime. Nobody is shipping the arbitration layer.
- **"Build our own EMG model + collect our own training data" is, on this evidence, the worst available use of the next 12 months.** You would be starting a 5,000-subject race six years and one acquisition behind, with two people and no IRB pipeline, using data you cannot legally bootstrap from.

---

## 5. What I could NOT verify

- **Exact CTRL-labs purchase price.** Reported "~$500M" (CNBC) and "up to $1B" (other outlets). Meta never confirmed. Treat as $500M–$1B, unconfirmed.
- **Whether the "11,236 participants" figure is total unique subjects** or an aggregate across overlapping cohorts. Could not resolve from the PMC text I retrieved.
- **Whether the Wearables Device Access Toolkit exposes raw or intermediate EMG.** The build docs page I fetched (wearables.developer.meta.com/docs/develop/webapps) returned setup content only. Absence of evidence — but the strong prior is gesture-events-only. **Verify directly at wearables.developer.meta.com/docs before relying on this either way.**
- **The "works 60% of the time" Best Buy customer figure** — this came from a search-result summary, not a page I fetched. Do not cite it externally.
- **Whether Meta will license Neural Band tech / raw signal to third parties commercially.** The Garmin CES 2026 item hints at partnerships but no licensing terms were disclosed.
- **Whether outside academics can obtain sEMG-RD hardware on request.** CMU and Utah have it via formal collaboration; no open request process found.
- **Exact emg2qwerty license string** (CC-BY-NC-4.0 per repo README vs CC-BY-NC-SA-4.0 per secondary sources). Both are non-commercial; the distinction doesn't change the conclusion.
- **Mudra Link details** ($200, "Surface Nerve Conducting" sensors, dev-kit program) come from vendor site + UploadVR only. "SNC" appears to be marketing branding for sEMG. Not independently verified; treat vendor performance claims as unverified.

---

## SO WHAT FOR MANIFEST

1. **Kill the "per-user calibration is the hard product problem" thesis line before a Z Fellows partner kills it for you.** *Nature* 645:702 shipped calibration-free sEMG in a $799 consumer product. If your one-liner is calibration, you have a one-liner that a single search invalidates. Replace it with the arbitration/runtime layer, which is genuinely unoccupied.

2. **Do not start collecting your own EMG training data as the next milestone.** Meta needed 4,900–6,627 subjects and a 300-participants-per-day pipeline. You have two people. Any dataset you can realistically collect (n≈10–50) lands you in the *emg2qwerty n=100* regime — **51.78% CER, explicitly unusable**. You would spend a year to reproduce a known-bad operating point.

3. **You cannot legally build on Meta's data or checkpoints.** emg2qwerty, emg2pose, and generic-neuromotor-interface are all **CC-BY-NC-4.0**. Any commercial product path through them requires a negotiated Meta license. Use them for benchmarking and demos only, and say so explicitly in the application — claiming otherwise is a diligence landmine.

4. **Your accessibility wedge has a 12–24 month clock on it, and Meta is already inside it.** The "unclear whether it generalizes to clinical populations" line is your entire remaining technical differentiation — and Meta funded **CMU on spinal cord injury (2024)** and **Utah on ALS/muscular dystrophy (CES, Jan 2026)** to close exactly that gap. Plan as if calibration-free clinical sEMG exists by 2028. Build something that gets *better* when that happens, not something it obsoletes.

5. **Reframe the existing assets honestly and they're actually stronger.** Today you have: a webcam face-yaw decoder (no hardware cost, no vendor), an Emotiv `fac` bridge (vendor classifier, thresholding on top), and voice. That is **three heterogeneous modalities feeding one 5-command vocabulary** — which is a legitimately different bet from Meta's single-modality wrist band, and one Meta's closed, gestures-only SDK cannot serve. Sell the *fusion + policy layer*, and be explicit that Emotiv's classifier is vendor IP you intend to route around, not replace from scratch.

6. **Concrete near-term move instead of model-building:** design the runtime so a Meta Neural Band, an Emotiv headset, a webcam, and a Mudra Link (~$200, has a dev-kit program) are all interchangeable signal sources behind one intent contract. That makes Meta's calibration-free decoder an *input* to you rather than a competitor — and it's buildable by two people in weeks, not a 5,000-subject data program.

---

## Sources

| Source | URL | Date |
|---|---|---|
| *Nature* — "A generic non-invasive neuromotor interface for human-computer interaction" (645:702) | https://www.nature.com/articles/s41586-025-09255-w | 2025-07-23 |
| Same paper, free full text (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12443603/ | 2025 |
| bioRxiv preprint | https://www.biorxiv.org/content/10.1101/2024.02.23.581779v1 | 2024-02-23 |
| emg2qwerty paper (arXiv 2410.20081v3) | https://arxiv.org/html/2410.20081v3 | 2024-10 |
| emg2qwerty repo (license, checkpoints) | https://github.com/facebookresearch/emg2qwerty | accessed 2026-07-19 |
| emg2pose repo | https://github.com/facebookresearch/emg2pose | accessed 2026-07-19 |
| emg2pose paper (arXiv 2412.02725) | https://arxiv.org/html/2412.02725v1 | 2024-12 |
| generic-neuromotor-interface repo (Nature release, CC-BY-NC-4.0) | https://github.com/facebookresearch/generic-neuromotor-interface | accessed 2026-07-19 |
| Meta AI blog — open-sourcing sEMG datasets (NeurIPS 2024) | https://ai.meta.com/blog/open-sourcing-surface-electromyography-datasets-neurips-2024/ | 2024-12 |
| Meta blog — Reality Labs sEMG *Nature* publication | https://www.meta.com/blog/reality-labs-surface-emg-research-nature-publication-ar-glasses-orion/ | 2025-07 |
| Meta blog — sEMG research focused on equity & accessibility | https://www.meta.com/blog/surface-emg-wristband-electromyography-human-computer-interaction-hci/ | — |
| UploadVR — gesture set + "no per-user model" framing | https://www.uploadvr.com/meta-semg-wristband-gestures-nature-paper/ | 2025-07-24 |
| The Register — sEMG wristband UI | https://www.theregister.com/2025/07/23/meta_wristband_ui_control/ | 2025-07-23 |
| Meta — Ray-Ban Display product page ($799, Neural Band bundled) | https://www.meta.com/ai-glasses/meta-ray-ban-display/ | accessed 2026-07-19 |
| UploadVR — Ray-Ban Display official, $800 w/ Neural Band | https://www.uploadvr.com/meta-ray-ban-display-glasses-officially-announced/ | 2025-09 |
| Meta Developers — "Build for display glasses" (SDK launch) | https://developers.meta.com/blog/build-for-display-glasses/ | ~2026-05 |
| Next Reality — Ray-Ban Display developer preview, SDK paths & gaps | https://virtual.reality.news/news/meta-ray-ban-display-developer-preview-sdk-paths-and-platform-gaps/ | 2026 |
| Engadget — Neural Band beyond glasses (Garmin, Utah, TetraSki) | https://www.engadget.com/wearables/metas-emg-wristband-is-moving-beyond-its-ar-glasses-120000503.html | 2026-01-06 |
| CMU Engineering — CMU/Meta wristband accessibility collaboration | https://engineering.cmu.edu/news-events/news/2024/07/09-wearable-sensing-tech.html | 2024-07-09 |
| CNBC — Facebook acquires CTRL-labs | https://www.cnbc.com/2019/09/23/facebook-announces-acquisition-of-brain-computing-start-up-ctrl-labs.html | 2019-09-23 |
| Tom's Guide — Ray-Ban Display review (Neural Band reliability) | https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-review | 2025/2026 |
| UploadVR — Ray-Ban Display review | https://www.uploadvr.com/meta-ray-ban-display-review/ | 2026 |
| AppleVis — blind user's take on Ray-Ban Display + Neural Band | https://applevis.com/forum/assistive-technology/meta-ray-ban-display-neural-band-blind-users-honest-take-future-wearable | 2025/2026 |
| UploadVR — Mudra Link, $200 Neural Band alternative | https://www.uploadvr.com/mudra-link-is-a-200-meta-neural-wristband-alternative-for-any-device/ | 2025/2026 |
| Mudra dev-kit program | https://www.wearabledevices.co.il/mudra-dev-kit-program | accessed 2026-07-19 |
| EMG-UP: Unsupervised Personalization in Cross-User EMG Gesture Recognition (arXiv 2509.21589) | https://arxiv.org/pdf/2509.21589 | 2025-09 |
| Electrode shift mitigation via sliding-window normalization (Sensors 25:4119) | https://www.mdpi.com/1424-8220/25/13/4119 | 2025 |
| REACT: conditioning framework for user-adaptive sEMG hand pose | https://arxiv.org/pdf/2605.30127 | 2026 |


---

# Google Project Gameface + camera-based gesture input

# Research Brief: Camera-Based Face/Head Input — Is Manifest's Demo Already Commodity?

**Dimension:** Google Project Gameface + camera-based gesture input
**Date compiled:** 2026-07-19
**Posture:** Adversarial. Bad news is not softened.

---

## 0. Bottom line up front

Manifest's working camera demo — MediaPipe FaceLandmarker, nose-yaw geometry, dwell + cooldown, left/right nav — is **not novel at any layer**. The technique is 2007-era assistive tech (Camera Mouse), the model is Google's, the interaction pattern (look left / look right to select) shipped as a free Google app in 2020, and as of **September 2025 Apple ships a strictly more capable version of it in iOS 26 on every TrueDepth iPhone**, free, with per-gesture intensity thresholds — i.e. Apple shipped the exact "threshold + hysteresis on a vendor classifier" design that Manifest wrote by hand.

The one genuinely interesting finding cuts *against* the thesis in a different way: **Google archived Project Gameface on 2025-09-05**, and **Apple added a native BCI input protocol to Switch Control in May 2025**. Read together, these say the platform owners concluded that the *bespoke app* layer is not where this belongs — the OS accessibility stack is. That is precisely the layer Manifest is trying to build as a startup.

---

## 1. Google Project Gameface

### Verified facts (GitHub API, queried 2026-07-19)

```
full_name:        google/project-gameface
archived:         True
license:          Apache License 2.0
stargazers:       633
forks:            88
open_issues:      41   ← left unresolved at archival
created_at:       2023-05-05
pushed_at:        2024-08-30   ← last actual code push
```

- **Archived 2025-09-05** by Google. Read-only. No successor project named.
- Last real code activity was **August 2024** — so it was effectively abandoned for a year before being formally archived.
- 41 open issues at time of archival — it was not "finished," it was dropped.

### What it was

- Announced at I/O 2023 as an open-source hands-free "mouse": head movement drives the cursor, facial gestures (raise eyebrows, open mouth) drive clicks and drags. Windows first, Python + Java codebase.
- **Android version announced 2024-05-14**: virtual cursor via Android AccessibilityService, driven by MediaPipe Face Landmarks Detection API, using **52 blendshape values** with **user-customizable thresholds per expression**. Supported touch events plus global actions: `HOME`, `BACK`, `NOTIFICATIONS`, `ACCESSIBILITY_ALL_APPS`, and drag with user-defined endpoints.
- Origin story: inspired by Lance Carr, a game streamer with muscular dystrophy. Partners: **Incluzza** (India), **playAbility**.

### The blunt read

Gameface's Android feature list — cursor + gesture thresholds + HOME/BACK/notifications global actions — **is a superset of Manifest's five-command vocabulary (left/right/select/back/home)**, shipped as working Apache-2.0 code two years ago by Google, on the same underlying model Manifest uses.

Its archival is *not* good news for Manifest. Two readings, both unflattering:

1. **Demand reading:** Google shut it down because Camera Switches (in Android Accessibility Suite) and, later, Apple's Head Tracking made a standalone app redundant. The function survived; the product didn't need to exist.
2. **Traction reading:** 633 stars over 2.5 years for a Google-branded accessibility flagship is *weak*. If Google couldn't build a user base for free, well-marketed camera face control, a two-person student team has no distribution advantage whatsoever.

Either way, the space Manifest's demo occupies is one that Google entered, staffed, open-sourced, marketed at I/O, and then walked away from.

---

## 2. Android platform-native camera input (this is the real competitor, not Gameface)

### Camera Switches — Android Accessibility Suite

- Ships **inside** Android Accessibility Suite (Switch Access). Launched 2021. Requires **Android 6 or later** — effectively the entire installed base.
- **Six gestures, verified from Google's own support docs:** `Look right`, `Look left`, `Look up`, `Smile`, `Open mouth`, `Raised eyebrows`.
- Assignable to: scan, pause, select, Next, Previous — and per press coverage, open notifications, return to home screen, pause detection.
- Free, preinstalled, no app to discover or sideload.

**Compare directly to Manifest:** `Look left` / `Look right` → carousel nav. `Smile` or `Open mouth` → select. `Look up` → home. Manifest's entire command vocabulary is expressible in Android Camera Switches today, on a phone, with zero code.

### Look to Speak (Google, Dec 2020)

- Free Android app, Android 9.0+. Front camera. **User looks left or right to select from a phrase list**, spoken aloud. All data on-device.
- This is *literally* Manifest's interaction primitive — binary left/right gaze selection over a list — shipped by Google **six years ago** as a finished consumer app.

---

## 3. Apple — the most serious threat

### Eye Tracking (iOS 18 / iPadOS 18, announced 2024-05-15, shipped 2024-09-16)

Apple's own words:

> "Eye Tracking uses the front-facing camera to set up and calibrate in seconds, and with on-device machine learning, all data used to set up and control this feature is kept securely on device, and isn't shared with Apple."

- **iPhone and iPad** (not iPad-only — some secondary coverage gets this wrong). iPhone 12 and later, plus iPhone SE 3.
- No extra hardware. Works across all iOS/iPadOS apps. Dwell Control to activate elements, plus physical buttons, swipes, gestures.

### Head Tracking (iOS 26 / iPadOS 26, announced 2025-05-13, shipped Sept 2025)

This is the one that should worry Manifest most.

- Settings → Accessibility → **Head Tracking** (under "Physical and Motor"). Front camera drives an on-screen pointer.
- **Eight facial gestures**: Raise Eyebrows, Open Mouth, Smile, Stick Out Tongue, Eye Blink, Scrunch Nose, and directional lip pucker (left/right).
- Each gesture maps to arbitrary actions: tap, Home Screen, Control Centre, open Camera, launch Siri, scroll, **or any custom Shortcut**.
- **Per-gesture sensitivity: "slight," "default," or "exaggerated."**

That last bullet is the killer. *"Choose whether you should make a slight, default, or exaggerated expression to trigger the action"* **is a user-facing threshold control on a vendor classifier** — the exact engineering Manifest hand-rolled for both its Emotiv path and its camera path. Apple shipped it to hundreds of millions of devices, free, with a settings UI, ten months ago.

### Switch Control BCI protocol (announced 2025-05-13)

> "For users with severe mobility disabilities, iOS, iPadOS, and visionOS will add a new protocol to support **Switch Control** for Brain Computer Interfaces (BCIs), an emerging technology that allows users to control their device without physical movement."

- **Synchron** announced first native integration (2025-05-13), then **demoed a thought-controlled iPad on 2025-08-04** using Apple's BCI HID protocol, with its Stentrode implant feeding **Switch Control**.
- Apple has made *arbitrary neural input a first-class OS input category that lands in an existing, mature, tiny command vocabulary* (Switch Control scanning).

**This is Manifest's entire thesis, executed by the platform owner.** "Modality-agnostic biosignal runtime that turns noisy signals into a tiny command vocabulary" is a description of Apple Switch Control + BCI HID. Apple owns the OS, the accessibility API surface, the app compatibility story, and the device install base.

### WWDC 2026 (announced 2026-05-19)

- Vision Pro: **face gestures for taps and system actions**, plus eye-selection with Dwell Control.
- Power wheelchair control via Vision Pro eye tracking (Tolt, LUCI, US, later 2026).
- Sony Access controller as a game controller across iOS/iPadOS/macOS.
- **No new BCI announcement** in the 2026 release — see "could not verify."

---

## 4. MediaPipe FaceLandmarker as an input modality generally

- `@mediapipe/tasks-vision` outputs **478 3D landmarks + 52 blendshape coefficients**, runs in-browser via WASM/GPU, LIVE_STREAM mode. Documentation carries a **"MediaPipe Solutions Preview is an early release"** caveat.
- Docs content is CC-BY-4.0, code samples Apache-2.0.
- **The ecosystem is thin at the top and enormous at the bottom.** A GitHub search for MediaPipe head/face cursor-control repos returns a long tail of **zero-star student projects** (`cursor_control_using_hand_and_face_gesture`, `Smart-Assistive-Cursor-Control-using-Head-Motion-and-Eye-Gaze`, `webcam_mouse_in_python`, all pushed in 2026). Nose-tracking-to-cursor is a *weekend project category*, not a moat.
- **playAbility** is the notable commercial player: a Windows **system-level translator** mapping facial gestures to standard gamepad button presses, built on MediaPipe blendshapes (Google's own blog cites them). Reviewed favorably by Can I Play That? (2024-11-26) for "highly precise key actuation… without frustrating misfires." **playAbility is the closest thing to Manifest's "runtime" positioning that already exists commercially, and it is further along on the camera path.**

### The dependency irony — say this out loud

Manifest's stated strategic goal is to **stop depending on Emotiv's proprietary classifier** by training its own EMG model. But the camera path — the thing that actually works today — is **100% dependent on Google's proprietary FaceLandmarker model**, shipped under a "preview" caveat, whose flagship reference application Google **archived in September 2025**. Manifest has not escaped vendor classifier dependency on the camera path; it has swapped Emotiv for Google. Any pitch that frames the camera demo as "ours" and the Emotiv path as "theirs" is not honest.

Worse for the "we do real signal processing" claim: **Manifest's implementation doesn't even use blendshapes.** `hooks/use-face-gaze.ts` (341 lines) computes **nose-vs-eye-line yaw geometry** — with an inline comment noting the iris blend was dropped because it "was cancelling slight looks" — plus a dwell timer and a cooldown. That is Camera Mouse (2007) with a modern face detector.

---

## 5. Prior art that predates all of this

**Camera Mouse** (Boston College / Boston University, Betke & Gips):
- Free Windows download since **2007**, **3+ million downloads**.
- Tracks a chosen facial feature — **explicitly "a nostril or the tip of an eyebrow"** — and maps head movement to the cursor. **Dwell-to-click.**
- Target users: cerebral palsy, spinal muscular atrophy, ALS, MS, TBI.

Manifest's nose-yaw + dwell + cooldown is, algorithmically, a browser reimplementation of a nineteen-year-old free program with 3 million downloads. The face detector is better. The interaction is identical.

---

## 6. Webcam gaze OSS and eye-tracking hardware — the precision ceiling

- **WebGazer.js** (Brown University): in-browser webcam gaze, no video leaves the device. Reported accuracy: **~130px error** with the best detector/model combo; calibration typically **100–150px (~2° visual angle)**. Known limitation: **cannot detect blinks or eye closure**. Requires stable positioning; degrades in low light and at low frame rate.
- General finding across the literature: web/landmark-based gaze has "limited accuracy and temporal stability" versus dedicated hardware.
- **Tobii Eye Tracker 5**: $229, Windows 10/11, gaming-focused (170+ titles). Notably, **it is not compatible with Microsoft's built-in Windows Eye Control** — Windows Eye Control requires specific supported eye trackers, which is a fragmentation gap, but a small one.

**Implication:** webcam gaze precision caps out around 2° — which is exactly *why* a tiny 5-command vocabulary is the right design. But that also means the tiny vocabulary is a **forced consequence of the sensor**, not a proprietary insight. Everyone in this space converged on it: Switch Control scanning, Camera Switches, Look to Speak's binary left/right. Manifest should stop presenting the small vocabulary as a differentiating design philosophy; it is the only thing the physics allows, and every competitor already does it.

---

## 7. Where a real gap might exist (steelmanning, briefly)

Honest counterweight — these are thin but not zero:

1. **Web/cross-platform.** Apple Head Tracking is iOS/iPadOS. Camera Switches is Android. Camera Mouse is Windows. **Nobody ships a good camera-input layer that works in a browser across all OSes.** Manifest's demo does. That is a real, if narrow, gap.
2. **Progressive-condition users.** In late-stage ALS, "one side of the body often tightens, causing the head to drop and rotate to one side," degrading tracking; eye gaze is also compromised by droopy eyelids, dry eye, muscle relaxants, opioid-induced pupil changes. Dedicated AAC devices answer this with **multi-modal access — eye gaze, head tracking, switch scanning, and touch in one device**. A *modality-agnostic* layer that fails over gracefully as a condition progresses is a genuine unmet need. **This is Manifest's strongest available position** — and note it is a claim about *fusion and failover*, not about any single modality.
3. **No published critique of the incumbents.** I searched hard for practitioner complaints about Camera Switches reliability and **found none** — but I also found no evidence it works well in daily use. This is an information vacuum, not an opening. It's a research task for Manifest: talk to actual switch users.

Point 3 is worth flagging honestly: the absence of complaints is *not* evidence of a gap. Do not let it become one in a pitch deck.

---

## 8. What I could NOT verify (UNVERIFIED)

- **Why Google archived Project Gameface.** No statement from Google found. Both readings offered in §1 are inference, not fact.
- **Whether Gameface's Android code was absorbed into any shipping Google product.** No successor named anywhere I could find.
- **Explicit commercial-use license terms for the MediaPipe FaceLandmarker *model weights*** (as distinct from the Apache-2.0 code samples and CC-BY-4.0 docs). The overview page does not state them; the per-component model cards (FaceDetector, FaceMesh-V2, Blendshape) would need to be read directly. **Manifest should verify this before shipping commercially.**
- **Whether Camera Switches processing is on-device.** Google's support documentation is silent on this. (Look to Speak *is* documented as on-device.)
- **Whether Apple's BCI HID protocol actually shipped in iOS 26.** Press in May 2025 said "iOS 19, fall 2025" (before Apple's version renumbering to 26). Synchron demoed against it on 2025-08-04, implying availability. But Apple's **May 2026** accessibility release contains **no BCI mention at all**, so current shipping status and developer availability are unconfirmed.
- **Adoption/usage numbers for Camera Switches, Look to Speak, or Apple Head Tracking.** No figures published by either vendor. Gameface's 633 GitHub stars is the only hard number in this whole space, and stars ≠ users.
- **playAbility's pricing, funding, headcount, or user count.** Not researched in depth; worth a dedicated look, as it is the closest commercial analogue.
- **AAC/eye-gaze market sizing.** I deliberately did not cite a TAM. The one search result offering one (`dataintelo.com` "AAC Devices Market Research Report 2034") is a **report-selling vendor** — treat any number from that class of source as marketing, not evidence.

---

## 9. SO WHAT FOR MANIFEST

**1. Retire the camera demo as a *differentiator*. Keep it only as a *demo*.**
Apple iOS 26 Head Tracking (8 gestures, mappable to any Shortcut, with slight/default/exaggerated thresholds) and Android Camera Switches (6 gestures including look-left/look-right) both strictly dominate a nose-yaw left/right carousel. Google built the superset, open-sourced it Apache-2.0, and then archived it. If a Z Fellows reviewer spends four minutes searching, they will find all of this. Leading with the camera demo as novel is a credibility risk, not an asset. Lead with it as *proof you can ship a working real-time input loop* — which is what it actually proves.

**2. Fix the dependency story before someone else does.**
Manifest's stated reason to build its own EMG model is escaping Emotiv's classifier. But the camera path depends entirely on Google's FaceLandmarker — a "preview" model whose flagship application Google abandoned. You have two vendor dependencies, not one. Either own that explicitly in the pitch ("both current paths are vendor-classifier-dependent; that's precisely what we're fixing") or expect it to be found and to look like an oversight. The second option is worse.

**3. Apple's BCI HID protocol (May 2025) is an existential question you must answer directly.**
Apple made neural input a native input category routing into Switch Control. That is "modality-agnostic biosignal → tiny command vocabulary" shipped by the OS vendor with Synchron as launch partner. Manifest needs a one-sentence answer to *"why doesn't Apple's BCI HID protocol eat you?"* Plausible answers: it targets **implanted** BCIs and clinical partners, not consumer non-invasive sensors; it is Apple-only; it does not solve signal→intent, only transport. But you must say which, out loud, before you're asked.

**4. The only defensible territory found in this research is fusion and failover — not any single modality.**
Every individual modality is commoditized or platform-owned: head/face (Apple, Google, Camera Mouse), eye gaze (Apple, Tobii, WebGazer), voice (everyone), implanted BCI (Apple + Synchron). What nobody ships is a layer that **degrades gracefully across modalities as a user's condition changes** — the documented late-stage ALS problem where head control drops, eyelids droop, and medications degrade eye tracking. Dedicated AAC hardware answers this with multi-modal devices costing thousands. If Manifest has a thesis, it is that one, and it makes the camera demo *one input among several* rather than the headline. Reframe the deck around this.

**5. Go validate with real users before writing another line of runtime code.**
I could not find a single published practitioner critique of Camera Switches — positive or negative. That vacuum means Manifest currently has **no evidence** that the incumbents fail anyone. Talking to 15–20 switch/AAC users and clinicians is cheaper than any engineering sprint and is the only thing that converts assumption #4 into a fact. Right now the multi-modal-failover thesis is a hypothesis I constructed from an ALS clinical article, not something Manifest has verified.

**6. Do not build a browser head-mouse product.**
The cross-platform-web angle (§7.1) is real but small, and the competitive floor is a zero-star GitHub weekend project. If the web layer matters, it should be the *delivery surface* for the fusion runtime, not the product.

---

## Sources

**Google Project Gameface**
- [github.com/google/project-gameface](https://github.com/google/project-gameface) — repo; archived 2025-09-05, Apache-2.0, 633 stars / 88 forks / 41 open issues, last push 2024-08-30 (GitHub API, queried 2026-07-19)
- [Project Gameface launches on Android — Google Developers Blog](https://developers.googleblog.com/en/project-gameface-launches-on-android/) — 2024-05-14
- [Project GameFace makes gaming accessible to everyone — Google Developers Blog](https://developers.googleblog.com/en/project-gameface-makes-gaming-accessible-to-everyone/) — 2023
- [9to5Google: Project Gameface facial gesture controls to Android](https://9to5google.com/2024/05/15/google-project-gameface-android/) — 2024-05-15
- [SiliconANGLE: Gameface lets people control Android via gestures](https://siliconangle.com/2024/05/16/googles-project-gameface-lets-people-control-android-devices-using-gestures-facial-expressions/) — 2024-05-16

**Android platform**
- [Use Camera Switches — Android Accessibility Help](https://support.google.com/accessibility/android/answer/11150722?hl=en) — official; six gestures, Android 6+
- [Two new tools that make your phone even more accessible — Google Blog](https://blog.google/company-news/outreach-and-initiatives/accessibility/making-android-more-accessible/) — 2021
- [XDA: Android Camera Switches lets you control your phone with your face](https://www.xda-developers.com/android-camera-switches-control-phone-with-face/) — 2021
- [Look to Speak helps people communicate with their eyes — Google Blog](https://blog.google/company-news/outreach-and-initiatives/accessibility/look-to-speak/) — 2020-12-08
- [Engadget: Look to Speak lets users pick phrases with their eyes](https://www.engadget.com/google-android-look-to-speak-accessibility-155827918.html) — 2020-12-08
- [Equal Entry: Mobile Accessibility Tools — Camera Switches](https://equalentry.com/mobile-accessibility-tools-camera-switches/) — 2024-08-27 (descriptive only, no critical evaluation)

**Apple**
- [Apple announces new accessibility features, including Eye Tracking](https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/) — 2024-05-15
- [Apple unveils powerful accessibility features coming later this year](https://www.apple.com/newsroom/2025/05/apple-unveils-powerful-accessibility-features-coming-later-this-year/) — 2025-05-13 (Head Tracking + BCI HID protocol quote)
- [Apple unveils new accessibility features and updates with Apple Intelligence](https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/) — 2026-05-19
- [Control iPhone with the movement of your eyes — Apple Support](https://support.apple.com/guide/iphone/control-iphone-with-the-movement-of-your-eyes-iph66057d0f6/ios)
- [Control iPad with the movement of your head — Apple Support](https://support.apple.com/guide/ipad/control-ipad-with-the-movement-of-your-head-ipad06393f31/ipados)
- [Neowin: How to set up and use Head Tracking on iOS 26](https://www.neowin.net/guides/how-to-set-up-and-use-head-tracking-on-your-iphone-running-ios-26/) — 2025 (eight gestures, slight/default/exaggerated)
- [AbilityNet: head tracking in iOS 26](https://api.abilitynet.org.uk/how-to-control-your-device-using-head-tracking-in-ios-26-on-your-iphone-or-ipad)
- [Apple: All New Features iOS 26 (PDF)](https://www.apple.com/os/pdf/All_New_Features_iOS_26_Sept_2025.pdf) — Sept 2025

**Apple BCI / Synchron**
- [Synchron To Achieve First Native BCI Integration with iPhone, iPad and Apple Vision Pro — BusinessWire](https://www.businesswire.com/news/home/20250513927084/en/Synchron-To-Achieve-First-Native-Brain-Computer-Interface-Integration-with-iPhone-iPad-and-Apple-Vision-Pro) — 2025-05-13
- [Synchron Debuts First Thought-Controlled iPad Experience Using Apple's New BCI HID Protocol — BusinessWire](https://www.businesswire.com/news/home/20250804537175/en/Synchron-Debuts-First-Thought-Controlled-iPad-Experience-Using-Apples-New-BCI-Human-Interface-Device-Protocol) — 2025-08-04

**MediaPipe**
- [Face landmark detection guide — Google AI Edge](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker) — 478 landmarks, 52 blendshapes, "Solutions Preview is an early release"
- [Face landmark detection guide for Web](https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js)

**Prior art / competitors**
- [Camera Mouse — About](http://www.cameramouse.org/about.html)
- [BC 'Camera Mouse' Assistive Technology Tops 3 Million Downloads — Boston College](https://www.bc.edu/bc-web/bcnews/science-tech-and-health/technology/camera-mouse-boston-college.html)
- [Betke, Gips & Fleming, "The Camera Mouse: visual tracking of body features…" (PDF)](https://www.cs.bu.edu/fac/betke/papers/betke-gips-fleming-nsre02.pdf) — 2002
- [playAbility accessibility review — Can I Play That?](https://caniplaythat.com/2024/11/26/playability-accessibility-review/) — 2024-11-26
- [Face and Voice as a Joystick — Open Assistive Tech (GOAT)](https://www.openassistivetech.org/face-and-voice-as-a-joystick-how-ai-expands-accessibility-in-gaming/)

**Gaze precision / hardware**
- [WebGazer.js — Brown University](https://webgazer.cs.brown.edu/)
- [WebGazer: Scalable Webcam Eye Tracking Using User Interactions (IJCAI 2016, PDF)](https://jeffhuang.com/papers/WebGazer_IJCAI16.pdf)
- [EyeTheia: A Lightweight and Accessible Eye-Tracking Toolbox (arXiv 2601.06279)](https://arxiv.org/pdf/2601.06279)
- [Tobii Eye Tracker 5 product page](https://gaming.tobii.com/product/eye-tracker-5/) — $229
- [Get started with eye control in Windows — Microsoft Support](https://support.microsoft.com/en-us/accessibility/windows/eye-control/get-started-with-eye-control-in-windows)
- [The Pros and Cons of Head Tracking Technology — accessibility.com](https://www.accessibility.com/blog/the-pros-and-cons-of-head-tracking-technology) — 2023-11-22

**AAC / clinical**
- [ALS — Eyegaze](https://eyegaze.com/users/als/)
- [Eye Tracking or Eye Gaze for AAC — AbleNet SupportHub](https://support.ablenetinc.com/quicktalker-freestyle/eye-tracking-or-eye-gaze-for-aac/)
- [How does eye tracking work for AAC? — Tobii Dynavox](https://www.tobiidynavox.com/pages/what-is-eye-tracking)

**Manifest codebase (local, verified 2026-07-19)**
- `/Users/kanuj/Documents/projects/manifest/hooks/use-face-gaze.ts` — 341 lines; nose-vs-eye-line yaw only (comment line 33: *"Nose vs eye-line yaw only — iris blend was cancelling slight looks."*); dwell at line 291, cooldown at line 292; no blendshape usage
- `/Users/kanuj/Documents/projects/manifest/package.json` — `"@mediapipe/tasks-vision": "^0.10.35"`


---

# Emotiv Cortex licensing + platform dependency risk

# Emotiv Cortex Licensing + Platform Dependency Risk — Research Brief
**Prepared 2026-07-19 | Adversarial posture | For founder decision-making, not marketing**

---

## 1. The headline finding

Emotiv's own developer page states a **20% royalty** applies once you cross a threshold — and the threshold is small enough that Manifest would hit it in a modest seed-stage year.

Emotiv's published tier structure (emotiv.com/developer):

| Tier | APIs included | Eligibility | Price |
|---|---|---|---|
| **Registered Developer** | Mental Commands, Frequency Bands, **Facial Expressions (`fac`)**, Motion, low-res Performance Metrics. **No raw EEG.** | "Under 1000 users and less than $250,000 in revenue" | Free |
| **Professional Developer** | Above + **Raw EEG API**, high-res (2 Hz) Performance Metrics | "Over 1000 users or $250,000 in revenue" | Custom — **not publicly listed** |
| **Enterprise / Solutions Partners** | Full enterprise access | — | Custom negotiation |

Verbatim from that page:

> "After the revenue or user threshold that is directly attributable to the Emotiv product is reached, **regardless of who collects it, a 20% royalty will apply**."

Read that clause carefully. Three things make it worse than it first looks:

1. **"regardless of who collects it"** — this is written to capture revenue Manifest collects, not just revenue Emotiv collects. It is a claim on *your* top line.
2. **1,000 users OR $250,000** — whichever comes first. 1,000 users is not a business; it is a successful pilot. An accessibility product deployed at two rehab clinics could cross it.
3. **20% is a royalty, not a margin share.** On hardware-adjacent software margins this is plausibly a large fraction of gross profit. UNVERIFIED whether it is levied on gross or net revenue, and whether it applies to *all* revenue or only revenue "attributable to the Emotiv product" — that phrase is undefined and the definition is the entire negotiation.

**Skeptical read:** This number was not published in a contract. It sits on a marketing page with a "Let's talk!" CTA. That means it is an *opening position*, not a rate card — which cuts both ways. It might be negotiable down. It might also be replaced by something worse once you are locked in and have shipped.

---

## 2. The Developer License Agreement — actual clauses

Source: `id.emotiv.com/eoidc/privacy/doc/developer-license/` (redirected from `cerebrum.emotivcloud.com`). **This document is explicitly marked "(deprecated)" in its own header and carries no version date.** That is itself a finding — see §7.

Clauses that matter to Manifest:

**§6.1 — Distribution requires a separate agreement:**
> "If You wish to distribute Third Party Software, or any product or service incorporating the Third Party Software, outside of Your organization, You must obtain a Distribution License Agreement from EMOTIV."

Manifest's current license (whatever tier it holds) **does not by itself grant the right to ship**. Shipping is a separate contract negotiation that has not happened.

**§6.2 — Open-source distribution requires Emotiv approval**, obtained by contacting customer service. So "we'll just open-source it" is not an escape hatch; it is another approval gate.

**§6.3 — Paid distribution** requires contacting business development for a Distribution License Agreement specifying "terms and conditions, including license fees." Note: **Exhibit A, the fee schedule, is a blank placeholder** — `"[Insert amount and calculation of the API License Fee below]"`. The price is whatever they decide when you ask.

**§4.1 — License Seats:** Noncommercial = 3 seats. **Commercial = one (1) License Seat.** Student = 1. A two-person commercial startup is already at or over the commercial seat limit.

**§10.2(g) — Anti-competition clause.** Prohibited to:
> "access the API in order to build a competitive product or service or to monitor the availability, performance or functionality of the API or other EMOTIV software"

**This is the clause that should worry you most, and it is not a stretch.** Manifest's stated thesis is a *modality-agnostic biosignal input runtime* whose explicit roadmap is "build our own EMG model to stop depending on Emotiv's classifier." Emotiv sells headsets bundled with exactly such a classifier. A hostile reading — and it is not a strained one — is that Manifest is using Emotiv's `fac` output as a bootstrap and reference while building a replacement for it. That is close to the literal text of §10.2(g).

**§4.5 — Anti-fragmentation:**
> "You may not take any actions that may cause or result in the fragmentation of the API, including but not limited to distributing, participating in the creation of, or promoting in any way a software development kit derived from the API."

Manifest's Node bridge that normalizes Cortex `fac` events into a vendor-neutral intent vocabulary is, functionally, an abstraction layer over the API. Whether that constitutes "a software development kit derived from the API" is a judgment call you would not want to argue in front of a judge on someone else's budget. UNVERIFIED — no case law or enforcement precedent found.

**§12.3 — Termination:** Emotiv may terminate for breach, legal requirement, geographic withdrawal, or if provision becomes **"no longer commercially viable" at EMOTIV's sole discretion.** That is a unilateral kill switch with no cure period tied to your conduct.

**§5.1 — Ownership (the one piece of good news):**
> "EMOTIV obtains no ownership interest from You under this API License Agreement in or to any Third Party Software You develop using the API."

Your code is yours. But §5.6 permits Emotiv to "use and disclose this third party information" subject to consent — UNVERIFIED what user biosignal data flows to Emotiv Cloud in normal Cortex operation.

---

## 3. The `fac` classifier is a black box — and that is a technical risk, not just a legal one

Cortex documents the `fac` stream's *shape* but not its *substance*:

- Fields: `eyeAct` (string), `uAct`/`uPow` (upper face label + 0–1 intensity), `lAct`/`lPow` (lower face label + intensity).
- Sample: `{"fac":["neutral","neutral",0,"clench",0.0576], ...}`
- The docs do not even enumerate the possible action labels — they tell you to call `getDetectionInfo` at runtime to discover them.

**What is NOT documented anywhere I could find:**
- The algorithm or model architecture
- Training data, subject count, or demographics
- Any accuracy, precision/recall, false-positive rate, or latency figure
- Whether `fac` output is EMG-derived, EEG-derived, or a fusion
- Whether the classifier is versioned, or whether Emotiv can silently change its behavior in a Cortex update

That last point is the operational killer. **Manifest's thresholds and hysteresis are tuned against an undocumented, unversioned, remotely-updatable classifier.** An Emotiv-side model update that shifts the `lPow` distribution for `clench` would silently change Manifest's false-activation rate on a shipped accessibility product, with no changelog and no way to pin the old behavior. For a user who depends on this to operate a computer, that is a safety-adjacent regression arriving through someone else's auto-update.

You have no test oracle for a dependency you cannot version.

---

## 4. Emotiv the company — thin, and thinner than the brand suggests

- **Employees:** ~113 (ZoomInfo, as of Apr 30 2026 — self-reported aggregator data, treat as ±30%).
- **Funding:** Sources disagree materially. Crunchbase/PitchBook-derived figures range **$7.41M over 4 rounds** to **$10M total**. Investors named: Acequia Capital, Disney Accelerator, Techstars, Plug and Play, Macquarie University Incubator. Most recent listed deal: an **equity crowdfunding** with MYndspan, 2025-04-10.
- **Status:** Private, San Francisco, active — shipping products and publishing content in 2026.

**Skeptical read:** A ~113-person hardware company that has raised under $10M in institutional capital across ~15 years, whose most recent financing event was *equity crowdfunding*, is either (a) admirably revenue-sustaining and capital-efficient, or (b) unable to raise a priced institutional round. Equity crowdfunding as the latest event leans toward (b). Neither reading makes them a durable platform to bet a company on. They are not going to zero tomorrow, but they are also not a hyperscaler whose API will still be there in 2036.

**UNVERIFIED:** revenue, profitability, burn, runway, any 2025–26 layoffs. No filings are public. I found no evidence of distress and no evidence of health — the absence of data is the finding.

---

## 5. Hardware pricing (2026)

**Emotiv** (emotiv.com):
| Device | Channels | Price |
|---|---|---|
| MN8 | 2 (earbuds) | $399 |
| Insight | 5 | $499 |
| **EPOC X** | 14 | **$999** |
| Flex | 32 | from $1,899 |

Plus EmotivPRO software subscriptions: Lite free, Standard ~$89/mo, Team ~$224/mo.

**A licensing inversion you should know about.** Cortex's Getting Started docs state: the Basic/BCI API is free for consumer devices (Insight, MN8), and consumer devices get **full Premium API access at no cost** — while **professional devices (EPOC X, EPOC Flex) require a paid premium Developer API license** for the Premium API. Manifest is on EPOC-X, the device on the *wrong* side of that split. UNVERIFIED whether `fac` specifically falls under Basic or Premium for EPOC-X; the developer page lists Facial Expressions in the free Registered tier, which suggests you are currently fine, but these two Emotiv sources are not obviously consistent with each other. **Worth a direct written question to Emotiv support — get the answer in email.**

---

## 6. Exit paths to vendor-neutral — what it actually costs

### 6a. BrainFlow is the obvious abstraction layer. **It does not support Emotiv.**

BrainFlow (MIT licensed, all features free) supports: OpenBCI (Cyton, Ganglion, Daisy, Galea, WiFi variants), Muse (S, S Athena, 2, 2016 — **native BLE, no Muse SDK required**), Neurosity (Notion 1/2, Crown), g.tec Unicorn, Mentalab Explore, EmotiBit, NeuroMD BrainBit/Callibri, **OYMotion gForcePro/gForceDual (EMG)**, PiEEG, FreeEEG32/128, Ant Neuro, Enophone, BrainAlive, NeuroPawn, BioListener, IronBCI.

**EMOTIV is absent from that list.** This is not an oversight — it is a consequence of Cortex being a closed, login-gated, cloud-authorized WebSocket service rather than an open protocol.

**Implication: there is no cheap migration.** Moving to BrainFlow is not a config change or an adapter swap. Emotiv sits on one side of an architectural line and essentially every other vendor sits on the other. Everything Manifest has built on top of Cortex — auth flow, Launcher lifecycle, `fac` event semantics, threshold/hysteresis tuning — is throwaway on the day you leave.

### 6b. Alternative hardware, priced

| Device | Type | Price | Notes |
|---|---|---|---|
| **PiEEG (8ch)** | EEG/EMG/ECG Pi shield | **$350** | Open source. **Reported discontinued** — 8ch available until stock depleted. PiEEG-16 still listed. |
| PiEEG (4ch) | same | $250 | same caveat |
| **OpenBCI Ganglion** | 4ch | **$624.99** | BrainFlow native |
| **OpenBCI Cyton** | 8ch | **$1,249** | BrainFlow native |
| OpenBCI Cyton+Daisy | 16ch | $2,499 | |
| OpenBCI Ultracortex Mk IV | headset | from $499.99 | board not included |
| OpenBCI EEG Headband Kit | | $349.99 | |
| OpenBCI Biosensing Starter Bundle | | $1,019.99 | |
| **Neurosity Crown** | 8ch | **$1,499 + $29.99/mo** after yr 1 | BrainFlow supported, but the monthly membership is *itself a platform dependency* — arguably worse than Emotiv's |
| **IDUN Guardian 4 Starter** | in-ear EEG | **~CHF 999** (CHF 300 off) | Raw data + SDK + classifiers |
| **OYMotion gForcePro+** | 8ch **EMG** armband + 9-axis IMU, BLE | **~$1,250** | BrainFlow supported, EMG-native |
| OYMotion gForce200 | EMG armband | ~$700 (1–9 units, Alibaba) | |
| MyoWare 2.0 | single-channel sEMG | **~$38** | Arduino-compatible, per-channel |
| Muse S / Muse 2 | consumer EEG | consumer pricing | BrainFlow native BLE — **bypasses the dead SDK entirely** |

### 6c. The Muse precedent — read this twice

InteraXon **discontinued the Muse SDK around 2017**, publicly, citing unsustainable developer support burden, and pivoted to a software subscription model. The LSL community issue is literally titled *"The worst case happened: Interaxon does no longer offer the Muse SDK!!!"*

This is your base rate. A consumer neurotech vendor with a developer program killed that program when it stopped being commercially convenient — exactly the discretion Emotiv reserved in §12.3 ("no longer commercially viable, at EMOTIV's sole discretion").

The instructive part: **Muse remains usable today only because the community reverse-engineered native BLE access**, which BrainFlow now ships. Cortex offers no equivalent fallback — it is login-gated against Emotiv's cloud, so a reverse-engineered path is both harder and squarely into §10.2 territory.

### 6d. Emotiv's own API-break history

Emotiv has broken developers before, deliberately:
- **Cortex v1 and all cloud SDK APIs end-of-lifed 2020-12-31** — "Cortex v1 applications will no longer function."
- **Cortex 2.0 removed anonymous mode**; `authorize` now mandates client ID + secret.
- **Cortex 2.0 removed login/logout methods** — the user must now log in via the EMOTIV App / Launcher.
- Endpoint moved from `wss://emotivcortex.com:54321` to `wss://localhost:6868`.
- Focus detection deprecated (reachable only via `exportRecord` with `includeDeprecatedPM`).

### 6e. The runtime dependency nobody counts

Cortex requires an **EmotivID account**, a **registered App ID with client ID/secret**, and **internet connectivity for initial authorization** — Cortex "must connect to the EMOTIV cloud to process certain requests." A token, once obtained, permits offline operation; but **first login must be online**, and the **EMOTIV Launcher desktop app must be running and must authorize your app**.

For an accessibility product, restate that plainly: **a user who cannot use a mouse must get through an Emotiv login and a Launcher authorization dialog before your software can accept input.** That is a chicken-and-egg accessibility failure sitting inside your critical path, and it is not yours to fix.

---

## 7. What I could NOT verify

- **Actual Professional/Enterprise Developer license pricing.** Not published anywhere. Custom quote only. The DLA's Exhibit A fee schedule is a literal blank.
- **Whether the fetched Developer License Agreement is the operative one.** It is **marked "(deprecated)"** with no date and no successor document I could locate. Manifest may be bound by terms I could not read. This alone justifies a written request to Emotiv for the current agreement.
- **Whether the 20% royalty is on gross or net revenue**, and how "directly attributable to the Emotiv product" is defined or measured.
- **Whether `fac` specifically requires a premium license on EPOC-X.** Two Emotiv sources point different directions (see §5).
- **Any published accuracy, latency, or validation figure for the `fac` classifier.** None found. My accuracy search returned Affectiva/iMotions facial-video literature, which is a different problem domain and does not transfer.
- **Whether Emotiv versions or silently updates the `fac` model.** No changelog found for classifier behavior.
- **Emotiv's revenue, burn, runway, profitability, or any 2025–26 layoffs.** No public filings.
- **Precise funding total** — sources conflict ($7.41M vs $10M).
- **Any enforcement precedent** for §10.2(g) or §4.5. No litigation or developer-account-termination reports found.
- **What biosignal data Cortex transmits to Emotiv Cloud** during normal operation.
- **Current PiEEG availability** — discontinuation is reported but I could not confirm from PiEEG directly.
- **Exact current OYMotion gForcePro+ list price** — $1,250 is from a secondary source; Alibaba listings vary.
- **Whether Emotiv would actually enforce any of this against a two-person student startup.** Probably not today. That is not the risk — the risk is enforcement at the moment you have traction and no leverage.

---

## SO WHAT FOR MANIFEST

**1. You do not currently have the right to ship. Full stop.**
§6.1 requires a separate Distribution License Agreement to distribute *at all* — commercial or open source. Whatever demo you show Z Fellows is fine; the product you describe shipping is not covered. If a Z Fellows partner asks "what's your license to ship this?", the honest answer today is "we don't have one yet, and the fee schedule is blank." Get that answer prepared rather than discovered live. **Action: email Emotiv business development this week asking (a) for the current, non-deprecated Developer License Agreement, (b) whether `fac` on EPOC-X requires a premium license, (c) what a Distribution License Agreement costs.** A written answer is worth more than another month of code.

**2. The 20% royalty at 1,000 users is a business-model problem, not a legal footnote.**
1,000 users is a *pilot*, not scale. Any credible accessibility go-to-market — a few clinics, one university disability services office — crosses it. You are proposing to build a company whose unit economics are subject to a 20% top-line claim by a vendor you don't control, on terms not yet negotiated. Model this explicitly in whatever financials you show investors. An investor who finds it themselves will conclude you didn't read your own dependencies.

**3. §10.2(g) makes your stated roadmap adversarial to your current supplier.**
Your public intent — "build our own EMG model to stop depending on Emotiv's classifier" — is, read uncharitably, using Cortex to build a competitive product. That is prohibited by the letter of the agreement. **Stop describing it that way in writing.** Frame the own-model work as *vendor-independent input processing for hardware Emotiv does not serve*, and — more importantly — **do the training-data collection on non-Emotiv hardware from day one** so there is no factual claim that your model was derived from Cortex output. This is a cheap fix now and an unfixable problem later.

**4. Your exit path costs less in dollars than you fear, and far more in code than you think.**
Hardware is cheap: an EMG-native BrainFlow-supported path is **$38 (MyoWare, per channel) to ~$1,250 (gForcePro+ 8ch armband)** — call it **under $2,000 to be fully vendor-neutral on hardware**, less than two EPOC-X units. But **BrainFlow does not support Emotiv**, so every line above the wire is thrown away: auth, Launcher lifecycle, `fac` semantics, thresholds, hysteresis tuning. The migration cost is engineering weeks, not capex. **Which means the right move is to spend those weeks now, while the codebase is small, not after a pilot depends on it.** The Node bridge should be refactored today so `fac` is one adapter behind a vendor-neutral event interface — that is the single highest-leverage architectural decision available to you, and it also happens to be exactly what your "modality-agnostic" pitch claims you already have. Right now that claim is aspirational; make it true.

**5. You cannot version, test, or reason about the `fac` classifier, and you are shipping it to disabled users.**
No published accuracy. No documented algorithm. No changelog. No pin. Emotiv can change its behavior in an update and your false-activation rate moves silently on a product someone uses to operate their computer. **Your `fac` thresholds have no test oracle.** At minimum: record raw sessions so you can regression-test against fixed data, log the Cortex version alongside every event, and treat any Cortex update as a release-blocking re-validation. Better: get off it. Note also that the Launcher login requirement means **a motor-impaired user must complete a mouse-driven authorization flow before your accessibility software will run** — that is an accessibility defect in your critical path that you cannot fix and should not defend.

**6. Muse is your base rate, and it says the SDK gets killed.**
InteraXon discontinued the Muse SDK in 2017 for exactly the reason Emotiv reserved in §12.3. Emotiv has already killed Cortex v1 (2020), removed anonymous auth, and forced Launcher-mediated login. Muse survived only via community-reverse-engineered BLE — a route Cortex's cloud auth forecloses and §10.2 prohibits. Combine that with a ~113-person company whose latest financing event was equity crowdfunding, and the honest framing is: **the Emotiv dependency is not existential today, but it is a dependency on a small company's discretion, with a documented history of breaking developers, no contractual right to ship, an anti-competition clause pointed at your roadmap, and no migration path short of a rewrite.** Treat it as a bootstrap you are actively paying down — not a platform.

---

## Sources

All accessed 2026-07-19.

- Emotiv Developer tiers, thresholds, 20% royalty — https://www.emotiv.com/developer
- Emotiv Developer License Agreement (marked deprecated; §4.1, §4.5, §5.1, §5.6, §6.1–6.3, §10.2(g), §12.3, Exhibit A) — https://id.emotiv.com/eoidc/privacy/doc/developer-license/ (redirect from https://cerebrum.emotivcloud.com/api/privacy/doc/developer-license/)
- Emotiv End User License Agreement — https://cerebrum.emotivcloud.com/api/privacy/doc/eula/
- Cortex API Getting Started (EmotivID, App ID, client ID/secret, Basic vs Premium by device class) — https://emotiv.gitbook.io/cortex-api
- Cortex `fac` data stream spec (`eyeAct`, `uAct`/`uPow`, `lAct`/`lPow`, `getDetectionInfo`) — https://emotiv.gitbook.io/cortex-api/data-subscription/data-sample-object
- Cortex Release Notes (v1 EOL, v2.0 auth changes, endpoint move) — https://emotiv.gitbook.io/cortex-api/release-notes
- Cortex v1 end-of-support announcement (2020-12-31) — https://www.emotiv.com/blogs/news/cortex-v1-end-of-support-by-2021
- Cortex troubleshooting / cloud + Launcher requirements — https://emotiv.gitbook.io/cortex-api/troubleshooting-guide
- EmotivPRO offline behavior — https://emotiv.gitbook.io/emotivpro-v3/emotivpro-license-options/using-emotivpro-offline
- Emotiv hardware pricing — https://www.emotiv.com/blogs/news/emotiv-eeg-headset-price and https://www.emotiv.com/comparison
- Emotiv company profile / funding / headcount — https://pitchbook.com/profiles/company/103988-71 · https://www.crunchbase.com/organization/emotiv · https://tracxn.com/d/companies/emotiv · https://www.zoominfo.com/c/emotiv-inc/347694675
- BrainFlow Supported Boards (**Emotiv absent**; Muse native BLE; OYMotion EMG) — https://brainflow.readthedocs.io/en/stable/SupportedBoards.html
- BrainFlow MIT license / features — https://brainflow.org/features/ · https://github.com/brainflow-dev/brainflow
- OpenBCI shop pricing — https://shop.openbci.com/collections/openbci-products
- Muse SDK discontinuation (community thread) — https://github.com/sccn/labstreaminglayer/issues/30
- Muse developer page / SDK FAQ — https://choosemuse.com/pages/developers · https://choosemuse.my.site.com/s/article/Muse-Software-Development-Kit-SDK-FAQs
- Neurosity Crown pricing + membership — https://neurosity.co/crown
- Neurosity vs EPOC X comparison (**competitor source — bias noted; used only to corroborate the 20% figure, which was then confirmed on emotiv.com**) — https://neurosity.co/guides/neurosity-crown-vs-emotiv-epoc-x
- IDUN Guardian 4 — https://iduntechnologies.com/idun-guardian
- PiEEG pricing / discontinuation — https://pieeg.com/pieeg/ · https://www.crowdsupply.com/hackerbci/pieeg · https://www.electronics-lab.com/pieeg-a-raspberry-pi-shield-for-measuring-biosignals-like-ecg-emg-and-eeg-available-for-just-350/
- OYMotion gForcePro+ / gForce200 — https://www.oymotion.com/en/product32/149 · https://oymotion.com/en/product32/150
- MyoWare 2.0 — https://myoware.com/products/muscle-sensor/ · https://www.sparkfun.com/myoware-2-muscle-sensor.html
- EMG armband review literature (context only) — https://pmc.ncbi.nlm.nih.gov/articles/PMC12818089/


---

# Direct competitors: consumer neural/biosignal input companies

# Competitive Landscape: Consumer Neural/Biosignal Input Companies
**Prepared for Manifest — adversarial read. Compiled 2026-07-19.**

---

## Executive summary (the blunt version)

Three findings dominate everything else:

1. **The "runtime/middleware above acquisition" position is not vacant — it is contested from above by Apple and from below by every hardware company that has already pivoted into it.** Apple shipped a **BCI Human Interface Device (BCI HID) protocol** in May 2025 that makes biosignals a native input method in iOS/iPadOS/visionOS, routed through Switch Control. That is, structurally, exactly the layer Manifest describes — shipped, free, OS-level, by the platform owner.
2. **Middleware-first in this space has a losing track record.** Neurable started as a BCI *SDK/middleware* company (2017), abandoned it for hardware (2019–21), and only returned to licensing in 2026 *after* raising $35M and shipping product. Intheon/NeuroPype has been the pure biosignal-middleware play since ~2015 and is effectively bootstrapped and commercially invisible. Nobody has won here as software-only without hardware or distribution.
3. **Manifest's current Emotiv dependency may be contractually incompatible with its own thesis.** The Emotiv Developer License contains an explicit **anti-fragmentation clause** barring "distributing, participating in the creation of, or promoting in any way a software development kit derived from the API," plus a bar on using the API "to build a competitive product or service." An abstraction layer over Cortex is arguably both.

---

## Tier 1 — Direct competitors: EMG/neural input for consumers

### Wearable Devices Ltd. (NASDAQ: WLDS) — the public comp, and it's ugly
The only company here with audited numbers, which makes it the single most useful datapoint in this brief.

| Metric | FY2025 | FY2024 |
|---|---|---|
| Revenue | **$647,000** | $522,000 |
| Growth | +23.9% | — |
| Net loss | **$(8.107)M** | $(7.879)M |
| R&D | $3.5M | $3.0M |
| Sales & marketing | $1.85M (**down 12%**) | $2.1M |
| Cash (Dec 31) | $18.4M | — |
| Raised in 2025 | $24.4M gross / $21.7M net | — |

**The skeptical read:** a decade-old, NASDAQ-listed, well-funded gesture-control company with shipping product (Mudra Band for Apple Watch, Mudra Link wristband) generates **$647K of annual revenue against $8.1M of losses.** Loss per diluted share went from $(72.60) to $(6.53) — that improvement is almost entirely dilution/reverse-split arithmetic, not operating leverage. They *cut* sales and marketing 12% while revenue "grew" by $125K. This is not a company finding product-market fit; it is a company financed by capital markets rather than customers.

**Directly relevant to Manifest:** their 2025 strategic announcement was the **"Mudra Experience Studio,"** pitched verbatim as solving "gesture fragmentation across major spatial computing and mobile platforms" via "AI-assisted development tools and a single codebase" so OEMs can integrate without hardware changes. **That is Manifest's positioning statement, announced by a public company with $18.4M in the bank.** The position is not vacant.

### Pison Technology — quietly pivoted away from gesture as the main business
- **Modality:** wrist-worn neural/EMG-adjacent sensing (nerve signal at the wrist).
- **Funding:** $5.35M round led by **Samsung Ventures, Jan 7, 2025**. Round labeling is inconsistent across databases (Crunchbase-family sources call it unattributed VC-II; PitchBook-family show a Dec 2024 Series A). Total raised: **UNVERIFIED** — Crunchbase returned 403.
- **Status signal:** pison.com's own headline is now *"The Neural Watch That Measures and Trains Your Brain."* Their commercial traction is the **Timex + STMicroelectronics partnership (Jan 2025)** for **neurocognitive sleep tracking**, not gesture control. Gesture is now an OEM/ODM licensing side-offer.
- **Why this matters:** Pison had a genuine EMG-class sensor, DoD contracts, and years of runway, and the market pulled them toward *health metrics* rather than *input control*. That is a demand-side signal about input, not a company-specific failure.

### Wisear — **ACQUIRED / absorbed (dead as an independent)**
- Paris-based, in-ear EMG/EOG/EEG "neural earbuds," jaw-clench and facial-gesture control. Positioned almost identically to Manifest's Emotiv 'fac'-stream work, in a better form factor.
- **Acquired by Naqi Logix; deal closed January 29, 2026.** Price **UNVERIFIED** (undisclosed in the coverage found).
- Wisear never reached volume consumer shipping before being absorbed. **This is the closest analogue to Manifest's current working demo, and it did not survive independently.**

### Naqi Logix — alive, but finance it skeptically
- In-ear neural earbuds, gesture/intent control; acquirer of Wisear.
- **~$9.6M raised, 27 patents, $1.2M government contract.** Currently raising via **Reg A+ retail crowdfunding** (StartEngine, then DealMaker) at a stated **valuation of $126M–$156M**.
- **The skeptical read:** a ~$130M+ valuation set by retail crowdfunding rather than institutional pricing, with <$10M raised to date, is a valuation the company chose, not one the market cleared. CES Innovation Award nominations (2024, 2025, 2026) and an Edison Award are marketing artifacts, not traction. Consumer price is speculated around $1,195 but **not settled — UNVERIFIED.**

### Meta (CTRL-labs) — **the existential one**
- Acquired CTRL-labs 2019 (~$500M–$1B reported, never confirmed). Shipped **Meta Neural Band** with **Meta Ray-Ban Display**, announced Sept 17, 2025, released Sept 30, 2025, **$799 bundled**. 18-hour battery.
- Published **"A generic non-invasive neuromotor interface for human-computer interaction," Nature, July 2025** — a **cross-user sEMG decoder that works without per-user calibration.**
- **They open-sourced it.** `github.com/facebookresearch/generic-neuromotor-interface` (100 participants × 3 task families: discrete gestures, handwriting, wrist) and `github.com/facebookresearch/emg2qwerty` (**1,135 sessions, 108 users, 346 hours** — largest public sEMG typing dataset). Both **CC-BY-NC-SA 4.0** — note the **NC: non-commercial**, so Manifest can learn from it but cannot ship on it.
- At CES 2026 Meta showed the Neural Band moving **beyond** the glasses to other devices.

**This is the fact that most threatens Manifest's stated next step.** Manifest's current intent is "build our own EMG model and collect our own training data." Meta has already published the generic-decoder result, released 100+ hours of multi-user data, and shipped it in a $799 consumer product. Two students collecting their own EMG corpus are not going to out-model that, and the open dataset is non-commercially licensed so it can't be shortcut either.

---

## Tier 2 — EEG consumer hardware (adjacent, mostly *not* input control)

| Company | Modality | Funding / last round | Status | Price |
|---|---|---|---|---|
| **Neurable** | EEG in headphones | **$69.0M total; $35M Series A Dec 2025** (Spectrum Moonshot Fund lead, Pace Ventures) | Alive, strong | MW75 Neuro LT **$499** |
| **InteraXon / Muse** | EEG headband | **$60M reported Oct 18, 2025** (round type/lead **UNVERIFIED**); prior $9.5M Series C Aug 2022 | Alive; largest consumer EEG install base | ~$250–$500 |
| **Emotiv** | EEG headsets | Private, undisclosed | Alive; **Manifest's current dependency** | **EPOC X $1,199** |
| **OpenBCI (Galea)** | EEG+EMG+EOG+eye in XR | Private | Shipping (Galea + Pupil Labs Neon) | **~$28,000** — research only |
| **Neurosity (Crown)** | 8-ch EEG | Private, small | Alive, batch-based sales, niche | ~$900–$1,200 |
| **IDUN Technologies (Guardian)** | In-ear EEG | Series A was *planned* for 2025; **completion UNVERIFIED** | Alive, ~12 people, ADI partnership | Dev-kit tier |
| **Naxon Labs** | EEG software (Explorer/Emotions) | Bootstrapped | **Absorbed into ZirconTech, Jan 2, 2025** — no longer independent | Low-cost SaaS |
| **Kernel** | TD-fNIRS (Flow) | ~$54M founding + more | Alive; pivoted to **pharma/clinical measurement**, not input | Enterprise |
| **Openwater** | Optical/ultrasound | Non-profit-ish, open-source | Never a consumer input play | n/a |

**Pattern worth naming:** *none of the well-funded EEG companies are selling control.* Neurable sells focus tracking. Muse sells meditation. Kernel sells pharma measurement. IDUN sells sleep/brain metrics. The money in consumer EEG went to **passive metrics**, not **active input**. Manifest's own failed motor-imagery study (0.563 balanced accuracy on EPOC-X vs 0.711 on the public control set) is the same finding these companies reached commercially: consumer EEG is not a reliable control channel. Manifest already knows this; the point is that the market's exit from EEG-as-input is not a gap to fill, it's a verdict.

### Cognixion — the accessibility-specific one, and the one to actually study
- AAC + non-invasive BCI (SSVEP-based) headset, **Axon-R**, paired with Apple Vision Pro.
- **FDA Breakthrough Device Designation** + **CMS accreditation as a Durable Medical Equipment provider.** That second one is the real moat: it's a *reimbursement* pathway, which is how accessibility hardware actually gets paid for.
- **Funding figures conflict across sources** — one set says ~$29M total (Prime Movers Lab, Amazon Alexa Fund, Northwell Health Ventures, Memorial Hermann Ventures, ALS Association ALS Accel); another says **$23M Series A Oct 2025** led by Engine Ventures bringing total to **$42.5M**. **Flagged as UNVERIFIED — do not cite a single number.**
- Pivotal FDA trial targeted for 2026.

**Uncomfortable note for Manifest:** Cognixion's BCI channel is **SSVEP** — the modality Manifest explicitly decided against on photosensitive-seizure and comfort grounds. That decision is defensible, but the best-funded, FDA-designated, reimbursement-ready accessibility BCI company made the opposite call and is running a pivotal trial. Manifest should be able to articulate why Cognixion is wrong, not just why SSVEP made *them* uncomfortable.

---

## Tier 3 — The graveyard (this is the section that matters most)

**NextMind → Snap (March 2022).** Paris, ~20 people, $399 SSVEP visual-cortex dev kit. PitchBook valued it ~$13M — a *small* outcome, not a triumph. Snap **immediately discontinued the product and halted sales**, folding the team into Snap Lab research. Four years on there is no shipped Snap BCI input product. **A consumer BCI input company's best realistic exit was a ~$13M acquihire followed by product death.**

**Thalmic Labs / Myo armband (2013–2018).** The canonical dead attempt, and the one closest to Manifest's thesis. Myo had: shipping EMG hardware, a real SDK, a developer ecosystem, and Amazon backing. **Sales ended October 2018; all software support and SDKs discontinued.** Thalmic pivoted to North (smart glasses) → **acquired by Google 2020.** The gesture-input business was abandoned by the team that best understood it. *The SDK/developer-ecosystem strategy did not save it.*

**Neurable's first act (2017–2019) — the direct middleware precedent.** Neurable launched as a company that **licensed a BCI SDK to content developers and headset OEMs** for mind-controlled VR. That is Manifest's model, tried in 2017 by a better-funded team. They abandoned it in 2019 ("move beyond VR applications"), raised a $6M Series A, and became a **hardware** company. Only in **April 2026** — after $69M raised and a shipping $499 product — did CEO Ramses Alcaide return to licensing: *"Let's make this as ubiquitous as heart rate sensors on your wrist."* **The lesson is sequencing: middleware was the thing they had to earn with hardware, not the thing they could start with.**

**Intheon / NeuroPype.** The purest "biosignal middleware" company in existence — Python real-time biosignal pipeline engine plus NeuroScale cloud API, explicitly self-described as a *"neurotechnology middleware platform."* Formerly Qusp/Syntrogi. **Effectively bootstrapped, one investor, no meaningful venture funding in ~a decade.** Not dead, but a decade of evidence that pure biosignal middleware does not attract capital or compound into a business.

**Naxon Labs.** Independent EEG software platform → **absorbed into ZirconTech, Jan 2, 2025.** Another software-layer play that ended as a division of a services firm.

**AlterEgo.** MIT Media Lab project (2018) → spun out early 2025, unveiled Sept 8, 2025. Silent-speech neuromuscular sensing at face/throat. **Funding, headcount, and ship date all undisclosed — UNVERIFIED.** COO Max Newlon was formerly US president of BrainCo. Treat as a well-credentialed unknown, not a proven competitor.

---

## THE KEY QUESTION: is the runtime/middleware layer vacant?

**No. It is the opposite of vacant — it is a position everyone converges on and nobody has monetized as a startup.**

Four distinct forces occupy it:

1. **Apple owns it at the OS layer, for free.** BCI HID protocol announced May 13, 2025; first public demo Aug 4, 2025 (Synchron Stentrode → iPad, participant with ALS navigating home screen, opening apps, composing text). It routes through **Switch Control**, the accessibility input abstraction Apple has shipped for over a decade. Apple also ships **free on-device Eye Tracking** (iOS 18, front camera, no extra hardware, A17 Pro+) and, as of 2025, **free Head Tracking via the front camera**.

   **Read that last sentence against Manifest's working demo.** Manifest's MediaPipe nose-yaw webcam gaze proxy is a from-scratch reimplementation of a feature Apple ships free, on-device, OS-wide, calibrated, and privacy-audited, on hundreds of millions of devices. It is a good engineering exercise. It is not a differentiator, and in an accessibility pitch a knowledgeable investor will know this.

2. **Hardware companies are colonizing it from below.** Wearable Devices' Mudra Experience Studio (2025), Neurable's OEM licensing platform (2026), Pison's OEM/ODM gesture stack licensing (2025). All three are hardware companies adding the abstraction layer as an *upsell on an installed base they already own.*

3. **Meta is defining it by publication.** A generic cross-user sEMG decoder in Nature plus open datasets sets the technical reference point for what "the input layer" means. Whoever ships the standard vocabulary at 10M+ device scale defines the abstraction, and that is currently Meta.

4. **The independent attempts are Intheon (bootstrapped, ~10 years, invisible) and Naxon (absorbed).** No venture-scale outcome exists.

**Why it keeps failing, structurally:** a runtime that abstracts over acquisition hardware has no proprietary data, no distribution, and no pricing power. Its value accrues to whoever owns the sensor or the OS. Both ends of that sandwich are occupied by trillion-dollar companies and by Meta.

---

## Manifest's specific exposure: the Emotiv license

From the **Emotiv Developer License Agreement** (primary source, fetched):

> "You may not take any actions that may cause or result in the fragmentation of the API, including but not limited to distributing, participating in the creation of, or promoting in any way a software development kit derived from the API."

> You may not "access the API in order to build a competitive product or service or to monitor the availability, performance or functionality of the API."

Additional terms: free tier is **3 License Seats** for non-commercial orgs; **commercial organizations get 1 seat, internal use only**; distributing third-party software outside your org requires a separate **Distribution License Agreement**; raw EEG / high-resolution metrics require a **paid Premium API license** plus an EmotivPRO license (Standard $89/mo, Team $224.08/mo). Hardware: **EPOC X $1,199**.

A widely-repeated secondary claim is a **20% royalty on commercial applications past 1,000 users or $250,000 annual revenue.** **I could NOT verify this in the license document** — the actual fee schedule in Exhibit A is an unpopulated placeholder (`[Insert amount and calculation of the API License Fee below]`). Treat the 20% figure as unconfirmed but plausible, and *ask Emotiv directly before it appears in any pitch or model.*

---

## What I could NOT verify

- **Emotiv's 20% royalty / 1,000-user / $250K thresholds** — secondary sources only; the primary license has a blank fee exhibit.
- **Pison's total funding to date and headcount** — Crunchbase returned HTTP 403.
- **Cognixion total funding** — sources conflict badly (~$29M vs $42.5M). Do not cite either.
- **InteraXon's $60M (Oct 2025)** — amount reported, but **round type, lead investor, and equity-vs-debt all unconfirmed.** No revenue disclosed; the announcement leaned on "6 million hours of meditation," which is an engagement vanity metric.
- **Wisear acquisition price** — undisclosed.
- **AlterEgo's funding, headcount, ship date** — company explicitly declines to disclose.
- **IDUN Series A** — was *planned* for 2025; no completion evidence found.
- **Naqi Logix shipping status and final consumer price** — no confirmed ship date; ~$1,195 is speculation.
- **Kernel's current headcount and "Kernel Home March 2026" launch** — sourced to Grokipedia, which I do not consider reliable. Unconfirmed.
- **Openwater's current status** — insufficient recent coverage found; I did not confirm whether it is active.
- **NextMind post-acquisition** — I found no evidence of any shipped Snap BCI product, but absence of evidence in public press is weak evidence of absence inside Snap Lab.
- **Whether Manifest's specific architecture would actually breach Emotiv's anti-fragmentation clause** — that is a legal question requiring counsel, not a research finding.

---

## SO WHAT FOR MANIFEST

**1. Kill the "vacant runtime layer" claim before an investor kills it for you.** Apple shipped BCI HID in May 2025 and demoed it with Synchron in August 2025; Wearable Devices announced a near-verbatim "gesture fragmentation / single codebase / OEM integration" platform in 2025; Neurable and Pison both launched OEM licensing in 2025–26. If the Z Fellows application says or implies the layer is empty, it is factually wrong and checkable in one search. Reframe as: *"the layer is being built by hardware vendors for their own hardware and by Apple for its own OS — nobody is building it cross-vendor for the accessibility user who owns none of that hardware."* That claim is narrower, defensible, and still interesting.

**2. Do not build your own EMG model. That plan is now dominated.** Meta published a *generic, calibration-free* cross-user sEMG decoder in Nature (July 2025) with 100-participant open data plus the 346-hour/108-user emg2qwerty set. Two students cannot beat that on data volume or model quality, and the CC-BY-NC-SA license blocks you from shipping on their corpus anyway. The honest framing is that your differentiation cannot be *the decoder*. It has to be everything above the decoder: arbitration between modalities, dwell/cooldown/confidence policy, honest low-confidence states, and the fixed five-command vocabulary. Say that explicitly rather than promising a model you won't win.

**3. The webcam nose-yaw demo is a liability in an accessibility pitch, not an asset.** Apple ships free on-device Eye Tracking (iOS 18) and free Head Tracking (2025) using the same front camera. Anyone in accessibility knows this. Either (a) demonstrate a specific measurable advantage over Apple's built-in — different failure modes, works on non-Apple hardware, works for users Apple's calibration excludes — with numbers, or (b) demote it from "working product" to "modality-agnostic proof that our runtime accepts an arbitrary signal source." (b) is honest and actually supports the thesis better.

**4. Resolve the Emotiv license question this week, before the application goes out.** The anti-fragmentation clause ("may not... participate in the creation of, or promote in any way a software development kit derived from the API") and the anti-competitive-product clause plausibly cover a runtime that abstracts Cortex behind your own API. Also: commercial orgs get **one** internal seat; any external distribution needs a separate Distribution License Agreement. You are currently building a demo that, if it succeeds commercially, may need permission from a vendor whose classifier you are trying to displace. Get that in writing or design the Emotiv path as explicitly throwaway.

**5. Study Cognixion's business model, not its technology.** $23M–$42.5M raised, FDA Breakthrough Device Designation, **and CMS accreditation as a DME provider.** In accessibility, reimbursement *is* the go-to-market — it is why AAC devices sell at all. A consumer-priced, non-reimbursed accessibility input product is fighting a free OS feature on one side and a reimbursed clinical device on the other. Have an answer for who pays. Also prepare a real answer for why Cognixion chose SSVEP and you rejected it — "seizure risk" is correct but incomplete when the best-funded competitor is running a pivotal FDA trial on it.

**6. Treat the graveyard as your strongest honest asset.** Myo died in 2018 *with* an SDK and a developer ecosystem. NextMind's best exit was ~$13M and immediate product discontinuation. Wisear — your closest functional twin — was absorbed by Naqi in January 2026. Neurable tried middleware-first in 2017, abandoned it, and only earned the right to license after $69M and shipping hardware. Intheon has been the pure middleware play for a decade and is bootstrapped. A pitch that says *"here is why five specific companies failed at this and what we do differently"* is far more credible from two students than a TAM slide — and unlike a TAM slide, it is all verifiable.

---

## Sources

**Primary documents fetched**
- [Wearable Devices FY2025 results — GlobeNewswire, 2026-03-12](https://www.globenewswire.com/news-release/2026/03/12/3254706/0/en/Wearable-Devices-Reports-Full-Year-2025-Financial-Results-Highlights-Revenue-Growth-24-4-Million-Raised-in-2025-and-18-4-Million-Cash-Position.html)
- [Emotiv Developer License Agreement](https://id.emotiv.com/eoidc/privacy/doc/developer-license/)
- [TechCrunch — Neurable licensing strategy, 2026-04-28](https://techcrunch.com/2026/04/28/bci-startup-neurable-looks-to-license-its-mind-reading-tech-for-consumer-wearables/)
- [Signalbase — Interaxon $60M, 2025-10-18](https://www.trysignalbase.com/news/funding/interaxon-inc-raises-60-million-for-neurotechnology-advancement)

**Meta / CTRL-labs**
- [Meta Ray-Ban Display + EMG wristband — about.fb.com, 2025-09](https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/)
- [facebookresearch/generic-neuromotor-interface (GitHub)](https://github.com/facebookresearch/generic-neuromotor-interface)
- [facebookresearch/emg2qwerty (GitHub)](https://github.com/facebookresearch/emg2qwerty) · [arXiv 2410.20081](https://arxiv.org/html/2410.20081v3)
- [Engadget — Meta EMG wristband beyond AR glasses](https://www.engadget.com/wearables/metas-emg-wristband-is-moving-beyond-its-ar-glasses-120000503.html)

**Apple as the input layer**
- [Apple Newsroom — accessibility incl. Eye Tracking, 2024-05](https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/)
- [Synchron — first BCI HID native integration, 2025-05-13](https://www.businesswire.com/news/home/20250513927084/en/Synchron-To-Achieve-First-Native-Brain-Computer-Interface-Integration-with-iPhone-iPad-and-Apple-Vision-Pro)
- [Synchron — first thought-controlled iPad demo, 2025-08-04](https://www.businesswire.com/news/home/20250804537175/en/Synchron-Debuts-First-Thought-Controlled-iPad-Experience-Using-Apples-New-BCI-Human-Interface-Device-Protocol)
- [Apple Support — Switch Control](https://support.apple.com/guide/iphone/select-items-perform-actions-and-more-iph8de250c54/ios)

**The graveyard**
- [Stephen Lake — "Ending Sales of Myo," Oct 2018](https://medium.com/@srlake/ending-sales-of-myo-preparing-for-the-future-281af9bbcac2) · [Engadget](https://www.engadget.com/2018-10-13-thalmic-stops-myo-gesture-armband-sales.html) · [VentureBeat](https://venturebeat.com/mobile/amazon-backed-wearables-company-thalmic-labs-kills-its-myo-armband-teases-new-product)
- [Road to VR — Snap acquires NextMind, 2022-03](https://roadtovr.com/snap-bci-next-mind-acquisition/) · [Snap AR — Welcome NextMind](https://ar.snap.com/welcome-nextmind)
- [audioXpress — Naqi Logix closes Wisear acquisition, Jan 2026](https://audioxpress.com/news/neural-interface-earbuds-naqi-logix-closes-acquisition-of-wisear)
- [Intheon (NeuroPype middleware)](https://www.intheon.io/) · [Crunchbase](https://www.crunchbase.com/organization/intheon)
- [ZirconTech welcomes Naxon Labs, 2025-01-02](https://zircon.tech/blog/zircontech-welcomes-naxon-labs-advancing-neurotechnology-and-ai-innovation/)
- [Forbes — Neurable $6M Series A to leave VR, 2019-12](https://www.forbes.com/sites/solrogers/2019/12/17/exclusive-neurable-raises-series-a-to-build-an-everyday-brain-computer-interface/)

**Companies**
- [Neurable MW75 Neuro LT ($499)](https://www.neurable.com/products/mw75neurolt)
- [Finsmes — Pison / Samsung Ventures, 2025-01](https://www.finsmes.com/2025/01/pison-receives-investment-from-samsung-ventures/) · [Pison + STMicro + Timex, 2025-01-14](https://www.businesswire.com/news/home/20250114245454/en/Pison-and-STMicroelectronics-Announce-Timex-as-Neural-Sensor-Partner-Ushering-a-New-Era-of-Neurocognitive-Wearables)
- [Cognixion + Blackrock Neurotech Axon-R, 2025-05-12](https://www.cognixion.com/blog/2025/5/12/cxnnews) · [Forbes, 2025-03-12](https://www.forbes.com/sites/alexknapp/2025/03/12/this-startup-lets-paralyzed-people-use-computerswithout-a-chip-in-their-head/) · [MassDevice — Vision Pro study](https://www.massdevice.com/cognixion-study-bci-apple-vision-pro/)
- [OpenBCI Galea shop](https://shop.openbci.com/products/galea) · [Emotiv EPOC X pricing](https://www.emotiv.com/blog/emotiv-epoc-x-price-guide) · [Neurosity Crown](https://neurosity.co/crown) · [IDUN Guardian](https://iduntechnologies.com/idun-guardian)
- [Kingscrowd — NAQI Logix on StartEngine 2025](https://kingscrowd.com/naqi-logix-on-startengine-2025/) · [NAQI on DealMaker 2026](https://kingscrowd.com/naqi-logix-on-dealmaker-securities-2026/)
- [Axios — AlterEgo silent speech, 2025-09-08](https://www.axios.com/2025/09/08/startup-query-ai-silent-speech-neural-interface) · [MIT Media Lab](https://www.media.mit.edu/articles/exclusive-startup-lets-you-query-ai-with-silent-speech/)
- [Kernel — Wikipedia](https://en.wikipedia.org/wiki/Kernel_(neurotechnology_company))


---

# Accessibility / AAC market reality and incumbents

I have enough primary material. Writing the brief.

---

# Accessibility / AAC Market Reality — Adversarial Research Brief
**Prepared for Manifest founder decision-making, 19 July 2026**

---

## 0. Bottom line up front

Accessibility/AAC is a **real market with real money in it, but it is almost certainly not a beachhead for Manifest as currently constituted.** The specific problems are not "it's small" (it's ~$1–2.5B globally and growing 25–34%/yr at the leader). The problems are structural and they land directly on Manifest's architecture:

1. **Medicare's SGD policy explicitly excludes exactly what Manifest is** — software on a general-purpose computer/tablet.
2. **The growth in AAC is in autism/touch-based language systems**, not in alternative access for severe motor impairment. Manifest's technology does nothing for the growing segment.
3. **The incumbent's moat is not eye-tracking technology — it is 400 insurance contracts and a funding-paperwork department.** Tobii Dynavox spends 3.6× more on selling than on R&D.
4. **Manifest's 5-command vocabulary is functionally a switch**, and switch access is a solved, commoditised, ~$100–4,300 category — not a $20,000 one.
5. **The eye-gaze abandonment premise appears to be wrong**, and it is the premise most likely to be in Manifest's pitch deck.

Details and sources below.

---

## 1. Market size: separate the credible from the invented

### 1.1 The market-research-firm TAMs are unusable

Five firms, same year (2025), same nominal market:

| Source | 2025 AAC devices market | Implied CAGR |
|---|---|---|
| Business Research Insights | $1.3B | 8.5% |
| The Business Research Company | $2.32B | 11.3% |
| Dataintelo / others | $3.1B | 9.6% |
| Congruence / makdata | $3.4B | ~7% |

**A 2.6× spread across a single defined year is not a measurement — it is five firms guessing.** None of these are primary sources; all are paywalled reports monetised by selling the number back to companies that want to cite it. Do not put any of them in a deck without the range attached.

### 1.2 The skeptical triangulation

Use the one audited number available. **Dynavox Group AB (publ), FY2025 (verified, primary — Year-End Report Q4 2025):**

- Revenue **SEK 2,467m** (~**$260M USD** at ~9.5 SEK/USD), +25% reported, **+34% currency-adjusted**, +32% organic
- Gross margin **68%**
- EBIT **SEK 254m**, margin **10.3%** (down from 11.6%)
- **US = 75% of consolidated revenue** → ~$195M US
- R&D expense SEK 245m; **Selling expenses SEK 877m**
- 1,010 FTEs; net debt SEK 909m

Tobii Dynavox is the undisputed global #1. If the AAC market were $3.4B, the clear leader would hold **7.6%** — implausible for a market that UK competition regulators found to be a near-duopoly. If the market is **$1.3B, TD holds ~20%** — consistent with the CMA's findings. **Treat $1.3–1.5B as the defensible global figure; treat anything above $2B as vendor inflation.**

### 1.3 The vendor TAM to be skeptical of

Tobii Dynavox's investor materials claim **~50 million people worldwide** unable to communicate without assistive devices, with only **~2% penetration** (~1M served). The RERC on AAC white paper (2019, academic, primary) gives **>5 million Americans and >97 million worldwide** who "would benefit from AAC."

**The skeptical read:** these numbers are real but they are a *benefit-from* population, not a *buy-a-device* population. The RERC breakdown makes this explicit — the bulk is autism (50–60% of 1-in-59 children), intellectual/developmental disability (55% of 6.5M), Down syndrome (80% of 400k), cerebral palsy (95% of 764k). **These people overwhelmingly need language systems and symbol vocabularies, delivered by touch. They do not need a biosignal access method.** The 97M number is doing enormous work in every AAC pitch deck and it is nearly irrelevant to Manifest.

---

## 2. Incumbents: who actually holds the market

### 2.1 Tobii Dynavox (Nasdaq Stockholm: DYVOX) — the leader

Financials above. Three things matter strategically:

**(a) It is a sales-and-service business wearing a technology costume.** Selling expenses SEK 877m vs R&D expense SEK 245m — **3.6:1**. The company reportedly holds **~400 insurance contracts**. The defensible asset is reimbursement plumbing, SLP relationships, reseller networks, and repair logistics — not the eye tracker.

**(b) The CEO tells you where the growth is.** From the Q4 2025 report: *"robust demand for our touch-controlled portfolio serving younger users with autism, complemented by encouraging traction in eye-gaze controlled solutions for individuals with more complex needs"* and *"the autism customer group continues to grow the fastest on a global basis."*

**Read this carefully. The fastest-growing segment is touch-based autism AAC. Eye-gaze/complex-needs is the slower, secondary line — and that is the only segment Manifest's technology addresses.**

**(c) They buy their eye trackers.** TD signed a "volume deal with Tobii AB of eye-tracking components." The access hardware is a purchased commodity input. Nobody is winning this market on access-sensor quality.

### 2.2 The UK CMA merger report — the single most valuable document in this brief

In 2019 the UK Competition and Markets Authority forced Tobii AB to **divest Smartbox** after finding a substantial lessening of competition. The Final Report is a regulator-verified, evidence-tested market study. Key findings:

- **Combined Tobii + Smartbox UK share: 60–70% by revenue.**
- Only significant UK suppliers identified: **Tobii, Smartbox, Liberator (PRC), Techcess/Jabbla.** That's it.
- **Market definition explicitly EXCLUDES "non-dedicated AAC solutions"** (iPad/Surface + AAC software). The CMA rejected Tobii's argument that tablets constrain the market, because:
  - *"estimated diversion from dedicated to non-dedicated solutions is low"*
  - *"The price of the Parties' dedicated AAC solutions has remained broadly constant over the past 3 years, which is difficult to reconcile with a proposition that the competitive constraint from non-dedicated AAC solutions is growing."*

**This is a natural experiment that has already been run against Manifest's thesis.** Consumer tablets running AAC software have been available for 15 years. They did not move dedicated-AAC prices. Regulators looked at the evidence and formally concluded they are not substitutes.

- **Geographic market = UK**, because *"UK customers only purchase dedicated AAC solutions from suppliers with a UK presence."* Local sales/support presence is a hard requirement per country.
- **Barriers to entry (paras 8.14–8.22):** a new entrant needs bespoke hardware; a reseller network (*"a small number of potential resellers... may be tied into long-term supplier relationships"* — standard Tobii reseller agreements run **3 years**, one reseller reported being *"restricted in its freedom to offer alternative AAC solutions"*); brand reputation; a repairs/service network; a language system (*"a highly specialised skill requiring deep understanding of language and grammatical conventions"*); and *"approval for NHS supply contracts."*
- **The killer quote — Tobii's own entry model (para 8.10):** *"Tobii submitted the results of an entry modelling analysis... In summary, Tobii submitted that the analysis showed that **entry is not profitable at prevailing prices**."*

The market leader, arguing *in its own commercial interest that barriers were low*, modelled de novo entry into AAC hardware and concluded it loses money.

### 2.3 PRC-Saltillo — #2 in the US

Employee-owned consortium (PRC, Saltillo, Liberator UK, PRD Germany, Liberator Australia). Founded 1966; PRC/Saltillo merger formalised 2019. Revenue **estimated $25–100M**, ~100–250 employees — *third-party estimate (IncFact/ZoomInfo), UNVERIFIED, no audited filings as it is private*. Strength is the **Unity/LAMP language system** — a 40-year-old proprietary vocabulary asset with entrenched SLP training pipelines. **This is a linguistics moat, not a hardware moat, and it is the thing Manifest is least equipped to replicate.**

### 2.4 Smartbox (UK) — #3, and a cautionary ownership tale

Grid 3 software; >10,000 users/yr; 30+ languages. Revenue **>£10M (2019)**. Ownership: bought by Tobii 2018 → **force-divested by CMA 2019** → CareTech Group Oct 2020 → grew 70→~270 staff → **acquired by Verdane (PE), Jan 2026**. *Verdane acquisition per PitchBook/Tracxn secondary sources — UNVERIFIED against a primary announcement.*

**Signal: this asset has changed hands three times in eight years and is now PE-owned. That is a consolidating, cash-flow-harvest market, not an innovation market.**

### 2.5 Control Bionics (ASX: CBL) — the most important comparable for Manifest

**This is the closest existing analog to Manifest's stated direction, and its numbers should be read as the realistic ceiling.**

- Incorporated **2005** — twenty-one years old.
- Product: **NeuroNode** — a wearable, wireless, non-invasive **EMG** switch. Literally "use your own neuroelectric signals from brain to muscle to control communication."
- FY25: sales revenue **>A$6M** (+15%), total revenue >A$7M, cash receipts A$5.7M.
- **Net loss FY25: −A$6.11M** (worse than FY24). Still unprofitable after 21 years.
- **Market cap ~A$21–25M** (Nov 2025). All-time high A$1.099 (Dec 2020) → **A$0.060 now. Down ~78% from listing-era peak; −94% from ATH.**
- Secured US Medicare HCPCS code **E2513** at **US$4,300/device** *(as reported by Stockhead; **UNVERIFIED** — I could not confirm E2513 in the CMS HCPCS database, and it does not appear in the standard E2500–E2512 SGD range. Verify before citing.)*

**A company that spent two decades building exactly the thing Manifest says it wants to build — an EMG access device with its own signal processing — reached A$6M revenue, permanent losses, and a A$21M market cap.** That is the base rate.

### 2.6 Cognixion — the well-funded direct competitor using the modality Manifest rejected

- **$25M raised** (Prime Movers Lab, Amazon Alexa Fund); **ALS Association invested 2025**.
- **FDA Breakthrough Device Designation** for Axon (granted 2023).
- Axon-R: AR headset + occipital EEG, decoding **SSVEP** — *"a natural brain reaction to an image flashing at regular intervals, perhaps 8 to 15 times per second."*
- Clinical trial in late-stage ALS launched Jan 2025, n=10, then planned n≤50.
- **Axon-R is explicitly NOT FDA-cleared as a medical device.**

**Two implications, both uncomfortable:**
- **Manifest rejected SSVEP on photosensitive-seizure and comfort grounds. A $25M-funded competitor with FDA Breakthrough status and ALS Association backing bet the company on it.** Manifest's rejection may be correct — 8–15 Hz is squarely in the photosensitive-epilepsy provocation band — but it means Manifest must be able to defend that call against a funded competitor who made the opposite one, with evidence, not assertion.
- Even with $25M, breakthrough designation, and a disease-charity investor, Cognixion is at n=10 trials and no clearance. **That is the cost and clock of doing this properly.**

---

## 3. How this is actually paid for — and why it is fatal to the current architecture

### 3.1 The Medicare SGD rules

SGDs are **Durable Medical Equipment** under SSA §1861. Code range **E2500–E2599** (E2500/2502/2504/2506 digitised by recording length; E2508 synthesised/spelling; E2510 synthesised/multiple access methods; E2599 accessories).

**Coverage requires, per patient:**
- Formal evaluation by a **speech-language pathologist** (communication impairment, why other modes won't work, rationale for the specific device, treatment/training plan)
- A **physician face-to-face encounter** prior to prescription (ACA requirement)
- **Written Order Prior to Delivery (WOPD)** — supplier holds audit liability
- **KX modifier** on the claim attesting all criteria met; claims without KX/GA/GZ are rejected outright
- Medicare pays **80%**; Medicaid may pick up the balance
- **5-year useful lifetime** — upgrades within it are statutorily non-covered
- Steve Gleason Act of 2015 removed capped-rental, permitting outright purchase (a genuine improvement, effective Oct 2015)

### 3.2 The two exclusions that disqualify Manifest as built

From ASHA's summary of Medicare SGD policy:

> The policy explicitly excludes **"personal computers, tablets or mobile devices that may be programmed to perform the same functions, but do not meet the definition of DME"** from coverage.

> Excluded features include those **"not related to functional speaking," such as gaming software**, and "video communications or conferencing software."

**Read those against the repo.** Manifest is (a) browser software running on a general-purpose laptop with a webcam, and (b) a shell whose three fully-built apps are **Movies, Snake, and Smart Room**. Under current Medicare policy that is not a covered SGD twice over — wrong device class, and the demo content is literally the named exclusion category.

This is not a fixable-later detail. **It determines whether the product can be sold through the only channel that pays for this category.** Tobii Dynavox's devices are locked-down dedicated units *precisely because of this rule* — that's why "unlocking" a TD device to run general software is a separate, funding-jeopardising transaction.

### 3.3 The procurement cycle for a new entrant

| Step | Reality |
|---|---|
| **HCPCS code** | Applications twice yearly (~Jan 1 / Jul 1 deadlines) via CMS **MEARIS**; preliminary decision → public meeting → final decision. *"It is extremely difficult to obtain a new HCPCS code, because CMS grants very few requests."* PDAC **code verification** against an existing code: ~65 days. |
| **DMEPOS supplier enrolment** | Form **CMS-855S** via National Provider Enrollment East/West contractors; **$50,000 surety bond per NPI**; accreditation moved from a **3-year to an ANNUAL cycle**. |
| **FDA** | SGDs are regulated devices. *I could not verify the exact product code/class — see §6.* Cognixion's path (Breakthrough Designation 2023 → trials 2025 → still uncleared 2026) is the observable timeline. |
| **Per patient** | SLP eval + physician F2F + WOPD + prior auth + KX modifier. |
| **Medicaid** | **State-by-state coverage rules.** Medicaid is always **payer of last resort** — must exhaust and be denied by private insurance first. |
| **Schools/IEP** | If AAC is written into an IEP, the district must provide it under FAPE and *cannot* delay pending other funding. **This is the fastest channel and it does not require a HCPCS code** — but it is ~14,000 separately-procuring US school districts, and it funds educational, not medical, devices. |
| **VA** | Not researched — see §6. |

**Realistic time-to-first-reimbursed-dollar for a new US entrant: 2–4 years and low-seven-figures of regulatory/quality/enrolment spend before a single covered claim.** For a two-person student team with a $10k Z Fellows check, this channel is not reachable on any plan currently in scope.

### 3.4 How small the Medicare pot actually is

2024 Medicare FFS Supplemental Improper Payment Data: SGD **improper payment rate 18.1%**, projected improper payment amount **$2.6M**.

**Derived (my arithmetic, flagged as such): $2.6M ÷ 0.181 ≈ $14.4M in total Medicare FFS SGD payments per year.** Caveat this — improper-payment sampling may not cover the full claim universe, and it excludes Medicare Advantage.

But directionally: **Medicare fee-for-service — the payer everyone in this category obsesses over — appears to spend on the order of $15M/year on speech-generating devices nationally.** Tobii Dynavox's ~$195M of US revenue therefore comes overwhelmingly from **Medicaid, private insurance, schools, and self-pay** — not Medicare. Anyone building a US AAC go-to-market around Medicare is optimising for the smallest payer in the mix.

### 3.5 Pricing anchors

- Tobii Dynavox **TD I-16**: ~**$20,000** new (user-reported); used units ~$3,500
- **TD Pilot** (eye-tracking iPad case): up to **~$10,000** excluding the iPad
- Control Bionics **NeuroNode** (EMG switch): **US$4,300** reimbursed

**Note the shape of that ladder. The full dedicated device is $20k. The EMG access switch alone is $4.3k. Manifest's product, if it works perfectly, is the $4.3k item — not the $20k one.**

---

## 4. Population sizing against a left/right/select/back/home vocabulary

### 4.1 What the vocabulary can and cannot do

Five commands cannot generate novel language directly. What five commands *can* do is drive **row-column scanning** — the established access method where a cursor sweeps rows, then columns, and the user selects. Scanning is real, standard, and reimbursed.

**But scanning is what users step DOWN to when eye gaze or touch fails.** It is slow (single-digit words per minute). It is served today by **mechanical switches costing $50–200** — buttons, head switches, sip-and-puff, proximity switches — billable as accessories.

**Therefore the honest competitive frame is not "Manifest vs. a $20,000 Tobii eye-gaze device." It is "Manifest vs. a $100 mechanical switch that never needs calibration, never fails in bad lighting, has no latency, and has thirty years of clinical familiarity."** Control Bionics has spent 21 years trying to win that comparison with EMG and has A$6M of revenue to show for it.

### 4.2 Prevalence, US (primary sources)

| Condition | US prevalence | AAC-relevant fraction |
|---|---|---|
| **ALS** | **~33,000 (2022)**, projected >36,000 by 2030 (CDC National ALS Registry); incidence 1.44/100k → ~5,000/yr | >95% unable to speak by death (RERC/Beukelman) |
| **Spinal cord injury** | **288,000** (NSCISC 2018, via RERC) | **>11% complete tetraplegia** → **~32,000** requiring AAC for speech/writing |
| **Cerebral palsy** | **>764,000** | 95% "would benefit from AAC" — but the overwhelming majority need language systems + touch/switch, not novel biosignal access |
| **Brainstem stroke** | not sized in sources | 100% require AAC initially; **75% lifelong** |
| **Aphasia (CVA)** | >1,000,000 | ~40% severe language impairment |
| **Locked-in syndrome** | **Prevalence unknown; "probably low"; incidence data not available** — flag this every time it appears in a deck |
| **Late-stage MS** | Not found — see §6 |

### 4.3 The number that actually matters

Ignore the 5M/97M. Use the **Sweden total-population survey (Borgestig et al., 2020, PMC7084643)** — a complete national census of everyone receiving an eye-gaze device through public assistive-technology centres:

> **418 individuals in the entire country of Sweden** (~10.3M population), across 21 county councils, 2017.

Diagnoses: **CP 45.6%, ALS 17%, Rett syndrome 13.5%.**

**Naive population scaling to the US (335M): ~13,600 alternative-access AAC users nationally.** *(My extrapolation, explicitly flagged. It likely over-states the US, since Sweden's universal public AT provision is more generous than US payer-gated provision.)*

At $15,000/device on a mandated 5-year replacement cycle, **~13,600 users implies roughly $40M/year of US alternative-access device revenue.** Even if that estimate is off by 3×, this is a **low-hundreds-of-millions global segment, tens of thousands of users** — and Manifest would be competing for a slice of it against four entrenched vendors, one of which has 1,010 employees and 400 insurance contracts.

**A 5-command vocabulary is realistically addressable to a subset of that ~13,600: those who cannot use touch, cannot use reliable eye gaze, and retain reliable voluntary control of some muscle or gaze proxy. Order of magnitude: low thousands of people in the US.**

---

## 5. Abandonment: the premise is probably wrong, and it matters

This is the finding most likely to embarrass Manifest in a room with someone who knows the field.

**What the evidence actually says:**

**(a) The "one third abandon" statistic is from 1993, is about assistive technology generally, and is mostly mobility aids.** Phillips & Zhao, *Assistive Technology* 5(1):36–45, 1993: n=227 adults, **29.3% of all devices completely abandoned**. Four significant predictors: lack of consideration of user opinion in selection, easy device procurement, poor device performance, change in user needs. **"Mobility aids were more frequently abandoned than other categories."** Abandonment peaked in year 1 and after year 5.

**(b) Eye gaze specifically shows the opposite.** Sweden total-population survey:
- **63% use daily**
- **33% use weekly**
- **Only 4% (7 of 171) seldom or never**
- Authors' conclusion: *"no indications of over-prescription"* and that the technology addressed genuine communication needs **"rather than cases of abandonment."**

**(c) The ALS eye-gaze literature is similar.** In the ERICA study (n=15, people with ALS), **14 of 15 used it as their primary communication device**; the one discontinuation was caused by **onset of impaired eyelid control**, i.e. disease progression, not device failure.

**Where the real, defensible complaint lives — and it is narrower than "abandonment":**
- **42% of Swedish users found the device "totally or quite effortful to use."**
- **Only 31% of parents of child users** agreed the device's use matched their activity needs (vs 59% for adults). **Child/CP users are systematically under-served.**
- Satisfaction with county-council *services* (assessment, training, follow-up) was notably lower than with the devices themselves.
- RERC on AAC: many users *"are unable to access and use current AAC technologies effectively due to lack of fit with their motor impairments"* and *"struggle due to the substantial learning demands."*

**Translation: the pain is effort, calibration burden, poor fit for CP/child motor profiles, and bad service — NOT that people are throwing eye trackers in a drawer.** If Manifest's pitch says "eye gaze has high abandonment rates, we fix that," it is citing a 1993 mobility-aid statistic against a modality whose own literature shows 96% daily-or-weekly use. Someone will catch it.

---

## 6. What I could NOT verify

- **CMS LCD L33739 / Policy Article A52469 full text.** cms.gov returned **HTTP 403** to automated fetch. All Medicare SGD criteria above are from ASHA's summary (authoritative professional body, but secondary). **Before any regulatory decision, read L33739 and A52469 directly in a browser.**
- **FDA product code and device class for speech-generating devices.** My attempt at 21 CFR 890.3710 returned 404; I did not locate the correct citation. Whether SGDs are Class I 510(k)-exempt or Class II is a *material* fact for Manifest and is unresolved here.
- **HCPCS E2513** (Control Bionics' claimed code at US$4,300). Reported by Stockhead; not confirmed in CMS sources; does not appear in the standard E2500–E2512 SGD range. **Verify.**
- **Total Medicare SGD annual spend.** The ~$14.4M figure is my arithmetic from the 18.1% improper-payment rate and $2.6M projected improper amount. **Not a published CMS total.** Excludes Medicare Advantage.
- **PRC-Saltillo revenue.** $25–100M is a data-broker estimate (IncFact/ZoomInfo). Private company, no audited filings. Treat as an order of magnitude only.
- **Smartbox → Verdane acquisition (Jan 2026).** From PitchBook/Tracxn profile text via search; no primary announcement retrieved.
- **VA (Veterans Affairs) AAC procurement.** Not researched. Given ALS's service-connected presumptive status, VA is likely a disproportionately important AAC channel and is a real gap in this brief.
- **Late-stage MS prevalence with complex communication needs.** No usable figure found.
- **US-specific eye-gaze user counts.** No US equivalent of the Swedish census exists in what I found; the ~13,600 figure is my scaling, not a measurement.
- **Whether any payer has ever covered a webcam-based (no dedicated hardware) access method.** I found no example. Absence of evidence, but notable absence.
- **CMA report redactions.** Smartbox's stated cost to develop dedicated AAC hardware was redacted as `£[✂]`, as was Tobii's entry-profitability threshold. The qualitative conclusions survive; the magnitudes do not.

---

## 7. SO WHAT FOR MANIFEST

**1. Accessibility is a sympathetic story attached to a market Manifest cannot currently sell into. Stop calling it the beachhead until the DME exclusion is answered.** Medicare SGD policy excludes *"personal computers, tablets or mobile devices"* and excludes *"gaming software."* Manifest is browser software on a laptop whose three shipped apps are Movies, Snake, and Smart Room. There is no version of the current architecture that a US payer reimburses. Either (a) commit to dedicated hardware + a 2–4 year regulatory path, (b) target schools/IEP where FAPE compels provision without a HCPCS code, or (c) stop leading with accessibility. Pick one before the Z Fellows application, because a partner who knows this category will ask.

**2. Kill the abandonment claim. It is the most likely factual error in the pitch and it is checkable in one search.** The Swedish national census shows **96% of eye-gaze users use the device daily or weekly** and the authors explicitly say the data shows *"no indications of over-prescription... rather than cases of abandonment."* The one-third statistic is Phillips & Zhao 1993, about assistive technology broadly, driven by mobility aids. **Replace it with the claim the evidence actually supports: 42% find eye gaze effortful, and only 31% of parents of child users say it meets their activity needs.** That's a narrower, truer, still-fundable wedge — *pediatric/CP fit and effort reduction* — and it is where Tobii Dynavox is visibly weakest.

**3. You are not competing with a $20,000 eye-gaze device. You are competing with a $100 mechanical switch, and the incumbent in your exact lane has 21 years and A$6M of revenue.** A left/right/select/back/home vocabulary is switch-scanning. Control Bionics built the EMG version of this, got a US reimbursement code at $4,300/unit, and is worth A$21M with A$6M in annual losses and a share price down ~94% from peak. **Before committing to "build our own EMG model," write down explicitly why Manifest's outcome differs from Control Bionics'. If the answer is "better ML," that is not an answer — CBL has real electrodes on real muscles and Manifest currently thresholds Emotiv's vendor classifier.**

**4. Your one genuinely working modality is now a free OS feature, and that is disqualifying for the accessibility pitch specifically.** Apple shipped **built-in Eye Tracking in iOS 18/iPadOS 18** (2024) — front camera, on-device ML, dwell control, calibrates in seconds, no accessories, free, on any iPad 10th-gen or later. Manifest's webcam nose-yaw proxy is a strictly weaker implementation of a feature Apple gives away. **Do not demo webcam gaze to an accessibility-literate investor as differentiated technology.** If webcam access stays in the product, it must be justified as a *free fallback tier*, never as the innovation.

**5. The market's growth is in the segment your technology does nothing for — and that is the strongest argument for changing markets, not for trying harder.** Tobii Dynavox grew 34% currency-adjusted in FY2025, and its CEO attributes the fastest growth to **"the autism customer group"** on **touch-controlled** devices. The money in AAC is flowing toward symbol vocabularies and language systems for children who can touch a screen. That is a linguistics and content business — PRC's Unity has a 40-year head start — and it needs zero biosignal innovation. **Manifest's technology is aimed at the slower-growing, smaller, harder half of a market whose growth is happening elsewhere.**

**6. The incumbent modelled your business and concluded it loses money — get a copy of the reasoning before you disagree with it.** Tobii's own entry analysis, submitted to the CMA while *arguing barriers were low*: *"entry is not profitable at prevailing prices."* The CMA separately found the tablet-substitution thesis empirically dead (low diversion, dedicated-AAC prices flat for 3 years), found local-presence requirements per country, and found resellers locked into 3-year exclusive-ish agreements. **Read paragraphs 8.5–8.22 of the CMA Final Report in full — it is a free, regulator-tested, adversarially-tested competitive analysis of exactly the market Manifest is proposing to enter, and it is more rigorous than anything a market-research firm will sell you.**

---

## Sources

**Primary — company filings**
- [Dynavox Group AB (publ), Year-End Report Q4 2025 (PDF)](https://mb.cision.com/Main/11919/4302974/3918411.pdf) — FY2025 revenue SEK 2,467m, GM 68%, EBIT 10.3%, US 75% of revenue, 1,010 FTEs. Published Jan/Feb 2026.
- [Dynavox Group press release index](https://dynavoxgroup.com/blogs/press-releases/dynavox-group-year-end-report-2025)
- [Tobii Dynavox Capital Markets Day presentation](https://www.tobii.com/contentassets/7a59302c8a8b4b728fd88a1f4789bd16/tobii-dynavox-capital-markets-day-presentation/?v=1.0) — 50M addressable / 2% penetration claim

**Primary — regulatory**
- [CMA, *Completed acquisition by Tobii AB of Smartbox Assistive Technologies Limited* — Final Report (PDF)](https://assets.publishing.service.gov.uk/media/5d5d165ded915d08d9cf7217/Final_Report_Tobii_Smartbox.pdf), 2019 — 60–70% combined UK share; market definition excluding non-dedicated solutions; barriers to entry §8; Tobii entry model ¶8.10
- [CMS — Enroll as a DMEPOS Supplier](https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/durable-medical-equipment-prosthetics-orthotics-supplies-dmepos) — CMS-855S, $50k surety bond
- [CMS — HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system/level-ii-coding-process) — MEARIS, biannual cycle
- [CMS — LCD L33739, Speech Generating Devices](https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?LCDId=33739) *(403 to automated fetch — read manually)*
- [CMS — Policy Article A52469, SGD](https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=52469) *(403 to automated fetch)*
- [CMS — Medicare Provider Compliance Tips: Speech Generating Devices](https://www.cms.gov/training-education/medicare-learning-networkr-mln/compliance/medicare-provider-compliance-tips/speech-generating-devices) — 18.1% improper payment rate, $2.6M projected (2024 data)

**Primary — clinical / epidemiological**
- [Borgestig et al., *Usability of Eye-Gaze Controlled Computers in Sweden: A Total Population Survey*, PMC7084643](https://pmc.ncbi.nlm.nih.gov/articles/PMC7084643/) — 418 national users; 63% daily / 33% weekly / 4% seldom-never; 42% effortful; CP 45.6%, ALS 17%, Rett 13.5%
- [RERC on AAC, *The Urgent Need for AAC Research, Technology Development, Training, and Services* (White Paper, 2019, PDF)](https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/e/136937/files/2015/08/RERC-on-AAC-2019-White-paper-on-AAC-needs.pdf) — 5M US / 97M worldwide; Table 1 prevalence by diagnosis; SCI 288,000 with >11% complete tetraplegia
- [CDC National ALS Registry — prevalence 2022–2030](https://www.cdc.gov/als/php/abstracts-publications-reports/prevalence-2022-2030.html) — ~33,000 (2022) → >36,000 (2030)
- [CDC National ALS Registry — incidence, all 50 states 2012–2019](https://www.cdc.gov/als/php/abstracts-publications-reports/50statesincidence.html) — 1.44/100,000
- [Phillips & Zhao, *Predictors of Assistive Technology Abandonment*, Assistive Technology 5(1):36–45, 1993](https://www.tandfonline.com/doi/abs/10.1080/10400435.1993.10132205) — 29.3% abandonment, n=227
- [*Eye-Gaze Access to AAC Technology for People with ALS* (ERICA study)](https://www.researchgate.net/publication/285932505_Eye-Gaze_Access_to_AAC_Technology_for_People_with_Amyotrophic_Lateral_Sclerosis) — 14/15 retained

**Secondary — reimbursement guidance**
- [ASHA — Medicare Coverage Policy on Speech-Generating Devices](https://www.asha.org/practice/reimbursement/medicare/sgd_policy/) — **the PC/tablet exclusion and gaming-software exclusion**; SLP eval; WOPD; Steve Gleason Act; 5-year lifetime
- [ASHA — Funding for Communication Services and Supports](https://www.asha.org/njc/funding-for-services/)
- [ASHA — AAC Practice Portal](https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/)
- [AAPC — HCPCS E2500–E2599](https://www.aapc.com/codes/hcpcs-codes-range/119)
- [Disability Rights PA — Augmentative Communication Device Funding for Children (PDF)](https://www.disabilityrightspa.org/wp-content/uploads/2017/10/AugCommunicationDevicesFundingForChildrenJan2018AT-9.pdf) — IEP/FAPE obligations
- [Undivided — How are AAC devices funded in California?](https://undivided.io/resources/how-are-aac-devices-funded-in-california-445) — Medicaid payer-of-last-resort
- [Medtrade — PDAC Code Verification and HCPCS Application Processes](https://medtrade.com/news/billing-reimbursement/pdac-code-verification-and-hcpcs-code-application-processes/) — ~65-day verification; "extremely difficult to obtain a new HCPCS code"

**Secondary — competitors**
- [Stockhead — Control Bionics FY25 quarterly wrap](https://stockhead.com.au/health/asx-health-quarterly-wrap-control-bionics-makes-15pc-sales-revenue-jump-in-fy25/) — >A$6M revenue, E2513 at US$4,300
- [StockAnalysis — Control Bionics (ASX:CBL) market cap](https://stockanalysis.com/quote/asx/CBL/market-cap/) — ~A$21M, Nov 2025
- [Cognixion — FDA Breakthrough Device Designation press release](https://www.prnewswire.com/news-releases/cognixion-receives-fda-breakthrough-device-designation-for-its-brain-computer-interface-with-augmented-reality-for-assistive-communication-301815743.html)
- [IEEE Spectrum — *Breakthrough Brain Tech Gives ALS Patients a Voice Again*](https://spectrum.ieee.org/als) — SSVEP mechanism, 8–15 Hz flicker
- [Forbes (Knapp, 12 Mar 2025) — Cognixion profile](https://www.forbes.com/sites/alexknapp/2025/03/12/this-startup-lets-paralyzed-people-use-computerswithout-a-chip-in-their-head/) — $25M raised
- [BioSpace — Cognixion late-stage ALS trial launch](https://www.biospace.com/press-releases/cognixion-launches-clinical-trial-for-late-stage-als-to-deliver-conversation-level-communication-with-adaptive-ai-driven-brain-computer-interface)
- [PRC-Saltillo merger announcement](https://www.prentrom.com/articles/prentke-romich-company-announces-merger?mode=view)
- [Shaw & Co — What happened after Smartbox was sold to CareTech](https://www.shawcorporatefinance.com/connected/what-happened-after-smartbox-was-sold-to-caretech) — >£10M revenue 2019, 70→270 staff
- [Tobii Dynavox US — TD I-Series](https://us.tobiidynavox.com/products/td-i-series) / [TD Pilot](https://us.tobiidynavox.com/products/td-pilot)

**Secondary — competitive threat**
- [Apple Support — Control iPad with the movement of your eyes](https://support.apple.com/guide/ipad/control-ipad-with-the-movement-of-your-eyes-ipad2cd35723/ipados)
- [AbilityNet — Eye tracking in iOS 18](https://mcmw.abilitynet.org.uk/how-to-control-your-device-using-eye-tracking-in-ios-18-on-your-iphone-or-ipad)
- [Spoken AAC — Apple's iOS 18 Launches With Built-In Eye Tracking for AAC Users](https://spokenaac.com/blog/apple-releases-eye-tracking-tech/)

**Market-size estimates (cited only to demonstrate their unreliability — do not use standalone)**
- [Business Research Insights — AAC Devices Market](https://www.businessresearchinsights.com/market-reports/augmentative-and-alternative-communication-aac-devices-market-121208) ($1.3B)
- [The Business Research Company — AAC Devices Global Market Report](https://www.thebusinessresearchcompany.com/report/augmentative-and-alternative-communication-aac-devices-global-market-report) ($2.32B)
- [Dataintelo — AAC Device Market Report](https://dataintelo.com/report/aac-device-market-report) (~$3.1B)


---

# Existing biosignal middleware and whether the layer is really empty

# Research Brief: Is the "Layer Above Acquisition" Actually Empty?

**Dimension:** Existing biosignal middleware and whether Manifest's claimed layer is unoccupied
**Date:** 2026-07-19
**Posture:** Adversarial. Facts that threaten the thesis are prioritized.

---

## Headline finding

**The layer is not empty, and the most dangerous occupant is not a middleware library — it is Apple.** In May 2025 Apple published a **BCI Human Interface Device (BCI HID) profile**, a public developer-documented HID descriptor that makes neural/biosignal input a **native input category** on iOS, iPadOS and visionOS, routed into Switch Control. It sits in Apple's accessibility Specifications section directly alongside the Braille HID reference. That is, definitionally, "the intent contract" — published, free, OS-level, and by the platform vendor.

A second occupant matters almost as much: **two vendors already ship a trained, user-calibratable intent API today.** Neurosity's Kinesis emits `{probability, label, timestamp, metric}` intent objects from user-trained motor-imagery classifiers. Emotiv's Cortex exposes a `com` (Mental Command) stream plus a full training API (`start`/`accept`/`reject`/`reset`/`erase`) with persistent per-user profiles — the exact "train your own commands" capability Manifest lists as its *future* differentiator.

The honest framing is not "nobody built this layer." It is "**several people built versions of this layer; none of them built a cross-vendor one, and the reason is mostly commercial, not technical.**"

---

## 1. The middleware landscape, layer by layer

| Project | Layer occupied | License | Maintenance health | Calibration? | Intent output? |
|---|---|---|---|---|---|
| **BrainFlow** | Acquisition + uniform device SDK | MIT | **Very healthy** — v5.22.2 (May 22), v5.22.1, v5.22.0 (May 10), v5.21.0 (Feb 28), v5.20.x (Jan) — 6 releases in ~5 months | No | No — filters/transforms/derived metrics only |
| **Lab Streaming Layer (liblsl)** | Transport + time-sync | MIT (liblsl) | **Very healthy** — v1.17.7 (2026-04-22), v1.18.0.b1/b2 betas (2026-06-20) | No | No — it is a *pipe*, deliberately semantics-free |
| **OpenViBE** | Full pipeline: acquisition→processing→classification→stimulus | Inria, AGPL-family (UNVERIFIED exact SPDX) | **Slowing** — v3.7.0, 2025-09-04; ~10 months since release as of today | Yes (per-session classifier training) | Partial — classifier outputs/stimulations, not a stable public intent API |
| **BCI2000** | Full pipeline, research-grade | **GPL** (commercial use explicitly permitted; source-disclosure required; alt commercial license sold) | Long-lived (since 2000, Wadsworth Center) — current release cadence UNVERIFIED | Yes | Partial — internal state/event bus, not an app-facing intent contract |
| **Timeflux** | Real-time graph processing (ZMQ/LSL/OSC) | Free/OSS (MIT-family, UNVERIFIED) | **Thin** — latest v0.17.2; year UNVERIFIED (GitHub relative dates). Small team | Via plugins (`timeflux_bci`) | No stable intent API |
| **NeuroPype / Intheon** | Commercial pipeline on top of LSL | **Proprietary**, tiered: free academic; low-cost "Startup Edition" for <$200K revenue/raised; commercial pricing on request | Actively commercial | Yes — motor imagery + custom paradigms | Closest commercial analogue; supports "active BCI control" |
| **MNE-Python** | **Offline** analysis | BSD-3 | Very healthy | N/A | No. `mne-realtime` is **deprecated**; `LSLClient` superseded by `mne_lsl.stream.StreamLSL` |
| **EEGLAB / Brainstorm** | **Offline** analysis (MATLAB) | GPL-family | Healthy | N/A | No |
| **Bonsai** | Reactive acquisition/control (visual, .NET Rx) | MIT | Healthy | No | No — general-purpose dataflow |
| **BciPy** | ERP spellers (RSVP, Matrix) | BSD-3 | **Stale tags** — latest GitHub *release* 2.0.0, 2021-08-25, though `main` is active | Yes | Speller-specific, not generic |
| **MindAffect** | Open-source noise-tagging BCI | OSS | Low activity | Yes | Paradigm-specific |
| **g.tec Unicorn Suite** | Turnkey commercial apps + APIs | Proprietary | Active | Yes | Ships finished apps (Speller, Painting) + Python/C/.NET/Unity/LSL APIs |

### The clean answer to "does any expose a stable high-level intent API?"

**Yes — three, and they are all vendor-locked:**

1. **Neurosity Kinesis** — `{ probability: 0.93, label: "rightArm", timestamp: 1569961321174, metric: "kinesis" }`. Motor-imagery based, spike detection over a predictions stream, custom training via console.neurosity.co. Locked to Neurosity Crown.
2. **Emotiv Cortex Mental Commands (`com`) + Facial Expressions (`fac`)** — with a real training API and profile persistence. Trainable facial expressions are exactly: `neutral`, `surprise`, `frown`, `smile`, `clench`. Locked to Emotiv hardware.
3. **Apple BCI HID** — cross-vendor by design, but Apple-platform-only and (currently) aimed at implanted/clinical devices via Synchron.

**No open, cross-vendor, hardware-agnostic intent API exists.** That gap is real. Whether it is valuable is the question in §4.

---

## 2. Standards work — the plug-in points Manifest should not try to replace

- **Apple BCI HID** (2025-05-13). Public developer reference: `developer.apple.com/documentation/accessibility/brain-computer-interface-hid-reference-for-connecting-to-apple-platforms`. Apple stated intent to release the standard to third-party developers. Synchron demoed the first thought-controlled iPad on 2025-08-04. Bidirectional — the device can receive screen-layout/UI context back to improve decoding.
- **Apple Switch Control** — the existing accessibility substrate BCI HID feeds into. Apps expose `UIAccessibilityCustomAction` arrays that surface in the Switch Control menu. Any external input source that emits scan/select semantics already drives every well-behaved iOS app.
- **Android AccessibilityService** — the equivalent injection point. **Google's Project Gameface uses precisely this**: MediaPipe Face Landmarker's 52 blendshapes → Android AccessibilityService cursor. Open-sourced, Google-maintained, on GitHub at `google/project-gameface`.
- **IEEE P2731** — Standard for a Unified Terminology for BCIs. Working group has produced a BCI glossary and *functional model*, and is scoping "required information stored in BCI files." Terminology and reporting, **not** a runtime API.
- **IEEE P2794** (in-vivo neural interface reporting), **P3766**, **P3706** — adjacent, none are runtime contracts.
- **BIDS-EEG** — file/dataset organization standard, adopted by EEGLAB, FieldTrip, MNE-Python, Brainstorm, SPM. Offline data layout, not runtime.
- **ISO/IEC JTC1 SC43** has a 2025 BCI technology standardization report — the literature consistently states the *lack* of interop standards is a recognized market barrier.
- **Switch scanning / AAC** — the "tiny command vocabulary" idea dates to **the 1960s**. Single-switch and two-switch scanning are mature, standardized AT practice. Manifest's left/right/select/back/home is a re-derivation of two-switch scanning with extra steps.

---

## 3. Prior art, including dead ends

- **CTRL-labs** — acquired by Facebook 2019, absorbed into Reality Labs. The sEMG intent-layer thesis was bought, not left on the table.
- **Meta Reality Labs sEMG** — Nature paper, **published 2025-07-23**. The threatening part: **cross-user generalization with no per-user calibration**, trained on thousands of participants. 20.9 wpm handwriting, 0.88 gestures/sec detection. Personalization adds up to 16% on handwriting. Meta **open-released 100+ hours of sEMG from 300+ participants**.
- **NeuroSky ThinkGear** — the original consumer "abstraction over raw signal" (attention/meditation eSense metrics). Still exists as a chip/licensing business; never became a platform.
- **Neurable** — pivoted away from the NeuroSelect SDK / NeuroInsight API developer-platform play toward its own product. (Pivot direction UNVERIFIED in detail.)
- **AxonOS** — surfaces in search as a self-published Medium series claiming a Rust BCI OS with HAL, <1ms jitter and FDA plans. By its own March 2026 post: **3,826 lines across 5 crates, maintained by one person**, no confirmed funding found. **Treat as noise, not a competitor** — but note it is evidence that "BCI OS" is an idea multiple people independently generate and few execute.
- **eViacam / Camera Mouse** — free, open-source webcam head-tracking mouse replacement, cross-platform, with dwell clicking. This has existed for well over a decade. Manifest's working feature (a) — MediaPipe nose-yaw with dwell + cooldown — is a reimplementation of an established free AT category.

---

## 4. The key question: unbuilt because hard, or because nobody wants it?

**Mostly the latter, with a hard technical core that Manifest is not currently positioned to attack.**

**Evidence it's "nobody wants it" (commercial, not technical):**
- Every hardware vendor with a viable classifier (Emotiv, Neurosity, g.tec) has a **negative incentive** to support a neutral intent layer — the classifier *is* the moat and the subscription hook. Emotiv gates raw EEG behind a paid Premium license on pro devices precisely to keep you at the abstraction layer they control.
- LSL has had 14 years and the entire academic community, and deliberately stayed semantics-free. That is a *choice*, repeatedly reaffirmed. The people best placed to add intent semantics declined.
- The addressable set of apps needing a custom intent API is small, because **the OS accessibility layers already solved app-side integration**. Switch Control and AccessibilityService mean you don't need apps to adopt anything.
- BciPy's stale release tags and OpenViBE's ~10-month gap suggest the research-platform category is not commercially energized.

**Evidence it's genuinely hard:**
- Cross-vendor calibration is the real problem, and it is a **data problem**, not an API-design problem. Meta needed thousands of participants to get calibration-free sEMG. That is the unbuilt hard thing — and it was just built, by Meta, for wrist sEMG.
- Session-to-session and cross-user non-stationarity in EEG is why per-user profiles (Emotiv, Neurosity) exist at all.

**Synthesis:** the API/schema work Manifest describes is a weekend of design, not a moat. The calibration work that would make it valuable requires data collection at a scale two students cannot reach, in a domain where the reference result was published a year ago by a company with unlimited resources — *and open-sourced*.

---

## 5. What I could NOT verify

- **Contents of Apple's BCI HID descriptor.** The developer.apple.com page is JS-rendered; WebFetch returned only the title. I confirmed the page **exists**, its exact URL, its placement in the accessibility Specifications section next to the Braille HID reference, and a search-index description ("an overview of the human interface device (HID) descriptor for interfacing between brain-computer interface (BCI) hardware devices and Apple devices"). **I did not read the actual usage tables or command vocabulary.** Manifest should read this page manually before making any claim about it — it is the single most decision-relevant document in this brief.
- **Whether BCI HID is open to arbitrary third-party hardware today,** or gated to partners. Press reporting says Apple "plans to release the software standard to third-party developers" — future tense, May 2025. Current status unknown.
- **Exact release years for Timeflux** (GitHub relative dates gave "Dec 4", "Feb 20" without years).
- **BrainFlow / OpenViBE contributor counts.** Only confirmed BrainFlow passed 1,000 stars in Aug 2023.
- **NeuroPype commercial pricing.** Free academic and sub-$200K "Startup Edition" tiers confirmed; dollar figures not published.
- **OpenViBE's exact SPDX license** (license page not fetched).
- **BCI2000's current release cadence / last release date.**
- **Neurosity's financial health.** The "$1M+ TTM revenue, tripled subscriptions" figures come from a **Wefunder crowdfunding page** — that is issuer-authored fundraising material, not audited. Skeptical read: treat as marketing.
- **Meta Nature paper primary text** — nature.com redirected to an auth wall. Figures above come from Meta's own blog (2025-07-23) and secondary coverage. Meta's blog is a **vendor source about its own result**; the 20.9 wpm / 0.88 gestures-per-sec numbers are the vendor's framing.
- **Neurable's exact pivot history.**
- Whether any of these projects has an unreleased intent-layer roadmap.

---

## 6. Sources

**Middleware — primary**
- BrainFlow releases — https://github.com/brainflow-dev/brainflow/releases (fetched 2026-07-19)
- BrainFlow project site — https://brainflow.org/ (fetched 2026-07-19)
- liblsl releases — https://github.com/sccn/liblsl/releases (fetched 2026-07-19)
- OpenViBE downloads — https://openvibe.inria.fr/downloads/ (fetched 2026-07-19; v3.7.0, 2025-09-04)
- Timeflux releases — https://github.com/timeflux/timeflux/releases (fetched 2026-07-19)
- BciPy releases — https://github.com/CAMBI-tech/BciPy/releases (fetched 2026-07-19)
- BCI2000 licensing — https://www.bci2000.org/mediawiki/index.php/BCI2000_Licensing (fetched 2026-07-19)
- mne-realtime — https://github.com/mne-tools/mne-realtime and https://mne.tools/mne-realtime/
- Bonsai — https://bonsai-rx.org/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC4389726/
- NeuroPype — https://www.neuropype.io/ ; https://www.intheon.io/buzz/48-neuropype-startup-edition-release
- g.tec Unicorn Suite — https://www.gtec.at/product/unicorn-suite/

**Intent APIs — primary**
- Neurosity Kinesis API — https://docs.neurosity.co/docs/api/kinesis/ (fetched 2026-07-19)
- Emotiv Cortex training API — https://emotiv.gitbook.io/cortex-api/bci/training (fetched 2026-07-19)
- Emotiv Cortex data subscription — https://emotiv.gitbook.io/cortex-api/data-subscription
- Emotiv Cortex getting started / licensing tiers — https://emotiv.gitbook.io/cortex-api

**Platform / accessibility standards**
- Apple BCI HID reference — https://developer.apple.com/documentation/accessibility/brain-computer-interface-hid-reference-for-connecting-to-apple-platforms (**title + existence confirmed only**)
- Apple accessibility specifications index — https://developer.apple.com/documentation/accessibility/specifications
- Apple Switch Control — https://developer.apple.com/documentation/accessibility/switch-control ; WWDC20-10019
- Android AccessibilityService — https://developer.android.com/reference/android/accessibilityservice/AccessibilityService
- Project Gameface (Android launch) — https://developers.googleblog.com/en/project-gameface-launches-on-android/ ; https://github.com/google/project-gameface
- Synchron × Apple BCI HID announcement, 2025-05-13 — https://www.businesswire.com/news/home/20250513927084/en/ (fetch timed out; corroborated via MassDevice, TechNewsWorld, Forbes 2025-05-15)
- Synchron thought-controlled iPad, 2025-08-04 — https://www.businesswire.com/news/home/20250804537175/en/ ; https://www.macrumors.com/2025/08/04/watch-brain-controlled-ipad/

**Standards bodies**
- IEEE P2731 — https://standards.ieee.org/ieee/2731/7383/ ; https://sagroups.ieee.org/2731/
- IEEE Neurotech standards roadmap — https://standards.ieee.org/industry-connections/activities/neurotechnologies-for-brain-machine-interfacing/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC8846370/
- ISO/IEC JTC1 BCI report 2025 — https://jtc1info.org/wp-content/uploads/2025/01/2025_BCI_Technology_Report.pdf
- BIDS-EEG / BIDS adoption — https://www.nature.com/articles/s41597-019-0105-7 ; https://pressrelease.brainproducts.com/bids/

**Competitive / prior art**
- Meta sEMG Nature publication, 2025-07-23 — https://www.meta.com/blog/reality-labs-surface-emg-research-nature-publication-ar-glasses-orion/ (vendor source); paper: *A generic non-invasive neuromotor interface for human-computer interaction*, Nature (paywalled, not fetched)
- Meta EMG gestures coverage — https://www.uploadvr.com/meta-semg-wristband-gestures-nature-paper/
- eViacam — https://eviacam.crea-si.com/ ; https://github.com/cmauri/eviacam
- Switch access scanning history — https://en.wikipedia.org/wiki/Switch_access_scanning
- NeuroSky ThinkGear — https://developer.neurosky.com/docs/doku.php?id=thinkgear_communications_protocol
- Neurosity crowdfunding claims — https://wefunder.com/neurosity (**issuer-authored**)
- AxonOS — https://medium.com/@AxonOS/ (**self-published, unverified**)

---

## SO WHAT FOR MANIFEST

**1. Read Apple's BCI HID page before you write another line of positioning.** Apple published the intent contract you say you're going to invent, in the accessibility category you're targeting, with bidirectional UI-context feedback that is architecturally *better* than a one-way intent event. If a Z Fellows partner searches "BCI intent standard" they find Apple's developer doc in under a minute. You need an answer to "why doesn't Apple's BCI HID make you redundant?" and "we're cross-platform" is weak, because Google already ships Project Gameface on Android.

**2. Your one working differentiated feature is a reimplementation of free software.** MediaPipe nose-yaw + dwell + cooldown driving a carousel is what eViacam has done since roughly 2008 and what Google's Project Gameface — MediaPipe blendshapes into Android AccessibilityService, open source, Google-maintained — does today. Stop describing the webcam gaze proxy as evidence of technical differentiation. It is evidence you can ship, which is a different and lesser claim.

**3. "Build our own EMG model with our own training data" is now the weakest item on your roadmap, not the strongest.** Meta published calibration-free cross-user sEMG in Nature (2025-07-23) trained on thousands of participants, and open-released 100+ hours from 300+ participants. Two students collecting their own data will produce a per-user-calibrated model that is strictly worse than what Emotiv already gives you for free, against a public reference result that is calibration-free. If you pursue this, the only defensible version is *fine-tuning on Meta's released dataset for a specific disability population Meta did not sample* — and you should say that explicitly or drop the plan.

**4. The genuinely empty slot is narrow: an open, cross-vendor intent bus with honest confidence semantics.** LSL deliberately refuses semantics; BrainFlow stops at filtered signal; Emotiv and Neurosity both ship intent APIs but only for their own hardware and with a commercial incentive never to interoperate. Nobody sits between them. That is real. But it is a *standards/adapter* business, and standards businesses monetize badly — ask why LSL, with 14 years and the whole field, is still an MIT-licensed pipe. If you claim this slot, you must answer "who pays, and why won't Apple's HID profile eat it?"

**5. Your honest-labeling discipline is a more defensible wedge than the intent layer.** None of BrainFlow, LSL, Emotiv, or Neurosity exposes calibrated uncertainty, false-activation rate, or a principled low-confidence state. Neurosity returns a bare `probability` with no calibration guarantee; Emotiv returns a proprietary score. Your SIMULATED/REPLAY rule and refusal to fabricate confidence is an actual gap in every product listed above, it is cheap to build, and it maps directly to accessibility procurement where false activations are the dominant failure mode. This is a better story than "OS for the brain."

**6. Do not repeat the failed EEG study as a footnote — lead with it, then explain the pivot.** Your motor-imagery result (0.563 balanced accuracy on EPOC-X, 0.583 full-channel, vs 0.711 on a known-good public control) is a clean, credible negative result that demonstrates you can distinguish a working pipeline from a broken one. In a field this saturated with overclaiming, a founder who publishes their own null result is differentiated. But it also means your entire working stack sits on top of vendor classifiers (Emotiv `fac`) and Google's face model — say that plainly, because any technical diligence will find it in an afternoon and it is far worse if they find it themselves.


---

# Own EMG model + training data: what it actually takes

# Own EMG Model + Training Data: What It Actually Takes

**Research date:** 19 July 2026 | **Posture:** adversarial. Facts that threaten the thesis are foregrounded.

---

## TL;DR — the headline finding

**The blocking problem is not the model. It is the hardware, and it is not fixable in software.**

The EPOC-X physically cannot record surface EMG. Emotiv's own manual gives a hardware bandwidth of **0.2–45 Hz** (product page: 0.16–43 Hz) at 128/256 SPS. Surface EMG occupies **10–500 Hz** and the SENIAM/ISEK standard requires ≥1000 Hz sampling with a 10–500 Hz amplifier band. The EPOC-X discards roughly 90% of the EMG spectrum in *analog hardware and fixed digital filtering before the data ever reaches you*.

Consequently:
1. **You cannot train a facial-EMG model on EPOC-X data.** There is no EMG in it — only a low-frequency spillover envelope.
2. **Emotiv's `fac` classifier is not an EMG classifier either.** It is a low-band artifact classifier. It works because frontalis EMG peaks at 20–30 Hz and is detectable down to ~8–12 Hz even at 15% contraction — the tail that survives the 45 Hz wall. Temporalis (jaw clench) peaks at 40–80 Hz, i.e. *mostly above the cutoff*. Your clench detection is riding the bottom fringe of the muscle's power spectrum.
3. **"Build our own EMG model" is therefore a hardware pivot, not an ML project.** It means leaving the EPOC-X. Say that out loud before you say it to an investor.

Second finding, nearly as sharp: **Emotiv's EULA on its face prohibits both what you are doing now and what you plan to do next** — §4.5(c) bars commercial use, §4.5(k) bars building a competitive product. Details below.

---

## 1. Hardware: the EPOC-X is the wrong instrument

| Spec | EPOC-X | sEMG requirement |
|---|---|---|
| Bandwidth | **0.2–45 Hz** (manual); 0.16–43 Hz (product page) | **10–500 Hz** (SENIAM/ISEK) |
| Sampling | 128 / 256 SPS (2048 Hz internal, downsampled) | **≥1000 Hz** (Nyquist on ~450–500 Hz content) |
| Electrodes | 14 saline felt pads at 10-20 EEG scalp sites (AF3, F7, F3, FC5, T7, P7, O1, O2, P8, T8, FC6, F4, F8, AF4) | Bipolar pairs **placed on the target facial muscles**, ~20 mm IED |
| Filtering | Fixed 5th-order Sinc + 50/60 Hz notch, AC coupled | User-controlled band |

The montage problem is independent of the bandwidth problem. **Zero EPOC-X electrodes sit on a facial muscle.** Every published facial-EMG result places electrodes on frontalis, corrugator, zygomaticus, masseter, temporalis, levator labii, etc. AF3/AF4 are prefrontal *scalp* sites that pick up frontalis by volume conduction. You are recording a distant, attenuated, mixed projection of the muscles you care about.

**Skeptical read on the `fac` stream:** Emotiv states plainly that facial expressions are "detected from muscle noise." They call it Smart Artifacts. It is a competent commercial hack on a badly-suited sensor — which is exactly why it is unreliable enough that you want to replace it. But you cannot replace it *with the same sensor and do better in a principled way*, because the information you'd need was filtered out upstream.

Also relevant: Cortex exposes `facialExpressionSignatureType` with `universal` (no training, default) and `trained` (per-user profile, supports neutral/surprise/frown/smile/clench). **If you have not been using the `trained` signature, you have not yet exhausted the vendor's own personalization** — that is a days-not-months experiment and it should be run before any dataset collection is budgeted.

---

## 2. Emotiv ToS: you are probably already in breach

**Source: EMOTIV End User License Agreement, last updated 17 May 2024.**

§4.5 — "You will not: … (c) use the Software for commercial purposes; … (i) copy the Software or any part, feature, function or user interface thereof; … (k) **access the Software in order to build a competitive product or service** or to monitor the Software's availability, performance or functionality, or for any other benchmarking or competitive purposes; or (l) reverse engineer the Software."

§5.1 — "EMOTIV obtains no ownership interest from You under this EULA in or to End User Data."

The deprecated Developer/API License Agreement carries the same clause at §10.2(g), verbatim.

**The blunt reading:**
- **Data ownership is fine.** §5.1 is clear: your recordings are yours. There is no clause anywhere in either agreement that specifically restricts training ML models on End User Data. That is the good news and it is real.
- **Everything around it is not fine.** Manifest is a startup applying for funding — §4.5(c) "commercial purposes" is a problem *today*, not later. And §4.5(k) is aimed almost precisely at your stated plan: using Emotiv's stack to build a gesture classifier that replaces Emotiv's gesture classifier. A hostile lawyer does not have to work hard here.
- **Nuance in your favour:** "Software" is defined as EMOTIV software licensed via mobile app, website, or desktop download — arguably the EmotivPRO/launcher stack, not the headset hardware. And §4.5(k) prohibits *accessing the Software* to build a competitor, not *using data you own*. If you record via Cortex and train offline on your own data, there is daylight. It is daylight, not a doorway.
- **Practical consequence:** the hardware pivot forced by Section 1 *also solves this*. Off Emotiv hardware, the EULA is irrelevant. These two problems have one shared answer, which is the most useful thing in this brief.

⚠️ **UNVERIFIED:** The Developer License Agreement is labelled "(deprecated)" and I could not find what replaced it or when. If Emotiv's current Cortex developer terms drop or keep the competitive clause, that materially changes exposure. **Get the current agreement text you actually clicked through when registering your App ID before relying on any of the above.**

---

## 3. Datasets: there is no facial-EMG dataset to bootstrap from

Every large public sEMG dataset is **forearm/wrist**. None of it transfers to face — different muscles, different electrode geometry, different crosstalk structure.

| Dataset | Subjects | Scale | Site | Licence | Usable for facial? |
|---|---|---|---|---|---|
| **emg2qwerty** (Meta, NeurIPS 2024) | 108 | 346 h, 1,135 sessions, 5.2M keystrokes | Wrist | **CC-BY-NC-SA 4.0** | No |
| **emg2pose** (Meta, NeurIPS 2024) | 193 | 370 h, 80M pose labels, 16 ch @ 2 kHz | Wrist | **CC-BY-NC-SA 4.0** | No |
| **EMG-EPN-612** | **612** | 50 reps × 6 gestures, Myo 8 ch @ 200 Hz | Forearm | Zenodo, open | No |
| **Ninapro** (DB1–DB10) | 27–67/DB | up to 52 gestures | Forearm | registration required ⚠️ | No |
| **putEMG** | 44 | 8 gestures, 24 ch | Forearm | open | No |
| **FORS-EMG** | 19 | 3 forearm orientations | Forearm | open | No |
| **Facial EMG gesture dataset** | — | **none found** | — | — | — |

Two hard implications:

**(a) The Meta datasets are NC-licensed.** CC-BY-NC-SA 4.0 means a commercial product cannot ship a model trained on them, and ShareAlike means derivatives inherit the licence. For a company, emg2qwerty and emg2pose are *literature*, not *assets*. Do not put them on a slide as a data advantage.

**(b) You would be building the first public facial-EMG gesture dataset at scale.** That is genuinely a defensible asset — it is also the reason this is expensive. Nobody has done it because it is hard, not because nobody thought of it.

---

## 4. State of the art in facial EMG — and why the headline numbers mislead

**Best comparable: Cha et al., *Biomedical Engineering Letters*, 2023** — fEMG facial-gesture recognition for AR/VR, framed explicitly as assistive technology. Closest published analogue to Manifest's goal.

- 15 subjects (12M/3F, 25.4 ± 2.75 yr)
- **10 monopolar electrodes** on an HMD-mimicking frame: 2 above each eyebrow (frontalis, corrugator), 3 below each eye (levator labii, zygomaticus, masseter)
- **2,048 Hz**, 20–450 Hz 4th-order Butterworth, 58–62 Hz notch
- 16 gestures; 10 reps each = 160 trials/subject; 300 ms windows, 50 ms overlap
- LDA + Riemannian geometry features

| Classes | Subject-dependent | Subject-independent (LOSO) |
|---|---|---|
| 3 | 99.36% | **96.08%** |
| 5 | 98.36% | **95.38%** |
| 8 | 97.17% | 89.98% |
| 15 | 90.41% | 73.37% |

**Read this optimistically and you conclude: 15 subjects, one session, LDA — 96% calibration-free at 3 classes. Manifest's whole vocabulary is 5 classes. Three months, done.**

**That read is wrong, for four reasons:**

1. **Single session per subject, no practice period.** There is *zero* session-to-session, day-to-day, or re-donning variation in that number. The entire failure mode that kills deployed EMG systems is absent from the experiment.
2. **A rigid electrode frame** — every subject's electrodes land in nearly the same place. Real donning variance is the dominant nuisance variable and it was engineered away.
3. **2,048 Hz / 20–450 Hz lab amplifier**, i.e. the exact band the EPOC-X does not have.
4. **Cued, seated, single-trial gestures in a lab.** Not a user watching a movie and clenching to pause.

**What the drift literature says about #1 and #2:** cross-session degradation from electrode shift and temporal non-stationarity is the field's standing unsolved problem; calibration recovers roughly **+25% accuracy on average** in inter-session scenarios, which is a measure of how far performance falls without it. Deep models overfit training subjects and degrade substantially on unseen subjects in calibration-free settings.

**Earlier baseline for context:** Firooz & Kalantar (2013), 10 subjects, 3 bipolar pairs (bilateral temporalis + frontalis), 1000 Hz, 30–450 Hz, 10 gestures → 87.1%, **within-subject, per-user trained classifier**.

**The scaling law you should actually plan against** (Frontiers Bioeng. Biotech., 23 Sep 2024, forearm, EMG-EPN-612):
- Zero-shot cross-user, 6 gestures, 306 training users → **93.0%** on 306 unseen users
- **90% first reached at 150 subjects** × 30 reps ≈ **37.5 h active recording**
- **92% required 250 subjects** ≈ **67.5 h**
- **No plateau observed** at 306 subjects

The authors call 150 subjects "a much higher subject count than what is typically collected for EMG-based gesture recognition research." That is the honest number for *robust, calibration-free, cross-user* performance. Not 15.

---

## 5. IRB: a 2–3 month lead time, not a formality

- **Physiological data collection including EEG cannot use the benign-behavioral-intervention exemption category.** Expect expedited (not exempt) review.
- **Investigators may not self-determine exemption** — only the IRB issues that determination.
- **All UW–Madison undergraduate and graduate students engaged in human-participants research must obtain UW–Madison IRB approval or exemption before beginning.** Retroactive approval does not exist; data collected before approval is generally unusable and unpublishable.
- Submission runs through ARROW; only PI and POC can submit. Student PI eligibility varies by institution — at many schools a student cannot be PI and needs a faculty sponsor. **⚠️ UNVERIFIED for UW–Madison specifically.**
- **The startup wrinkle:** if you collect data as *Manifest the company* rather than as UW–Madison students, university IRB may decline jurisdiction and you would need a commercial IRB (WCG, Advarra, Solutions IRB). Private companies conducting human-subjects research generally do need IRB review, and journals require documented approval. Decide *which hat you are wearing* before you recruit subject one — getting this wrong retroactively can invalidate the whole dataset.

**Realistic IRB timeline: 6–12 weeks from starting the application to approval**, assuming CITI training is already done and one round of revisions. This runs in parallel with hardware work, but it gates first subject.

---

## 6. Concrete effort estimate

**Assume:** two students, part-time, 3–5 classes (left / right / select / back / home), starting from zero facial-EMG data.

### Phase 0 — Hardware pivot (unavoidable) — 1–2 months
Cannot use EPOC-X. Options: OpenBCI Cyton (~$500, 8 ch, **250 Hz over BLE — marginal for EMG, needs the WiFi shield for higher rates**), or a proper EMG front-end. Plus electrodes, a head/glasses-mounted fixture, and a synchronised labelling rig. Budget $1.5–4k and real mechanical-design time for the fixture — Cha et al.'s rigid frame is not incidental to their result.

### Phase 1 — Within-user demo — **3–4 months total** (achievable)
IRB (parallel) + 10–15 subjects × 1 session, per-user calibration, 3–5 classes.
**Expected: 90–97% within-subject.** This is a real, defensible demo. Roughly reproduces 2013-era work with better hardware.

### Phase 2 — Cross-user, multi-session, calibration-free — **18–36 months**
This is the product. Requires, by the published scaling evidence:
- **100–200+ subjects** for credible zero-shot generalization (facial may need fewer than forearm's 150 given fewer classes and less anatomical variation — but nobody has published the facial scaling curve, so **this is extrapolation, not fact**)
- **≥2–3 sessions per subject on separate days**, with re-donning between, or the drift problem is simply unmeasured
- 60–150 h of active recording, and at 2–3× overhead for scheduling/no-shows/setup/QC that is **200–450 person-hours of lab time**, before any modelling
- Recruitment of 150 people is a logistics job, not a research job. At 5 subjects/week — optimistic for two part-time students — that is **30 weeks of pure recruitment**.
- Plus domain adaptation / self-supervised pretraining work, which is an open research area

### **Verdict: neither 3 months nor 3 years. It is a ~4-month demo sitting on top of a ~2-year product.**

The dangerous failure mode is shipping Phase 1 and describing it as Phase 2 — because Phase 1 *demos beautifully* on the founder who trained it, and collapses on a stranger. That gap is the entire difficulty of the field.

---

## What I could NOT verify

1. **Emotiv's current, non-deprecated developer/Cortex API license terms.** The one I read is marked "(deprecated)"; no replacement located. **This is the single highest-priority gap** — retrieve the agreement text you clicked through at App ID registration.
2. **Whether "Software" in the EULA covers the Cortex service specifically.** The EULA never mentions Cortex. The definition ("licensed through mobile app, website, or desktop download") plausibly covers the Cortex desktop service, but this is my inference, not stated.
3. **Ninapro's actual licence terms** — registration-gated; commercial-use permissions not determinable from public pages.
4. **Session-to-session facial-EMG drift magnitude.** The LDA-adaptation paper (Kim et al., *Virtual Reality*, 2021) is paywalled; I could not extract its degradation figures. **This is the most important missing number in the brief** — every effort estimate above depends on it.
5. **UW–Madison IRB turnaround times and student-PI eligibility.** Not published on the pages fetched. Contact AskTheIRB@hsirb.wisc.edu / (608) 263-2362.
6. **Emotiv PRO/developer license pricing** — not published; custom-quoted.
7. **Any published facial-EMG cross-user scaling curve.** The 150-subject threshold is from *forearm* data. Its transfer to face is my extrapolation and should be labelled as such in any external document.
8. **Whether any facial-EMG gesture dataset exists in a repository I did not search** (DANDI, NEMAR, PhysioNet were not exhaustively enumerated). I found none; absence of evidence here is moderately strong but not conclusive.

---

## SO WHAT FOR MANIFEST

**1. Stop calling it "our own EMG model." It is a hardware replacement program.**
The EPOC-X's 0.2–45 Hz / 128 SPS front-end makes facial EMG unrecordable, full stop. Any plan that keeps the EPOC-X and adds a model is incoherent, and a technical diligence call will find this in about four minutes. Reframe now: *"our current EMG path runs on a vendor classifier on unsuitable hardware; here is the instrument we're moving to and why."* That is a credible founder statement. "We're training our own model" on an EPOC-X is not.

**2. Read your actual Emotiv developer agreement this week, before Z Fellows.**
EULA §4.5(c) bars commercial use and §4.5(k) bars building a competitive product. You are a commercial entity using Emotiv's stack to build a replacement for Emotiv's classifier. Your data ownership is clean (§5.1) — the surrounding permissions are not. This is a five-minute question with a potentially fatal answer, and the hardware pivot in #1 happens to resolve it. Note that convergence; it makes the pivot easier to justify.

**3. Run the `trained` facial-expression signature before spending a dollar on data collection.**
Cortex supports per-user trained signatures for clench and surprise — the exact two events you use. If you have been on the `universal` default, you have not yet established that the vendor classifier is the bottleneck. Days of work; could invalidate or sharpen the entire premise. Do not skip this because the answer is inconvenient.

**4. Budget the IRB now, at 6–12 weeks, and decide student-vs-company jurisdiction first.**
EEG/EMG collection does not qualify for the benign-intervention exemption, you cannot self-declare exempt, and data collected before approval is unusable. Getting the jurisdiction question wrong — collecting as a company under a student protocol or vice versa — can void the dataset retroactively. This gates everything and costs nothing to start today.

**5. The public-dataset shortcut does not exist, and the two best datasets are non-commercial.**
There is no facial-EMG gesture dataset. Every large sEMG corpus is forearm. emg2qwerty and emg2pose are CC-BY-NC-SA — you cannot ship a product trained on them, and ShareAlike infects derivatives. Do not list them as assets. The flip side is genuinely positive: **the first credible multi-session facial-EMG gesture dataset would be a real moat.** Price it honestly at 150+ subjects and ~2 years, and it becomes a fundable Series-A thesis rather than a 1-week Z Fellows deliverable.

**6. Pitch the 4-month within-user result; do not imply the 2-year cross-user result.**
Phase 1 (10–15 subjects, per-user calibration, 90–97%) is achievable and honest. Phase 2 (calibration-free, cross-user, cross-session) needs ~150 subjects by the only published scaling evidence available, and even the best facial paper — 96% subject-independent at 3 classes — used **one session per subject on a rigid frame**, meaning the drift problem was never measured. Given Manifest's stated bar of never presenting simulated data as live, the equivalent discipline applies here: **a model that works on its two founders is a demo, and calling it a classifier is the same category of overclaim.** Say "per-user calibration required" out loud in the pitch. It is a smaller claim that survives diligence, which beats a larger one that doesn't.

---

## Sources

**Hardware / signal**
- [EPOC X Technical Specifications — Emotiv user manual](https://emotiv.gitbook.io/epoc-x-user-manual/introduction/technical-specifications) — bandwidth 0.2–45 Hz, 128/256 SPS, AC coupled (accessed 19 Jul 2026)
- [Emotiv EPOC X product page](https://www.emotiv.com/epoc-x) — 0.16–43 Hz, 2048 Hz internal, saline felt (accessed 19 Jul 2026)
- [De Luca, "Fundamental Concepts in EMG Signal Acquisition" — Delsys](https://www.delsys.com/downloads/TUTORIAL/fundamental-concepts-in-emg-signal-acquisition.pdf) — SENIAM/ISEK 10–500 Hz band, ≥1000 Hz sampling
- [Goncharova et al., "EMG contamination of EEG: spectral and topographical characteristics," *Clin Neurophysiol* 2003](https://pubmed.ncbi.nlm.nih.gov/12948787/) — frontalis peak 20–30 Hz, temporalis 40–80 Hz, secondary peaks 45–70 Hz, detectable >8–12 Hz at 15% contraction
- [Emotiv Facial Expressions knowledge base](https://www.emotiv.com/knowledge-base/facial-expressions) — "detected from muscle noise"; Smart Artifacts
- [Cortex API — facialExpressionSignatureType](https://emotiv.gitbook.io/cortex-api/advanced-bci/facialexpressionsignaturetype) — universal vs trained signatures
- [OpenBCI Cyton board](https://shop.openbci.com/products/cyton-biosensing-board-8-channel) — 8 ch, 250 Hz BLE, ~$500

**Legal**
- [EMOTIV End User License Agreement](https://id.emotiv.com/eoidc/privacy/doc/eula/) — last updated 17 May 2024; §4.5(c), (i), (k), (l); §5.1
- [EMOTIV Developer License Agreement (deprecated)](https://id.emotiv.com/eoidc/privacy/doc/developer-license/) — §10.2(g) competitive-product clause; §5.1

**Facial EMG literature**
- [Cha et al., "Facial electromyogram-based facial gesture recognition for hands-free control of an AR/VR environment," *Biomed Eng Lett* 2023 (PMC10382369)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10382369/) — 15 subjects, 10 electrodes, 2048 Hz, LOSO 96.08%/95.38%/89.98%/73.37%
- [Firooz & Kalantar, "EMG-based facial gesture recognition through versatile elliptic basis function neural network," 2013 (PMC3724582)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3724582/) — 10 subjects, 3 bipolar pairs, 87.1% within-subject
- [Kim et al., "Performance enhancement of fEMG-based facial-expression recognition … LDA adaptation," *Virtual Reality* 2021](https://link.springer.com/article/10.1007/s10055-021-00575-6) — paywalled, not extracted

**Cross-user scaling / drift**
- [Campbell et al., "Big data in myoelectric control: large multi-user models enable robust zero-shot EMG-based discrete gesture recognition," *Front Bioeng Biotechnol*, 23 Sep 2024](https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2024.1463377/full) — 93.0% zero-shot on 306 unseen users; 90% at 150 subjects; no plateau
- [Du et al., "Surface EMG-Based Inter-Session Gesture Recognition Enhanced by Deep Domain Adaptation" (PMC5375744)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5375744/) — calibration recovers ~25% in inter-session

**Datasets**
- [emg2qwerty, NeurIPS 2024](https://arxiv.org/abs/2410.20081) — 108 subjects, 346 h, CC-BY-NC-SA 4.0
- [emg2pose, NeurIPS 2024](https://arxiv.org/html/2412.02725v1) — 193 subjects, 370 h, 16 ch @ 2 kHz, CC-BY-NC-SA 4.0
- [Meta AI blog, open-sourcing sEMG datasets, Dec 2024](https://ai.meta.com/blog/open-sourcing-surface-electromyography-datasets-neurips-2024/)
- [EMG-EPN-612 (Zenodo)](https://zenodo.org/records/4421500) — 612 subjects, Myo 8 ch @ 200 Hz, forearm
- [Ninapro project](https://ninapro.hevs.ch/) — forearm; licence terms not publicly determinable
- [putEMG](https://biolab.put.poznan.pl/putemg-dataset/) — 44 subjects, forearm
- [awesome-emg-data index](https://github.com/x-labs-xyz/awesome-emg-data)

**IRB**
- [UW–Madison IRB — New Study submission](https://irb.wisc.edu/submission-guidance/new-study/)
- [UW–Madison Human Research Protection Program](https://irb.wisc.edu/)
- [NIH OHSRP — Exempt Research](https://irbo.nih.gov/irb-review/exempt-research/) — physiological data collection excluded from benign-intervention exemption
- [Northwestern IRB — Exempt Review](https://irb.northwestern.edu/submitting-to-the-irb/types-of-reviews/exempt-review.html) — investigators cannot self-determine exemption
- [Solutions IRB — Do Private Companies Need IRB Approval?](https://www.solutionsirb.com/do-private-companies-need-irb-approval/)


---

# Neural data privacy law and regulatory exposure

# Neural Data Privacy Law & Regulatory Exposure — Manifest

**Prepared:** 2026-07-19. Adversarial posture: facts that threaten the thesis are foregrounded.

**Headline finding, stated bluntly:** the neural-data laws everyone talks about (Colorado, California, Montana, Connecticut) almost certainly **do not apply to Manifest at current scale** — they have size thresholds Manifest is nowhere near. The laws that *do* apply, right now, with **no size threshold and a private right of action**, are Illinois BIPA and Washington's My Health My Data Act — and they bite on the **webcam face-tracking feature that actually works today**, not on the EEG work that doesn't. The neurotech-regulation narrative is a distraction from the two real liabilities.

---

## 1. US state neural-data laws — and why they mostly miss you

Source for the statutory quotes below: Future of Privacy Forum, *State Neural Data Laws, Summer 2025* (PDF, Spivack & Victory) — the tables reproduce the operative text and covered-entity scope.

| Law | Effective | Covered entities (the part that matters) | Applies to Manifest? |
|---|---|---|---|
| **California SB 1223** (amends CCPA) | Jan 1, 2025 | For-profit businesses in CA meeting **any** of: >$25M gross revenue; buy/sell/share PI of ≥100,000 CA residents/households; ≥50% revenue from selling CA residents' PI | **No.** Not close on any prong. |
| **Colorado HB24-1058** (amends CPA) | Aug 7, 2024 | Entities **including nonprofits** doing business in CO, **AND** either: process PD of >100,000 individuals/yr; **OR** derive revenue/discounts from selling PD of ≥25,000 individuals | **No.** But note CPA uniquely covers nonprofits — an open-source foundation would not escape it on non-profit status alone. |
| **Montana SB 163** (amends Genetic Information Privacy Act) | Oct 1, 2025 | **Unchanged from GIPA**: entities that offer consumer **genetic testing** products/services directly to consumers, or collect/use/analyze **genetic data** | **No** — and this is a drafting failure, not a safe harbor. Montana added "neurotechnology data" to the Act's *scope* but did **not** expand *who* is regulated. Neurotech makers who don't touch genetic data are simply outside it (MoFo, Aug 15 2025; Sheppard Mullin). |
| **Connecticut SB 1295** (amends CTDPA) | Most sections Jul 1, 2026 | Controllers doing business in CT that in the past year controlled/processed PD of **≥35,000 consumers**, or controlled sensitive data, or sold PD | **Not yet** — but 35,000 is the lowest bar in the country and is reachable by a free open-source web app. This is your first realistic trigger. |
| **Vermont H.814 / Act 101** | Signed May 18, 2026; effective **Jul 1, 2026** | First standalone statutory chapter on "neurological rights" (mental/neural data privacy, freedom of thought, non-discrimination, protection from unauthorized alteration) | **UNVERIFIED for Manifest.** DWT (May 28, 2026) reports the law "lacks enforcement mechanisms and operational guidance." I did not read the enrolled text; do not rely on my summary. |

**Definitional problem that cuts in your favor and against you simultaneously.** Every one of these statutes defines neural data as measurement of **central or peripheral nervous system activity**. That squarely covers surface EMG (peripheral nervous system → muscle). It does **not** cover a webcam nose-yaw estimate. FPF's *Neural Data Goldilocks Problem* notes Montana explicitly excludes "downstream physical effects of neural activity, including... pupil dilation, **motor activity**, and breathing rate," and California excludes data "inferred from nonneural information." So:

- Your **MediaPipe gaze proxy = not neural data** under any current US statute. Good.
- Your **future own-EMG model = neural data** under CA, CT, CO, MT definitions (peripheral nervous system). The thing you have decided to build is the thing that pulls you into scope.
- Colorado additionally narrows to biological data "used or intended to be used... **for identification purposes**." A command classifier is not identification. Colorado is likely inapplicable even at scale, on purpose-scope grounds. Don't over-claim this — a single-user calibrated model arguably *does* identify.

---

## 2. The laws that actually threaten you today

### Illinois BIPA (740 ILCS 14) — the real one
- Covers "a scan of **hand or face geometry**." A MediaPipe FaceLandmarker mesh computed from a webcam is a textbook face-geometry scan. This is the single most litigated fact pattern in US privacy law.
- **No revenue threshold, no employee threshold, no consumer-count threshold.** It applies to "private entities." A two-person student project is a private entity.
- **Private right of action.** Liquidated damages $1,000/negligent, $5,000/reckless-or-intentional, plus attorneys' fees. The Aug 2024 amendment (P.A. 103-0769) narrowed "per violation" to a single recovery per person per collection method — helpful, not exculpatory.
- Track record on *exactly* your technology class: Neutrogena/Kenvue Skin360 app, $4.7M, ~11,000 Illinois users, for collecting facial geometry via an in-app AI skin analysis. YouTube "Face Blur," $6M, Aug 2025. Google Workspace for Education face/voice models, $8.75M final approval Oct 17, 2025. 107+ new BIPA class actions filed in 2025 (Privacy World 2025 Year in Review); 51 of 182 tracked suits concerned facial geometry.
- **The uncomfortable part:** the Kenvue-style claim does not require you to store anything. BIPA §15(b) is a **collection**-and-notice statute. "It's all local, nothing leaves the browser" is a strong practical defense and a *contested* legal one. Do not treat client-side processing as a complete answer.

### Washington My Health My Data Act (RCW 19.373)
- Applies to any entity that conducts business in WA **or targets WA consumers** and determines the purpose/means of collecting consumer health data. **"Small business" is a compliance-deadline category (June 30, 2024), not an exemption.**
- Biometric data is expressly in scope; "consumer health data" reaches data about physical or mental health status — data from a disabled user's assistive input device is, on any honest reading, health-status-linked.
- **Private right of action** via the Washington CPA: injunctive relief, actual damages, attorney's fees, treble damages up to $25,000. First class complaint filed Feb 10, 2025.
- Requires a **separate, standalone consumer health data privacy policy** (not a section of your main policy) and separate consent for collection vs. sharing. This is cheap to do and expensive to have skipped.

### GDPR (if any EU user touches it)
- Art. 4(14) biometric data = processing "which **allow or confirm the unique identification**" of a person. EDPB position and the ICO line: Art. 9's special-category prohibition bites only when the purpose is **unique identification**. A gaze-direction estimate is not identification.
- **Therefore your webcam feature is likely ordinary personal data, not Art. 9 special category.** That is a genuinely favorable result and worth architecting to preserve.
- EMG signals interpreted as commands: also arguably not Art. 9 — but data revealing health *is* Art. 9, and a product whose user base is definitionally disabled makes "we don't process health data" a hard claim to keep a straight face about.
- If frames never leave the device and you never receive them, your controller-side processing may be close to nil. **Local-only-by-architecture is your best compliance asset. Protect it.**

---

## 3. EU AI Act — the Emotiv `fac` stream is the exposure

This is the sharpest finding in your brief and you flagged it correctly.

- **Art. 5 prohibition (in force 2 Feb 2025):** AI systems inferring emotions **in the workplace and education institutions** are banned, with a carve-out for medical or safety reasons. Manifest is a UW–Madison project. **If you demo an Emotiv `fac`-driven build in a classroom, lab course, or campus educational setting in the EU, you are in the prohibited zone.** In the US, no legal effect — but it is a reputational and future-market landmine, and student projects demo in exactly those settings.
- **Art. 50(3) transparency (applies 2 Aug 2026):** "Deployers of an emotion recognition system... shall inform the natural persons exposed thereto of the operation of the system." Only law-enforcement exemptions. If you deploy an emotion/expression-inference system to EU users, disclosure is mandatory.
- **The counter-argument you should make, and its limit:** Emotiv's `fac` stream outputs facial *expression* labels ("clench," "surprise") — muscle events, not emotional states. The AI Act's emotion-recognition definition targets inferring **emotions or intentions**. "Clench" is a mechanical event; "surprise" is not. **You have a real argument that a clench-only pipeline is out of scope and a weak one for `surprise`.** Cheapest fix available: don't use the `surprise` label; derive brow-raise from something not named after an emotion. That is a one-line vocabulary decision with disproportionate regulatory payoff.

---

## 4. FDA — the line, and where you fall

**21 CFR 890.3710, Powered communication system** (verified text): "an AC- or battery-powered device intended for medical purposes that is used to transmit or receive information" by "persons unable to use normal communication methods because of physical impairment." **Class II (special controls)**, but — critically — **"exempt from the premarket notification procedures in subpart E of part 807... subject to § 890.9."**

What this means concretely:

- **You do not need a 510(k)** for a communication/control aid on this path. This is much better news than the "Class II" label suggests, and better than most founders assume.
- **510(k)-exempt ≠ unregulated.** You would still owe: establishment registration and device listing, Quality System (QMSR), labeling, and Medical Device Reporting. For two students, that is a real but non-fatal burden — call it months, not years.
- The **§ 890.9 limitation** is the trap: exemptions lapse if the device has a new intended use or operates on a *different fundamental scientific technology* than legally marketed predicates. A BCI/EMG-driven control path is a plausible "different fundamental technology" argument. **UNVERIFIED** — I could not retrieve the FDA product-classification database entry (404/redirect blocks) to confirm product codes and exemption limitations. Verify this before relying on it.
- **Cognixion** is the honest benchmark for the ambitious path: FDA **Breakthrough Device Designation** for Cognixion ONE Axon, May 4, 2023 — an EEG-based non-invasive BCI AR headset for severe motor impairment. Breakthrough is not clearance; it is prioritized review. They are now running an ALS clinical trial. Their research variant, **Axon-R, is explicitly "not cleared by FDA for clinical or therapeutic applications."** That is the structure to copy: ship the research/general-purpose variant, keep the clinical claim in a separate, later-stage entity.
- **Tobii Dynavox** — at least some products are Class II (an FDA Class 2 device recall record exists). I could **not verify** specific 510(k) status per product.
- **The controlling variable is intended-use language, not the technology.** "General-purpose hands-free computer input" stays out. "Enables communication for people who cannot speak" walks directly into 890.3710's identification text. Your positioning docs are a regulatory instrument. Read them as such.

---

## 5. International instruments (low near-term operational risk, high narrative risk)

- **Chile**: Oct 2021 constitutional amendment protecting mental integrity and brain activity — first in the world. **August 2023: the Chilean Supreme Court ordered Emotiv Inc. to delete a claimant's (former Senator Girardi's) brain data** collected via an Insight headset. First ruling worldwide applying constitutional neurorights against a private tech company. **Your vendor is the named defendant in the world's only neurorights court loss.** That belongs in your risk register and, frankly, in your argument for getting off Emotiv.
- **UNESCO Recommendation on the Ethics of Neurotechnology**, adopted 43rd General Conference, **Nov 2025**, in force **Nov 12**. Non-binding on companies; binds member states to report. Notably it covers "**indirect neural data and non-neural data allowing mental states inferences**" — the broadest scope of any instrument, and it *would* reach your webcam proxy if a state implemented it literally. It also advises against non-therapeutic use in children and warns on workplace monitoring.
- **Federal US**: nothing binding. Neural data is governed federally only by **FTC Act §5**. The **MIND Act of 2025** (S.2925, Schumer/Cantwell/Markey, introduced Sept 24, 2025) would only commission an FTC *study* plus OSTP guidance for federal agencies. Not law, not close.

---

## 6. Enforcement and incidents to date

- **No FTC enforcement action against any neurotech company** as of the latest sources I found (Arnold & Porter, Jul 2025; DWT, May 2026). Senators wrote the FTC in April 2025 urging investigation; **the FTC did not respond.**
- **Chile v. Emotiv (Supreme Court, Aug 2023)** — the only neurorights enforcement worldwide.
- **Neurorights Foundation, "Safeguarding Brain Data" (April 2024)**: of 30 consumer neurotech companies audited, **29 of 30** had policies permitting access to consumer neural data with no meaningful limitation; **96.7%** reserved the right to transfer brain data to third parties; fewer than half encrypt and de-identify. **Emotiv was one of the named companies** in the associated coverage (STAT, Apr 17 2024). DWT (2026) reports 60% of surveyed companies provide no information at all about neural data handling.
- **BIPA**: the entire enforcement story is here (§2 above). This is where money actually changes hands.

---

## 7. The obligation you are most likely to trip first: IRB, not privacy law

Your stated intent — **collect your own EMG training data** — is human-subjects research conducted by university students, likely involving participants with disabilities.

- 45 CFR 46.111 requires IRBs to be "particularly cognizant of the special problems of research involving vulnerable populations, such as... **mentally disabled persons**, or economically or educationally disadvantaged persons," and to assess coercion/undue influence and confidentiality safeguards.
- **UNVERIFIED and you must check directly with UW–Madison's IRB:** (a) whether your data collection qualifies as human-subjects research requiring review or an exempt/not-human-subjects determination; (b) whether an IRB-approved consent form permits **commercial use** of the resulting dataset and derived model weights — many university consent templates do not, and a dataset collected under research consent can be legally unusable in a for-profit product; (c) whether the university claims IP in student-collected data; (d) whether an FDA **IDE / non-significant-risk** determination is needed if the device is used to make any clinical claim during the study.
- This is a **gating item with a multi-week-to-multi-month clock** and it is the single most likely thing to actually block you from touching real disabled users. It is not on your research brief's list, and it should be at the top of it.

---

## 8. Vendor-contract exposure (not regulation, but it can stop you cold)

- Emotiv's **deprecated** Developer License Agreement (id.emotiv.com) grants commercial organizations use "internally for one (1) License Seat"; **§6.1 requires a separate Distribution License Agreement to distribute**, and **§6.2 requires free/open-source distributors to contact Emotiv customer service to be added to Emotiv's free/open-source license list.** An open-source repo shipping a Cortex bridge is squarely a §6 distribution. **UNVERIFIED:** I could not confirm whether the current, non-deprecated agreement carries identical terms — the page I retrieved is explicitly labeled deprecated. **Read the live agreement before publicizing the repo.**
- A **20% royalty above a revenue/user threshold** was reported in search results for Emotiv commercial licensing. **I could not verify this in the license text I retrieved. Treat as unconfirmed but check it** — if true it is a material term.
- **Emotiv's own intended-use restriction is the sharpest conflict:** "EMOTIV products are intended to be used for **research applications and personal use only**. Our products are not sold as Medical Devices... not designed or intended to be used for diagnosis or treatment of disease" (EPOC X User Manual, Regulatory Compliance). **Manifest's entire thesis is deploying to real disabled users.** Depending on Emotiv's classifier for an assistive product used by disabled people is contrary to the vendor's stated intended use. That is a liability-allocation problem in a bad-outcome scenario, and it is an independent, non-technical reason the "build our own EMG model" plan is correct.

---

## What I could NOT verify

1. **FDA product codes and § 890.9 exemption limitations** for 890.3710 — the FDA classification database returned 404; the eCFR redirected to an unblock gateway. The exemption's scope (and whether a BCI/EMG modality counts as "different fundamental scientific technology") is unconfirmed.
2. **Tobii Dynavox's specific 510(k)/exempt status per product.** Only inference from a Class 2 recall record.
3. **The FDA "Examples of Software Functions That Are NOT Medical Devices" list** — page 404'd. Whether it contains an accessibility/assistive-input example is unknown, and it would matter.
4. **Vermont Act 101's operative text, scope, covered entities, and enforcement.** Summarized from DWT and press only. I did not read the enrolled bill.
5. **The live Emotiv Developer/Distribution License terms**, the 20% royalty claim, and whether an open-source project qualifies for the free/OSS list.
6. **Whether Colorado's CPA rules (6.07, 6.10, 7.08 — consent refresh at 24 months, deletion on withdrawal) reach neural-data inferences** in a way that would apply to a calibrated per-user EMG model. Read from the FPF chart, not the rules themselves.
7. **UW–Madison IRB policy** on any of the questions in §7. Entirely unresearched here; requires a direct conversation.
8. **Whether any BIPA case has specifically litigated gaze/head-pose estimation** (as opposed to face geometry for identification). No such case surfaced. This is a genuine open question, not a clean answer.
9. **State laws beyond CA/CO/MT/CT/VT** — I did not run a comprehensive 2026 session sweep. Assume more passed.

---

## SO WHAT FOR MANIFEST

1. **You have the threat model backwards. Ship BIPA + MHMDA compliance this month, before you write another line about neural data law.** Your working webcam feature is a "scan of face geometry" under a statute with a private right of action, $1,000–$5,000 per person, no size threshold, 107+ suits filed in 2025, and a $4.7M settlement over an app doing essentially your operation. The neural-data laws you were told to research all have 25,000–100,000-person thresholds and **do not apply to you.** Required before any real user touches this: a written biometric policy with a retention/destruction schedule, an explicit written-consent gate before the camera turns on, a standalone WA consumer-health-data privacy notice, and separate consent for any sharing. Cost: a weekend. Cost of skipping: existential for a two-person team.

2. **Local-only processing is your single most valuable compliance asset — write it into the architecture as an invariant, not a current implementation detail.** It is what keeps your webcam feature outside GDPR Art. 9 (no unique-identification purpose), minimizes BIPA "possession," and makes MHMDA sharing consent moot. The moment you add cloud inference or telemetry-with-frames, you convert a defensible posture into a litigated one. Note that your **voice assistant already uses OpenAI APIs** — that is data leaving the device today, and it needs its own disclosure and its own look at what is in the audio.

3. **Stop using Emotiv's `surprise` label. Rename or replace the brow-raise path.** Emotiv's `fac` stream is a vendor emotion/expression classifier, and "surprise" is a named emotion. EU AI Act Art. 5 prohibits emotion inference **in educational institutions** — which is literally where you demo. Art. 50(3) mandates disclosure to exposed persons from 2 Aug 2026. A clench-only mechanical vocabulary has a clean out-of-scope argument; an emotion-labeled one does not. This is a naming decision worth more than months of legal analysis.

4. **The IRB is your real blocker, and nobody has put it on your critical path.** Collecting your own EMG training data from disabled participants at UW–Madison is human-subjects research involving a population 45 CFR 46.111 flags for heightened scrutiny. Start the IRB conversation **now** — and the specific question to ask on day one is not "can we collect this," it is **"can a for-profit entity later use data and model weights derived from this consent?"** If the answer is no, you will have burned a semester collecting a dataset you cannot ship. This is the most likely single event that stops you from touching real disabled users.

5. **Your intended-use language is a regulatory control surface. Audit `POSITIONING.md`, `README.md`, and the Z Fellows application for medical-device claims.** 21 CFR 890.3710 attaches to devices "intended for medical purposes" used by "persons unable to use normal communication methods because of physical impairment" — which is close to how accessibility-first pitch copy naturally reads. The good news is genuinely good: that pathway is **Class II but 510(k)-exempt**, so the ambitious version is far cheaper than the "FDA clearance" bogeyman implies. But you get to choose which side of the line you are on, and you choose it in prose, not in code. Copy Cognixion's structure: a general-purpose/research variant that ships now, clinical claims quarantined into a later, separately-funded track.

6. **"We depend on Emotiv's proprietary classifier" is now a legal argument for replacing it, not just an engineering one.** Emotiv's terms say research and personal use only, not for diagnosis or treatment. Their license appears to require a separate Distribution License Agreement — and explicit permission to distribute as open source. And they are the defendant in the world's only neurorights court loss (Chile, Aug 2023), plus a named company in the Neurorights Foundation audit that found 29 of 30 firms allow unrestricted neural-data access. **Verify the live license before publicizing the repo.** Your stated plan to build your own EMG model is correct — but frame it honestly to Z Fellows as *de-risking a vendor dependency you are contractually and reputationally exposed to*, not as a capability upgrade. And be equally honest that the moment you succeed, you have built a system that measures peripheral nervous system activity — which is **neural data** under every US state definition, and puts Connecticut's 35,000-consumer threshold on your horizon as the first one you can realistically cross.

---

## Sources

- Future of Privacy Forum, *State Neural Data Laws, Summer 2025* (Spivack & Victory) — https://fpf.org/wp-content/uploads/2025/08/Neural-Data-State-Tracker-Chart.pdf
- FPF, *The "Neural Data" Goldilocks Problem* — https://fpf.org/blog/the-neural-data-goldilocks-problem-defining-neural-data-in-u-s-state-privacy-laws/
- Colorado HB24-1058 — https://leg.colorado.gov/bills/hb24-1058
- California SB 1223 text — https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240SB1223
- Montana SB 163 enrolled — https://legiscan.com/MT/text/SB163/id/3212476/Montana-2025-SB163-Enrolled.pdf ; MoFo analysis (Aug 15, 2025) — https://www.mofo.com/resources/insights/250815-a-mofo-privacy-minute-neural-data-added ; Sheppard Mullin — https://www.sheppard.com/insights/blogs/montana-amends-law-to-cover-collection-and-use-of-neural-data
- Vermont H.814 / Act 101 (signed May 18, 2026; eff. Jul 1, 2026) — https://legislature.vermont.gov/bill/status/2026/H.814
- Davis Wright Tremaine, *All the World's Neural Data, No Common Rule* (May 28, 2026) — https://www.dwt.com/blogs/privacy--security-law-blog/2026/05/all-the-neural-data-and-no-common-rule-2026
- Arnold & Porter, *Neural Data Privacy Regulation* (Jul 2025) — https://www.arnoldporter.com/en/perspectives/advisories/2025/07/neural-data-privacy-regulation
- MIND Act of 2025, S.2925 (introduced Sept 24, 2025) — https://www.congress.gov/bill/119th-congress/senate-bill/2925/text ; Senate Commerce release — https://www.commerce.senate.gov/2025/9/sens-cantwell-schumer-markey-introduce-legislation-to-shield-americans-brain-data-from-exploitation
- Illinois BIPA, 740 ILCS 14; 2024 amendment P.A. 103-0769 — King & Spalding — https://www.kslaw.com/news-and-insights/illinois-bipa-reform-takes-effect
- Privacy World, *2025 Year-In-Review: Biometric Privacy Litigation* (Dec 2025) — https://www.privacyworld.blog/2025/12/2025-year-in-review-biometric-privacy-litigation/
- Washington My Health My Data Act, RCW 19.373 — https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true ; Hintze Law on biometrics — https://hintzelaw.com/blog/wa-my-health-my-data-act-pt7-biometrics ; WilmerHale, first MHMDA suit (Feb 20, 2025) — https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20250220-first-lawsuit-filed-under-washingtons-my-health-my-data-act
- ICO, *What is special category data?* — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/ ; EDPB Guidelines 05/2022 on facial recognition — https://www.edpb.europa.eu/system/files/2023-05/edpb_guidelines_202304_frtlawenforcement_v2_en.pdf
- EU AI Act Art. 5 — https://artificialintelligenceact.eu/article/5/ ; Art. 50 — https://artificialintelligenceact.eu/article/50/ ; Commission Guidelines on Prohibited AI Practices, C(2025) 5052 final (29 Jul 2025) — https://ai-act-service-desk.ec.europa.eu/sites/default/files/2025-08/guidelines_on_prohibited_artificial_intelligence_practices_established_by_regulation_eu_20241689_ai_act_english_ied3r5nwo50xggpcfmwckm3nuc_112367-1.PDF
- 21 CFR § 890.3710 — https://www.law.cornell.edu/cfr/text/21/890.3710
- FDA, *General Wellness: Policy for Low Risk Devices* — https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices ; Covington on 2026 revision — https://www.cov.com/en/news-and-insights/insights/2026/01/fda-issues-revised-guidance-on-general-wellness-products
- Cognixion Breakthrough Device Designation (May 4, 2023) — https://www.cognixion.com/blog/2023/5/3/cognixion-receives-fda-breakthrough-device-designation-for-its-brain-computer-interface-with-augmented-reality-for-assistive-communication ; Axon-R research-only — https://www.biospace.com/press-releases/cognixion-and-blackrock-neurotech-expand-access-to-non-invasive-multi-modal-bci-research-with-axon-r
- Chilean Supreme Court v. Emotiv (Aug 2023), *Frontiers in Psychology* (2024) — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1330439/full
- UNESCO Recommendation on the Ethics of Neurotechnology (Nov 2025) — https://www.unesco.org/en/legal-affairs/recommendation-ethics-neurotechnology ; full text PDF — https://bioethics.jhu.edu/wp-content/uploads/2026/03/UNESCO-RECOMMENDATION-on-the-Ethics-of-Neurotechnology-11.11.2025.pdf
- Neurorights Foundation, *Safeguarding Brain Data* (April 2024) — https://perseus-strategies.com/wp-content/uploads/2024/04/FINAL_Consumer_Neurotechnology_Report_Neurorights_Foundation_April-1.pdf ; STAT coverage (Apr 17, 2024) — https://www.statnews.com/2024/04/17/neural-data-privacy-emotiv-eeg-muse-headband-neurorights/
- Senators' letter to FTC (April 2025) — https://www.commerce.senate.gov/press/dem/release/cantwell-schumer-markey-call-on-ftc-to-protect-consumers-neural-data-2025-4/
- Emotiv Developer License Agreement (marked deprecated) — https://id.emotiv.com/eoidc/privacy/doc/developer-license/ ; EPOC X User Manual, Regulatory Compliance — https://emotiv.gitbook.io/epoc-x-user-manual/regulatory-compliance
- 45 CFR Part 46 (Common Rule), § 46.111 — https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.111


---

# Neurotech / BCI funding landscape and investor appetite

# Neurotech / BCI Funding Landscape & Investor Appetite — Adversarial Research Brief
**Prepared for:** Manifest (Kanuj Verma, Sami Beg) — Z Fellows application context
**Date:** 2026-07-19
**Posture:** Adversarial. Facts that threaten the thesis are prioritized.

---

## 1. The invasive/non-invasive capital gap is enormous — and it's widening

**Invasive / implanted BCI (the money):**

| Company | Round | Amount | Date | Valuation | Investors |
|---|---|---|---|---|---|
| Neuralink | Series E | **$650M** | Jun 2, 2025 | ~$9B post (from $3.5B in 2023) | ARK Invest, DFJ Growth, Founders Fund, G42, Human Capital, Lightspeed, QIA, Sequoia, Thrive, Valor, Vy Capital |
| Synchron | Series D | **$200M** | Nov 2025 | "nearly $1B" (company-stated) | Led by Double Point Ventures; ~$345M total raised |
| Precision Neuroscience | Series C | **$102M** | 2025 | Not disclosed | Prior Series B $41M led by AE Ventures |
| Paradromics | — | ~$100M+ total raised, plus ~$18M NIH/DARPA grants; undisclosed strategic from Saudi NEOM (Feb 2025) | 2025 | Not disclosed | NEOM, others |

**Non-invasive / consumer (the scraps, with one anomaly):**

| Company | Round | Amount | Date | Notes |
|---|---|---|---|---|
| Merge Labs | Seed | **$252M** | emerged from stealth Jan 2026 | $850M valuation, led by OpenAI, co-founded by Sam Altman. **This is a founder-brand round, not a category signal.** UNVERIFIED against primary source — see §8. |
| Neurable | Series A | **$35M** | Dec 27, 2025 | Led by Spectrum Moonshot Fund; $65M total raised. Founded ~2015 — **that's ~10 years to a $35M Series A.** |
| Neurosoft Bioelectronics | Seed | $7.5M | May 2026 | Implantable/stretchable — not consumer |
| Cognixion | Series A | $12M | Nov 2021 | ~$25–29M total over 8 rounds since 2018. Prime Movers Lab, Amazon Alexa Fund, Northwell Health, Verizon Forward for Good |

**The gap, quantified:** Neuralink's single 2025 round ($650M) is roughly **19× Neurable's Series A** and **~54× Cognixion's total lifetime raise.** Per sector trackers, Series C/D+/growth rounds captured ~71.8% of disclosed neurotech capital — this is a **late-stage-heavy market**, i.e. capital is flowing to companies with regulatory milestones and implanted patients, not to input-layer software.

**The blunt read:** the money in BCI is medical-device money chasing FDA pathways and paralysis indications. Manifest is neither. The "non-invasive BCIs captured ~29% of YTD-2026 capital ($272M)" stat is misleading — Merge Labs' $252M is ~93% of that number. **Strip Merge out and non-invasive BCI raised ~$20M YTD 2026.**

---

## 2. The consumer-neurotech graveyard — what actually kills these companies

This is the most important section and it is not flattering.

**Leap Motion — the closest structural analogue to Manifest.** Not a BCI, but the same thesis: *a novel input modality, delivered as middleware/SDK, that will replace the mouse.*
- Raised **>$94M**, peak valuation **$300M** (2013)
- Sold to Ultrahaptics in 2019 for a reported **$30M — ~10% of peak**
- Cause of death per TechCrunch: *"unable to ever zero in on a customer base that could sustain them"* — plus "poor developer support and a poorly unified control system." Sold ~500k consumer modules and it wasn't enough.
- **Sequel:** the merged Ultraleap breached a £15m loan covenant, laid off staff through 2024, sold the hand-tracking unit to ROLI and its IP to SIM IP, and was **"sold for parts"** with ~24 staff remaining (Sifted, 2025).

**Halo Neuroscience** — consumer tDCS ("neuropriming" for athletes). Closed its doors; assets acquired by Flow Neuroscience, Feb 2021.

**Thync** — consumer neurostimulation wearable, pivoted repeatedly out of consumer; effectively gone.

**NextMind** — SSVEP-based consumer BCI dev kit, acquired by Snap in 2022 (**price undisclosed** — undisclosed usually means small). Snap subsequently retrenched hard in AR. Note: NextMind was *the* SSVEP consumer company. Your decision against SSVEP is well-founded; also note the last company to commercialize it got quietly absorbed.

**CTRL-labs** — the exception that proves the rule: acquired by Facebook for ~**$1B** (2019). It was acquired for *its team and IP by a platform owner*, never as a standalone business. That is the realistic best case for input-modality startups: acqui-hire by a platform, not an IPO.

**Naqi Logix / Wisear** — ear-based neural micro-gesture input, arguably your nearest live competitor. Naqi has raised only **~$6.68M** institutionally and is raising **$15M via StartEngine Reg A+ crowdfunding at a $126.1M self-set valuation** (2025). It acquired Wisear (Paris, EMG/EOG earbuds) on Jan 29, 2026. **Reading Reg A+ crowdfunding as the funding route: institutional VCs did not price this.** That is a market signal about how VCs value ear/face-gesture input platforms.

**The pattern:** consumer neurotech companies do not die of bad technology. They die of **no repeat-purchase customer**, and they die slowly, after raising enough to look successful.

---

## 3. The single biggest threat to Manifest's stated plan

**Manifest's current intent is to build its own EMG model and collect its own training data. Meta has already done this, at a scale you cannot match, and shipped it.**

From Meta's own Reality Labs publication (Nature, 2025):
- Models trained on **thousands of consenting participants**, "highly accurate at decoding subtle gestures across a wide range of people **without the need for individual calibration**"
- Publicly released dataset: **100+ hours of sEMG from 300+ participants** across three tasks (plus earlier open-sourced sEMG datasets from NeurIPS 2024)
- Claims **single-motor-unit resolution** at the wrist — including intended finger actions that never manifest as overt movement
- **Shipped commercially:** Meta Neural Band included with Meta Ray-Ban Display, **$799, on sale Sept 30, 2025**

Implications you should not soften:
1. "We're building our own EMG model" is, to a sophisticated investor, a claim that two students will out-execute a multi-billion-dollar Reality Labs program that has been at this since the 2019 CTRL-labs acquisition. **Do not make that claim.**
2. Meta open-sourced the dataset. Your data-collection moat argument gets weaker, not stronger — but it also means **you can start from their data instead of collecting your own.** Not using it will read as not having read the literature.
3. There is a genuine accessibility gap here: Meta's band assumes a wrist and functional motor units in the forearm. Users with high cervical SCI, ALS, or severe CP are outside that design envelope. **That gap is your only defensible EMG story** — and note that a blind user's hands-on review of the Neural Band already exists (AppleVis forum), meaning the accessibility community is actively evaluating Meta's device as assistive tech. You will be compared to it.

---

## 4. Your dependency on Emotiv is a diligence landmine

Verified from Emotiv's own Developer License Agreement (id.emotiv.com):

> *"if Your organization is Commercial, use such Third Party Software internally for **one (1) License Seat**"*

> *"You may not use the API for any other purpose, including to market, sell or distribute the Third Party Software or any product or service incorporating the Third Party Software, unless You comply with the distribution requirements"* — which require you to *"contact EMOTIV business development and obtain a **Distribution License Agreement**… including **license fees**"*

Additionally (secondary sources, tier-structure): Registered Developer (free) gives Facial Expressions / Mental Commands / Frequency Bands but **not raw EEG**; raw EEG requires a custom-priced Professional Developer license. A widely-repeated "20% royalty above 1,000 users or $250k revenue" figure appears in secondary sources — **I could not confirm this in the primary license text; treat as UNVERIFIED.**

**The diligence question you will get and must answer in one sentence:** *"Your working facial-expression demo is threshold logic on top of Emotiv's proprietary classifier, on hardware you don't make, under a license that requires a negotiated distribution agreement you don't have. What exactly do you own?"* Right now the honest answer is: the dwell/cooldown/hysteresis layer, the vocabulary abstraction, and the UI. That may be enough — but say it first, before they find it.

---

## 5. Who actually funds this — named funds

**Neurotech-specialist / repeat 2025–26 participants:**
- **Khosla Ventures** — most active repeat name (Synchron, Science Corp, Somnee)
- **Lux Capital** — deep tech / neural interfaces (backed Kernel)
- **Founders Fund** — Neuralink, Blackrock Neurotech
- **Lightspeed**, **QIA**, **In-Q-Tel/IQT**, **ARCH Venture Partners**
- **JAZZ Venture Partners** — explicitly "neuroscience and human performance"
- **Joyance Partners**, **Kaleida Capital**, **Chaanakya Capital**, **METIS Innovative**, **DigiTx** — small specialist/seed neurotech funds. These are your realistic first calls, not Khosla.
- **Nexus NeuroTech Ventures**, **Iaso Ventures** (brain/behavioral health sector fund)
- **Action Potential VC** (GSK CVC — bioelectronics only), **Angelini Ventures** (brain health), **Dolby Family Ventures**

**Accessibility / disability tech (more realistic fit for your positioning):**
- **Adaptation Ventures** — US angel group founded May 2025 by Brittany & Rich Palmer, both disabled former founders. **Plans ≥$250k per company.** This is the single most on-thesis new investor for Manifest.
- **Amazon Alexa Fund** — already invested in Cognixion; explicitly interested in AI-assistant × accessibility
- **K Ventures** (est. 2022; Christopher McKelvy, Judd Olanoff; backed by Joseph P. Kennedy Jr. Foundation) — learning/cognitive disability focus
- **Northwell Holdings**, **Verizon Forward for Good**, **CABHI**, **Prime Movers Lab** — all in Cognixion's cap table

**Accelerators:** Creative Destruction Lab (Toronto), IndieBio/SOSV, MedTech Innovator, Cedars-Sinai Accelerator. Non-dilutive: NIH/NSF SBIR, DARPA, ARPA-H (note: US federal science budgets were under active cut pressure in 2025 per Neurotech Reports — treat SBIR timing as risky).

**Market-size skepticism:** the "assistive tech market = $22B (2023) → $31.22B by 2030" figure is a market-research-firm TAM, and the widely-circulated "$18 trillion in disposable income" and "9× return per dollar invested" numbers are **advocacy statistics, not investable market data**. The tracked reality: assistive tech companies raised **$526M across 51 rounds in all of 2025** (Tracxn) — that's a ~$10M average round in a *fragmented, mostly-hardware, mostly-reimbursement-dependent* sector. Do not put the $18T number in a deck; a good investor will discount everything after it.

---

## 6. Open-source-first middleware in hardware-adjacent categories — the track record

I could not find rigorous quantitative studies specific to *hardware-adjacent* OSS middleware time-to-revenue (see §8). What is defensible:

- **What worked** (Elastic, MongoDB, PostHog): open-core or hosted-service models where the *hosting/operational burden* is the thing customers pay for. MongoDB Atlas grew to >50% of revenue. All are **software-infrastructure** categories with recurring operational need.
- **What does not work** for an input runtime: there is no operational burden to host. A client-side signal-decoding library runs on the user's device. **There is no Atlas equivalent for a gesture decoder.** This is the structural problem with "open-source biosignal runtime" as a business.
- **The hardware-adjacent OSS precedents are grim:** OpenBCI (open hardware, ~decade old, still a small hardware business), Lab Streaming Layer and BrainFlow (widely adopted, essentially unmonetized academic infrastructure). Adoption in this space has repeatedly failed to convert to revenue.
- Marginal cost of distribution is zero, support burden scales with users, and revenue does not — the standard OSS trap, made worse here by the absence of an enterprise buyer.

**Blunt implication:** "open-source runtime, monetize later" is the default founder answer and it is the weakest part of a Manifest pitch. If you go OSS, the monetization story must be **certification/compliance (accessibility procurement, VPAT, Section 508), OEM licensing to a device maker, or clinical/reimbursement** — not a cloud tier.

---

## 7. Z Fellows — the facts

**What it is:** a **1-week** program (mostly virtual, final day in-person SF or NYC) run by **Cory Levy**, angel investor. Not an accelerator in the YC sense — closer to a curated mentor sprint plus a nominal check.

**Terms (from zfellows.com, current):**
- **$10,000, optional** — you can participate with no money and no equity
- **$1B valuation cap**, converts to stock at your next priced round. At a $1B cap, $10k converts to ~0.001% at cap — **economically negligible dilution.** This is a brand/network play by Levy, not an equity play.
- **10 builders per cohort**; rolling applications, no deadline, multiple cohorts/year
- Solo founders and teams both accepted; **no requirement to drop out, quit a job, have an incorporated company, or relocate**
- Reapplication after rejection is explicitly encouraged

**Who gets in:** "technical builders of all ages" — high schoolers, dropouts, college students, people with full-time jobs. **The selection bias is toward the individual builder, not the market.** Application is ~8 questions.

**Alumni outcomes (per Z Fellows' own site — self-reported, survivorship-biased):** Cursor ($60B), Cognition ($26B), Etched ($5B), Mach ($1.8B), Whop ($1.6B), Aaru, Avoca ($1B each). Mentors drawn from Netflix, Instacart, DoorDash, Figma, Tinder, Vercel, Eventbrite.

**Acceptance rate: UNVERIFIED.** Z Fellows does not publish it and I found no credible figure. Given 10 seats per cohort, several cohorts per year, and no application deadline, the true rate is almost certainly low single-digit percent or below — but **do not cite a number.**

**The honest strategic read:** Z Fellows is essentially free optionality. $10k at a $1B cap is not capital — it is a credential and a warm-intro network. Two UW–Madison students with three working demos are a *very* on-profile applicant. **The bar you must clear is "these two build fast and are technically real," not "this is a $10B market."** That is a much easier bar than a seed round, and you should optimize the application for it accordingly.

---

## 8. What I could NOT verify

- **Merge Labs $252M / $850M valuation / OpenAI-led** — from a single secondary aggregator. No primary source fetched. Treat as unconfirmed.
- **Emotiv's "20% royalty above 1,000 users or $250k revenue"** — appears in secondary sources; **not present in the primary Developer License Agreement text I fetched.** The primary text only establishes: 1 commercial seat, and a separately-negotiated Distribution License Agreement with unspecified fees.
- **Neuralink Series E investor list and exact date** — Neuralink's own page did not render the body content; investor list and June 2, 2025 date come from secondary sources (TechCrunch, SiliconANGLE, Bloomberg headline).
- **Precision Neuroscience 2025 round size/valuation** — pharmaphorum reports "$102m"; I could not confirm the date, lead, or whether this is the Series C. PitchBook/CBI pages are paywalled.
- **Neurable's actual revenue, unit sales, or valuation** — none disclosed. The $35M Series A is reported by one aggregator (startuphub.ai), not a primary press release. **Neurable has never disclosed MW75 Neuro sales figures, which is itself informative.**
- **Z Fellows acceptance rate, applications per cohort, current cohort cadence, and whether alumni "outcomes" reflect participation before or after those companies succeeded.** Unverified.
- **Any rigorous data on time-to-revenue for open-source hardware-adjacent middleware.** My §6 conclusions are reasoned from precedent, not measured.
- **NextMind acquisition price** and whether Snap still ships any NextMind-derived tech. Undisclosed.
- **Search budget for this session was exhausted (200/200 WebSearch calls)** before I could run primary-source checks on Neurable, Merge Labs, and Z Fellows FAQ pages. Several items above would likely resolve with 3–4 more searches.

---

## SO WHAT FOR MANIFEST

1. **Kill the "we'll build our own EMG model" line from the pitch, or reframe it hard.** Meta shipped a calibration-free, motor-unit-resolution sEMG decoder trained on 300+ participants at $799 retail in Sept 2025, and open-sourced the dataset. Two students claiming they'll build a better general EMG model is the fastest way to lose a technical investor's respect. The survivable version: *"Meta solved able-bodied wrist EMG and open-sourced the data. Nobody has solved it for users whose motor units are atypical — high SCI, ALS, CP — and Meta's product envelope structurally excludes them. We start from their data and specialize."*

2. **Your Emotiv dependency will be found in diligence — disclose it first.** You own threshold + hysteresis on top of a vendor classifier, on hardware you don't make, under a license granting one commercial seat and requiring a negotiated distribution agreement you don't have. Lead with the honest version and with what you *do* own (the modality-agnostic vocabulary abstraction + dwell/cooldown layer + UI). Investors forgive thin moats in students; they do not forgive discovering one you concealed.

3. **The comps say your realistic exit is acqui-hire by a platform, and you should price that into the story, not hide it.** CTRL-labs → Meta (~$1B) is the *good* outcome. Leap Motion raised $94M and sold for ~$30M, then was sold for parts. NextMind sold for an undisclosed (read: small) sum. Naqi Logix, your nearest live competitor, is funding via Reg A+ crowdfunding at a self-set $126M valuation — institutional VCs declined to price it. **A "$100B input-layer platform" narrative will get you dismissed; a "we are the accessibility-native input layer, and the platform owners will need one" narrative is defensible.**

4. **Stop pitching neurotech VCs. Pitch accessibility capital and non-dilutive money.** Neurotech VC dollars are ~72% late-stage, medical-device, FDA-pathway money — you are not that. Your actual fit list is short and specific: **Adaptation Ventures** (new, May 2025, ≥$250k checks, disabled founders, explicitly built for this gap), **Amazon Alexa Fund** (already in Cognixion), **K Ventures**, plus **NSF/NIH SBIR** and university/UW–Madison SALE-adjacent grants. Cognixion — the single closest comp, non-invasive BCI for communication disability — took **7 years and ~$29M across 8 rounds** and is still doing regulatory work. That is your realistic timeline, and it is not a venture-scale curve.

5. **Z Fellows is nearly free optionality — apply immediately, and optimize for the right thing.** $10k at a $1B cap is ~0.001% dilution and the money is optional. Ten seats, rolling applications, reapplication encouraged, no relocation or dropout required. Selection is on *builder quality*, not market size. **Your application should be three working demos and evidence of shipping speed — including the failed motor-imagery study, stated plainly.** A 0.563 balanced-accuracy result you ran, diagnosed against a 0.711 public-dataset control, and then correctly abandoned is a *stronger* signal to this specific selector than any TAM slide. Same for rejecting SSVEP on photosensitivity grounds — that is judgment, and judgment is what a one-week mentor program is actually selecting for.

6. **Do not build the open-source-runtime-monetize-later business model.** There is no hosted-service burden to sell in a client-side decoder — no Atlas equivalent. Every hardware-adjacent OSS precedent (OpenBCI, LSL, BrainFlow) has adoption without revenue. If you open-source, the revenue story must be **accessibility procurement/compliance (Section 508, VPAT), OEM licensing to a device maker, or a clinical/reimbursement path** — pick one and name it, or expect the question to end the meeting.

---

## Sources

- [Z Fellows — official site](https://www.zfellows.com/) (fetched 2026-07-19)
- [TechCrunch — "Z Fellows offers $10k…"](https://techcrunch.com/2020/12/29/zfellows-offers-10k-to-stop-what-youre-doing-for-a-week-and-work-on-a-side-project/) (Dec 29, 2020)
- [Neuralink — Series E announcement](https://neuralink.com/updates/neuralink-raises-650m-series-e/) (Jun 2025)
- [TechCrunch — Neuralink closes $650M Series E](https://techcrunch.com/2025/06/02/elon-musks-neuralink-closes-a-650m-series-e/) (Jun 2, 2025)
- [SiliconANGLE — Neuralink $650M at ~$9B pre-money](https://siliconangle.com/2025/06/02/neuralink-raises-another-650m-reported-9b-pre-money-valuation/) (Jun 2, 2025)
- [Sacra — Synchron funding profile](https://sacra.com/c/synchron/)
- [pharmaphorum — Precision Neuroscience raises $102m](https://pharmaphorum.com/news/neuralink-rival-precision-raises-102m-and-other-financings)
- [CNBC — Paradromics first human implant](https://www.cnbc.com/2025/06/02/neuralink-paradromics-human-implant.html) (Jun 2, 2025)
- [Tech Startups — Paradromics / NEOM strategic investment](https://techstartups.com/2025/02/12/neurotech-startup-and-neuralink-competitor-paradromics-secures-investment-from-saudi-arabias-neom/) (Feb 12, 2025)
- [StartupHub.ai — Neurable $35M Series A](https://www.startuphub.ai/ai-news/funding-round/2025/neurable-funding-validates-consumer-bci-with-35m-series-a/) (Dec 27, 2025)
- [New Market Pitch — Neurotech funding analysis 2025–26](https://newmarketpitch.com/blogs/news/neurotech-funding-analysis)
- [Meta — Reality Labs sEMG research in Nature](https://www.meta.com/blog/reality-labs-surface-emg-research-nature-publication-ar-glasses-orion/) (2025, fetched 2026-07-19)
- [Meta Newsroom — Ray-Ban Display + EMG wristband](https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/) (Sep 2025)
- [AppleVis — blind user's review of Meta Neural Band](https://applevis.com/forum/assistive-technology/meta-ray-ban-display-neural-band-blind-users-honest-take-future-wearable)
- [EMOTIV Developer License Agreement](https://id.emotiv.com/eoidc/privacy/doc/developer-license/) (fetched 2026-07-19)
- [EMOTIV Cortex API docs](https://emotiv.gitbook.io/cortex-api)
- [TechCrunch — Leap Motion plays its final hand](https://techcrunch.com/2019/05/30/once-poised-to-kill-the-mouse-and-keyboard-leap-motion-plays-its-final-hand/) (May 30, 2019)
- [Road to VR — Ultrahaptics acquires Leap Motion for ~$30M](https://roadtovr.com/ultrahaptics-acquires-leap-motion-reported-30m/)
- [Sifted — Ultraleap sold for parts after layoffs](https://sifted.eu/articles/tencent-ultraleap-sold-for-parts-news) (2025)
- [Road to VR — Ultraleap layoffs / restructuring](https://roadtovr.com/hand-tracking-ultraleap-layoff-2024/) (2024)
- [SharpBrains — Halo Neuroscience closes, Flow acquires assets](https://sharpbrains.com/blog/2021/02/19/neuromodulation-developer-halo-neuroscience-closes-its-doors-flow-neuroscience-acquires-assets/) (Feb 19, 2021)
- [CB Insights — Snap acquires NextMind](https://www.cbinsights.com/research/snap-acquires-nextmind-nextmind-competitors-ctrl-labs-muse-neurable-neurosky/)
- [Undark — Tech companies getting into neuroscience (CTRL-labs ~$1B)](https://undark.org/2023/02/16/tech-companies-are-getting-into-neuroscience-should-we-worry/) (Feb 16, 2023)
- [audioXpress — Naqi Logix closes acquisition of Wisear](https://audioxpress.com/news/neural-interface-earbuds-naqi-logix-closes-acquisition-of-wisear) (closed Jan 29, 2026)
- [Kingscrowd — NAQI Logix on StartEngine 2025](https://kingscrowd.com/naqi-logix-on-startengine-2025/)
- [TechCrunch — Cognixion raises $12M](https://techcrunch.com/2021/11/16/cognixion-raises-12m-to-build-its-brain-monitoring-headset-for-people-with-disabilities/) (Nov 16, 2021)
- [PR Newswire — Cognixion $12M round](https://www.prnewswire.com/news-releases/cognixion-raises-12-million-to-advance-assisted-reality-tech-for-millions-affected-by-communication-disabilities-301425035.html)
- [Neurofounders — Neurotech Investor Map](https://www.neurofounders.co/resources/investor-map) (fetched 2026-07-19)
- [TechCrunch — Adaptation Ventures launch](https://techcrunch.com/2025/05/20/adaptation-ventures-is-a-new-angel-investor-group-focused-on-disability-and-accessibility-tech/) (May 20, 2025)
- [Perkins School for the Blind — 8 venture funds fueling DisabilityTech](https://www.perkins.org/championing-innovation-8-venture-funds-fueling-disabilitytech/)
- [Tracxn — Assistive Tech market & investment trends](https://tracxn.com/d/sectors/assistive-tech/__1thMI1y-lLgapPWHy5m686FoqmHcuv5UQtZUM--KqgE)
- [PostHog — How we monetized our open source devtool](https://posthog.com/blog/open-source-business-models)
- [Neurotech Reports — VC outlook / US science funding cuts](https://www.neurotechreports.com/pages/publishersletterFeb25.html)


---

# Non-flicker EEG paradigms — was dropping SSVEP right?

# Non-Flicker EEG Paradigms: Was Dropping SSVEP Right?

**Research brief — adversarial posture. Prepared 2026-07-19.**

**Bottom line up front:** Dropping SSVEP was correct, but the reasoning given (photosensitive-seizure risk) is the *weakest* of the three available reasons and the easiest for a technical investor to poke a hole in. The two stronger reasons are: (1) the EPOC X physically lacks the electrode coverage that makes SSVEP good, and (2) SSVEP is gaze-dependent, so it is an expensive, flickery way to acquire information a webcam already gives you for free. Separately — and this is the harder news — the same electrode-topology argument that kills SSVEP on this hardware also kills motor imagery, and the published literature independently reproduces your 0.563 failure. **EEG on the EPOC X is not a near-term product surface for control. It is a dead end for now, and you should say so out loud rather than hedge.**

---

## 1. The photosensitivity question: real, but it is a compliance problem, not a physics wall

### What the primary literature actually says

The governing document is the Epilepsy Foundation of America expert consensus (Harding, Wilkins, Erba, Barkley, Fisher), *Epilepsia* 46(9):1423–1425, 2005. Verified by reading the paper directly. Its operative thresholds:

- A flash is a hazard when **all** of: luminance change ≥ 20 cd/m², rate > 3 flashes/second, and concurrent flash area subtending > **0.006 steradians** (≈ one quarter of the central 10° of visual field; ≈ 25% of a TV screen at ≥2 m).
- A transition to or from **saturated red** is a risk irrespective of luminance.
- "Single, double, or triple flashes in 1 s are acceptable."
- Patterns: > 5 light–dark stripe pairs if the pattern oscillates/reverses contrast, > 8 if static, with lightest stripe > 50 cd/m² and duration ≥ 0.5 s. **This is directly relevant — it is the checkerboard-vs-solid question, and checkerboard/striped SSVEP targets fall under the pattern rule, not just the flash rule.**

Dose-response, quoted from the paper's rationale section (Jeavons & Harding, 170 patients): "only 3% of patients would be at risk with flashes at a rate of three per second or fewer. Above that flash rate, the probability of producing a photoparoxysmal response increased rapidly, reaching 10% at 10 flashes/s."

⚠️ **Skeptical read on that last figure:** 10% at 10 Hz is markedly lower than the commonly repeated claim that ~50% of photosensitive individuals respond in the 15–20 Hz band. I could not reconcile these within budget. Treat "peak risk 15–25 Hz, peak ~16–18 Hz" as the defensible consensus statement and do not cite a specific response percentage.

Restricting flash area to 0.006 sr "would provide protection for ~60% of the population at risk" — i.e. **area mitigation alone leaves 40% of susceptible users exposed.** That is a number worth internalizing before anyone proposes "we'll just make the targets small."

### Prevalence and the modern-display caveat

The 2024 gap analysis (Wood et al., *ACM TACCESS* 17(3), DOI 10.1145/3694790): the standard estimate is **1 in 4,000 with photosensitive epilepsy**, but estimates of the population showing a photoparoxysmal response range **0.3%–8%**. Female:male ≈ 1.5–2:1, peak onset 8–25 (**squarely your demographic**), usually persisting into adulthood. Five overlapping international standards exist (Ofcom, NHK-JBA, ISO, ITU-R, W3C/WCAG 2.3.1). The authors note risk has *decreased* with modern flicker-free displays but *increased* with brighter phones, closer viewing distances, and head-mounted displays.

### Verdict on the risk itself

**The risk is real but it is overstated as a blocker.** Every mitigation you listed works and is documented: stay >30 Hz, keep flash area under 0.006 sr, low contrast/low amplitude depth, avoid red, avoid oscillating stripe patterns, screen users. A funded team could ship a WCAG-2.3.1-conformant SSVEP interface. **If you tell an investor "we dropped SSVEP because of seizure risk," a neurotech-literate one will say "so use 40 Hz and low modulation depth" and you will have no answer.** You need the better reasons below.

Where the safety argument *does* hold up unambiguously is the part you can't engineer away: **you cannot screen users of a consumer accessibility product.** An accessibility-first company shipping a UI that is contraindicated for an unscreenable fraction of its own target population is a positioning contradiction, not just a liability. That is the version of this argument that survives contact.

---

## 2. What you actually gave up: much less than the headline numbers suggest

SSVEP is the highest-throughput non-invasive paradigm in existence. But the numbers that make that true were **never available on your hardware.**

The best dry-electrode SSVEP result I verified (Zhang et al., *Sensors* / PMC6168577, 2018-10-02): **93.2 ± 5.74% accuracy, 92.35 ± 12.08 bits/min**, 12 classes, 1-second stimuli, 11 subjects, ~4 min calibration. Achieved with **8 electrodes at PO5, PO3, POz, PO4, PO6, O1, Oz, O2.**

The EPOC X montage (verified on emotiv.com/products/epoc-x, saline felt — note: **not dry**): AF3, F7, F3, FC5, T7, P7, **O1, O2**, P8, T8, FC6, F4, F8, AF4.

**Intersection with the high-performing SSVEP montage: two electrodes out of eight. No Oz. No PO ring.** You have the two worst-placed members of the set and none of the midline coverage that carries most of the visual-cortex signal.

An Emotiv SSVEP result of "95.83 ± 3.59% accuracy, 22.85 ± 1.85 bits/min, 5.25 s detection time" appears in the literature (⚠️ search-snippet only, source not fetched — treat as UNVERIFIED). Even taking it at face value: **~23 bits/min and a 5-second dwell.** That is roughly a quarter of the dry-electrode state of the art and slower than your existing MediaPipe nose-yaw path. You did not give up 92 bits/min. You gave up, at best, ~23 bits/min with mandatory flicker.

### The argument that actually ends the debate

**SSVEP is gaze-dependent.** Its output is "which target is the user foveating." You already ship a webcam FaceLandmarker gaze proxy that answers the same question — locally, in-browser, at zero marginal hardware cost, with no flicker, no electrodes, no cap, no gel, and no seizure exposure.

Adopting SSVEP would mean requiring a $500-class headset and a flickering screen to recover a signal a laptop camera already provides. **That is the reason to lead with.** It is not a safety hedge; it is an architecture judgment, and it makes you look like you understand your own stack.

---

## 3. The alternatives, ranked by how much they help you

| Paradigm | Best verified perf. | On consumer/dry hardware | Calibration | Gaze-free? | Flicker-free? | Verdict for Manifest |
|---|---|---|---|---|---|---|
| SSVEP | ~93%, 92 bpm (8-ch dry occipital) | Needs POz/Oz ring — **EPOC X lacks it** | ~4 min | No | **No** | Correctly dropped |
| c-VEP | 76%, **46 bpm** dry; 84%, ~112 bpm gel | Yes, but 15 electrodes, Oz reference | **125–259 s** | No | **No** | See below |
| P300 | Emotiv "significantly worse than medical"; ITR ~5–7 bpm ⚠️ | Works, poorly | Per-session | Partly | No (flashes) | Too slow |
| Motor imagery | **0.17–0.36 on 6 classes, κ≈0** on EPOC X | **Fails** | Long | Yes | Yes | **Dead** |
| ErrP | 89% single-trial, AUC 0.90 (research-grade) | Unverified on consumer | Yes | Yes | Yes | Secondary only |
| Alpha / eyes-closed | — ⚠️ UNVERIFIED | Plausible (O1/O2 present) | Minimal | Yes | Yes | 1 bit, hostile UX |
| Attention/engagement | **60.5%** (Emotiv) | Yes, unusably noisy | Vendor black box | Yes | Yes | Not a control signal |
| Blink | 75.6% (Emotiv) | Yes | Minimal | Yes | Yes | **This is EOG, not EEG** |

### c-VEP — correct a misconception before you build on it

**c-VEP is not a non-flicker paradigm.** It modulates target luminance with a pseudorandom binary m-sequence at the display refresh rate. It has no dominant low-frequency component, which plausibly lowers photoparoxysmal risk relative to a 15 Hz square wave, but it is still full-contrast luminance modulation in the central visual field. I found **no source establishing c-VEP as seizure-safe** — do not assume it inherits SSVEP's mitigations for free. It is also equally gaze-dependent, so the argument in §2 applies unchanged.

Its verified numbers (Nagel & Spüler, *PLOS ONE*, 2017-02-22; 12 subjects, 32 targets, **15 g.Sahara dry electrodes referenced to Oz**): dry = 75.9%, 46.2 bit/min; gel = 84%, ~112 bit/min. **Dry electrodes cost roughly 60% of the bitrate.** Calibration 125–259 s per user. Requires an Oz reference the EPOC X does not have.

### Motor imagery — your failed study was reproduced, and the cause is your hardware

This is the most important finding in the brief. Ferreira et al., *Frontiers in Neuroinformatics*, 2025-08-12, DOI 10.3389/fninf.2025.1625279 — 7 subjects, **Emotiv EPOC X specifically**, 8–13 Hz bandpass + CSP + SVC, 6 classes:

- Test accuracy **0.17–0.36**; training accuracy 0.48–0.62 (textbook overfitting)
- "Cohen's Kappa coefficient was slightly higher than zero in most cases" — **chance**
- Conclusion: extending multiclass MI on the EPOC X **"is not feasible"**
- Attributed cause: **"absent central electrodes (C3, C4) critical for capturing motor cortex activity"**

Your 0.563 balanced accuracy vs 0.711 on a public control dataset is exactly this result. **You did not run a bad study. You ran a correct study on a headset with no electrodes over the motor cortex.** Confirmed against the montage above: no C3, no Cz, no C4.

The actionable consequence: **no model architecture, no data-collection effort, and no amount of subject training will fix this.** Sensorimotor rhythms are focal over central scalp; AF3/F7/T7 do not observe them. Anyone who tells you "more data would fix it" is wrong, and you can now cite a 2025 paper saying so. Stop spending on this.

### ErrP, alpha, and attention metrics

**ErrP** is genuinely interesting (89% single-trial, AUC 0.90; ~49% spelling-speed improvement in a gaze-independent speller — Schmidt et al. / PMC3315432) but it is structurally a **veto channel**: it can cancel an action, never initiate one. It multiplies the value of a working primary channel and is worth exactly zero when you don't have one. Also ⚠️ unverified on consumer hardware.

**Attention/engagement**: Maskeliunas et al., *PeerJ*, 2016-03-22 — Emotiv EPOC scored **60.5%** on attention/meditation recognition, and the authors found "high variability and non-normality of attention and meditation data, which makes each of them difficult to use as an input to control tasks," with **BCI illiteracy affecting up to 50% of users on low-cost devices.** They conclude consumer EEG is "only suitable for a beginner level brain signal measurement and research."

Note the sharpest detail in that paper: **blink detection scored 75.6% — the best result of any signal tested — and blinks are an EOG artifact, not EEG.** The most reliable thing a consumer EEG headset measures is not brain activity.

### The hybrid answer, and the fact that you already built it

The same PeerJ authors' recommendation, having concluded consumer EEG is unusable alone: **combine EEG with other input modalities such as gaze tracking.**

That is a description of your current architecture. Webcam gaze for continuous navigation + facial EMG for discrete selection is not a stopgap you fell into — it is the configuration the skeptical literature recommends. ⚠️ I could not verify specific quantitative results for EOG+EEG or EMG+EEG fusion systems (search budget exhausted); treat the hybrid claim as directionally supported, not numerically.

---

## 4. Sources

- Harding G, Wilkins AJ, Erba G, Barkley GL, Fisher RS. "Photic- and Pattern-induced Seizures: Expert Consensus of the Epilepsy Foundation of America Working Group." *Epilepsia* 46(9):1423–1425, 2005. https://www.epilepsy.com/sites/default/files/atoms/files/Epilepsia%20vol%2046%20issue%209%20Photosensitivity.pdf — *read in full (PDF)*
- Wood et al. "International Guidelines for Photosensitive Epilepsy: Gap Analysis and Recommendations." *ACM TACCESS* 17(3), 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11872230/ — *fetched*
- W3C. "Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold." https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- Ferreira et al. "Motor imagery-based BCIs: multiclass MI control for Emotiv EPOC X." *Frontiers in Neuroinformatics*, 2025-08-12. https://pmc.ncbi.nlm.nih.gov/articles/PMC12378764/ — *fetched* — **most important source here**
- Nagel S, Spüler M. "A high-speed BCI using dry EEG electrodes" (c-VEP). *PLOS ONE*, 2017-02-22. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0172400 — *fetched*
- Zhang et al. "A High-Speed SSVEP-Based BCI Using Dry EEG Electrodes." 2018-10-02. https://pmc.ncbi.nlm.nih.gov/articles/PMC6168577/ — *fetched*
- Duvinage et al. "Performance of the Emotiv Epoc headset for P300-based applications." *BioMedical Engineering OnLine* 12:56, 2013-06-25. https://pmc.ncbi.nlm.nih.gov/articles/PMC3710229/ — *fetched*
- Maskeliunas et al. "Consumer-grade EEG devices: are they usable for control tasks?" *PeerJ*, 2016-03-22. https://pmc.ncbi.nlm.nih.gov/articles/PMC4806709/ — *fetched*
- Schmidt et al. "Online detection of error-related potentials boosts the performance of mental typewriters." https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3315432/
- EMOTIV EPOC X product specifications. https://www.emotiv.com/products/epoc-x — *fetched 2026-07-19*
- "Improving user experience of SSVEP BCI through low amplitude depth and high frequency stimuli design." *Scientific Reports*, 2022. https://www.nature.com/articles/s41598-022-12733-0 — *paywall-redirected; snippet only*
- "DIY hybrid SSVEP-P300 LED stimuli for BCI platform using EMOTIV EEG headset." arXiv:2508.01510, 2025-08-02. https://arxiv.org/abs/2508.01510 — *abstract only; no accuracy figures published in abstract*

---

## 5. What I could NOT verify

1. **SSVEP-on-Emotiv performance.** The "95.83% / 22.85 bits/min" figure is search-snippet only; I could not fetch the source. Do not cite it.
2. **SSVEP absolute state of the art.** I could not fetch Chen et al. 2015 PNAS (403). The ~267 bits/min / 40-target figure is from memory, not verified this session. **Do not put it in a deck.**
3. **The 10%-at-10-Hz dose-response** conflicts with widely repeated higher figures. Unresolved.
4. **Quantitative EOG+EEG / EMG+EEG hybrid results** — search budget exhausted. The hybrid recommendation is qualitative only.
5. **Alpha-blocking / eyes-closed as a control signal on consumer hardware** — no source found. My "physiologically plausible on O1/O2" claim is inference, not evidence.
6. **Emotiv Cortex licensing and raw-EEG paywall tiers, and EPOC X price** — the product page omits both and the API page 404'd. **This is a live commercial risk you should independently confirm**, since your working Emotiv path depends on Cortex.
7. **Whether c-VEP has any published photosensitivity safety assessment.** I found none. Absence of evidence, not evidence of safety.
8. **Exact P300 accuracy percentages on Emotiv** — the 2013 paper reports only p-values and effect sizes; the "~7 bits/min" ITR is snippet-level.

---

## SO WHAT FOR MANIFEST

1. **Change the SSVEP story immediately.** Stop leading with seizure risk — it is the rebuttable reason and it makes you sound cautious rather than sharp. Lead with: *"SSVEP is gaze-dependent. We already get gaze from a webcam for free. Paying $500 and a flickering screen to re-acquire a signal we already have is bad architecture — and it's contraindicated for part of the accessibility population we exist to serve."* Same decision, and now it is unassailable.

2. **Kill the motor-imagery line permanently, in writing, and cite Frontiers 2025.** The EPOC X has no C3/Cz/C4. Your 0.563 is reproduced independently at chance level with the conclusion "not feasible." This converts your biggest apparent failure into your best credibility asset: you ran an experiment, it falsified a plan, you cite the literature that agrees, you killed the workstream. That is exactly what a Z Fellows reviewer wants to see from a technical founder. Bury it and it looks like you never checked.

3. **Say plainly that EEG is not a control surface for you in this hardware generation.** Not "early," not "in progress" — not viable. Every verified consumer-EEG control result in this brief is either gaze-dependent (so redundant with your webcam), chance-level (MI), unusably noisy (60.5% attention, 50% illiteracy), or is secretly EOG (blinks, 75.6%). If EEG returns, it returns with different hardware and a stated electrode requirement (occipital ring for c-VEP, central for MI). Put that condition in writing now so re-entry is a decision, not a drift.

4. **Your own-EMG-model plan is the right call — and it needs a hardware answer you don't have yet.** Facial EMG genuinely is well-served by the EPOC X's frontal/temporal sites (AF3/AF4/F7/F8/T7/T8), so escaping Emotiv's `fac` classifier is achievable. But be ready for the obvious question: *if you're building an EMG company, why are you using an EEG headset?* Dedicated EMG hardware is cheaper, higher-SNR, and less absurd to wear. Have a real answer — "the headset is the substrate our users already have" or "we're hardware-agnostic and EPOC X is subject #1" — or the plan looks like sunk-cost attachment to a device that has now failed you twice.

5. **Watch the "BCI" label.** You currently ship a webcam gaze proxy and threshold logic on top of a *vendor's* classifier, with zero trained models of your own. Calling that a brain-computer interface to investors is an overclaim that a technical diligence call will find in about four minutes. "Modality-agnostic biosignal input runtime" is both accurate and a *better* story — it makes the EEG failure evidence of the thesis (modalities get swapped when they don't work) rather than evidence against it.

6. **Confirm the Emotiv Cortex licensing terms this week.** I could not verify whether raw EEG and `fac` access sit behind a paid or revocable license tier. Your only working headset path depends on a vendor API whose commercial terms are undocumented on their public pages — and your stated goal is to reduce dependence on that exact vendor. Find out what happens to your demo if the license tier changes.


---

# Analogous "runtime/standard" plays and how they won or died

# Analogous "Runtime / Standard" Plays — What Actually Happened

**Assigned dimension:** Is "be the open runtime + stable contract + device adapters + certification, monetize later via support/OEM/cert" a viable company strategy for a two-person team?

**Verdict up front: No. Not as stated.** Across every analogue I could verify, the open runtime was never the business. It was either (a) a loss-leader funded by a platform owner whose money came from somewhere else, (b) a consortium function funded by member dues from incumbents, or (c) a grant-funded academic/volunteer project with no company attached at all. I found **zero** examples of a venture-scale company whose revenue came from owning a device-abstraction runtime. The closest things to counterexamples are consulting shops (Collabora, Igalia) — services businesses, not standards businesses — and hardware companies that give the software away (OpenBCI).

Worse for Manifest specifically: the platform-absorption risk isn't a future risk. **It already happened, twice, to both of the things that work in the repo today.**

---

## 1. The structural pattern: who actually pays for a successful runtime

| Standard/runtime | Who created it | Who paid | Did anyone build a *company* on being the standard? |
|---|---|---|---|
| **LSP** | Microsoft (VS Code team), announced with Red Hat + Codenvy 2016-06-27 | Microsoft | **No.** LSP is free. Microsoft monetized VS Code's ecosystem position, not the protocol. |
| **OpenXR** | Khronos consortium, 1.0 in 2019 | Member dues from Meta, Google, Sony, Valve, Qualcomm, MSFT, HTC… | **No.** Khronos is a nonprofit. Conformance is a membership benefit, not a P&L. |
| **OpenVR/SteamVR** | Valve (proprietary) | Valve, from Steam store revenue | **No** — and Valve *surrendered* it. Since 2020 Valve recommends OpenXR over its own API; the SteamVR plugin was deprecated in Unreal Engine 5.1. |
| **MediaPipe** | Google | Google (Apache 2.0, free) | **No.** It's a funnel into Google's ML/Edge stack. |
| **Matter / CSA** | Alliance founded by Amazon/Apple/Google/Zigbee members | Member dues + per-product cert fees | **No company** — the *alliance* has cert revenue (numbers below), because Apple/Google/Amazon agreed the mark matters. |
| **Lab Streaming Layer (LSL)** — the closest domain analogue | Swartz Center for Computational Neuroscience, UCSD, started 2012 | **Army Research Office (W911NF-10-2-0022), NINDS R01NS047293, Swartz Foundation gift**; maintained by volunteers | **No.** 14 years, 2,300+ citations, 150+ supported device classes, 8 language bindings — and no company, ever. |
| **SCIP** (Sourcegraph's code-index format) | Sourcegraph, a funded company | Sourcegraph VC money | **No** — Sourcegraph *gave it away* to independent open governance on 2026-03-25, steering committee from Meta and Uber. |
| **OpenBCI** | Startup, founded 2013 | Hardware sales | **Software: no. Hardware: barely.** ~$3.83M raised across ~11 years; ~$4M annual revenue reported by third-party aggregators (see caveats). |

The pattern is not subtle. **The runtime layer is a cost center that incumbents fund to commoditize each other.** It converts into revenue only for someone who already sells the complement — an editor, a store, an OS, a chip, or a box.

### The one repeatable startup-scale model: contract engineering
Collabora and Igalia sustain themselves by being paid to implement and maintain open standards *for the platform owners* — Collabora is literally the org behind **Monado**, the open-source OpenXR runtime, and appears on Khronos's conformant-products list alongside Qualcomm. That is a real, durable business. It is also a **consulting firm**: headcount-linear revenue, no equity multiple, and the customer list is exactly the set of companies who would otherwise absorb you. (I could not verify their revenue figures — flagged below.)

---

## 2. Absorption precedents — concrete, and already aimed at Manifest

This is the part that should change decisions.

**(a) Apple absorbed the camera-gaze layer on 2024-05-15.** Apple shipped **Eye Tracking** in iOS/iPadOS 18: front-facing camera, on-device ML, calibration in seconds, Dwell Control, works across all apps, **no additional hardware**. Same release added **Vocal Shortcuts** (custom sounds → actions, explicitly for cerebral palsy/ALS/stroke users) and **Switch Control with camera-based finger-tap recognition**.

Manifest's working feature (a) is a webcam nose-yaw gaze proxy driving dwell-based navigation. Apple shipped the strictly better version of that — first-party, calibrated, system-wide, free — **two years ago**, to the exact user Manifest is targeting. This is not "the platform owner might absorb the standard later." It's already absorbed.

**(b) Meta absorbed the sEMG layer, twice.** Facebook acquired **CTRL-labs** on 2019-09-23 for a reported **$500M–under $1B**. Then on 2025-07-23/24, Meta published in *Nature* — *"A generic non-invasive neuromotor interface for human-computer interaction"* — a wrist sEMG decoder that **generalizes to new users with no per-user calibration**, trained on thousands of participants, and released ~100 hours of sEMG data. It ships in the Neural Band with Meta's HUD glasses (~Oct 2025, ~$1,000–1,400).

Manifest's *stated current intent* is "build our own EMG model and collect our own training data." Meta spent six years and up to a billion dollars on precisely that problem and published the result. A two-person team's data-collection effort is not a differentiator against a cross-user generic model that is already in a shipping consumer product.

**(c) Apple simply refuses standards it doesn't want.** Apple is **absent from the entire OpenXR conformant-products list** (which contains Meta, Google, Sony, Valve, Microsoft, Qualcomm, HTC, ByteDance, Magic Leap, Varjo, Canon, NVIDIA, Acer). Vision Pro uses ARKit/RealityKit. A near-universal consortium standard backed by every other major XR player **could not compel the most valuable platform owner to adopt it**. If Khronos can't, Manifest can't.

**(d) The browser device-adapter path is structurally blocked on Apple.** WebKit's tracking-prevention policy explicitly names **Web Bluetooth, WebUSB, and WebHID** among features it will not implement, citing fingerprinting and security concerns with no path to resolution. Any "open runtime + device adapters, in the browser" story is dead on iOS/Safari by policy, not by engineering effort.

**(e) Your live dependency deprecates on its own schedule.** Google **ended support for MediaPipe Legacy Solutions on 2023-03-01**. Some were migrated; **Objectron, KNIFT, AutoFlip, Box Tracking, Instant Motion Tracking, MediaSequence and YouTube-8M were discontinued outright**, with code left "on an as-is basis." Manifest's working feature (a) sits on MediaPipe tasks-vision; feature (b) sits on Emotiv's proprietary classifier. Neither dependency owes you a roadmap.

---

## 3. Certification as a revenue model — the actual numbers

Manifest's plan lists certification as a monetization path. Here is what certification revenue looks like when it works.

**Connectivity Standards Alliance (Matter), verified from csa-iot.org:**
- Promoter: **$112,500/yr** (+ one-time initiation) — board seat
- Participant: **$21,500/yr** — working-group vote
- Adopter: **$7,500/yr** — spec access, no vote
- Associate: **$0** — white-label cert only
- Per-product certification: **$2,000** (Promoter/Participant) / **$3,000** (Adopter); derivatives $1,500–$2,500; Associate white-label **$2,500 + $500/yr per product**

**Khronos, verified from khronos.org/members:**
- Promoter **$90,000/yr**, Contributor **$22,000/yr**, Non-profit **$9,000/yr**, Associate **$4,000/yr minimum** ($220/employee, ≤100 employees), Academic **$1,000/yr**. **Only Promoter and Contributor tiers have votes.**

Two conclusions:

1. **Certification revenue is downstream of market power, not upstream of it.** CSA can charge $2–3k per product because Apple, Google and Amazon agreed their ecosystems interoperate with the mark. The fee is rent on someone else's distribution. Nobody pays to be "Manifest Certified" until Manifest controls access to something they need.
2. **The unit economics are bad even if it works.** At $2–3k/cert you need ~1,000 certifications a year to clear $2–3M gross — a scale reached by an alliance representing the entire smart-home industry. This is a trade-association business model, not a startup one.

And note the governance trap: Manifest could afford Khronos **Associate** ($4k) — which explicitly carries **no vote**. Buying a seat at a standards table you can't steer is the worst of both worlds.

---

## 4. Why LSP succeeded — and why it's the wrong template

LSP is the standard everyone cites, so it's worth being precise about *why* it worked, because none of the causes are available to Manifest:

1. **The creator already owned a dominant client.** Microsoft shipped VS Code. Every language server built for LSP made VS Code more valuable. The standard was a weapon in a product war, not a product.
2. **The abstraction was chosen at the *easy* level.** LSP standardized document URIs and cursor positions — deliberately *not* ASTs — because editor-level primitives are genuinely universal. Manifest's proposed abstraction (left/right/select/back/home) is similarly minimal, which is the one genuinely smart thing in the plan. But…
3. **…LSP solved an N×M problem that was already painful for paying parties.** Dozens of real editors × dozens of real languages, all with existing users. Manifest's N×M is *a handful of biosignal devices × a handful of apps*, where most cells are empty and no one is currently in pain.
4. **Nobody monetized it.** Not Microsoft, not Red Hat, not Codenvy (Codenvy was acquired by Red Hat; the protocol was never the asset).

The OpenXR pace data is the other warning: **five years between 1.0 (2019) and 1.1 (2024)**, during which the ecosystem fragmented into vendor-specific extensions that 1.1 then had to absorb. Standards move on geological timescales relative to a pre-seed runway. Z Fellows is a **one-week, ~$10k** program. The mismatch between "convene a standard" and "10 weeks of runway" is not a detail.

---

## 5. The domain-specific verdict: LSL already is what Manifest wants to be

This is the single most important precedent and it deserves its own heading.

**Lab Streaming Layer is the incumbent open biosignal transport standard.** Started 2012 at UCSD's SCCN. Funded by the **Army Research Office, NINDS, and the Swartz Foundation**. **2,300+ scientific citations** by mid-2025. **150+ supported device classes.** Bindings in Python, MATLAB, C/C++, Java, C#, JavaScript, Rust, Julia. Supported by BCI2000, OpenViBE, and BrainFlow. Maintained by **volunteers**, with deliberate near-zero churn in the core.

So: the "open runtime + stable contract + device adapters" position in biosignals **is occupied, has been for 14 years, is more mature than anything two people will build, and produced no company.** BrainFlow occupies the adjacent abstraction. Both are free.

If Manifest's pitch is "we'll be the runtime," the first informed question from any neurotech-literate investor is *"how is this different from LSL/BrainFlow, and why did neither of them become a business?"* There is currently no answer to that in the ground-truth brief. The honest answer — "LSL is a research transport, we're a consumer-app intent layer with dwell/cooldown/UX semantics" — is a real distinction, but it's a distinction that makes Manifest an **app-layer product**, not a standard.

---

## What I could NOT verify

Be aware: **this session hit its web-search budget (200/200) after four search batches**, so several intended lines of inquiry were cut off. Direct fetches still worked; the gaps below are genuine.

- **Emotiv Cortex API commercial terms.** Three URL attempts returned 404. **I could not verify** whether Emotiv's developer/ToS agreement permits building a commercial product on Cortex, imposes fees or revenue share, restricts competing products, or allows unilateral termination. **This is the highest-priority unverified item in the whole brief** — Manifest's only working EMG path runs on top of a vendor classifier under terms nobody here has read.
- **ONNX governance/funding** (Microsoft+Facebook origin, LF AI & Data stewardship) — not researched; searches exhausted before reaching it.
- **ALSA / PipeWire / libinput maintainer employment.** I assert from background knowledge that these are staffed by Red Hat employees, but **I did not verify this in this session.** Treat as unconfirmed.
- **Collabora and Igalia revenue, headcount, and customer mix.** Not verified. The Collabora Monado blog fetch returned empty. Khronos's conformance list does show "Qualcomm/Collabora (Monado)," which corroborates the *relationship* but not the business model.
- **Tobii financials.** Q1 2026 revenue of SEK 164.0m (−17% YoY), −13% over three years, Q4 2025 miss with a 26% stock drop — these come from **Investing.com and Simply Wall St summaries, not from Tobii's filings**. Directionally consistent across sources, but not primary-verified. The causal claim "Apple's built-in eye tracking hurt Tobii" is **my inference, not a sourced fact** — the reported pressure is in *automotive* driver monitoring vs. Seeing Machines and Smart Eye.
- **Sourcegraph layoffs / "pre-PMF regression."** Sourced only to Glassdoor and Blind — **anonymous, low-reliability**. The SCIP open-governance handoff (2026-03-25) is verified from Sourcegraph's own blog; the company-distress narrative is not.
- **OpenBCI's ~$4M revenue** is from third-party aggregators (Growjo/Owler-class sources), not filings. The **$3.83M raised** figure is from Crunchbase/Tracxn-class aggregators. Treat both as order-of-magnitude only.
- **"400+ language servers"** comes from a single low-authority source (zylos.ai). Directionally plausible; not primary.
- **The Nature sEMG paper itself** is paywalled behind an IDP redirect; I sourced its claims from UploadVR's report of it. Accuracy percentages and the size of the personalization delta were **not obtained** — worth getting, because "how much does per-user fine-tuning still help?" is the one number that determines whether Manifest's own-data plan has any residual value.
- **No verification of whether any AAC/assistive-tech reimbursement channel** (insurance/Medicare-funded speech-generating devices) would pay for a software input layer. I flag this only because it is the one place in accessibility where real money demonstrably moves, and it was not researched.

---

## Sources

- [Language Server Protocol — Wikipedia](https://en.wikipedia.org/wiki/Language_Server_Protocol) — MS/Red Hat/Codenvy announcement 2016-06-27 (fetched 2026-07-19)
- [Protocol History — microsoft/language-server-protocol wiki](https://github.com/microsoft/language-server-protocol/wiki/Protocol-History)
- [Khronos Membership tiers & fees](https://www.khronos.org/members/) (fetched 2026-07-19)
- [Khronos OpenXR conformant products](https://www.khronos.org/conformance/adopters/conformant-products/openxr) — dates July 2020–April 2026; Apple absent (fetched 2026-07-19)
- [OpenXR 1.1 Brings Foveated Rendering & More Into The Spec — UploadVR](https://www.uploadvr.com/openxr-1-1/) — 1.0 (2019) → 1.1 (2024-04-15)
- [Google & Pico Adoption Further Cements OpenXR… With One Major Holdout — Road to VR](https://www.roadtovr.com/google-android-xr-pico-openxr-industry-standard-apple/)
- [SteamVR — Transitioning To OpenXR (Valve, Steam News)](https://store.steampowered.com/news/app/250820/view/2522527900755718763)
- [CSA-IOT membership tiers & certification fees](https://csa-iot.org/become-member/) (fetched 2026-07-19)
- [MediaPipe Solutions guide — legacy deprecation 2023-03-01](https://developers.google.com/edge/mediapipe/solutions/guide) (fetched 2026-07-19)
- [Apple Newsroom — new accessibility features including Eye Tracking, 2024-05-15](https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/)
- [Control iPhone with the movement of your eyes — Apple Support](https://support.apple.com/guide/iphone/control-iphone-with-the-movement-of-your-eyes-iph66057d0f6/ios)
- [WebKit Tracking Prevention Policy — Web Bluetooth/WebUSB/WebHID not implemented](https://webkit.org/tracking-prevention/) (undated on page)
- [Facebook to acquire CTRL-labs, 2019-09-23 — CNBC](https://www.cnbc.com/2019/09/23/facebook-announces-acquisition-of-brain-computing-start-up-ctrl-labs.html) / [SiliconANGLE, $500M–$1B](https://siliconangle.com/2019/09/23/facebook-buys-brain-reading-neural-interface-startup-ctrl-labs-500m-1b/)
- [Meta Details EMG Wristband Gestures… Nature Paper — UploadVR, 2025-07-24](https://www.uploadvr.com/meta-semg-wristband-gestures-nature-paper/); paper: [*A generic non-invasive neuromotor interface for human–computer interaction*, Nature, 2025](https://www.nature.com/articles/s41586-025-09255-w) (paywalled — not fetched)
- [The lab streaming layer for synchronized multimodal recording — PMC12434378](https://pmc.ncbi.nlm.nih.gov/articles/PMC12434378/) — funding, 2012 origin, 2,300+ citations, 150+ devices (fetched 2026-07-19)
- [BrainFlow vs LSL — brainflow.org, 2021-02-05](https://brainflow.org/2021-02-05-lsl-review/)
- [The future of SCIP — Sourcegraph, 2026-03-25](https://sourcegraph.com/blog/the-future-of-scip)
- [Announcing SCIP — Sourcegraph](https://sourcegraph.com/blog/announcing-scip)
- [OpenBCI — Crunchbase](https://www.crunchbase.com/organization/openbci) / [Tracxn](https://tracxn.com/d/companies/openbci/__eicsoy5wFtt_KIOQMjRmusxoYmslHdQOmP3fti4Rjqo) (aggregator data, unverified)
- [Tobii Q1 2026 earnings call transcript — Investing.com](https://www.investing.com/news/transcripts/earnings-call-transcript-tobii-q1-2026-sees-revenue-decline-stock-stable-93CH-4661873) / [Tobii Year-end report 2025 — MFN.se](https://mfn.se/a/tobii/year-end-report-2025-continued-weak-market-but-delivers-on-strategic-review-and-cost-reductions) (secondary)

---

## SO WHAT FOR MANIFEST

**1. Drop "be the open runtime" as the company thesis. It is not a company; it is a consortium function or a platform owner's loss-leader.** Every verified success (LSP, OpenXR, MediaPipe, OpenVR→OpenXR) was funded by an entity selling a complement. Every domain-adjacent attempt (LSL, BrainFlow) produced zero revenue over 14 years. Keep the open runtime as *engineering architecture and credibility* — it's good architecture — but if the Z Fellows pitch says "we monetize later via certification," a knowledgeable partner will read it as "we have not thought about revenue," and they will be right.

**2. Delete certification from the monetization story entirely, or move it to year 5+.** Verified fees: CSA charges $2–3k/product because Apple/Google/Amazon gate interoperability on the mark. Certification is rent collected on market power you do not have and will not have soon. Meanwhile even *joining* the relevant standards bodies at a tier with a vote costs $21.5k (CSA Participant) or $22k (Khronos Contributor) per year, and the $4k Khronos Associate tier explicitly has **no vote**.

**3. Your two working features have each already been absorbed by a platform owner — say so before an investor does.** Apple shipped free, system-wide, on-device camera Eye Tracking with Dwell Control on 2024-05-15 for exactly your accessibility user, no extra hardware. That is feature (a), better. Meta bought CTRL-labs for up to $1B in 2019 and published a calibration-free cross-user sEMG decoder in *Nature* in July 2025, now shipping in a $1,000–1,400 consumer product. That is the endpoint of your stated EMG roadmap, already reached at thousands-of-subjects scale. A pitch that doesn't name these two facts head-on reads as uninformed; a pitch that names them and explains what's left over reads as credible. **The leftover is the honest asset: cross-device, cross-vendor, works on hardware people already own, and not tied to a $1,400 glasses purchase or an iPhone.** That's a real wedge. It is a *product* wedge, not a *standard* wedge.

**4. Re-scope the "collect our own EMG training data" plan — it is currently your weakest bet, not your strongest.** Meta trained on thousands of participants and open-sourced ~100 hours. Two students cannot out-collect that, and the failed EEG motor-imagery study (0.563 balanced accuracy on EPOC-X vs 0.711 on a public control set) is evidence that your data-collection and modeling loop is not yet producing signal even on an easier problem. Before spending months on data collection, get the one number I couldn't: **how much does per-user personalization still improve over Meta's generic model?** If the answer is "barely," the own-model plan is dead and you should say so internally now rather than in month six.

**5. Read the Emotiv Cortex developer terms this week — I could not find them and this is a single point of failure.** Your only working EMG path is threshold logic on top of Emotiv's proprietary classifier, under an agreement nobody in this analysis has read. Find out: is commercial use permitted, at what fee, is there a revenue share, does it prohibit building competing/derivative classifiers, and can Emotiv terminate at will? If any answer is bad, feature (b) is not a demo you can build a company on. Precedent for why this matters: Google discontinued seven MediaPipe Legacy Solutions outright on 2023-03-01 and left the rest "as-is."

**6. If you keep a standards story at all, make it a *distribution* story and assume the browser path is half-blocked.** WebKit has publicly declined to implement Web Bluetooth, WebUSB, and WebHID over fingerprinting concerns — so "open runtime, device adapters, in the browser" does not reach iOS by policy. The camera path (getUserMedia + MediaPipe) *does* work everywhere, which is a strong argument to lean harder on the camera modality and treat headset/EMG adapters as demo-ware until a specific customer pays for one. And note the timescale you'd be signing up for: OpenXR took **five years** between 1.0 and 1.1. You have weeks.


---

# What disabled users actually want — demand-side evidence

# What Disabled Users Actually Want — Demand-Side Evidence Brief

**For:** Manifest founders (Kanuj Verma, Sami Beg)
**Date:** 2026-07-19
**Posture:** Adversarial. Facts that threaten the thesis are foregrounded. Nothing below is invented; unverified items are quarantined in their own section.

---

## 0. Headline

The demand-side literature does not say "disabled users are waiting for a modality-agnostic biosignal runtime." It says three uncomfortable things:

1. **The users who can drive Manifest's two working modalities (webcam head-yaw, Emotiv facial EMG) are largely the users who already have working, funded, clinically-supported access methods.** Eye-gaze acceptance in ALS is ~96% when recommended, with median 5 hours/day of real use.
2. **The users who genuinely have no good option — complete locked-in state, oculomotor failure, no head control — cannot use webcam head-yaw *or* facial-EMG clench either.** They are the hard tail, and Manifest's current stack fails them for the same reason eye-gaze does.
3. **The single strongest empirical predictor of assistive-tech abandonment is "lack of consideration of user opinion in selection."** Manifest has not talked to a single disabled user. That is not a gap in the go-to-market plan; it is the #1 documented failure mode, present at the design stage.

---

## 1. What the users actually say they want

### 1.1 They have told researchers their spec, and it is brutal

**Huggins, Wren & Gruis (2011), *Amyotrophic Lateral Sclerosis*, PMID 21534845** — survey of potential BCI users with ALS:
- Accuracy **≥90%** command identification satisfies 84% of respondents.
- Speed comparable to **≥15–19 letters/minute** satisfies 72%.
- Accidental exits from standby **no more than once every 2–4 hours** (84%).
- **84% would accept an electrode cap. 72% would accept outpatient surgery. 41% would accept surgery with a hospital stay.**

**Huggins, Moinuddin, Chiodo & Wren (2015), *Arch Phys Med Rehabil*, PMID 25721546** — same instrument, spinal cord injury (n with severe SCI; 96% expressed interest in BCI):
- **Emergency communication was the #1 priority task** (top-2 ranked by 43%).
- Desired accuracy **90%**; typing **>20 letters/minute**; standby errors ≤1 per 4 hours.
- **Median acceptable setup time: 10–20 minutes** (meets the needs of 65%).
- **Participants significantly preferred dry electrodes over gel or implanted electrodes (p<.05).**
- Users ranked "functions the BCI provides" and **"simplicity of BCI setup"** as the most critical design attributes.

**Read this against Manifest's own numbers.** The failed motor-imagery study returned 0.563 balanced accuracy on EPOC-X. The stated user bar is 0.90. That is not "needs more data" distance — that is a different category of system. And the Emotiv `fac` path is not Manifest's classifier at all; it is threshold logic on a vendor's proprietary labels, which means the accuracy bar is Emotiv's to hit, not yours.

### 1.2 The invasiveness result is the one that should sting

Two independent findings say non-invasive wearables are **not** the form factor users defer to:

- **72% of ALS respondents would accept outpatient surgery** (Huggins 2011).
- **Branco et al. (2025), PMID 40122080** — 19 parents/caregivers of children and young adults with *severe* cerebral palsy plus 36 healthcare professionals: majority interested in communication BCIs, with **"a slight preference for implanted electrodes over non-implanted ones."** No preference between visual-stimulus and sensorimotor-rhythm control strategies.

The intuition "non-invasive is obviously more acceptable, so that's the humane path" is not supported. Stakeholders who live with daily wearable burden appear to trade surgery for *not having to be set up every morning*. Manifest's positioning implicitly assumes the opposite.

### 1.3 What people in locked-in state actually report wanting

**Bruno et al. (2011), *BMJ Open*, PMID 22021735** — 65 chronic locked-in syndrome patients with valid self-assessed well-being data:
- **47 reported contentment** (median ACSA +3); 18 reported unhappiness (−4).
- Longer time in the condition correlated *positively* with happiness.
- Distress correlated with **anxiety, and dissatisfaction with mobility in the community, recreational activities, and recovery of speech production.**
- 58% declined resuscitation; only 7% requested euthanasia.

Note what the dissatisfaction list contains and does not contain. It is **community mobility, recreation, and speech** — not "navigating a computer shell." A pitch built on rescue-from-a-prison framing is empirically contested by the population it claims to serve, and disability advocates will say so.

---

## 2. Abandonment — the real numbers

| Source | Population | Rate |
|---|---|---|
| **Phillips & Zhao (1993)**, *Assist Technol* | General AT | **29.3% completely abandoned** |
| **Zangari & Kangas (1997); Johnson et al. (2006)**, via ASHA Practice Portal | AAC | **~one third** |
| **Guadie et al. (2026)**, *Disabil Rehabil Assist Technol*, PMID 41685813 | Mobility AT, Ethiopia | **36.4%** |
| **Swisa et al. (2026)**, PMID 41865382 | Customized pediatric AT | **37%** |
| **Spataro et al. (2014)**, PMID 24350578 | 30 advanced-ALS eye-tracking users | **23.3% low daily utilization** |
| **Wolpaw et al. (2018)**, *Neurology*, PMID 29950436 | Home EEG BCI, ALS | **Only 14/42 (33%) reached independent use** |

**Phillips & Zhao's four predictors of abandonment**, in order, are the ones that indict Manifest today:
1. **Lack of consideration of user opinion in selection** ← you are here
2. Easy procurement without proper evaluation
3. Poor device performance
4. Change in user needs/priorities

Abandonment peaks in **the first year**, and again after five.

**Johnson, Inglebret, Jones & Ray (2006), PMID 17114167** — 275 ASHA members, focus groups + survey. Abandonment drivers: *not maintaining/adjusting the system*, attitude, **lack of training, lack of support**, poor person–system fit. Success drivers were the mirror image: support systems, positive attitudes, good fit.

**The pattern across every one of these:** abandonment is overwhelmingly a **socio-technical support** failure, not a signal-processing failure. Manifest is optimizing the one variable that the abandonment literature says matters least.

### 2.1 A survivorship-bias warning you should apply to your own future data

**Borgestig et al. / Rytterström et al. (2024), *Ann Med*, PMC10916903** — 61 eye-gaze AT users (34 adults, 27 children; 52% cerebral palsy; mean 39 months of access). Psychosocial impact positive across competence, adaptability, self-esteem. **But only 2 participants (3%) reported non-use** — because the study sampled *current users*. The authors explicitly concede "non-users who abandoned the device might report other values."

Almost every glowing eye-gaze or AAC outcome study you will encounter has this shape. If Manifest runs a pilot and reports satisfaction among people still using it at month 3, that number is worth approximately nothing.

---

## 3. Setup burden and caregiver dependency — the actual daily reality

### 3.1 EEG cap adjustment is the documented #1 obstacle, not accuracy

**Zickler, Halder, Kleih, Herbert & Kübler (2013), *Artif Intell Med*, PMID 24080077** — user-centered usability testing of a P300 BCI application with end users with severe motor paralysis. Performance was fine (≥80% accuracy, NASA-TLX workload 5–49/100, users satisfied). The two barriers to daily-life adoption were:
1. System operability
2. **"The EEG cap, which required extensive support for adjustment"**

Conclusion verbatim: *"user-friendliness, specifically ease of use, is a mandatory necessity when bringing BCI to end users."*

### 3.2 Home BCI attrition

**Wolpaw et al. (2018), PMID 29950436** — 42 consented, 39 eligible, 37 assessed:
- **14 (33%) completed training and used it independently**, mainly for communication
- 12 (29%) lost to death/rapid progression
- 6 (14%) withdrew from **decreased interest**
- **9 (21%) could not operate the device at all**

Patients *and caregivers* were trained. Benefit was rated as exceeding burden by those who stayed. The authors' own scoping conclusion: BCIs currently suit people "severely disabled but otherwise in stable health" — a narrow slice.

### 3.3 The supply chain is a bigger blocker than the interface

**Funke et al., cited in Linse et al. (2018), *Front Neurol*, PMC6072854** — specialized ALS centers:
- **Only 61% of procured AAC devices were actually delivered.** Primary cause: insurance rejection.
- **Mean delivery latency: 93 days.**
- ~**5 hours of initial training** required, plus ongoing customization and support.

**Ball et al., same review:** 96% of ALS patients who were *recommended* AAC accepted it. The bottleneck is not desire. It is funding, clinician time, and delivery.

**Rao, N. (2024), Forbes, 22 Oct 2024** — the systemic argument, with a named disabled software engineer, Tabi Haly, who lost Medicaid for earning too much despite ~$800k/yr in disability-related costs (aide $300k, medication $350k, wheelchair $35k). SSI's income threshold is still the 1972 figure of $65/month; fewer than 10% of SSI beneficiaries work. BCI user **Nathan Copeland**: *"BCI Can Do Better."*

**Implication for Manifest:** a cheap consumer-hardware runtime is a genuinely differentiated answer to the *funding* bottleneck — that is the strongest demand-side argument you have, and it has nothing to do with signal processing. Lead with it.

### 3.4 Caregiver / communication-partner dependency shapes everything

- **ASHA Practice Portal (AAC):** *"Lack of family involvement in the AAC process is cited as a significant factor in device abandonment."* *"Partial or complete abandonment of AAC can occur when partner input is not considered."* Untrained partners default to yes/no questions and dominate conversation.
- **Perfect, Hoskin, Noyek & Davies (2020), PMID 30987518** — systematic review, eye-gaze AT in children/youth with complex disabilities: **"barriers could lead to rejection of the technology even when children were successful using the system,"** and **comprehensive professional and caregiver support was the primary facilitator of success.**
- **Kögel, Schmid, Jox & Friedrich (2019), PMID 30845952** — scoping review of 73 empirical BCI social-research studies: 71 address the user perspective, but there is a documented **"lack of focus"** on the caregiver's, and little in-depth work on the BCI user's self-experience.

---

## 4. Does Manifest's hardware fit these users' daily reality?

### 4.1 Emotiv EPOC-X: saline, not dry

From Emotiv's own product page (fetched 2026-07-19): **"Refillable Research-Grade Saline Sensors"**, "saline soaked felt pads", ships with 60 ml saline and an 80-piece felt pack, requires **periodic rehydration** and **felt replacement**. Battery 9h (USB dongle) / 6h (BLE). Rotating headband. Setup time is **not published**.

Now overlay the user requirement: **SCI users significantly preferred dry electrodes over gel (p<.05); median acceptable setup 10–20 minutes** (Huggins 2015). Saline felt sits on the wrong side of that preference. And someone has to do the wetting, the placement, the impedance check — a person with high-cervical SCI or advanced ALS cannot. **Every morning, a caregiver becomes a prerequisite to the user having a voice.** That is precisely the dependency Zickler flagged as the #1 daily-life barrier.

**This is a hard product fact, not a nitpick.** If the answer is "we'll move to dry electrodes," that is a hardware roadmap you do not currently have and cannot execute on a $10k Z Fellows check.

### 4.2 Webcam head-yaw: the slowest access channel measured

**Koester & Arthanat (2018), *Disabil Rehabil Assist Technol*, PMID 28845735** — systematic review, 39 studies, 248 subjects with physical disabilities:
- **Median text entry rate across all methods and populations: 7.0 wpm**
- **By body site: fingers (bilateral) 17.72 wpm > … > hand (non-typing) 3.95 wpm > head 2.92 wpm (slowest measured)**
- By diagnosis: **cerebral palsy 5.5 wpm (slowest)**; SCI high-cervical 10.1; SCI low-cervical 13.3; muscular dystrophy 12.5
- Experience level (LowPlus / Medium / High) produced **very similar** rates — practice does not rescue a slow channel

Two consequences:
1. **Head-based control is the worst-performing modality in the published record.** MediaPipe nose-yaw is a head-based modality.
2. **Camera Mouse already exists and is free** — head/facial-feature webcam tracking for computer access, still being evaluated in CP as of 2024 (**MacLellan et al. 2024, PMID 37699111**). Manifest's working webcam demo is not a new capability in this market; it is a re-implementation with a nicer shell.

### 4.3 Where eye-gaze genuinely fails — and whether Manifest covers it

Documented eye-gaze failure modes (Linse et al. 2018, PMC6072854; Spataro et al. 2014):
- Oculomotor dysfunction and ophthalmoparesis in ALS (a predictor of severely impaired communication)
- **Total locked-in state: 11.4% prevalence in tracheostomy-ventilated ALS** (Hayashi & Oppenheimer)
- Infrared sensitivity to ambient light (severely limits outdoor use)
- Glasses reflections, astigmatism, irregular corneal deformation, nystagmus, strabismus
- The Midas-touch problem
- Eye fatigue — the leading cited reason for the 23.3% low-utilization group

**Then ask: which of these does Manifest's stack solve?** A person with ophthalmoparesis or TLIS in advanced ALS also has failing facial musculature and no reliable head control. Webcam yaw is out. Jaw-clench is out or unreliable. The population where eye-gaze fails is largely *not* addressable by either working modality.

Meanwhile **Spataro et al. (2014)**: 30 advanced-ALS eye-tracking users, **median actual daily use 300 minutes (IQR 100–720)**, median device possession 15 months, used for family communication, internet, email, social media. That is a strong, entrenched incumbent — not a vacuum.

### 4.4 The vocabulary mismatch

Users asked for **>20 letters/minute** and ranked **emergency communication first**. Manifest's vocabulary is left / right / select / back / home — five commands, driving a carousel. Five commands via scanning gets nowhere near 20 lpm, and "home" is not an emergency call. The constraint is defensible engineering; it is *not* yet mapped to the function users ranked #1. Nothing in the repo (Movies, Snake, Smart Room) is an emergency-communication path.

---

## 5. Community attitudes toward BCI and toward projects like this one

### 5.1 The "Disability Dongle" critique is aimed directly at you

**Jackson, Haagaard & Williams (2022), "Disability Dongle," Platypus / CASTAC blog, 19 April 2022** — the coinage explicitly targets **design and engineering students prototyping "innovative" disability solutions**:

> *"Disability Dongles are contemporary fairy tales that appeal to the abled imagination by presenting a heroic designer-protagonist whose prototype provides a techno-utopian (re)solution."*

> *"The design process of creating a Disability Dongle isn't actually about producing an assistive device… it's about producing an idea of what disability is."*

> *"A dongle is an adaptor and a Disability Dongle is adaptive; both are created to make their subject compatible with a normative system."*

Their three named failure modes:
1. **Lack of fluency** — locating the problem in disabled bodies rather than in systemic barriers
2. **Knowledge extraction without benefit** — recruiting disabled people to test prototypes that never ship, converting their labor into designer prestige
3. **Perpetual replication** — re-inventing the same concept as novel

Manifest currently matches the template on all three counts: two non-disabled students, a demo-shaped artifact, no disabled collaborators, and a webcam head-tracker that reproduces Camera Mouse (2007). **If a disability-community account of any size sees your Z Fellows pitch before you have disabled co-designers, this is the frame it will be read in.** That is a reputational risk with a real, non-trivial probability, and it is cheap to eliminate *now* and expensive to reverse later.

### 5.2 Substantive advocacy criticism of neurotech, distinct from hype fatigue

- **Michigan Daily opinion, "Brain chip development occurs at the expense of disabled people"** (fetch returned HTTP 429; content summarized only from search snippets — see unverified section): eligibility for Neuralink's trial requires a reliable caregiver, implying BCIs will not be accessible to low-resourced quadriplegic people; the company has not positioned BCIs to complement low-cost supports or accessible public infrastructure.
- **STAT News, 5 Jan 2026** — Neuralink's public rhetoric about machine–human symbiosis and healthy-human implantation "diverges sharply" from its clinical work with ALS and quadriplegia, and this reportedly harms competitors seeking FDA approval and insurance coverage for medical BCIs. (Paywalled; only the free lede was retrievable.)

### 5.3 "Nothing about us without us" — the operational expectation

The literature has moved past co-design as a nice-to-have:

- **Branco, Pels, Nijboer, Ramsey & Vansteensel (2023), PMID 34383613** — surveyed **28 people with locked-in syndrome, 29 caregivers, and 28 BCI researchers**. All three groups aligned on *which applications* were most desired (direct, private communication). They **diverged significantly on the mental strategies users should employ to control the BCI, and on when users want to be informed about cBCIs.** Conclusion: research agendas must be realigned to end-user and caregiver needs.

That divergence is the finding to internalize. Researchers and users agree on *the goal* and disagree on *the control paradigm*. Manifest has chosen a control paradigm (facial EMG, head yaw, a 5-command grammar) with zero user input. The literature says that is exactly where designer intuition breaks.

- **Oliveira et al. (2025), PMID 41092418** — the current methodological standard: collaborative design workshops with 17 stroke survivors, 13 clinicians, 3 engineers, producing recommendations centered on individualized preferences, daily-living-based tasks, and sensory customization.

---

## 6. Sources

All fetched or searched 2026-07-19.

**Peer-reviewed / primary**
- Phillips B, Zhao H (1993). Predictors of assistive technology abandonment. — https://pubmed.ncbi.nlm.nih.gov/10171664/ (via PubMed search result page: https://pubmed.ncbi.nlm.nih.gov/?term=%22assistive+technology%22+abandonment+predictors+Phillips+Zhao)
- Huggins JE, Wren PA, Gruis KL (2011). What would BCI users want? Opinions and priorities of potential users with ALS. *ALS*. PMID 21534845 — https://pubmed.ncbi.nlm.nih.gov/21534845/
- Huggins JE, Moinuddin AA, Chiodo AE, Wren PA (2015). What would BCI users want: opinions and priorities of potential users with spinal cord injury. PMID 25721546 — https://pubmed.ncbi.nlm.nih.gov/25721546/
- Blain-Moraes S, Schaff R, Gruis KL, Huggins JE, Wren PA (2012). Barriers to and mediators of BCI user acceptance: focus group findings. *Ergonomics*. PMID 22455595 — https://pubmed.ncbi.nlm.nih.gov/22455595/ (8 people with ALS, 9 caregivers; relational factors > personal factors)
- Wolpaw JR et al. (2018). Independent home use of a BCI by people with ALS. *Neurology*. PMID 29950436 — https://pubmed.ncbi.nlm.nih.gov/29950436/
- Vansteensel MJ et al. (2024). Longevity of a BCI for ALS. PMID 39141854 — https://pubmed.ncbi.nlm.nih.gov/39141854/ (7 years independent home use; failed via neurodegeneration, not hardware)
- Zickler C, Halder S, Kleih SC, Herbert C, Kübler A (2013). Brain Painting: usability testing per user-centered design in end users with severe motor paralysis. PMID 24080077 — https://pubmed.ncbi.nlm.nih.gov/24080077/
- Branco MP, Pels EGM, Nijboer F, Ramsey NF, Vansteensel MJ (2023). BCIs for communication: preferences of individuals with locked-in syndrome, caregivers and researchers. PMID 34383613 — https://pubmed.ncbi.nlm.nih.gov/34383613/
- Branco MP, Verberne MSW, van Balen BJ et al. (2025). Stakeholder's perspective on BCIs for children and young adults with cerebral palsy. PMID 40122080 — https://pubmed.ncbi.nlm.nih.gov/40122080/
- Kögel J, Schmid JR, Jox RJ, Friedrich O (2019). Using BCIs: a scoping review of studies employing social research methods. PMID 30845952 — https://pubmed.ncbi.nlm.nih.gov/30845952/
- Bruno MA, Bernheim JL, Ledoux D, Pellas F, Demertzi A, Laureys S (2011). Self-assessed well-being in chronic locked-in syndrome: happy majority, miserable minority. *BMJ Open*. PMID 22021735 — https://pubmed.ncbi.nlm.nih.gov/22021735/
- Linse K, Aust E, Joos M, Hermann A (2018). Communication Matters — Pitfalls and Promise of Hightech Communication Devices in Palliative Care of Severely Physically Disabled Patients with ALS. *Front Neurol*. — https://pmc.ncbi.nlm.nih.gov/articles/PMC6072854/
- Spataro R, Ciriacono M, Manno C, La Bella V (2014). The eye-tracking computer device for communication in ALS. PMID 24350578 — https://pubmed.ncbi.nlm.nih.gov/24350578/
- Koester HH, Arthanat S (2018). Text entry rate of access interfaces used by people with physical disabilities: a systematic review. PMID 28845735 — https://pubmed.ncbi.nlm.nih.gov/28845735/
- Perfect E, Hoskin E, Noyek S, Davies TC (2020). Systematic review: outcome measures and uptake barriers, eye gaze AT in children/youth with complex disabilities. PMID 30987518 — https://pubmed.ncbi.nlm.nih.gov/30987518/
- Johnson JM, Inglebret E, Jones C, Ray J (2006). Perspectives of SLPs regarding success versus abandonment of AAC. PMID 17114167 — https://pubmed.ncbi.nlm.nih.gov/17114167/
- Rytterström P et al. / eye-gaze psychosocial impact study (2024). *Ann Med*. — https://pmc.ncbi.nlm.nih.gov/articles/PMC10916903/
- Characterizing eye gaze and mental workload for assistive device control (2025). *Wearable Technologies* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11894411/
- Guadie YG et al. (2026). Mobility assistive product abandonment, Ethiopia. PMID 41685813
- Swisa Y et al. (2026). User satisfaction and early abandonment of customized assistive devices for children. PMID 41865382
- MacLellan LE et al. (2024). Camera Mouse for computer access in cerebral palsy. PMID 37699111 — https://pubmed.ncbi.nlm.nih.gov/37699111/
- Oliveira I et al. (2025). Qualitative participatory design study, BCI/MI/VR in stroke rehab. PMID 41092418

**Practice / community / press**
- ASHA Practice Portal, Augmentative and Alternative Communication — https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/ (abandonment ~one third, citing Zangari & Kangas 1997; Johnson et al. 2006)
- Jackson L, Haagaard A, Williams R (2022-04-19). "Disability Dongle." Platypus, CASTAC — https://blog.castac.org/2022/04/disability-dongle/
- Rao N (2024-10-22). "Beyond Neurotech: Limits of BCI For People With Disability." Forbes — https://www.forbes.com/sites/naveenrao/2024/10/22/beyond-neurotech-limits-of-bci-for-people-with-disability/
- Jobus R. "'Behind Blue Eyes': Awakening the Lively Art of Conversation." ALS News Today — https://alsnewstoday.com/columns/speech-generating-devices-let-eyes-do-walking/ (first-person, 62-year-old engineer with ALS since 2007; fear of becoming "a communication black hole"; admits resisting AT too long, "mixed results")
- Emotiv EPOC-X product page — https://www.emotiv.com/products/epoc-x (saline felt sensors, rehydration, 80pc felt pack, 9h/6h battery)
- STAT News (2026-01-05), Neuralink medical device vs transhumanism — https://www.statnews.com/2026/01/05/neuralink-brain-computer-interface-medical-device-vs-transhumanism/ (paywalled)

---

## 7. What I could NOT verify

- **Emotiv EPOC-X real-world setup time.** Not published by Emotiv. The 10–20 minute user requirement is verified; EPOC-X's actual don-time is not. **You should measure this yourselves and publish it** — it is a concrete, cheap, differentiating data point.
- **Blain-Moraes 2012 verbatim participant quotes.** Only the abstract was retrievable (PMC full text 404'd). The "relational > personal factors" finding is verified; specific quotes about gel, cosmesis, or caregiver dependence are **not** — I have not read them and am not attributing them.
- **Murphy's qualitative HT-AAC non-acceptance study** ("nearly all 15 participants abandoned their communication aids"). This appeared only in a search-engine synthesis. I could not reach the primary paper. **Treat the "nearly all 15" figure as unverified.**
- **Zangari & Kangas (1997)** — the origin of the "~one third of AAC abandoned" figure. Verified only as a citation inside the ASHA portal, not read directly.
- **Michigan Daily piece** — fetch returned HTTP 429. Claims about Neuralink trial caregiver-eligibility requirements are from search snippets only.
- **STAT News (Jan 2026)** — paywalled beyond the lede; no participant or advocate quotes retrieved.
- **Direct, first-person disabled commentary specifically on non-invasive consumer-EEG products.** I found abundant commentary on *implanted* BCI (Neuralink) and on assistive design generally (Disability Dongle), but **no substantial disability-led critique corpus specific to consumer EEG headsets.** This may be a genuine gap in the discourse or a search limitation — my web-search budget was exhausted (200/200) after two queries, and the remainder of this brief was assembled via direct fetches. **Do not conclude from this brief that consumer-EEG-specific community sentiment is favorable; conclude that I did not find it.**
- **Quantified caregiver setup time** for eye-gaze/AAC systems in ALS. PubMed returned zero results for this combination. Multiple sources establish caregiver support is *essential* and is the primary facilitator/barrier; **none give minutes per day.** This is an unmet research gap and a legitimate thing for you to measure.
- **Whether disabled users would prefer a 5-command runtime over existing scanning/eye-gaze.** No study tests this. Genuinely unknown.

---

## SO WHAT FOR MANIFEST

**1. Your accuracy gap is not a gap, it is a chasm — stop presenting the EEG work as "in progress."**
Users specified ≥90%. You measured 0.563 balanced accuracy on EPOC-X (0.583 full-channel) against 0.711 on a known-good public control. That control number is itself below the user bar. The honest reading is that **the public-dataset ceiling for this paradigm is already under what users said they'd accept**, and your hardware is well below that. Reporting the failed study candidly is a strength in a Z Fellows conversation. Framing it as "early results" is the thing that will get you caught.

**2. Your saline headset is on the wrong side of a published, statistically significant user preference — and you have no path off it.**
SCI users preferred dry electrodes over gel *and* over implanted, p<.05, with median acceptable setup 10–20 min. EPOC-X requires saline-soaked felts, rehydration, careful placement, and consumable replacement — performed daily **by someone other than the user.** Zickler 2013 named EEG-cap adjustment as *the* barrier to daily-life adoption. **Either commit to a dry-electrode roadmap and cost it honestly, or drop EEG from the near-term story and say the Emotiv path is a research probe.** A $10k check does not buy a hardware pivot.

**3. Head-yaw webcam control is the slowest access method in the published record (2.92 wpm) and Camera Mouse has done it free since 2007.**
This is your most demo-able asset and your weakest differentiation. It is not a new capability. If it stays in the pitch, it must be positioned as **the zero-cost onboarding modality that requires no hardware purchase and no insurance claim** — which is a real, defensible advantage given that only 61% of procured AAC devices ever get delivered and mean latency is 93 days. Positioned as a technical achievement, it invites the comparison you lose.

**4. Talk to disabled users this month, before Z Fellows — not because it is good practice, but because it is the #1 documented predictor of the failure mode you are exposed to.**
Phillips & Zhao's leading abandonment predictor is *lack of consideration of user opinion in selection*. You are currently maximizing that variable. Concretely: contact your local ALS Association chapter, an AAC-focused SLP at UW Health, and Team Gleason. Target **5 structured conversations before you pitch.** "We ran five user interviews and here is the one thing that surprised us" converts a fatal objection into evidence of seriousness. It costs two weeks. There is no version of this that is not worth doing.

**5. You are probably wrong about *which* user you serve — and this is the single most likely failure.**
Your working modalities (webcam head-yaw, facial-EMG clench) both require **residual head and facial motor control.** People with that residual control are already reachable by eye-gaze, head mice, sip-puff, and switches — and eye-gaze is entrenched: 96% acceptance when recommended, median 300 min/day of real use, 15-month median possession. The people with a genuine unmet need — ophthalmoparesis, complete locked-in state (11.4% of tracheostomy-ventilated ALS), no head control in severe dyskinetic CP — **cannot use your modalities either, for the same reasons they cannot use eye-gaze.** Your addressable population may be the *overlap* of "already well-served" and "can afford it," which is close to empty. **Answer this explicitly before your pitch: name the specific user who can drive Manifest and cannot drive an eye-gaze system.** If you cannot name them, the product is not scoped yet.

**6. Reframe the wedge around cost and funding, and change the demo target from navigation to emergency communication.**
Two facts point the same direction. First, the bottleneck in this market is money and clinician time, not desire — 96% acceptance, 61% delivery, 93-day latency, ~$800k/yr disability costs, Medicaid cliffs. A **$0-hardware, webcam-based, works-today access layer** is a real answer to that. Second, SCI users ranked **emergency communication as the #1 priority task (top-2 by 43%)** — nobody ranked media carousels. Movies, Snake, and Smart Room demo well and answer no stated need. **Build the emergency-alert path.** It is a small feature, it maps to the single most-cited user priority in the literature, and it is the difference between a Disability Dongle and a product.
