# Manifest — Market & Competitor Memo

**Prepared 2026-07-19 · For: Kanuj Verma, Sami Beg · Posture: adversarial, founder-facing**

Sources: 12 research briefs + 8 adversarial fact-check verdicts. Where a verdict corrected a brief, the corrected fact is used and the correction is flagged inline. Every uncertain claim is marked UNVERIFIED.

---

## 1. Bottom line up front

**1. Your headline positioning — "modality-agnostic biosignal runtime that turns noisy signals into a tiny command vocabulary" — is a description of a thing Apple shipped in September 2025, and the fact-check found it is *not* gated to clinical partners.** Apple's BCI HID descriptor (developer.apple.com, availability metadata `iOS 26.0.0 -`) opens with: *"This document provides a reference for manufacturers of third-party brain-computer interface hardware devices."* It explicitly covers devices connected to an *"implanted **or external** brain wave sensor array."* 32 buttons, 22 named iOS actions, and a default mapping of **select / next / previous / menu** — your vocabulary, almost exactly. It is bidirectional (signal-quality 0–100 rendered as a UI overlay; UI context sent back to the device). No MFi, no entitlement, no NDA. If a Z Fellows partner opens that page, "we invented the biosignal-to-command runtime" dies in the room. **This is the single most important fact in this memo.**

**2. But Apple explicitly declined to build the part you'd actually be building.** Same page: *"It's up to the BCI hardware device manufacturer to decide how to interpret the relevant signals, and convert them to commands that the operating system can understand as user intent."* Apple shipped the *transport and the shell*. Nobody shipped the *decoder + arbitration policy* — dwell, cooldown, confidence gating, false-activation suppression, graceful failover. And as far as public record shows, **no non-invasive BCI vendor has shipped against this descriptor at all.** The door is unlocked and nobody has walked through it. That is a much narrower and much more honest claim than "the layer is empty," and it is defensible.

**3. Two of your three load-bearing technical premises are wrong in ways that change decisions — and one is wrong in your favor.**
- **Wrong against you:** "The EPOC-X physically cannot record EMG" is false. ISEK puts sEMG's lower bound at 5–10 Hz; the EPOC-X passband is 0.16–43 Hz; AF3/AF4 sit over frontalis and F7/F8/T7/T8 over anterior temporalis. `fac` is a **band-limited EMG classifier**, not an artifact hack. What you cannot do is *standards-compliant* sEMG — the 43 Hz corner throws away the spectral peak (~50–150 Hz) and all median-frequency information. Consequence: **a small pilot on hardware you already own is not wasted spend for a 5-command vocabulary.** Don't write off the EPOC-X on a physics claim that isn't true.
- **Wrong in your favor:** Medicare LCD L33739, revision effective **2024-10-01**, added: *"Eye tracking, gaze interaction and **electromyographic sensor** accessories for speech generating devices are covered when furnished to individuals with a demonstrated medical need."* And Policy Article A52469: *"Medicare will reimburse for speech generating **software only (HCPCS code E2511)** when installed on a general computing device."* The "no US payer reimburses browser software on a laptop" conclusion is **wrong**. The laptop is excluded (coded A9270); qualifying software on it is not.

**4. The thing that actually disqualifies you from reimbursement is trivially fixable and you should fix it.** E2511 requires *speech generating* software — "audible generation of words or phrases," optionally email/SMS/phone messaging. Your three built apps are **Movies, Snake, and Smart Room**. A52469 non-covered features explicitly names *"Hardware or software used to play games or music."* You are not blocked by architecture. You are blocked by having built a media carousel instead of a communication path. Meanwhile SCI users ranked **emergency communication as the #1 priority task** (Huggins 2015, top-2 by 43%). Build the speech/alert path; unbundle the games.

**5. "Build our own EMG model and collect our own training data" is your weakest roadmap item, and the fact-check tightened rather than loosened the numbers.** Meta's *Nature* 645:702 used **4,900** discrete-gesture, **6,627** handwriting, and **162** wrist participants (n=11,236 total), at up to **300 participants/day**. emg2qwerty's generic 100-user model scores **51.78% CER** against a ~10% usability threshold. Correction: that number is now stale — **SplashNet (arXiv:2506.12356, Jun 2025) reached 35.7% zero-shot on the identical 100-user data, from architecture alone.** Still ~3.5× worse than usable, so the conclusion holds, but a third of the gap fell to architecture in nine months with zero new subjects. Second correction: "two orders of magnitude" overstates. The forearm scaling curve (Eddy et al., Front. Bioeng. Biotechnol., 2024-09-23) hits **90% zero-shot at 150 subjects, ~15 min each, ~37.5 h total** for 6 discrete gestures. 150 subjects is a brutal recruiting problem for two people. It is not 4,900. Price it as expensive, not impossible — and note **no facial-EMG scaling curve has ever been published**, so the 150 figure is an extrapolation across different anatomy, channel count, and placement discipline.

---

## 2. The competitive map

| Layer | Who occupies it | Notes |
|---|---|---|
| **Sensor hardware — sEMG** | Meta (Neural Band, $799 bundled, Sept 2025), Wearable Devices/Mudra ($200 Link), OYMotion gForcePro+ (~$1,250, BrainFlow-native), MyoWare 2.0 (~$38/ch), Control Bionics NeuroNode | Meta is untouchable at scale. Everything else is cheap and available. |
| **Sensor hardware — EEG** | Emotiv (EPOC-X $999–1,199), OpenBCI (Cyton $1,249), Neurosity Crown ($1,499 + $29.99/mo), Muse, IDUN, PiEEG ($250–350, 8ch reported discontinued) | **BrainFlow supports all of these except Emotiv.** Emotiv is architecturally the odd one out. |
| **Sensor hardware — camera** | Every laptop and phone ever made | Zero cost, zero moat. |
| **Acquisition / transport** | **LSL** (MIT, 2012, ARO/NINDS-funded, 2,300+ citations, 150+ devices, volunteer-maintained, zero revenue in 14 years), **BrainFlow** (MIT, healthy, 6 releases in 5 months), **Apple BCI HID** (shipped iOS 26, open to third parties) | Three mature free options. This layer is settled and unmonetizable. |
| **Vendor decoder / classifier** | Emotiv Cortex `com`+`fac` (trainable per-user profiles), Neurosity Kinesis (`{probability, label, timestamp}`), Google MediaPipe FaceLandmarker (478 landmarks + 52 blendshapes), Meta's Nature decoder, Apple Head/Eye Tracking | **Every one of these is closed or vendor-locked. Each has a negative incentive to interoperate — the classifier *is* the moat.** |
| **Intent arbitration / policy** *(dwell, cooldown, confidence, failover, honest low-confidence states)* | **Effectively nobody, cross-vendor.** Apple's shell does host-side scanning but explicitly leaves decode to the device maker. playAbility (Windows, MediaPipe blendshapes → gamepad) is closest commercially. Wearable Devices' "Mudra Experience Studio," Neurable OEM licensing (2026), Pison OEM stack — all hardware vendors colonizing from below for *their own* hardware | **This is where Manifest sits, and it is the only genuinely thin cell in the table.** |
| **OS accessibility shell** | Apple Switch Control + BCI HID + Eye Tracking (iOS 18, 2024) + Head Tracking (iOS 26, 8 gestures, per-gesture slight/default/exaggerated thresholds); Android AccessibilityService + Camera Switches (6 gestures incl. look-left/look-right, Android 6+, preinstalled) | Free, preinstalled, hundreds of millions of devices. **Your entire command vocabulary is expressible in Android Camera Switches today with zero code.** |
| **Application / AAC** | Tobii Dynavox (FY2025 SEK 2,467m ≈ $260M, 68% GM, 1,010 FTE, ~400 insurance contracts), PRC-Saltillo (Unity/LAMP, 40-yr language moat), Smartbox (Grid 3, PE-owned since Jan 2026), Cognixion (FDA Breakthrough, CMS DME accreditation) | Reimbursement plumbing is the moat. TD spends **3.6× more on selling than R&D**. |

**Closest to you:** playAbility (camera→system input translator, commercial, further along on the camera path — and per the brief, under-researched; go look at it). Then Cognixion (accessibility BCI, but SSVEP and clinical). Then Control Bionics (EMG access switch — **and their outcome is your base rate: 21 years, A$6M revenue, A$21M market cap, −94% from ATH, still unprofitable**).

---

## 3. The five hardest questions you cannot currently answer

**Q1. "Why doesn't Apple's BCI HID protocol make you redundant?"**
- *Evidence that answers it:* Read the descriptor end-to-end (it's ~15 min via the DocC markdown endpoint — the HTML page is JS-rendered and returns nothing). Then build a proof: your webcam decoder emitting into Apple's descriptor as a BCI HID source on an iPhone. That reframes Apple from competitor to distribution channel.
- *Cost:* One week of reading + prototyping. Possibly a BLE HID microcontroller (~$50) if you can't do it in software. **Highest ROI item in this memo.**

**Q2. "Name the specific user who can drive Manifest and cannot drive an eye-gaze system or Android Camera Switches."**
- Both your working modalities require residual head *and* facial motor control. People with that control are already served by eye-gaze, head mice, sip-puff, switches — and eye-gaze is entrenched (Hemmingsson & Borgestig 2020: 63% daily, 33% weekly among respondents). People with genuinely no option (ophthalmoparesis, complete locked-in — 11.4% of tracheostomy-ventilated ALS) can't drive your modalities either.
- *Evidence:* 15–20 structured interviews with switch/AAC users, SLPs, and an ALS Association chapter. Target 5 before the Z Fellows pitch.
- *Cost:* Two weeks, ~$0. **If you cannot name this user, the product is not scoped.**

**Q3. "What is your license to ship?"**
- Emotiv Developer License Agreement §6.1 requires a separately negotiated Distribution License Agreement; Exhibit A's fee schedule is a literal unfilled bracket: `[Insert amount and calculation of the API License Fee below]`. The document is marked **"(deprecated)"** with no successor publicly indexed. *Correction to brief:* §6.2 carves out open source — free/OSS distribution requires **registration on Emotiv's free/OSS list**, not a negotiated DLA. And the **20% royalty is confirmed verbatim** on emotiv.com/pages/developer: *"regardless of who collects it, a 20% royalty will apply"* — triggered by **"Over 1000 users OR $250,000 in revenue"** (disjunctive; 1,000 users at zero revenue triggers it).
- *Evidence:* One email to Emotiv business development asking for (a) the current non-deprecated agreement, (b) whether `fac` on EPOC-X requires premium, (c) the actual API License Fee schedule.
- *Cost:* One email. Do it this week.

**Q4. "How much does per-user personalization still buy over a generic model?"**
- This is the number that decides whether your own-model plan has residual value. Meta reports 16% CER improvement from 20 min of personalization on top of a 6,527-person model. emg2qwerty: 35.7% zero-shot vs 5.5% fine-tuned (SplashNet). Nobody has measured this for *facial* EMG at any n.
- *Evidence:* Run the emg2qwerty/SplashNet pipeline yourself (benchmark use only — see Q5). Then a 10–15 subject facial pilot on the EPOC-X, which the fact-check confirms is *not* wasted spend for a 5-class problem.
- *Cost:* ~2 weeks compute + 3–4 months for the pilot including IRB.

**Q5. "Can you legally build on Meta's data?"**
- No, and the licenses are messier than any brief said. **emg2qwerty: LICENSE file is CC BY-NC-**SA**-4.0 while its own README says CC-BY-NC-4.0** — Meta contradicts itself; GitHub's API reports `NOASSERTION`. **emg2pose: CC BY-NC-SA 4.0**, plus a second NC layer via UmeTrack. **generic-neuromotor-interface: CC BY-NC 4.0** (plain, verified structurally — no §3(b)). All three NonCommercial. Whether ShareAlike reaches model weights is **untested and unresolved** — but irrelevant, because NC alone bars commercial use.
- *Evidence:* Settled. Cite them as benchmarks only; if you name emg2qwerty, use the ShareAlike reading, because claiming the permissive README string is what gets caught in diligence.
- *Cost:* $0. Just don't list them as a data advantage.

---

## 4. Threats to the thesis, ranked

### T1 — Platform-owner absorption of the runtime layer (Apple BCI HID)
**Severity: Critical. Horizon: already happened (shipped Sept 2025).**
Apple published a public HID descriptor making biosignal input a native category on iOS/iPadOS/visionOS, routed into Switch Control, open to any third-party BCI hardware maker including external (non-implanted) sensors. It is bidirectional and includes a signal-quality channel Apple already renders as a UI overlay — i.e. Apple owns the honest-confidence display surface you thought was your wedge.

**Honest response:** Stop competing with it; feed it. Apple explicitly left signal→intent decode to the device manufacturer. Position as *"we are the decoder that feeds Apple's transport, and the only one that also runs on macOS, Windows, Android, and the web."* Then note the historical precedent: OpenXR is a near-universal consortium standard backed by Meta, Google, Sony, Valve, Qualcomm, and Microsoft — **and Apple is absent from the entire conformant-products list.** If Khronos can't compel Apple, nobody can compel Apple. Which cuts both ways: your cross-platform claim is real, but iOS is Apple's on Apple's terms.

### T2 — Meta sEMG cross-user generalization vs the calibration thesis
**Severity: Critical for the EMG roadmap. Horizon: shipped; clinical gap closing 2026–28.**
*Nature* 645:702, calibration-free cross-user decoding, shipped at $799. Personalized models don't transfer across participants. Meta's own concession — *"unclear whether models trained on able-bodied participants will generalize to clinical populations"* — is your entire remaining technical differentiation, **and Meta is already funding CMU (spinal cord injury, 2024) and University of Utah (ALS, muscular dystrophy, CES Jan 2026) to close it.**

**Honest response:** "Per-user calibration of a gesture decoder" as core IP is dead — say it before a partner says it to you. Calibration survives as a UX surface, not a moat. Do **not** start a 150–5,000-subject data program as your next milestone. Note the *softening*: 150 subjects at 15 min each gets 90% zero-shot on 6 discrete gestures (Eddy 2024), and architecture is still moving the number (SplashNet, 51.8%→35.7% on identical data). If you ever build a model, it is a *specialization* on top of a public generic prior for a population nobody sampled — and you must say out loud that Meta's corpus is NC-licensed so that path needs a negotiated license.

### T3 — Emotiv dependency
**Severity: High. Horizon: bites the day you have traction.**
Confirmed: 20% royalty at >1,000 users **or** >$250k revenue, "regardless of who collects it." §6.1 requires a DLA you don't have; Exhibit A is a blank. The operative agreement is marked deprecated with no locatable successor. §10.2(g) prohibits accessing the API "to build a competitive product" — which is close to the literal text of your stated roadmap. §4.5 anti-fragmentation arguably covers your vendor-neutral event bridge. Emotiv is ~113 people, <$10M raised over ~15 years, latest financing event equity crowdfunding. They killed Cortex v1 in 2020 and forced Launcher-mediated login. **BrainFlow supports 15+ vendors and does not support Emotiv** — there is no adapter-swap migration; everything above the wire is throwaway. And they are the defendant in the world's only neurorights court loss (Chilean Supreme Court, Aug 2023, ordered to delete a claimant's brain data).

**Honest response:** Refactor now, while the codebase is small, so `fac` is one adapter behind a vendor-neutral interface — that also makes your "modality-agnostic" claim true instead of aspirational. Stop describing the roadmap as "replace Emotiv's classifier." Do any training-data collection on non-Emotiv hardware from day one so there is no factual claim your model derives from Cortex output. Also: **a motor-impaired user must complete a mouse-driven Emotiv Launcher authorization before your accessibility software accepts input.** That is an accessibility defect in your critical path that you cannot fix and should not defend.

### T4 — Camera path is commodity, and OS vendors ship the superset
**Severity: High for credibility, low for viability. Horizon: past.**
Apple iOS 26 Head Tracking: 8 gestures, mappable to any Shortcut, **per-gesture slight/default/exaggerated sensitivity** — that is a user-facing threshold control on a vendor classifier, i.e. exactly what you hand-rolled. Android Camera Switches: 6 gestures including look-left/look-right, preinstalled since 2021. Google Look to Speak (2020) is literally binary left/right gaze selection over a list. Camera Mouse (Boston College, 2007, 3M+ downloads) tracks *"a nostril or the tip of an eyebrow"* with dwell-to-click. **Google archived Project Gameface on 2025-09-05** — Apache-2.0, 633 stars, 41 open issues, last code push Aug 2024. Its Android feature set (cursor + per-expression thresholds + HOME/BACK/NOTIFICATIONS global actions) was a **superset of your five commands**, built on the same MediaPipe model you use.

Additional discomfort: your implementation doesn't use blendshapes at all — `hooks/use-face-gaze.ts` computes nose-vs-eye-line yaw with dwell and cooldown. And head-based control is **the slowest access method in the published record: 2.92 wpm** (Koester & Arthanat 2018, 39 studies, 248 subjects).

**Honest response:** Demote the camera demo from "differentiator" to "proof we can ship a real-time input loop, at zero hardware cost, cross-platform in a browser." The zero-cost angle is genuinely load-bearing given that **only 61% of procured AAC devices are ever delivered, at a mean 93-day latency** (Funke, via Linse 2018) — the bottleneck in this market is funding and clinician time, not desire. Also own the dependency symmetry: you depend on Google's FaceLandmarker (a "Solutions Preview" model whose flagship app Google abandoned) exactly as much as you depend on Emotiv. Two vendor dependencies, not one.

### T5 — AAC market structure and reimbursement
**Severity: High, but less fatal than the briefs concluded. Horizon: 2–4 years to first reimbursed dollar.**
The UK CMA's 2019 Tobii/Smartbox final report is the best free competitive analysis of this market that exists, and it is unkind: combined 60–70% UK share; market definition **explicitly excludes** tablets running AAC software because *"estimated diversion from dedicated to non-dedicated solutions is low"* and dedicated-AAC prices stayed flat for three years; barriers include reseller networks on 3-year agreements, per-country local presence, a language system (*"a highly specialised skill"*), and NHS supply approval. And ¶8.10: **Tobii's own entry model, submitted while arguing barriers were *low*, showed *"entry is not profitable at prevailing prices."***

*Correction to the briefs:* the reimbursement door is **not** closed. E2511 covers speech-generating software on a general computing device. L33739's 2024-10-01 revision explicitly covers **electromyographic sensor accessories**. The real bars are (a) generating audible speech, (b) not bundling games, (c) DMEPOS enrolment (CMS-855S, **$50,000 surety bond per NPI**, now annual accreditation), (d) HCPCS coding — and even that has a shortcut, since E2511 already exists, so you may need PDAC **code verification** (~65 days) rather than a new code (*"extremely difficult to obtain"*).

Also note Medicare FFS is the *smallest* payer here: derived from CMS's 2024 improper-payment data ($2.6M at an 18.1% rate) ⇒ **~$14.4M/yr in total Medicare FFS SGD payments nationally** (arithmetic, not a published CMS total, excludes Medicare Advantage). Tobii Dynavox's ~$195M of US revenue comes overwhelmingly from Medicaid, private insurance, schools, and self-pay. **Schools/IEP is the fastest channel — FAPE compels provision without a HCPCS code — but it's ~14,000 separately-procuring districts.**

### T6 — The demand-side premise is partly built on a misquote
**Severity: Medium, but it's a credibility landmine.**
If your deck says eye-gaze has high abandonment: the "one third" figure is **Phillips & Zhao 1993** (n=227, assistive technology *generally*, 29.3%, mobility aids most abandoned). The eye-gaze evidence points the other way. **Critical correction:** the widely-circulated quote *"no indications of over-prescription... rather than cases of abandonment"* is **fabricated** — the actual sentence in Hemmingsson & Borgestig 2020 (IJERPH 17(5):1639 — note: Hemmingsson is first author, two-author paper, not "Borgestig et al.") reads *"no indications of over-prescription were found. **Rather, the results indicate that people with less profound disabilities... do not receive the device.**"* That's about *under*-prescription. Do not use that quote.

Also: it is a **total-population survey with a 41% response rate** (171 respondents of 405 invited, 418 identified), not a census. The 63%/33%/4% figures are of respondents. The authors matched respondents and non-respondents on demographics but not on the outcome variable, so **treat 96% daily-or-weekly as an upper bound.** The "96% of ALS patients recommended AAC accepted it" figure is **UNVERIFIED** — presumably Ball, Beukelman & Pattee 2004, but it could not be retrieved; don't cite it until you have the PDF.

**The defensible wedge from that same paper, which is sharper than the effort statistic:** children **38% daily use vs adults 65%, p < 0.01**; 69% of parents said the device was used *"only to some extent or not at all"* relative to activity needs; 42% found the device effortful. **Pediatric/CP fit and effort reduction is a real, evidenced, under-served gap** — and it is where Tobii Dynavox is visibly weakest.

### T7 — "Disability Dongle"
**Severity: Medium reputational. Horizon: the moment you post publicly.**
Jackson, Haagaard & Williams (2022) coined the term aimed explicitly at *"design and engineering students prototyping innovative disability solutions."* Their three failure modes — lack of fluency, knowledge extraction without benefit, perpetual replication — currently describe you on all three counts: two non-disabled students, a demo-shaped artifact, no disabled collaborators, and a webcam head-tracker that reproduces Camera Mouse (2007). Cheap to eliminate now (talk to users, add disabled co-designers), expensive to reverse later. Phillips & Zhao's **#1 abandonment predictor is "lack of consideration of user opinion in selection"** — you are currently maximizing that variable at the design stage.

---

## 5. Where the genuine opening is

**The current positioning will not survive contact with an investor who knows the space.** Three of its four pillars are occupied: the runtime contract (Apple, shipped, open), the camera modality (Apple/Google/Camera Mouse), and calibration-free EMG (Meta). The fourth — "we'll build our own EMG model" — is the most expensive and least differentiated item on your roadmap.

What survives, in descending order of defensibility:

**A. The decoder + arbitration policy that feeds *somebody else's* transport.** Apple built the pipe and said in writing that interpreting signals into intent is the device maker's job. LSL deliberately refuses semantics (14 years, 2,300 citations, zero revenue — that refusal is a *choice*, repeatedly reaffirmed). BrainFlow stops at filtered signal. Emotiv and Neurosity ship intent APIs locked to their own hardware with a structural incentive never to interoperate. **Nobody sits between them.** But be honest about what that is: it's a *product* wedge, not a *standard* wedge. Standards businesses monetize badly — CSA charges $2–3k/cert only because Apple, Google, and Amazon agreed the mark matters; Khronos Associate membership costs $4k and carries **no vote**. Delete certification from the monetization story or move it to year 5+.

**B. Graceful multi-modal failover as a condition progresses.** This is the only claim in the entire research corpus that nothing else covers. Late-stage ALS: head control degrades, eyelids droop, medications alter pupils, oculomotor function fails. Dedicated AAC hardware answers this with multi-modal devices costing thousands. A layer that *degrades gracefully across modalities* — camera → EMG → switch — as one fails is a real unmet need. **Caveat, and it's a serious one: I constructed this thesis from clinical literature, not from user research. Nobody has validated it with a single user. Treat it as a hypothesis to test in the next 30 days, not a claim to pitch.**

**C. Honest confidence and false-activation discipline.** None of BrainFlow, LSL, Emotiv, or Neurosity exposes calibrated uncertainty or a principled low-confidence state. Neurosity returns a bare `probability` with no calibration guarantee; Emotiv returns a proprietary score with **no published accuracy, no documented algorithm, no changelog, and no version pin** — your thresholds have no test oracle, on software disabled people would depend on. Your SIMULATED/REPLAY rule is the same discipline applied to a different surface. False activations are the dominant failure mode in accessibility procurement. This is cheap to build and genuinely absent everywhere. *Partial caveat: Apple's BCI HID already carries a signal-quality channel and renders it as a UI overlay, so the display surface is taken on iOS. The calibration and policy behind the number is not.*

**D. Zero-cost, cross-platform, works-on-hardware-people-own.** 61% delivery rate, 93-day latency, $50k surety bonds, 400 insurance contracts, ~$800k/yr in disability-related costs for one named engineer. A free webcam access tier that requires no procurement, no prior auth, and no insurance denial is a genuine answer to the *actual* bottleneck. Weak as technology, strong as go-to-market.

**The sharper positioning:**

> *"Apple, Google, Meta and Emotiv each built a decoder for their own sensor and their own OS. Nobody built the layer that lets a user keep the same five commands as their condition changes and their working modality doesn't — and nobody built it for the user who owns none of that hardware. We feed Apple's BCI HID transport, we run everywhere Apple doesn't, and we're the only ones publishing our false-activation rate."*

That is narrower, checkable, survives a hostile search, and is buildable by two people in weeks rather than a 150-subject data program.

**Two things to say out loud before you're asked:** (i) your motor-imagery null result — 0.563 balanced accuracy on EPOC-X against 0.711 on a public control, independently reproduced at chance level by **Tarara, Przybył, Schöning & Gunia, *Front. Neuroinform.*, 2025-08-12, DOI 10.3389/fninf.2025.1625279** (note: **not** "Ferreira et al." — a hallucinated first author on your single load-bearing citation is a checkable error; fix it), attributed to *"the absence of central electrodes"* (no C3/Cz/C4). A founder who publishes their own null result and cites the literature agreeing is differentiated in a field saturated with overclaiming. (ii) Both current paths run on vendor classifiers. Say it first.

**On SSVEP:** your rejection was right, but lead with the better reason. SSVEP is **gaze-dependent** — you already get gaze from a webcam for free; paying $500 and a flickering screen to re-acquire it is bad architecture. The seizure argument is rebuttable ("use 40 Hz, low modulation depth"), and Cognixion bet $25M+ and an FDA Breakthrough Designation on SSVEP. The version that *survives* is: you cannot screen users of a consumer accessibility product, and an accessibility-first company shipping a UI contraindicated for an unscreenable fraction of its own target population is a positioning contradiction. Also note the EPOC-X shares only **2 of 8** electrodes with a high-performing SSVEP montage and has no Oz — so the good SSVEP numbers were never available to you anyway.

---

## 6. Market sizing, honestly

### Credible (audited or regulator-verified)
| Figure | Source |
|---|---|
| **Dynavox Group FY2025: SEK 2,467m (~$260M), +34% currency-adj., 68% GM, EBIT 10.3%, US = 75%, 1,010 FTE** | Year-End Report Q4 2025 (primary filing) |
| Selling expenses SEK 877m vs R&D SEK 245m — **3.6:1** | same |
| Fastest-growing segment: **touch-controlled autism AAC**, not eye-gaze | CEO statement, same report |
| Tobii+Smartbox UK share **60–70%**; tablets formally excluded from market definition; **"entry is not profitable at prevailing prices"** (Tobii's own model) | UK CMA Final Report 2019, ¶8.10 |
| **Control Bionics (ASX:CBL): 21 years old, A$6M revenue FY25, net loss −A$6.11M, market cap ~A$21–25M, −94% from ATH** | ASX filings / Stockhead |
| Medicare FFS SGD total ≈ **$14.4M/yr** (derived: $2.6M improper ÷ 18.1% rate) — my arithmetic, not a published CMS figure | CMS 2024 improper payment data |
| Assistive tech overall: **$526M across 51 rounds in all of 2025** (~$10M avg) | Tracxn |
| Non-invasive BCI 2026 YTD ≈ $272M, **but $252M of it is Merge Labs alone** ⇒ ~$20M for everyone else | sector trackers; Merge figure UNVERIFIED |

### Vendor TAM inflation — do not cite standalone
Five firms, same year, same market: **$1.3B / $2.32B / $3.1B / $3.4B**. A 2.6× spread in a single defined year is five firms guessing. Triangulation: if the market were $3.4B the clear global leader holds 7.6% — implausible against the CMA's near-duopoly finding. At $1.3B, TD holds ~20% — consistent. **Use $1.3–1.5B global; treat anything above $2B as inflation.**

Also inflated: Tobii Dynavox's "**50 million people worldwide, ~2% penetration**" and the RERC's "**>5M Americans / >97M worldwide who would benefit from AAC**." These are *benefit-from* populations. The RERC's own breakdown is dominated by autism, IDD, Down syndrome, and CP — **people who need symbol vocabularies delivered by touch, not a biosignal access method.** The 97M number is doing enormous work in every AAC deck and is nearly irrelevant to you. Never cite the "$18 trillion disposable income" or "9× return per dollar" advocacy statistics — a good investor discounts everything after them.

### Realistic serviceable market
Best available anchor: the Swedish total-population survey identified **418 eye-gaze device recipients in a country of ~10.3M** (Hemmingsson & Borgestig 2020). Naive scaling to the US (335M) ⇒ **~13,600 alternative-access AAC users nationally.** Flagged explicitly as *my extrapolation*, and it likely **overstates** the US, since Sweden's universal public AT provision is more generous than US payer-gated provision.

At ~$15,000/device on a mandated 5-year replacement cycle, that's **~$40M/yr of US alternative-access device revenue.** Even 3× off, this is a **low-hundreds-of-millions global segment, tens of thousands of users** — contested by four entrenched vendors, one with 1,010 employees and ~400 insurance contracts.

**Your addressable slice is narrower still.** A 5-command vocabulary serves people who cannot use touch, cannot use reliable eye gaze, and retain reliable voluntary control of some muscle or gaze proxy. **Order of magnitude: low thousands of people in the US.** And note the pricing ladder: the full dedicated device is ~$20,000 (TD I-16); the **EMG access switch alone reimburses at ~$4,300** (Control Bionics' claimed HCPCS E2513 — **UNVERIFIED**, does not appear in the standard E2500–E2512 range). If Manifest works perfectly, it is the $4,300 item, not the $20,000 one. And it competes with a **$50–200 mechanical switch** that never needs calibration, never fails in bad lighting, and has thirty years of clinical familiarity.

**Conclusion: this is not a venture-scale market on the current framing.** Cognixion — the closest comp — took 7 years and ~$25–42M (sources conflict badly; do not cite a single number) and is still doing regulatory work. That is your realistic timeline. Z Fellows, at $10k against a $1B cap (~0.001% dilution, money optional), is nearly free optionality and is selecting for *builder quality*, not market size. Optimize the application accordingly.

---

## 7. Regulatory and data obligations by stage

### Stage 0 — Demo / any real user touches the webcam (**NOW**)
- **Illinois BIPA (740 ILCS 14).** No revenue/headcount/user threshold. Private right of action: $1,000 negligent / $5,000 reckless, plus attorneys' fees. Covers "scan of hand or face geometry."
  - *Corrections:* Filings are **down** — ~100–150 in 2025 vs **427 in 2024**, following **Public Act 103-0769 (eff. 2024-08-02)**, which caps repeated collection by the same method at **one recovery per person** and confirms **electronic signature satisfies "written release."** Compliance is a click-through consent gate, not a wet signature. The Neutrogena/Skin360 settlement is **Melzer v. Johnson & Johnson Consumer Inc.** (not Kenvue as caption), $4.7M / ~11,000 members, **preliminary approval 2026-02-17** — not final, and Skin360 **uploaded images to servers**, so it says nothing about local processing.
  - *The dispositive engineering variable:* **Zellmer v. Meta, 104 F.4th 1117 (9th Cir. 2024)** — *"scans of face geometry fall within BIPA's list, but are not covered by BIPA if they cannot identify a person."* Meta won because its face signature was an unreversible embedding that *"do[es] not... correspond to facial features like the eyes or nose, or distances between them."* **MediaPipe's 468-landmark mesh is exactly inter-feature geometry and is plausibly identifying.** Zellmer protects a pipeline that retains only derived pose/gaze angles; it does **not** protect one that persists the mesh. Also: Zellmer is 9th Circuit, not binding in Illinois or the 7th, and it endorses *Hazlitt v. Apple* (S.D. Ill.) for the "could identify" standard.
  - **Action:** never persist or transmit the landmark mesh; retain angles only. Written biometric policy with retention/destruction schedule. Explicit consent gate before the camera turns on.
- **Washington My Health My Data Act.** No small-business exemption (that's a deadline category). Private right of action via WA CPA — treble damages up to $25,000. Requires a **standalone** consumer-health-data privacy policy, separate from your main policy, plus separate consent for sharing.
- **Your voice assistant already sends data to OpenAI.** That is data leaving the device today. It needs its own disclosure and a look at what's in the audio.
- **EU AI Act Art. 5** prohibits emotion inference **in educational institutions** — where you demo. Art. 50(3) mandates disclosure from 2026-08-02. **Cheapest fix in this entire memo: stop using Emotiv's `surprise` label.** "Clench" is a mechanical event with a clean out-of-scope argument; "surprise" is a named emotion. One vocabulary decision, disproportionate payoff.
- *Cost: a weekend.*

### Stage 1 — Collecting your own training data
- **UW–Madison IRB.** Physiological data collection cannot use the benign-behavioral-intervention exemption; investigators may not self-determine exemption; **retroactive approval does not exist.** 6–12 weeks realistic.
- **The question to ask on day one is not "can we collect this."** It is: *"can a for-profit entity later use data and model weights derived from this consent?"* Many university templates say no. Get the jurisdiction question (student vs. company) settled before recruiting subject one, or you burn a semester on a dataset you cannot ship. 45 CFR 46.111 flags disabled participants for heightened scrutiny.
- **Collect on non-Emotiv hardware** so no factual claim exists that your model derives from Cortex output (Emotiv EULA §4.5(k) / DLA §10.2(g)).

### Stage 2 — Distribution
- Emotiv **§6.1** DLA required for commercial distribution (fee schedule blank); **§6.2** open-source distribution requires registration on Emotiv's free/OSS list. Commercial orgs get **one** seat.
- Verify MediaPipe FaceLandmarker **model weight** license (distinct from Apache-2.0 code samples and CC-BY-4.0 docs) — **UNVERIFIED**, requires reading the per-component model cards.

### Stage 3 — Commercial scale
- Emotiv **20% royalty** at >1,000 users **or** >$250k revenue.
- **Connecticut SB 1295** (most sections eff. 2026-07-01): **35,000-consumer threshold** — the lowest neural-data bar in the country and your first realistic trigger. CA ($25M rev / 100k consumers), CO (100k / 25k), MT (genuinely inapplicable — a drafting failure; it expanded scope but not covered entities) are all far away. Vermont Act 101 (eff. 2026-07-01) — **UNVERIFIED**, enrolled text not read.
- Note: your webcam gaze proxy is **not** neural data under any US statute (MT excludes "motor activity"; CA excludes data inferred from nonneural information). **Your own EMG model would be** — peripheral nervous system.
- **GDPR:** gaze estimation is likely ordinary personal data, not Art. 9, because Art. 4(14) requires identification purpose. **Local-only processing is your single most valuable compliance asset — write it in as an architectural invariant.**

### Stage 4 — Reimbursement (2–4 years, low-seven-figures)
- **21 CFR 890.3710** Powered communication system: **Class II but 510(k)-EXEMPT** under §890.9. Much cheaper than the "FDA clearance" bogeyman. Still owes registration, listing, QMSR, labeling, MDR. §890.9 exemption lapses on new intended use or "different fundamental scientific technology" — **UNVERIFIED** whether EMG/BCI counts.
- **HCPCS E2511** (speech generating software only) already exists ⇒ PDAC code *verification* (~65 days), not a new code application. Device coded A9270.
- **L33739 rev. 2024-10-01 covers EMG sensor accessories.**
- DMEPOS: CMS-855S, **$50,000 surety bond per NPI**, annual accreditation. Per patient: SLP eval + physician face-to-face + WOPD + KX modifier. 5-year useful lifetime.
- **Intended-use language is a regulatory control surface.** Audit `POSITIONING.md`, `README.md`, and the Z Fellows application. Copy Cognixion's structure: general-purpose/research variant ships now, clinical claims quarantined in a later separately-funded track.

---

## 8. Next 30 / 90 / 365 days

### 30 days
1. **Read Apple's BCI HID descriptor** via the DocC markdown endpoint (`developer.apple.com/tutorials/data/documentation/accessibility/brain-computer-interface-hid-reference-for-connecting-to-apple-platforms.md` — the HTML page is JS-rendered and returns nothing). Write a one-sentence answer to "why doesn't this eat you?"
2. **Email Emotiv business development.** Current non-deprecated agreement; `fac` licensing on EPOC-X; DLA cost. Written answer.
3. **Ship BIPA + MHMDA compliance.** Consent gate, biometric policy with retention schedule, standalone WA health-data notice, and — critically — **audit the code so the 468-landmark mesh is never persisted or transmitted**, only derived angles.
4. **Rename the brow-raise path off Emotiv's `surprise` label.** One-line change, removes the EU AI Act Art. 5 exposure.
5. **Five structured user interviews.** ALS Association chapter, an AAC-focused SLP at UW Health, Team Gleason. This is the #1 documented abandonment predictor and you are currently maximizing it.
6. **Fix the citations.** Tarara/Przybył/Schöning/Gunia, not Ferreira. Hemmingsson & Borgestig, not "Borgestig et al." Delete the fabricated over-prescription quote. Drop the unverified 96% ALS acceptance figure.
7. **Run the Cortex `trained` facial-expression signature** if you're currently on `universal`. Days of work; could invalidate or sharpen the whole own-model premise. Don't skip because the answer might be inconvenient.
8. **Apply to Z Fellows.** Nearly free optionality. Lead with three working demos, shipping speed, the null result, and the SSVEP judgment call. Not a TAM slide.

### 90 days
9. **Refactor `fac` behind a vendor-neutral adapter interface.** Single highest-leverage architectural decision available, and it makes the "modality-agnostic" claim true rather than aspirational.
10. **Build the speech/emergency-communication path.** Users ranked emergency communication #1. Nothing in the repo answers it. This is also what moves you toward E2511 eligibility. Unbundle Movies/Snake from any reimbursement-facing build.
11. **Prototype your decoder emitting into Apple's BCI HID descriptor.** Turns the biggest threat into your distribution channel.
12. **Start the IRB conversation** — jurisdiction question first, commercial-use-of-derived-weights question second.
13. **Instrument and publish a false-activation rate.** Record raw sessions for regression testing; log the Cortex version with every event. Nobody in this space publishes this number.
14. **Go look at playAbility properly.** Pricing, funding, headcount, users. It is the closest commercial analogue to your positioning and nobody has researched it.
15. **Measure and publish your own EPOC-X don-time.** Users specified a median acceptable setup of 10–20 minutes; Emotiv doesn't publish theirs. Cheap, concrete, differentiating.

### 365 days
16. **Decide the modality-failover thesis on evidence, not intuition.** After 15–20 user conversations, either it is real and becomes the company, or it isn't and you pivot.
17. **If and only if the evidence supports it:** a 10–15 subject within-user facial-EMG pilot, on non-Emotiv hardware, per-user calibrated, 3–5 classes. Expect 90–97% within-subject. **Pitch that as Phase 1 and never imply Phase 2.** The dangerous failure mode is shipping a model that works on its two founders and calling it a classifier.
18. **Pick and name one revenue mechanism.** Accessibility procurement/compliance (Section 508, VPAT), OEM licensing to a device maker, or a clinical/reimbursement path. Not "open source, monetize later" — there is no hosted-service burden in a client-side decoder, no Atlas equivalent, and every hardware-adjacent OSS precedent (OpenBCI, LSL, BrainFlow) has adoption without revenue.
19. **Target the right capital.** Not neurotech VC (~72% late-stage, medical-device, FDA-pathway). **Adaptation Ventures** (founded May 2025 by disabled former founders, ≥$250k checks), **Amazon Alexa Fund** (already in Cognixion), K Ventures, plus NSF/NIH SBIR.

---

## 9. Open questions and what could not be verified

**Highest priority — resolve before any external claim:**
- **Emotiv's current, non-deprecated developer agreement.** No successor is publicly indexed; only four legal docs exist at id.emotiv.com and the developer agreement is the deprecated one. You may be bound by terms nobody has read. The 20% royalty exists *only as marketing copy* with no readable contractual instrument behind it.
- **Whether the local-processing defense defeats BIPA §15(b).** It is not "contested" — it is **unlitigated**. No case squarely holds either way, which is worse than contested, because there's no favorable precedent to cite at motion-to-dismiss. (The verifier could not retrieve the *Svoboda v. Amazon* 7th Cir. briefing to see whether an on-device argument was raised.)
- **MediaPipe FaceLandmarker *model weight* commercial-use terms** — distinct from Apache-2.0 code samples and CC-BY-4.0 docs. Requires reading per-component model cards.
- **UW–Madison IRB:** student-PI eligibility, turnaround, and whether university consent templates permit commercial use of derived data and weights.

**Unresolved factual gaps:**
- Whether the **CTRL-labs price** was ~$500M or ~$1B (never confirmed by Meta).
- Whether "**11,236 participants**" in the Nature paper is unique subjects or an aggregate across cohorts.
- Whether Meta's Wearables Device Access Toolkit exposes **raw or intermediate EMG** (strong prior: gesture events only, but the docs page returned setup content only).
- **Cognixion's total funding** — sources conflict badly (~$29M vs $42.5M). Do not cite either.
- **Merge Labs' $252M / $850M / OpenAI-led** — single secondary aggregator, no primary source.
- **HCPCS E2513** at US$4,300 (Control Bionics) — reported by Stockhead, not confirmed in CMS, outside the standard E2500–E2512 range.
- **Ball, Beukelman & Pattee 2004** and the 96% ALS AAC acceptance figure — could not be retrieved; tandfonline 403s and the journal is poorly indexed.
- **Vermont Act 101** enrolled text — summarized from law-firm coverage only.
- **USB-IF registration of usage page 0x60** ("Brain Control Interface") — usb.org returned 403.
- **Session-to-session facial-EMG drift magnitude** (Kim et al., *Virtual Reality* 2021, paywalled). Every Phase-2 effort estimate depends on this number and nobody has it.
- **Whether any published facial-EMG subject-scaling curve exists.** Two structured Europe PMC queries found none. That is "not found in two queries," not proven absence.
- **Whether Emotiv would actually enforce §10.2(g)/§4.5 against two students.** Probably not today. The risk is enforcement at the moment you have traction and no leverage.
- **Whether any payer has ever covered a webcam-based (no dedicated hardware) access method.** No example found. Notable absence, not proof.
- **Adoption/usage numbers for Camera Switches, Look to Speak, or Apple Head Tracking.** No vendor publishes them. Gameface's 633 GitHub stars is the only hard number in the whole camera space, and stars ≠ users.
- **Disability-led critique specific to consumer EEG headsets.** Abundant commentary exists on implanted BCI and on assistive design generally; none found specific to consumer EEG. **Do not conclude sentiment is favorable — conclude it wasn't found.**

**Methodological limits to be aware of:** several research briefs and verifications exhausted their web-search budgets mid-task and completed via direct fetches only. The verifications are generally *stronger* sourced than the briefs (primary documents read directly rather than search snippets), but negative-existence findings — "no facial-EMG scaling curve," "no BIPA case on gaze estimation," "no non-invasive vendor shipping against Apple BCI HID" — should be read as "not found under a constrained search," not as established absence.

**Also note:** the briefs contained at least one fabricated quotation (the Hemmingsson & Borgestig "abandonment" line) and one hallucinated first author (Ferreira for Tarara). Both were caught by the fact-check. Assume the same class of error may survive elsewhere in this memo — **verify any number before it enters an external document.**

---

## 10. Sources

**Apple / platform**
- BCI HID reference (DocC markdown — the HTML page renders nothing): https://developer.apple.com/tutorials/data/documentation/accessibility/brain-computer-interface-hid-reference-for-connecting-to-apple-platforms.md
- Accessibility Specifications index: https://developer.apple.com/documentation/accessibility/specifications
- Apple Newsroom, 2025-05-13 (BCI HID announcement, Head Tracking): https://www.apple.com/newsroom/2025/05/apple-unveils-powerful-accessibility-features-coming-later-this-year/
- Apple Newsroom, 2024-05-15 (Eye Tracking): https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/
- Apple Newsroom, 2026-05-19 (no BCI content): https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/
- Synchron thought-controlled iPad, 2025-08-04 (BusinessWire 20250804537175)
- WebKit tracking prevention (Web Bluetooth/USB/HID declined): https://webkit.org/tracking-prevention/
- Android Camera Switches (6 gestures): https://support.google.com/accessibility/android/answer/11150722
- Google Look to Speak, 2020-12-08: https://blog.google/company-news/outreach-and-initiatives/accessibility/look-to-speak/
- Project Gameface (archived 2025-09-05, Apache-2.0): https://github.com/google/project-gameface
- MediaPipe Face Landmarker: https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker
- Khronos OpenXR conformant products (Apple absent): https://www.khronos.org/conformance/adopters/conformant-products/openxr

**Meta sEMG**
- *Nature* 645:702–711 (2025-07-23), free full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC12443603/
- emg2qwerty (arXiv:2410.20081) + repo (LICENSE = CC BY-NC-**SA** 4.0; README says NC-4.0): https://github.com/facebookresearch/emg2qwerty
- emg2pose (arXiv:2412.02725) — CC BY-NC-SA 4.0: https://github.com/facebookresearch/emg2pose
- generic-neuromotor-interface — CC BY-NC 4.0: https://github.com/facebookresearch/generic-neuromotor-interface
- SplashNet, 35.7% zero-shot (arXiv:2506.12356)
- Meta Ray-Ban Display + Neural Band: https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/
- CES 2026 expansion (Garmin, Utah, TetraSki): https://www.engadget.com/wearables/metas-emg-wristband-is-moving-beyond-its-ar-glasses-120000503.html
- CMU/Meta SCI accessibility: https://engineering.cmu.edu/news-events/news/2024/07/09-wearable-sensing-tech.html

**Emotiv**
- Developer tiers + 20% royalty (verbatim): https://www.emotiv.com/pages/developer
- Developer License Agreement (marked deprecated; §4.1, §4.5, §6.1–6.3, §10.2(g), §12.3, blank Exhibit A): https://id.emotiv.com/eoidc/privacy/doc/developer-license/
- EULA (eff. 2024-05-17; §4.5(c),(k); §5.1): https://id.emotiv.com/eoidc/privacy/doc/eula/
- Cortex API + `fac` stream spec: https://emotiv.gitbook.io/cortex-api/data-subscription/data-sample-object
- `facialExpressionSignatureType` (universal vs trained): https://emotiv.gitbook.io/cortex-api/advanced-bci/facialexpressionsignaturetype
- EPOC-X specs (0.16–43 Hz, 14 channels, no C3/Cz/C4): https://www.emotiv.com/products/epoc-x
- Chilean Supreme Court v. Emotiv (Aug 2023): https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1330439/full
- Neurorights Foundation, *Safeguarding Brain Data* (Apr 2024) — 29 of 30 companies

**Signal / EEG / EMG literature**
- Tarara, Przybył, Schöning, Gunia, *Front. Neuroinform.* 2025-08-12, DOI 10.3389/fninf.2025.1625279 — multiclass MI on EPOC-X, chance level, "absence of central electrodes"
- ISEK Standards for Reporting EMG Data (Merletti), *J. Electromyogr. Kinesiol.* 1999;9(1):III-IV
- Whitham et al., *Clin. Neurophysiol.* 2007, PMID 17574912 — EEG >20 Hz is EMG-contaminated
- Cha et al., *Biomed. Eng. Lett.* 2023, PMC10382369 — facial EMG, LOSO 96.08% at 3 classes, single session, rigid frame
- Eddy, Campbell, Bateman, Scheme, *Front. Bioeng. Biotechnol.* 2024-09-23, DOI 10.3389/fbioe.2024.1463377 — 90% zero-shot at 150 subjects
- Harding, Wilkins, Erba, Barkley, Fisher, *Epilepsia* 46(9):1423–1425, 2005 — photosensitivity consensus
- Zhang et al. 2018, PMC6168577 — dry-electrode SSVEP, 8 electrodes at PO5–O2
- Maskeliunas et al., *PeerJ* 2016, PMC4806709 — Emotiv attention 60.5%, blink 75.6% (EOG)

**AAC / reimbursement / demand-side**
- Dynavox Group AB Year-End Report Q4 2025: https://mb.cision.com/Main/11919/4302974/3918411.pdf
- UK CMA, Tobii/Smartbox Final Report 2019 (¶8.5–8.22): https://assets.publishing.service.gov.uk/media/5d5d165ded915d08d9cf7217/Final_Report_Tobii_Smartbox.pdf
- CMS Policy Article A52469 (E2511, A9270, non-covered features): https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52469
- CMS LCD L33739 (rev. 2024-10-01, EMG sensor accessories covered): https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=33739
- CMS NCD 50.1: https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=274
- Hemmingsson H, Borgestig M, *IJERPH* 2020;17(5):1639, PMC7084643 — 41% response rate, 63/33/4, children 38% vs adults 65% daily
- Phillips B, Zhao H, *Assistive Technology* 1993;5(1):36–45, PMID 10171664 — 29.3% abandonment
- Huggins, Wren & Gruis 2011, PMID 21534845 — ALS BCI user requirements (≥90%, 15–19 lpm)
- Huggins, Moinuddin, Chiodo & Wren 2015, PMID 25721546 — SCI; emergency communication #1; dry > gel (p<.05)
- Koester & Arthanat 2018, PMID 28845735 — head 2.92 wpm, slowest measured
- Wolpaw et al., *Neurology* 2018, PMID 29950436 — 14/42 reached independent home use
- Zickler et al. 2013, PMID 24080077 — EEG cap adjustment is the #1 daily-life barrier
- Linse et al., *Front. Neurol.* 2018, PMC6072854 — 61% delivery rate, 93-day latency
- Jackson, Haagaard & Williams, "Disability Dongle," 2022-04-19: https://blog.castac.org/2022/04/disability-dongle/

**Legal / privacy**
- 740 ILCS 14 (BIPA): https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3004&ChapterID=57
- Public Act 103-0769 (eff. 2024-08-02) — single recovery, electronic signature
- Zellmer v. Meta Platforms, 104 F.4th 1117 (9th Cir. 2024): https://cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf
- Melzer v. Johnson & Johnson Consumer Inc. — $4.7M, preliminary approval 2026-02-17
- WA My Health My Data Act, RCW 19.373: https://app.leg.wa.gov/RCW/default.aspx?cite=19.373
- FPF, State Neural Data Laws Summer 2025: https://fpf.org/wp-content/uploads/2025/08/Neural-Data-State-Tracker-Chart.pdf
- EU AI Act Art. 5 / Art. 50: https://artificialintelligenceact.eu/article/5/ · /article/50/
- 21 CFR §890.3710: https://www.law.cornell.edu/cfr/text/21/890.3710
- 45 CFR §46.111: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.111

**Middleware / competitive**
- LSL (funding, 2012 origin, 2,300+ citations): https://pmc.ncbi.nlm.nih.gov/articles/PMC12434378/
- BrainFlow supported boards (**Emotiv absent**): https://brainflow.readthedocs.io/en/stable/SupportedBoards.html
- Neurosity Kinesis intent API: https://docs.neurosity.co/docs/api/kinesis/
- Wearable Devices FY2025 ($647k revenue, $8.1M loss): https://www.globenewswire.com/news-release/2026/03/12/3254706/0/en/Wearable-Devices-Reports-Full-Year-2025-Financial-Results...
- Control Bionics FY25: https://stockhead.com.au/health/asx-health-quarterly-wrap-control-bionics-makes-15pc-sales-revenue-jump-in-fy25/
- Naqi Logix / Wisear acquisition, closed 2026-01-29: https://audioxpress.com/news/neural-interface-earbuds-naqi-logix-closes-acquisition-of-wisear
- Leap Motion → Ultrahaptics ~$30M: https://techcrunch.com/2019/05/30/once-poised-to-kill-the-mouse-and-keyboard-leap-motion-plays-its-final-hand/
- Myo end of sales (Oct 2018): https://medium.com/@srlake/ending-sales-of-myo-preparing-for-the-future-281af9bbcac2
- Snap acquires NextMind (2022): https://roadtovr.com/snap-bci-next-mind-acquisition/
- Z Fellows: https://www.zfellows.com/
- Adaptation Ventures: https://techcrunch.com/2025/05/20/adaptation-ventures-is-a-new-angel-investor-group-focused-on-disability-and-accessibility-tech/
- CSA membership/cert fees: https://csa-iot.org/become-member/ · Khronos: https://www.khronos.org/members/