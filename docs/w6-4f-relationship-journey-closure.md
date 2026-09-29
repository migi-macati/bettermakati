# W6-4f — Relationship journey closure

Status: complete  
W6-4 status: complete  
Reviewed: 2026-09-29

## Purpose

Close W6-4 by testing representative relationship journeys as user journeys rather than isolated links.

A relationship is considered closed only when BetterMakati can:

1. explain why the linked item is relevant;
2. preserve the strongest available record identity;
3. land on the most specific supported destination;
4. provide a sensible way to continue or return;
5. remain usable on touch screens;
6. preserve evidence boundaries and scoped geography.

The machine-readable audit is in `data/wave6-relationship-journey-matrix.json`.

## Final fixes made in W6-4f

### Report → Calendar now uses exact timeline identity

The timeline relationship resolver previously opened the Calendar through a title search.

That was usable but weaker than the relationship graph itself.

W6-4f now gives every rendered Calendar item an exact anchor:

`#timeline-item-{timelineItemId}`

Report and other reverse timeline relationships target that anchor together with the correct Calendar view.

This removes title-search ambiguity and keeps the Calendar a time index of the same underlying civic record.

### Place → Accountability preserves record type

Civic Asset accountability backlinks now use:

`/accountability?type={recordType}#{recordId}`

rather than only the record fragment.

The destination therefore preserves both the exact record and the surrounding ledger filter.

### Elections → Official touch target

Elected-name profile links now have a 44px minimum interaction height and a visible underline.

This matters particularly in the council results table, where the previous inline text link could be too small as a mobile target.

### Integrity reverse links

Integrity → Accountability / Public Record / analysis relationship links now keep a 44px minimum interaction height while remaining compact enough for evidence tables.

## Representative journey matrix

### Statistics → Report → Statistics

Pass.

- forward relationship: typed indicator → report analysis;
- return relationship: report evidence → exact Statistics section;
- compact relationship controls meet the shared 44px minimum.

### Elections → Official → Election result

Pass.

- elected result names link to the matching official profile;
- profile relationship links return to the official-specific election-result anchor;
- identity is carried by the official slug rather than name matching.

### Report → Calendar → Report

Pass.

- report release resolves to an exact Civic Timeline item ID;
- Calendar card links back to the owning report;
- Calendar remains an index rather than a duplicate analysis page.

### Accountability → Place → Accountability

Pass.

- Accountability exposes an explicitly related place;
- Civic Asset exposes the related Accountability entry;
- return URL preserves Accountability type and exact record anchor.

### Accountability → Integrity → Accountability

Pass.

- Accountability exposes Integrity evidence only where the relationship exists;
- Integrity exposes the linked Accountability record;
- reverse links meet the 44px touch minimum.

### Legislation → Public Record → BetterMakati context

Pass.

- legislation resolves exact source identity to `/records/{id}`;
- Public Record detail shows where BetterMakati uses that source;
- source evidence and civic interpretation remain separate.

### Legislation → City Monitor → related civic record

Pass where an explicit relationship exists.

- legislation resolves an exact City Monitor record;
- City Monitor uses its owner-supplied `relatedHref` when available;
- the relationship is not inferred from topic or date.

### BetterBarangay → scoped civic domains

Pass.

Barangay scope is retained through `?barangay={slug}` when moving into:

- Statistics;
- Projects & Budget;
- Accountability;
- Civic Map;
- other sliceable barangay-aware routes.

The route helper preserves existing query parameters and fragments.

### Makati → BetterGov context

Pass as an intentional one-way continuation.

Statistics and Projects & Budget can open national BetterGov resources through controls explicitly labelled as national context.

This is not a two-way evidence relationship:

- BetterGov context is not proof of a Makati fact;
- BetterMakati does not control whether an external BetterGov page links back.

That exception is intentional and recorded in the audit matrix.

## Mobile and touch closure

The relationship system now uses a 44px minimum interaction height for:

- shared compact relationship controls;
- elected-official result links;
- Calendar geography and record controls;
- Integrity reverse relationship links;
- BetterMakati brand buttons.

Richer record cards remain full-card links with substantial padding rather than being converted into pills.

## Bounded exceptions

### External ecosystem resources

External national context remains intentionally one-way.

### Calendar projections

Calendar entries are not full duplicate records. Their job is to place existing civic records on a shared time axis and return the user to the owning record.

### Rich domain surfaces

Report related-record cards, Integrity evidence tables, Public Record context cards and Civic Asset relationship cards retain their richer layouts.

W6-4e’s compact component is a pattern for small continuations, not a universal relationship renderer.

## W6-4 closure

### W6-4a — orphan and dead-end audit

Complete.

### W6-4b — civic relationship model

Complete.

### W6-4c — page-family cross-links

Complete.

### W6-4d — BetterGov / BetterLGU ecosystem links

Complete.

The original ecosystem-link scope is closed in `docs/w6-4d-ecosystem-links.md`.

The contextual-backlink QA completed during the same phase remains as additional hardening in `docs/w6-4d-contextual-backlink-qa.md`.

### W6-4e — loop and redundancy audit

Complete.

The original loop/redundancy scope is closed in `docs/w6-4e-loop-redundancy-audit.md`.

The relationship-UX consistency pass completed during the same phase remains as additional hardening in `docs/w6-4e-relationship-ux-consistency.md`.

### W6-4f — relationship journey closure

Complete.

**W6-4 is closed.**

## Plan reconciliation

The original W6-4 sequence is now fully represented:

- 4a orphan/dead-end audit;
- 4b civic relationship model;
- 4c page-family cross-links;
- 4d BetterGov / BetterLGU ecosystem links;
- 4e loop / redundancy audit;
- 4f relationship QA and closure.

Contextual-backlink QA and relationship-UX consistency are retained as additional hardening rather than substitutes for the original 4d/4e scopes.

## Hosting status

Repository-level W6-4 guards can validate code and relationship contracts independently of hosting.

At the time of closure, Vercel deployment attempts remain blocked by the project/account build-rate limit. That quota condition is external to the W6-4 code closure and should not be interpreted as a reported application build failure.

## Next

Proceed to the next planned Wave 6 work package after W6-4. Recover the exact package from the Wave 6 plan before implementing it; do not infer a new scope from W6-4.
