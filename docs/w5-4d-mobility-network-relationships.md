# W5-4d — Mobility network relationships

Reviewed: 2026-09-27

## Status

**Complete.**

BetterMakati now has a canonical mobility-network layer connecting:
- mobility systems/services;
- physical transport Places;
- current bus/UV route records;
- canonical Areas;
- source-backed transfer opportunities.

The network layer does not carry geometry.

## Relationship model

Supported node types:
- service
- route
- place
- area

Supported relationship kinds:
- `service-serves-place`
- `service-related-area`
- `route-uses-terminal`
- `service-connected-hub`
- `transfer`

Relationships cite sources from the existing mobility-system registry, mobility-route registry, or a small network-specific source registry.

## Derived canonical relationships

### Service → Place — 11

Derived from the four canonical mobility services:

- MRT-3 → 4 Makati stations
- EDSA Busway → 3 Makati stations
- Pasig River Ferry Service → 2 Makati stations
- Century City Shuttle → MRT-3 Buendia + One Ayala Terminal

These are not retyped station lists. They are generated from the system/service registry.

### Service → Area — 1

- Century City Shuttle → Century City

The network carries this only because the canonical service provenance directly supports the Area relationship. Proximity alone is not sufficient.

### Current route → terminal — 29

Every current-only bus/UV route promoted in W5-4c4 is linked to:

- `one-ayala-terminal`

The relationship inherits the route’s two-source current evidence.

It does not imply:
- a fixed gate;
- timetable;
- fare;
- operator;
- full stop sequence;
- route geometry.

## Explicit intermodal relationships — 7

### Service ↔ One Ayala hub — 2

- MRT-3 → One Ayala Terminal
- EDSA Busway → One Ayala Terminal

Ayala Land’s first-party One Ayala material documents the mall/terminal’s MRT Ayala connection and EDSA Carousel/city-bus role.

### Transfer relationships — 5

1. MRT-3 Ayala ↔ One Ayala Terminal
2. EDSA Busway Ayala ↔ One Ayala Terminal
3. MRT-3 Ayala ↔ EDSA Busway Ayala
4. MRT-3 Buendia ↔ EDSA Busway Buendia
5. MRT-3 Guadalupe ↔ EDSA Busway Guadalupe

The Ayala transfer is represented through the documented One Ayala intermodal connection.

For Buendia, government reporting explicitly describes the Busway station as connected to the MRT-3 facility.

For Guadalupe, DOTr/PIA identifies MRT-3 Guadalupe among stations near EDSA Bus Carousel pick-up/drop-off points. BetterMakati therefore records a transfer opportunity without claiming a shared concourse.

## Relationship count

Current network total:

- 11 service → Place
- 1 service → Area
- 29 current route → terminal
- 2 service → One Ayala hub
- 5 transfer
- **48 canonical network relationships**

## Important non-claims

### No Magallanes MRT ↔ Busway transfer

BetterMakati does not create a Magallanes Busway transfer until an operating canonical Busway station exists.

### No duplicate EDSA Carousel route identity

EDSA Carousel remains represented by the canonical EDSA Busway system. One Ayala connectivity is represented through network relationships rather than a duplicate route record.

### No geometry

Network edges describe verified relationships, not route shape.

They contain no:
- lat/lng;
- centroid;
- polyline;
- geometry artifact.

Route geometry remains a separate workstream.

### No ferry-area inference

The ferry system is connected to its two verified Makati station Places.

No Area relationship is invented for those stations merely from proximity.

## Runtime safeguards

The validator checks:
- unique relationship IDs;
- existence of all service/route/place/area nodes;
- existence of every cited source in the correct source registry;
- correct node types for service/place, route/terminal and transfer relationships;
- no duplicate symmetric transfer pairs;
- direct/corroborated evidence for service → Area relationships.

The dedicated `check:mobility-network` audit additionally guards:
- all expected transfer IDs;
- 29 One Ayala current-route relationships;
- the 48-relationship total;
- no Magallanes Busway transfer;
- no network geometry;
- canonical One Ayala, MRT and Busway Place IDs.

It runs in both `build` and `quality`.

## Next micro-step

**W5-4e — repository-owned route geometry architecture.**

Build a real polyline artifact model before drawing routes on the Civic Map.

Start with fixed, strongly sourced transport alignments and historical GIS crosswalks. Do not start by drawing the most volatile jeepney/bus routes, and do not infer polylines from endpoint names alone.
