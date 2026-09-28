# W5-7R6c — Civic-time coverage reconciliation and closure

Reviewed: 2026-09-28

## Status

**Closed at repository level, with deployment verification deferred.**

The Makati Calendar is now a cross-domain civic-time index rather than an
entertainment calendar or a second record system.

## Freshness correction found during closure

The closure audit caught a material election-data change after the previous
September 24 review.

Republic Act No. 12326 was signed on September 24, 2026. The next regular
Barangay and Sangguniang Kabataan Elections are now set for the **second Monday
of November 2028**. The normalized calendar date is **November 13, 2028**.

The previous November 2, 2026 election schedule, certificate-of-candidacy
window, campaign period and transition date are retained as **superseded**
history rather than silently deleted.

## Public election behavior

Elections & Voting now:
- shows November 13, 2028 as the next regular BSKE;
- links the current law update;
- displays the 2028 civic-time preview;
- keeps a collapsible superseded 2026 schedule;
- no longer says that a 2026 COC filing period is operative;
- waits for authoritative COMELEC 2028 candidate records before creating a
  Makati candidate directory.

## Calendar election behavior

The native Civic Timeline now includes:
- the September 24, 2026 law-signing occurrence;
- four superseded 2026 schedule milestones for traceability;
- the November 13, 2028 next regular BSKE.

The old schedule cannot appear in Now & Next because superseded items are forced
to Archive by the Calendar selector.

## Coverage matrix

### Ready

- Legislation — dated lifecycle and session evidence.
- Council / City Monitor — source-backed sessions and direct civic records.
- Accountability — exact procurement bid-result dates.
- Elections — historical election days plus the reconciled current schedule.
- Reports — explicit BetterMakati publication dates.

### Deferred

- Statistics — observation years and as-of dates are not publication dates.
- Public Records — period labels and source-monitor timestamps are not release
  dates.
- Services — `lastVerified` is maintenance metadata, not a service deadline or
  effective date.
- Mobility — route review/lifecycle metadata is not a universal effective-date
  contract. Road closures and similar dated advisories remain City
  Monitor-owned when source-backed.

These exclusions are intentional. Symmetry is not a reason to invent civic
dates.

## Product invariants

1. The Calendar is an index; canonical domain pages remain the owners.
2. Verification/review/as-of fields cannot become public timeline dates.
3. Superseded civic schedules remain traceable.
4. Internal candidate/freshness queues stay out of public Calendar data.
5. What’s On remains retired; `/whats-on` exists only as a compatibility
   redirect to `/calendar`.

## Search and distribution

Current election milestones use the existing Elections & Voting Search identity,
so civic-date terms enrich the canonical result rather than creating another
public destination.

Today, BetterBarangay, Legislation, Accountability, Reports and Elections now
reuse the shared Calendar selectors/components.

## Guard

New gate:

`check:wave5-civic-time-closure`

It protects the coverage matrix, election correction, canonical route,
deferred-domain boundary and retired What’s On surface.

## Deployment

Repository closure does not imply production closure. A fresh Vercel deployment
and browser pass remain required when deployment capacity is available.
