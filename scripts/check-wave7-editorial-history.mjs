import fs from 'node:fs';

const page=fs.readFileSync('src/pages/History.tsx','utf8');
const css=fs.readFileSync('src/index.css','utf8');
const audit=JSON.parse(fs.readFileSync('data/wave7-editorial-history.json','utf8'));
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));

for(const marker of [
  'bm-history-page',
  'bm-history-intro',
  'bm-history-collection',
  'bm-history-periods',
  'bm-history-filters',
  'bm-history-control',
  'bm-history-timeline',
  'bm-history-dot',
  'bm-history-event',
  'bm-history-evidence-note',
  'bm-history-media-band',
  'bm-history-media-card',
  'bm-history-interpretation',
  'bm-history-relations',
  'bm-history-sources',
  'bm-history-empty'
]) {
  if(!page.includes(marker)) throw new Error('W7-6b History marker missing: '+marker);
}

for(const marker of [
  'makatiHistory',
  'historyEras',
  'historyReviewed',
  'evidenceLabels',
  'sourceTypeLabel',
  'eventSearchText',
  'historyImageSet',
  'heritageCollectionById',
  'primaryOnly',
  'newestFirst',
  'Download results',
  'SourceLink'
]) {
  if(!page.includes(marker)) throw new Error('W7-6b preserved History behavior/evidence marker missing: '+marker);
}

for(const marker of [
  'inline-flex min-h-11 items-center rounded-full border border-gray-200',
  'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-secondary-300',
  'inline-flex min-h-11 items-center rounded-full border border-primary-200'
]) {
  if(!page.includes(marker)) throw new Error('W7-6b 44px relationship target marker missing: '+marker);
}

for(const marker of [
  '/* W7-6b — Makati history editorial treatment. */',
  '.bm-history-page',
  '.bm-history-filters',
  '.bm-history-control:focus',
  '.bm-history-timeline',
  '.bm-history-event',
  '.bm-history-evidence-note',
  '.bm-history-media-card',
  '.bm-history-interpretation',
  '.bm-history-sources'
]) {
  if(!css.includes(marker)) throw new Error('W7-6b CSS marker missing: '+marker);
}

if(audit.status!=='implementation-complete' || audit.step!=='W7-6b' || audit.next!=='W7-6c — Heritage') {
  throw new Error('W7-6b audit status or next pointer changed.');
}
if(pkg.scripts?.['check:wave7-editorial-history']!=='node scripts/check-wave7-editorial-history.mjs') {
  throw new Error('W7-6b guard registration missing.');
}
for(const pipeline of ['build','quality']) {
  for(const guardName of ['check:wave7-editorial-reports','check:wave7-editorial-history']) {
    if(!pkg.scripts?.[pipeline]?.includes('npm run '+guardName)) {
      throw new Error(guardName+' missing from '+pipeline+'.');
    }
  }
}
console.log('W7-6b History editorial guard passed.');
