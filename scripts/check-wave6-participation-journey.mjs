import { readFile } from 'node:fs/promises';

const [
  home,
  participate,
  getInvolved,
  civicMap,
  nearbyReport,
  nearbyReportForm,
  hotlines,
  communityTools,
  navigation,
  packageJson,
] = await Promise.all([
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/pages/Participate.tsx', 'utf8'),
  readFile('src/pages/GetInvolved.tsx', 'utf8'),
  readFile('src/pages/CivicMap.tsx', 'utf8'),
  readFile('src/pages/CivicNearbyReport.tsx', 'utf8'),
  readFile('src/components/civic/CivicNearbyReportForm.tsx', 'utf8'),
  readFile('src/pages/Hotlines.tsx', 'utf8'),
  readFile('src/data/communityTools.ts', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "t('home.page.participationTitle')",
  'to="/participate"',
]) {
  if (!home.includes(marker)) {
    problems.push('Homepage participation entry marker missing: ' + marker);
  }
}

for (const marker of [
  'Need government action?',
  'to="/hotlines#makati-action-center"',
  'to="/community-tools/saan-ako-lalapit"',
  'Report a local problem to BetterMakati',
  "withBarangayScope('/civic-map/report', barangay?.slug)",
  'BetterMakati records are public civic evidence',
  'href="tel:911"',
]) {
  if (!participate.includes(marker)) {
    problems.push('Participate task/outcome marker missing: ' + marker);
  }
}

for (const marker of [
  'These forms are for BetterMakati contributions.',
  'They are not automatically sent to the Makati City Government.',
  'to="/participate"',
  'to="/hotlines#makati-action-center"',
  "t('corePages.getInvolved.send')",
]) {
  if (!getInvolved.includes(marker)) {
    problems.push('Get Involved scope marker missing: ' + marker);
  }
}

for (const marker of [
  'Report a local problem to BetterMakati',
  'Report something near me to BetterMakati',
  'Emergency? Call 911.',
]) {
  if (!civicMap.includes(marker)) {
    problems.push('Civic Map participation marker missing: ' + marker);
  }
}

for (const marker of [
  'This creates a public BetterMakati case.',
  'not a Makati City Government complaint',
  'to="/hotlines#makati-action-center"',
  'href="tel:911"',
]) {
  if (!nearbyReport.includes(marker)) {
    problems.push('Civic Map report outcome marker missing: ' + marker);
  }
}

for (const marker of [
  'Submitted to BetterMakati. This is not yet an official government case or referral.',
  'Report to BetterMakati',
  'Likely official channel:',
]) {
  if (!nearbyReportForm.includes(marker)) {
    problems.push('Civic Map form outcome marker missing: ' + marker);
  }
}

if (!hotlines.includes("id: 'makati-action-center'") || !hotlines.includes('id={card.id}')) {
  problems.push('Makati Action Center does not expose a stable internal deep-link target.');
}

if (communityTools.includes('Rate public infrastructure')) {
  problems.push('Civic Map still advertises retired generic rating behavior.');
}
if (!communityTools.includes('Document public-place conditions')) {
  problems.push('Civic Map participation promise no longer describes structured condition documentation.');
}

const participationNavigationIndex = navigation.indexOf("id: 'participate'");
const participationNavigationBlock =
  participationNavigationIndex >= 0
    ? navigation.slice(participationNavigationIndex, participationNavigationIndex + 900)
    : '';

if (
  !participationNavigationBlock.includes("labelKey: 'navigation.participate'") ||
  !participationNavigationBlock.includes("href: '/participate'")
) {
  problems.push('Global navigation no longer owns Participate as the canonical participation door.');
}
for (const href of [
  "'/civic-map'",
  "'/get-involved?type=proposal#submission'",
  "'/get-involved?type=source#submission'",
  "'/get-involved?type=correction#submission'",
]) {
  if (!participationNavigationBlock.includes(href)) {
    problems.push('Participate navigation lost supporting route: ' + href);
  }
}

if (!packageJson.includes('"check:wave6-participation-journey"')) {
  problems.push('W6-3g participation journey guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3g participation journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3g participation journey check passed: Participate separates official city action, BetterMakati public cases, project contributions and emergencies before submission.'
);
