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

