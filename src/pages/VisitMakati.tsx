import {
  ArrowRight,
  Bus,
  CalendarDays,
  ExternalLink,
  Film,
  Landmark,
  Map,
  ParkingCircle,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import PlacesExplorer from '../components/visit/PlacesExplorer';
import { visitorPlaces } from '../data/visitMakati';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { visitImageSet } from '../data/cityImages';
import SharePage from '../components/ui/SharePage';
import { placeRegistryById } from '../data/placeRegistry';

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const visitStarts = [
  { label: 'Places to go', href: '#places-to-start', icon: Map },
  { label: 'Getting around', href: '/mobility', icon: Bus },
  { label: 'Eat & drink', href: '/visit#places-to-start', icon: Utensils },
  { label: 'What\'s on', href: '/whats-on', icon: CalendarDays },
  { label: 'Heritage', href: '/heritage', icon: Landmark },
  { label: 'Parking', href: '/parking', icon: ParkingCircle },
];

export default function VisitMakati() {
  return (
    <>
      <SEO
        title="Visit Makati"
        description="Places to visit, food, markets, parks, heritage and history in Makati City."
      />

      <section className="border-b border-primary-100 bg-[#fffdf8]">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="section-eyebrow">Visit Makati</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
                What do you want to do in Makati?
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
                Find places, plan your trip, see what&apos;s on and explore the city.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {visitStarts.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="group rounded-2xl border border-primary-100 bg-white p-4 transition hover:border-primary-400 hover:shadow-sm"
                    >
                      <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                      <div className="mt-3 font-extrabold text-gray-950">{item.label}</div>
                      <ArrowRight className="mt-3 h-4 w-4 text-primary-700 transition group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <SharePage title="Visit Makati | BetterMakati" />
                <LastReviewed note="Place details and operating conditions can change; current map and official links are provided." />
              </div>
            </div>

            <PhotoCarousel images={visitImageSet} title="See Makati" />
          </div>
        </div>
      </section>

      <Section id="places-to-start" className="bg-white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <div className="section-eyebrow">Places to start</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              Explore the city
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visitorPlaces.map(place => {
                const registryPlace = place.placeId
                  ? placeRegistryById.get(place.placeId)
                  : undefined;
                const mapHref = registryPlace?.location.point
                  ? mapsUrl(
                      registryPlace.location.point.lat +
                        ',' +
                        registryPlace.location.point.lng
                    )
                  : mapsUrl(place.mapsQuery);

                return (
                  <div
                    key={place.name}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      {place.category}
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                      {place.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{place.summary}</p>
                    {registryPlace?.location.address && (
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {registryPlace.location.address}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary-700"
                      >
                        Google Maps <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {registryPlace && (
                        <Link
                          to={'/civic-map/' + registryPlace.id}
                          className="inline-flex items-center gap-1 font-bold text-primary-700"
                        >
                          Place details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
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
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <PlacesExplorer />
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Plan your visit</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            to="/mobility"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <Bus className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              Getting around Makati
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Public transport, directions and ride-hailing apps.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Plan a trip <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/cinemas"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <Film className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              Cinemas
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Cinema locations and current showtime links.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Find a cinema <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/parking"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <ParkingCircle className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              Parking
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Find parking near your destination.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Find parking <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/whats-on"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <CalendarDays className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              What’s on
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Events and activities across Makati.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              See events <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Culture & History</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            to="/heritage"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <Landmark className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              Heritage & cultural sites
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Churches, historic markers, museums and heritage structures.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-5">
              Explore heritage <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/history"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <Map className="h-7 w-7 text-primary-700" />
            <h2 className="font-extrabold text-xl text-gray-950 mt-4">
              History of Makati
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              A timeline from San Pedro Macati to the modern city.
            </p>
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
            <h2 className="font-extrabold text-lg text-gray-950">
              Make It Makati
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ayala Land's guide to Makati CBD, Ayala Center and Circuit Makati.
            </p>
          </a>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
          >
            <h2 className="font-extrabold text-lg text-gray-950">
              Official Makati Web Portal
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              City information, events and visitor resources.
            </p>
          </a>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Food & Places</div>
        <div className="rounded-2xl border border-secondary-100 bg-[#fff8e6] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <Utensils className="h-6 w-6 text-secondary-700" />
            <h2 className="font-extrabold text-2xl text-gray-950 mt-3">
              Looking for somewhere to eat?
            </h2>
            <p className="text-gray-600 mt-2">
              Search current restaurants, cafés and nightlife on Google Maps.
            </p>
          </div>
          <a
            href={mapsUrl(
              'restaurants in Makati City, Metro Manila, Philippines'
            )}
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
