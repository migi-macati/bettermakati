import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Rss,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { newsSnapshot, type NewsItem } from '../data/newsSnapshot';

const officialLinks = [
  {
    title: 'Makati News',
    description: 'City Government news and announcements.',
    href: 'https://www.makati.gov.ph/content/news',
    icon: Newspaper,
  },
  {
    title: 'Makati Events',
    description: 'City Government event listings.',
    href: 'https://www.makati.gov.ph/content/events',
    icon: CalendarDays,
  },
];

const googleNewsSearch =
  'https://news.google.com/search?q=Makati&hl=en-PH&gl=PH&ceid=PH%3Aen';

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
};

export default function News() {
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

  return (
    <>
      <SEO
        title="Makati in the News"
        description="Official Makati City news, events and automatically refreshed Makati news links."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City Information</div>
        <Heading>Makati in the News</Heading>

        <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50 p-5 md:p-6">
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
                  Headlines are pulled from Google News with a Makati filter and
                  linked to the original publisher. This is a discovery feed;
                  verify important claims with the publisher or the official
                  city source below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void loadNews()}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-bold text-primary-800 hover:border-primary-500 disabled:cursor-wait disabled:opacity-60"
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
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700">
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

        {items.length > 0 && (
          <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map(item => (
              <article
                key={`${item.link}-${item.title}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                  <span className="font-bold text-primary-700">
                    {item.source || 'News publisher'}
                  </span>
                  <time dateTime={item.pubDate}>
                    {formatDate(item.pubDate)}
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
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                >
                  Read at publisher <ExternalLink className="h-3.5 w-3.5" />
                </a>
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
          <div className="section-eyebrow">Official sources</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
