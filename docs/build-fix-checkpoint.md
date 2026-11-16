# Build & Fix cumulative checkpoint

Updated 16 November 2026, 17:48 Asia/Manila. Latest disposition below supersedes historical November 15 states. Owner: Build & Fix. This is the current continuation record; older dated checkpoints retain detailed release evidence. The associated PR body holds exact publication identifiers after this atomic commit.

## 16 November — BM27-TRF-MAKATI-F1-01 integration

Owner: Build & Fix, consuming Civic Research's 16 November 17:19 PHT audit handoff. Base main b1b76fd9f1fc20854834bbdd3c2186071c62c80a, rechecked before publication. Branch fix/bm-publish-20261116. Affected paths: src/pages/Budget2027.tsx, tests/e2e/critical-paths.spec.mjs, this checkpoint. No overlapping budget PR in the startup open-PR scan (#141/#71/#70/#41/#10). Existing dirty worktrees untouched.

Reproduced omission: current /budget-2027 has national overview and project candidates but no distinct Makati LGU allocation from BESF Table F.1. Independently read original DBM PDF https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2027/F1.pdf, PDF page 1 / printed 558, on November 16. Makati row in million pesos: 2025 Actual Obligation 1,193.60; 2026 Adjusted Program 1,386.72; 2027 Proposed Program 1,535.75. Fiscal stages, currency units and precision retained. Publication date not independently established; checked date is not publication/effective date. FY 2027 is proposed, not enacted or actual spending. NCR barangay aggregate not assigned to Makati.

Change: source-linked ENG/FIL allocation section with separate year/stage cards, in-page anchor and explicit separation from national agency projects, project CSV and city total budget. Acceptance: exact amounts/stages/source page, understandable scope, 390/1440 responsive rendering, keyboard source access, no project export contamination and retained project journeys. Validation results and exact release identifiers are recorded in the associated PR body after this atomic commit; no deployment claim for this batch at commit preparation.

Local validation: npm run quality and npm run build passed. All 11 BM-B27 browser tests passed; four ENG/FIL × 390/1440 comparison tests passed again with an explicit settled-anchor/heading-position assertion. Coverage includes precise allocation stage/amount/source, keyboard source focus, CSV separation, existing filters/deep links/back navigation/language persistence and serious/critical Axe checks. Inspected desktop ENG and mobile FIL section screenshots plus mobile ENG anchor screenshot: amounts wrap readably and the anchor heading clears sticky navigation. Temporary host-only TrueType font config was used because of the existing Chromium font mapping limitation; this is local fallback-font evidence, not production visual verification. Generated build/freshness files excluded. Highest milestone at preparation: ready. Required exact-head GitHub CI, merge, matching production and new-section live verification remain pending.

Audit disposition: BM27-TRF-MAKATI-F1-01 integrated into this scoped branch. BM27-RULE-NTA-DEVFUND-01 remains research-ledger only: individual Makati NTA notification and allocation composition are unresolved; no PHP 307.15 million development-fund claim published. DOH HFEP/DepEd detailed tables, DPWH Metro Manila 2nd DEO lines and independent reconciliation of the existing 11 candidates/32 amounts remain pending. Future Senate timetable does not prove a completed approval. Agency screening is not declared complete; no source-scan cutoff/rotation advanced. City comparisons remain deferred.

Startup release verification: prior BM-B27-ERR-001 PR #153 merged November 15 09:19Z; head 4156bb72578008e40d49473c4599adc898b6085b, merge b1b76fd9f1fc20854834bbdd3c2186071c62c80a. Required CI run 43697945024 completed success for that head. Production dpl_EbWt4F6smnprYbwdzZWEYd6gHn4z is READY, target production, exact githubCommitSha b1b76fd9f1fc20854834bbdd3c2186071c62c80a; deployment URL bettermakati-or7xjul4s-better-makati.vercel.app. Public /budget-2027 inspected in FIL: 11 candidates, ten unchanged and one unresolved, source links and version amounts rendered. No failure was induced on production; changed failure-state production acceptance remains untested. Alias mapping not separately enumerated. Budget MVP1 retained, no relaunch. Ruleset 24442024 checked fresh: PR, build and browser-smoke required, zero approvals, no bypass actors; unchanged.

Retained publisher ancestry reconfirmed against current main: EMBO #84/8393a902; separate RL-EMBO-001 #86/e7045e93; dynasties #91/971d6bf5; Subway #93/c7a55ddd; Economy/PPA #106/6153acba. No fresh article fact-check or changed-output review for these packets today. Economy correction #141 remains draft head 1d6f674edbde3a02fa2fb700c9e8edc6f350a9be pending source reconciliation. Report modularization #99/c97c0a02 complete, not reopened. Journalism policy read; CI is not factual verification.

Next batch: check this PR's exact-head CI once and verify matching production plus rendered ENG/FIL allocation when available; then BM-CI-PUBLISH-001/002 safe PR publication-path repair unless audit supplies a higher-priority concrete defect. Those background failures below remain unresolved, not reclassified as current required-CI failures. BM-ORD-009 mobile navigation verification and BM-ORD-003/008 follow-ups retained. No broad audit or whole-site accessibility claim.

Daily Report scope/cutoff: visible report for this run covers the targeted November 16 startup evidence and this allocation integration. Prior packet milestones retained, unreviewed sources not counted as delivered research. Shared-file report cutoff not advanced; current GitHub checkpoint and PR are the durable handoff, to be read back. Shared Library v117 previously stale; no unchanged failed upload retried. Personal Drive search found no BetterMakati handoff today.

## Historical November 15 checkpoint (retained evidence)

## BM-B27-ERR-001 — unavailable project feeds must not imply zero

Base main: 5b12e0b4fa5b8257bf4dda8df8fcfba8a40e9154. Branch: fix/bm-quality-20261115. Affected paths: src/pages/Budget2027.tsx; tests/e2e/critical-paths.spec.mjs; this checkpoint. Existing budget MVP1 and comparison summary are retained; no relaunch or city comparison work.

Reproduced on unchanged main with a simulated 503 for all project datasets: the page emitted `0 unchanged · 0 increased · 0 decreased · 0 unresolved`, `0 / 0` candidates/coordinates, and a normal no-matches message despite unknown data. Selecting an unavailable dataset also looked like a successful empty query. No public outage inferred: the live /budget-2027 returned 11 candidates, ten unchanged and one unresolved, in FIL during startup inspection.

Change: explicit bilingual unknown change/count states, selected-dataset recovery guidance, no empty-result claim for failed selected feeds, and no 0/0 coordinate summary. Valid empty datasets, usable partial data, original amounts, missing-versus-zero semantics, CSV, filter URL and retry behavior remain intact. Acceptance is scoped to total failure, partial failure with no retained candidates, unavailable selection while other candidates exist, genuine empty selection and keyboard retry recovery across ENG/FIL and 390/1440 widths.

Local evidence: full npm run quality and npm run build passed. Eleven BM-B27 tests passed against production preview; the four failure-state cases passed again after adding serious/critical Axe checks and screenshot capture. Unchanged-main regression fails on the misleading 0/0 state. Inspected mobile ENG and desktop FIL failure-state screenshots: message wrapping is readable, controls retained. A temporary host-only FONTCONFIG_FILE using installed TrueType fonts was necessary: the default system-ui/Inter mapping to OpenAI Sans WOFF2 produced zero-sized text boxes in Chromium. No site font or acceptance assertion changed. This is limited local visual evidence with fallback fonts; production visual acceptance remains pending. Generated freshness/build files excluded.

Highest milestone at commit preparation: ready. Required GitHub build/browser-smoke, merge, matching READY production and changed-page live acceptance are pending, not successful. Ruleset 24442024 checked fresh: PR and both checks required, zero approvals, no bypass actors. Normal auto-merge only.

## Audit handoff disposition — BM-B27

Consumed research Batch 5, completed 15 November 2026 16:57 PHT, from the separate research task's recorded result. Its cumulative reported review covers DHSUD OSEC, HSAC, NNC, DOTr OSEC and PNAC NEP sections; zero new Makati-specific additions. PNAC record BM27-NAT-PNAC-HIV is national/regional, not a local appropriation. Handoff source: https://www.dbm.gov.ph/wp-content/uploads/NEP2027/DOH/C.pdf, printed 302–307, appropriation at PDF 2/printed 303. Amount in handoff PHP 75,516,000; not independently reread or added to public data by this engineering run. Programme components must not be added to the parent total.

Unreviewed by the research handoff: DPWH Metro Manila 2nd DEO detailed lines, independent reconciliation of existing 11 candidates, House detail in this batch. Later approved Senate/bicameral/enacted stage not established. No agency screening marked complete by Build & Fix; no research/source cutoff advanced. Disposition: no verified local record correction to integrate; preserve current coverage caveats and wait for precise source-backed additions/corrections. City comparisons deferred.

## Current production and retained releases

Startup production: dpl_2KNAf1k325RJFbH6UxVjpW6vhzbN, target production, READY, githubCommitSha 5b12e0b4fa5b8257bf4dda8df8fcfba8a40e9154. Public https://bettermakati.org/budget-2027 rendered and loaded live data. Deployment aliases not independently enumerated this run. Main's build/browser-smoke succeeded in Actions run 43660876205. CDN optimization #152 and desktop navigation #151 are in current main. Budget #147/#149 retained (merge 82096d18144157d8b8606ba1c6565ec992cc98c8 is an ancestor); previously live-verified MVP1 remains available.

| Packet | Retained production ancestry | Remaining gate |
| --- | --- | --- |
| EMBO | #84 / 8393a902 | No new article fact-check this run |
| RL-EMBO-001 propagation | #86 / e7045e93 | Separate completed release retained |
| Political dynasties | #91 / 971d6bf5 | No new article fact-check this run |
| Makati Subway | #93 / c7a55ddd | No new article fact-check this run |
| Economy/PPA | #106 / 6153acba | #141 draft head 1d6f674edbde3a02fa2fb700c9e8edc6f350a9be; source reconciliation pending |
| Featured Report modularization | #99 / c97c0a02 | Complete; do not repeat |

Open PR scan: #141, #71, #70, #41, #10; no overlapping budget repair. Existing uncommitted work in bm-nav-20261113 untouched; isolated worktree used. Existing orderliness IDs preserved. BM-ORD-005 desktop navigation landed in #151; live mobile acceptance remains BM-ORD-009. BM-ORD-003 barangay Now & Next propagation and BM-ORD-008 duplicated FIL Better remain pending. No blanket accessibility/quality certification.

## Background publication failures — precise follow-up

BM-CI-PUBLISH-001: Civic Brief job 132742271868, run 43691278433, failed 15 November 07:46Z because it pushes directly to protected main; GH013 explicitly requires a PR and two checks. Its retry message misdiagnoses this as main moving. Preserve rules; adapt publication to a scoped PR path and stop retrying rule violations. This is a workflow defect, not a permission request to weaken branch protection.

BM-CI-PUBLISH-002: news refresh job 132736479070, run 43689349847, wrote/updated automation/daily-news-discovery but PR creation failed: GitHub Actions is not permitted to create or approve pull requests. Do not silently broaden Actions permissions. Next batch inspect existing branch/diff and suitable authorized connector-mediated PR path; required CI must still run. Monitor job 132731549572/run 43687706050 also failed; complete root-cause triage separately. These failures do not negate the successful required build/browser-smoke checks for current main.

## Next batch and report continuity

First inspect this repair's exact-head checks once, then matching production/live acceptance when available. Priority next independent batch: BM-CI-PUBLISH-001/002 safe publication-path repair; no bypass or automatic factual publication of unreviewed generated records. Continue publisher review/UX rotation afterward. Source-completeness audit remains external research pending work, not an engineering blocker.

Shared handoff freshly located at v117, modified 4 November; its old upload failure was not retried unchanged. Personal Google Drive BetterMakati search found no handoff. This GitHub checkpoint and associated PR are the durable continuation record. Shared-file Daily Report cutoff is not advanced. Packet states and checked scope here supersede old run status, without implying a complete new source scan. Report disposition and exact PR/head/CI will be written and read back in the PR body.
