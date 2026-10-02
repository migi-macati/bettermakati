import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import CitizenSummary from '../components/ui/CitizenSummary';
import CivicRelationshipLinks from '../components/civic/CivicRelationshipLinks';
import { governmentImageSet } from '../data/cityImages';
import { requireCivicEcosystemResource } from '../data/ecosystemResources';
import {
  cityExecutiveOfficials,
  congressionalOfficials,
  councilOfficials,
} from '../data/electedOfficials';

const openCongressResource = requireCivicEcosystemResource('open-congress');
const nationalGovernmentResource =
  requireCivicEcosystemResource('national-government');

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
}) => {
  const { t } = useTranslation();
  return (
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
      {t('servicesGovernment.government.viewProfile')} <ArrowRight className="h-4 w-4" />
    </span>
  </Link>
  );
};

export default function Government() {
  const { t } = useTranslation();
  const firstDistrict = councilOfficials.filter(
    official => official.district === '1st District'
  );
  const secondDistrict = councilOfficials.filter(
    official => official.district === '2nd District'
  );

  return (
    <>
      <SEO
        title={t('servicesGovernment.government.seoTitle')}
        description={t('servicesGovernment.government.seoDescription')}
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('servicesGovernment.government.eyebrow')}</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>{t('servicesGovernment.government.title')}</Heading>
          <SharePage title="Makati City Government | BetterMakati" />
        </div>
        <LastReviewed date="2026-09-20" note={t('servicesGovernment.government.reviewNote')} />
        <Text className="mt-3 max-w-3xl text-gray-700">
          {t('servicesGovernment.government.intro')}
        </Text>
        <PhotoCarousel
          images={governmentImageSet}
          title={t('servicesGovernment.government.photoTitle')}
          compact
          className="mt-8"
        />

        <CitizenSummary
          className="mt-6"
          eyebrow={t('servicesGovernment.government.summary.eyebrow')}
          title={t('servicesGovernment.government.summary.title')}
          points={[
            {
              label: t('servicesGovernment.government.summary.mayorLabel'),
              text: t('servicesGovernment.government.summary.mayorText'),
            },
            {
              label: t('servicesGovernment.government.summary.viceMayorLabel'),
              text: t('servicesGovernment.government.summary.viceMayorText'),
            },
            {
              label: t('servicesGovernment.government.summary.councilLabel'),
              text: t('servicesGovernment.government.summary.councilText'),
            },
            {
              label: t('servicesGovernment.government.summary.departmentsLabel'),
              text: t('servicesGovernment.government.summary.departmentsText'),
            },
          ]}
          note={
            <>
              For the legal allocation of powers, use the{' '}
              <a
                href={charterUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary-700 underline underline-offset-2"
              >
                {t('servicesGovernment.government.charter')}\n              </a>\n              {t('servicesGovernment.government.summary.noteAfterCharter')}
            </>
          }
          actions={
            <Link to="/services" className="text-sm font-bold text-primary-700 underline underline-offset-2">
              {t('servicesGovernment.government.findService')} <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          }
        />

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
        <div className="section-eyebrow">{t('servicesGovernment.government.representation')}</div>
        <Heading level={2}>{t('servicesGovernment.government.house')}</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {congressionalOfficials.map(official => (
            <OfficialCard key={official.slug} official={official} />
          ))}
        </div>
        <CivicRelationshipLinks
          label="National context"
          tone="neutral"
          className="mt-5"
          items={[
            {
              id: openCongressResource.id,
              label: openCongressResource.name,
              href: openCongressResource.href,
              external: true,
            },
            {
              id: nationalGovernmentResource.id,
              label: nationalGovernmentResource.name,
              href: nationalGovernmentResource.href,
              external: true,
            },
          ]}
        />
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div id="council" className="scroll-mt-28">
          <div className="section-eyebrow">{t('servicesGovernment.government.localLegislature')}</div>
          <Heading level={2}>{t('servicesGovernment.government.cityCouncil')}</Heading>
          <Text className="mt-2 max-w-3xl text-gray-700">
            {t('servicesGovernment.government.councilIntroBefore')}{' '}
            <a
              className="font-bold text-primary-700 underline underline-offset-2"
              href={charterUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t('servicesGovernment.government.charter')}\n            </a>\n            {t('servicesGovernment.government.councilIntroAfter')}
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
            <Heading level={2}>{t('servicesGovernment.government.cityOffices')}</Heading>
            <a
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              href={charterUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t('servicesGovernment.government.charter')} <ExternalLink className="h-3.5 w-3.5" />
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
          <Heading level={2}>{t('servicesGovernment.government.cityHall')}</Heading>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <p>
              <strong>{t('servicesGovernment.government.trunkline')}:</strong>{' '}
              <a className="text-primary-700 underline" href="tel:+63288701000">
                +63 2 8870-1000
              </a>
            </p>
            <p>
              <strong>{t('servicesGovernment.government.email')}:</strong>{' '}
              <a
                className="text-primary-700 underline"
                href="mailto:makati@makati.gov.ph"
              >
                makati@makati.gov.ph
              </a>
            </p>
            <p>
              <strong>{t('servicesGovernment.government.officeHours')}:</strong> {t('servicesGovernment.government.officeHoursValue')}
            </p>
            <a
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
            >
              {t('servicesGovernment.government.officialPortal')}{' '}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
