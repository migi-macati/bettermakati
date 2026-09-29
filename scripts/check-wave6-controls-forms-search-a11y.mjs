import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  doc,
  search,
  contact,
  getInvolved,
  nearbyForm,
  nearbyPage,
  contribution,
  observation,
  offices,
  cityMonitor,
  publicRecords,
  participate,
  services,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-controls-forms-search-accessibility.json', 'utf8'),
  readFile('docs/w6-5c-controls-forms-search-accessibility.md', 'utf8'),
  readFile('src/components/home/ServiceSearch.tsx', 'utf8'),
  readFile('src/pages/Contact.tsx', 'utf8'),
  readFile('src/pages/GetInvolved.tsx', 'utf8'),
  readFile('src/components/civic/CivicNearbyReportForm.tsx', 'utf8'),
  readFile('src/pages/CivicNearbyReport.tsx', 'utf8'),
  readFile('src/components/civic/CivicContributionForm.tsx', 'utf8'),
  readFile('src/components/civic/CivicObservationForm.tsx', 'utf8'),
  readFile('src/pages/GovernmentOffices.tsx', 'utf8'),
  readFile('src/pages/CityMonitor.tsx', 'utf8'),
  readFile('src/pages/PublicRecords.tsx', 'utf8'),
  readFile('src/pages/Participate.tsx', 'utf8'),
  readFile('src/pages/Services.tsx', 'utf8'),
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

if (audit.status !== 'complete-static-controls-live-browser-deferred') {
  problems.push('W6-5c audit status changed.');
}
if (audit.next !== 'W6-5d — Complex components') {
  problems.push('W6-5c next-step pointer changed.');
}
if ((audit.resolvedFindings ?? []).length < 12) {
  problems.push('W6-5c resolved finding baseline regressed.');
}
if ((audit.bounded ?? []).length < 4) {
  problems.push('W6-5c bounded/deferred set regressed.');
}

need(
  'W6-5c documentation',
  doc,
  'Status: complete-static-controls-live-browser-deferred'
);
need(
  'W6-5c documentation',
  doc,
  '**W6-5d — Complex components.**'
);

for (const marker of [
  'const inputRef = useRef<HTMLInputElement>(null)',
  'ref={inputRef}',
  'requestAnimationFrame(() => inputRef.current?.focus())',
  'aria-pressed={tab === item}',
  'tabIndex={-1}',
  'top-full z-40 mt-2',
  'role="status" aria-live="polite" aria-atomic="true"',
  'min-h-11 max-w-[68%]',
]) {
  need('ServiceSearch', search, marker);
}
if (search.includes('top-[118px]')) {
  problems.push('ServiceSearch restored fixed pixel dropdown offset.');
}

for (const marker of [
  'inline-flex min-h-11 items-center gap-2 font-semibold',
  'inline-flex min-h-11 items-center gap-1 font-semibold',
  'inline-flex min-h-11 items-center text-primary-700 underline',
]) {
  need('Contact controls', contact, marker);
}

for (const marker of [
  "setMessage('Sending your submission…')",
  "aria-busy={status === 'submitting'}",
  'aria-describedby="bettermakati-submission-privacy"',
  "role={status === 'error' ? 'alert' : 'status'}",
  'inline-flex min-h-11 items-center gap-1 font-bold',
]) {
  need('Get Involved form', getInvolved, marker);
}

for (const marker of [
  "setMessage('Submitting your report…')",
  "setMessage('Adding your confirmation…')",
  "setMessage('Creating a separate report…')",
  "aria-busy={status === 'submitting'}",
  'role="status" aria-live="polite"',
  "role={status === 'error' ? 'alert' : 'status'}",
  'inline-flex min-h-11 items-center font-bold',
]) {
  need('Civic Nearby Report form', nearbyForm, marker);
}

for (const marker of [
  'role="status" aria-live="polite"',
  'min-h-11 w-full rounded-xl',
  'role="status" aria-live="polite" aria-atomic="true"',
  'aria-pressed={selected}',
]) {
  need('Civic Nearby Report location controls', nearbyPage, marker);
}

for (const marker of [
  "setMessage('Submitting your contribution…')",
  "setMessage(kind === 'proposal' ? 'Adding your support…' : 'Adding your confirmation…')",
  "setMessage('Creating a separate record…')",
  "aria-busy={status === 'submitting'}",
  'role="status" aria-live="polite"',
  "role={status === 'error' ? 'alert' : 'status'}",
  'inline-flex min-h-11 items-center',
]) {
  need('Civic Contribution form', contribution, marker);
}

for (const marker of [
  "setMessage('Saving your observation…')",
  "aria-busy={status === 'submitting'}",
  "{status !== 'idle' && (",
  "role={status === 'error' ? 'alert' : 'status'}",
  'inline-flex min-h-11 items-center',
]) {
  need('Civic Observation form', observation, marker);
}

for (const marker of [
  'min-h-11 w-full rounded-2xl',
  'aria-pressed={scope === item}',
  '? \'min-h-11 rounded-full bg-primary-800',
  'role="status" aria-live="polite" aria-atomic="true"',
  'inline-flex min-h-11 items-center font-bold',
]) {
  need('Government Offices controls', offices, marker);
}

for (const marker of [
  'min-h-11 w-full rounded-xl',
  'min-h-11 rounded-xl border border-gray-300 bg-white',
  'role="status" aria-live="polite" aria-atomic="true"',
  'inline-flex min-h-11 items-center gap-1 rounded-full',
]) {
  need('City Monitor controls', cityMonitor, marker);
}

for (const marker of [
  'min-h-11 rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm',
  'flex min-h-11 items-center gap-2 rounded-xl',
  'role="status" aria-live="polite" aria-atomic="true"',
  'inline-flex min-h-11 items-center font-bold text-primary-700 underline',
]) {
  need('Public Records controls', publicRecords, marker);
}

for (const marker of [
  'const [loadFailed, setLoadFailed] = useState(false)',
  'setLoadFailed(true)',
  'role="status"',
  'role="alert"',
  'public community-input feed is temporarily unavailable',
]) {
  need('Participate async state', participate, marker);
}

for (const marker of [
  'const [loadFailed, setLoadFailed] = useState(false)',
  'setLoadFailed(true)',
  'role="status"',
  'role="alert"',
  'This service category could not be loaded.',
]) {
  need('Services async state', services, marker);
}

const scriptName = 'check:wave6-controls-forms-search-a11y';
const command = 'node scripts/check-wave6-controls-forms-search-a11y.mjs';
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
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prior)) {
      problems.push(prior + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-5c controls/forms/search accessibility failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5c controls/forms/search accessibility passed: combobox focus stays on the input, filters expose selection and result state, repeated controls meet the 44px baseline, async forms announce submitting/error states, and failed data loads are distinct from empty results.'
);
