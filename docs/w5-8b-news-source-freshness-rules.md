# W5-8b — News source and freshness rules

Reviewed: 2026-09-28

## Status

Implemented at policy-contract level.

W5-8b defines how BetterMakati treats a current headline before later work adds
topic classification, entity relationships or cross-domain review workflows.

## Source roles

### Aggregator

**Google News RSS** remains the broad discovery mechanism.

Its role is discovery only. Google News ranking, inclusion or article metadata
does not make a story canonical BetterMakati evidence.

### First-party city discovery

**Makati News** remains the first-party City Government discovery surface.

A city news release may be primary evidence for what the City Government says
or announces. It is not automatically the canonical record for a legislative,
procurement, election, mobility, service or project-status claim when that
domain has a more specific official record.

### Publisher classes

Every live feed item now receives one of these classes:

- `government-primary` — official government publisher;
- `government-information` — government information/news service such as PIA
  or PNA;
- `news-media` — identified news publisher;
- `institutional-or-other` — a non-government publisher that is not classified
  as a news outlet by the current registry;
- `unknown` — publisher identity cannot yet be classified.

The class describes the publisher type. It is **not a credibility score** and
does not decide whether a claim is true.

## Freshness rules

The current policy uses these age windows:

- **Today eligibility:** 7 days;
- **Current:** 14 days;
- **Recent:** 30 days;
- **General news feed maximum:** 45 days.

An item older than 45 days is excluded from the live current-news feed.

An undated item may remain in the general discovery feed because an invalid
publisher date should not silently erase a potentially useful result, but it is
never eligible for Today.

Today should use only `todayEligible` items rather than simply taking the first
three RSS results.

## Retrieval provenance

Every parsed live item now carries:

- `retrievedAt`;
- normalized publication age;
- freshness class;
- publisher class and human-readable label;
- a conservative `clusterKey`;
- internal domain-review candidate metadata.

The API also returns the policy version and live source-health metadata.

## Duplicate and syndication rule

W5-8b uses conservative duplicate handling.

1. Exact duplicate links collapse.
2. Google News' trailing publisher suffix is removed from the displayed title
   when it matches the source field.
3. Exact normalized story keys collapse.

This catches identical/syndicated headline copies without pretending that
different reporting on the same development is necessarily the same story.

Broader semantic story clustering belongs to a later W5-8 step.

## Domain-review candidate threshold

A headline may become an **internal review candidate** only when all of these
conditions are met:

1. Makati is named directly in the headline;
2. the item is no older than the current/recent window;
3. the title or description contains a strong civic-change signal such as a
   legislative action, procurement result, formal deadline, service
   suspension/change, road/route closure, public hearing, election action or
   similarly concrete government/civic change.

Government-primary publication is recorded as an additional reason when
applicable, but it is not required.

A review candidate is **not** a promoted City Monitor, Accountability,
Legislation, Election, Mobility, Service, Calendar or other canonical record.

The destination domain must still verify the claim against its own evidence
standard.

## Source-health rule

The live Google News endpoint reports:

- source id;
- status;
- check timestamp;
- returned-item count.

A valid fetch that returns zero relevant items is healthy.

HTTP failure, invalid RSS processing or another fetch exception is a source
failure. The public News page retains its static fallback instead of treating a
failed live check as evidence that no news exists.

## Product copy correction

Search should refer to the destination as **“Makati in the News”**, not “News &
events.”

The description should make clear that the page contains current Makati
coverage and official-source handoffs. Civic dates and event-like public
milestones remain owned by the Makati Calendar.

## W5-8b boundary

This step does not yet:

- assign broad civic topics to every article;
- create story/entity relationships;
- create a public “important news” ranking;
- automatically promote a headline into a canonical domain;
- create a media archive.

## Next

### W5-8c — relevance, clustering and entity relationships

Add a transparent Makati-relevance model, stronger but conservative story
clustering, and links from stories to existing Barangays, Places, Areas,
mobility systems and civic records where the evidence is explicit.
