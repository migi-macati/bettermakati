# W6-3g — Participation journey

Status: complete  
Scope: P1 “I have a local problem, suggestion, observation or participation need” journey  
Depends on: W6-0c core journey matrix, W6-1 navigation ownership, W6-3b homepage information architecture, W6-3d BetterBarangay journey

## Decision

**Participate** at `/participate` is the canonical door for “I want to take part, report, contribute or suggest something.”

The page distinguishes four outcomes before a person submits anything:

1. **Official government action** — an official Makati service, office, consultation or Action Center channel.
2. **BetterMakati public case** — a non-emergency Civic Map problem report that BetterMakati can track publicly; it is not automatically a City Government complaint.
3. **Civic observation / improvement evidence** — structured condition observations, audit participation and place-specific improvement proposals.
4. **BetterMakati contribution** — corrections, sources, ideas, volunteering and project contact through Get Involved.

Emergency or immediate danger remains outside the participation workflow and goes directly to **911**.

## Changes

### Participate explains the destination before the action

The top of `/participate` now separates:

- **Need government action?** with Makati Action Center and Saan Ako Lalapit? handoffs.
- **Contributing through BetterMakati?** with an explicit explanation of what BetterMakati records mean.
- **Emergency or immediate danger?** with a direct 911 action.

The task grid adds **Contact Makati government** and renames the Civic Map reporting task to **Report a local problem to BetterMakati**.

### Civic Map reporting is explicit

The Civic Map and nearby-report flow now state before submission that a report creates a **public BetterMakati case**.

A BetterMakati case becomes an official government referral only when separate referral evidence is recorded. The form retains its existing post-submission disclosure and likely-official-channel handoffs.

### Get Involved is scoped to the project

Get Involved now states near the top that its forms are for **BetterMakati contributions**, not automatic City Government submissions.

It links back to the canonical Participate chooser and to the Makati Action Center when the user actually needs government action.

### Stable official handoff

The existing Makati Action Center card on Hotlines now has a stable `#makati-action-center` anchor so participation flows can hand off internally without duplicating phone/contact data.

### Stale rating promise removed

The Community Tools description for Civic Map no longer says users can “rate public infrastructure.” It now describes structured public-place condition documentation, consistent with the retired generic-rating model.

## Guardrails

W6-3g does not:

- claim that BetterMakati automatically forwards cases to Makati City Government;
- present community confirmation as government acknowledgement;
- collect emergency reports through the normal civic-case flow;
- create a new complaint database or government CRM;
- redesign the participation visual system reserved for Wave 7;
- infer barangay scope for citywide official opportunities.

## Verification

`check:wave6-participation-journey` is registered in both `build` and `quality`.

The guard checks the homepage entry, canonical Participate door, official-government handoff, BetterMakati case disclosure, Get Involved scope, emergency escape, Action Center deep link and removal of the retired generic-rating promise.

Browser coverage verifies the rendered journey from Home through Participate, Get Involved, Civic Map reporting and the Makati Action Center contact target.

## Closure condition

W6-3g is closed when the repository guard, build/quality pipeline and browser journey test are green on the final commit.
