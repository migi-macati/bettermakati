# W5-9c — Responsive, accessibility & visual QA

Reviewed: 2026-09-28

## Status

**Static repository QA complete. Live-browser verification remains deferred to W5-9d.**

This step checks the Wave 5 surfaces for mobile-width traps, small touch targets, missing state semantics and visual-pattern drift without pretending source inspection proves production rendering.

## Global baseline retained

BetterMakati already has a strong accessibility baseline in `src/index.css`:

- visible `:focus-visible` treatment for links, buttons, inputs, selects, textareas and summaries;
- `prefers-reduced-motion: reduce`;
- 44px minimum height for shared brand buttons and form controls.

W5-9c keeps that baseline and fixes Wave 5 controls that bypassed the shared component classes.

## Fixes

### History

The horizontally scrollable period filters now use 44px touch targets.

The expandable Source disclosure also has a 44px activation area.

The existing mobile behavior remains appropriate: eras scroll horizontally instead of compressing into unreadable pills, while the filter form moves to multiple columns only when enough width is available.

### Heritage

Heritage-map filter pills now keep the same 44px mobile baseline.

The map/text composition still waits until `xl` before becoming a split layout.

### Makati Calendar

Geographic relationship chips moved from 40px to 44px minimum height.

Topic, barangay, actionability, text search and date inputs now explicitly preserve the 44px baseline.

The public view remains one column on small screens and progressively expands at `md` and `xl`.

### Makati in the News

The Refresh action now preserves a 44px target.

The live-feed status card exposes `aria-busy`, and a failed fetch is announced with `role="alert"`.

Related BetterMakati chips, publisher actions, alternate-coverage links and expandable summaries now use larger touch targets.

Headline metadata already wraps, and story cards remain single-column until large screens.

### Mobility

The route-filter **Clear** control was the main remaining small target. It now fills the 44px input height.

Expandable route/source summaries also use a 44px activation area.

The intentional horizontal chip strips remain: narrow screens scroll them, while `sm` and larger screens wrap them.

### Explore Makati

The expandable visitor-resource disclosure now keeps a 44px touch target.

Existing discovery chips retain the intentional mobile horizontal-scroll pattern and wrap from `sm`.

### Global Search

Search category chips now preserve the same 44px baseline.

The existing ARIA model remains intact:

- input as combobox;
- `aria-expanded`;
- controlled listbox;
- active descendant;
- result rows as options;
- keyboard navigation.

## Visual consistency

W5-9c does not force all Wave 5 pages into one identical page template.

The common language is instead:

- BetterMakati warm white, green and gold;
- shared Section/Heading primitives;
- consistent card radii and borders;
- reusable brand buttons/chips;
- progressive responsive grids;
- metadata that wraps instead of widening the page.

History, Calendar, News, Mobility and Explore Makati have different information structures, so identical hero/layout treatment would reduce usability rather than improve consistency.

## What static QA cannot establish

This step does **not** claim:

- that every production viewport has been visually inspected;
- pixel-perfect rendering across browsers;
- automated WCAG contrast measurement of every state;
- absence of runtime layout shift or third-party-content effects.

Those belong to the final deployment/live-browser pass.

## Guard

New gate:

`check:wave5-responsive-a11y`

It protects the global accessibility baseline and the specific responsive/touch-target fixes made in this step.

## Next

**W5-9d — Deployment & live-browser closeout.**
