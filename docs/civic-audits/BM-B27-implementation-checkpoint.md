# BM-B27 / BM-C054 — first implementation checkpoint
Checked 1 November 2026 (Asia/Manila). Owner: Build & Fix; reuse Civic PR #147.

## Scope and continuation
The user approved /budget-2027: national budget overview, Makati implications, project list/map, supported seven-city comparisons and one compact homepage feature. This expands BM-C054's project-only starting point. Preserve existing Projects & Budget and its national/local distinctions. Continue PR #147 rather than open a duplicate integration branch. The existing daily Build & Fix prompt carries B27-01 through B27-06 and the release requirements. No homepage promotion until a useful verified destination exists.

## Observed live evidence
GET https://budget.bettergov.ph/api/v1/hgab/2027/datasets/dpwh/projects?q=Makati&limit=200 succeeded using curl. Raw public response is preserved in data/budget2027/2026-11-01-makati-dpwh-title-response.json for reproducibility, NOT imported into the public UI.
Source commit a0caa778442cdae5583f5a006ea7401dab00e5ac; API built_at 2026-10-26T08:46:14.383Z.
- 12 returned records / 12 declared; unique IDs; all fit one page.
- All 12 have null lat and lon. A schema with nullable coordinates is not evidence of mapped Makati projects.
- NEP: 11 rows with amounts, sum PHP 659426000; one missing version.
- House second and third readings: 12 rows each, PHP 684426000 each.
- All three sums reconcile exactly with API data.sums.
- Offices: Central Office, Metro Manila 1st DEO, Metro Manila 2nd DEO (full names in response).
These are title-query sums, NOT certified citywide totals. Original PDF spot-checks, boundary attribution, cross-boundary projects and office-ledger completeness remain unverified. The unmatched line must remain a candidate rather than a finding of insertion.

## Access and coverage gaps
Python urllib requests for overview, OpenAPI, fmr/hfep/nia Makati queries and DPWH title searches for Taguig, Pasig, Mandaluyong, Manila, Quezon City and Marikina returned HTTP 403 in this environment. This does not establish a public API outage or empty results. Do not reclassify failures as zero; retry through a working permitted access route only when justified. No city ranking or complete all-program count is approved.
Upstream src/config.ts confirms dataset keys dpwh/fmr/hfep/nia. Earlier documented API schemas expose national NEP/GAA data; actual national aggregate payloads still need validation. Do not use four-program project sums as the whole national budget.
No independent budget-stage refresh or original PDF verification was performed in this batch; verify before public release.

## Code delivered
- scripts/bettergov-budget-validation.mjs: reusable pure validation for complete pagination, unique IDs, consistent response source vintage, PHP units/year, safe integer amounts, per-version sum reconciliation, missing values and coordinate coverage.
- Existing scripts/audit-bettergov-makati-budget.mjs now uses that validator.
- scripts/test-bettergov-budget-validation.mjs: 10 assertions for missing-versus-zero, duplicate IDs, truncated pages, source drift, wrong units, amount disagreement and coordinate validity.
- Captured live response validated through the same code.
No dependencies added; public routes and the existing PR's component were not changed in this batch.

## Next concrete batch
B27-01 remains PARTIAL: resolve all-program/national aggregate access, inspect a stratified source-PDF sample, verify district/office scope and coordinate provenance. Then B27-02 adapter and B27-03 page. Use a list-first initial experience; map only independently supported locations. Do not geocode titles silently or use barangay/office centroids as project coordinates. Seven-city feasibility is unresolved, not disproven.
Before releasing the existing PR component, replace its English-only body with proper ENG/FIL rendering, remove the low-value reachability-only status or connect it to validated content, and align its scope with the national overview. Preserve current PR files and other publishers' work.
Validation here: pure script tests and live captured-response reconciliation passed. Full required repository build/browser-smoke must pass before merging; no merge or deployment claimed.



## Second development batch — 1 November 2026
Access gap narrowed: curl successfully retrieved the overview, OpenAPI, national NEP overview, departments, districts and all four Makati title queries. The earlier Python urllib 403s were access-method-specific; do not carry them as a universal API blocker. Four Makati title queries are complete: DPWH 12, fmr 0, hfep 0, nia 0. Zero title matches do not establish zero local benefit or funding. Raw response snapshots are evidence only, not public-page data.

National NEP response reconciles exactly across 39 department/fund categories: FY2027 PHP 7,200,186,000,000 versus its FY2026 baseline PHP 6,793,162,000,000. This is NEP versus GAA baseline, NOT NEP versus House. Source meta generated_at 2026-08-21T16:48:42.704Z. Do not expose upstream internal source_file filesystem paths in reader-facing copy. Original national budget table verification remains pending.

City DPWH title queries: Taguig 4 matches/4 coordinate pairs; Pasig 22/3; Mandaluyong 29/22; Quezon City 200/38; Marikina 81/16. Manila returned 629 declared matches with only first 200 inspected (44 coordinate pairs in that page). Manila search includes Metro Manila references; do not publish these counts as city totals or rankings. No full city attribution/boundary checks were completed. See dated coverage JSON. Makati remains 12/0 coordinates.

Implemented src/lib/budget2027/client.ts: typed validated read-only adapter, bounded complete pagination, unique IDs, source-vintage consistency, per-version sum reconciliation, null preservation, coordinate coverage, cancellation/timeouts, independent program error states, and separate national comparison labels. loadCityProjects reports failed programs separately and never claims verified citywide coverage. National aggregate loader reconciles department amounts and baseline amounts against national totals. Source URLs, retrieval times and original disclaimers are retained. No backend, paid provider or new dependency.

Regression tests exercise paginated 201-row responses, missing versus zero, incomplete pages, duplicate IDs, sum mismatches, source drift, HTTP failures, valid empty results, partial program failures, national reconciliation and cancellation. npm run test:budget2027 is included in quality so CI runs these checks. All four captured Makati responses and the national response passed the new adapter's validation locally.

Next: finish original PDF spot-checks and verified geographic inclusion, then implement /budget-2027 with national overview and accessible project list. Reuse the adapter rather than fetch directly from components. Do not block the useful list on absent map coordinates. Core page, homepage card, city comparison UI and production release remain unfinished. Existing PR's status-only component still requires replacement/localization before public release.

### Original document spot-check and validation evidence
Opened https://budget-assets.bettergov.ph/hgab/2027/pdf/hb10858-3r-vol-ic.pdf and extracted PDF page 322 (printed page 314), on 1 November 2026. Confirmed the matching descriptions and House amounts for Filmore Street/Calatagan Creek box culvert (PHP 25,000,000), South Super Highway Faraday Street toward Gil Puyat drainage (PHP 28,500,000), and Palanan Casino Street toward Zobel Roxas revetment (PHP 42,000,000). PDF page number and printed page differ; preserve the source's PDF fragment for navigation. This confirms those House entries only, not NEP absence, match correctness or citywide completeness. The NEP PDF exceeded the conservative 50 MB download cap; no NEP original-page verification claimed.
TypeScript build and the complete npm run quality suite passed after adapter integration. Production build is checked separately. No new public UI wired to this adapter yet.

Complete local npm run build passed as well. Browser smoke and exact-head CI remain required before merge; this batch has no UI change. Generated build outputs were excluded from the commit.
