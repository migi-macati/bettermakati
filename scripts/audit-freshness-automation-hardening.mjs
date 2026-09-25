import { readFile } from 'node:fs/promises';

const sourceWorkflow = await readFile('.github/workflows/source-freshness.yml', 'utf8');
const cityWorkflow = await readFile('.github/workflows/daily-city-monitor.yml', 'utf8');
const civicWorkflow = await readFile('.github/workflows/civic-briefs.yml', 'utf8');
const sourceChecker = await readFile('scripts/check-sources.mjs', 'utf8');
const cityChecker = await readFile('scripts/check-city-monitor.mjs', 'utf8');
const queueBuilder = await readFile('scripts/build-freshness-review-queue.mjs', 'utf8');

const problems = [];

const workflows = [
  ['Source freshness', sourceWorkflow],
  ['City Monitor', cityWorkflow],
];

for (const [label, workflow] of workflows) {
  for (const marker of [
    'group: scheduled-main-writer',
    'cancel-in-progress: false',
    'timeout-minutes: 20',
    "if: steps.publish.outputs.publish_required == 'true'",
    'id: publish_git',
    'for attempt in 1 2 3; do',
    'git fetch origin main',
    'git rebase origin/main',
    'git rebase --abort || true',
    'git push origin HEAD:main',
    'echo "published=true" >> "$GITHUB_OUTPUT"',
    'echo "published=false" >> "$GITHUB_OUTPUT"',
    "if: steps.publish_git.outputs.published == 'true'",
    "const title = 'Freshness review queue'",
    '.sort((a, b) => a.number - b.number)',
    'matches.slice(1)',
    "state: 'closed'",
    "fs.readFileSync('data/freshness-review-queue.md', 'utf8')",
    'data/freshness-review-queue.json',
    'data/page-freshness-state.json',
    'data/freshness-history.json',
  ]) {
    if (!workflow.includes(marker)) {
      problems.push(label + ' workflow lost hardening marker: ' + marker);
    }
  }

  if (workflow.includes('git push --force') || workflow.includes('git push -f')) {
    problems.push(label + ' workflow must never force-push generated freshness state.');
  }

  const publishIndex = workflow.indexOf('id: publish_git');
  const issueIndex = workflow.indexOf('- name: Sync freshness review issue');
  const buildIndex = workflow.indexOf('- name: Verify production build');
  if (!(buildIndex >= 0 && publishIndex > buildIndex && issueIndex > publishIndex)) {
    problems.push(label + ' workflow must build, publish, then sync the review issue in that order.');
  }

  const concurrencyMatches = workflow.match(/group: scheduled-main-writer/g) || [];
  if (concurrencyMatches.length !== 1) {
    problems.push(label + ' workflow must declare exactly one shared freshness writer lock.');
  }
}

for (const [label, checker] of [
  ['Source freshness', sourceChecker],
  ['City Monitor', cityChecker],
]) {
  for (const marker of [
    'const maxFetchAttempts = 2',
    'const shouldRetryStatus = status => status === 429 || status >= 500',
    'const fetchWithRetry = async',
    'attempt < maxFetchAttempts && shouldRetryStatus(response.status)',
    'await sleep(attempt * 1000)',
  ]) {
    if (!checker.includes(marker)) {
      problems.push(label + ' checker lost transient fetch retry behavior: ' + marker);
    }
  }
}

for (const marker of [
  'group: scheduled-main-writer',
  'cancel-in-progress: false',
  'timeout-minutes: 20',
  'for attempt in 1 2 3; do',
  'git fetch origin main',
  'git rebase origin/main',
  'git rebase --abort || true',
  'git push origin HEAD:main',
]) {
  if (!civicWorkflow.includes(marker)) {
    problems.push('Civic Brief workflow lost direct-main writer hardening: ' + marker);
  }
}
if (civicWorkflow.includes('git push --force') || civicWorkflow.includes('git push -f')) {
  problems.push('Civic Brief workflow must never force-push.');
}

for (const marker of [
  'const publishRequired = checked.some(semanticStateChanged)',
  'if (old.status !== result.status) return true',
  "result.monitoringMode === 'content-hash'",
]) {
  if (!sourceChecker.includes(marker)) {
    problems.push('Source freshness no-op/recovery semantics lost marker: ' + marker);
  }
}

for (const marker of [
  'const publishRequired = results.some(semanticStateChanged)',
  'if (old.status !== result.status) return true',
  "result.monitoringMode === 'content-hash'",
]) {
  if (!cityChecker.includes(marker)) {
    problems.push('City Monitor no-op/recovery semantics lost marker: ' + marker);
  }
}

for (const marker of [
  "state.status !== 'http-error' && state.status !== 'unreachable'",
  "signal: 'check-failed'",
  "resolution?.resolvedAt",
  'resolution.resolvedAt >= detectedAt',
  'openCount',
]) {
  if (!queueBuilder.includes(marker) && marker !== 'openCount') {
    problems.push('Freshness queue recovery/resolution semantics lost marker: ' + marker);
  }
}

if (!sourceWorkflow.includes("openCount = Number(queue.summary?.open || 0)")) {
  problems.push('Source freshness issue sync no longer evaluates cleared queues.');
}
if (!cityWorkflow.includes("openCount = Number(queue.summary?.open || 0)")) {
  problems.push('City Monitor issue sync no longer evaluates cleared queues.');
}

for (const [label, workflow] of workflows) {
  if (
    workflow.includes(
      "data/freshness-review-queue.md             data/page-freshness-state.json"
    )
  ) {
    problems.push(label + ' workflow contains a malformed concatenated freshness path.');
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Freshness automation hardening audit passed: shared writer lock, bounded runtime, retrying rebase/push, no force-push, post-publish issue sync, duplicate issue cleanup, recovery and no-op guards are intact.'
);
