import { readFile } from 'node:fs/promises';

const [auditRaw, css, packageRaw, doc] = await Promise.all([
  readFile('data/wave7-foundation-tokens.json', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('docs/w7-1-foundation-tokens.md', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) problems.push(name + ' marker missing: ' + marker);
};

if (audit.status !== 'complete-guarded' || audit.step !== 'W7-1') {
  problems.push('W7-1 foundation-token status changed.');
}
if (audit.next !== 'W7-2 — Global shell') {
  problems.push('W7-1 next-step pointer changed.');
}

for (const marker of [
  '--bm-surface-canvas:',
  '--bm-surface-paper:',
  '--bm-surface-muted:',
  '--bm-surface-brand:',
  '--bm-surface-accent:',
  '--bm-ink-strong:',
  '--bm-ink-muted:',
  '--bm-line-soft:',
  '--bm-line-strong:',
  '--bm-radius-control:',
  '--bm-radius-card:',
  '--bm-radius-feature:',
  '--bm-shadow-rest:',
  '--bm-shadow-lift:',
  '--bm-page-max:',
  '--bm-reading-max:',
  '--bm-motion-fast:',
  '--bm-motion-base:',
  'background: var(--bm-surface-canvas);',
  'color: var(--bm-ink-strong);',
  'max-width: var(--bm-page-max);',
  'box-shadow: var(--bm-shadow-rest);',
  'box-shadow: var(--bm-shadow-lift);',
  'border-radius: var(--bm-radius-control);',
  '.bm-reading-measure',
  '.bm-surface-paper',
  '.bm-surface-muted',
  '.bm-feature-rule',
  '.section-eyebrow::before',
  'background: var(--brand-gold);',
]) {
  need('W7-1 visual foundation', css, marker);
}

for (const preserved of [
  '@media (prefers-reduced-motion: reduce)',
  ':where(a, button, input, select, textarea, summary):focus-visible',
  'min-height: 44px',
]) {
  need('W7-1 preserved accessibility foundation', css, preserved);
}

need('W7-1 documentation', doc, 'Status: complete-guarded');
need('W7-1 documentation', doc, '**W7-2 — Global shell.**');

const scriptName = 'check:wave7-foundation-tokens';
const command = 'node scripts/check-wave7-foundation-tokens.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in ' + pipeline + '.');
  }
  if (!pkg.scripts?.[pipeline]?.includes('npm run check:wave6-responsive-a11y-closure')) {
    problems.push('Wave 6 closure must remain ahead of Wave 7 in ' + pipeline + '.');
  }
}

if (problems.length) {
  console.error('W7-1 foundation tokens failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W7-1 foundation tokens passed: semantic surfaces/ink/lines/radii/elevation/layout/motion are guarded, shared CSS consumes the new vocabulary, restrained gold section accents are present, and Wave 6 accessibility foundations remain intact.'
);
