# W5-7c — Event lifecycle, expiry and deduplication

Reviewed: 2026-09-28

## Status

**Complete.**

W5-7c adds deterministic lifecycle selectors and duplicate-candidate helpers in
`src/data/eventLifecycle.ts`.

The public What’s On page still does not render the registry yet; that remains
W5-7d.

## Manila-time lifecycle

All event records are local Makati events, so current/archive decisions use
**Asia/Manila**.

`manilaDateKey(now)` converts a clock value into a deterministic
`YYYY-MM-DD` Makati date before evaluating date-only and date-range records.

This avoids relying on browser/host UTC interpretation for all-day events.

## Effective status

`effectiveEventStatus(event, now)` treats stored lifecycle state and sourced
dates differently.

### Date-only and date-range events

- before the start date → `scheduled`;
- during the sourced date/window → `ongoing`;
- after the sourced end date → `ended`.

### Exact-datetime events

- before the exact start → `scheduled`;
- between exact start/end → `ongoing`;
- after exact end → `ended`.

If an exact-datetime event has no sourced end time, BetterMakati does **not**
invent a duration. It leaves the default current feed immediately after the
exact start point.

That is intentionally conservative. A later source can add a defensible end
time.

### Explicit cancellation/postponement

A source-backed `cancelled` or `postponed` state remains visible while the
original sourced event window is still action-relevant.

Once that window has expired, the effective status becomes `ended` so old
cancellation/postponement notices cannot persist indefinitely in the current
feed.

A stored `ended` event always remains ended.

## Current feed

`currentEventFeed(events, now)` excludes every event whose effective state is
`ended`.

Current ordering is deterministic:

1. ongoing;
2. postponed;
3. cancelled;
4. scheduled;
5. start time/date;
6. title.

The pilot evaluated on 2026-09-28 therefore contains only **Lifestyles Done
Rockwell** in the default current set.

The three ended W5-7b evidence records belong only to the archive selector.

## Archive

`archivedEventFeed(events, now)` contains only effective `ended` records and
sorts newest first.

This is the mechanical guarantee that What’s On can have historical evidence
without becoming an archive disguised as a current calendar.

## Duplicate candidates

W5-7c does not auto-merge events.

Instead, `eventDuplicateSignals(left, right)` evaluates three classes of
evidence.

### Title identity

Normalized exact identity across:
- canonical title;
- aliases.

Normalization removes case, punctuation and accent differences and normalizes
`&` to `and`.

### Date overlap

The sourced event date windows must overlap.

A shared title on unrelated dates is not a duplicate candidate.

### Location equivalence

At least one must match:
- canonical Place ID;
- canonical Area ID;
- normalized sourced venue label.

Barangay alone is deliberately **not** enough because many unrelated events can
occur in the same barangay.

A pair becomes a duplicate candidate only when:

> **title match + date overlap + location match**

`findEventDuplicateCandidates()` returns candidate pairs for human/source
reconciliation. It never merges them automatically.

## Why no fuzzy title score

The first deduplication rule is deliberately conservative.

Event titles often reuse words such as “festival,” “market,” “concert,”
“caravan” or “anniversary.” A fuzzy-title threshold could silently merge
different activities.

If future ingestion shows a real need for fuzzy matching, it should only
surface weaker review candidates, not perform automatic identity merges.

## Guard

`check:event-lifecycle` is now wired into both `build` and `quality`.

It protects:

- Manila-time date handling;
- current/archive separation;
- conservative exact-time expiry;
- cancellation/postponement expiry;
- deterministic current ordering;
- the title + date + location duplicate-candidate rule.

## Next micro-step

**W5-7d — rebuild What’s On as the public current-activity experience.**

Render the lifecycle-filtered current feed, clearly distinguish ongoing from
upcoming/cancelled/postponed records, retain original-source handoffs, and keep
the archive separate from the default view.
