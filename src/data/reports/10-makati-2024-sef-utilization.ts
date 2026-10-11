import type { FeaturedReportModule } from '../reportTypes';

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'makati-2024-special-education-fund-spending',
    date: '11 October 2026',
    headline: 'Where Makati’s 2024 Education Fund Went',
    subheadline: 'Makati reported ₱2.872 billion in Special Education Fund disbursements and a ₱1.245-billion closing balance. Supplies, services and ICT equipment dominated.',
    synthesis: 'The signed 2024 Special Education Fund (SEF) utilization report records ₱2.872 billion in cash disbursements from ₱4.118 billion in available resources. Nearly half of disbursements were recorded as supplies and materials. The year-end balance was ₱1.245 billion. These figures establish spending categories and cash movement, not which schools received goods, whether prices were competitive or whether learning improved. Those questions require contracts, delivery records, school-level data and audit findings.',
    sections: [
      {
        id: 'fund-flow',
        heading: 'How much was available, spent and left?',
        blocks: [
          {
            kind: 'stat',
            label: '2024 SEF cash disbursements',
            value: '₱2.872 billion',
            detail: '69.75% of ₱4.118 billion in available resources',
            evidence: { sourceIds: ['sef2024'] },
          },
          {
            kind: 'table',
            title: 'SEF resources and cash movement, 2024',
            columns: [
              { key: 'line', label: 'Reported category' },
              { key: 'amount', label: 'Amount', align: 'right' },
            ],
            rows: [
              { line: 'Current-year operating receipts', amount: '₱2,890,680,429.00' },
              { line: 'Prior-year and continuing resources', amount: '₱1,226,873,854.39' },
              { line: 'Total available resources', amount: '₱4,117,554,283.39' },
              { line: 'Total cash disbursements', amount: '₱2,872,115,996.45' },
              { line: 'Year-end balance', amount: '₱1,245,438,286.94' },
            ],
            evidence: { sourceIds: ['sef2024'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The closing balance equals 30.25% of available resources. That is not, by itself, proof of waste or uncommitted funds. The statement does not identify every outstanding obligation or school-level delivery.',
            evidence: { sourceIds: ['sef2024'] },
          },
        ],
      },
      {
        id: 'spending',
        heading: 'What the money was recorded against',
        blocks: [
          {
            kind: 'table',
            title: 'Selected disbursement lines and parent categories',
            caption: 'Indented lines belong within MOOE or capital outlay. Do not add them again to their parent totals.',
            columns: [
              { key: 'category', label: 'Category' },
              { key: 'amount', label: 'Disbursed', align: 'right' },
              { key: 'share', label: 'Share of all disbursements', align: 'right' },
            ],
            rows: [
              { category: 'Personnel services', amount: '₱29.35M', share: '1.02%' },
              { category: 'Maintenance and other operating expenses (MOOE)', amount: '₱2,526.92M', share: '87.98%' },
              { category: '↳ Supplies and materials', amount: '₱1,377.95M', share: '47.98%' },
              { category: '↳ General services', amount: '₱523.62M', share: '18.23%' },
              { category: '↳ Professional services', amount: '₱410.50M', share: '14.29%' },
              { category: 'Capital outlay', amount: '₱315.84M', share: '11.00%' },
              { category: '↳ ICT equipment', amount: '₱311.75M', share: '10.85%' },
              { category: 'Financial expense / bank charges', amount: '₱3,000', share: '<0.01%' },
            ],
            evidence: { sourceIds: ['sef2024'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The signed statement separately records ₱1,917,400 under “Training and Scholarship Expenses.” This is one SEF accounting line, not the total of Makati scholarships funded from all sources.',
            evidence: { sourceIds: ['sef2024'] },
          },
        ],
      },
      {
        id: 'budget-comparison',
        heading: 'Why the announced education budget is a different number',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In January 2024 the city described an education-sector allocation of ₱3.253 billion and a ₱1.89-billion SEF budget. A June announcement referred to ₱4.5 billion allotted to education. The signed year-end SEF report records ₱2.872 billion in cash disbursements across current and prior-year resources.',
            evidence: { sourceIds: ['jan2024', 'jun2024', 'sef2024'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'An appropriation is permission to spend, not proof of payment; sector-wide allocations can also include money outside the SEF. These figures cannot be added or called an overspending variance without original and supplemental appropriation ordinances, General Fund accounts and payment schedules. The SEF report identifies ₱1.225 billion in prior-year savings associated with Supplemental Budget No. 2, but this alone does not reconcile the announced figures.',
            evidence: { sourceIds: ['sef2024', 'jan2024', 'jun2024'] },
          },
        ],
      },
      {
        id: 'accountability',
        heading: 'What residents should be able to check next',
        blocks: [
          {
            kind: 'table',
            title: 'Missing evidence and responsible record-holders',
            columns: [
              { key: 'actor', label: 'Record-holder' },
              { key: 'record', label: 'Record to publish or reconcile' },
              { key: 'question', label: 'Question it would answer' },
            ],
            rows: [
              { actor: 'City budget and treasury offices; Local School Board', record: 'Original/supplemental SEF appropriations, obligations and year-end balances', question: 'Why did available resources and disbursements differ from the announced budget?' },
              { actor: 'City procurement and schools offices', record: 'Contracts, unit prices, acceptance and delivery by school', question: 'What was bought, for how much, and who received it?' },
              { actor: 'DepEd Makati and schools', record: 'Enrollment, inventories and comparable outcome indicators', question: 'Which students benefited and what changed?' },
              { actor: 'Commission on Audit', record: 'Full 2024 SEF compliance-audit letter and responses', question: 'What did independent auditors find?' },
            ],
            evidence: { sourceIds: ['sef2024', 'coa2024'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The Commission on Audit lists a 2024 Makati SEF compliance-audit management letter. The full findings were not accessible for verification during this review, so no audit conclusion is attributed to it.',
            evidence: { sourceIds: ['coa2024'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: 'sef2024',
        label: 'Signed Makati SEF Utilization Report, fourth quarter 2024 (pp. 3–4)',
        href: 'https://www.depedncr.com.ph/wp-content/uploads/2025/05/SEF-MAKATI-CITY-4th-Quarter-2024.pdf',
        sourceKind: 'official-external',
        publisher: 'DepEd NCR / City of Makati',
        publishedOrPeriod: 'FY2024; transmitted February 2025',
        checkedOn: '11 October 2026',
      },
      {
        id: 'jan2024',
        label: 'Makati education-sector allocation announced January 2024',
        href: 'https://mb.com.ph/2024/1/30/ganito-sa-makati-makati-allocates-more-than-p9-billion-for-social-development-sector',
        sourceKind: 'secondary',
        publisher: 'Manila Bulletin reporting Makati City statement',
        publishedOrPeriod: '30 January 2024',
        checkedOn: '11 October 2026',
      },
      {
        id: 'jun2024',
        label: 'Makati education allocation reported June 2024',
        href: 'https://www.philstar.com/nation/2024/06/07/2360942/makati-hits-80-revenue-target',
        sourceKind: 'secondary',
        publisher: 'The Philippine Star reporting Makati City statement',
        publishedOrPeriod: '7 June 2024',
        checkedOn: '11 October 2026',
      },
      {
        id: 'coa2024',
        label: 'Makati 2024 SEF compliance-audit management letter (catalog record only)',
        href: 'https://www.coa.gov.ph/wpfd_file/makati-city-compliance-audit-report-2024/',
        sourceKind: 'official-external',
        publisher: 'Commission on Audit',
        publishedOrPeriod: 'Catalog created 3 September 2025',
        checkedOn: '11 October 2026',
        note: 'Audit catalog verified; full report findings not verified.',
      },
    ],
    methodology: {
      title: 'Reading the figures',
      text: 'SEF amounts come from the signed FY2024 utilization statement, not all Makati or national education spending. Percentages are BetterMakati calculations from unrounded figures; displayed line items are rounded. The 69.75% ratio divides cash disbursements by available resources, not appropriations or obligations. Budget announcements refer to different dates and coverage and are not directly comparable without fund-level reconciliation.',
      evidence: { sourceIds: ['sef2024', 'jan2024', 'jun2024'] },
    },
  },
  fil: null,
};

export default reportModule;
