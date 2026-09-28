# W5-7R6a — Civic time in Today and BetterBarangay

Reviewed: 2026-09-28

## Status

**Complete at repository level.**

R6 is being delivered in bounded batches so the Calendar does not become a
large cross-site rewrite.

R6a distributes canonical civic time into the two surfaces where date context
is most immediately useful:

- Today in Makati;
- every BetterBarangay homepage.

## Shared preview

New component:

`src/components/civic/CivicTimelinePreview.tsx`

It reads only `nativeCivicTimelineItems` and reuses the R5 selector layer.

The preview has two compact sections:

- **Now & Next**
- **Recently Published**

Each card links to the canonical owner record rather than copying the full
underlying record.

A full-calendar link preserves the barangay filter where applicable.

## Barangay semantics

A BetterBarangay preview includes:

1. records explicitly scoped to that barangay, shown first;
2. citywide records that also apply across Makati.

It does not infer a barangay relationship from text.

If no canonical upcoming record exists, the component says so rather than
filling the gap with unverified notices.

## Today in Makati

Today now places the canonical Calendar preview directly after current
conditions.

When the user selects a barangay, the preview follows that same barangay scope.

The old What’s On/event card has been removed. The adjacent section is now
limited to advisories/utilities and hotlines because civic dates are handled by
the canonical Calendar preview above it.

## Candidate boundary

The shared preview does not import:

- the civic-time candidate queue;
- reviewed discoveries;
- freshness-review signals.

Only canonical R3/R5 timeline items can appear.

## Guard

New build/quality gate:

`check:civic-time-distribution`

It protects:
- selector reuse;
- barangay scope;
- Today integration;
- BetterBarangay integration;
- removal of retired What’s On framing;
- internal-candidate exclusion.

## Next micro-step

**W5-7R6b — canonical domain distribution.**

Add owner-specific Calendar previews or contextual links to:
- Legislation;
- Accountability;
- Reports;
- Statistics;
- Public Records;
- Elections once current canonical election milestones exist.

Then add timeline-item discovery to Search without duplicating canonical
ownership.
