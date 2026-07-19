# DECISION MEMO — four blocking questions
**To:** Kanuj Verma, Sami Beg · **Date:** 2026-07-19 · **Status:** synthesis of the targeted follow-up round

Not legal advice. Where a follow-up overturned the first pass, I use the follow-up and flag it. Where I could not verify something, I say so rather than guessing — you may act on this.

---

## 1. The four answers

**Q1 — Can Manifest legally ship an open-source app on Emotiv Cortex, and train its own classifier? NO on distribution, SPLIT on training, and the first pass was wrong about the contract itself.**

The follow-up found three live 2025 agreements the first pass missed, hardcoded in `account.emotiv.com/static/cortex-app/cortex-appV2.js` and unreachable from Emotiv's sitemap: `api-license-2025`, `developer-license-2025`, `consumer-devices-distribution`. The document the first pass read as "deprecated" is byte-identical to `api-license-2025` except for its title — right text, wrong name. The App-ID click-through makes you accept all three. Distribution requires a Distribution License Agreement, and DLA §2.4 is far harsher than "email customer service": *"If the Third Party Software will be distributed as Open Source Software, You must provide a copy (including the compiled code) of the Open Source Software to EMOTIV for review and approval, in EMOTIV's sole discretion."* Prior approval, discretionary, before you publish. **And it does not even reach you:** DLA §1.6 defines Consumer Devices as *"MN8 devices and Insight devices (including their successors)."* EPOC X is not covered; §2.1 says research products need "a different license from EMOTIV" that is published nowhere I could find. On training: raw EEG you record is yours to train on (subject to a caveat below), but the Cortex `fac` stream is not — and API License §10.2(g) bars accessing the API *"in order to build a competitive product or service,"* which is a fair description of building a replacement `fac` detector. Raw EEG on EPOC X also requires a paid Premium API + EmotivPRO license. One more clause worth a lawyer's eye before the Z Fellows deck locks: Developer License 2025 §4.5 bars *"distributing, participating in the creation of, or promoting in any way a software development kit derived from the API"* — and "modality-agnostic BCI OS layer over Cortex" is arguably exactly that.

**Q2 — Can Manifest ship and open-source MediaPipe FaceLandmarker commercially? YES. Fully resolved, no caveats.**

All three sub-models inside `face_landmarker.task` — BlazeFace detector, FaceMesh V2, Blendshape V2 — each state **"LICENSED UNDER / Apache License, Version 2.0"** on their own Google model cards. The repo LICENSE is Apache-2.0; the npm package declares Apache-2.0; Google's own Kaggle publisher lists Apache 2.0 for all 11 models. There is no RAIL licence, no acceptable-use policy, no field-of-use restriction, and no commercial gate anywhere in the chain — I looked for one specifically. Fetching weights from Google's CDN at runtime imposes zero obligations. Redistributing the `.task` file triggers Apache-2.0 §4: ship the licence text, keep attribution. There is no NOTICE file in the repo, so §4(d) doesn't bite. Bonus: BlazeFace's own model card names *"entertainment and assistive technologies"* as the primary intended application. **This is the one clean YES in the memo. Build the camera path, not the EEG path, if you want to ship this quarter.**

**Q3 — Does local-only face processing take Manifest outside BIPA and friends? NO — but the follow-up made this materially better than the first pass said, and moved the risk to a different variable.**

The first pass claimed local-only was "weaker than you think" because your code reads eyes and nose landmarks, forfeiting *Zellmer*'s safe harbour. The follow-up corrected that framing on both halves. First, there is a consistent N.D. Ill. line dismissing §15(b) claims where the defendant never receives the data — *G.T. v. Samsung*, 742 F. Supp. 3d 788 (N.D. Ill. 2024): *"Plaintiffs have failed to allege Samsung took an 'active step' in gaining control over their Biometrics, which dooms their Section 15(b) claim."* Second, and more useful: what actually decides these cases is **account linkage, not landmark richness**. *Javid v. M.A.C. Cosmetics* survived dismissal because MAC held the plaintiff's name, DOB, zip, email and purchase history to join the scan to; *Castelaz v. Estée Lauder* was dismissed for lack of exactly that. So the operative product decision is: **do not put accounts, logins, or server-side identity on the same surface as camera input.** What remains genuinely open is *Zellmer* footnote 3, verbatim: *"we need not decide whether Meta's creation—and near immediate deletion—of a face signature skirts BIPA's prohibition on 'collect[ing]…'"* Nobody has decided it — the one case that would have (*Brown v. AS Beauty*) settled, and *Fleury v. Union Pacific* has it teed up unruled. Washington MHMDA is the worse statute: RCW 19.373.010 defines "collect" to include *"otherwise process consumer health data in any manner,"* which textually forecloses the local-only argument, and RCW 19.373.090 routes violations into the Consumer Protection Act's private right of action. Colorado applies to *"ANY AMOUNT"* of biometric data with no user threshold. Damages news is good: 7th Cir. held 740 ILCS 14/20(b) retroactive on 2026-04-01 — *"we hold that this amendment to BIPA Section 20 applies retroactively to cases pending at the time it was enacted"* — so your 30fps loop is **one violation per user, $1,000–$5,000, not per frame**.

**Q4 — Is there a business here, and does anyone reimburse accessibility software? UNRESOLVED as a venture question; NO as a reimbursement question.**

playAbility is the only credible commercial camera-input software company in the field, and the follow-up gutted the first pass's read of it. French company records (SIREN 978633964) show **PLAYABILITY SAS: incorporated 2023-08-08, capital social €1,000 unchanged, zero employees (`caractere_employeur: "N"`), no capital increase ever recorded in BODACC, no state aid.** The "2–10 people" figure was a self-selected LinkedIn band, not a filing. Revenue is legally sealed — both accounts filings carry *"une déclaration de confidentialité en application du premier ou deuxième alinéa de l'article L. 232-25"* — so nobody can retrieve it, but the structure answers the question anyway: this funds one determined person, not a company. Around it: Sesame Enable's own site says *"building a sustainable business model proved difficult and eventually the company shut down late '19"*; Google archived Project Gameface (last commit Aug 2024, flat at 633 stars); Apple ships camera-only Eye Tracking free on every iPhone. On reimbursement, the first pass's hypothesis was wrong but the correction is worse for you: CMS **does** pay for software-only — *"Medicare will reimburse for speech generating software only (HCPCS code E2511) when installed on a general computing device"* — but E2511's 2026 fee-schedule ceiling is **$0.00 in all 50 states**, and access software is expressly bundled: *"Software for the accessory or alternative access device is included in the reimbursement for the accessory or alternative access device. Claims for code E2511 billed with an accessory or alternative access device will be denied as unbundling."* The money is E2513, the EMG sensor accessory, at **$4,491.00** — but *"E2513 is only for use with code E2510,"* a device that must be capable only of speech generation. Also: Medicare pays once per five years. **A subscription is structurally incompatible with the DME benefit, not merely disfavoured.**

---

## 2. What is safe, and what is not

**You may ship today:**
- The MediaPipe camera path, commercially, open-source, with weights redistributed or CDN-fetched. Include the Apache-2.0 text if you vendor the `.task` file.
- The existing keyboard path, unchanged, with no legal overhead.
- Public repo of Manifest's own source. Nothing in Emotiv's documents touches your copyright in your own code; Emotiv's own SDK examples are MIT.
- Local demos to yourselves and to people who have signed a written consent form.

**Do not do these:**
- **Do not record or retain a single user session** — face frames, landmark streams, or EEG — until the consent modal and public retention policy in §3 exist. Not one, not for a demo, not "just for calibration."
- **Do not distribute anything that calls Cortex** outside the two of you. There is no distribution licence covering EPOC X, full stop; the published DLA covers MN8/Insight only.
- **Do not train a classifier on the Cortex `fac` stream.** This is the single worst-positioned plan under the documents.
- **Do not add user accounts, logins, or a backend on the same surface as camera input.** That is the variable that separates *Javid* (survived) from *Castelaz* (dismissed).
- **Do not put "20% royalty," "reimbursable," "insurers pay," or "non-biometric" in the deck.** The royalty is 15% in the executed instrument and applies to a device class you don't ship; reimbursement requires a sensor SKU and an SGD partner; and landmark geometry demonstrably can re-identify (Gupta/Markey/Bovik 2010: 96.8% rank-1 from ten automatically-located landmark distances alone).
- **Do not market to the EU yet.** GDPR Art. 9's biometric limb is purpose-bound and probably misses you, but the separate *"data concerning health"* limb has no purpose qualifier and an assistive product for disabled users walks straight into it.

---

## 3. Ship-before-next-user checklist

1. **Consent modal in front of `getUserMedia`** — your own, not the browser prompt. State: face geometry is processed; the specific purpose ("detect head turn for on-screen navigation"); retention ("not retained — computed per frame in your browser, never transmitted or stored"); no third-party disclosure. Affirmative click = the electronic signature BIPA §10 accepts. This one artifact discharges BIPA §15(b), Colorado 6-1-1314(4)(a) and Texas §503.001(b) at once. **~2 hours.**
2. **Public written retention & destruction policy at a stable URL.** BIPA §15(a) and Colorado 6-1-1314(2)(a) each require this independently of whether you retain anything. Yours is short because the answer is zero. **~1 hour.**
3. **Keep the keyboard path first-class; never gate a non-camera feature on camera consent.** Colorado 6-1-1314(4)(c)(I) answer, and correct accessibility design anyway. **Already true — just don't regress it.**
4. **Run the egress audit and save the artifact.** DevTools → exercise gaze → confirm zero outbound requests carrying frames or landmarks → save the HAR into the repo. Your own verification-honesty rule: evidence, not intention. **~30 min.**
5. **Self-host the MediaPipe WASM and `.task` model.** Removes jsDelivr and Google from the request path and makes "no third party is involved" literally true. **~1 hour.**
6. **Apache-2.0 attribution file** if you vendor the model. **~15 min.**
7. **One email to Emotiv** asking (a) which agreement governs EPOC X distribution and (b) whether a research-device distribution licence exists. Costs nothing, converts the largest unknown in Q1 into a written answer. **~15 min.**

Total: under a working day. There is no reason any of it is not done before the next person touches the camera.

---

## 4. What changed vs the prior round

- **Emotiv has successor agreements.** The "no successor exists" conclusion was wrong. Three 2025 documents are live and are what the click-through presents.
- **The royalty is 15%, not 20%, and it is contractual** — DLA Exhibit A is filled in, unlike the API Licence's. The marketing page still says 20%.
- **The OSS path is not "email customer service."** It is prior review and approval at Emotiv's sole discretion, plus a "Powered by Emotiv" display obligation and a non-disparagement clause.
- **EPOC X is outside the published DLA entirely.** This is new and it is the hard blocker.
- **Local-only is a stronger BIPA defence than the first pass said**, via the *G.T./Bhavilai/Barnett* line — but *G.T.* is on appeal (7th Cir. No. 25-1120, argued Oct 2025, undecided). Watch it.
- **The risk variable is account linkage, not which landmarks you read.** Drop the "your code reads eyes and nose so Zellmer is unavailable" framing.
- **§20(b) retroactivity is decided, not assumed** (7th Cir., 2026-04-01).
- **playAbility is one person with €1,000 of capital**, not a 2–10 person company. Revenue is statutorily sealed.
- **CMS does reimburse software-only — at $0.00.** The first pass's hypothesis was wrong; the practical conclusion is unchanged and harder.
- **The Terms of Use §5 data-ownership quotes from round one are UNVERIFIED.** The page is a JS-injected SPA and the follow-up could not confirm them. Do not cite them.

---

## 5. Still unresolved

| Question | Resolvable from public sources? | Specific action |
|---|---|---|
| Which agreement governs EPOC X distribution; does a research-device DLA exist? | **No** — not published anywhere | Email `team@emotiv.com` / customer service. One email. |
| Does the click-through render all three checkboxes for a new account? | No — behind auth | Kanuj registers an App ID himself. I will not accept a contract on your behalf. |
| Do the ToU §5 ownership sentences actually exist as quoted? | Yes, trivially | Open `id.emotiv.com/eoidc/privacy/terms/` in a browser and read it. 5 minutes. |
| Do model weights trained on Emotiv-owned derivative metrics constitute a derivative work? | **No** — no document addresses it, and it's unsettled law generally | Lawyer, if you ever pursue the `fac`-training path. Better: don't. |
| Is Developer License §4.5 ("SDK derived from the API") triggered by a modality-agnostic abstraction layer? | **No** — needs judgment | One hour of outside counsel before the Z Fellows framing locks. Highest-value legal spend on this list. |
| Does MHMDA "consumer health data" reach an accessibility product via the health-status limb? | **No** — untested | Lawyer, or avoid Washington marketing until you have traction worth defending. |
| Can a 478-point MediaPipe mesh actually re-identify? | Partly — needs an experiment | Run it in-house: 30s landmark streams from ~10 teammates, inter-landmark distance vectors, LDA, measure rank-1. That is the McCoy-style declaration Meta won with, and you'd own it. |
| UK NHS AAC and German Hilfsmittelverzeichnis pathways | **Yes, just needs searching** — both retrievals failed on a budget-exhausted session | One research session with working web search. |
| BIPA consent capacity for users who cannot execute a written release | **No** — no case law or guidance found | Disability-law counsel or a university clinic. UW–Madison Law has one; that is a free call. |
| playAbility's actual paid-user count | **No** — accounts sealed under art. L232-25 | Email Valentin at `team@playability.gg`. A two-person student team often gets an honest answer. |

---

## 6. Sources

All accessed 2026-07-19 unless noted.

**Emotiv:** [API License 2025](https://id.emotiv.com/eoidc/privacy/doc/api-license-2025/) · [Developer License 2025](https://id.emotiv.com/eoidc/privacy/doc/developer-license-2025/) · [Consumer Devices Distribution License](https://id.emotiv.com/eoidc/privacy/doc/consumer-devices-distribution/) · [EULA](https://id.emotiv.com/eoidc/privacy/doc/eula/) · [cortex-appV2.js](https://account.emotiv.com/static/cortex-app/cortex-appV2.js) · [emotiv.com/developer](https://www.emotiv.com/developer)

**MediaPipe:** [BlazeFace model card](https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20(Short%20Range).pdf) · [FaceMesh V2 card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf) · [Blendshape V2 card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf) · [repo LICENSE](https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE)

**Biometric law:** [*Zellmer v. Meta*, 9th Cir. 2024-06-17](https://cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf) · *Clay/Willis/Gregg v. Union Pacific*, 7th Cir. 2026-04-01 · *G.T. v. Samsung*, 742 F. Supp. 3d 788 (N.D. Ill. 2024) · *Javid v. M.A.C. Cosmetics*, No. 25 CV 11693 (N.D. Ill. 2026-06-04) · [740 ILCS 14/20](https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-20/) · [RCW 19.373.010](https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.010) / [.090](https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.090) · [Colorado HB24-1130](https://content.leg.colorado.gov/sites/default/files/2024a_1130_signed.pdf) · [GDPR Art. 9](https://gdpr-info.eu/art-9-gdpr/) · Gupta/Markey/Bovik, *Anthropometric 3D Face Recognition*, IJCV 2010

**Market & reimbursement:** [CMS Article A52469](https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52469) · [CMS LCD L33739](https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=33739) · [DMEPOS fee schedule DME26-C](https://www.cms.gov/medicare/payment/fee-schedules/dmepos/dmepos-fee-schedule/dme26-c) · [Tobii Dynavox US funding](https://us.tobiidynavox.com/pages/funding) · [INSEE/RNE record, SIREN 978633964](https://recherche-entreprises.api.gouv.fr/search?q=978633964) · [BODACC](https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records?where=registre%20LIKE%20%22978633964%22) · [playability.gg/pricing](https://www.playability.gg/pricing/) · [Sesame Enable](https://sesame-enable.com/) · [google/project-gameface](https://api.github.com/repos/google/project-gameface)

**Method caveat carried forward:** every round in this series ran with the WebSearch budget exhausted, so all findings come from direct fetches of primary documents. That makes the evidence quality high and the *discovery breadth* low. Every "not found" above is "not found under a constrained search," never "does not exist."

**Local artifacts:** `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/`