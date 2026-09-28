# W5-7R6b — Civic time in canonical domains and Search

Reviewed: 2026-09-28

## Status

**Complete at repository level.**

R6b distributes the Civic Timeline into canonical domains that already own
native timeline projections and makes those dates searchable without creating a
second civic-record identity.

## Domain preview

`src/components/civic/CivicDomainTimelinePreview.tsx` filters the native Civic
Timeline by canonical owner and reuses the R5 view selectors.

The ordering is:
1. Now & Next;
2. Recently Published;
3. Archive.

Every card returns to the canonical domain record.

## Canonical pages

**Legislation** now surfaces dated lifecycle/session milestones.

**Accountability** surfaces exact source-backed procurement/project dates.
Broad reporting periods and verification dates remain excluded.

**Reports & Insights** surfaces BetterMakati report publication dates in the
same Recently Published semantics used by the Calendar.

## Intentional exclusions

Statistics and Public Records still lack distinct release/publication metadata
for automatic timeline projection. Observation periods and source-review dates
are not substituted.

The Elections page remains canonical for current voter dates and rules while
the current-election milestone projection contract is reconciled. Historical
election-day projections remain in the Calendar Archive.

## Search without duplicate ownership

Search groups timeline items by canonical owner/reference.

Existing canonical Search identities keep their title, description and
destination; Civic Timeline dates and milestone language are merged into their
keywords.

When no canonical Search identity exists, one searchable result is added, but
it still links to the canonical owner rather than to a duplicate timeline
record.

This enables date, deadline, council-session, procurement-milestone and
publication searches to find the underlying civic record.

## Boundary

Domain previews and Search use only `nativeCivicTimelineItems`.

They do not import the candidate queue, reviewed discoveries or freshness-review
queue.

## Guard

The existing `check:civic-time-distribution` gate now covers both R6a and R6b.

## Next micro-step

**W5-7R6c — coverage-gap reconciliation and closure.**

Audit Statistics, Public Records, Services, Mobility and Elections for
canonical release/effective-date readiness. Add only domains whose date
semantics are now sufficient, then run the cross-site orphan-link and
terminology closure pass.
