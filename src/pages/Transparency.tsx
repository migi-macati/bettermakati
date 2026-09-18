import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const sections = [
  {
    title: 'Budget & Financial Disclosures',
    resources: [
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
    ],
  },
  {
    title: 'Legislation',
    resources: [
      {
        title: 'Resolutions and Ordinances',
        description: 'Makati local legislation.',
        href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
      },
    ],
  },
  {
    title: 'Procurement & Audit',
    resources: [
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
    ],
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
        <div className="section-eyebrow">Public records</div>
        <Heading>Transparency</Heading>

        <div className="space-y-10 mt-8">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-gray-950 mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.resources.map(resource => (
                  <a
                    key={resource.title}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
                  >
                    <div className="font-semibold text-lg text-gray-900">{resource.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{resource.description}</div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
