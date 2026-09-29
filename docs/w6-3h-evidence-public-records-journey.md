# W6-3h — Evidence / Public Records journey

Status: complete  
Scope: P1 “I want the original public record or evidence behind a claim” journey  
Depends on: W6-0c core journey matrix, W6-3b homepage information architecture, W6-3f/3g canonical-door patterns

## Decision

**Public Records** at `/records` is BetterMakati’s primary evidence index.

It is not the only route to evidence. Factual pages should continue to link directly to their original sources when those links are already known. Public Records provides the reusable catalog layer that connects a source to the BetterMakati pages, claims and analyses that use it.

The journey therefore has three distinct objects:

1. **BetterMakati factual context** — a page, statistic, ledger item, legislation entry, report or other synthesis.
2. **BetterMakati source catalog entry** — metadata that identifies the source, publisher, period, format and where BetterMakati uses it.
3. **Original publisher evidence** — the public document, dataset, archive or portal itself.

## Changes

### Public Records explains its role

The evidence index now explicitly distinguishes:

- **BetterMakati evidence index** — catalog pages that describe and connect sources.
- **Original evidence** — the publisher record to use when the original document/data matters.

The existing record cards continue to support both paths:

- **View record** for BetterMakati metadata/context.
- **Open source** for the publisher evidence.

### Record detail distinguishes metadata from evidence

Every `/records/:id` page now states that it is a **BetterMakati catalog entry** and is not the original record.

The publisher link remains the primary **Open original source** action.

### Evidence can return to civic context

The former “Where this source appears” section is now framed as:

**Where BetterMakati uses this source**

Its links are labeled **Open BetterMakati context**, making the return journey from evidence to analysis or civic context explicit.

The detail page also exposes **Browse the evidence index** as a stable return route.

### Factual-page source handoffs remain intact

W6-3h preserves and guards existing source behavior:

- Page Help provides **Browse source records** plus the page-specific correction flow.
- Statistics links directly to PSA/source tables where available.
- Legislation links official documents/archive entries and related Public Record entries.
- Accountability exposes its source evidence directly.
- Home exposes Public Records as a first-order **Public action & evidence** job.

## Guardrails

W6-3h does not:

- imply that BetterMakati owns or republishes an issuing body’s authoritative record;
- replace direct primary-source links with unnecessary internal detours;
- treat secondary/contextual sources as official records;
- turn Public Records into another accountability homepage;
- redesign the visual evidence system reserved for Wave 7;
- manufacture a source relationship where the data model does not already support one.

## Verification

`check:wave6-evidence-journey` is registered in both `build` and `quality`.

The guard checks:

- first-order homepage evidence entry;
- Public Records catalog/original-source distinction;
- record-detail metadata/evidence/context distinction;
- Page Help source/correction handoff;
- direct source behavior in Legislation, Accountability and Statistics;
- global discoverability of Public Records.

Browser coverage verifies:

Home → Public Records → BetterMakati record detail → original publisher source / BetterMakati context.

It also checks that a factual page can enter the evidence index through the shared Page Help source-record handoff.

## Closure condition

W6-3h is closed when the repository guard, build/quality pipeline and browser journey test are green on the final commit.
