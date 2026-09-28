# W5-7R5 — Makati Calendar UI and selectors

Reviewed: 2026-09-28

## Status

**Complete at repository level.**

R5 replaces the public **What’s On** entertainment/event surface with the
**Makati Calendar** civic-time experience.

Primary route: `/calendar`

Compatibility: `/whats-on` redirects to `/calendar`.

The old `WhatsOn.tsx` page is removed.

## Public product

The page answers:

> **What’s coming up, what changed, and what was just published across Makati
> civic life.**

It is explicitly not an entertainment calendar and reads only canonical/native
Civic Timeline projections. Internal source-review candidates remain excluded.

## Views and filters

The three views are **Now & Next**, **Recently Published** and **Archive**.

Recently Published uses a rolling 45-day publication window. Superseded records
always go to Archive.

URL-addressable filters cover topic, barangay, actionability, text search and
from/to dates. A barangay view includes both barangay-scoped and citywide items.

## Provenance

Every card exposes its source-backed date, civic-time kind, actionability,
geography where available, canonical BetterMakati owner and original primary
source.

Empty states remain honest rather than filling gaps with entertainment or raw
monitor signals.

## Site reconciliation

Today navigation, footer, Search and homepage now use **Makati Calendar**.

Explore Makati retains a cross-domain Calendar link for civic context but no
longer treats it as live entertainment discovery.

The public sitemap/static metadata now use `/calendar`; `/whats-on` remains
only as a router compatibility redirect.

## Reusable selectors

`src/data/civicTimelineViews.ts` owns view classification, sorting and filter
helpers so R6 can distribute identical civic-time logic into Today,
BetterBarangay and canonical domain pages.

## Guard

`check:makati-calendar` is wired into both build and quality.

## Deployment note

The current Vercel project is build-rate-limited, so this step does not claim a
fresh deployment or live-browser pass.

## Next micro-step

**W5-7R6 — internal distribution** into Today, BetterBarangay, Legislation,
Elections, Accountability, Reports/Statistics/Public Records and Search.
