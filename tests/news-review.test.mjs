import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import * as yaml from 'js-yaml';

const script = resolve('scripts/package-news-review.sh');
const paths = ['src/data/newsSnapshot.ts', 'data/news-discovery-snapshot.json', 'data/news-review-queue.json', 'data/news-review-queue.md'];
for (const changed of [false, true]) {
  test(`news package ${changed ? 'round-trips only allowed paths' : 'no-op omits patch'}`, () => {
    const cwd = mkdtempSync(join(tmpdir(), 'news-review-'));
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });
    const put = (path, text) => { mkdirSync(dirname(join(cwd, path)), { recursive: true }); writeFileSync(join(cwd, path), text); };
    try {
      git('init', '-q'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
      for (const path of [...paths, 'data/news-review-resolutions.json', 'data/civic-briefs.json', 'public/generated.json']) put(path, 'before\n');
      git('add', '.'); git('commit', '-qm', 'base');
      const base = git('rev-parse', 'HEAD').trim();
      for (const path of ['data/news-review-resolutions.json', 'data/civic-briefs.json', 'public/generated.json']) put(path, 'excluded\n');
      if (changed) for (const path of paths) put(path, 'candidate\n');
      execFileSync('bash', [script, 'review'], { cwd, env: { ...process.env, GITHUB_STEP_SUMMARY: '' } });
      assert.ok(readFileSync(join(cwd, 'review/README.md'), 'utf8').includes(base));
      assert.equal(existsSync(join(cwd, 'review/news.patch')), changed);
      if (changed) {
        git('restore', ...paths);
        git('apply', '--check', 'review/news.patch'); git('apply', 'review/news.patch');
        for (const path of paths) assert.equal(readFileSync(join(cwd, path), 'utf8'), 'candidate\n');
        const included = git('apply', '--numstat', 'review/news.patch').trim().split('\n').map(line => line.split('\t')[2]);
        assert.deepEqual(included.sort(), [...paths].sort());
      }
      assert.equal(git('rev-parse', 'HEAD').trim(), base);
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  });
}
test('failed refresh/build cannot upload a publishable candidate; no repository writes', () => {
  const workflow = yaml.load(readFileSync('.github/workflows/weekly-content-refresh.yml', 'utf8'));
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  const steps = workflow.jobs.refresh.steps;
  assert.equal(steps.find(s => s.uses?.startsWith('actions/checkout')).with['persist-credentials'], false);
  const refresh = steps.findIndex(s => s.run === 'npm run update:news');
  const build = steps.findIndex(s => s.run === 'npm run build');
  const pack = steps.findIndex(s => s.run?.includes('package-news-review.sh'));
  const upload = steps.findIndex(s => s.uses?.startsWith('actions/upload-artifact'));
  assert.ok(refresh >= 0 && build > refresh && pack > build && upload > pack);
  // Default success gating: failure must never be converted to a successful refresh.
  for (const step of steps) { assert.equal(step['continue-on-error'], undefined); assert.equal(step.if, undefined); }
  assert.ok(!JSON.stringify(steps).match(/create-pull-request|git push|GITHUB_TOKEN/));
});
