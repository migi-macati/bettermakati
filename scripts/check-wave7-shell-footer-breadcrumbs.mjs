import { readFile } from 'node:fs/promises';

const [auditRaw, footer, breadcrumbs, css, packageRaw, doc] = await Promise.all([
  readFile('data/wave7-shell-footer-breadcrumbs.json', 'utf8'),
  readFile('src/components/layout/Footer.tsx', 'utf8'),
  readFile('src/components/ui/Breadcrumbs.tsx', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('docs/w7-2b-shell-footer-breadcrumbs.md', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];
const need = (name, source, marker) => {
  if (!source.includes(marker)) problems.push(name + ' marker missing: ' + marker);
};

if (audit.status !== 'complete-guarded' || audit.step !== 'W7-2b') {
  problems.push('W7-2b shell status changed.');
}
if (audit.next !== 'W7-3') problems.push('W7-2b next-step pointer changed.');

for (const marker of [
  'bm-site-footer text-white',
  'bm-site-footer-rule',
  'bm-site-footer-ecosystem',
  'bm-site-footer-legal',
  'Official & broader ecosystem',
  'Independent civic information platform for',
  'focus-visible:outline-secondary-300',
]) need('W7-2b Footer', footer, marker);

for (const marker of [
  'aria-label="Breadcrumb"',
  'bm-breadcrumbs',
  'bm-breadcrumb-list',
  'bm-breadcrumb-current',
  'aria-current={isCurrent ? \'page\' : undefined}',
  'min-h-11',
]) need('W7-2b Breadcrumbs', breadcrumbs, marker);

for (const marker of [
  '.bm-site-footer',
  '.bm-site-footer-rule',
  '.bm-site-footer-ecosystem',
  '.bm-breadcrumbs',
  'overflow-x: auto;',
  'overscroll-behavior-x: contain;',
  '.bm-breadcrumb-list',
  'width: max-content;',
]) need('W7-2b shell CSS', css, marker);

need('W7-2b documentation', doc, 'W7-2 — Global shell is complete-guarded');

const scriptName = 'check:wave7-shell-footer-breadcrumbs';
const command = 'node scripts/check-wave7-shell-footer-breadcrumbs.mjs';
if (pkg.scripts?.[scriptName] !== command) problems.push(scriptName + ' script registration is missing.');
for (const pipeline of ['build', 'quality']) {
  for (const check of ['check:wave7-shell-header', scriptName]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + check)) {
      problems.push(check + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error('W7-2b footer/breadcrumb shell failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log('W7-2b footer/breadcrumb shell passed: footer hierarchy and ecosystem handoffs are preserved, and shared breadcrumbs remain accessible and contained on narrow screens.');
