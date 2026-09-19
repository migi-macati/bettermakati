import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  UserCheck,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

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

export default function Elections() {
  return (
    <>
      <SEO
        title="Elections & Voting"
        description="Neutral voter information, dates and official COMELEC sources for elections affecting Makati."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Civic information</div>
        <Heading>Elections & Voting</Heading>
        <p className="mt-3 max-w-3xl text-gray-700 leading-relaxed">
          A neutral guide to voting in Makati. Dates, candidate records and
          precinct information should be checked against COMELEC before acting.
          BetterMakati does not endorse candidates or parties.
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

      <Section className="bg-[#f5f8f2]">
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

      <Section className="bg-white">
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

      <Section className="bg-[#fffdf8]">
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
