# Wave 7 — Visual polish plan

Status: active  
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

## Remaining slices

### W7-3b — Homepage composition polish

Polish the homepage as one composition after the W7-3a hierarchy change. Normalize section rhythm, heading hierarchy, card density, gold accents and desktop use of width across the existing homepage journeys. Do not add new homepage features or rewrite the information architecture.

### W7-4 — Core page-family visual system

Apply the Wave 7 visual vocabulary coherently to the major reusable civic page families: service/discovery surfaces, evidence/accountability surfaces, directories/registries and detail-page shells. Prefer shared primitives and existing components. This slice may be divided into bounded sub-slices by page family when implementation size requires it.

### W7-5 — BetterBarangay visual parity

Bring BetterBarangay landing pages and shared barangay context surfaces to visual parity with the city experience. Preserve the persistent BetterBarangay context, barangay selection behavior and local information architecture. Barangay homepages should feel like local editions of BetterMakati rather than secondary database pages.

### W7-6 — Editorial, history and report treatment

Polish editorial surfaces such as Featured Reports & Insights, history/heritage and other evidence-rich long-form pages. Improve image use, captions, citations, reading rhythm and related-content handoffs using existing sourced material. Remove residual research-note or repository-like presentation where present; do not introduce unsupported civic claims.

### W7-7 — Place and civic-asset integration polish

Polish how parks, facilities, streets/routes, markers and other civic assets appear across relevant journeys. Assets should support orientation, services, reports, history and place discovery rather than become isolated rating features. Keep routes/segments conceptually distinct from buildings and parks.

### W7-8 — Site-wide visual consistency and responsive QA

Run a whole-site polish pass for spacing, typography, image behavior, card consistency, accidental whitespace, desktop composition, narrow-screen containment and interaction states. Resolve visual regressions without introducing new features. Extend automated guards/browser coverage where a regression class is repeatable.

### W7-9 — Wave 7 closure

Reconcile Wave 7 status records and guards, verify all bounded slices on CI, remove obsolete temporary Wave 7 notes if any, and formally close the visual-polish wave. Wave 8 may begin only after this closure passes.

## Execution rule

Implement one coherent bounded slice per run. A slice may span related components, responsive behavior, accessibility treatment, tests/guards and documentation when they belong to the same concept. Commit the slice and hand it to CI before starting the next unrelated slice.

If a remaining slice proves too large for one safe implementation pass, divide it into named sub-slices before code changes while preserving the scope above.
