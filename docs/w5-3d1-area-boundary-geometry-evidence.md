# W5-3d1 — Area boundary and geometry evidence

Reviewed: 2026-09-27

## Decision rule

A canonical area may exist without geometry.

Use these geometry classes only:
- **official-boundary** — authoritative legal/government geometry.
- **source-defined-boundary** — a primary source explicitly draws the estate/project extent.
- **approximate-boundary** — BetterMakati traces a defensible perimeter from a primary-source map or explicit boundary description, with a visible approximation note.
- **no boundary** — identity is canonical but the evidence does not justify a polygon.

Never infer an area from a center point, mall footprint, association office, similarly named barangay, or an unsourced map outline.

## Evidence matrix

| Area | Evidence | Decision |
| --- | --- | --- |
| Makati Central Business District | Current Ayala/APMC/MACEA sources establish the CBD and operating context, but no unambiguous current perimeter was found. A current Ayala Land slide labels an outline “Makati CBD Projects with MACEA,” which is narrower/ambiguous for the whole CBD. | **NO BOUNDARY YET** |
| Ayala Center | APMC confirms the estate under ACEA and its San Lorenzo location, but no estate perimeter was found. | **NO BOUNDARY YET** |
| Salcedo Village | MACEA confirms the named area and operations there, but no authoritative full perimeter was found. | **NO BOUNDARY YET** |
| Legazpi Village | MACEA confirms the named area and operations there, but no authoritative full perimeter was found. | **NO BOUNDARY YET** |
| Circuit Makati | Direct visual review of the cited Ayala Land Estates presentation shows that the black outline is labeled **“Makati CBD Projects with MACEA”**. Circuit Makati is shown as a separate callout/location, not as the outlined polygon. Other Ayala Land sources confirm Circuit’s identity and land area but do not supply a usable outer perimeter. | **NO BOUNDARY YET** |
| Century City | Century Properties identifies the 3.4-hectare project and publishes a site plan of the full development. The plan is not a legal survey. | **APPROXIMATE BOUNDARY CANDIDATE** |
| Rockwell Center | Rockwell publishes “The Rockwell Center Masterplan,” says the center grew from 15.5 hectares by another 3.6 hectares, and shows the complete masterplan. The graphic is marked “Artist’s Illustration.” | **APPROXIMATE BOUNDARY CANDIDATE** |
| Bel-Air Village | BAVA confirms 787,234 sqm, four phases, 950 lots and 32 streets, but no complete perimeter was found. | **NO BOUNDARY YET** |
| Dasmariñas Village | DVA publishes a Village Map plus an explicit perimeter description and states the barangay is exactly within the gated subdivision perimeter. | **APPROXIMATE BOUNDARY CANDIDATE — HIGH CONFIDENCE** |
| Forbes Park | FPA publishes a village map and its articles describe the subdivision boundary using named roads/adjacent lands. | **APPROXIMATE BOUNDARY CANDIDATE — HIGH CONFIDENCE** |
| San Lorenzo Village | MySLV gives an approximate 63-hectare area and identifies major bounding roads and neighboring communities, but no source-defined polygon. | **APPROXIMATE BOUNDARY CANDIDATE** |
| Urdaneta Village | Court records establish the village and UVA but provide lot restrictions, not a complete village perimeter. | **NO BOUNDARY YET** |
| Magallanes Village | Court records establish the village and MVA but no current complete perimeter source was found. | **NO BOUNDARY YET** |

## Primary sources reviewed

Circuit Makati:
- https://admin.ayalalandestates.com.ph/wp-content/uploads/2025/03/Circuit-Makatis-Samsung-Performing-Arts-Theater-and-Contemporary-Art-Center-Presentation-by-Chris-Mohnani.pdf
- https://www.ayalalandestates.com.ph/estates/circuit-makati

Century City:
- https://www.century-properties.com/wp-content/uploads/2022/08/Company-Presentation-for-the-Annual-Stockholders-Meeting-June-29-2017.pdf
- https://www.century-properties.com/corporate-profile/

Rockwell Center:
- https://e-rockwell.com/wp-content/uploads/2024/09/Proscenium-Brochure.pdf

Dasmariñas Village:
- https://dva.org.ph/village-map/
- https://dva.org.ph/about-us/

Forbes Park:
- https://www.forbesparkassociation.com/copy-of-about-us
- https://www.forbesparkassociation.com/contacts

San Lorenzo Village:
- https://www.myslv.ph/

Bel-Air Village:
- https://www.bava.ph/about-us

Urdaneta Village:
- https://lawphil.net/judjuris/juri2019/apr2019/gr_204187_2019.html

CBD / Ayala Center / Salcedo / Legazpi:
- https://www.ayalaproperty.com.ph/news-and-updates/macea-apmc-and-barangays-collaborate-in-successful-makati-cbd-estatewide-drill
- https://www.ayalaproperty.com.ph/news-and-updates/ayala-center-makati-rolls-out-the-future-of-estate-security-with-its-first-byd-electric-security-patrol-car
- https://macea.com.ph/
- https://macea.com.ph/2021/08/03/it-all-started-with-gravel-stones-asphalting-works-in-makati/

## Implementation tiers

### Tier 1 — first geometry candidates

1. **Dasmariñas Village** — trace from the DVA Village Map plus stated perimeter as `approximate-boundary`.
2. **Forbes Park** — trace from the FPA map plus articles boundary description as `approximate-boundary`.

**Circuit Makati is removed from Tier 1.** The originally cited presentation does not draw a Circuit Makati estate boundary; its black polygon is explicitly the “Makati CBD Projects with MACEA” outline.

### Tier 2 — require a second visual QA source before publication

- Century City
- Rockwell Center
- San Lorenzo Village

### Tier 3 — remain geometry-less

- Makati CBD
- Ayala Center
- Salcedo Village
- Legazpi Village
- Bel-Air Village
- Urdaneta Village
- Magallanes Village
- Circuit Makati

## Civic Map implications

Area polygons should be a separate **Districts & estates** context layer, not new Place/Segment/Route records.

- Render area fills beneath civic places and infrastructure.
- Clicking an area should open its canonical Estates record.
- Approximate polygons must visibly say **Approximate boundary**.
- Geometry-less areas stay searchable and linkable without being drawn.
- Do not invent centroids. Fit the map to actual polygon bounds only when geometry exists.

## Schema issue

The current `CivicAreaGeometry` only stores `kind`, `geometryRef`, source IDs and a note. That records provenance but cannot render a polygon.

The next implementation should use a real repository-owned GeoJSON-compatible Polygon/MultiPolygon artifact with source IDs and a precision note. Do not store an opaque coordinate string in `geometryRef`.

## Next micro-step

**W5-3d2 — introduce the renderable area-geometry artifact model, but do not publish a polygon yet.**

Direct visual verification blocked the planned Circuit Makati polygon. W5-3d2 should therefore establish the storage and validation model with zero geometry artifacts rather than encode a false boundary. The first actual polygon should be **Dasmariñas Village** in W5-3d3, followed by Forbes Park in a separate micro-step.
