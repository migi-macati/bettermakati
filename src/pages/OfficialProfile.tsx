import {
  ExternalLink,
  FileText,
  Landmark,
  Vote,
  Scale,
} from 'lucide-react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SharePage from '../components/ui/SharePage';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CivicRelationshipLinks from '../components/civic/CivicRelationshipLinks';
import { findOfficial } from '../data/electedOfficials';
import {
  election2025Sources,
  findElection2025OfficialResult,
} from '../data/election2025';
import { electionRecordForOfficial } from '../data/officialCivicRelationships';

const number = (value: number) => value.toLocaleString('en-PH');
const percentage = (value: number) => value.toFixed(2) + '%';

export default function OfficialProfile() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const official = findOfficial(slug);
  const electionResult = findElection2025OfficialResult(slug);
  const electionRecordLinks = official
    ? electionRecordForOfficial(official.slug)
    : [];

  if (!official) {
    return (
      <Section className="bm-detail-page bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: t('corePages.official.home'), href: '/' },
            { label: t('corePages.official.government'), href: '/government' },
            { label: t('corePages.official.notFound') },
          ]}
        />
        <Heading>{t('corePages.official.notFound')}</Heading>
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

      <Section className="bm-detail-page bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: t('corePages.official.home'), href: '/' },
            { label: t('corePages.official.government'), href: '/government' },
            { label: official.displayName },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <div className="section-eyebrow">{t('corePages.official.eyebrow')}</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <Heading>{official.displayName}</Heading>
              <SharePage title={official.displayName + ' | BetterMakati'} />
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              {official.office}
              {official.district ? ' · ' + official.district : ''}
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bm-detail-meta-card p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  {t('corePages.official.fullName')}
                </div>
                <div className="mt-1 font-bold text-gray-950">{official.name}</div>
              </div>
              <div className="bm-detail-meta-card p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  {t('corePages.official.elected')}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.electionYear} {t('corePages.official.localElection')}
                </div>
              </div>
              <div className="bm-detail-meta-card p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  {t('corePages.official.party')}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.partyOn2025Ballot}
                </div>
              </div>
              <div className="bm-detail-meta-card p-4">
                <div className="text-xs uppercase tracking-[0.08em] text-gray-500 font-bold">
                  {t('corePages.official.level')}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {official.level === 'congress'
                    ? t('corePages.official.national')
                    : t('corePages.official.city')}
                </div>
              </div>
            </div>
          </div>

          <aside className="bm-detail-source-panel p-6">
            <Landmark className="h-6 w-6 text-primary-700" />
            <h2 className="mt-4 text-lg font-extrabold text-gray-950">{t('corePages.official.sources')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {t('corePages.official.sourceNote')}
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <a
                href={election2025Sources.officialResults}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3 font-bold text-primary-700"
              >
                {t('corePages.official.comelec')}
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

      <Section className="bg-white">
        <div className="section-eyebrow">{t('corePages.official.connected')}</div>
        <Heading level={2}>{t('corePages.official.related')}</Heading>
        <div className="mt-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
          <Scale className="h-5 w-5 text-primary-700" />
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-700">
            {t('corePages.official.relatedNote')}
          </p>
          <CivicRelationshipLinks
            label={t('corePages.official.electionRecord')}
            className="mt-5"
            items={electionRecordLinks.flatMap(item =>
              item.node
                ? [
                    {
                      id: item.relationship.id,
                      label: item.node.label,
                      href: item.node.href,
                      icon: <Vote className="h-3.5 w-3.5" aria-hidden="true" />,
                    },
                  ]
                : []
            )}
          />
          {official.slug === 'nancy-binay' && (
            <CivicRelationshipLinks
              label={t('corePages.official.relatedAnalysis')}
              className="mt-5"
              tone="secondary"
              items={[
                {
                  id: 'makati-political-dynasties-election-record',
                  label: t('corePages.official.dynastyReport'),
                  href: '/reports/makati-political-dynasties-election-record',
                  icon: <FileText className="h-3.5 w-3.5" aria-hidden="true" />,
                },
              ]}
            />
          )}
        </div>
      </Section>

      {electionResult && (
        <Section className="bg-[#f5f8f2]">
          <div className="section-eyebrow">{t('corePages.official.election')}</div>
          <Heading level={2}>{electionResult.raceLabel}</Heading>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <Vote className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-2xl font-extrabold text-gray-950">
                {number(electionResult.votes)}
              </div>
              <div className="text-sm text-gray-600">{t('corePages.official.votes')}</div>
            </div>

            {electionResult.validVoteShare !== undefined ? (
              <div className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-2xl font-extrabold text-gray-950">
                  {percentage(electionResult.validVoteShare)}
                </div>
                <div className="text-sm text-gray-600">{t('corePages.official.validVotes')}</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-2xl font-extrabold text-gray-950">
                  #{electionResult.rank}
                </div>
                <div className="text-sm text-gray-600">
                  {t('corePages.official.rank', { count: electionResult.seatsAvailable })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-2xl font-extrabold text-gray-950">
                {percentage(electionResult.voterShare)}
              </div>
              <div className="text-sm text-gray-600">
                {t('corePages.official.voters')}
              </div>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-2xl font-extrabold text-gray-950">
                {percentage(electionResult.populationShare)}
              </div>
              <div className="text-sm text-gray-600">
                {t('corePages.official.populationShare')}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {t('corePages.official.jurisdiction')}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {electionResult.jurisdictionLabel}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {t('corePages.official.turnout')}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  {number(electionResult.ballotsCast)} of{' '}
                  {number(electionResult.registeredVoters)} registered voters ·{' '}
                  {percentage(electionResult.turnout)}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {t('corePages.official.population')}
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
