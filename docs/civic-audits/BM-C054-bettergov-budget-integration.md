# BM-C054 — BetterGov.PH national budget integration: discovery and release gates

**Owner:** Civic & Editorial (source verification, interpretation, publication); Build & Fix (shared technical implementation and UX).  
**Status:** discovery / no public budget figures approved. **Checked:** 31 October 2026 (Asia/Manila).  
**Upstream:** https://github.com/bettergovph/transparency-portal (MIT); https://budget.bettergov.ph/docs.  
**Existing BetterMakati:** keep Projects & Budget, Accountability Ledger, City Monitor and homepage search canonical; do not launch a disconnected second portal.

## Verified upstream interface (documentation, not live Makati counts)

- Base: `https://budget.bettergov.ph/api/v1`; public read-only CORS API; OpenAPI at `/api/v1/openapi.json`.
- `GET /hgab/2027`: programs, version names, document list, notices and status wording.
- `GET /hgab/2027/datasets/dpwh/projects?office=…`: office-level DPWH projects; shared district offices must remain whole.
- `GET /hgab/2027/datasets/{program}/projects?q=…`: place-name title search across DPWH, farm-to-market roads, health facilities and irrigation. A title match is not proof of location.
- `GET /hgab/2027/datasets/{program}/projects/{id}`: source-page links, version amounts, match notes and reading labels.
- `GET /hgab/2027/districts` and `/districts/{id}`: office names and district mappings; verify relevant Makati office(s) from API rather than assume.
- `GET /gaa/departments` and `/gaa/departments/{id}/programs?q=…`: 2020–2026 enacted appropriations. Fetch **every** cursor page per department; do not use capped `/gaa/search` for completeness.

Source: upstream `README.md` and `docs/api.md`, main, retrieved 31 October 2026. API response bodies, actual Makati scope and coverage totals **not yet independently extracted**.

## Interpretation and safety invariants

1. NEP and House bill are alternative FY2027 proposals; compare, **never add**. House version can differ by program/reading.
2. An absent line is **not zero**. House-only/NEP-only is a candidate for review, not a verified insertion/deletion. Preserve uncertain matching and original row IDs.
3. 2020–2026 GAA amounts are enacted appropriations, **not disbursements or completed works**. Do not merge national GAA with Makati LGU budget as if a single funding pot.
4. Office totals are **not Makati city totals** where offices serve multiple districts/places. Do not allocate shared-office budgets to Makati without source-supported attribution.
5. Title-name search has false negatives and namesakes; the API currently lacks reliable city/municipality PSGC per project. Never label a filtered result “all Makati projects” without proven scope.
6. Carry API `meta` source commit/build date, notices, disclaimers, source PDF pages and last-checked time into the public view. No silent exclusions; document exclusion key and reason.
7. No project-level claims of wrongdoing, delivery, procurement, contractor identity or spending without separate primary evidence. No citizen-report collection or third-party personal-data transfer by default.
8. Preserve English/Taglish meaning, accessibility, direct navigation and clear source/version labels. No paid provider or new automation.

## Implementation work packets

- **BM-C054-A — Coverage and API audit (first gate):** resolve official Makati city/district/office names via districts API; query each 2027 program; paginate to completion; record counts, overlap/deduplication, title-only hits, ambiguous shared offices, excluded namesakes, missing locations, upstream metadata and rate/failure behavior. Independently compare with source-page links for a stratified sample. Output dated evidence ledger and coverage matrix.
- **BM-C054-B — Versioned read-only adapter (Build & Fix):** typed API response parsing, schema guards, bounded pagination, timeouts, source-vintage tracking, caching/fallback and explicit incomplete/error states. No secrets in browser; no unbounded browser requests. Evaluate static snapshot vs controlled client fetch using actual data volume and build reliability.
- **BM-C054-C — Native project comparison:** introduce a national-budget tab/section under existing budget route, filter by program/office/status/year, source PDF per amount, shareable URL and accessible CSV. Clearly distinguish proposed/enacted and national/local. No duplicate portal shell.
- **BM-C054-D — Civic relationships and search:** link only independently matched records to existing barangay, map, service and project records; preserve uncertain-match flags. Index verified project records with intent tests in English/Taglish, typos and direct navigation. No unsupported semantic-AI claims.
- **BM-C054-E — Editorial release:** claim-by-claim ledger, original document spot checks, no misleading aggregate totals, bilingual QA, required repo checks, CI, Vercel deployment and live page verification. Correct publicly with dated notes if source versions change.

## Initial acceptance tests

- All paginated records and departmental/year totals reconcile with API `meta.matched_amount`; failure blocks completeness claims.
- Missing versions render “no line in this version,” not ₱0; uncertain matches remain visible.
- Shared DPWH office appears once, never proportionally split into Makati.
- Every displayed amount has fiscal year, version, units, source page/link and retrieved source vintage.
- Network/API errors display unavailable or partial coverage, not empty-project conclusions.
- A resident can find a project by common wording, reach the original source, and return to the existing BetterMakati journey.
- Held-out search queries include “2027 flood control Makati”, “may dagdag bang budget sa House?”, “DPWH project sa Poblacion”, and “magkano na ang nagastos?”; the last must explain that appropriation is not spending.

**Decision:** APPROVED FOR SCOPED IMPLEMENTATION, NOT FOR CLAIMING FULL COVERAGE OR PUBLICATION. Start with BM-C054-A. Keep other Civic/Editorial queue rotation unchanged; no extra automation. 
