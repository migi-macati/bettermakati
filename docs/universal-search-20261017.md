# Universal search improvement — 17 October 2026

User authorized implementation after the live search assessment. Preserve the single homepage entry. This is Build & Fix work; existing publisher authority and schedules are unchanged.

## First implementation
- Word/phrase boundaries prevent baha matching bahay and lane matching Magallanes.
- Require all meaningful query terms; ignore conversational fillers and Makati as a ranking discriminator.
- Prioritize matching service guides for service needs, retain explicit historical intent, reduce planned-tool ranking.
- Cache normalized index fields; preserve bounded typo and synonym support.
- Recognize maingay ang/yung kapitbahay and magmungkahi/mungkahi proposals.
- Ask new application versus renewal for an unqualified business permit query.
- Homepage shows at most five suggestions; advanced filters remain on the search page. Truncate long record excerpts.
- Keep private descriptions in navigation state, not URLs. Nothing is submitted to government or published by searching.

## Acceptance and publication
Run actual-index and negative-match regressions, existing civic aliases, quality/build and required browser CI. Browser tests cover ENG/Filipino at desktop/mobile, yellow card ranking, noisy-neighbor guidance, proposal routing, permit choice, private URL and overflow. Do not claim deployment until merged SHA matches READY production; rendered acceptance is separate.

## Remaining implementation queue (not completed by this patch)
1. Shared intent handling for edits on search results, supported follow-ups, retained location and reset. Reuse verified guide channels; do not ask again for supplied barangay.
2. Structured service answers and grouping of guides with their supporting records. Useful fallback when no adequate match; no invented answer.
3. Meaning-based retrieval evaluated against held-out English/Taglish utterances. Compare against deterministic baseline before adding a hosted dependency.
4. Optional sourced synthesis only after retrieval passes. Establish provider availability, cost limits and privacy before sending visitor queries; never place credentials in client code. No paid service provisioned in this patch.
5. Observe latency on phones and task completion, including uncertain and unknown requests. Local ranking timings are not mobile performance measurements.

Continue this queue in the existing Build & Fix mandate; do not create another automation or duplicate this release. Preserve BM-ORD backlog, with release regressions first and search ahead of cosmetic work.

## Local validation result
Full quality and production build passed. Ten isolated ranking regressions and six shipped-index assertions passed. Nine browser tests passed against the local production preview, including two new desktop English/mobile Filipino journey cases and existing typo, privacy, concern, idea, canonical and synonym tests. Browser setup needed Chromium installation; initial attempts did not reach the app. Successful run: 9 passed in 8.2 seconds. This is local evidence, not production acceptance.
