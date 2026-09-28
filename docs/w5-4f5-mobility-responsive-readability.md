# W5-4f5 — Mobility responsive and readability pass

Reviewed: 2026-09-28

## Status

**Complete.**

The expanded Getting Around page now has a bounded mobile/readability treatment
so the canonical mobility inventory does not become a wall of cards.

## Mobile navigation

The page-level section navigation and route-view controls now:

- use horizontal overflow on narrow screens instead of stacking into a tall
  block;
- keep controls at touch-friendly minimum height;
- return to wrapping on wider screens.

## Route filtering

The 67-record route registry now has a local filter for the active view.

It searches canonical route identity fields only. It does not perform live
routing or invent route stops.

Changing the query resets progressive disclosure so filtered results start in a
bounded state.

## Progressive disclosure

Each route view shows at most **12** cards by default.

When more records match, the page exposes a single **Show all** / **Show fewer**
control with an explicit “showing X of Y” count.

This mainly shortens the 17 bus/P2P and 35 jeepney views on phones and avoids
rendering every result as equally prominent.

## Evidence density

Current bus/UV source links now sit inside an **Evidence & limits** disclosure.

Jeepney current-evidence links sit inside the existing evidence disclosure.

The factual evidence remains available without giving every route card several
always-visible links.

## Long labels

Route cards now use min-width and word-break guards so long origin/destination
labels do not force desktop-width layouts on small screens.

## Guard

`check:mobility-page` now verifies the local filter, 12-record display cap,
progressive disclosure, mobile overflow treatment and collapsed evidence
presentation.

## Next micro-step

**W5-4g — QA and closure.**

Audit the whole mobility stack for lifecycle, duplicate lists, evidence/source
freshness, route geometry separation, Search/Civic Map integration and
responsive page invariants before closing W5-4.
