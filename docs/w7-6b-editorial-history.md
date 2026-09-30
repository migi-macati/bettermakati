# W7-6b — History editorial treatment

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Polish the source-linked Makati history timeline as a long-form civic history experience without changing historical claims, evidence status or source relationships.

Machine-readable record:

`data/wave7-editorial-history.json`

## Changes

- The page uses the Wave 7 editorial canvas and a restrained gold intro rule.
- Heritage-collection context and the history search/filter panel now share semantic paper, accent and focus treatments.
- Timeline line, event dots and event cards read as one chronology.
- Evidence notes, interpretations, archival media, relationships and expandable source panels now have distinct but related visual roles.
- Media cards retain captions, source links and rights text close to each image or map.
- Person/institution/place/barangay reference chips remain compact, but interactive chips now satisfy the 44px target baseline.
- Wide desktop spacing improves while the existing narrow-screen timeline remains intact.

## Preserved

No historical content was rewritten.

The slice preserves:

- every event date, title, summary and note;
- evidence-status labels and evidence notes;
- source evidence level, format, locator and citation notes;
- archival media captions, rights and provenance;
- heritage-collection filtering;
- place, barangay, person, institution and related-event links;
- query, era, topic, order and primary-source filters;
- downloadable JSON results.

## Guard

`check:wave7-editorial-history` runs in both `quality` and `build`.

## Next

**W7-6c — Heritage.**
