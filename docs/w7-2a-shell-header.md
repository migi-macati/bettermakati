# W7-2a — Header & navigation shell

Status: complete-guarded  
Reviewed: 2026-09-30

## Purpose

Polish the high-frequency top shell without changing BetterMakati's navigation model.

This slice covers the utility strip, sticky header, desktop navigation, Search entry points, mobile menu, preferred-barangay controls and the BetterBarangay context bar. Footer and breadcrumbs remain a separate W7-2b slice so the global-shell pass stays bounded.

Machine-readable record:

`data/wave7-shell-header.json`

## Visual direction

The shell now uses the W7 semantic visual vocabulary instead of one-off cream and border values.

The hierarchy is deliberately restrained:

- dark green utility strip for emergency and official handoffs;
- warm, lightly translucent sticky navigation surface;
- paper dropdowns with a short gold top rule;
- gold-tinted Search as the clearest global action;
- explicit but quiet bordered mobile controls;
- green BetterBarangay context surface with the existing gold **Better** treatment.

Gold remains an accent rather than a large background field.

## What did not change

W7-2a does not restructure navigation or add features.

It preserves:

- existing information architecture and labels;
- the desktop/mobile split at `xl`;
- 44px touch targets;
- `aria-expanded` / `aria-controls`;
- Escape-to-close and focus return;
- current-page semantics;
- route-change cleanup;
- visible focus treatment for transparent barangay selectors.

## Guard

New repository check:

`check:wave7-shell-header`

It runs after W7-1 in both `quality` and `build`, and protects the semantic shell classes, gold-accent Search treatment, mobile control surfaces, BetterBarangay visual treatment and all key Wave 6 accessibility markers.

## Next

**W7-2b — Footer & breadcrumbs.**
