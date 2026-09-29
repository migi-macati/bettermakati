import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  doc,
  app,
  css,
  navbar,
  sectionNav,
  search,
  map,
  axe,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-responsive-accessibility-baseline.json', 'utf8'),
  readFile('docs/w6-5a-responsive-accessibility-baseline.md', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/components/ui/SectionNav.tsx', 'utf8'),
  readFile('src/components/home/ServiceSearch.tsx', 'utf8'),
  readFile('src/components/civic/CivicAreaContextMap.tsx', 'utf8'),
  readFile('tests/e2e/accessibility.spec.mjs', 'utf8'),
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

if (audit.status !== 'complete-static-baseline-live-current-build-deferred') {
  problems.push('W6-5a baseline status changed.');
}
if (
  audit.target?.accessibility !==
  'WCAG 2.2 AA target; no compliance claim is made by this static baseline.'
) {
  problems.push('W6-5 accessibility target changed without updating the baseline.');
}
if ((audit.deviceMatrix ?? []).length !== 5) {
  problems.push('W6-5 device matrix must keep five baseline viewport classes.');
}
for (const id of [
  'narrow-mobile',
  'android-mobile',
  'tablet-portrait',
  'compact-landscape',
  'desktop',
]) {
  if (!(audit.deviceMatrix ?? []).some(item => item.id === id)) {
    problems.push('W6-5 device matrix missing: ' + id);
  }
}
for (const id of [
  'shell-utility-targets',
  'footer-targets',
  'barangay-context-targets',
  'carousel-dot-targets',
  'table-toggle-semantics',
  'axe-route-coverage',
  'wcag22-automation-gap',
  'live-viewport-pass',
]) {
  if (!(audit.findings ?? []).some(item => item.id === id)) {
    problems.push('W6-5a finding missing: ' + id);
  }
}
for (const id of ['W6-5b', 'W6-5c', 'W6-5d', 'W6-5e', 'W6-5f', 'W6-5g']) {
  if (!(audit.workPackages ?? []).some(item => item.id === id)) {
    problems.push('W6-5 work-package ownership missing: ' + id);
  }
}
for (const id of [
  'current-main-live-browser',
  'contrast',
  'screen-reader-behavior',
]) {
  if (!(audit.bounded ?? []).some(item => item.id === id)) {
    problems.push('W6-5a bounded item missing: ' + id);
  }
}

need(
  'W6-5a documentation',
  doc,
  'Status: complete-static-baseline-live-current-build-deferred'
);
need(
  'W6-5a documentation',
  doc,
  '**W6-5b — Global shell responsive/a11y.**'
);

for (const marker of [
  'href="#main-content"',
  'className="skip-link"',
  '<main id="main-content" tabIndex={-1}',
]) {
  need('App shell', app, marker);
}

for (const marker of [
  '@media (prefers-reduced-motion: reduce)',
  ':where(a, button, input, select, textarea, summary):focus-visible',
  'min-height: 44px',
  '.form-field :is(input, select, textarea)',
  '.skip-link:focus',
]) {
  need('Global accessibility CSS', css, marker);
}

for (const marker of [
  'aria-label="Main navigation"',
  'aria-expanded={expanded}',
  'aria-controls=',
  'desktop-panel-',
  "if (event.key === 'Escape')",
  'document.getElementById(control)?.focus()',
  "aria-current={directCurrent ? 'page' : undefined}",
  'aria-expanded={isOpen}',
  'aria-controls="mobile-navigation"',
]) {
  need('Navbar semantics', navbar, marker);
}

for (const marker of ['min-h-11', 'aria-label={label}']) {
  need('SectionNav', sectionNav, marker);
}

for (const marker of [
  'role="combobox"',
  'aria-autocomplete="list"',
  'aria-expanded={open}',
  'role="listbox"',
  'role="option"',
]) {
  need('Search combobox', search, marker);
}

for (const marker of [
  'title="Makati Civic Map context"',
  'aria-pressed={showAreas}',
  'aria-pressed={showMobility}',
  'min-h-11',
]) {
  need('Civic map context controls', map, marker);
}

for (const marker of [
  "'wcag2a'",
  "'wcag2aa'",
  "'wcag21a'",
  "'wcag21aa'",
  "'wcag22aa'",
  '.withTags(wcagTags)',
  "'/search'",
  "'/accountability'",
  "'/calendar'",
]) {
  need('Existing Axe baseline', axe, marker);
}

const routeArrayMatch = axe.match(/const routes = \[([\s\S]*?)\];/);
const axeRouteCount = routeArrayMatch
  ? [...routeArrayMatch[1].matchAll(/'([^']+)'/g)].length
  : 0;
if (axeRouteCount < 28) {
  problems.push('Axe route baseline regressed below 28 representative routes.');
}

if (audit.next !== 'W6-5b — Global shell responsive/a11y') {
  problems.push('W6-5a next-step pointer changed.');
}

const scriptName = 'check:wave6-responsive-a11y-baseline';
const command = 'node scripts/check-wave6-responsive-a11y-baseline.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in the ' + pipeline + ' pipeline.');
  }
}

if (problems.length) {
  console.error(
    'W6-5a responsive/accessibility baseline failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5a responsive/accessibility baseline passed: global skip/focus/reduced-motion/control foundations, navigation/search semantics, five-viewport device matrix, issue ownership and explicit browser/contrast/AT deferrals are recorded without preserving current defects.'
);
