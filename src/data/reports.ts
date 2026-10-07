import {
  actualSpendingByFunction,
  budgetByType,
  budgetByType2026,
  budgetByTypeCurrentEstimate2025,
  budgetCurrentEstimate2025,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  localRevenueBreakdown,
  revenueSources,
} from './budget2025';
import {
  barangays,
  currentMakatiPopulation2024,
  psaBarangaySource,
} from './barangays';
import {
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
} from './cityIndicators';
import {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
  integrityAuditSources,
} from './integrityAuditTrails';
import type { FeaturedReportV2, ReportContentBlock, ReportSourceV2 } from './reportTypes';

const reportPublishedOn = '26 September 2026';
const reviewedOn = reportPublishedOn;

const moneyB = (millions: number) =>
  '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';

const moneyM = (millions: number) =>
  '₱' +
  millions.toLocaleString('en-PH', {
    minimumFractionDigits: Number.isInteger(millions) ? 0 : 2,
    maximumFractionDigits: 3,
  }) +
  'M';

const percent = (value: number) => value.toFixed(1) + '%';

const pctChange = (from: number, to: number) =>
  ((to - from) / from) * 100;

const adoptedMooe =
  budgetByType.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
const proposedMooe =
  budgetByType2026.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
const currentEstimateMooe =
  budgetByTypeCurrentEstimate2025.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;

const adoptedIncreaseM =
  budgetSummary2026.totalBudgetM - budgetSummary.totalBudgetM;
const mooeIncreaseM = proposedMooe - adoptedMooe;
const mooeShareOfIncrease =
  adoptedIncreaseM === 0 ? 0 : (mooeIncreaseM / adoptedIncreaseM) * 100;
const proposedVsCurrentEstimate = pctChange(
  budgetCurrentEstimate2025.totalAppropriationM,
  budgetSummary2026.totalBudgetM
);

const budgetComponentRows = [
  {
    component: 'Personal Services',
    adopted2025:
      budgetByType.find(item => item.label === 'Personal Services')?.amountM ??
      0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Personal Services'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Personal Services')
        ?.amountM ?? 0,
  },
  {
    component: 'Maintenance & Other Operating Expenses',
    adopted2025: adoptedMooe,
    currentEstimate2025: currentEstimateMooe,
    proposed2026: proposedMooe,
  },
  {
    component: 'Capital Outlay',
    adopted2025:
      budgetByType.find(item => item.label === 'Capital Outlay')?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Capital Outlay'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Capital Outlay')?.amountM ??
      0,
  },
  {
    component: 'Special Purpose Appropriations',
    adopted2025:
      budgetByType.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
  },
];

const localReceipts = revenueSources.find(
  item => item.label === 'Local sources'
);
const externalReceipts = revenueSources.find(
  item => item.label === 'External sources'
);
const nonIncomeReceipts = revenueSources.find(
  item => item.label === 'Non-income receipts'
);
const businessTax = localRevenueBreakdown.find(
  item => item.label === 'Business tax'
);
const basicRPT = localRevenueBreakdown.find(
  item => item.label === 'Basic real property tax'
);
const sefTax = localRevenueBreakdown.find(
  item => item.label === 'Special Education Fund tax'
);
const topThreeLocalRevenueM =
  (businessTax?.amountM ?? 0) +
  (basicRPT?.amountM ?? 0) +
  (sefTax?.amountM ?? 0);
const topThreeLocalRevenueShare =
  localReceipts?.amountM
    ? (topThreeLocalRevenueM / localReceipts.amountM) * 100
    : 0;
const socialServices = actualSpendingByFunction.find(
  item => item.label === 'Social Services'
);

const sortedBarangays = [...barangays].sort(
  (a, b) => b.population2024 - a.population2024
);
const topThreeBarangays = sortedBarangays.slice(0, 3);
const topThreePopulation = topThreeBarangays.reduce(
  (sum, barangay) => sum + barangay.population2024,
  0
);
const topThreePopulationShare =
  (topThreePopulation / currentMakatiPopulation2024) * 100;
const smallestBarangay = sortedBarangays.at(-1);
const largestBarangay = sortedBarangays[0];
const largestToSmallestRatio =
  largestBarangay && smallestBarangay
    ? largestBarangay.population2024 / smallestBarangay.population2024
    : 0;
const barangaysUnder6000 = sortedBarangays.filter(
  barangay => barangay.population2024 < 6000
);


const populationIndicator = cityIndicatorById.get('population-total');
const populationGrowthIndicator = cityIndicatorById.get('population-growth-rate');
const populationTrend = cityIndicatorObservations('population-total');
const populationGrowthTrend = cityIndicatorObservations('population-growth-rate');
const populationGrowthSource =
  cityIndicatorSources['psa-openstat-population-growth-2024'];
const currentBoundarySource =
  cityIndicatorSources['psa-psgc-makati-current'];

if (
  !populationIndicator ||
  !populationGrowthIndicator ||
  !populationGrowthSource ||
  !currentBoundarySource
) {
  throw new Error('Population flagship report requires canonical Wave 4 indicator metadata.');
}

const numericObservation = (
  value: number | string | boolean | undefined,
  label: string
) => {
  if (typeof value !== 'number') {
    throw new Error('Population flagship report requires numeric ' + label + '.');
  }
  return value;
};

const population2010 = numericObservation(populationTrend[0]?.value, '2010 population');
const population2015 = numericObservation(populationTrend[1]?.value, '2015 population');
const population2020 = numericObservation(populationTrend[2]?.value, '2020 population');
const population2024 = numericObservation(populationTrend[3]?.value, '2024 population');
const growth2010to2015 = numericObservation(
  populationGrowthTrend[0]?.value,
  '2010–2015 growth rate'
);
const growth2015to2020 = numericObservation(
  populationGrowthTrend[1]?.value,
  '2015–2020 growth rate'
);
const growth2020to2024 = numericObservation(
  populationGrowthTrend[2]?.value,
  '2020–2024 growth rate'
);
const populationAdded2020to2024 = population2024 - population2020;
const growthAccelerationPp = growth2020to2024 - growth2015to2020;


const auditSourceById = new Map(
  integrityAuditSources.map(source => [source.id, source] as const)
);

const auditRegistryToReportSourceId: Record<string, string> = {
  'coa-annual-audit-reports': '3',
  'gma-2018-development-fund-finding': '4',
  'gma-2018-development-fund-city-response': '5',
  'coa-makati-2018-audit-archive': '6',
  'makati-2018-unliquidated-cash-advances': '7',
  'makati-deped-sef-q4-2024': '8',
  'coa-makati-sef-compliance-2024': '9',
};

const auditReportSourceIds = (registryIds: string[]) => {
  const mapped = registryIds
    .map(id => auditRegistryToReportSourceId[id])
    .filter((id): id is string => Boolean(id));
  return ['1', ...new Set(mapped)] as [string, ...string[]];
};

const auditFindingsWithTrails = integrityAuditFindings.map(finding => {
  const trail = integrityAuditResolutionTrails.find(
    candidate => candidate.findingId === finding.id
  );
  if (!trail) {
    throw new Error('Records flagship requires an audit trail for ' + finding.id);
  }
  const actions = integrityAuditActions.filter(
    action => action.findingId === finding.id
  );
  return { finding, trail, actions };
});

if (
  auditFindingsWithTrails.length !== 3 ||
  !auditFindingsWithTrails.every(
    item => item.trail.resolution.status === 'unresolved'
  )
) {
  throw new Error(
    'Records flagship expects exactly three finding-level audit trails without item-specific closure.'
  );
}

const auditDirectSource = (registryId: string) => {
  const source = auditSourceById.get(registryId);
  if (!source) {
    throw new Error('Records flagship source missing: ' + registryId);
  }
  const id = auditRegistryToReportSourceId[registryId];
  if (!id) {
    throw new Error('Records flagship source mapping missing: ' + registryId);
  }
  return {
    id,
    label: source.label,
    href: source.url,
    sourceKind:
      source.sourceClass === 'secondary-reporting'
        ? ('secondary' as const)
        : ('official-external' as const),
    publisher: source.publisher,
    publishedOrPeriod: source.publishedOrPeriod,
    checkedOn: reviewedOn,
  };
};

const auditFollowUpSourceIds = (findingId: string) =>
  auditReportSourceIds(
    integrityAuditActions
      .filter(action => action.findingId === findingId)
      .flatMap(action => action.sourceIds)
  );

const auditFindingSourceIds = (findingId: string) => {
  const finding = integrityAuditFindings.find(item => item.id === findingId);
  if (!finding) {
    throw new Error('Records flagship finding missing: ' + findingId);
  }
  return auditReportSourceIds(finding.sourceIds);
};


const recordsFlagshipSources: [ReportSourceV2, ...ReportSourceV2[]] = [
  {
    id: '1',
    label: 'Integrity — audit finding trails',
    href: '/integrity#audits',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note: 'Canonical finding, action-evidence and resolution-trail records.',
    checkedOn: reviewedOn,
  },
  {
    id: '2',
    label: 'Accountability — audit ledger',
    href: '/accountability?type=audit',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note:
      'Underlying canonical Accountability entries from which finding-level records are derived.',
    checkedOn: reviewedOn,
  },
  ...[
    'coa-annual-audit-reports',
    'gma-2018-development-fund-finding',
    'gma-2018-development-fund-city-response',
    'coa-makati-2018-audit-archive',
    'makati-2018-unliquidated-cash-advances',
    'makati-deped-sef-q4-2024',
    'coa-makati-sef-compliance-2024',
  ].map(auditDirectSource),
];

export const reports: FeaturedReportV2[] = [
  {
    schemaVersion: 2,
    slug: '2026-budget-operating-expenses',
    date: reportPublishedOn,
    headline:
      'Makati’s 2026 budget proposal is above the adopted 2025 plan but below the city’s later 2025 estimate',
    subheadline:
      `${moneyB(budgetSummary2026.totalBudgetM)} proposed for 2026 is ${percent(
        pctChange(budgetSummary.totalBudgetM, budgetSummary2026.totalBudgetM)
      )} above the original 2025 budget, while remaining ${percent(
        Math.abs(proposedVsCurrentEstimate)
      )} below the 2025 current-year estimate shown in the same budget cycle.`,
    synthesis:
      `The 2026 proposal grows mainly through operating expenditure when compared with the original 2025 adopted plan, but the direction reverses when it is compared with the city’s higher 2025 current-year estimate.`,
    sections: [
      {
        id: 'two-baselines',
        heading: 'Two 2025 baselines tell different stories',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Makati’s proposed 2026 appropriation is ${moneyB(
                budgetSummary2026.totalBudgetM
              )}. Against the original ${moneyB(
                budgetSummary.totalBudgetM
              )} adopted 2025 plan, that is an increase of ${moneyB(
                adoptedIncreaseM
              )}, or ${percent(
                pctChange(
                  budgetSummary.totalBudgetM,
                  budgetSummary2026.totalBudgetM
                )
              )}. The 2026 Annual Budget Report also shows a later 2025 current-year estimate of ${moneyB(
                budgetCurrentEstimate2025.totalAppropriationM
              )}; against that estimate, the 2026 proposal is ${moneyB(
                budgetCurrentEstimate2025.totalAppropriationM -
                  budgetSummary2026.totalBudgetM
              )} lower.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
                {
                  recordType: 'accountability-entry',
                  id: '2026-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'table',
            title: 'Budget totals',
            columns: [
              { key: 'basis', label: 'Basis' },
              { key: 'amount', label: 'Amount', align: 'right' },
            ],
            rows: [
              {
                basis: '2025 adopted plan',
                amount: moneyB(budgetSummary.totalBudgetM),
              },
              {
                basis: '2025 current-year estimate',
                amount: moneyB(budgetCurrentEstimate2025.totalAppropriationM),
              },
              {
                basis: '2026 proposed appropriation',
                amount: moneyB(budgetSummary2026.totalBudgetM),
              },
            ],
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
        ],
      },
      {
        id: 'composition',
        heading: 'Most of the adopted-plan increase is MOOE',
        blocks: [
          {
            kind: 'stat',
            label: 'Share of the ₱2.0B adopted-plan increase attributable to MOOE',
            value: percent(mooeShareOfIncrease),
            detail:
              `MOOE rises by ${moneyB(mooeIncreaseM)} from the adopted 2025 plan to the proposed 2026 budget.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
          {
            kind: 'table',
            title: 'Major appropriation components',
            caption: 'Amounts in billions of pesos.',
            columns: [
              { key: 'component', label: 'Component' },
              { key: 'adopted2025', label: '2025 adopted', align: 'right' },
              {
                key: 'currentEstimate2025',
                label: '2025 current estimate',
                align: 'right',
              },
              { key: 'proposed2026', label: '2026 proposed', align: 'right' },
            ],
            rows: budgetComponentRows.map(row => ({
              component: row.component,
              adopted2025: moneyB(row.adopted2025),
              currentEstimate2025: moneyB(row.currentEstimate2025),
              proposed2026: moneyB(row.proposed2026),
            })),
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              `The phrase “budget increase” therefore needs a baseline. Relative to the original 2025 plan, MOOE explains ${percent(
                mooeShareOfIncrease
              )} of the increase. Relative to the later 2025 estimate, however, proposed 2026 MOOE is ${percent(
                Math.abs(pctChange(currentEstimateMooe, proposedMooe))
              )} lower. The public record supports a composition finding, not a conclusion about whether operating spending is excessive or efficient.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget — Makati budget comparison',
        href: '/projects-budget#budget',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note:
          'Canonical comparison of the 2025 adopted plan, 2025 current-year estimate and 2026 proposal.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'CY 2025 Annual Budget',
        href: budgetSources.annualBudget,
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2025',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: '2026 Annual Budget Report',
        href: budgetSources.annualBudget2026,
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2026 budget cycle',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text:
        'The 2025 adopted budget and the 2025 current-year estimate are different fiscal baselines. Percentage changes are computed separately against each; neither series is treated as interchangeable with reported full-year actual expenditure.',
      evidence: {
        sourceIds: ['1', '2', '3'],
      },
    },
  },
  {
    schemaVersion: 2,
    slug: '2025-fiscal-profile',
    date: reportPublishedOn,
    headline:
      'Makati’s 2025 receipts were overwhelmingly local while social services led reported spending',
    subheadline:
      `Local sources supplied ${percent(
        localReceipts?.share ?? 0
      )} of reported receipts, while Social Services accounted for ${percent(
        socialServices?.share ?? 0
      )} of reported expenditure.`,
    synthesis:
      'Makati’s reported 2025 fiscal profile combined a highly local revenue base with a spending mix dominated by Social Services, while the public fiscal tables do not trace particular taxes to particular programs.',
    sections: [
      {
        id: 'revenue',
        heading: 'Most reported receipts came from local sources',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Makati reported ${moneyB(
                budgetSummary.actualReceiptsM
              )} in 2025 receipts. Local sources accounted for ${moneyB(
                localReceipts?.amountM ?? 0
              )}, or ${percent(
                localReceipts?.share ?? 0
              )}. External sources contributed ${moneyB(
                externalReceipts?.amountM ?? 0
              )}, while non-income receipts accounted for ${moneyB(
                nonIncomeReceipts?.amountM ?? 0
              )}.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Local-source receipts',
            value: percent(localReceipts?.share ?? 0),
            detail:
              `${moneyB(localReceipts?.amountM ?? 0)} of ${moneyB(
                budgetSummary.actualReceiptsM
              )} in reported receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Within local revenue, Business Tax, Basic Real Property Tax and Special Education Fund Tax together produced ${moneyB(
                topThreeLocalRevenueM
              )}, or ${percent(
                topThreeLocalRevenueShare
              )} of local-source receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'Share of reported 2025 receipts',
            valueLabel: '%',
            series: [
              {
                label: 'Receipt source',
                points: revenueSources.map(item => ({
                  label: item.label,
                  value: item.share,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
        ],
      },
      {
        id: 'spending',
        heading: 'Social Services was the largest spending function',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Reported 2025 expenditure totaled ${moneyB(
                budgetSummary.actualExpendituresM
              )}. Social Services accounted for ${moneyB(
                socialServices?.amountM ?? 0
              )}, or ${percent(
                socialServices?.share ?? 0
              )}, exceeding the combined ${moneyB(
                budgetSummary.actualExpendituresM -
                  (socialServices?.amountM ?? 0)
              )} reported under all other functional categories.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'Share of reported 2025 expenditure',
            valueLabel: '%',
            series: [
              {
                label: 'Spending function',
                points: actualSpendingByFunction.map(item => ({
                  label: item.label,
                  value: item.share,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'These two distributions answer different questions. The receipt table describes where city revenue was recorded as coming from; the functional expenditure table describes how spending was classified. They do not establish that a specific tax funded a specific service, nor do expenditure shares by themselves measure program outcomes.',
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget — 2025 fiscal actuals',
        href: '/projects-budget#budget',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note:
          'Canonical 2025 receipts, local-revenue breakdown and expenditure-by-function tables.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'DBM/BLGF 2025 Statement of Receipts and Expenditures',
        href: budgetSources.actuals,
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management / BLGF',
        publishedOrPeriod: '2025 reported year',
        checkedOn: reviewedOn,
      },
    ],
  },
  {
    schemaVersion: 2,
    slug: '2024-barangay-population',
    date: reportPublishedOn,
    headline:
      'Makati’s largest barangay has more than eighteen times the resident population of its smallest',
    subheadline:
      `${largestBarangay?.name ?? 'Pio Del Pilar'} has ${(
        largestBarangay?.population2024 ?? 0
      ).toLocaleString()} residents, while ${smallestBarangay?.name ?? 'Carmona'} has ${(
        smallestBarangay?.population2024 ?? 0
      ).toLocaleString()}; the three largest barangays contain ${percent(
        topThreePopulationShare
      )} of the city’s 2024 population.`,
    synthesis:
      `Makati’s 23 barangays operate at sharply different resident-population scales: the largest is ${largestToSmallestRatio.toFixed(
        1
      )} times the smallest, while the }|�n��G����ƭy�d systems contractors engaged',
              },
              {
                milestoneDate: 'By Apr 2025 filing',
                milestone: 'Station 3 early works recorded',
                whatItProves:
                  'Excavation, shoring and mat foundations; not an operating railway',
              },
              {
                milestoneDate: '2 May 2025',
                milestone: 'Infradev declared project infeasible',
                whatItProves:
                  'Original continuation path ended and arbitration began',
              },
            ],
            evidence: { sourceIds: ['2', '3'] },
          },
        ],
      },
      {
        id: 'route-and-embo',
        heading:
          'The eastern end of the route was directly affected by the EMBO transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The public project description was for 10 underground stations over roughly 10–11 kilometres, running from Ayala–EDSA toward eastern Makati and the EMBO area. Reported key locations included Ayala Triangle, Makati City Hall, the University of Makati and Ospital ng Makati. The company filing places Station 3 around Gil Puyat–Dela Rosa–Urban and Station 5 along J.P. Rizal at the old City Hall.',
            evidence: {
              sourceIds: ['2', '4', '5'],
              records: [
                {
                  recordType: 'place',
                  id: 'makati-city-hall',
                  href: '/civic-map/makati-city-hall',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'After the Makati–Taguig boundary judgment became final, the planned depot and two station sites were in Taguig. Public reporting identified the affected stations as the University of Makati in West Rembo and Ospital ng Makati in Pembo. For an intra-city line whose economics depended on the full alignment and associated development, that was a material change in jurisdiction and project viability.',
            evidence: { sourceIds: ['3', '6', '7'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The boundary ruling did not make a railway across Makati and Taguig technically impossible. It did mean the original Makati-only joint venture could not continue unchanged. Any cross-boundary replacement would need a new intergovernmental, contractual, route and financing arrangement.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'exit-arbitration-settlement',
        heading:
          'The original partner exited; settlement followed, not a construction restart',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'On 2 May 2025, Infradev told the Philippine Stock Exchange that its board had found continuation under the 2019 joint venture no longer economically and operationally feasible and had commenced arbitration at the Singapore International Arbitration Centre. This is the clearest primary-source break in the original implementation path.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In January 2026, the Makati City Council authorized and ratified a new settlement framework through Resolutions 2026-008 and 2026-011. The reported exchange would transfer the project company and related assets to the city. The city archive title for Resolution 2026-011 refers to authorization under Resolution 2026-007, while Ordinance 2026-015 cross-references Resolutions 2026-008 and 2026-011; BetterMakati preserves that unresolved discrepancy rather than silently choosing one reference. On 18 February 2026, Infradev said the SIAC case remained pending and that the proceedings and negotiations were confidential; it did not publicly confirm the detailed commercial terms.',
            evidence: { sourceIds: ['8', '9'], records: [
              { recordType: 'legislation', id: 'resolution-2026-008', href: '/legislation?record=resolution-2026-008' },
              { recordType: 'legislation', id: 'resolution-2026-011', href: '/legislation?record=resolution-2026-011' },
              { recordType: 'legislation', id: 'ordinance-2026-015', href: '/legislation?record=ordinance-2026-015' },
            ] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Three matters therefore need to be separated: settlement of the former joint venture, ownership of the company and assets, and actual revival of the railway. A settlement may preserve land, studies or the corporate vehicle, but it is not a substitute for a new feasibility case, appropriation or financing, route approval, permits, contractors and construction timetable.',
            evidence: { sourceIds: ['8', '9'] },
          },
        ],
      },
      {
        id: 'current-status',
        heading:
          'At the 5 October 2026 cutoff, the railway is stalled and no replacement build is confirmed',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The PPP Center still lists the Makati City Subway System Project in its database as pre-construction, while Infradev’s 2025 disclosure says continuation of the original joint venture was no longer feasible. Those different labels do not establish that work restarted; the safer reading is that the administrative registry has not been fully reconciled with the later arbitration and settlement record.',
            evidence: { sourceIds: ['3', '10'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'A credible restart would require a new public record: the implementing entity and operator, the revised alignment and station list, the arrangement for Taguig jurisdiction, updated cost and financing, approvals, procurement and a construction timetable. Until those exist, the Makati Subway is best described as a stalled former PPP with retained assets and an unresolved revival path—not as operating, under active construction, or an idea proven incapable of returning.',
            evidence: { sourceIds: ['3', '8', '9', '10'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati LGU and Infradev sign subway joint venture',
        href: 'https://ppp.gov.ph/in_the_news/makati-lgu-ph-infradev-holdings-ink-joint-venture-for-citys-subway-project/',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        publishedOrPeriod: '31 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '2',
        label: 'Philippine Infradev 2025 definitive information statement',
        href: 'https://www.infra.com.ph/wp-content/uploads/2025/08/Philippine-Infradev-Holdings-Inc.-Definitive-Information-Statement-2025.pdf',
        sourceKind: 'official-external',
        publisher: 'Philippine Infradev Holdings / PSE filing',
        publishedOrPeriod: '2025 filing; project events through April 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '3',
        label:
          'Arbitration proceedings relating to the Makati City Subway Project',
        href: 'https://edge.pse.com.ph/downloadHtml.do?file_id=1757337',
        sourceKind: 'official-external',
        publisher: 'Philippine Stock Exchange EDGE / Philippine Infradev',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '4',
        label: 'Makati signs US$3.5-billion, 10-station subway joint venture',
        href: 'https://www.pna.gov.ph/articles/1076520',
        sourceKind: 'official-external',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '30 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '5',
        label: 'Original route and key-station description',
        href: 'https://www.gmanetwork.com/news/topstories/metro/944779/abby-binay-makati-in-talks-with-new-domestic-partner-for-intra-city-railway-project/story/',
        sourceKind: 'secondary',
        publisher: 'GMA Integrated News',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '6',
        label: 'Makati–Taguig boundary decision and EMBO transition report',
        href: '/reports/embo-makati-taguig-transition',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod:
          'Boundary and transition record through 3 October 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '7',
        label: 'The case of the Makati Intra-city Subway project',
        href: 'https://pidswebs.pids.gov.ph/CDN/document/pidsdps2443.pdf',
        sourceKind: 'secondary',
        publisher: 'Philippine Institute for Development Studies',
        publishedOrPeriod: 'December 2024 discussion paper',
        checkedOn: '5 October 2026',
      },
      {
        id: '8',
        label: 'Makati–Infradev settlement and council resolutions',
        href: 'https://www.philippine-resources.com/articles/2026/6/makati-gains-control-of-subway-project-following-infradev-settlement',
        sourceKind: 'secondary',
        publisher: 'Philippine Resources Journal',
        publishedOrPeriod: '4 June 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '9',
        label: 'Infradev declines to disclose settlement details',
        href: 'https://context.ph/2026/02/19/infradev-declines-to-disclose-subway-settlement-details/',
        sourceKind: 'secondary',
        publisher: 'Context.ph',
        publishedOrPeriod: '19 February 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '10',
        label: 'Makati City Subway System Project database record',
        href: 'https://ppp.gov.ph/project-database/?project_sector=1768&search=true',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        checkedOn: '5 October 2026',
      },
    ],
    methodology: {
      title: 'Status and uncertainty note',
      text: 'Company disclosures, government PPP records and the official boundary record take priority. Strong secondary reporting is used for station names and January 2026 settlement events whose complete official text is not accessible on the city portal. A settlement, asset transfer or database label is not treated as proof of a construction restart.',
      evidence: { sourceIds: ['2', '3', '6', '8', '9', '10'] },
    },
  },

];

export const publicationReports = [...reports].reverse();

export const reportSlugAliases: Record<string, string> = {
  '2025-local-revenue': '2025-fiscal-profile',
  '2025-social-services': '2025-fiscal-profile',
};

export const resolveReportSlug = (slug?: string) =>
  slug ? reportSlugAliases[slug] ?? slug : undefined;

export const findReport = (slug?: string) => {
  const canonicalSlug = resolveReportSlug(slug);
  return reports.find(report => report.slug === canonicalSlug);
};
