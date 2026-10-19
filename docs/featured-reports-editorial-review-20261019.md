# Featured reports editorial review — 19 October 2026

User instruction: improve existing Featured Insights and Reports; delete items that lack value.

Reviewed all 11 current report modules at main ab63b206. This is an editorial revision of the existing evidence, not a new source-freshness certification. Original publication dates, source dates and stated legal/project cutoffs remain unchanged.

| Report | Decision and reason |
| --- | --- |
| 2026 budget proposal | Retain. The two fiscal baselines explain conflicting growth claims. Shorten title and explain which service outputs and cost reconciliations residents should ask for. |
| 2025 fiscal profile | Retain. Revenue structure, spending mix and CBD service questions are distinct from GDP. Shorten title; identify recommended disclosures as recommendations. |
| Barangay population | Retain. Spatial distribution differs from population growth. Explain how resident counts can inform coverage comparisons without equating population with need. |
| Population growth | Retain. Comparable-boundary time series has independent value. Explain planning use and why past growth is not a forecast. |
| Historical audit follow-up | Retain and clarify. Three specific records support scrutiny; incomplete documentary continuity must not imply continuing violations. Simplify title and explain what finding-specific evidence would resolve the question. |
| EMBO transition | Retain. Jurisdiction, service operation and ownership are materially different. Add a practical service-directory recommendation in English and Taglish. |
| Political dynasties | Retain. Family succession and overlap are documented; performance must be evaluated separately. Add concrete accountability questions in both existing editions. |
| Subway | Retain. Contract, settlement and restart are distinct stages. Anchor present-tense claims to the existing cutoff and add criteria for evaluating a revival in both editions. |
| GDP | Retain and correct presentation. Delete the chart combining peso levels with percentage growth; the adjacent sourced table preserves all observations. Remove headline recovery comparisons across changed boundaries. Rename the arbitrary middle scenario from “Base” to “Middle” to avoid implying it is the most likely forecast, in both editions. |
| 2024 SEF | Retain. Signed fund-level spending supports scrutiny of procurement and deliveries. Lead with the supplies share; shorten repeated methodological caveats. |
| Consumer Bazaar history | Retire as a standalone feature. Its chronology and distinction between recurring bazaars and a new partner format are too narrow for a featured analytical report; there are no verified cost, price, sales or sustained-benefit findings. This is an editorial-value decision, not a finding that the events lack value. Remove the module and permanently redirect the former URL to /reports. Existing event/service records remain. Git history preserves the research. |

The report registry, search and generated sitemap derive from the remaining modules. No legacy population URLs are removed. Existing English-only fallback remains for reports without a Filipino edition; new passages are paired in the three edited bilingual transition/politics/subway reports.

Release gates: full npm run quality, npm run build, and required GitHub build/browser-smoke checks. Generated freshness files from a local build are not source verification and are excluded from this patch.
