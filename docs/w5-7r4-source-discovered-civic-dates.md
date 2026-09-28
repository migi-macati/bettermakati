# W5-7R4 — Source-discovered civic dates and review pipeline

Reviewed: 2026-09-28

## Status

**Complete as a reviewed-candidate pipeline. No source signal is published
directly to the Civic Timeline.**

R4 introduces the missing bridge between BetterMakati’s freshness monitors and
the future Makati Calendar.

The pipeline is:

> **source monitoring → internal candidate → item-level review → canonical
> owner → Civic Timeline projection**

Never:

> **source changed → public Calendar item**

## New discovery registry

`data/civic-time-discovery-sources.json`

maps monitored sources to:

- source system;
- candidate owner;
- allowed civic-time kinds;
- eligible signal modes;
- required extraction/review mode;
- source-specific caution.

The initial registry includes:

- Makati Events;
- Makati News;
- MyMakati broadcasts;
- PhilGEPS;
- Resilient Makati consultations;
- MACEA circulars/advisories;
- COMELEC 2026 BSKE calendar;
- COMELEC 2026 voter-registration rules;
- COMELEC announcements;
- PSA population;
- PSA provincial product accounts;
- COA annual reports;
- Makati official publications;
- Makati Action Center Citizen’s Charter.

This does not mean all of those sources can automatically create civic-time
records.

Several are deliberately marked manual/release-metadata/item-match required.

## Candidate queue

New generated artifacts:

- `data/civic-time-candidate-queue.json`;
- `data/civic-time-candidate-queue.md`.

The queue combines:

1. open freshness signals from configured discovery sources; and
2. separately reviewed item-level discoveries.

Current seed state:

- 2 source-review candidates;
- 1 reviewed candidate with a canonical-owner gap;
- 0 ready for projection;
- 0 public eligible.

That last number is intentional.

## Current source signals

### PhilGEPS

The existing freshness queue reports a changed PhilGEPS portal hash.

R4 creates only an internal source-review candidate.

It explicitly does **not** claim:
- what changed;
- that the change concerns Makati;
- that a procurement deadline changed.

Promotion requires an exact Makati procurement record and item-level date.

### MyMakati broadcasts

The social channel remains manual review.

R4 carries it into the candidate queue only as a possible discovery channel for:
- council meetings;
- public hearings;
- consultations;
- barangay assemblies.

A social-platform review signal is never a Calendar record.

## Reviewed COMELEC seed

R4 adds one reviewed official-source discovery:

**2026 Barangay and Sangguniang Kabataan Elections — election day**

Candidate date:
**2 November 2026**

Primary evidence:
COMELEC Resolution No. 11191.

The official 2026 BSKE resolutions index also lists Resolution No. 11266,
promulgated 11 August 2026, as an amendment to the calendar.

For that reason the reviewed discovery remains:

`owner-gap`

not:

`ready-for-projection`.

Before publication:
1. Elections must own a current 2026 BSKE canonical milestone set;
2. the amended COMELEC calendar must be reconciled;
3. the Calendar projection must resolve to the Elections owner.

R4 therefore proves that a current official date can enter the review system
without bypassing the canonical-domain rule.

## Reachability is not change detection

Makati Events, Makati News, COMELEC announcements and several other portals are
currently monitored primarily for reachability.

A successful check only means the source could be reached.

It does not mean:
- no new notice exists;
- no date changed;
- no barangay assembly was added.

Those sources remain discovery surfaces until BetterMakati has an item-level
adapter or completes manual review.

This prevents false confidence from green source-health indicators.

## Statistics and Public Records

R4 registers PSA and COA/publication discovery sources but does not yet create
timeline items from them.

Required evidence remains:

**Statistics**
- actual official release/publication timestamp;
- not observation year;
- not `asOf`;
- not BetterMakati `checkedAt`.

**Public Records / audits**
- item identity;
- source-backed publication/release date or explicit BetterMakati first-seen
  date;
- canonical Public Record ownership.

## Mobility and road closures

MACEA circulars are registered as a scoped advisory discovery source.

A future road-closure candidate requires:
- the exact circular/advisory;
- the affected road/segment/Area;
- effective start/end date or window;
- canonical Mobility/Civic Map owner where available.

No 2026 road closure is fabricated merely because MACEA’s circular archive is
reachable.

## Services

The Makati Action Center Citizen’s Charter remains a durable service source.

A document-content change may create an internal review candidate, but a public
Calendar item requires an explicit:
- deadline;
- new service window;
- temporary interruption;
- effective-date change.

The document’s year/review date is not enough.

## Workflow integration

`build:freshness-queue` now also runs:

`build-civic-time-candidate-queue.mjs`

after the consolidated freshness queue is generated.

Both scheduled source-monitor workflows publish the generated civic-time
candidate JSON/Markdown alongside the existing freshness artifacts when their
normal publish condition is met.

The candidate queue itself does not alter public site content.

## Guard

New build/quality gate:

`check:civic-time-candidates`

It enforces:
- discovery-source configuration;
- allowed candidate statuses;
- explicit temporal evidence for reviewed discoveries;
- canonical reference requirement for `ready-for-projection`;
- the internal/public boundary;
- zero auto-publication;
- workflow publication of generated candidate state;
- COMELEC amendment context for the 2026 BSKE seed.

## Source gaps still open

R4 does not pretend the source problem is solved.

Still needed:
- item-level Makati Events/News extraction;
- structured barangay official notice coverage;
- authoritative temporary road/route advisory items;
- current Elections canonical milestone records;
- Statistics release metadata;
- Public Records first-seen/published metadata.

## Next micro-step

**W5-7R5 — Makati Calendar UI and selectors.**

The first public Calendar should render only:
- existing native R3 timeline projections; and
- future R4 discoveries after they become canonically owned and
  ready-for-projection.

The UI should have:
- Now & Next;
- Recently Published;
- Archive.

Do not render the internal candidate queue as public civic information.
