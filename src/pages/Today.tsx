import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CloudRain,
  ExternalLink,
  MapPin,
  Newspaper,
  PhoneCall,
  Radio,
  Rss,
  Settings2,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { barangays } from '../data/barangays';
import { briefArchiveHref, briefPeriodLabel } from '../data/civicBriefs';

interface NewsItem {
  title: string;
  link: string;
  source?: string;
  pubDate: string;
}

interface Weather {
  temperature?: number;
  precipitation?: number;
  wind?: number;
  weatherCode?: number;
  observedAt?: string;
}

interface MonitorRun {
  checkedAt: string;
  changed?: unknown[];
  failed?: unknown[];
}

interface MonitorHistory {
  runs?: MonitorRun[];
}

interface MonitorSourceState {
  checkedAt?: string | null;
  sources?: Array<{ id: string; status: string }>;
}

interface BriefArchiveEntry {
  id: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  title: string;
  periodStart: string;
  periodEnd: string;
  publishedAt: string;
  recordIds: string[];
  reviewSignals: unknown[];
  failedChecks: unknown[];
}

interface BriefArchive {
  briefs?: BriefArchiveEntry[];
}

const todayReviewed = '24 September 2026';

const weatherLabel = (code?: number) => {
  if (code === 0) return 'Clear';
  if (code !== undefined && [1, 2, 3].includes(code)) return 'Partly cloudy';
  if (code !== undefined && [45, 48].includes(code)) return 'Fog';
  if (code !== undefined && [51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if (code !== undefined && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if (code !== undefined && [95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Weather';
};

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

export default function Today() {
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
  const [latestRun, setLatestRun] = useState<MonitorRun | null>(null);
  const [monitorState, setMonitorState] = useState<MonitorSourceState>({});
  const [latestBrief, setLatestBrief] = useState<BriefArchiveEntry | null>(null);
  const [civicDataFailed, setCivicDataFailed] = useState(false);

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
        fetch('/city-monitor-source-history.json', { cache: 'no-store' }),
        fetch('/city-monitor-source-state.json', { cache: 'no-store' }),
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

      let civicFailure = false;

      const historyTask = tasks[1];
      if (historyTask.status === 'fulfilled' && historyTask.value.ok) {
        try {
          const data = (await historyTask.value.json()) as MonitorHistory;
          setLatestRun(Array.isArray(data.runs) && data.runs.length ? data.runs[0] : null);
        } catch {
          civicFailure = true;
        }
      } else {
        civicFailure = true;
      }

      const stateTask = tasks[2];
      if (stateTask.status === 'fulfilled' && stateTask.value.ok) {
        try {
          const data = (await stateTask.value.json()) as MonitorSourceState;
          setMonitorState({
            checkedAt: data.checkedAt,
            sources: Array.isArray(data.sources) ? data.sources : [],
          });
        } catch {
          civicFailure = true;
        }
      } else {
        civicFailure = true;
      }

      const briefsTask = tasks[3];
      if (briefsTask.status === 'fulfilled' && briefsTask.value.ok) {
        try {
          const data = (await briefsTask.value.json()) as BriefArchive;
          const briefs = Array.isArray(data.briefs) ? data.briefs : [];
          setLatestBrief(briefs[0] ?? null);
        } catch {
          civicFailure = true;
        }
      } else {
        civicFailure = true;
      }

      setCivicDataFailed(civicFailure);

      const newsTask = tasks[4];
      if (newsTask.status === 'fulfilled' && newsTask.value.ok) {
        try {
          const data = await newsTask.value.json();
          if (Array.isArray(data.items)) {
            setNews(data.items.slice(0, 3));
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

  const dateLabel = new Intl.DateTimeFormat('en-PH', {
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

  const monitorSources = monitorState.sources ?? [];
  const healthySources = monitorSources.filter(source => source.status === 'ok').length;
  const monitorChanges = Array.isArray(latestRun?.changed) ? latestRun.changed.length : 0;
  const monitorFailures = Array.isArray(latestRun?.failed) ? latestRun.failed.length : 0;

  const weatherObservedAt = weather.observedAt
    ? formatTimestamp(
        weather.observedAt +
          (/[zZ]|[+-]\d\d:\d\d$/.test(weather.observedAt) ? '' : '+08:00')
      )
    : '';

  return (
    <>
      <SEO
        title="Today in Makati"
        description="A daily Makati dashboard combining local context, current conditions, validated civic briefs, source health, news, events and emergency links."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Your Makati</div>
        <Heading>Today in Makati</Heading>
        <p className="mt-1 text-sm font-semibold text-primary-800">{dateLabel}</p>
        <p className="mt-3 max-w-3xl text-gray-700">
          One starting point for what you may need to know today, with timestamps and
          source boundaries kept visible.
        </p>
        <LastReviewed
          date={todayReviewed}
          note="Live conditions, news and civic feeds can update independently; each section shows its own source or timestamp."
        />

        <div className="mt-7 rounded-2xl border border-primary-100 bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 font-extrabold text-gray-950">
            <Settings2 className="h-5 w-5 text-primary-700" />
            My Makati
          </div>
          <label className="mt-4 block max-w-xl">
            <span className="text-sm font-bold text-gray-800">My barangay</span>
            <select
              value={barangaySlug}
              onChange={event => chooseBarangay(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              aria-label="Choose my barangay"
            >
              <option value="">Choose a barangay</option>
              {barangays.map(item => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-xs text-gray-500">
            Saved only in this browser. BetterMakati does not require precise location for this view.
          </p>
        </div>

        {barangay && (
          <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-800" />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-800">
                  Your selected locality
                </div>
                <h2 className="mt-1 text-2xl font-extrabold text-gray-950">
                  Barangay {barangay.name}
                </h2>
                <p className="mt-1 text-sm text-gray-700">
                  2024 population {barangay.population2024.toLocaleString('en-PH')} · {barangay.legislativeDistrict}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to={'/barangays/' + barangay.slug} className="brand-btn-primary">
                    Better{barangay.name}
                  </Link>
                  <Link to={'/participate?barangay=' + barangay.slug} className="brand-btn-secondary">
                    Participate locally
                  </Link>
                  <Link to={'/accountability?barangay=' + barangay.slug} className="brand-btn-secondary">
                    Local accountability
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Today at a glance</div>
        <Heading level={2}>Current conditions & civic freshness</Heading>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/live" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CloudRain className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {weather.temperature === undefined ? '—' : Math.round(weather.temperature) + '°C'}
            </div>
            <div className="mt-1 font-bold text-gray-800">
              {weatherFailed ? 'Weather source unavailable' : weatherLabel(weather.weatherCode)}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {weatherObservedAt ? 'Observation ' + weatherObservedAt : 'Open Live Makati for source details.'}
            </p>
          </Link>

          <Link to="/briefs" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Rss className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {latestBrief ? latestBrief.recordIds.length : '—'}
            </div>
            <div className="mt-1 font-bold text-gray-800">validated records in latest brief</div>
            <p className="mt-2 text-xs text-gray-500">
              {latestBrief ? briefPeriodLabel(latestBrief.periodStart, latestBrief.periodEnd) : 'Published archive unavailable.'}
            </p>
          </Link>

          <Link to="/city-monitor" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CheckCircle2 className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {monitorSources.length ? healthySources + '/' + monitorSources.length : '—'}
            </div>
            <div className="mt-1 font-bold text-gray-800">monitored sources reachable</div>
            <p className="mt-2 text-xs text-gray-500">
              {monitorState.checkedAt ? 'Last check ' + formatTimestamp(monitorState.checkedAt) : 'No published check time.'}
            </p>
          </Link>

          <Link to="/hotlines" className="rounded-2xl border border-primary-100 bg-white p-5">
            <PhoneCall className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Emergency & city contacts</div>
            <p className="mt-2 text-sm text-gray-600">
              911, city response, police, fire, health and other useful numbers.
            </p>
          </Link>
        </div>

        {civicDataFailed && (
          <div className="mt-4 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700" role="status">
            Some published civic feeds could not be loaded. Open City Monitor or Civic Briefs directly for the permanent records.
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Civic brief</div>
        <Heading level={2}>Latest published brief</Heading>

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
                    : 'No newly validated City Monitor record was published in this snapshot. BetterMakati leaves a quiet period quiet rather than filling it with unverified activity.'}
                </p>
              </div>
              <div className="shrink-0 text-xs text-gray-500">
                Published {formatTimestamp(latestBrief.publishedAt)}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-gray-600">
              <span>{latestBrief.reviewSignals.length} review signals</span>
              <span>{latestBrief.failedChecks.length} failed checks</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={briefArchiveHref(latestBrief.id)} className="brand-btn-primary">
                Read this brief
              </Link>
              <Link to="/briefs" className="brand-btn-secondary">Brief archive</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            No published Civic Brief snapshot is available right now.
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Official activity</div>
        <Heading level={2}>City Monitor</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Radio className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">{monitorChanges}</div>
            <div className="font-bold text-gray-800">source-change signals in the latest monitor run</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A detected source change is a review signal, not a confirmed government action.
            </p>
            {latestRun?.checkedAt && (
              <div className="mt-2 text-xs text-gray-500">
                Checked {formatTimestamp(latestRun.checkedAt)}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Clock3 className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">{monitorFailures}</div>
            <div className="font-bold text-gray-800">failed checks in the latest monitor run</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A failed check means BetterMakati could not confirm that source during that run.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/city-monitor" className="brand-btn-primary">Open City Monitor</Link>
          <Link to="/live" className="brand-btn-secondary">Live source dashboard</Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Around the city</div>
        <Heading level={2}>Events, advisories & useful links</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link to="/whats-on" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CalendarDays className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">What’s on</h3>
            <p className="mt-1 text-sm text-gray-600">Current event discovery with original organizer sources.</p>
          </Link>
          <Link to="/live" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Bell className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Advisories & utilities</h3>
            <p className="mt-1 text-sm text-gray-600">PAGASA, city, utility, district and hazard sources.</p>
          </Link>
          <Link to="/hotlines" className="rounded-2xl border border-primary-100 bg-white p-5">
            <PhoneCall className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Hotlines</h3>
            <p className="mt-1 text-sm text-gray-600">Emergency, city services and other useful contacts.</p>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Makati in the news</div>
        <Heading level={2}>Recent coverage</Heading>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          News coverage is separate from validated City Monitor records and official source checks.
        </p>
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
              <div className="mt-3 text-xs font-bold text-primary-700">
                {item.source || 'News publisher'}
              </div>
              <h3 className="mt-1 font-extrabold leading-snug text-gray-950">{item.title}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Read <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          )) : (
            <div className="rounded-2xl border border-gray-200 p-5 text-sm text-gray-600 lg:col-span-3">
              {newsFailed ? 'The live news feed is unavailable. ' : 'No current headlines were returned. '}
              <Link to="/news" className="font-bold text-primary-700">Open Makati in the News</Link>.
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
