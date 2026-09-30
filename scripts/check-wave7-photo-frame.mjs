import fs from 'node:fs';

const city = fs.readFileSync('src/components/ui/CityPhoto.tsx', 'utf8');
const carousel = fs.readFileSync('src/components/ui/PhotoCarousel.tsx', 'utf8');
const css = fs.readFileSync('src/index.css', 'utf8');

const failures = [];
if (!city.includes('className="bm-photo-frame overflow-hidden"')) failures.push('CityPhoto must use bm-photo-frame');
if (!carousel.includes("'photo-frame bm-photo-frame overflow-hidden '")) failures.push('PhotoCarousel must use bm-photo-frame');
for (const token of ['border: 1px solid var(--bm-line-soft);','border-radius: var(--bm-radius-card);','background: var(--bm-surface-paper);','box-shadow: var(--bm-shadow-rest);']) {
  if (!css.includes(token)) failures.push('bm-photo-frame missing token: ' + token);
}
if (!css.includes('.bm-photo-frame {')) failures.push('bm-photo-frame rule missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('W7-8c shared photography frame guard passed.');
