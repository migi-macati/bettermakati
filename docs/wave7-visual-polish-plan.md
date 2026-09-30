# Wave 7 — Visual polish plan

Status: complete-verified  
Formalized: 2026-09-30

## Purpose

Complete BetterMakati's visual-polish phase after the structural, responsive and accessibility work of Wave 6. Wave 7 should make the site feel distinctly Makati and editorially confident without adding decorative clutter, marketing copy, or new information architecture.

## Principles

- Preserve Wave 6 responsive and accessibility protections, including keyboard behavior, visible focus, semantic structure, reduced-motion support, 44px interaction targets and 320px containment.
- Use deep green as the civic foundation and gold as a restrained accent for actions, selected states, rules and identity cues rather than as a dominant field.
- Reuse the BetterMakati mark and existing image assets consistently; prefer purposeful photography and place context over generic decoration.
- Improve hierarchy, density, spacing and desktop composition without weakening mobile layouts.
- Let the interface and information demonstrate value. Do not add sermons, completeness claims, internal notes, repeated guardrails, or “why this exists” copy.
- Reuse shared components and visual patterns instead of creating page-specific variants without a functional reason.
- Keep BetterGov and BetterLGU handoffs contextual and preserve existing civic cross-linking.
- Keep Wave 8 separate: whole-site English/Filipino language behavior begins only after Wave 7 closes.

## Completed

### W7-1 — Visual foundation
Complete-guarded. Establishes shared Wave 7 visual tokens.

### W7-2 — Global shell
Complete-guarded.

- W7-2a: header and navigation shell.
- W7-2b: footer and breadcrumbs.

### W7-3a — Homepage visual storytelling
Complete-verified. Moves the existing Around Makati photography directly below the hero so place and identity appear before deeper civic journeys, while retaining accessible carousel controls and the established homepage information architecture.

## Completed slices

### W7-3b — Homepage composition polish
Complete-verified.

### W7-4 — Core page-family visual system
Complete-verified across service/discovery, evidence/accountability and detail-shell sub-slices.

### W7-5 — BetterBarangay visual parity
Complete-verified.

### W7-6 — Editorial, history and report treatment
Complete-verified across reports, history and heritage sub-slices.

### W7-7 — Place and civic-asset integration polish
Complete-verified.

### W7-8 — Site-wide visual consistency and responsive QA
Complete-verified across shared surface/heading consistency, page-family responsive coverage and shared photography-frame consistency.

### W7-9 — Wave 7 closure
Complete-guarded. The closure guard verifies the Wave 7 plan, bounded-slice evidence and all Wave 7 guard scripts remain present and wired into both build and quality. Wave 8 may begin after this closure commit passes branch and post-merge CI.

## Execution rule

Implement one coherent bounded slice per run. A slice may span related components, responsive behavior, accessibility treatment, tests/guards and documentation when they belong to the same concept. Commit the slice and hand it to CI before starting the next unrelated slice.

If a remaining slice proves too large for one safe implementation pass, divide it into named sub-slices before code changes while preserving the scope above.
