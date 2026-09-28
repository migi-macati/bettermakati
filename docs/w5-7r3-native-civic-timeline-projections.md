# W5-7R3 — Native Civic Timeline projections

Reviewed: 2026-09-28

## Status

**Complete. Native data only; no new external ingestion and no Calendar UI.**

R3 proves that the Makati Calendar can derive a meaningful historical/current
civic-time layer from records BetterMakati already owns.

Implementation:

`src/data/civicTimelineNative.ts`

## Native projection sources

R3 projects six existing domains.

### Legislation

The projector consumes explicit dated lifecycle rows from the canonical
Legislation registry.

Current seed baseline:

- 15 ordinance records;
- 5 resolution records.

For every explicit lifecycle date, the projector preserves:
- canonical legislation record ID;
- lifecycle meaning;
- original legislation source IDs;
- source-backed geography already expressed by canonical relationships.

Temporal mapping:

- published → publication/release;
- effective/amended/repealed → effective change;
- other dated lifecycle milestones → occurrence.

Undated lifecycle rows remain excluded.

The projector can also consume dated session evidence when such rows are added.

### Council sessions

The nine current council-session seeds are projected as meeting occurrences.

They remain canonically owned by City Monitor.

The projection does not infer:
- attendance;
- votes;
- action on a measure;
- a complete legislative calendar.

Those remain governed by the existing Council Session source discipline.

### Direct City Monitor records

R3 has a deliberately narrow direct City Monitor projection.

It accepts only item-level records of these types:

- procurement;
- publication;
- consultation;
- official notice.

It explicitly excludes generated `monitor-*` procurement mirrors because
those are already owned by Accountability.

The current base dataset yields two direct procurement records.

Council sessions use their dedicated projection path rather than being copied
again from the City Monitor array.

### Accountability / Procurement

All 21 currently structured procurement entries with exact `bidDate` values
project into the timeline.

The projection uses:
- canonical Accountability entry ID;
- `procurement.bidDate`;
- existing source records;
- explicit barangay when the canonical record already has one.

It does not invent:
- contract date;
- notice-to-proceed date;
- implementation date;
- completion date.

Those stages remain source gaps unless separately documented.

### Elections

The existing 10 historical Makati mayoral-election records project only their
exact election dates into the Archive layer.

The timeline item deliberately does not duplicate candidate/result content.

Canonical Elections remains the owner.

Future voter-registration and election deadlines remain R4 work because they
need a current structured official milestone source.

### Reports & Insights

The five existing Featured Reports now have an explicit semantic contract:

`FeaturedReportV2.date` is the **BetterMakati report publication date**.

It is not:
- the period analyzed by the report;
- a source publication period;
- a source check timestamp.

The current five report records use the 26 September 2026 BetterMakati
publication date and project as `report-release` items.

## Canonical resolution

R3 introduces a native resolver for the domains it projects.

Timeline entries resolve their canonical labels and destinations from:
- City Monitor;
- Legislation;
- Accountability;
- Elections;
- Reports.

The timeline still cannot supply an arbitrary competing canonical URL.

## No new scraping

R3 does not call `fetch`.

It does not import/project:
- Statistics;
- Public Records;
- Services;
- Barangay dated notices;
- Mobility advisories.

Those domains were deliberately excluded by R1 until their publication/change
metadata becomes semantically sufficient.

## Current native baseline

The source baseline checked by the R3 guard is:

- 20 legislation seed records with dated lifecycle data;
- 9 council sessions;
- 2 direct item-level City Monitor procurement records;
- 21 Accountability procurement records;
- 10 historical mayoral election dates;
- 5 BetterMakati report releases.

That is a **67-item native seed baseline** before any R4 source-discovered
deadlines, assemblies, advisories or data releases.

This count is not presented as comprehensive civic coverage.

It simply proves the projection architecture can already unify several existing
domains without copying their canonical records.

## Important non-duplication rules

R3 specifically prevents the most obvious duplicate path:

`procurementProjectEntries` → generated City Monitor `monitor-*` record

The timeline projects the canonical Accountability item and rejects the
generated City Monitor mirror from the direct City Monitor path.

Council-session seeds likewise use one dedicated City Monitor-owned projection
rather than another blind pass through `cityMonitorRecords`.

Later cross-domain duplicate work should follow the same owner-first rule.

## Guard

New build/quality gate:

`check:civic-timeline-native`

It protects:

- the six native projection families;
- exact source-date field origins;
- the R2 forbidden-date protections;
- no new source fetching in R3;
- no premature Statistics/Public Records/Services/Mobility projection;
- no `monitor-*` procurement duplication;
- the current native source-count baseline;
- explicit Featured Report publication-date semantics.

## What R3 does not do

It does not yet create:
- `/calendar`;
- Now & Next;
- Recently Published;
- public Archive views;
- barangay filters;
- ICS/RSS/JSON feeds;
- automatic external notice extraction.

Those follow after the source-discovery layer.

## Next micro-step

**W5-7R4 — source-discovered civic dates.**

Build the reviewed candidate pipeline for:
- public hearings and consultations;
- barangay assemblies/notices;
- road closures and mobility/service advisories;
- official citizen deadlines;
- current COMELEC milestones;
- true publication/release timestamps for Statistics and Public Records.

The rule remains:

**source change → candidate → review/canonical owner → Civic Timeline
projection**

Never:

**source change → public calendar item**.
