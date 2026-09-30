# W7-6a — Reports & Insights editorial treatment

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Polish the Reports landing page, reusable report teasers and report-article reading experience as one evidence-rich editorial family.

Machine-readable record:

`data/wave7-editorial-reports.json`

## Changes

- The Reports landing hero uses the Wave 7 green/gold editorial surface rather than a standalone dark block.
- Lead, card and carousel teasers now share the semantic surface, border and elevation vocabulary.
- Report-card gold accents are restrained to top rules and evidence emphasis.
- Report articles use the shared reading measure for prose, improving long-form rhythm while leaving dense local tables horizontally scrollable.
- Synthesis, analysis, stat, methodology, related-record and source blocks now have distinct but related evidence treatments.
- The back-to-reports control now meets the 44px interaction baseline.
- Hover lift is disabled when reduced motion is requested.

## Preserved

No report claims or evidence relationships were changed.

The slice preserves:

- headlines, subheadlines, synthesis and analysis text;
- source IDs and inline evidence links;
- canonical/public-record handoffs;
- methodology and limits;
- charts and tables;
- related civic records and calendar relationships.

## Guard

`check:wave7-editorial-reports` runs in both `quality` and `build`.

## Next

**W7-6b — History.**
