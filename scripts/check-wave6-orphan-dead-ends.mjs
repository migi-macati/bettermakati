import { readFile } from 'node:fs/promises';

const [auditRaw, app, cinemas, search, reports, packageRaw] = await Promise.all([
  readFile('data/wave6-orphan-dead-end-audit.json', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/pages/Cinemas.tsx', 'utf8'),
  readFile('src/pages/Search.tsx', 'utf8'),
  readFile('src/pages/Reports.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const packageJson = JSON.parse(packageRaw);
const problems = [];

if (audit.status !== 'complete') {
  problems.push('W6-4a audit status is not complete.');
}

const allRoutes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map(match => match[1]);
const compatibilityRoutes = new Set(
  (audit.routeInventory?.compatibilityRedirects ?? []).map(item => item.from)
);
const catchAll = audit.routeInventory?.catchAll ?? '*';
const substantiveRoutes = allRoutes.filter(
  route => route !== catchAll && !compatibilityRoutes.has(route)
);

if (substantiveRoutes.length !== audit.routeInventory?.substantiveCount) {
  problems.push(
    'Substantive route count changed: expected ' +
      audit.routeInventory?.substantiveCount +
      ', found ' +
      substantiveRoutes.length +
      '.'
  );
}

const auditedRoutes = new Set(audit.routeCoverage ?? []);
const missingFromAudit = substantiveRoutes.filter(route => !auditedRoutes.has(route));
const staleAuditRoutes = [...auditedRoutes].filter(route => !substantiveRoutes.includes(route));

if (missingFromAudit.length) {
  problems.push('Canonical routes missing from W6-4a audit: ' + missingFromAudit.join(', '));
}
if (staleAuditRoutes.length) {
  problems.push('W6-4a audit contains stale routes: ' + staleAuditRoutes.join(', '));
}
if (auditedRoutes.size !== substantiveRoutes.length) {
  problems.push('W6-4a route coverage contains duplicates or count drift.');
}

if ((audit.criticalOrphans ?? []).length !== 0) {
  problems.push('W6-4a has unresolved critical orphans.');
}

const cinemaFix = (audit.fixedDeadEnds ?? []).find(item => item.route === '/cinemas');
if (!cinemaFix) {
  problems.push('Cinemas dead-end fix is no longer recorded.');
}
for (const marker of [
  "import { Link } from 'react-router';",
  "t('corePages.cinemas.after')",
  'to="/mobility"',
  'Getting around Makati',
  'to="/visit"',
  'Explore Makati',
]) {
  if (!cinemas.includes(marker)) {
    problems.push('Cinemas continuation marker missing: ' + marker);
  }
}

const terminalRoutes = new Set((audit.intentionalTerminals ?? []).map(item => item.route));
for (const route of ['/hotlines', '/privacy', '/terms']) {
  if (!terminalRoutes.has(route)) {
    problems.push('Intentional terminal classification missing: ' + route);
  }
}

if (!search.includes('<ServiceSearch')) {
  problems.push('Search component-owned continuation evidence changed.');
}
if (!reports.includes('<ReportTeaser')) {
  problems.push('Reports component-owned continuation evidence changed.');
}

for (const scriptName of ['build', 'quality']) {
  const command = packageJson.scripts?.[scriptName] ?? '';
  if (!command.includes('npm run check:wave6-orphan-dead-ends')) {
    problems.push('W6-4a guard is missing from ' + scriptName + '.');
  }
}

if (audit.next !== 'W6-4b — civic relationship model') {
  problems.push('W6-4a next-step pointer changed.');
}

if (problems.length) {
  console.error('W6-4a orphan/dead-end audit failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-4a orphan/dead-end audit passed: all 51 substantive route patterns are classified, no critical orphans remain, Cinemas has useful continuations, and intentional terminal surfaces stay bounded.'
);
