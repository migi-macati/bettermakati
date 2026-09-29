# W6-4c — Page-family cross-links

Status: complete  
Scope: evidence-backed continuation across BetterMakati’s principal civic page families  
Purpose: turn the W6-4b relationship contract into useful page-to-page journeys without generic link dumping.

## Decision

W6-4c does not add a universal “related links” component.

The existing site already contains most of the needed civic pathways. The correct Wave 6 move is to preserve those evidence-backed links, fill the two real gaps, and guard the whole family matrix.

## Page-family matrix

### Statistics → Reports / Barangays / ecosystem context

Already present and retained.

- typed indicator → Featured Report analysis backlinks;
- population → canonical barangay context where geography is explicit;
- GDP → curated BetterGov comparison/continuation resources;
- no citywide-indicator → specific-place inference.

### Projects & Budget → Accountability / Integrity / City Monitor

Already present and retained.

- project/procurement rows hand off to their Accountability records;
- procurement records expose Integrity evidence when the canonical relationship exists;
- page-level project follow-through leads into the Accountability Ledger;
- City Monitor remains the process/status continuation for procurement;
- no broad budget-category → project funding inference is added.

### Accountability → Places / Integrity / Reports / Calendar

Already present and retained.

Each ledger record can expose only the relationships that resolve from canonical data:

- related places;
- Integrity evidence;
- Featured Report analysis;
- canonical time projections through the domain timeline preview.

### Legislation → Services / Places / Public Records / Calendar

Already present and retained.

The legislation browser exposes typed related records and exact source/public-record identity. The domain timeline preview supplies dated legislative milestones.

### Officials ↔ Elections

**Gap fixed in W6-4c.**

A new `officialCivicRelationships` module stores one exact election-context edge per elected-official profile with a canonical 2025 result.

The edge means only:

> this official profile and this stored 2025 election result refer to the same elected person.

It does **not** mean that office-holding proves later authorship, sponsorship, votes, project responsibility, procurement control or policy ownership.

User journey:

`Elections result → elected name → official profile → exact 2025 election result`

Non-elected candidates remain plain result-table text unless a separate canonical profile relationship is created later.

### Reports ↔ Calendar

**Gap fixed in W6-4c.**

The Civic Timeline is now reversible through the shared relationship model.

Every supported timeline projection stores:

`timeline-item —chronicles→ canonical civic record`

Report pages therefore expose their own release entry on the Makati Calendar while remaining the canonical analysis page.

### Calendar → canonical records / scoped geography

Already present in the Calendar UI and now represented in the shared relationship graph.

Each timeline card continues to expose:

- its canonical record;
- its original source;
- explicit barangay/place geography where the canonical timeline projection stores it.

Chronological proximity alone never creates a relationship.

### Barangay → Services / Statistics / Budget / Accountability / Places / Calendar

Already present and retained through BetterBarangay.

The barangay homepage acts as a local context hub rather than duplicating citywide records.

### Place → Barangay / History / Accountability / heritage context

Already present and retained.

Civic Asset pages use canonical place relationships and explicit history/heritage references. No “nearby = related” rule is introduced by W6-4c.

## New relationship modules

### `src/data/officialCivicRelationships.ts`

Adds typed:

- `election-record`
- `official`

relationships using canonical elected-official slugs already stored in the 2025 election result dataset.

### `src/data/timelineCivicRelationships.ts`

Projects Civic Timeline canonical references into the shared Civic Intelligence graph.

Supported canonical owners currently include:

- City Monitor
- Legislation
- Elections
- Accountability
- Reports
- Statistics
- Public Records
- Services
- Barangays
- mobility-owned Places

Mobility service/route IDs remain deliberately unprojected until a shared resolver is explicit. W6-4c does not coerce them into a different canonical namespace.

## Anti-link-dump rule

A page-family link must do at least one of the following:

1. open the exact canonical record behind the current object;
2. open analysis that explicitly cites the current record;
3. open a source/provenance record with exact identity;
4. move from citywide context to an explicitly scoped barangay/place;
5. expose a dated projection of the same canonical civic record;
6. continue a user task to the correct owning domain.

A page does not receive a generic relationship block merely because another page shares a topic, name, date, district or keyword.

## Guardrail

`check:wave6-page-family-crosslinks` verifies the page-family matrix and the two new relationship modules.

It checks that:

- Officials↔Elections uses canonical official slugs;
- Reports↔Calendar uses the typed timeline graph;
- timeline relationships use `chronicles` plus canonical IDs;
- Calendar still links to canonical records and explicit geography;
- the established Statistics, Projects/Budget, Accountability, Legislation, Barangay and Place continuations remain present;
- the W6-4b anti-inference policy remains the authority for cross-domain links;
- the guard stays in both `build` and `quality`.

## Closure condition

W6-4c is closed when the guard, TypeScript/build pipeline and deployment check are green.

## Next

**W6-4d — contextual backlink QA**

Test representative end-to-end journeys in both directions, remove duplicate or weak continuations, and verify that page-family links land at the most useful section rather than merely the correct page.
