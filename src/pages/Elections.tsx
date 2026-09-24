import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  Vote,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import SectionNav from '../components/ui/SectionNav';
import CitizenSummary from '../components/ui/CitizenSummary';
import {
  election2025CouncilCandidates,
  election2025Electorate,
  election2025SingleSeatRaces,
  election2025Sources,
  percent,
} from '../data/election2025';
import {
  barangayMayoralResults2025,
  barangayResultSource2025,
  historicalCandidateShare,
  historicalValidVotes,
  makatiMayoralHistory,
} from '../data/electionHistory';
import {
  bskeMilestones,
  bskeRuleCards,
  electionCivicSources,
  electionDataSources,
  electionsReviewed,
  getBskePhase,
} from '../data/electionCivic';

const number = (value: number) => value.toLocaleString('en-PH');
const percentage = (value: number) => value.toFixed(2) + '%';

const election2025Csv = [
  'race,jurisdiction,candidate,party,votes,elected,share_of_valid_votes,share_of_ballots_cast,source_url',
  ...election2025SingleSeatRaces.flatMap(race => {
    const electorate = election2025Electorate[race.jurisdiction];
    return race.candidates.map(candidate =>
      [
        race.label,
        electorate.label,
        candidate.name,
        candidate.party,
        candidate.votes,
        candidate.elected ? 'yes' : 'no',
        percent(candidate.votes, race.validVotes).toFixed(2),
        percent(candidate.votes, electorate.ballotsCast).toFixed(2),
        election2025Sources.localResults,
      ]
        .map(value => '"' + String(value).replaceAll('"', '""') + '"')
        .join(',')
    );
  }),
  ...(
    [
      ['1st District City Councilor', 'district1'],
      ['2nd District City Councilor', 'district2'],
    ] as const
  ).flatMap(([raceLabel, jurisdiction]) => {
    const electorate = election2025Electorate[jurisdiction];
    return election2025CouncilCandidates[jurisdiction].map(candidate =>
      [
        raceLabel,
        electorate.label,
        candidate.name,
        candidate.party,
        candidate.votes,
        candidate.elected ? 'yes' : 'no',
        '',
        percent(candidate.votes, electorate.ballotsCast).toFixed(2),
        election2025Sources.localResults,
      ]
        .map(value => '"' + String(value).replaceAll('"', '""') + '"')
        .join(',')
    );
  }),
].join('\n');

const barangay2025Csv = [
  'barangay,carried_by,nancy_binay_votes,luis_campos_jr_votes,exact_votes_verified,source_url',
  ...barangayMayoralResults2025.map(result =>
    [
      result.barangay,
      result.carriedBy,
      result.nancyVotes ?? '',
      result.camposVotes ?? '',
      result.exactVotesVerified ? 'yes' : 'no',
      barangayResultSource2025.url,
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
].join('\n');

const mayoralHistoryCsv = [
  'year,election_date,winner,candidate,party,votes,share_of_listed_candidate_votes,source_quality,source_url',
  ...makatiMayoralHistory.flatMap(race =>
    race.candidates.map(candidate =>
      [
        race.year,
        race.electionDate,
        race.winner,
        candidate.name,
        candidate.party,
        candidate.votes,
        historicalCandidateShare(candidate, race).toFixed(2),
        race.sourceQuality,
        race.sourceUrl,
      ]
        .map(value => '"' + String(value).replaceAll('"', '""') + '"')
        .join(',')
    )
  ),
].join('\n');

export default function Elections() {
  const bskePhase = getBskePhase();
  const councilDistricts = [
    {
      label: '1st District',
      jurisdiction: 'district1' as const,
      candidates: election2025CouncilCandidates.district1,
      electorate: election2025Electorate.district1,
    },
    {
      label: '2nd District',
      jurisdiction: 'district2' as const,
      candidates: election2025CouncilCandidates.district2,
      electorate: election2025Electorate.district2,
    },
  ];

  return (
    <>
      <SEO
        title="Elections & Voting"
        description="Neutral Makati election information with 2025 city and barangay results, a 1998–2025 mayoral history, voter dates and source-quality notes."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Makati election results and voter information',
          description:
            'Makati election results including 2025 city and barangay views, historical mayoral races from 1998 to 2025, turnout and source links.',
          spatialCoverage: 'Makati City, Philippines',
          temporalCoverage: '1998/2026',
        }}
      />

      <Section id="election-guide" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Civic information</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Elections & Voting</Heading>
          <SharePage title="Elections & Voting | BetterMakati" />
        </div>
        <LastReviewed
          date={electionsReviewed}
          note="Current election dates and rules use COMELEC and statutory sources; older result sources are labeled by quality."
        />
        <SectionNav items={[
                { label: '2025 results', href: '#results-2025' },
          { label: 'By barangay', href: '#barangay-results-2025' },
          { label: '1998–2025 history', href: '#mayoral-history' },
          { label: 'Council', href: '#council-results' },
          { label: '2026 BSKE', href: '#bske-2026' },
          { label: 'Voter tools', href: '#voter-tools' },
          { label: 'Data & sources', href: '#election-data' },
          { label: 'Candidates', href: '#candidates' },
        ]} />
        <p className="mt-5 max-w-3xl text-gray-700 leading-relaxed">
          Voting information and election results for Makati. Check COMELEC for current dates, candidate records and precinct information. No endorsements.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <CalendarDays className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-primary-700">
              Next local election in Makati
            </div>
            <div className="mt-1 text-2xl font-extrabold text-gray-950">
              2026 Barangay & SK Elections
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Election day: November 2, 2026
            </p>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <UserCheck className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-primary-700">
              Current BSKE phase
            </div>
            <div className="mt-1 text-2xl font-extrabold text-gray-950">
              {bskePhase.label}
            </div>
            <p className="mt-2 text-sm text-gray-600">{bskePhase.detail}</p>
          </div>
        </div>
      </Section>


      <Section id="results-2025" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Latest completed election</div>
        <Heading level={2}>2025 Makati election results</Heading>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
          The May 12, 2025 national and local election elected Makati’s mayor,
          vice mayor, two district representatives and 16 elected city
          councilors. Result counts below use the COMELEC Media Server data
          shown at 100% precincts reporting. Population comparisons use the
          2024 POPCEN and are context only: population includes children and
          other people who were not eligible or did not vote.
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              ['Citywide', election2025Electorate.city],
              ['1st District', election2025Electorate.district1],
              ['2nd District', election2025Electorate.district2],
            ] as const
          ).map(([label, electorate]) => (
            <div
              key={label}
              className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5"
            >
              <Vote className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-sm font-bold text-gray-950">{label}</div>
              <div className="mt-1 text-2xl font-extrabold text-primary-800">
                {percentage(electorate.turnout)}
              </div>
              <div className="text-xs text-gray-500">voter turnout</div>
              <div className="mt-3 text-sm text-gray-600">
                {number(electorate.ballotsCast)} ballots cast of{' '}
                {number(electorate.registeredVoters)} registered voters
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {election2025SingleSeatRaces.map(race => {
            const winner = race.candidates.find(candidate => candidate.elected)!;
            const electorate = election2025Electorate[race.jurisdiction];
            const validShare = percent(winner.votes, race.validVotes);
            const voterShare = percent(winner.votes, electorate.ballotsCast);
            const populationShare = percent(
              winner.votes,
              electorate.population2024
            );

            return (
              <article
                key={race.key}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
              >
                <div className="border-b border-gray-100 bg-[#f5f8f2] p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {race.label}
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-gray-950">
                    {winner.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {number(winner.votes)} votes · {percentage(validShare)} of
                    valid votes
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-gray-100">
                  <div className="bg-white p-4">
                    <div className="text-xl font-extrabold text-gray-950">
                      {percentage(voterShare)}
                    </div>
                    <div className="text-xs text-gray-500">
                      of voters who cast a ballot
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="text-xl font-extrabold text-gray-950">
                      {percentage(populationShare)}
                    </div>
                    <div className="text-xs text-gray-500">
                      of 2024 population
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    All candidates
                  </div>
                  <div className="mt-3 space-y-2">
                    {race.candidates.map(candidate => (
                      <div
                        key={candidate.name}
                        className="flex items-start justify-between gap-4 text-sm"
                      >
                        <div>
                          <span className="font-bold text-gray-900">
                            {candidate.name}
                          </span>
                          <span className="text-gray-500"> · {candidate.party}</span>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div className="font-bold text-gray-900">
                            {number(candidate.votes)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentage(percent(candidate.votes, race.validVotes))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div id="council-results" className="mt-10 scroll-mt-28">
          <div className="section-eyebrow">City Council</div>
          <Heading level={3}>Full 2025 council candidate results</Heading>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
            Eight councilors were elected from each district. The tables below now include every candidate in the published COMELEC Media Server result table, not only the winners. “Share of ballots cast” divides a candidate’s votes by the number of voters who cast a ballot in that district; because each voter could choose up to eight councilors, these percentages do not add to 100%.
          </p>

          {councilDistricts.map(district => (
            <div key={district.jurisdiction} className="mt-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-950">{district.label}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {number(district.electorate.ballotsCast)} ballots cast · {number(district.electorate.registeredVoters)} registered voters
                  </p>
                </div>
                <div className="text-xs font-bold text-primary-700">
                  {district.candidates.length} candidates · 8 elected
                </div>
              </div>

              <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-gray-50 text-sm">
                    <tr>
                      <th className="px-4 py-3 font-bold">Rank</th>
                      <th className="px-4 py-3 font-bold">Candidate</th>
                      <th className="px-4 py-3 font-bold">Result</th>
                      <th className="px-4 py-3 font-bold text-right">Votes</th>
                      <th className="px-4 py-3 font-bold text-right">Share of ballots cast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {district.candidates.map(candidate => (
                      <tr key={candidate.name} className="border-t">
                        <td className="px-4 py-3 font-bold">{candidate.rank}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-950">{candidate.name}</div>
                          <div className="text-xs text-gray-500">{candidate.party}</div>
                        </td>
                        <td className="px-4 py-3">
                          {candidate.elected ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-50 px-2.5 py-1 text-xs font-bold text-success-800">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Elected
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Not elected</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-bold">{number(candidate.votes)}</td>
                        <td className="px-4 py-3 text-right">
                          {percentage(percent(candidate.votes, district.electorate.ballotsCast))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
          <div className="font-extrabold text-gray-950">How the percentages work</div>
          <p className="mt-2 leading-relaxed">
            For mayor, vice mayor and representatives, the result card shows
            share of valid votes in that race. “Share of voters” divides the
            winner’s votes by all ballots cast in the relevant jurisdiction,
            including ballots that left that race blank or invalid. “Share of
            population” divides the same vote count by the 2024 population of
            the relevant city or district.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={election2025Sources.officialResults}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-primary-700"
            >
              COMELEC 2025 results portal <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={election2025Sources.localResults}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-primary-700"
            >
              Makati result table <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={election2025Sources.population}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-primary-700"
            >
              PSA 2024 population <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </Section>

      <Section id="barangay-results-2025" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">2025 mayoral vote by barangay</div>
        <Heading level={2}>How the 23 current barangays voted</Heading>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
          Published reporting identifies which mayoral candidate carried each of Makati&apos;s current 23 barangays. Exact barangay vote totals are shown only where the accessible published text exposes them; BetterMakati does not fill the remaining precinct aggregates from inference.
        </p>

        <CitizenSummary
          className="mt-6"
          eyebrow="Citywide pattern"
          title="Nancy Binay carried 19 barangays; Luis Campos carried four"
          points={[
            {
              label: 'Nancy Binay',
              text: 'Carried 19 of the current 23 barangays, including both Guadalupe barangays and the larger 1st District barangays identified in published reporting.',
            },
            {
              label: 'Luis Campos Jr.',
              text: 'Carried Carmona, Pinagkaisahan, Singkamas and Valenzuela. Published reporting describes all four margins as under five percentage points.',
            },
            {
              label: 'Verified example · San Lorenzo',
              text: (
                <>
                  Nancy Binay <strong>3,294</strong> · Luis Campos Jr. <strong>2,521</strong>.
                </>
              ),
            },
            {
              label: 'Verified example · Guadalupe Nuevo',
              text: (
                <>
                  Nancy Binay <strong>10,260</strong> · Luis Campos Jr. <strong>10,083</strong>.
                </>
              ),
            },
          ]}
          note="This barangay layer currently describes the mayoral race only. Citywide 2025 results above remain based on the COMELEC Media Server result table."
          actions={
            <a
              href={barangayResultSource2025.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Barangay-result source <ExternalLink className="inline h-3.5 w-3.5" />
            </a>
          }
        />

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-3 font-bold">Barangay</th>
                <th className="px-4 py-3 font-bold">Candidate who carried barangay</th>
                <th className="px-4 py-3 font-bold text-right">Nancy Binay</th>
                <th className="px-4 py-3 font-bold text-right">Luis Campos Jr.</th>
                <th className="px-4 py-3 font-bold">Data shown</th>
              </tr>
            </thead>
            <tbody>
              {barangayMayoralResults2025.map(result => (
                <tr key={result.slug} className="border-t">
                  <td className="px-4 py-3">
                    <Link
                      to={'/barangays/' + result.slug + '#election-2025'}
                      className="font-bold text-primary-700"
                    >
                      {result.barangay}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-950">
                    {result.carriedBy}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {result.nancyVotes === undefined ? '—' : number(result.nancyVotes)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {result.camposVotes === undefined ? '—' : number(result.camposVotes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.exactVotesVerified ? 'Published vote totals' : 'Barangay winner verified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          A dash does not mean zero votes. It means BetterMakati has not yet matched a reliable public precinct aggregate for that barangay.
        </p>
      </Section>

      <Section id="mayoral-history" className="bg-white">
        <div className="section-eyebrow">Ten regular city elections</div>
        <Heading level={2}>Makati mayoral history, 1998–2025</Heading>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
          This series keeps the candidate vote counts for ten regular Makati city elections in one place. The percentage below is calculated from the candidate votes listed for each race so the denominator is consistent within this table.
        </p>

        <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
          <div className="font-extrabold text-gray-950">Boundary break before 2025</div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The 1998–2022 elections used the Makati electorate that still included the Embo barangays. The 2025 election was the first regular city election after those 10 barangays were no longer part of Makati. Raw vote totals and electorate size should therefore not be treated as a continuous like-for-like series across that break.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-3 font-bold">Election</th>
                <th className="px-4 py-3 font-bold">Winner</th>
                <th className="px-4 py-3 font-bold text-right">Votes</th>
                <th className="px-4 py-3 font-bold text-right">Share of listed candidate votes</th>
                <th className="px-4 py-3 font-bold">Runner-up</th>
                <th className="px-4 py-3 font-bold text-right">Vote margin</th>
                <th className="px-4 py-3 font-bold">Source</th>
              </tr>
            </thead>
            <tbody>
              {makatiMayoralHistory.map(race => {
                const winner = race.candidates.find(candidate => candidate.name === race.winner)!;
                const sorted = [...race.candidates].sort((a, b) => b.votes - a.votes);
                const runnerUp = sorted[1];
                return (
                  <tr key={race.year} className="border-t align-top">
                    <td className="px-4 py-3 font-extrabold text-gray-950">
                      {race.year}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-950">{winner.name}</div>
                      <div className="text-xs text-gray-500">{winner.party}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {number(winner.votes)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {percentage(historicalCandidateShare(winner, race))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{runnerUp?.name || '—'}</div>
                      <div className="text-xs text-gray-500">{runnerUp?.party || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {runnerUp ? number(winner.votes - runnerUp.votes) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={race.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        {race.sourceQuality === 'official'
                          ? 'Official COMELEC'
                          : race.sourceQuality === 'comelec-media'
                            ? 'COMELEC Media Server via publisher'
                            : race.sourceQuality === 'academic'
                              ? 'UP CIDS dataset'
                              : race.sourceQuality === 'mixed'
                                ? 'Official + archival'
                                : 'Archival secondary'}
                        <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <details className="mt-5 rounded-2xl border border-gray-200 bg-[#fffdf8]">
          <summary className="cursor-pointer px-5 py-4 font-extrabold text-gray-950">
            See all candidates in each mayoral race
          </summary>
          <div className="border-t border-gray-200 p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {makatiMayoralHistory.map(race => (
                <article key={'detail-' + race.year} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-extrabold text-gray-950">{race.year}</h3>
                    <span className="text-xs text-gray-500">
                      {number(historicalValidVotes(race))} listed candidate votes
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[...race.candidates]
                      .sort((a, b) => b.votes - a.votes)
                      .map(candidate => (
                        <div key={candidate.name} className="flex items-start justify-between gap-4 text-sm">
                          <div>
                            <span className="font-bold text-gray-900">{candidate.name}</span>
                            <span className="text-gray-500"> · {candidate.party}</span>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <div className="font-bold text-gray-950">{number(candidate.votes)}</div>
                            <div className="text-xs text-gray-500">
                              {percentage(historicalCandidateShare(candidate, race))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {race.geographyNote && (
                    <p className="mt-3 text-xs leading-relaxed text-gray-500">
                      {race.geographyNote}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </details>
      </Section>

      <Section id="bske-2026" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">2026 BSKE</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Calendar & legal framework</Heading>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
              BetterMakati keeps the operative COMELEC calendar beside the statute and implementing rules so a schedule change or legal transition can be traced to its source.
            </p>
          </div>
          <div className="rounded-xl border border-secondary-200 bg-white px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-900">
              Current phase
            </div>
            <div className="mt-1 font-extrabold text-gray-950">{bskePhase.label}</div>
            <div className="mt-1 max-w-sm text-xs leading-relaxed text-gray-600">{bskePhase.detail}</div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bskeMilestones.map(item => (
            <article key={item.title} className="rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-sm font-extrabold text-primary-800">{item.date}</div>
              <h3 className="mt-1 font-extrabold text-lg text-gray-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.detail}</p>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                Open official source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {bskeRuleCards.map(item => (
            <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <ShieldCheck className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-700"
              >
                {item.sourceLabel} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="voter-tools" className="bg-white">
        <div className="section-eyebrow">Before election day</div>
        <Heading level={2}>Check your record and polling place</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          Voter status, precinct assignment and late election changes should be checked directly with COMELEC.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={electionCivicSources.precinctFinder}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <MapPin className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">COMELEC Precinct Finder</h3>
            <p className="mt-1 text-sm text-gray-600">Verify voter status, precinct number and voting center.</p>
          </a>

          <a
            href={electionCivicSources.bskeCalendar}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <FileText className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Official election calendar</h3>
            <p className="mt-1 text-sm text-gray-600">
              COMELEC Resolution No. 11191 for the November 2, 2026 BSKE.
            </p>
          </a>

          <a
            href={electionCivicSources.comelec}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <CheckCircle2 className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">COMELEC</h3>
            <p className="mt-1 text-sm text-gray-600">
              Use the election authority for certified candidate lists, resolutions, precinct information and late changes.
            </p>
          </a>
        </div>
      </Section>

      <Section id="election-data" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Data & provenance</div>
        <Heading level={2}>Download the structured election data</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          BetterMakati keeps raw candidate totals and source URLs in the downloads so the displayed summaries can be checked independently.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <a
            href={'data:text/csv;charset=utf-8,' + encodeURIComponent(election2025Csv)}
            download="bettermakati-election-2025-local-results.csv"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
          >
            <Download className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">2025 local results CSV</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Mayor, vice mayor, House districts and all candidates in both city-council districts.
            </p>
          </a>

          <a
            href={'data:text/csv;charset=utf-8,' + encodeURIComponent(barangay2025Csv)}
            download="bettermakati-election-2025-barangay-mayor.csv"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
          >
            <Download className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">2025 barangay mayor CSV</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The candidate who carried each current barangay, with exact totals only where verified.
            </p>
          </a>

          <a
            href={'data:text/csv;charset=utf-8,' + encodeURIComponent(mayoralHistoryCsv)}
            download="bettermakati-mayoral-history-1998-2025.csv"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
          >
            <Download className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Mayoral history CSV</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Ten regular elections, candidate totals, calculated shares and source-quality labels.
            </p>
          </a>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Source</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold">Open</th>
              </tr>
            </thead>
            <tbody>
              {electionDataSources.map(source => (
                <tr key={source.href} className="border-t">
                  <td className="px-4 py-4 font-bold text-gray-950">{source.label}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{source.kind}</td>
                  <td className="px-4 py-4">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                    >
                      Source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </Section>

      <Section id="candidates" className="bg-white">
        <div className="section-eyebrow">2026 candidates</div>
        <Heading level={2}>Candidate directory status</Heading>
        <div className="mt-5 rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-900">
            {bskePhase.label}
          </div>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
            Official Makati candidate list pending COMELEC publication. Certificate-of-candidacy filing runs September 28–October 5, 2026.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={electionCivicSources.filingRules}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              COC filing rules <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={electionCivicSources.comelec}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-primary"
            >
              Check COMELEC <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
