# W5-6f — Explore Makati QA and closure

Reviewed: 2026-09-28

## Status

**Closed at repository level with the live-commercial boundary preserved.
Fresh deployment and live-browser verification remain unverified.**

## What W5-6 now is

Explore Makati is a **city-orientation layer**.

It helps a person begin with a durable place, district or recurring city
experience, then move into BetterMakati's deeper civic context:

- Civic Map / canonical Places;
- Areas & Districts;
- Barangays;
- Heritage;
- History;
- Mobility;
- What’s On.

It is not a general tourism or business directory.

## Closure counts

The final curation layer contains:

- **13 reviewed sources**
  - 8 first-party;
  - 2 official-government;
  - 3 current-secondary;
- **6 curated experiences**
  - 4 canonical destinations;
  - 2 recurring market experiences;
- **2 external visitor resources**.

The four canonical destinations are:

1. Ayala Museum → Place;
2. Ayala Triangle Gardens → Place;
3. Poblacion → Barangay;
4. Ayala Center → Area.

The recurring experiences are:

1. Salcedo Saturday Market → Jaime C. Velasquez Park + Salcedo Village;
2. Legazpi Sunday Market → Legazpi Village.

## Identity QA

Closure confirms:

- no legacy `visitorPlaces` list;
- no separate visitor copy of Ayala Museum or Ayala Triangle identity;
- no separate visitor-district object for Poblacion;
- no standalone Greenbelt canonical visitor record;
- no Parking record or public Explore-Makati parking link.

Greenbelt remains a live external commercial-discovery handoff from canonical
Ayala Center and is not conflated with Greenbelt Park.

## Search QA

Search now indexes only the Explore-specific layer.

Canonical Places, Areas and Barangays remain discoverable through their own
registries rather than duplicate Visit-group records.

Explore-specific Search entries cover:

- the Explore Makati landing page;
- the two recurring markets;
- the two visitor resources;
- the existing Heritage, History, Mobility, Cinemas and What’s On handoffs.

The two market results deep-link to their stable Explore card anchors.

## Live-discovery boundary

Restaurants, cafés, shops and nightlife remain in `PlacesExplorer`.

That component calls the live places endpoint when enabled and otherwise sends
the same query to Google Maps.

Its results are never promoted into the Place Registry, visitor-curation data
or Search index.

This boundary is intentional: BetterMakati owns durable civic context; live
providers handle volatile commercial listings.

## Responsive/readability QA

The Explore page retains:

- horizontally scrollable hero navigation on narrow screens;
- single-column base grids;
- larger multi-column layouts only at responsive breakpoints;
- touch-friendly primary links;
- collapsed evidence/current-source details on curation cards;
- separate visual hierarchy for durable city starting points, recurring
  experiences, city-context layers and live discovery.

## Bounded work

W5-6 deliberately does not maintain:

- restaurant/café/bar/hotel/shop directories;
- mall-tenant inventories;
- hard-coded recurring-market schedules and temporary locations;
- a standalone Greenbelt commercial-complex entity;
- parking.

A new item should enter Explore Makati only when it is a durable city
orientation/experience with defensible sources and an appropriate canonical
anchor.

## Deployment verification

The latest Vercel deployment reports failure.

The available Vercel connector still cannot retrieve the build logs for this
deployment, so this closure does **not** claim a successful fresh production
deployment or live-browser QA pass.

The failure is not attributed to W5-6 without build-log evidence.

## Reopen only for a named capability

Future Explore Makati work should reopen W5-6 only for a concrete improvement,
such as:

- a new durable city experience with strong sourcing and canonical identity;
- stronger/current evidence for an existing recurring experience;
- a useful new cross-surface civic-context relationship;
- successful fresh deployment and live-browser verification.

Do not reopen it merely to grow a tourism or commercial directory.
