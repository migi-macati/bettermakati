# W6-0b — Route and Feature Inventory

Status: complete  
Scope: repository `main` at the Wave 6 baseline established in W6-0a  
Purpose: establish the canonical public product surface before Wave 6 information-architecture, journey, discovery, accessibility, performance, analytics and governance work.

## 1. Route inventory

`src/App.tsx` defines **56 route entries**:

- **51 substantive public route patterns**
- **4 compatibility redirects**
- **1 catch-all 404 route**

### Core / platform

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/` | Home | Primary entry point |
| `/about` | About BetterMakati | Footer / institutional |
| `/search` | Sitewide search | Global search control |
| `/contact` | BetterMakati / Makati contact information | Direct route; not in main/footer navigation |
| `/privacy` | Privacy | Footer |
| `/terms` | Terms | Footer |
| `*` | Not found | System fallback |

### Services and official-service handoff

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/services` | Service directory | First-class main navigation |
| `/services/:category` | Filtered/category service directory | Derived service state |
| `/services/guide/:id` | BetterMakati service guide | Detail route |
| `/services/:category/:documentSlug` | Service document/detail | Detail route |
| `/government-offices` | Government service offices | Secondary service surface |
| `/hotlines` | Emergency / public hotlines | Today navigation + top utility bar |

### Current city / civic time / monitoring

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/today` | Today in Makati | First-class Today hub |
| `/city-monitor` | City Monitor | Today + footer |
| `/city-monitor/:id` | City Monitor record | Detail route |
| `/briefs` | Civic Briefs | Today + footer |
| `/live` | Live Makati | Today + footer |
| `/news` | Makati in the News | Today |
| `/calendar` | Makati Calendar | Today + footer |

### City / government / civic intelligence

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/government` | Makati government | City hub / navigation |
| `/elections` | Elections & voting | City navigation |
| `/officials/:slug` | Elected official profile | Detail route |
| `/statistics` | Makati statistics | City navigation |
| `/reports` | Reports & Insights | City navigation |
| `/reports/:slug` | Report article | Detail route |
| `/legislation` | Local legislation | City navigation |
| `/estates` | Estates, districts & associations | City + Explore navigation |
| `/history` | History of Makati | City + Explore navigation |

### Barangay layer

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/barangays` | Barangay directory | First-class main navigation |
| `/barangays/:slug` | BetterBarangay profile/home | Detail + persistent barangay context |

### Accountability / open government

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/accountability` | Accountability Ledger | First-class Accountability hub |
| `/projects-budget` | Projects & Budget | Accountability navigation |
| `/records` | Public Records | Accountability navigation |
| `/records/:id` | Public record detail | Detail route |
| `/integrity` | Integrity & Public Interest | Accountability navigation |
| `/open-government` | Open Government Audit | Accountability navigation |
| `/status` | BetterMakati coverage & limitations | Accountability + footer |

The Accountability menu also exposes three **query-driven feature states** on the same `/accountability` route:

- `?type=project` — Procurement Tracker
- `?type=audit` — Audit & Follow-through
- `?type=commitment` — Public Commitments

### Participation / civic map

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/participate` | Participation Hub | First-class Participate hub |
| `/civic-map` | Civic Map | Participate navigation |
| `/civic-map/reports` | Civic Map Reports | Participate navigation |
| `/civic-map/report` | Nearby civic report flow | Downstream workflow |
| `/civic-map/:assetId` | Civic place/street/route page | Detail + participation surface |
| `/civic-map/audits/park-accessibility-2026` | Park accessibility civic audit | Downstream audit |
| `/civic-map/audits/park-accessibility-2026/results` | Civic audit results | Downstream results |
| `/community-tools` | Community Tools | Participate navigation |
| `/community-tools/saan-ako-lalapit` | Saan Ako Lalapit? | Participate navigation |
| `/get-involved` | Contribution / submission flow | Participate + footer |

The Participate menu exposes three **query/hash-driven contribution states** on `/get-involved`:

- proposal
- source submission
- correction report

### Explore Makati / place-based information

| Route | Surface | Discovery role |
| --- | --- | --- |
| `/visit` | Explore Makati | First-class Explore hub |
| `/mobility` | Getting Around | Explore + footer |
| `/cinemas` | Cinemas | Explore |
| `/heritage` | Heritage & Culture | Explore |
| `/estates` | Areas / districts / associations | Shared with City |
| `/history` | Historical context | Shared with City |

### Compatibility redirects

| Legacy route | Canonical destination |
| --- | --- |
| `/parking` | `/visit` |
| `/whats-on` | `/calendar` |
| `/reports/makati-overview` | `/reports/2026-budget-operating-expenses` |
| `/transparency` | `/projects-budget` |

These remain compatibility routes, not product surfaces.

## 2. Page-file reconciliation

There are **52 page files** in `src/pages`.

One page file is a confirmed legacy remnant:

- `src/pages/Transparency.tsx` — no longer routed; `/transparency` redirects to `/projects-budget`.

The other page files correspond to active route surfaces or the catch-all NotFound page. Some components intentionally serve more than one route pattern, particularly `Services.tsx`.

## 3. Public feature systems

The route layer is backed by the following product systems.

### A. Global shell and context

- Responsive desktop/mobile navigation
- top utility bar and hotlines
- persistent BetterBarangay preference/context
- footer and BetterGov / BetterLGU ecosystem handoffs
- sitewide search entry
- SEO metadata
- page error boundary
- skip-to-content / focus support
- loading boundary
- last-reviewed/source context on many civic pages
- share-page controls
- Page Help surface

### B. Service discovery

Backed by service directory, service guide, government-office and place-registry data.

Capabilities include:

- task-oriented service browsing
- service categories
- service guides/documents
- local office discovery
- barangay-aware service context
- official/national service handoff
- Saan Ako Lalapit? routing
- emergency/public hotlines

### C. Civic time and current-city information

Backed by Civic Timeline, native timeline records, projections/views, City Monitor, Civic Briefs, news relationships and Live Makati.

Capabilities include:

- Today in Makati synthesis
- civic dates/deadlines
- City Monitor records
- Civic Briefs
- news discovery
- calendar projections
- Live Makati information
- barangay-aware timeline context

### D. Government, elections and civic intelligence

Backed by elected officials, election history/current election data, city indicators, reports, legislation data and council-session data.

Capabilities include:

- government structure / elected officials
- official profiles
- voting/election information and historical results
- city statistics and Philippine-city comparison
- downloadable/statistical exports
- reports and civic synthesis
- local legislation browsing
- historical civic context

### E. Accountability and public records

Backed by accountability datasets, budget records, integrity disclosures/audit trails, public records and Open Government doctrine.

Capabilities include:

- accountability ledger
- projects / procurement / commitments / audits
- annual budget archive and charts
- office-level budget detail
- public-record source browsing
- integrity disclosures
- audit trails and relationships
- Open Government audit
- coverage/limitations status

### F. Barangay product layer

Backed by barangay data, place registry, services, accountability, elections, civic timeline, audit and area/organization registries.

Capabilities include:

- barangay directory
- BetterBarangay home/profile
- preferred barangay memory
- barangay-scoped links and content
- local services
- barangay government
- local places
- accountability/election/history context
- local civic timeline

### G. Places, mobility, heritage and city exploration

Backed by place registry, visitor curation, estate/district registries and geometry, mobility systems/routes/network, history and heritage collections.

Capabilities include:

- curated city starting points
- areas / estates / districts
- place registry
- mobility modes and route/corridor information
- mobility network relationships
- heritage map
- historical context
- cinemas / visitor utilities
- place-to-civic-context crosslinks

### H. Participation and civic map

Backed by participation data, place registry, structured observations and civic audit data.

Capabilities include:

- participation hub
- place/street/route discovery
- near-me civic places
- civic asset pages
- observations
- contribution forms
- civic discussion
- issue/report flows
- park-accessibility audit and results
- source, proposal and correction submissions
- community tools

### I. Search and relationship graph

BetterMakati already contains explicit relationship datasets spanning:

- civic intelligence
- areas / organizations
- statistics
- legislation
- integrity
- reports
- news

These relationships, plus `searchIndex.ts`, form the basis for Wave 6 whole-product discovery rather than isolated page-by-page navigation.

## 4. Discovery classification

### First-class global product doors

- Services
- Today
- City
- Barangays
- Accountability
- Participate
- Explore Makati
- Search

### Secondary institutional / utility surfaces

- About
- Privacy
- Terms
- BetterMakati Status
- Contact
- Hotlines

### Intentionally downstream/detail surfaces

- service guides and service documents
- official profiles
- report articles
- City Monitor records
- public-record details
- barangay profiles
- civic asset pages
- Civic Map report flow
- Civic Audit pilot/results

### Valid but weakly surfaced

These should be reviewed in W6-1/W6-3 rather than automatically promoted or deleted:

- `/government-offices`
- `/contact`

## 5. Whole-product overlap clusters for later Wave 6 work

These are **not duplicate implementations**. They are adjacent public doors whose roles must be made legible to a citizen.

### Current information

`Today` ↔ `Live Makati` ↔ `City Monitor` ↔ `Civic Briefs` ↔ `News` ↔ `Calendar`

### Accountability

`Accountability` ↔ `Projects & Budget` ↔ `Public Records` ↔ `Integrity` ↔ `Open Government` ↔ `Status`

### Participation

`Participate` ↔ `Get Involved` ↔ `Community Tools` ↔ `Civic Map`

### Place-based city understanding

`Explore Makati` ↔ `Estates` ↔ `Heritage` ↔ `Mobility` ↔ `Civic Map`

Wave 6 should clarify entry points, handoffs and purpose across these clusters without collapsing useful distinct capabilities.

## 6. W6-0b findings carried forward

1. The product does **not** need a route rebuild. It needs whole-product organization around an already broad feature set.
2. `Transparency.tsx` is the only confirmed unrouted page-file remnant found in this inventory.
3. Dynamic/detail routes are mostly correctly kept out of global navigation.
4. BetterBarangay is a cross-product context layer, not merely one page family.
5. Search and the civic relationship datasets are important architectural assets for Wave 6.
6. The principal IA risk is **overlapping public doors**, not lack of content.
7. `/government-offices` and `/contact` need explicit disposition during W6-1/W6-3.
8. Compatibility redirects should be retained unless a later route audit shows they are no longer needed.
9. Visual redesign decisions are deferred to Wave 7; language/toggle completion is deferred to Wave 8.
