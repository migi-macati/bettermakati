# W6-4e — Loop and redundancy audit

Status: complete  
Reviewed: 2026-09-29

## Purpose

Close the original W6-4e scope by distinguishing useful bidirectional civic journeys from redundant loops and duplicated handoffs.

The machine-readable audit is in `data/wave6-relationship-loop-audit.json`.

## Definitions

A **useful bidirectional journey** moves the user into a genuinely different civic context and lets them return without losing record identity or scope.

A **redundant loop** sends the user to another surface that adds no material context, or routes them back to a generic domain despite BetterMakati already knowing the exact record.

## Removed or replaced patterns

### Generic official-profile domain links

Removed.

Official profiles no longer link generically to Accountability, Legislation and Public Records as if those domains contain office-specific records.

Only explicit graph relationships are shown.

### Report → Calendar title-search loop

Replaced.

A known report-release timeline item now uses an exact timeline-item anchor instead of rediscovering itself through title search.

### Repeated hardcoded ecosystem URLs

Centralized.

BetterGov and BetterLGU destinations now belong to `src/data/ecosystemResources.ts` where they can carry a single purpose and evidence-boundary note.

### Civic Asset “Related public records”

Renamed to **Related accountability records**.

The old label was broader than the actual destination family.

## Retained patterns

### Statistics national context at two levels

Retained.

The economy section provides indicator-relevant national data continuation. The page footer provides broader national datasets, visualizations and price benchmarks.

These are different next questions rather than duplicate blocks.

### BetterBarangay quick actions and civic-information hub

Retained.

The top quick actions are task-first entry points. The later civic-information section is a domain-first navigation hub on a long barangay homepage.

Some destinations repeat, but the placement and user intent differ.

### Official ↔ Elections

Retained.

The Elections page gives race context; the official profile gives office/profile context. Exact anchors make the round trip specific rather than circular.

### Report ↔ Calendar

Retained.

The report owns analysis. The Calendar owns time context.

### Accountability ↔ Civic Asset

Retained.

The Accountability Ledger owns the public record. Civic Asset owns place context.

### About ecosystem orientation vs domain-specific national context

Retained.

About explains the wider civic ecosystem. Domain pages expose only the national continuation relevant to that task.

BetterLGU remains on About instead of appearing as a generic cross-LGU link throughout BetterMakati.

## Closure result

- 4 redundant or misleading patterns removed, replaced or renamed;
- 6 layered/bidirectional patterns retained with explicit rationale;
- 0 unresolved loop/redundancy findings.

## Rule going forward

Do not remove a repeated destination merely because its URL appears twice.

Remove it when the repeated link serves the **same user question in the same context**.

Retain it when the same destination serves a materially different task, page layer or civic context and the relationship is clear to the user.
