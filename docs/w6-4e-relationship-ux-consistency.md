# W6-4e — Relationship UX consistency

Status: complete  
Scope: user-facing presentation of evidence-backed cross-domain relationships  
Purpose: make relationship links understandable and consistent without flattening different civic relationships into one generic “related links” pattern.

## Decision

W6-4e standardizes the **small relationship-link pattern** and the **language used to describe relationships**.

It does not replace richer domain-specific interfaces such as:

- Report related-record cards;
- Civic Timeline previews;
- Civic Asset history/accountability blocks;
- project and procurement tables.

Those surfaces carry more context than a compact chip row and should keep their own layouts.

## Shared compact pattern

`src/components/civic/CivicRelationshipLinks.tsx` now owns the compact relationship-link treatment.

It provides:

- a required user-facing relationship label;
- consistent 44px minimum interaction height;
- internal-link arrows;
- external-resource indicators;
- primary, secondary and neutral semantic tones;
- optional framed treatment;
- a shared user-facing label map for Civic Intelligence record owners.

This is used only where the relationship is naturally a compact continuation from the current record.

## Relationship vocabulary

The UI now distinguishes relationship purpose instead of using “Related” for everything.

### Related analysis

Used when a report explicitly synthesizes the current civic record.

Examples:

- Statistics → Featured Reports;
- Accountability → Featured Reports.

### Related places

Used when the canonical data explicitly ties an Accountability record to a place.

### Integrity evidence

Used for the Integrity layer connected to an Accountability/procurement record.

### Related civic records

Used by Legislation when the typed graph can lead to services, places, Public Records or other civic records.

### Election record

Used on an elected-official profile for the exact stored election result linked to that person.

### Related accountability records

Used on Civic Asset pages for place-linked Accountability entries.

The previous label “Related public records” was too broad because these links specifically point to the Accountability Ledger.

### On the Makati Calendar

Used consistently for time-indexed views of civic records.

The public UI says “Open record,” not “Open canonical record.” Internal ownership remains part of the data model but is not exposed as implementation jargon.

### National context / National data context

Used for BetterGov and other external civic-data continuations.

These links provide national comparison or research context. Their presentation must not imply that they are evidence for a Makati-specific fact.

## Report record cards

Featured Reports keep their richer card layout because a report may synthesize several different civic record types.

W6-4e adds a visible record-type label to each card using the shared owner vocabulary, such as:

- Statistics
- Legislation
- Integrity
- Accountability
- Place
- External civic resource

External ecosystem cards say **Open external resource** rather than **Open record**.

## Calendar language cleanup

Relationship architecture remains strict internally, but public-facing Calendar copy no longer uses terms such as:

- canonical record;
- canonical owner;
- native canonical records;
- canonical publication-release record.

The Calendar now explains the citizen-facing behavior:

- dates come from reviewed civic records;
- each date links back to the record where the underlying information belongs;
- original sources remain available;
- unverified source leads are excluded until supported.

This preserves provenance without exposing implementation vocabulary.

## Pages standardized

W6-4e updates:

- Statistics;
- Projects & Budget;
- Accountability;
- Legislation;
- Official profiles;
- Featured Report articles;
- Civic Asset relationship wording;
- Makati Calendar;
- domain and barangay Calendar previews.

## Anti-patterns

Relationship UX must not:

- present an unlabeled group of links whose relationship is unclear;
- call an external comparison resource a Makati public record;
- use generic “Related records” when a more precise relationship label is available;
- expose internal data-model vocabulary when plain citizen language is sufficient;
- use the shared compact component for complex evidence that needs its own card, table or explanatory context;
- make different relationship types visually identical when the distinction affects interpretation.

## Guardrail

`check:wave6-relationship-ux` verifies that:

- the compact relationship component keeps internal/external handling and semantic tones;
- Statistics uses distinct analysis and national-context labels;
- Accountability labels place, integrity and analysis relationships separately;
- Legislation uses “Related civic records”;
- officials use “Election record”;
- Civic Asset uses “Related accountability records”;
- Projects & Budget presents BetterGov links as “National context”;
- report cards expose record type and distinguish external resources;
- Calendar relationship surfaces use “On the Makati Calendar” and “Open record”;
- selected public-facing implementation-jargon phrases do not return;
- the guard remains in both `build` and `quality`.

## Closure condition

W6-4e is closed when the relationship-UX guard passes alongside the W6-4b/c/d guards.

Deployment verification remains separately subject to the Vercel build-rate quota.

## Next

**W6-4f — relationship journey closure**

Run a final representative journey matrix across all W6-4 relationship families, verify mobile/touch behavior and link semantics, record bounded exceptions, and close W6-4.
