# W5-7R2 — Civic Timeline schema and projection contract

Reviewed: 2026-09-28

## Status

**Complete. No public timeline records or Calendar UI are created in R2.**

R2 replaces the generic event architecture with a domain-neutral
`CivicTimelineProjectionInput` contract.

The implementation lives in:

`src/data/civicTimeline.ts`

## The central design

A Civic Timeline item is **not a canonical civic record**.

It is a time-indexed projection of a record owned elsewhere in BetterMakati.

Every projection must therefore contain:

- a stable timeline item ID;
- a civic-time kind;
- a declared temporal semantic;
- a canonical owner/reference;
- source-backed date origin;
- geographic scope;
- actionability;
- provenance;
- lifecycle/update state;
- source references.

A resolver supplies the canonical label and URL.

The projection input does **not** accept an arbitrary canonical href. That is
intentional: the canonical owner resolves its own route, preventing a timeline
record from silently pointing somewhere inconsistent with its owner.

## Canonical owner/reference

The contract currently supports:

- City Monitor record;
- Legislation record;
- Elections record;
- Accountability entry;
- Report;
- Statistics indicator;
- Public Record;
- Service;
- Barangay;
- Mobility service;
- Mobility route;
- Place when used as the canonical mobility/civic-map owner.

R3 will provide concrete owner resolvers as each native projection is added.

## Public temporal semantics

Only five temporal semantics exist in the public projection type:

1. `occurrence`
2. `deadline`
3. `effective-change`
4. `publication-release`
5. `target-milestone`

The following R1 categories are deliberately **absent** from the public
`CivicTimelineTemporal` union:

- observation period;
- source period label;
- verification/review;
- status-as-of.

That prevents a caller from honestly typing one of those maintenance/data
semantics as a public timeline semantic.

## Source-date role

Every temporal value also declares why its source field is a public date:

- occurrence date;
- deadline date;
- effective date;
- publication date;
- target date.

The origin stores:
- source field path(s);
- source IDs.

The validator rejects origin field paths containing known maintenance or
observation fields:

- `checkedOn`;
- `checkedAt`;
- `reviewedOn`;
- `lastReviewed`;
- `lastVerified`;
- `reconciledOn`;
- `statusAsOf`;
- `period`;
- `asOf`.

This is a second line of defense beyond the discriminated temporal union.

R3 projectors should therefore name the actual canonical field they used, for
example:

`lifecycle[2].date`

rather than copying a value without provenance.

## Date precision

The public schema supports only:

- exact local date;
- exact local datetime;
- date range;
- datetime range.

Datetime values must carry an explicit **+08:00** offset.

The schema does not support:
- year-only;
- quarter-only;
- month-only;

as exact public timeline dates.

That means a source-backed target like “Q1 2027” can remain visible in its
canonical domain record but cannot be rendered as an exact Calendar deadline
without a more precise source.

## Civic-time kind vs temporal semantic

The contract validates logical combinations.

Examples:

- deadline → deadline;
- public hearing → occurrence;
- road closure → occurrence or effective change;
- report release → publication release;
- legislation milestone → occurrence, effective change or publication release;
- procurement milestone → occurrence, deadline, target milestone or
  publication release.

This prevents nonsensical combinations such as a report release using an
observation-period semantic.

## Geography

A timeline item is either:

- citywide; or
- explicitly scoped.

A scoped item may reference:
- barangays;
- Areas;
- Places;
- mobility routes;
- civic-map segments.

The scope must state its evidence basis:
- canonical owner;
- source-stated;
- explicit relationship.

A scoped item with no canonical geography identifier is invalid.

R3 will add domain-specific resolvers/validators for these IDs.

## Actionability

The timeline supports four citizen-facing states:

- action required;
- participation opportunity;
- service impact;
- information only.

An optional action can link to:
- application;
- registration;
- comment/feedback;
- attendance;
- payment;
- status lookup;
- original source;
- another explicit action.

This keeps “what can I do?” separate from political/evaluative importance.

## Sources and provenance

Every item requires:
- at least one source;
- exactly identified primary source ID;
- source URL/publisher/class;
- provenance basis;
- verification timestamp.

The verification timestamp remains provenance metadata. It is never used as the
timeline’s public civic date.

## Update/change state

The projection supports:

- new;
- updated;
- rescheduled;
- cancelled;
- postponed;
- superseded.

Rescheduled and superseded entries must identify the prior timeline item.

Cancelled, postponed and superseded change types must match the corresponding
public status.

This creates the base for a later visible revision trail instead of silently
overwriting deadlines or closures.

## Generic event prototype retired

R2 removes the W5-7a–c runtime prototype:

- `src/data/eventRegistry.ts`;
- `src/data/eventLifecycle.ts`;
- `scripts/check-event-registry.mjs`;
- `scripts/check-event-lifecycle.mjs`.

The historical W5-7a–c documentation remains as a decision trail.

The useful concepts have migrated:
- Asia/Manila date handling;
- explicit date precision;
- source-backed provenance;
- status/update handling;
- conservative time semantics.

The obsolete event-specific build gates are removed.

## Guard

A new `check:civic-timeline-schema` gate is wired into both `build` and
`quality`.

It protects:
- the five allowed public temporal semantics;
- exclusion of observation/review/status-as-of semantics;
- canonical owner references;
- source-date origin fields;
- exact Manila datetime requirements;
- geographic scope;
- update/change state;
- removal of the generic event runtime prototype.

## Next micro-step

**W5-7R3 — native Civic Timeline projections.**

Start only with data already owned by BetterMakati:

1. dated Legislation lifecycle/session records;
2. council-session records;
3. semantically safe City Monitor records;
4. exact procurement/accountability dates;
5. historical election dates for Archive;
6. Report releases after formalizing the report date meaning.

Do not ingest new external sources in R3.
