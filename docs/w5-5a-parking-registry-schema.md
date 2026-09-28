# W5-5a — Parking registry schema

Reviewed: 2026-09-28

## Status

**Complete. Schema only; verified facility inventory remains W5-5b.**

W5-5 starts by separating a durable parking data model from the current
Google-Maps-nearby helper on the public Parking page.

## Why parking needs its own registry

Parking facilities do not map cleanly onto the Civic Place registry. Many useful
facilities are privately operated mall, office, hotel or mixed-use-estate car
parks. They can still be useful visitor information without being treated as
civic assets.

The parking registry therefore remains a visitor-information layer that can
cross-link to canonical Areas and destination Places.

## Evidence states

Every operational field uses one of four explicit states: **verified**,
**reported**, **stale**, or **unknown**.

Unknown fields cannot carry hidden values or implied citations. Known fields
must carry a source and a YYYY-MM-DD evidence check date.

## Facility fields

The schema supports source-aware values for address and map point, operator,
lifecycle, access, vehicle types, operating hours, rate rules, capacity and EV
charging. It also supports links, aliases, tags and field-level provenance.

## Cross-links

Each facility can later point to canonical Area IDs and destination Place IDs.
These are navigation relationships only; they do not infer ownership,
management or containment.

## Current page behavior

W5-5a does not yet replace the Parking page's live map-search helper. Rates,
access and hours remain with each facility until W5-5b verifies a publishable
inventory.

## Guard

`check:parking-registry` is included in both `build` and `quality`.

## Next micro-step

**W5-5b — verify the parking inventory.**

Research current parking facilities from first-party property/operator sources
and official materials where available. Keep unknown or stale rates, hours,
access rules and vehicle support visibly unknown rather than filling gaps from
assumption.
