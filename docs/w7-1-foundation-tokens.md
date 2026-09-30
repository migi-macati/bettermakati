# W7-1 — Foundation tokens

Status: complete-guarded  
Reviewed: 2026-09-30

## Purpose

Start the Wave 7 visual/polish phase by establishing one restrained visual vocabulary before touching the global shell or individual page families.

Wave 7 is a design pass, not a feature-expansion wave. The goal is to make BetterMakati feel more deliberate, civic, local and visually coherent while preserving the product work already completed through Wave 6.

Machine-readable record:

`data/wave7-foundation-tokens.json`

## Design doctrine carried into Wave 7

The visual system stays:

- task-first and mobile-first;
- recognizably Makati without using green as wallpaper;
- gold-led in accents, rules and emphasis rather than large background fields;
- consistent in surfaces, radii, spacing and elevation;
- evidence-forward on civic/data pages;
- compatible with meaningful local photography later in W7-9;
- accessible by default, including the existing focus and reduced-motion foundations.

## Semantic token layer

W7-1 adds semantic tokens for:

- canvas, paper, muted, brand and accent surfaces;
- strong/muted ink and soft/strong dividers;
- control, card and feature radii;
- resting and lifted card elevation;
- page and reading-width limits;
- motion timing.

These sit above the existing authoritative BetterMakati green/gold palette rather than replacing it.

## Shared visual applications

The first pass uses those tokens in the global CSS foundations:

- body canvas and ink;
- container maximum width;
- shared card rest/hover shadows;
- shared button and form-control radii;
- shared form paper surface.

The existing `.section-eyebrow` now also renders a short gold rule. This gives section hierarchy a consistent Makati accent without increasing the amount of green on the page.

Reusable Wave 7 utility foundations are now available for later slices:

- `.bm-reading-measure`;
- `.bm-surface-paper`;
- `.bm-surface-muted`;
- `.bm-feature-rule`.

## Guard

New repository gate:

`check:wave7-foundation-tokens`

It runs in both `quality` and `build` and protects:

- the semantic token vocabulary;
- the tokenized global foundations;
- the restrained gold eyebrow rule;
- existing focus-visible and reduced-motion behavior;
- the W7-1 record and next-step pointer.

## Next

**W7-2 — Global shell.**
