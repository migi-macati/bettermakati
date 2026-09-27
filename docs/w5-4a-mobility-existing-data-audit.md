# W5-4a — Mobility existing-data audit

Reviewed: 2026-09-27

## Scope

Inventory the mobility / public-transport information already present in BetterMakati before adding new routes, stops, operators or journey tools.

This is an **internal reconciliation step**. It does not promote new transport claims merely because an older Wave 3 research file mentions them.

## Current public-transport objects

The canonical Place Registry currently exposes **10 verified current transport Places**:

### MRT-3 — 4 stations

1. `mrt3-guadalupe` — MRT-3 Guadalupe Station
2. `mrt3-buendia` — MRT-3 Buendia Station
3. `mrt3-ayala` — MRT-3 Ayala Station
4. `mrt3-magallanes` — MRT-3 Magallanes Station

All four are current mapped `transport-stop` records sourced to DOTr MRT-3 with separate reference-map coordinates.

### EDSA Busway — 3 stations

1. `edsa-busway-guadalupe`
2. `edsa-busway-buendia`
3. `edsa-busway-ayala`

These are current mapped `transport-stop` records with operating-service evidence and mode-specific platform geometry.

### Pasig River Ferry — 2 stations

1. `pasig-ferry-guadalupe`
2. `pasig-ferry-valenzuela`

Both are current mapped `transport-stop` records.

### Intermodal terminal — 1

1. `one-ayala-terminal`

One Ayala is a mapped `transport-terminal` and already carries tags for P2P, city bus, UV Express, jeepney and MRT-3 transfer.

## Existing Wave 3 transport research

The September 25 Wave 3 transport work already did substantial source reconciliation. It should be reused rather than repeated.

### Current named sets already closed

- 4 MRT-3 Makati stations
- 3 EDSA Busway Makati stations
- 2 Pasig River Ferry Makati stations
- 1 One Ayala intermodal terminal

The Wave 3 completeness audit considered the current named/mappable set complete for those families.

### Bus-stop denominator still unresolved

Makati DEPW material established a **2023 headline count of 32 bus stops**, but the reviewed official material did not provide a stable 32-stop name/location roster.

Therefore:
- no 32-stop list is canonical;
- EDSA Busway stations are not silently counted as DEPW bus stops;
- One Ayala is not silently counted as one of the 32;
- the older 36-waiting-shed inventory is lineage evidence only.

### Jeepney routes

Wave 3 reconciled **38 historical published route rows** from a city source.

Disposition at closure:
- 35 had current or successor-corridor evidence;
- 3 had no exact current route match:
  - Washington–Mantrade
  - Mantrade–Pasong Tamo Extension
  - Kalayaan–PICC
- zero route geometries were promoted;
- zero historical association/operator acronyms were assumed current merely from corridor continuity.

This work remains useful evidence, but it is **not yet a canonical current route registry**.

### PNR / NSCR lifecycle

Wave 3 correctly separated:
- legacy PNR Dela Rosa
- legacy PNR Pasay Road
- legacy PNR EDSA

from future NSCR:
- Buendia
- EDSA

The PNR stations are suspended/legacy and must not re-enter the default current-operating layer.

Future NSCR stations must not be presented as open service or silently aliased one-to-one to the old PNR stations.

## Current Mobility page

`src/pages/Mobility.tsx` currently contains five different kinds of mobility information.

### 1. Trip planner handoff

A destination field plus travel-mode buttons opens Google Maps directions for:
- public transport
- walking
- cycling
- driving

This is a useful live-routing handoff, but BetterMakati itself does not yet understand the route chosen.

### 2. Four top-level transport/service links

Current cards:
- MRT-3
- One Ayala Transport Hub
- EDSA Busway
- Century City E-Bus

The first three correspond to major public/intermodal systems already represented elsewhere in BetterMakati.

Century City E-Bus is a private-estate shuttle/service link and should stay distinct from government/public-system route records unless separately reconciled.

### 3. Canonical transport anchors

The page correctly renders verified `transport-stop` and `transport-terminal` records from the Place Registry rather than maintaining another station list.

This is currently the strongest part of the page architecture.

### 4. Common trips

Four common trip pairs are generated from canonical Area / Barangay references:

- Ayala Center → Poblacion
- Makati CBD → Rockwell Center
- Circuit Makati → Ayala Center
- Makati CBD → NAIA Terminal 3

They hand off to live directions rather than prescribing a possibly stale fixed route.

### 5. Other modes

Current page coverage includes:
- Grab
- Angkas
- JoyRide
- MOVE IT
- generic cycling / bike-parking search
- parking handoff

These are presently convenience links, not canonical mobility entities.

## Architecture findings

### A. Place Registry is ready for transport Places, but not yet for real route geometry

The canonical model already understands:
- `entityKind: 'route'`
- `primaryCategory: 'transport-route'`
- `PlaceGeometry.type: 'route'`

However the legacy `CivicAsset` compatibility layer still requires a single `lat` / `lng` for every record, and the current derived Place geometry only carries an optional opaque `geometryRef`.

So the model can **name** a route but cannot yet safely render a real polyline without either:
- inventing a representative point; or
- introducing a repository-owned route-geometry artifact model.

That is the main technical blocker to canonical jeepney / bus / rail route objects.

### B. Stops and routes are different objects

A station/terminal should remain a Place.

A service alignment should be a Route.

Do not create one point per route just to make routes visible on the Civic Map.

### C. A terminal is not a route inventory

One Ayala proves that multiple modes use the hub. It does not by itself prove every current route, stop sequence, fare, schedule or operator.

### D. Lifecycle must remain explicit

BetterMakati should be able to distinguish:
- operating
- temporarily suspended
- under construction
- future
- closed / historical

This is essential for PNR / NSCR and future transport projects.

### E. Mobility needs a network layer, not more loose cards

The page currently mixes:
- systems
- facilities
- private shuttle links
- ride-hailing apps
- live route handoffs

The next architecture should make the difference visible instead of expanding the card collection.

## Data-quality gaps found

### Current transport assets

**Good**
- current named MRT / Busway / Ferry / One Ayala anchor coverage;
- source-backed identities;
- mode-specific station points;
- Place Registry reuse on the Mobility page.

**Still incomplete**
- some boundary-adjacent stations intentionally have no barangay assigned;
- no explicit transfer relationships between adjacent MRT / Busway / One Ayala nodes;
- no canonical service-system entity for MRT-3, EDSA Busway or Pasig River Ferry;
- no route geometry;
- no canonical stop sequence;
- no fare / schedule model;
- no accessibility / entrance-level model.

### Mobility page

**Good**
- live directions instead of hard-coded trip instructions;
- canonical districts for common trips;
- canonical station/terminal cards.

**Needs reconciliation**
- `LastReviewed` is 2026-09-20 even though the transport research was refreshed on 2026-09-25;
- the top link cards are hand-maintained separately from the canonical transport records;
- the One Ayala top card links to a Google Maps search despite One Ayala already being a canonical BetterMakati Place;
- Pasig River Ferry is absent from the top-level system cards despite having two canonical Makati stations;
- EDSA Busway uses a standalone external route-map link rather than a canonical BetterMakati system/route object;
- Century City E-Bus is mixed visually with public systems without a clear private-estate-service distinction;
- ride-hailing links are uncoupled from a reviewed-source model;
- cycling is only a generic Google Maps search, not Makati infrastructure / route knowledge.

## Duplicate / stale-data risk

The main duplication risk is no longer the station list. That has already been centralized.

The risk now is **system and route information**:

- system names/descriptions are repeated manually on the Mobility page;
- route/corridor evidence lives in Wave 3 JSON research rather than canonical runtime data;
- external route pages can drift independently;
- private shuttle and public-system concepts are presented at the same level;
- lifecycle information is researched but not yet surfaced coherently.

## What W5-4 should build on

Preserve:
- the 10 current canonical transport Places;
- source-first route reconciliation from Wave 3;
- no fake route points;
- lifecycle separation for suspended/future rail;
- live-directions handoff for volatile journey planning;
- Area/Barangay canonical references from W5-3.

Do not:
- create route records from old route names alone;
- infer operator continuity from corridor continuity;
- use a terminal as evidence for an entire route roster;
- clone live Google Maps routing;
- mix private shuttles with regulated public systems without labeling the distinction;
- promote the 32 DEPW bus-stop denominator into 32 invented pins.

## Recommended W5-4 structure after this audit

### W5-4b — current source reconciliation

Refresh only the unstable system-level facts needed for the user-facing Mobility page:
- MRT-3 current service source;
- EDSA Busway current service source;
- Pasig River Ferry current service source;
- One Ayala current transport-hub role;
- Century City E-Bus current status;
- current ride-hailing links shown on the page.

Do not re-research the entire Wave 3 jeepney corpus yet.

### W5-4c — canonical mobility-system model

Introduce a small canonical model for transport systems/services, separate from physical Places:
- system/service identity;
- mode;
- operator/regulator;
- lifecycle;
- official links;
- member stops/terminals;
- route geometry reference only when defensible.

### W5-4d — transfers and network relationships

Connect:
- MRT ↔ EDSA Busway;
- MRT Ayala ↔ One Ayala;
- ferry stations to nearby canonical Places/Areas where directly supported.

### W5-4e — route geometry architecture

Create repository-owned route/polyline artifacts before promoting route objects.

The first candidates should be fixed, strongly sourced systems rather than the most volatile jeepney routes.

### W5-4f — Mobility page rebuild

Render systems, transport anchors, transfers and route information from canonical data.

Keep live external directions for door-to-door routing.

### W5-4g — QA / closure

Audit:
- lifecycle;
- no stale duplicate lists;
- no fake point routes;
- source freshness;
- private/public distinctions;
- search/Civic Intelligence/Civic Map cross-links.

## Next micro-step

**W5-4b — current source reconciliation for the six user-facing mobility families already on the page: MRT-3, EDSA Busway, Pasig River Ferry, One Ayala, Century City E-Bus and ride-hailing.**

Keep the step bounded: verify current identity/service status and official/public-facing links only. Do not yet create route geometries or expand the historical jeepney-route corpus.
