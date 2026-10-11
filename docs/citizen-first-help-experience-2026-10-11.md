# Citizen-first help experience: one concern, one useful next action

**Packet:** CIVIC-PROBLEM-20261011-UX  
**Companion:** `docs/citizen-problem-research-2026-10-11.md` (248 internal research exemplars)  
**Status:** UX specification, not implemented. The number of catalogue entries is neither a user-facing goal nor a completeness measure.

## Core principle

A resident arrives with one problem. **Never confront them with 248 potential problems or require them to select an agency, a legal category, or a barangay before describing their concern.** BetterMakati should start with a single conversational input: **“How can we help?” / “Ano'ng problema? Paano kami makakatulong?”** Allow free text in English, Filipino and everyday Taglish. Show at most a few rotating **examples**, clearly not exhaustive choices. Provide a simple accessible browse fallback for residents who prefer navigation, but do not make browsing the default.

## Citizen's journey
1. **Describe one concern.** One generous, accessible text field: “The cars on my street block the sidewalk.” One primary button: “Find a solution.” No multi-step intake form before useful advice.
2. **Interpret without overclaiming.** Match conversational words to the curated catalogue and verified guides using search/synonyms and, if warranted, semantic retrieval. LLM assistance is optional, must be source-grounded, and cannot invent law, office mandates, complaint routing, or agency responses. If confidence is weak, present 2–3 brief likely interpretations; don't silently guess.
3. **Triage urgent danger.** If the description indicates immediate danger, show relevant emergency instructions/911 at once; never require another form before emergency help. Do not mistake all street solicitation or homelessness for a criminal emergency.
4. **Give useful immediate advice.** State in plain language what to do *now*, the likely responsible authority, and what evidence is appropriate. Distinguish safe informal remedies from formal complaints; do not encourage direct confrontation with threatening persons.
5. **Ask at most one necessary follow-up at a time.** Only when routing materially depends on it (e.g., exact street ownership, barangay or emergency status); provide initial universally safe guidance first. Do not demand geolocation or identity for reading advice. Never infer a barangay from fuzzy location alone.
6. **Offer clear actions.** “Contact official office,” “Prepare complaint,” “See applicable rule,” “Track my case” (only for an actual stored case), “What if nothing happens?” Use verified official links and phone numbers with dated checks. For available native submission, distinguish “Sent to BetterMakati” from “Submitted to government” and show agency-generated tracking/reference only when genuine.
7. **Follow through.** Where available: authenticated complaint status, escalation if unresponsive, related local services; if nothing can be tracked, state that explicitly.

## One concern should yield one tailored guide
For a **noisy neighbor**, start with safe informal remedy and potential nuisance law; ask whether it is residential vs commercial only if necessary for enforcement choice. For **blocked sidewalk parking**, ask for street or nearest intersection after giving immediately applicable obstruction advice; branch to city/MMDA/DPWH/private operator based on verified ownership, never guess that every parked car is illegal. For **aggressive solicitation**, separate intimidation/threats (public safety) from welfare needs (Makati Social Welfare / DSWD Pag-abot); preserve rights and confidentiality.

## Data architecture
- **Behind the scenes:** versioned problem records (synonyms, issue intents, facts needed, safety triggers, candidate jurisdiction, laws, reporting route, escalation, sources, reviewed date, related internal IDs). Many catalogue entries can map to the same verified response pathway.
- **Public interface:** one search/input, one relevant result or a short guided disambiguation. The interface must not paginate all internal catalogue entries as the core experience.
- **Fallback:** a small browse index of understandable life situations for accessibility and low-confidence search; concise and collapsible, never 248 long.
- **Indexing:** synonyms in EN/FIL/Taglish, spelling variations, varied phrasing, neighborhood/road/street references without exposing private data. Include “kaharap kong bahay ang maingay,” “towing,” “bawal magpark,” “nanghaharass” etc.
- **Graceful failure:** search and verified guides remain functional without AI service. If no match, show a generic safe route to official Makati Action Center / barangay as appropriate and a chance to submit *feedback on missing guidance* (not a falsely logged government complaint).
- **Privacy:** no public publication of victim identities, images of minors, accusatory names or sensitive locations; distinguish privately reported evidence from public maps. Data minimization; consent and secure retention for optional submission.

## Design acceptance tests
1. First screen shows one prominent concern field; keyboard and screen readers can complete the journey. Do not expose a 248-item directory by default.
2. Search input `Nagkakaraoke yung kapitbahay namin every midnight` finds an applicable residential noise guide with source, current contact and escalation, without forcing category selection.
3. Search `cars blocking my driveway` returns safe immediate steps and only asks location when needed to identify authority.
4. Search `may nananakot at nanghihingi ng pera sa kanto` shows immediate-safety branching, plus optional protected social-welfare outreach if appropriate; no stigmatizing label.
5. Search `brownout sa bahay` routes to electrical provider/appropriate emergency steps before LGU office.
6. Search `nagkakasakit anak ko` does not incorrectly force a single diagnosis or complaint agency; clarifies danger as needed and provides clinically safe referral.
7. Unrecognized problem produces useful general guidance or up to three clarification choices, not an empty results page.
8. Website never claims a case was lodged with authorities from a mere search or draft; tracking requires confirmed submission and persistence.
9. Resident can browse existing service directory normally; routes, search, Civic Map and BetterBarangay use the same canonical records.
10. Test on small screens, limited bandwidth, keyboard-only navigation, English and Taglish user phrasing.

## Completion model
The 248 entries are **research hypotheses**, not 248 complete verified guides and not proof of comprehensiveness. Evaluate breadth by unserved intent classes, tested coverage of real resident queries, route correctness, source freshness, ease of getting to an actionable result, and verified case follow-through. Use missed searches and user-tested scenarios to expand the catalog continuously. Publication of actionable guidance remains gated on verified source and jurisdiction, not on taxonomy enumeration.
