# BM-E001 — 2025 Makati GDP article: claim-level editorial review

**Review date:** 19 October 2026 (Asia/Manila)  
**Article:** `/reports/makati-2025-economy-gdp-outlook`  
**Module:** `src/data/reports/09-makati-2025-economy.ts`  
**Original article date:** 8 October 2026 (unchanged)  
**Decision:** **UPDATE**. Preserve the report; publish the scoped ENG/FIL source and interpretation corrections already prepared on this branch. This is a bounded fact check, not certification of every historical/sector row.

## Claim ledger

| Claim in article | Kind | Evidence checked | Editorial verdict |
| --- | --- | --- | --- |
| Makati's 2025 GDP was about ₱1.27 trillion at constant 2018 prices | Fact, rounded | [PSA national PPA release, 28 Aug 2026](https://psa.gov.ph/content/psa-releases-2025-economic-performance-82-provinces-and-33-highly-urbanized-cities), Figure 2 and narrative; [PSA NCR Makati release, 6 Oct 2026, ref 2026-032](https://rssoncr.psa.gov.ph/statistics/ppa/node/1684059166), paragraph 1 | **Corroborated at published rounding**. The more precise ₱1.266T is attributed to the article's cited OpenSTAT vintage, not independently downloaded in this review. |
| Second-largest provincial/HUC economy nationwide; 5.5% of Philippine GDP at constant prices | Fact | PSA national PPA release, Figure 2 and narrative | **Corroborated**. Explicitly call it a **real GDP** share, not a nominal share. |
| Makati grew about 5.0% in 2025, down from 7.4% in 2024 | Fact, rounded | PSA NCR Makati release, paragraphs 1–2 | **Corroborated at one decimal**. The article's 5.05% and 7.43% two-decimal figures require original OpenSTAT precision for exact reproduction. |
| Real GDP per resident was ₱4,265,273 and highest among provinces/HUCs | Fact | PSA NCR Makati release, paragraph 3 | **Corroborated**. This is production divided by resident population, not a resident's earnings, wealth or disposable income. |
| Construction and real estate contracted in 2025 | Fact | PSA NCR Makati release, paragraph 2 | **Corroborated**: construction −13.5%, real estate/ownership of dwellings −2.1%; do not conflate them with the entire property sector. |
| Finance, business services and trade produced more than four-fifths of output; finance led the GDP increase | Derived calculation | Article's PSA OpenSTAT industry source, `0022A5FPPA1.px` | **Pending independent recalculation** from same-vintage sector cells. Keep explicitly attributed to the underlying data; do not describe as independently verified here. |
| NCR share 17.49%, sector shares/contributions, 2018–2025 year-by-year levels and growth | Data and calculations | Article's OpenSTAT tables `0012A5FPPA0`, `0032A5FPPA2`, `0022A5FPPA1` | **Pending row-level re-extraction and denominator checks**. No silent certification. |
| 2022 EMBO boundary break affects comparison | Geographic caveat | Article's internal EMBO evidence link | **Retain caveat**. The precise PSA vintage and geographic allocation need a separate primary-document verification; do not interpret a discontinuity as purely economic. |
| 2030/2035/2040 Low/Middle/High growth cases | Scenario, not forecast | Article's explicit compound-growth assumptions (2.0%, 4.5%, 6.5%) | **Retain as hypothetical arithmetic only**. Recheck numerical compounding and any implied national-share denominator before further promotion. No probability assigned to the 'Middle' case. |
| Large GDP proves the economy is resilient | Unsupported inference | None | **Remove**. Sector concentration creates exposures, but GDP size alone cannot establish resilience. Corrected in ENG and Taglish on this branch. |

## Editorial safeguards

- Source publication date and the **actual check date** are distinct. PSA NCR Makati release is dated 6 October 2026 and its new article citation records **checked 19 October 2026**; pre-existing OpenSTAT sources retain their earlier 8 October check marker rather than being falsely refreshed.
- The PSA NCR Makati release confirms published rounded figures; it does **not** independently substantiate every high-precision value, sector-share calculation, EMBO adjustment or projection in this article.
- No interviews or responses were sought: this statistical analysis does not make a serious adverse allegation against an identifiable party. If future reporting does, follow the right-of-reply policy.
- No personal information or sponsored content introduced. Source links remain directly accessible and ENG/Taglish interpretations should stay equivalent.
- No changes to canonical statistics records, numerical series, report publication date, or other reports in this packet. Review any discrepancy with the canonical statistics indicators before propagating new numbers.

## Release acceptance

1. Compare changed ENG and Taglish claims and evidence IDs in the module; retain original publication date.
2. Re-run quality/build and required GitHub build/browser-smoke on the **exact PR head**. CI is a technical gate, not editorial verification.
3. Open a scoped PR without bypassing protections; record any rejected operation verbatim. Only after merge and matching READY production SHA claim **deployed**. Rendered-page confirmation is a separate `live_verified` milestone.
4. Schedule separate bounded re-extraction for unresolved OpenSTAT historical/sector data; do not block this narrower, source-supported correction if the text makes no stronger claim than its cited evidence.


## Supplemental PSA Figure 2 check — 21 October 2026

**Primary document:** Philippine Statistics Authority NCR PSO III, *City of Makati's Economy Grows by 5.0 Percent in 2025*, 6 October 2026, reference 2026-032, **page 2, Figure 2**, https://rssoncr.psa.gov.ph/system/files/attachment-dir/CityMakati_PR_MFU_NMTB_EAGR_NHD_fin.pdf (checked 21 October 2026).

The signed PSA press-release chart reports **2024–2025 industry growth rates** for all 14 non-suppressed industries. This expands independent corroboration beyond the six rates in the release narrative. The chart values, compared with the article's more precise displayed growth rates, are:

| Industry | PSA Figure 2 | Article | Verdict |
| --- | ---: | ---: | --- |
| Human health and social work | 11.0% | 11.03% | Consistent at PSA chart precision |
| Transport and storage | 10.7% | 10.69% | Consistent |
| Public administration | 6.5% | 6.51% | Consistent |
| Professional and business services | 6.3% | 6.35% | Approximate agreement; underlying precision needed to explain rounding |
| Accommodation and food | 6.05% | 6.05% | Matches |
| Financial and insurance | 5.97% | 5.97% | Matches |
| Wholesale and retail trade | 5.7% | 5.71% | Consistent |
| Education | 4.7% | 4.66% | Consistent |
| Other services | 4.1% | 4.10% | Consistent |
| Information and communication | 4.0% | 3.97% | Consistent |
| Manufacturing | 3.1% | 3.08% | Consistent |
| Real estate and dwellings | -2.1% | -2.06% | Consistent |
| Utilities and waste | -2.6% | -2.63% | Consistent |
| Construction | -13.5% | -13.51% | Consistent |

**Limits:** This chart confirms the **direction and approximate growth rate of all 14 published sectors**, not the article's exact two-decimal growth-rate precision, real-GVA pesos, GDP shares, or sector contributions to net growth. The PSA Excel attachment at https://psa.gov.ph/system/files/sead/PUB_NCR_Ind_2018PSNA_2018-2025_s.xlsx remains inaccessible for source-cell extraction in this environment. Do not mark those exact cells verified or merge the PR on this check alone. No new interviews, personal data, or serious adverse allegations. Editorial disposition remains **UPDATE / HOLD MERGE** until the unresolved primary-cell checks and visible dated correction notice are complete.

## Build & Fix arithmetic regression handoff — 10 November 2026

Resumed existing draft PR #141 at eebebdda41d0de4e330f312e1430bcf979069f97 in an isolated checkout. The five corrected values and dated bilingual correction notice were already committed; neither was recreated. Main remains 82096d18144157d8b8606ba1c6565ec992cc98c8, READY production dpl_Jke2u5HWZUM9KQXSBJP6L9WYwaAd. No overlapping new publisher PR appeared. This bounded batch supports Civic & Editorial's existing correction and preserves its source-verification hold.

Added scripts/check-gdp-scenarios.mjs to the quality gate. It loads the actual report module, checks all ENG/FIL scenario table/chart amounts and national shares against the disclosed 1.266T base, 2/4.5/6.5% annual rates and 4% national growth assumption, and checks point years and row counts. Six negative controls reject the five former erroneous table values and a Filipino-only chart error. Running against current main's article fails at Low 2035 (1.544 versus 1.543); running against this branch passes. This is an arithmetic check, not independent validation of the base GDP, precision, source cells, forecast or editorial conclusions. No public copy or source-check date changed.

Local quality passed. Full build result and exact-head CI recorded in the run result. No visual change in this batch; no new rendered-page acceptance claimed. Generated audit/build output excluded from the commit. Required build/browser-smoke gates remain unchanged. Keep PR draft and auto-merge disabled while same-vintage sector amounts/shares/contributions remain unresolved. Next owner action: complete that source reconciliation or explicitly narrow the unsupported claims, then refresh the correction publication date, run required gates and verify merge/deployment/live output. Build & Fix can repair concrete CI failures on this PR. Shared handoff remains v117 and its successful report cutoff is not advanced by this repository record.


## 19 November 2026 — primary sector-cell reconciliation completed

Build & Fix resumed existing draft PR #141 at `1d6f674edbde3a02fa2fb700c9e8edc6f350a9be`. This resolves the previously inaccessible sector-cell batch; it does not claim that every article claim has been reviewed or publish the held corrections.

Original workbook: https://psa.gov.ph/system/files/sead/PUB_NCR_Ind_2018PSNA_2018-2025_s.xlsx. Downloaded 19 November 2026. SHA-256 `df56356783fb6a6d2af41fc3b0a95677fc2f42b96e93d554e7c100e16989d8a5`. Makati sheet A43 identifies **As of August 2026**; A49 identifies **constant 2018 prices**; A42 specifies **thousand Philippine pesos**. This matches the vintage, years and units in the prior OpenSTAT metadata review. It is a separate original PSA distribution, not a newly retrieved OpenSTAT API export. Publication day is not inferred from the retrieval date.

Cell-addressed extraction: `BM-E001-sector-source-20261119.json`. Denominators: Makati!I73 = 1,205,623,305.477621 thousand pesos (2024); J73 = 1,266,457,527.182081 thousand pesos (2025). The article’s 1.266T is rounded. GVA in billions = source / 1,000,000; GDP share = sector2025 / GDP2025 × 100; annual growth = (sector2025 / sector2024 − 1) × 100. Share of net growth = (sector2025 − sector2024) / (GDP2025 − GDP2024) × 100. This last measure is distinct from PSA’s percentage-point contribution to aggregate GDP growth.

All 14 numeric sector rows match the article at its displayed precision in both ENG and FIL: 56 displayed numerical fields per language. All 42 underlying growth/share/percentage-point identities independently agree with the workbook cells within 1e-9. Finance, business services and trade have a combined exact share of 81.606253%; the “more than four-fifths” concentration statement is supported. Finance is the largest positive contribution. No sector-value correction is needed.

| Article sector | 2024/2025 GVA cells | Share / growth / percentage-point cells | Outcome |
|---|---|---|---|
| Financial and insurance | I65, J65 | J264, I145, I344 | All four displayed values match |
| Professional and business services | I67, J67 | J266, I147, I346 | All four displayed values match |
| Wholesale and retail trade | I61, J61 | J260, I141, I340 | All four displayed values match |
| Real estate and dwellings | I66, J66 | J265, I146, I345 | All four displayed values match |
| Manufacturing | I57, J57 | J256, I137, I336 | All four displayed values match |
| Information and communication | I64, J64 | J263, I144, I343 | All four displayed values match |
| Construction | I59, J59 | J258, I139, I338 | All four displayed values match |
| Health and social work | I70, J70 | J269, I150, I349 | All four displayed values match |
| Accommodation and food | I63, J63 | J262, I143, I342 | All four displayed values match |
| Other services | I71, J71 | J270, I151, I350 | All four displayed values match |
| Transport and storage | I62, J62 | J261, I142, I341 | All four displayed values match |
| Utilities and waste | I58, J58 | J257, I138, I337 | All four displayed values match |
| Education | I69, J69 | J268, I149, I348 | All four displayed values match |
| Public administration | I68, J68 | J267, I148, I347 | All four displayed values match |

Suppression remains explicit: I54/J54 and I56/J56 contain `s`. Workbook note A76 says aggregate Industry includes Agriculture/forestry/fishing and Mining/quarrying GVA. Do not substitute zero, infer suppressed values, or expect the 14 visible rounded sectors alone to equal total GDP.

Primary PSA release https://rssoncr.psa.gov.ph/statistics/ppa/node/1684059166 rechecked today: 6 October 2026, ref2026-032; rounded 5.0% GDP growth and PHP4,265,273 GDP per resident remain corroborated. Workbook-derived exact aggregate growth is 5.045873070640397%, consistent with article 5.05%. This is verification of PSA’s estimates, not an independent economic measurement.

Live downstream review: https://bettermakati.org/reports/makati-2025-economy-gdp-outlook at production commit3b4434f0a24d12ad13d9346ecbd70931dc9564e1. ENG and FIL sector tables share these values. The five old scenario errors and resilience wording are still visible; prepared #141 corrections are not published. FIL switch produced the translated headline; retained English sector labels/numeric table headings observed. Desktop top-of-page screenshot inspected; no mobile/keyboard/full-link acceptance claimed.

Extended the existing quality-gated scenario check to compare both language tables to the frozen, source-addressed extraction. Two negative controls reject a billion/thousand unit error and confusing percentage-point contribution with share of net growth. Prior six scenario controls retained. No public module edited in this batch.

Updated disposition: **sector source-cell blocker resolved**. PR remains draft while the owner completes remaining article-wide reconciliation (historical geography and per-capita/NCR/national denominators, unsampled source links and propagation), refreshes the correction date at release, and performs changed-output ENG/FIL/mobile acceptance. These are specifically unreviewed scope, not a renewed claim that the 14 sector values are unavailable. Existing full editorial release hold is retained; no extra approval role introduced. Next bounded batch should address the remaining denominator/geography evidence or explicitly narrow unsupported claims, then finish normal required CI/merge/deployment. Do not redo this completed sector extraction unless source vintage changes.

Validation 19 November: local quality/build both exit0, expanded bilingual source/scenario guard passed. Exact-head remote CI is recorded in PR #141 separately; no merge/deployment for these held corrections.


## 22 November 2026 · NCR denominator and per-capita series

Original [PSA NCR workbook by HUC](https://psa.gov.ph/system/files/sead/PUB_NCR_Prov_2018PSNA_2018-2025.xlsx), SHA256 64742597812f7a9644d0c2a79c143f206489c3f2fb9e7d04d35a171f95518596, retrieved November 22. PPA!J50 / PPA!J66 = 1,266,457,527.182081 / 7,243,133,798.919612 thousand pesos at constant 2018 prices = 17.4849390104%. Round once to 17.48%. The underlying Statistics indicator already has the correct value. Updated both summaries, passages and shared ranking row, with visible corrections. The nine other top-ten regional shares agree to two decimal places.

Capita!J14 and J50 give 5,200,593.42435 current and 4,265,272.56960 constant 2018 pesos per person in 2025. A32 and A68 identify 2020-based CPH projections. Multiplying PPA!J50 by 1,000 and dividing by Capita!J50 implies 296,923 residents; this is a derived denominator, not a census count. Capita!D50/E50 give 1,685,662.32755 in 2019 and 3,373,069.08138 in 2020. Same years, PPA!D50/E50 give a 6.47% fall in real city GDP. The implied denominator falls from about 626,677 to 292,914. No cause for the 2020 discontinuity established. Removed the suggestion that the 2022 EMBO change explains the earlier jump. The direct PX-Web response declared a 1×2×8 array but returned only one value and was excluded. The named Excel cells supply the evidence. Direct row-level checks supersede the earlier unresolved NCR and 2025 per-capita gates.

Remaining editorial gates: national denominator and scenario shares; primary-source footnotes on the 2022 geographic break; check other surfaces, links and both languages; refresh publication correction dates; changed-output acceptance. Keep #141 draft. Existing 14-sector evidence and prior scenario fixes retained.

## 22 November evening national-share check

The April PSA [annual national accounts workbook](https://psa.gov.ph/sites/default/files/nap/01Summary_2018PSNA_Ann_5.xlsx) has SHA256 a720a7f665ff743cbbc85a92400e547354782587d067a55c02fd13da31ab4f5e. Summary!AA68 gives 23,228,636.805222385 million pesos at constant 2018 prices for 2025. The August NCR workbook above gives 1,266,457,527.182081 thousand pesos for Makati in PPA!J50. Dividing after converting both to millions gives 5.452138831%, consistent with the published 5.5% at one decimal. The 2040 scenarios use that published rounded starting share and 4% annual Philippine growth. The resulting shares round to 4.11%, 5.91% and 7.85%. These calculations compare two identified releases. They do not establish the cause of the 2020 per-capita discontinuity.
