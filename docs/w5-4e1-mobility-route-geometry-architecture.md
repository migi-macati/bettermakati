# W5-4e1 — Mobility route-geometry architecture

Reviewed: 2026-09-28

## Status

**Architecture complete. No geometry published yet.**

BetterMakati now has a repository-owned route/polyline artifact model for mobility systems and routes.

This step intentionally stops before publishing a line. The first line will be added only after its coordinate trace is independently extracted and checked against the authoritative/current service evidence.

## Geometry model

Supported GeoJSON-compatible shapes:

- `LineString`
- `MultiLineString`

Supported owners:

- mobility **service/system**
- canonical mobility **route**

Supported geometry kinds:

- `infrastructure-alignment`
- `service-alignment`
- `approximate-corridor`
- `historical-lineage`

Supported coverage labels:

- `full-system`
- `makati-segment`
- `route-corridor`
- `historical-reference`

## Source separation

Geometry provenance is deliberately separated into three source registries:

1. **system** — identity/status/operator evidence from `mobilitySystems.ts`
2. **route** — current/historical route evidence from `mobilityRoutes.ts`
3. **geometry** — map/polyline sources actually used to obtain shape/coordinates

A map source can support **shape** without becoming the authority for whether a service is current.

Likewise, an official service page proving that MRT-3 operates does not automatically supply enough coordinate detail to draw its track alignment.

## Geometry doctrine

A current polyline requires both:

1. authoritative/current evidence for the service or route identity; and
2. a defensible coordinate trace with explicit provenance.

BetterMakati must not create route shape merely from:

- endpoint names;
- station points joined with straight lines;
- a center/representative point;
- route-name text;
- historical GIS geometry assumed to remain current.

Historical geometry may be stored later as `historical-lineage`, but it must not silently become a current alignment.

## Runtime safeguards

The validator now enforces:

- existing service/route owner;
- reciprocal `geometryArtifactId`;
- one active default geometry artifact per owner;
- at least one source;
- explicit precision note;
- at least two distinct coordinates per line;
- finite longitude/latitude values;
- Metro Manila validation envelope:
  - longitude 120.80–121.25
  - latitude 14.35–14.90
- no dangling geometry IDs from systems or routes.

A bounds helper is also available so later maps can derive their viewport from actual route geometry instead of fake centroids.

## Current artifact count

**0**

The architecture is live, but no route/system has yet received a geometry artifact.

This is deliberate.

## First candidate — MRT-3

MRT-3 should be the first actual geometry artifact.

Reasons:

- it is fixed physical infrastructure rather than a volatile road-route service;
- its current system identity and Makati station membership are already authoritative in the mobility-system registry;
- OpenStreetMap/Wikidata expose a specific MRT-3 route relation, **OSM relation 8000255**, which provides a defensible coordinate-trace candidate;
- the trace can be checked against the four canonical Makati MRT-3 stations:
  - Guadalupe
  - Buendia
  - Ayala
  - Magallanes

### Proposed evidence treatment

**Authority/currentness**
- DOTr MRT-3 current system source

**Coordinate trace**
- OpenStreetMap relation 8000255, treated as a reference-map source rather than operational authority

**QA**
- canonical MRT-3 station points and order
- visual comparison against current rail alignment/reference maps

### Scope

Prefer a **Makati-segment infrastructure alignment** first rather than immediately importing the whole Metro Manila line.

That keeps the Civic Map focused and makes QA easier.

## Second candidates after MRT-3

### EDSA Busway

Potentially suitable after MRT-3, but more complicated because:

- current station construction/openings can change;
- northbound and southbound carriageway alignments may differ;
- a `MultiLineString` may be more appropriate than a single centerline.

Do not derive the line simply by connecting Guadalupe, Buendia and Ayala station points.

### Pasig River Ferry

The river path is geographically stable, but the actual passenger-service path/station sequence is operational rather than merely a river centerline.

Do not substitute the Pasig River geometry itself for the ferry route without route-specific evidence.

### Historical Makati GIS lines

The official Makati “Going Around Lines” service can later supply `historical-lineage` geometry for:
- E-Jeepneys
- Jeepney Routes
- Bus Rapid Transit lines

Those historical lines are useful for route lineage and comparison, but cannot establish 2026 service geometry by themselves.

## Civic Map integration

No Civic Map rendering change is made in W5-4e1.

The current map architecture can already display Area polygons through a custom overlay, but route geometry should be integrated only after at least one artifact exists and passes geometry QA.

The eventual route layer should:

- remain separate from Place markers and Area polygons;
- distinguish current alignment from approximate/historical geometry;
- derive viewport from actual line bounds;
- never create a marker merely because a route has no geometry.

## Next micro-step

**W5-4e2 — extract, QA and publish the first actual route-geometry artifact: the MRT-3 Makati segment.**

The artifact should be:

- owner: `service:mrt3`
- kind: `infrastructure-alignment`
- coverage: `makati-segment`
- coordinate trace from a reference-map route relation
- currentness/identity governed by DOTr evidence
- checked against the four canonical Makati MRT-3 stations
- clearly described as a mapped infrastructure trace, not a cadastral/survey product.
