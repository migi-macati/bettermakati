import { readFile } from 'node:fs/promises';

const [visit, mobility, heritage, estates, history, navigation, packageJson] =
  await Promise.all([
    readFile('src/pages/VisitMakati.tsx', 'utf8'),
    readFile('src/pages/Mobility.tsx', 'utf8'),
    readFile('src/pages/Heritage.tsx', 'utf8'),
    readFile('src/pages/Estates.tsx', 'utf8'),
    readFile('src/pages/History.tsx', 'utf8'),
    readFile('src/data/navigation.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

const problems = [];

for (const marker of [
  'Understand the city as you explore it.',
  "href: '/estates'",
  "href: '/barangays'",
  "href: '/heritage'",
  "href: '/history'",
  "href: '/mobility'",
  'Explore context',
  '<PlacesExplorer />',
]) {
  if (!visit.includes(marker)) {
    problems.push('Explore Makati canonical journey marker missing: ' + marker);
  }
}

for (const [label, source] of [
  ['Mobility', mobility],
  ['Heritage', heritage],
  ['Estates', estates],
  ['History', history],
]) {
  if (!source.includes('to="/visit"')) {
    problems.push(label + ' does not return to the canonical Explore Makati door.');
  }
}

for (const marker of [
  '<div className="section-eyebrow">Explore Makati</div>',
  'to="/estates"',
  'to="/civic-map"',
]) {
  if (!mobility.includes(marker)) {
    problems.push('Mobility Explore-context marker missing: ' + marker);
  }
}

for (const marker of [
  'to="/mobility"',
  "to={'/civic-map/' + place.id}",
  'to="/history"',
]) {
  if (!heritage.includes(marker)) {
    problems.push('Heritage journey marker missing: ' + marker);
  }
}

for (const marker of [
  'to="/mobility"',
  "to={'/barangays/' + barangay.slug}",
]) {
  if (!estates.includes(marker)) {
    problems.push('Estates context marker missing: ' + marker);
  }
}

for (const marker of [
  'to="/heritage"',
  "href: '/civic-map/'",
]) {
  if (!history.includes(marker)) {
    problems.push('History context marker missing: ' + marker);
  }
}

const exploreNavigationIndex = navigation.indexOf("label: 'Explore Makati'");
const exploreNavigationBlock =
  exploreNavigationIndex >= 0
    ? navigation.slice(exploreNavigationIndex, exploreNavigationIndex + 700)
    : '';
if (!exploreNavigationBlock.includes("href: '/visit'")) {
  problems.push('Global navigation no longer owns Explore Makati as the canonical place-discovery door.');
}
for (const href of ["'/estates'", "'/mobility'", "'/heritage'"]) {
  if (!exploreNavigationBlock.includes(href)) {
    problems.push('Explore Makati navigation lost supporting route: ' + href);
  }
}

if (!packageJson.includes('"check:wave6-explore-journey"')) {
  problems.push('W6-3f Explore journey guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3f Explore journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3f Explore journey check passed: /visit remains the canonical door, place context leads into districts/barangays/heritage/history/mobility, and supporting surfaces return to Explore Makati.'
);
