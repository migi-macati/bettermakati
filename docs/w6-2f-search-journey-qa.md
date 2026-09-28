# W6-2f — Search Journey QA

Status: complete  
Scope: final W6-2 search/discovery validation on repository `main`

## Purpose

W6-2f validates that BetterMakati Search behaves as a **sitewide civic search engine**, not merely a page finder. It does not add another search feature or expand into the full J1–J12 whole-product closure reserved for W6-9.

The test contract covers the search-shaped parts of the W6-0c journeys:

- known service need
- known barangay
- government/institutional lookup
- dated civic activity
- accountability/procurement
- source/evidence lookup
- mobility
- heritage/place context
- research/statistics
- legislation

## Frozen representative matrix

| ID | Citizen intent | Query | Expected first result | Canonical destination |
| --- | --- | --- | --- | --- |
| SJ1 | Common city service | `cedula` | Community Tax Certificate / Cedula | `/services/guide/community-tax-certificate` |
| SJ2 | Known barangay | `brgy poblacion` | Barangay Poblacion | `/barangays/poblacion` |
| SJ3 | City government office | `city hall` | City offices | `/government#offices` |
| SJ4 | Dated civic activity | `council sessions` | Makati Calendar | `/calendar` |
| SJ5 | Procurement/accountability | `bids` | Procurement | `/accountability?type=project` |
| SJ6 | Original evidence | `public records` | Public Records | `/records` |
| SJ7 | Mobility | `commute` | Getting around Makati | `/mobility` |
| SJ8 | Heritage/place discovery | `historical sites` | Heritage & Culture | `/heritage` |
| SJ9 | City research/statistics | `city stats` | Makati statistics | `/statistics` |
| SJ10 | Legislation | `laws` | Legislation | `/legislation` |

Each journey must:

1. start from the canonical `/search` surface;
2. surface the intended canonical result as the first ranked result;
3. allow the user to select it;
4. reach the expected useful destination; and
5. leave a usable substantive page rather than a dead or compatibility-only surface.

## Deep-link / keyboard contract

A positive query deep link such as `/search?q=commute` must restore the query, expose the same first result, and allow keyboard Enter to complete the journey.

W6-2e separately owns search entry-point convergence, neutral true-miss recovery and BetterBarangay-aware entry behavior. W6-2d owns zero-result recovery. W6-2c owns filter/category behavior. W6-2a/b own index completeness, aliases, deduplication and ranking mechanics.

## Closure rule

W6-2 is closed when:

- W6-2a through W6-2f guards remain in both build and quality;
- the representative end-to-end journey matrix passes in the production-preview browser suite;
- search does not restore retired Parking or generic What’s On as canonical results; and
- no unresolved critical search journey defect remains.

Full P0/P1 journey closure, device-wide whole-product QA and production deployment verification remain W6-9 responsibilities.
