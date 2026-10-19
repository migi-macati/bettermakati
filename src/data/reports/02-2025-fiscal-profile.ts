import * as shared from '../reportSharedData';
import type {
  FeaturedReportModule,
  ReportChartBlock,
  ReportParagraphBlock,
  ReportStatBlock,
} from '../reportTypes';

const {
  reportPublishedOn,
  percent,
  localReceipts,
  socialServices,
  moneyB,
  budgetSummary,
  externalReceipts,
  nonIncomeReceipts,
  topThreeLocalRevenueM,
  topThreeLocalRevenueShare,
  revenueSources,
  actualSpendingByFunction,
  reviewedOn,
  budgetSources,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: '2025-fiscal-profile',
    date: reportPublishedOn,
    headline: 'Makati’s 2025 finances: local revenue, social-service spending',
    subheadline: `Local sources supplied ${percent(
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
            text: `Makati reported ${moneyB(
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
            detail: `${moneyB(localReceipts?.amountM ?? 0)} of ${moneyB(
              budgetSummary.actualReceiptsM
            )} in reported receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Within local revenue, Business Tax, Basic Real Property Tax and Special Education Fund Tax together produced ${moneyB(
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
            text: `Reported 2025 expenditure totaled ${moneyB(
              budgetSummary.actualExpendituresM
            )}. Social Services accounted for ${moneyB(
              socialServices?.amountM ?? 0
            )}, or ${percent(
              socialServices?.share ?? 0
            )}, exceeding the combined ${moneyB(
              budgetSummary.actualExpendituresM - (socialServices?.amountM ?? 0)
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
            text: 'Read the revenue and spending charts separately. The receipt table describes where city revenue was recorded as coming from; the functional expenditure table describes how spending was classified. They do not establish that a specific tax funded a specific service, nor do expenditure shares by themselves measure program outcomes.',
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text: 'PSA separately estimates Makati’s 2025 real GDP at about ₱1.27 trillion. GDP measures production in the city, while these fiscal tables measure city-government receipts and expenditure. They differ in scope and price basis: the real GDP figure uses constant 2018 prices, whereas the fiscal figures are reported peso flows. GDP is not the city’s revenue or budget.',
            evidence: {
              sourceIds: ['2', '3'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'real-gdp-level',
                  href: '/statistics#indicator-real-gdp-level',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'cbd-tax-service',
        heading: 'What do business districts receive for the taxes they pay?',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The published 2025 citywide receipts and spending tables do not allocate tax collections or expenditure to Ayala, Salcedo, Legazpi, Rockwell, Century City or other business districts. They cannot establish each district’s share of local taxes, the amount spent there or a district-level return on taxes paid.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Businesses, workers, customers and commuters may benefit from streets, drainage, traffic operations, emergency response, waste collection, public safety and predictable permits. These are possible channels of value, not measured benefits to particular taxpayers. A citywide spending function does not identify where a service was delivered or whether it worked.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'table',
            title: 'Recommended disclosures to assess CBD services',
            columns: [
              { key: 'holder', label: 'Record-holder or service unit' },
              { key: 'publish', label: 'Data to publish' },
              { key: 'measure', label: 'Question answered' },
            ],
            rows: [
              {
                holder: 'Treasury and assessment offices',
                publish:
                  'Annual aggregated, non-identifying local taxes by area and tax type, where lawful',
                measure: 'Where city taxes are collected',
              },
              {
                holder: 'Budget, engineering and public works',
                publish:
                  'Geocoded projects, maintenance costs, completion and drainage performance',
                measure: 'Where spending goes and what improves',
              },
              {
                holder: 'Traffic, safety and sanitation units',
                publish:
                  'Travel delays, response times, cleanliness and service coverage',
                measure: 'Whether everyday services improve',
              },
              {
                holder: 'Business permits and licensing',
                publish:
                  'Median processing times, rejection reasons and service standards',
                measure:
                  'Whether transactions become faster and more predictable',
              },
            ],
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'National taxes must be separated from local-government collections, and GDP from tax receipts. PSA real GDP is measured in constant 2018 prices, while fiscal receipts are nominal peso flows; an unadjusted ratio is not a reliable tax-effort measure. More national education or health funding creates local fiscal room only where it demonstrably replaces an existing city cost. Without matched obligations and annual spending, this is a scenario, not verified savings.',
            evidence: { sourceIds: ['2', '3'] },
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
        note: 'Canonical 2025 receipts, local-revenue breakdown and expenditure-by-function tables.',
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
      {
        id: '3',
        label: 'City of Makati’s Economy Grows by 5.0 Percent in 2025',
        href: 'https://rssoncr.psa.gov.ph/statistics/ppa/node/1684059166',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority — NCR',
        publishedOrPeriod: '6 October 2026',
        checkedOn: '10 October 2026',
      },
    ],
  },
  fil: null,
};

// Keep the Filipino article paired with its English evidence and numeric series.
const revenue = reportModule.report.sections[0];
const spending = reportModule.report.sections[1];
const revenueChart = revenue.blocks[3] as ReportChartBlock;
const spendingChart = spending.blocks[1] as ReportChartBlock;

reportModule.fil = {
  headline:
    'Halos lahat ng 2025 receipts ng Makati ay mula sa local sources; Social Services ang nanguna sa spending',
  subheadline: `Mula sa local sources ang ${percent(localReceipts?.share ?? 0)} ng iniulat na receipts, habang ${percent(socialServices?.share ?? 0)} ng expenditure ang nasa Social Services.`,
  synthesis:
    'Ipinapakita ng 2025 fiscal records ng Makati ang malaking pag-asa sa local revenue at spending na pinakamalaki sa Social Services. Hindi naman ipinapakita ng public fiscal tables kung aling partikular na buwis ang napunta sa aling programa.',
  sections: [
    {
      ...revenue,
      heading: 'Halos lahat ng iniulat na receipts ay mula sa local sources',
      blocks: [
        {
          ...(revenue.blocks[0] as ReportParagraphBlock),
          text: `Nag-ulat ang Makati ng ${moneyB(budgetSummary.actualReceiptsM)} na receipts noong 2025. Mula sa local sources ang ${moneyB(localReceipts?.amountM ?? 0)}, o ${percent(localReceipts?.share ?? 0)}. Nag-ambag ang external sources ng ${moneyB(externalReceipts?.amountM ?? 0)}, habang ${moneyB(nonIncomeReceipts?.amountM ?? 0)} ang non-income receipts.`,
        },
        {
          ...(revenue.blocks[1] as ReportStatBlock),
          label: 'Receipts mula sa local sources',
          detail: `${moneyB(localReceipts?.amountM ?? 0)} sa kabuuang ${moneyB(budgetSummary.actualReceiptsM)} na iniulat na receipts.`,
        },
        {
          ...(revenue.blocks[2] as ReportParagraphBlock),
          text: `Sa local revenue, ang Business Tax, Basic Real Property Tax at Special Education Fund Tax ay nagdala ng pinagsamang ${moneyB(topThreeLocalRevenueM)}, o ${percent(topThreeLocalRevenueShare)} ng receipts mula sa local sources.`,
        },
        {
          ...revenueChart,
          title: 'Bahagi ng iniulat na receipts noong 2025',
          series: [
            { ...revenueChart.series[0], label: 'Pinagmulan ng receipts' },
          ],
        },
      ],
    },
    {
      ...spending,
      heading: 'Social Services ang pinakamalaking bahagi ng spending',
      blocks: [
        {
          ...(spending.blocks[0] as ReportParagraphBlock),
          text: `Umabot sa ${moneyB(budgetSummary.actualExpendituresM)} ang iniulat na expenditure noong 2025. Nasa Social Services ang ${moneyB(socialServices?.amountM ?? 0)}, o ${percent(socialServices?.share ?? 0)}. Mas malaki ito kaysa sa pinagsamang ${moneyB(budgetSummary.actualExpendituresM - (socialServices?.amountM ?? 0))} na iniulat sa lahat ng iba pang spending functions.`,
        },
        {
          ...spendingChart,
          title: 'Bahagi ng iniulat na expenditure noong 2025',
          series: [
            { ...spendingChart.series[0], label: 'Function ng spending' },
          ],
        },
        {
          ...(spending.blocks[2] as ReportParagraphBlock),
          text: 'Magkaiba ang tanong na sinasagot ng dalawang distribution. Ipinapakita ng receipts table kung saan nanggaling ang naitalang kita ng city government; ipinapakita naman ng functional expenditure table kung paano ikinategorya ang spending. Hindi nito pinatutunayan na isang partikular na buwis ang direktang nagbayad para sa isang partikular na serbisyo. Hindi rin sapat ang spending shares para sukatin ang resulta ng mga programa.',
        },
        {
          ...(spending.blocks[3] as ReportParagraphBlock),
          text: 'Hiwalay na tinataya ng PSA ang real GDP ng Makati noong 2025 sa humigit-kumulang ₱1.27 trillion. Production sa loob ng lungsod ang sinusukat ng GDP; receipts at expenditure ng city government naman ang nasa fiscal tables. Magkaiba rin ang price basis: constant 2018 prices ang real GDP, habang iniulat na peso flows ang fiscal figures. Hindi revenue o budget ng city government ang GDP.',
        },
      ],
    },
    {
      id: 'cbd-tax-service',
      heading:
        'Ano ang nakukuha ng business districts sa binabayaran nilang buwis?',
      blocks: [
        {
          kind: 'paragraph',
          role: 'fact',
          text: 'Citywide ang published 2025 receipts at spending tables. Walang breakdown sa mga table kung magkano ang tax collections at expenditure sa Ayala, Salcedo, Legazpi, Rockwell, Century City o iba pang business districts. Kaya hindi pa makukuwenta ang tax share, city spending o return on taxes paid ng bawat distrito.',
          evidence: { sourceIds: ['1', '2'] },
        },
        {
          kind: 'paragraph',
          role: 'analysis',
          text: 'Posibleng makinabang ang mga negosyo, empleyado, customer at commuter sa kalsada, drainage, traffic operations, emergency response, waste collection, public safety at maayos na permits. Posibleng benefits ito, hindi pa sukat na resulta para sa partikular na taxpayer. Hindi rin ipinapakita ng citywide spending category kung saan na-deliver ang serbisyo o kung epektibo ito.',
          evidence: { sourceIds: ['1', '2'] },
        },
        {
          kind: 'table',
          title:
            'Mga datos na kailangan para masukat ang CBD tax-and-service value',
          columns: [
            { key: 'holder', label: 'May hawak ng records o serbisyo' },
            { key: 'publish', label: 'Dapat ilabas' },
            { key: 'measure', label: 'Ano ang masusukat' },
          ],
          rows: [
            {
              holder: 'Treasury at assessment offices',
              publish:
                'Annual aggregated at non-identifying local taxes per area at tax type, kung legal',
              measure: 'Saan nanggagaling ang city taxes',
            },
            {
              holder: 'Budget, engineering at public works',
              publish:
                'Lokasyon at gastos ng projects at maintenance, completion at drainage performance',
              measure: 'Saan napupunta ang spending at ano ang bumubuti',
            },
            {
              holder: 'Traffic, safety at sanitation units',
              publish:
                'Travel delays, response times, kalinisan at service coverage',
              measure: 'Kung bumubuti ang araw-araw na serbisyo',
            },
            {
              holder: 'Business permits and licensing',
              publish:
                'Median processing times, rejection reasons at service standards',
              measure: 'Kung mas mabilis at predictable ang transactions',
            },
          ],
          evidence: { sourceIds: ['1', '2'] },
        },
        {
          kind: 'paragraph',
          role: 'analysis',
          text: 'Ihiwalay ang national taxes sa local-government collections at ang GDP sa tax receipts. Constant 2018 prices ang PSA real GDP; nominal peso flows naman ang fiscal receipts. Hindi reliable tax-effort measure ang direktang ratio. Posibleng lumuwag ang city budget dahil sa dagdag na national funding sa edukasyon o healthcare kung napatunayang napalitan nito ang dating gastos ng lungsod. Kung walang matched obligations at annual spending, scenario pa lang ito, hindi verified savings.',
          evidence: { sourceIds: ['2', '3'] },
        },
      ],
    },
  ],
};

export default reportModule;
