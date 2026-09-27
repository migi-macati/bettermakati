# W5-2a1 — Makati heritage inventory and source reconciliation

Reviewed: 2026-09-27

## Purpose

This audit is the evidence pass before BetterMakati creates or rewires canonical heritage Place records. It does **not** assume that every cultural-property record should appear as a visitor attraction, and it does **not** collapse unresolved historical buildings into a single place.

## Current BetterMakati state

### Heritage page

`src/data/visitMakati.ts` currently lists six heritage/culture entries:

1. Nuestra Señora de Gracia Church
2. Sts. Peter and Paul Parish Church
3. Nielson Tower
4. Dambana ng Banal na Krus
5. Museo ng Makati
6. Ayala Museum

Only **Museo ng Makati** currently has a `placeId`.

### Canonical place registry

`src/data/placeRegistry.ts` currently has only one record whose primary category is `heritage-site`: `museo-ng-makati`.

That record is still a legacy Civic Map seed converted into the canonical registry. It does not yet carry the source detail, aliases, lifecycle, historical relationships or richer heritage metadata needed by the History and Heritage surfaces.

### History timeline

`src/data/makatiHistory.ts` is already much richer than the Heritage page. It contains source-linked material for San Pedro Macati, Guadalupe, the hacienda buildings, Nielson Airport, Ayala/FHL and related institutions. The present gap is therefore mostly **entity reconciliation**: several historically important places exist in prose and event relations but do not yet exist as canonical Place records.

---

## Source hierarchy for W5-2

Use this order when reconciling identity, designation, location and chronology:

1. **National registry / official declaration**
   - NHCP Registry of Historic Sites and Structures
   - NCCA Talapamana / Philippine Registry of Heritage
   - National Museum declarations where applicable
2. **City primary / official material**
   - Makati Museum and Cultural Affairs Office
   - Makati Cultural Development Plan
   - City ordinances and planning documents
   - official barangay histories only for claims within their competence
3. **Custodian / institutional records**
   - parish / religious-order records
   - Filipinas Heritage Library / Ayala Archives
   - museum, school or building-owner institutional histories
4. **Archival and scholarly sources**
   - primary maps, photographs, visitation records, legal cases, historical accounts
   - peer-reviewed or institutionally published scholarship
5. **Reference maps**
   - for coordinates and present-day spatial reconciliation only; not for historical claims

A marker text is authoritative evidence that a marker says something. It is not automatically the strongest evidence for the underlying seventeenth-century event.

---

## A. Core records: canonicalize next

These are already on the public Heritage page and should be the first stable Place set.

| Proposed canonical ID | Display name | Current official basis | Current BetterMakati issue | W5-2 action |
| --- | --- | --- | --- | --- |
| `nuestra-senora-de-gracia-church` | Nuestra Señora de Gracia Church | NHCP: Church and Monastery of Guadalupe; NCCA/Talapamana | No Place record; Heritage page relies on free-text address/query | Create canonical Place; preserve `Church and Monastery of Guadalupe` as designation/alias; link Guadalupe history events |
| `sts-peter-and-paul-parish-church` | Sts. Peter and Paul Parish Church | NHCP: San Pedro Macati; NCCA/Talapamana | No Place record; historical naming/date is flattened | Create canonical Place; preserve San Pedro Macati/Sampiro aliases; link foundation, parish and Poblacion history without claiming every early “house” reference is the surviving church |
| `nielson-tower` | Nielson Tower | NHCP Nielson Tower marker; NCCA registered cultural property; FHL institutional history | No Place record; current Heritage source is historical marker only | Create canonical Place; separate historical airport/tower significance from current building use |
| `dambana-ng-banal-na-krus` | Dambana ng Banal na Krus | NHCP marker | No Place record | Create canonical Place; reconcile shrine/church naming and current official name before aliases are frozen |
| `museo-ng-makati` | Museo ng Makati | Makati MCAO / city publications | Existing Place is thin legacy seed | Enrich existing record, do not create duplicate; add 1918 Presidencia history and heritage-zone relationships |
| `ayala-museum` | Ayala Museum | Ayala Museum / DOT; FHL is now housed there | No Place record | Create as cultural institution / museum; do not imply the contemporary museum building is historic merely because it belongs on the Heritage & Culture page |

### Immediate page/data correction implied by this audit

The page currently uses one `HeritageSite` type for both marked historic structures and museums. W5-2 should keep one user-facing Heritage & Culture experience while distinguishing at data level between:

- historic structure / marked site
- museum / cultural institution
- monument / marker
- landscape / natural cultural property
- modern architecture / work of a National Artist
- heritage zone / historic district

---

## B. Official Makati additions with strong case for inclusion

### Plaza Cristo Rey — Poblacion

**Status:** add to canonical backlog.

Makati identifies Plaza Cristo Rey as a historical site in Poblacion. NCCA Talapamana also records Plaza Cristo Rey as a work associated with National Artist Francisco T. Mañosa.

Important relationship: the city describes the plaza as occupying the former San Pedro Macati cemetery area. That historical relationship should be sourced separately from the architectural/designed-landscape designation.

Proposed ID: `plaza-cristo-rey`.

### Poblacion Park / former hacienda-office site

**Status:** use existing `poblacion-park` Place record; do **not** create a new “Casa Hacienda Poblacion Park” place yet.

Older Makati material labels “Casa Hacienda Poblacion Park,” and the current Poblacion page says the park was formerly the site of Casa Hacienda / offices of the precursor of Ayala Corporation.

BetterMakati’s own history research, however, now has strong evidence that the 1926 Ayala Archives catalog treated **“Casa Hacienda, Makati”** and **“Hacienda Makati office building / Oficinas”** as different photographic subjects.

Therefore:

- `poblacion-park` remains the canonical present-day place;
- add a heritage relationship only after the historical-site identity is resolved;
- do not rename the park to Casa Hacienda;
- do not use the city’s shorthand to erase the two-Casas problem.

### La Campana Fabrica de Tabacos Administration Building — Olympia

**Status:** add to wider heritage registry.

NCCA Talapamana lists it as a **Registered Property, City of Makati**. Makati city material places it at/around Sultana Street, Olympia.

Proposed ID: `la-campana-fabrica-de-tabacos-administration-building`.

This is especially relevant to the Olympia industrial/estate history layer and should be cross-linked to future Casa Hacienda research only where evidence establishes a relationship.

### Malapad na Bato Adobe Formations

**Status:** add to wider heritage registry.

NCCA Talapamana lists the formations as a **Registered Property, City of Makati**.

This should be modeled as a natural/landscape cultural property rather than forced into the same type as a church or museum.

Proposed ID: `malapad-na-bato-adobe-formations`.

### Andres Bonifacio Monument — Makati

**Status:** add to wider heritage registry after exact site reconciliation.

Talapamana identifies a Makati Andres Bonifacio monument as a marked structure. Before creating the record, confirm the exact present-day monument, marker identity, address and current coordinates against NHCP.

Proposed ID after verification: `andres-bonifacio-monument-makati`.

---

## C. Modern architectural heritage / National Artist works

NCCA Talapamana contains many Makati properties because they are works of National Artists for Architecture or Landscape Architecture. These should not all be dumped into the public Heritage page at once.

High-value, publicly legible candidates for the next inventory layer include:

- Parish Church of Saint Alphonsus Mary de Liguori / Magallanes Church — Leandro V. Locsin; landscape association with Ildefonso P. Santos
- Parish Church of Saint Andrew the Apostle / Bel-Air Church — Leandro V. Locsin
- Saint John Bosco Parish Church — Jose Maria V. Zaragoza
- San Carlos Seminary / pastoral complex — city cultural material identifies Juan Nakpil design significance
- Plaza Cristo Rey — Francisco T. Mañosa

Talapamana also includes many private offices, residences, commercial buildings and landscapes in Makati. Those belong in the **complete cultural-property registry**, but public display should distinguish:

1. public/visitor-accessible heritage;
2. visible but privately controlled property;
3. private residence or restricted site;
4. demolished / status-unverified work;
5. registry-only record pending current-site verification.

This prevents “registered cultural property” from being presented as “tourist attraction.”

---

## D. Historically important places that remain unresolved

These require canonical records eventually, but W5-2 must not pretend the entity boundaries are already settled.

### Casa Hacienda / Casa de San Pedro — Olympia research track

**Status:** unresolved historical entity; do not merge with Poblacion Park.

The BetterMakati history research and the user’s `Casa de San Pedro` research file preserve multiple strands of evidence:

- the 1607 Jesuit foundation at Buenavista / San Pedro;
- Colín’s description of the site as a `montecillo, o altozano` and of the nearby Guadalupe hill;
- later references to a hacienda house and parish quarters;
- 1910 and 1926 Ayala Archives photographs;
- a 1926 catalog distinction between Casa Hacienda and the Hacienda office building;
- later Olympia-location research.

The research thesis may become strong enough for a canonical historical-site record, but the surviving-site continuity from the Jesuit house to later Casa Hacienda must remain separately evidenced.

Working ID only: `casa-hacienda-san-pedro-macati`.

Do not expose this as established until the location/continuity file is complete.

### Hacienda Makati office building / Oficinas — Poblacion

**Status:** separate historical entity.

The 1926 Ayala Archives catalog distinguishes this from Casa Hacienda. BetterMakati should preserve that distinction.

Working ID: `hacienda-makati-oficinas`.

Its relationship to present-day Poblacion Park needs documentary/map confirmation.

### Casa Quinta / Casa de Ingenieros

**Status:** unresolved historical entity.

The 1906–1907 land-registration material describes a strong-material building called Casa-Quinta or Casa de Ingenieros. Do not assume it is the same building as Casa Hacienda or Oficinas without cadastral/title/map evidence.

Working ID: `casa-quinta-casa-de-ingenieros`.

### Nielson Airport landscape

**Status:** historical landscape, not the same entity as Nielson Tower.

The tower survives as a building. The airport was a larger 42-hectare aviation landscape whose former runways became major roads. Keep a separate historical entity if/when BetterMakati adds historical landscapes.

Working ID: `nielson-airport-historical-site`.

---

## E. Historical marker records that should not be silently merged into current civic buildings

### Makati historical marker

NHCP’s `Makati` marker is a historical marker for the town/city narrative and is located at an old city-hall site. It should be represented as a **marker/site relationship**, not by rewriting the canonical record for the present Makati City Hall.

The marker text itself also contains claims — including the 1578 visita, 1608 encomienda and 1670 bayan statements — that BetterMakati’s History work is independently checking against earlier records. Keep the marker as evidence of the official commemorative narrative, not as the sole source for those early dates.

---

## F. Former-Makati records

Makati’s 2020 Facts and Figures heritage list included **Ermita de San Nicolas de Tolentino, West Rembo**.

Because BetterMakati’s current civic/place layer is for present Makati, former-EMBO heritage must not be silently mixed into current Makati locations. Preserve it where useful in historical territorial context, with an explicit temporal jurisdiction model if the site later supports former-boundary places.

---

## G. Source conflicts and corrections to carry into W5-2b/c

### 1. San Pedro dating

Current Heritage copy says only “1600s.” Sources across city pages and markers use different shorthand dates (1608, 1620, etc.), while the History dataset now contains the more precise source trail:

- 19 October 1607 foundation deed in Colín’s account;
- construction of house/church continuing into the early seventeenth century;
- the surviving church’s later rebuilding/history is a separate chronology.

The Place record should not compress foundation, construction and present fabric into one date field.

### 2. Guadalupe naming

Use **Nuestra Señora de Gracia Church** as the modern display name and preserve **Church and Monastery of Guadalupe** as the NHCP designation. Do not treat the English marker title as necessarily the current parish name.

### 3. Nielson Tower present use

The NHCP marker text says the building housed the Filipinas Heritage Library. That was true historically; FHL moved to Ayala Museum in 2013.

Therefore:
- NHCP = designation and historical significance;
- FHL/Ayala records = institutional chronology;
- current operator/site = present use.

Do not repeat old marker copy as current-use fact.

### 4. Casa Hacienda / Oficinas

This remains the highest-risk heritage identity problem. The code must encode uncertainty instead of choosing a convenient answer.

### 5. Museum versus heritage structure

Ayala Museum belongs on a Heritage & Culture page as a cultural institution, but it should not be categorized as a historic structure unless a separate designation supports that claim.

### 6. Coordinates

Do not use generic Google Maps search text as the canonical location layer once Place records exist. Canonical records should store a sourced point/entrance/centroid and its role.

---

## H. Registry/data-model implications

W5-2 should keep `primaryCategory` stable where possible and enrich with secondary categories/tags rather than create a large breaking enum immediately.

Recommended secondary heritage facets:

- `historical-marker`
- `marked-structure`
- `museum`
- `cultural-institution`
- `religious-heritage`
- `national-artist-work`
- `registered-cultural-property`
- `historic-landscape`
- `natural-cultural-property`
- `heritage-zone`
- `archaeological-site`
- `historical-site-nonextant`

Recommended relationships:

- current place ↔ historical predecessor/site
- place ↔ marker/designation
- place ↔ History event IDs
- place ↔ BetterBarangay
- place ↔ visitor route/collection
- place ↔ source-backed person/institution only where the target has a canonical entity or deliberate reference model

---

## I. W5-2a1 result

### Safe to canonicalize immediately

- Nuestra Señora de Gracia Church
- Sts. Peter and Paul Parish Church
- Nielson Tower
- Dambana ng Banal na Krus
- Museo ng Makati (enrich existing)
- Ayala Museum
- Plaza Cristo Rey

### Add after exact present-site verification

- La Campana Fabrica de Tabacos Administration Building
- Malapad na Bato Adobe Formations
- Andres Bonifacio Monument (Makati)
- selected National Artist works

### Keep unresolved / historical-only for now

- Casa Hacienda / Casa de San Pedro
- Hacienda Makati Oficinas
- Casa Quinta / Casa de Ingenieros
- Nielson Airport historical landscape

---

## Primary reconciliation sources consulted

- Makati City, *Facts and Figures 2020*, Culture and Arts / Heritage Sites
  - https://www.makati.gov.ph/assets/uploads/downloads/2/45/561/pdf/Facts%20and%20FIgures%202020.pdf
- Makati City, Barangay Poblacion official page
  - https://www.makati.gov.ph/barangay/poblacion/34page?tab=1
- Makati City, *Final Makati Cultural Development Plan*
  - https://www.makati.gov.ph/assets/uploads/downloads/2/541/pdf/Final%20Makati%20Cultural%20Development%20Plan.pdf
- NHCP Registry — Makati City label index
  - https://philhistoricsites.nhcp.gov.ph/labels/makati-city/
- NHCP — Church and Monastery of Guadalupe
  - https://philhistoricsites.nhcp.gov.ph/registry_database/church-and-monastery-of-guadalupe/
- NHCP — San Pedro Macati
  - https://philhistoricsites.nhcp.gov.ph/registry_database/san-pedro-macati/
- NHCP — Nielson Tower
  - https://philhistoricsites.nhcp.gov.ph/registry_database/nielson-tower/
- NHCP — Dambana ng Banal na Krus
  - https://philhistoricsites.nhcp.gov.ph/registry_database/dambana-ng-banal-na-krus/
- NHCP — Makati historical marker
  - https://philhistoricsites.nhcp.gov.ph/registry_database/makati/
- NCCA Talapamana — Metro Manila cultural properties
  - https://talapamana.ncca.gov.ph/index.php/component/content/article/talapamana-metro-manila?Itemid=101&catid=12
- BetterMakati History source library and the user research document *Casa de San Pedro*.

## Next micro-step

**W5-2a2:** create/enrich the seven safe canonical Place records above, without yet changing heritage routes or adding unresolved Casa entities. Then run the place-registry integrity checks before touching `Heritage.tsx`.
