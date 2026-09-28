# W5-7b — Canonical event registry and pilot ingestion

Reviewed: 2026-09-28

## Status

**Complete. Registry/pilot only; current/archive selectors remain W5-7c.**

W5-7b introduces `src/data/eventRegistry.ts` and a deliberately small pilot
from strong item-level sources.

## Why the pilot includes ended records

As of the review date, the strongest currently verifiable item-level sources do
not provide four separate future events.

Rather than weaken the evidence standard, the pilot contains:

- **1 ongoing event** that is still current on 2026-09-28;
- **3 ended event records** retained only to prove provenance, canonical
  location relationships, date precision and lifecycle representation.

W5-7c will add current/archive selectors so ended records cannot leak into the
default current What’s On view.

## Pilot records

### Lifestyles Done Rockwell

ID:
`lifestyles-done-rockwell-2026`

Lifecycle:
- ongoing;
- September 25 to October 25, 2026.

Source:
- Rockwell Land first-party event article.

Context:
- venue label: North Court, R1 Level, Power Plant Mall;
- canonical Area: `rockwell-center`;
- Barangay: `poblacion`.

This is the one current event in the W5-7b pilot.

### Card Expo PH

ID:
`card-expo-ph-century-city-2026`

Lifecycle:
- ended;
- September 26–27, 2026.

Source:
- Century City Mall first-party September events article.

Context:
- Events Center, Century City Mall;
- canonical Area: `century-city`;
- Barangay: `poblacion`.

It is retained as a provenance/date-range pilot record, not as a current
recommendation.

### Comedy Nights with Redd Ollero and James Caraan

ID:
`comedy-nights-century-city-2026-09-26`

Lifecycle:
- ended;
- September 26, 2026.

Source:
- Century City Mall first-party September events article.

Context:
- Level 3, Cinema 4, Century City Mall;
- canonical Area: `century-city`;
- Barangay: `poblacion`.

It demonstrates a date-only performance record.

### 11th Makati Bike for M.E.

ID:
`makati-bike-for-me-11-2026`

Lifecycle:
- ended;
- June 6, 2026 at 5:00 AM.

Source:
- City Government of Makati event page.

Context:
- canonical Place: `makati-city-hall`;
- sourced venue label: Makati City Hall Quadrangle;
- Barangay: `poblacion`.

It demonstrates an official-government source, exact local datetime and a
canonical Place relationship.

## Schema

The event registry now models:

- stable event ID and title;
- optional aliases;
- event category;
- lifecycle status;
- start/end values;
- all-day flag;
- date precision;
- fixed `Asia/Manila` timezone;
- canonical Place / Area / Barangay context;
- fallback sourced venue label;
- organizer label;
- access classification;
- source IDs and primary source;
- optional Explore visitor-experience relationship;
- field-level provenance assertions;
- tags.

## Evidence rules

The registry validates that:

- every source has a valid URL and review date;
- every event has a valid start;
- ranges have an end and cannot run backward;
- exact-datetime records contain a time;
- every event has either a canonical Place or a sourced venue label;
- Place, Area, Barangay and Explore references exist;
- every event cites at least one registered source;
- the primary source is included in the event’s source set;
- provenance assertions cite registered sources;
- the one `ongoing` pilot record actually spans 2026-09-28;
- the three `ended` pilot records ended before 2026-09-28.

No event is promoted from a title-only listing or an undated source.

## Current-source discipline

The Makati city event listing was reviewed, but no later city-government item
was promoted merely to fill the pilot. The latest confidently item-level city
record used here is historical.

Century City Mall’s September article was used because it exposes explicit
event names, dates and venues. Its September 26–27 items are already ended and
are represented as such.

Rockwell’s September 11 first-party article explicitly gives the September 25
to October 25 date window and Power Plant Mall venue, making it suitable as the
current pilot event.

## Not yet done

W5-7b does **not**:

- render these events on the public What’s On page;
- compute current/ongoing/ended status dynamically at runtime;
- deduplicate cross-source records;
- archive events automatically;
- generate event Search records;
- ingest Make It Makati or Ayala Malls at scale.

Those belong to later W5-7 steps.

## Guard

`check:event-registry` is wired into both `build` and `quality`.

## Next micro-step

**W5-7c — deduplication and lifecycle/current/archive selectors.**

Implement deterministic duplicate-candidate helpers and date-aware selectors so
the default current feed can never include an event whose source-backed window
has already ended.
