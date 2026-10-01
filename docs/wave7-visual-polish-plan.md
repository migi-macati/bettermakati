# Wave 7 — Visual polish plan

Status: closed-verified  
Formalized: 2026-09-30  
Closed: 2026-10-01

## Purpose

Complete BetterMakati's visual-polish phase after the structural, responsive and accessibility work of Wave 6. Wave 7 makes the site feel distinctly Makati and editorially confident without adding decorative clutter, marketing copy, or new information architecture.

## Principles

- Preserve Wave 6 responsive and accessibility protections, including keyboard behavior, visible focus, semantic structure, reduced-motion support, 44px interaction targets and 320px containment.
- Use deep green as the civic foundation and gold as a restrained accent for actions, selected states, rules and identity cues rather than as a dominant field.
- Reuse the BetterMakati mark and existing image assets consistently; prefer purposeful photography and place context over generic decoration.
- Improve hierarchy, density, spacing and desktop composition without weakening mobile layouts.
- Let the interface and information demonstrate value. Do not add sermons, completeness claims, internal notes, repeated guardrails, or “why this exists” copy.
- Reuse shared components and visual patterns instead of creating page-specific variants without a functional reason.
- Keep BetterGov and BetterLGU handoffs contextual and preserve existing civic cross-linking.
- Keep Wave 8 separate: whole-site English/Filipino language behavior begins only after Wave 7 closes.

## Completed slices

- W7-1 — Visual foundation: shared visual tokens.
- W7-2 — Global shell: header/navigation, footer and breadcrumbs.
- W7-3a — Homepage visual storytelling: Around Makati photography moved directly below the hero while preserving accessible carousel controls and homepage information architecture.
- W7-3b — Homepage composition polish: section rhythm, hierarchy, card density, restrained accents and desktop composition.
- W7-4 — Core page-family visual system: service/discovery, evidence/accountability and detail shells.
- W7-5 — BetterBarangay visual parity: barangay landing pages and context surfaces brought into the city design language while retaining local scope.
- W7-6 — Editorial treatment: Reports & Insights, History and Heritage received purpose-built editorial compositions.
- W7-7 — Civic-asset integration: places, bounded infrastructure and network-service routes receive distinct treatments without collapsing their different meanings.
- W7-8 — Site-wide consistency and responsive QA: heading/surface consistency, representative page-family coverage, shared photography framing and expanded 200% text-reflow coverage.
- W7-9 — Closure: status reconciliation, benchmark synthesis, explicit Keep/Reject decisions and an automated closure guard.

## Verification

Wave 7's bounded implementation slices are represented by repository records under `docs/w7-*.md` and their associated build guards. W7-8d expanded the 200% text-resize browser journey across homepage, search, services, reports, history, heritage, mobility, BetterBarangay, projects/budget, statistics and calendar. Its branch CI passed, and the merged `main` state at `4310c7a2` passed independent CI run #2252.

The closure record in `docs/w7-9-wave7-closure.md` captures the external benchmark synthesis and the reasons for preserving the resulting design rather than extending Wave 7 with speculative redesign.

## Closure rule

Wave 7 is closed. New visual changes should be justified by a concrete user need, content requirement, accessibility defect or verified regression rather than reopening the wave as an open-ended polish program.

Wave 8 may proceed as the separate whole-site English/Filipino language phase.
