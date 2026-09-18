import { ArrowRight, Bus, CalendarDays, ExternalLink, Film, Landmark, Map, ParkingCircle, Utensils } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import PlacesExplorer from '../components/visit/PlacesExplorer';
import { visitorPlaces } from '../data/visitMakati';
import SEO from '../components/SEO';

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function VisitMakati() {
  return (
    <>
      <SEO
        title="Visit Makati"
        description="Places to visit, food, markets, parks, heritage and history in Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <Heading>Explore the city</Heading>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-8 mt-8 items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950">Start here</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {visitorPlaces.map(place => (
                <div key={place.name} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">{place.category}</div>
                  <h3 className="font-extrabold text-lg text-gray-950 mt-2">{place.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{place.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a
                      href={mapsUrl(place.mapsQuery)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-primary-700 inline-flex items-center gap-1"
                    >
                      Google Maps <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={place.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 underline underline-offset-2"
                    >
                      {place.sourceLabel}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PlacesExplorer />
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Plan your visit</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/mobility" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <Bus className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">Getting around Makati</h2>
            <p className="text-sm text-gray-600 mt-2">Public transport, directions and ride-hailing apps.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Plan a trip <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/cinemas" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <Film className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">Cinemas</h2>
            <p className="text-sm text-gray-600 mt-2">Cinema locations and current showtime links.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Find a cinema <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/parking" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <ParkingCircle className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">Parking</h2>
            <p className="text-sm text-gray-600 mt-2">Find parking near your destination.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Find parking <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/whats-on" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <CalendarDays className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">What’s on</h2>
            <p className="text-sm text-gray-600 mt-2">Events and activities across Makati.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              See events <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Culture & History</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/heritage" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <Landmark className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">Heritage & cultural sites</h2>
            <p className="text-sm text-gray-600 mt-2">Churches, historic markers, museums and heritage structures.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Explore heritage <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/history" className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition">
            <Map className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">History of Makati</h2>
            <p className="text-sm text-gray-600 mt-2">A timeline from San Pedro Makati to the modern city.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              View timeline <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </Section>

      <Section id="resources" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visitor resources</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://makeitmakati.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
          >
            <h2 className="font-extrabold text-lg text-gray-950">Make It Makati</h2>
            <p className="text-sm text-gray-600 mt-1">Ayala Land's guide to Makati CBD, Ayala Center and Circuit Makati.</p>
          </a>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
          >
            <h2 className="font-extrabold text-lg text-gray-950">Official Makati Web Portal</h2>
            <p className="text-sm text-gray-600 mt-1">City information, events and visitor resources.</p>
          </a>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Food & Places</div>
        <div className="rounded-2xl border border-secondary-100 bg-[#fff8e6] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <Utensils className="h-6 w-6 text-secondary-700" />
            <h2 className="font-extrabold text-2xl text-gray-950 mt-3">Looking for somewhere to eat?</h2>
            <p className="text-gray-600 mt-2">Search current restaurants, cafés and nightlife on Google Maps.</p>
          </div>
          <a
            href={mapsUrl('restaurants in Makati City, Metro Manila, Philippines')}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-primary shrink-0"
          >
            Find restaurants <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </>
  );
}
