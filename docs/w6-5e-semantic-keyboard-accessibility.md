# W6-5e — Semantic & keyboard pass

Status: complete-static-semantic-keyboard-browser-suite-expanded  
Reviewed: 2026-09-29

## Purpose

Close the semantic/keyboard portion of Wave 6 accessibility work and make the browser accessibility suite representative of the whole current public site.

Machine-readable audit:

`data/wave6-semantic-keyboard-accessibility.json`

## Axe coverage

W6-5a recorded 28 accessibility URLs against 51 substantive public route patterns.

W6-5e expands this to **51 representative URLs covering all 51 substantive route patterns**.

Representative dynamic routes now include:

- a service guide;
- a barangay profile;
- an elected-official profile;
- a public-record detail;
- a City Monitor detail;
- a report article;
- a civic-asset detail;
- civic-audit/reporting surfaces.

Compatibility redirects and the catch-all 404 are not counted as substantive route patterns.

## WCAG automated rule set

The Axe suite now runs tags for:

- WCAG 2.0 A;
- WCAG 2.0 AA;
- WCAG 2.1 A;
- WCAG 2.1 AA;
- WCAG 2.2 AA additions supported by the pinned axe-core line.

This closes the baseline gap where WCAG 2.1 Level A was omitted and WCAG 2.2 rules were not requested.

This does **not** constitute a WCAG-conformance claim. Automated testing remains only one part of the W6-5 target.

## Per-route semantic assertions

Before Axe runs, every representative route now asserts:

- exactly one `main#main-content`;
- exactly one `h1` inside main;
- no unnamed buttons;
- no `img` without `alt`;
- the page is not the recoverable 404 rendered under a supposedly valid URL.

This prevents a broken dynamic test URL from falsely appearing as an accessibility pass.

## Keyboard regressions

The browser suite now explicitly verifies six keyboard/focus journeys.

### Skip link

The first Tab stop is **Skip to main content**. Activating it moves focus to `main#main-content`.

### Desktop navigation

Keyboard activation opens the Services family menu.

Escape:

- closes the menu;
- resets `aria-expanded`;
- returns focus to the menu toggle.

### Search combobox

With search results open:

- DOM focus remains on the input;
- ArrowDown changes `aria-activedescendant`;
- Escape closes the result popup;
- focus remains on the input.

### Dense table

The named Statistics horizontal table region can receive keyboard focus directly.

### SPA pathname navigation

Keyboard activation of a route link moves focus to the new page’s main landmark after the pathname changes.

### Cross-route fragment navigation

Cross-page links with a fragment now:

1. scroll the destination into view;
2. temporarily make a nonfocusable destination focusable when needed;
3. move focus to that destination;
4. remove the injected `tabindex` after focus leaves.

The real **Suggest a correction → #submission** journey is the regression case.

Same-page fragment behavior is intentionally left unchanged.

## Shared semantic cleanup

### BrandMark wrapper

The Navbar no longer assigns `onClick` to a plain `div` around the BrandMark.

The logo remains a normal link, while the existing route-change effect closes transient navigation state.

### Breadcrumbs

Breadcrumbs retain:

- `nav aria-label="Breadcrumb"`;
- ordered-list structure;
- `aria-current="page"`.

Breadcrumb links also now meet the 44px shared interaction-height baseline.

## Manual limits

W6-5e does not claim to prove:

- screen-reader announcement quality;
- reading order under assistive technology;
- computed focus contrast;
- clipping at browser zoom;
- virtual-keyboard behavior;
- practical target spacing at every viewport.

Those belong to W6-5f.

## Next

**W6-5f — Device & browser pass.**
