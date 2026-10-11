# Citizen-help service benchmarking: one problem, correct remedy
*Research packet:* CIVIC-PROBLEM-20261011-BENCH  
*Review date:* 2026-10-11 (Asia/Manila)  
*Companion packets:* `docs/citizen-problem-research-2026-10-11.md` and `docs/citizen-first-help-experience-2026-10-11.md` on the separate open PR #117 as of this research.  
*Status:* desk-based comparative research and recommended implementation design. **No end-to-end app usability study, production feature launch, or independent performance audit was conducted.**

## Executive decision
**One citizen comes with one problem.** Put an accessible free-text **“How can we help?”** entry point in the existing `/community-tools/saan-ako-lalapit` and on the homepage, with contextual search, clear urgent-safety branching, a sourced immediate next action and only the essential follow-up. Keep service information and the Civic Map but invoke them behind that entry point as appropriate; do **not** place a 248-option catalogue in front of a citizen.

**Problem solver = front door, problem diagnosis, citizen guidance and referral. Civic Map = optional place-specific evidence, public-realm visibility and non-emergency reporting subsystem.** A mapped public asset is *not* required to recognize a problem. Allow **location-only** incidents and an unmapped street/intersection, separate location geometry from registry asset identity, and do not collect location at all when it is unnecessary or sensitive.

## Benchmarks: functionality and transferability

| Model | Verified primary-source pattern | What BetterMakati should borrow | What it should not import |
|---|---|---|---|
| Singapore OneService App / Chatbot | A city/Town-Council municipal case system; app asks users to choose category/subcategory, attach up to three photos and provide issue details; illegal-parking category requires fresh in-app photo within 15 minutes. Chatbot requires photo, location, occurrence and contact data. | Back-office agency routing, explicit status, location context **after deciding a report is needed**, help across multiple responsible bodies. | Photos and categories as prerequisites to **advice**; treating all neighborhood problems as photo-worthy; claiming the app is free-text-first. |
| FixMyStreet / mySociety | User picks location and issue category; it uses MapIt spatial administrative boundaries to choose the appropriate bodies, sends by email/Open311 depending configuration; publicly visible reports can be updated and followed. | Location/jurisdiction matching, duplicate report recognition, canonical street/route/asset IDs, optional public infrastructure view. | Mapping all personal matters, publicizing sensitive allegations, assuming all bodies accept forwarded reports. |
| NYC311 | Homepage “HOW CAN WE HELP YOU?” with free-text entry; multiple service/request types; official service requests forwarded to the agency and given tracking numbers; status lookup, text/email updates and separate emergency guidance; user satisfaction survey after closure. | One problem prompt, reliable distinctions **information vs official case vs closed case**, genuine request IDs and citizen resolution feedback, help beyond roads. | Claiming service requests are government-accepted without agency integrations; treating official closed as independently solved. |
| Boston311 | Non-emergency help across phone, app and web; issue reporting, status and trash/information support; 24/7 contact center. | Mobile, low-bandwidth and human telephone fallback; don't force app installation. | Implying BetterMakati can operate a staffed 24/7 call center. |
| Quezon City QC iReport | Official portal accepts descriptions, locations and photos for listed non-emergency issues; referrals to city offices and, when necessary, national agencies/operators; guest option (with email OTP), private identity, tracking; emergency uses Helpline 122. Official statement 21 Sep 2026 reports **4,580/5,589 = ~82%** cases resolved as of **31 Aug 2026**, **99% response rate**, neither independently audited here. FAQ says a 72-hour *action/update* expectation, not guaranteed infrastructure fix; available issue types are limited. | Philippine-specific intake, guest workflows, agency ownership, clear case update semantics and operator/national escalation; separate emergency channel. | Copying QC's 72-hour commitment into Makati, treating city-reported closed percentages as citizen-confirmed outcomes, forcing listed issue types as the help-navigation boundary. |
| Pasig Ugnayan sa Pasig | City's broad helpdesk for complaints, requests, suggestions and information through email, phone and social media; mayor reporting/office follow-through described in Citizen's Charter. | Multi-channel escalation and real human support when digital flows fail. | Equating general feedback channels with verified tracking integrations. |
| UK Citizens Advice | Independent impartial and confidential advice across housing, work, benefits, debt, consumer matters etc., online, phone and face-to-face. | Broad problem-solving and cross-agency rights knowledge beyond the LGU; confidential private consultations by referral; advice-first behavior. | Presenting BetterMakati as a legal practitioner or clinical counsellor; claiming human casework capacity without trained staff. |
| Snap Send Solve (Australia/NZ) | Residents describe/photograph issues; product says it forwards reports to identified “Solvers”, including responsible bodies. | City + private utility / network / estate/operator routing for physical issues. | Requiring a photo when no visual evidence exists; suggesting the company can itself guarantee the authority repairs the problem. |
| GOV.UK Service Standard | Learn actual user needs across the full journey, continuously test assumptions, ensure offline and digital channels fit together, and design to accessibility requirements. | Research real citizen queries, accessibility, assisted navigation, iterative improvements and end-to-end completion measures. | “Design complete” claims based solely on having enumerated a certain number of problem examples. |

## Scored judgment? No unsupported numerical leaderboard
Sources establish *claimed product capabilities*, not a reproducible lab test of accuracy, speed, privacy or resolution. Avoid a cross-website numerical “best site” score without scripted user tasks and repeatable observations. For implementation, assess BetterMakati against the following **10 weighted acceptance dimensions** (weights are a proposed product evaluation rubric, not externally measured benchmark scores):

| Dimension | Weight | Observable test |
|---|---:|---|
| Task discovery and intent matching | 15 | Resident describes one situation in natural ENG/FIL/Taglish; system returns fitting response or honest clarification |
| Correct immediate advice and safety | 15 | Emergency and threat cases routed appropriately; non-emergency cases avoid confrontation, doxxing and over-claiming |
| Legal, agency and jurisdiction accuracy | 15 | Current primary-source reference; street vs city/MMDA/DPWH/estate/utility ownership resolved without guessing |
| Actionability of resulting guide | 12 | What to do now, who to contact, what to keep, official working link, next escalation |
| Low-effort and inclusive user journey | 10 | Advice before identity, GPS, photo, category or account; screen readers, small phones, low bandwidth |
| Real referral status and truthful tracking | 10 | User can distinguish drafted, submitted to BetterMakati, delivered to agency, agency acknowledged and agency acted |
| Privacy, fairness and safeguarding | 8 | Sensitive cases private; no public minor/victim identity, non-stigmatizing response to poverty, rate limits |
| Recovery and multi-channel handoff | 6 | No-match fallback; official phone/email/in-person options and sensible failed-integration experience |
| Maintainability and verifiability | 5 | Reuse canonical services, barangays, contacts, law/source timestamps, asset and case records |
| Feedback and actual outcome learning | 4 | Resident can say 'still not solved'; closed vs verified fixed tracked separately; missing intent log privacy-safe |
| **Total** | **100** | **No current numerical BetterMakati score assigned without tests** |

## Architectural recommendation: a single front door and two branches

```text
Citizen: "Our street is full of illegally parked cars"
  |
  v
ONE "How can we help?" input / contextual search
  |
  +-- immediate danger? -> emergency guidance (911 / local official channel)
  |
  +-- relevant verified solution guide
       - clear safe immediate action
       - current authority and official link
       - precise law/ordinance where relevant
       - if unclear, one material follow-up (street, urgency, public/private)
       |
       +-- information or rights case -> official service / private advice / regulator
       |
       +-- place-specific non-emergency public-realm case
                -> Civic Map optional locator or free-text location
                -> optionally identify an existing canonical asset
                -> draft report / verified agency channel
                -> report-status view only after REAL persistence
```

**Civic Map remains valuable** for inspection, maintenance conditions, recurring trends, place ratings, open data and visually geolocated reports. But it should not be the universal first step; residents must not be asked to find an existing asset record before knowing what to do. Do not build duplicate 'concern finders' or distinct case stores; link canonical location, asset, service and case identifiers in one shared schema, with optional relationships.

### Compare original three citizen questions
1. **“My neighbor sings loudly every midnight.”** Start with verified Makati noise guidance, safety and mediation suitability; branch on residential versus establishment if material. No pin needed for guidance; no public map of private parties.
2. **“Cars block the street/sidewalk.”** Show safe steps, ask for exact street/landmark only to determine city vs MMDA vs DPWH vs estate control; optional map and case evidence. Existing place-registry ID remains optional.
3. **“People aggressively demand money at this intersection.”** Triage actual intimidation/emergency via police, while offering separate rights-respecting welfare outreach to DSWD Pag-abot/Makati social welfare; no public identity display, and map only at an appropriately generalized level for safe civic analysis.

## Implementation audit of existing BetterMakati code
- `src/App.tsx` routes the existing `/community-tools/saan-ako-lalapit` to `src/pages/ConcernFinder.tsx`, which currently uses a **services-scoped** search and common service/permit cards. It does not fully implement generalized citizen problem intents.
- `src/pages/CivicNearbyReport.tsx` and `src/components/civic/CivicNearbyReportForm.tsx` already accept **location-only** reports for a predefined subset of public-asset-oriented categories; this is a foundation, not proof of comprehensive problem coverage.
- `api/civic.js` persists via **GitHub Issues** (default `migi-macati/bettermakati`). An authenticated Issues create attempt on **11 October 2026** returned **HTTP 410 (Issues disabled)**. Before inviting reports, either enable authorized storage or replace it with a private-case-capable backend; test successful intake, duplicate handling, reference numbers, moderation and read-back. Public GitHub Issues are not a safe universal case store for personal/sensitive complaints.
- Existing Services, BetterBarangay, Hotlines and Civic Map stay available as specialist tools. Preserve explicit independent-publisher disclosures.

## Next release plan and test gates
**P0 — Reliable advice-first experience.** Add one accessible natural-language problem input within existing finder and prominent homepage entry; serve grounded guidance from curated structured records using synonyms plus ranked search, not unfettered model invention. First tests: neighbor karaoke, illegal parking, street intimidation, power outage, flooding/drainage, labor complaint, bullying, domestic violence, national-agency red tape, unmapped/unknown issue.

**P0 — Truthful scope and safety.** Advice works without account, GPS or photo. Emergency response is immediate. Each result labels last verification and official source. No 'submit' unless actual persistence/official referral path is known.

**P1 — Conditional, privacy-reviewed physical incident reporting.** Repair native case store, review privacy/security, reuse Civic Map's location-only support, optional auto-geocoding only after user confirms place, and agency-routing ledger. Never confuse “Submitted to BetterMakati” with “Received by city authority”. Sensitive cases must bypass public mapping.

**P2 — Verified external integration and citizen follow-up.** Official agency tracking only by actual API, verified email receipt or case number, or citizen-entered acknowledgement; dedupe on public-realm reports; true status stage, escalation path, user confirmation unresolved/resolved.

**P3 — Public systemic insights.** Only aggregate non-sensitive concerns by type/area, identify recurring issues and compare official agency outcomes; suppress small counts and sensitive details; do not portray geographic public reports as total incidence.

## Measurement: success is one useful solution, not 248 links
Use mixed ENG/FIL/Taglish test questions drawn from residents, including people with disabilities and lower digital literacy. Track: (a) % queries matched to suitable guide, (b) % answers with correct source/jurisdiction in expert audit, (c) time/taps to first safe actionable step, (d) unnecessary questions requested, (e) inappropriate map/photo/account demands, (f) escalations without official proof, (g) actual filing completion and verified referral where supported, (h) 'problem still unresolved' feedback, (i) assistive technology and mobile task completion, (j) missing-intent and dead-link rates. **Do not claim baseline metrics until instrumented and tested.**

## Primary-source references (accessed for desk benchmarking; implementation recheck required)

1. Singapore OneService app FAQ, refreshed 23 Jun 2026: https://www.oneservice.gov.sg/osapp-faq/  
2. Singapore OneService chatbot FAQ, refreshed 15 Sep 2026: https://www.oneservice.gov.sg/oschatbot-faqs/  
3. FixMyStreet explanation: https://fixmystreet.org/how-it-works/  
4. FixMyStreet spatial/authority routing: https://fixmystreet.org/customising/fms_and_mapit/  
5. NYC311 homepage: https://portal.311.nyc.gov/  
6. NYC311 process, categories, status, survey, API and nonemergency limits: https://portal.311.nyc.gov/about-nyc-311/  
7. NYC311 service request evidence, privacy and status caveats: https://portal.311.nyc.gov/article/?kanumber=KA-03116  
8. Boston311: https://www.boston.gov/departments/boston-311  
9. QC iReport official program: https://quezoncity.gov.ph/program/qc-ireport/  
10. QC iReport FAQ (guest access, current limits and claimed 72-hour updates): https://quezoncity.gov.ph/faqs/faq-ireport/  
11. QC city-reported metrics released 21 Sep 2026: https://quezoncity.gov.ph/qc-ireport-resolves-82-of-citizen-reports-in-first-four-months/  
12. Pasig Ugnayan: https://pasigcity.gov.ph/ugnayan  
13. UK Citizens Advice network and independence: https://www.citizensadvice.org.uk/about-us/information/what-we-do/  
14. Citizens Advice privacy and support processes: https://www.citizensadvice.org.uk/about-us/information/when-you-get-advice/  
15. Snap Send Solve: https://www.snapsendsolve.com/how-it-works  
16. GOV.UK Service Standard, user needs: https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs  
17. GOV.UK cross-channel delivery: https://www.gov.uk/service-manual/service-standard/point-3-join-up-across-channels  
18. GOV.UK accessibility: https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction  

**Research caveat:** vendor/government claims are descriptions of their systems, not proofs of actual real-world citizen outcome or BetterMakati equivalent feasibility. Benchmark interviews and hands-on mobile flows are separate follow-on validation work.