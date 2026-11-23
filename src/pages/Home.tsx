import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import SEO from '../components/SEO';
import embo from '../data/reports/06-embo-makati-taguig-transition';
import { cityImages } from '../data/cityImages';

const quickServices = [
  {
    key: 'business',
    href: '/services/business',
  },
  {
    key: 'health',
    href: '/services/health-services',
  },
  {
    key: 'education',
    href: '/services/education',
  },
  {
    key: 'property',
    href: '/services/housing-land-use',
  },
];

const visitPaths = [
  {
    key: 'explore',
    href: '/visit',
  },
  {
    key: 'mobility',
    href: '/mobility',
  },
  {
    key: 'districts',
    href: '/estates',
  },
  {
    key: 'heritage',
    href: '/heritage',
  },
];

const visitShortcuts = [
  { key: 'cinemas', href: '/cinemas' },
  { key: 'liveDiscovery', href: '/visit#live-discovery' },
];

const publicActionPaths = [
  {
    key: 'accountability',
    href: '/accountability',
  },
  {
    key: 'projectsBudget',
    href: '/projects-budget',
  },
  {
    key: 'records',
    href: '/records',
  },
];


const frame = 'mx-auto max-w-5xl';
const link = 'inline-flex min-h-11 items-center font-semibold text-primary-800 underline underline-offset-4 hover:text-primary-950';
const heading = 'text-2xl font-bold tracking-tight text-gray-950 md:text-3xl';

export default function Home() {
  const { t, i18n } = useTranslation();
  const fil = i18n.resolvedLanguage === 'fil';
  const story = fil && embo.fil ? embo.fil : embo.report;
  const photo = cityImages.skyline;
  return (
    <>
      <SEO title={t('home.page.seoTitle')} description={t('home.page.seoDescription')} keywords={t('home.page.seoKeywords')} />
      <Hero />
      <div className="container space-y-14 px-5 pb-16 md:space-y-20 md:px-8">
        <section aria-labelledby="lead-report" className={frame + ' grid items-start gap-6 border-t border-gray-300 pt-7 md:grid-cols-2 md:gap-10'}>
          <div>
            <h2 id="lead-report" className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              <Link className="text-primary-900 hover:underline" to={'/reports/' + embo.report.slug}>{story.headline}</Link>
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">{story.subheadline}</p>
            <Link className={link} to="/reports">{fil ? 'Lahat ng ulat' : 'All local reports'}</Link>
          </div>
          <figure>
            <img src="/images/makati/guadalupe-skyline.webp" width="960" height="723" alt={fil ? 'Matataas na gusali sa likod ng mga bahay at puno.' : 'Office towers rise beyond homes and trees.'} className="block aspect-[16/10] w-full object-cover" />
            <figcaption className="mt-1 text-sm text-gray-600">
              {fil ? 'Tanaw ang skyline ng Makati mula sa Guadalupe, Abril 2025.' : 'The Makati skyline seen from Guadalupe, April 2025.'}{' '}
              <a className={link} href={photo.sourceUrl}>{photo.credit}</a>{' · '}
              <a className={link} href={photo.licenseUrl}>{photo.license}</a>
            </figcaption>
          </figure>
        </section>
        <section className={frame} aria-labelledby="common-services">
          <h2 className={heading} id="common-services">{t('home.page.commonServices')}</h2>
          <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
            {quickServices.map(item => <li key={item.key}>
              <Link className="grid gap-1 py-3 text-primary-800 hover:underline md:grid-cols-[1fr_2fr]" to={item.href}>
                <strong>{t(`home.page.quickServices.${item.key}.label`)}</strong>
                <span className="text-sm text-gray-700">{t(`home.page.quickServices.${item.key}.description`)}</span>
              </Link>
            </li>)}
          </ul>
          <Link className={link} to="/services">{t('home.page.viewAllServices')}</Link>
        </section>
        <section className={frame} aria-labelledby="public-action">
          <h2 className={heading} id="public-action">{fil ? 'Mga pampublikong rekord at pakikilahok' : 'Public records and participation'}</h2>
          <Link className={link} to="/budget-2027">{fil ? 'Aling mga proyekto sa panukalang pambansang budget para sa 2027 ang may Makati sa pamagat?' : 'Which projects name Makati in the proposed 2027 national budget?'}</Link>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {publicActionPaths.map(item => <li key={item.key}>
              <Link className="grid gap-1 py-3 text-primary-800 hover:underline md:grid-cols-[1fr_2fr]" to={item.href}>
                <strong>{t(`home.page.publicAction.${item.key}.label`)}</strong>
                <span className="text-sm text-gray-700">{t(`home.page.publicAction.${item.key}.description`)}</span>
              </Link>
            </li>)}
          </ul>
          <div className="flex flex-wrap gap-x-6">
            <Link className={link} to="/participate">{t('home.page.participate')}</Link>
            <Link className={link} to="/get-involved">{t('home.page.improve')}</Link>
            <Link className={link} to="/community-tools">{t('home.page.communityTools')}</Link>
            <Link className={link} to="/statistics#city-comparison-title">{t('home.page.exploreStatistics')}</Link>
          </div>
        </section>
        <section className={frame} aria-labelledby="explore">
          <h2 id="explore" className={heading}>{t('home.page.exploreTitle')}</h2>
          <div className="mt-2 flex flex-wrap gap-x-6">
            {visitPaths.map(item => <Link key={item.key} className={link} to={item.href}>{t(`home.page.visit.${item.key}.label`)}</Link>)}
            {visitShortcuts.map(item => <Link key={item.key} className={link} to={item.href}>{t(`home.page.shortcuts.${item.key}`)}</Link>)}
          </div>
        </section>
      </div>
    </>
  );
}
