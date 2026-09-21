# BetterMakati Brand Identity System

Reviewed: 2026-09-21

## Brand idea

BetterMakati is an independent civic information and participation platform for Makati.

The identity should feel civic, contemporary, grounded in Makati and clearly independent from government branding. It should not imitate a city seal, shield, agency mark or corporate real-estate identity.

## Core mark

The symbol combines:

- a Baybayin-inspired **Ma** / prominent abstract **M**;
- two flowing hill forms;
- a rising Philippine sun;
- lower flowing strokes that can evoke the Pasig River / Makati's historical landscape.

The mark is a contemporary civic design. It is not an official seal and should not be presented as a literal historical flag reconstruction.

Do not add:

- enclosing shields;
- skyline silhouettes;
- extra ground arcs;
- decorative gradients inside the mark;
- additional gold hues.

## Approved colour system

### Deep green

`#176238`

Primary civic identity colour. Use for primary actions, navigation states, the main symbol, headings/emphasis and dark brand surfaces.

### Sun gold

`#DCA514`

The single approved identity gold. Use for the sun, the word **Better**, rules, small identity accents and selected emphasis.

Do not introduce a second gold hue. Light/dark tints may be used for UI states, but they must derive from the same sun-gold family.

Do not use gold for long or small body copy.

### Warm white

`#FFFDF8`

Primary page/surface background. Prefer this to cold pure-white expanses where a branded background is appropriate.

### Neutral text

Readable warm-neutral grays are used for body text, metadata, borders and secondary UI.

Semantic success, warning and error colours are functional colours, not brand colours.

## Wordmark

Primary horizontal treatment:

- **Better** — sun gold
- **Makati** — deep green
- Figtree, bold/extrabold, tight tracking

Reverse treatment on deep green or another dark background:

- symbol — all white
- full wordmark — all white

Secondary single-colour treatment on deep green:

- symbol — sun gold

## Typography

### Figtree

Brand, wordmark, display headings and prominent civic labels.

### Inter

Navigation, body copy, forms, tables, records, dashboards and general UI.

### Roboto Mono

Technical labels, code, machine-readable/data contexts and places where monospaced structure adds meaning.

## Interface principles

### Navigation and actions

Deep green is the dominant action/navigation colour. Gold is an accent, not a competing CTA colour.

### Section labels

Section eyebrows use green text with a short gold rule.

### Cards

Cards are restrained: warm/white surfaces, subtle green-aware borders and shadows, limited decorative effects.

### Dark sections

Use deep green with the all-white reverse brand mark. Gold may appear as a rule or focused accent.

### Imagery

Use varied Makati imagery: neighborhoods, heritage, public spaces, streets, transport, government, river/city edges and daily life. Avoid visually reducing Makati to CBD skyline imagery.

Photo credits and source/license information remain visible where required.

### Data and charts

Brand colours can establish hierarchy, but charts may use additional functional colours when necessary for differentiation.

Never rely on colour alone. Labels, legends and source notes are required where interpretation depends on distinctions.

## Accessibility

Brand implementation must preserve readable contrast, visible focus states, touch targets and reduced-motion preferences.

Gold is not used as small text on warm white because contrast is insufficient for body copy.

## Production assets

- `/bettermakati-mark.svg` — primary green + gold
- `/bettermakati-mark-white.svg` — all-white reverse
- `/bettermakati-mark-gold.svg` — single-gold secondary
- `/bettermakati-mark-mono.svg` — single green
- `/bettermakati-icon.svg` — compact app/browser mark

## Web tokens

The live implementation is centralized in `src/index.css`.

Core variables:

```css
--brand-green: #176238;
--brand-green-dark: #0D3822;
--brand-gold: #DCA514;
--brand-warm-white: #FFFDF8;
--font-brand: 'Figtree';
--font-ui: 'Inter';
--font-technical: 'Roboto Mono';
```

New components and pages should use the existing semantic Tailwind primary/secondary scales and shared brand classes instead of introducing arbitrary competing identity colours.
