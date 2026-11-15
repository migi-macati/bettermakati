# Build & Fix cumulative checkpoint

Updated 15 November 2026, 17:09 Asia/Manila. Owner: Build & Fix. This is the current continuation record; older dated checkpoints retain detailed release evidence. The associated PR body holds exact publication identifiers after this atomic commit.

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
