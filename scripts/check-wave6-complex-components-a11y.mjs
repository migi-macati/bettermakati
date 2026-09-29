import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  doc,
  tableToggle,
  photoCarousel,
  featuredCarousel,
  capability,
  civicAreaMap,
  civicMapEmbed,
  heritageMap,
  calendar,
  statistics,
  projects,
  elections,
  integrity,
  css,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-complex-components-accessibility.json', 'utf8'),
  readFile('docs/w6-5d-complex-components-accessibility.md', 'utf8'),
  readFile('src/lib/TableWithToggle.tsx', 'utf8'),
  readFile('src/components/ui/PhotoCarousel.tsx', 'utf8'),
  readFile('src/components/home/FeaturedInsightsCarousel.tsx', 'utf8'),
  readFile('src/components/home/CapabilityCarousel.tsx', 'utf8'),
  readFile('src/components/civic/CivicAreaContextMap.tsx', 'utf8'),
  readFile('src/components/civic/CivicMapEmbed.tsx', 'utf8'),
  readFile('src/components/heritage/HeritageMap.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/pages/Integrity.tsx', 'utf8'),
  readFile('src/index.css', 'utf8'),
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

if (
  audit.status !==
  'complete-static-complex-components-live-browser-deferred'
) {
  problems.push('W6-5d audit status changed.');
}
if (audit.next !== 'W6-5e — Semantic & keyboard pass') {
  problems.push('W6-5d next-step pointer changed.');
}
if ((audit.resolvedFindings ?? []).length < 13) {
  problems.push('W6-5d resolved finding baseline regressed.');
}
if ((audit.bounded ?? []).length < 4) {
  problems.push('W6-5d bounded/deferred set regressed.');
}

need(
  'W6-5d documentation',
  doc,
  'Status: complete-static-complex-components-live-browser-deferred'
);
need(
  'W6-5d documentation',
  doc,
  '**W6-5e — Semantic & keyboard pass.**'
);
need(
  'W6-5d documentation',
  doc,
  '**15 dense-table scroll regions**'
);

for (const marker of [
  'role="group"',
  'aria-label="Choose data view"',
  'type="button"',
  "aria-pressed={viewMode === 'table'}",
  "aria-pressed={viewMode === 'list'}",
  'inline-flex min-h-11',
  'className="scroll-region overflow-x-auto"',
  'role="region"',
  "aria-label={tableLabel + ' — horizontally scrollable'}",
  'tabIndex={0}',
  'List view is unavailable for this table.',
]) {
  need('TableWithToggle', tableToggle, marker);
}
for (const forbidden of ['Debug Info:', 'bg-blue-600']) {
  if (tableToggle.includes(forbidden)) {
    problems.push('TableWithToggle restored legacy/debug marker: ' + forbidden);
  }
}

for (const marker of [
  'aria-pressed={photoIndex === index}',
  'className="grid h-11 w-11 place-items-center rounded-full',
  'inline-flex min-h-11 items-center text-sm font-bold',
  'inline-flex min-h-11 items-center font-semibold',
  'inline-flex min-h-11 items-center underline',
]) {
  need('PhotoCarousel', photoCarousel, marker);
}
if (photoCarousel.includes('className="grid h-9 w-9')) {
  problems.push('PhotoCarousel restored 36px selector dots.');
}

for (const marker of [
  'hidden min-h-11 items-center text-sm font-bold',
  'mt-4 inline-flex min-h-11 items-center text-sm font-bold',
]) {
  need('Featured Reports carousel', featuredCarousel, marker);
}

need(
  'Homepage capability selector',
  capability,
  'className="min-h-11 w-full rounded-lg'
);

need(
  'CivicAreaContextMap station links',
  civicAreaMap,
  'inline-flex min-h-11 items-center rounded-full'
);
need(
  'CivicMapEmbed fallback',
  civicMapEmbed,
  'inline-flex min-h-11 items-center gap-1 font-bold'
);
for (const marker of [
  'group absolute grid h-11 min-w-11',
  'inline-flex min-h-11 items-center gap-1 font-bold',
  'tabIndex={-1}',
  'aria-hidden="true"',
]) {
  need('HeritageMap', heritageMap, marker);
}

for (const marker of [
  'className="sr-only" role="status" aria-live="polite" aria-atomic="true"',
  "{visible.length} {visible.length === 1 ? 'civic timeline item' : 'civic timeline items'}",
]) {
  need('Calendar timeline count', calendar, marker);
}

for (const marker of [
  '.scroll-region {',
  'overscroll-behavior-x: contain;',
  'scrollbar-gutter: stable;',
  '.scroll-region:focus-visible',
  '.scroll-region table :is(a, button)',
  'min-height: 44px;',
]) {
  need('Shared scroll-region CSS', css, marker);
}

const regionCounts = [
  ['Statistics', statistics, 1],
  ['Projects & Budget', projects, 7],
  ['Elections', elections, 4],
  ['Integrity', integrity, 2],
];
let rawRegionCount = 0;
for (const [name, source, expected] of regionCounts) {
  const scrollRegions = (source.match(/scroll-region/g) ?? []).length;
  const overflows = (source.match(/overflow-x-auto/g) ?? []).length;
  rawRegionCount += scrollRegions;
  if (scrollRegions !== expected) {
    problems.push(
      name +
        ' scroll-region count changed: expected ' +
        expected +
        ', found ' +
        scrollRegions
    );
  }
  if (overflows !== scrollRegions) {
    problems.push(
      name +
        ' contains horizontal table overflow without matching scroll-region treatment.'
    );
  }
}
if (rawRegionCount !== 14) {
  problems.push(
    'Raw dense table region total changed: expected 14, found ' + rawRegionCount
  );
}

for (const marker of [
  'min-h-11 w-full rounded-xl',
  'min-h-11 rounded-xl border border-gray-300 bg-white',
  'role="status" aria-live="polite" aria-atomic="true"',
]) {
  need('Projects & Budget table controls', projects, marker);
}

const scriptName = 'check:wave6-complex-components-a11y';
const command = 'node scripts/check-wave6-complex-components-a11y.mjs';
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
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prior)) {
      problems.push(prior + ' must remain in ' + pipeline + '.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-5d complex-component accessibility failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-5d complex-component accessibility passed: 15 dense-table regions are keyboard-scrollable and named, table toggles expose state, carousel/map controls meet the 44px baseline, dense-table filters announce results, and runtime overflow/motion/iframe behavior remains bounded to W6-5f.'
);
