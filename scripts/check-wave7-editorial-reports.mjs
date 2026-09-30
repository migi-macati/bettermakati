import fs from 'node:fs';

const reports=fs.readFileSync('src/pages/Reports.tsx','utf8');
const teaser=fs.readFileSync('src/components/reports/ReportTeaser.tsx','utf8');
const article=fs.readFileSync('src/pages/ReportArticle.tsx','utf8');
const css=fs.readFileSync('src/index.css','utf8');
const audit=JSON.parse(fs.readFileSync('data/wave7-editorial-reports.json','utf8'));
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));

for(const marker of ['bm-editorial-hero','bm-editorial-section','bm-editorial-timeline']) {
  if(!reports.includes(marker)) throw new Error('W7-6a Reports marker missing: '+marker);
}
for(const marker of ['bm-report-lead','bm-report-carousel','bm-report-card']) {
  if(!teaser.includes(marker)) throw new Error('W7-6a teaser marker missing: '+marker);
}
for(const marker of [
  'bm-editorial-article-hero',
  'bm-reading-measure mx-auto space-y-12',
  'bm-editorial-synthesis',
  'bm-editorial-analysis',
  'bm-editorial-stat',
  'bm-editorial-methodology',
  'bm-editorial-related-card',
  'bm-editorial-sources',
  'bm-editorial-source-card'
]) {
  if(!article.includes(marker)) throw new Error('W7-6a article marker missing: '+marker);
}
for(const marker of [
  'EvidenceLinks',
  'SourceLink',
  'reportRelatedRecords',
  'timelineForCivicRecord',
  'publicRecordByUrl'
]) {
  if(!article.includes(marker)) throw new Error('W7-6a preserved evidence marker missing: '+marker);
}
for(const marker of [
  '/* W7-6a — reports and insights editorial treatment. */',
  '.bm-editorial-hero',
  '.bm-report-lead',
  '.bm-report-card',
  '.bm-editorial-synthesis',
  '.bm-editorial-analysis',
  '@media (prefers-reduced-motion: reduce)'
]) {
  if(!css.includes(marker)) throw new Error('W7-6a CSS marker missing: '+marker);
}
if(audit.status!=='implementation-complete' || audit.step!=='W7-6a' || audit.next!=='W7-6b — History') {
  throw new Error('W7-6a audit status or next pointer changed.');
}
if(pkg.scripts?.['check:wave7-editorial-reports']!=='node scripts/check-wave7-editorial-reports.mjs') {
  throw new Error('W7-6a guard registration missing.');
}
for(const pipeline of ['build','quality']) {
  if(!pkg.scripts?.[pipeline]?.includes('npm run check:wave7-editorial-reports')) {
    throw new Error('W7-6a guard missing from '+pipeline+'.');
  }
}
console.log('W7-6a Reports & Insights editorial guard passed.');
