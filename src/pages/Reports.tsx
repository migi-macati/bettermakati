import { ArrowRight, BarChart3, ClipboardCheck, FileText, Landmark, Vote } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';

const supportingAnalysis = [
  {
    title: 'Projects & Budget',
    description: 'Budget plans, fiscal actuals, projects, procurement and audit records.',
    href: '/projects-budget',
    icon: BarChart3,
  },
  {
    title: 'Elections & Voting',
    description: 'Election results, turnout, historical races and voter information.',
    href: '/elections',
    icon: Vote,
  },
  {
    title: 'Accountability Ledger',
    description: 'Follow plans, responsibilities, evidence gaps and later public records.',
    href: '/accountability',
    icon: ClipboardCheck,
  },
  {
    title: 'Public Records',
    description: 'Open the source documents and structured civic datasets behind the site.',
    href: '/records',
    icon: FileText,
  },
];

export default function Reports() {
  return (
    <>
      <SEO
        title="Reports & Insights"
        description="Evidence-based BetterMakati reports that synthesize information already published across the site."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Reports & insights</div>
        <Heading>Understand what the data says about Makati</Heading>
        <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">
          These reports synthesize information already published across BetterMakati.
          Findings link back to the relevant BetterMakati pages first, where the
          underlying public sources, definitions and limitations are available.
        </p>
        <LastReviewed note="Reports are updated when material source data or the underlying BetterMakati pages change." />

        <Link
          to="/reports/makati-overview"
          className="mt-8 block rounded-3xl border border-primary-200 bg-white p-6 transition hover:border-primary-500 hover:shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Flagship report · 23 September 2026
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
                Makati Overview
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                A concise reading of the city&apos;s finances, population and barangays,
                civic records, elections and evidence coverage using the information
                already assembled across BetterMakati.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-700">
              Read the report <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Supporting analysis</div>
        <Heading level={2}>Go directly to the evidence</Heading>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {supportingAnalysis.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h3 className="mt-4 font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-primary-100 bg-[#f5f8f2] p-5">
          <div className="flex items-start gap-3">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-gray-700">
              BetterMakati reports are synthesis products, not substitute source
              documents. When a report makes a claim, follow its internal citation to
              the relevant BetterMakati page, then open the original public source
              from there.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
