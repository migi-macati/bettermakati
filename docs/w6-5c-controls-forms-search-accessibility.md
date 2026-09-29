# W6-5c — Controls, forms & search

Status: complete-static-controls-live-browser-deferred  
Reviewed: 2026-09-29

## Purpose

Close the simple-control and form interaction layer of Wave 6 responsive/accessibility work without pulling dense tables, carousels or maps into this package.

The machine-readable audit is in:

`data/wave6-controls-forms-search-accessibility.json`

## Search

### Combobox focus model

The site/service search already used a strong combobox/listbox pattern.

W6-5c tightens it so the DOM focus model now matches the ARIA model:

- focus remains on the search input;
- arrow keys change the active option;
- `aria-activedescendant` identifies that option;
- listbox option buttons use `tabIndex={-1}` so Tab does not unexpectedly move through every search result.

### Clear-search focus

The clear-search control disappears once the query becomes empty.

W6-5c explicitly returns focus to the input after clearing so focus does not disappear with the unmounted button.

### Search filters

Search category chips now expose `aria-pressed`.

The type select keeps its existing accessible label and 44px minimum height.

The visible result count is now a polite live status.

### Popover positioning

The results panel now uses `top-full` relative to the search card instead of a fixed pixel offset.

This makes the popup resilient when the heading or search card height changes at narrow widths.

## Contact

Contact-page actions now meet the 44px BetterMakati repeated-control baseline, including:

- email;
- Facebook and Instagram;
- structured contact / Get Involved routes;
- City Hall telephone and email;
- official Makati site;
- Hotlines.

## BetterMakati submission forms

### Get Involved

The form now:

- exposes `aria-busy` while submitting;
- announces **Sending your submission…**;
- uses `role="alert"` for errors and `role="status"` for non-error states;
- associates the form with the privacy/sensitive-data note;
- keeps tracking, duplicate and GitHub continuation actions at least 44px high.

### Civic Nearby Report

The reporting form now:

- announces **Submitting your report…**;
- announces duplicate-confirmation and separate-record actions while processing;
- uses alert semantics for errors;
- keeps official-channel, duplicate-resolution and result actions touch sized.

The location-selection page also now:

- announces geolocation denial/unavailability and accuracy warnings;
- announces civic-registry search result counts;
- exposes `aria-pressed` on selectable place-result cards;
- explicitly preserves a 44px search-input height.

### Civic Contribution

The older contribution form now follows the same interaction contract:

- submitting-state announcement;
- duplicate-action announcement;
- alert semantics for errors;
- touch-sized official-channel and result actions.

### Civic Observation

The observation form now renders and announces its submitting state instead of only changing the submit-button label.

Errors use alert semantics and result/fallback links meet the 44px baseline.

## Directory and filter controls

### Government Offices

- search input has an explicit 44px minimum height;
- scope chips expose `aria-pressed`;
- filter chips use the 44px baseline;
- result count is a polite status;
- map/source/place-detail links are touch sized.

### City Monitor

- search and stream controls use the 44px baseline;
- filtered-record count is announced;
- place-context links use the 44px baseline.

### Public Records

- category and source-class selects use the 44px baseline;
- Official-only checkbox row uses the 44px baseline;
- matching-source count is announced;
- Clear filters is touch sized.

## Async list loading

### Participate

Community input now distinguishes:

1. loading;
2. feed unavailable;
3. genuinely empty feed.

Loading uses status semantics and a failed request uses alert semantics.

### Services

Service-category loading now distinguishes a fetch failure from a genuinely empty service category.

This prevents a network/runtime failure from being described to users as “No services listed.”

## Preserved patterns

W6-5c retains:

- shared `.form-field` sizing;
- explicit wrapping labels;
- native required/type/url/number validation;
- honeypot fields outside the Tab order;
- large full-card selection controls.

## Deferred

### W6-5d

Still owns:

- Table/List toggles;
- dense tables;
- carousels;
- maps;
- complex timeline/card interactions.

### W6-5e / W6-5f

Still own:

- full semantic/keyboard sampling;
- screen-reader sampling;
- real browser popup clipping;
- mobile virtual-keyboard behavior;
- computed contrast;
- zoom/reflow.

## Next

**W6-5d — Complex components.**
