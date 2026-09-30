# W7-8d — 200% text reflow page-family coverage

Status: implementation-complete  
Reviewed: 2026-10-01

## Scope

Close the remaining responsive QA gap identified after W7-8b by extending the existing 200% text-resize browser check across the major Wave 7 page families.

## Coverage

The Playwright text-resize check now covers the homepage, search, services, reports, history, heritage, mobility, BetterBarangay, projects/budget, statistics and calendar journeys.

The existing assertion remains unchanged: at a 1024px viewport with the root text size set to 200%, neither the document nor body may develop page-level horizontal overflow.

## Boundaries

This slice changes browser coverage only. It does not alter production layout, copy, content, routes or interaction behavior.

## Next

After CI verifies this slice, reassess W7-8 against its remaining contract. If no evidence-backed regression class remains, proceed toward W7-9 closure rather than adding speculative polish.
