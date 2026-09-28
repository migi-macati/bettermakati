# W5-7 Reframe — Makati Civic Calendar & Timeline

Reviewed: 2026-09-28

## Decision

W5-7 is no longer an entertainment/events feature.

The target product is a **cross-domain civic time layer** over BetterMakati:

> **One place to see what is coming up, what just happened, what was newly
> published, and what changed across Makati civic life.**

The product should reduce the need to monitor fragmented official pages,
barangay pages, PDFs, social posts, legislation records, procurement notices,
service notices, reports and statistics separately.

Generic concerts, mall promotions, restaurant openings and entertainment events
are out of scope unless they have a direct civic/service/public-information
reason to appear.

## Why this belongs in BetterMakati

BetterMakati already owns the durable canonical records:

- services;
- barangays;
- places and infrastructure;
- areas and districts;
- legislation;
- projects and procurement;
- accountability records;
- elections;
- statistics;
- reports;
- City Monitor records;
- public records.

The new feature should **not create parallel canonical objects** for all of
these.

Instead, it creates a thin **temporal projection** over records already owned by
their correct domain.

Examples:

- an ordinance stays an ordinance;
- a council session stays a City Monitor / legislation record;
- a voter deadline stays an Elections record;
- a barangay assembly stays a barangay/participation record;
- a road closure stays a mobility/advisory record;
- a newly published population table stays a Statistics record;
- a new BetterMakati report stays a Report;
- a procurement submission deadline stays a procurement/accountability record.

The civic calendar simply gives each relevant occurrence a common date/time,
scope, action state and canonical destination.

## Working product name

Use **Makati Calendar** as the plain-language public label during implementation.

Subtitle:

> **What’s coming up, what changed, and what was just published.**

Internally, call the model the **Civic Timeline** because it must support both
future deadlines and historical logs.

Do not preserve “What’s On” as the primary concept.

## Core views

### 1. Now & Next

Default view.

Answers:
- what is happening today;
- what is due soon;
- what will affect me in the next days/weeks;
- what changed or was cancelled/postponed.

Priority order:
1. active disruptions / closures / advisories;
2. deadlines and time-sensitive citizen actions;
3. public meetings / hearings / assemblies;
4. election milestones;
5. procurement and project milestones;
6. scheduled publication/release milestones.

### 2. Recently Published

A reverse-chronological log of newly available civic information.

Examples:
- new ordinance/resolution;
- new council-session record/transcript;
- new budget/procurement document;
- new report or insight;
- new statistics/data release;
- new audit/public record;
- new service rule or requirement;
- new barangay notice that has persistent civic value.

This is a publication/change log, not merely a future calendar.

### 3. Archive

Permanent searchable log.

Purpose:
- historical traceability;
- “when did this first appear/change?”;
- research;
- auditability;
- barangay and topic history.

Archive entries must still resolve to the canonical BetterMakati record and
original source when available.

## Timeline projection model

Create a new cross-domain projection, not a generic Event registry.

Conceptual type:

`CivicTimelineItem`

Required:
- `id`;
- `kind`;
- `title`;
- `summary`;
- `occurredAt / startsAt / dueAt / publishedAt` as applicable;
- `status`;
- `canonicalRef` — domain + record ID;
- `canonicalHref`;
- `sourceIds`;
- `geographicScope`;
- `topicTags`;
- `actionability`;
- `lastVerifiedAt`.

Optional:
- `endsAt`;
- `placeIds`;
- `areaIds`;
- `barangaySlugs`;
- `serviceIds`;
- `legislationIds`;
- `projectIds`;
- `reportSlugs`;
- `supersedesTimelineItemId`;
- `changeType`;
- `externalActionHref`.

The timeline projection must never become the owner of domain facts.

## Taxonomy

Initial `kind` values:

- `deadline`
- `meeting`
- `public-hearing`
- `barangay-assembly`
- `consultation`
- `service-change`
- `road-closure`
- `advisory`
- `election-milestone`
- `legislation-milestone`
- `procurement-milestone`
- `project-milestone`
- `publication`
- `statistics-release`
- `report-release`
- `audit-release`
- `record-update`

Avoid an open-ended generic `event` kind in the first implementation.

## Actionability

Each item should answer what a citizen can do.

Values:
- `action-required`;
- `participation-opportunity`;
- `service-impact`;
- `information-only`.

Examples:
- voter-registration deadline → action-required;
- public hearing → participation-opportunity;
- road closure → service-impact;
- new statistical report → information-only.

This enables useful prioritization without editorially rating political actors or
policy choices.

## Geographic projection

Every timeline item may be:
- citywide;
- one or more barangays;
- one or more Areas;
- one or more canonical Places;
- a bounded road/route/segment when available.

This unlocks:
- Makati-wide calendar;
- Barangay-specific “Now & Next”;
- Area/estate activity;
- Place/asset activity;
- map-aware road/advisory context.

A geographic relationship must be source-backed or derived from an existing
canonical relationship. Do not infer affected geography from vague prose.

## Internal BetterMakati integrations

### Today in Makati

Today becomes the highest-value consumer.

Add:
- **Today** timeline items;
- next 7 days;
- urgent/action-required items;
- personalized barangay slice.

Today should not own the records. It renders the Civic Timeline projection.

### City Monitor

City Monitor becomes a principal discovery pipeline.

Current City Monitor already watches streams including legislation, council
sessions, events/consultations, news/notices, procurement and publications.

Extend it from “source changed” to:
1. detect source changes;
2. extract candidate dated civic occurrences/publications;
3. place them in a review queue;
4. promote validated candidates into canonical domain records;
5. emit Civic Timeline projections.

No source-change signal should automatically become a public timeline item.

### Civic Briefs

Briefs gain temporal summaries:
- what happened yesterday;
- what is due this week;
- what changed;
- newly published records.

Daily/weekly/monthly brief generation should query the same timeline model, so
Briefs and Calendar cannot contradict each other.

### Barangays

Each BetterBarangay page gets a compact:
- Now & Next;
- Recently published;
- Local archive link.

This is especially useful for:
- barangay assemblies;
- local service schedules;
- localized advisories;
- barangay-specific public notices;
- projects affecting that barangay.

### Legislation

Project lifecycle milestones:
- filed/published;
- committee/public hearing;
- council action;
- approval/veto where sourced;
- effectivity date.

Do not duplicate legislation content. Timeline entries deep-link to the
canonical legislation record.

### Elections

Project:
- registration deadlines;
- precinct/service deadlines;
- campaign/election statutory dates;
- election day;
- canvass/result publication milestones.

National election dates remain externally sourced; BetterMakati projects only
the dates relevant to Makati users and links to the Elections page.

### Mobility / Civic Map

Project:
- road closures;
- route/service changes;
- construction disruptions;
- reopening/restoration dates.

Where a canonical segment/route/place exists, show it.

A future map view may highlight active timeline items but the calendar should
not require map geometry to publish a valid citywide notice.

### Services

Project:
- application deadlines;
- renewal windows;
- temporary service interruptions;
- policy/requirement changes;
- opening of registrations/benefits.

A service guide can show “Next important date” sourced from the timeline.

### Projects / Procurement / Accountability

Project:
- pre-bid conference;
- bid submission deadline;
- award publication;
- notice to proceed;
- implementation target;
- completion/inspection milestone;
- audit/publication milestones.

The timeline projection must use existing procurement/project IDs wherever
possible.

### Reports / Statistics / Public Records

Project newly published content automatically:
- BetterMakati report publication;
- new official data release incorporated into Statistics;
- newly catalogued public record;
- audit report publication;
- updated dataset incorporated into a canonical page.

This gives the calendar value even on days with no meetings or deadlines.

### Search

Search should index:
- current timeline items;
- archive items;
- date phrases;
- barangays/areas;
- canonical target names.

Search results must still link to the canonical owner record, with the timeline
date/context shown as metadata.

## External user-facing features

### Subscribe to a filtered calendar

High-value later feature.

Provide an ICS/webcal feed for:
- all Makati civic deadlines;
- one barangay;
- selected topics;
- action-required only.

Calendar clients can then carry upcoming civic dates outside BetterMakati.

Avoid exporting publication-log items to ICS unless they have a meaningful
action/date.

### RSS / Atom / JSON Feed

Provide a machine-readable “recently changed/published” feed.

Useful for:
- citizens;
- journalists;
- researchers;
- civic groups;
- other websites;
- bots/agents.

Prefer stable IDs and canonical URLs.

### Shareable filtered URLs

Every filter state should be URL-addressable.

Examples:
- `/calendar?barangay=poblacion`
- `/calendar?topic=legislation`
- `/calendar?view=published`
- `/calendar?action=required`

This also improves search-engine and external-link usefulness.

### Add-to-calendar

For actionable/deadline items, expose:
- Add to Google Calendar;
- downloadable ICS item;
- copy date/details.

Do not add this to passive publication records.

### Daily/weekly digest handoff

Later, allow opt-in email/push/chat delivery from the same filtered timeline.

The feed/model comes first. Delivery channels are replaceable.

### Public API / data export

Expose a documented read-only JSON endpoint with:
- stable timeline IDs;
- canonical target references;
- source URLs;
- date fields;
- geographic scope;
- update/cancellation state.

Also allow CSV download for archive/research use.

Do not create an API before the schema stabilizes.

## BetterGov ecosystem opportunities

BetterGov currently positions itself as a centralized service/discovery and
public-data platform and operates related projects including BetterLGU, Batas
Watch, Statistics Explorer, Open Congress API, budget/procurement/transparency
tools and other civic-data projects.

### 1. Reusable BetterLGU Civic Time schema

Package the stable projection schema as a reusable specification:

`betterlgu-civic-time-v1`

Minimal interoperable fields:
- LGU identifier;
- timezone;
- stable item ID;
- kind;
- title;
- canonical URL;
- original source URL;
- start/due/published date;
- status;
- geographic scope;
- topic;
- actionability;
- last verified.

Contribute:
- JSON Schema;
- example data;
- validator;
- starter React component;
- documentation.

This fits BetterLGU’s existing template-driven model rather than requiring a
new central platform immediately.

### 2. Federated BetterLGU calendar feed

Later, participating portals could publish:

`/.well-known/betterlgu/civic-time.json`

The BetterLGU directory could optionally discover these feeds.

Potential uses:
- cross-LGU deadlines/calendar discovery;
- “what changed across participating LGUs”;
- maintenance/freshness signals;
- reusable research datasets.

Federation must remain opt-in and source-preserving.

### 3. BetterGov national-to-local handoff

Do not duplicate national records in every LGU portal.

Instead:
- BetterGov owns national service/deadline datasets;
- BetterMakati projects a national item only when it has a clear Makati user
  relevance;
- the local projection links back to the BetterGov/national canonical record
  when one exists.

Potential future upstream sources:
- national election milestones;
- national service deadlines;
- nationally published statistics relevant to Makati;
- national legislation milestones with direct local-service relevance;
- procurement records identifiable as Makati projects.

### 4. Batas Watch / Open Congress API

When a national bill/law has an explicitly sourced relationship to a Makati
service or local responsibility, BetterMakati can link to the national canonical
record rather than reproducing congressional lifecycle data.

Do not turn Makati Calendar into a national bill feed.

### 5. Statistics Explorer

When a new PSA dataset is discovered and incorporated into BetterMakati’s
Statistics page:
- the national data source remains upstream;
- the incorporation creates one local `statistics-release` or
  `record-update` timeline item;
- users can continue to the BetterGov Statistics Explorer for broader national
  exploration where appropriate.

### 6. Procurement / transparency tools

Where BetterGov exposes a stable exact procurement record or filter:
- BetterMakati may use it as a discovery/handoff source;
- exact Makati procurement milestones project into the local timeline;
- canonical local project/accountability relationships remain in BetterMakati.

No approximate procurement matching should be promoted as a verified local
relationship.

### 7. Upstream contribution

Once Makati’s implementation proves useful, upstream:
- schema;
- validator/checker;
- date/lifecycle helpers;
- filter/query conventions;
- ICS/JSON-feed generator;
- generic timeline UI.

Do not upstream Makati-specific categories, copy or source adapters.

## Further adjacent features

### “Since your last visit”

Store the last-viewed timestamp locally and show:
- new timeline items since then;
- updated/cancelled items;
- newly published reports/records.

No account is required.

This provides a strong repeat-visit reason.

### Change history / revisions

When a deadline, venue, closure or schedule changes:
- preserve the old value;
- record the update date;
- show “Updated”;
- keep source evidence.

Never silently overwrite a civic deadline.

### Missing-source transparency

A calendar is only as good as coverage.

Expose:
- monitored source count;
- last successful check;
- sources requiring manual review;
- known coverage gaps.

This can reuse City Monitor/freshness infrastructure.

### Calendar coverage dashboard

Internal/public status:
- timeline items by domain;
- % with canonical relation;
- % with first-party/official source;
- expired items still visible = 0 target;
- average verification age;
- source failure count.

This gives maintainers an objective reason to expand or cut the feature.

### Personal scope without accounts

Allow local preferences:
- barangay;
- topics;
- action-required only.

Persist in local storage, similar to Today’s existing barangay preference.

### “Why am I seeing this?”

Each item can show:
- source;
- scope;
- reason it applies to selected barangay/topic;
- canonical owner.

This is especially important when the timeline is personalized.

## What not to build

Do not build:
- entertainment listings;
- restaurant/mall promotion feeds;
- a general event-ticket marketplace;
- a parallel legislation/procurement/news database;
- social-network comments;
- fuzzy automated deduplication that silently merges records;
- mandatory user accounts;
- notifications before the feed itself is trustworthy;
- a universal national calendar inside BetterMakati.

## Migration from W5-7a–c event work

The current event work is a prototype and should be dismantled/reused selectively.

Remove:
- generic event taxonomy as the future canonical model;
- entertainment-oriented pilot records;
- the assumption that `/whats-on` is an events page.

Reuse:
- Manila-time date handling;
- source provenance patterns;
- current/archive separation;
- cancellation/postponement semantics;
- conservative duplicate-candidate ideas.

Rename/refactor those helpers only after the Civic Timeline schema is in place.

## Revised W5-7 execution plan

### W5-7R1 — Freeze and map temporal owners

Inventory every existing BetterMakati domain that already has meaningful dates:
- City Monitor;
- Legislation;
- Elections;
- Services;
- Projects/Procurement/Accountability;
- Reports;
- Statistics;
- Public Records;
- Barangays;
- Mobility/advisories.

Output:
- ownership matrix;
- candidate timeline fields;
- do-not-duplicate rules;
- current source coverage.

No public UI changes.

### W5-7R2 — Civic Timeline schema

Create:
- `civicTimeline.ts`;
- timeline item/reference types;
- source/provenance model;
- geography and actionability model;
- validator;
- projection helpers.

Delete or quarantine the generic event registry after equivalent reusable date
logic has migrated.

### W5-7R3 — Native projections first

Generate timeline items only from existing canonical BetterMakati data:
- legislation milestones;
- City Monitor records;
- Reports;
- Statistics/publication changes;
- procurement/project milestones already modeled;
- election milestones already modeled.

Goal:
prove usefulness without adding new scraping.

### W5-7R4 — Source-discovered civic dates

Extend monitored sources to candidate extraction for:
- public hearings/consultations;
- barangay assemblies;
- road/service advisories;
- official deadlines;
- other dated civic notices.

Use a review queue before publication.

### W5-7R5 — Makati Calendar UI

Replace `/whats-on` with `/calendar`.

Keep a compatibility redirect from `/whats-on`.

Views:
- Now & Next;
- Recently Published;
- Archive.

Filters:
- barangay;
- topic;
- actionability;
- date range.

Responsive, URL-addressable and source-forward.

### W5-7R6 — Internal distribution

Project timeline items into:
- Today;
- BetterBarangay;
- Legislation;
- Elections;
- Services;
- Projects/Accountability;
- Reports/Statistics;
- Mobility/Civic Map;
- Search.

Avoid showing the same card everywhere; each surface gets a compact
context-appropriate projection.

### W5-7R7 — External feeds

After the schema/UI is stable:
- filtered ICS/webcal;
- RSS/Atom or JSON Feed;
- CSV/JSON archive export;
- individual Add-to-calendar;
- stable share URLs.

### W5-7R8 — BetterGov / BetterLGU upstream package

Draft:
- `betterlgu-civic-time-v1` JSON Schema;
- example feed;
- validator;
- reusable React renderer;
- feed-discovery convention;
- upstream contribution proposal.

Do not federate until at least one other BetterLGU can consume the spec.

### W5-7R9 — QA and value gate

Measure:
- number of valid current/upcoming items;
- number of publication/change-log items;
- source coverage;
- canonical-link coverage;
- stale/expired leakage;
- manual-review burden;
- clicks into canonical civic pages;
- feed subscriptions/exports when available.

Closure decision:
- keep/expand if it materially improves civic discovery;
- reduce scope if maintenance burden exceeds use;
- never fill it with generic entertainment to increase volume.

## Immediate next step

Proceed with **W5-7R1 — temporal ownership/source matrix**.

This should explicitly map the existing data structures and date fields before
we write the replacement schema. It should also identify which City Monitor
source streams can produce timeline candidates and which domains already have
canonical lifecycle dates.
