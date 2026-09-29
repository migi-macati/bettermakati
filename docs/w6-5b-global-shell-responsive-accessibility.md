# W6-5b — Global shell responsive & accessibility

Status: complete-static-shell-live-browser-deferred  
Reviewed: 2026-09-29

## Purpose

Close the shared-shell portion of Wave 6 responsive/accessibility work without mixing it with forms, complex components or the later live device/browser pass.

This step covers:

- Navbar utility and main navigation;
- BetterMakati brand/home target;
- BetterBarangay context bar;
- Footer links;
- shell-level focus visibility;
- transient navigation state.

The machine-readable audit is in:

`data/wave6-global-shell-responsive-accessibility.json`

## Resolved

### Navbar utility bar

The following shared utility controls now expose a minimum 44px interaction height:

- Emergency 911;
- City Hall;
- All hotlines;
- Official Makati site.

This preserves the compact utility-bar appearance while making the interactive box easier to acquire on touch screens.

### Desktop submenu controls

Desktop submenu chevrons now use both:

- `min-h-11`;
- `min-w-11`.

The text portion and toggle portion therefore remain separate controls without leaving the toggle below the 44px shell baseline.

### Brand/home target

`BrandMark` now has a minimum 44px link height.

This matters at the narrowest layout, where the horizontal logo image itself can render shorter than 44px even though the logo remains visually appropriate.

### Transparent select focus

Two shell surfaces use a transparent native `select` laid over a styled visual proxy:

- desktop preferred-barangay selector;
- BetterBarangay context selector.

Keyboard focus previously landed on the native select but the element itself was transparent.

Both wrappers now expose a visible `focus-within` ring so the selected visual surface clearly shows focus while retaining the native select interaction.

### BetterBarangay context bar

The selector surface and homepage action now meet the 44px baseline.

Below the `sm` breakpoint, the visible action label is shortened to **Homepage** to reduce squeeze at 320–390px widths. The accessible name remains explicit about the selected barangay homepage.

### Footer

All Footer interactive text links now expose a 44px minimum interaction height, including:

- Contact BetterMakati;
- email;
- Facebook and Instagram;
- GitHub;
- footer section navigation;
- broader ecosystem links;
- identity, privacy, terms and coverage links.

### Focus contrast on dark shell surfaces

Dark-shell links explicitly use the gold secondary focus outline in addition to the global focus treatment.

This applies to:

- the top utility bar;
- inverse BetterMakati logo;
- BetterBarangay context action;
- Footer links.

### Route-change state reset

Open main-navigation state is now cleared whenever the route’s:

- pathname;
- query string;
- fragment

changes.

This prevents a mobile drawer or desktop submenu from remaining visibly open after navigation triggered by browser history, programmatic navigation or a hash/query change.

## Preserved behavior

The shell still retains:

- skip-to-main-content link;
- one primary `main` landmark;
- desktop/mobile navigation split at `xl`;
- `aria-expanded` and `aria-controls` on submenu controls;
- Escape-to-close behavior with focus return;
- current-page `aria-current`;
- 44px mobile search, barangay and menu controls;
- implicit Footer `contentinfo` landmark.

## Static closure rule

W6-5b rejects the return of:

- `min-h-9` or `min-h-10` in the audited shell controls;
- `min-w-9` for the desktop submenu toggle;
- transparent shell selectors without a visible focus proxy;
- route-dependent menu state without location-change reset.

## Deferred to W6-5f

This step does not claim visual/browser proof for:

- 320px and 390px wrapping;
- sticky header behavior under zoom;
- computed focus/hover contrast;
- complete keyboard traversal at every viewport;
- screen-reader announcements.

Those remain part of the device/browser pass.

## Next

**W6-5c — Controls, forms & search.**
