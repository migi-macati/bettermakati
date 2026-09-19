import { ArrowLeft, ExternalLink, Landmark } from 'lucide-react';
import { Link, useParams } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { findOfficial } from '../data/electedOfficials';

export default function OfficialProfile() {
  const { slug } = useParams();
  const official = findOfficial(slug);

  if (!official) {
    return (
      <Section className="bg-[#fffdf8]">
        <Heading>Official not found</Heading>
        <Link to="/government" className="brand-btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to government
        </Link>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={official.displayName}
        description={official.office + (official.district ? ', ' + official.district : '') + ' — current Makati elected-official profile.'}
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/government"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Government
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_0.72fr] gap-6">
          <div>
            <div className="section-eyebrow">Elected official</div>
            <Heading>{official.displayName}</Heading>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              {official.office}
              {official.district ? ' · ' + official.district : ''}
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  Full name
                </div>
                <div className="mt-1 font-bold text-gray-950">{official.name}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  Elected
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.electionYear} local election
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  Party on 2025 ballot
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.partyOn2025Ballot}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  Level
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.level === 'congress' ? 'National legislature' : 'City government'}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-primary-100 bg-white p-6">
            <Landmark className="h-6 w-6 text-primary-700" />
            <h2 className="mt-4 text-lg font-extrabold text-gray-950">Sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Profiles use election records and public reporting. Party is shown
              as it appeared on the 2025 ballot; it is not treated as a current
              affiliation if later changes are not verified.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <a
                href={official.resultSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3 font-bold text-primary-700"
              >
                {official.resultSourceLabel}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
              <a
                href={official.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3 font-bold text-primary-700"
              >
                {official.officialSourceLabel}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
