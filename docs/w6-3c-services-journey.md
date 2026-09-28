# W6-3c — Services Journey

Status: complete  
Scope: P0 government-service discovery and completion journey  
Depends on: W6-0c core journey matrix, W6-1 navigation ownership, W6-2 search, W6-3a/3b homepage priorities

## Decision

The canonical government-service journey is:

1. enter through `/services` or a direct service result;
2. identify the task rather than guessing the office;
3. open the canonical BetterMakati service guide;
4. understand requirements, responsible agency and where to go;
5. continue to the issuing agency’s official source or transaction channel.

`/community-tools/saan-ako-lalapit` remains the fallback when the user cannot name the service.

`/government-offices` remains supporting infrastructure for users who need an office, location or contact. It does not replace task-first service discovery.

## Changes

### Services

The high-use “Start with” shortcuts now open canonical service guides for:

- new business permit;
- Yellow Card;
- Community Tax Certificate / Cedula;
- real property tax.

A directory search with no matching service no longer dead-ends. It now offers:

- clear search and filters;
- Saan Ako Lalapit?;
- Government Offices.

### Saan Ako Lalapit?

The duplicated orientation sentence was removed.

The page now states that matches can show the service, responsible office and place to go, and exposes direct handoffs to:

- the full Services directory;
- Government Offices.

Emergency handling remains separate and still routes to Hotlines rather than through the service finder.

### Service guide completion

Service guides now distinguish BetterMakati preparation from the official transaction.

When the directory entry points to an internal BetterMakati page, the final primary action is the official source, using the structured guide source when available and otherwise the directory source.

A related legacy/internal BetterMakati page may remain available as a secondary reference, but it no longer becomes the primary completion action.

Barangay-level service guides use the selected BetterBarangay directly when one is active instead of always sending users back to the barangay index.

### Government Offices

Government Offices now explicitly points back to:

- Services for task-first discovery;
- Saan Ako Lalapit? when the responsible office is unknown.

An office search with no result now offers a clear-search action and a return to service-by-task discovery.

## Guardrails

W6-3c does not:

- expand the service directory merely to increase counts;
- redesign service pages visually ahead of Wave 7;
- change the BetterBarangay data model reserved for W6-3d;
- turn Government Offices into a competing primary service homepage;
- replace official agency instructions with BetterMakati guidance.

## Verification

`check:wave6-services-journey` is registered in both `build` and `quality`.

The guard checks:

- canonical high-use guide starts;
- removal of the old bypass routes from the Services start shortcuts;
- service zero-result recovery;
- Saan Ako Lalapit? orientation and recovery links;
- official-source handoff from service guides;
- Government Offices task-first recovery.

Critical browser coverage also exercises the same path from Services through no-result recovery, Saan Ako Lalapit?, a structured business-permit guide, the official-source handoff and Government Offices.

## Closure condition

W6-3c is closed when the repository guard, build/quality pipeline and browser journey test remain green on the final commit.
