import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ServiceSearch from '../home/ServiceSearch';
import CapabilityCarousel from '../home/CapabilityCarousel';
import { useBarangayScope } from '../../hooks/useBarangayScope';

const popularStarts = [
  { key: 'businessPermit', href: '/services/business/new-business-permit' },
  { key: 'yellowCard', href: '/services/health-services/makati-health-plus' },
  { key: 'cedula', href: '/services/guide/community-tax-certificate' },
  { key: 'barangay', href: '/barangays' },
];

export default function Hero() {
  const { t } = useTranslation();
  const { preferredBarangay } = useBarangayScope();

  return (
    <section className="overflow-visible border-b border-primary-900 bg-primary-800 text-white">
      <div className="container px-5 py-12 md:px-6 md:py-14 lg:px-8 lg:py-16 xl:py-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] md:items-center md:gap-7 lg:gap-10">
          <div className="min-w-0">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-300 md:text-sm">
              {t('home.hero.eyebrow')}
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
              {t('home.hero.unifiedQuestionLead')}{' '}
              <span className="text-secondary-500">{t('home.hero.unifiedQuestionBetter')}</span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
              {t('home.hero.description')}
            </p>

            <div className="mt-8 max-w-3xl">
              <ServiceSearch
                scope="site"
                title={t('home.hero.unifiedPromptLabel')}
                placeholder={t('home.hero.unifiedPromptPlaceholder')}
                goldAction
                unifiedHome
                barangaySlug={preferredBarangay?.slug ?? ''}
              />
              <p className="mt-3 text-sm leading-relaxed text-primary-100">
                {t('home.hero.unifiedHint')}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-50">
              <span className="font-medium text-primary-100">{t('home.hero.startWith')}</span>
              {popularStarts.map(item => (
                <Link
                  key={item.key}
                  to={item.href}
                  className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 transition hover:text-secondary-300 hover:decoration-secondary-300"
                >
                  {t(`home.hero.popular.${item.key}`)}
                </Link>
              ))}
            </div>
          </div>

          <CapabilityCarousel />
        </div>
      </div>
    </section>
  );
}
