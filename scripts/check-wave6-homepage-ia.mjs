import { readFile } from 'node:fs/promises';

const [home, chooser, tests, packageJson] = await Promise.all([
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/components/home/CapabilityCarousel.tsx', 'utf8'),
  readFile('tests/e2e/critical-paths.spec.mjs', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(label + ' missing: ' + marker);
    }
  }
};

requireAll(chooser, 'Priority chooser', [
  "key: 'urgent',", "href: '/hotlines'",
  "key: 'service',", "href: '/services'",
  "key: 'now',", "href: '/today'",
  "key: 'evidence',", "href: '/accountability'",
  "key: 'participate',", "href: '/participate'",
  "t('home.capability.goBarangay')",
]);

for (const retired of [
  "title: 'Find a place'",
  "title: 'Check government & public records'",
  "title: 'Report a local issue'",
  "title: 'Visit or get around Makati'",
]) {
  if (chooser.includes(retired)) {
    problems.push('Priority chooser still exposes feature-family item: ' + retired);
  }
}

requireAll(home, 'Homepage hierarchy', [
  "t('home.page.publicActionEyebrow')",
  "key: 'accountability'",
  "href: '/accountability'",
  "key: 'projectsBudget'",
  "href: '/projects-budget'",
  "key: 'records'",
  "href: '/records'",
  "t('home.page.participationTitle')",
  'to="/participate"',
  "t('home.page.improve')",
  'to="/get-involved"',
  "t('home.page.communityTools')",
  'to="/community-tools"',
  "key: 'health'",
]);

for (const retired of [
  'CommunityToolsGrid',
  'Tools for everyday Makati',
  'Explore Makati by barangay',
  "label: 'Health & emergency'",
  "label: 'Today in Makati'",
  "label: 'Makati Calendar'",
  "label: 'City activity'",
]) {
  if (home.includes(retired)) {
    problems.push('Homepage still exposes superseded first-order family: ' + retired);
  }
}

requireAll(tests, 'W6-3b browser QA', [
  'homepage priority chooser exposes Tier A and Tier B citizen jobs',
  'homepage supports evidence and participation without restoring feature-family clutter',
  "['Get urgent help', '/hotlines']",
  "['See what matters now', '/today']",
  "['Follow public action & evidence', '/accountability']",
  "['Participate or report', '/participate']",
  "name: /Public records/i",
  "name: 'Participate in Makati'",
]);



const homepageOrder = [
  '<Hero />',
  "title={t('home.page.aroundMakati')}",
  "t('home.page.commonServices')",
  "t('home.page.publicActionEyebrow')",
  "t('home.page.participationTitle')",
  "t('home.page.exploreTitle')",
  '<FeaturedInsightsCarousel />',
  "t('home.page.glance')",
];

let previousIndex = -1;
for (const marker of homepageOrder) {
  const index = home.indexOf(marker);
  if (index < 0) {
    problems.push('Homepage priority-order marker missing: ' + marker);
    continue;
  }
  if (index <= previousIndex) {
    problems.push('Homepage priority order regressed around: ' + marker);
  }
  previousIndex = index;
}

const occurrences = (
  packageJson.match(/npm run check:wave6-homepage-ia/g) ?? []
).length;
if (occurrences < 2) {
  problems.push('W6-3b guard must be present in both build and quality.');
}

if (
  !packageJson.includes(
    '"check:wave6-homepage-ia": "node scripts/check-wave6-homepage-ia.mjs"'
  )
) {
  problems.push('package.json is missing check:wave6-homepage-ia.');
}

if (problems.length) {
  console.error('W6-3b homepage IA guard failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3b homepage IA passed: the hero chooser owns Tier A/B jobs, Today is the current-information synthesis door, evidence and participation are explicit, and duplicate feature-family sections remain demoted.'
);
