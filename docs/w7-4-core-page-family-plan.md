# W7-4 — Core page-family visual system

Status: planned-bounded  
Reviewed: 2026-09-30

## Purpose

Apply the Wave 7 visual vocabulary to BetterMakati's major reusable civic page families without mixing unrelated domains in one implementation run.

## Boundaries

### W7-4a — Service and discovery surfaces

Primary surfaces: Services, ServiceGuide, GovernmentOffices and their shared service/discovery patterns.

Focus:
- search/filter hero and control consistency;
- directory/list card hierarchy and density;
- service-guide section rhythm and action hierarchy;
- shared source/review treatment where already present;
- responsive containment and existing 44px controls.

Do not change service data, requirements, routes or official-source links.

### W7-4b — Evidence and accountability surfaces

Primary surfaces: Accountability, ProjectsBudget, PublicRecords and closely related evidence-index surfaces.

Focus:
- evidence-card and metric hierarchy;
- document/source handoffs;
- dense civic-data section rhythm;
- consistent green/gold emphasis without dashboard clutter;
- responsive tables/records and existing source semantics.

Do not reinterpret civic claims or change underlying records.

### W7-4c — Directory and detail shells

Primary surfaces: PublicRecordDetail, OfficialProfile, ProjectStatus, CityMonitorRecordPage and comparable detail shells that reuse civic metadata/action patterns.

Focus:
- page-header and metadata hierarchy;
- source/action clusters;
- related-context cards;
- reading width and long-content rhythm;
- consistent empty/secondary states.

Do not include BetterBarangay landing/profile visual parity; that remains W7-5.

## Shared rules

Use existing Wave 7 tokens and shared primitives before introducing page-specific styles. Preserve Wave 6 accessibility and responsive protections, anti-sermon copy, official-source links and BetterGov/BetterLGU handoffs. Each sub-slice gets its own implementation, guard/documentation where useful, CI handoff and verification before the next begins.

## Next

W7-4a — Service and discovery surfaces.
