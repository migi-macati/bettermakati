import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  UserCheck,
  Vote,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import SectionNav from '../components/ui/SectionNav';
import {
  election2025CouncilWinners,
  election2025Electorate,
  election2025SingleSeatRaces,
  election2025Sources,
  percent,
} from '../data/election2025';

const electionCalendar =
  'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11191.pdf';
const registrationResolution =
  'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11177.pdf';
const precinctFinder = 'https://precinctfinder.comelec.gov.ph/voter_precinct';
const comelec = 'https://www.comelec.gov.ph/';

const milestones = [
  {
    date: 'May 18, 2026',
    title: 'Local voter registration closed',
    detail:
      'The regular non-BARMM registration period for the 2026 Barangay and Sangguniang Kabataan Elections ended on this date.',
    href: registrationResolution,
  },
  {
    date: 'September 28 – October 5, 2026',
    title: 'Filing of certificates of candidacy',
    detail:
      'COMELEC’s official calendar sets this period for filing COCs for the 2026 BSKE.',
    href: electionCalendar,
  },
  {
    date: 'October 22 – 31, 2026',
    title: 'Campaign period',
    detail:
      'The official campaign period for barangay and SK candidates.',
    href: electionCalendar,
  },
  {
    date: 'November 2, 2026',
    title: 'Election day',
    detail: 'Voting is scheduled from 7:00 AM to 3:00 PM.',
    href: electionCalendar,
  },
];

const number = (value: number) => value.toLocaleString('en-PH');
const percentage = (value: number) => value.toFixed(2) + '%';

export default function Elections() {
  const district1Council = election2025CouncilWinners.filter(
    item => item.jurisdiction === 'district1'
  );
  const district2Council = election2025CouncilWinners.filter(
    item => item.jurisdiction === 'district2'
  );

  return (
    <>
      <SEO
        title="Elections & Voting"
        description="Neutral voter information, 2025 Makati election results, dates and official COMELEC sources."
      />

      <Section id="election-guide" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Civic information</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Elections & Voting</Heading>
          <SharePage title="Elections & Voting | BetterMakati" />
        </div>
        <LastReviewed note="Election dates and results are linked to COMELEC sources." />
        <SectionNav items={[
          { label: '2025 results', href: '#results-2025' },
          { label: 'Council', href: '#council-results' },
          { label: '2026 BSKE', href: '#bske-2026' },
          { label: 'Voter tools', href: '#voter-tools' },
          { label: 'Candidates', href: '#candidates' },
        ]} />
        <p className="mt-5 max-w-3xl text-gray-700 leading-relaxed">
          A neutral guide to voting and election results in Makati. Dates,
          candidate records and precinct information should be checked against
          COMELEC before acting. BetterMakati does not endorse candidates or
          parties.
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
              Registration status
            </div>
            <div className="mt-1 text-2xl font-extrabold text-gray-950">
              Regular registration closed
            </div>
            <p className="mt-2 text-sm text-gray-600">
              The non-BARMM registration period ended May 18, 2026. Registered
              voters can still verify their record and polling place through
              COMELEC.
            </p>
          </div>
        </div>
      </Section>

      <Section id="results-2025" className="bg-white">
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
          <Heading level={3}>Elected councilors</Heading>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
            Eight councilors are elected from each district. “Share of voters”
            is the candidate’s votes divided by the number of people who cast a
            ballot in that district. Because each voter could select up to eight
            councilors, these percentages do not add to 100%.
          </p>

          {[
            ['1st District', district1Council],
            ['2nd District', district2Council],
          ].map(([label, winners]) => (
            <div key={label as string} className="mt-7">
              <h3 className="font-extrabold text-lg text-gray-950">
                {label as string}
              </h3>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="bg-gray-50 text-sm">
                    <tr>
                      <th className="px-4 py-3 font-bold">Rank</th>
                      <th className="px-4 py-3 font-bold">Elected councilor</th>
                      <th className="px-4 py-3 font-bold text-right">Votes</th>
                      <th className="px-4 py-3 font-bold text-right">
                        Share of district voters
                      </th>
                      <th className="px-4 py-3 font-bold text-right">
                        Share of 2024 district population
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(winners as typeof district1Council).map(item => (
                      <tr key={item.officialSlug} className="border-t">
                        <td className="px-4 py-3 font-bold">{item.rank}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-950">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.party}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {number(item.votes)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {percentage(item.voterShare)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {percentage(item.populationShare)}
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

      <Section id="bske-2026" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">2026 BSKE</div>
        <Heading level={2}>Key dates</Heading>
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {milestones.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <div className="text-sm font-extrabold text-primary-800">
                {item.date}
              </div>
              <h3 className="mt-1 font-extrabold text-lg text-gray-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.detail}
              </p>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                Official COMELEC source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="voter-tools" className="bg-white">
        <div className="section-eyebrow">Before election day</div>
        <Heading level={2}>Check your record and polling place</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={precinctFinder}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <MapPin className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">
              COMELEC Precinct Finder
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Verify voter status, precinct number and voting center.
            </p>
          </a>

          <a
            href={electionCalendar}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <FileText className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">
              Official election calendar
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              COMELEC Resolution No. 11191 for the November 2, 2026 BSKE.
            </p>
          </a>

          <a
            href={comelec}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <CheckCircle2 className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">COMELEC</h3>
            <p className="mt-1 text-sm text-gray-600">
              Use COMELEC for certified candidate lists, resolutions and late
              changes.
            </p>
          </a>
        </div>
      </Section>

      <Section id="candidates" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Candidates</div>
        <Heading level={2}>Candidate information</Heading>
        <p className="mt-3 max-w-3xl text-gray-700 leading-relaxed">
          Filing of certificates of candidacy is scheduled for September 28 to
          October 5, 2026. BetterMakati will publish a Makati-by-barangay
          candidate directory only after COMELEC releases certified candidate
          information. Until then, no candidate list is inferred from campaign
          materials, social media or declarations of intent.
        </p>
      </Section>
    </>
  );
}
