# W5-7R1 — Civic Timeline temporal ownership and source matrix

Reviewed: 2026-09-28

## Status

**Complete. No public UI changes.**

W5-7R1 maps which existing BetterMakati domain owns each kind of civic date,
which existing fields can safely become Civic Timeline projections, and which
date-like fields must **not** be treated as civic occurrences.

The structured source of truth is:

`data/wave5-civic-time-ownership-matrix.json`

## Core ownership rule

The Civic Timeline will be a **projection layer**, not a new canonical civic
database.

A timeline item must resolve back to the domain that owns the underlying fact.

Examples:

| Timeline item | Canonical owner |
| --- | --- |
| ordinance signed / published / effective | Legislation |
| council session / public hearing | City Monitor + Legislation session evidence |
| voter registration deadline | Elections |
| procurement bid / submission milestone | Accountability / Projects & Budget |
| new BetterMakati report | Reports & Insights |
| official statistics release | Statistics |
| newly catalogued audit/public record | Public Records |
| temporary service deadline/change | Services |
| barangay assembly | BetterBarangay |
| road closure / route disruption | Mobility / Civic Map |

The calendar must never create a second ordinance, project, dataset, service or
barangay notice merely to put it on a date axis.

## The most important finding: not every date is a timeline date

The audit found four materially different classes of date-like metadata already
in the repository.

### Directly useful public time

These can become timeline items when source-backed:

- occurrence/session dates;
- deadlines;
- effective/start/end dates;
- true publication/release dates;
- sufficiently precise source-backed target milestones.

### Observation periods

Statistics already carry strong period models such as year, census year,
quarter, date, as-of and range.

Those describe **when the statistic applies**.

They do **not** say when the dataset was released.

Therefore a 2024 population observation must not generate a “published in
2024” timeline entry.

### Source period labels

Public Records and several fiscal/procurement sources carry labels such as:

- 2025;
- Q2 2025;
- Current;
- 2025–2026.

Those are useful descriptive metadata but cannot stand in for a publication
timestamp or deadline.

### Verification/review dates

Fields such as:

- `checkedOn`;
- `lastVerified`;
- `reviewedOn`;
- `reconciledOn`;
- mobility `statusAsOf`;

are repository maintenance/provenance metadata.

They must never appear as “what happened in Makati” simply because they are
dates.

This distinction is now locked into the ownership matrix.

## Domain assessment

### Legislation — strongest native source

**Readiness: native-ready**

`LocalLegislationRecord` already has a real lifecycle:

- filed/introduced;
- referred/calendared;
- committee consideration;
- readings;
- deliberation;
- council approval;
- transmittal;
- mayoral action;
- publication;
- effectivity;
- implementation;
- amendment/repeal.

Lifecycle events have optional explicit dates and source IDs.

The same record also has `sessionEvidence[].sessionDate` with session types
including committee hearing and public hearing.

This is almost exactly the temporal structure the Calendar needs.

Rule:
only lifecycle/session entries with explicit sourced dates project.

`revision.lastReviewed` does not.

### City Monitor — broad discovery pipeline, mixed semantics

**Readiness: partial-native**

`CityMonitorRecord` already has:

- a date;
- type;
- status;
- canonical related link;
- optional barangay;
- optional Place IDs;
- source metadata.

Its types already cover council sessions, legislation, executive speech,
procurement, projects, publications, consultations and official notices.

However, `date` currently means different things depending on record type.
W5-7R2 must require a declared temporal semantic before projecting it.

City Monitor is also the most important discovery pipeline because the daily
workflow already watches nine official/public streams.

But source monitoring today often proves only:
- page reachable;
- page changed;
- page hash changed.

That is not enough to publish a timeline item.

The pipeline must remain:

**source change → candidate → item-level evidence/review → canonical owner →
timeline projection**

not:

**source change → public calendar**

### Council sessions

**Readiness: native-ready with incomplete coverage**

Council session seeds already carry:
- exact session date;
- session type;
- recording discovery state;
- transcript state.

This supports meeting/public-hearing projections.

The known limitation remains important: the current official video index is not
yet proven to be a complete legislative calendar.

Transcript generation/review timestamps are processing metadata and are
excluded.

### Elections

**Readiness: historical/archive ready; future calendar gap**

Election History has exact `electionDate` values.

Those can populate historical civic-time archive entries.

The current Elections data does **not** yet own a structured future milestone
calendar for:
- voter registration;
- election-day deadlines;
- other COMELEC dates.

Public Records has relevant election-rule sources, but its `period` field is
not sufficient to manufacture deadlines.

A current COMELEC calendar/milestone source is therefore an R4 source gap.

### Accountability / Projects / Procurement

**Readiness: partial-native**

Selected procurement seeds have exact `bidDate`.

Accountability entries can also carry:
- `targetDate`;
- later `publicEvidence.date`;
- project/accountability status.

This is enough for a bounded native pilot.

But many target dates are broad values such as “Q1 2024”. Those should not
become exact calendar deadlines.

Also, procurement linkage after award remains incomplete for many records:
contract, notice to proceed, implementation and completion are not yet one
continuous canonical chain.

### Reports & Insights

**Readiness: partial-native**

Reports have:
- stable slug;
- canonical URL;
- top-level `date`.

Before automatic projection, R2 must formally define that top-level date as the
**BetterMakati report publication/release date**.

A source’s `publishedOrPeriod` is not the BetterMakati report’s publication
date.

### Statistics

**Readiness: source-release gap**

Statistics has excellent temporal metadata for observations, including:
- year;
- census year;
- fiscal year;
- quarter;
- month;
- date;
- as-of;
- range;
- current.

That makes it a strong statistics system but **not yet a release-log system**.

To support “new statistics published”, Statistics needs a distinct official
dataset release/publication timestamp or a BetterMakati incorporation date.

`source.checkedAt` is not that timestamp.

### Public Records

**Readiness: catalogue-date gap**

Public Records already has:
- stable IDs;
- publisher;
- source class;
- source URL;
- category;
- canonical contexts.

But `period` describes the document/data period.

It does not tell us:
- when the source published it;
- when BetterMakati first discovered/catalogued it.

R2/R3 should not project Public Records until at least one of those fields is
made explicit.

### Services

**Readiness: source discovery required**

Service Directory has excellent canonical service IDs but no generic structured
deadline/effective-date fields.

This is desirable: durable guidance should remain durable.

Future Calendar dates should come from item-level official notices for:
- renewal/application windows;
- registration deadlines;
- temporary interruptions;
- rule/effective-date changes.

Generic wording such as “annual renewal” is not a calendar date.

### BetterBarangay

**Readiness: source discovery required**

All 23 barangays have stable canonical slugs.

That gives us excellent future geographic projection for:
- barangay assemblies;
- local hearings;
- localized service schedules;
- local advisories;
- published notices.

But these dated occurrences are not structured today.

`officials.lastVerified`, term labels and prose availability fields do not
qualify.

Barangay notice/assembly source coverage is therefore a major R4 opportunity.

### Mobility / Civic Map

**Readiness: source discovery required**

Mobility already owns:
- services;
- routes;
- stations;
- canonical Places;
- some line geometry;
- Areas.

This is ideal for projecting temporary road/transport impacts once sourced.

However, existing:
- lifecycle `statusAsOf`;
- route `reviewedOn`;
- route `reconciledOn`;
- source `checkedOn`;

are verification dates.

They must not be interpreted as dates when a transport change happened.

Road closures and service disruptions therefore require a new official
advisory/item layer.

## City Monitor source-stream assessment

The nine monitored source streams are useful but differ sharply in what they
can produce.

| Source | Current monitor mode | Civic-time potential | Current limitation |
| --- | --- | --- | --- |
| Makati resolutions & ordinances | Reachability | legislation/publication | page availability does not identify a new measure/lifecycle date |
| Mayor’s speeches | Reachability | selected publication | should not become a high-volume speech feed |
| Council videos | Reachability | meeting/public hearing | needs stable item evidence and completeness work |
| MyMakati broadcasts | Manual review | meeting/hearing discovery | social post is discovery/evidence, not automatic publication |
| Makati Events | Reachability | consultation/hearing/assembly/deadline | needs civic-vs-entertainment classification |
| Makati News | Reachability | advisory/service change/road closure | needs item extraction and canonical routing |
| Full disclosure | Reachability | procurement/publication | exact item + milestone required |
| PhilGEPS | Content hash | procurement/deadline | hash change is not an exact Makati match |
| Makati publications | Reachability | publication/statistics/audit | item identity + release date required |

This confirms that the existing monitoring infrastructure is useful, but the
missing layer is **candidate extraction and canonical promotion**, not another
generic scraper.

## R3 native pilot: what we can project without new scraping

W5-7R3 should initially use only existing canonical data.

Eligible first projections:

1. **Legislation**
   - explicit dated lifecycle rows;
   - explicit dated session evidence.

2. **Council sessions**
   - session seeds with explicit dates;
   - deduplicate against legislation/session relationships.

3. **City Monitor**
   - dated records whose temporal semantic is known;
   - use only when a stronger canonical owner does not already represent the
     occurrence.

4. **Accountability / Procurement**
   - exact bid dates;
   - exact source-backed project/commitment milestones.

5. **Elections**
   - historical election-day entries for Archive only.

6. **Reports**
   - only after R2 defines report `date` as a publication date.

Not eligible yet:

- Statistics observation periods;
- Public Records periods;
- Services;
- Barangay notices;
- Mobility verification dates.

That gives R3 a deliberately conservative pilot and prevents us from producing
a large but semantically false calendar.

## Priority source gaps for R4

### High

**COMELEC current calendar**
Needed for voter registration and election milestones.

**Barangay dated notices**
Needed for assemblies, local hearings, service schedules and barangay
advisories.

**Mobility temporary advisories**
Needed for road closures, route/service changes and reopening windows.

### Medium

**Statistics release metadata**
Needed to distinguish dataset release from observation period.

**Public Record first-seen/published metadata**
Needed for a truthful “Recently Published” log.

**Service deadline notices**
Needed for renewal windows, application deadlines and temporary service
changes.

## Do-not-duplicate rules

W5-7R2 must enforce these rules.

1. A timeline item has one canonical owner.
2. City Monitor may supply evidence for a Legislation/Procurement/etc. item
   without becoming a second public identity.
3. A Public Record source supporting a canonical domain record does not create a
   second timeline item unless the publication of that record is itself the
   civic occurrence being logged.
4. Statistics observation dates do not become publication items.
5. Verification/check dates never become public timeline items.
6. A broad target such as a quarter/year must not be rendered as an exact
   deadline.
7. Barangay or geographic proximity must not be inferred from weak text.
8. Source-change signals remain internal review candidates until item-level
   evidence exists.

## What this changes in the roadmap

The earlier generic event model is now formally frozen as a prototype.

Do not add more entertainment/event records.

R2 should create the Civic Timeline schema first, migrate only reusable:
- Manila-time helpers;
- expiry/current/archive concepts;
- cancellation/postponement handling;
- conservative duplicate-candidate thinking.

Then the generic event registry/checks can be removed once no downstream code
depends on them.

## Next micro-step

**W5-7R2 — Civic Timeline schema and projection contract.**

Build the projection model around:
- canonical owner/ref;
- declared temporal semantic;
- date precision;
- geographic scope;
- actionability;
- provenance;
- lifecycle/update state.

R2 must also make it structurally impossible to project review/check dates or
statistics observation periods as public civic occurrences.
