# W5-3e1 — Estates & Districts closure QA

Reviewed: 2026-09-27

## Closure status

**Wave 5.3 data and application scope: CLOSED.**

Deployment verification remains dependent on the existing Vercel build-rate limit. That external status is not treated as evidence of a source, schema or application defect.

## Final canonical inventory

- 42 reconciled Area / Organization source records
- 13 canonical Areas
- 11 canonical Organizations
- 29 source-backed relationships
- 8 directly sourced Place → Area relationships
- 6 BetterBarangay private-village community references
- 2 published Area geometry artifacts

### Canonical Areas

1. Makati Central Business District
2. Ayala Center
3. Salcedo Village
4. Legazpi Village
5. Circuit Makati
6. Century City
7. Rockwell Center
8. Bel-Air Village
9. Dasmariñas Village
10. Forbes Park
11. San Lorenzo Village
12. Urdaneta Village
13. Magallanes Village

### Canonical Organizations

1. Makati Central Estate Association, Inc. (MACEA)
2. Ayala Center Estate Association, Inc. (ACEA)
3. Circuit Makati Estate Association, Inc. (CMEA)
4. Century City Estate Association
5. Rockwell Land Corporation
6. Bel-Air Village Association (BAVA)
7. Dasmariñas Village Association, Inc. (DVA)
8. Forbes Park Association, Inc. (FPA)
9. San Lorenzo Village Association (SLVA)
10. Urdaneta Village Association, Inc. (UVA)
11. Magallanes Village Association, Inc. (MVA)

## Closure checks

### Canonical ownership

- Areas and Organizations have their own registry.
- Estates, districts and villages are not modeled as fake point Places.
- Organization names and channels are owned by the Organization Registry rather than duplicated in BetterBarangay.
- District-facing pages resolve Area / Barangay IDs through a common resolver.

### BetterBarangay

Legacy association name/URL arrays are removed.

Private residential-village references are deliberately modeled as community context rather than automatic government-boundary claims:

- Bel-Air Village
- Dasmariñas Village
- Forbes Park
- Magallanes Village
- San Lorenzo Village
- Urdaneta Village

Sourced within-barangay relationships for commercial / mixed-use areas continue to come from the canonical relationship registry.

The unsupported former **MACEA → Poblacion** presentation remains removed.

### Civic Intelligence

All 29 canonical Area relationships are bridged into Civic Intelligence from the registry rather than maintained as a second manual relationship list.

Area and Organization nodes resolve their names and links from their canonical owners.

### Search and navigation

All 13 Areas and 11 Organizations are generated into site search with stable canonical keys and exact Estates anchors.

This includes ACEA, CMEA, MVA and UVA, which were missing from the earlier hand-written search list.

Areas participate in the Places search view; Organizations participate in the Government view.

### District-facing features

Parking, Mobility, Visit Makati and What’s On no longer keep independent lists of district labels where a canonical Area or Barangay identity exists.

The common resolver provides:
- current canonical label;
- internal BetterMakati link;
- map query when needed.

### Geometry

Only two boundaries are published:

1. **Dasmariñas Village** — approximate boundary
2. **Forbes Park** — approximate boundary

Both:
- use repository-owned GeoJSON-compatible coordinates;
- cite the primary village / association evidence governing interpretation;
- retain public administrative boundary data only as a coordinate guide / QA reference;
- are labelled approximate rather than cadastral or survey geometry.

No unsupported geometry is published for Circuit Makati after the source-image correction.

### Civic Map

Areas remain a separate **Districts & estates** context layer beneath the civic-asset concept.

The current layer:
- draws only Areas with sourced geometry;
- derives its viewport from polygon bounds;
- does not invent centroids or center markers;
- labels the polygons **Approximate boundary**;
- links mapped Areas back to their canonical Estates records.

## Closure defect found and fixed

During W5-3e1, the geometry audit was found to count Dasmariñas coordinates across the entire multi-artifact geometry block. That was harmless while only one polygon existed but would make the audit fail after Forbes Park was added.

The audit now isolates the Dasmariñas artifact before checking its 24-position ring. Forbes Park retains its own independent 34-position check.

This was a QA defect, not a geometry-data defect.

## Deliberately unresolved after Wave 5.3

These are evidence gaps, not unfinished migrations.

### Geometry-less Areas

No polygon is published for:
- Makati CBD
- Ayala Center
- Salcedo Village
- Legazpi Village
- Circuit Makati
- Century City
- Rockwell Center
- Bel-Air Village
- San Lorenzo Village
- Urdaneta Village
- Magallanes Village

Century City, Rockwell Center and San Lorenzo Village have possible approximate-boundary evidence, but they remain deferred until a second visual QA source is completed.

### Rockwell association identity

**Rockwell Center Association, Inc.** remains noncanonical because the reconciliation pass did not establish sufficient authoritative evidence for that organization.

Rockwell Center therefore connects to the verified **Rockwell Land Corporation** developer record.

### Organization channels

Some verified Organizations still have no verified dedicated public channel:
- Century City Estate Association
- Urdaneta Village Association, Inc.
- Magallanes Village Association, Inc.

ACEA and CMEA use verified parent/developer information where a dedicated current association portal was not established.

No Google Maps search is used as a substitute for an official organization channel.

### Place → Area coverage

Only directly supportable Place → Area links were promoted. The absence of a link is not filled by proximity.

In particular, Century City and Rockwell Center do not receive invented canonical Place membership merely to make their cards look fuller.

## Automated closure gate

`check:wave5-estates-districts-closure` now verifies the end-to-end Wave 5.3 contract and runs in both `build` and `quality`.

It covers:
- registry counts and expected IDs;
- reconciled exclusions;
- BetterBarangay migration;
- Estates rendering;
- Civic Intelligence bridge;
- search/navigation;
- district-facing resolver use;
- geometry provenance;
- Civic Map context layer;
- known legacy duplicate strings;
- presence of the component quality gates.

## Next

Wave 5.3 should not be reopened merely to increase counts.

Any later additions should be evidence-triggered: a verified new association, direct Place → Area evidence, or a defensible Area boundary source.

The next development step should move to the next planned Wave 5 workstream rather than expanding Estates & Districts for its own sake.
