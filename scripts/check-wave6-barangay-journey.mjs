import { readFile } from 'node:fs/promises';

const [
  navbar,
  footer,
  profile,
  projects,
  participate,
  accountability,
  statistics,
  civicMap,
  contextBar,
  barangayScope,
  packageJson,
] = await Promise.all([
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/components/layout/Footer.tsx', 'utf8'),
  readFile('src/pages/BarangayProfile.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/pages/Participate.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/CivicMap.tsx', 'utf8'),
  readFile('src/components/barangay/BetterBarangayContextBar.tsx', 'utf8'),
  readFile('src/hooks/useBarangayScope.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const [label, source] of [
  ['Navbar', navbar],
  ['Footer', footer],
]) {
  if (!source.includes('preferredBarangay && isBarangaySliceableHref(href)')) {
    problems.push(label + ' does not preserve the preferred barangay across compatible navigation.');
  }
  if (source.includes('barangay && isBarangaySliceableHref(href)')) {
    problems.push(label + ' still requires an already-explicit barangay scope before preserving context.');
  }
}

for (const marker of [
  'entry => entry.barangaySlug === barangay.slug',
  "description: 'City projects and budgets, with locally tagged evidence where geography is available.'",
  "description: 'See citywide budget and project records, with local evidence where geography is explicitly tagged.'",
]) {
  if (!profile.includes(marker)) {
    problems.push('Barangay profile scope marker missing: ' + marker);
  }
}
if (profile.includes('const needle = barangay.name.toLowerCase()')) {
  problems.push('Barangay profile returned to free-text inference for local accountability.');
}

for (const marker of [
  'BetterBarangay context',
  'Citywide budget, local evidence for {barangay.name}',
  'remain citywide unless a record explicitly identifies {barangay.name}',
  'Accountability records tagged to {barangay.name}',
]) {
  if (!projects.includes(marker)) {
    problems.push('Projects & Budget scope disclosure missing: ' + marker);
  }
}

for (const marker of [
  'Local actions for {barangay.name}, citywide opportunities where noted',
  'Official consultation listings and project-wide community input remain citywide unless they explicitly identify a barangay.',
]) {
  if (!participate.includes(marker)) {
    problems.push('Participation scope disclosure missing: ' + marker);
  }
}

if (!accountability.includes('Citywide records are excluded from this barangay slice.')) {
  problems.push('Accountability no longer distinguishes local tags from citywide records.');
}

for (const marker of [
  'Economy, labor and city-system measures below stay',
  'citywide unless an official barangay value is available.',
]) {
  if (!statistics.includes(marker)) {
    problems.push('Statistics no longer distinguishes barangay data from citywide indicators.');
  }
}

if (!civicMap.includes('in Barangay') || !civicMap.includes('records in scope')) {
  problems.push('Civic Map no longer labels barangay-filtered results explicitly.');
}

for (const marker of [
  "aria-label={t('barangayContext.label')}",
  "aria-label={t('barangayContext.choose')}",
  "to={barangay ? '/barangays/' + barangay.slug : '/barangays'}",
]) {
  if (!contextBar.includes(marker)) {
    problems.push('Persistent BetterBarangay context marker missing: ' + marker);
  }
}

for (const marker of [
  "const rememberedBarangayChangeEvent = 'bettermakati:barangay-scope-change';",
  'window.dispatchEvent(new Event(rememberedBarangayChangeEvent))',
  'window.addEventListener(rememberedBarangayChangeEvent, syncRememberedBarangay)',
]) {
  if (!barangayScope.includes(marker)) {
    problems.push('BetterBarangay shared preference synchronization missing: ' + marker);
  }
}

if (!packageJson.includes('"check:wave6-barangay-journey"')) {
  problems.push('W6-3d BetterBarangay journey guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3d BetterBarangay journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3d BetterBarangay journey check passed: preferred scope persists across compatible navigation, local attribution is explicit and citywide content remains labelled as citywide.'
);
