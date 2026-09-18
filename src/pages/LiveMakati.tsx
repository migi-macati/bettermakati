import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  CloudRain,
  ExternalLink,
  Gauge,
  Radio,
  Waves,
  Zap,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

interface WeatherState {
  temperature?: number;
  apparent?: number;
  precipitation?: number;
  wind?: number;
  weatherCode?: number;
  aqi?: number;
  pm25?: number;
}

const weatherLabel = (code?: number) => {
  if (code === undefined) return 'Weather';
  if (code === 0) return 'Clear';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Weather';
};

const aqiLabel = (aqi?: number) => {
  if (aqi === undefined) return 'Air quality';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for sensitive groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very unhealthy';
  return 'Hazardous';
};

const liveSources = [
  {
    title: 'PAGASA NCR',
    description: 'Forecasts, thunderstorm advisories and rainfall warnings.',
    href: 'https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd',
    icon: CloudRain,
  },
  {
    title: 'Makati City News & Events',
    description: 'City announcements, news and event listings.',
    href: 'https://www.makati.gov.ph/content/news',
    icon: Building2,
  },
  {
    title: 'MACEA Circulars',
    description: 'CBD estate circulars, road works and member advisories.',
    href: 'https://macea.com.ph/memorandum-circular/',
    icon: Radio,
  },
  {
    title: 'Meralco Outages',
    description: 'View, report and track power interruptions.',
    href: 'https://www.meralco.com.ph/residential/help-support/frequently-asked-questions/outages-and-brownouts',
    icon: Zap,
  },
  {
    title: 'Manila Water',
    description: 'Bills, concerns and service advisories.',
    href: 'https://my.manilawater.app/',
    icon: Waves,
  },
  {
    title: 'PHIVOLCS',
    description: 'Latest earthquake information.',
    href: 'https://earthquake.phivolcs.dost.gov.ph/',
    icon: Activity,
  },
];

export default function LiveMakati() {
  const [weather, setWeather] = useState<WeatherState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [forecastResponse, airResponse] = await Promise.all([
          fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=14.5547&longitude=121.0244&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila',
          ),
          fetch(
            'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=14.5547&longitude=121.0244&current=us_aqi,pm2_5&timezone=Asia%2FManila',
          ),
        ]);

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
        });
      } catch {
        setWeather({});
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <>
      <SEO
        title="Live Makati"
        description="Weather, advisories, utilities and live information sources for Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Live Makati</div>
        <Heading>What’s happening now</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <CloudRain className="h-6 w-6 text-primary-700" />
            <div className="text-3xl font-extrabold text-gray-950 mt-4">
              {loading || weather.temperature === undefined ? '—' : Math.round(weather.temperature) + '°C'}
            </div>
            <div className="font-bold text-gray-800 mt-1">{weatherLabel(weather.weatherCode)}</div>
            {weather.apparent !== undefined && (
              <div className="text-sm text-gray-500 mt-1">Feels like {Math.round(weather.apparent)}°C</div>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Gauge className="h-6 w-6 text-primary-700" />
            <div className="text-3xl font-extrabold text-gray-950 mt-4">
              {loading || weather.aqi === undefined ? '—' : weather.aqi}
            </div>
            <div className="font-bold text-gray-800 mt-1">{aqiLabel(weather.aqi)}</div>
            {weather.pm25 !== undefined && (
              <div className="text-sm text-gray-500 mt-1">PM2.5 {Math.round(weather.pm25)} μg/m³</div>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <CloudRain className="h-6 w-6 text-primary-700" />
            <div className="text-3xl font-extrabold text-gray-950 mt-4">
              {loading || weather.precipitation === undefined ? '—' : weather.precipitation + ' mm'}
            </div>
            <div className="font-bold text-gray-800 mt-1">Current precipitation</div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <AlertTriangle className="h-6 w-6 text-primary-700" />
            <div className="text-3xl font-extrabold text-gray-950 mt-4">
              {loading || weather.wind === undefined ? '—' : Math.round(weather.wind) + ' km/h'}
            </div>
            <div className="font-bold text-gray-800 mt-1">Wind speed</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Weather and air-quality data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a>. Official warnings: <a href="https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd" target="_blank" rel="noreferrer" className="underline">PAGASA NCR</a>.
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Advisories & utilities</div>
        <Heading level={2}>Live sources</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {liveSources.map(source => {
            const Icon = source.icon;
            return (
              <a
                key={source.title}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h3 className="font-extrabold text-lg text-gray-950 mt-4">{source.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>
    </>
  );
}
