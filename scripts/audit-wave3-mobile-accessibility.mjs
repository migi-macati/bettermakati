import { readFile } from 'node:fs/promises';

const wave3Files = [
  'src/pages/Participate.tsx',
  'src/pages/GetInvolved.tsx',
  'src/pages/CivicMap.tsx',
  'src/pages/CivicNearbyReport.tsx',
  'src/pages/CivicAsset.tsx',
  'src/pages/CivicReports.tsx',
  'src/pages/CivicAuditPilot.tsx',
  'src/pages/CivicAuditResults.tsx',
  'src/components/civic/NearMePlaces.tsx',
  'src/components/civic/CivicNearbyReportForm.tsx',
  'src/components/civic/CivicDiscussion.tsx',
  'src/components/civic/CivicObservationForm.tsx',
  'src/components/civic/CivicObservationSummary.tsx',
];

const entries = await Promise.all(
  wave3Files.map(async path => ({
    path,
    source: await readFile(path, 'utf8'),
  }))
);
const byPath = new Map(entries.map(entry => [entry.path, entry.source]));
const css = await readFile('src/index.css', 'utf8');
const problems = [];

for (const { path, source } of entries) {
  for (const marker of ['w-[', 'min-w-[', 'whitespace-nowrap']) {
    if (source.includes(marker)) {
      problems.push(
        path +
          ' contains a mobile-width lock (' +
          marker +
          ') that needs explicit review.'
      );
    }
  }
}

for (const marker of [
  '@media (prefers-reduced-motion: reduce)',
  ':where(a, button, input, select, textarea, summary):focus-visible',
  'min-height: 44px',
  '.form-field :is(input, select, textarea)',
]) {
  if (!css.includes(marker)) {
    problems.push('Global accessibility baseline is missing: ' + marker);
  }
}

const discussion = byPath.get(
  'src/components/civic/CivicDiscussion.tsx'
) || '';

if (discussion.includes('min-h-10')) {
  problems.push(
    'CivicDiscussion still contains 40px action targets; use at least min-h-11.'
  );
}
for (const marker of [
  'role="alert"',
  'role="status"',
  "role={commentsFailed ? 'alert' : 'status'}",
  'inline-flex min-h-11 items-center',
  'authority?: string',
  'event.authority || event.destination',
]) {
  if (!discussion.includes(marker)) {
    problems.push('CivicDiscussion accessibility marker missing: ' + marker);
  }
}

const nearMe =
  byPath.get('src/components/civic/NearMePlaces.tsx') || '';
for (const marker of [
  "aria-busy={geoState === 'requesting'}",
  'role="status"',
  'aria-live="polite"',
  'role="alert"',
  'Finding nearby civic places.',
]) {
  if (!nearMe.includes(marker)) {
    problems.push('NearMePlaces accessibility marker missing: ' + marker);
  }
}

const getInvolved = byPath.get('src/pages/GetInvolved.tsx') || '';
if (!/href="tel:911"[\s\S]{0,220}min-h-11/.test(getInvolved)) {
  problems.push(
    'Get Involved emergency link must keep a minimum 44px mobile touch target.'
  );
}
for (const marker of [
  'aria-pressed={type === action.type}',
  'role="status"',
  "tabIndex={-1}",
  'aria-hidden="true"',
]) {
  if (!getInvolved.includes(marker)) {
    problems.push('Get Involved accessibility marker missing: ' + marker);
  }
}

const nearbyReport =
  byPath.get('src/pages/CivicNearbyReport.tsx') || '';
for (const marker of [
  'role="status"',
  'role="alert"',
  'inputMode="decimal"',
]) {
  if (!nearbyReport.includes(marker)) {
    problems.push('Nearby-report accessibility marker missing: ' + marker);
  }
}

const nearbyForm =
  byPath.get('src/components/civic/CivicNearbyReportForm.tsx') || '';
for (const marker of [
  "aria-busy={status === 'submitting'}",
  'role="status"',
  'aria-hidden="true"',
  'tabIndex={-1}',
]) {
  if (!nearbyForm.includes(marker)) {
    problems.push('Nearby-report form accessibility marker missing: ' + marker);
  }
}

const observationForm =
  byPath.get('src/components/civic/CivicObservationForm.tsx') || '';
for (const marker of [
  "aria-busy={status === 'submitting'}",
  'role="status"',
  'aria-hidden="true"',
  'tabIndex={-1}',
]) {
  if (!observationForm.includes(marker)) {
    problems.push('Observation form accessibility marker missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Wave 3 mobile/accessibility audit failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Wave 3 mobile/accessibility audit passed: responsive-width guard, 44px control baseline, visible focus, reduced motion, accessible async status, mobile action targets and hidden honeypots checked across ' +
    wave3Files.length +
    ' redesigned surfaces.'
);
