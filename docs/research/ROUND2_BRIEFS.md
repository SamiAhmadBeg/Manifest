# Manifest — Round 2 Raw Briefs (2026-07-19)

*4 blocking questions + self-directed follow-ups. The decision memo supersedes these.*



---

# Emotiv's actual current developer agreement

**Confidence: PARTIAL**

**Bottom line:** The operative developer contract is Emotiv's "API License Agreement," still served live at https://id.emotiv.com/eoidc/privacy/doc/developer-license/ but titled "Emotiv Developer License Agreement (deprecated)" — no successor exists anywhere in Emotiv's 923-URL sitemap, GitHub org, or Cortex docs. (1) DISTRIBUTING OPEN-SOURCE SOFTWARE: NO, not unilaterally. §6.2 requires you to "contact EMOTIV customer service to be added to EMOTIV's free/open source license list," and open-source apps are explicitly inside the restricted category, not exempt from it. This is a permission process, not a prohibition — but it requires an affirmative act by Emotiv that Manifest has not performed. (2) TRAINING YOUR OWN CLASSIFIER: SPLIT. Training on raw EEG you recorded is YES — Terms of Use §5 (Feb 26, 2025, current) says "You retain ownership of the scan data collected by the Hardware." Training on the Cortex 'fac' stream is NO/high-risk — the same section says "EMOTIV is the owner of all information, derivative metrics and data it adds to Your EEG Data, such as ... translational and/or predictive algorithms," and 'fac' is exactly that. Two hard practical constraints: raw EEG on an EPOC X requires a paid Premium API + EmotivPRO license, and §10.2(g) bars accessing the API "in order to build a competitive product or service" — which is a fair description of a replacement facial-expression classifier. The 20% royalty is MARKETING ONLY: it appears solely in a pricing table on emotiv.com/developer with no contractual instrument behind it, and the only public instrument's fee exhibit is a literal unfilled blank reading "[Insert amount and calculation of the API License Fee below]".

-----

## Method note and honesty caveats

**All URLs accessed 2026-07-19.** The WebSearch budget for this session was exhausted at the first call, so this round used **zero search snippets** — every finding below comes from a direct fetch of a primary document, retrieved via `curl` or WebFetch. Full text of the retrieved documents was extracted from HTML and read, not skimmed.

Where I quote, I am quoting text I extracted and read. Where I could not read something, I say so explicitly. Two things I did **not** verify and am not asserting:

- I did **not** create an Emotiv account or register a Cortex App ID, so I have **not** seen the click-through agreement text that the live signup flow actually presents. That flow is behind authentication.
- I did **not** obtain any "Distribution License Agreement" or "Third Party License Agreement" — these are named in the documents as separately negotiated instruments and are not published anywhere I could reach.

-----

## 1. What legal documents actually exist

I enumerated Emotiv's public surface exhaustively rather than guessing at URLs.

**The main website is now a Framer site.** `https://www.emotiv.com/sitemap_en.xml` returns **923 URLs**. Filtering for `legal|term|licen|develop|privacy|agree|eula|polic|royal|refund|subscri` returns **no terms-of-use page, no EULA page, and no developer agreement page**. The only legal-adjacent pages in the entire sitemap are `/refund-policy` and `/subscription-terms`. `emotiv.com/pages/legal`, `/pages/terms-of-use`, and `/pages/developer-agreement` all return **404**.

The actual legal instruments are hosted on a separate Django app at `id.emotiv.com` (formerly `id.emotivcloud.com` / `cerebrum.emotivcloud.com`, which now 301-redirect there). Footer links on `emotiv.com/developer` point to them:

| Document | URL | Status | Date on document |
|---|---|---|---|
| EMOTIV Terms of Use | `id.emotiv.com/eoidc/privacy/terms/` | Live, current | **Last Updated Feb 26th, 2025** |
| EMOTIV End User License Agreement | `id.emotiv.com/eoidc/privacy/doc/eula/` | Live, current | **Last Updated May 17, 2024** |
| Privacy Policy | `id.emotiv.com/eoidc/privacy/privacy_policy/` | Live (HTTP 200, 48.6 KB) | not extracted |
| **API License Agreement** | `id.emotiv.com/eoidc/privacy/doc/developer-license/` | **Live, HTTP 200, but `<title>` reads "Emotiv Developer License Agreement (deprecated)"** | no date on live version |

I found the developer-license URL by querying the Wayback CDX index for `cerebrum.emotivcloud.com*` — it was not linked from any current page I fetched. It is a real, live, fully-served 29.5 KB document.

**Deprecation timeline.** Wayback has snapshots at 20211029, 20220426, 20220516, 20240229, 20250403, 20260417. The 2022-05-16 snapshot is titled "Emotiv Software License Agreement," carries the line "updated March 23, 2020," and contains **zero** occurrences of "deprecat". The 2026-04-17 snapshot carries the "(deprecated)" title. The 2024 and 2025 snapshots are gzip-mangled 8.8 KB captures I could not decode, so I can only bracket the change to **between April 2025 and April 2026** — I could not pin it more precisely.

**Important: the "deprecated" document is not simply the old 2020 text.** Diffing the 2022 capture against the live version shows the live one is *substantively newer*: it drops the "updated March 23, 2020" line and **adds** §4.7 (patents), §10.3 (product liability insurance), and an entire new §11 ("Using EMOTIV APIs"). It also changes §3.2 from "By clicking to accept" to **"By signing below"** — which suggests the document was converted from a click-through into a signature-execution instrument at the same time it was pulled from the public flow. That is my inference from the text change, not something Emotiv states.

**I could not find a successor document, and the deprecated document contains no pointer to one.** I read it in full; there is no "superseded by" language. Candidate URLs `/doc/developer_agreement/`, `/doc/developer/`, `/doc/sdk/`, `/doc/tpla/`, and `/doc/` all return 404. **This is "not found under a reasonably thorough search," not "does not exist."**

-----

## 2. Redistribution and open-source distribution — the operative clauses

From the **API License Agreement**, `https://id.emotiv.com/eoidc/privacy/doc/developer-license/`, accessed 2026-07-19. Verbatim:

> **1.18.** "Third Party Software" means software developed by You using the API, which relies on an End User Data to function, including but not limited to enterprise, consumer, **free and open source** software applications.

Open-source software is expressly **inside** the regulated category. There is no OSS carve-out.

> **4.2.** You may not use the API for any other purpose, including to market, sell or distribute the Third Party Software or any product or service incorporating the Third Party Software, unless You comply with the distribution requirements set forth in Sections 6.1-6.3, below.

> **6.1** If You wish to distribute Third Party Software, or any product or service incorporating the Third Party Software, outside of Your organization, You must obtain a Distribution License Agreement from EMOTIV.

> **6.2** If the Third Party Software will be distributed outside of Your organization as a free or open source software application, You must contact EMOTIV customer service to be added to EMOTIV's free/open source license list. If the Third Party Software is accepted by EMOTIV, any person or organization with an active API License Agreement will be able to use it to access raw EEG data on a fixed number of computer devices at no further charge by EMOTIV to You.

> **6.3** If the Third Party Software will be distributed outside of Your organization or in excess of Your number of License Seats, but not as a free or open source software application, You must contact EMOTIV business development and obtain a Distribution License Agreement. The Distribution License Agreement will contain the terms and conditions, including license fees, applicable to Your distribution of the Third Party Software.

**Reading:** §6.2 is a *lighter* path than §6.3 — OSS gets a registration process with no license fee rather than a negotiated commercial agreement. But it is still an **affirmative permission gate**: "You must contact EMOTIV customer service to be added" and "If the Third Party Software is accepted by EMOTIV." Manifest has not done this.

**A distinction the documents blur and Manifest should not.** Nothing in any Emotiv document restricts Manifest's copyright in Manifest's own source code. Manifest can license its own repository however it likes. What §6.1/§6.2 restrict is *distributing software that consumes the API* to people outside your organization. Publishing a repo on GitHub is arguably both. I flag this as a genuine ambiguity in the instrument, not a resolved point.

**Counterweight — Emotiv's own example code is MIT.** `https://raw.githubusercontent.com/Emotiv/cortex-example/master/LICENSE`:

> MIT License
>
> Copyright (c) 2020 EMOTIV
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...

Every substantial repo in the `Emotiv` GitHub org (`cortex-example`, `unity-plugin`, `labstreaminglayer`, `opensoundcontrol`, `flutter-plugin`, `emotiv-academy`) is MIT. **There is no `TERMS` file in `cortex-example`** — I listed the repo root and it contains only `.github`, `.gitignore`, `.gitmodules`, `LICENSE`, `README.md`, `ReleaseNotes.md`, `certificates`, `cortex_version`, and the per-language directories. So Emotiv's *code* is freely redistributable; the restriction lives entirely in the *API license relationship*.

### Reverse engineering and competing products

From the **API License Agreement**, verbatim:

> **10.2.** You will not: (a) sell, resell, license, sublicense, distribute, rent or lease the API; ... **(g) access the API in order to build a competitive product or service** or to monitor the availability, performance or functionality of the API or other EMOTIV software, or for any other benchmarking or competitive purposes; or **(h) reverse engineer the API** or other EMOTIV software.

> **4.5.** You may not take any actions that may cause or result in the fragmentation of the API, including but not limited to distributing, participating in the creation of, or promoting in any way a software development kit derived from the API.

The parallel clause in the **EULA** (May 17, 2024), verbatim:

> **4.5** Except as otherwise expressly permitted by the Additional Terms, You will not have the right to: (a) make the Software available to, or use the Software for the benefit of, anyone other than You; (b) sell, resell, license, sublicense, distribute, rent or lease the Software; **(c) use the Software for commercial purposes**; ... (k) access the Software in order to build a competitive product or service...; or (l) reverse engineer the Software.

Note EULA §4.5(c) — a flat bar on commercial use of the Software absent Additional Terms. And the EULA's own §4.6 preserves open-source components:

> **4.6** The use, reproduction, and distribution of any components of the Software which are covered by an open source software license between EMOTIV and the open source software licensor are governed by the terms of that open source software license in addition to the terms of this EULA.

This protects *Emotiv's* OSS components. It does not grant Manifest an OSS distribution right.

-----

## 3. Data ownership and derived models — the decisive section

This is the most important finding in the brief, and it is from a **current, non-deprecated** document.

**EMOTIV Terms of Use**, `https://id.emotiv.com/eoidc/privacy/terms/`, **Last Updated Feb 26th, 2025**, §5 "EEG Data and Experiment Data" — verbatim, first and last sentences:

> **You retain ownership of the scan data collected by the Hardware that You upload to the Service through use of the Software in accordance with Your license ("EEG Data").** Except for EEG Data that You obtained in this licensed manner and Your Personal Information (as defined in EMOTIV's Privacy Policy), EMOTIV is the owner of all data, including Experiment Data (as defined below). You hereby grant EMOTIV a worldwide, non-exclusive, fully paid-up, royalty-free, irrevocable, perpetual license to: (i) use, reproduce, display, transmit, and prepare derivative works of Your EEG Data and Experiment Data for purposes of providing the Service to You, for so long as You maintain Your Service user account; ... **EMOTIV is the owner of all information, derivative metrics and data it adds to Your EEG Data, such as event timing markers and translational and/or predictive algorithms.**

Corroborated by the **EULA** §5.1:

> **5.1** EMOTIV obtains no ownership interest from You under this EULA in or to End User Data.

And EULA §1.3:

> **3.** "End User Data" means the EEG data You generate by using the Software with the linked EMOTIV headset in accordance with the terms of this EULA.

**This splits Manifest's question cleanly in two:**

- **Raw scan data Manifest records → Manifest owns it.** "You retain ownership of the scan data collected by the Hardware." Training on it is not restricted by any clause I found.
- **The `fac` stream → Emotiv owns it.** The `fac` facial-expression output is precisely "information, derivative metrics and data it adds to Your EEG Data," produced by a "translational and/or predictive algorithm." Manifest's EMG path consumes exactly this. Under the plain text, those labels are Emotiv's property, not Manifest's.

Reinforced by **API License Agreement §11.1**, verbatim:

> **11.1.** Intellectual property rights owned by EMOTIV or by other parties may protect data You retrieve from EMOTIV using the API. Your use of any such API may be subject to additional terms and conditions. **You may not modify, rent, lease, loan, sell, distribute or create derivative works based on such data unless allowed by the relevant terms and conditions.**

A classifier trained on `fac` labels is straightforwardly arguable as a "derivative work based on such data." Combined with §10.2(g)'s bar on accessing the API "in order to build a competitive product or service," the specific plan of *using Cortex's `fac` output to train a replacement for Cortex's `fac` detector* is the single worst-positioned version of this idea under these documents.

And **Terms of Use §4**, verbatim (capitalisation as in original):

> **Ownership; Proprietary Rights.** EMOTIV retains all rights to the EMOTIV Materials not specifically granted in these Terms of Use. EMOTIV or third parties own the EMOTIV Materials, including all worldwide right, title, and interest, including all intellectual property and other proprietary rights, **as well as certain usage and other data generated or collected in connection with the use of the EMOTIV Materials.** ... YOU MAY NOT REVERSE ENGINEER, DISASSEMBLE, DECOMPILE, DISTRIBUTE, COPY, MODIFY, PUBLICLY PERFORM OR DISPLAY, TRANSMIT, PUBLISH, EDIT, ADAPT, **CREATE DERIVATIVE WORKS FROM**, OR OTHERWISE MAKE ANY UNAUTHORIZED OR UNINTENDED USE OF ANY EMOTIV MATERIALS...

### Model weights specifically: unaddressed

**I searched all three documents and found no clause anywhere that mentions machine-learning models, trained weights, model artifacts, or derived models.** The word does not appear. The applicable language is the generic "derivative works based on such data" in §11.1 and "prepare derivative works" in ToU §5. Whether model weights trained on Emotiv-owned derivative metrics constitute a derivative work of that data is an unsettled question of law generally, and these contracts do nothing to settle it. **This is genuinely unresolvable from the public documents** — not because I failed to find a document, but because no document addresses it.

### The hardware constraint Manifest may not have priced in

**API License Agreement §2.1 and §2.2**, verbatim:

> **2.1.** If You wish to develop Third Party Software for EMOTIV headsets, You will need to generate an App ID, which may be done for free on the EMOTIV website. The App ID may be used with Your Emotiv ID to use such Third Party Software for up to three (3) License Seats, and will provide You with access to mental commands, low resolution performance metrics, frequency bands, **facial expressions** and motion data.

> **2.2.** If You wish to develop Third Party Software for EMOTIV headsets, where such Third Party Software will access **raw EEG data** or high resolution performance metrics, **You must have or obtain a license for EmotivPRO and you must apply and obtain a license for Premium API.**

Corroborated by the current Cortex API docs (`https://emotiv.gitbook.io/cortex-api/`), which state that for professional devices (EPOC X, EPOC Flex) Basic BCI API access is free while Premium API — raw EEG and high-resolution performance metrics — "requires a premium Developer API license," directed through `emotiv.com/cortex-sdk-application-form`.

**Manifest uses an EPOC-X.** So: `fac` is free. **The raw EEG they need to train a replacement classifier is behind a paid, application-gated Premium API + EmotivPRO license.** Plan (b) has a cost and an approval step before any legal question even arises.

-----

## 4. Research/academic vs commercial vs student tiers

The API License Agreement **does** tier by user type. Verbatim:

> **1.7.** "Commercial" means any organization which does not fall within the definition of Noncommercial.

> **1.16.** "Noncommercial" means a school, university or college, a non-profit research institution or entity, or a governmental agency not engaged in any for-profit activities.

> **4.1.** Subject to the terms and conditions of this API License Agreement, EMOTIV grants You a limited, worldwide, nonexclusive, non-transferrable, and non-assignable license to use the API, at Your cost and expense during the term of this API License Agreement, solely to: (a) develop Third Party Software; (b) if Your organization is Noncommercial, use such Third Party Software internally for up to three (3) License Seats; (c) if Your organization is Commercial, use such Third Party Software internally for one (1) License Seat; and **(d) if You are a student at a school, university or college, use such Third Party Software personally for one (1) License Seat.** You hereby accept such license.

**A student project does sit in its own tier — and it is the narrowest one.** Note two words: **one** seat, and **"personally."** The Noncommercial tier gets three seats; the student tier gets one, and the grant is personal rather than organizational.

Manifest is two founders (Kanuj Verma and Sami Beg) in UW–Madison's SALE program, building toward a startup. That is a poor fit for every tier: they are not "a school, university or college" acting as an institution (so not Noncommercial), they are more than one person (so the one-seat student grant does not cover both), and their stated intent is commercial. Under §4.1 as written, **every one of the three grants is internal/personal use only** — none of them authorises distribution. Distribution comes only through §6, which is the permission gate discussed above.

There is also a plain product-liability insurance obligation that a two-person student project will not have:

> **10.3.** You shall obtain and maintain standard product liability insurance during the term of this API License Agreement with limits no less than One Million Dollars ($1,000,000) combined single limit and a deductible not to exceed Ten Thousand Dollars ($10,000.00) per occurrence. Such policy shall name EMOTIV as an additional insured...

This clause is one of the *additions* in the live version relative to the 2022 capture. It is a strong signal the document was being reworked for negotiated commercial execution, not for click-through by students.

-----

## 5. The 20% royalty: marketing, not contract

**Confirmed as marketing copy. No contractual instrument is findable.**

The only occurrence I found anywhere is in the "Developer partner tiers" pricing table on `https://www.emotiv.com/developer`, accessed 2026-07-19. Verbatim, as extracted from the rendered page:

> Under 1000 users and less than $250,000 in revenue
> Free
>
> Over 1000 users or $250,000 in revenue
> **After the revenue or user threshold that is directly attributable to the Emotiv product is reached, regardless of who collects it, a 20% royalty will apply.**

The tier structure it sits in:

> Developer partner tiers / Features / **Registered Developer** — API for BCI — Register / **Professional Developer** — API for EEG Research — Contact us / **Enterprise / Solutions partners** — API for Enterprise Solutions — Contact us
>
> Mental Commands API / Frequency Bands API / **Facial Expressions API** / Motion data API / Low resolution Performance Metrics API / High resolution Performance Metrics API / **Raw EEG API**

**The instrument behind it does not exist publicly, and I can show you the hole where it should be.** The API License Agreement's Exhibit A — the schedule where fees would live — is an **unfilled template**. Verbatim:

> **EXHIBIT A — ADDITIONAL TERMS**
>
> **License Fees:**
> You will pay EMOTIV a license fee based on Your device as described on the EMOTIV website, or set forth below, or otherwise disclosed to You by EMOTIV (the "API License Fee").
>
> **[Insert amount and calculation of the API License Fee below]**

That bracketed instruction is present in the live document. There is no royalty percentage, no revenue threshold, and no user threshold anywhere in any of the three legal documents. The words "royalty," "20%," "1000 users," and "$250,000" appear **zero** times in the API License Agreement, the EULA, or the Terms of Use.

The agreement instead defers to the website and to a future negotiated document:

> **6.3** ... The Distribution License Agreement will contain the terms and conditions, **including license fees**, applicable to Your distribution of the Third Party Software.

Paired with an audit right:

> You will keep and maintain accurate books of account and records covering all transactions relating to this API License Agreement. EMOTIV will have the right to audit Your books of account and records during reasonable business hours in order to verify the accuracy of all payments...

**Conclusion: the 20% royalty is a negotiating anchor published on a marketing page, not a term Manifest is currently bound by.** It becomes binding only if and when Manifest signs a Distribution License Agreement that recites it. That is materially different from "Emotiv takes 20%" and Manifest should stop treating it as a fixed cost of doing business.

-----

## 6. Two structural risks worth naming

**Unilateral amendment and unilateral termination.** API License Agreement §15.2: "EMOTIV may amend this API License Agreement on a prospective basis, and Your use of the API after an amendment constitutes Your consent to be bound by the amendment going forward." §12.3: Emotiv may terminate "if ... (D) EMOTIV determines in its sole discretion that providing the API or certain API services to You is no longer commercially viable." EULA §7.4: "if the Software is provided to You free of charge (zero License Fee), EMOTIV may terminate Your access to the Software at any time for convenience, without prior notice or liability to You." Manifest is on the free tier. **Their entire EMG path can be switched off at Emotiv's convenience with no notice.** That is an architecture risk, not just a legal one — and it is, incidentally, the strongest *business* argument for training their own classifier.

**Everything routes through Emotiv's cloud.** ToU §5's ownership grant attaches to "scan data ... that You upload to the Service." Emotiv receives a "perpetual, irrevocable" licence over that data. EULA §5.2: "End User Data will be collected by EMOTIV and stored in the EMOTIV cloud." For an accessibility product handling biosignals from disabled users, that is a disclosure Manifest will have to make and a dependency they may want to design out.

-----

## 7. Verdict table

| Question | Verdict | Governing text |
|---|---|---|
| Distribute open-source software consuming Cortex output | **NO, not unilaterally — but a named permission path exists and is free** | API Licence Agreement §4.2, §6.1, §6.2; §1.18 confirms OSS is in scope |
| Publish Manifest's own source code under an OSS licence | **Not restricted by any clause found** — Emotiv's own SDK examples are MIT | `Emotiv/cortex-example` LICENSE (MIT) |
| Train a classifier on raw EEG Manifest records | **YES on ownership grounds** — but requires paid Premium API + EmotivPRO on EPOC X | ToU §5 ("You retain ownership of the scan data"); API LA §2.2 |
| Train a classifier on Cortex `fac` output | **NO / high risk** | ToU §5 ("EMOTIV is the owner of all ... derivative metrics"); API LA §11.1, §10.2(g) |
| Ownership of resulting model weights | **GENUINELY UNRESOLVABLE — no document addresses it** | no clause exists |
| Is the 20% royalty contractual? | **NO — marketing only; Exhibit A is a blank template** | emotiv.com/developer; API LA Exhibit A |
| Does a student tier exist? | **YES — and it is the narrowest: one seat, "personally"** | API LA §1.16, §4.1(b)(c)(d) |

**Confidence: PARTIAL.** I located and read in full every legal instrument Emotiv publishes, and the answers above follow from their plain text. The gap is that the single document governing developer/API use is self-labelled "(deprecated)" while still being served live, and I could not determine what — if anything — replaced it. The click-through presented at Cortex App registration is behind authentication and I did not see it.

**Practical recommendation:** the §6.2 free/open-source list is a cheap, named, fee-free process with a defined counterparty. Manifest should simply use it, and use the same email to ask which agreement is currently operative. That converts the largest unknown in this brief into a written answer from Emotiv, at a cost of one email.

-----

## Sources

All accessed 2026-07-19.

- [EMOTIV API License Agreement ("deprecated")](https://id.emotiv.com/eoidc/privacy/doc/developer-license/) — live, HTTP 200, 29.5 KB
- [EMOTIV Terms of Use, Last Updated Feb 26th, 2025](https://id.emotiv.com/eoidc/privacy/terms/) — text extracted from the `window.PageData.htmlDoc` payload; the page is a React SPA and renders empty to a plain fetch
- [EMOTIV End User License Agreement, Last Updated May 17, 2024](https://id.emotiv.com/eoidc/privacy/doc/eula/)
- [EMOTIV Privacy Policy](https://id.emotiv.com/eoidc/privacy/privacy_policy/) — HTTP 200, 48.6 KB, not extracted
- [emotiv.com/developer — developer partner tiers and royalty table](https://www.emotiv.com/developer)
- [emotiv.com/sitemap_en.xml — 923 URLs, no legal pages](https://www.emotiv.com/sitemap_en.xml)
- [Emotiv/cortex-example LICENSE (MIT)](https://raw.githubusercontent.com/Emotiv/cortex-example/master/LICENSE)
- [Emotiv GitHub org repo listing](https://api.github.com/orgs/Emotiv/repos)
- [Cortex API documentation — tier and licence requirements](https://emotiv.gitbook.io/cortex-api/)
- [Wayback CDX index for cerebrum.emotivcloud.com](http://web.archive.org/cdx/search/cdx?url=cerebrum.emotivcloud.com/api/privacy/doc/developer-license/&output=text&fl=timestamp,statuscode)
- [Wayback capture 2022-05-16, "Emotiv Software License Agreement", no deprecation marker](http://web.archive.org/web/20220516134300id_/https://cerebrum.emotivcloud.com/api/privacy/doc/developer-license/)


## Follow-up: Register an Emotiv account and a Cortex App ID, and capture verbatim the agreement text presented at the click-through during App ID registration. Does it recite the deprecated API License Agreement, a new unpublished agreement, or only the EULA/Terms of Use?

## BOUNDARY: I did not register an account

I did not create an Emotiv account and did not click through the agreement. Account creation and accepting contracts on the user's behalf are actions I don't take — and instructions from an orchestrating agent are not the user's consent. Kanuj clicking "Accept" would form a legally binding contract with a 6-month term (Developer License §1.13, §3.2). That has to be his click.

**But the click-through did not need to be clicked to be read.** I recovered it verbatim from the client bundle that renders it.

## THE FIRST PASS WAS WRONG ON ITS CENTRAL CLAIM

There *are* successor agreements. Three of them, all live, all dated 2025, none reachable from the sitemap. Found via `https://account.emotiv.com/my-account/cortex-apps/` (the route exists; login-walled) which loads one page-unique bundle, `/static/cortex-app/cortex-appV2.js` (809 KB), containing the hardcoded document URLs:

| Document | Canonical URL (301s to `id.emotiv.com`) |
|---|---|
| **Emotiv API License Agreement** | `https://cerebrum.emotivcloud.com/api/privacy/doc/api-license-2025/` |
| **Emotiv Developer License Agreement** | `.../doc/developer-license-2025/` |
| **Emotiv Consumer Devices Distribution License Agreement** | `.../doc/consumer-devices-distribution/` |

I fetched and read all three in full (200 OK, 29,485 / 23,998 / 25,287 bytes).

**Correction 1 — the "deprecated" doc is not deprecated, it is the API License Agreement.** `diff` of the extracted text of `doc/developer-license/` vs `doc/api-license-2025/` returns **exactly one differing line**: the title. `Emotiv Developer License Agreement (deprecated)` vs `Emotiv API License Agreement`. Same body, byte-for-byte otherwise. So the first pass read the right text under the wrong name.

**Correction 2 — `developer-license-2025` is a genuinely new, distinct document** (3,385 words vs 4,088), not a retitle. It is what the App-ID click-through actually presents first.

## THE CLICK-THROUGH, VERBATIM

Modal (`className:"cortex-not-accept"`), title **"Developer License Agreement"**:

> "In order to access features and EEG access for consumer headsets, please read and accept our latest Developer's License agreement."

Three conditionally-rendered checkboxes:

> "I have read and agree to the updated **Developer License Agreement\*.**" — link → `developer-license-2025`
> "\*This license grants you the following data access:"
> "Professional Headsets (EPOC, FLEX):" — "All data streams (except EEG and High-Resolution PMs)"
> "Consumer Headsets (MN8, Insights):" — "All data streams (including EEG and High-Resolution PM)"

> "I have read and agree to the updated **API License Agreement.**" — link → `api-license-2025`

> "I acknowledge the terms of the **Distribution License Agreement** and understand that distribution is subject to these terms." — link → `consumer-devices-distribution`

> "I am at least 16 years old."

Buttons: `"Don't accept"` / `"Accept"` (Accept disabled until all rendered boxes checked). Gate banner:

> "You need to accept our latest developer license agreement in order to create new app ID's or view your previously registered ID's. You also need to accept the terms of our Distribution License Agreement in order to legally distribute and monetize your application."

Separate checkbox on the registration form itself (`cortex-register-checklicense`):

> "I agree and accept the details delineated in the **API License Agreement**"

Acceptance POSTs to `wp-json/user/sign-privacy` with `{license_types:[...], sub}`, values `"api-license-2025"`, `"developer-license-2025"`, `"consumer-devices-distribution"`.

**Answer to the question asked: it presents a new, previously unpublished set of agreements — not the EULA/Terms of Use, and not (by that name) the deprecated document.** The escape hatch the first pass hoped for does not exist.

## WHAT THIS DOES TO THE GATING DECISIONS

**(1) Open-source distribution: still NO, and the gate is now harder and specific.** Developer License 2025 §6.1 adds a clause the old text lacked — a Distribution License Agreement is required to distribute "outside of Your organization **or in excess of Your number of License Seats**" (§4.1: five seats). §6.2 retains the free/open-source-list requirement verbatim. And the DLA §2.4 is far more demanding than "contact customer service":

> "If the Third Party Software will be distributed as Open Source Software, You must provide a copy (including the compiled code) of the Open Source Software to EMOTIV for review and approval, in EMOTIV's sole discretion. … You are not permitted to disclose Your App ID, Client ID and Client Secret in the source code of the Open Source Software."

Prior review and approval at Emotiv's sole discretion, before publishing. Also DLA §5.5: "You agree to prominently display the phrase 'Powered by Emotiv' on the launch screen or equivalent of the Third Party Software and on all related marketing material, including the website." And §5.2(g) is a flat non-disparagement clause covering "EMOTIV's products, services, reputation, or personnel."

**Serious scope problem for Manifest:** DLA §1.6 defines "Consumer Devices" as "MN8 devices and Insight devices (including their successors)." **EPOC X is not covered.** This DLA cannot authorize distributing an EPOC-X app at all — §2.1 says research products need "a different license from EMOTIV," which is not published anywhere I could find.

**(2) The 20% royalty is not marketing-only — but it is also not 20%.** DLA Exhibit A is **filled in**, unlike the API License's:

> "Once You have had $250,000 in total Gross Sales, You will begin paying EMOTIV a distribution license fee equal to **15%** of the amount of all additional Gross Sales"

Quarterly certified reports, 1.5%/month late charge, audit rights. The API License's Exhibit A does still read `[Insert amount and calculation of the API License Fee below]` — first pass correct there. The `emotiv.com/pages/developer` marketing page still says 20%; the executed instrument says 15%.

**(3) Classifier training — the first pass's §10.2(g) quote is right for the wrong document.** "access the API in order to build a competitive product or service" appears **only in the API License Agreement** §10.2(g). The Developer License 2025 §10.2(g) drops that phrase entirely: "(g) to monitor the availability, performance or functionality of the API or other EMOTIV software, or for any other benchmarking or competitive purposes". Since the click-through makes them accept **both**, the competitive-product bar does bind — but via the API License, not the Developer License.

**New clause the first pass missed, and it is the most dangerous one for an open-source BCI OS shell** — Developer License 2025 §4.5:

> "You may not take any actions that may cause or result in the fragmentation of the API, including but not limited to distributing, participating in the creation of, or promoting in any way a software development kit derived from the API."

Manifest's positioning is "modality-agnostic BCI OS" — an abstraction layer over Cortex. That is arguably a derived SDK. Flag this to a lawyer before the Z Fellows pitch commits to the framing.

## NOT VERIFIED — stated as such

- **The Terms of Use §5 data-ownership quotes from the first pass ("You retain ownership of the scan data…", "EMOTIV is the owner of all information, derivative metrics…") I could NOT verify.** `id.emotiv.com/eoidc/privacy/terms/` returns an 18 KB shell with an empty body; text is JS-injected and `common.js` (23 KB) contains no matching endpoint. web.archive.org is blocked in this environment. Given that a prior round produced a fabricated quotation, treat those two strings as **unconfirmed** until someone reads the rendered page in a browser. This is "not reached under a constrained search," not "does not exist."
- Whether the free/open-source license list is public: not found.
- The research/professional-device distribution license (needed for EPOC X): not found at any probed slug. I probed 15 slugs under `/eoidc/privacy/doc/`; only `developer-license`, `eula`, `api-license-2025`, `developer-license-2025`, `consumer-devices-distribution` return 200.
- Whether the click-through renders all three checkboxes for a new account or only some (rendering is conditional on server-returned `license_type … !accepted` flags). Requires a real logged-in session.

Saved artifacts: `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/` — `new_api-license-2025.html.txt`, `new_developer-license-2025.html.txt`, `dist.txt`, `cortexapp.js`.

Sources: [API License 2025](https://id.emotiv.com/eoidc/privacy/doc/api-license-2025/) · [Developer License 2025](https://id.emotiv.com/eoidc/privacy/doc/developer-license-2025/) · [Distribution License (Consumer Devices)](https://id.emotiv.com/eoidc/privacy/doc/consumer-devices-distribution/) · [deprecated doc](https://id.emotiv.com/eoidc/privacy/doc/developer-license/) · [EULA](https://id.emotiv.com/eoidc/privacy/doc/eula/) · [cortex-appV2.js](https://account.emotiv.com/static/cortex-app/cortex-appV2.js)


## Follow-up: Email Emotiv customer service to request addition to the free/open-source license list under API License Agreement §6.2, and in the same message ask which developer agreement is currently operative given that the published one is marked deprecated. Record the response verbatim.

None


---

# MediaPipe FaceLandmarker model weight commercial terms

**Confidence: RESOLVED**

**Bottom line:** Yes — Manifest can ship this commercially and open-source it, with no field-of-use restriction. All three sub-models inside `face_landmarker.task` (BlazeFace detector, FaceMesh V2 landmarks, Blendshape V2) each state "LICENSED UNDER / Apache License, Version 2.0" on their own official Google model cards. There is no separate model licence, no Responsible-AI/RAIL licence, no acceptable-use policy, and no commercial restriction anywhere in the chain — I looked for one specifically and did not find it. Fetching the weights from Google's CDN at runtime imposes no obligations on Manifest at all; redistributing the `.task` file in the repo or an npm package triggers Apache-2.0 §4 (ship the licence text, retain notices) — which is trivial, so redistribute if you want the offline/privacy story. The model cards' "not intended for human life-critical decisions" language is advisory model-card text, not licence terms, and BlazeFace's card actually names "entertainment and assistive technologies" as its primary intended application.

TOPIC: MediaPipe FaceLandmarker model weight commercial terms
Access date for all sources: 2026-07-19

METHOD NOTE / LIMITATION UP FRONT
This session's WebSearch budget was already exhausted (200/200) before I began, so I performed **zero** keyword discovery. Every finding below comes from directly fetching or downloading a primary artifact at a URL I already knew or that a fetched document handed me. This is a limitation on *discovery breadth* (I cannot claim I searched the whole space and found no restrictive licence), but not on *evidence quality* — I read the actual model cards, the actual repo LICENSE, the actual npm tarball, and the actual weight bundle. Where I am inferring rather than quoting, I say so explicitly.

---

## 1. What is actually inside the weight bundle

Downloaded the real file:

```
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
→ HTTP 200, 3,758,596 bytes
```

It is a ZIP. `unzip -l` output, verbatim:

```
   229746  05-03-2023 18:01   face_detector.tflite
  2553590  05-03-2023 18:01   face_landmarks_detector.tflite
    19376  05-03-2023 18:01   geometry_pipeline_metadata_landmarks.binarypb
   955312  05-03-2023 18:01   face_blendshapes.tflite
```

**Note: there is no LICENSE or NOTICE file inside the bundle.** The licence must therefore be established from the model cards, which is what the docs page points you to.

I also enumerated the hosting bucket via the GCS JSON API (`storage.googleapis.com/storage/v1/b/mediapipe-models/o?prefix=face_landmarker/`). It returns exactly two objects — the `float16/1/` and `float16/latest/` copies of the `.task` file. **There is no adjacent LICENSE file in the bucket**, and a direct request for one returns HTTP 404. So the weights are distributed bare, with the licence asserted elsewhere.

## 2. The model cards — the operative legal statements

The docs page (`https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker`; `ai.google.dev/edge/...` 301-redirects here) links three separate model cards, one per sub-model. This confirms the premise that the sub-models are documented separately. I downloaded all three PDFs and extracted their text layers.

**a) Face detector — "MediaPipe BlazeFace Model Card (Short Range)"**
`https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20(Short%20Range).pdf`
Dated June 9, 2021. Verbatim (this PDF has a clean text layer — zero extraction artifacts):

> LICENSED UNDER
> Apache License, Version 2.0

**b) Landmark model — "Model Card MediaPipe Face Mesh V2"**
`https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf`
Model date September 15, 2022. Verbatim:

> LICENSED UNDER
> Apache License, Version 2.0

**c) Blendshape predictor — "Model Card Blendshape V2"**
`https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf`
Model date November 11, 2022. Verbatim:

> LICENSED UNDER
> Apache License, Version 2.0

**Verdict on the core question: the weights are Apache-2.0. Not a bespoke Google model licence, not a Responsible-AI/RAIL licence, not source-available-with-restrictions.** Each of the three separately-licensed sub-models independently carries the same grant, so the "they may be licensed separately" concern from the previous round is real in structure but resolves to the same answer three times.

*Transparency on quote fidelity:* the FaceMesh and Blendshape PDFs have a lossy text layer that silently drops `rt`/`rf`/`fi`/`tt` ligatures (e.g. "entertainment" extracts as "ente ainment", "identification" as "identi cation"). I verified this — the BlazeFace PDF has 0 such artifacts, FaceMesh has 5, Blendshape has 4. The two-line "LICENSED UNDER / Apache License, Version 2.0" strings contain no ligatures and extracted cleanly in all three files, so those quotes are exact. Where I quote longer passages from FaceMesh/Blendshape below I flag reconstruction.

## 3. Corroboration from the other distribution channels

**GitHub repo** (`google-ai-edge/mediapipe`): `raw.githubusercontent.com/.../master/LICENSE` is the Apache License 2.0, opening verbatim:

> Apache License
> Version 2.0, January 2004
> http://www.apache.org/licenses/

I searched the repo file tree via the GitHub API for additional licence artifacts: there is exactly **one** `LICENSE` file at the repo root and **no `NOTICE` file anywhere**. (The root LICENSE does append one unrelated permissive Lucent Technologies 2002 grant covering some UTF utility files — irrelevant to model weights, but noting it so the record is complete.) There is no separate model-weights licence checked into the repo.

**Official Kaggle Models org** — Google's own `mediapipe` publisher account. I queried the Kaggle API (`/api/v1/models/list?owner=mediapipe`). All 11 official models report `"licenseName": "Apache 2.0"`, including `mediapipe/face-landmarks-detection` and `mediapipe/facemesh`. (A separate Kaggle hit, `haikalthrq/mp-face-landmarker`, is a **third-party reupload** — its byte count 3,758,596 matches the official bundle exactly — and its "Apache 2.0" tag is a random user's assertion, not Google's. I am not counting it as evidence, only flagging that it exists so nobody mistakes it for a source.)

**npm `@mediapipe/tasks-vision`** — latest 0.10.35. `package.json` declares `"license": "Apache-2.0"`. I extracted the full tarball; the file list is:

```
package/vision_bundle.cjs, vision_bundle.mjs, vision.d.ts, package.json, README.md,
package/wasm/vision_wasm_internal.{js,wasm}, vision_wasm_module_internal.{js,wasm},
package/wasm/vision_wasm_nosimd_internal.{js,wasm}
```

**Two things worth Manifest's attention here.** First, the npm package contains **no `.task` model weights at all** — it ships only the WASM runtime, and the README's own example fetches weights from `storage.googleapis.com` at runtime. Runtime and weights are genuinely separate distributions with separate delivery paths. Second, the tarball bundles **no LICENSE file** — the Apache-2.0 claim exists only as an SPDX string in `package.json`. That is Google's own minor compliance sloppiness, not Manifest's problem, but it means if you vendor this package you should not assume a licence text came along with it.

## 4. Acceptable-use / prohibited-use: I looked, and there is none

I specifically checked for a policy that could touch (a) processing faces of disabled users, (b) accessibility input devices, (c) inferring state from facial geometry. Findings:

- **Apache 2.0 contains no field-of-use restriction whatsoever.** It is a bare permissive grant. There is no clause a facial-input accessibility product could violate.
- The MediaPipe solutions guide page (`developers.google.com/edge/mediapipe/solutions/guide`) states only the standard boilerplate: *"the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."* It sets out **no** prohibited-use policy, acceptable-use policy, or commercial restriction.
- **Google's Generative AI Prohibited Use Policy does not attach here.** These are discriminative CV models distributed under Apache 2.0 from a public GCS bucket with no click-through, no API key, and no terms acceptance. Nothing in the delivery path incorporates Gemini/Google-AI terms. *(Flagging this as my reasoned reading of the distribution mechanics, not something I found stated in a document — no document says "the GenAI policy does not apply," because no document connects them in the first place.)*

**The model cards' "out-of-scope" sections are advisory, not licence terms.** This distinction matters and I want to be precise about it: a model card's "Out-of-Scope Applications" box is documentation of what the model was validated for. It is not incorporated into the Apache-2.0 grant, creates no contractual obligation, and cannot be breached. It is a product-risk and duty-of-care signal, not a legal gate. With that framing, the relevant content:

BlazeFace card, "Ethical Considerations → HUMAN LIFE", verbatim (clean text layer):

> The model is not intended for human life-critical decisions. The primary intended application is entertainment and assistive technologies.

**This is actively favourable for Manifest.** Google's own card names *assistive technologies* as a primary intended application of the face detector. An accessibility input device is squarely inside the documented intent, not at its edge.

BlazeFace, "Out-of-scope applications", verbatim:

> Any form of surveillance or identity recognition is explicitly out of scope and not enabled by this technology

Manifest does neither — it maps facial geometry to a five-command vocabulary and does not identify anyone. Aligned.

FaceMesh V2 and Blendshape V2 both list, under "Out-of-scope applications" (*reconstructed from a lossy text layer — ligatures restored; substance is faithful, exact character-level wording is not guaranteed*): "This model is not intended for human life-critical decisions" and "Predicted face landmarks do not provide facial recognition or identification and do not store any unique face representation." Both name "AR entertainment" as the primary intended application, with intended users being "people who use augmented reality for entertainment purposes."

**The one honest flag:** FaceMesh and Blendshape were validated for AR entertainment, and all three cards disclaim "human life-critical decisions." An accessibility input device for disabled users is a *more* consequential deployment than avatar puppetry — a failed input for someone with no alternative input modality is a real harm even if it isn't life-critical. This is not a licensing obstacle and does not block shipping. It is a reason to hold the honest-labelling and low-confidence-state discipline already in Manifest's product bar, and to avoid any claim that facial geometry infers user *state* (fatigue, attention, affect) — the blendshape card supports expression coefficients for avatar control, and nothing in it validates inference about a person's condition. Claiming otherwise would be overclaiming beyond the model card, which is a credibility and product problem rather than a legal one.

## 5. Browser-side execution vs. redistributing the weights

The terms are identical — Apache 2.0 governs both — but the **obligations differ**, because the obligations attach to distribution, not to use.

**Running client-side, fetching weights from Google's CDN at runtime:** Manifest distributes nothing. Apache-2.0 §4 ("Redistribution") is not triggered. There are **zero** licence obligations on Manifest in this configuration. Note the operational trade-off is not legal but practical: you depend on Google's bucket staying up, and every user's browser hits Google.

**Redistributing `face_landmarker.task` in the repo, an npm package, or a desktop build:** this is redistribution and Apache-2.0 §4 applies. Verbatim from the licence:

> 4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:
>
> (a) You must give any other recipients of the Work or Derivative Works a copy of this License; and
>
> (b) You must cause any modified files to carry prominent notices stating that You changed the files; and
>
> (c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work...

In practice, since Manifest would ship the `.task` unmodified: include the Apache-2.0 licence text and attribute the model to Google. Clause (b) does not bite (no modification). Clause (d)'s NOTICE-file requirement does not bite either — I confirmed **no NOTICE file exists** in the mediapipe repo, so there is nothing to propagate.

Apache 2.0 also carries an **express patent grant (§3)**, which is a genuine advantage over a bare MIT/BSD for a company shipping a CV product commercially, with the standard patent-litigation termination trigger.

## 6. What I could not establish

Google publishes no single document saying "the `face_landmarker.task` composite bundle is Apache-2.0." That conclusion is assembled — correctly, but assembled — from the three constituent model cards each independently declaring Apache 2.0, plus the repo LICENSE covering the fourth artifact (`geometry_pipeline_metadata_landmarks.binarypb`, which is generated from the Apache-2.0 MediaPipe repo). All four files in the bundle are accounted for, so coverage is complete, but I want the inference visible rather than dressed up as a direct quotation.

---

## Sources
- [MediaPipe Face Landmarker docs](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker)
- [MediaPipe Solutions guide](https://developers.google.com/edge/mediapipe/solutions/guide)
- [BlazeFace (Short Range) Model Card PDF](https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20(Short%20Range).pdf)
- [MediaPipe Face Mesh V2 Model Card PDF](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf)
- [Blendshape V2 Model Card PDF](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf)
- [face_landmarker.task weight bundle](https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task)
- [google-ai-edge/mediapipe LICENSE](https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE)
- [@mediapipe/tasks-vision on npm](https://registry.npmjs.org/@mediapipe/tasks-vision)
- [Official MediaPipe publisher on Kaggle Models](https://www.kaggle.com/organizations/mediapipe)

Local copies of every fetched artifact are in `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/` (`fl.task`, `blazeface.pdf/.txt`, `facemesh.pdf/.txt`, `blendshape.pdf/.txt`, `tv.tgz`).


## Follow-up: Does Manifest's browser-side facial-geometry processing trigger biometric-privacy statutes — specifically Illinois BIPA (which requires written consent before capturing a 'scan of face geometry' and carries a private right of action), Texas CUBI, Washington HB 1493, and GDPR Art. 9 special-category data — and does the fact that processing stays client-side with no transmission or persistence take it outside those definitions?

# BIPA / CUBI / WA / GDPR analysis — MediaPipe FaceLandmarker in Manifest

**Headline: the client-side-only architecture does NOT take you outside BIPA or Texas CUBI on the statutory text. It does take you outside Washington, and GDPR Art. 9 is avoided — but for a different reason than you think (purpose, not locality). You need a consent gate before camera activation. This is a real gating risk, not a theoretical one.**

I am not a lawyer and this is not legal advice. Given BIPA's class-action economics, this is worth an actual hour of outside counsel before shipping.

---

## 1. Illinois BIPA — the real exposure

**The statutory text has no transmission, storage, or persistence element.** 740 ILCS 14/10 defines "biometric identifier" as (quoted verbatim in *Zellmer*, below, and in *Clements*): "a retina or iris scan, fingerprint, voiceprint, or **scan of hand or face geometry**." §15(b) is triggered by "collect, capture, ... or otherwise obtain." Nothing conditions liability on the data leaving the device. **"It stays in the browser" is not a defense recognized in the text.**

Note the definitional asymmetry that drives everything: "biometric **information**" is expressly limited to data "based on an individual's biometric identifier **used to identify an individual**." "Biometric **identifier**" contains no such phrase.

### The one strong defense: *Zellmer v. Meta Platforms*, No. 22-16925 (9th Cir. June 17, 2024)

I read the full opinion. Verbatim:

> "In other words, if either form of biometric data cannot identify an individual, it is not an identifier and thus not covered by BIPA."

> "**For example, scans of face geometry fall within BIPA's list, but are not covered by BIPA if they cannot identify a person.**"

> "We join the other courts to have considered this issue and reject Zellmer's argument."

This is directly on point and it is the argument Manifest would run. **But four problems, and the fourth is serious:**

1. Ninth Circuit construing Illinois law. Not binding on Illinois courts or the Seventh Circuit. I found no Illinois Supreme Court decision resolving it — *Zellmer* itself says it is joining other (federal) courts.
2. Meta won at **summary judgment**, not on a motion to dismiss, after years of litigation. The defense is evidentiary, not a pleading-stage exit.
3. It required a sworn engineering declaration (the McCoy declaration) establishing non-identifiability as undisputed fact.
4. **The McCoy declaration says things Manifest cannot say.** Verbatim from the opinion, describing Meta's face signature: those numbers *"do not reveal any geometric information about the detected face in the image, nor do they correspond to facial features like the eyes or nose, or distances between them."* MediaPipe FaceLandmarker output is the opposite — 478 named 3D landmark coordinates that correspond *precisely* to eyes, nose, and the distances between them, plus blendshape coefficients. **Manifest's data is materially more "geometry" than the data *Zellmer* excused.** The court also treated Zellmer's own evidence that face signatures include "the geometric x and y coordinates within the photo where a person's face appears" as insufficient — but that was 2D bounding-box coordinates, not a dense 3D mesh. Do not assume the analogy holds.

### Illinois and the Seventh Circuit are going the other way on browser face-scanning

*Clements v. Gunnar Optiks, LLC*, No. 25-1890 (7th Cir. July 10, 2026) (Easterbrook, J.) — **decided nine days ago.** This is a browser "virtual try-on" face-scanning case. Verbatim:

> "**Gunnar does not deny that information about faces is within the scope of that law.**"

The court vacated a dismissal and remanded, rejecting the HIPAA/health-care exclusion. Two honest caveats: that sentence is a party concession, not a holding on the identifier question; and Gunnar's VTO **did transmit** — "A camera on a user's device would scan the user's face **and send to Gunnar data** enabling it to display for the consumer images of how its models would look when worn." Manifest's architecture is distinguishable on that fact. The companion Illinois state case, *Marino v. Gunnar Optiks LLC*, 2024 IL App (1st) 231826, likewise decided only the health-care exclusion; the appellate court analyzed VTO facial-geometry scanning as within the Act without questioning it.

**Reading:** the courts closest to Illinois are not treating browser-based face-geometry capture as presumptively outside BIPA.

### Damages — materially better than the pre-2024 picture

740 ILCS 14/20 gives a **private right of action** (the only one of the four regimes here): $1,000 liquidated or actual damages for negligent violation, $5,000 for intentional/reckless, plus attorneys' fees, costs, expert fees, and injunctive relief. Critically, §20(b) — the 2024 amendment — now provides that an entity collecting from the same person by the same method in multiple instances "committed a **single violation**" with only one recovery. That kills the per-frame/per-scan damages theory that made BIPA existential. Exposure is now roughly (Illinois users) × $1,000–5,000 + fees. For a two-person startup that is still ruinous at any scale, but it is finite.

---

## 2. Texas CUBI — Tex. Bus. & Com. Code §503.001

Same structural problem as BIPA: the trigger is **capture**, not retention. Definition is "a retina or iris scan, fingerprint, voiceprint, or **record of hand or face geometry**." §503.001(b) requires informing the individual and obtaining consent **before capturing** for a commercial purpose. Client-side-only doesn't help.

Mitigations: consent need not be *written* (unlike BIPA); enforcement is **Texas AG only**, no private right of action; civil penalty up to $25,000 per violation. Risk profile is regulatory, not class-action. I did **not** verify current Texas AG enforcement posture (Justia returned 403 and my search budget was exhausted) — treat any recollection of large Texas biometric settlements as unverified.

---

## 3. Washington RCW 19.375 — Manifest is almost certainly outside it

Three independent reasons, all from the statute:

1. **Definition** (RCW 19.375.010, verbatim from leg.wa.gov): a biometric identifier is data from automatic measurements of biological characteristics "**that is used to identify a specific individual**" — and expressly **excludes** "physical or digital photographs," "video or audio recordings," and "**data generated from photographs, video, or audio recordings.**" Landmarks derived from a webcam video stream and used for cursor control fail the identification clause and fall inside the derived-from-video exclusion.
2. **Operative prohibition** (RCW 19.375.020(1), verbatim): "A person may not **enroll a biometric identifier in a database** for a commercial purpose, without first providing notice, obtaining consent, or providing a mechanism to prevent the subsequent use..." Client-side-only never enrolls anything in a database. This is the one statute where your architecture is dispositive.
3. **Enforcement** (RCW 19.375.030, verbatim): "This chapter may be enforced solely by the attorney general under the consumer protection act, chapter 19.86 RCW." No private right of action.

---

## 4. GDPR — Art. 9 not triggered, but ordinary GDPR still applies

Art. 4(14) defines biometric data as "resulting from specific technical processing ... **which allow or confirm the unique identification** of that natural person." Art. 9(1) prohibits processing biometric data "**for the purpose of uniquely identifying** a natural person."

I extracted the EDPB **Guidelines 3/2019 on processing of personal data through video devices** PDF and read §5.1. The three criteria, verbatim at ¶76:

> "Nature of data : data relating to physical, physiological or behavioural characteristics of a natural person, — Means and way of processing : data 'resulting from a specific technical processing', — **Purpose of processing: data must be used for the purpose of uniquely identifying a natural person.**"

And ¶80, directly on point for Manifest:

> "**However, when the purpose of the processing is for example to distinguish one category of people from another but not to uniquely identify anyone the processing does not fall under Article 9.**"

Manifest's purpose is intent/cursor control, not identification → **Art. 9 is not triggered.** Good.

**But read ¶82's Example 5 before you build the compliance story around ephemerality:**

> "The system would be unlawful if it captures visitors or passers-by who have not consented to the creation of their biometric template, **even if their template is deleted within the shortest possible period. Indeed, these temporary templates constitute biometric data** processed in order to uniquely identify a person..."

**The EDPB expressly rejects "we delete it immediately" as an escape from Art. 9.** What saves Manifest is *purpose*, not locality or transience. Keep the purpose narrow and documented; the moment anyone proposes a "recognize returning users by face" feature, Art. 9 snaps on and you need explicit consent under Art. 9(2)(a).

Independently: the landmarks are still **Art. 4(1) personal data**, and Manifest is the controller — it determines the purposes and means of the processing even though the CPU cycles happen on the user's machine. So you still owe lawful basis, Art. 13 transparency, data minimisation, and likely an Art. 35 DPIA (facial processing of a vulnerable population is a strong DPIA trigger). *This is my legal reasoning, not a quoted authority — I did not find a document squarely addressing browser-local controllership.*

---

## 5. Disabled users and consent capacity — the part I could not resolve

I found **no** case law or regulatory guidance on BIPA written-release requirements for users who cannot execute a conventional written consent. That is "not found under a constrained, search-budget-exhausted investigation," not "does not exist."

The design problem is real and, I think, underappreciated in your positioning: **BIPA §15(b) requires a written release, and your target user may need the face-tracking input to operate the consent UI at all.** A consent gate that requires a mouse click or a signature is a gate your user cannot pass without first using the thing they haven't consented to. You need a consent path that is operable by keyboard, switch, voice, or caregiver proxy — and if it's caregiver/guardian proxy, whether that's a valid "written release" by "the subject or the subject's legally authorized representative" is a fact question about guardianship status that varies by user. GDPR capacity rules are Member-State law and not harmonized. Flag this to counsel specifically; it is not a generic consent-flow question.

---

## 6. What I'd actually do

1. **Ship a consent gate before camera activation. Everywhere, not just Illinois.** Geo-gating Illinois is fragile (IP geolocation, VPNs, travel) and looks worse in litigation than universal consent.
2. Make it satisfy BIPA §15(b)'s three elements explicitly: (i) written notice that a scan of face geometry is being collected/stored, (ii) the **specific purpose** and **length of term**, (iii) a logged affirmative written release. Texas CUBI's notice+consent is then satisfied a fortiori.
3. **Publish a written retention and destruction policy (§15(a)) even though you retain nothing.** The policy obligation is independent of whether you actually retain. "Retention period: zero; landmarks exist only in volatile memory for the duration of a frame and are never persisted or transmitted" is a valid policy and a strong one.
4. **Treat client-side-only as evidence, not as a defense.** It doesn't get you out of §15(b), but it drives §15(a), (c), (d), (e) exposure to near zero, it materially supports a *Zellmer* non-identifiability argument, and it's the most credible privacy claim in your pitch. Document it as an architectural commitment with a test that asserts no network egress from the landmark pipeline.
5. **Do not assert in marketing or in a privacy policy that the landmarks cannot identify anyone** unless you've tested it. Post-*Zellmer* that is a factual claim you'd have to defend with a declaration, and a 478-point 3D mesh is a harder sell than Meta's opaque embedding. An overclaim here converts a defensible position into a deceptive-practices problem.

---

## Verification honesty

- **WebSearch budget was exhausted (200/200) before this task began.** Everything above is from direct WebFetch of primary documents plus CourtListener's API as a search substitute. There was no broad survey of district-court decisions; CourtListener's district coverage is partial.
- **ilga.gov returned 404 on every URL pattern I tried** (five variants). BIPA §10, §15, and §20 text came from FindLaw's codes mirror, which returned partially summarized rather than strictly verbatim output. §10's definition and the health-care exclusion are independently corroborated by verbatim quotation inside the *Zellmer* and *Clements* opinions, which I read in full from PDF. **I did not read §15(b)'s exact wording from an official source** — verify that clause before drafting consent copy.
- Fully verbatim and from official/primary sources: *Zellmer* (CA9 PDF), *Clements* (CourtListener storage PDF of the CA7 opinion), *Marino* (illinoiscourts.gov PDF), RCW 19.375.010/.020/.030 (leg.wa.gov), GDPR Art. 4/9 (gdpr-info.eu), EDPB Guidelines 3/2019 (edpb.europa.eu PDF, extracted locally with pdftotext).
- Texas §503.001 came from texas.public.law, partially summarized; statutes.capitol.texas.gov returned only navigation chrome.
- **Not checked at all:** Colorado C.R.S. 6-1-1314 (Justia 403), Oregon, and any state AG enforcement history. Colorado's biometric consent amendment is a live fifth axis I could not verify.

**Local files:** `/tmp/zellmer.txt`, `/tmp/clements.txt`, `/tmp/marino.txt`, `/tmp/edpb.txt` (extracted full texts, if you want to re-check any quotation).


---

# playAbility and the commercial camera-input accessibility field

**Confidence: PARTIAL**

**Bottom line:** Almost nobody has built a business here. playAbility is real and impressively maintained — Valentin Squirelo, Montreuil France, 2-10 people, founded 2023, 87+ public releases with the latest shipped yesterday (2026-07-18), €7.99/mo or €129 lifetime with a free tier — but it has no disclosed funding, no verifiable user count, and its 2024→2026 pricing shift went *toward* a more generous free tier. Around it: Sesame Enable's own site says it "shut down late '19" because "building a sustainable business model proved difficult"; Google archived Project Gameface (last commit Aug 2024, stuck at 633 stars); Camera Mouse and eViacam are free forever; Tobii refuses to sell TD Control standalone at all. The money in accessible input is hardware ($499–$2,775/unit), and Apple now ships camera-only Eye Tracking free on every iPhone. Worst news for Manifest: multi-modal *fusion* is not a differentiator — playAbility already mixes face, head, voice, gamepad, adaptive controllers and (since May 2026) eye trackers in one profile. Only automatic degradation-aware *failover* is genuinely absent, and AAC's decades of clinician-mediated multi-access-method practice suggest that absence may be a deliberate clinical choice rather than an unmet need.

# playAbility and the commercial camera-input accessibility field

**Research date: 2026-07-19.** All URLs accessed 2026-07-19 unless noted.

---

## METHOD DISCLOSURE — read this before trusting anything below

Three limitations, stated up front because the last round produced a fabrication:

1. **WebSearch was unavailable.** The session's 200-call web-search budget was already exhausted on my first call. I worked around it by fetching `html.duckduckgo.com/html/?q=…` and `lite.duckduckgo.com/lite/?q=…` as a search proxy, then **fetching the primary source directly for every load-bearing claim**. DDG snippets appear below only as a discovery trail, never as evidence.

2. **I did not read raw HTML.** `WebFetch` pipes each page through a summarizer model that returns quoted strings. Every "verbatim" quote below is a quoted string returned by that summarizer from the named URL — a real page, fetched, and the quote attributed to it. But I did not personally verify character-for-character against source HTML. Given last round's fabricated-quote incident, treat load-bearing quotes as **high-confidence but one layer removed**, and re-verify before putting any of them in a pitch deck. Quotes marked ⚠️ are ones I'd re-check by hand.

3. **One summarizer error caught in-flight, which validates the caution.** My first attempt to identify playAbility's founder fetched `raphael-thys.com` and got back "**Founder:** Raphael Thys." That is wrong — it is a designer's portfolio page describing work done *for* playAbility. Four independent sources (Steam developer field, 80.lv, playability.gg/why/, LinkedIn) give the founder as **Valentin Squirelo**. Had I stopped at one fetch, I would have shipped a hallucinated founder. I did not.

**Crunchbase returned HTTP 403** and `web.archive.org` is blocked from this tool, so I could not check funding records or historical site snapshots. **Funding data is therefore NOT FOUND UNDER A CONSTRAINED SEARCH — not "no funding exists."**

---

## PART 1 — playAbility

### Identity and company

| Field | Value | Source |
|---|---|---|
| Product | PlayAbility Adaptive Software | playability.gg |
| Domain | **playability.gg** (note: playability.io is a parked GoDaddy for-sale page; playability.de is an unrelated Berlin graphic-recording studio) | direct fetch |
| Founder | **Valentin Squirelo** | Steam developer field; 80.lv; playability.gg/why/ |
| Location | **95 Avenue du Président Wilson, 93100 Montreuil, Île-de-France, France** | myfrenchstartup.com/fr/startup-france/361414/playability |
| Founded | **2023** ("Création : 2023") | myfrenchstartup; LinkedIn "Founded 2023" |
| Headcount | **2–10** (LinkedIn and myfrenchstartup both say 2–10; RocketReach snippet said 3 — unverified) | linkedin.com/company/playabilitytech |
| LinkedIn followers | **615** | ibid. |
| Funding | **Not found.** No disclosed raise on myfrenchstartup ("-"). Crunchbase 403'd. | — |

⚠️ **Name conflict:** myfrenchstartup's page, via summarizer, attributed founding to "Valentin Choquet." Every other source says Squirelo. I could not reconcile this and it may be a summarizer error or a registry-vs-trading-name difference. **Do not cite either name in a deck without a direct check of the French company registry (SIREN).**

### Founder background (playability.gg/why/, verbatim)

> "To give everyone the ability to play video games using their own body and capabilities."

Squirelo is described as an inventor/developer with ~20 years in games and entertainment. Timeline given on that page: 2013 began building unconventional controllers; 2017 Nerf prosthetic; **2018 began public accessibility experiments on Twitch/YouTube**; **2023 PlayAbility launched**, developed live on Twitch with community input. Prior credits include the **Nosulus Rift** (a smell-based peripheral for Ubisoft's South Park game) and work with Red Bull. A French trade-press result (strategies.fr) indicates the project **won gold at the 2023 Concours Lépine** — *snippet only, I did not fetch the article; treat as unconfirmed.*

### Business model and pricing (playability.gg/pricing/, verbatim)

| Tier | Price | Terms |
|---|---|---|
| Free | **"0€"**, "No credit card needed" | **one profile**, "Access to all features", "Multiple computers" |
| Pro Monthly | **"7,99€ /month"** | "Unlimited profiles", "Use on all your computers", "Priority access to new features", "Try it risk-free for 30 days" |
| Pro Lifetime | **"129€"** | "One time payment", "Lifetime access", "All future updates included" |

Discounts: solo health professionals and occupational therapists get **"50% off the Pro Edition"** on direct contact (excludes organisations/bulk). Clinics, schools and institutions are told to **"contact us for volume pricing."**

**The model changed materially between 2024 and now.** The Nov 2024 *Can I Play That?* review describes a subscription with **a free tier capped at 5 hours per month** plus monthly/yearly/unlimited plans. Today the free tier is uncapped-but-one-profile. That is a move **away** from metered free usage toward a profile-count gate — a real signal that time-gating accessibility software didn't work socially or commercially.

Steam listing (`store.steampowered.com/app/4034950/`) is **"Coming soon"**, publisher **PlayAbility**, developer **Valentin Squirelo**, base app free with a **"PlayAbility Pro DLC"** described as a one-time purchase, "no subscriptions required." So Steam gets the lifetime SKU only. **No user reviews on Steam yet** (unreleased).

### Feature set and modalities fused

From `help.playability.gg/en/article/getting-started-with-playability-18kxz16/` (verbatim fragments):

- **Facial gestures**: "smile, blink, raise eyebrows, open mouth…"
- **Head tracking**: "turn, tilt, nod"
- **Voice**: "say 'jump', 'reload', or any custom phrase" (Steam page claims **24 languages**)
- **Conventional hardware**: "mouse, keyboard, and gamepad inputs"
- **Adaptive hardware passthrough**: "adaptive controllers (Xbox Adaptive Controller, Hori Flex, OpenRudder, etc.)", plus wheelchair joysticks and 8BitDo Micro
- **Eye tracking (Beta, May 2026)**: "Use eye tracking hardware to control overlay buttons with gaze."

**Crucially — multi-modal fusion is already a shipped, documented feature**, not a roadmap item:

> ⚠️ "Mix different input types in the same profile — for example, head movement for aiming, facial gestures for actions, and voice for quick commands."
> — help.playability.gg getting-started

Outputs: virtual gamepad, keyboard, mouse, on-screen overlay buttons/joysticks. Steam claims **"50+ facial expressions and head movements."** The *Can I Play That?* review independently confirms "up to 50 pre-made gestures" across Mouth, Brow and Eyes categories.

Platforms: **Windows only** for the app (min. Win 10, dual-core 2.0 GHz, 2 GB RAM — deliberately low-spec, no GPU required). **Linux beta** shipped with v2.0.0. Games/consoles reached via Steam, Epic, Game Pass, GOG, Amazon Luna, GeForce Now, plus **PS5 and Xbox via Remote Play** and **Nintendo Switch / Switch 2 via adapters**.

### Is it actively maintained? Emphatically yes — this is the strongest finding

Primary source: GitHub API on `playAbilityTech/playAbility-desktop-releases`:

| Tag | Published |
|---|---|
| v2.6.0-beta.2 | **2026-07-18** (yesterday) |
| v2.6.0-beta.1 | 2026-07-04 |
| v2.5.1 | 2026-05-29 |
| v2.5.0 | 2026-05-22 |
| v2.4.0 | 2026-03-10 |
| v2.3.0 | 2026-02-07 |
| v2.2.0 | 2026-01-23 |
| v2.1.0 | 2026-01-07 |
| v2.0.0 | 2025-12-18 |

Nine releases in seven months. And from the company LinkedIn (verbatim):

> ⚠️ "PlayAbility 2.0 is here. This is really just a symbolic milestone, it's actually the **87th public release since early 2023**."

Recent feature names matter for Manifest: **"Multi-Condition Triggers"** (v2.0.0), **"Control analog sticks with your eyes"** (v2.3.0), **"Auto Profile Switch"** (v2.5.0), and **"Mute Input"** (v2.5.0, verbatim: "Mute native keyboard and mouse input at the Windows OS level so only remapped output reaches games"). Auto Profile Switch is verbatim: *"Assign profiles to applications. PlayAbility automatically switches when a linked app gains focus."* — **that is app-context switching, NOT modality failover.** Do not conflate them.

### Traction, partnerships, sentiment

- **Traction:** the only number anywhere is playability.gg/why/'s **"Thousands of people play again."** That is a marketing claim with no denominator. `prospeo.io` estimates **$256,665** annual revenue — a third-party scraper estimate, **not evidence**, do not cite it.
- **Blacknut partnership (Dec 2024):** cloud-gaming platform Blacknut certified PlayAbility as a software controller. CEO Olivier Avaro, verbatim: ⚠️ *"At Blacknut, we believe that gaming is for everyone. Our partnership with and certification of PlayAbility underscores our commitment to removing barriers."* (pixelkin.org, 2024-12-03)
- **No evidence found** of partnership with Microsoft/Xbox Adaptive Controller programme, SpecialEffect, or AbleGamers. It *supports* the XAC as an input device; that is compatibility, not partnership. **NOT FOUND ≠ does not exist** — I searched narrowly.
- **Sentiment (Can I Play That?, 2024-11-26):** broadly positive, with a specific and important criticism — verbatim: *"The facial detection to have some issues"* with **asymmetrical faces and limited range of facial movement**, and a request for calibration by *"taking a snapshot of a user's neutral expression."* That is the single most operationally useful competitive fact in this brief: **the closest analogue's known weakness is exactly the population with the most severe motor impairment.** Verdict quote: *"For players with good control of facial gestures, playAbility can literally take a number of inputs out of their hands."* — note the conditional.

---

## PART 2 — The adjacent field

### Free / academic / abandoned

| Tool | Status | Evidence |
|---|---|---|
| **Camera Mouse** (Boston College, Gips & Betke) | Free forever, no ads, no registration. **>3 million downloads, 500–1,000/day** — but that milestone is from a **2016** article. bc.edu quote: *"with no gimmicks or advertisements or registration, because we want to help as many people as possible."* Latest build commonly listed as **"Camera Mouse 2018"**. `cameramouse.org` **refused connection** (ECONNREFUSED on 443) at time of access — could not confirm current maintenance. James Gips **died in 2018**, which is consistent with the 2018 build being the last. | bc.edu 2016-08-25; majorgeeks listing |
| **Enable Viacam / eViacam** | Free, **GPLv3**, suggested $12 donation. Latest **v2.1.0**. Windows/Linux/Android (EVA Facial Mouse). Site copyright reads **"© 2008-23"** — i.e. no update signal in ~3 years. | eviacam.crea-si.com |
| **Google Project Gameface** | **ARCHIVED.** GitHub API on `google/project-gameface`: `archived: true`, `pushed_at: 2024-08-30`, **633 stars**, 88 forks, **41 open issues**, Apache-2.0. | api.github.com, fetched 2026-07-19 |

**Project Gameface is the headline finding of Part 2.** Star count is **633 — identical to the previous round's figure**, meaning the repo has been flat for a year-plus. Last commit **Aug 2024**; Google archived it. Google shipped a well-publicised, Lance-Carr-inspired, MediaPipe-based camera-input accessibility project on desktop and Android, open-sourced it, and **walked away inside ~15 months.** Whatever Manifest's thesis is, it must explain why a project with Google's distribution died.

### Commercial — and note where the money actually is

| Product | Price | Modality | Note |
|---|---|---|---|
| **GlassOuse PRO** | **$799.00** | Head + bite switch + sip-puff + dwell — sold as **"A 3-in-1 Next Generation Assistive Device"** | Windows/macOS/iOS/Android/Linux/ChromeOS |
| **GlassOuse V1.4** | **$599.00** | Head, "150+ hours battery" | |
| **GlassOuse Link** | **$499.00** | "for individuals with limited or no head movement" | |
| **Quha Zono 2** | **$2,775.00** listed at Link Assistive (⚠️ **likely AUD** — Link Assistive is Australian; I did not confirm currency) | Gyroscopic head mouse | Quha's own site does not publish price |
| **HeadMouse Nano** (Origin Instruments) | **Not published** on product page | Optical head tracking w/ forehead target | Sold with bundles incl. sip/puff switches |
| **Tobii Dynavox TD Control** | **Not purchasable standalone** — verbatim: *"Currently unavailable to purchase as a standalone app"*; *"comes pre-installed and is currently available only on the TD I-Series"* and PCEye | Eye gaze | **Tobii deliberately refuses to sell software-only.** |
| **Talon Voice** | Patreon, **"Starting at $5/month"**, **993 members** | Voice + noise + eye tracking + scripting | No pricing page on the main site; no disabled-user free-access statement found |
| **Augmental MouthPad^** | **Price not published**; waitlist, "available across the United States" | Tongue + head gestures | **$4M seed** (Dealroom/Forbes snippets); MIT spinoff; Forbes 30U30. Explicitly **"not a medical device."** |

### The shutdown that answers the question

**Sesame Enable** — Israeli, Tel Aviv, founded 2012 by Oded Ben-Dov, touch-free head-controlled Android phone, WEF-recognised ("developed the world's first touch-free smartphone app for people with disabilities"). Their own site, still live, says:

> ⚠️ **"Unfortunately building a sustainable business model proved difficult and eventually the company shut down late '19."**
> — sesame-enable.com, accessed 2026-07-19 (site copyright 2020)

The products remain free. This is the cleanest available data point on the economics of camera-based accessible input: a well-funded, internationally decorated, mission-perfect company **explicitly names business-model failure as its cause of death**, and it did so about camera-based head control specifically.

### The free bundled competitor nobody in this space can price against

Apple, apple.com/accessibility (verbatim):

> "If you have reduced mobility or need to interact with your device without using your hands, you can navigate iPhone and iPad with just your eyes."

and it **"works with iOS and iPadOS apps and doesn't require additional hardware or accessories"** — front camera only, with Dwell Control, eye-typing, and integration with Switch Control. Free, on every recent iPhone. Any camera-input accessibility business must explain what it does that the OS vendor won't ship for free within two years. Project Gameface's archival is what that pressure looks like.

---

## PART 3 — Direct answers to the three key questions

### (1) Has anyone built a real BUSINESS on camera-based accessible input?

**Barely, and only one candidate.** playAbility is the single credible commercial camera-input software business I found: 2–10 people, France, three years old, 87+ releases, real pricing, a cloud-gaming partnership, no disclosed funding, no verifiable user count. That is a **sustainable indie software business, not a venture-scale one** — and I cannot even confirm it is sustainable, only that it is shipping.

Everything else sorts into: free-forever academic (Camera Mouse, eViacam), archived big-tech demo (Gameface), or **explicitly dead of business-model failure** (Sesame Enable). The money in accessible input is in **hardware** — $499 to ~$2,775 per unit — and even Tobii, the category leader, **refuses to unbundle its software from its hardware.** That is not an oversight; it is the industry's revealed answer to whether software-only access sells.

### (2) What do they charge and who pays?

For camera **software**, the honest answer is: **the end user, small amounts, reluctantly.** playAbility: €7.99/mo or €129 lifetime, with a free tier that got *more* generous over time. Talon: $5/mo Patreon, 993 patrons. The one structural hint at institutional payers is playAbility's **50%-off-for-OTs** offer and its "contact us for volume pricing" for clinics and schools — i.e. it is *courting* clinician-mediated and institutional purchasing but has no visible programme yet.

For **hardware**, the payer is plausibly insurer/school/charity — but **I did not verify a single reimbursement pathway, code, or funding scheme.** Not one of the vendor pages I fetched (Quha, GlassOuse, Origin, Tobii) mentioned insurance or reimbursement at all. **Treat the "insurers pay" assumption as UNVERIFIED.**

### (3) Does multi-modal failover already ship?

**Split answer, and the split is unfavourable to Manifest's framing.**

**The fusion half already ships, at playAbility, today.** Face + head + voice + gamepad + keyboard/mouse + adaptive controllers + (since May 2026) eye-tracking hardware, mixable in a single profile, with multi-condition triggers. Documented, verbatim, in their help centre. **Manifest cannot claim "fuses multiple modalities" as a differentiator against playAbility — it is a feature they shipped and iterated on for three years.**

**The failover half — automatic, degradation-aware graceful degradation — I did not find shipping anywhere.** playAbility's "Auto Profile Switch" is *application*-focus switching, not modality failover. Research exists (GazeSwitch, CHI/ACM 2024, ML-based real-time switching between eye and head pointing modes) but that is millisecond-scale pointing optimisation, not disease-progression adaptation.

**But be careful what you conclude from that gap.** In AAC, supporting a person across changing abilities is *standard practice*, delivered by devices that carry many access methods at once and by clinicians who reconfigure them. RM Speech's Inspire, for example, advertises *"multiple access methods including direct touch, assistive touch, single switch, multiple switches, head mouse, and eye gaze"* on one device. The field already solves this problem — **organisationally, with a human in the loop, deliberately.** The absence of *automatic* failover after decades of AAC practice is at least as likely to be a considered clinical choice as an unmet need: an access method that silently reassigns itself is an access method the user and their SLT no longer control.

---

## Sources (all accessed 2026-07-19)

- [playability.gg](https://www.playability.gg) · [pricing](https://www.playability.gg/pricing/) · [why](https://www.playability.gg/why/) · [whats-new](https://www.playability.gg/whats-new/) · [download](https://www.playability.gg/download/)
- [help.playability.gg getting-started](https://help.playability.gg/en/article/getting-started-with-playability-18kxz16/) · [help index](https://help.playability.gg/en/)
- [GitHub API: playAbilityTech/playAbility-desktop-releases](https://api.github.com/repos/playAbilityTech/playAbility-desktop-releases/releases?per_page=10) · [v2.5.0 notes](https://github.com/playAbilityTech/playAbility-desktop-releases/releases/tag/v2.5.0)
- [Steam: PlayAbility Adaptive Software](https://store.steampowered.com/app/4034950/PlayAbility_Adaptive_Software/)
- [Can I Play That? review, 2024-11-26](https://caniplaythat.com/2024/11/26/playability-accessibility-review/)
- [LinkedIn: playabilitytech](https://www.linkedin.com/company/playabilitytech) · [PlayAbility 2.0 post](https://www.linkedin.com/posts/playabilitytech_playability-20-is-here-this-is-really-just-activity-7408883125189021696-A_Xj)
- [myfrenchstartup: PLAYABILITY](https://www.myfrenchstartup.com/fr/startup-france/361414/playability)
- [80.lv on Squirelo](https://80.lv/articles/engineer-makes-gaming-more-accessible-with-face-operated-controls)
- [Pixelkin: Blacknut × PlayAbility, 2024-12-03](https://pixelkin.org/2024/12/03/revolutionary-software-expands-gaming-accessibility-by-using-your-face-as-the-controller/)
- [OpenAssistiveTech on playAbility](https://www.openassistivetech.org/face-and-voice-as-a-joystick-how-ai-expands-accessibility-in-gaming/)
- [Disabled World, 2024-10-25 (upd. 2026-06-29)](https://www.disabled-world.com/entertainment/games/playability.php)
- [GitHub API: google/project-gameface](https://api.github.com/repos/google/project-gameface)
- [BC News: Camera Mouse tops 3M downloads, 2016](https://www.bc.edu/bc-web/bcnews/science-tech-and-health/technology/camera-mouse-boston-college.html)
- [Enable Viacam](https://eviacam.crea-si.com/index.php)
- [Sesame Enable](https://sesame-enable.com/)
- [Apple Accessibility](https://www.apple.com/accessibility/)
- [Tobii Dynavox TD Control](https://www.tobiidynavox.com/products/td-control)
- [GlassOuse](https://glassouse.com/)
- [Origin Instruments HeadMouse Nano](https://www.orin.com/access/headmouse/)
- [Talon Voice](https://talonvoice.com/) · [Patreon/lunixbochs](https://www.patreon.com/lunixbochs)
- [Augmental](https://www.augmental.tech/)
- Discovery-only (snippets, not cited as evidence): html.duckduckgo.com, lite.duckduckgo.com

**Could not access:** crunchbase.com (403), web.archive.org (blocked by tool), cameramouse.org (connection refused).


## Follow-up: What is playAbility's actual paid-user count and revenue? Route: French company filings via SIREN/Pappers.fr for PLAYABILITY (Montreuil, 93100), the Steam page once it exits 'Coming soon' (review count is a proxy for installs), and direct outreach to Valentin Squirelo — a two-person student team asking a solo founder how the business is going often gets an honest answer.

## PLAYABILITY SAS — findings from primary records

**Company identified and confirmed.** SIREN **978633964**, RCS Bobigny, SAS, incorporated **2023-08-08**, 95 avenue du Président Wilson, 93100 Montreuil. VAT FR91978633964. Sole officer: **CHOQUET, Valentin, born May 1986, "Président de SAS"** — "Squirelo" is a pseudonym; there is also a separate sole proprietorship, "VALENTIN SQUIRELO (CHOQUET)", SIREN 523729325, created 2010-07-12, same address. Source: `recherche-entreprises.api.gouv.fr` (INSEE/RNE), full JSON record fetched.

### The revenue question has a definitive answer: it is legally sealed
BODACC (the official gazette; queried via the DILA open-data API) returns **exactly two announcements ever** for this SIREN, both accounts filings:
- 2025-05-23, FY ending 2023-12-31
- 2026-01-08, FY ending 2024-12-31

Both carry the identical notice, verbatim: *"Les comptes annuels sont accompagnés d'une déclaration de confidentialité en application du premier ou deuxième alinéa de l'article L. 232-25."*

societe.com confirms: *"Cette entreprise nous a transmis ses comptes sous clause de confidentialité."* The government API's `finances` field is `null`.

This is **not** "I couldn't find it" — it is "the filings exist and are lawfully withheld from publication." Pappers, societe.com, and any other aggregator will have nothing, because there is nothing to have. Pappers itself 403s on fetch. **The Pappers/SIREN route is closed.**

Article L232-25 (fetched verbatim from Légifrance, LEGIARTI000038611013): alinéa 1 lets **micro-entreprises** declare that the accounts "ne seront pas rendus publics" entirely; alinéa 2 lets **petites entreprises** withhold only the compte de résultat, leaving the bilan public. Since no bilan is public anywhere, this is almost certainly alinéa 1 — micro-entreprise. *Caveat: I did not fetch the numeric micro-entreprise thresholds (art. D123-200) — my recollection is bilan €450k / CA €900k / 10 employees, 2-of-3, but treat that as unverified.*

### Two hard structural facts that bound the answer anyway
1. **Zero employees.** INSEE returns `tranche_effectif_salarie: "NN"` and, at establishment level, `caractere_employeur: "N"` — explicitly a non-employer. **This contradicts the first pass's "2-10 people"**, which was the self-selected LinkedIn company-page band, not a filing. playAbility is one person.
2. **Capital social €1,000**, unchanged since incorporation. BODACC shows **no modification announcement of any kind** — no capital increase, ever. An equity round into a SAS changes registered capital and triggers an RCS modification notice. There has been none. `a_aide_minimis: false` in the government record — no recorded French state aid either.

### Steam route: the page exists, but the proxy doesn't work yet
App **4034950**, "PlayAbility Adaptive Software", developer "Valentin Squirelo", publisher "PlayAbility". Steam API: `"is_free": true`, `"coming_soon": true`. **Zero reviews, because it has not launched.** The review-count-as-installs proxy is unavailable and will stay unavailable until release.

The page does, however, contain the founder's own best traction claim, quoted exactly: *"PlayAbility's growing community (230+ members on Discord and counting) has shaped its development through feedback and testing."* That is the number he chose for a marketing page. The other credential offered is *"Gold Medal at Concours Lépine 2023"* — an inventors' fair, not commercial validation.

### Corrections to the first pass
- **playability.app is wrong** — it is a parked GoDaddy domain listed for sale. The real site is **playability.gg**.
- **Pricing is unchanged**, contra my own initial read of the Steam copy: playability.gg still lists Free €0 (one profile), **Pro €7,99/month**, **Pro Lifetime €129**. The Steam SKU is a *different* package — free with a one-time Pro DLC, "no time limits, no feature paywalls, and no subscriptions required" — because Steam doesn't do subscriptions. Both models run in parallel.
- **New and directly relevant to your clinical-channel question:** playability.gg offers *"Solo health professionals and occupational therapists receive 50% off Pro Edition."* The clinical channel is treated as a **discount** segment, not a premium one — the inverse of AAC/DME economics.
- The site's own roadmap still reads macOS "targeting Q2 2025" and Linux "planned for later in 2025", in July 2026. The app ships constantly; the business surface has not been touched in over a year.

### Bottom line
I cannot give you a revenue figure or a paid-user count, and I want to be plain that nobody can from public records — the accounts are sealed by statute. But the structural evidence is one-directional and, I'd argue, more decisive than a revenue number would be: **a €1,000-capital SAS, three years old, zero employees, no capital increase, no state aid, micro-entreprise accounts confidentiality, and a founder whose proudest public traction metric is 230 Discord members.** Nothing here has ever been optimized for growth. A company clearing meaningful ARR at €7.99/month would have hired, and hiring in France is visible in INSEE within a quarter.

Your framing anticipated this correctly. This wedge does not currently fund a company — it funds one determined person. The €7.99/€129 price point is *observed*, not *validated*; there is no evidence of volume behind it, and the 50%-off clinical discount suggests the founder does not believe the clinical channel bears a higher price either.

**Remaining route: direct outreach.** Contact is **team@playability.gg** (support: help.playability.gg; Reddit r/playAbility; X @playAbilityAI; LinkedIn company 93657543). Reddit is fetch-blocked from this environment, so the subreddit subscriber count — another cheap proxy — is still unchecked and worth a manual look. I did not send any email; that's your call to make.

Sources: [recherche-entreprises.api.gouv.fr](https://recherche-entreprises.api.gouv.fr/search?q=978633964) · [BODACC open data](https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records?where=registre%20LIKE%20%22978633964%22) · [Légifrance art. L232-25](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000006161292) · [societe.com](https://www.societe.com/societe/playability-978633964.html) · [Steam app 4034950](https://store.steampowered.com/app/4034950/) · [Steam appdetails API](https://store.steampowered.com/api/appdetails?appids=4034950) · [playability.gg/pricing](https://www.playability.gg/pricing) · [playability.gg/download](https://www.playability.gg/download)


## Follow-up: Is there any reimbursement pathway that pays for accessibility SOFTWARE rather than hardware — US Medicare/Medicaid SGD codes, UK NHS AT services, or EU national schemes? None of the vendor pages I fetched (Quha, GlassOuse, Origin, Tobii) mentioned insurance at all, and Tobii's refusal to unbundle TD Control from hardware may be precisely because software alone is not reimbursable.

## ANSWER: The first pass's hypothesis is WRONG. US Medicare explicitly reimburses software-only.

There is a named, operative sentence in the governing CMS policy article that says so directly.

**Primary source:** CMS Medicare Coverage Database, *Article A52469 — Speech Generating Devices (SGD) Policy Article*, section "NON-MEDICAL NECESSITY COVERAGE AND PAYMENT RULES." Verbatim:

> "For criterion 7, a device utilizing tablet, smartphone or computer hardware must be designed by the manufacturer to function solely as a speech generation device, as defined above, at the time of initial issue. Desktop, laptop, tablet, smartphone and other hand-held computers (i.e. general computing devices) are not considered DME because they do not meet criteria 3, 4, 6 and 7 above, even though they may serve a medical purpose. **Medicare will reimburse for speech generating software only (HCPCS code E2511) when installed on a general computing device.** The device itself must be coded A9270."

And from the same article's CODING GUIDELINES, verbatim:

> "Code E2511 is used to code for speech generating software programs that enable a laptop computer, desktop computer, tablet, smartphone or other hand-held general computing device to generate speech. The allowance for code E2511 includes the speech generating software program only. Installation of the program or technical support must not be billed separately."

So the premise "software alone is not reimbursable" is false as stated. But the three constraints that follow are what actually decide Manifest's business model, and they are worse for Manifest than the original hypothesis was.

---

## CONSTRAINT 1 — the reimbursable software must GENERATE SPEECH. Input modality is explicitly bundled into hardware.

This is the finding that matters most, and it is the real explanation for Tobii's refusal to unbundle TD Control. From A52469, CODING GUIDELINES, verbatim:

> "Code E2511 must not be used to code for software programs installed at the time of the initial provision of an SGD accessory or alternative access device. **Software for the accessory or alternative access device is included in the reimbursement for the accessory or alternative access device.** Claims for code E2511 billed with an accessory or alternative access device will be denied as unbundling."

And again, verbatim:

> "There is no separate billing for any software, interfaces, cables, adapters, interconnects or switches necessary for the access device to interface with the SGD. Those components are included in the reimbursement for the access device itself."

**There is no HCPCS code for access-method software.** Speech-generation software has a code. Access software — which is exactly what Manifest is — has no code, by explicit rule, and billing it separately is defined as unbundling. Tobii isn't withholding TD Control out of strategy; separating it would make it unbillable.

## CONSTRAINT 2 — E2511 has no published Medicare allowance. Zero, in every state.

I downloaded the current CMS DMEPOS fee schedule (DME26-C, July 2026 quarterly file) and read the raw records. Ceiling amounts:

| HCPCS | Description | 2026 ceiling |
|---|---|---|
| E2510 | SGD, synthesized, multiple methods of message formulation AND access | **$9,645.69** |
| E2508 | SGD, synthesized, spelling/direct selection | $5,097.15 |
| **E2513** | **electromyographic sensor accessory** | **$4,491.00** |
| E2502 | SGD, digitized, 8–20 min recording | $1,704.17 |
| E2500 | SGD, digitized, ≤8 min recording | $557.30 |
| **E2511** | **"Sgd sftwre prgrm for pc/pda" (software only)** | **$0.00** |

The raw fixed-width record for E2511 (field 27 is the gap-fill indicator, `0` = no gap-filling required, `1` = carrier must gap-fill):

```
2026~E2511~NU~  ~D~IN~A~00~AL     ~000000.00~000000.00~000000.00~000000.00~1~0~ ~Sgd sftwre prgrm...
2026~E2510~NU~  ~D~IN~A~00~AL     ~005573.43~009645.69~008198.84~009645.69~0~0~ ~Sgd w mul...
```

E2511 carries gap-fill indicator `1` and $0.00 updated fee schedule amount in all 50 states. The hardware code carries a $9,645.69 national ceiling. One correction to a plausible misreading: `CATG=IN` is **not** "individual consideration" — per the CMS file layout doc it means "Inexpensive and Other Routinely Purchased Items." The pricing signal is the zeros plus the gap-fill flag, not the category.

**Read that table again in Manifest's terms: an EMG sensor accessory is worth $4,491 per unit to Medicare. Speech software on a general computer is worth whatever a DME MAC decides case by case, from a base of nothing.**

## CONSTRAINT 3 — the market leader does not bill the software code at all.

Tobii Dynavox's own US funding page tells families to give their insurer three codes, verbatim:

> "E2510 – speech generating devices
> E2512 – mounting system for speech generating devices
> E2599 – access methods for speech generating devices"

E2511 is absent. The largest AAC vendor in the world routes access methods through E2599 (an accessory code), not through the software code. That is a revealed-preference confirmation of Constraint 1.

Two more provisions that constrain any subscription model, both verbatim from A52469:

> "Upgrades to speech generating devices and/or software programs that are provided within the 5 year useful lifetime of the device will be denied as statutorily non-covered."

> "Replacement or upgrade of speech generating software loaded onto a covered speech generating device is not covered unless the replacement software is necessary due to a change in the patient's condition, or in cases where the software has been lost, stolen, irreparably damaged, or has been in continuous use for the reasonable useful lifetime of 5 years."

Medicare pays for AT software **once every five years**. A €7.99/month recurring model is structurally incompatible with the DME benefit — not disfavored, incompatible.

---

## The one genuinely encouraging finding for Manifest

From the LCD itself (*L33739, Speech Generating Devices*), ACCESSORIES section, verbatim:

> "Alternative input devices are covered when a beneficiary is unable to use standard input devices. Claims for alternative input devices for beneficiaries who are able to use standard input devices will be denied as not reasonable and necessary. **Eye tracking, gaze interaction and electromyographic sensor accessories for speech generating devices are covered when furnished to individuals with a demonstrated medical need for such accessories.**"

And the coding rule that created E2513, effective 10/01/2024, verbatim:

> "Code E2513 describes an electromyographic sensor accessory that utilizes bioelectric signals to generate synthesized speech. E2513 is only for use with code E2510."

CMS created a dedicated, $4,491 EMG-sensor code in 2024, and in the same revision added "electromyographic sensor" to the list of qualifying indirect selection techniques for E2510. Manifest's EMG thesis sits on a payment code that is two years old and priced. **But note the binding clause: "E2513 is only for use with code E2510."** E2510 is a device that must be "only capable of speech generation." A general-purpose OS shell is disqualified by definition — A52469 states verbatim: "A device that provides the same functionality as a desktop, tablet, smartphone or laptop computer at the time of issuance is considered a general use computer and is not considered a speech generating device."

---

## What this means for the Z Fellows claim

The honest formulation is not "software isn't reimbursable, so we need hardware." It is sharper and harder:

**Reimbursement in the US is available to Manifest only if Manifest is an SGD or an SGD accessory — and the accessory path requires shipping a sensor.** The E2513 EMG code pays $4,491 per unit and requires a physical bioelectric sensor sold as an accessory to a dedicated speech device. The software Manifest is actually building — the input-mapping and failover layer — is defined by CMS as bundled into that sensor's price and cannot be billed on its own at any price. Manifest can capture reimbursement revenue by becoming a sensor vendor whose software is the reason the sensor is chosen. It cannot capture reimbursement revenue as a subscription.

This does not rescue the first pass's optimism, and it doesn't rescue the pessimism either. It relocates the problem: the ceiling isn't "software is unbillable," it's "the billable unit is a device, billed once per five years, and only for speech." A pitch that says "we'll get reimbursed" needs to name E2513, name the $4,491, name the sensor SKU, and name the SGD partner whose E2510 device the sensor attaches to. Absent those four, the claim is not supportable and I'd cut it rather than soften it.

---

## What I could NOT verify — stated as failure to find, not as absence

I want to be explicit here because the previous round's failure mode was exactly this.

- **UK NHS AAC.** Not verified. The session's WebSearch budget (200/200) was exhausted before I began, so I could only probe URLs I could guess. `england.nhs.uk` returned 404 on every service-specification path I constructed, and its site-search endpoint returned HTTP 202 (bot challenge). I did not read the NHS England specialised AAC service specification and I make no claim about its content. This is "not found under a severely constrained search," not "does not exist" — NHS England does commission specialised AAC services and the specification almost certainly exists; I simply failed to retrieve it.
- **Germany / EU national schemes.** Not verified. `hilfsmittel.gkv-spitzenverband.de` is an Angular SPA that returns the same 62KB shell for every path; I pulled its main JS bundle and found no API routes (they are in lazy-loaded chunks I did not chase). `rehadat-hilfsmittel.de` returned HTTP 503 behind a Myra captcha. I have **not** confirmed whether Hilfsmittelverzeichnis product group 16 (Kommunikationshilfen) lists standalone software, and I did not look at DiGA at all. Do not let anything downstream state a German position on my authority.
- **PDAC / DMECS product classification list for E2511.** Not attempted to completion. Which specific commercial products are actually coded E2511 today remains unknown to me; the Tobii page is indirect evidence that the code is under-used, not proof.

If you want the UK and German legs closed properly, that needs a session with search budget — the US leg is now solid enough that I'd treat it as settled.

---

**Local artifacts** (all absolute paths, all primary documents as fetched):

- `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/art_52469.txt` — CMS Policy Article A52469 (SGD), full text
- `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/lcd_33739.txt` — CMS LCD L33739 (SGD), full text
- `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/dme26c/DMEPOS_JUL.csv` and `DMEPOS_JUL.txt` — CMS DMEPOS fee schedule, July 2026
- `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/dme26c/read.txt` — CMS fee schedule record layout (the CATG legend that corrects the "IN" misreading)
- `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/tdfund.html` — Tobii Dynavox US funding page as fetched

Sources: [CMS Article A52469](https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52469) · [CMS LCD L33739](https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=33739) · [CMS DMEPOS Fee Schedule DME26-C](https://www.cms.gov/medicare/payment/fee-schedules/dmepos/dmepos-fee-schedule/dme26-c) · [Tobii Dynavox US Funding](https://us.tobiidynavox.com/pages/funding)


---

# BIPA / biometric law exposure for local-only face processing

**Confidence: PARTIAL**

**Bottom line:** Ship three things before the next user: (1) your own consent modal in front of getUserMedia stating what's processed, why, and that nothing is retained — the browser permission prompt is not consent under any of these statutes; (2) a public written retention/destruction policy (BIPA §15(a) and Colorado 6-1-1314(2)(a) each require one independently, and yours is trivial because the answer is "zero retention"); (3) keep the keyboard path so camera consent is never a condition of service. The local-only architecture is weaker legally than you think: Zellmer v. Meta expressly reserved whether ephemeral create-and-delete escapes BIPA §15(b) (n.3), and Zellmer's actual winning ground — that the data "cannot identify" — is unavailable to you because your code reads landmarks[33]/[263]/[1] and the distance between them, i.e. eyes, nose, and the spacing McCoy's declaration swore Meta was NOT computing. Washington MHMDA and Colorado are worse still: both define "collect" to expressly include any processing, with no possession requirement, so the local-only defense is textually foreclosed there. Good news: Illinois' 2024 amendment (740 ILCS 14/20(b)) makes repeated collection from the same person by the same method a single violation, so your 30fps loop is $1,000–$5,000 per user, not per frame. Residual risk after doing the above is low — the real threat is plaintiff-firm class actions needing class-scale traction, not regulators — but note the exposure that remains is generated by your pitch deck, not your code: marketing to disabled users is what makes MHMDA's "consumer health data" theory plausible.

> **Not legal advice.** This is a risk map assembled from primary sources. Every legal quotation below was read in the cited document; where I did not read exact words, I say so explicitly. Access date for all URLs: **2026-07-19**.

---

## 0. The finding that reorders everything: what your code actually does

Before the law, the facts. I read `/Users/kanuj/Documents/projects/manifest/hooks/use-face-gaze.ts`.

You run **MediaPipe `FaceLandmarker`** (`@mediapipe/tasks-vision`), model `face_landmarker.task`, `runningMode: 'VIDEO'`, `numFaces: 1`. Per-frame you call `lm.detectForVideo(v, performance.now())` and read `result.faceLandmarks[0]`. Your scoring function is:

```ts
const leftOuter = landmarks[33]    // left eye outer corner
const rightOuter = landmarks[263]  // right eye outer corner
const nose = landmarks[1]          // nose tip
const midX = (leftOuter.x + rightOuter.x) / 2
const eyeDist = Math.abs(rightOuter.x - leftOuter.x) || 1e-6
return ((nose.x - midX) / eyeDist) * GAZE.SCORE_GAIN
```

**You are computing distances between named facial features.** Hold that thought — it is the single most legally consequential line in your codebase, for reasons that become clear in §2.

Also confirmed by grep across `components/ app/ lib/ hooks/`: **zero occurrences of "consent", "privacy", "biometric", or "BIPA".** No privacy policy file anywhere in the repo. The only thing standing between a user and face processing today is the browser's native `getUserMedia` permission prompt. That prompt is a Chrome UI affordance. It is not a BIPA written release, and it is not notice of anything.

Two lesser notes: `FilesetResolver.forVisionTasks` pulls WASM from `cdn.jsdelivr.net` and the model from `storage.googleapis.com`. No face data leaves the device, but the *fact of use* (IP, referrer) reaches jsDelivr and Google. That does not create biometric exposure; it does mean "nothing is transmitted" is imprecise phrasing you should not put in a privacy notice verbatim. Self-hosting both assets is a one-line fix and makes the audit claim clean.

---

## 1. Illinois BIPA — the statutory hooks

**§15(b)**, quoted verbatim by the Ninth Circuit in *Zellmer v. Meta Platforms, Inc.*, No. 22-16925 (9th Cir. June 17, 2024), slip op. at 10:

> "No private entity may **collect, capture, purchase, receive through trade, or otherwise obtain** a *person's or a customer's* biometric data without his consent. 740 ILL. COMP. STAT. 14/15(b) (emphasis added)."

**§10 definition** (*Zellmer* slip op. at 5, quoting the statute):

> A "biometric identifier" is "a retina or iris scan, fingerprint, voiceprint, or **scan of hand or face geometry**." *Id.* 14/10. As potentially relevant, biometric identifiers do not include photographs. *Id.* For its part, "biometric information" is "any information, regardless of how it is captured, converted, stored, or shared, based on an individual's biometric identifier **used to identify an individual**"…

**§15(a)** (*Zellmer* slip op. at 5):

> Any company that **possesses** biometric identifiers or information must "develop a written policy, made available to the public, establishing a retention schedule and guidelines for permanently destroying biometric identifiers and biometric information."

Source: <https://cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf>

Note the asymmetry the drafters chose: **§15(a) is triggered by "possesses." §15(b) is not.** §15(b) is triggered by the *act* of collecting/capturing/obtaining. That textual asymmetry is the whole ballgame, and it cuts against you: your instinct that "we don't possess it, so we're clear" maps onto §15(a), not §15(b).

---

## 2. The core question: does ephemeral, in-browser processing trigger §15(b)?

### The previous round was right, and I can now prove it from the primary source.

*Zellmer* is the closest a federal appellate court has come. Meta's "face signature" was created and destroyed near-instantly — factually almost identical to your per-frame landmark computation. The Ninth Circuit described the record at slip op. 7:

> "And even if the reverse-engineering of a face signature were technically possible, **face signatures exist for only a tiny fraction of a second—they are neither saved nor stored** after the final stage of the Tag Suggestions process."

And at slip op. 7, on the Classification Stage:

> "**Regardless of whether the comparison yields a match, the face signature is immediately deleted.**"

So the court had the ephemerality question squarely in front of it. Here is what it did with it — **footnote 3, slip op. at 18**:

> "**Given this conclusion, we need not decide whether Meta's creation—and near immediate deletion—of a face signature skirts BIPA's prohibition on 'collect[ing], captur[ing], purchas[ing], receiv[ing] through trade, or otherwise obtain[ing]' a biometric identifier. 740 ILL. COMP. STAT. 14/15(b).**"

That is an express reservation. The Ninth Circuit **declined to decide** whether ephemeral creation-and-deletion escapes §15(b). Under a constrained search (my web-search budget was exhausted this session, so I could not sweep 2025–2026 district court dockets), **I found no case squarely holding either way.** The previous round's conclusion — *unlitigated, not merely contested* — is **confirmed by primary source**. Say "expressly reserved by the Ninth Circuit in *Zellmer* n.3," not "courts are split."

### But here is the bad news, and it is worse than the open question.

*Zellmer* won on a **different ground**, and that ground is unavailable to you.

The court held face signatures are neither biometric identifiers nor biometric information because they **cannot identify**. It relied on Meta's McCoy declaration, quoted at slip op. 16:

> He explained that a face signature is merely "a string of numbers that represents a particular image of a face." Those numbers "**do not reveal any geometric information about the detected face in the image, nor do they correspond to facial features like the eyes or nose, or distances between them.**" Instead, a face signature is "an abstract, numerical representation of a face crop that is computed by millions of pixel comparisons performed by the proprietary algorithm that Facebook has developed," which "cannot be reverse-engineered"…

Read that against your `lookScoreFromLandmarks`. You use `landmarks[33]` and `landmarks[263]` — **the eyes**. You use `landmarks[1]` — **the nose**. You compute `eyeDist` — **the distance between them**. Your code does precisely the three things McCoy's declaration swore Meta's face signature did *not* do. **The `Zellmer` safe harbor is not available to you on these facts.** MediaPipe Face Landmarker emits a dense 3D mesh of anatomically-labelled points; that is a scan of face geometry in the most literal sense the statute admits.

Worse, the standard is **capability, not use**. *Zellmer* endorsed *Hazlitt v. Apple*, 500 F. Supp. 2d 738 (S.D. Ill. 2020), at slip op. 15:

> The *Hazlitt* court rejected Apple's interpretation as too narrow because "[t]he word 'identifier' modifies the word 'biometric' to signal that the types of data listed **could** be used to identify a person." *Id.* at 749 (emphasis in original). *Hazlitt* thus recognized that, even if a company **does not** use face scans to identify a person, **BIPA applies if it could.**

And footnote 2, quoting *Rivera v. Google Inc.*, 238 F. Supp. 3d 1088, 1094 (N.D. Ill. 2017):

> "Each specific item on the list, not surprisingly, fits within the meaning of the term 'biometric identifier,' that is, a biology-based set of measurements ('biometric') that **can be used to identify** a person ('identifier')."

"We only use it for head yaw" is therefore **not a defense**. The question is whether a 478-point face mesh *could* identify. I did not find a case answering that for MediaPipe specifically, and I did not verify the re-identification accuracy of landmark meshes — see Follow-up 1.

**Net:** Your best BIPA argument is the *unlitigated* ephemerality argument, not the *litigated* identifiability argument. That is a materially weaker position than "MediaPipe is local so we're fine."

---

## 3. Damages — the 2024 amendment is the best news in this brief

The previous round flagged *Cothron v. White Castle*, 2023 IL 128004, which held each scan is a separate violation. At video frame rate that math is apocalyptic. **The Illinois legislature fixed it.** Public Act 103-0769 (SB 2979, effective Aug. 2, 2024) added §20(b) and (c). Verbatim, from FindLaw's text of 740 ILCS 14/20, current as of Jan. 1, 2025:

> "(b) For purposes of subsection (b) of Section 15, a private entity that, **in more than one instance**, collects, captures, purchases, receives through trade, or otherwise obtains **the same biometric identifier or biometric information from the same person using the same method of collection** in violation of subsection (b) of Section 15 has committed a **single violation** of subsection (b) of Section 15 for which the aggrieved person is entitled to, **at most, one recovery** under this Section.
>
> (c) For purposes of subsection (d) of Section 15, a private entity that, in more than one instance, discloses, rediscloses, or otherwise disseminates the same biometric identifier or biometric information from the same person to the same recipient using the same method of collection in violation of subsection (d) of Section 15 has committed a single violation … regardless of the number of times the private entity disclosed, redisclosed, or otherwise disseminated the same biometric identifier or biometric information of the same person to the same recipient."

Source: <https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-20/>

**Your 30fps loop is one violation per user, not 30 per second.** Exposure per Illinois user is capped by §20(a): $1,000 liquidated (negligent) or $5,000 (intentional/reckless), plus attorneys' fees and costs. Ten Illinois users worst-case is $50,000 plus fees — bad but survivable. Ten thousand is not.

Two caveats I want to be honest about. First, I did not retrieve the amendment's own effective-date/retroactivity language, and Illinois courts have been litigating whether §20(b) applies to pre-August-2024 conduct; I could not verify the current state of that. Second, *Rosenbach v. Six Flags Ent. Corp.*, 129 N.E.3d 1197 (Ill. 2019) — cited in *Zellmer* at slip op. 8 — means **no actual injury is required**; a bare procedural violation is actionable. So "nobody was harmed" is not a defense to the $1,000.

One more from *Zellmer* worth internalizing, quoting the Illinois Supreme Court in *Cothron*, 216 N.E.3d 918, 928 (Ill. 2023), at slip op. 10:

> "[W]hen the language of the statute is clear, it must be applied as written without resort to aids or tools of interpretation," *DeLuna v. Burciaga*, 857 N.E.2d 229, 236 (Ill. 2006), "**even though the consequences may be harsh, unjust, absurd or unwise**"…

Illinois courts have said, repeatedly, that they will not read equities into BIPA. Do not build a plan around a judge finding your accessibility mission sympathetic.

---

## 4. Washington MHMDA — the sharper risk, and the previous round was right to flag it

MHMDA is worse than BIPA for you on **three independent axes**: it has a private right of action, it has no possession requirement, and its "collect" definition explicitly swallows mere processing.

**Private right of action** — RCW 19.373.090, verbatim in full:

> "The legislature finds that the practices covered by this chapter are matters vitally affecting the public interest for the purpose of applying the consumer protection act, chapter 19.86 RCW."

Source: <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.090>

That single sentence routes MHMDA violations into Washington's CPA, which carries a private right of action, treble damages (capped), and attorneys' fees. This is why MHMDA is the plaintiff-bar magnet.

**"Collect" reaches pure processing** — RCW 19.373.010, verbatim:

> **"Collect"** "means to buy, rent, access, retain, receive, acquire, infer, derive, or **otherwise process consumer health data in any manner**."
>
> **"Process" or "Processing"** "means **any operation or set of operations performed on consumer health data**."

Source: <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.010>

**This is the key structural point.** Under BIPA, "we never possessed it" is at least an *arguable* (if unlitigated) reading of "collect, capture, or otherwise obtain." Under MHMDA that argument is **textually foreclosed**: collection expressly includes "otherwise process … in any manner," and processing is "any operation." Ephemeral in-browser landmark extraction is an operation. **The local-only defense is weaker in Washington than in Illinois, not stronger.**

**Applicability** — RCW 19.373.010:

> **"Regulated entity"** "means any legal entity that: (a) Conducts business in Washington, **or produces or provides products or services that are targeted to consumers in Washington**; and (b) alone or jointly with others, determines the purpose and means of collecting, processing, sharing, or selling of consumer health data."

A publicly-accessible web app arguably qualifies once you have Washington users. There is a "small business" definition (fewer than 100,000 consumers/year), but it **delays certain compliance dates; it does not exempt you from the Act**.

**The gating question — is your data "consumer health data"?** Verbatim:

> **"Consumer health data"** "means personal information that is linked or reasonably linkable to a consumer and that identifies the consumer's past, present, or future physical or mental health status."

> **"Biometric data"** "means data that is generated from the measurement or technological processing of an individual's physiological, biological, or behavioral characteristics **and that identifies a consumer**, whether individually or in combination with other data."

The enumerated categories of consumer health data expressly include **biometric data**. So there are two paths in, and here is the honest assessment of each:

- *Path A (biometric data):* requires that it "identifies a consumer." Your landmarks arguably do not identify — this is a real defense, and it is the **inverse** of your BIPA posture (where capability suffices). Note the definitional mismatch: MHMDA says "identifies," BIPA case law says "could identify."
- *Path B (health status):* **this is where targeting disabled users bites.** "Personal information … that identifies the consumer's … physical or mental health status." If your product is marketed as an assistive input for people with motor disabilities, then *the fact that a given person is using it* is arguably information identifying their physical health status. Your positioning docs create the inference that your technical architecture alone would not.

I could not find case law testing Path B against an accessibility product. This is a genuine open question, and it is the one I would worry about most, because it is created by your **marketing**, not your code — and it does not go away by making the code more local.

---

## 5. Colorado — no small-company escape hatch, already in force

Colorado HB24-1130 (signed 2024, **effective July 1, 2025** — so live today) added C.R.S. 6-1-1314 and amended 6-1-1304. Read from the enrolled bill PDF at <https://content.leg.colorado.gov/sites/default/files/2024a_1130_signed.pdf>.

**Applicability — 6-1-1304(1), verbatim (small caps in original):**

> "(b) CONTROLS OR PROCESSES **ANY AMOUNT** OF BIOMETRIC IDENTIFIERS OR BIOMETRIC DATA **REGARDLESS OF THE AMOUNT** OF BIOMETRIC IDENTIFIERS OR BIOMETRIC DATA CONTROLLED OR PROCESSED ANNUALLY; EXCEPT THAT A CONTROLLER THAT MEETS THE QUALIFICATIONS OF THIS SUBSECTION (1)(b) BUT DOES NOT MEET THE QUALIFICATIONS OF SUBSECTION (1)(a) OF THIS SECTION SHALL COMPLY WITH THIS PART 13 **ONLY FOR THE PURPOSES OF A BIOMETRIC IDENTIFIER OR BIOMETRIC DATA** THAT THE CONTROLLER COLLECTS AND PROCESSES."

Colorado deliberately stripped the 100,000-consumer threshold for biometrics. **Two students with fifty users are fully in scope.**

**"Collect" — 6-1-1314(1)(a), verbatim:**

> "'COLLECT', 'COLLECTION', OR 'COLLECTING' MEANS TO ACCESS, ASSEMBLE, BUY, RENT, GATHER, PROCURE, RECEIVE, CAPTURE, OR OTHERWISE OBTAIN ANY BIOMETRIC IDENTIFIER OR BIOMETRIC DATA PERTAINING TO A CONSUMER BY ANY MEANS, ONLINE OR OFFLINE, INCLUDING: (I) ACTIVELY OR PASSIVELY RECEIVING A BIOMETRIC IDENTIFIER OR BIOMETRIC DATA FROM THE CONSUMER OR FROM A THIRD PARTY; AND (II) **OBTAINING BIOMETRIC DATA BY OBSERVING THE CONSUMER'S BEHAVIOR**."

**"Biometric identifier" — 6-1-1303(2.4), verbatim:**

> "'BIOMETRIC IDENTIFIER' MEANS DATA GENERATED BY THE TECHNOLOGICAL PROCESSING, MEASUREMENT, OR ANALYSIS OF A CONSUMER'S BIOLOGICAL, PHYSICAL, OR BEHAVIORAL CHARACTERISTICS, **WHICH DATA CAN BE PROCESSED FOR THE PURPOSE OF UNIQUELY IDENTIFYING AN INDIVIDUAL**. 'BIOMETRIC IDENTIFIER' INCLUDES: (a) A FINGERPRINT; (b) A VOICEPRINT; (c) A SCAN OR RECORD OF AN EYE RETINA OR IRIS; (d) **A FACIAL MAP, FACIAL GEOMETRY, OR FACIAL TEMPLATE**; OR (e) OTHER UNIQUE BIOLOGICAL, PHYSICAL, OR BEHAVIORAL PATTERNS OR CHARACTERISTICS."

"A facial map" is about as direct a description of a MediaPipe face mesh as a legislature could write without naming the library. And like BIPA, the test is capability ("CAN BE PROCESSED FOR THE PURPOSE OF").

**The duty — 6-1-1314(4)(a), verbatim:**

> "A CONTROLLER SHALL NOT **COLLECT OR PROCESS** A BIOMETRIC IDENTIFIER OF A CONSUMER UNLESS THE CONTROLLER **FIRST**: (I) SATISFIES ALL DUTIES REQUIRED BY SECTION 6-1-1308; (II) INFORMS THE CONSUMER … IN A CLEAR, REASONABLY ACCESSIBLE, AND UNDERSTANDABLE MANNER THAT A BIOMETRIC IDENTIFIER IS BEING COLLECTED; (III) INFORMS THE CONSUMER … OF THE SPECIFIC PURPOSE FOR WHICH A BIOMETRIC IDENTIFIER IS BEING COLLECTED AND THE LENGTH OF TIME THAT THE CONTROLLER WILL RETAIN THE BIOMETRIC IDENTIFIER; AND (IV) INFORMS THE CONSUMER … IF THE BIOMETRIC IDENTIFIER WILL BE DISCLOSED…"

Note "**COLLECT OR PROCESS**" — again, no possession requirement. And 6-1-1314(2)(a) independently requires a **written retention policy made public** for any controller that "CONTROLS OR PROCESSES ONE OR MORE BIOMETRIC IDENTIFIERS."

There is also an anti-conditioning rule, 6-1-1314(4)(c)(I): a controller shall not "REFUSE TO PROVIDE A GOOD OR SERVICE … BASED ON THE CONSUMER'S REFUSAL TO CONSENT … UNLESS THE COLLECTION … IS **NECESSARY** TO PROVIDE THE GOOD OR SERVICE." For a face-controlled input mode, necessity is a clean argument — **provided** you offer the keyboard path as an alternative and don't gate unrelated features on camera consent.

**Enforcement:** the Colorado Privacy Act is enforced by the AG and district attorneys, with **no private right of action**. I did **not** fetch C.R.S. 6-1-1311 this round to verify that verbatim — treat it as my understanding, not as sourced fact.

---

## 6. Texas CUBI — real statute, low practical threat

Tex. Bus. & Com. Code § 503.001, via <https://codes.findlaw.com/tx/business-and-commerce-code/bus-com-sect-503-001/>. FindLaw returned partial quotation; the fragments below are what it presented as statutory text, and I flag that I did **not** obtain a clean full verbatim copy (the official `statutes.capitol.texas.gov` URL returned only the site homepage).

> "Biometric identifier means a retina or iris scan, fingerprint, voiceprint, or record of hand or" face geometry.

Destruction: "within a reasonable time, but not later than the first anniversary of the date the purpose for collecting the identifier expires." Penalty: up to **$25,000 per violation**. Critically: **the attorney general has exclusive authority to "bring an action to recover the civil penalty."**

**No private right of action means no class action means no plaintiff-firm interest.** Texas AG Paxton has pursued biometric cases aggressively — but against Meta and Google, not two-person student projects. Texas is a real obligation and a low-probability enforcement risk. Comply on paper; don't lose sleep.

---

## 7. Does targeting disabled users change the analysis?

**GDPR Article 9** — verbatim from <https://gdpr-info.eu/art-9-gdpr/>:

> Art. 9(1): "Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, **biometric data for the purpose of uniquely identifying a natural person**, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited."

Two things follow. First, the biometric limb of Art. 9 is **purpose-bound**: "for the purpose of uniquely identifying a natural person." You do not identify. That limb almost certainly does **not** catch you. Second — and this is the part people miss — **"data concerning health" is a separate limb with no purpose qualifier.** An assistive-input product for disabled users processes data that, in context, concerns health. That limb is the live one.

If Art. 9 applies, the realistic gateway is Art. 9(2)(a):

> "the data subject has given **explicit consent** to the processing of those personal data for one or more specified purposes, except where Union or Member State law provide that the prohibition referred to in paragraph 1 may not be lifted by the data subject"

Two structural points on GDPR, which I state as my reading of the framework rather than as sourced holdings: (a) local-only processing is **still processing** under Art. 4(2), and you are still the controller if you determine purposes and means — client-side execution does not remove you from scope; (b) GDPR only reaches you if you target or monitor EU data subjects. **My recommendation: don't target the EU yet, and say so.** A geo-note is cheaper than an Art. 9 compliance program.

**US disability law:** targeting disabled users does not create special *biometric* obligations. The pressure runs the other way — ADA/§504 create pressure to make the product *work*, and an accessibility product that fails users is an accessibility problem, not a privacy one. But note the framing trap: your ZFellows/positioning material describing users by disability status is what makes the MHMDA "health status" argument (§4, Path B) plausible. **The legal exposure is generated by the pitch deck, not the codebase.**

---

## 8. What to ship before the next real user touches the webcam

Everything below is achievable in an afternoon. None of it requires a lawyer.

**Tier 1 — blocking, do not demo without these:**

1. **A consent gate in front of `getUserMedia`.** Not the browser prompt — your own modal, shown first, with an affirmative click. It must state, before the camera turns on: (i) that face geometry is being processed; (ii) the specific purpose ("to detect head turn for on-screen navigation"); (iii) how long it is retained ("not retained — computed per video frame in your browser and discarded; never transmitted or stored"); (iv) that nothing is disclosed to third parties. This single artifact discharges the notice elements of BIPA §15(b)(1)–(2), Colorado 6-1-1314(4)(a)(II)–(IV), and Texas §503.001(b) simultaneously. The click is your "written release" — BIPA §10 defines that to include "informed written consent, **electronic signature**" (per FindLaw's text of 740 ILCS 14/10).
2. **A public written retention & destruction policy.** BIPA §15(a) and Colorado 6-1-1314(2)(a) both require this as a standalone public document. Yours is short and unusually easy because your honest answer is "zero retention." State the schedule, state the destruction guideline, state the security incident protocol (Colorado requires that element expressly). Put it at a stable URL.
3. **Keep the keyboard path as a first-class alternative**, and never gate non-camera features on camera consent. This is your Colorado 6-1-1314(4)(c)(I) answer and, independently, the right accessibility design.

**Tier 2 — same week:**

4. **Actually run the audit you intend to run**, and write down the result with evidence. Open DevTools Network, exercise the gaze feature, confirm zero outbound requests carrying frame or landmark data. Save the HAR. When someone asks "how do you know," you point at an artifact, not an intention. Your own CLAUDE.md verification-honesty rule applies here more than anywhere.
5. **Self-host the MediaPipe WASM and `.task` model.** Removes jsDelivr and Google from the request path, and makes "no third party is involved in camera processing" literally true.
6. **Don't market to the EU.** One line in the notice.

**Tier 3 — before you have real scale:**

7. Revisit at ~1,000 users, and definitely before any Illinois-heavy deployment or any paid tier.

**On finding real small-company BIPA notices as templates:** I could not do this. My web-search budget was exhausted at the start of this session, leaving only direct URL fetching, and I have no way to discover small-company notices without search. **This is "not found under a constrained search," not "does not exist."** I'd rather tell you that than hand you a plausible-looking template I reconstructed from memory. Do not let me or anyone generate one from recall — pull two or three real ones yourself and diff them.

---

## 9. Honest residual risk after doing all of the above

**Low, and here is specifically why — plus where it isn't.**

The realistic threat model is **plaintiff-firm class actions, not regulators.** Texas and Colorado are AG-only; AGs pursue Meta and Google. BIPA and MHMDA have private rights of action, and BIPA in particular has a mature, industrialized plaintiff bar. But that bar's economics require a **class**, and a class requires **users**. A two-person project with dozens of users is not a target — not because you're exempt, but because the recovery doesn't cover the filing cost.

I want to be candid about what I could **not** verify: I found no data on enforcement or litigation against small startups or open-source projects, and I could not establish an empirical traction threshold where plaintiff interest begins. My intuition is that it's in the thousands-of-Illinois-users range, but **that is intuition, not a sourced finding, and you should treat it as such.** The load-bearing point does not depend on the number: the compliance steps in §8 cost an afternoon, so the correct move is to do them now regardless of where the threshold sits.

**Where residual risk genuinely remains, in descending order:**

1. **The §15(b) ephemerality question is open, and your fallback is blocked.** *Zellmer* n.3 expressly reserved it. And because your code reads eye and nose landmarks and the distance between them, you cannot use *Zellmer*'s "cannot identify" holding. If a court someday holds that transient in-browser processing is "capture," you were capturing. **Consent is what makes this not matter** — with a proper consent gate, §15(b) is satisfied and the open question becomes academic. This is the single strongest argument for doing Tier 1 item 1 today.
2. **MHMDA "consumer health data" via the disability-targeting path.** Textually foreclosed local-only defense, private right of action via the CPA, and a health-status theory that your own positioning material supplies. Unlitigated for accessibility products as far as I could determine.
3. **Retroactivity of the 2024 §20(b) fix**, which I did not verify — relevant only if you've already had Illinois users.

**The blunt version:** your architecture is genuinely good and materially reduces your risk. But it reduces *harm*, not *liability*. Every statute I read defines its trigger around the *act* of collecting or processing, and two of the three define it broadly enough to catch pure processing with no retention at all. **"It's local" is a great privacy story and a mediocre legal defense. Consent is the actual defense, and you don't have one.** The gap between where you are and where you're safe is a modal, a markdown file, and a HAR capture.

---

## Sources

- *Zellmer v. Meta Platforms, Inc.*, No. 22-16925 (9th Cir. June 17, 2024) — <https://cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf> (full opinion read, pp. 1–20)
- 740 ILCS 14/20 (BIPA right of action, incl. 2024 §20(b)–(c) amendment) — <https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-20/>
- 740 ILCS 14/10 (definitions) — <https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-10/>
- 740 ILCS 14/15 — <https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-15/>
- RCW 19.373.010 (MHMDA definitions) — <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.010>
- RCW 19.373.090 (CPA application) — <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.090>
- RCW ch. 19.373 index — <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373>
- Colorado HB24-1130 (enrolled) — <https://content.leg.colorado.gov/sites/default/files/2024a_1130_signed.pdf> (pp. 2–11 read)
- Tex. Bus. & Com. Code § 503.001 — <https://codes.findlaw.com/tx/business-and-commerce-code/bus-com-sect-503-001/> (partial quotation only)
- GDPR Art. 9 — <https://gdpr-info.eu/art-9-gdpr/>
- Repo: `/Users/kanuj/Documents/projects/manifest/hooks/use-face-gaze.ts`

**Method limitations, stated plainly:** WebSearch was unavailable for this entire session (budget exhausted at 200/200 before my first call), so everything above came from direct URL fetches of primary documents. That is why the case-law sweep is anchored on one appellate opinion rather than a docket survey, why I have no small-startup enforcement data, and why I could not retrieve the *Svoboda v. Amazon* Seventh Circuit briefing the previous round wanted. The official Illinois General Assembly site (`ilga.gov`) returned 404 on every URL pattern I tried, so BIPA text is quoted from the *Zellmer* opinion (authoritative) and FindLaw (secondary). The Texas statute is the weakest sourcing in this brief.


## Follow-up: Can MediaPipe Face Landmarker's 478-point mesh output actually support re-identification — i.e., is there published benchmark data on matching accuracy from landmark geometry alone (as opposed to learned face embeddings)? Look for face-recognition-from-landmarks literature and any expert declarations filed in post-Zellmer BIPA cases.

## Answer: Yes — and the strongest evidence is directly on point for the exact landmarks Manifest reads

**The first pass's conclusion survives and is strengthened. Do not soften the compliance posture.**

### 1. Affirmative benchmark evidence: landmark geometry alone re-identifies

Gupta, Markey & Bovik, *Anthropometric 3D Face Recognition*, Int. J. Computer Vision (2010), DOI 10.1007/s11263-010-0360-8. Full text read at `https://www.colorado.edu/lab/live/publications/sg_ijcv_june10.pdf` (local copy `/tmp/gupta.pdf`). Verbatim from the abstract:

> "we develop a completely automatic face recognition algorithm that employs facial 3D Euclidean and geodesic distances between these 10 automatically located anthropometric facial fiducial points and a linear discriminant classifier. On a database of 1149 facial images of 118 subjects... the proposed Anthroface 3D recognition algorithm performs well (equal error rate of 1.98% and a rank 1 recognition rate of 96.8%)"

The feature vector is *nothing but distances between landmark points*. No pixels, no learned embedding. Table 3(c) and Table 4:

| Configuration | Rank-1 RR | EER |
|---|---|---|
| 25 manual anthropometric points | 97.9% | 1.00% |
| 10 manual points | 98% | 1.68% |
| 10 **automatically** located points | 96.8% | 1.98% |
| **25 *arbitrary* facial points** | **87.5%** | 7.65% |

Two findings that close off the obvious defenses:

- **The arbitrary-point result (87.5%) kills the "our landmarks aren't the identifying ones" argument.** You cannot claim safety by asserting you picked non-anthropometric points.
- **Euclidean-only works.** The geodesic distances (which need a scanned surface MediaPipe doesn't have) helped only on expressive faces: "for expressive faces, the verification performance of the algorithm that employed both Euclidean and geodesic distances (AUC = 0.0008...) was significantly better than... only anthropometric Euclidean distances (AUC = 0.0015...)". Euclidean-only is degraded, not defeated.

The 10-point set is `prn, al-L/R, en-L/R, ex-L/R, ch-L/R, m` — nose tip, nose wings, inner and outer eye corners, mouth corners.

### 2. I verified Manifest's code rather than trusting the first pass

`hooks/use-face-gaze.ts:38-40` reads `landmarks[33]`, `landmarks[263]`, `landmarks[1]` — outer eye corners and nose tip. **These are literally three of Gupta's ten points.** Line 252 materializes `result.faceLandmarks[0]`, the full 478-point array, every frame; only three points are read, and the retained output is one scalar `((nose.x - midX) / eyeDist) * GAIN`. `outputFaceBlendshapes: false` (line 207) — good, blendshapes are off.

That distinction matters legally but does not save you: BIPA §15(b)'s verbs are "collect, capture, purchase, receive through trade, **or otherwise obtain**." You obtain 478 points; you merely *use* three.

### 3. The honest counter-evidence — which I went looking for

Kleinberg, Vanezis & Burton, *Failure of Anthropometry as a Facial Identification Technique Using High-Quality Photographs*, J. Forensic Sci. 52(4) (2007), DOI 10.1111/j.1556-4029.2007.00458.x. Published abstract (reconstructed from OpenAlex's structured index, not a paraphrase):

> "The anthropometric landmarks of right and left ectocanthions, nasion, and stomion were chosen, and proportions and angle values between these landmarks were measured to compare target with test photos. Results indicate that these measurements failed to accurately identify targets... this method does not generate the consistent results necessary for use as evidence in a court of law."

So the literature is genuinely conditional: **3D + many landmarks + controlled capture → strong. 2D + four landmarks + uncontrolled cameras → fails.** Anyone telling you this is settled in one direction is overselling.

**Where MediaPipe sits is closer to the strong side.** Kleinberg used 4 landmarks; you get 478 with a real z. MediaPipe's own docs (read raw at `raw.githubusercontent.com/google-ai-edge/mediapipe/master/docs/solutions/face_mesh.md`): "`z` represents the landmark depth with the depth at center of the head being the origin... The magnitude of `z` uses roughly the same scale as `x`," and the Face Transform module "moves away from the screen coordinate space towards a **metric 3D space**" whose canonical model "**Defines metric units**... A metric unit used by the default canonical face model is a centimeter." (That doc describes the legacy 468-point Face Mesh; `@mediapipe/tasks-vision`, which you use, emits 478 — 468 plus iris points.)

Caveat I will not paper over: MediaPipe's metric scale derives from a *generic* canonical model, so absolute face size is partly normalized away. But anthropometric *proportions* are ratios and survive normalization — and ratios are what Gupta's Table 1 is built from.

### 4. Scale analogue

Nair et al., *Unique Identification of 50,000+ Virtual Reality Users from Head & Hand Motion Data*, arXiv 2302.08927 (verbatim from arXiv API): "a user can be uniquely identified amongst the entire pool of 50,000+ with 94.33% accuracy from 100 seconds of motion." That is *motion telemetry*, not even geometry, at 50k scale. The "it's just derived control signals" intuition has already lost this argument once.

### 5. What I could NOT find — stated as such

- **No published benchmark on re-identification from MediaPipe Face Landmarker output specifically.** Not found under a constrained search; **not** "does not exist." My WebSearch budget was exhausted at the start of this session, so I worked via OpenAlex, Semantic Scholar, arXiv, CourtListener and DuckDuckGo HTML scraping — a real limitation of this pass.
- **No post-Zellmer expert declaration on landmark meshes.** CourtListener opinion search filtered to `filed_after=2024-06-17` for Zellmer's capability language returned exactly one hit: Zellmer itself. RECAP full-text search indexes docket text, not sealed/unpurchased document contents; the closest known artifact is the **Hashmi expert report** in *In re Facebook Biometric Info. Privacy Litig.* (N.D. Cal. No. 3:15-cv-03747, Dkt. 302-303, Facebook's motion to exclude), which is pre-Zellmer and behind PACER. Retrieving it needs a PACER account.

### 6. Legal correction that sharpens the first pass

The first pass was right about Zellmer but missed *why* it's weak authority for you. Verbatim from the official CA9 PDF (`cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf`):

- Capability test: "**scans of face geometry fall within BIPA's list, but are not covered by BIPA if they cannot identify a person.**"
- McCoy declaration, which you cannot replicate: the numbers "do not reveal any geometric information about the detected face in the image, **nor do they correspond to facial features like the eyes or nose, or distances between them.**" Your code computes exactly that distance.
- Footnote 3, confirmed verbatim: "Given this conclusion, we need not decide whether Meta's creation—and near immediate deletion—of a face signature skirts BIPA's prohibition on 'collect[ing]...'"

**The new finding:** Zellmer lost on an empty record. His entire geometric rebuttal was a *bounding box* — "the geometric x and y coordinates within the photo where a person's face appears" — and the court answered only that "the coordinates within the photos that can map out the size of a person's face" don't show identification. **He offered no expert.** Zellmer is a failure of proof about a bounding box, not a holding that facial geometry cannot identify. A plaintiff holding Gupta 2010 walks into a materially different posture, and *Hazlitt*'s "could identify" standard governs in Illinois anyway.

Also confirmed verbatim from ILGA's live text, 740 ILCS 14/20(b): repeated collection "from the same person using the same method of collection... has committed **a single violation**." Per-user, not per-frame. That holds.

### Bottom line

Landmark geometry demonstrably **can** re-identify. The consent gate is non-negotiable, and **Manifest must stop describing this data as non-biometric in any pitch material** — `docs/research/MARKET_RESEARCH_MEMO.md:181` and `docs/research/FACT_CHECKS.md:105` already reach the right conclusion; make sure the deck matches.

One cheap, high-value action: **run the experiment in-house.** Collect 30-second landmark streams from ~10 teammates, build inter-landmark distance vectors from the 478 points, fit an LDA, and measure rank-1. If it identifies meaningfully above chance on ten people, the capability question is settled against you and you stop arguing. If it fails, you have your own evidence — which is exactly the McCoy-style declaration Meta won with, and which no amount of citing Zellmer will substitute for.


## Follow-up: Has any court between June 2024 and July 2026 decided the question Zellmer footnote 3 expressly reserved — whether creation-and-immediate-deletion of a face representation constitutes "collect, capture, or otherwise obtain" under BIPA §15(b)? Sweep N.D. Ill. and Illinois appellate dockets, and check whether the 2024 §20(b) amendment has been held retroactive.

## BOTTOM LINE

**Q1 (Zellmer fn.3 — ephemeral create-and-delete under §15(b)): NOT DECIDED.** No court has answered it. But this is "not found under a constrained search," not "does not exist" — see the coverage caveat, which is serious.

**Q2 (retroactivity of the 2024 §20(b) amendment): DECIDED — YES, retroactive.** Seventh Circuit, April 1, 2026, unanimous. This was genuinely contested until then; the first pass assumed the answer.

**And one correction to the first pass that matters more than either:** the local-only defense is *stronger* than the first pass claimed, and the risk driver it identified (which landmarks the code reads) is the wrong variable.

---

## 1. Zellmer footnote 3 — verified verbatim, still open

Fetched the actual slip opinion (`cdn.ca9.uscourts.gov/datastore/opinions/2024/06/17/22-16925.pdf`, local: `…/scratchpad/zellmer.txt`, p.18 n.3). Exact text:

> "Given this conclusion, we need not decide whether Meta's creation—and near immediate deletion—of a face signature skirts BIPA's prohibition on 'collect[ing], captur[ing], purchas[ing], receiv[ing] through trade, or otherwise obtain[ing]' a biometric identifier. 740 ILL. COMP. STAT. 14/15(b)."

The first pass was accurate here.

**What I searched.** Enumerated every opinion in CourtListener's opinions database containing "Biometric Information Privacy Act" filed since 2024-06-01 — 19 total. Individually downloaded and grepped all in-window 7th Cir. opinions (Weissman v. Clearview, Clements v. Gunnar Optiks, D'Ambrosio v. Meta, Svoboda v. Amazon, Clay/Willis/Gregg) and all in-window Ill. App. opinions (Salinas v. Arthur Schuman Midwest, Thomas v. Cornerstone, Washington v. Persona Identities, Marino v. Gunnar Optiks) for `ephemeral|immediately delet|not retain|transient|Zellmer`. **Zero hits in any of them.** Plus national RECAP full-text sweeps on four phrasings of the question.

**Two dockets where the question was live and then evaporated:**

- **Brown v. AS Beauty Grp., No. 1:22-cv-07288 (N.D. Ill.)** — virtual try-on §15(b) case. Judge Hunt **vacated her own opinion** (2024 WL 2319715) on 7/3/24 expressly to redo the §15(b) analysis in light of *Zellmer*, *Clarke*, and *Castelaz*. From the minute entry: the court "does not agree that a non-binding appellate court ruling analyzing the propriety of summary judgment on a BIPA claim about a face signature tool on social media necessarily alters the analysis here of allegations regarding a virtual try-on tool." Then: notice of settlement 9/12/24, dismissed with prejudice 11/1/24. The replacement opinion was never written. The old one is vacated.

- **Fleury v. Union Pacific, No. 1:20-cv-00390 (N.D. Ill., Hunt, J.)** — the question is squarely teed up *right now*. Union Pacific's summary judgment brief (Dkt. 328, filed 3/13/25, Latham & Watkins) argues it directly: *"Section 15(b) cannot sensibly be read to require a written release for ephemeral scans."* **This is a defendant's brief, not a holding** — I am flagging that explicitly because it is exactly the kind of document that gets miscited as authority. No ruling found; docket not terminated.

**COVERAGE CAVEAT — read this before relying on the negative.** CourtListener's *opinions* database contains **zero N.D. Ill. district opinions since 2025-01-01** (verified: the query returns `count 0`). My N.D. Ill. sweep therefore ran on the RECAP *document* archive, which is contributor-dependent and materially incomplete. A large share of N.D. Ill. BIPA rulings exist only on Westlaw/Lexis. **A paid-database check of N.D. Ill. 2024–2026 is the one thing I could not do and would change my confidence.** My WebSearch budget was exhausted before this session began, so everything above came from direct API/PDF fetches.

---

## 2. The correction: local-only is a real BIPA defense, and the first pass had the risk variable wrong

The first pass said the local-only architecture "is weaker legally than you think." I think that overstates it, for two independent reasons.

**(a) There is a consistent N.D. Ill. line holding no §15(b) collection where the defendant never receives the data.** From *G.T. v. Samsung Elecs. Am., Inc.*, 742 F. Supp. 3d 788 (N.D. Ill. July 24, 2024) (Jenkins, J.) — dismissing both §15(a) and §15(b) for on-device face clustering in Samsung Gallery (local: `…/scratchpad/gt.txt`):

> "there is a salient difference between providing a technology and then using that technology to collect, capture, or obtain Biometrics. Here, Plaintiffs have failed to allege Samsung took an 'active step' in gaining control over their Biometrics, which dooms their Section 15(b) claim."

quoting *Bhavilai v. Microsoft*, 2024 WL 992928, at *1:

> "selling or licensing a tool that can be used to collect a facial scan is not the same as actually doing the collecting. This argument conflates two different activities—providing the tool versus using the tool."

Second dismissal entered 12/23/24 (Dkt. 103). *G.T.* also relayed *Barnett v. Apple*, 2022 IL App (1st) 220187 ¶44 — "the device and the software are the tools, but it is the user herself who utilizes those tools to capture her own biometric information." **I read that Barnett sentence inside G.T.'s opinion quoting it; I did not open Barnett itself.**

**The honest limit on this:** all three cases involve a vendor whose software runs on the user's own hardware for the *user's* purposes. Manifest runs *its own* web app, operating the camera to drive *Manifest's* UI. A plaintiff will argue that is "using the tool," not "providing" it. That distinction is unresolved and non-trivial. But it is a genuine defense, not the weak position the first pass described.

**Status alert:** *G.T.* is on appeal — **7th Cir. No. 25-1120, argued Oct. 28, 2025, before Brennan, C.J., Jackson-Akiwumi, and Lee, taken under advisement, still undecided as of this sweep (~9 months).** This is the single most important pending case for Manifest's architecture. A long hold suggests a substantial opinion, possibly a dissent or a certification to the Illinois Supreme Court. Watch it.

**(b) The identifiability analysis turns on account linkage, not on which landmarks you read.** *Javid v. M.A.C. Cosmetics, Inc.*, No. 25 CV 11693, Dkt. 30 (N.D. Ill. June 4, 2026) (Alexakis, J.) — denying MTD in a virtual try-on case (local: `…/scratchpad/javid.txt`) — adopts *Zellmer*'s rule ("scans of face geometry … are not covered by BIPA if they cannot identify a person"), collecting *G.T.*, *Martell v. X Corp.*, *Castelaz v. Estée Lauder*, *Clarke v. Aveda*, *Daichendt*, and *Rivera v. Google*.

What made the claim survive was **not** the richness of the facial data. It was: a preexisting MAC customer account holding "her name, date of birth, zip code, email address, and a list of past purchases," plus a commercial incentive to link the two. And *Castelaz* **dismissed** on precisely the absence of that — plaintiffs there gave "any specific factual allegations" that the defendant could determine identity "whether alone or in conjunction with other methods or sources of information available to [defendant]." *Javid* also held temporal proximity is "a sufficient, but not necessary, condition."

So: the first pass's theory — that reading `landmarks[33]/[263]/[1]` (eyes/nose) forfeits Zellmer's ground — conflates *reading facial features* with *being able to identify a person*. The operative question is whether Manifest holds anything an eye-nose triple could be joined to. **If Manifest has no accounts, no login, and no server, Castelaz is the on-point case and it dismissed.** That is a far more actionable risk model, and it points at a product decision (don't add accounts alongside camera input) rather than a code detail.

Also worth noting: ***Javid*'s entire §15(b) analysis never mentions retention or deletion once.** Even in a virtual try-on case, ephemerality was not the battleground. Identifiability was.

**I could not verify** the first pass's claim about the McCoy declaration and what Meta was "NOT computing." I did not read that declaration. Treat that assertion as unverified.

---

## 3. Retroactivity — decided, and it went the defendants' way

***Clay v. Union Pacific R.R.*, No. 25-2185, consolidated with *Willis v. Universal Intermodal Servs.*, No. 25-2761, and *Gregg v. Central Transport LLC*, No. 25-2762 (7th Cir. Apr. 1, 2026)** — Brennan, C.J., joined by Hamilton and Jackson-Akiwumi; argued Feb. 12, 2026 (local: `…/scratchpad/op.txt`).

Holding, verbatim:

> "For the reasons below, we hold that this amendment to BIPA Section 20 applies retroactively to cases pending at the time it was enacted."

and in the conclusion:

> "We hold that this amendment applies retroactively because it impacts only the statutory damages available to plaintiffs—it does not change BIPA's substantive standards of liability."

**REVERSED AND REMANDED.**

Reasoning: remedial changes are "procedural" under Illinois law (*Perry*, *Glisson*, *Dardeen*, *J.T. Einoder*), so Illinois' §4 savings-clause default applies them to pending cases. Two textual anchors: the legislature put the amendment in §20, not §15, and left §15 and §20(a) untouched; and the operative words are "entitled to, at most, one recovery." No constitutional problem because "a plaintiff has no vested right to a particular … remedy."

The panel **expressly reversed the leading contrary decision**, quoting it: *Schwartz v. Supply Network, Inc.*, No. 1:23-cv-14319, 2024 WL 4871408, at *5 (N.D. Ill. 2024) ("the basic question of whether [a plaintiff] has been injured just once or injured more than a thousand times strikes the Court as a matter of substance, not of procedure").

Two caveats:
- **Footnote †:** the panel expressly declined to decide whether the amendment merely *clarified* existing law.
- **This is an Erie *prediction*.** The Illinois Supreme Court has not ruled, and I found no Illinois state appellate decision on §20(b) retroactivity (searched "Public Act 103-0769"/"103-769" across all courts — only the 7th Cir. cases returned). Illinois state courts are not bound. A state-court BIPA action could still come out the other way.

**Practical effect for Manifest:** exposure for Illinois users already served is capped at one recovery per person, and that is now a holding rather than an assumption. Note also the panel's remand instruction that district courts "may need to reevaluate … subject matter jurisdiction" — retroactive single-recovery collapses CAFA amount-in-controversy in many of these cases, which pushes them back to state court where the Erie prediction doesn't bind.

---

## 4. What survives from the first pass

All three recommendations stand — nothing found undercuts them, and the consent modal is now better characterized as **the primary defense rather than belt-and-suspenders**, precisely *because* the ephemerality question is still unanswered and the one case that would have answered it settled. Two amendments to the reasoning:

1. Drop the "your landmarks forfeit Zellmer" framing. Replace with: **do not introduce accounts, logins, or any server-side identity data on the same surface as camera input.** That is what *Castelaz* dismissed on and what *Javid* survived on.
2. Add **7th Cir. No. 25-1120 (G.T. v. Samsung)** to the watch list. It is the pending appellate test of whether on-device processing is "collection" at all, and it has been under advisement since October 2025.

**Primary documents fetched and retained:** `/private/tmp/claude-501/-Users-kanuj-Documents-projects-manifest/73270dc9-cfb8-4d19-a2b5-b948dcef43c9/scratchpad/` — `zellmer.txt` (9th Cir. slip op.), `op.txt` (Clay/Willis/Gregg), `gt.txt` + `gt2.txt` (G.T. v. Samsung, both dismissals), `javid.txt` (Javid v. MAC), `fleury.txt` (UP summary judgment **brief**), `clements.txt`, `weissman.txt`, `dambrosio.txt`, `svoboda.txt`, `marino.txt`, `salinas.txt`, `thomas.txt`, `persona.txt`, `asb.html` (Brown v. AS Beauty docket).
