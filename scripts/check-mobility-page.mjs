import { readFile } from 'node:fs/promises';

const [pageSource, packageSource] = await Promise.all([
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "mobilityServices",
  "publicMobilityServices",
  "privateMobilityServices",
  "service.governance === 'public'",
  "service.governance === 'private'",
  "mobilityServiceKind",
  "Public ferry service",
  "Private estate shuttle",
  "publicMobilityServices.map",
  "privateMobilityServices.map",
  "placeRegistryById.get('one-ayala-terminal')",
  "to={'/civic-map/' + oneAyala.id}",
  "date=\"2026-09-28\"",
  "Schedules, fares and live routing remain with the linked operator or map.",
]) {
  if (!pageSource.includes(marker)) {
    problems.push('Mobility page canonical presentation marker missing: ' + marker);
  }
}

for (const forbidden of [
  'const transitLinks =',
  'https://edsabus.com/route-map',
  'One%20Ayala%20Makati',
  "centuryCity.label + ' E-Bus'",
]) {
  if (pageSource.includes(forbidden)) {
    problems.push('Mobility page still contains stale/manual system presentation: ' + forbidden);
  }
}

const gateCount = (
  packageSource.match(/npm run check:mobility-page/g) ?? []
).length;

if (gateCount !== 2) {
  problems.push(
    'check:mobility-page must run once in build and once in quality; found ' +
      gateCount +
      '.'
  );
}

if (
  !packageSource.includes(
    '"check:mobility-page": "node scripts/check-mobility-page.mjs"'
  )
) {
  problems.push('package.json does not declare check:mobility-page.');
}

if (problems.length) {
  console.error('Mobility page check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Mobility page check passed: canonical public systems, canonical private service, internal One Ayala hub, no stale manual system cards.'
);
