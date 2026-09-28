# W5-4g — Mobility QA and closure

Reviewed: 2026-09-28

## Status

**Closed at repository level with explicit evidence bounds. Fresh deployment and
live-browser verification remain unverified.**

## QA result

The W5-4 mobility stack now closes around one canonical architecture:

- four current system/service records;
- 67 route/corridor records;
- 48 source-backed network relationships;
- two sourced fixed-system alignment artifacts;
- four reviewed external app-based mobility handoffs;
- one rebuilt Getting Around page;
- Search/Civic Intelligence and Civic Map integration.

The closure guard checks those layers together rather than treating their
individual component checks as sufficient.

## Repository counts at closure

- 4 mobility systems/services: 3 public, 1 private-estate shuttle;
- 38 historical/reconciled jeepney rows;
- 35 current/successor jeepney corridors;
- 3 unresolved historical jeepney rows;
- 29 current One Ayala bus/P2P/UV routes;
- 67 total canonical route records;
- 48 mobility-network relationships;
- 5 explicit physical transfers;
- 2 explicit service-to-One-Ayala hub connections;
- 2 published alignment artifacts: MRT-3 and EDSA Busway;
- 4 reviewed external ride-hailing/app-based mobility resources.

## QA correction: external ride-hailing handoffs

The closure audit found one remaining architectural inconsistency: Grab, Angkas,
JoyRide and MOVE IT were still a page-local `rideApps` array even though W5-4b
had already reconciled their current first-party sources.

They now live in `mobilityExternalResources.ts`.

They remain **external resources**, not civic Places, public-transport systems or
Civic Map entities. Each record retains first-party source URLs and an explicit
volatility note so fare, availability and service coverage are not frozen into
BetterMakati.

## Preserved boundaries

W5-4 does not claim completeness where the source base does not support it.

The following remain intentionally bounded:

- tricycle/TODA routes, terminals and service areas: no sufficiently
  authoritative current roster was found;
- the DEPW 2023 headline count of 32 bus stops: no stable named/location roster
  was established;
- geometry for the 67 jeepney/bus/P2P/UV route records: none is drawn until a
  defensible repository-owned polyline exists;
- fares, timetables, gates, operators and live availability: left to current
  operator/service sources where volatile.

Legacy/suspended PNR and future NSCR records are not reintroduced into the
default current-operating Mobility presentation.

## Duplicate/stale-content audit

Closure keeps the following removals in force:

- no hand-maintained `transitLinks` system list;
- no page-local `rideApps` list;
- no EDSA Busway authority claim based on `edsabus.com`;
- no external-only One Ayala Google Maps card;
- no invented Magallanes MRT ↔ Busway transfer;
- no route geometry reconstructed from endpoints, station names or historical
  route rows.

## Cross-surface audit

The Getting Around page consumes canonical systems, routes and network
relationships. Search indexes canonical system, route and interchange records
with stable keys. Civic Map renders only repository-owned geometry artifacts
and leaves geometry-less routes undrawn.

Existing mobility component guards and the new closure guard run in both
`build` and `quality`.

## Deployment verification

The latest Vercel deployment is still reporting failure. Current connector
access is not authorized to read the BetterMakati team deployment/build logs, so
this closure does **not** claim a successful fresh deployment or live-browser
pass.

The failure is not attributed to W5-4 without build-log evidence.

## Reopen only for a named capability

Future mobility work should reopen W5-4 only when there is stronger evidence or
a concrete new capability, such as:

- an authoritative current tricycle/TODA roster;
- a named official roster for the DEPW bus-stop denominator;
- another defensible route/alignment geometry artifact;
- fresh deployment and live-browser verification.

The next Wave 5 work can proceed without inventing data to fill these bounded
gaps.
