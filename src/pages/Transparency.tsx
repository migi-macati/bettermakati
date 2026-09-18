import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const resources = [
  {
    title: 'CY 2025 Annual Budget',
    description: 'Official annual budget document currently indexed by BetterMakati.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
    source: 'City Government of Makati',
  },
  {
    title: 'CY 2025 Q4 — 20% National Tax Allotment Utilization',
    description: 'Official full-disclosure report showing listed development-fund programs/projects and status.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf',
    source: 'City Government of Makati',
  },
  {
    title: 'Resolutions and Ordinances',
    description: 'Official Makati portal section for local legislation.',
    href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    source: 'City Government of Makati',
  },
  {
    title: 'PhilGEPS',
    description: 'National government procurement portal for bid and award notices.',
    href: 'https://notices.philgeps.gov.ph/',
    source: 'PhilGEPS',
  },
  {
    title: 'Commission on Audit',
    description: 'Official COA portal for audit reports and related publications.',
    href: 'https://www.coa.gov.ph/reports/annual-audit-reports/',
    source: 'Commission on Audit',
  },
];

export default function Transparency() {
  return (
    <>
      <SEO
        title="Transparency"
        description="Primary-source links for Makati City budgets, disclosures, legislation and procurement."
      />
      <Section className="p-3 mb-12">
        <Heading>Transparency</Heading>
        <Text className="text-gray-600 mb-6">
          v1.0 is intentionally a source directory, not a dashboard. BetterMakati will add structured datasets and analysis only after the underlying records can be collected and checked consistently.
        </Text>

        <div className="space-y-4">
          {resources.map(resource => (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="block border rounded-lg p-5 hover:border-primary-400 hover:shadow-sm transition"
            >
              <div className="font-semibold text-lg text-gray-900">{resource.title}</div>
              <div className="text-sm text-gray-600 mt-1">{resource.description}</div>
              <div className="text-xs text-gray-500 mt-3">Source: {resource.source}</div>
            </a>
          ))}
        </div>

        <div className="mt-8 border-l-4 border-primary-500 bg-primary-50 p-4">
          <strong>Data rule:</strong> BetterMakati will distinguish official source facts, BetterMakati calculations and information we have not yet verified. Missing data will be left missing rather than guessed.
        </div>

        <p className="text-xs text-gray-500 mt-6">Last verified by BetterMakati: 18 September 2026.</p>
      </Section>
    </>
  );
}
