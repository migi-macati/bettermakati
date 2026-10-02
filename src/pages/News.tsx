import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Rss,
} from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { newsSnapshot } from '../data/newsSnapshot';
import type { NewsItem } from '../data/newsTypes';
import { enrichNewsItem } from '../data/newsCivicRelationships';

const officialLinks = [
  {
    title: 'Makati News',
    description: 'City Government news and announcements.',
    href: 'https://www.makati.gov.ph/content/news',
    icon: Newspaper,
  },
];

const googleNewsSearch =
  'https://news.google.com/search?q=Makati&hl=en-PH&gl=PH&ceid=PH%3Aen';

const formatDate = (value: string, locale: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
};

export default function News() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-PH';
  const [items, setItems] = useState<NewsItem[]>(newsSnapshot);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('News feed unavailable');
      const data = (await response.json()) as { items?: NewsItem[] };
      if (Array.isArray(data.items)) setItems(data.items);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const task = window.setTimeout(() => void loadNews(), 0);
    return () => window.clearTimeout(task);
  }, []);

  const enrichedItems = useMemo(
    () => items.map(item => ({ item, enrichment: enrichNewsItem(item) })),
    [items]
  );

  return (
    <>
      <SEO
        title={t('currentInfo.news.seoTitle')}
        description={t('currentInfo.news.seoDescription')}
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('currentInfo.news.eyebrow')}</div>
        <Heading>{t('currentInfo.news.title')}</Heading>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/today" className="brand-btn-primary">{t('currentInfo.news.today')}</Link>
          <Link to="/city-monitor" className="brand-btn-secondary">{t('currentInfo.news.cityMonitor')}</Link>
          <Link to="/calendar" className="brand-btn-secondary">{t('currentInfo.news.calendar')}</Link>
        </div>

        <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5 md:p-6" aria-busy={loading}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-700">
                <Rss className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-extrabold text-gray-950">
                  Makati news, checked automatically
                </h2>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-700">
                  Current Makati coverage linked to the original publisher, with source type and publication time shown.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void loadNews()}
              disabled={loading}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-bold text-primary-800 hover:border-primary-500 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {loading ? 'Checking' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-secondary-700"
              aria-hidden="true"
            />
            <p>
              The live feed is unavailable right now. You can open the{' '}
              <a
                href={googleNewsSearch}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary-700 underline underline-offset-2"
              >
                Google News Makati search
              </a>{' '}
              or use the official city links below.
            </p>
          </div>
        )}

        {enrichedItems.length > 0 && (
          <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {enrichedItems.map(({ item, enrichment }) => (
              <article
                key={`${item.link}-${item.title}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-primary-700">
                      {item.source || 'News publisher'}
                    </span>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-600">
                      {item.sourceClassLabel}
                    </span>
                    <span className="rounded-full border border-primary-100 bg-primary-50 px-2 py-1 font-semibold text-primary-800">
                      {enrichment.relevanceLabel}
                    </span>
                  </div>
                  <time dateTime={item.pubDate}>
                    {formatDate(item.pubDate, locale)}
                  </time>
                </div>
                <h2 className="mt-3 text-lg font-extrabold leading-snug text-gray-950">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                )}

                {enrichment.relationships.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-gray-500">
                      Related in BetterMakati
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {enrichment.relationships.slice(0, 5).map(relationship => (
                        <Link
                          key={relationship.id}
                          to={relationship.href}
                          className="inline-flex min-h-11 items-center rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1.5 text-xs font-bold text-primary-800 hover:border-primary-300"
                        >
                          {relationship.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Read at publisher <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {(item.clusterSize ?? 1) > 1 && (
                    <span className="text-xs font-semibold text-gray-500">
                      {item.clusterSize} reports clustered
                    </span>
                  )}
                </div>

                {item.relatedCoverage && item.relatedCoverage.length > 0 && (
                  <details className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                    <summary className="flex min-h-11 cursor-pointer items-center text-xs font-bold text-gray-700">
                      Other coverage
                    </summary>
                    <div className="mt-2 space-y-2">
                      {item.relatedCoverage.map(coverage => (
                        <a
                          key={coverage.link}
                          href={coverage.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-h-11 items-center text-xs font-semibold text-primary-700 underline underline-offset-2"
                        >
                          {coverage.source || 'News publisher'}: {coverage.title}
                        </a>
                      ))}
                    </div>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <p className="mt-7 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
            No cached headlines are available yet. Open the Google News search
            or the official city feed below.
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <a
            href={googleNewsSearch}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            Open Google News Makati search{' '}
            <ExternalLink className="inline h-3.5 w-3.5" />
          </a>
          <span className="text-gray-400" aria-hidden="true">
            ·
          </span>
          <span className="text-gray-500">
            Headlines and article rights remain with their publishers.
          </span>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-8">
          <div className="section-eyebrow">{t('currentInfo.news.officialSource')}</div>
          <div className="grid grid-cols-1 gap-4">
            {officialLinks.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-primary-300 hover:shadow-sm"
                >
                  <Icon
                    className="h-6 w-6 text-primary-700"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-lg font-bold text-gray-950">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
