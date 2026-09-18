import {
  ArrowRight,
  FileBarChart,
  HardHat,
  Landmark,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const annualBudget =
  'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf';
const ntaDisclosure =
  'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf';

export default function ProjectsBudget() {
  return (
    <>
      <SEO
        title="Projects & Budget"
        description="Makati budget, project disclosure, procurement and audit records."
      />

      <Section id="budget" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Projects & Budget</div>
        <Heading>City spending and public records</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <a
            href={annualBudget}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <FileBarChart className="h-6 w-6 text-primary-700" />
            <h2 className="text-lg font-bold text-gray-950 mt-4">CY 2025 Annual Budget</h2>
            <p className="text-sm text-gray-600 mt-1">Annual budget document.</p>
          </a>

          <a
            href={ntaDisclosure}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <HardHat className="h-6 w-6 text-primary-700" />
            <h2 className="text-lg font-bold text-gray-950 mt-4">Q4 20% NTA Utilization</h2>
            <p className="text-sm text-gray-600 mt-1">Development-fund programs and projects.</p>
          </a>
        </div>
      </Section>

      <Section id="projects" className="bg-[#f5f8f2]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="section-eyebrow">Project Tracker</div>
            <Heading level={2}>Public projects</Heading>
            <p className="text-gray-600">
              Project records are being assembled from official disclosures.
            </p>
          </div>
          <Link to="/get-involved?type=source&tool=project-tracker#submission" className="brand-btn-primary">
            Share project data <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section id="procurement" className="bg-white">
        <div className="section-eyebrow">Procurement</div>
        <Heading level={2}>Bid and award notices</Heading>
        <a
          href="https://notices.philgeps.gov.ph/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
        >
          <ShoppingCart className="h-6 w-6 text-primary-700" />
          <div>
            <div className="font-bold text-gray-950">PhilGEPS</div>
            <div className="text-sm text-gray-600">Government procurement notices.</div>
          </div>
        </a>
      </Section>

      <Section id="audit" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Audit</div>
        <Heading level={2}>Annual audit reports</Heading>
        <a
          href="https://www.coa.gov.ph/reports/annual-audit-reports/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
        >
          <Landmark className="h-6 w-6 text-primary-700" />
          <div>
            <div className="font-bold text-gray-950">Commission on Audit</div>
            <div className="text-sm text-gray-600">Annual audit reports.</div>
          </div>
        </a>
      </Section>
    </>
  );
}
