import {
  ArrowRight,
  Database,
  ExternalLink,
  FileBarChart,
  FileText,
  History,
  SearchCheck,
  Vote,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';

const recordGroups = [
  {
    title: 'Budgets, spending & projects',
    description:
      'Annual budgets back to 2014, reported fiscal actuals, development-fund projects, procurement and audit sources.',
    href: '/projects-budget',
    icon: FileBarChart,
    coverage: 'Structured + source documents',
  },
  {
    title: 'Accountability Ledger',
    description:
      'Longitudinal records that connect plans, responsible bodies, later evidence and published information gaps.',
    href: '/accountability',
    icon: SearchCheck,
    coverage: 'Growing structured index',
  },
  {
    title: 'Legislation',
    description:
      'Official resolutions and ordinances archive plus the Makati City Charter.',
    href: '/legislation',
    icon: FileText,
    coverage: 'Official archive discovery',
  },
  {
    title: 'Elections & voting',
    description:
      '2025 local election results, turnout, official candidate lists and 2026 BSKE voter information.',
    href: '/elections',
    icon: Vote,
    coverage: 'Structured 2025 results',
  },
  {
    title: 'History',
    description:
      'A sourced chronology with evidence classifications, notes, research gaps and downloadable records.',
    href: '/history',
    icon: History,
    coverage: 'Structured research chronology',
  },
  {
    title: 'Statistics',
    description:
      'Population and economic data with definitions, source links and downloadable CSV.',
    href: '/statistics',
    icon: Database,
    coverage: 'Structured selected datasets',
  },
];

const primarySources = [
  ['Makati City official portal', 'https://www.makati.gov.ph/'],
  ['Commission on Audit', 'https://www.coa.gov.ph/reports/annual-audit-reports/'],
  ['PhilGEPS', 'https://notices.philgeps.gov.ph/'],
  ['Philippine Statistics Authority', 'https://psa.gov.ph/'],
  ['COMELEC', 'https://www.comelec.gov.ph/'],
  ['Lawphil', 'https://lawphil.net/'],
];

export default function PublicRecords() {
  return (
    <>
      <SEO
        title="Public Records"
        description="A citizen-facing index of Makati public records, structured datasets, source documents and known coverage gaps."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Radical transparency</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Public Records</Heading>
            <p className="max-w-3xl text-gray-700">
              Start with the question, see the structured answer where
              BetterMakati has one, then open the original public record that
              supports it.
            </p>
          </div>
          <SharePage title="Makati Public Records | BetterMakati" />
        </div>
        <LastReviewed
          note="BetterMakati publishes its coverage gaps instead of implying that an incomplete index is complete."
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordGroups.map(group => {
            const Icon = group.icon;
            return (
              <Link
                key={group.title}
                to={group.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {group.coverage}
                </div>
                <h2 className="mt-1 text-lg font-extrabold text-gray-950">
                  {group.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {group.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Source of truth</div>
        <Heading level={2}>Primary public sources</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          BetterMakati is an interpretation and navigation layer. The issuing
          public body remains the controlling source for an official record.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {primarySources.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-primary-100 bg-white px-4 py-2 text-sm font-bold text-primary-700"
            >
              {label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
          <h2 className="text-xl font-extrabold text-gray-950">
            Source changed? Missing record?
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            BetterMakati watches selected high-value sources for changes and
            accepts corrections and public records from residents, researchers
            and public institutions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/get-involved?type=source#submission" className="brand-btn-primary">
              Share a source
            </Link>
            <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">
              Report a correction
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
