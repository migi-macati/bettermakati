# W6-4a — Orphan / dead-end audit

Status: complete  
Scope: canonical public route surface on `main` after W6-3h  
Purpose: find pages that cannot be reached naturally or leave a user with no useful next step before Wave 6 expands the relationship model.

## Decision rule

W6-4a distinguishes two different failures:

- **Orphan** — no reasonable inbound path from a canonical hub, parent page, workflow, search result or contextual relationship.
- **Dead end** — the page is discoverable, but after completing its primary task there is no logical continuation.

Global navigation, Footer and Page Help are recovery mechanisms. They do not by themselves make a dead-end page well connected.

The opposite mistake is also a failure: a page should not receive a generic “related links” block merely to increase link count. Cross-links must answer a plausible next question.

## Audit result

The audit covers all **51 substantive public route patterns** in `src/App.tsx`.

Excluded from the product-surface count:

- four compatibility redirects: `/parking`, `/whats-on`, `/reports/makati-overview`, `/transparency`;
- the catch-all 404 route.

Result:

- **0 critical orphans**
- **1 genuine dead end fixed**
- **3 intentional terminal / exit surfaces**
- component-owned navigation on Search and Reports verified so they are not false positives

The route list is frozen in `data/wave6-orphan-dead-end-audit.json`. The guard fails when a new canonical route appears without being added to the audit.

## Fixed: Cinemas

`/cinemas` was already discoverable from Explore Makati, so it was not an orphan.

It was a dead end inside BetterMakati: every page action went to a showtime source, venue site or external map. Once a user chose a cinema, the natural next questions were how to get there and what is nearby.

The page now hands off to:

- **Getting around Makati** → `/mobility`
- **Explore Makati** → `/visit`

This is intentionally small. W6-4c can add richer page-family relationships where the civic model supports them.

## Intentional terminals

Three surfaces are allowed to end without a BetterMakati-specific continuation:

### Hotlines

The task is urgent contact. The correct completion is a phone call or official external channel. Forcing a user into more internal browsing would be counterproductive.

### Privacy and Terms

These are policy pages. The global shell is enough for recovery. A local related-links module would be decorative rather than task-driven.

## False positives avoided

### Search

`Search.tsx` itself contains no route links because `ServiceSearch` owns the result navigation. This is component-owned continuation, not a dead end.

### Reports

`Reports.tsx` delegates report links to `ReportTeaser`. The page source therefore looks link-light even though the rendered page routes into report articles.

The same principle applies across dynamic/detail families: the audit evaluates the rendered journey and parent ownership, not raw `<Link>` counts alone.

## Weak but discoverable surfaces

`/contact`, `/open-government`, `/community-tools` and `/status` remain secondary by design. They have valid inbound paths and useful role-specific handoffs, so W6-4a does not promote them into first-order navigation.

## Guardrail

`check:wave6-orphan-dead-ends` now runs in both `build` and `quality`.

It checks:

- all substantive App routes are represented in the audit;
- compatibility redirects and the 404 are excluded correctly;
- there are no unresolved critical orphans;
- the Cinemas fix remains intact;
- intentional terminal classifications remain explicit;
- Search and Reports still delegate continuation to their shared components;
- the guard remains registered in both build pipelines.

Browser coverage checks the repaired Cinemas handoff and the intentional external completion on Hotlines.

## Closure condition

W6-4a is closed when the route-coverage guard, build/quality pipeline and browser smoke are green on the final commit.

## Next

**W6-4b — civic relationship model**

Move from “no orphan/dead-end” to a consistent model for which civic objects should relate to which other objects, and why, before adding page-family cross-links.
