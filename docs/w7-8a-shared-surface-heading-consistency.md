# W7-8a — Shared surface and heading consistency

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Remove an unintended global heading elevation rule discovered during the Wave 7 site-wide visual consistency pass, while preserving the established shared card elevation treatment.

## Change

- Headings no longer inherit the resting card shadow token.
- Shared home, category, civic, community-tool and statistic cards retain the existing resting elevation.
- No content, information architecture, civic data or interaction behavior changed.

## Guard

`check:wave7-visual-consistency` prevents the shared card shadow token from being reintroduced on heading selectors and confirms the card selector remains present. The guard runs in both build and quality.

## Next

After CI verifies this slice, continue W7-8 with the next bounded site-wide responsive/visual QA class.
