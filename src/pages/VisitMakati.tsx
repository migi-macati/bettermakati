import {
  ArrowRight,
  Bus,
  CalendarDays,
  ExternalLink,
  Film,
  Landmark,
  Map,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import PlacesExplorer from '../components/visit/PlacesExplorer';
import {
  visitorCurationSourceById,
  visitorExperiences,
  visitorResources,
  type VisitorCanonicalReference,
} from '../data/visitorCuration';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { visitImageSet } from '../data/cityImages';
import SharePage from '../components/ui/SharePage';
import { placeRegistryById } from '../data/placeRegistry';
import {
  resolveDistrictReference,
  resolveDistrictReferences,
} from '../data/districtReferences';

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const visitorRefView = (ref: VisitorCanonicalReference) => {
  if (ref.type === 'place') {
    const place = placeRegistryById.get(ref.id);
    if (!place) throw new Error('Unknown visitor Place: ' + ref.id);

    return {
      label: place.name,
      href: '/civic-map/' + place.id,
      mapQuery: place.location.point
        ? place.location.point.lat + ',' + place.location.point.lng
        : place.name + ', Makati City, Philippines',
      address: place.location.address,
    };
  }

  const district = resolveDistrictReference(ref);
  return {
    label: district.label,
    href: district.href,
    mapQuery: district.mapQuery,
    address: undefined,
  };
};

const makeItMakatiAreas = resolveDistrictReferences([
  { type: 'area', id: 'makati-cbd' },
  { type: 'area', id: 'ayala-center' },
  { type: 'area', id: 'circuit-makati' },
]);

const visitStarts = [
  { label: 'Places to go', href: '#places-to-start', icon: Map },
  { label: 'Getting around', href: '/mobility', icon: Bus },
  { label: 'Eat & drink', href: '/visit#places-to-start', icon: Utensils },
  { label: 'What\'s on', href: '/whats-on', icon: CalendarDays },
  { label: 'Heritage', href: '/heritage', icon: Landmark },
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
                <LastReviewed
                  date="2026-09-28"
                  note="Curated starting points now reuse canonical BetterMakati identities where possible; volatile schedules and commercial details remain with current external sources."
                />
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
              {visitorExperiences.map(experience => {
                const identity =
                  experience.kind === 'canonical-destination'
                    ? visitorRefView(experience.identityRef)
                    : {
                        label: experience.name,
                        href: visitorRefView(experience.anchorRefs[0]).href,
                        mapQuery: experience.mapsQuery,
                        address: undefined,
                      };
                const contextRefs =
                  experience.kind === 'recurring-experience'
                    ? experience.anchorRefs
                    : experience.contextRefs ?? [];
                const primarySource = visitorCurationSourceById.get(
                  experience.sourceIds[0]
                );

                return (
                  <article
                    key={experience.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      {experience.category}
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                      {identity.label}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {experience.summary}
                    </p>
                    {identity.address && (
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {identity.address}
                      </p>
                    )}

                    {contextRefs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {contextRefs.map(ref => {
                          const context = visitorRefView(ref);
                          return (
                            <Link
                              key={ref.type + ':' + ref.id}
                              to={context.href}
                              className="rounded-full border border-primary-200 px-2.5 py-1 text-xs font-bold text-primary-700"
                            >
                              {context.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <Link
                        to={identity.href}
                        className="inline-flex items-center gap-1 font-bold text-primary-700"
                      >
                        Explore context <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        href={mapsUrl(identity.mapQuery)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary-700"
                      >
                        Google Maps <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {experience.links.map(link => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-primary-700"
                        >
                          {link.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                      {primarySource && (
                        <a
                          href={primarySource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 underline underline-offset-2"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </article>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visitorResources.map(resource => {
            const areas =
              resource.id === 'make-it-makati'
                ? makeItMakatiAreas
                : [];

            return (
              <article
                key={resource.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <h2 className="text-lg font-extrabold text-gray-950">
                  {resource.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {resource.summary}
                </p>
                {areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {areas.map(area => (
                      <Link
                        key={area.ref.type + ':' + area.ref.id}
                        to={area.href}
                        className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                      >
                        {area.label}
                      </Link>
                    ))}
                  </div>
                )}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Open resource <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            );
          })}
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
