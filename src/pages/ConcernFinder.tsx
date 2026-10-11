import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import CitizenProblemSearch from '../components/community/CitizenProblemSearch';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';

export default function ConcernFinder() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('discovery.concernFinder.seoTitle')}
        description={t('discovery.concernFinder.seoDescription')}
        keywords={t('discovery.concernFinder.seoKeywords')}
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-4xl">
          <div className="section-eyebrow">{t('discovery.concernFinder.eyebrow')}</div>
          <h1 className="mb-5 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            {t('discovery.concernFinder.title')}
          </h1>
          <CitizenProblemSearch />
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-bold">
            <Link to="/services" className="inline-flex min-h-11 items-center gap-1 text-primary-700 underline underline-offset-2">
              {t('discovery.concernFinder.browseServices')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/government-offices" className="inline-flex min-h-11 items-center gap-1 text-primary-700 underline underline-offset-2">
              {t('discovery.concernFinder.browseOffices')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/civic-map" className="inline-flex min-h-11 items-center gap-1 text-primary-700 underline underline-offset-2">
              Civic Map <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
