import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  doc,
  navbar,
  footer,
  contextBar,
  brandMark,
  app,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-global-shell-responsive-accessibility.json', 'utf8'),
  readFile('docs/w6-5b-global-shell-responsive-accessibility.md', 'utf8'),
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/components/layout/Footer.tsx', 'utf8'),
  readFile('src/components/barangay/BetterBarangayContextBar.tsx', 'utf8'),
  readFile('src/components/BrandMark.tsx', 'utf8'),
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

if (audit.status !== 'complete-static-shell-live-browser-deferred') {
  problems.push('W6-5b shell audit status changed.');
}
if (audit.next !== 'W6-5c — Controls, forms & search') {
  problems.push('W6-5b next-step pointer changed.');
}
if ((audit.resolvedFindings ?? []).length < 9) {
  problems.push('W6-5b resolved finding baseline regressed.');
}
if ((audit.deferredToW65f ?? []).length < 5) {
  problems.push('W6-5b browser deferral set regressed.');
}

need(
  'W6-5b documentation',
  doc,
  'Status: complete-static-shell-live-browser-deferred'
);
need(
  'W6-5b documentation',
  doc,
  '**W6-5c — Controls, forms & search.**'
);

for (const marker of [
  'inline-flex min-h-11 items-center gap-1.5 font-semibold text-secondary-200',
  'hidden min-h-11 items-center sm:inline-flex',
  'inline-flex min-h-11 items-center underline',
  'hidden min-h-11 items-center gap-1 text-primary-100',
  'min-h-11 min-w-11',
  'focus-within:ring-2 focus-within:ring-primary-700',
  'opacity-0',
  'focus-visible:outline-secondary-300',
  '}, [pathname, search, hash]);',
]) {
  need('Navbar shell', navbar, marker);
}

for (const forbidden of ['min-h-9', 'min-h-10', 'min-w-9']) {
  if (navbar.includes(forbidden)) {
    problems.push('Navbar restored undersized shell control: ' + forbidden);
  }
}

for (const marker of [
  'inline-flex min-h-11 items-center text-primary-100',
  'inline-flex min-h-11 items-center gap-2 text-primary-100',
  'inline-flex min-h-11 items-center text-sm text-primary-100',
  'inline-flex min-h-11 items-center gap-1 text-sm text-primary-100',
  'inline-flex min-h-11 items-center underline underline-offset-4',
  'focus-visible:outline-secondary-300',
]) {
  need('Footer shell', footer, marker);
}

for (const forbidden of ['min-h-9', 'min-h-10']) {
  if (footer.includes(forbidden)) {
    problems.push('Footer restored undersized shell control: ' + forbidden);
  }
}

for (const marker of [
  'focus-within:ring-2 focus-within:ring-secondary-300',
  'min-h-11 min-w-0',
  'className="absolute inset-0 h-full w-full cursor-pointer opacity-0"',
  'inline-flex min-h-11 shrink-0',
  '<span className="sm:hidden">Homepage</span>',
  "aria-label={",
  "'Open Barangay ' + barangay.name + ' homepage'",
  'focus-visible:outline-secondary-300',
]) {
  need('BetterBarangay shell', contextBar, marker);
}

for (const forbidden of ['min-h-9', 'min-h-10']) {
  if (contextBar.includes(forbidden)) {
    problems.push(
      'BetterBarangay context bar restored undersized shell control: ' +
        forbidden
    );
  }
}

for (const marker of [
  "'inline-flex min-h-11 items-center rounded-sm '",
  "inverse ? 'focus-visible:outline-secondary-300' : ''",
  'aria-label="BetterMakati home"',
]) {
  need('BrandMark shell', brandMark, marker);
}

for (const marker of [
  'href="#main-content"',
  '<main id="main-content" tabIndex={-1}',
  '<Footer />',
]) {
  need('App shell', app, marker);
}

const scriptName = 'check:wave6-global-shell-a11y';
const command = 'node scripts/check-wave6-global-shell-a11y.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in ' + pipeline + '.');
  }
  if (!pkg.scripts?.[pipeline]?.includes('npm run check:wave6-responsive-a11y-baseline')) {
    problems.push('W6-5a baseline guard must remain in ' + pipeline + '.');
  }
}

if (problems.length) {
  console.error(
    'W6-5b global shell responsive/accessibility failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5b global shell responsive/accessibility passed: shared shell targets meet the 44px baseline, transparent selectors expose visible focus proxies, dark-shell focus contrast is explicit, submenu toggle width is protected, route changes clear transient navigation state, and live viewport proof remains deferred to W6-5f.'
);
