# W5-4f1 — Canonical mobility systems presentation

Reviewed: 2026-09-28

## Status

**Complete.**

The first Mobility-page rebuild batch removes the hand-maintained top-level
transport cards and renders the system/service layer from canonical mobility
data.

## What changed

The page now reads the four canonical records in `mobilitySystems.ts`.

Public transport is presented separately from private local service:

- MRT-3 — public transport system;
- EDSA Busway — public transport system;
- Pasig River Ferry Service — public ferry service;
- Century City Shuttle — private estate shuttle.

This makes the public/private distinction visible without duplicating service
identity, descriptions or lifecycle claims inside the page.

## One Ayala

One Ayala remains a physical `transport-terminal` Place, not a mobility
system.

The top-level One Ayala card now comes from the canonical Place Registry and
links to BetterMakati's internal Place record.

The previous Google Maps search card is removed.

## Source handoff

Each canonical mobility service chooses a current source/service link from its
own record.

The old EDSA Busway card linked to `edsabus.com`. That duplicate manual link
is removed; current-service authority now comes from the canonical system
record.

Schedules, fares and live route changes are still left to live operator/service
sources instead of being frozen into page copy.

## Review date

The Mobility page review date is now **2026-09-28**.

## Guard

`check:mobility-page` verifies that:

- public and private service cards are derived from `mobilityServices`;
- the public/private distinction is explicit;
- One Ayala is resolved through the canonical Place Registry;
- the internal One Ayala Place link is present;
- stale `transitLinks`, the old EDSA Busway third-party authority link and the
  old One Ayala Google Maps card do not return;
- the page review date is current.

The guard runs in both `build` and `quality`.

## Next micro-step

**W5-4f2 — canonical route/corridor presentation.**

Expose the 67 canonical mobility-route records without inventing geometry:

- current bus/P2P/UV services from One Ayala;
- reconciled jeepney corridors;
- unresolved historical jeepney rows clearly separated from current evidence.

Keep route geometry optional and do not turn route records into map pins.
