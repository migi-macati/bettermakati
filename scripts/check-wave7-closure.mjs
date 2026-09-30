import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const plan = read('docs/wave7-visual-polish-plan.md');
const pkg = JSON.parse(read('package.json'));

const evidence = [
  'docs/w7-1-foundation-tokens.md',
  'docs/w7-2a-shell-header.md',
  'docs/w7-2b-shell-footer-breadcrumbs.md',
  'docs/w7-3b-homepage-composition.md',
  'docs/w7-4a-service-discovery.md',
  'docs/w7-4b-evidence-accountability.md',
  'docs/w7-4c-detail-shells.md',
  'docs/w7-5-betterbarangay-parity.md',
  'docs/w7-6a-editorial-reports.md',
  'docs/w7-6b-editorial-history.md',
  'docs/w7-6c-editorial-heritage.md',
  'docs/w7-7-civic-asset-integration.md',
  'docs/w7-8a-shared-surface-heading-consistency.md',
  'docs/w7-8b-page-family-responsive-coverage.md',
  'docs/w7-8c-shared-photo-frame.md',
  'docs/w7-9-wave7-closure.md',
];
const guards = [
  'check:wave7-foundation-tokens',
  'check:wave7-shell-header',
  'check:wave7-shell-footer-breadcrumbs',
  'check:wave7-homepage-composition',
  'check:wave7-service-discovery',
  'check:wave7-evidence-accountability',
  'check:wave7-detail-shells',
  'check:wave7-betterbarangay-parity',
  'check:wave7-editorial-reports',
  'check:wave7-editorial-history',
  'check:wave7-editorial-heritage',
  'check:wave7-civic-assets',
  'check:wave7-visual-consistency',
  'check:wave7-photo-frame',
];

const failures = [];
if (!plan.includes('Status: complete-verified')) failures.push('Wave 7 plan is not marked complete-verified');
for (const path of evidence) if (!fs.existsSync(path)) failures.push('Missing Wave 7 evidence: ' + path);
for (const name of guards) {
  if (!pkg.scripts[name]) failures.push('Missing Wave 7 script: ' + name);
  if (!pkg.scripts.build?.includes('npm run ' + name)) failures.push('Build does not run ' + name);
  if (!pkg.scripts.quality?.includes('npm run ' + name)) failures.push('Quality does not run ' + name);
}
for (const pipeline of ['build','quality']) {
  if (!pkg.scripts[pipeline]?.includes('npm run check:wave7-closure')) failures.push(pipeline + ' does not run Wave 7 closure guard');
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Wave 7 closure guard passed.');
