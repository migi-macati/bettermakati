# BetterMakati Quality Benchmark

BetterMakati's target is not feature count. A release should help a resident understand, act on, and verify Makati information with less friction.

## Benchmark qualities

The project deliberately adopts the strongest patterns observed across BetterLGU implementations while preserving BetterMakati's broader civic-information model.

### Transaction depth

Featured/high-use services must have a structured BetterMakati transaction guide before they are promoted. A structured guide should publish, where the official source supports them:

- who may avail;
- classification / transaction type;
- documentary requirements;
- where each requirement comes from;
- citizen steps;
- fees and payment notes;
- processing time or timing rules;
- responsible office / Makati-facing service location;
- official source and last verification date.

If official sources conflict, are old, or vary by applicant/project, the guide must be marked `partial` and state the caveat instead of inventing precision.

The build fails if a featured service lacks a structured guide.

### Search and discovery

Both the universal search and the services directory should tolerate common one- or two-character misspellings for meaningful search terms.

Promoted homepage use cases should lead to a concrete task or record, not merely describe a feature.

### Evidence and freshness

Changing facts should point to first-party public sources whenever practical.

Every source used by a structured service guide must be present in the source-watch inventory. A detected change is a review signal; automation must not silently reinterpret a changed government source.

The major-page audit records what has been reviewed and what remains incomplete. A page can be reviewed while still publishing explicit coverage gaps.

### Accessibility and browser QA

Critical citizen journeys are tested in Chromium after a production build. The current browser gate checks:

- critical routes load without page errors;
- a primary heading is present;
- images have alt attributes;
- buttons have accessible names;
- common mobile widths do not introduce material horizontal overflow;
- universal and service search handle a representative typo;
- service results open BetterMakati guidance before external handoff;
- selected critical pages have no serious/critical axe findings against WCAG 2 A/AA and WCAG 2.1 AA rules.

This is a regression floor, not a claim of full WCAG conformance.

### Open civic depth

BetterMakati should remain more than a transaction directory. The benchmark includes:

- source-linked budgets, projects, procurement and audit;
- public records and structured civic datasets;
- elected-official and barangay profiles;
- neutral election information;
- City Monitor and reviewable source detection;
- an Accountability Ledger;
- participation and correction workflows;
- a sourced history timeline;
- city-life tools such as mobility, visitor information and emergency access.

## What is intentionally not claimed

The full government-services inventory is broader than the field-by-field verified subset. BetterMakati publishes both counts.

No page is called complete simply because it exists. Known gaps remain visible on BetterMakati Status.

A successful automated check does not certify that an official government source is correct, current, or complete.
