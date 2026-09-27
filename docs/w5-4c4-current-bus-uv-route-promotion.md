# W5-4c4 — Current bus and UV Express route promotion

Reviewed: 2026-09-27

## Status

**Complete.**

The canonical mobility-route model now supports two distinct record kinds:

1. **historical reconciliation** — used by the 38 migrated Makati jeepney rows;
2. **current service** — used for current-only bus and UV Express routes that do not depend on a historical city inventory.

No route geometry is required for either record kind.

## Evidence policy

A current-only route may be canonicalized as:

`current-secondary-corroborated`

only when **two independent, current terminal rosters agree on the route identity**.

For W5-4c4 the corroborating 2026 sources are:

- SPOT.ph — One Ayala routes, 2026 edition, published 22 April 2026;
- WindowSeat.ph — One Ayala Terminal Guide 2026, published 5 May 2026.

Both independently list the same One Ayala P2P, city-bus and UV Express route families used in this promotion.

This evidence class supports the claim:

> this route was being offered from One Ayala in the reviewed 2026 rosters.

It does **not** support automatically freezing:

- operator identity;
- fare;
- schedule;
- gate;
- complete intermediate-stop sequence;
- route geometry.

Those remain live/volatile or require stronger operator/official evidence.

## Promoted current-only routes

### City / intercity bus — 7

- Sta. Rosa / Balibago
- Biñan
- Pacita
- Alabang
- Sucat
- Bicutan
- FTI

### P2P bus — 10

- Calamba
- Fairview
- Sta. Rosa / Nuvali
- Antipolo
- Katipunan
- Imus
- Noveleta
- Las Piñas
- Bacoor
- Cainta

### UV Express — 12

- Suki Market–Mayon
- FTI–Palar Arca South
- Antipolo
- Pacita–Biñan
- Sucat Evacom–Parañaque
- BF El Grande–Parañaque
- BF Resort–Las Piñas
- Molino via Skyway MCX
- Molino via Coastal Road–Ligas
- Imus via Coastal Road
- Russia–Moonwalk
- Bicutan

Total newly canonicalized current-only route records: **29**.

Every record points to the existing canonical `one-ayala-terminal` Place.

## EDSA Carousel treatment

The One Ayala roster also lists **EDSA Carousel (Southbound)**.

W5-4c4 deliberately does **not** add a second current-only route record for it because BetterMakati already has:

- the canonical **EDSA Busway** mobility-system record;
- three canonical Makati Busway station Places.

Direction / system ↔ route membership belongs in W5-4d. Duplicating the system here would create competing identities before that relationship model exists.

## Jeepney migration preserved

The earlier W5-4c2 migration remains unchanged:

- 38 historical rows;
- 35 current/successor corridors;
- 3 unresolved historical rows;
- no historical association/operator continuity claims.

Current-only bus/UV records do not pretend to have a Makati 2020 historical row.

## Tricycle / TODA remains on hold

No tricycle/TODA route or terminal is promoted.

The current canonical data still lacks a sufficiently authoritative MFRB/MATRIFED route/service-area/terminal roster.

The Sandico Street terminal remains reference-only.

## Geometry

All **67** canonical route records are still geometry-less:

- 38 historical/reconciled jeepney rows;
- 17 bus routes;
- 12 UV Express routes.

No:
- fake point;
- representative centroid;
- guessed polyline;
- historical GIS polyline promoted as current geometry.

Route rendering remains a later geometry workstream.

## Runtime safeguards

The route validator now checks:

- unique route IDs;
- source references;
- historical row-number uniqueness;
- historical jeepney evidence/disposition rules;
- current-service mode/class compatibility;
- canonical terminal Place references;
- at least two current terminal-roster sources for `current-secondary-corroborated`;
- no route geometry before the geometry workstream.

The existing `check:mobility-routes` build/quality gate now audits both historical and current-only records.

## Current route inventory after W5-4c4

- 38 jeepney historical/reconciliation records
- 17 current bus records
- 12 current UV Express records
- 0 current tricycle/TODA records
- **67 total canonical mobility-route records**
- **0 route geometry artifacts**

## Next micro-step

**W5-4d — connect mobility systems, current routes, transfers and canonical Places.**

Priority relationships:

- MRT-3 Ayala ↔ One Ayala Terminal
- MRT-3 ↔ EDSA Busway transfers where directly supportable
- EDSA Busway system ↔ its canonical stations
- Pasig River Ferry ↔ its canonical Makati stations
- One Ayala ↔ the 29 current bus/UV route records
- EDSA Busway ↔ the One Ayala/EDSA Carousel relationship without creating a duplicate route identity

Keep relationship claims source-backed and continue avoiding inferred route geometry.
