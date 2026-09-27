# W5-4c3 — Bus, UV Express, and tricycle/TODA evidence-gap reconciliation

Reviewed: 2026-09-27

## Status

**Research pass complete.**

This step did not create route geometry or promote unsupported tricycle/TODA records.

Structured reconciliation:
- `data/wave5-mobility-bus-uv-tricycle-reconciliation.json`

## Bus routes

The strongest current Makati terminal-level roster found is the **One Ayala route list as of 2 April 2026**, published by SPOT.ph from current terminal information.

It contains **18 bus entries**:

### City / intercity bus — 8

- EDSA Carousel (Southbound)
- Sta. Rosa / Balibago
- Biñan
- Pacita
- Alabang
- Sucat
- Bicutan
- FTI

### P2P — 10

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

**Disposition:** current-route candidates, not yet canonical route records.

Why not promote immediately:
- the roster is current and credible, but the reviewed route-level evidence is secondary rather than a complete first-party/operator feed;
- schedules, gates, fares and intermediate stops are volatile;
- EDSA Carousel already has a canonical system identity and must not be duplicated as a second system.

The separate Makati DEPW **32-bus-stop** headline remains a different unresolved dataset. It is not a bus-route denominator.

## UV Express

The same current One Ayala roster provides **12 UV Express entries**:

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

**Disposition:** current-route candidates, not yet canonical route records.

These are strong enough to preserve as current evidence, but not to freeze schedule/fare/gate data. The next route-schema step should support current-only route records with an explicit evidence class instead of pretending every route originated in a historical city inventory.

## Tricycle / TODA

The tricycle gap is now much clearer.

### What is authoritative

The City Government’s Citizen’s Charter shows that:

- **Makati Franchising Regulatory Board (MFRB)** handles Tricycle for Hire Operator’s Permit / franchise renewal;
- the process requires **TODA certification of membership**;
- it also requires **Makati Tricycle Federation (MATRIFED) certification**.

Makati’s Traffic Management Code further treats tricycle permissions as **routes or areas of operations**, and provides that:

- tricycles are not permitted on national roads;
- route/service-area revisions should consider traffic-safety recommendations;
- tricycles/pedicabs should not operate along bus or jeepney routes;
- where no off-street terminal exists, unit numbers may be restricted to control congestion.

That means the correct canonical object is **not “tricycles in Barangay X.”** It is a sourced TODA / service-area / terminal relationship.

### What is still missing

No current public **MFRB/MATRIFED roster of TODAs, legal service areas, or official terminal locations** was resolved in this pass.

A current route-feed reference does show a **Tricycle Terminal on Sandico Street** in Makati, last updated 19 September 2026. That is useful field/reference evidence but still lacks:
- current TODA identity;
- legal service area;
- city/MFRB terminal confirmation.

Therefore it remains **reference-only, not canonical**.

### Evidence explicitly excluded

A detailed historical tricycle route-planning case study exists for **Barangay Rizal**, with multiple TODAs and terminal locations.

Do **not** use it for current BetterMakati coverage: Barangay Rizal is one of the transferred EMBO barangays and is no longer part of present-day Makati.

## Useful geometry discovery

The official Makati GIS still exposes the historical **Makati Going Around Lines** service.

Polyline layers include:
- E-Jeepneys
- Jeepney Routes
- Bus Rapit Transits

The bus layer includes historical labels such as:
- Blue Line (Poblacion Line)
- Green Line (Taguig Line)
- Orange Line (Airport Link)
- Red Line (Ayala)
- The Fort Bus
- Yellow Line (MCBD-BGC)

This is valuable for future route-geometry lineage, but it is a **2013-era map service**. It must not be treated as proof that those routes operate in 2026.

## W5-4c3 result

Current evidence now distinguishes three cases cleanly:

1. **Jeepney** — 38-route historical/current reconciliation already migrated in W5-4c2.
2. **Bus + UV Express** — current One Ayala route candidates now frozen as evidence, pending a current-only canonical route model/source-policy check.
3. **Tricycle/TODA** — governance and route/service-area rules are sourced, but the current official roster remains unresolved.

No fake points or polylines were added.

## Next micro-step

**W5-4c4 — generalize the route schema for current-only bus/UV services and promote only the candidates that pass evidence-policy checks.**

Tricycle/TODA stays on hold until BetterMakati resolves a current MFRB/MATRIFED roster, city ordinance/franchise records, or equivalent official service-area evidence.
