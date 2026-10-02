import { AlertTriangle, ArrowRight, Building2, FileBadge2, HeartPulse, Landmark, ReceiptText, Users } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ServiceSearch from '../components/home/ServiceSearch';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const commonNeeds = [
  {
    key: 'medical',
    href: '/services/guide/medical-financial-assistance',
    icon: HeartPulse,
  },
  {
    key: 'pwd',
    href: '/services/guide/pwd-id',
    icon: FileBadge2,
  },
  {
    key: 'senior',
    href: '/services/guide/senior-blu-card',
    icon: Users,
  },
  {
    key: 'clearance',
    href: '/services/guide/barangay-clearance',
    icon: Building2,
  },
  {
    key: 'business',
    href: '/services/guide/new-business-permit',
    icon: Landmark,
  },
  {
    key: 'civilRegistry',
    href: '/services/guide/local-civil-registry-copy',
    icon: FileBadge2,
  },
  {
    key: 'propertyTax',
    href: '/services/guide/real-property-tax',
    icon: ReceiptText,
  },
  {
    key: 'cityAction',
    href: '/services/guide/makati-action-center',
    icon: ArrowRight,
  },
];

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
          <Heading>{t('discovery.concernFinder.title')}</Heading>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-gray-700">
            {t('discovery.concernFinder.intro')}
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <strong>{t('discovery.concernFinder.emergencyTitle')}</strong>{' '}
              <Link to="/hotlines" className="font-bold underline underline-offset-2">
                {t('discovery.concernFinder.emergencyLink')}
              </Link>{' '}
              {t('discovery.concernFinder.emergencySuffix')}
            </div>
          </div>

          <div className="mt-7">
            <ServiceSearch
              scope="services"
              title={t('discovery.concernFinder.searchTitle')}
              placeholder={t('discovery.concernFinder.searchPlaceholder')}
              showServicePlaces
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
            <Link to="/services" className="text-primary-700 underline underline-offset-2">
              {t('discovery.concernFinder.browseServices')}
            </Link>
            <Link to="/government-offices" className="text-primary-700 underline underline-offset-2">
              {t('discovery.concernFinder.browseOffices')}
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('discovery.concernFinder.commonNeeds')}</div>
        <Heading level={2}>{t('discovery.concernFinder.taskFirst')}</Heading>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {commonNeeds.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="group rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-800 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-950 group-hover:text-primary-900">
                      {t(`discovery.concernFinder.needs.${item.key}.title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{t(`discovery.concernFinder.needs.${item.key}.description`)}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      {t('discovery.concernFinder.openGuide')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">{t('discovery.concernFinder.unsure')}</div>
            <Heading level={2}>{t('discovery.concernFinder.actionCenterTitle')}</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {t('discovery.concernFinder.actionCenterDescription')}
            </p>
            <Link to="/services/guide/makati-action-center" className="brand-btn-primary mt-5">
              {t('discovery.concernFinder.actionCenterCta')}
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">{t('discovery.concernFinder.localConcern')}</div>
            <Heading level={2}>{t('discovery.concernFinder.barangayTitle')}</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {t('discovery.concernFinder.barangayDescription')}
            </p>
            <Link to="/barangays" className="brand-btn-secondary mt-5">
              {t('discovery.concernFinder.barangayCta')}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
