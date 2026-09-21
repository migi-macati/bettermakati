# BetterMakati Civic Map methodology

Reviewed: 2026-09-21

## Purpose

Civic Map is an independent BetterMakati community layer for observing and discussing Makati's public realm and public transport. It is not an official City Government of Makati, barangay, agency, estate or transport-operator reporting platform.

The system separates four contribution types:

1. **Assessment / review** — structured rating of a mapped civic asset or route.
2. **Issue report** — an observed defect, obstruction, unsafe condition or service problem.
3. **Improvement proposal** — a suggested physical or service change.
4. **Information update** — a correction to route, hours, location or mapped asset information.

## Asset model

Permanent objects can include:

- road/street segments;
- side-specific sidewalk segments;
- crossings and intersections;
- bike lanes;
- parks and plazas;
- public offices and community facilities;
- health centers and public markets;
- public toilets;
- drainage and flood-control assets;
- bridges and footbridges;
- heritage sites and monuments;
- jeepney/bus/public-transport routes;
- public-transport stops;
- terminals and tricycle/TODA locations.

Long streets are not treated as one object. They are segmented at meaningful boundaries such as intersections, bridges, changes in street character or jurisdiction. A report retains the permanent segment ID and coordinates. Sidewalk conditions may additionally identify the north, south, east or west side.

## Reviews

Reviews use a common core plus asset-specific criteria. The common core includes accessibility/inclusion, safety, cleanliness/maintenance and comfort.

Street/sidewalk criteria can additionally cover walking continuity, surface condition, crossings, shade/vegetation, drainage/flooding and lighting.

Park criteria can additionally cover shade, seating, vegetation, activities, toilets/basic amenities and attractiveness/identity.

Public facilities can additionally cover wayfinding, waiting/seating, toilets, ventilation/temperature and service information.

Public transport can additionally cover reliability, frequency/waiting, coverage/usefulness, boarding/alighting, route/fare information and accessibility.

BetterMakati should not display a headline score until enough independent ratings exist to avoid presenting one or two submissions as representative. Any displayed score should retain sample size and recency.

## Reports become cases

One observation does not have to equal one case.

Before a new report/proposal is created, Civic Map checks for a similar open record on the same asset/category and nearby location. The contributor is encouraged to confirm, update or support the existing case.

The underlying observations are preserved as comments/updates on the case.

Typical evidence states:

- Unverified community submission
- Community corroborated
- BetterMakati reviewed
- Forwarded by BetterMakati
- Authority acknowledged
- Action reported
- Community verified resolved

BetterMakati must never display a later evidence state unless the supporting event is actually recorded.

## Emergency routing

Civic Map must not operate as an emergency queue.

Fire, crime/violence in progress, medical emergencies, serious collisions, immediate electrical danger, possible structural collapse and flooding that places people in immediate danger are interrupted before ordinary submission and routed to Unified 911.

Where an official web/API integration does not exist, opening the official hotline or form is not the same as confirming that a report was received. BetterMakati should state the difference.

## Government forwarding

BetterMakati should reduce noise before forwarding information.

- Immediate emergency: use the official emergency channel directly.
- High-priority safety issue: eligible for rapid human review/referral after convincing evidence.
- Ordinary maintenance: consolidate duplicates; include mature cases in a daily/weekly batch where appropriate.
- Recurring/systemic issue: accumulate repeated evidence and include in the weekly/monthly analysis.
- Improvement proposal: consolidate support/concerns/alternatives and include mature proposals in a monthly planning brief rather than forwarding every individual idea.

A referral is a distinct record containing destination, date, method and any external reference number. "Forwarded" does not mean "acknowledged" or "approved."

## Public transport

Transport is represented at three levels:

1. route;
2. stop/terminal;
3. operator/association context where verified.

Trip-specific regulatory complaints may need private identifying information such as plate/body/driver details. BetterMakati should not encourage users to publish those identifiers in public comments. The public Civic Map record can document the route-level/service problem while the formal complaint is directed to the official regulator.

Route proposals may represent a proposed alignment, route extension/revision, new stop or relocated stop.

## Discussion

Reports, proposals and review threads can receive:

- confirmation;
- "appears resolved";
- support;
- concern/trade-off;
- update;
- reply.

Replies are intentionally shallow. The purpose is evidence and civic discussion, not an engagement-ranking social network.

Verified government, barangay, operator, association or facility-manager accounts can be added later. An "official response" label must only be used when the identity/source of the response is verified.

## False reporting and abuse

Signals can include rate limits, duplicate detection, account/email verification when introduced, optional proximity verification, supporting evidence, independent corroboration, history of confirmed reports and anomalous submission patterns.

BetterMakati should describe evidence quality of the **case**, not publicly score the trustworthiness of individual people.

Low-risk observations may be visible as unverified community records. High-risk allegations, personal accusations or sensitive content may require moderation before site display.

Contributors should describe observable conditions rather than assert illegality or criminality where BetterMakati cannot independently establish it.

## Privacy

The pilot does not require an account. Public submissions can use an alias or "Anonymous contributor."

Contributors are warned not to submit passwords, government IDs, medical data, private phone numbers, personal information about uninvolved people, or unnecessary names/identifiers of rank-and-file workers or transport personnel.

A future authenticated system should keep private identity/contact information separate from public contribution content and require separate consent before sharing contributor contact information with an outside authority.

## Moderation and referral lifecycle

BetterMakati now separates community evidence from official routing through a recorded lifecycle.

A report can enter the review/referral queue when it is marked high-priority or receives at least two independent confirmations. This threshold only creates a BetterMakati review signal; it does not automatically send anything to government.

Authorized BetterMakati moderators can record lifecycle events separately from citizen comments:

- BetterMakati reviewed
- Forwarded by BetterMakati
- Authority acknowledged
- Action reported
- Community verified resolved

Each recorded referral event can include the responsible body, channel used, an external reference number and a note. “Forwarded” must never be displayed as “acknowledged” unless a separate acknowledgement event is recorded.

The public `/civic-map/reports` page aggregates the same underlying cases into a weekly operational brief, a moderation/referral queue and a monthly public-realm summary. Ordinary government delivery remains human-reviewed during the pilot to avoid spam and false routing.

## Reporting products

### Weekly Civic Map digest

Operational report focused on:
- new consolidated cases;
- high-priority safety cases;
- corroborated cases;
- unresolved recurring cases;
- community-reported resolutions;
- referrals and acknowledgements;
- links to underlying public records.

### Monthly State of Makati Public Realm

Analytical report focused on:
- assessments and sample sizes;
- accessibility, safety, cleanliness, comfort and environment scores;
- street/sidewalk/park/facility/public-transport breakdowns;
- spatial clusters;
- recurring issue themes;
- mature improvement proposals;
- change over time.

The monthly report should explicitly say that community submissions are not necessarily representative of the whole population.

## Current pilot limitations

- Seed asset coverage is intentionally small.
- Public transport route objects are supported by the data model but should only be published after current route/stops are verified.
- GitHub issues/comments currently provide the transparent storage layer for public Civic Map records.
- No separate BetterMakati account system or email verification is required yet.
- Government forwarding is not automatic for ordinary cases in the pilot.
- No Civic Map record should be interpreted as an official Makati City case number unless an official system separately provides one.
