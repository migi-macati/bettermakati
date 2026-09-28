# W5-8e — Owner review workflow, recurrence suppression and W5-8 closure

Reviewed: 2026-09-28

## Status

**W5-8 News & Discovery is closed at repository level, with editorial review and deployment/browser verification preserved as separate work.**

Closure means the discovery, relevance, clustering, routing, review and
resolution architecture is bounded and guarded. It does **not** mean every
current or future headline has been editorially resolved.

## Review decisions

A reviewer may close an internal news-review candidate with exactly one of
seven decisions.

### `update-existing`

The reported development belongs to an existing canonical record.

The resolution must preserve `canonicalRef`. The reviewer updates that
canonical owner only when owner-specific evidence supports the change.

### `create-canonical-record`

The development is genuinely new and the destination domain has enough evidence
to create a canonical record.

The resolution must preserve the newly created `canonicalRef`. The news item
remains discovery/provenance rather than becoming the canonical record itself.

### `context-only`

The coverage is useful context but does not establish a canonical civic fact or
status change.

The story is suppressed after resolution, but it may return if materially new
official/canonical evidence later appears.

### `duplicate`

The story duplicates an existing canonical item or already-resolved civic
development.

A `canonicalRef` is required so the decision remains traceable.

### `stale`

The story is too old or overtaken by later evidence for the current review
workflow.

This is terminal for the matched story.

### `insufficient-evidence`

The story raises a plausible civic issue, but the available evidence does not
meet the destination owner’s standard.

The story stays suppressed until materially new official/canonical evidence
appears.

### `out-of-scope`

The item does not belong in the civic-review workflow.

This is terminal for the matched story. It may remain ordinary coverage on the
public News page when otherwise eligible.

## Append-only resolution ledger

Human/editorial decisions live in:

`data/news-review-resolutions.json`

The daily automation **must not overwrite this file**.

Each resolution preserves:

- a unique resolution id;
- the decision;
- resolution timestamp;
- candidate/story-cluster/source-URL match keys;
- the material-evidence fingerprint seen at resolution time;
- a canonical reference when the decision requires one;
- optional reviewer notes.

The validator rejects `update-existing`, `create-canonical-record` and
`duplicate` decisions without a canonical reference.

## Recurrence suppression

Daily refreshes compare active discovery candidates against the resolution
ledger.

A previously resolved story is recognized by one or more of:

- exact candidate id;
- exact story-cluster id;
- overlap with a source URL preserved in the resolution.

When the story matches and nothing materially changed, it stays out of the
active queue.

This prevents the same headline cluster from reappearing every morning after an
editorial decision.

## What counts as materially new evidence

The W5-8e fingerprint is intentionally narrow.

Material evidence currently includes:

- a newly matched canonical record/reference;
- a newly discovered official-government or government-information source;
- a changed owner/topic route that materially changes where the story should be
  reviewed.

A new secondary publisher repeating the same story is **not**, by itself,
material evidence.

When new material evidence appears, the story resurfaces as
`material-update-review`, with the prior decision and only the new evidence
keys called out.

`stale` and `out-of-scope` remain terminal for the matched story.

## Public/internal boundary

The public product remains:

- `/news` — current Makati coverage, source type, relevance, clustering and
  canonical cross-links;
- `/today` — fresh coverage that directly concerns Makati or a recognized
  Makati entity.

The following remain internal:

- `data/news-discovery-snapshot.json`;
- `data/news-review-queue.json`;
- `data/news-review-queue.md`;
- `data/news-review-resolutions.json`.

The site generator does not copy these artifacts into public output and there
is no public review-queue route.

## Daily operating loop

At 09:00 Philippine time the news discovery workflow:

1. refreshes the live/fallback news discovery snapshot;
2. clusters current stories;
3. builds civic-topic review candidates;
4. checks exact canonical matches;
5. applies resolution-history suppression;
6. resurfaces only materially changed resolved stories;
7. runs the normal build/quality guards;
8. opens or updates a reviewable automation pull request.

No step auto-publishes a news claim into a canonical domain.

## Current editorial state

The seeded September 19 City Hall work-schedule/service-hours item remains an
active **Services** review candidate with City Monitor as secondary routing.

It has deliberately **not** been force-resolved merely to make W5-8 close.
Editorial resolution of an active item and architectural closure are separate
questions.

## W5-8 architecture now closed

### W5-8a

Audited the old Google News/official-source architecture and separated news
discovery from canonical civic truth.

### W5-8b

Added publisher classes, freshness windows, retrieval provenance, source health
and conservative review-candidate rules.

### W5-8c

Added direct/contextual Makati relevance, conservative story clustering and
explicit canonical entity relationships.

### W5-8d

Added topic routing, canonical deduplication and the internal owner-review queue;
moved discovery refresh from weekly to daily.

### W5-8e

Added append-only review decisions, recurrence suppression, material-evidence
resurfacing and the final W5-8 closure guard.

## Closure guard

`check:wave5-news-discovery-closure` protects:

- the canonical public News route;
- Today’s direct-Makati freshness gate;
- conservative clustering;
- canonical relationship boundaries;
- internal-only review routing;
- seven resolution decisions;
- append-only resolution ownership;
- recurrence suppression/material-update behavior;
- daily refresh cadence;
- non-public review artifacts;
- explicit deployment/browser-verification deferral.

## Deployment

Repository closure does not establish production deployment.

A fresh Vercel deployment and live browser pass remain explicitly unverified
until checked separately.
