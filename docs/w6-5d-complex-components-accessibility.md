# W6-5d — Complex components

Status: complete-static-complex-components-live-browser-deferred  
Reviewed: 2026-09-29

## Purpose

Close the dense/compound interaction layer of Wave 6 accessibility work while preserving useful data density.

This package covers tables, carousels, maps and the full civic timeline. It does **not** try to make every dense table visually fit inside 320px. Where horizontal scrolling preserves the meaning of tabular data, BetterMakati now makes that scrolling explicit and keyboard-operable.

Machine-readable audit:

`data/wave6-complex-components-accessibility.json`

## Dense tables

### TableWithToggle

The shared table/list component now has:

- `type="button"` on both view controls;
- `aria-pressed` for selected view;
- 44px minimum control height;
- decorative icons hidden from assistive technology;
- a named, focusable horizontal scroll region around table mode;
- a user-safe fallback when list extraction is unavailable.

The old user-facing debug dump has been removed.

### Raw civic tables

The audit identified **14** raw horizontally scrollable civic tables:

- Statistics: 1;
- Projects & Budget: 7;
- Elections: 4;
- Integrity: 2.

All 14 now use:

- `className="scroll-region ... overflow-x-auto"`;
- `role="region"`;
- a descriptive `aria-label` that identifies the table and states that it is horizontally scrollable;
- `tabIndex={0}`.

Together with `TableWithToggle`, W6-5d therefore protects **15 dense-table scroll regions**.

### Focus and touch behavior

Shared `.scroll-region` CSS now provides:

- visible focus;
- horizontal overscroll containment;
- stable scrollbar gutter.

Interactive links/buttons inside dense table regions inherit a 44px minimum interaction height.

## Intentional horizontal strips

Not every horizontal scroller should itself become a Tab stop.

The following remain container-nonfocusable by design because they contain individually focusable controls:

- ServiceSearch category chips;
- History navigation strip;
- Mobility filter strips.

The child controls provide the keyboard path, and Mobility returns to wrapped/overflow-visible layout from `sm` upward.

## Photo carousel

`PhotoCarousel` now has:

- 44×44 photo selector buttons;
- `aria-pressed` on the selected photo;
- 44px fallback/source/credit/license links;
- existing 44px previous/next and play/pause controls retained.

The existing carousel hook already pauses rotation on interaction/focus and suppresses rotation under reduced-motion preference.

## Featured Reports carousel

Desktop and mobile **View all** handoffs now meet the 44px baseline.

Previous/next and pause/resume controls were already compliant.

## Homepage Start here selector

The preferred-barangay selector in the Start here capability panel now uses the 44px baseline.

## Maps

### CivicAreaContextMap

Existing strengths retained:

- titled interactive OSM iframe;
- 44px layer toggles with `aria-pressed`;
- textual district/estate and mobility links below the map.

Station/context links now also meet the 44px baseline.

### CivicMapEmbed

The interactive iframe keeps its title.

The **Open full map** fallback is now a 44px target.

### HeritageMap

The heritage map deliberately uses a non-interactive, `aria-hidden` background iframe. Canonical BetterMakati place links form the accessible interactive layer.

Each marker now exposes a 44px clickable/focusable area while retaining the smaller visual pin.

The external full-map fallback also meets the 44px baseline.

## Civic timeline

Calendar cards already had:

- large card layout;
- 44px location chips;
- 44px canonical-record and original-source actions.

W6-5d adds a polite live announcement for the filtered timeline-item count so changing filters/views is perceivable without visually rescanning the grid.

## Projects & Budget dense-data controls

The controls attached directly to the office, budget-line and procurement tables now use the 44px baseline.

Their filtered record counts use polite live status announcements.

## Deferred to W6-5f

Browser/device QA still owns:

- whether and where tables actually overflow at 320/390/768px;
- practical arrow-key/trackpad scrolling;
- OSM iframe focus transfer;
- real pause-on-focus and reduced-motion carousel behavior;
- computed focus/contrast behavior.

Screen-reader sampling of tables/maps remains part of W6-5e/W6-5f.

## Next

**W6-5e — Semantic & keyboard pass.**
