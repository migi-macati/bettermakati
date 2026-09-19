import {
  ArrowRight,
  ExternalLink,
  Footprints,
  MapPin,
  Route,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { heritageSites } from '../data/visitMakati';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const directionsUrl = (stops: string[]) => {
  const [origin, ...rest] = stops;
  const destination = rest.at(-1) || origin;
  const waypoints = rest.slice(0, -1);
  const params = new URLSearchParams({
    api: '1',
    origin: origin + ', Makati City, Philippines',
    destination: destination + ', Makati City, Philippines',
    travelmode: 'walking',
  });
  if (waypoints.length) {
    params.set(
      'waypoints',
      waypoints.map(stop => stop + ', Makati City, Philippines').join('|')
    );
  }
  return 'https://www.google.com/maps/dir/?' + params.toString();
};

const walks = [
  {
    name: 'Old Makati to Ayala',
    note: 'A cross-city route linking the old town, civic museum and early modern business district.',
    stops: [
      'Museo ng Makati',
      'Saints Peter and Paul Parish Church Makati',
      'Nielson Tower Ayala Triangle Makati',
      'Ayala Museum Makati',
    ],
  },
  {
    name: 'Guadalupe to Tejeros',
    note: 'A longer walk connecting two of Makati’s historic religious sites.',
    stops: [
      'Nuestra Señora de Gracia Church Makati',
      'Holy Cross Parish Church Tejeros Makati',
    ],
  },
];

export default function Heritage() {
  return (
    <>
      <SEO
        title="Heritage & Culture"
        description="Historical and cultural sites, sourced context and self-guided heritage routes in Makati City."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Heritage & Culture</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Historical and cultural sites</Heading>
            <p className="max-w-3xl text-gray-600">
              Explore Makati&apos;s churches, markers, museums and surviving
              traces of the city before the modern skyline.
            </p>
          </div>
          <SharePage title="Heritage & Culture in Makati | BetterMakati" />
        </div>
        <LastReviewed note="Historical summaries link to NHCP, city or Department of Tourism sources." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          {heritageSites.map(site => (
            <article
              key={site.name}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                  {site.category}
                </span>
                <span className="text-sm font-bold text-secondary-700">
                  {site.period}
                </span>
              </div>

              <h2 className="font-extrabold text-xl text-gray-950 mt-4">
                {site.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{site.address}</p>
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                {site.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={mapsUrl(site.mapsQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-700"
                >
                  <MapPin className="h-4 w-4" /> Map
                </a>
                <a
                  href={site.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-500 underline underline-offset-2"
                >
                  {site.sourceLabel} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Self-guided routes</div>
        <Heading level={2}>Walk through Makati&apos;s history</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          These routes connect sourced heritage sites already listed above.
          They are orientation guides, not official walking tours. Check
          crossings, weather, opening hours and accessibility before setting
          out.
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {walks.map(walk => (
            <article
              key={walk.name}
              className="rounded-2xl border border-primary-100 bg-white p-6"
            >
              <Footprints className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 text-xl font-extrabold text-gray-950">
                {walk.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{walk.note}</p>
              <ol className="mt-5 space-y-3">
                {walk.stops.map((stop, index) => (
                  <li key={stop} className="flex items-start gap-3 text-sm">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-50 font-extrabold text-primary-800">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-gray-800">{stop}</span>
                  </li>
                ))}
              </ol>
              <a
                href={directionsUrl(walk.stops)}
                target="_blank"
                rel="noreferrer"
                className="brand-btn-primary mt-6"
              >
                <Route className="h-4 w-4" /> Open walking route
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6 md:p-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="section-eyebrow">Go deeper</div>
            <h2 className="text-2xl font-extrabold text-gray-950">
              Put these places in historical context
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              The BetterMakati timeline connects places to legal records,
              institutions and events across the city&apos;s history.
            </p>
          </div>
          <Link to="/history" className="brand-btn-secondary shrink-0">
            Open Makati history <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
