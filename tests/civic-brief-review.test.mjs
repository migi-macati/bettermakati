import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve('scripts/package-civic-brief-review.sh');
for (const changed of [false, true]) {
  test(`review package: ${changed ? 'scoped patch applies without generated files' : 'no-op contains no patch'}`, () => {
    const cwd = mkdtempSync(join(tmpdir(), 'brief-review-'));
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });
    try {
      git('init', '-q'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
      mkdirSync(join(cwd, 'data'));
      writeFileSync(join(cwd, 'data/civic-briefs.json'), '{"briefs":[]}\n');
      writeFileSync(join(cwd, 'generated.json'), '{}\n');
      git('add', '.'); git('commit', '-qm', 'base');
      const base = git('rev-parse', 'HEAD').trim();
      const next = '{"briefs":[{"id":"test-only"}]}\n';
      if (changed) writeFileSync(join(cwd, 'data/civic-briefs.json'), next);
      writeFileSync(join(cwd, 'generated.json'), '{"build":"side-effect"}\n');
      execFileSync('bash', [script, 'review'], { cwd, env: { ...process.env, GITHUB_STEP_SUMMARY: '' } });
      assert.ok(readFileSync(join(cwd, 'review/README.md'), 'utf8').includes(base));
      assert.equal(existsSync(join(cwd, 'review/civic-briefs.patch')), changed);
      if (changed) {
        const patch = readFileSync(join(cwd, 'review/civic-briefs.patch'), 'utf8');
        assert.ok(!patch.includes('generated.json'));
        git('restore', 'data/civic-briefs.json');
        git('apply', '--check', 'review/civic-briefs.patch');
        git('apply', 'review/civic-briefs.patch');
        assert.equal(readFileSync(join(cwd, 'data/civic-briefs.json'), 'utf8'), next);
      }
      assert.equal(git('rev-parse', 'HEAD').trim(), base);
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  });
}
