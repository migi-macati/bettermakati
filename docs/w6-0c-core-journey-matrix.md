# W6-0c — Core Journey Matrix

Status: complete  
Scope: repository `main`, following W6-0a baseline and W6-0b route/feature inventory  
Purpose: define the citizen journeys BetterMakati must support end-to-end before Wave 6 changes information architecture, homepage priorities, search, cross-linking and analytics.

## 1. Journey design rule

BetterMakati should organize itself around **what a person is trying to do**, not around the internal feature names that happen to exist.

A successful journey has four parts:

1. **Entry** — the person can recognize where to start from Home, global navigation, search, a barangay page, or an external/deep link.
2. **Orientation** — the first page explains the task and distinguishes adjacent tools without requiring prior knowledge of BetterMakati terminology.
3. **Evidence / action** — the person reaches the useful record, guide, place, official channel, source, report flow or contribution action.
4. **Next step** — the page gives the logical adjacent action without forcing the person back to Home or into a circular set of links.

Search and BetterBarangay context are cross-cutting layers across these journeys, not separate destinations a user must understand first.

## 2. Priority model

- **P0 — must never fail:** emergency escalation and high-use public-service discovery.
- **P1 — core product:** frequent civic, local, accountability, participation and city-use journeys that define BetterMakati.
- **P2 — depth / research:** valuable analytical, historical and platform-trust journeys that should remain discoverable without competing with P0/P1 entry points.

Priority describes product criticality, not the civic importance of a topic.

## 3. Core journey matrix

| ID | Priority | User job | Best starting door | Canonical path / completion | Important handoffs | Current risk / Wave 6 question |
| --- | --- | --- | --- | --- | --- | --- |
| **J1** | **P0** | **I need urgent help or an emergency contact.** | Top utility bar, search, Saan Ako Lalapit? emergency warning | `/hotlines` or direct 911 / official emergency channel | City Hall / official emergency services | Strong top-level escape exists. Ensure every assistance/reporting flow distinguishes emergency vs non-emergency and never buries 911. |
| **J2** | **P0** | **I need to get a government service done.** | Home search, Services, homepage common services, Saan Ako Lalapit?, barangay page | service guide/document → responsible office/place → official transaction channel | `/government-offices`, barangay context, BetterGov/national-service handoff | Strong feature set, but `/government-offices` is weakly surfaced. Search zero-result behavior currently falls back to Saan Ako Lalapit? even when a sitewide query may not be a service need. |
| **J3** | **P1** | **I want information about my barangay and what applies locally.** | Home barangay selector, global BetterBarangay selector, Barangays | `/barangays/:slug` with scoped services, places, officials, projects, statistics, records and timeline | services, Civic Map, Projects & Budget, Accountability, Statistics, Participate | BetterBarangay is already a strong cross-site layer. W6 must ensure context survives logical handoffs and that citywide data is not presented as local merely because a barangay is selected. |
| **J4** | **P1** | **What is happening in Makati now, soon, or recently?** | Today | `/today` → relevant civic date, monitor record, brief, news item, advisory or calendar item | City Monitor, Civic Briefs, News, Calendar, Live Makati, Hotlines | Largest overlap cluster. The user should not need to know the difference between six feature brands before finding the relevant current information. Today should behave as the primary synthesis door. |
| **J5** | **P1** | **I want to understand Makati government, officials, legislation or elections.** | City, search, related civic records | `/government`, `/officials/:slug`, `/legislation`, `/elections` | Public Records, City Monitor, Calendar, Statistics, Reports | Distinct surfaces are justified, but cross-links need to answer natural follow-up questions: who is responsible, what was enacted, when did it happen, where is the source, what is the election record. |
| **J6** | **P1** | **I want to follow public money, a project, procurement, an audit finding or a public commitment.** | Accountability, homepage Projects & money, search | `/accountability` or `/projects-budget` → evidence/source → later status/outcome | Public Records, Integrity, Reports, Civic Timeline, related place/barangay | Major overlap inside Accountability. The entry point should start from the object being followed, not require citizens to choose between internal concepts such as ledger vs budget vs integrity first. |
| **J7** | **P1** | **I want the original public record or evidence behind a claim.** | Search, Page Help “Source records”, Accountability/Legislation/Reports links | `/records` → `/records/:id` or directly linked first-party source | Legislation archive, Integrity, Accountability, Statistics exports | Strong evidence architecture. Need consistent “source” handoffs from factual pages and clear distinction between BetterMakati synthesis and original/public records. |
| **J8** | **P1** | **I want to find, understand, visit or travel through a place in Makati.** | Explore Makati, search, Civic Map, barangay page | `/visit` / `/estates` / `/mobility` / `/heritage` / civic asset page → location/context/directions/source | History, barangay, Civic Map, mobility network, external live maps/current listings | Strong underlying place graph but overlapping doors. Explore should curate city understanding; Civic Map should serve civic/public-place context; Mobility should handle movement. Copy still promises retired “parking” and generic “events” as standalone capabilities. |
| **J9** | **P1** | **I have a local problem, suggestion, observation or participation need.** | Participate, barangay page, Civic Map, Saan Ako Lalapit? | official opportunity OR `/civic-map/report` OR civic asset contribution OR `/get-involved` submission | Makati Action Center, official consultations, community-input tracking, civic audit | Participation is appropriately task-based, but the user must understand whether they are contacting government, contributing evidence to BetterMakati, reporting a public-place issue, or suggesting a BetterMakati feature. Those are different outcomes. |
| **J10** | **P1** | **I know roughly what I need, but not which BetterMakati section contains it.** | Hero/site search, navbar search | direct ranked result → useful page/detail | Saan Ako Lalapit? only when the unresolved intent is genuinely service/help oriented | Search is already broad and fuzzy. Current zero-result fallback to Saan Ako Lalapit? is too service-specific for research, place, accountability or historical queries. W6-2 should provide intent-neutral recovery first. |
| **J11** | **P2** | **I am researching Makati and need statistics, history, reports, comparable data or reusable records.** | City, Search, related-record links | `/statistics`, `/history`, `/reports`, `/records`, `/legislation` → source/export/related civic record | city comparison, report relationships, public records, civic timeline, BetterGov ecosystem | Depth is strong, but these pages must cross-link around the research question rather than remain separate data silos. |
| **J12** | **P2** | **Can I trust this page, how current is it, and how do I correct it?** | Page-level source/review context, Page Help, footer | source/date → `/status` / methodology → correction/source submission | Public Records, Get Involved, GitHub where appropriate | Page Help already gives a consistent correction/evidence path. Avoid turning every page into a platform sermon; trust cues should stay concise and task-relevant. |

## 4. Canonical door decisions

These are the default doors Wave 6 should reinforce.

### Services

**Canonical door:** `/services`  
**Fallback for unclear service needs:** `/community-tools/saan-ako-lalapit`

`/government-offices` is supporting infrastructure: useful when a citizen needs a location/contact, but it should not compete with task-oriented service discovery.

### Current Makati

**Canonical door:** `/today`

Roles beneath it:

- **Today** — synthesis: what matters now.
- **Calendar** — dated civic items and future/past timeline exploration.
- **City Monitor** — granular official activity records.
- **Civic Briefs** — periodic editorial digest of monitored activity.
- **News** — external/current news discovery.
- **Live Makati** — live environmental/utility/advisory sources.

These should remain distinct but should not be presented as equivalent starting points for a general “what is happening?” question.

### City / civic intelligence

**Canonical door:** `/government` for institutional understanding; Search for known entities/topics.

Government, Elections, Statistics, Reports, Legislation, Estates and History remain distinct subject domains under the City family.

### Barangays

**Canonical door:** `/barangays` when no barangay is known; `/barangays/:slug` when it is.

BetterBarangay preference should continue to scope compatible citywide surfaces, but must never imply local-level data when the underlying record has no barangay attribution.

### Accountability

**Canonical door:** `/accountability` for “follow this public action/resource”; `/projects-budget` for explicit budget/fiscal/project questions.

Public Records, Integrity and Open Government remain evidence/methodology adjacencies, not competing general accountability homepages.

### Participation

**Canonical door:** `/participate` for “I want to take part / report / contribute.”

- Government/service concern → official service or Action Center handoff.
- Local non-emergency place problem → Civic Map report flow.
- Place observation/improvement evidence → civic asset / audit workflow.
- BetterMakati correction/source/idea/volunteer/contact → Get Involved.

### Places / visiting

**Canonical door:** `/visit` for exploration; `/mobility` for movement; `/civic-map` for civic/public-place information.

Estates and Heritage are contextual layers that can be entered independently from City/Explore when the query is already specific.

### Research / evidence

**Canonical door:** Search for known terms; subject pages for broad exploration.

Public Records is the primary evidence index, not the only route to source material.

## 5. Entry-point coverage

The current homepage already covers most high-value journeys:

- site search → J2/J3/J4/J5/J6/J7/J8/J10/J11
- popular service starts → J2
- BetterBarangay → J3
- common services → J2
- civic records cards → J4/J6
- Explore Makati → J8
- statistics comparison → J11
- Community Tools → mixed J2/J4/J6/J9
- Get Involved → J9/J12

Two gaps should be handled in W6-3 rather than patched ad hoc now:

1. **Participation is not a first-order homepage job** even though it is a first-class global navigation family.
2. **Evidence / public records is present indirectly**, but the homepage does not clearly offer “find the source/record” as a citizen job outside the hero Capability Carousel.

## 6. Confirmed journey defects / promise drift

### D1 — retired Parking Finder still advertised as live

`src/data/communityTools.ts` still contains:

- **Parking Finder**
- status: **Live**
- href: `/parking`

But `/parking` is now only a compatibility redirect to `/visit`.

**Disposition:** remove the standalone live-tool promise in a later scoped cleanup. Parking information may still appear contextually where sourced, but BetterMakati no longer has a Parking Finder product.

### D2 — old What’s On tool still advertised as live

`src/data/communityTools.ts` still contains:

- **What’s On**
- status: **Live**
- href: `/whats-on`

But `/whats-on` redirects to the re-scoped Makati Calendar, whose value is civic dates, deadlines, publications, meetings, road closures, voter dates, reports/statistics publication and related dated civic records rather than generic entertainment-event discovery.

**Disposition:** retire or rewrite the tool card around the actual Makati Calendar capability.

### D3 — homepage Capability Carousel carries old visitor promise

“Visit or get around Makati” currently says:

> Transport, parking, events, food, heritage and places to go.

This overstates parking/event/food functionality as equal first-class capabilities.

**Disposition:** rewrite during W6-3 homepage journey alignment.

### D4 — README coverage statement is stale

README still says the site covers:

> visitor information, mobility, cinemas, parking, events, estates and community associations

**Disposition:** update documentation when the public-product copy is reconciled.

### D5 — site-search zero-result fallback is service-specific

`ServiceSearch` sends a zero-result sitewide search submission to Saan Ako Lalapit?.

That is sensible for an unresolved service need but not for a query such as an obscure historical place, council record, budget line, organization or report.

**Disposition:** W6-2 should implement neutral zero-result recovery, then offer Saan Ako Lalapit? as one contextual option.

### D6 — duplicate copy in Saan Ako Lalapit?

The page currently renders:

> Describe what you need. Describe what you need. Matches can show the service and a place to go.

**Disposition:** small content defect; fix during the relevant W6 service/journey implementation batch rather than opening a separate wave.

## 7. Journey success criteria for later QA

Wave 6 closure should test at least these concrete scenarios:

1. From Home, reach an emergency number without navigating through a report form.
2. Find a common city service, understand requirements and identify the responsible office/official channel.
3. Select a barangay, navigate to another compatible feature, and preserve the barangay context accurately.
4. Starting from “what is happening today?”, reach a dated source-backed civic item without having to choose between internal product brands first.
5. Find an elected official or legislation item and reach the underlying source/context.
6. Find a project/procurement/budget item and follow it into evidence, location/barangay context and later status where available.
7. From a factual page, reach the relevant public record/source and then return to civic context.
8. Find a Makati place, understand which barangay/area it belongs to, and reach relevant mobility/heritage/civic information.
9. Report a non-emergency local issue and understand whether the submission goes to government or to BetterMakati.
10. Search an unfamiliar term successfully; if there is no result, recover without being incorrectly forced into a government-service flow.
11. Research a Makati statistic/history topic and reach reusable/source material and related analysis.
12. Report a correction from any substantive page with the originating page prefilled.

These should become the backbone of W6-0e closure guards and W6-9 whole-product testing.

## 8. Implications for the next Wave 6 steps

### W6-0d — scope/defer register

Use this matrix to classify every discovered defect as:

- Wave 6 required
- Wave 7 visual redesign
- Wave 8 language
- data/source blocked
- future enhancement
- obsolete/remove

### W6-1 — information architecture

Optimize navigation around these canonical doors and user jobs, especially the four overlap clusters.

### W6-2 — search

Treat search as the universal “I know the subject but not the architecture” journey. Fix zero-result recovery and measure search gaps.

### W6-3 — homepage

Use this matrix, not feature count, to decide homepage prominence.

### W6-4 — relationships

Cross-links should implement the “next step” column of these journeys, not merely maximize link density.

### W6-7 — analytics

Measure journey progress and failure signals rather than raw pageviews alone.

## 9. W6-0c conclusion

BetterMakati already supports the required core journeys in substance. The remaining whole-product problem is **legibility**: choosing the right door, distinguishing adjacent tools, preserving context and making the next useful action obvious.

Wave 6 therefore should not add another general-purpose civic section unless a journey in this matrix cannot be completed with the existing product system.
