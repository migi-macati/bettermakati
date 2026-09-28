# W5-6c — Visitor curation model and migration

Reviewed: 2026-09-28

## Status

**Complete.**

The six Visit Makati starter cards now use a lightweight visitor-curation model
instead of a mixed list of canonical Places and hand-written destination
strings.

## Model

A visitor record is now one of two things:

- **canonical destination** — points to an existing BetterMakati Place, Area or
  Barangay identity;
- **recurring experience** — keeps its own event/experience name but must anchor
  to one or more canonical BetterMakati identities.

The visitor layer owns only visitor-facing curation: category, short summary,
source references, live external handoffs and tags.

It does not own canonical names, coordinates, barangay identity or area
identity.

## Migrated six-record set

Four canonical destinations:

1. Ayala Museum → Place `ayala-museum`
2. Ayala Triangle Gardens → Place `ayala-triangle-gardens`
3. Poblacion → Barangay `poblacion`
4. Ayala Center → Area `ayala-center`

Two recurring experiences:

5. Salcedo Saturday Market → anchored to Jaime C. Velasquez Park + Salcedo
   Village
6. Legazpi Sunday Market → anchored to Legazpi Village

The former standalone Greenbelt visitor record is gone. Greenbelt remains a
live external discovery link from the canonical Ayala Center orientation
record.

## Source model

The curation registry stores the W5-6b source set with a common review date of
2026-09-28.

Live operational information stays external:

- museum visit details;
- garden visitor information;
- market updates;
- market map listing;
- Greenbelt commercial discovery.

## Visitor resources

The two reconciled handoffs are now data records too:

- Make It Makati;
- Official Makati Web Portal.

Make It Makati retains internal links to the canonical Makati CBD, Ayala Center
and Circuit Makati Areas.

## Public page migration

The existing Visit Makati layout now consumes `visitorExperiences` and
`visitorResources`.

This is intentionally **not yet the W5-6d redesign**. The purpose of W5-6c is to
remove the old mixed identity architecture while preserving a working public
surface.

The page now resolves:

- Place identities to Civic Map details;
- Areas to Estates & Districts;
- Barangays to BetterBarangay pages;
- recurring experiences to their canonical anchors.

## Guard

`check:visitor-curation` now runs in both `build` and `quality`.

It protects:

- exactly six starter records;
- four canonical destinations + two recurring experiences;
- no standalone Greenbelt record;
- no Parking return;
- removal of the legacy `visitorPlaces` list;
- migration of the public page to the new model.

## Next micro-step

**W5-6d — rebuild the page as Explore Makati.**

Change the presentation from a conventional visitor page into an orientation
layer over BetterMakati: organize by durable city experiences and make the
connections to place, district, barangay, heritage, history, mobility and
current activity more obvious while keeping live commercial discovery
secondary.
