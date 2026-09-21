# BetterMakati

**BetterMakati** is an independent, open-source civic information and participation platform for Makati, Philippines.

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
- live weather, air-quality and advisory links;
- **City Monitor** for council, legislation, executive speeches, procurement, projects, publications, consultations and official notices;
- **Civic Briefs** for daily, weekly and monthly government-activity digests, with Facebook distribution planned; and
- community tools, corrections and contribution channels.

## Civic operating principles

BetterMakati uses a five-radical open-government doctrine:

- **Radical transparency — See the state:** every public fact should be discoverable, understandable, traceable and reusable; important source gaps stay visible.
- **Radical accountability — Follow the state:** track plans, responsibility, resources, later evidence and outcomes without political scoring.
- **Radical participation — Shape the state:** make participation discoverable and, where BetterMakati controls the workflow, publicly trackable with visible follow-through.
- **Radical presence — Reach the state:** bring useful current and local information forward without requiring an account or precise GPS.
- **Radical integrity — Trust the process:** expose public-interest rules, money, procurement, audit and documented relationships to factual scrutiny without insinuation or guilt by association.

The doctrine is supported by **inclusion, privacy, accessibility, evidence, open data, civic space, institutionalization and evaluation**. The site publishes a living self-audit against the doctrine and the OECD Recommendation on Open Government, plus a BetterMakati Status page that exposes our own coverage and measurement gaps.

The main products supporting these principles are the **Public Records index**, **Accountability Ledger**, **Participation Hub**, **Today in Makati / My Makati**, **Integrity & Public Interest**, **Open Government Doctrine**, and **BetterMakati Status**.

## Data and sourcing

BetterMakati prioritizes first-party records from the City Government of Makati, COMELEC, PSA, COA, DBM, PhilGEPS and other public institutions. Source links are placed beside the information they support.

Missing or uncertain information is not guessed. Political and election pages are factual and non-partisan.

A scheduled source-watch workflow checks selected official records every week and opens a reviewable pull request when watched sources change. Automated detection does not silently rewrite public figures or election facts.

## City Monitor

City Monitor uses a daily reviewable source-detection workflow. It hashes selected official Makati and PhilGEPS source channels and opens a pull request when a source changes or a check fails. A changed hash is only a review signal and is never automatically interpreted as a legislative action, procurement award, speech, project status or other substantive event.

Validated records use permanent `/city-monitor/:id` pages with source provenance. Speech records can distinguish official transcripts from BetterMakati automated or reviewed transcriptions. Forward-looking commitments can be linked into the Accountability Ledger.

Civic Briefs remain on the site as the permanent update archive. A BetterMakati Facebook Page is planned as the public distribution channel.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Corrections and contributions

Use the BetterMakati contribution form on the site for corrections, public sources, ideas and volunteer offers. When the native submission backend is unavailable, the form provides a pre-filled GitHub issue fallback.

## Current release

Comprehensive CX, technical, accessibility, SEO, civic-content and security hardening merged on September 19, 2026.

<!-- deployment-marker: 2026-09-20T00:09+08:00 -->

## Acknowledgment

Built from the Better Local Gov starter kit and the BetterGov / BetterLGU civic-tech ecosystem.
