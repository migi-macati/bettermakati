# W5-8c — News relevance, story clustering and civic relationships

Reviewed: 2026-09-28

## Status

Implemented at repository level. Deployment/CI verification remains subject to the
normal GitHub workflow.

## Goal

Turn Makati in the News from a terminal list of matching headlines into a
discovery layer that helps a reader understand:

- whether Makati is central to the story or merely mentioned in supporting text;
- whether several headlines are substantially the same current development;
- which existing BetterMakati records the story explicitly names.

The News layer still does not become a canonical owner of civic facts.

## Makati relevance model

Every story rendered by BetterMakati can now be described as one of three
classes.

### Directly about Makati

The headline itself names Makati.

### Directly about a Makati place or civic entity

The headline explicitly names a canonical BetterMakati entity, even when
“Makati” appears only in the supporting description.

### Makati appears in supporting context

The article was returned by the Makati discovery query and contains Makati in
its searchable text, but neither the city nor a recognized canonical entity is
explicitly named in the headline.

This is a relevance description, not an importance or credibility score.

The Today dashboard now admits only the first two classes and still applies the
W5-8b seven-day freshness rule.

## Conservative story clustering

The live feed now groups strongly similar headlines published within 96 hours.

Two reports cluster only when:

1. they have the same normalized headline identity; or
2. their informative headline tokens have substantial overlap, including at
   least three/four shared terms depending on headline length;
3. the shorter headline is at least 75% contained in the longer token set; and
4. Jaccard overlap is at least 50%.

Common location words such as Makati, City, Metro Manila and Philippines are
excluded from the clustering tokens.

The newest item remains the cluster lead. Other publisher links are preserved
as **Other coverage** rather than discarded.

This intentionally avoids broad semantic or AI-generated clustering that could
merge different developments.

## Canonical entity relationships

Story/entity links are derived at render time from the canonical registries.
The relationship layer does not copy or take ownership of the underlying
entity.

Current targets are:

- Barangays;
- Areas / estates / districts;
- durable Places in the Place Registry;
- Mobility systems;
- Accountability records when an exact procurement reference is present;
- Legislation records when an exact official measure reference is present;
- City Monitor records when the article URL is the exact source URL or an exact
  reference number is present.

### Barangay matching

The safest forms are explicit “Barangay X” / “Brgy X” mentions.

Bare barangay-name matching is limited to distinctive headline cases rather
than treating every occurrence of a generic proper noun as a barangay.

### Place matching

Only durable place classes are eligible:

- parks;
- public offices;
- health centers;
- community centers;
- public markets;
- heritage sites;
- transport stops and terminals.

Street/sidewalk/drainage/bridge/route records are not inferred from ordinary
headline text.

### Accountability and legislation

These domains require an explicit reference number.

A generic story about “a city project” or “an ordinance” does not create a
canonical relationship.

### City Monitor

A relationship is allowed only through the exact article/source URL or an exact
record reference number.

Publisher-homepage equality is deliberately not used because it would create
false links among unrelated stories from the same publisher.

## Public presentation

Makati in the News now shows:

- publisher;
- publisher/source class;
- Makati relevance label;
- publication time;
- explicit Related in BetterMakati links;
- story-cluster count;
- preserved alternate publisher coverage.

The related links are navigational context, not evidence that every statement
in the news article has been verified by the linked canonical record.

## Promotion boundary

W5-8c does not automatically:

- create or update City Monitor records;
- create project or procurement statuses;
- create legislation lifecycle events;
- create election facts or civic dates;
- change mobility lifecycle/status;
- create a Place, Area or Barangay;
- publish a BetterMakati Report or Insight.

Those actions remain subject to the evidence and review rules of their owning
domain.

## Next

### W5-8d — topic routing and review queue

Use transparent topic signals to route potentially consequential stories into
an internal review queue for the appropriate canonical owner, with explicit
deduplication against existing City Monitor, Accountability, Legislation,
Mobility, Elections and other records.

The queue should support review; it must not auto-promote news claims.
