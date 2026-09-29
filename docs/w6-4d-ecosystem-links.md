# W6-4d — BetterGov / BetterLGU ecosystem links

Status: complete  
Reviewed: 2026-09-29

## Purpose

Close the original W6-4d scope by making BetterGov and BetterLGU continuations useful, bounded and explicitly separate from Makati-local evidence.

The machine-readable audit is in `data/wave6-ecosystem-link-audit.json`.

## Rules

1. BetterGov resources are national context, discovery or comparison resources unless an exact official identity is independently verified.
2. BetterLGU is cross-LGU discovery, not evidence for a Makati fact.
3. External ecosystem links belong only where they answer a plausible next user question.
4. Shared destinations are owned by `src/data/ecosystemResources.ts`, not repeated as hardcoded URLs across page families.
5. BetterMakati remains the owner of Makati-local synthesis, relationships and scoped civic records.

## Ecosystem registry

W6-4d now registers the main continuation surfaces used by BetterMakati:

- BetterGov home;
- BetterLGU Directory;
- national Open Data;
- Data Research / Visualizations;
- Price Guides;
- 2026 National Budget;
- Transparency Portal;
- procurement browser;
- flood-control projects;
- national legislative records;
- national government directory.

Each registry entry stores:

- ecosystem;
- URL;
- role;
- an evidence-boundary note;
- audit date.

## Page-family decisions

### About

The About page is the primary ecosystem-orientation surface.

It links to:

- **BetterGov ecosystem**;
- **Browse BetterLGU sites**.

This is where cross-LGU discovery is useful without pretending another LGU is a Makati comparison source.

### Government

Government now uses the shared relationship-link treatment for:

- National Legislative Records;
- National Government Directory.

These are labelled **National context**.

### Statistics

Statistics keeps two levels of external continuation:

- section-level national data context tied to economic indicators;
- page-level national data / visualization / benchmark continuations.

All shared BetterGov destinations now resolve through the ecosystem registry.

### Projects & Budget

Projects & Budget uses registry-backed national context for:

- 2026 National Budget;
- procurement browser;
- Transparency Portal;
- flood-control projects.

These remain national research context, not evidence that a Makati project or procurement matches a national record.

### Integrity

Integrity already used the ecosystem registry for the procurement-browser continuation.

Its note explicitly prevents a BetterGov procurement handoff from being treated as proof of an exact PhilGEPS match.

## BetterLGU placement

BetterLGU remains primarily on About.

It was deliberately **not** added to Statistics, Accountability, Legislation, Projects & Budget or Civic Asset pages because those pages need record- or task-specific continuations. A generic “browse other LGUs” link there would add noise rather than civic value.

## Closure

Original W6-4d is complete when:

- ecosystem resources are centrally registered;
- BetterGov links are labelled as context/discovery rather than local evidence;
- BetterLGU has a clear cross-LGU discovery home;
- page-family ecosystem links answer a plausible next question;
- no W6-4 relationship rule treats an external ecosystem page as proof of a Makati-specific fact.
