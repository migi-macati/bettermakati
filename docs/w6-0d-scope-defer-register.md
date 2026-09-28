# W6-0d — Scope / Defer Register

Status: complete  
Scope: repository `main`, following W6-0a baseline, W6-0b route/feature inventory and W6-0c core-journey matrix  
Purpose: freeze Wave 6 boundaries so implementation cannot silently expand into visual redesign, language work, unavailable-source work or speculative new products.

## 1. Classification rule

Every issue discovered from this point forward must be assigned to one of six buckets before implementation:

1. **W6 required** — necessary for the existing BetterMakati product to work coherently as one civic product.
2. **W7 visual redesign** — primarily aesthetic, expressive or visual-system work that does not block comprehension or task completion.
3. **W8 language** — English/modern-Filipino language architecture, translation and toggle behavior.
4. **Data / human-source blocked** — cannot be completed responsibly without evidence, rights, human testing or an authoritative source.
5. **Future enhancement** — useful but not required to complete an existing core journey.
6. **Obsolete / remove / reframe** — legacy product promise or code that no longer represents the intended product.

A discovered item does **not** enter W6 merely because it is nearby in the code.

## 2. W6 required

Wave 6 is the **whole-product finish**. It may change structure, wording, interaction behavior, route discovery and technical implementation when those changes improve an existing core journey.

### W6-0 baseline / closure infrastructure

- maintain the route + feature inventory
- maintain the core-journey matrix
- create Wave 6 automated closure guards
- reconcile production vs repository state before final closure
- preserve compatibility redirects unless a later audit shows removal is safe
- remove confirmed dead implementation files when they no longer serve a route or build dependency

### W6-1 information architecture and navigation

Required:

- reinforce canonical public doors: Services, Today, City, Barangays, Accountability, Participate, Explore Makati and Search
- clarify the role of adjacent Today / Monitor / Briefs / News / Calendar / Live surfaces
- clarify Accountability vs Projects & Budget vs Records vs Integrity vs Open Government
- clarify Participate vs Get Involved vs Community Tools vs Civic Map
- clarify Explore vs Mobility vs Estates vs Heritage vs Civic Map
- decide the appropriate discoverability of `/government-offices`
- decide the appropriate discoverability of `/contact`
- audit desktop/mobile nav parity
- audit footer duplication and role
- audit breadcrumbs, deep links, back-navigation, redirects and 404 recovery
- preserve BetterBarangay context only on genuinely sliceable surfaces

Not required:

- major new navigation visuals
- decorative menu redesign
- a completely new route taxonomy when existing route families are sufficient

### W6-2 search and discovery

Required:

- sitewide search-index completeness
- canonical deduplication and ranking
- useful aliases/synonyms
- category/filter clarity
- neutral zero-result recovery
- do not route all unresolved sitewide searches to Saan Ako Lalapit?
- retain service-specific escalation to Saan Ako Lalapit? where intent is a service/help need
- search entry points and deep-link behavior
- search journey regression tests
- later measurement of zero-result and result-selection signals

### W6-3 homepage and core journeys

Required:

- align homepage emphasis with W6-0c user jobs rather than feature count
- keep high-use services and emergency routes easy to recognize
- make BetterBarangay an obvious local entry
- make Today the synthesis door for current civic information
- give Participation appropriate first-order visibility
- give evidence/public records a recognizable journey
- reconcile stale public promises around parking/events/food
- preserve research and Explore entry points without turning the homepage into a directory
- correct obvious copy defects encountered within the scoped journey work

This is an **information hierarchy / journey pass**, not the Wave 7 aesthetic redesign.

### W6-4 relationships and cross-linking

Required:

- implement natural next-step links defined by the journey matrix
- government ↔ officials ↔ elections ↔ legislation ↔ source records
- accountability ↔ budgets/projects ↔ procurement/audit/commitments ↔ records ↔ later evidence
- civic timeline ↔ canonical records
- place ↔ barangay ↔ estate/district ↔ mobility ↔ heritage/history where evidence supports the relationship
- reports ↔ statistics/records/legislation/integrity where semantically useful
- BetterMakati ↔ BetterGov / BetterLGU ecosystem handoffs where the adjacent jurisdiction/service is genuinely useful
- remove circular or low-value cross-link dumping

Cross-link quantity is not a success metric.

### W6-5 responsive and accessibility completion

Required:

- whole-product keyboard/focus behavior
- semantic headings and landmarks
- touch-target minimums
- responsive overflow
- tables, charts, maps, carousels and forms
- loading/error states
- major mobile/tablet/desktop journey validation
- accessibility/browser regression guard

W6 may change visual presentation **when necessary for usability or accessibility**.

### W6-6 performance and technical discoverability

Required:

- bundle / route-load baseline
- justified route splitting and lazy loading
- image/font loading and caching
- metadata / canonical URLs
- sitemap / robots
- social previews
- static/deep-route behavior
- production checks for canonical domain behavior
- practical regression thresholds where stable enough to automate

### W6-7 analytics and journey measurement

Required:

- privacy-conscious measurement plan
- only collect what is needed to understand use and failure
- journey entry and completion proxies
- search queries in privacy-safe aggregated form where appropriate
- zero-result counts
- result selection
- barangay selection/context use
- official-service outbound handoffs
- participation starts/completions
- 404/error signals

Raw pageviews alone are insufficient.

### W6-8 governance and maintainability

Required:

- source/freshness ownership matrix
- automation/workflow review
- CI rationalization
- failure/recovery behavior
- release/maintenance runbook
- clear BetterMakati vs reusable BetterGov responsibilities
- documentation consistency
- stale product-copy checks where feasible
- no silent automated rewriting of civic facts

### W6-9 whole-product closure

Required:

- automated suite
- critical P0/P1 journey tests
- mobile and desktop browser pass
- production deployment verification
- no unresolved critical journey defect
- all remaining work explicitly classified into this register

## 3. Known W6-required defects already identified

| ID | Issue | W6 disposition |
| --- | --- | --- |
| W6-D1 | Sitewide search zero-result submission falls directly into Saan Ako Lalapit? | Fix in W6-2 with intent-neutral recovery |
| W6-D2 | `/government-offices` is useful but weakly surfaced | Decide placement/handoff in W6-1/W6-3 |
| W6-D3 | `/contact` is valid but weakly surfaced | Decide placement in W6-1 |
| W6-D4 | Participation is not clearly a first-order homepage job | Resolve in W6-3 |
| W6-D5 | Evidence/Public Records is only indirectly visible as a homepage job | Resolve in W6-3 |
| W6-D6 | Homepage visitor copy promises parking/events/food too broadly | Reconcile in W6-3 |
| W6-D7 | README still describes parking/events as active standalone coverage | Reconcile with public-product copy in W6-8 |
| W6-D8 | Saan Ako Lalapit? repeats “Describe what you need.” | Fix in relevant W6 journey batch |
| W6-D9 | Production may lag repository due Vercel build-rate limits | Verify/catch up before W6-9 closure |
| W6-D10 | Overlap clusters can read as competing front doors | Resolve through W6-1, W6-3 and W6-4 |
| W6-D11 | BetterBarangay context can only be carried where data is genuinely geographically attributable | Audit in W6-1/W6-4 and journey QA |

## 4. W7 — visual redesign

Wave 7 is reserved for the **major visual/design pass** after Wave 6 proves that the product architecture and journeys are sound.

### In scope for W7

- stronger, more distinctive BetterMakati visual language
- refined typography scale and editorial hierarchy
- refined spacing, density and page rhythm
- richer use of the BetterMakati green/gold identity
- stronger button/card/section visual hierarchy
- imagery strategy and visual storytelling
- homepage visual composition after W6 locks information hierarchy
- page-family visual differentiation while retaining a coherent system
- polished desktop use of wide screens / columns
- more deliberate responsive compositions
- consistent horizontal/compact/full logo applications
- charts/maps/cards visual refinement
- final high-quality visual pass across City, BetterBarangay, services, accountability, reports, history, heritage, mobility and participation
- benchmark-level polish against strong global civic/public-service websites

### Not reasons to defer to W7

If a visual problem blocks reading, focus, tapping, keyboard access, overflow handling, task comprehension or journey completion, it is **W6 accessibility/usability**, not W7.

### Existing constraints W7 must preserve

- deep green remains primary identity/action colour
- gold is an accent and must retain sufficient contrast
- no official-government visual impersonation
- real place/barangay photos must match the represented place
- historical imagery must be provenance-safe
- elections/officials remain visually neutral
- sources, periods, units and caveats remain legible
- do not trade accessibility for aesthetics

## 5. W8 — English / modern Filipino language experience

Wave 8 is the **whole-site language layer** after the product structure and visual system stabilize.

### In scope for W8

- English ↔ modern Filipino language toggle
- natural contemporary Filipino/Taglish for Filipino mode
- avoid unnecessarily archaic/purist translations
- avoid conyo phrasing
- retain common English spellings when they are the normal modern usage rather than forcing awkward phonetic spellings
- translate navigation, task labels, instructions, errors, empty states and page content systematically
- terminology glossary and consistency rules
- language-sensitive search aliases
- metadata / accessibility labels / form validation in both supported languages
- locale persistence and fallback behavior
- complete translation-coverage audit

### Existing technical state

The repository already contains i18n infrastructure and English/Filipino locale scaffolding. It also contains an older language registry listing additional Philippine languages.

**W6 rule:** do not remove the i18n foundation merely because the current product is mostly English.

**W8 rule:** decide which locale architecture is canonical, remove or isolate unsupported legacy language choices, and complete the actual two-language public experience.

## 6. Data / human-source blocked

These items may be documented and surfaced transparently, but Wave 6 must not manufacture completion.

### Human validation / accessibility

- Baybayin recognition testing with relevant readers/general residents
- consented usability testing with actual users
- senior-user usability testing
- screen-reader-user testing

Automated checks can reduce defects but cannot substitute for these human studies.

### Image / rights gaps

- verified reusable elected-official portraits where rights are not established
- event-matched archival imagery without known provenance/reproduction rights
- historical visual material that cannot be confidently tied to the event/place represented

No generated image should be presented as documentary evidence.

### Public-source gaps

Known examples include:

- no authoritative single current citywide public-consultation calendar indexed
- consultation → decision → response outcomes are not consistently published
- any project/service/barangay field whose authoritative source has not been found or cannot be verified

Rule: show the gap; do not infer the missing civic fact.

## 7. Future enhancements

These may be valuable but are not necessary to complete a current core journey.

### Already represented in repository data as planned

- **Opportunities Hub** — jobs, scholarships, training, internships and volunteering
- **Waste & Collection Guide** — waste rules, collection information and reporting channels

These remain planned until a later wave establishes authoritative data sources, maintenance workflow and user value.

### Other future candidates

- additional structured civic audits beyond the current public-park accessibility pilot
- additional BetterGov ecosystem integrations that require shared upstream capabilities not yet present
- additional languages beyond the W8 English/modern-Filipino target
- deeper personalization that requires accounts or unnecessary personal data
- new general-purpose product sections without a demonstrated unmet journey

A future feature should not be built merely because data could be collected for it.

## 8. Obsolete / remove / reframe

### O1 — `src/pages/Transparency.tsx`

Confirmed unrouted legacy page. `/transparency` already redirects to `/projects-budget`.

**Action:** remove the dead page implementation during a safe W6 cleanup; retain the compatibility redirect unless link/traffic evidence later supports removing it.

### O2 — standalone Parking Finder product promise

`communityTools.ts` still marks **Parking Finder** as Live and links to `/parking`, which now redirects to Explore Makati.

**Action:** remove the standalone tool card/product promise. Parking may remain contextual information where current reliable sources exist.

### O3 — generic What’s On product promise

`communityTools.ts` still marks **What’s On** as Live and links to `/whats-on`, which now redirects to the civic Makati Calendar.

**Action:** reframe the card around **Makati Calendar** and its actual civic-date value, or remove the old card if Calendar is already represented sufficiently elsewhere.

### O4 — stale copy that implies retired products

Includes homepage/README language treating parking and generic events as equivalent standalone products.

**Action:** reconcile in W6-3/W6-8.

### O5 — unsupported language choices, if any are exposed

The legacy language registry lists more languages than the current public translation resources support.

**Action:** do not perform broad language cleanup in W6. W8 must determine whether these are future scaffolding or dead starter-kit remnants and ensure unsupported choices are not presented as functional public languages.

## 9. Explicit non-goals for Wave 6

Wave 6 will **not**:

- redesign the entire visual identity
- chase “best-looking civic site” aesthetics before journey architecture is stable
- translate the whole site
- introduce a new CMS solely for architectural neatness
- replace first-party evidence with inferred or generated civic facts
- create new general-purpose features to fill every conceivable civic use case
- turn Civic Map back into an undifferentiated rating product
- revive Parking Finder as a standalone feature without a durable data/use case
- revive generic entertainment-events discovery as a core product
- build accounts, profiles or precise-location tracking merely to claim personalization
- remove compatibility URLs casually
- broaden every page with every possible cross-link
- add engagement mechanics that do not help a defined civic journey

## 10. Change-control rule for all later W6 steps

When a new issue appears:

1. Does it block or materially weaken J1–J12?
   - **Yes:** W6 candidate.
2. Is it primarily aesthetic after the task already works?
   - **Yes:** W7.
3. Is it translation/localization/locale behavior?
   - **Yes:** W8.
4. Does it require unavailable evidence, rights or human testing?
   - **Yes:** data/human-source blocked.
5. Is it a genuinely new capability rather than completion of an existing journey?
   - **Yes:** future enhancement unless required by an unmet P0/P1 journey.
6. Is it a stale product promise, dead implementation or legacy path?
   - **Yes:** obsolete/remove/reframe, with redirects retained where useful.

Do not expand the active micro-step to solve a newly discovered item from another bucket. Record it here and continue the scoped step.

## 11. W6-0d conclusion

Wave 6 has one job: **make the existing BetterMakati product coherent, discoverable, usable, measurable and maintainable end-to-end.**

Wave 7 makes that stable product visually exceptional.  
Wave 8 makes that stable product work consistently in English and modern Filipino.

Evidence gaps remain evidence gaps until reliable evidence exists.
