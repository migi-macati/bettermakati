import fs from 'node:fs';

const home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const css = fs.readFileSync('src/index.css', 'utf8');

const requiredHome = [
  'bm-home-section',
  'bm-home-band-dark',
  'bm-home-band-muted',
  'bm-home-dark-card',
  'bm-home-card',
  'title="Around Makati"',
  'Common services',
  'Public action & evidence',
  'Take part in Makati',
  'Understand the city as you explore it',
  '<FeaturedInsightsCarousel />',
  'Makati at a glance',
];

const requiredCss = [
  '/* W7-3b — homepage composition. */',
  '.bm-home-section',
  '.bm-home-band-dark',
  '.bm-home-band-muted',
  '.bm-home-card',
  '.bm-home-dark-card',
  '@media (prefers-reduced-motion: reduce)',
];

for (const marker of requiredHome) {
  if (!home.includes(marker)) throw new Error(`W7-3b homepage marker missing: ${marker}`);
}
for (const marker of requiredCss) {
  if (!css.includes(marker)) throw new Error(`W7-3b style marker missing: ${marker}`);
}

console.log('W7-3b homepage composition guard passed.');
