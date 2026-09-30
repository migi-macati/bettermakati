# W7-8b — Representative page-family responsive coverage

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Extend the existing Wave 6/7 browser reflow matrix so the site-wide Wave 7 consistency pass exercises representative routes from the page families polished after the original responsive baseline.

## Change

The five-viewport Playwright reflow matrix now also covers:

- `/services` — service/discovery family
- `/reports` — reports and insights landing
- `/history` — editorial/history family
- `/mobility` — network and route-oriented civic information

These routes inherit the existing checks for a visible main region, one page heading, no document/body horizontal overflow, and no uncaught page errors at 320, 390, 768, 1024 and 1440 px widths.

## Preserved

No production UI, content, civic data, information architecture or interaction behavior changes in this slice.

## Next

After CI verifies this slice, continue W7-8 with the next bounded site-wide visual/responsive QA class.
