# W5-6d — Explore Makati page rebuild

Reviewed: 2026-09-28

## Status

**Complete.**

The public `/visit` route is now presented as **Explore Makati**: a city
orientation layer over BetterMakati rather than a conventional tourism or
commercial directory.

## Hero

The page now leads with:

> Understand the city as you explore it.

The first actions point to:

- city starting points;
- the city-context layer;
- live discovery;
- Mobility;
- What’s On.

The old "Eat & drink" hero path is removed because commercial discovery is no
longer the primary product proposition.

## City starting points

The six curated records are no longer presented as one undifferentiated list.

### Canonical destinations

The four durable identities appear first:

- Ayala Museum;
- Ayala Triangle Gardens;
- Poblacion;
- Ayala Center.

Each card identifies whether its canonical identity is a Place, Area or
Barangay, and links into BetterMakati's own context before exposing current
external links.

### Recurring experiences

The two weekend markets are presented separately as schedule-sensitive recurring
experiences:

- Salcedo Saturday Market;
- Legazpi Sunday Market.

Their cards keep canonical area/place anchors visible while current schedules
and temporary-location information remain behind live source links.

## Explore by layer

A new dark-green orientation section makes the integration role explicit.

Users can move from the starter set into:

- Areas & Districts;
- Barangays;
- Heritage;
- History;
- Getting Around;
- What’s On.

This is the core reason the feature exists: it exposes relationships among
BetterMakati datasets rather than trying to outperform a commercial directory.

## Live discovery

`PlacesExplorer` is moved out of the primary curated-starting-point layout and
into a clearly secondary **Live discovery** section.

The page explains why: restaurants, cafés, shops and nightlife change quickly.
Live place sources handle those listings; BetterMakati retains the durable city
context.

Current events, cinemas and Mobility are available beside the live search.

## External resources

Make It Makati and the Official Makati Web Portal remain at the bottom as
source/handoff resources, not peer recommendations competing with the curated
city starting points.

## Removed page patterns

The rebuild removes:

- the old "Plan your visit" card section;
- the separate "Culture & History" card section;
- the standalone "Food & Places" restaurant CTA;
- the hero "Eat & drink" shortcut.

Those functions are now integrated into the city-layer and live-discovery
sections without duplicating them.

## Guard

The existing `check:visitor-curation` now also checks the W5-6d presentation
markers and prevents the removed tourism-directory patterns from returning.

## Next micro-step

**W5-6e — cross-link and Search pass.**

Update Search/navigation/homepage language where needed so Explore Makati is
described consistently as an orientation layer, then audit its links into Civic
Map, Areas, Barangays, Mobility, What’s On, Heritage and History.
