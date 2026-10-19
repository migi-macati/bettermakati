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
