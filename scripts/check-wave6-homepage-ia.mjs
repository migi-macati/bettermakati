import { readFile } from 'node:fs/promises';

const [home, hero, tests, packageJson] = await Promise.all([
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/components/sections/Hero.tsx', 'utf8'),
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

requireAll(hero, 'Single homepage entry', [
  "t('home.hero.unifiedQuestionLead')",
  "t('home.hero.unifiedQuestionBetter')",
  "t('home.hero.unifiedPromptLabel')",
  "t('home.hero.unifiedPromptPlaceholder')",
  'unifiedHome',
  '<ServiceSearch',
  'to="/hotlines"',
]);

if (hero.includes('CapabilityCarousel') || (hero.match(/<ServiceSearch/g) ?? []).length !== 1) {
  problems.push('The hero must expose one universal entry rather than multiple competing starts.');
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
  'homepage universal entry accepts any citizen intent without a category chooser',
  'homepage supports evidence and participation without restoring feature-family clutter',
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
  'W6-3b homepage IA passed: one unified hero entry serves citizen intents, with browse navigation and downstream civic depth retained.'
);
