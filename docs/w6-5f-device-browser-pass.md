# W6-5f — Device & browser pass

Status: complete-ci-browser-verified  
Reviewed: 2026-09-30

## Purpose

Run the current BetterMakati build through the Wave 6 responsive/accessibility browser matrix and close the runtime defects that static source checks could not prove.

Machine-readable evidence:

`data/wave6-device-browser-pass.json`

## Verified current-build proof

GitHub Actions **CI #2205** passed on commit `2b0fd57b4b9c70b1534490296b3fbd095b262ff1`.

The browser-smoke job builds the current commit, serves the Vite production preview locally, installs Playwright Chromium, and runs the critical-path, accessibility and responsive/accessibility suites.

This is current-build proof. It does not depend on the production Vercel deployment being current.

## Device matrix

The responsive suite exercises:

- 320 × 568;
- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1440 × 900.

Eight representative civic journeys are checked for page-level horizontal overflow at each viewport:

- Home;
- Search;
- Barangay Poblacion;
- Projects & Budget;
- Statistics;
- Calendar;
- a Civic Map asset;
- Heritage.

## Runtime checks

The passing browser suite also verifies:

- mobile navigation and Search popovers remain inside the viewport at 320px and 390px;
- the dense Statistics table is locally scrollable and keyboard-scrollable at 320px;
- reduced-motion preference suppresses Featured Reports autoplay behavior;
- the Civic Map iframe is keyboard focusable and retains a text fallback;
- 200% text resizing does not create page-level overflow on Home, Search, Services or Calendar;
- 51 representative substantive routes run through Axe with the documented WCAG tag set and no serious/critical findings.

## Defects closed during W6-5f

The live browser pass found and closed issues that source inspection alone did not reveal, including:

- 200% text reflow pressure in shared/footer and homepage content;
- overlapping Heritage map targets while preserving the 44px interaction baseline;
- narrow Projects & Budget card pressure;
- narrow Statistics card pressure;
- scroll-region/shell min-width containment needed for dense local tables.

The final functional fix was commit `2b0fd57b`, and CI #2205 passed.

## Boundaries

This is not a formal WCAG-conformance claim.

The automated browser proof is Chromium on Ubuntu. Firefox, WebKit/Safari, physical-device rendering and manual screen-reader behavior remain bounded follow-up rather than prerequisites for Wave 6 closure.

## Next

**W6-5g — Regression guard & closure.**
