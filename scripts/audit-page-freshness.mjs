import { readFile } from 'node:fs/promises';

const audit = JSON.parse(await readFile('data/page-audit.json', 'utf8'));
const app = await readFile('src/App.tsx', 'utf8');
const today = new Date();
const maxAgeDays = 120;
const problems = [];

for (const page of audit) {
  if (!page.path || !page.label || !page.reviewedAt || !page.status) {
    problems.push('Page audit row is missing required fields: ' + JSON.stringify(page));
    continue;
  }
  if (page.path !== '/' && !app.includes(`path="${page.path}"`)) {
    problems.push('Audited path is not routed in App.tsx: ' + page.path);
  }
  const ageDays = Math.floor((today - new Date(page.reviewedAt + 'T00:00:00Z')) / 86400000);
  if (ageDays > maxAgeDays) {
    problems.push(`${page.path} page audit is stale (${ageDays} days).`);
  }
  if (!Array.isArray(page.checks) || page.checks.length < 2) {
    problems.push(page.path + ' has an insufficient audit checklist.');
  }
  if (!Array.isArray(page.gaps)) {
    problems.push(page.path + ' must publish gaps as an array.');
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const partial = audit.filter(page => page.status === 'partial').length;
console.log(`Page-freshness audit passed: ${audit.length} major pages reviewed; ${partial} publish known completeness gaps.`);
