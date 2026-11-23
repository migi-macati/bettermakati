import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const home = readFileSync('src/pages/Home.tsx', 'utf8');
for (const marker of ['<Hero />', '<figure>', '<figcaption', 'photo.credit', 'photo.license', 'divide-y', 'to="/budget-2027"', 'to="/statistics#city-comparison-title"']) {
  assert.ok(home.includes(marker), 'Missing homepage element: ' + marker);
}
for (const marker of ['<PhotoCarousel', '<FeaturedInsightsCarousel', 'section-eyebrow', 'stat-card']) {
  assert.ok(!home.includes(marker), 'Retired homepage element: ' + marker);
}
