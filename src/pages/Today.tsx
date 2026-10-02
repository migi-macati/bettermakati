import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  CloudRain,
  ExternalLink,
  Newspaper,
  PhoneCall,
  Settings2,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { barangays } from '../data/barangays';
import { briefArchiveHref, briefPeriodLabel } from '../data/civicBriefs';
import CivicTimelinePreview from '../components/civic/CivicTimelinePreview';
import type { NewsItem } from '../data/newsTypes';
import { isTodayNewsCandidate } from '../data/newsCivicRelationships';

interface Weather {
  temperature?: number;
  precipitation?: number;
  wind?: number;
  weatherCode?: number;
  observedAt?: string;
}

interface BriefArchiveEntry {
  id: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  title: string;
  periodStart: string;
  periodEnd: string;
  publishedAt: string;
  recordIds: string[];
}

interface BriefArchive {
  briefs?: BriefArchiveEntry[];
}

const todayReviewed = '29 September 2026';

const weatherLabel = (code?: number) => {
  if (code === 0) return 'Clear';
  if (code !== undefined && [1, 2, 3].includes(code)) return 'Partly cloudy';
  if (code !== undefined && [45, 48].includes(code)) return 'Fog';
  if (code !== undefined && [51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if (code !== undefined && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if (code !== undefined && [95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Weather';
};

const formatTimestamp = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

export default function Today() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-PH';
  const [params, setParams] = useSearchParams();
  const requested = params.get('barangay');
  const [barangaySlug, setBarangaySlug] = useState(() => {
    if (requested && barangays.some(item => item.slug === requested)) return requested;
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('bettermakati:barangay');
        if (saved && barangays.some(item => item.slug === saved)) return saved;
      } catch {
        return '';
      }
    }
    return '';
  });

  const [weather, setWeather] = useState<Weather>({});
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weatherFailed, setWeatherFailed] = useState(false);
  const [newsFailed, setNewsFailed] = useState(false);
  const [latestBrief, setLatestBrief] = useState<BriefArchiveEntry | null>(null);

  const barangay = useMemo(
    () => barangays.find(item => item.slug === barangaySlug),
    [barangaySlug]
  );

  useEffect(() => {
    const load = async () => {
      const tasks = await Promise.allSettled([
        fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=14.5547&longitude=121.0244&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila'
        ),
        fetch('/civic-briefs.json', { cache: 'no-store' }),
        fetch('/api/news'),
      ]);

      const weatherTask = tasks[0];
      if (weatherTask.status === 'fulfilled' && weatherTask.value.ok) {
        try {
          const data = await weatherTask.value.json();
          setWeather({
            temperature: data.current?.temperature_2m,
            precipitation: data.current?.precipitation,
            wind: data.current?.wind_speed_10m,
            weatherCode: data.current?.weather_code,
            observedAt: data.current?.time,
          });
          setWeatherFailed(false);
        } catch {
          setWeatherFailed(true);
        }
      } else {
        setWeatherFailed(true);
      }

      const briefsTask = tasks[1];
      if (briefsTask.status === 'fulfilled' && briefsTask.value.ok) {
        try {
          const data = (await briefsTask.value.json()) as BriefArchive;
          const briefs = Array.isArray(data.briefs) ? data.briefs : [];
          setLatestBrief(briefs[0] ?? null);
        } catch {
          setLatestBrief(null);
        }
      } else {
        setLatestBrief(null);
      }

      const newsTask = tasks[2];
      if (newsTask.status === 'fulfilled' && newsTask.value.ok) {
        try {
          const data = await newsTask.value.json();
          if (Array.isArray(data.items)) {
            setNews(
              (data.items as NewsItem[])
                .filter(isTodayNewsCandidate)
                .slice(0, 3)
            );
            setNewsFailed(false);
          }
        } catch {
          setNewsFailed(true);
        }
      } else {
        setNewsFailed(true);
      }
    };

    void load();
  }, []);

  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date());

  const chooseBarangay = (value: string) => {
    setBarangaySlug(value);
    try {
      if (value) window.localStorage.setItem('bettermakati:barangay', value);
      else window.localStorage.removeItem('bettermakati:barangay');
    } catch {
      // Local preference storage is optional.
    }
    const next = new URLSearchParams(params);
    if (value) next.set('barangay', value);
    else next.delete('barangay');
    setParams(next, { replace: true });
  };

  const weatherObservedAt = weather.observedAt
    ? formatTimestamp(
        weather.observedAt +
          (/[zZ]|[+-]\d\d:\d\d$/.test(weather.observedAt) ? '' : '+08:00')
      , locale)
    : '';

  return (
    <>
      <SEO
        title={t('currentInfo.today.seoTitle')}
        description={t('currentInfo.today.seoDescription')}
      />

      <section className="border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-10 md:px-6 md:py-12 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-200 md:text-sm">
              {t('currentInfo.today.eyebrow')}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Today in Makati
            </h1>
            <p className="mt-2 text-sm font-semibold text-primary-100 md:text-base">{dateLabel}</p>

            <div className="mt-6 max-w-xl">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Settings2 className="h-4 w-4 text-secondary-400" aria-hidden="true" />
                  {t('currentInfo.today.myBarangay')}
                </span>
                <select
                  value={barangaySlug}
                  onChange={event => chooseBarangay(event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-gray-950 shadow-sm"
                  aria-label={t('currentInfo.today.chooseBarangay')}
                >
                  <option value="">{t('currentInfo.today.chooseBarangay')}</option>
                  {barangays.map(item => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </label>
            </div>

            {barangay && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="font-semibold text-primary-100">
                  Barangay {barangay.name} · {barangay.population2024.toLocaleString(locale)} residents · {barangay.legislativeDistrict}
                </span>
                <Link
                  to={'/barangays/' + barangay.slug}
                  className="min-h-11 content-center font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-secondary-300"
                >
                  Barangay homepage
                </Link>
                <Link
                  to={'/participate?barangay=' + barangay.slug}
                  className="min-h-11 content-center font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-secondary-300"
                >
                  Participate locally
                </Link>
              </div>
            )}

            <LastReviewed
              date={todayReviewed}
              className="mt-4 !text-primary-100 [&_strong]:!text-white [&_svg]:!text-secondary-400"
            />
          </div>
        </div>
      </section>

      <CivicTimelinePreview
        barangaySlug={barangaySlug || undefined}
        contextLabel={barangay ? 'Barangay ' + barangay.name : 'Makati'}
        heading={
          barangay
            ? 'Civic dates for ' + barangay.name
            : 'What’s next in Makati'
        }
        description={
          barangay
            ? 'Local records appear first, alongside citywide deadlines, meetings, service changes and publications that also apply to Barangay ' + barangay.name + '.'
            : 'Start with source-backed deadlines, meetings, service changes and recent civic publications. Open the full Calendar when you need the complete timeline.'
        }
        className="bg-white"
      />

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">{t('currentInfo.today.currentMakati')}</div>
        <Heading level={2}>{t('currentInfo.today.liveSources')}</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          Today brings the main current-information streams together. Open the specialist page only when you need more detail.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/live" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CloudRain className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {weather.temperature === undefined ? '—' : Math.round(weather.temperature) + '°C'}
            </div>
            <div className="mt-1 font-bold text-gray-800">
              {weatherFailed ? 'Live conditions unavailable' : weatherLabel(weather.weatherCode)}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {weatherObservedAt ? 'Observation ' + weatherObservedAt : 'Open Live Makati for current source details.'}
            </p>
          </Link>

          <Link to="/city-monitor" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Bell className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('currentInfo.today.officialActivity')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Validated council, legislation, procurement, project, publication and notice records.
            </p>
          </Link>

          <Link to="/news" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Newspaper className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('currentInfo.today.recentCoverage')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Current Makati reporting from publishers, linked to related BetterMakati context where available.
            </p>
          </Link>

          <Link to="/hotlines" className="rounded-2xl border border-primary-100 bg-white p-5">
            <PhoneCall className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('currentInfo.today.emergencyContacts')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              911, city response, police, fire, health and other useful numbers.
            </p>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('currentInfo.today.civicBrief')}</div>
        <Heading level={2}>{t('currentInfo.today.latestBrief')}</Heading>

        {latestBrief ? (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {latestBrief.title}
                </div>
                <h3 className="mt-1 text-2xl font-extrabold text-gray-950">
                  {briefPeriodLabel(latestBrief.periodStart, latestBrief.periodEnd)}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
                  {latestBrief.recordIds.length
                    ? latestBrief.recordIds.length + ' validated City Monitor record' + (latestBrief.recordIds.length === 1 ? '' : 's') + ' in this published snapshot.'
                    : 'No City Monitor record was published in this snapshot.'}
                </p>
              </div>
              <div className="shrink-0 text-xs text-gray-500">
                Published {formatTimestamp(latestBrief.publishedAt, locale)}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={briefArchiveHref(latestBrief.id)} className="brand-btn-primary">
                Read this brief
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            No published Civic Brief snapshot is available right now.
          </div>
        )}
        <div className="mt-5">
          <Link to="/briefs" className="brand-btn-secondary">
            Open Civic Briefs
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('currentInfo.today.newsEyebrow')}</div>
        <Heading level={2}>Recent coverage</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {news.length > 0 ? news.map(item => (
            <a
              key={item.link}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
            >
              <Newspaper className="h-5 w-5 text-primary-700" />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-primary-700">
                  {item.source || 'News publisher'}
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-600">
                  {item.sourceClassLabel}
                </span>
              </div>
              <h3 className="mt-2 font-extrabold leading-snug text-gray-950">{item.title}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Read <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          )) : (
            <div className="rounded-2xl border border-gray-200 p-5 text-sm text-gray-600 lg:col-span-3">
              {newsFailed ? 'The live news feed is unavailable. ' : 'No headline from the last 7 days met the Today freshness and direct-Makati relevance rules. '}
              <Link to="/news" className="font-bold text-primary-700">Open Makati in the News</Link>.
            </div>
          )}
        </div>
        <div className="mt-5">
          <Link to="/news" className="brand-btn-secondary">
            Browse all Makati news
          </Link>
        </div>
      </Section>
    </>
  );
}
