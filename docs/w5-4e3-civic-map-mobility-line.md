# W5-4e3 — Civic Map mobility line

Reviewed: 2026-09-28

## Status

**Complete. The Civic Map now renders BetterMakati's first sourced mobility line.**

The published MRT-3 Makati alignment artifact is drawn directly from
`mobilityRouteGeometry.ts`. No route line is reconstructed from station names,
endpoint labels, old GIS rows or search results.

## What changed

The existing Civic Map context panel now carries two independent sourced
geometry layers:

- **Districts & estates** — approximate polygon boundaries from
  `areaGeometry.ts`
- **MRT-3 alignment** — the published mapped reference line from
  `mobilityRouteGeometry.ts`

Both layers can be toggled independently.

The map viewport is derived from the combined bounds of the actual polygon and
mobility geometry. No synthetic centroid or hard-coded map center is introduced.

## MRT-3 presentation

The MRT-3 line is styled as a separate gold mobility layer so it is visually
distinct from the green Districts & estates polygons.

The legend calls it a **Mapped reference alignment**.

The accompanying context card links to:

- the Getting Around / MRT-3 transport context; and
- the four canonical station Place records: Guadalupe, Buendia, Ayala and
  Magallanes.

BetterMakati does **not** create a route Place for the alignment.

The artifact precision note is shown with the line, including the warning that
it is mapped reference geometry rather than cadastral, survey or engineering
geometry.

## Geometry-less routes

Jeepney, city-bus, P2P and UV records remain searchable/listable through their
canonical route records.

They are not drawn as map lines unless a repository-owned geometry artifact is
published for them.

The Civic Map renderer does not import `mobilityRouteCorridors`, which prevents
endpoint labels or historical route rows from being turned into invented
polylines.

## CI baseline repairs

The previous `main` CI failure was unrelated to MRT-3 geometry. ESLint stopped
on an accidental sparse-array comma in `src/data/areaGeometry.ts`
(`},,` between the two area artifacts).

Once lint could proceed, the Area Civic Intelligence guard exposed a second
pre-existing checker defect: its unanchored `id:` matcher counted the
relationship ID plus both endpoint IDs in every row, so the canonical 29
relationships appeared as 87. The matcher is now restricted to top-level
relationship IDs. The frozen expectation remains **29** and no area relationship
data is changed.

These repairs restore the validation baseline needed to test W5-4e3 itself.

## Automated checks

`check:civic-map` now also verifies that:

- the current published mobility geometry set begins with the single MRT-3
  Makati artifact;
- the Civic Map consumes `mobilityRouteGeometryArtifacts` directly;
- framing uses `boundsForMobilityRouteGeometry`;
- the mobility line has its own toggle and line-path renderer;
- the UI labels the line as a mapped reference alignment;
- MRT-3 context and canonical station links are exposed;
- the renderer does not import geometry-less route records; and
- the map states that geometry-less routes are not given invented lines.
