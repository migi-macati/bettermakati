import type {
  FeaturedReportModule,
  ReportCanonicalRecordRef,
} from '../reportTypes';

const checkedOn = '8 October 2026';

const records = {
  level: {
    recordType: 'statistics-indicator',
    id: 'real-gdp-level',
    href: '/statistics#indicator-real-gdp-level',
  },
  growth: {
    recordType: 'statistics-indicator',
    id: 'real-gdp-growth',
    href: '/statistics#indicator-real-gdp-growth',
  },
  nationalShare: {
    recordType: 'statistics-indicator',
    id: 'gdp-national-share',
    href: '/statistics#indicator-gdp-national-share',
  },
  ncrShare: {
    recordType: 'statistics-indicator',
    id: 'gdp-ncr-share',
    href: '/statistics#indicator-gdp-ncr-share',
  },
  industry: {
    recordType: 'statistics-indicator',
    id: 'industry-gva',
    href: '/statistics#indicator-industry-gva',
  },
  perCapita: {
    recordType: 'statistics-indicator',
    id: 'gdp-per-capita',
    href: '/statistics#indicator-gdp-per-capita',
  },
  population: {
    recordType: 'statistics-indicator',
    id: 'population-total',
    href: '/statistics#indicator-population-total',
  },
} satisfies Record<string, ReportCanonicalRecordRef>;

const gdpRows = [
  {
    year: '2018',
    current: '₱991.89B',
    real: '₱991.89B',
    growth: '—',
    geography: 'Pre-transfer Makati',
  },
  {
    year: '2019',
    current: '₱1.070T',
    real: '₱1.056T',
    growth: '6.50%',
    geography: 'Pre-transfer Makati',
  },
  {
    year: '2020',
    current: '₱1.025T',
    real: '₱988.02B',
    growth: '−6.47%',
    geography: 'Pre-transfer Makati',
  },
  {
    year: '2021',
    current: '₱1.098T',
    real: '₱1.038T',
    growth: '5.06%',
    geography: 'Pre-transfer Makati',
  },
  {
    year: '2022',
    current: '₱1.165T',
    real: '₱1.055T',
    growth: '1.64%',
    geography: 'PSA excludes EMBO',
  },
  {
    year: '2023',
    current: '₱1.304T',
    real: '₱1.122T',
    growth: '6.38%',
    geography: 'PSA excludes EMBO',
  },
  {
    year: '2024',
    current: '₱1.440T',
    real: '₱1.206T',
    growth: '7.43%',
    geography: 'PSA excludes EMBO',
  },
  {
    year: '2025',
    current: '₱1.544T',
    real: '₱1.266T',
    growth: '5.05%',
    geography: 'PSA excludes EMBO',
  },
];

const sectorRows = [
  {
    sector: 'Financial and insurance',
    realGva: '₱618.11B',
    share: '48.81%',
    growth: '5.97%',
    growthContribution: '57.21%',
  },
  {
    sector: 'Professional and business services',
    realGva: '₱227.50B',
    share: '17.96%',
    growth: '6.35%',
    growthContribution: '22.32%',
  },
  {
    sector: 'Wholesale and retail trade',
    realGva: '₱187.89B',
    share: '14.84%',
    growth: '5.71%',
    growthContribution: '16.69%',
  },
  {
    sector: 'Real estate and dwellings',
    realGva: '₱61.62B',
    share: '4.87%',
    growth: '−2.06%',
    growthContribution: '−2.13%',
  },
  {
    sector: 'Manufacturing',
    realGva: '₱44.67B',
    share: '3.53%',
    growth: '3.08%',
    growthContribution: '2.19%',
  },
  {
    sector: 'Information and communication',
    realGva: '₱30.64B',
    share: '2.42%',
    growth: '3.97%',
    growthContribution: '1.92%',
  },
  {
    sector: 'Construction',
    realGva: '₱21.56B',
    share: '1.70%',
    growth: '−13.51%',
    growthContribution: '−5.54%',
  },
  {
    sector: 'Health and social work',
    realGva: '₱20.57B',
    share: '1.62%',
    growth: '11.03%',
    growthContribution: '3.36%',
  },
  {
    sector: 'Accommodation and food',
    realGva: '₱12.22B',
    share: '0.97%',
    growth: '6.05%',
    growthContribution: '1.15%',
  },
  {
    sector: 'Other services',
    realGva: '₱10.15B',
    share: '0.80%',
    growth: '4.10%',
    growthContribution: '0.66%',
  },
  {
    sector: 'Transport and storage',
    realGva: '₱9.32B',
    share: '0.74%',
    growth: '10.69%',
    growthContribution: '1.48%',
  },
  {
    sector: 'Utilities and waste',
    realGva: '₱9.29B',
    share: '0.73%',
    growth: '−2.63%',
    growthContribution: '−0.41%',
  },
  {
    sector: 'Education',
    realGva: '₱6.90B',
    share: '0.54%',
    growth: '4.66%',
    growthContribution: '0.50%',
  },
  {
    sector: 'Public administration',
    realGva: '₱5.72B',
    share: '0.45%',
    growth: '6.51%',
    growthContribution: '0.57%',
  },
  {
    sector: 'Agriculture; mining',
    realGva: 'Suppressed',
    share: '—',
    growth: '—',
    growthContribution: '—',
  },
];

const ncrRows = [
  { rank: 1, economy: 'Quezon City', realGdp: '₱1.398T', ncrShare: '19.31%' },
  { rank: 2, economy: 'Makati', realGdp: '₱1.266T', ncrShare: '17.49%' },
  { rank: 3, economy: 'Manila', realGdp: '₱1.061T', ncrShare: '14.65%' },
  { rank: 4, economy: 'Taguig', realGdp: '₱686.68B', ncrShare: '9.48%' },
  { rank: 5, economy: 'Pasig', realGdp: '₱541.59B', ncrShare: '7.48%' },
  { rank: 6, economy: 'Parañaque', realGdp: '₱383.76B', ncrShare: '5.30%' },
  { rank: 7, economy: 'Pasay', realGdp: '₱379.07B', ncrShare: '5.23%' },
  { rank: 8, economy: 'Mandaluyong', realGdp: '₱332.54B', ncrShare: '4.59%' },
  { rank: 9, economy: 'Muntinlupa', realGdp: '₱284.19B', ncrShare: '3.92%' },
  { rank: 10, economy: 'Caloocan', realGdp: '₱259.15B', ncrShare: '3.58%' },
];

const projectionRows = [
  {
    scenario: 'Low',
    assumption: '2.0% yearly',
    y2030: '₱1.398T',
    y2035: '₱1.544T',
    y2040: '₱1.704T',
    nationalShare: '4.11%',
  },
  {
    scenario: 'Base',
    assumption: '4.5% yearly',
    y2030: '₱1.578T',
    y2035: '₱1.967T',
    y2040: '₱2.451T',
    nationalShare: '5.91%',
  },
  {
    scenario: 'High',
    assumption: '6.5% yearly',
    y2030: '₱1.735T',
    y2035: '₱2.377T',
    y2040: '₱3.257T',
    nationalShare: '7.85%',
  },
];

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'makati-2025-economy-gdp-outlook',
    date: '8 October 2026',
    headline: 'Makati’s ₱1.27-Trillion Economy: What the 2025 GDP Record Shows',
    subheadline:
      'Makati remained the country’s second-largest local economy and generated 5.5% of Philippine GDP. Growth eased to 5.05%, finance supplied most of the increase, and construction and real estate contracted.',
    synthesis:
      'The 2025 accounts show a very large but concentrated urban production base. Makati produced ₱1.266 trillion at constant 2018 prices, second only to Quezon City nationwide, while finance, business services and trade generated more than four-fifths of measured output. That scale supports resilience, but also exposes Makati to financial, office and property cycles. GDP per person is exceptionally high because production generated by firms and commuters is divided by the resident population; it is not the income, salary or wealth of an average Makatizen.',
    sections: [
      {
        id: 'key-findings',
        heading: 'Key findings',
        blocks: [
          {
            kind: 'stat',
            label: '2025 real GDP',
            value: '₱1.266 trillion',
            detail: 'Constant 2018 prices; 5.05% above 2024',
            evidence: {
              sourceIds: ['1', '3', '4'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'stat',
            label: 'National position',
            value: 'No. 2',
            detail: '5.5% of Philippine GDP; behind Quezon City',
            evidence: { sourceIds: ['1'], records: [records.nationalShare] },
          },
          {
            kind: 'stat',
            label: 'NCR position',
            value: 'No. 2',
            detail: '17.49% of NCR output',
            evidence: { sourceIds: ['2', '3'], records: [records.ncrShare] },
          },
          {
            kind: 'stat',
            label: 'Real GDP per person',
            value: '₱4.265 million',
            detail: 'Production per resident, not resident income',
            evidence: {
              sourceIds: ['6'],
              records: [records.perCapita, records.population],
            },
          },
        ],
      },
      {
        id: 'trajectory',
        heading:
          'Output exceeded its pre-pandemic peak, with a geography break in 2022',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'PSA’s latest table places Makati GDP at ₱1.544 trillion in current prices and ₱1.266 trillion at constant 2018 prices in 2025. Real output grew 5.05%, slower than 7.43% in 2024 but faster than the 4.4% national expansion. The real level was 19.9% above 2019 and 28.2% above the 2020 low.',
            evidence: {
              sourceIds: ['1', '3', '4'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'table',
            title: 'Makati GDP, 2018–2025',
            caption:
              'PSA values are shown at current prices and constant 2018 prices. The 2022 boundary note prevents treating the full line as one unchanged-geography series.',
            columns: [
              { key: 'year', label: 'Year' },
              { key: 'current', label: 'Current-price GDP', align: 'right' },
              { key: 'real', label: 'Real GDP (2018 prices)', align: 'right' },
              { key: 'growth', label: 'Real growth', align: 'right' },
              { key: 'geography', label: 'Geography note' },
            ],
            rows: gdpRows,
            evidence: {
              sourceIds: ['3', '4', '7'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'chart',
            chartType: 'line',
            title: 'Real GDP and annual growth',
            caption:
              'The level series uses constant 2018 prices. A structural geography break applies from 2022 because PSA excludes the transferred EMBO barangays.',
            valueLabel: '₱ billion / percent',
            series: [
              {
                label: 'Real GDP (₱B)',
                points: [
                  { label: '2018', value: 991.89 },
                  { label: '2019', value: 1056.37 },
                  { label: '2020', value: 988.02 },
                  { label: '2021', value: 1038.03 },
                  { label: '2022', value: 1055.0 },
                  { label: '2023', value: 1122.29 },
                  { label: '2024', value: 1205.62 },
                  { label: '2025', value: 1266.46 },
                ],
              },
              {
                label: 'Real growth (%)',
                points: [
                  { label: '2019', value: 6.5 },
                  { label: '2020', value: -6.47 },
                  { label: '2021', value: 5.06 },
                  { label: '2022', value: 1.64 },
                  { label: '2023', value: 6.38 },
                  { label: '2024', value: 7.43 },
                  { label: '2025', value: 5.05 },
                ],
              },
            ],
            evidence: {
              sourceIds: ['3', '4'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text: 'The 2022 value cannot be read as a clean before-and-after estimate of the boundary ruling. PSA retroactively excludes EMBO from Makati starting in 2022, while earlier observations retain the older geography. The table therefore documents two official segments rather than a single boundary-neutral growth history.',
            evidence: { sourceIds: ['3', '4', '7'] },
          },
        ],
      },
      {
        id: 'rank-and-scale',
        heading:
          'Makati remained the second-largest economy in NCR and the Philippines',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Quezon City led the country at ₱1.40 trillion in real GDP. Makati followed at ₱1.27 trillion, equal to 5.5% of national GDP. Within NCR, Makati generated 17.49% of the region’s ₱7.243-trillion economy. Manila ranked third nationally at ₱1.06 trillion.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [records.level, records.nationalShare, records.ncrShare],
            },
          },
          {
            kind: 'table',
            title: 'Largest NCR economies in 2025',
            caption:
              'Constant 2018 prices; NCR shares calculated from the same PSA table.',
            columns: [
              { key: 'rank', label: 'NCR rank', align: 'right' },
              { key: 'economy', label: 'Economy' },
              { key: 'realGdp', label: 'Real GDP', align: 'right' },
              { key: 'ncrShare', label: 'NCR share', align: 'right' },
            ],
            rows: ncrRows,
            evidence: {
              sourceIds: ['2', '3'],
              records: [records.level, records.ncrShare],
            },
          },
        ],
      },
      {
        id: 'sector-structure',
        heading:
          'Finance drove most of the increase; construction and real estate were drags',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Financial and insurance activities produced ₱618.11 billion, or 48.81% of Makati’s real GDP, and accounted for 57.21% of the 2024–2025 increase. Professional and business services supplied another 22.32% of the increase, while trade supplied 16.69%. Construction contracted 13.51%, real estate 2.06%, and utilities 2.63%. Health and social work was the fastest-growing published sector at 11.03%, but its 1.62% share made its absolute contribution smaller.',
            evidence: { sourceIds: ['5'], records: [records.industry] },
          },
          {
            kind: 'table',
            title: 'Sector performance in 2025',
            caption:
              'Real GVA at constant 2018 prices. “Growth contribution” is each sector’s change divided by the total increase in Makati real GDP; agriculture and mining are suppressed by PSA.',
            columns: [
              { key: 'sector', label: 'Sector' },
              { key: 'realGva', label: '2025 real GVA', align: 'right' },
              { key: 'share', label: 'GDP share', align: 'right' },
              { key: 'growth', label: 'Real growth', align: 'right' },
              {
                key: 'growthContribution',
                label: 'Share of net growth',
                align: 'right',
              },
            ],
            rows: sectorRows,
            evidence: { sourceIds: ['5'], records: [records.industry] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The data support a concentration finding, not a simple causal story. Makati’s scale and recovery were anchored in finance, business services and trade. The same concentration means a financial slowdown, weaker office demand or property correction could have an outsized effect. PSA’s production accounts alone do not identify whether interest rates, hybrid work, individual projects or firm relocations caused the 2025 sector movements.',
            evidence: { sourceIds: ['5'] },
          },
        ],
      },
      {
        id: 'per-capita',
        heading: 'GDP per person is not what the average resident earns',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'PSA reports Makati real GDP per person at ₱4.265 million in 2025 and current-price GDP per person at ₱5.201 million. The indicator divides production within Makati by the population denominator. It does not divide corporate value added among residents and is not a measure of household income, wages, wealth, poverty or inequality.',
            evidence: {
              sourceIds: ['6'],
              records: [records.perCapita, records.population],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Makati’s large commuter and daytime workforce makes the ratio unusually high: workers and firms generate output inside the city even when many workers live elsewhere. The post-EMBO denominator further raises comparability concerns because PSA excludes the transferred barangays from Makati starting in 2022. The sharp change in the published per-capita series should therefore be read as a population-and-geography issue as well as an economic one.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'outlook',
        heading:
          'Future outlook: three mechanical real-growth paths, not official forecasts',
        blocks: [
          {
            kind: 'paragraph',
            role: 'context',
            text: 'BetterMakati compounds the 2025 real-GDP base of ₱1.266 trillion at fixed annual rates: 2.0% low, 4.5% base and 6.5% high. These paths show sensitivity to assumptions; they are not PSA, city or market forecasts. The national-share illustration assumes Philippine real GDP grows 4.0% yearly and starts from Makati’s published 5.5% share.',
            evidence: { sourceIds: ['1', '3'] },
          },
          {
            kind: 'table',
            title: 'Mechanical real-GDP scenarios',
            caption:
              'Constant 2018 prices. National share shown for 2040 under a 4.0% annual national-growth assumption.',
            columns: [
              { key: 'scenario', label: 'Scenario' },
              { key: 'assumption', label: 'Makati real growth' },
              { key: 'y2030', label: '2030', align: 'right' },
              { key: 'y2035', label: '2035', align: 'right' },
              { key: 'y2040', label: '2040', align: 'right' },
              {
                key: 'nationalShare',
                label: '2040 national share',
                align: 'right',
              },
            ],
            rows: projectionRows,
            evidence: {
              sourceIds: ['1', '3'],
              records: [records.level, records.nationalShare],
            },
          },
          {
            kind: 'chart',
            chartType: 'line',
            title: 'Scenario range for real GDP',
            caption:
              'Pure compounding from the 2025 PSA base; constant 2018 prices.',
            valueLabel: '₱ trillion',
            series: [
              {
                label: 'Low: 2.0%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.398 },
                  { label: '2035', value: 1.544 },
                  { label: '2040', value: 1.704 },
                ],
              },
              {
                label: 'Base: 4.5%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.578 },
                  { label: '2035', value: 1.967 },
                  { label: '2040', value: 2.451 },
                ],
              },
              {
                label: 'High: 6.5%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.735 },
                  { label: '2035', value: 2.377 },
                  { label: '2040', value: 3.257 },
                ],
              },
            ],
            evidence: { sourceIds: ['1', '3'], records: [records.level] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Upside would come from sustained finance and professional-services productivity, health-sector expansion, successful redevelopment, improved transport connectivity and reliable low-carbon energy. Downside risks include financial and office-property cycles, prolonged hybrid-work effects, weak construction, infrastructure delays and climate or energy disruption. These are qualitative transmission channels, not quantified project benefits. A future update should revise the paths when new PPA benchmarks, population projections or firm-level evidence become available.',
            evidence: { sourceIds: ['3', '5', '6'] },
          },
        ],
      },
      {
              id: 'policy-accountability',
              heading: 'Who should act on the risks in Makati\'s 2025 economy?',
              blocks: [
                {
                  kind: 'paragraph',
                  role: 'context',
                  text: 'These are BetterMakati recommendations informed by published economic structure, not adopted policies or official forecasts. PSA GDP data do not directly measure jobs, household welfare, office vacancy or service quality; those outcomes need separate evidence.',
                  evidence: {
                    sourceIds: [
                      '3',
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'industry-gva',
                        href: '/statistics#indicator-industry-gva',
                      },
                      {
                        recordType: 'statistics-indicator',
                        id: 'gdp-per-capita',
                        href: '/statistics#indicator-gdp-per-capita',
                      },
                    ],
                  },
                },
                {
                  kind: 'table',
                  title: 'Suggested responsibilities and public measures',
                  columns: [
                    {
                      key: 'actor',
                      label: 'Responsible actor',
                    },
                    {
                      key: 'action',
                      label: 'Suggested action',
                    },
                    {
                      key: 'measure',
                      label: 'Public measure',
                    },
                  ],
                  rows: [
                    {
                      actor: 'Mayor; city planning and economic-development offices',
                      action: 'Publish business-location and sector-diversification plans with baselines, targets and annual review.',
                      measure: 'Sector GVA shares, business openings/closures and employment trends with sources.',
                    },
                    {
                      actor: 'City council; budget and procurement offices',
                      action: 'Disclose costs, alternatives, funding and later evaluation for development projects and incentives.',
                      measure: 'Project costs, funding, procurement milestones, completion and outcomes.',
                    },
                    {
                      actor: 'DOTr, DPWH and MMDA; Makati traffic offices',
                      action: 'Coordinate commuter and pedestrian access across boundaries; distinguish national and city powers.',
                      measure: 'Route reliability, accessible sidewalks, crash/flood disruption, project milestones.',
                    },
                    {
                      actor: 'DOLE, TESDA, schools, employers and business associations',
                      action: 'Align training and placements to professional, digital and health-related demand, including lower-income residents.',
                      measure: 'Completion, placement, retention and wages, with privacy-safe breakdowns when possible.',
                    },
                    {
                      actor: 'BSP and national financial regulators; industry',
                      action: 'Monitor financial-sector risks under national mandates; city hall can coordinate resilience but does not supervise banks.',
                      measure: 'Regulator-published stability indicators and separately sourced local exposure measures.',
                    },
                  ],
                  evidence: {
                    sourceIds: [
                      '3',
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'industry-gva',
                        href: '/statistics#indicator-industry-gva',
                      },
                    ],
                  },
                },
                {
                  kind: 'paragraph',
                  role: 'analysis',
                  text: 'Assess any local economic platform against a published baseline, responsible office, funding route, delivery date and outcome measure. A high GDP per resident does not establish high household incomes; finance-led growth alone does not show broadly shared benefits.',
                  evidence: {
                    sourceIds: [
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'gdp-per-capita',
                        href: '/statistics#indicator-gdp-per-capita',
                      },
                    ],
                  },
                },
              ],
            },
    ],
    sources: [
      {
        id: '1',
        label: '2025 economic performance of 82 provinces and 33 HUCs',
        href: 'https://psa.gov.ph/content/psa-releases-2025-economic-performance-82-provinces-and-33-highly-urbanized-cities',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '28 August 2026',
        checkedOn,
      },
      {
        id: '2',
        label: 'All NCR economies expand in 2025',
        href: 'https://psa.gov.ph/content/all-economies-ncr-expand-2025-city-pasig-and-pasay-city-lead-terms-gdp-growth',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '6 October 2026',
        checkedOn,
      },
      {
        id: '3',
        label: 'Gross Domestic Product by Province and HUC',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0012A5FPPA0.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority OpenSTAT',
        publishedOrPeriod: '2018–2025 series; accessed 8 October 2026',
        checkedOn,
      },
      {
        id: '4',
        label: 'GDP growth rates by Province and HUC',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0032A5FPPA2.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority OpenSTAT',
        publishedOrPeriod: '2018–2019 to 2024–2025',
        checkedOn,
      },
      {
        id: '5',
        label: 'GDP by industry, Province and HUC',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0022A5FPPA1.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority OpenSTAT',
        publishedOrPeriod: '2024–2025 sector values',
        checkedOn,
      },
      {
        id: '6',
        label: 'Per Capita GDP by Province and HUC',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0092A5FPPA8.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority OpenSTAT',
        publishedOrPeriod: '2018–2025 series',
        checkedOn,
      },
      {
        id: '7',
        label: 'EMBO: How a boundary ruling reshaped Makati and Taguig',
        href: '/reports/embo-makati-taguig-transition',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod: 'Evidence through 3 October 2026',
        checkedOn,
      },
    ],
    methodology: {
      title: 'Method and limitations',
      text: 'All historical levels, growth rates and sector values come from the 2025 PSA PPA vintage. Real series use constant 2018 prices; current-price figures are nominal. Values displayed in billions or trillions are rounded from PSA tables reported in thousand pesos. Sector shares and contributions are BetterMakati calculations from same-vintage real values. PSA suppresses agriculture and mining cells. The 2022 geography break and preliminary 2020-based population projection limit comparisons. Scenario values are deterministic compound-growth illustrations and must not be presented as forecasts.',
      evidence: { sourceIds: ['3', '4', '5', '6', '7'] },
    },
  },
  fil: {
    headline:
      'Ang ₱1.27-Trillion Economy ng Makati: Ano ang Sinasabi ng 2025 GDP Record',
    subheadline:
      'Nanatiling second-largest local economy sa bansa ang Makati at gumawa ng 5.5% ng Philippine GDP. Bumagal sa 5.05% ang growth, finance ang pangunahing source ng increase, habang lumiit ang construction at real estate.',
    synthesis:
      'Ipinapakita ng 2025 accounts ang isang napakalaki pero concentrated na urban production base. Umabot sa ₱1.266 trillion at constant 2018 prices ang output ng Makati, pangalawa sa Quezon City, habang finance, business services at trade ang gumawa ng mahigit apat na fifths ng measured output. Source ito ng resilience pero exposure rin sa financial, office at property cycles. Mataas ang GDP per person dahil hinahati ang production ng firms at commuters sa resident population; hindi ito average income, salary o wealth ng Makatizen.',
    sections: [
      {
        id: 'key-findings',
        heading: 'Key findings',
        blocks: [
          {
            kind: 'stat',
            label: '2025 real GDP',
            value: '₱1.266 trillion',
            detail: 'Constant 2018 prices; 5.05% above 2024',
            evidence: {
              sourceIds: ['1', '3', '4'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'stat',
            label: 'National position',
            value: 'No. 2',
            detail: '5.5% ng Philippine GDP; kasunod ng Quezon City',
            evidence: { sourceIds: ['1'], records: [records.nationalShare] },
          },
          {
            kind: 'stat',
            label: 'NCR position',
            value: 'No. 2',
            detail: '17.49% ng NCR output',
            evidence: { sourceIds: ['2', '3'], records: [records.ncrShare] },
          },
          {
            kind: 'stat',
            label: 'Real GDP per person',
            value: '₱4.265 million',
            detail: 'Production per resident, hindi resident income',
            evidence: {
              sourceIds: ['6'],
              records: [records.perCapita, records.population],
            },
          },
        ],
      },
      {
        id: 'trajectory',
        heading:
          'Lumampas sa pre-pandemic peak ang output, pero may geography break noong 2022',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Sa latest PSA table, ₱1.544 trillion sa current prices at ₱1.266 trillion sa constant 2018 prices ang Makati GDP noong 2025. Lumago ang real output ng 5.05%, mas mabagal sa 7.43% noong 2024 pero mas mabilis sa 4.4% national growth. Mas mataas nang 19.9% ang real level kaysa 2019 at 28.2% kaysa 2020 low.',
            evidence: {
              sourceIds: ['1', '3', '4'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'table',
            title: 'Makati GDP, 2018–2025',
            caption:
              'Current prices at constant 2018 prices ang ipinapakita. Dahil sa 2022 boundary note, hindi ito isang unchanged-geography series.',
            columns: [
              { key: 'year', label: 'Year' },
              { key: 'current', label: 'Current-price GDP', align: 'right' },
              { key: 'real', label: 'Real GDP (2018 prices)', align: 'right' },
              { key: 'growth', label: 'Real growth', align: 'right' },
              { key: 'geography', label: 'Geography note' },
            ],
            rows: gdpRows,
            evidence: {
              sourceIds: ['3', '4', '7'],
              records: [records.level, records.growth],
            },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text: 'Hindi puwedeng basahin ang 2022 value bilang malinis na before-and-after estimate ng boundary ruling. Inaalis ng PSA ang EMBO sa Makati starting 2022, habang old geography pa ang earlier observations. Dalawang official segments ito, hindi isang boundary-neutral history.',
            evidence: { sourceIds: ['3', '4', '7'] },
          },
        ],
      },
      {
        id: 'rank-and-scale',
        heading:
          'Pangalawa pa rin ang Makati sa pinakamalalaking economy sa NCR at bansa',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Nanguna ang Quezon City sa ₱1.40 trillion real GDP. Sumunod ang Makati sa ₱1.27 trillion, katumbas ng 5.5% ng national GDP. Sa NCR, 17.49% ng ₱7.243-trillion regional economy ang mula sa Makati. Pangatlo ang Manila sa ₱1.06 trillion.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [records.level, records.nationalShare, records.ncrShare],
            },
          },
          {
            kind: 'table',
            title: 'Pinakamalalaking NCR economy noong 2025',
            caption:
              'Constant 2018 prices; kinuwenta ang NCR shares mula sa parehong PSA table.',
            columns: [
              { key: 'rank', label: 'NCR rank', align: 'right' },
              { key: 'economy', label: 'Economy' },
              { key: 'realGdp', label: 'Real GDP', align: 'right' },
              { key: 'ncrShare', label: 'NCR share', align: 'right' },
            ],
            rows: ncrRows,
            evidence: {
              sourceIds: ['2', '3'],
              records: [records.level, records.ncrShare],
            },
          },
        ],
      },
      {
        id: 'sector-structure',
        heading:
          'Finance ang nagdala ng malaking bahagi ng increase; drag ang construction at real estate',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Gumawa ang financial and insurance activities ng ₱618.11 billion, o 48.81% ng real GDP, at 57.21% ng 2024–2025 increase. Nag-ambag ng 22.32% ang professional and business services at 16.69% ang trade. Lumiit ng 13.51% ang construction, 2.06% ang real estate at 2.63% ang utilities. Pinakamabilis sa published sectors ang health and social work sa 11.03%, pero 1.62% lang ang share nito.',
            evidence: { sourceIds: ['5'], records: [records.industry] },
          },
          {
            kind: 'table',
            title: 'Sector performance noong 2025',
            caption:
              'Real GVA at constant 2018 prices. Ang growth contribution ay sector change bilang share ng total Makati real-GDP increase; suppressed ng PSA ang agriculture at mining.',
            columns: [
              { key: 'sector', label: 'Sector' },
              { key: 'realGva', label: '2025 real GVA', align: 'right' },
              { key: 'share', label: 'GDP share', align: 'right' },
              { key: 'growth', label: 'Real growth', align: 'right' },
              {
                key: 'growthContribution',
                label: 'Share of net growth',
                align: 'right',
              },
            ],
            rows: sectorRows,
            evidence: { sourceIds: ['5'], records: [records.industry] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Sinusuportahan ng data ang concentration finding, hindi isang simpleng causal story. Naka-anchor ang scale at recovery sa finance, business services at trade. Dahil dito, mas malaki rin ang possible effect ng financial slowdown, mahinang office demand o property correction. Hindi kayang tukuyin ng PSA production accounts lang kung interest rates, hybrid work, specific projects o firm relocations ang sanhi ng 2025 movements.',
            evidence: { sourceIds: ['5'] },
          },
        ],
      },
      {
        id: 'per-capita',
        heading: 'Hindi kinikita ng average resident ang GDP per person',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: '₱4.265 million ang Makati real GDP per person noong 2025 at ₱5.201 million sa current prices. Hinahati ng indicator ang production sa loob ng Makati sa population denominator. Hindi nito hinahati ang corporate value added sa residents at hindi ito measure ng household income, wages, wealth, poverty o inequality.',
            evidence: {
              sourceIds: ['6'],
              records: [records.perCapita, records.population],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Pinapataas ng malaking commuter at daytime workforce ang ratio: gumagawa ng output sa Makati ang firms at workers kahit maraming workers ang nakatira sa ibang lugar. May additional comparability issue ang post-EMBO denominator dahil inaalis ng PSA ang transferred barangays starting 2022. Kaya population at geography issue rin ang malaking pagbabago sa published per-capita series.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'outlook',
        heading:
          'Future outlook: tatlong mechanical real-growth paths, hindi official forecasts',
        blocks: [
          {
            kind: 'paragraph',
            role: 'context',
            text: 'Kinompound ng BetterMakati ang 2025 real-GDP base na ₱1.266 trillion gamit ang fixed annual rates: 2.0% low, 4.5% base at 6.5% high. Sensitivity illustrations ito, hindi PSA, city o market forecasts. Para sa national-share illustration, 4.0% yearly ang assumed Philippine real growth at 5.5% ang starting Makati share.',
            evidence: { sourceIds: ['1', '3'] },
          },
          {
            kind: 'table',
            title: 'Mechanical real-GDP scenarios',
            caption:
              'Constant 2018 prices. Ang national share ay para sa 2040 kung 4.0% yearly ang national growth.',
            columns: [
              { key: 'scenario', label: 'Scenario' },
              { key: 'assumption', label: 'Makati real growth' },
              { key: 'y2030', label: '2030', align: 'right' },
              { key: 'y2035', label: '2035', align: 'right' },
              { key: 'y2040', label: '2040', align: 'right' },
              {
                key: 'nationalShare',
                label: '2040 national share',
                align: 'right',
              },
            ],
            rows: projectionRows,
            evidence: {
              sourceIds: ['1', '3'],
              records: [records.level, records.nationalShare],
            },
          },
          {
            kind: 'chart',
            chartType: 'line',
            title: 'Scenario range ng real GDP',
            caption:
              'Pure compounding mula sa 2025 PSA base; constant 2018 prices.',
            valueLabel: '₱ trillion',
            series: [
              {
                label: 'Low: 2.0%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.398 },
                  { label: '2035', value: 1.544 },
                  { label: '2040', value: 1.704 },
                ],
              },
              {
                label: 'Base: 4.5%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.578 },
                  { label: '2035', value: 1.967 },
                  { label: '2040', value: 2.451 },
                ],
              },
              {
                label: 'High: 6.5%',
                points: [
                  { label: '2025', value: 1.266 },
                  { label: '2030', value: 1.735 },
                  { label: '2035', value: 2.377 },
                  { label: '2040', value: 3.257 },
                ],
              },
            ],
            evidence: { sourceIds: ['1', '3'], records: [records.level] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Possible upside ang sustained finance at professional-services productivity, health expansion, successful redevelopment, better transport connectivity at reliable low-carbon energy. Downside risks ang financial at office-property cycles, matagal na hybrid-work effects, weak construction, infrastructure delays at climate o energy disruption. Qualitative channels ito, hindi quantified project benefits.',
            evidence: { sourceIds: ['3', '5', '6'] },
          },
        ],
      },
      {
              id: 'policy-accountability',
              heading: 'Sino ang dapat kumilos sa mga risk ng 2025 economy?',
              blocks: [
                {
                  kind: 'paragraph',
                  role: 'context',
                  text: 'Mga rekomendasyon ito ng BetterMakati batay sa published economic structure, hindi adopted city policies o official forecasts. Hindi direktang sinusukat ng PSA GDP ang jobs, household welfare, office vacancy o service quality; kailangan ng hiwalay na ebidensiya.',
                  evidence: {
                    sourceIds: [
                      '3',
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'industry-gva',
                        href: '/statistics#indicator-industry-gva',
                      },
                      {
                        recordType: 'statistics-indicator',
                        id: 'gdp-per-capita',
                        href: '/statistics#indicator-gdp-per-capita',
                      },
                    ],
                  },
                },
                {
                  kind: 'table',
                  title: 'Mga mungkahing responsibilidad at public measures',
                  columns: [
                    {
                      key: 'actor',
                      label: 'Responsableng actor',
                    },
                    {
                      key: 'action',
                      label: 'Mungkahing aksyon',
                    },
                    {
                      key: 'measure',
                      label: 'Dapat sukatin o i-publish',
                    },
                  ],
                  rows: [
                    {
                      actor: 'Mayor; city planning at economic-development offices',
                      action: 'Mag-publish ng business-location at sector-diversification plans na may baseline, targets at annual review.',
                      measure: 'Sector GVA shares, bagong at nagsarang negosyo, employment trends at sources.',
                    },
                    {
                      actor: 'City council; budget at procurement offices',
                      action: 'Ilahad ang costs, alternatives, funding at later evaluation ng development projects at incentives.',
                      measure: 'Project costs, funding, procurement milestones, completion at outcomes.',
                    },
                    {
                      actor: 'DOTr, DPWH at MMDA; Makati traffic offices',
                      action: 'I-coordinate ang commuter at pedestrian access across boundaries; linawin ang national at city powers.',
                      measure: 'Route reliability, accessible sidewalks, crash o flood disruptions at project milestones.',
                    },
                    {
                      actor: 'DOLE, TESDA, schools, employers at business associations',
                      action: 'Iayon ang training at placements sa professional, digital at health-related demand, kasama ang lower-income residents.',
                      measure: 'Completion, placement, retention at wages, na may privacy-safe breakdowns kung available.',
                    },
                    {
                      actor: 'BSP at national financial regulators; industry',
                      action: 'Subaybayan ang financial-sector risks sa national mandates; puwedeng makipag-coordinate ang city hall pero hindi ito bank supervisor.',
                      measure: 'Regulator-published stability indicators at hiwalay na sourced local exposure measures.',
                    },
                  ],
                  evidence: {
                    sourceIds: [
                      '3',
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'industry-gva',
                        href: '/statistics#indicator-industry-gva',
                      },
                    ],
                  },
                },
                {
                  kind: 'paragraph',
                  role: 'analysis',
                  text: 'Suriin ang local economic platform gamit ang published baseline, responsableng opisina, funding source, delivery date at outcome measure. Hindi patunay ng mataas na household income ang mataas na GDP per resident; hindi rin automatic na broadly shared ang gains ng finance-led growth.',
                  evidence: {
                    sourceIds: [
                      '5',
                      '6',
                    ],
                    records: [
                      {
                        recordType: 'statistics-indicator',
                        id: 'gdp-per-capita',
                        href: '/statistics#indicator-gdp-per-capita',
                      },
                    ],
                  },
                },
              ],
            },
    ],
    methodology: {
      title: 'Method at limitations',
      text: 'Galing sa 2025 PSA PPA vintage ang historical levels, growth rates at sector values. Constant 2018 prices ang real series; nominal ang current-price figures. Rounded mula sa PSA thousand-peso tables ang billions at trillions. BetterMakati calculations mula sa same-vintage real values ang sector shares at contributions. Suppressed ng PSA ang agriculture at mining. Nililimitahan ng 2022 geography break at preliminary 2020-based population projection ang comparisons. Deterministic compounding illustrations ang scenarios, hindi forecasts.',
      evidence: { sourceIds: ['3', '4', '5', '6', '7'] },
    },
  },
};

export default reportModule;
