import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  cityExecutiveOfficials,
  congressionalOfficials,
  councilOfficials,
} from '../data/electedOfficials';

const offices = [
  'Office of the City Mayor',
  'Office of the City Vice Mayor',
  'Offices of the Sangguniang Panlungsod Members',
  'Office of the City Administrator',
  'Finance Department',
  'Department of Engineering and Public Works',
  'Law Department',
  'Makati Health Department',
  'Assessment Department',
  'City Budget Department',
  'Urban Development Department',
  'International Relations Department',
  'Makati Social Welfare Department',
  'Information and Community Relations Department',
  'Youth and Sports Development Department',
  'Education Department',
  'Department of Environmental Services',
  'Public Safety Department',
];

const charterUrl = 'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html';

const OfficialCard = ({
  official,
}: {
  official: (typeof cityExecutiveOfficials)[number];
}) => (
  <Link
    to={'/officials/' + official.slug}
    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
  >
    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
      {official.office}
      {official.district ? ' · ' + official.district : ''}
    </div>
    <h3 className="mt-2 text-lg font-extrabold text-gray-950">
      {official.displayName}
    </h3>
    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
      View profile <ArrowRight className="h-4 w-4" />
    </span>
  </Link>
);

export default function Government() {
  const firstDistrict = councilOfficials.filter(
    official => official.district === '1st District'
  );
  const secondDistrict = councilOfficials.filter(
    official => official.district === '2nd District'
  );

  return (
    <>
      <SEO
        title="Government"
        description="Makati City elected officials, representation and city offices."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City government</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Makati City Government</Heading>
          <SharePage title="Makati City Government | BetterMakati" />
        </div>
        <LastReviewed note="Current elected-official profiles are tied to the 2025 election records cited on each profile." />
        <Text className="mt-3 max-w-3xl text-gray-700">
          Current elected-official profiles are linked to the election records
          used to identify the officeholder. Party labels, where shown, refer to
          the 2025 ballot rather than an inferred current affiliation.
        </Text>

        <div
          id="leadership"
          className="scroll-mt-28 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {cityExecutiveOfficials.map(official => (
            <OfficialCard key={official.slug} official={official} />
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Representation</div>
        <Heading level={2}>House of Representatives</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {congressionalOfficials.map(official => (
            <OfficialCard key={official.slug} official={official} />
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div id="council" className="scroll-mt-28">
          <div className="section-eyebrow">Local legislature</div>
          <Heading level={2}>City Council</Heading>
          <Text className="mt-2 max-w-3xl text-gray-700">
            The Sangguniang Panlungsod is Makati&apos;s legislative body. Under the{' '}
            <a
              className="font-bold text-primary-700 underline underline-offset-2"
              href={charterUrl}
              target="_blank"
              rel="noreferrer"
            >
              Makati City Charter
            </a>
            , the Vice Mayor serves as presiding officer.
          </Text>

          <div className="mt-7 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-950">1st District</h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {firstDistrict.map(official => (
                  <OfficialCard key={official.slug} official={official} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-950">2nd District</h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secondDistrict.map(official => (
                  <OfficialCard key={official.slug} official={official} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div id="offices" className="scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
            <Heading level={2}>City offices</Heading>
            <a
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              href={charterUrl}
              target="_blank"
              rel="noreferrer"
            >
              Makati City Charter <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-10">
            {offices.map(office => (
              <div key={office} className="border-b py-2 text-gray-800">
                {office}
              </div>
            ))}
          </div>
        </div>

        <div id="city-hall" className="scroll-mt-28">
          <Heading level={2}>Makati City Hall</Heading>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <p>
              <strong>Trunkline:</strong>{' '}
              <a className="text-primary-700 underline" href="tel:+63288701000">
                +63 2 8870-1000
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a
                className="text-primary-700 underline"
                href="mailto:makati@makati.gov.ph"
              >
                makati@makati.gov.ph
              </a>
            </p>
            <p>
              <strong>Office hours:</strong> Monday to Friday, 8:00 AM–5:00 PM
            </p>
            <a
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
            >
              Official Makati City Web Portal{' '}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
