import fs from 'node:fs';

const page=fs.readFileSync('src/pages/Heritage.tsx','utf8');
const css=fs.readFileSync('src/index.css','utf8');
const audit=JSON.parse(fs.readFileSync('data/wave7-editorial-heritage.json','utf8'));
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));

for(const marker of [
  'bm-heritage-page',
  'bm-heritage-intro',
  'bm-heritage-sites mt-8 grid grid-cols-1 gap-5 md:grid-cols-2',
  'bm-heritage-place-card',
  'bm-heritage-media',
  'bm-heritage-caption',
  'bm-heritage-map-band',
  'bm-heritage-map-layout grid gap-6 xl:grid-cols-[0.68fr_1.32fr]',
  'bm-heritage-map-context',
  'bm-heritage-collections',
  'bm-heritage-collection-card',
  'bm-heritage-routes',
  'bm-heritage-route-card',
  'bm-heritage-handoff'
]) {
  if(!page.includes(marker)) throw new Error('W7-6c Heritage marker missing: '+marker);
}

for(const marker of [
  'placeRegistryById',
  'HeritageMap',
  'role="group"',
  "aria-label={t('corePages.heritage.mapView')}",
  'aria-pressed={mapSelection ===',
  "id={'collection-' + collection.id}",
  "id={'collection-' + route.id}",
  'alt={primaryMedia.alt}',
  'primaryMedia.sourceUrl',
  'primaryMedia.credit',
  'primaryMedia.licenseUrl',
  'directionsUrl(route.placeIds)',
  "to={'/history?collection=' + collection.id}",
  "to={'/history?collection=' + route.id}"
]) {
  if(!page.includes(marker)) throw new Error('W7-6c preserved heritage behavior/provenance marker missing: '+marker);
}

for(const marker of [
  'inline-flex min-h-11 items-center gap-1 font-bold text-primary-700',
  'inline-flex min-h-11 items-center gap-1 text-gray-500',
  'inline-flex min-h-11 items-center rounded-full border border-primary-200',
  'inline-flex min-h-11 items-center font-semibold text-gray-800'
]) {
  if(!page.includes(marker)) throw new Error('W7-6c 44px interaction marker missing: '+marker);
}

for(const marker of [
  '/* W7-6c — heritage editorial and place treatment. */',
  '.bm-heritage-page',
  '.bm-heritage-place-card',
  '.bm-heritage-caption',
  '.bm-heritage-map-band',
  '.bm-heritage-map-context',
  '.bm-heritage-collection-card',
  '.bm-heritage-route-card',
  '.bm-heritage-handoff',
  '@media (prefers-reduced-motion: reduce)'
]) {
  if(!css.includes(marker)) throw new Error('W7-6c CSS marker missing: '+marker);
}

if(audit.status!=='implementation-complete' || audit.step!=='W7-6c' || audit.next!=='W7-7 — Place and civic-asset integration polish') {
  throw new Error('W7-6c audit status or next pointer changed.');
}
if(pkg.scripts?.['check:wave7-editorial-heritage']!=='node scripts/check-wave7-editorial-heritage.mjs') {
  throw new Error('W7-6c guard registration missing.');
}
for(const pipeline of ['build','quality']) {
  for(const guardName of [
    'check:wave7-editorial-reports',
    'check:wave7-editorial-history',
    'check:wave7-editorial-heritage'
  ]) {
    if(!pkg.scripts?.[pipeline]?.includes('npm run '+guardName)) {
      throw new Error(guardName+' missing from '+pipeline+'.');
    }
  }
}

console.log('W7-6c Heritage editorial guard passed.');
