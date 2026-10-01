import { access, readFile } from 'node:fs/promises';

const requiredDocs = [
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
  'docs/w7-8d-text-reflow-coverage.md',
  'docs/w7-9-wave7-closure.md',
];

const [plan, closure, packageSource] = await Promise.all([
  readFile('docs/wave7-visual-polish-plan.md', 'utf8'),
  readFile('docs/w7-9-wave7-closure.md', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

await Promise.all(
  requiredDocs.map(async path => {
    try {
      await access(path);
    } catch {
      problems.push('Missing required Wave 7 record: ' + path);
    }
  })
);

if (!plan.includes('Status: closed-verified')) {
  problems.push('Wave 7 master plan must remain explicitly closed-verified.');
}
if (!plan.includes('W7-9 — Closure')) {
  problems.push('Wave 7 master plan must retain the W7-9 closure entry.');
}
if (plan.includes('## Remaining slices')) {
  problems.push('Closed Wave 7 plan must not restore a Remaining slices section.');
}
if (!closure.includes('Status: closed-verified')) {
  problems.push('W7-9 closure record must remain explicitly closed-verified.');
}
for (const marker of ['## Benchmark synthesis', '## Keep', '## Reject', '## Accessibility and responsive evidence']) {
  if (!closure.includes(marker)) {
    problems.push('W7-9 closure record missing section: ' + marker);
  }
}

const pkg = JSON.parse(packageSource);
for (const scriptName of ['build', 'quality']) {
  if (!pkg.scripts?.[scriptName]?.includes('npm run check:wave7-closure')) {
    problems.push('Wave 7 closure guard must run in ' + scriptName + '.');
  }
}
if (pkg.scripts?.['check:wave7-closure'] !== 'node scripts/check-wave7-closure.mjs') {
  problems.push('check:wave7-closure script mapping is missing or changed.');
}

if (problems.length) {
  console.error('Wave 7 closure failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log('Wave 7 closure passed: required records present, master plan closed, benchmark/Keep-Reject evidence retained, closure guard wired into build and quality.');
