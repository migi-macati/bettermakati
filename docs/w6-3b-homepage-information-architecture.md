# W6-3b — Homepage Information Architecture

Status: complete  
Scope: homepage information hierarchy and journey launchers only  
Depends on: W6-3a homepage priority citizen jobs

## Decision

The homepage now follows the citizen-job hierarchy rather than product/feature count.

Rendered order:

1. Hero search and priority chooser
2. Common services
3. Public action and evidence
4. Participation
5. Explore Makati
6. Featured Reports & Insights
7. Statistics / city comparison
8. City imagery

BetterBarangay remains a first-order local entry in the Hero chooser.

## Priority behavior

### Tier A

The Hero exposes urgent help and Services directly. Search remains universal.

### Tier B

The Hero exposes Today, public action/evidence, Participation and BetterBarangay before users enter lower-priority depth content.

The homepage body reinforces:
- Accountability
- Projects & budget
- Public records
- Participation

Today remains the current-information synthesis door through the Hero chooser rather than competing with Calendar, City Monitor, Civic Briefs, News or Live Makati as equal homepage cards.

### Tier C

Explore remains a first-order city-use journey but appears after service/action journeys.

Featured reports, statistics and city imagery are intentionally lower in the page so research and context do not delay urgent/service/action tasks.

## Community Tools

Community Tools no longer owns a standalone homepage section.

Relevant tools are discovered through the citizen journey they support:
- Saan Ako Lalapit? through Services / service-help paths
- Today through current civic information
- Accountability through public action/evidence
- Participate through civic participation/reporting
- Civic Map through contextual public-place/reporting flows

## Guardrails

W6-3b does not:
- perform the Wave 7 visual redesign;
- add a new homepage product family;
- revive standalone Parking Finder or generic entertainment-events promises;
- replace the existing Search or BetterBarangay context model.

## Verification

The W6-3b guard checks:
- priority chooser ownership;
- required civic journey links;
- retirement of superseded feature-family homepage blocks;
- source order from Services through imagery;
- inclusion in both build and quality.

Browser QA additionally checks that the rendered section order follows the same hierarchy.
