import { readFile } from 'node:fs/promises';

const [services, concernFinder, serviceGuide, offices, packageJson] = await Promise.all([
  readFile('src/pages/Services.tsx', 'utf8'),
  readFile('src/pages/ConcernFinder.tsx', 'utf8'),
  readFile('src/pages/ServiceGuide.tsx', 'utf8'),
  readFile('src/pages/GovernmentOffices.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "scopedServiceHref('/services/guide/new-business-permit')",
  "scopedServiceHref('/services/guide/yellow-card')",
  "scopedServiceHref('/services/guide/community-tax-certificate')",
  "scopedServiceHref('/services/guide/real-property-tax')",
  'Clear search and filters',
  'Use Saan Ako Lalapit?',
  'Browse government offices',
]) {
  if (!services.includes(marker)) {
    problems.push('Services journey marker missing: ' + marker);
  }
}

for (const stale of [
  "scopedServiceHref('/services/business/new-business-permit')",
  "scopedServiceHref('/services/health-services/makati-health-plus')",
  "scopedServiceHref('/services/housing-land-use/real-property-tax-payment')",
]) {
  if (services.includes(stale)) {
    problems.push('Services start still bypasses canonical service guide: ' + stale);
  }
}

if (concernFinder.includes('Describe what you need. Describe what you need.')) {
  problems.push('Saan Ako Lalapit duplicate orientation sentence returned.');
}
for (const marker of [
  'Matches can show the service, responsible office and a place to go.',
  'Browse all services',
  'Browse government offices',
]) {
  if (!concernFinder.includes(marker)) {
    problems.push('Saan Ako Lalapit recovery marker missing: ' + marker);
  }
}

for (const marker of [
  'const officialSourceUrl = detail?.sourceUrl || item.sourceUrl;',
  "item.href !== '/services/guide/' + item.id",
  'BetterMakati helps you prepare and find the right office.',
  'Open official source',
  'Related BetterMakati page',
]) {
  if (!serviceGuide.includes(marker)) {
    problems.push('Service-guide handoff marker missing: ' + marker);
  }
}

for (const marker of [
  'Start with a service',
  'Not sure which office handles it?',
  'No office matches this search.',
  'Find a service by task',
]) {
  if (!offices.includes(marker)) {
    problems.push('Government-offices journey marker missing: ' + marker);
  }
}

if (!packageJson.includes('"check:wave6-services-journey"')) {
  problems.push('W6-3c service-journey guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3c services journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3c services journey check passed: task-first starts, service-help recovery, office discovery and official-source handoff are intact.'
);
