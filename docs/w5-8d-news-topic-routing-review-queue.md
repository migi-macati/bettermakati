# W5-8d — News topic routing and internal review queue

Reviewed: 2026-09-28

## Status

Implemented at repository level. CI/deployment verification remains subject to the
normal GitHub workflow.

## Goal

Use the news discovery layer to identify potentially consequential Makati
developments and route them to the correct canonical BetterMakati owner without
turning media reporting into civic truth.

The review queue is **internal workflow state**.

Nothing in the queue is a public City Monitor record, Accountability record,
Legislation record, Mobility record, Election fact, Service change, Calendar
item or other canonical BetterMakati record merely because a headline was
discovered.

## Topic routing

W5-8d introduces transparent rule-based routing for these civic topics:

- **Legislation** — ordinances, resolutions, council actions and readings;
- **Elections** — COMELEC, voter registration, candidacy and election
  milestones;
- **Accountability** — procurement, bids, awards, budget, audit and supplier
  signals;
- **Mobility** — road/lane closures, rerouting, route/fare/station changes and
  major public-transport systems;
- **Participation** — public hearings, consultations, assemblies and public
  comment;
- **Services** — service hours, suspension, permits, licenses, health/service
  delivery and application deadlines;
- **Public Records** — official reports, audit reports, statistics/data releases
  and publications;
- **City Monitor** — official notices/advisories that do not yet have a stronger
  canonical owner.

A story may route to more than one owner.

The most specific owner is selected as the primary review owner. City Monitor is
a fallback discovery owner rather than a catch-all replacement for the
destination domain.

## Queue eligibility

A story enters the internal review queue only when:

1. the news item is not classified as old;
2. Makati appears in the title or description;
3. at least one civic topic rule is triggered.

Lifestyle, dining, entertainment and other ordinary Makati coverage therefore
remain on the News page but do not enter the civic review queue unless the story
also contains a concrete civic-change signal.

## Canonical deduplication

Before a candidate is labeled for owner review, the queue checks for exact
canonical evidence that the underlying record already exists.

Current exact-match checks include:

- procurement reference numbers against Accountability;
- official measure numbers against Legislation;
- City Monitor reference numbers;
- election-law references present in the Elections owner;
- exact article/source URLs already used by City Monitor or Public Records.

When an exact match is found, the candidate receives
`canonical-match-found`.

The reviewer should open the existing canonical record first and update it only
if the new story leads to stronger item-level evidence. The queue must not
create a duplicate record.

## Entity context

The queue also records explicit named context for:

- Mobility systems;
- Services.

These are navigation/review hints. A named system or service does **not** mean
that the article proves a status change.

## Promotion rule

A news item may discover a change, but promotion requires the evidence rules of
the destination owner.

Examples:

- a procurement story must resolve to the exact procurement/award record;
- a legislative story must resolve to the official measure/session evidence;
- an election story must resolve to the current COMELEC/legal source set;
- a mobility story must identify the exact affected system/route/road and
  effective period;
- a service story must establish the affected service, responsible owner and
  effective date;
- a public-record story must establish the official record identity and release
  metadata.

The queue never performs automatic promotion.

## Generated artifacts

The news discovery workflow now maintains:

- `src/data/newsSnapshot.ts` — public fallback feed;
- `data/news-discovery-snapshot.json` — structured discovery input;
- `data/news-review-queue.json` — machine-readable internal review state;
- `data/news-review-queue.md` — human-readable review list.

The queue artifacts are not copied to the public site.

## Refresh cadence

The existing content-refresh workflow now runs **daily at 09:00 Philippine
time** instead of weekly.

It refreshes the discovery snapshot, rebuilds the internal review queue, runs
the normal site build/quality checks, and updates a reviewable automation pull
request.

This keeps current-affairs discovery reasonably fresh while preserving a human
review gate.

## Build guards

`check:news-review-queue` verifies:

- topic routing;
- lifestyle/noise exclusion;
- internal-only `publicEligible: false` boundary;
- canonical deduplication state;
- queue generation;
- daily workflow cadence;
- generated review artifacts.

The check runs in both `build` and `quality`.

## Current seeded candidate

The current fallback discovery snapshot identifies the September 19, 2026
Makati City Hall work-schedule/service-hours announcement as a Services review
candidate with City Monitor as a secondary owner.

It remains an internal review candidate until the Services owner verifies the
specific affected services, operating schedule and effective conditions from
the underlying official evidence.

## Next

### W5-8e — owner review workflow and closure

Define how a reviewer resolves a candidate to:

- update-existing;
- create-canonical-record;
- context-only;
- duplicate;
- stale;
- insufficient-evidence;
- out-of-scope.

Then preserve the resolution history so future refreshes do not repeatedly
surface already-decided stories unless materially new evidence appears.
