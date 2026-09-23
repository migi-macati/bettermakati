export interface ReportSource {
  id: string;
  label: string;
  href: string;
  note: string;
}

export interface ReportParagraph {
  text: string;
  sourceIds: string[];
}

export interface FeaturedReport {
  slug: string;
  date: string;
  headline: string;
  subheadline: string;
  paragraphs: ReportParagraph[];
  sources: ReportSource[];
}

export const reports: FeaturedReport[] = [
  {
    slug: '2026-budget-operating-expenses',
    date: '23 September 2026',
    headline:
      'Operating expenses account for nearly three-quarters of Makati’s 2026 budget increase',
    subheadline:
      'The proposed city budget rises by ₱2 billion to ₱21 billion, with Maintenance and Other Operating Expenses contributing ₱1.49 billion of the increase.',
    paragraphs: [
      {
        text:
          'Makati’s proposed 2026 city budget is ₱21.0 billion, up ₱2.0 billion or 10.5% from 2025. The more revealing change is in its composition: Maintenance and Other Operating Expenses rises from ₱8.99 billion to ₱10.47 billion, a ₱1.49 billion increase that accounts for 74.4% of the entire budget expansion.',
        sourceIds: ['1'],
      },
      {
        text:
          'Other major categories grow by much smaller amounts. Personal Services increases by about ₱141 million, Capital Outlay by about ₱217 million, and Special Purpose Appropriations by about ₱154 million. MOOE therefore reaches 49.9% of the 2026 budget, compared with 6.7% for Capital Outlay.',
        sourceIds: ['1'],
      },
      {
        text:
          'The 2026 budget is therefore growing mainly through operating expenditure rather than through a large shift toward capital investment. That does not by itself show whether the spending is efficient or excessive: MOOE includes medicines, medical supplies, professional services, utilities, security, donations and other operating costs. It does show where most of the additional budget authority is concentrated.',
        sourceIds: ['1'],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget',
        href: '/projects-budget#budget',
        note: '2025–2026 budget comparison and appropriation structure.',
      },
    ],
  },
  {
    slug: '2025-local-revenue',
    date: '23 September 2026',
    headline: 'Makati generated 93.5% of its reported 2025 receipts locally',
    subheadline:
      'Local taxes, fees, charges and other local receipts contributed ₱23.05 billion of ₱24.66 billion, while external sources made up 6.5%.',
    paragraphs: [
      {
        text:
          'Makati reported ₱24.66 billion in receipts for 2025. Of that total, ₱23.05 billion, or 93.5%, came from local sources. External sources contributed ₱1.60 billion, or 6.5%, while non-income receipts were negligible.',
        sourceIds: ['1'],
      },
      {
        text:
          'Local revenue is itself concentrated. Business tax generated ₱12.14 billion, while basic real property tax and Special Education Fund tax contributed ₱4.44 billion and ₱3.63 billion respectively. Together, those three streams produced about ₱20.22 billion, or roughly 87.7% of all local-source receipts.',
        sourceIds: ['1'],
      },
      {
        text:
          'Makati’s reported 2025 revenue base was therefore overwhelmingly local and heavily anchored in business and property-related taxes. This describes where city receipts came from; it does not by itself measure who ultimately bears the tax burden or how stable the same revenue mix would be under different economic conditions.',
        sourceIds: ['1'],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget',
        href: '/projects-budget#budget',
        note: '2025 actual receipts and local-revenue breakdown.',
      },
    ],
  },
  {
    slug: '2025-social-services',
    date: '23 September 2026',
    headline: 'Social services absorbed 55.2% of Makati’s reported 2025 expenditure',
    subheadline:
      'At ₱12.31 billion, spending classified under social services exceeded all other functional categories combined.',
    paragraphs: [
      {
        text:
          'Makati reported ₱22.31 billion in expenditures for 2025. Social Services accounted for ₱12.31 billion, or 55.2%, making it the largest functional category by a wide margin.',
        sourceIds: ['1'],
      },
      {
        text:
          'General Services accounted for ₱6.65 billion, Economic Services ₱1.91 billion, Capital Investment ₱1.44 billion, and Debt Services about ₱9.6 million. Combined, those categories total about ₱10.01 billion, less than Social Services alone.',
        sourceIds: ['1'],
      },
      {
        text:
          'The city’s reported 2025 spending profile was therefore dominated by functions classified under health, education, welfare and related social services. The classification shows where spending was recorded, not whether programs delivered commensurate outcomes; that requires service-level and outcome data.',
        sourceIds: ['1'],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget',
        href: '/projects-budget#budget',
        note: '2025 actual expenditure by function.',
      },
    ],
  },
  {
    slug: '2024-barangay-population',
    date: '23 September 2026',
    headline: 'Three barangays contain 37.6% of Makati’s 2024 population',
    subheadline:
      'Pio Del Pilar, Bel-Air and Guadalupe Nuevo together account for 116,522 residents, while the city’s smallest barangay has just 3,034.',
    paragraphs: [
      {
        text:
          'Makati’s 2024 population of 309,770 is distributed unevenly across 23 barangays. Pio Del Pilar has 55,572 residents, Bel-Air 39,354, and Guadalupe Nuevo 21,596. Together, the three account for 116,522 residents, or 37.6% of the city total.',
        sourceIds: ['1', '2'],
      },
      {
        text:
          'At the other end, Carmona has 3,034 residents. Pio Del Pilar alone has more than 18 times Carmona’s population. Dasmariñas, Forbes Park, Urdaneta, Kasilawan and Pinagkaisahan each have fewer than 6,000 residents.',
        sourceIds: ['2'],
      },
      {
        text:
          'Citywide averages therefore conceal large differences in local scale. Potential barangay-level demand for facilities and services exists across resident populations that differ by an order of magnitude, even before accounting for daytime population, land use, income or employment patterns.',
        sourceIds: ['1', '2'],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati Statistics',
        href: '/statistics',
        note: '2024 city population and comparable indicators.',
      },
      {
        id: '2',
        label: 'Barangays',
        href: '/barangays',
        note: '2024 population by barangay.',
      },
    ],
  },
];

export const findReport = (slug?: string) =>
  reports.find(report => report.slug === slug);
