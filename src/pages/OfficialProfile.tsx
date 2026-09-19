import {
  ArrowLeft,
  ExternalLink,
  Landmark,
  Vote,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SharePage from '../components/ui/SharePage';
import { findOfficial } from '../data/electedOfficials';
import {
  election2025Sources,
  findElection2025OfficialResult,
} from '../data/election2025';

const number = (value: number) => value.toLocaleString('en-PH');
const percentage = (value: number) => value.toFixed(2) + '%';

export default function OfficialProfile() {
  const { slug } = useParams();
  const official = findOfficial(slug);
  const electionResult = findElection2025OfficialResult(slug);

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
        description={
          official.office +
          (official.district ? ', ' + official.district : '') +
          ' — current Makati elected-official profile and 2025 election result.'
        }
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: official.name,
          jobTitle: official.office,
          affiliation: {
            '@type': 'GovernmentOrganization',
            name:
              official.level === 'congress'
                ? 'House of Representatives of the Philippines'
                : 'City Government of Makati',
          },
        }}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <Heading>{official.displayName}</Heading>
              <SharePage title={official.displayName + ' | BetterMakati'} />
            </div>
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
                  {official.level === 'congress'
                    ? 'National legislature'
                    : 'City government'}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-primary-100 bg-white p-6">
            <Landmark className="h-6 w-6 text-primary-700" />
            <h2 className="mt-4 text-lg font-extrabold text-gray-950">Sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Party is shown as it appeared on the 2025 ballot. Election
              results use COMELEC Media Server counts shown at 100% precincts
              reporting, with the official COMELEC results portal linked below.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <a
                href={election2025Sources.officialResults}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3 font-bold text-primary-700"
              >
                COMELEC 2025 results portal
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
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

      {electionResult && (
        <Section className="bg-[#f5f8f2]">
          <div className="section-eyebrow">2025 election result</div>
          <Heading level={2}>{electionResult.raceLabel}</Heading>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <Vote className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-2xl font-extrabold text-gray-950">
                {number(electionResult.votes)}
              </div>
              <div className="text-sm text-gray-600">votes received</div>
            </div>

            {electionResult.validVoteShare !== undefined ? (
              <div className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-2xl font-extrabold text-gray-950">
                  {percentage(electionResult.validVoteShare)}
                </div>
                <div className="text-sm text-gray-600">of valid votes</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-2xl font-extrabold text-gray-950">
                  #{electionResult.rank}
                </div>
                <div className="text-sm text-gray-600">
                  rank for {electionResult.seatsAvailable} elected seats
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-2xl font-extrabold text-gray-950">
                {percentage(electionResult.voterShare)}
              </div>
              <div className="text-sm text-gray-600">
                of voters who cast a ballot
              </div>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-2xl font-extrabold text-gray-950">
                {percentage(electionResult.populationShare)}
              </div>
              <div className="text-sm text-gray-600">
                of 2024 population in the jurisdiction
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  Jurisdiction
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {electionResult.jurisdictionLabel}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  Turnout
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {number(electionResult.ballotsCast)} of{' '}
                  {number(electionResult.registeredVoters)} registered voters ·{' '}
                  {percentage(electionResult.turnout)}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  2024 population
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {number(electionResult.population2024)}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              “Share of voters” is votes received divided by all people who cast
              a ballot in the relevant city or district. For councilors, voters
              could select up to eight candidates, so individual candidate
              shares do not add to 100%. Population share is contextual only and
              includes people who were not eligible to vote.
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
