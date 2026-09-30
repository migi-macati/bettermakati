import { readFile } from 'node:fs/promises';

const [
  deviceRaw,
  closureRaw,
  baselineRaw,
  semanticRaw,
  responsiveSpec,
  accessibilitySpec,
  ciWorkflow,
  packageRaw,
  deviceDoc,
  closureDoc,
] = await Promise.all([
  readFile('data/wave6-device-browser-pass.json', 'utf8'),
  readFile('data/wave6-responsive-accessibility-closure.json', 'utf8'),
  readFile('data/wave6-responsive-accessibility-baseline.json', 'utf8'),
  readFile('data/wave6-semantic-keyboard-accessibility.json', 'utf8'),
  readFile('tests/e2e/responsive-accessibility.spec.mjs', 'utf8'),
  readFile('tests/e2e/accessibility.spec.mjs', 'utf8'),
  readFile('.github/workflows/ci.yml', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('docs/w6-5f-device-browser-pass.md', 'utf8'),
  readFile('docs/w6-5g-responsive-accessibility-closure.md', 'utf8'),
]);

const device = JSON.parse(deviceRaw);
const closure = JSON.parse(closureRaw);
const baseline = JSON.parse(baselineRaw);
const semantic = JSON.parse(semanticRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) problems.push(name + ' marker missing: ' + marker);
};

if (device.status !== 'complete-ci-browser-verified') {
  problems.push('W6-5f device/browser status changed.');
}
if (device.proof?.runNumber !== 2205 || device.proof?.result !== 'success') {
  problems.push('W6-5f verified CI proof changed.');
}
if ((device.deviceMatrix ?? []).length !== 5) {
  problems.push('W6-5f five-viewport matrix changed.');
}
if ((device.reflowRoutes ?? []).length < 8) {
  problems.push('W6-5f representative reflow route set regressed.');
}
for (const id of [
  'chromium-only-ci-browser',
  'physical-device-screen-reader-sampling',
  'wcag-conformance-not-claimed',
]) {
  if (!(device.bounded ?? []).some(item => item.id === id)) {
    problems.push('W6-5f bounded item missing: ' + id);
  }
}

if (closure.status !== 'complete-guarded' || closure.wave !== 'Wave 6') {
  problems.push('Wave 6 closure status changed.');
}
for (const id of ['W6-1', 'W6-2', 'W6-3', 'W6-4', 'W6-5']) {
  if (!(closure.completedAreas ?? []).some(item => item.id === id)) {
    problems.push('Wave 6 completed area missing: ' + id);
  }
}
if (closure.next !== 'Wave 7 — visual & polish phase') {
  problems.push('Wave 6 next-step pointer changed.');
}
if ((baseline.workPackages ?? []).at(-1)?.id !== 'W6-5g') {
  problems.push('W6-5 baseline no longer terminates at W6-5g.');
}
if (semantic.next !== 'W6-5f — Device & browser pass') {
  problems.push('W6-5e handoff to W6-5f changed.');
}

for (const marker of [
  "width: 320, height: 568",
  "width: 390, height: 844",
  "width: 768, height: 1024",
  "width: 1024, height: 768",
  "width: 1440, height: 900",
  "'/projects-budget'",
  "'/statistics'",
  "narrow mobile can keyboard-scroll the dense statistics table",
  "reduced motion disables Featured Reports autoplay control",
  "200 percent text resizing does not create page-level overflow on core journeys",
]) {
  need('W6-5f responsive browser suite', responsiveSpec, marker);
}

for (const marker of [
  "'wcag2a'",
  "'wcag2aa'",
  "'wcag21a'",
  "'wcag21aa'",
  "'wcag22aa'",
  "'/statistics'",
  "'/civic-map/poblacion-park'",
]) {
  need('W6-5f accessibility suite', accessibilitySpec, marker);
}

for (const marker of [
  'npx playwright install --with-deps chromium',
  'tests/e2e/critical-paths.spec.mjs',
  'tests/e2e/accessibility.spec.mjs',
  'tests/e2e/responsive-accessibility.spec.mjs',
]) {
  need('CI browser-smoke', ciWorkflow, marker);
}

need('W6-5f documentation', deviceDoc, 'Status: complete-ci-browser-verified');
need('W6-5g documentation', closureDoc, 'Status: complete-guarded');
need('W6-5g documentation', closureDoc, 'Wave 6 is fully complete and verified');

const scriptName = 'check:wave6-responsive-a11y-closure';
const command = 'node scripts/check-wave6-responsive-a11y-closure.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in ' + pipeline + '.');
  }
  for (const prerequisite of [
    'check:wave6-responsive-a11y-baseline',
    'check:wave6-global-shell-a11y',
    'check:wave6-controls-forms-search-a11y',
    'check:wave6-complex-components-a11y',
    'check:wave6-semantic-keyboard-a11y',
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prerequisite)) {
      problems.push(prerequisite + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-5g responsive/accessibility closure failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5g closure passed: Wave 6 retains its route/search/journey/relationship guards, five-viewport Chromium browser proof, representative reflow/zoom/keyboard/reduced-motion coverage, broad Axe route coverage and explicit bounded limitations. Next: Wave 7 visual & polish.'
);
