import { readFile } from 'node:fs/promises';

const [auditRaw, navbar, contextBar, css, packageRaw, doc] = await Promise.all([
  readFile('data/wave7-shell-header.json', 'utf8'),
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/components/barangay/BetterBarangayContextBar.tsx', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('docs/w7-2a-shell-header.md', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];
const need = (name, source, marker) => {
  if (!source.includes(marker)) problems.push(name + ' marker missing: ' + marker);
};

if (audit.status !== 'complete-guarded' || audit.step !== 'W7-2a') {
  problems.push('W7-2a shell status changed.');
}
if (audit.next !== 'W7-2b — Footer & breadcrumbs') {
  problems.push('W7-2a next-step pointer changed.');
}

for (const marker of [
  'bm-utility-bar text-white',
  'bm-shell-nav sticky top-0 z-50',
  'bm-shell-panel absolute right-0 top-full',
  'border-secondary-300 bg-secondary-100',
  'border border-secondary-200 bg-secondary-50 text-primary-900',
  'border border-gray-200 bg-white text-gray-700 shadow-sm',
  'bm-shell-mobile-menu 2xl:hidden border-t',
]) {
  need('W7-2a Navbar', navbar, marker);
}

for (const marker of [
  'bm-barangay-context border-t border-primary-800 text-white',
  'px-5 py-1.5 md:px-6 lg:px-8',
  'border border-white/10 bg-white/[0.04]',
  'text-secondary-300',
]) {
  need('W7-2a BetterBarangay context', contextBar, marker);
}

for (const marker of [
  '.bm-utility-bar',
  '.bm-shell-nav',
  '.bm-shell-panel',
  '.bm-shell-mobile-menu',
  '.bm-barangay-context',
  'border-top: 3px solid var(--brand-gold);',
  'background: color-mix(in srgb, var(--bm-surface-canvas) 94%, transparent);',
  'transition:',
  'var(--bm-motion-fast)',
]) {
  need('W7-2a shell CSS', css, marker);
}

/* Preserve the W6 shell accessibility contract while polishing visuals. */
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
  need('W6-preserved Navbar accessibility', navbar, marker);
}
for (const marker of [
  'focus-within:ring-2 focus-within:ring-secondary-300',
  'min-h-11 min-w-0',
  'className="absolute inset-0 h-full w-full cursor-pointer opacity-0"',
  'inline-flex min-h-11 shrink-0',
]) {
  need('W6-preserved BetterBarangay accessibility', contextBar, marker);
}

need('W7-2a documentation', doc, 'Status: complete-guarded');
need('W7-2a documentation', doc, '**W7-2b — Footer & breadcrumbs.**');

const scriptName = 'check:wave7-shell-header';
const command = 'node scripts/check-wave7-shell-header.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  for (const guard of ['check:wave6-responsive-a11y-closure', 'check:wave7-foundation-tokens', scriptName]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + guard)) {
      problems.push(guard + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error('W7-2a header/navigation shell failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W7-2a header/navigation shell passed: semantic shell surfaces, restrained gold Search/dropdown accents and BetterBarangay hierarchy are guarded while Wave 6 navigation accessibility behavior remains intact.'
);
