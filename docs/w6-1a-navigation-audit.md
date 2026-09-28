# W6-1a — Navigation Audit

Status: complete  
Scope: global desktop/mobile navigation, footer, BetterBarangay context, breadcrumbs/back-navigation, route discoverability and existing browser coverage  
Purpose: identify navigation defects before W6-1b changes the shell.

## 1. Baseline

The current navigation system has:

- 7 configured top-level civic families:
  - Services
  - Today
  - City
  - Barangays
  - Accountability
  - Participate
  - Explore Makati
- persistent search access on desktop and compact/mobile layouts
- direct emergency 911, City Hall and Hotlines access above the main navigation
- BrandMark → Home
- optional remembered BetterBarangay access
- BetterBarangay context bar on selected sliceable surfaces
- a three-section footer with 34 configured links
- a dedicated 404 recovery page with Home, Search and sitewide search
- desktop/mobile menus generated from the same `mainNavigation` data source

The latest CI run at this audit point passes both **build** and **browser-smoke** jobs, including the W6 baseline guard.

## 2. What already works well

### Emergency escape is appropriately global

The utility bar exposes:

- 911 directly
- City Hall phone
- All hotlines
- official Makati website

This supports J1 without making a user enter a reporting or service workflow first.

### Search is globally reachable

Search has a dedicated control in both desktop and compact navigation, plus homepage and 404 entry points.

### Desktop and mobile use the same navigation model

There is no separate manually maintained mobile sitemap, which reduces drift.

### Basic menu accessibility is sound

Current shell includes:

- labelled main navigation
- `aria-expanded` / `aria-controls`
- Escape handling
- outside-click closing
- 44px-class touch targets
- accessible search and menu labels

Existing browser/a11y tests cover the shell indirectly and the latest browser-smoke job passes.

### 404 recovery is strong

The 404 page offers Home, Search, and the full site search component rather than a dead end.

## 3. Navigation defects and risks

### N1 — dropdown parents are not themselves navigable

**Severity: high**  
**W6 owner: W6-1b**

For five top-level families, the configured `href` is not a clickable destination. The top-level label is only a menu toggle:

- Today → `/today`
- City → `/government`
- Accountability → `/accountability`
- Participate → `/participate`
- Explore Makati → `/visit`

The user must open the menu and choose a child. This weakens the canonical-door model established in W6-0c.

It is especially noticeable where the first child uses a different product label:

- City → Government
- Accountability → Accountability Ledger
- Participate → Participation Hub
- Explore Makati → City starting points

**Direction:** W6-1b should make each canonical family door directly usable while retaining an accessible submenu. A split link/toggle pattern or equivalent is preferable to adding more duplicate menu rows.

### N2 — duplicate routes can mark two top-level families active

**Severity: high**  
**W6 owner: W6-1b**

Two destinations currently exist under both City and Explore:

- `/estates`
- `/history`

Desktop current-section logic checks whether any child belongs to the current path. Therefore these pages can visually activate **both City and Explore Makati** at once.

Contextual duplicate links can be useful, but orientation should still identify one primary navigation family.

**Direction:** either assign canonical ownership or introduce an explicit primary-parent mapping for active state. Contextual cross-links can remain elsewhere.

### N3 — query/hash navigation states are not recognized as current

**Severity: high**  
**W6 owner: W6-1b / W6-1d**

`isCurrent()` compares configured href with `pathname + hash` and ignores `location.search`.

This means menu states such as:

- `/accountability?type=project`
- `/accountability?type=audit`
- `/accountability?type=commitment`
- `/get-involved?type=proposal#submission`
- `/get-involved?type=source#submission`
- `/get-involved?type=correction#submission`

do not receive correct child-level current-page semantics.

**Direction:** normalize pathname, search parameters and hash deliberately rather than string-comparing partial URLs.

### N4 — mobile navigation does not visibly orient the user to the current dropdown family

**Severity: medium-high**  
**W6 owner: W6-1b**

Desktop dropdown parents receive a current-section style. Mobile accordion parent buttons do not.

A user on Accountability, Today, City, Participate or Explore can open the mobile menu and see all collapsed sections styled identically. The relevant child is also hidden until its accordion is opened.

**Direction:** visibly mark the current mobile family and consider opening the current family by default when the menu is opened.

### N5 — Services is under-supported in global navigation

**Severity: high for J2**  
**W6 owner: W6-1b / W6-1c**

Services is a top-level direct link with no supporting submenu, while two important service-support surfaces are elsewhere:

- **Saan Ako Lalapit?** is under Participate.
- **Government offices for Makati** has no global navigation entry.

This conflicts with the W6-0c decision that Services is the canonical P0 service door and Saan Ako Lalapit? is its fallback for unclear service needs.

**Direction:** keep Services canonical and expose its support tools as service-related navigation/handoffs. Do not require a citizen to interpret service-finding as participation.

### N6 — Participate mixes multiple different outcomes

**Severity: medium-high**  
**W6 owner: W6-1b**

The Participate dropdown currently contains 8 children spanning:

- official/community participation
- Civic Map
- Civic Map reports
- service-finding
- generic Community Tools
- proposal submission
- source submission
- correction submission

These do not all answer the same user intent.

In particular:

- Saan Ako Lalapit? belongs to service discovery.
- Community Tools is a mixed toolbox, not inherently participation.
- correction/source submission concerns BetterMakati maintenance as much as civic participation.

**Direction:** keep Participate task-first: join, report, observe, suggest/contribute. Move or demote unrelated utility navigation.

### N7 — Accountability mixes city/public accountability with BetterMakati self-accountability

**Severity: medium-high**  
**W6 owner: W6-1b / W6-1c**

The Accountability dropdown has 9 children.

It mixes city/public-record journeys with platform-governance surfaces:

- BetterMakati Status
- Open Government Audit / doctrine/self-audit

BetterMakati Status is clearly institutional. Open Government currently describes BetterMakati methodology and implementation/self-audit, so presenting it alongside city budget, procurement and audit records can blur who is being assessed.

**Direction:** preserve these platform-trust pages, but separate BetterMakati self-accountability from Makati-government accountability in navigation.

### N8 — footer behaves more like a sitemap than a prioritized footer

**Severity: medium**  
**W6 owner: W6-1c**

`footerNavigation` contains 34 configured links, before the separate email/social/identity links.

There is also explicit duplication:

- City Monitor appears under **Use Makati** and **Understand & participate**
- Civic Briefs appears under both sections

Many other major routes are duplicated between global navigation and footer, which is expected, but the footer currently reproduces too much of the product hierarchy instead of helping with recovery, institutional trust and secondary destinations.

**Direction:** simplify around:
- high-value recovery/use links
- civic understanding/records
- BetterMakati institutional/contact/status
- BetterGov/BetterLGU and official Makati exits

### N9 — Contact exists as a useful page but is not a labelled navigation destination

**Severity: low-medium**  
**W6 owner: W6-1c**

`/contact` distinguishes:
- BetterMakati contact
- structured contact/contribution routes
- City Government of Makati contact

The footer exposes the email address directly, but not the Contact page.

**Direction:** likely make Contact an institutional footer destination rather than a primary nav item.

### N10 — BetterBarangay context is exact-path based

**Severity: high for J3**  
**W6 owner: W6-1e**

The persistent BetterBarangay context bar appears only for exact paths in:

- `/services`
- `/projects-budget`
- `/accountability`
- `/participate`
- `/statistics`
- `/civic-map`

and for a barangay profile itself.

It does not automatically cover deeper child routes.

This is acceptable only when deeper content is not actually barangay-scoped. Current implementation needs a page-family audit rather than assuming exact paths are correct.

### N11 — confirmed barangay scope loss inside Services

**Severity: high for J3**  
**W6 owner: W6-1e**

On `/services?barangay=<slug>`, the page correctly shows barangay-specific service-location context.

However several internal links are built without `withBarangayScope()`, including:

- category/subcategory links
- service-guide links
- local Civic Map asset links

Therefore a citizen can select a barangay, enter Services, then lose explicit barangay context on the next logical step.

**Direction:** preserve barangay query context only where the target can use it accurately. Do not indiscriminately attach a barangay to records that are citywide.

### N12 — two barangay selectors have different semantics

**Severity: medium**  
**W6 owner: W6-1e**

The remembered-barangay selector in the desktop global nav changes the remembered barangay **and navigates to that barangay homepage**.

The BetterBarangay context-bar selector on sliceable pages changes the **current page scope in place**.

Both are conceptually “change barangay,” but they perform different actions.

**Direction:** make the distinction explicit:
- global selector = open/go to barangay
- context selector = change this page’s barangay view

### N13 — detail-page orientation is inconsistent

**Severity: medium**  
**W6 owner: W6-1d**

Breadcrumbs are used consistently in Document and Civic Map workflow/detail families, with custom labels.

Other important detail families instead use bespoke back links:

- service guides
- public-record details
- official profiles
- City Monitor record pages
- report articles

This is not automatically wrong, but there is no clear page-family rule.

**Direction:** define a consistent convention:
- breadcrumbs where hierarchy matters
- a clear “Back to …” route where the detail is a flat collection item
- both only when each adds distinct value

### N14 — generic Breadcrumbs auto-generation is unsafe for arbitrary dynamic routes

**Severity: low**  
**W6 owner: W6-1d**

If `Breadcrumbs` is used without explicit `items`, it derives labels and intermediate hrefs directly from URL segments.

For dynamic IDs/slugs, that can create ugly labels or intermediate paths that are not meaningful.

Current Civic Map/Document usages pass explicit items, so this is a future-regression risk rather than a current break.

**Direction:** prefer explicit breadcrumb data for dynamic/detail routes.

## 4. Route-discovery classification

### Intentionally reachable outside menu data

- Home — BrandMark
- Search — dedicated navbar control
- Civic audit/report workflows — downstream from Participate/Civic Map
- dynamic detail pages — downstream from parent collections

These should stay out of global navigation.

### Needs explicit disposition

- `/government-offices` — service-support destination
- `/contact` — institutional/footer destination

## 5. Proposed ownership for W6-1 microsteps

### W6-1b — desktop/mobile shell

Handle:

- N1 dropdown parents
- N2 single active family
- N3 query/hash current-state logic
- N4 mobile current-family orientation
- N5 Services support hierarchy
- N6 Participate simplification
- N7 Accountability/platform distinction

### W6-1c — footer/context navigation

Handle:

- N8 footer simplification
- N9 Contact disposition
- institutional BetterMakati / BetterGov / official-government exits

### W6-1d — breadcrumbs/back-navigation

Handle:

- N3 detail state where relevant
- N13 detail-page orientation
- N14 breadcrumb rules

### W6-1e — BetterBarangay entry/context

Handle:

- N10 exact-path scope model
- N11 Services scope loss
- N12 selector semantics
- barangay-context continuity across J3

### W6-1f — redirects, 404s, deep links

Current 404 recovery is already strong; later audit should focus on deep-route and compatibility behavior rather than rebuilding the page.

### W6-1g — navigation QA

Add browser coverage for:

- canonical parent door + submenu behavior
- one active top-level family at a time
- mobile current-family orientation
- query-driven submenu current state
- barangay-context preservation
- footer recovery destinations

## 6. W6-1a conclusion

The current shell is technically sound and accessible enough to evolve rather than replace.

The main navigation problem is **semantic hierarchy**:

- canonical doors are visually presented as destinations but behave only as toggles;
- Services support is underexposed;
- Participate and Accountability carry unrelated items;
- duplicated City/Explore routes create ambiguous active state;
- BetterBarangay scope can be lost in deeper service navigation.

W6-1b should therefore be a focused shell/IA correction, not a new visual navigation design.
