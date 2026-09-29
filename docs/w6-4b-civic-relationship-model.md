# W6-4b — Civic relationship model

Status: complete  
Scope: shared civic-intelligence graph contract before page-family cross-links  
Purpose: define what BetterMakati is allowed to connect, what evidence justifies the connection, and what must remain unlinked.

## Decision

W6-4b extends the existing Wave 4 relationship engine rather than replacing it.

Wave 4 already established the correct architecture:

- canonical records remain owned by their domain modules;
- the relationship layer stores typed references plus relationship evidence;
- one stored edge yields inbound and outbound navigation;
- source-backed edges require explicit evidence;
- BetterGov / BetterLGU handoffs are context, not Makati-specific evidence.

Wave 6 keeps that architecture and expands its vocabulary to the page families now in scope.

## Added shared node types

The shared model now explicitly recognizes:

- `budget-record`
- `official`
- `election-record`
- `timeline-item`

The resolver-owner vocabulary now also recognizes:

- `budgets`
- `officials`
- `elections`
- `timeline`

A `chronicles` relationship is available for a Civic Timeline item that projects a dated milestone from a canonical civic record.

These additions are model vocabulary only. W6-4b does **not** bulk-create UI links or infer new civic facts.

## Relationship contract

The machine-readable policy is frozen in:

`data/wave6-civic-relationship-policy.json`

It covers the principal W6-4 families:

Statistics → budgets → projects/accountability → legislation → officials/elections → reports → timeline → barangays → places, with services, public records and the BetterGov/BetterLGU ecosystem available where justified.

### Strong evidence

A relationship may be stored when its basis is one of the following:

1. **Canonical identity**  
   The owning dataset explicitly stores the other canonical ID.

2. **Exact shared source identity**  
   Two records resolve to the same canonical source URL or owner.

3. **Declared analysis input**  
   A report explicitly cites a typed canonical record.

4. **Explicit geography**  
   The canonical record itself identifies the barangay, place, route, segment or area.

5. **Official cross-reference / source-stated relationship**  
   The source itself states the connection and the relationship retains source IDs plus the relevant statement.

6. **Curated ecosystem context**  
   BetterGov / BetterLGU can be offered as a comparison or continuation only, with a curation note. It cannot substantiate a Makati-specific claim.

## Family rules

### Timeline

A timeline item can chronicle its canonical owner and explicit scoped geography.

A date near another event is not a relationship.

### Officials

An official may connect to an election record when the official/result identity is exact.

Holding an office does not prove that the person authored, sponsored, voted for, controlled, funded or implemented a measure, project or procurement.

Those links require their own source-backed evidence.

### Budgets and projects

A budget record can fund or contextualize a project only when there is an exact program/project identity, appropriation reference or explicit source statement.

A broad budget category is not proof that a specific project received funding.

### Legislation

Existing legislation relationships remain valid when they come from recorded civic relationships, lifecycle evidence or exact source identity.

No title or keyword matching is allowed.

### Reports

A report synthesizes only records explicitly declared in its evidence references.

A report is analysis of those records; it is not source evidence for them.

### Statistics

Citywide indicators cannot be attributed to a particular barangay or place unless the observation itself is explicitly reconciled to that geography.

### Places and barangays

Place geography uses canonical registry geography or source-backed location evidence.

Same-district or nearby status is not enough by itself to create a civic relationship.

### Public records

Source relationships use canonical IDs, an owning-record reference or exact shared source identity.

Fuzzy source matching is not allowed.

## Explicit anti-inference rules

W6-4 must not create civic links from:

- title or keyword similarity;
- person-name similarity without canonical identity;
- same district or same barangay without an explicit geographic relationship;
- chronological proximity;
- same broad topic;
- office held as proof of authorship, vote, responsibility or control;
- citywide statistics as proof about a specific place or barangay;
- a budget category as proof that a specific project was funded;
- an external ecosystem page as proof of a Makati-specific fact.

These are relationship-model failures, even when the resulting link would look plausible.

## Rendering rule for W6-4c

W6-4c may render only evidence-backed relationships supported by this contract.

The strongest next civic question comes first. Pages do not receive generic “related links” blocks when no meaningful relationship exists.

This preserves the W6-4a rule: eliminating dead ends is not a license to manufacture navigation loops.

## Guardrail

`check:wave6-civic-relationship-model` verifies:

- the new node and resolver-owner vocabulary exists in the shared model;
- the machine-readable policy covers the required W6-4 families;
- the policy keeps explicit anti-inference rules;
- timeline chronology is represented through `chronicles`, not proximity matching;
- the check itself remains in both `build` and `quality`.

## Closure condition

W6-4b is closed when the relationship-model guard, TypeScript/build pipeline and existing Wave 4 relationship checks are green.

## Next

**W6-4c — page-family cross-links**

Use the relationship contract to add high-value contextual continuation between Statistics, Projects & Budget, Accountability, Legislation, officials, Reports, Civic Timeline, barangays and places without link dumping or unsupported attribution.
