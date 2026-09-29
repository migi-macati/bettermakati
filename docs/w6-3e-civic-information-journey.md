# W6-3e — Civic-information journey

Status: complete  
Scope: P1 “what is happening now, soon or recently?” journey  
Depends on: W6-0c core journey matrix, W6-1 navigation ownership, W6-3a/3b homepage priorities

## Decision

**Today in Makati** is the canonical synthesis door for current civic information.

A user should be able to start at Today without first choosing among Calendar, City Monitor, Civic Briefs, News or Live Makati. Those surfaces remain distinct because they answer different follow-up needs.

## Changes

### Today leads with civic information

Today now places the source-backed Civic Timeline preview immediately after the page introduction.

This gives deadlines, meetings, service changes, participation opportunities and recent civic publications priority over system-monitoring information.

### Internal diagnostics moved out of the citizen synthesis

Today no longer foregrounds monitored-source reachability, source-change signal or failed-check counts.

Those remain available in City Monitor and Live Makati, where source health is part of the page’s actual job.

### Specialist roles remain distinct

After the civic timeline, Today routes people to:

- **Live Makati** for current conditions, advisories and authoritative source links;
- **City Monitor** for granular validated official activity;
- **Civic Briefs** for daily, weekly and monthly editorial summaries;
- **Makati in the News** for external/current coverage;
- **Makati Calendar** for the complete source-backed civic timeline;
- **Hotlines** for urgent and city contacts.

### Return path to the synthesis door

City Monitor, Civic Briefs, News, Calendar and Live Makati all expose a direct **Today in Makati** route.

This keeps the supporting surfaces from becoming competing front doors or dead-end product silos.

## Guardrails

W6-3e does not merge the supporting pages, revive generic entertainment-event discovery, expose unresolved monitor signals as civic facts, remove source-health diagnostics from their specialist pages, perform Wave 7 visual redesign or manufacture current records.

## Verification

`check:wave6-civic-information-journey` is registered in both `build` and `quality`.

The guard checks Today ownership, rendered source order, removal of internal diagnostics from Today, return links from all specialist current-information pages and package registration.

Browser coverage additionally checks the rendered section order and the canonical handoffs.

## Closure condition

W6-3e is closed when the repository guard, build/quality pipeline and browser journey test are green on the final commit.
