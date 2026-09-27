# W5-3a1 — Estates & Districts inventory and internal reconciliation

Reviewed: 2026-09-27

## Purpose

Inventory the estate, district, village and association concepts already present in BetterMakati before adding new canonical records.

This step is intentionally internal. It does **not** yet assert current boundaries, association jurisdiction or legal/organizational names beyond what the repository already publishes. External source reconciliation belongs in W5-3a2.

## Architectural finding

The current Civic / Place Registry has no canonical area entity for an estate, district, village or managed precinct.

Its canonical records are destination-like places, bounded infrastructure segments and transport routes. Although `PlaceGeometry` can describe an area, `CivicEntityKind` currently has only `place | segment | route`, and the primary categories contain no estate/district/village category.

That means the four cards on `/estates`, BetterBarangay association links and visitor references are parallel strings rather than shared civic entities.

**Do not solve this by turning every estate into a point Place.** A managed district or village is an area. The next implementation step should introduce an area-level canonical model (or deliberately extend the civic entity layer with an `area` kind) and then relate places and organizations to it.

## Current surfaces

### 1. `/estates`

The page currently contains four locally defined cards:

| Published card | Published area | Current role in code |
| --- | --- | --- |
| Makati Central Estate Association (MACEA) | Makati Central Business District | Association and managed area are combined in one card |
| Century City Estate Association | Century City, Poblacion | Association and district are combined |
| Rockwell Center Association, Inc. | Rockwell Center | Association and district are combined |
| Circuit Makati Estate Association (CMEA) | Circuit Makati, Carmona | Association and estate are combined |

The page owns its own names, area labels, websites, resource links and map queries. None of the four is a canonical registry entity.

### 2. BetterBarangay

Eight barangays currently publish estate / village association links.

| Barangay | Current association / estate references |
| --- | --- |
| Bel-Air | Bel-Air Village Association (BAVA); MACEA |
| Carmona | Circuit Makati |
| Dasmariñas | Dasmariñas Village Association (DVA) |
| Forbes Park | Forbes Park Association (FPA) |
| Magallanes | Magallanes Village Association (MVA) |
| Poblacion | Century City; Rockwell Center; MACEA |
| San Lorenzo | San Lorenzo Village Association (SLVA); MACEA |
| Urdaneta | Urdaneta Village Association (UVA); MACEA |

This is **12 references across 8 barangays and 10 distinct names**. MACEA is repeated on four barangay profiles.

The current data mixes organization records and area records:
- BAVA, DVA, FPA, MVA, SLVA and UVA are association names.
- Circuit Makati, Century City and Rockwell Center are area / development names.
- MACEA is an association whose managed geography is not represented separately.

### 3. Visit / parking / mobility / events

Existing public-facing district strings include:

- Ayala Center
- Makati CBD / Makati Central Business District
- Salcedo Village
- Legazpi Village
- Poblacion
- Rockwell Center
- Circuit Makati
- Century City

Specific current uses:
- `Parking.tsx` has seven popular areas: Ayala Center, Salcedo Village, Legazpi Village, Poblacion, Rockwell Center, Circuit Makati and Century City.
- `Mobility.tsx` references Century City transport, CBD → Rockwell, Circuit → Ayala Center and Ayala Center → Poblacion trips.
- `WhatsOn.tsx` uses Makati CBD / Ayala Center / Circuit through Make It Makati, plus Power Plant Mall / Rockwell and Century City Mall.
- `VisitMakati` treats Poblacion as a visitor district and links Make It Makati as a CBD / Ayala Center / Circuit resource.

These should eventually consume canonical area IDs instead of carrying their own destination strings.

### 4. Search index

The search index currently has:
- one `Estates & Associations` page entry;
- separate search entries for BAVA, DVA, FPA and SLVA.

MVA and UVA are present in BetterBarangay but do not currently have equivalent dedicated search entries.

### 5. Place Registry coverage inside these areas

The registry contains many **places located inside** named districts but no record for the district itself.

Current text-level coverage includes:

| Area string | Existing canonical places that mention it |
| --- | --- |
| Ayala Center | Ayala Police Sub-Station 5; Ayala Museum; Greenbelt Park; Palm Promenade; Glorietta 4 Park / The Plaza; Ayala Satellite Fire Station |
| Makati CBD | Ayala Triangle Gardens; Palm Promenade |
| Salcedo Village | Jaime C. Velasquez Park; SEC Headquarters |
| Legazpi Village | Washington SyCip Park; Legazpi Active Park |
| Circuit | PSA Makati CRS Outlet |
| Century City | none |
| Rockwell | none |

Poblacion has many canonical places because it is already a canonical **barangay geography**, not because a separate estate/district entity exists.

The village names Bel-Air, Dasmariñas, Forbes Park, Magallanes, San Lorenzo and Urdaneta also overlap current barangay names. A future village-area model must not assume that a barangay boundary and a privately managed village boundary are identical.

## Reconciliation decisions for the next model

### A. Areas and organizations are different entity classes

A district / estate / village should be an **area entity**.

An estate association / homeowners association should be an **organization entity** related to that area.

Do not use:
- `Makati Central Estate Association (MACEA)` as the name of the CBD area;
- `Rockwell Center Association, Inc.` as the place name for Rockwell Center;
- `Circuit Makati Estate Association` as the place name for Circuit Makati;
- a mall website as proof that a similarly named estate association exists.

### B. Barangays are not estate aliases

Poblacion, Bel-Air, Dasmariñas, Forbes Park, Magallanes, San Lorenzo and Urdaneta already exist as barangay entities.

Where a village/district has the same or similar name:
- preserve the barangay as the government geography;
- create a separate managed-area record only if a sourced boundary or defensible scope can be established;
- relate the two instead of merging them.

### C. Neighborhood names need explicit scope

Salcedo Village and Legazpi Village are already important navigation labels across visitor and registry content, but neither has a canonical area record.

They should be candidates for area entities only after their relationship to the broader Makati CBD / MACEA-managed area and their barangay coverage is sourced.

### D. Poblacion should not be duplicated

The visitor-facing `Poblacion` district reference should normally resolve to the existing Barangay Poblacion identity.

A separate nightlife / commercial subdistrict should only be created later if BetterMakati can define a different named geography with a sourced boundary.

## Candidate area inventory for W5-3a2

These are **reconciliation candidates, not yet verified canonical records**.

### Managed business / mixed-use areas
1. Makati Central Business District / Makati CBD
2. Ayala Center
3. Century City
4. Rockwell Center
5. Circuit Makati
6. Salcedo Village
7. Legazpi Village

### Residential village areas
8. Bel-Air Village
9. Dasmariñas Village
10. Forbes Park
11. Magallanes Village
12. San Lorenzo Village
13. Urdaneta Village

### Existing government geography to reuse, not duplicate
14. Barangay Poblacion

## Candidate organization inventory for W5-3a2

1. Makati Central Estate Association (MACEA)
2. Century City estate-management association — exact organizational name and authoritative channel to verify
3. Rockwell Center Association, Inc. — exact current organizational identity and authoritative channel to verify
4. Circuit Makati Estate Association (CMEA) — exact current organizational identity and authoritative channel to verify
5. Bel-Air Village Association (BAVA)
6. Dasmariñas Village Association (DVA)
7. Forbes Park Association (FPA)
8. Magallanes Village Association (MVA)
9. San Lorenzo Village Association (SLVA)
10. Urdaneta Village Association (UVA)

## Internal inconsistencies to resolve before implementation

1. **Poblacion currently lists MACEA** even though the Estates page describes MACEA's area as the Makati CBD. This relationship needs source verification rather than being propagated.
2. **Century City and Rockwell are entered as area names in BetterBarangay but as association names on `/estates`.** The two concepts need separate IDs.
3. **Circuit Makati is entered as an area in BetterBarangay but CMEA is shown on `/estates`.** These should become an area → managing organization relationship.
4. **MVA and UVA currently use Google Maps search links rather than confirmed organization websites.**
5. **Search coverage is incomplete** for the association set already present in BetterBarangay.
6. **Area membership of existing Place Registry records is implicit in addresses/tags.** It should become explicit relationships once the canonical area model exists.
7. **Ayala Center, Salcedo Village and Legazpi Village are heavily reused navigation concepts but are absent from the Estates page.**
8. **Residential villages are absent from `/estates` despite already having HOA data in BetterBarangay.**

## Proposed canonical relationship shape

The exact TypeScript model belongs in W5-3b, but W5-3a reconciliation should gather enough evidence to support relationships like:

- area → `within-barangay`
- area → `managed-by` organization
- organization → official website / advisories
- place → `within-area`
- area → related visitor / parking / mobility resources
- area → related BetterBarangay page(s)

For multi-barangay areas, membership must support more than one barangay.

## Do not do yet

- Do not add point coordinates as substitutes for area geometry.
- Do not infer estate boundaries from a mall, park or association office.
- Do not treat a barangay and a similarly named village as the same geometry.
- Do not promote MACEA membership or estate responsibility from incidental address text.
- Do not duplicate current Place records simply to make an estate page look complete.

## Next micro-step

**W5-3a2 — authoritative source reconciliation.**

Verify the candidate area names, organizational names, official channels, managed scope and barangay relationships using primary / official sources where available. The output should decide which candidates are safe to canonicalize and which remain reference-only before any schema change.
