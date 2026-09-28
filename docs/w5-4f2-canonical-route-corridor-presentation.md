# W5-4f2 — Canonical route and corridor presentation

Reviewed: 2026-09-28

## Status

**Complete.**

The Mobility page now exposes the canonical route registry without creating map
pins or guessed lines for geometry-less routes.

## Route views

The user-facing registry is split into four evidence-aware views:

- **Bus & P2P — 17** current One Ayala routes;
- **UV Express — 12** current One Ayala routes;
- **Jeepney corridors — 35** current/successor corridors reconciled from the
  2020 Makati city inventory;
- **Unresolved — 3** historical city rows whose current status remains
  unverified.

The counts come from canonical route data rather than a second page-level list.

## Current One Ayala routes

The 29 bus/P2P/UV records are rendered from `mobilityRoutes.ts`. Each card
shows the canonical route label, service class, One Ayala terminal link and both
2026 corroborating route-roster sources. Operator, fare, schedule, gate and
complete stop sequence are not frozen from those secondary rosters.

## Jeepney reconciliation

The 35 current/successor corridor records show the historical city
origin/destination labels, current/successor disposition, 2020 city row,
reconciliation note and current evidence links. Historical association labels
remain lineage only and are not presented as verified current operators.

## Unresolved rows

The three unresolved 2020 rows are displayed separately and explicitly not
presented as current services. Their historical city source remains available.

## Geometry rule

All 67 route records remain geometry-less. The Mobility page consumes route
records, not the route-geometry renderer.

## Guard

`check:mobility-page` now also verifies that all four canonical route subsets
are consumed, the registry remains 67 records, all 67 remain geometry-less,
unresolved rows stay visibly separated, and the page does not import
`mobilityRouteGeometryArtifacts`.

## Next micro-step

**W5-4f3 — transfer and network presentation.**

Surface source-backed interchange relationships such as MRT-3 ↔ EDSA Busway
and One Ayala connections from the canonical mobility-network layer, without
inferring transfers from proximity alone.
