import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const resources = [
  {
    title: 'CY 2025 Annual Budget',
    description: 'Annual budget document.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
  },
  {
    title: 'CY 2025 Q4 — 20% National Tax Allotment Utilization',
    description: 'Development-fund programs, projects and status.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf',
  },
  {
    title: 'Resolutions and Ordinances',
    description: 'Makati local legislation.',
    href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
  },
  {
    title: 'PhilGEPS',
    description: 'Bid and award notices.',
    href: 'https://notices.philgeps.gov.ph/',
  },
  {
    title: 'Commission on Audit',
    description: 'Annual audit reports.',
    href: 'https://www.coa.gov.ph/reports/annual-audit-reports/',
  },
];

export default function Transparency() {
  return (
    <>
      <SEO
        title="Transparency"
        description="Makati City budget, disclosure, legislation and procurement links."
      />
      <Section className="p-3 mb-12">
        <Heading>Transparency</Heading>

        <div className="space-y-4 mt-6">
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
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
