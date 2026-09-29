# W6-3d — BetterBarangay Journey

Status: complete  
Scope: P1 barangay discovery, remembered local context and truthful local/citywide handoffs  
Depends on: W6-0c core journey matrix, W6-1 navigation ownership, W6-2 search, W6-3a/3b homepage priorities

## Decision

The canonical BetterBarangay journey is:

1. choose a barangay from Home, global navigation or `/barangays`;
2. land on `/barangays/:slug` as the local homepage;
3. preserve that preferred barangay when moving into compatible citywide surfaces;
4. show only explicitly attributed local data as local;
5. keep citywide information available, but label it as citywide when a BetterBarangay context is active;
6. allow the user to change or clear the local context from the persistent BetterBarangay bar.

BetterBarangay is a local lens over compatible BetterMakati journeys, not a mechanism for converting citywide records into barangay records.

## Changes

### Preferred barangay continuity

Primary navigation and footer navigation now scope compatible destinations using the preferred barangay, including when the user starts from a barangay homepage whose URL does not yet contain a `?barangay=` parameter.

This closes the continuity gap where a user could move from BetterPoblacion into Services, Accountability, Projects & Budget, Participate, Statistics or Civic Map and silently lose the local context.

Search already used the preferred barangay and remains unchanged.

### Explicit local attribution

Barangay-profile Accountability records now require the same explicit `barangaySlug` attribution used by the canonical Accountability page.

The previous free-text heuristic could classify a citywide record as local merely because a barangay name appeared in its title, summary, location, responsible body or source label.

Local accountability therefore now means explicitly tagged local evidence.

### Projects & Budget

A scoped Projects & Budget page now states that:

- budget totals remain citywide;
- revenue and spending remain citywide;
- office allocations, procurement tables and audit material remain citywide unless the record explicitly identifies the selected barangay;
- local evidence and place-based records are available through the scoped Accountability and Civic Map handoffs.

The barangay homepage copy was also tightened so it does not imply that city budget totals become barangay budgets.

### Participation

A scoped Participate page now distinguishes:

- barangay-preserving local reports, place improvements and source submissions;
- citywide official consultation listings and project-wide community input unless an item explicitly identifies a barangay.

### Existing truthful slices retained

W6-3d preserves the existing behavior where:

- Accountability excludes citywide records from a barangay slice and says so;
- Statistics shows barangay population context while keeping economy, labor and city-system indicators labelled citywide;
- Civic Map filters mapped records to the selected barangay;
- Services can start from barangay-level transactions and local service locations;
- service and Civic Map detail pages retain the selected barangay query context.

## Guardrails

W6-3d does not:

- fabricate barangay-level budgets, projects, statistics or participation records;
- infer locality from a barangay name appearing in free text;
- scope unrelated pages that do not implement a BetterBarangay view;
- redesign BetterBarangay visually ahead of Wave 7;
- expand barangay datasets merely to make every local page look equally complete.

Missing local data remains a visible coverage gap.

## Verification

`check:wave6-barangay-journey` is registered in both `build` and `quality`.

The guard checks:

- preferred barangay continuity through Navbar and Footer compatible links;
- explicit barangay attribution for local Accountability records;
- Projects & Budget local/citywide disclosure;
- Participate local/citywide disclosure;
- existing truthful scope language in Accountability and Statistics;
- barangay-filtered Civic Map labeling;
- persistent BetterBarangay context controls.

Browser coverage additionally checks:

1. BetterPoblacion scopes compatible primary-navigation and footer links;
2. Services opens with the selected barangay;
3. the persistent context bar can switch from Poblacion to Bel-Air without leaving Services;
4. clearing the context returns Services to citywide mode;
5. scoped Projects & Budget identifies citywide budget versus local evidence;
6. scoped Participate identifies local actions versus citywide opportunity feeds.

## Closure condition

W6-3d is closed when the repository guard, build/quality pipeline and browser journey test remain green on the final commit.
