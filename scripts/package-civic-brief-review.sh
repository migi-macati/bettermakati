#!/usr/bin/env bash
set -euo pipefail

# Package only the canonical brief archive; build side effects stay outside review.
output_dir="${1:?Provide an empty output directory}"
mkdir "$output_dir"
base_sha=$(git rev-parse HEAD)
git diff --binary HEAD -- data/civic-briefs.json > "$output_dir/civic-briefs.patch"
if [[ ! -s "$output_dir/civic-briefs.patch" ]]; then
  rm "$output_dir/civic-briefs.patch"
  printf 'No new Civic Brief snapshot. Base commit: %s\n' "$base_sha" > "$output_dir/README.md"
else
  {
    printf '# Civic Brief candidate: review required\n\nBase commit: `%s`\n\n' "$base_sha"
    printf 'This patch changes only data/civic-briefs.json. It is not published.\n\n'
    printf 'Civic Research: inspect the diff, source records, dates and empty-brief relevance.\n'
    printf 'Apply the reviewed patch in an isolated branch using git apply --check first.\n'
    printf 'If main changed, regenerate against current main; do not replace its archive.\n'
    printf 'Open a normal PR through an authorized account or connector. Required build and browser-smoke checks still apply.\n'
    printf 'After merge, verify matching production deployment and rendered output separately.\n'
  } > "$output_dir/README.md"
fi
cat "$output_dir/README.md"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  cat "$output_dir/README.md" >> "$GITHUB_STEP_SUMMARY"
fi
