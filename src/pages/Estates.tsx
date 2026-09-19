import { ExternalLink, MapPinned, Radio, Waypoints } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';

const estates = [
  {
    name: 'Makati Central Estate Association (MACEA)',
    area: 'Makati Central Business District',
    website: 'https://macea.com.ph/',
    resource: 'https://macea.com.ph/memorandum-circular/',
    resourceLabel: 'Circulars & advisories',
    usefulFor: 'CBD estate information, road works and member advisories',
  },
  {
    name: 'Century City Estate Association',
    area: 'Century City, Poblacion',
    website: 'https://www.cpmi.com.ph/projects/',
    resource: 'https://www.centurycitymall.com.ph/news-and-events/',
    resourceLabel: 'Area news & events',
    usefulFor: 'Century City development and public-facing district updates',
  },
  {
    name: 'Rockwell Center Association, Inc.',
    area: 'Rockwell Center',
    website: 'https://e-rockwell.com/',
    resource: 'https://e-rockwell.com/',
    resourceLabel: 'Rockwell portal',
    usefulFor: 'Rockwell Center property, venue and district information',
  },
  {
    name: 'Circuit Makati Estate Association (CMEA)',
    area: 'Circuit Makati, Carmona',
    website: 'https://www.ayalalandestates.com.ph/estates/circuit-makati',
    resource: 'https://makeitmakati.com/',
    resourceLabel: 'Circuit / Makati updates',
    usefulFor: 'Circuit estate, visitor and activity information',
  },
];

const mapsUrl = (name: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name);

export default function Estates() {
  return (
    <>
      <SEO
        title="Estates & Associations"
        description="Estate associations, managed districts and practical district resources in Makati City."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Estates & Associations</Heading>
            <p className="max-w-3xl text-gray-600">
              Makati&apos;s major managed districts and associations, with official links and maps.
            </p>
          </div>
          <SharePage title="Makati Estates & Associations | BetterMakati" />
        </div>
        <LastReviewed note="Association responsibilities and public channels differ by estate; use the linked organization for current rules and advisories." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {estates.map(estate => (
            <article
              key={estate.name}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <MapPinned className="h-6 w-6 text-primary-700" />
              <h2 className="font-extrabold text-lg text-gray-950 mt-4">
                {estate.name}
              </h2>
              <p className="text-sm font-semibold text-primary-800 mt-1">
                {estate.area}
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Useful for: {estate.usefulFor}.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={estate.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-700"
                >
                  Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={estate.resource}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-700"
                >
                  <Radio className="h-3.5 w-3.5" /> {estate.resourceLabel}
                </a>
                <a
                  href={mapsUrl(estate.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-500 underline underline-offset-2"
                >
                  <Waypoints className="h-3.5 w-3.5" /> Map
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Which channel?</div>
        <Heading level={2}>Estate, barangay or city?</Heading>
        <div className="mt-5 max-w-4xl rounded-2xl border border-primary-100 bg-white p-6 text-sm leading-relaxed text-gray-700">
          <p>
            Use estate channels for managed-area concerns; use city or barangay channels for public services and government matters.
          </p>
        </div>
      </Section>
    </>
  );
}
