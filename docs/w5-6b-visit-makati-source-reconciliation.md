# W5-6b — Visit / Explore Makati source reconciliation

Reviewed: 2026-09-28

## Status

**Complete.**

This pass reconciles the existing six curated visitor starting points and the
two visitor-resource handoffs. It also applies the product decision made after
W5-6a: this feature survives only as a **city-orientation and exploration
layer**, not as a generic tourism, restaurant, shopping or commercial
directory.

The public route may remain `/visit` for compatibility, but the content model
should increasingly behave like **Explore Makati**: explain how a useful,
durable starting point connects to Makati's places, barangays, areas, history,
heritage, mobility and current activity.

## Reconciled starter set

### 1. Ayala Museum

**Decision: keep as a canonical Place-backed visitor starting point.**

Canonical identity:
- Place: `ayala-museum`

Current first-party evidence:
- Ayala Foundation's current museum booking system is publishing September and
  October 2026 museum-visit slots.
- Ayala Foundation also publishes the museum's Makati address and contact
  information.

Sources:
- https://events.ayalamuseum.org/
- https://ayalafoundation.org/contact-us/

Evidence rule:
- the visitor card may say that the museum is currently receiving visitors;
- do not freeze admission prices or operating hours into the visitor-curation
  record because current first-party pages expose differing presentation of
  visit windows/hours and these are operationally volatile;
- direct the user to the current museum/booking source for visit details.

### 2. Ayala Triangle Gardens

**Decision: keep as a canonical Place-backed visitor starting point.**

Canonical identity:
- Place: `ayala-triangle-gardens`

Current first-party evidence:
- the current Ayala Triangle site publishes the Gardens as a landscaped public
  space in the Makati CBD;
- it currently publishes an operating-hours field and visitor guidelines.

Source:
- https://www.ayalatriangle.com/gardens

Evidence rule:
- identity, visitor role and garden character are safe for durable curation;
- hours remain a live/current-source field rather than a hard-coded
  BetterMakati promise.

### 3. Salcedo Saturday Market

**Decision: keep as a recurring visitor experience, not a new canonical Place.**

Canonical anchors:
- Place: `jaime-velasquez-park`
- Area: `salcedo-village`
- Barangay context: Bel-Air

Current evidence:
- the market's first-party Facebook identity is
  https://www.facebook.com/SalcedoCommunityMarket/;
- current 2026 secondary indexing and event coverage show continuing Saturday
  operation and recent temporary-location notices;
- recent material demonstrates why schedule and location cannot be treated as
  permanently static: the market temporarily moved for a one-day shared-street
  setup in August 2026 before returning.

Corroboration:
- https://whatsonmnl.com/event/salcedo-saturday-market

Evidence rule:
- model the market as a **recurring experience** anchored to its normal
  canonical park/area context;
- keep exact weekly schedule and temporary location changes behind a live
  first-party/current-source handoff;
- do not create a second "Salcedo Market Place" solely to support Visit Makati.

### 4. Legazpi Sunday Market

**Decision: keep as a recurring visitor experience, not a new canonical Place.**

Canonical anchor:
- Area: `legazpi-village`

Nearby canonical Places may be cross-linked for context, but must not be
misrepresented as the market venue.

Current evidence:
- first-party Facebook identity:
  https://www.facebook.com/legazpisundaymarket/
- current 2026 secondary/current-map sources continue to identify the market as
  a Sunday operation in Legazpi Village;
- current sources place it at the Corinthian Carpark / Paseo de Roxas area,
  rather than inside a canonical park Place.

Corroboration:
- https://whatsonmnl.com/event/legazpi-sunday-market
- https://www.waze.com/fil/live-map/directions/ph/ncr/makati-city/legazpi-sunday-market?to=place.ChIJ6bzx3g3JlzMRaYZRn-QVC2o

Evidence rule:
- keep the recurring-market identity and live source;
- do not infer a canonical Place or park containment from proximity;
- keep exact schedule/location in the live handoff.

### 5. Poblacion

**Decision: keep, but migrate the visitor identity to the existing Barangay.**

Canonical identity:
- Barangay: `poblacion`

Current official evidence:
- the City Government's current Barangay Poblacion page describes it as
  Makati's cultural and heritage district, the historic seat of government,
  and a present commercial/business location.

Source:
- https://www.makati.gov.ph/barangay/poblacion/34

Evidence rule:
- visitor curation should add an exploration summary to the canonical barangay
  identity;
- do not create a parallel "Poblacion visitor district" record;
- do not hard-code a nightlife/business directory. Commercial discovery stays
  live/external.

Recommended visitor framing:
**Historic civic and cultural core, with heritage sites and contemporary
commercial activity.**

### 6. Greenbelt

**Decision: replace the standalone Greenbelt starter with canonical Ayala Center
orientation in W5-6c.**

Current first-party evidence:
- Ayala Malls has an active Greenbelt destination page and live mall
  navigation/directory;
- Ayala Land's 2025 Integrated Report and 2026 corporate materials document
  Greenbelt's continuing redevelopment/reopening cycle.

Sources:
- https://www.ayalamalls.com/main/malls/ayala-greenbelt/
- https://ir.ayalaland.com.ph/wp-content/uploads/2026/04/ALI-2025-Integrated-Report.pdf

Why replace it:
- the current visitor card uses "Greenbelt" as a broad shopping/lifestyle
  destination;
- the Civic Place Registry has `greenbelt-park`, which is only the landscaped
  park and must not be treated as the entire commercial complex;
- BetterMakati already has canonical `ayala-center` Area identity, which is a
  more durable city-orientation concept and can still link externally to
  Greenbelt for live shopping/dining discovery.

Migration target:
- Area: `ayala-center`
- optional Place cross-links: `ayala-museum`, `greenbelt-park`
- external live discovery: Greenbelt / Ayala Malls

This is the clearest application of the Explore-Makati principle: orient the
user to the city area first, then hand volatile commercial discovery to the
operator.

## Visitor-resource handoffs

### Make It Makati

**Decision: keep as a supplemental first-party estate/destination guide.**

The site remains active and presents Ayala Center, Makati CBD, Circuit Makati
and Ayala Triangle as exploration destinations.

Source:
- https://makeitmakati.com/

BetterMakati should continue to resolve the corresponding internal Area IDs
first, then expose Make It Makati as a live external resource.

### Official Makati Web Portal

**Decision: keep as an official-city handoff, but demote it from a featured
visitor recommendation.**

The portal is active and exposes a Visitors section, city/barangay information,
events and official content.

Source:
- https://www.makati.gov.ph/

Its value on Explore Makati is authority, not destination discovery. In the
page rebuild it should sit in a compact official-resources/footer treatment
rather than compete visually with curated city experiences.

## Resulting W5-6c starter architecture

The current six-card list should migrate into six **orientation/experience
records**:

1. Ayala Museum — canonical Place
2. Ayala Triangle Gardens — canonical Place
3. Salcedo Saturday Market — recurring experience anchored to Place + Area
4. Legazpi Sunday Market — recurring experience anchored to Area
5. Poblacion — canonical Barangay
6. Ayala Center — canonical Area, replacing standalone Greenbelt

Greenbelt remains discoverable from Ayala Center as a live external commercial
destination, not a duplicate canonical city object.

## Product boundary carried forward

W5-6 will **not** build or maintain:

- restaurant lists;
- café lists;
- bar/nightlife directories;
- hotel directories;
- mall tenant directories;
- shopping-store inventories;
- parking;
- "top 10" recommendation rankings.

Those are volatile commercial discovery jobs. BetterMakati's differentiator is
the relationship between **place, area, barangay, history, heritage, mobility,
events and civic context**.

Live Google/first-party discovery remains available when a user wants current
commercial options.

## Next micro-step

**W5-6c — visitor-curation model and migration.**

Build a lightweight orientation/experience schema that references canonical
Place, Area and Barangay identities rather than copying their names,
coordinates or civic facts. Model the two weekend markets as recurring
experiences with live-source handoffs. Replace the standalone Greenbelt starter
with canonical Ayala Center while preserving Greenbelt as external discovery.
