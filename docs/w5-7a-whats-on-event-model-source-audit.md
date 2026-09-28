# W5-7a — What’s On event model and source audit

Reviewed: 2026-09-28

## Status

**Complete. Audit/model only; event ingestion starts in W5-7b.**

W5-7 follows the frozen Wave 5 sequence after Explore Makati.

The purpose of **What’s On** is narrower than a generic entertainment guide:
surface current, date-bounded Makati activity from defensible sources, connect
it to BetterMakati’s canonical places/areas/barangays, and remove it from the
default current view when the activity is over.

## Current page architecture

The existing `/whats-on` page is currently a source directory rather than an
event product.

It has:

- six Google Search shortcuts: Today, This weekend, Free, Family, Arts &
  culture, Markets;
- five hand-written source cards;
- no canonical event records;
- no start/end dates in BetterMakati data;
- no deduplication;
- no cancellation/postponement state;
- no automatic expiry/archive rule;
- no event-to-Place/Area/Barangay relationships;
- no event-specific Search records.

The five current source cards are:

1. Makati City Events;
2. Make It Makati;
3. Ayala Malls;
4. Power Plant Mall / Proscenium source;
5. Century City Mall.

The current page’s “Power Plant Mall” card actually links to the Proscenium
Theater property page. That label/source mismatch should be corrected when the
source registry is introduced.

The page still carries the old **Visit Makati** eyebrow and a 2026-09-20 review
date. Those are presentation issues for W5-7d, not reasons to modify the page
during this audit step.

## Current-source audit

### 1. City Government of Makati — Makati Events

Source:
https://www.makati.gov.ph/content/events

Class:
**Official government primary**

Current state:
- active as of this review;
- lists 1,249 event records;
- includes September 2026 entries such as World Contraception Day 2026,
  barangay caravans and Kadiwa activities;
- individual event pages can include a publication date plus event date,
  location/time and contact details.

Ingestion suitability:
**High**

Use:
- city-organized and city-published public activities;
- source record identity should retain the Makati portal event URL/ID.

Caution:
- the listing also contains entries that are not really public events, such as
  procurement/supplemental-bid notices;
- ingestion must classify event-like records instead of blindly mirroring the
  full feed.

### 2. Make It Makati

Source:
https://makeitmakati.com/

Class:
**First-party estate/district guide**

Current state:
- active;
- exposes Makati CBD, Ayala Center, Circuit Makati and other Ayala Land Makati
  destinations;
- its content surface mixes durable destination articles, archived lifestyle
  articles and dated event/event-recap material.

Ingestion suitability:
**Selective**

Use only when an item has:
- an explicit event date or event window;
- an identifiable Makati venue/area;
- a current first-party article/source URL.

Do not ingest:
- generic “things to do” articles;
- old evergreen/archived lifestyle posts merely because they are still
  discoverable;
- restaurant/shopping recommendations as events.

### 3. Ayala Malls

Current source:
https://www.ayalamalls.com/promos-and-events

Class:
**First-party venue/operator**

Current state:
- active;
- Ayala Malls exposes a dedicated “Promos & Events” surface;
- mall pages also expose venue-specific commercial discovery.

Ingestion suitability:
**Selective / needs item-level evidence**

Use:
- an actual event when the item establishes a date/window and Makati venue.

Do not equate:
- a promotion with an event;
- a mall-directory card with a scheduled activity.

W5-7b should not build an Ayala Malls scraper until stable item-level event URLs
and date/location fields are confirmed.

### 4. Rockwell / Proscenium Theater

Primary source:
https://e-rockwell.com/property/proscenium-theater/

Class:
**First-party venue/operator**

Current state:
- active;
- publishes dated event articles and current/upcoming theater information;
- September 2026 Rockwell articles expose current Makati activity.

Ingestion suitability:
**Medium to high, but prefer dated event articles**

Important source-quality issue:
- the generic theater page currently contains template/placeholder-looking
  schedule content alongside genuine dated articles;
- therefore the generic “Show Schedule” markup is not strong enough by itself
  to promote an event into BetterMakati.

Use:
- dated first-party event articles;
- explicit event date/window;
- venue identity at Rockwell Center / Proscenium Theater;
- organizer-linked ticket source as a live ticket handoff where relevant.

Avoid:
- placeholder-looking schedule entries;
- treating every Rockwell news article as an event;
- the current “Power Plant Mall” source label for this Proscenium URL.

### 5. Century City Mall

Source:
https://www.centurycitymall.com.ph/news-and-events/

Class:
**First-party venue/operator**

Current state:
- active;
- contains September 2026 event/news entries;
- item excerpts can expose event windows and venue details, including Events
  Center and mall-level locations.

Ingestion suitability:
**High for clearly dated event items**

Use:
- item-level records with explicit current/future event dates and Makati venue.

Exclude:
- operating-hours notices;
- pure promotions without an event occurrence;
- recap/archive content after the event has expired from the current view.

## Source hierarchy

W5-7 should use the following hierarchy per event assertion.

### Tier A — official/public primary

Examples:
- City Government of Makati event pages;
- other government organizer pages for a Makati event.

Can establish:
- event identity;
- official date/time;
- venue;
- organizer;
- registration/public-service details.

### Tier B — first-party organizer or venue

Examples:
- Proscenium Theater / Rockwell;
- Century City Mall;
- Ayala Malls;
- Make It Makati when acting as the event/district publisher.

Can establish:
- event identity;
- date/window;
- venue;
- ticket/registration handoff;
- organizer/host claims made by that source.

### Tier C — organizer-linked ticket/registration source

Examples:
- TicketWorld when the first-party event page links to that listing.

Can establish:
- current ticket/registration availability;
- performance/session options;
- ticket-facing details.

It should not replace the first-party event source as the canonical provenance
when the venue/organizer page exists.

### Tier D — current secondary discovery

Use only for:
- discovery;
- corroboration;
- filling a non-critical field when clearly attributed.

A secondary discovery page alone should not promote an event into the canonical
current What’s On feed if a primary/first-party source can reasonably be found.

## Proposed event model

W5-7b should introduce one canonical event record with these conceptual fields.

### Identity

- `id` — stable BetterMakati event ID;
- `title`;
- `aliases` — optional alternate source title;
- `category` — civic/community, arts/culture, market, family, performance,
  sports, learning, fair/expo, other.

### Lifecycle

- `status` — scheduled, ongoing, postponed, cancelled, ended;
- `startsAt`;
- `endsAt`;
- `allDay`;
- `datePrecision` — exact-datetime, date-only, date-range;
- timezone fixed to **Asia/Manila** for local event records.

No event should enter the current feed without a defensible start date or start
window.

### Place/context

Prefer canonical references:

- `placeId` when the venue is a canonical Place;
- `areaIds`;
- `barangaySlugs`.

Fallback:
- `venueLabel` when a venue is source-backed but not canonicalized.

Do not create a Place solely because an event happens there.

### Organizer/source

- organizer/host label;
- source IDs;
- primary event URL;
- source class;
- source publication date when available;
- last checked date.

### Access

Optional, source-backed only:

- free;
- ticketed;
- registration required;
- open/public;
- access unknown.

Do not freeze ticket price, seat availability or registration inventory unless
there is a compelling product need; keep those on the live handoff.

### Relationships

Optional cross-links:

- canonical visitor experience ID for recurring experiences such as the Salcedo
  or Legazpi markets;
- related Heritage/Place/Area/Barangay context;
- Cinema page only for film/showtime-specific activity when useful.

## Deduplication doctrine

The same event may appear on city, venue, organizer and ticket sources.

Do not create one event per source.

Candidate duplicate signals:

1. normalized title;
2. overlapping start/end window;
3. same or equivalent venue;
4. same organizer/performer/program identity.

If multiple strong sources describe the same event:
- keep one BetterMakati event ID;
- attach multiple source IDs;
- preserve the strongest source for each disputed field;
- retain differing source titles as aliases where useful.

A title match alone is not enough to merge two events.

## Expiry and archive doctrine

The default What’s On view should never become an archive disguised as a
current calendar.

Rules for W5-7c:

- **scheduled**: appears before start;
- **ongoing**: appears while current time is within the event window;
- **ended**: leaves the default current view after `endsAt`;
- date-only single-day records expire at the end of that local date;
- **cancelled** and **postponed** remain visible only while the change is useful
  to someone who might still act on the original event;
- historical records may remain searchable/archiveable, but not mixed into the
  default current feed;
- recurring programs should represent occurrences explicitly when the source
  publishes discrete dates rather than invent an infinite recurrence rule.

## Relationship to Explore Makati

What’s On owns **date-bounded current activity**.

Explore Makati owns **durable orientation and recurring city experiences**.

Therefore:
- Salcedo Saturday Market and Legazpi Sunday Market may have specific sourced
  occurrences in What’s On;
- those occurrences should link to the existing visitor-experience identities
  rather than create duplicate durable place/experience records;
- generic restaurant, nightlife, shopping and “things to do” discovery stays
  in Explore Makati’s live discovery layer, not the event registry.

## Relationship to News / City Monitor

Do not copy every city news post into What’s On.

A record belongs in What’s On when the user can answer:

> **What is happening at a specific future/current time or date that I can
> attend, join, watch or act on?**

City Monitor remains the source for government activity, records and official
developments. News remains a news/discovery surface.

A city announcement may generate:
- a City Monitor/news record because it was published; and
- one event record because it announces a dated public activity.

Those are related but not the same entity.

## W5-7b pilot ingestion scope

Start small with sources that already expose strong item-level dates.

Pilot:

1. **City Government of Makati Events**
   - current/future event-like items only;
2. **Century City Mall**
   - clearly dated current/future event items only;
3. **Rockwell / Proscenium**
   - dated first-party event articles only.

Defer broad automated ingestion from:
- Make It Makati until event/article classification is reliable;
- Ayala Malls until stable item-level date/location URLs are confirmed.

The pilot should prove the schema, deduplication inputs and expiry behavior
before adding more sources.

## W5-7 sequence

- **W5-7a** — event model/source audit — complete;
- **W5-7b** — pilot event ingestion;
- **W5-7c** — deduplication + expiry/archive rules;
- **W5-7d** — calendar/list/discovery UX;
- **W5-7e** — Place/Area/Barangay/Explore/Search cross-links;
- **W5-7f** — QA and closure.

## Next micro-step

**W5-7b — build the canonical event registry and ingest a bounded pilot from
strong current item-level sources.**

Do not scrape or mirror every listing. Every promoted event must have a
defensible date/window, source URL and Makati place/context.
