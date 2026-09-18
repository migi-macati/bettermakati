import { ArrowRight, FileBarChart, HardHat, Scale, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const budgetLinks = [
  {
    title: 'CY 2025 Annual Budget',
    description: 'City annual budget document.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
    icon: FileBarChart,
  },
  {
    title: 'Q4 20% NTA Utilization',
    description: 'Development-fund programs and projects.',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf',
    icon: HardHat,
  },
  {
    title: 'Resolutions & Ordinances',
    description: 'Local legislation.',
    href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    icon: Scale,
  },
  {
    title: 'PhilGEPS',
    description: 'Procurement and award notices.',
    href: 'https://notices.philgeps.gov.ph/',
    icon: ShoppingCart,
  },
];

export default function ProjectsBudget() {
  return (
    <>
      <SEO
        title="Projects & Budget"
        description="Makati budget, project disclosure and procurement records."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Projects & Budget</div>
        <Heading>City spending and public records</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {budgetLinks.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="text-lg font-bold text-gray-950 mt-4">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </a>
            );
          })}
        </div>
      </Section>

      <Section id="projects" className="bg-[#f5f8f2]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="section-eyebrow">Project Tracker</div>
            <Heading level={2}>Project data</Heading>
            <p className="text-gray-600">
              Help expand the project tracker with official disclosures, award notices and completion records.
            </p>
          </div>
          <Link to="/get-involved?type=source&tool=project-tracker#submission" className="brand-btn-primary">
            Share project data <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
