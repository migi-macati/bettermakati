import { readFile } from 'node:fs/promises';

const serviceSearch = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');
const navbar = await readFile('src/components/layout/Navbar.tsx', 'utf8');
const footer = await readFile('src/components/layout/Footer.tsx', 'utf8');
const hero = await readFile('src/components/sections/Hero.tsx', 'utf8');
const searchPage = await readFile('src/pages/Search.tsx', 'utf8');
const notFound = await readFile('src/pages/NotFound.tsx', 'utf8');
const criticalPaths = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) problems.push(label + ' missing: ' + marker);
  }
};

requireAll(serviceSearch, 'Canonical search entry behavior', [
  "import { isBarangayContextPath, withBarangayScope }",
  "pathname !== '/search' && !isBarangayContextPath(pathname)",
  'const searchResultsHref = () => {',
  "params.set('q', query.trim())",
  "params.set('barangay', barangaySlug)",
  'if (hasBroaderMatches) {',
  "navigate(scope === 'services' ? scopedInternalHref('/services') : searchResultsHref());",
]);

if (serviceSearch.includes("scope === 'services' ? '/services' : '/community-tools/saan-ako-lalapit'")) {
  problems.push('Site search Enter fallback still routes true misses through Saan Ako Lalapit');
}

requireAll(navbar, 'Header search entry', [
  'const searchHref = preferredBarangay',
  "withBarangayScope('/search', preferredBarangay.slug)",
  'to={searchHref}',
  '<span>Search</span>',
]);

requireAll(hero, 'Homepage search entry', [
  'const { preferredBarangay } = useBarangayScope();',
  "barangaySlug={preferredBarangay?.slug ?? ''}",
]);

requireAll(searchPage, 'Canonical search page context', [
  'const { barangaySlug } = useBarangayScope();',
  'barangaySlug={barangaySlug}',
]);

requireAll(notFound, '404 search recovery entry', [
  'const { preferredBarangay } = useBarangayScope();',
  "withBarangayScope('/search', barangaySlug)",
  'to={searchHref}',
  'barangaySlug={barangaySlug}',
]);

requireAll(footer, 'Footer search entry', [
  'const { preferredBarangay } = useBarangayScope();',
  "if (href === '/search' && preferredBarangay)",
  "withBarangayScope(href, preferredBarangay.slug)",
]);

requireAll(criticalPaths, 'Search entry browser QA', [
  'header search preserves a chosen BetterBarangay into local-capable results',
  'homepage true miss enters canonical search recovery instead of Saan Ako Lalapit',
  "/search?barangay=poblacion",
  "/services/guide/community-tax-certificate?barangay=poblacion",
]);

if (problems.length > 0) {
  console.error('W6-2e search entry points failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'W6-2e search entry points passed: canonical search is visible, true misses enter /search, and BetterBarangay context survives only where local context is meaningful.'
);
