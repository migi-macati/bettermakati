#!/usr/bin/env bash
set -euo pipefail

output_dir="${1:?Provide an empty output directory}"
mkdir "$output_dir"
base_sha=$(git rev-parse HEAD)
# Deliberately exclude publisher resolutions, canonical records and build output.
git diff --binary HEAD -- \
  src/data/newsSnapshot.ts \
  data/news-discovery-snapshot.json \
  data/news-review-queue.json \
  data/news-review-queue.md > "$output_dir/news.patch"
if [[ ! -s "$output_dir/news.patch" ]]; then
  rm "$output_dir/news.patch"
  printf 'No changed news snapshot or queue. Base commit: %s\n' "$base_sha" > "$output_dir/README.md"
else
  {
    printf '# News discovery candidate: review required\n\nBase commit: `%s`\n\n' "$base_sha"
    printf 'This patch is not published. Live /api/news remains the primary feed.\n'
    printf 'Civic Research: review source provenance, dates, relevance and the four-file diff.\n'
    printf 'The internal queue does not establish verified civic facts or authorize canonical promotion.\n'
    printf 'Apply in an isolated branch after git apply --check; regenerate if main has changed.\n'
    printf 'Use an authorized account or connector to open a normal PR with required build and browser-smoke checks.\n'
    printf 'Verify matching production and rendered output separately after merge.\n'
  } > "$output_dir/README.md"
fi
cat "$output_dir/README.md"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  cat "$output_dir/README.md" >> "$GITHUB_STEP_SUMMARY"
fi
