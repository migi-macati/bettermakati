# W5-3a2 — Estates & Districts authoritative source reconciliation

Reviewed: 2026-09-27

## Purpose

Reconcile the W5-3a1 candidate areas and organizations against current primary / official sources before introducing a canonical area model.

This is a **source decision record**, not yet the schema implementation. It separates:

- area identity;
- organization identity;
- management / developer relationship;
- barangay relationship;
- exact boundary / geometry.

A name can be safe to canonicalize while its exact boundary remains unresolved.

## Decision scale

- **SAFE** — identity is supported well enough to create a canonical area or organization record in W5-3b.
- **SAFE, GEOMETRY LATER** — identity and broad location are supported, but do not infer a polygon yet.
- **REFERENCE-ONLY** — keep as a relationship/reference until a stronger current source is found.
- **REMOVE / DO NOT PROPAGATE** — current BetterMakati relationship is not supported by the sources reviewed.

---

## 1. Makati Central Business District / Makati CBD

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

Ayala Land Estates describes Ayala Land as the pioneer planner and builder of the **Makati Central Business District** and treats it as one of its premier mixed-use developments.

Source:
- Ayala Land Estates · About Us
  - https://www.ayalalandestates.com.ph/about-us

Ayala Property Management Corporation (APMC) describes a 2024 **Makati CBD estate-wide evacuation drill** conducted through both:
- Makati Central Estate Association (MACEA); and
- Ayala Center Estate Association (ACEA),

in coordination with barangays **Bel-Air, San Lorenzo and Urdaneta**.

Source:
- APMC · MACEA, APMC and Barangays Collaborate in Successful Makati CBD Estate-Wide Drill
  - https://www.ayalaproperty.com.ph/news-and-updates/macea-apmc-and-barangays-collaborate-in-successful-makati-cbd-estatewide-drill

### Reconciliation

Create one canonical area identity:

- proposed ID: `makati-cbd`
- canonical name: **Makati Central Business District**
- alias: **Makati CBD**
- kind: mixed-use business district / macro-area

Do **not** model MACEA as sole manager of the entire CBD.

Current APMC evidence shows that **MACEA and ACEA are distinct estate associations operating within the broader Makati CBD context**.

Do not infer an exact CBD polygon from the three coordinating barangays. The drill proves operational coordination, not a legal or cadastral boundary.

---

## 2. Makati Central Estate Association, Inc. (MACEA)

**Decision:** **SAFE**

### Evidence

The current official site identifies the organization as:

**Makati Central Estate Association, Inc.**

Sources:
- MACEA official website
  - https://macea.com.ph/
- MACEA contact page
  - https://macea.com.ph/contact-us/
- MACEA memorandum circulars
  - https://macea.com.ph/memorandum-circular/

MACEA's current site documents operations in **Salcedo Village** and **Legazpi Village**, including security, road works and estate infrastructure.

Sources:
- MACEA · security measures in MCBD
  - https://macea.com.ph/2022/02/25/macea-adds-security-measures-help-desks-in-mcbd/
- MACEA · asphalting works in Salcedo and Legazpi
  - https://macea.com.ph/2021/08/03/it-all-started-with-gravel-stones-asphalting-works-in-makati/

APMC separately describes its management of MACEA.

Source:
- https://www.ayalaproperty.com.ph/news-and-updates/macea-apmc-and-barangays-collaborate-in-successful-makati-cbd-estatewide-drill

### Naming note

The official current site uses **Makati Central Estate Association, Inc.**

Its About page contains historical copy using **Makati Commercial Estate Association**. Treat that as a historical / legacy name, not the current canonical name.

### Reconciliation

Create a canonical organization:

- proposed ID: `makati-central-estate-association`
- canonical name: **Makati Central Estate Association, Inc.**
- abbreviation: **MACEA**
- historical / legacy alias: **Makati Commercial Estate Association**

Relate MACEA to:
- Makati CBD — estate-management organization within the broader district;
- Salcedo Village — documented operations;
- Legazpi Village — documented operations.

Do **not** yet assign MACEA as the manager of every parcel in the Makati CBD.

---

## 3. Ayala Center

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

APMC explicitly describes **Ayala Center, Makati** as an estate and states that it is the first estate under the **Ayala Center Estate Association, Inc. (ACEA)**.

Source:
- APMC · Ayala Center Rolls Out the Future of Estate Security
  - https://www.ayalaproperty.com.ph/news-and-updates/ayala-center-makati-rolls-out-the-future-of-estate-security-with-its-first-byd-electric-security-patrol-car

Makati's official fire-station directory places the Ayala satellite fire station at Park Square, **Ayala Center, Brgy. San Lorenzo**.

Source:
- https://www.makati.gov.ph/content/makati-hotlines-firestations

### Reconciliation

Create a canonical area:

- proposed ID: `ayala-center`
- canonical name: **Ayala Center**
- kind: mixed-use commercial / retail estate
- barangay relationship: **San Lorenzo**

Parent / broader-area relationship:
- Ayala Center → within / part of **Makati CBD**

Do not derive the estate polygon from mall footprints.

---

## 4. Ayala Center Estate Association, Inc. (ACEA)

**Decision:** **SAFE**

### Evidence

Current APMC material explicitly names **Ayala Center Estate Association, Inc. (ACEA)** and states that Ayala Center is under ACEA.

Source:
- https://www.ayalaproperty.com.ph/news-and-updates/ayala-center-makati-rolls-out-the-future-of-estate-security-with-its-first-byd-electric-security-patrol-car

APMC's 2024 Makati CBD drill article also treats **MACEA and ACEA as separate estate associations**.

Source:
- https://www.ayalaproperty.com.ph/news-and-updates/macea-apmc-and-barangays-collaborate-in-successful-makati-cbd-estatewide-drill

### Reconciliation

Add this organization to W5-3. It was missing from W5-3a1.

- proposed ID: `ayala-center-estate-association`
- canonical name: **Ayala Center Estate Association, Inc.**
- abbreviation: **ACEA**
- managed area: **Ayala Center**

This corrects the current architecture where Ayala Center is present throughout BetterMakati but its actual estate association is absent.

---

## 5. Salcedo Village

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

MACEA repeatedly uses **Salcedo Village** as a current named area within its Makati CBD operations.

Its 2021 road-work article ties Salcedo Village works to **Barangay Bel-Air**.

Source:
- https://macea.com.ph/2021/08/03/it-all-started-with-gravel-stones-asphalting-works-in-makati/

MACEA's security article also identifies a Salcedo Village help desk and security deployment.

Source:
- https://macea.com.ph/2022/02/25/macea-adds-security-measures-help-desks-in-mcbd/

### Reconciliation

Create:
- proposed ID: `salcedo-village`
- canonical name: **Salcedo Village**
- kind: named CBD subdistrict
- parent area: **Makati CBD**
- barangay relationship: **Bel-Air**
- estate-management relationship: **MACEA** documented operationally

Do not assume Salcedo Village = Barangay Bel-Air. They remain separate geographies.

---

## 6. Legazpi Village

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

MACEA repeatedly uses **Legazpi Village** as a current named area.

Its 2021 road-work article ties Legazpi Village works to **Barangay San Lorenzo**.

Source:
- https://macea.com.ph/2021/08/03/it-all-started-with-gravel-stones-asphalting-works-in-makati/

The official MACEA office is also at Legazpi Street / V.A. Rufino Street, Legazpi Village.

Source:
- https://macea.com.ph/contact-us/

### Reconciliation

Create:
- proposed ID: `legazpi-village`
- canonical name: **Legazpi Village**
- kind: named CBD subdistrict
- parent area: **Makati CBD**
- barangay relationship: **San Lorenzo**
- estate-management relationship: **MACEA** documented operationally

Do not merge Legazpi Village with Barangay San Lorenzo.

---

## 7. Circuit Makati

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

Ayala Land Estates lists **Circuit Makati** as one of its current estates.

Sources:
- https://www.ayalalandestates.com.ph/estates
- https://www.ayalalandestates.com.ph/estates/circuit-makati

An Ayala Land Estates presentation identifies Circuit Makati as a **25.4-hectare** estate in Makati City.

Source:
- https://admin.ayalalandestates.com.ph/wp-content/uploads/2025/05/VERMOSA-Property-Showcase-Presentation.pdf

Makati's official climate plan identifies **Circuit Makati, formerly the Sta. Ana Race Track, in Carmona**.

Source:
- https://www.makati.gov.ph/assets/uploads/downloads/2/841/842/pdf/Makati%20LCCAP%202019.pdf

### Reconciliation

Create:
- proposed ID: `circuit-makati`
- canonical name: **Circuit Makati**
- kind: mixed-use estate
- barangay relationship: **Carmona**
- documented land area: **25.4 hectares** as an attribute, not as geometry

---

## 8. Circuit Makati Estate Association, Inc. (CMEA)

**Decision:** **SAFE**

### Evidence

Ayala Land's SEC filings identify **Circuit Makati Estate Association, Inc.** as an Ayala Land-related estate association.

Source:
- Ayala Land 2022 definitive information statement
  - https://ir.ayalaland.com.ph/wp-content/uploads/2022/04/ALI-SEC-Form-20-IS-2022-Definitive-2022-04-04.pdf

The filing lists senior Ayala Land officers as directors / treasurer of Circuit Makati Estate Association, Inc.

### Reconciliation

Create:
- proposed ID: `circuit-makati-estate-association`
- canonical name: **Circuit Makati Estate Association, Inc.**
- abbreviation: **CMEA**
- managed area: **Circuit Makati**

For public-facing current estate information, Ayala Land Estates remains the stronger official channel unless a current CMEA public portal is found.

---

## 9. Century City

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

Century Properties' corporate profile identifies **Century City** as a **3.4-hectare mixed-use community along Kalayaan Avenue in Makati**, developed through Century City Development Corporation.

Source:
- https://www.century-properties.com/corporate-profile/

Century Properties Management describes its Makati location as being **in Century City** and identifies the surrounding neighborhood as **Poblacion, Makati City**.

Source:
- https://www.century-properties.com/residences/century-properties-management-inc/

Makati's official Poblacion profile explicitly names **Century City** among developments in Barangay Poblacion.

Source:
- https://www.makati.gov.ph/barangay/poblacion/34page?tab=1

### Reconciliation

Create:
- proposed ID: `century-city`
- canonical name: **Century City**
- kind: mixed-use district / estate
- barangay relationship: **Poblacion**
- documented area: **3.4 hectares**

Do not substitute Century City Mall as the district geometry.

---

## 10. Century City Estate Association

**Decision:** **SAFE**

### Evidence

Century Properties' January 2026 bond prospectus includes **Century City Estate Association** as a Makati project / management entity.

Source:
- https://www.century-properties.com/wp-content/uploads/2026/01/CPG-Bonds-Revised-Preliminary-Prospectus-as-of-14-January-2026_-January-21-2026.pdf

### Reconciliation

Create a canonical organization:

- proposed ID: `century-city-estate-association`
- canonical name: **Century City Estate Association**

Do not add `Inc.` unless a corporate record or current official source supplies it.

The current `/estates` label **Century City Estate Association** is therefore supportable, but its present website points to general Century Properties / mall content rather than a dedicated association channel.

---

## 11. Rockwell Center

**Decision:** **SAFE, GEOMETRY LATER**

### Evidence

Rockwell Land's current site identifies **Rockwell Center Makati** as its flagship masterplanned development.

Sources:
- https://e-rockwell.com/location/makati/
- https://e-rockwell.com/rockwell-center-makati-when-twenty-something-still-feels-fresh-and-exciting/

Makati's official city profile states that **Rockwell Center in Barangay Poblacion** hosts commercial and business activities.

Source:
- https://www.makati.gov.ph/assets/uploads/downloads/143/17/pdf/14301122015121448.pdf

The current Barangay Poblacion page also identifies Rockwell Center as part of the barangay's modern development.

Source:
- https://www.makati.gov.ph/barangay/poblacion/34page?tab=1

### Reconciliation

Create:
- proposed ID: `rockwell-center`
- canonical name: **Rockwell Center**
- kind: mixed-use district
- barangay relationship: **Poblacion** based on current city sources

If later authoritative geometry shows the estate crossing into another barangay, the area model must support multiple barangays rather than forcing exclusive containment.

---

## 12. Rockwell Land Corporation

**Decision:** **SAFE**

### Evidence

Rockwell Land's current site and PSE disclosures identify **Rockwell Land Corporation** and its principal office at Rockwell Center.

Sources:
- https://e-rockwell.com/contact-us/
- https://edge.pse.com.ph/companyInformation/form.do?cmpy_id=635

### Reconciliation

Create a canonical organization relationship:

- proposed ID: `rockwell-land-corporation`
- canonical name: **Rockwell Land Corporation**
- role: developer / principal public-facing Rockwell Center organization

### Important correction

The current `/estates` page names **Rockwell Center Association, Inc.**

No authoritative current source located in this reconciliation confirms that exact organization name.

Therefore:

**Rockwell Center Association, Inc. → REFERENCE-ONLY / DO NOT CANONICALIZE YET**

Do not repeat it as a verified association until a corporate / estate source is found.

Use Rockwell Land's official channel for public-facing district information in the meantime.

---

# Residential village areas and associations

## 13. Bel-Air Village / Bel-Air Village Association

**Decision:** **SAFE, GEOMETRY LATER**

BAVA's official site identifies:
- **Bel-Air Village Association**;
- Bel-Air Village as a subdivision developed by Ayala Development Corporation;
- SEC registration in 1957;
- four phases, 950 lots and 32 streets;
- total land area of 787,234 square meters.

Sources:
- https://www.bava.ph/
- https://www.bava.ph/about-us

Canonical records:
- area ID: `bel-air-village`
- organization ID: `bel-air-village-association`
- organization name: **Bel-Air Village Association**
- abbreviation: **BAVA**

Keep **Bel-Air Village** separate from **Barangay Bel-Air**.

---

## 14. Dasmariñas Village / Dasmariñas Village Association, Inc.

**Decision:** **SAFE, GEOMETRY LATER**

DVA's audited financial statements identify the organization as:

**Dasmariñas Village Association, Inc.**

They state that it is a non-stock, not-for-profit organization serving owners, lessees and occupants of properties in **Dasmariñas Village, Makati City**, and refer separately to **Dasmariñas Village Subdivision**.

Sources:
- https://dva.org.ph/wp-content/uploads/2025/06/DVA-AFS-2023-and-2022.pdf
- https://dva.org.ph/contact-us/

Canonical records:
- area ID: `dasmarinas-village`
- organization ID: `dasmarinas-village-association`
- canonical organization name: **Dasmariñas Village Association, Inc.**
- abbreviation: **DVA**

Keep the managed village separate from **Barangay Dasmariñas**.

---

## 15. Forbes Park / Forbes Park Association, Inc.

**Decision:** **SAFE, GEOMETRY LATER**

The current FPA site identifies Forbes Park as a private residential community in Makati and states that it is managed by **Forbes Park Association**.

Its published articles of incorporation give the corporate name:

**Forbes Park Association, Inc.**

and describe the Forbes Park Subdivision boundaries.

Sources:
- https://www.forbesparkassociation.com/
- https://www.forbesparkassociation.com/about
- https://www.forbesparkassociation.com/copy-of-about-us

Canonical records:
- area ID: `forbes-park-village`
- display name: **Forbes Park**
- organization ID: `forbes-park-association`
- canonical organization name: **Forbes Park Association, Inc.**
- abbreviation: **FPA**

Keep the private subdivision / managed village concept distinct from the government barangay, even where their names overlap.

---

## 16. San Lorenzo Village / San Lorenzo Village Association

**Decision:** **SAFE, GEOMETRY LATER**

The current MySLV portal identifies:
- **San Lorenzo Village Association**;
- San Lorenzo Village as a residential community established in June 1954;
- more than 700 residential lots.

Source:
- https://www.myslv.ph/

Canonical records:
- area ID: `san-lorenzo-village`
- organization ID: `san-lorenzo-village-association`
- canonical organization name: **San Lorenzo Village Association**
- abbreviation: **SLVA**

Do not add `Inc.` without a source that supplies it.

Keep San Lorenzo Village separate from **Barangay San Lorenzo**.

---

## 17. Urdaneta Village / Urdaneta Village Association, Inc.

**Decision:** **SAFE identity; public channel unresolved**

The Supreme Court E-Library identifies:
- **Urdaneta Village, Makati City**;
- **Urdaneta Village Association, Inc.** as its duly organized homeowners' association.

Source:
- https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/65203

A City Government of Makati directory also lists **Urdaneta Village, Association, Inc.** at Urdaneta Village.

Source:
- https://www.makati.gov.ph/assets/uploads/downloads/576/417/pdf/57607072015144517.pdf

Canonical records are safe:
- area ID: `urdaneta-village`
- organization ID: `urdaneta-village-association`
- canonical organization name: **Urdaneta Village Association, Inc.**
- abbreviation: **UVA**

Current official public website / advisory channel: **not verified**.

Do not use a Google Maps result as the organization's official website.

---

## 18. Magallanes Village / Magallanes Village Association, Inc.

**Decision:** **SAFE identity; public channel unresolved**

Supreme Court jurisprudence identifies:
- **Magallanes Village, Makati City**;
- **Magallanes Village Association, Inc.**
- deed restrictions requiring owners in the covered lots to be association members.

Source:
- Supreme Court E-Library / Philippine Reports, Metro Properties, Inc. v. Magallanes Village Association, Inc.
  - https://elibrary.judiciary.gov.ph/assets/pdf/philrep_ebooks/Volume_510.pdf

Canonical records are safe:
- area ID: `magallanes-village`
- organization ID: `magallanes-village-association`
- canonical organization name: **Magallanes Village Association, Inc.**
- abbreviation: **MVA**

Current official public website / advisory channel: **not verified**.

Do not promote the current Google Maps search link into an official organization website.

---

# Poblacion reuse and corrections

## 19. Barangay Poblacion

**Decision:** **REUSE EXISTING GOVERNMENT GEOGRAPHY**

Do not create a second canonical `Poblacion district` just because visitor pages use the word as a neighborhood.

The current official barangay profile already describes Poblacion as:
- Makati's original settlement;
- current government center;
- a heritage and commercial area;
- home to Rockwell Center and Century City.

Source:
- https://www.makati.gov.ph/barangay/poblacion/34page?tab=1

Visitor-facing references to Poblacion should ultimately resolve to the existing BetterBarangay / government geography unless a future sourced subdistrict is intentionally defined.

---

# Current BetterMakati relationships to remove or downgrade

## A. MACEA → Poblacion

**Decision:** **REMOVE / DO NOT PROPAGATE**

W5-3a1 found MACEA listed on BetterPoblacion.

The current source reconciliation supports:
- MACEA operations in Salcedo / Bel-Air;
- MACEA operations in Legazpi / San Lorenzo;
- broader Makati CBD coordination with Bel-Air, San Lorenzo and Urdaneta.

No authoritative source reviewed supports using **MACEA as a Poblacion estate association**.

Remove this BetterPoblacion association unless a later primary source establishes a real MACEA-managed area inside Poblacion.

## B. Rockwell Center Association, Inc.

**Decision:** **DOWNGRADE**

The exact association name on the current Estates page is not sufficiently sourced.

Use:
- **Rockwell Center** as the area;
- **Rockwell Land Corporation** as the verified developer / public organization;

until the exact estate-association legal identity is sourced.

## C. Century City website relationship

**Decision:** **KEEP AREA; FIX ORGANIZATION / CHANNEL SPLIT**

Century City is a verified area and Century City Estate Association is a verified organization, but the association does not currently have a verified dedicated public website in the reviewed source set.

Do not use Century City Mall news as if it were the association's official advisory channel.

## D. Circuit public channel

**Decision:** **KEEP AREA + CMEA; PUBLIC CHANNEL VIA AYALA LAND ESTATES**

CMEA is a verified corporate entity through Ayala Land filings.

Until a current dedicated CMEA portal is found, public estate information should link to Ayala Land Estates / Circuit Makati rather than implying a public CMEA website.

---

# Canonicalization decisions after W5-3a2

## Safe area records for W5-3b

1. `makati-cbd` — Makati Central Business District
2. `ayala-center` — Ayala Center
3. `salcedo-village` — Salcedo Village
4. `legazpi-village` — Legazpi Village
5. `circuit-makati` — Circuit Makati
6. `century-city` — Century City
7. `rockwell-center` — Rockwell Center
8. `bel-air-village` — Bel-Air Village
9. `dasmarinas-village` — Dasmariñas Village
10. `forbes-park-village` — Forbes Park
11. `san-lorenzo-village` — San Lorenzo Village
12. `urdaneta-village` — Urdaneta Village
13. `magallanes-village` — Magallanes Village

Reuse rather than duplicate:
- `barangay:poblacion`

All area records should initially allow **no polygon**. Geometry is a separate evidence field and must not be fabricated from a center point.

## Safe organization records for W5-3b

1. `makati-central-estate-association` — Makati Central Estate Association, Inc. (MACEA)
2. `ayala-center-estate-association` — Ayala Center Estate Association, Inc. (ACEA)
3. `circuit-makati-estate-association` — Circuit Makati Estate Association, Inc. (CMEA)
4. `century-city-estate-association` — Century City Estate Association
5. `rockwell-land-corporation` — Rockwell Land Corporation
6. `bel-air-village-association` — Bel-Air Village Association (BAVA)
7. `dasmarinas-village-association` — Dasmariñas Village Association, Inc. (DVA)
8. `forbes-park-association` — Forbes Park Association, Inc. (FPA)
9. `san-lorenzo-village-association` — San Lorenzo Village Association (SLVA)
10. `urdaneta-village-association` — Urdaneta Village Association, Inc. (UVA)
11. `magallanes-village-association` — Magallanes Village Association, Inc. (MVA)

Hold:
- **Rockwell Center Association, Inc.** — insufficient authoritative evidence in this pass.

---

# Relationship decisions safe for W5-3b

- Ayala Center → within Makati CBD
- Ayala Center → managed by ACEA
- Salcedo Village → within Makati CBD
- Salcedo Village → related to Barangay Bel-Air
- Salcedo Village → MACEA operations documented
- Legazpi Village → within Makati CBD
- Legazpi Village → related to Barangay San Lorenzo
- Legazpi Village → MACEA operations documented
- Circuit Makati → related to Barangay Carmona
- Circuit Makati → managed by CMEA
- Century City → related to Barangay Poblacion
- Century City → estate association: Century City Estate Association
- Rockwell Center → related to Barangay Poblacion
- Rockwell Center → developer / official public organization: Rockwell Land Corporation
- Bel-Air Village → managed by BAVA
- Dasmariñas Village → managed by DVA
- Forbes Park → managed by FPA
- San Lorenzo Village → managed by SLVA
- Urdaneta Village → managed by UVA
- Magallanes Village → managed by MVA

Do not yet encode:
- exact area polygons;
- MACEA as exclusive manager of all Makati CBD;
- MACEA → Poblacion;
- Rockwell Center Association, Inc.;
- any village boundary equal to its same-named barangay boundary.

---

# W5-3a2 outcome

W5-3a1 started with 14 candidate geographies and 10 candidate organizations.

After source reconciliation:

- **13 new area identities are safe to canonicalize**;
- **Poblacion should reuse the existing barangay identity**;
- **11 organization identities are safe to canonicalize**;
- **ACEA is a newly discovered missing organization**;
- **Rockwell Center Association, Inc. is not sufficiently verified and should be held**;
- **MACEA → Poblacion should be removed rather than propagated**;
- area geometry remains deliberately unresolved until separately sourced.

## Next micro-step

**W5-3b1 — introduce the canonical Area + Organization registry schema without changing page presentation yet.**

The schema should support:
- area records without fake centroids or polygons;
- multi-barangay relationships;
- area hierarchy (`within-area`);
- managing / developer organizations;
- authoritative organization channels;
- place → area relationships;
- provenance per relationship.
