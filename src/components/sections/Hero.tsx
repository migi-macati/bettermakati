import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ServiceSearch from '../home/ServiceSearch';
import { useBarangayScope } from '../../hooks/useBarangayScope';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const fil = i18n.resolvedLanguage === 'fil';
  const { preferredBarangay } = useBarangayScope();

  return (
    <section className="overflow-visible bg-white text-gray-950">
      <div className="container px-5 pt-12 pb-14 md:px-8 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t('home.hero.unifiedQuestionLead')}{' '}{t('home.hero.unifiedQuestionBetter')}
          </h1>

          <div className="mt-6 max-w-3xl">
            <ServiceSearch
              scope="site"
              title={t('home.hero.unifiedPromptLabel')}
              placeholder={t('home.hero.unifiedPromptPlaceholder')}
              unifiedHome
              barangaySlug={preferredBarangay?.slug ?? ''}
            />
          </div>

          <nav aria-label={fil ? 'Mga gabay sa serbisyo' : 'Service guides'} className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {[
              ['senior-national-id', 'Senior Citizen ID'],
              ['yellow-card', 'Yellow Card'],
              ['renew-business-permit', fil ? 'I-renew ang permit sa negosyo' : 'Renew a business permit'],
            ].map(([id, label]) => (
              <Link key={id} to={'/services/guide/' + id} className="inline-flex min-h-11 items-center font-semibold text-primary-800 underline underline-offset-4 hover:text-primary-950">
                {label}
              </Link>
            ))}
          </nav>

          <div className="text-sm">
            <Link
              to="/hotlines"
              className="inline-flex min-h-11 items-center font-medium text-primary-800 underline underline-offset-4"
            >
              {t('home.hero.emergencyShortcut')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
