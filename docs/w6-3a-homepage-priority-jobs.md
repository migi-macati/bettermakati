# W6-3a — Homepage Priority Citizen Jobs

Status: complete  
Scope: BetterMakati homepage journey hierarchy only  
Source contract: W6-0c core-journey matrix and W6-0d scope/defer register

## 1. Decision

The BetterMakati homepage is a **journey launcher**, not a feature directory.

Homepage prominence must answer a citizen question:

> What are the few things someone is most likely to need BetterMakati to help them do?

Search remains the universal cross-cutting path for people who know the subject but not the site architecture. BetterBarangay remains the cross-cutting local-context layer.

W6-3b may reorder, combine, rename or reduce homepage sections to express the priority model below. W6-3a does **not** prescribe the final visual composition.

## 2. Frozen homepage job hierarchy

### HP1 — Get urgent help

**Priority:** P0  
**Journey source:** J1

A user must be able to recognize emergency help immediately and reach `/hotlines` or an official emergency channel without entering a reporting or participation flow.

Homepage implication:

- emergency access must be visible without requiring Search;
- emergency must not be buried inside a generic “Health” category only;
- reporting/community tools must never be mistaken for emergency dispatch.

### HP2 — Get a government service done

**Priority:** P0  
**Journey source:** J2

A user should be able to start from a common service, browse Services, search a known need or use Saan Ako Lalapit? when the service need is genuinely unclear.

Homepage implication:

- Services is the primary task family;
- a small number of common service starts are justified;
- `/government-offices` is a supporting handoff, not a competing homepage family;
- national-service handoffs belong downstream or in secondary recovery.

### HP3 — Go to my barangay

**Priority:** P1  
**Journey source:** J3

A user should be able to select or open a BetterBarangay edition and continue into compatible local services, places, officials, projects, statistics, records and civic information.

Homepage implication:

- BetterBarangay must remain an obvious first-order local entry;
- the homepage must not imply that all citywide records become barangay-local merely because a barangay is selected.

### HP4 — See what matters now

**Priority:** P1  
**Journey source:** J4

A user asking “what is happening?” should start with **Today**, not choose first between Calendar, City Monitor, Civic Briefs, News or Live Makati.

Homepage implication:

- `/today` is the synthesis door;
- Calendar, Monitor, Briefs, News and Live are supporting destinations;
- Home should not present all current-information products as equal competing cards.

### HP5 — Follow public action, money and evidence

**Priority:** P1  
**Journey sources:** J6 + J7

A user should be able to follow budgets, projects, procurement, audit findings or commitments and reach the evidence behind them.

Homepage implication:

- Accountability / Projects & Budget must be recognizable as a citizen job;
- **Public Records / find the source** must become a recognizable homepage journey, not remain only an indirect capability;
- evidence is a next step from factual claims, not a separate feature dump.

### HP6 — Participate, report or contribute

**Priority:** P1  
**Journey source:** J9

A user should be able to tell whether they are:

- contacting government about a service concern;
- reporting a non-emergency public-place issue;
- contributing an observation/evidence item to BetterMakati; or
- suggesting/correcting/contributing to BetterMakati itself.

Homepage implication:

- Participation must become a first-order homepage job;
- `/participate` is the canonical door;
- Get Involved remains BetterMakati-specific contribution infrastructure;
- Community Tools must not substitute for the Participation journey.

### HP7 — Explore or get around Makati

**Priority:** P1  
**Journey source:** J8

A user should be able to understand a place, district or barangay and move through the city.

Homepage implication:

- Explore Makati remains a first-order journey;
- `/visit` owns exploration, `/mobility` owns movement and `/civic-map` owns civic/public-place context;
- Estates and Heritage remain useful specific entries;
- retired Parking Finder and generic What’s On promises must not return as equal standalone homepage capabilities.

### HP8 — Research and understand Makati

**Priority:** P2  
**Journey source:** J11, with J5 as a subject-specific branch

Researchers and engaged residents should be able to reach statistics, history, reports, government, legislation, elections and reusable records without those depth functions crowding out P0/P1 tasks.

Homepage implication:

- statistics/reports/research remain visible;
- institutional government detail is reachable through City and Search;
- Home should prefer a small number of research/evidence doors over a subject-by-subject directory.

## 3. Cross-cutting layers, not homepage jobs

These are essential but should not become additional competing homepage families.

### Search

Search supports HP2–HP8 and remains the universal “I know roughly what I need” path defined by J10.

### BetterBarangay context

BetterBarangay can scope compatible journeys but does not convert unattributed citywide content into barangay data.

### Trust, freshness and corrections

J12 is implemented through source/date cues, Page Help, Status, correction/source submission and footer trust paths. It should not consume first-order homepage space.

### Government / officials / legislation / elections

J5 remains a core civic journey, but broad institutional understanding is owned by the **City** family and Search rather than a separate homepage mega-section.

## 4. Homepage prominence tiers

W6-3b must use these tiers when deciding section order and density.

### Tier A — immediate task access

- HP1 urgent help
- HP2 services
- Search

These must be recognizable without deep scrolling.

### Tier B — core civic context and action

- HP3 BetterBarangay
- HP4 Today
- HP5 accountability/evidence
- HP6 participation

These are first-order BetterMakati jobs and must each have a clear homepage route.

### Tier C — city use and depth

- HP7 Explore / Mobility
- HP8 Research / Statistics / Reports

These remain discoverable without competing with Tier A/B.

## 5. Current-homepage gap register for W6-3b onward

The current homepage already provides strong Search, common Services, BetterBarangay, civic-current-information cards, Explore and Statistics.

The following gaps are frozen for later W6-3 implementation:

1. **Emergency is not a clearly independent homepage start.** “Health & emergency” is currently bundled into a service category.
2. **Today is shown beside Calendar, City Monitor and Projects & money as an equal card**, weakening its role as the synthesis door.
3. **Participation is not a first-order homepage job.** Get Involved is BetterMakati-specific and does not replace `/participate`.
4. **Public Records / find the source is not a clearly recognizable homepage journey.**
5. **Community Tools occupies first-order section space even though it mixes several different jobs.**
6. **The homepage still exposes feature-count pressure:** too many sections/cards can make product brands compete with citizen jobs.
7. **Stale visitor/tool promises must remain removed or be reconciled:** parking and generic entertainment events are not standalone BetterMakati products.

## 6. Guardrails for W6-3b–3g

Later homepage work must:

- preserve the Hero site search;
- preserve obvious BetterBarangay entry;
- preserve high-use Services access;
- surface emergency access without routing through participation;
- make Today the current-information synthesis door;
- give Participation a first-order route;
- give Public Records/evidence a recognizable route;
- preserve Explore and research without turning Home into a sitemap;
- avoid visual-redesign work reserved for W7;
- avoid translation work reserved for W8;
- avoid adding a new general-purpose homepage feature family.

## 7. Acceptance criteria

W6-3a is complete when:

- HP1–HP8 are explicitly defined and mapped to W6-0c journeys;
- homepage prominence tiers A–C are frozen;
- Search, BetterBarangay and trust/correction behavior are explicitly classified as cross-cutting layers;
- the known homepage gaps for emergency, Today, participation, evidence and feature-count pressure are recorded;
- later W6-3 steps can be evaluated against this document without inventing new homepage priorities.

The final W6-3 acceptance test remains: different user types should reliably reach useful destinations from Home **without needing to understand BetterMakati’s internal feature architecture**.
