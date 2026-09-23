import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  Landmark,
  Vote,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { makatiOverviewReport } from '../data/reports';

const evidenceBase = [
  {
    title: 'Projects & Budget',
    description:
      'Budget plans, fiscal actuals, revenue, spending, projects, procurement and audit records.',
    href: '/projects-budget',
    icon: BarChart3,
  },
  {
    title: 'Elections & Voting',
    description:
      'Election results, turnout, historical races and voter information.',
    href: '/elections',
    icon: Vote,
  },
  {
    title: 'Accountability Ledger',
    description:
      'Plans, responsibilities, evidence gaps and later public records.',
    href: '/accountability',
    icon: ClipboardCheck,
  },
  {
    title: 'Public Records',
    description:
      'Source documents and structured civic datasets behind the site.',
    href: '/records',
    icon: FileText,
  },
];

export default function Reports() {
  return (
    <>
      <SEO
        title="Reports & Insights"
        description="Evidence-based BetterMakati reports that publish only material, traceable synthesis from information already available across the site."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Reports & insights</div>
        <Heading>Understand what the data says about Makati</Heading>
        <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">
          BetterMakati does not publish a report simply because data exists. A report
          must add a material finding or comparison beyond the underlying source
          pages, preserve a traceable evidence trail, and state its important limits.
        </p>
        <LastReviewed note="The library stays intentionally small. New reports are added only when the available evidence supports a useful synthesis." />

        <Link
          to={makatiOverviewReport.href}
          className="mt-8 block rounded-3xl border border-primary-200 bg-white p-6 transition hover:border-primary-500 hover:shadow-sm md:p-8"
        >
          <div className="max-w-4xl">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              {makatiOverviewReport.title} · {makatiOverviewReport.date}
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
              Four signals from Makati’s latest city data
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
              {makatiOverviewReport.subtitle}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">
              Read the report <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Evidence base</div>
        <Heading level={2}>Go directly to the underlying analysis</Heading>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
          These are not reports. They are the deeper BetterMakati pages where the
          structured data, source documents and methodological context live.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {evidenceBase.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h3 className="mt-4 font-extrabold text-gray-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-primary-100 bg-[#f5f8f2] p-5">
          <div className="flex items-start gap-3">
            <Landmark
              className="mt-0.5 h-5 w-5 shrink-0 text-primary-700"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-gray-700">
              Reports cite BetterMakati pages first because the report is a synthesis
              of the site. Original government and public sources remain one level
              deeper on the cited evidence pages.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
