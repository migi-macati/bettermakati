# W5-6e — Explore Makati cross-links and Search pass

Reviewed: 2026-09-28

## Status

**Complete.**

The Explore Makati product role is now aligned across the page, global
navigation, homepage and Search.

## Navigation

The main navigation label is now **Explore Makati** while the stable route
remains `/visit`.

Its first child deep-links to **City starting points** rather than repeating a
generic "Places to Go" label.

The footer uses the same Explore Makati name.

## Homepage

The old visitor-directory framing is removed.

The homepage section now says:

> Understand the city as you explore it

Its main paths are:

- Explore Makati;
- Getting around;
- What’s On;
- Heritage & history.

Its compact shortcuts now point to:

- Areas & districts;
- Barangays;
- Cinemas.

The old **Eat & drink** and **Parking** shortcuts are gone. This also removes the
last homepage link to the cancelled Parking feature.

## Search

Search no longer maintains a second hand-written list for canonical Explore
destinations.

Ayala Museum, Ayala Triangle Gardens, Poblacion and Ayala Center are already
searchable through their canonical Place, Barangay and Area registries, so the
Visit-group duplicates were removed.

Search now owns only the Explore-specific layer:

- the Explore Makati landing page;
- the two recurring market experiences, generated from
  `visitorExperiences`;
- Heritage, History, Mobility, Cinemas and What’s On handoffs;
- visitor resources generated from `visitorResources`.

Recurring market results deep-link to stable
`/visit#explore-{experience-id}` anchors.

This keeps Search aligned with the same data model used by the public page.

## Cross-link audit

The Explore page explicitly connects into:

- Civic Map through canonical Place identity links;
- Areas & Districts;
- Barangays;
- Heritage;
- History;
- Mobility;
- What’s On.

The page continues to separate live commercial/place discovery from canonical
BetterMakati context.

## Guard

`check:visitor-curation` now reads the page, navigation, homepage and Search in
one cross-surface check.

It prevents:

- Visit Makati naming from drifting back into navigation/Search;
- the old Poblacion dining/nightlife Search framing;
- duplicate Visit-group search records for canonical Places;
- Eat & drink / Parking homepage shortcuts;
- any `/parking` homepage return;
- loss of the main Explore cross-links.

## Next micro-step

**W5-6f — QA and closure.**

Run the bounded closure audit for Explore Makati: identity deduplication,
source freshness, canonical cross-links, responsive/readability invariants,
external-discovery boundaries and no Parking regression.
