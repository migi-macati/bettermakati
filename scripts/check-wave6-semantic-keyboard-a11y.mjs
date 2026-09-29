import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  doc,
  accessibility,
  navbar,
  scrollToTop,
  breadcrumbs,
  app,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-semantic-keyboard-accessibility.json', 'utf8'),
  readFile('docs/w6-5e-semantic-keyboard-accessibility.md', 'utf8'),
  readFile('tests/e2e/accessibility.spec.mjs', 'utf8'),
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/components/ui/ScrollToTop.tsx', 'utf8'),
  readFile('src/components/ui/Breadcrumbs.tsx', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) {
    problems.push(name + ' marker missing: ' + marker);
  }
};

if (audit.status !== 'complete-static-semantic-keyboard-browser-suite-expanded') {
  problems.push('W6-5e audit status changed.');
}
if (audit.next !== 'W6-5f — Device & browser pass') {
  problems.push('W6-5e next-step pointer changed.');
}
if (audit.coverage?.substantiveRoutePatterns !== 51) {
  problems.push('W6-5e substantive route-pattern baseline changed.');
}
if (audit.coverage?.representativeAxeRoutes !== 51) {
  problems.push('W6-5e Axe route coverage must remain at 51 representative URLs.');
}
if (audit.coverage?.uncoveredPatterns !== 0) {
  problems.push('W6-5e must not leave a substantive route pattern uncovered.');
}
if (audit.coverage?.browserKeyboardRegressions !== 6) {
  problems.push('W6-5e keyboard regression baseline changed.');
}

need('W6-5e documentation', doc, 'Status: complete-static-semantic-keyboard-browser-suite-expanded');
need('W6-5e documentation', doc, '**51 representative URLs covering all 51 substantive route patterns**');
need('W6-5e documentation', doc, '**W6-5f — Device & browser pass.**');

for (const marker of [
  "'wcag2a'",
  "'wcag2aa'",
  "'wcag21a'",
  "'wcag21aa'",
  "'wcag22aa'",
  "await expect(page.locator('main#main-content')).toHaveCount(1)",
  "await expect(page.locator('main#main-content h1')).toHaveCount(1)",
  "Every button must have an accessible name",
  "Every image must have an alt attribute",
  "We couldn’t find that page",
  "skip link is the first keyboard stop and moves focus to main content",
  "desktop navigation menu closes with Escape and restores toggle focus",
  "search combobox keeps DOM focus while arrowing through results and closes on Escape",
  "dense horizontal table region is keyboard focusable and named",
  "SPA pathname navigation moves focus to main content",
  "cross-route fragment navigation focuses the destination section",
]) {
  need('Accessibility browser suite', accessibility, marker);
}
if (accessibility.includes("'wcag22a'")) {
  problems.push('Accessibility suite should use axe-core WCAG 2.2 AA tag, not unsupported wcag22a.');
}

const routeBlock = accessibility.match(/const routes = \[([\s\S]*?)\];/);
const axeRoutes = routeBlock
  ? [...routeBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1])
  : [];
if (axeRoutes.length !== 51) {
  problems.push('Accessibility route list changed: expected 51, found ' + axeRoutes.length + '.');
}

const appRoutes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map(match => match[1]);
const substantive = appRoutes.filter(
  route =>
    ![
      '/parking',
      '/whats-on',
      '/transparency',
      '/reports/makati-overview',
      '*',
    ].includes(route)
);

const patternCovered = pattern => {
  if (!pattern.includes(':')) return axeRoutes.includes(pattern);
  const prefix = pattern.split('/:')[0] + '/';
  return axeRoutes.some(route => route.startsWith(prefix));
};
const uncovered = substantive.filter(pattern => !patternCovered(pattern));
if (substantive.length !== 51) {
  problems.push('Substantive public route-pattern count changed: ' + substantive.length + '.');
}
if (uncovered.length) {
  problems.push('Accessibility route coverage gap: ' + uncovered.join(', '));
}

if (navbar.includes('<div onClick={closeMenu} className="shrink-0">')) {
  problems.push('Navbar restored redundant nonsemantic BrandMark click handler.');
}
need('Navbar BrandMark wrapper', navbar, '<div className="shrink-0">');

for (const marker of [
  'const target = document.getElementById(id);',
  "target.setAttribute('tabindex', '-1')",
  'target.focus({ preventScroll: true })',
  "target.removeAttribute('tabindex')",
  "getElementById('main-content')",
  '?.focus({ preventScroll: true });',
]) {
  need('SPA focus manager', scrollToTop, marker);
}

for (const marker of [
  'aria-label="Breadcrumb"',
  "aria-current={isCurrent ? 'page' : undefined}",
  'inline-flex min-h-11 items-center transition-colors',
]) {
  need('Breadcrumb semantics', breadcrumbs, marker);
}

const scriptName = 'check:wave6-semantic-keyboard-a11y';
const command = 'node scripts/check-wave6-semantic-keyboard-a11y.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in ' + pipeline + '.');
  }
  for (const prior of [
    'check:wave6-responsive-a11y-baseline',
    'check:wave6-global-shell-a11y',
    'check:wave6-controls-forms-search-a11y',
    'check:wave6-complex-components-a11y',
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prior)) {
      problems.push(prior + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-5e semantic/keyboard accessibility failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5e semantic/keyboard accessibility passed: all 51 substantive route patterns have representative Axe coverage, WCAG 2.0/2.1 A-AA plus axe-core WCAG 2.2 AA rules are requested, six keyboard/focus regressions are protected, SPA route/fragment focus is explicit, and shared navigation semantics remain intact.'
);
