# BetterMakati

**BetterMakati** is an independent, open-source civic information portal for Makati City, Philippines.

It is part of the BetterLGU community and is **not** an official website of the City Government of Makati.

## What the site covers

BetterMakati organizes public information into citizen-facing tools and dashboards, including:

- city services, hotlines and practical government contacts;
- the 23 current Makati barangays and individual barangay profile pages;
- current elected-official profiles and city-government information;
- neutral elections and voting information based on COMELEC records;
- budgets, projects, procurement and audit disclosures translated into dashboards;
- population, economic and historical trend data with city comparisons;
- a sourced, searchable Makati history timeline;
- visitor information, mobility, cinemas, parking, events, estates and community associations;
- live weather, air-quality and advisory links; and
- community tools, corrections and contribution channels.

## Data and sourcing

BetterMakati prioritizes first-party records from the City Government of Makati, COMELEC, PSA, COA, DBM, PhilGEPS and other public institutions. Source links are placed beside the information they support.

Missing or uncertain information is not guessed. Political and election pages are factual and non-partisan.

A scheduled source-watch workflow checks selected official records every week and opens a reviewable pull request when watched sources change. Automated detection does not silently rewrite public figures or election facts.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Corrections

Open an issue at:

https://github.com/migi-macati/bettermakati/issues

## Acknowledgment

Built from the Better Local Gov starter kit and the BetterGov / BetterLGU civic-tech ecosystem.
