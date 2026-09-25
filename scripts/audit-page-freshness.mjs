import { readFile, readdir } from 'node:fs/promises';

const audit = JSON.parse(await readFile('data/page-audit.json', 'utf8'));
const freshness = JSON.parse(
  await readFile('data/page-freshness-state.json', 'utf8')
);
const reviewQueue = JSON.parse(
  await readFile('data/freshness-review-queue.json', 'utf8')
);
const app = await readFile('src/App.tsx', 'utf8');
const sourceFiles = (await readdir('src', { recursive: true }))
  .filter(file => String(file).endsWith('.tsx'))
  .map(file => 'src/' + file);

const today = new Date();
const maxAgeDays = 120;
const problems = [];

if (
  freshness.version !== 1 ||
  !freshness.summary ||
  !Array.isArray(freshness.pages) ||
  !Array.isArray(freshness.untrackedAffectedPages)
) {
  problems.push(
    'Page freshness state must use version 1 with summary and pages.'
  );
}

if (freshness.pages.length !== audit.length) {
  problems.push(
    'Page freshness state must cover every page-audit row: ' +
      freshness.pages.length +
      ' of ' +
      audit.length +
      '.'
  );
}

if (
  freshness.generatedAt !== reviewQueue.generatedAt
) {
  problems.push(
    'Page freshness state is not synchronized with the freshness review queue.'
  );
}

const openQueueItems = (reviewQueue.items || []).filter(
  item => item.status === 'open'
);
const expectedSignalsByPage = new Map();
for (const item of openQueueItems) {
  for (const page of item.affectedPages || []) {
    const signals = expectedSignalsByPage.get(page) || [];
    signals.push(item);
    expectedSignalsByPage.set(page, signals);
  }
}

const auditPaths = new Set(audit.map(page => page.path));
const expectedUntracked = [...expectedSignalsByPage.keys()]
  .filter(path => !auditPaths.has(path))
  .sort();
const actualUntracked = freshness.untrackedAffectedPages
  .map(page => page.path)
  .sort();

if (
  expectedUntracked.length !== actualUntracked.length ||
  expectedUntracked.some((path, index) => path !== actualUntracked[index])
) {
  problems.push(
    'Untracked affected pages do not match open dependency signals outside page-audit.json.'
  );
}
for (const page of freshness.untrackedAffectedPages) {
  if (
    page.reviewedAt !== null ||
    page.editorialStatus !== null ||
    page.needsReview !== true ||
    page.freshnessStatus !== 'needs-review-untracked'
  ) {
    problems.push(
      'Untracked affected page must remain visibly unaudited and need review: ' +
        page.path
    );
  }
}

const freshnessByPath = new Map();
for (const page of freshness.pages) {
  if (freshnessByPath.has(page.path)) {
    problems.push('Duplicate page freshness state: ' + page.path);
  }
  freshnessByPath.set(page.path, page);
}

for (const page of audit) {
  if (!page.path || !page.label || !page.reviewedAt || !page.status) {
    problems.push(
      'Page audit row is missing required fields: ' + JSON.stringify(page)
    );
    continue;
  }
  if (page.path !== '/' && !app.includes(`path="${page.path}"`)) {
    problems.push('Audited path is not routed in App.tsx: ' + page.path);
  }

  const ageDays = Math.floor(
    (today - new Date(page.reviewedAt + 'T00:00:00Z')) / 86400000
  );
  if (ageDays > maxAgeDays) {
    problems.push(`${page.path} page audit is stale (${ageDays} days).`);
  }

  if (!Array.isArray(page.checks) || page.checks.length < 2) {
    problems.push(page.path + ' has an insufficient audit checklist.');
  }
  if (!Array.isArray(page.gaps)) {
    problems.push(page.path + ' must publish gaps as an array.');
  }

  const state = freshnessByPath.get(page.path);
  if (!state) {
    problems.push('Missing dependency-aware freshness state for ' + page.path);
    continue;
  }

  if (state.reviewedAt !== page.reviewedAt) {
    problems.push(
      page.path +
        ' derived freshness state changed the human reviewedAt date.'
    );
  }
  if (state.editorialStatus !== page.status) {
    problems.push(
      page.path + ' derived freshness state changed editorial completeness.'
    );
  }

  const expectedSignals = expectedSignalsByPage.get(page.path) || [];
  const expectedNeedsReview = expectedSignals.length > 0;
  if (state.needsReview !== expectedNeedsReview) {
    problems.push(
      page.path + ' dependency-review flag does not match the open review queue.'
    );
  }
  if (
    state.freshnessStatus !==
    (expectedNeedsReview ? 'needs-review' : 'current')
  ) {
    problems.push(page.path + ' has an invalid derived freshness status.');
  }

  const actualSignalKeys = new Set(
    (state.dependencySignals || []).map(signal => signal.key)
  );
  const expectedSignalKeys = new Set(expectedSignals.map(item => item.key));
  if (
    actualSignalKeys.size !== expectedSignalKeys.size ||
    [...expectedSignalKeys].some(key => !actualSignalKeys.has(key))
  ) {
    problems.push(
      page.path + ' dependency signals do not match the open review queue.'
    );
  }
}

const derivedNeedsReview = freshness.pages.filter(
  page => page.needsReview
).length;
if (freshness.summary.pages !== audit.length) {
  problems.push('Page freshness summary page count is incorrect.');
}
if (freshness.summary.needsReview !== derivedNeedsReview) {
  problems.push('Page freshness summary needsReview count is incorrect.');
}
if (freshness.summary.current !== audit.length - derivedNeedsReview) {
  problems.push('Page freshness summary current count is incorrect.');
}
if (
  freshness.summary.untrackedAffectedPages !==
  freshness.untrackedAffectedPages.length
) {
  problems.push('Page freshness summary untrackedAffectedPages count is incorrect.');
}

for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/<LastReviewed\b([\s\S]*?)\/>/g)) {
    if (!/\bdate\s*=/.test(match[1])) {
      problems.push(
        'LastReviewed must use an explicit human review date: ' + file
      );
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const partial = audit.filter(page => page.status === 'partial').length;
console.log(
  `Page-freshness audit passed: ${audit.length} major pages reviewed; ${partial} publish known completeness gaps; ${derivedNeedsReview} need dependency review without changing human reviewedAt dates; ${freshness.untrackedAffectedPages.length} affected pages are outside the current human audit.`
);
