# W6-3f — Explore / Mobility / Heritage journey

Status: complete  
Scope: P1 place-discovery and city-use journey  
Depends on: W6-0c core journey matrix, W6-1 navigation ownership, Wave 5 place/area/mobility/heritage foundations

## Decision

**Explore Makati** at `/visit` is the canonical door for “find, understand, visit or travel through a place in Makati.”

The supporting surfaces remain distinct:

- **Explore Makati** — city orientation and durable place discovery;
- **Areas & Districts** — districts, estates, villages and responsible organizations;
- **BetterBarangay** — local civic/governance context;
- **Heritage & Culture** — heritage places, collections and walking routes;
- **History of Makati** — source-linked historical context;
- **Getting Around** — transport systems, stations, routes, transfers and live routing handoffs;
- **Civic Map** — canonical civic/public-place detail.

## Changes

### Canonical return path

Mobility and Heritage now expose an explicit **Explore Makati** return path near the top of the page, matching the existing pattern on Estates and History.

Mobility’s page-family label is also aligned from “Visit Makati” to **Explore Makati**.

### Natural next steps

- Mobility links from city movement back to **Areas & Districts** and Civic Map.
- Heritage links from place/history context to **Getting Around**, History and canonical Civic Map place records.
- Estates continues to connect areas to barangays, canonical places, organizations and Mobility.
- History continues to connect events to Heritage, Explore Makati and linked civic places.

### No new place directory

W6-3f does not turn BetterMakati into a generic restaurant/shop/events directory. Volatile commercial discovery remains with live external sources; BetterMakati owns durable civic and city context.

## Guardrails

W6-3f does not:

- revive Parking Finder as a standalone product;
- add synthetic route geometry or unverified places;
- merge Explore, Civic Map, Mobility, Heritage or History into one route;
- duplicate canonical place/area identities;
- perform Wave 7 visual redesign.

## Verification

`check:wave6-explore-journey` is registered in both `build` and `quality`.

The guard checks:

- `/visit` remains the canonical Explore door;
- Explore links to areas, barangays, heritage, history and mobility;
- Mobility, Heritage, Estates and History all return to Explore Makati;
- natural context handoffs to Civic Map, barangays and adjacent place layers remain intact;
- global navigation retains the Explore Makati family.

Browser coverage verifies the rendered canonical door and return paths.

## Closure condition

W6-3f is closed when the repository guard, build/quality pipeline and browser journey test are green on the final commit.
