# W5-4f4 — Mobility cross-link and journey pass

Reviewed: 2026-09-28

## Status

**Complete.**

The rebuilt Getting Around page is now connected to the wider BetterMakati
information architecture instead of behaving as a standalone transport page.

## Page journeys

A compact internal navigation strip now takes users directly to:

- stations and terminals;
- verified transfers;
- route registry;
- Civic Map;
- BetterMakati Search for transport.

The existing external live-directions handoff remains the door-to-door routing
tool. BetterMakati does not attempt to reproduce a live journey planner.

## System cross-links

Public-system cards now link to:

- canonical station/terminal records;
- verified transfers when that system participates in an interchange;
- a prefilled BetterMakati search for the system;
- current external service information.

The private Century City Shuttle card additionally links to its canonical
Century City Area page and to BetterMakati Search.

## Route cross-link

The route registry now links directly to Search so the 67 route records can be
found outside the Mobility page as well.

## Search / Civic Intelligence integration

The global static Search index now includes canonical mobility data:

- **4** mobility systems/services;
- **67** mobility route/corridor records;
- **7** explicit transfer or service-to-hub relationships.

Each result carries a stable canonical key and links back to the relevant
Mobility section.

Search descriptions retain the route evidence distinctions:

- current One Ayala bus/P2P/UV services;
- current/successor jeepney corridors;
- unresolved historical jeepney rows;
- verified transfer and hub relationships.

No route geometry or live schedule data is duplicated into Search.

## Guard updates

`check:mobility-page` now verifies the internal journey navigation, Search
links, interchange-aware system links and Area cross-link.

`check:civic-intelligence-search` now verifies that the Search index consumes
the canonical mobility registries and that their current source counts remain
4 systems, 67 routes and 7 explicit interchange relationships.

## Next micro-step

**W5-4f5 — responsive/readability pass for the rebuilt Mobility page.**

Audit the expanded page for card density, mobile scrolling, disclosure
hierarchy, route-registry ergonomics and duplicated copy before W5-4g closure.
