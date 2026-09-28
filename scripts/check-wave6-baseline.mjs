import { readFile } from 'node:fs/promises';

const [
  routeInventory,
  journeyMatrix,
  scopeRegister,
  app,
  navigation,
  searchIndex,
  packageJson,
] = await Promise.all([
  readFile('docs/w6-0b-route-feature-inventory.md', 'utf8'),
  readFile('docs/w6-0c-core-journey-matrix.md', 'utf8'),
  readFile('docs/w6-0d-scope-defer-register.md', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

const requireMarkers = (label, content, markers) => {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      problems.push(label + ' marker missing: ' + marker);
    }
  }
};

requireMarkers('W6-0b route inventory', routeInventory, [
  'Status: complete',
  '**56 route entries**',
  '**51 substantive public route patterns**',
  '**4 compatibility redirects**',
  '**1 catch-all 404 route**',
  'The principal IA risk is **overlapping public doors**, not lack of content.',
]);

const journeyIds = [
  ...journeyMatrix.matchAll(/\*\*J(\d+)\*\*/g),
].map(match => Number(match[1]));
const uniqueJourneyIds = [...new Set(journeyIds)].sort((a, b) => a - b);
const expectedJourneyIds = Array.from({ length: 12 }, (_, index) => index + 1);

if (
  JSON.stringify(uniqueJourneyIds) !== JSON.stringify(expectedJourneyIds)
) {
  problems.push(
    'W6-0c must retain the complete J1-J12 core-journey set; found: ' +
      uniqueJourneyIds.join(', ')
  );
}

requireMarkers('W6-0c journey matrix', journeyMatrix, [
  'Status: complete',
  '**Canonical door:** `/services`',
  '**Canonical door:** `/today`',
  '**Canonical door:** `/barangays`',
  '**Canonical door:** `/accountability`',
  '**Canonical door:** `/participate`',
  '**Canonical door:** `/visit`',
  'Search and BetterBarangay context are cross-cutting layers',
]);

requireMarkers('W6-0d scope register', scopeRegister, [
  'Status: complete',
  '## 2. W6 required',
  '## 4. W7 — visual redesign',
  '## 5. W8 — English / modern Filipino language experience',
  '## 6. Data / human-source blocked',
  '## 7. Future enhancements',
  '## 8. Obsolete / remove / reframe',
  '## 9. Explicit non-goals for Wave 6',
  '## 10. Change-control rule for all later W6 steps',
]);

for (let index = 1; index <= 11; index += 1) {
  if (!scopeRegister.includes('W6-D' + index)) {
    problems.push('Known W6 defect classification missing: W6-D' + index);
  }
}

const canonicalDoors = [
  ["label: 'Services'", "href: '/services'"],
  ["label: 'Today'", "href: '/today'"],
  ["label: 'City'", "href: '/government'"],
  ["label: 'Barangays'", "href: '/barangays'"],
  ["label: 'Accountability'", "href: '/accountability'"],
  ["label: 'Participate'", "href: '/participate'"],
  ["label: 'Explore Makati'", "href: '/visit'"],
];

for (const [label, href] of canonicalDoors) {
  if (!navigation.includes(label) || !navigation.includes(href)) {
    problems.push('Canonical global door changed or disappeared: ' + label + ' → ' + href);
  }
}

for (const forbidden of ["href: '/parking'", "href: '/whats-on'"]) {
  if (navigation.includes(forbidden)) {
    problems.push('Retired surface returned to global navigation: ' + forbidden);
  }
  if (searchIndex.includes(forbidden)) {
    problems.push('Retired surface returned as a canonical search result: ' + forbidden);
  }
}

for (const redirect of [
  '<Route path="/parking" element={<CompatibilityRedirect to="/visit" />} />',
  '<Route path="/whats-on" element={<CompatibilityRedirect to="/calendar" />} />',
  'path="/transparency"',
  'element={<CompatibilityRedirect to="/projects-budget" />}',
  '<Route path="/reports/makati-overview"',
  '<CompatibilityRedirect to="/reports/2026-budget-operating-expenses" />',
]) {
  if (!app.includes(redirect)) {
    problems.push('Wave 6 compatibility-route contract missing: ' + redirect);
  }
}

for (const boundary of [
  'Wave 6 will **not**:',
  'redesign the entire visual identity',
  'translate the whole site',
  'revive Parking Finder as a standalone feature',
  'revive generic entertainment-events discovery as a core product',
]) {
  if (!scopeRegister.includes(boundary)) {
    problems.push('Wave 6 scope boundary missing: ' + boundary);
  }
}

const occurrences = (
  packageJson.match(/npm run check:wave6-baseline/g) ?? []
).length;
if (occurrences < 2) {
  problems.push(
    'W6 baseline guard must be present in both build and quality.'
  );
}

if (
  !packageJson.includes(
    '"check:wave6-baseline": "node scripts/check-wave6-baseline.mjs"'
  )
) {
  problems.push('package.json is missing the check:wave6-baseline script.');
}

if (problems.length) {
  console.error(
    'W6 baseline product-contract guard failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6 baseline guard passed: J1-J12, canonical product doors, compatibility redirects, scope boundaries and retired-surface rules remain intact.'
);
