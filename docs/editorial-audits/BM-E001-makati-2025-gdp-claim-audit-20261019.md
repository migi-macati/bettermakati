# BM-E001 — Makati 2025 GDP report: primary-source claim audit

**Reviewed:** 19 October 2026, Asia/Manila  
**Report:** `/reports/makati-2025-economy-gdp-outlook`  
**Canonical module:** `src/data/reports/09-makati-2025-economy.ts`  
**Disposition:** **Update** (bounded review, not an all-claims certification). Preserve original publication date, 8 October 2026.  
**Public-interest question:** How much output did Makati generate in 2025, how fast did it grow, and what can those accounts actually establish?

## Checked evidence and claim ledger

| Claim or editorial proposition | Type | Original evidence and date | 19 October review | Disposition |
| --- | --- | --- | --- | --- |
| Makati produced about ₱1.27 trillion in 2025 real GDP and grew about 5.0% | Official statistical estimate | PSA NCR Makati release, 6 Oct 2026, ref. 2026-032 [A]; national PPA release, 28 Aug 2026 [B] | Both releases support the rounded level and growth. The article's more precise 5.05% is attributed to OpenSTAT tables; those raw tables were **not independently re-extracted** this run. | Retain precise figure with existing detailed-table citation; add city-specific primary source [A] to the English and Filipino key finding. |
| Makati had 5.5% of Philippine GDP and ranked second by real GDP | Official statistical estimate | PSA national PPA release [B], constant 2018 prices | Explicitly confirmed the share and ranking in [B]. | Clarify **real GDP** in both subheadlines so the share is not mistaken for a nominal fiscal measure. |
| Makati's real GDP per resident was about ₱4.265 million | Official statistical estimate | PSA NCR Makati release [A], ₱4,265,273; article's OpenSTAT per-capita series | Confirmed the 2025 estimate in [A]. GDP per resident is **not** typical income, wages or household wealth. | Retain caveat; English key finding also links to [A]. Filipino key finding continues to cite the canonical OpenSTAT series. |
| Construction and real estate output contracted | Official statistical estimate | PSA NCR Makati release [A], -13.5% and -2.1% | Confirmed rounded contractions in [A]. | Retain; avoid suggesting causes without separate evidence. |
| Pasig and Pasay grew faster than the NCR economy | Official statistical estimate | PSA NCR release, 6 Oct 2026 [C] | [C] confirms 5.8% and 5.5%, respectively; NCR 4.35%. | Retain existing comparison where used; do not conflate growth ranking with GDP size. |
| Makati's large output *supports resilience* | Unsupported causal interpretation | GDP level and sector mix alone | GDP scale and concentration cannot prove resilience, household benefit or capacity to withstand a shock. | **Replace** unsupported English/Filipino resilience claim with qualified sector-exposure explanation. |
| Low/middle/high 2030–2040 GDP paths | BetterMakati deterministic scenario, **not forecast** | 2025 real GDP base, assumed annual 2.0% / 4.5% / 6.5%; national 4.0% | Recomputed from rounded ₱1.266T base: 2040 ≈ ₱1.704T / ₱2.450T / ₱3.256T; reported values differ by ≤ ₱0.001T due to rounded starting level. 2040 share from 5.5% base ≈ 4.11% / 5.91% / 7.85%. | Retain explicit assumptions and scenario label; do not describe middle as the most likely forecast. |
| 2018–2021 versus 2022–2025 boundary comparability; detailed sector values | Historical data and analysis | Existing PSA OpenSTAT series and EMBO report | **Not independently reverified in this bounded run.** The prior review's geographic caveat remains necessary. | Retain pending full same-vintage source-level audit. |

## Editorial change and limitations

This packet adds a **direct Makati-specific PSA source** with its exact 6 October release date, source URL and 19 October check date; clarifies the headline and real-price national share in English and Filipino; and removes a resilience conclusion that cannot be established from GDP accounts alone. It does not silently change any GDP observations, scenarios, original publication dates, or existing geographic cautions.

**Source independence:** [A], [B] and [C] are separate original PSA releases but come from the same statistical agency. They corroborate *published PSA estimates*, not independent estimates of actual production. This review does not claim an independent audit of PSA's methodology.

**Still open:** Direct OpenSTAT table extraction for every 2018–2025 value, detailed sector shares/contributions, 2022 geography handling, and all report source URLs. No right-of-reply request is warranted for this limited correction: it makes no serious adverse allegation about an identifiable person or organization. No external interview, second editor review, user testing, or live rendered-page verification was performed.

## Primary sources checked

- **[A]** Philippine Statistics Authority NCR, *City of Makati’s Economy Grows by 5.0 Percent in 2025*, 6 Oct 2026, ref. 2026-032: https://rssoncr.psa.gov.ph/statistics/ppa/node/1684059166
- **[B]** Philippine Statistics Authority, *PSA Releases the 2025 Economic Performance of the 82 Provinces and 33 Highly Urbanized Cities*, 28 Aug 2026, ref. 2026-277: https://psa.gov.ph/content/psa-releases-2025-economic-performance-82-provinces-and-33-highly-urbanized-cities
- **[C]** Philippine Statistics Authority, *All Economies in NCR Expand in 2025*, 6 Oct 2026, ref. 2026-SSO-168: https://psa.gov.ph/content/all-economies-ncr-expand-2025-city-pasig-and-pasay-city-lead-terms-gdp-growth

**Release evidence:** PR, required build/browser-smoke, merge SHA, production SHA and rendered checks must be appended only after independently observed. Passing CI does not establish that the entire report has been fact-checked.
