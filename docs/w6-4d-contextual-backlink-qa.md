# W6-4d — Contextual backlink QA

Status: complete  
Scope: representative two-way civic journeys after W6-4c  
Purpose: verify that relationship links land on the most useful canonical record or section, remove weak handoffs and prevent “correct page, wrong destination” regressions.

## QA rule

A backlink is not considered good merely because the destination page is correct.

When BetterMakati knows the exact canonical record, section or scoped result, the link must land there. Generic domain indexes are reserved for task continuation when no record-level identity exists.

## Fixes

### Official profile ↔ Elections

Before W6-4d, official profiles linked to the general 2025 election-results section.

Now:

- each elected result card/row has an official-specific anchor;
- the official relationship resolver targets `/elections#official-result-{slug}`;
- the elected name links back to `/officials/{slug}`.

The official profile also no longer presents generic Accountability, Legislation and Public Records indexes as if they were office-specific related records. Those links will return only when explicit canonical relationships exist.

### Report ↔ Statistics

Report evidence backlinks previously resolved all Statistics indicators to `/statistics`.

They now reuse the Statistics canonical destination map, so supported indicators land on their relevant section such as:

- population → `/statistics#population-trend`;
- GDP → `/statistics#economy-work`.

### Integrity → Public Records

Integrity relationships previously resolved an exact Public Record identity to the generic `/records` index.

They now resolve to `/records/{id}`.

### Legislation → Public Records / City Monitor

Fallback destinations now preserve exact canonical IDs:

- Public Record → `/records/{id}`;
- City Monitor record → `/city-monitor/{id}`.

A stored `relatedHref` still takes precedence when the canonical owner provides a more specific route.

## Representative journeys checked

1. **Statistics → Report → Statistics**  
   Indicator analysis opens the exact report; report evidence returns to the correct Statistics section.

2. **Accountability → Report / Integrity / Place → Accountability**  
   Record-level IDs and anchors remain intact in both directions.

3. **Legislation → Service / Public Record / City Monitor**  
   Typed relationships land on the exact service or record rather than a generic index where a detail route exists.

4. **Elections → Official → Election result**  
   The elected name opens the profile; the profile returns to that official’s exact result card/row.

5. **Report → Calendar → Report**  
   Report release opens an exact-title Calendar projection; the timeline card returns to the canonical report.

6. **Barangay → scoped civic domains**  
   BetterBarangay continues to preserve barangay scope for Statistics, Projects & Budget, Accountability and Civic Map.

7. **Place → Barangay / History / Accountability**  
   Civic Asset relationships keep exact place and record identity.

## Weak continuation removed

The official-profile “Related records” block formerly linked every profile to broad Accountability, Legislation and Public Records pages while claiming those records were connected to the office.

That implication was stronger than the data. W6-4d removes those generic handoffs.

The rule going forward is simple: exact related records appear when the graph can prove the relationship; otherwise the profile does not manufacture one.

## Guardrail

`check:wave6-contextual-backlinks` verifies that:

- official election links use official-specific anchors;
- official profiles do not restore unsupported generic record handoffs;
- Report → Statistics backlinks use the canonical Statistics destination map;
- Integrity Public Record links resolve to `/records/{id}`;
- Legislation Public Record / City Monitor fallbacks resolve to exact detail routes;
- Report ↔ Calendar remains reversible;
- the W6-4c page-family guard remains registered;
- the W6-4d guard runs in both `build` and `quality`.

## Closure condition

W6-4d is closed when its static guard passes and no code-level relationship destination is known to be more precise than the one rendered.

Vercel deployment verification remains externally blocked if the account build-rate limit is active; that hosting quota is recorded separately from code correctness.

## Next

**W6-4e — relationship UX consistency**

Standardize how relationship context is labelled and presented across page families, without forcing every domain into the same visual component.
