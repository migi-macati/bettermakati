import { ExternalLink, MapPin } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { heritageSites } from '../data/visitMakati';
import SEO from '../components/SEO';

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function Heritage() {
  return (
    <>
      <SEO
        title="Heritage & Culture"
        description="Historical and cultural sites in Makati City."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Heritage & Culture</div>
        <Heading>Historical and cultural sites</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          {heritageSites.map(site => (
            <article key={site.name} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                  {site.category}
                </span>
                <span className="text-sm font-bold text-secondary-700">{site.period}</span>
              </div>

              <h2 className="font-extrabold text-xl text-gray-950 mt-4">{site.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{site.address}</p>
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">{site.summary}</p>

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
    </>
  );
}
