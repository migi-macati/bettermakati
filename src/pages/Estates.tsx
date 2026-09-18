import { ExternalLink, MapPinned } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const estates = [
  {
    name: 'Makati Central Estate Association (MACEA)',
    area: 'Makati Central Business District',
    href: 'https://macea.com.ph/',
  },
  {
    name: 'Century City Estate Association',
    area: 'Century City, Poblacion',
    href: 'https://www.cpmi.com.ph/projects/',
  },
  {
    name: 'Rockwell Center Association, Inc.',
    area: 'Rockwell Center',
    href: 'https://e-rockwell.com/',
  },
  {
    name: 'Circuit Makati Estate Association (CMEA)',
    area: 'Circuit Makati, Carmona',
    href: 'https://www.ayalalandestates.com.ph/estates/circuit-makati',
  },
];

const mapsUrl = (name: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name);

export default function Estates() {
  return (
    <>
      <SEO
        title="Estates & Associations"
        description="Estate associations and managed districts in Makati City."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City</div>
        <Heading>Estates & Associations</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {estates.map(estate => (
            <article key={estate.name} className="rounded-2xl border border-gray-200 bg-white p-6">
              <MapPinned className="h-6 w-6 text-primary-700" />
              <h2 className="font-extrabold text-lg text-gray-950 mt-4">{estate.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{estate.area}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={estate.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-700"
                >
                  Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={mapsUrl(estate.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 underline underline-offset-2"
                >
                  Map
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
