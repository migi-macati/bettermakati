# BetterMakati content automation

## What runs automatically

The News page now calls `/api/news`, a small Vercel serverless adapter that fetches the Google News RSS search for `Makati OR "Makati City"`. Results are filtered, deduplicated, cached for 15 minutes, and linked to the original publisher. The site does not copy article text or images.

The feed is a discovery layer, not a complete or authoritative record of every Makati story. Important claims should still be checked against the publisher and the official Makati source. Google News does not provide a supported public JSON API for this use case, so the implementation uses the RSS search endpoint and makes that limitation visible to readers.

The weekly GitHub Actions workflow runs every Monday at 09:00 Philippine time (`0 1 * * 1` UTC) and can also be started manually. It:

1. Refreshes the static news snapshot used as a fallback when the live adapter is unavailable.
2. Checks the official source watchlist in `data/source-watchlist.json`.
3. Records response status, content type, size, and SHA-256 hashes in `data/source-watch.json`.
4. Builds the site.
5. Opens a reviewable pull request when the news snapshot or source hashes change.

The source checker detects that a report or page changed. It does not replace a budget, census figure, or financial series automatically from a changed PDF. That replacement needs a deliberate data edit and source review. This prevents a redesigned PDF, OCR error, or unrelated page update from silently changing public figures.

## Activation and maintenance

The scheduled workflow must exist on the repository’s default branch for GitHub’s scheduler to run it. After this workflow is merged to the default branch, `workflow_dispatch` can be used to test it immediately. Merging the generated refresh pull request triggers the ordinary Vercel deployment.

The implementation follows [GitHub’s scheduled workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) and the existing Vercel deployment. The live adapter follows [Vercel’s Cron/Functions model](https://vercel.com/docs/cron-jobs), although it does not need a cron request because it refreshes on demand with cache headers.

## Adding another watch

Add one record to `data/source-watchlist.json` with a stable ID, human-readable label, URL, and kind. Prefer a first-party page or document. The next weekly run will include it in the status report and hash comparison.
