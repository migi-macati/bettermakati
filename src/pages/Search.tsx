import { Link, useLocation, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SEO from '../components/SEO';
import ServiceSearch from '../components/home/ServiceSearch';
import CitizenProblemSearch from '../components/community/CitizenProblemSearch';
import { findCitizenGuides, isImmediateDanger } from '../data/citizenProblemGuides';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { useBarangayScope } from '../hooks/useBarangayScope';

const isIdea = (query: string) =>
  /\b(?:i suggest|i propose|my idea|i think we (?:should|need)|we should|there should be|suggestion|proposal|i have an idea)\b|(?:\bsana\b|\bdapat\b|\bmaganda kung\b|\bproposal ko\b|\bideya ko\b)/i.test(query);

export default function Search() {
  const { t, i18n } = useTranslation();
  const fil = i18n.resolvedLanguage?.startsWith('fil') ?? false;
  const [params] = useSearchParams();
  const location = useLocation();
  const stateQuery = (location.state as { unifiedQuery?: string } | null)?.unifiedQuery ?? '';
  const initialQuery = (stateQuery || params.get('q') || '').slice(0, 500);
  const { barangaySlug } = useBarangayScope();
  const showGuide = Boolean(initialQuery && (
    isImmediateDanger(initialQuery) || findCitizenGuides(initialQuery).length > 0
  ));
  const showIdea = Boolean(initialQuery && !showGuide && isIdea(initialQuery));

  return (
    <>
      <SEO
        title={t('discovery.search.seoTitle')}
        description={t('discovery.search.seoDescription')}
        noIndex
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">
            {showGuide
              ? (fil ? 'ANG CONCERN MO' : 'YOUR CONCERN')
              : t('discovery.search.eyebrow')}
          </div>
          <Heading>
            {showGuide
              ? (fil ? 'Ano ang puwede nating gawin?' : 'What can we do about this?')
              : t('discovery.search.title')}
          </Heading>
          {!showGuide && (
            <p className="mb-6 text-gray-600">
              {showIdea
                ? (fil ? 'Puwede nating tingnan ang options para sa idea mo.' : 'Find a way to put your idea into action.')
                : t('discovery.search.description')}
            </p>
          )}

          {showGuide && (
            <>
              <CitizenProblemSearch
                key={initialQuery}
                initialProblem={initialQuery}
                resultOnly
              />
              <Link
                to="/"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-800 underline underline-offset-2"
              >
                {fil ? 'May iba kang gustong itanong?' : 'Have another question?'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </>
          )}

          {showIdea && (
            <div className="mb-6 rounded-2xl border border-primary-200 bg-white p-6">
              <div className="flex items-center gap-2 text-primary-900">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-xl font-extrabold">
                  {fil ? 'May idea ka para sa Makati?' : 'Have an idea for Makati?'}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {fil
                  ? 'Tingnan ang current plans, projects at participation channels. Maaari mong ipasa ang suggestion sa BetterMakati, pero hindi ito automatic na maipapadala sa City Hall.'
                  : 'Explore existing plans and projects, then share your proposal. Submitting to BetterMakati does not automatically submit it to City Hall.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={'/get-involved?type=idea&subject=' + encodeURIComponent(initialQuery.slice(0, 120))}
                  className="brand-btn-primary"
                >
                  {fil ? 'I-share ang idea' : 'Share this idea'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/participate" className="brand-btn-secondary">
                  {fil ? 'Participation channels' : 'Participation channels'}
                </Link>
                <Link to="/projects-budget" className="brand-btn-secondary">
                  {fil ? 'Projects at budget' : 'Projects and budget'}
                </Link>
              </div>
            </div>
          )}

          {!showGuide && (
            <ServiceSearch
              key={initialQuery}
              scope="site"
              title={t('discovery.search.searchTitle')}
              placeholder={t('discovery.search.placeholder')}
              initialQuery={initialQuery}
              barangaySlug={barangaySlug}
              showInitially={!showIdea}
            />
          )}
        </div>
      </Section>
    </>
  );
}
