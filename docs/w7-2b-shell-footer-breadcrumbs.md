# W7-2b — Footer & breadcrumbs

Status: complete-guarded  
Reviewed: 2026-09-30

## Purpose

Finish the Wave 7 global-shell polish without changing BetterMakati's information architecture.

The footer keeps its existing civic, official and broader-ecosystem handoffs while gaining the Wave 7 surface vocabulary and a restrained gold identity cue. The shared breadcrumb keeps its existing navigation semantics and now contains long paths safely on narrow screens.

Machine-readable record:

`data/wave7-shell-footer-breadcrumbs.json`

## Preserved behavior

- BetterMakati remains described as an independent civic information platform.
- Existing footer groups and BetterGov/BetterLGU ecosystem links remain intact.
- Footer actions retain the 44px interaction baseline and visible focus treatment.
- Breadcrumbs remain a labelled navigation landmark.
- The current breadcrumb retains `aria-current="page"`.
- Light and dark breadcrumb tones remain supported.
- Long breadcrumb trails scroll horizontally within their own region instead of widening the page; the current label truncates only when needed.

## Visual direction

The footer stays dark green, with a restrained gold top rule and a faint gold atmospheric accent rather than a large gold field. Ecosystem and legal separators are slightly clearer. Breadcrumbs remain visually quiet so they support orientation without competing with page titles.

## Guard

`check:wave7-shell-footer-breadcrumbs` protects the shell classes, ecosystem/identity copy, breadcrumb accessibility markers and narrow-screen containment. It runs after W7-2a in both `quality` and `build`.

## Wave status

With W7-2a and W7-2b complete, **W7-2 — Global shell is complete-guarded**.

## Next

**W7-3.**
