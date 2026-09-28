import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  css,
  history,
  heritage,
  mobility,
  explore,
  calendar,
  news,
  search,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-responsive-accessibility-visual-audit.json', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('src/pages/History.tsx', 'utf8'),
  readFile('src/pages/Heritage.tsx', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/News.tsx', 'utf8'),
  readFile('src/components/home/ServiceSearch.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const problems = [];

if (audit.status !== 'complete-static-qa-live-browser-deferred') {
  problems.push('W5-9c audit status changed.');
}

for (const marker of [
  '@media (prefers-reduced-motion: reduce)',
  ':where(a, button, input, select, textarea, summary):focus-visible',
  'min-height: 44px',
  '.form-field :is(input, select, textarea)',
]) {
  if (!css.includes(marker)) {
    problems.push('Global accessibility baseline missing: ' + marker);
  }
}

for (const marker of [
  'min-h-11 shrink-0 rounded-full border px-4 py-2',
  'flex min-h-11 cursor-pointer list-none items-center',
  'role="status"',
]) {
  if (!history.includes(marker)) {
    problems.push('History responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'min-h-11 rounded-full bg-primary-800',
  'min-h-11 rounded-full border border-primary-200',
  'xl:grid-cols-[0.68fr_1.32fr]',
]) {
  if (!heritage.includes(marker)) {
    problems.push('Heritage responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'min-h-11 rounded-lg px-3 text-xs font-bold text-primary-700',
  'flex min-h-11 cursor-pointer items-center font-bold text-primary-700',
  'overflow-x-auto',
  'sm:flex-wrap sm:overflow-visible',
]) {
  if (!mobility.includes(marker)) {
    problems.push('Mobility responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'flex min-h-11 cursor-pointer items-center font-bold text-gray-700',
  'overflow-x-auto',
  'sm:flex-wrap sm:overflow-visible',
]) {
  if (!explore.includes(marker)) {
    problems.push('Explore Makati responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'inline-flex min-h-11 items-center rounded-full border border-gray-200',
  'min-h-11 w-full rounded-xl border border-gray-300',
  'grid grid-cols-1 gap-3 md:grid-cols-3',
  'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4',
]) {
  if (!calendar.includes(marker)) {
    problems.push('Calendar responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'aria-busy={loading}',
  'role="alert"',
  'inline-flex min-h-11 shrink-0 items-center justify-center',
  'inline-flex min-h-11 items-center rounded-full',
  'flex min-h-11 cursor-pointer items-center text-xs font-bold',
  'grid grid-cols-1 gap-4 lg:grid-cols-2',
]) {
  if (!news.includes(marker)) {
    problems.push('News responsive/accessibility marker missing: ' + marker);
  }
}

for (const marker of [
  'role="combobox"',
  'aria-autocomplete="list"',
  'aria-expanded={open}',
  'role="listbox"',
  'role="option"',
  'inline-flex min-h-11 items-center rounded-full',
  'overflow-x-auto',
]) {
  if (!search.includes(marker)) {
    problems.push('Search responsive/accessibility marker missing: ' + marker);
  }
}

const wave5Sources = [
  ['History', history],
  ['Heritage', heritage],
  ['Mobility', mobility],
  ['Explore Makati', explore],
  ['Calendar', calendar],
  ['News', news],
];

for (const [label, source] of wave5Sources) {
  const fixedPixelLocks =
    source.match(/(?:^|\s)(?:w|min-w|max-w)-\[\d+px\]/g) ?? [];
  if (fixedPixelLocks.length) {
    problems.push(
      label +
        ' contains unreviewed fixed pixel width lock(s): ' +
        fixedPixelLocks.join(', ')
    );
  }
}

for (const id of [
  'live-browser-viewport-verification',
  'automated-contrast-measurement',
  'pixel-perfect-cross-device-parity',
]) {
  if (!(audit.bounded || []).some(item => item.id === id)) {
    problems.push('W5-9c bounded/deferred item missing: ' + id);
  }
}

if (
  audit.next !== 'W5-9d — Deployment & live-browser closeout'
) {
  problems.push('W5-9c next-step pointer changed.');
}

const occurrences = (
  packageJson.match(/npm run check:wave5-responsive-a11y/g) ?? []
).length;
if (occurrences < 2) {
  problems.push(
    'W5-9c responsive/accessibility guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-9c responsive/accessibility QA failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-9c responsive/accessibility QA passed: global focus/reduced-motion/44px baselines, responsive Wave 5 layouts, enlarged touch targets, Search ARIA semantics and explicit live-browser deferral are intact.'
);
