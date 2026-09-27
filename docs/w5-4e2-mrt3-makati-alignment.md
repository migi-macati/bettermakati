# W5-4e2 — MRT-3 Makati alignment geometry

Reviewed: 2026-09-28

## Status

**Complete. BetterMakati now has its first published mobility geometry artifact.**

Artifact:

- ID: `mrt3-makati-alignment-2026-09`
- owner: `service:mrt3`
- kind: `infrastructure-alignment`
- coverage: `makati-segment`
- shape: `LineString`
- positions: **56**

## What the line represents

The stored line follows one southbound MRT-3 light-rail track alignment through the Makati station corridor.

It begins just north of Guadalupe Station and ends just south of Magallanes Station.

It is deliberately **not** described as:
- a legal Makati-boundary clipping;
- both physical railway tracks;
- full railway width;
- an engineering/survey alignment;
- the full MRT-3 system.

The geometry is intended for civic-map context and network visualization.

## Currentness and identity

Current MRT-3 identity and the four Makati stations continue to be governed by the canonical DOTr MRT-3 source in `mobilitySystems.ts`.

OpenStreetMap is used as a **reference-map geometry source**, not as the authority for whether MRT-3 is operating.

OSM route master:
- relation `8000255` — MRT Line 3

Directional route used for the track-member crosswalk:
- relation `109159` — North Avenue → Taft Avenue

The directional relation lists the rail ways that form the current mapped route.

## Coordinate trace

Coordinates were recovered from an OpenStreetMap-derived rail-exposure snapshot for the following OSM way IDs, in route order:

1. `810673631`
2. `642764191`
3. `547163412`
4. `810673628`
5. `810673626`
6. `810634546`
7. `799249439`
8. `642764192`
9. `810634542`
10. `642764189`
11. `38192006`

Those way IDs correspond to the MRT-3 directional route relation used for the alignment crosswalk.

A separate TrainTracks MRT-3 GeoJSON feature for Wikidata item `Q13422345` was used as an additional shape cross-check.

## Stored bounds

- west: **121.0174488**
- east: **121.0464023**
- south: **14.5408093**
- north: **14.5701072**

The geometry therefore stays tightly within the reviewed Guadalupe–Magallanes Makati station corridor.

## Station QA

The stored track line was checked against BetterMakati’s canonical station points using a local point-to-segment distance calculation.

Approximate minimum distance to the stored alignment:

- Guadalupe: **2 m**
- Buendia: **3 m**
- Ayala: **9 m**
- Magallanes: **7 m**

The automated gate fails if any of the four station points moves more than **20 m** from the published alignment.

This is a data-integrity check, not a survey-distance claim.

## Provenance

The artifact cites:

### System/currentness

- DOTr MRT-3 current system source

### Geometry/reference

- OSM route master relation `8000255`
- OSM directional route relation `109159`
- OSM-derived rail exposure snapshot containing the member-way geometries
- TrainTracks MRT-3 GeoJSON cross-check

The geometry precision note explicitly states that this is mapped reference geometry, not cadastral, survey, or engineering data.

## Canonical linkage

The canonical `mrt3` service now reciprocally references:

`geometryArtifactId: 'mrt3-makati-alignment-2026-09'`

No jeepney, city-bus, P2P, or UV route receives geometry in this step.

## Automated checks

`check:mobility-route-geometry` now verifies:

- exactly one published mobility geometry artifact;
- exactly four geometry/reference sources;
- owner = `service:mrt3`;
- infrastructure-alignment / Makati-segment classification;
- 56 stored positions;
- expected north/south endpoints;
- reviewed local coordinate envelope;
- reciprocal MRT-3 service linkage;
- all four station points within 20 m of the line;
- no geometry attached to road-route records;
- build + quality gating remains active.

## Next micro-step

**W5-4e3 — render the MRT-3 alignment as the first mobility line on the Civic Map.**

The map layer should:
- remain distinct from Place markers and the Districts & estates polygon layer;
- use the route artifact directly;
- label it as mapped reference alignment;
- link to MRT-3 / station context rather than inventing a route Place;
- derive line framing from actual geometry;
- keep all geometry-less jeepney/bus/UV records searchable/listable without fake map lines.
