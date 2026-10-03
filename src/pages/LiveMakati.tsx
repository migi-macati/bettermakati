import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CloudRain,
  ExternalLink,
  Gauge,
  PhoneCall,
  Radio,
  ShieldAlert,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  liveMakatiReviewed,
  liveMakatiSources,
  liveSourceAuthorityLabel,
  liveSourceCategoryLabel,
  type LiveSourceCategory,
} from '../data/liveMakati';

interface WeatherState {
  temperature?: number;
  apparent?: number;
  precipitation?: number;
  wind?: number;
  weatherCode?: number;
  aqi?: number;
  pm25?: number;
  observedAt?: string;
}

interface MonitorSourceState {
  id: string;
  label: string;
  url: string;
  status: string;
  statusCode?: number;
  change?: string;
}

interface MonitorState {
  checkedAt?: string | null;
  sources?: MonitorSourceState[];
}

const weatherLabel = (code?: number) => {
  if (code === undefined) return t('corePages.live.weather');
  if (code === 0) return t('corePages.live.clear');
  if ([1, 2, 3].includes(code)) return t('corePages.live.partly');
  if ([45, 48].includes(code)) return t('corePages.live.fog');
  if ([51, 53, 55, 56, 57].includes(code)) return t('corePages.live.drizzle');
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return t('corePages.live.rain');
  if ([95, 96, 99].includes(code)) return t('corePages.live.thunder');
  return t('corePages.live.weather');
};

const aqiLabel = (aqi?: number) => {
  if (aqi === undefined) return t('corePages.live.air');
  if (aqi <= 50) return t('corePages.live.good');
  if (aqi <= 100) return t('corePages.live.moderate');
  if (aqi <= 150) return t('corePages.live.sensitive');
  if (aqi <= 200) return t('corePages.live.unhealthy');
  if (aqi <= 300) return t('corePages.live.veryUnhealthy');
  return t('corePages.live.hazardous');
};

const sourceIcon = (category: LiveSourceCategory) => {
  if (category === 'weather') return CloudRain;
  if (category === 'utilities') return Waves;
  if (category === 'hazards') return Activity;
  if (category === 'district') return Radio;
  return ShieldAlert;
};

const sourceStatusLabel = (source?: MonitorSourceState) => {
  if (!source) return t('corePages.live.linked');
  if (source.status === 'ok') return t('corePages.live.reachableLast');
  return t('corePages.live.checkIssue');
};

export default function LiveMakati() {
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState<WeatherState>({});
  const [loading, setLoading] = useState(true);
  const [weatherFailed, setWeatherFailed] = useState(false);
  const [monitorState, setMonitorState] = useState<MonitorState>({});
  const [monitorStateFailed, setMonitorStateFailed] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const [forecastResponse, airResponse] = await Promise.all([
          fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=14.5547&longitude=121.0244&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila'
          ),
          fetch(
            'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=14.5547&longitude=121.0244&current=us_aqi,pm2_5&timezone=Asia%2FManila'
          ),
        ]);

        if (!forecastResponse.ok || !airResponse.ok) {
          throw new Error('Live weather source unavailable');
        }

        const forecast = await forecastResponse.json();
        const air = await airResponse.json();

        setWeather({
          temperature: forecast.current?.temperature_2m,
          apparent: forecast.current?.apparent_temperature,
          precipitation: forecast.current?.precipitation,
          wind: forecast.current?.wind_speed_10m,
          weatherCode: forecast.current?.weather_code,
          aqi: air.current?.us_aqi,
          pm25: air.current?.pm2_5,
          observedAt: forecast.current?.time,
        });
        setWeatherFailed(false);
      } catch {
        setWeather({});
        setWeatherFailed(true);
      } finally {
        setLoading(false);
      }
    };

    const loadMonitorState = async () => {
      try {
        const response = await fetch('/city-monitor-source-state.json', {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('City Monitor source state unavailable');
        const data = (await response.json()) as MonitorState;
        setMonitorState({
          checkedAt: data.checkedAt,
          sources: Array.isArray(data.sources) ? data.sources : [],
        });
        setMonitorStateFailed(false);
      } catch {
        setMonitorState({});
        setMonitorStateFailed(true);
      }
    };

    void Promise.all([loadWeather(), loadMonitorState()]);
  }, []);

  const monitorSources = monitorState.sources ?? [];
  const healthyMonitorSources = monitorSources.filter(source => source.status === 'ok').length;
  const monitoredLiveSources = liveMakatiSources.filter(source => source.checkMode === 'city-monitor');
  const monitoredReachable = monitoredLiveSources.filter(source =>
    monitorSources.some(item => item.id === source.monitorSourceId && item.status === 'ok')
  ).length;

  const sourcesByCategory = useMemo(
    () =>
      (['weather', 'city', 'utilities', 'hazards', 'district'] as LiveSourceCategory[])
        .map(category => ({
          category,
          sources: liveMakatiSources.filter(source => source.category === category),
        }))
        .filter(group => group.sources.length > 0),
    []
  );

  const observedTime = weather.observedAt
    ? new Intl.DateTimeFormat(i18n.language === 'fil' ? 'fil-PH' : 'en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
      }).format(
        new Date(
          weather.observedAt +
            (/[zZ]|[+-]\d\d:\d\d$/.test(weather.observedAt) ? '' : '+08:00')
        )
      )
    : '';

  const monitorCheckedTime = monitorState.checkedAt
    ? new Intl.DateTimeFormat(i18n.language === 'fil' ? 'fil-PH' : 'en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
      }).format(new Date(monitorState.checkedAt))
    : '';

  return (
    <>
      <SEO
        title={t('corePages.live.seoTitle')}
        description={t('corePages.live.seoDescription')}
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('corePages.live.eyebrow')}</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{t('corePages.live.title')}</Heading>
            <p className="mt-2 max-w-3xl text-gray-700">
              {t('corePages.live.intro')}
            </p>
          </div>
          <SharePage title={`${t('corePages.live.seoTitle')} | BetterMakati`} />
        </div>
        <LastReviewed
          date={liveMakatiReviewed}
          label={t('corePages.live.reviewed')}
          note="Third-party observations are labeled separately. Official warnings and provider advisories remain controlling sources."
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/today" className="brand-btn-primary">{t('corePages.live.today')}</Link>
          <Link to="/city-monitor" className="brand-btn-secondary">{t('corePages.live.monitor')}</Link>
          <Link to="/briefs" className="brand-btn-secondary">{t('corePages.live.briefs')}</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="tel:911"
            className="flex min-h-16 items-center gap-3 rounded-2xl bg-primary-900 px-5 py-4 text-white hover:bg-primary-950"
          >
            <PhoneCall className="h-5 w-5 shrink-0 text-secondary-200" />
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.08em] text-primary-100">
                {t('corePages.live.emergency')}
              </span>
              <span className="font-extrabold">{t('corePages.live.call911')}</span>
            </span>
          </a>
          <a
            href="https://resilient.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-primary-200 bg-white px-5 py-4 hover:border-primary-400"
          >
            <ShieldAlert className="h-5 w-5 shrink-0 text-primary-700" />
            <span className="font-extrabold text-gray-950">Makati DRRMO</span>
          </a>
          <Link
            to="/hotlines"
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-primary-200 bg-white px-5 py-4 hover:border-primary-400"
          >
            <PhoneCall className="h-5 w-5 shrink-0 text-primary-700" />
            <span className="font-extrabold text-gray-950">{t('corePages.live.hotlines')}</span>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('corePages.live.observed')}</div>
        <Heading level={2}>{t('corePages.live.weatherAir')}</Heading>

        {weatherFailed && (
          <div className="mt-6 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-900" role="status">
            Third-party weather and air-quality observations could not be loaded. Use
            PAGASA NCR below for current official warnings and forecasts.
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
            <CloudRain className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-3xl font-extrabold text-gray-950">
              {loading || weather.temperature === undefined ? '—' : Math.round(weather.temperature) + '°C'}
            </div>
            <div className="mt-1 font-bold text-gray-800">{weatherLabel(weather.weatherCode)}</div>
            {weather.apparent !== undefined && (
              <div className="mt-1 text-sm text-gray-500">Feels like {Math.round(weather.apparent)}°C</div>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
            <Gauge className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-3xl font-extrabold text-gray-950">
              {loading || weather.aqi === undefined ? '—' : weather.aqi}
            </div>
            <div className="mt-1 font-bold text-gray-800">{aqiLabel(weather.aqi)}</div>
            {weather.pm25 !== undefined && (
              <div className="mt-1 text-sm text-gray-500">PM2.5 {Math.round(weather.pm25)} μg/m³</div>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
            <CloudRain className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-3xl font-extrabold text-gray-950">
              {loading || weather.precipitation === undefined ? '—' : weather.precipitation + ' mm'}
            </div>
            <div className="mt-1 font-bold text-gray-800">{t('corePages.live.precip')}</div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
            <AlertTriangle className="h-6 w-6 text-primary-700" />
            <div className="mt-4 text-3xl font-extrabold text-gray-950">
              {loading || weather.wind === undefined ? '—' : Math.round(weather.wind) + ' km/h'}
            </div>
            <div className="mt-1 font-bold text-gray-800">{t('corePages.live.wind')}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
          <strong className="text-gray-800">{t('corePages.live.observation')}</strong>{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a>
          {observedTime ? ' · data time ' + observedTime : ''}. For warnings, use{' '}
          <a
            href="https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline"
          >
            PAGASA NCR
          </a>.
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">{t('corePages.live.freshness')}</div>
        <Heading level={2}>{t('corePages.live.checks')}</Heading>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <CheckCircle2 className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">
              {monitorStateFailed ? '—' : healthyMonitorSources + '/' + monitorSources.length}
            </div>
            <div className="font-bold text-gray-800">{t('corePages.live.reachable')}</div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Radio className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">
              {monitorStateFailed ? '—' : monitoredReachable + '/' + monitoredLiveSources.length}
            </div>
            <div className="font-bold text-gray-800">{t('corePages.live.liveReachable')}</div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Clock3 className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              {monitorCheckedTime || t('corePages.live.noCheck')}
            </div>
            <div className="mt-1 font-bold text-gray-800">{t('corePages.live.lastCheck')}</div>
            <Link to="/city-monitor" className="mt-3 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2">
              {t('corePages.live.inspect')}
            </Link>
          </div>
        </div>

        {monitorStateFailed && (
          <div className="mt-4 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700" role="status">
            The published City Monitor source-health file is unavailable. Linked official and provider sources below remain available for direct checking.
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('corePages.live.advisories')}</div>
        <Heading level={2}>{t('corePages.live.directory')}</Heading>

        <div className="mt-7 space-y-8">
          {sourcesByCategory.map(group => (
            <div key={group.category}>
              <h3 className="text-lg font-extrabold text-gray-950">
                {liveSourceCategoryLabel[group.category]}
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.sources.map(source => {
                  const Icon = sourceIcon(source.category);
                  const checkedSource = source.monitorSourceId
                    ? monitorSources.find(item => item.id === source.monitorSourceId)
                    : undefined;
                  return (
                    <a
                      key={source.id}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 transition hover:border-primary-300 hover:shadow-sm"
                    >
                      <Icon className="h-6 w-6 text-primary-700" />
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                          {liveSourceAuthorityLabel[source.authority]}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                          {sourceStatusLabel(checkedSource)}
                        </span>
                      </div>
                      <h4 className="mt-3 text-lg font-extrabold text-gray-950">{source.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{source.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                        {t('corePages.live.open')} <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
