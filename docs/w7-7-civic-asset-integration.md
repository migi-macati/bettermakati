# W7-7 — Place and civic-asset integration polish

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Polish the civic registry so places, bounded infrastructure segments and transport/service routes read as different civic objects while continuing to support orientation, reporting, history and discovery.

## Changes

- Place cards retain the strongest destination treatment, with a restrained gold identity rule.
- Segment cards use a flatter infrastructure treatment that emphasizes bounded physical corridors rather than destination-like places.
- Route cards use a distinct dashed network treatment so a route cannot be mistaken for a building, park or street segment.
- Every result now names its object form directly: Destination, Bounded infrastructure, or Network / service route.
- Existing barangay, reporting, source, heritage, history and accountability relationships remain intact.

## Preserved

- Canonical Place Registry IDs and verification rules.
- Existing place/segment/route filters and subtype filters.
- Barangay scope and Near Me behavior.
- Civic reporting, observations and community records.
- Heritage, History and accountability handoffs.
- Responsive grids, keyboard semantics and 44px interaction targets.

## Guard

`check:wave7-civic-assets` verifies the three visual treatments and object-form labels.

## Next

Once this commit passes CI, **W7-7 is complete** and the next slice is **W7-8 — Site-wide visual consistency and responsive QA**.
