# W6-5a — Responsive & accessibility baseline

Status: complete-static-baseline-live-current-build-deferred  
Reviewed: 2026-09-29

## Purpose

Establish the measurable baseline for W6-5 before changing layouts or interactions.

This step does **not** claim that BetterMakati is WCAG-compliant or that every current-main viewport has been visually verified. It defines the target, records what already works, identifies concrete risks, and assigns each issue to a bounded W6-5 work package.

The machine-readable baseline is in:

`data/wave6-responsive-accessibility-baseline.json`

## Target

W6-5 uses **WCAG 2.2 AA as the accessibility target**.

The existing Axe browser test currently checks:

- WCAG 2.0 A;
- WCAG 2.0 AA;
- WCAG 2.1 AA.

W6-5e will decide which WCAG 2.2 requirements can be covered by automation and which require manual keyboard, focus, reflow, contrast or assistive-technology checks.

BetterMakati keeps its stricter internal **44px interaction-height baseline** for repeated touch controls even where the formal accessibility minimum may be lower.

## Reflow baseline

The W6-5 responsive rule is:

> No whole-page horizontal scrolling at 320 CSS px.

Localized horizontal scrolling remains acceptable when the component itself genuinely needs it, such as:

- dense data tables;
- intentional chip or tab strips;
- other bounded controls where the surrounding page remains usable.

The scrolling region should remain understandable and operable rather than silently forcing content off-screen.

## Device matrix

### 320 × 568

Narrow-mobile stress case and reflow floor.

### 390 × 844

Primary Android/mobile interaction and touch-target pass.

### 768 × 1024

Tablet portrait, especially breakpoint wrapping and form/table composition.

### 1024 × 768

Compact landscape / small-laptop transition state.

### 1440 × 900

Desktop navigation, keyboard menus, dense data and focus-order pass.

## Existing strengths

### App shell

Already present:

- skip link;
- single `main#main-content` landmark;
- programmatically focusable main target;
- page error boundary with alert semantics.

### Global CSS

Already present:

- visible `:focus-visible` treatment;
- `prefers-reduced-motion`;
- 44px shared brand buttons;
- 44px shared inputs, selects and textareas;
- global scroll-margin handling for anchored content.

### Navigation

Navbar already has several strong interaction semantics:

- desktop/mobile mode split at `xl`;
- `aria-expanded` and `aria-controls` on menu buttons;
- Escape closes menus and returns focus;
- outside click and focus departure close open menus;
- `aria-current` is applied to current links;
- mobile search/menu controls are 44px square.

### Search

The site-search combobox already uses:

- `role="combobox"`;
- `aria-expanded`;
- `aria-controls`;
- `aria-activedescendant`;
- listbox/option semantics;
- keyboard selection and escape handling.

### Other shared components

`SectionNav` already wraps and uses 44px links.

`CivicAreaContextMap` already has:

- a titled iframe;
- grouped layer controls;
- `aria-pressed`;
- 44px layer-toggle controls.

## High-priority findings

### W6-5b — global shell

#### Navbar utility bar

Emergency, City Hall, Hotlines and official-site links do not consistently preserve the 44px BetterMakati touch baseline.

#### Footer

Footer navigation and ecosystem links currently use `min-h-9` (36px).

Contact, email, social and bottom legal links are ordinary inline links without a shared touch-target minimum.

#### BetterBarangay context bar

The visible edition selector surface and barangay-homepage action use `min-h-10` (40px).

These are close, but still below the project’s 44px baseline.

## W6-5c — controls, forms & search

Search already has a comparatively strong semantic model.

This package will therefore concentrate on:

- control sizing consistency outside shared form classes;
- visible labels and instructions;
- async status/error announcements;
- filter and chip overflow;
- keyboard regression across form-heavy journeys.

## W6-5d — complex components

### PhotoCarousel

Previous/next actions are 44px, but photo-selection dot buttons are currently 36×36.

Attribution and fallback source links are also compact inline targets.

### TableWithToggle

The Table/List toggle is a notable legacy/shared risk:

- no `aria-pressed`;
- no explicit `type="button"`;
- no 44px minimum target;
- selected state is primarily visual.

Dense tables, maps, timelines, carousels and horizontally scrollable regions also need real-browser proof rather than source-only assumptions.

## W6-5e — semantic & keyboard pass

The existing Axe test contains **28 route URLs**.

The router currently has **51 substantive public route patterns** after excluding compatibility redirects and the catch-all route.

Not every route pattern needs a unique test, but several important newer domains have no representative Axe coverage, including:

- Government Offices;
- Open Government;
- Integrity;
- City Monitor;
- Civic Briefs;
- Reports and a report article;
- Civic Map and detail/report/audit surfaces;
- Elections;
- an official profile;
- Statistics;
- Community Tools;
- Contact.

W6-5e will expand representative coverage rather than mechanically test every dynamic record.

## W6-5f — device & browser pass

Static classes cannot prove:

- actual whole-page overflow;
- sticky-header interactions;
- wrapping at every breakpoint;
- computed color contrast;
- zoom/reflow behavior;
- real focus order;
- runtime third-party/map behavior.

The live production site also cannot currently be treated as a reliable proxy for `main` because Vercel deployment attempts are blocked by the project/account build-rate limit.

W6-5f therefore owns actual current-build browser proof when an executable current build is available.

## Bounded items

### Current-main live browser

Deferred to W6-5f because current Vercel deployments are quota-blocked.

### Contrast

Deferred to the browser/device pass because static class inspection does not establish computed contrast for every state.

### Screen-reader behavior

Requires manual sampling. Axe and ARIA inspection alone cannot establish practical reading/announcement behavior.

## W6-5 sequence

- **W6-5a** — responsive/a11y baseline — complete
- **W6-5b** — global shell responsive/a11y
- **W6-5c** — controls, forms & search
- **W6-5d** — complex components
- **W6-5e** — semantic & keyboard pass
- **W6-5f** — device & browser pass
- **W6-5g** — regression guard & closure

## Next

**W6-5b — Global shell responsive/a11y.**
