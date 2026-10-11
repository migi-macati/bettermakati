import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ServiceSearch from '../home/ServiceSearch';
import { useBarangayScope } from '../../hooks/useBarangayScope';

export default function Hero() {
  const { t } = useTranslation();
  const { preferredBarangay } = useBarangayScope();

  return (
    <section className="overflow-visible border-b border-primary-900 bg-primary-800 text-white">
      <div className="container px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-300 md:text-sm">
              {t('home.hero.eyebrow')}
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {t('home.hero.unifiedQuestionLead')}{' '}
              <span className="text-secondary-500">{t('home.hero.unifiedQuestionBetter')}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-50 md:text-lg">
              {t('home.hero.description')}
            </p>
          </div>

          <div className="mt-9">
            <ServiceSearch
              scope="site"
              title={t('home.hero.unifiedPromptLabel')}
              placeholder={t('home.hero.unifiedPromptPlaceholder')}
              goldAction
              unifiedHome
              barangaySlug={preferredBarangay?.slug ?? ''}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-100 sm:flex-row sm:items-center sm:justify-between">
            <p>{t('home.hero.unifiedHint')}</p>
            <Link
              to="/hotlines"
              className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/50 underline-offset-4 hover:text-secondary-300"
            >
              {t('home.hero.emergencyShortcut')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
