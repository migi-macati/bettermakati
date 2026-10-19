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
