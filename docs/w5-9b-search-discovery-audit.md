# W5-9b — Search & discovery audit

Reviewed: 2026-09-28

## Status

**Complete.**

W5-9b checks whether Wave 5 content can actually be found after all of the canonicalization, migrations and retired-surface work.

The audit covers four discovery paths:

- homepage Search;
- desktop/mobile navbar Search;
- the dedicated `/search` page;
- task-oriented navigation and aliases.

## What Search already did well

The shared Search layer already indexes:

- services;
- 23 BetterBarangay profiles;
- elected officials and government offices;
- verified Civic Registry places, segments and routes;
- 13 canonical Areas and 11 canonical Organizations;
- 4 mobility systems, 67 route records and 7 explicit transfer/hub relationships;
- Statistics indicators;
- Integrity entities;
- Featured Reports;
- History entries;
- recurring Explore Makati experiences and visitor resources;
- canonical civic-timeline records;
- lazy legislation records when a query is long enough.

It also already deduplicates by `canonicalKey`, keeps the full legislation browser lazy, and uses BetterGov/BetterLGU only as no-result handoffs.

## Fixes made

### Calendar discovery

The retired `/whats-on` route already redirects to Makati Calendar, but Search did not explicitly preserve the old mental model.

Makati Calendar now carries aliases for:

- What’s On / what is on;
- event / events;
- upcoming;
- happenings;
- schedule.

This is aliasing only. The retired What’s On page/result is **not** restored.

### Explore Makati discovery

Explore Makati now carries stronger user-language aliases:

- Visit Makati;
- visitor guide;
- tourist / tourism;
- things to do;
- sights;
- destinations.

This makes the renamed surface easier to recover without reintroducing the old visitor-directory model.

### News discovery

Makati in the News now also matches current-affairs/current-events language and common update wording.

### Canonical result identity

Stable Search keys were added for:

- History entries;
- Barangays;
- Civic Registry places/segments/routes.

This makes deduplication deterministic and prepares Search for future timeline/relationship enrichment without title-based collisions.

### Organizations filter

Canonical estate associations, homeowners associations, developers and property managers were previously folded into the **Government** Search tab.

That was semantically wrong.

Search now has a dedicated **Organizations** filter. The Government tab is again limited to government entities and government contacts.

### Explore navigation

The Explore Makati dropdown now exposes **Areas & Districts** directly.

This gives users a navigation path to the canonical area registry without requiring them to know it is also filed under City.

## Search architecture retained

Search remains deterministic and inspectable:

- exact title and prefix matches rank strongly;
- keyword and description matches contribute scores;
- token-level fuzzy matching helps with ordinary misspellings;
- canonical keys suppress duplicates;
- legislation remains lazy;
- civic-timeline terms enrich canonical records where possible.

W5-9b does **not** add opaque AI/semantic ranking.

## BetterGov / BetterLGU

The current pattern remains correct.

When local Search has no match, users may:

- search national services on BetterGov;
- find another LGU on BetterLGU;
- report a missing BetterMakati result.

Neither external ecosystem is cloned into the local Search index.

## Retired surfaces

### What’s On

Retired. Search aliases point to Makati Calendar.

### Parking

Still removed. No dedicated Search result is restored.

The old `/parking` URL remains a compatibility redirect to Explore Makati only.

## Guard

New gate:

`check:wave5-search-discovery`

It protects:

- homepage/navbar/Search entry points;
- Wave 5 canonical result coverage;
- legacy aliases;
- canonical keys;
- organization filtering;
- Areas & Districts Explore navigation;
- BetterGov/BetterLGU fallback-only behavior;
- retired Parking and What’s On boundaries.

## Next

**W5-9c — Responsive, accessibility & visual QA.**
