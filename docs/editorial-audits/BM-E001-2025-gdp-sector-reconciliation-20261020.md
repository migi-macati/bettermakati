# BM-E001 — GDP sector arithmetic and geography reconciliation

**Checked:** 20 October 2026, 05:10–05:20 Asia/Manila  
**Article:** `/reports/makati-2025-economy-gdp-outlook`  
**Existing audit:** `docs/editorial-audits/BM-E001-makati-2025-gdp.md`  
**Disposition:** **UPDATE**, not independently certified. This is a bounded internal consistency test, not a replacement for source-level verification.

## Claim-level evidence ledger

| Claim or issue | Type | Evidence and calculation | Decision |
| --- | --- | --- | --- |
| Financial/insurance, professional/business services and wholesale/retail trade account for over four-fifths of Makati's displayed sector output | Derived from **article's own** 2025 table | Displayed sector shares 48.81% + 17.96% + 14.84% = **81.61%** | **Internally consistent only**. Do not call independently verified until the PSA OpenSTAT same-vintage sector cells and GDP denominator are re-extracted. |
| Finance contributed most to the article's reported 2025 GDP increase | Derived from **article's own** contribution table | Finance 57.21% of displayed net growth contribution; three leading sectors total 57.21% + 22.32% + 16.69% = **96.22%**. Negative contributions offset positive contributions. | Directionally consistent with the article's numbers; the underlying PSA contribution method and input cells remain unverified. Avoid implying that growth contributions are sector GDP shares. |
| Sector totals agree with the article's 2025 GDP magnitude | Internal arithmetic, rounded cells | Sum of 14 published numeric sector GVA cells = **₱1,266.16 billion**; sum of their displayed GDP shares = **99.98%**; sum of displayed growth-contribution percentages = **99.97%**. Agriculture/mining is shown as **suppressed**, not zero. | Rounding and suppressed values preclude treating the totals as an independent exact reconciliation. PSA's 6 October 2026 Makati release supports **approximately ₱1.27 trillion**, not these sector cells. |
| Historical 2022–2025 comparison has a boundary caveat | Primary statistical metadata | PSA OpenSTAT GDP-by-city table `0012A5FPPA0` carries the footnote: figures for Makati **exclude EMBO barangays starting in 2022**, following their transfer to Taguig. Metadata last updated **28 August 2026**. | **Retain prominent break-in-series warning**; independently confirm exact table vintage and cross-year geography before attributing 2021→2022 changes to economic activity. This note does not establish retroactive administrative effect dates. |
| Low/middle/high 2030–2040 GDP values | BetterMakati illustrative scenario | `1.266 × (1+r)^(year−2025)` in ₱ trillion, r=2.0%/4.5%/6.5%. Five displayed cells in the current branch differ by ₱0.001T from this calculation. | **Correction pending**; prepared guarded bilingual patch remains **UNPUBLISHED**. Do not conflate PSA observations with BetterMakati's hypothetical scenarios. |

## Primary records and limitations

1. Philippine Statistics Authority, *City of Makati's Economy Grows by 5.0 Percent in 2025*, **6 October 2026**, reference 2026-032: https://rssoncr.psa.gov.ph/content/city-makatis-economy-grows-50-percent-2025 (checked 20 October 2026). Supports rounded GDP, growth, per-capita GDP and selected sector growth rates, not the full sector ledger.
2. Philippine Statistics Authority, OpenSTAT *Provincial Product Accounts: GDP by province/HUC*, matrix `2A5FPPA0`, last updated **28 August 2026**: https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0012A5FPPA0.px/ (metadata/footnote checked 20 October 2026). No underlying 2018–2025 cell download was completed in this pass.
3. Canonical article module `src/data/reports/09-makati-2025-economy.ts`, branch `editorial/bm-e001-2025-gdp-evidence-20261019`, fetched 20 October 2026. The sums above are computed solely from its displayed rounded 14 numeric sector rows.

**Review decision:** Keep the article while correcting the five scenario cells and displaying the dated bilingual correction. The arithmetic-only patch is still blocked at the prior `update_file` safety rejection; this file does not change the public report. A future pass must independently extract sector values and contribution methodology from the same PSA table vintage, check ENG/Taglish parity, run repository quality/build and exact-head CI, and verify deployment/live rendering. No second editor or right-of-reply was claimed; the present quantitative review makes no serious allegation about an identifiable person.

## 21 October 2026 — direct PSA industry-table metadata check

**Primary source checked:** PSA OpenSTAT, *Gross Domestic Product by Industry, Province and HUC*, matrix `2A5FPPA1` (`0022A5FPPA1.px`), https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0022A5FPPA1.px/ (checked 21 October 2026). The live table selector and metadata identify 16 sectors, 135 geolocations, two valuations (current and constant 2018 prices), and eight years. Values are **in thousand Philippine pesos**; the table records its latest update as **28 August 2026**. Its geographic note says Makati excludes the EMBO barangays starting in 2022.

**Evidence boundary:** The selector and metadata were accessible, but the Makati-by-industry 2024/2025 numeric cells were not extracted. This verifies the source identity, units, coverage, vintage and geography caveat only. It **does not verify** the report's 14 exact sector GVA amounts, growth-contribution calculations or sector GDP shares. Those claims remain on hold for same-vintage source-cell comparison; the article's displayed sums are internal consistency checks only.

**Release status:** The five previously identified scenario values were corrected in the English/Taglish report table and chart on PR #141 (commit `62ddb355`), with later evidence commit `db7ec40c`. Exact-head GitHub Actions run `39549000053` completed successfully, but the PR remains draft pending editorial verification. The 21 October dated bilingual public correction notice was prepared but its `update_file` write was rejected by safety checks before execution. No retry or bypass. No merge or production publication is claimed.


## 31 October 2026 — independent primary-source recheck (release hold retained)

- **PSA NCR original release, 6 October 2026, reference 2026-032:** https://rssoncr.psa.gov.ph/statistics/ppa/node/1684059166. Rechecked 31 October 2026. Confirms approximately **₱1.27 trillion** Makati GDP at constant 2018 prices, **5.0%** annual growth, **₱4,265,273** GDP per resident, and sector growth rates including construction **−13.5%** and real estate **−2.1%**. These are rounded source-level observations, not a validation of every precision digit in the article.
- **PSA OpenSTAT provincial product accounts table directory:** https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/?tablelist=true. Rechecked 31 October 2026. Confirms existence of the industry-by-HUC matrix, 16 sectors, 135 geolocations, 2018–2025 coverage and update date **28 August 2026**. No Makati-specific 2024/2025 sector numeric cells were extracted in this pass.
- **PSA national PPA statistical-tables directory:** https://psa.gov.ph/statistics/ppa/tables. Rechecked 31 October 2026. Lists the NCR GDP-by-industry workbook for 2018–2025. The workbook cells were not downloaded and independently compared here. Do not substitute the national-industry table for Makati's local values.

**Claim-level disposition:** rounded GDP, rounded growth, per-capita GDP and selected industry growth rates: corroborated by original PSA release. Exact industry GVA, sector shares, contribution-to-growth percentages, 5.05% precision, and complete historical comparisons: **UNVERIFIED** against original cells. Scenario figures: independently reproducible from disclosed assumptions, not PSA forecasts. **Decision: HOLD draft PR #141** until original same-vintage industry cells and denominators are extracted and compared, or the article is narrowed to independently verified rounded claims with unverified detailed tables removed or clearly qualified. Passing CI is not editorial clearance. No new public correction or production change is claimed.


## 31 October 2026 — public correction notice committed on draft branch

The article module now includes a **visible dated correction paragraph in both English and Taglish** immediately above the scenario table and chart, commit `d7b2fcc997c1c7efdc086cf92df45f1b60a96788`. It identifies all five corrected cells (Low 2035, Middle 2035/2040, High 2035/2040), the magnitude of each earlier overstatement (₱0.001 trillion), the formula assumptions and the unchanged original publication date. This replaces earlier notes describing the correction notice as unwritten; those notes are retained as historical run records. **This notice is committed only on the draft PR branch; it is not yet published to production.** The same-vintage PSA industry-data verification and exact-head CI remain outstanding publication gates.
