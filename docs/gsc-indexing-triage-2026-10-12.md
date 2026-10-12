# Google Search Console indexing triage — 12 October 2026

**Owner:** Build & Fix (SEO/infrastructure); coordinate content or report questions with Civic & Editorial.  
**Status:** Observations verified, remaining coverage investigation OPEN.  
**Do not treat intentional canonical/redirect exclusions as defects.**

## User evidence (screenshots taken 12 Oct)

Search Console data last updated **9 October 2026**: **228 indexed, 171 not indexed (3 reasons)**.  
Alternate page with proper canonical: **4 URLs**, validation started 7 Oct and failed 10 Oct.
- `/get-involved?type=correction&subject=Correction%3A%20%2Fcinemas`
- `/get-involved?type=correction&subject=Correction%3A%20%2F`
- `/get-involved?type=correction&subject=Correction%3A%20%2Fservices%2Fguide%2Fgsis-ec-claim`
- `/reports/2026-budget-operating-expenses`

Page with redirect: **3 URLs**, validation started 6 Oct and failed 10 Oct:
- `http://bettermakati.org/`
- `https://www.bettermakati.org/`
- `http://www.bettermakati.org/`

The third exclusion reason and its **164 URLs** (171 minus 4 minus 3) are **not visible in the screenshots** and cannot be categorized without Search Console detail/export. The counts may be stale relative to current deployments.

## Verified production behavior (12 Oct; Vercel connector)

- Canonical `https://bettermakati.org/` returns 200 and self-canonical.
- All three alternate homepage hostname/protocol URLs return HTTP **308**; intentional normalization. Do **not** try to make these source URLs indexable or restart validation while correct.
- Prefilled `/get-involved?...correction...` returns 200 and `<link rel="canonical" href="https://bettermakati.org/get-involved">`; correct because parameters only prefill form state. Do not create distinct indexed pages for form variations.
- `https://bettermakati.org/reports/2026-budget-operating-expenses` returns 200, has a self-canonical tag, and contains route-specific head metadata. However **Google-selected canonical and indexed status remain unverified**; older GSC crawl could predate a fix or reflect Google's content assessment.
- `https://bettermakati.org/sitemap.xml` returns 200 and contains **398** `<loc>` entries.
- Vercel production deployment READY (main commit `abeedcfc337ef169b86724b9f2a0aa92fb9b787b`).
- Code: `scripts/generate-site-files.mjs` generates the sitemap; `scripts/postbuild-routes.mjs` generates route-specific HTML; `scripts/check-built-metadata.mjs` asserts one matching canonical per sitemap page. Generated robots policy allows all except `/search`; a production robots.txt fetch was blocked by connector safety classification, **not** an HTTP failure.

## Action queue, with acceptance criteria

**BM-SEO-001 — P1: classify remaining 164 GSC exclusions.** Obtain the third reason and representative URL list from Page indexing / export; distinguish legitimate exclusions, indexed canonical targets, and eligible substantive pages actually being missed. Verify by Google URL Inspection for representative important URLs. **No assumption that 100% of discovered URLs should be indexed.**

**BM-SEO-002 — P1 if incorrect: inspect budget report Google-selected canonical.** On `/reports/2026-budget-operating-expenses`, obtain Search Console's Google-selected vs user-declared canonical, last crawl, and indexing status. Current production has 200/self-canonical; investigate further only if Google still selects a different canonical or cannot render article content. Fix real inconsistencies in sitemap, internal links, canonical, or content; rerun live + Google verification when appropriate.

**BM-SEO-003 — P2: public-record route indexability policy.** `src/App.tsx` exposes `/records/:id` and `src/pages/PublicRecordDetail.tsx` supplies SEO metadata, but the generator omits these detail URLs from sitemap and generic `metaFor` fallback does not use record-specific titles. Decide which independently useful detail entries merit indexing and which are thin/duplicated catalogs. For eligible entries only, generate stable sitemap URLs and unique server-visible metadata with build tests. For noneligible entries, make policy intentional. Avoid mass-adding thin pages just to raise index count.

**BM-SEO-004 — P2 if evidence warrants: JS rendering/indexability.** The static HTML contains route-specific metadata but an empty root element until JS renders the article. Check representative Google rendered HTML and indexing status. Do not undertake SSR/prerender refactor without crawl/render evidence.

**BM-SEO-005 — P3: regression and monitoring.** Validate canonical host, redirects, sitemap coverage, report canonical and important route-specific metadata in appropriate build/live tests. Reassess after Search Console recrawls; do not interpret failed validation of correct redirects as a defect.

## Boundaries

Do not alter healthy 308 redirects or legitimate canonical form URL handling merely to clear a Search Console warning. Do not conflate site deployment, live response, Google's crawl and Google index inclusion. Current Google URL Inspection and third-category URLs still require Search Console data from a verified property user. Track repairs in existing BetterMakati Build & Fix work; no new recurring automation.
