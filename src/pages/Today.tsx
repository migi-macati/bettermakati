import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import {
  Bell,
  CalendarDays,
  CloudRain,
  ExternalLink,
  MapPin,
  Newspaper,
  Radio,
  Settings2,
  Users,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { barangays } from '../data/barangays';

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
}

const weatherLabel = (code?: number) => {
  if (code === 0) return 'Clear';
  if (code !== undefined && [1, 2, 3].includes(code)) return 'Partly cloudy';
  if (code !== undefined && [45, 48].includes(code)) return 'Fog';
  if (code !== undefined && [51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if (code !== undefined && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if (code !== undefined && [95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Weather';
};

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
  const [monitorChanges, setMonitorChanges] = useState(0);
  const [monitorCheckedAt, setMonitorCheckedAt] = useState('');

  const barangay = useMemo(
    () => barangays.find(item => item.slug === barangaySlug),
    [barangaySlug]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=14.5547&longitude=121.0244&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila'
        );
        if (!response.ok) throw new Error('weather');
        const data = await response.json();
        setWeather({
          temperature: data.current?.temperature_2m,
          precipitation: data.current?.precipitation,
          wind: data.current?.wind_speed_10m,
          weatherCode: data.current?.weather_code,
        });
      } catch {
        setWeatherFailed(true);
      }

      try {
        const response = await fetch('/city-monitor-source-history.json', { cache: 'no-store' });
        const data = await response.json();
        const latest = Array.isArray(data.runs) ? data.runs[0] : undefined;
        if (latest) {
          setMonitorChanges(Array.isArray(latest.changed) ? latest.changed.length : 0);
          setMonitorCheckedAt(latest.checkedAt || '');
        }
      } catch {
        setMonitorChanges(0);
      }

      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (response.ok && Array.isArray(data.items)) setNews(data.items.slice(0, 3));
      } catch {
        setNews([]);
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

  return (
    <>
      <SEO
        title="Today in Makati"
        description="A personalized daily starting point for Makati: your barangay, live city conditions, news, events, participation and civic records."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Radical presence</div>
        <Heading>Today in Makati</Heading>
        <p className="mt-1 text-sm font-semibold text-primary-800">{dateLabel}</p>
        <p className="mt-3 max-w-3xl text-gray-700">
          Choose a barangay once on this device. BetterMakati uses that choice
          to put local civic information closer to the top without requiring
          precise GPS or an account.
        </p>

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
            >
              <option value="">Choose a barangay</option>
              {barangays.map(item => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-xs text-gray-500">
            Saved only in this browser&apos;s local storage. No account or precise
            location is required.
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
                    Barangay dashboard
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
        <div className="section-eyebrow">Right now</div>
        <Heading level={2}>City conditions & official sources</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/live" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CloudRain className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {weather.temperature === undefined ? '—' : Math.round(weather.temperature) + '°C'}
            </div>
            <div className="mt-1 font-bold text-gray-800">
              {weatherFailed ? 'Open official weather sources' : weatherLabel(weather.weatherCode)}
            </div>
          </Link>
          <Link to="/live" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Radio className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Advisories & utilities</div>
            <p className="mt-1 text-sm text-gray-600">PAGASA, Meralco, Manila Water, PHIVOLCS and city sources.</p>
          </Link>
          <Link to="/whats-on" className="rounded-2xl border border-primary-100 bg-white p-5">
            <CalendarDays className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">What&apos;s on</div>
            <p className="mt-1 text-sm text-gray-600">Current event discovery and original organizer sources.</p>
          </Link>
          <Link to="/participate" className="rounded-2xl border border-primary-100 bg-white p-5">
            <Users className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Participate</div>
            <p className="mt-1 text-sm text-gray-600">Consultations, community input and public participation gaps.</p>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Official activity</div>
        <Heading level={2}>City Monitor</Heading>
        <div className="mt-6 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
          <Radio className="h-5 w-5 text-primary-700" />
          <div className="mt-3 text-3xl font-extrabold text-gray-950">{monitorChanges}</div>
          <div className="font-bold text-gray-800">official source changes in the latest published monitor update</div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            A detected change is a review signal, not automatically a government
            action. City Monitor verifies the underlying record before publishing
            an ordinance stage, award, speech or other structured civic event.
          </p>
          {monitorCheckedAt && (
            <div className="mt-2 text-xs text-gray-500">
              Published monitor update: {new Date(monitorCheckedAt).toLocaleString('en-PH')}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/city-monitor" className="brand-btn-primary">Open City Monitor</Link>
            <Link to="/briefs" className="brand-btn-secondary">Civic Briefs</Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Makati in the news</div>
        <Heading level={2}>Recent coverage</Heading>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              The live news feed is unavailable. <Link to="/news" className="font-bold text-primary-700">Open Makati in the News</Link>.
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
          <Bell className="h-5 w-5 text-secondary-800" />
          <h2 className="mt-3 text-xl font-extrabold text-gray-950">
            Following and notifications come next
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
            The locality preference is live now. BetterMakati does not yet claim
            to send official alerts or push notifications. Future notification
            features should let people follow a barangay, project, consultation
            or topic and always preserve the original source.
          </p>
        </div>
      </Section>
    </>
  );
}
