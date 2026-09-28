# W5-8a — Current news and discovery audit

Reviewed: 2026-09-28

## Scope

Inventory the current BetterMakati news/discovery system before changing sources,
freshness rules, categorization, cross-links or downstream distribution.

This is an **internal reconciliation step**. It does not promote a headline into
City Monitor, Accountability, Reports & Insights, the Civic Timeline or a
canonical Place/Area/Barangay merely because the headline mentions Makati.

W5-7 has already separated civic dates from the old “What’s On” concept. W5-8
therefore treats news as a **discovery layer**, not as another canonical record
system.

## Current public architecture

BetterMakati currently has three news-facing surfaces:

1. `/news` — “Makati in the News”;
2. `/today` — consumes the first three live news items;
3. Search — one static “News & events” result pointing to `/news`.

The main navigation exposes “Makati in the News” under Today.

## Current ingestion path

The live path is:

`/api/news`
→ `scripts/news-feed.mjs`
→ Google News RSS search for `Makati OR "Makati City"`
→ up to 30 parsed items
→ `/news` and the first three items on `/today`.

The endpoint currently uses a 15-minute shared cache with one-hour
stale-while-revalidate behavior.

A generated/static `newsSnapshot` is the fallback for the News page when the
live endpoint cannot be loaded.

## Current source set

### A. Google News RSS

Current query:

`Makati OR "Makati City"`

It supplies publisher name, publisher URL, headline, description, article URL
and publication date.

### B. City Government of Makati — News

`https://www.makati.gov.ph/content/news`

This is linked as an official source on the News page and separately monitored
by City Monitor.

A 28 September source check confirms that the official Makati news index remains
live and contains current 2026 city announcements.

### C. City Government of Makati — Events

`https://www.makati.gov.ph/content/events`

This remains linked from the News page. The source itself is useful, but the
product meaning has changed: W5-7 now owns civic dates through the Makati
Calendar.

The News surface should not recreate a general event destination.

## What already works

Preserve:

- original-publisher handoff rather than republishing full articles;
- visible publisher and publication-time metadata;
- live endpoint plus static fallback;
- a manual Refresh action;
- an explicit distinction between the independent/news-feed surface and the
  City Monitor link;
- reuse of the same endpoint on Today instead of maintaining a second headline
  feed;
- official Makati News as a first-party discovery source.

## Current weaknesses

### A. Relevance is only a word match

The Google News parser accepts an item when “Makati” appears in the title or
description.

That is enough for broad discovery but not enough for a civic-information
product. It can admit stories where Makati is incidental, a dateline, a company
location or one item in a broader Metro Manila story.

### B. Deduplication is link-level only

The parser deduplicates by article URL.

The same underlying development can therefore appear several times when
different publishers cover it or when syndicated copies use different URLs.

There is no story-cluster identity yet.

### C. No source-classification contract

The current `NewsItem` does not distinguish:

- official government announcement;
- independent reporting;
- company / institutional release;
- commentary or analysis;
- syndicated copy;
- event listing.

Publisher text alone is not a reliable classification.

### D. No consequence / civic-relevance model

All matching headlines are treated equally.

There is no explicit way to distinguish a consequential Makati development
from routine crime blotter, lifestyle coverage, corporate promotion, sports,
celebrity or incidental-location stories.

W5-8 must define this before feeding anything into City Monitor or other civic
surfaces.

### E. No canonical entity links

News items currently do not reference canonical:

- Barangays;
- Places;
- Areas / estates / districts;
- mobility systems or routes;
- projects;
- government offices;
- legislation;
- City Monitor records.

The feed is therefore a terminal list rather than a discovery layer that helps
users move into BetterMakati’s structured knowledge.

### F. No promotion boundary

There is no explicit rule for when a news item may create or update:

- a City Monitor record;
- an Accountability item;
- a Report / Insight lead;
- a Civic Timeline candidate;
- a canonical entity.

The correct default is **never automatically**.

A news article may discover a development, but canonical promotion should
require the evidence standard of the destination domain.

### G. Search still says “News & events”

The static Search record for `/news` is titled “News & events” and describes
“Official city news and event listings.”

That now conflicts with W5-7. News and civic-time discovery should remain
cross-linked but separately owned.

### H. Official source and media feed are visually flattened

The News page has an “Official sources” section, but headline cards themselves
do not expose whether an item is official, independent, institutional or
unknown.

That distinction matters for interpretation and source trust without implying
that one class is universally superior.

### I. Snapshot provenance is weak

The fallback snapshot is a hand-maintained/generated array with no explicit
`retrievedAt`, ingestion query, story-cluster identifier or generation
metadata in the public type.

The comment says it is source-backed, but the record contract does not preserve
how or when the fallback was generated.

### J. Today inherits feed noise

Today displays the first three API items without a separate civic-relevance
gate.

A noisy Google News match can therefore become more prominent on the daily
dashboard than a consequential city development.

## Product boundary

W5-8 should use **news for discovery, canonical domains for truth**.

The News layer may:

- discover and cluster current stories;
- identify publisher/source class;
- assign topical and geographic relevance;
- link a story to existing BetterMakati entities;
- surface noteworthy developments;
- create an internal promotion candidate for another domain.

The News layer must not, by itself:

- establish a government action as final;
- infer a project status;
- infer a legislative stage;
- infer a procurement award;
- create a canonical Place/Area/Barangay;
- treat a publication date as an official effective date;
- copy a publisher’s framing into BetterMakati’s own factual voice.

## Source roles to carry forward

### Discovery sources

- Google News RSS for broad current discovery;
- City Government of Makati News for first-party announcements;
- additional source classes to be evaluated in W5-8b.

### Canonical-evidence sources

These remain domain-specific.

For example, a news story about an ordinance should hand off to the official
legislation record before Legislation or City Monitor treats the action as
canonical.

## W5-8 architecture decision

Do **not** build a second newspaper or a comprehensive media archive.

Build a current-affairs discovery layer that answers:

- What changed or was reported about Makati?
- Is this actually about Makati?
- Who published it and what kind of source is it?
- Is it materially different from another headline about the same development?
- Which BetterMakati entity or civic record does it help the user understand?
- Does it merely remain news, or should it be reviewed for canonical promotion?

## Next step

### W5-8b — source and freshness rules

Define the source registry, publisher/source classes, freshness windows,
retrieval metadata, source health rules, duplicate/syndication treatment and
the threshold for keeping a story in the general feed versus creating a
domain-review candidate.

W5-8b should also remove the obsolete ownership implication in the Search label
“News & events,” but it should not yet perform broad story categorization or
cross-domain promotion.
