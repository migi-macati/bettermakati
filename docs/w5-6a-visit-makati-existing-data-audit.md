# W5-6a — Visit Makati existing-data audit

Reviewed: 2026-09-28

## Scope

Inventory the visitor-facing information already present in BetterMakati before
adding or expanding destinations, districts, markets, shopping, food or visitor
planning tools.

This is an **internal reconciliation step**. It does not promote a place merely
because it appears in a tourism list, a map search or an older visitor card.

Parking is no longer part of BetterMakati and is explicitly outside W5-6.

## Current Visit Makati architecture

The public `/visit` page currently has five layers:

1. an intent-based launch area;
2. six curated “Places to start” records from `visitMakati.ts`;
3. a live Google Places / Google Maps discovery component;
4. links to Mobility, Cinemas and What’s On;
5. visitor-resource and food-search handoffs.

This is a useful shell, but identity and provenance are inconsistent across the
six curated destination records.

## Current curated visitor records

`visitorPlaces` currently contains **6 records**.

### Already backed by canonical Place records

1. `ayala-museum` — Ayala Museum
2. `ayala-triangle-gardens` — Ayala Triangle Gardens

These should continue to reuse the Place Registry for name, location, address,
access classification, provenance and media.

### Standalone visitor strings

3. Salcedo Saturday Market
4. Legazpi Sunday Market
5. Poblacion
6. Greenbelt

These four are not currently represented through the same canonical identity
path as the first two.

That does **not** mean all four should become new Place records.

- Poblacion already exists as a canonical barangay and should normally reuse
  that identity rather than create a duplicate visitor district.
- Greenbelt is broader than the existing canonical `greenbelt-park` Place, so
  the shopping/lifestyle complex must not be silently equated with the park.
- Salcedo Saturday Market and Legazpi Sunday Market are recurring market
  activities tied to locations and schedules; source reconciliation must decide
  whether they belong as places, recurring events/markets, or visitor-only
  references.

## Source pattern

All six curated visitor records currently cite the same Department of Tourism
Makati destination page.

That is acceptable as discovery evidence, but it is too coarse to freeze
current operating details, exact locations, schedules, market recurrence,
shopping-complex scope or access conditions.

The next step should prefer current first-party or official sources for the
specific destination being presented.

## Canonical Area reuse already working

The “Make It Makati” visitor-resource card already resolves these canonical Area
IDs through the shared district-reference helper:

- Makati CBD
- Ayala Center
- Circuit Makati

This should be preserved.

Visit Makati should not reintroduce hand-maintained district strings where an
Area or Barangay identity already exists.

## Heritage data boundary

`visitMakati.ts` also contains **7 heritage-site presentation records**.

All seven point to canonical Place IDs and are consumed by the separate
Heritage page. They are not part of the six-item Visit Makati destination list.

W5-6 should avoid reworking those heritage records merely because they share a
file with visitor data. Heritage remains its own W5-2 concern unless a later
integration step only adds cross-links.

## Live discovery boundary

`PlacesExplorer` provides live search presets for:

- things to do;
- restaurants;
- cafés;
- markets;
- museums;
- parks;
- shopping;
- nightlife.

It calls the live places endpoint when available and otherwise hands the same
query to Google Maps.

This is the right role for volatile commercial discovery.

BetterMakati should **not** try to maintain a comprehensive static restaurant,
café, nightlife, shopping or business directory.

The curated visitor layer should instead answer: “What are useful, durable
starting points or city experiences that BetterMakati can explain well?”

## Current page strengths

Preserve:

- intent-first visitor navigation;
- canonical Place reuse where it already exists;
- canonical Area reuse for district context;
- live external discovery for volatile businesses;
- direct links to Mobility, What’s On, Cinemas, Heritage and History;
- image-led city presentation;
- Google Maps handoff rather than invented turn-by-turn directions.

## Current page weaknesses

### A. Curated identities are mixed

Two cards are canonical Places and four are local visitor strings.

The page therefore has no single identity/provenance rule for its curated
recommendations.

### B. Destination type is overloaded

The same list mixes:

- museum;
- market;
- district;
- park;
- shopping/lifestyle complex.

A visitor curation model should classify the editorial role without pretending
all five are the same entity type.

### C. Market recurrence is not modeled

Salcedo Saturday Market and Legazpi Sunday Market are schedule-dependent
visitor experiences.

Their names alone are not enough evidence for current recurrence, hours or exact
operating conditions.

### D. Greenbelt scope is ambiguous

The visitor card means the broader Greenbelt shopping/lifestyle destination,
while the canonical registry currently has Greenbelt Park as a specific Place.

Do not merge those identities without a sourced scope decision.

### E. Poblacion should reuse existing geography

Poblacion already has a canonical government-geography identity.

The visitor page should use that identity and add visitor-oriented context
rather than create another “Poblacion” object.

### F. Generic live results are not canonical records

PlacesExplorer results should remain ephemeral external results. They must not
be promoted into the Place Registry or Search merely because the API returned
them.

### G. Review date is behind the current Wave 5 work

The Visit page still says it was last reviewed on 2026-09-20.

Do not update that date until W5-6b actually reconciles its current visitor
sources.

## W5-6 architecture decision

Use **canonical identity + visitor curation**, not a second city-place database.

A visitor-curation record may add:

- visitor category / intent;
- short visitor-facing summary;
- editorial priority;
- canonical Place, Area or Barangay reference where available;
- a source for the visitor claim;
- optional live external discovery handoff.

It should not duplicate:

- canonical place name or coordinates;
- barangay identity;
- area identity;
- heritage facts;
- operating schedules that belong to live sources;
- generic business-directory results.

## Recommended W5-6 sequence

### W5-6b — current source reconciliation

Refresh the six existing curated visitor records and the two visitor-resource
handoffs.

Resolve:

- whether Salcedo Saturday Market is currently operating and at what canonical
  location;
- whether Legazpi Sunday Market is currently operating and at what canonical
  location;
- Poblacion’s visitor claim using the existing Barangay identity;
- Greenbelt’s visitor scope without conflating the complex with Greenbelt Park;
- current first-party/official sources for Ayala Museum and Ayala Triangle
  Gardens;
- current Make It Makati and official-city visitor-resource links.

Do not research a comprehensive restaurant or commercial directory.

### W5-6c — visitor-curation model and migration

Introduce a lightweight visitor-curation layer that references canonical Place,
Area or Barangay IDs where possible.

Migrate the reconciled six-item starter set without duplicating identity or
location data.

### W5-6d — Visit Makati page rebuild

Render curated starting points by visitor intent and evidence class.

Keep live PlacesExplorer for volatile discovery rather than expanding the
curated set into a directory.

### W5-6e — cross-link pass

Connect visitor starting points to:

- Civic Map / canonical Place details;
- Estates & Districts / Barangays where appropriate;
- Mobility;
- What’s On;
- Heritage / History;
- Search / Civic Intelligence.

### W5-6f — QA / closure

Audit:

- no duplicate place/district identities;
- no stale schedule claims;
- no return of the removed Parking feature;
- external discovery remains external;
- source freshness;
- mobile/readability;
- visitor → city-knowledge cross-links.

## Next micro-step

**W5-6b — authoritative/current source reconciliation for the existing six
curated visitor starting points and the two visitor-resource handoffs.**

Keep the batch bounded to the current page. Do not expand into a comprehensive
commercial directory.
