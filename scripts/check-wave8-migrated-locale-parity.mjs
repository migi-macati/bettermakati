import fs from 'node:fs';

const en = JSON.parse(fs.readFileSync('public/locales/en/common.json', 'utf8'));
const fil = JSON.parse(fs.readFileSync('public/locales/fil/common.json', 'utf8'));

const migratedRoots = ['language', 'navigation', 'shell', 'navbar', 'footer', 'app', 'breadcrumbs', 'brand', 'lastReviewed', 'pageBoundary', 'pageHelp', 'sharePage', 'barangayContext', 'seo', 'home', 'photoCarousel', 'discovery', 'serviceSearch'];

function paths(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    paths(child, prefix ? `${prefix}.${key}` : key)
  );
}

const failures = [];
for (const root of migratedRoots) {
  const enPaths = new Set(paths(en[root], root));
  const filPaths = new Set(paths(fil[root], root));
  for (const key of enPaths) if (!filPaths.has(key)) failures.push(`Missing FIL key: ${key}`);
  for (const key of filPaths) if (!enPaths.has(key)) failures.push(`Missing ENG key: ${key}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Wave 8 migrated locale parity OK: ${migratedRoots.join(', ')}`);
