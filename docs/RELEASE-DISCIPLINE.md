# Release Discipline

BetterMakati uses a staged production workflow to protect reliability and avoid wasting deployment quota.

## Normal workflow

1. Work on a feature/hardening branch.
2. Open a pull request to `main`.
3. Run repository quality checks and production build.
4. Run browser smoke and accessibility regression tests.
5. Review published completeness/source gaps.
6. Squash-merge the approved branch into `main`.
7. Let the single `main` commit trigger the production deployment.

## Vercel deployment policy

Preview-branch Vercel deployments are disabled in `vercel.json`. Only `main` is configured to deploy automatically.

This is deliberate. GitHub-side QA validates branch work without consuming a Vercel build for every intermediate commit.

If Vercel reports a project/account build-rate limit, treat that as a hosting-quota failure rather than a code-build result. Do not repeatedly push no-op commits to retry it.

## Release checks

Before merging a substantial release:

```bash
npm ci
npm run quality
npm run build
```

The CI browser job additionally starts the production preview and runs the Playwright critical-path and axe accessibility suites.

## Content gates

`npm run audit:services` enforces:

- unique service IDs;
- every structured guide maps to a real service;
- minimum structured/verified guide coverage;
- every featured service has a structured guide;
- every structured-guide source is covered by source-watch.

`npm run audit:pages` enforces:

- major-page audit rows correspond to real routes;
- required audit metadata is present;
- reviews are not older than the configured freshness window;
- known gaps are explicitly represented.
