import {
  ArrowRight,
  Bus,
  CalendarDays,
  ExternalLink,
  Film,
  Landmark,
  Map,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import PlacesExplorer from '../components/visit/PlacesExplorer';
import {
  visitorCurationSourceById,
  visitorExperiences,
  visitorResources,
  type VisitorCanonicalReference,
  type VisitorExperience,
} from '../data/visitorCuration';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { visitImageSet } from '../data/cityImages';
import SharePage from '../components/ui/SharePage';
import { placeRegistryById } from '../data/placeRegistry';
import { resolveDistrictReference } from '../data/districtReferences';

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
      kindLabel: 'Place',
    };
  }

  const district = resolveDistrictReference(ref);
  return {
    label: district.label,
    href: district.href,
    mapQuery: district.mapQuery,
    address: undefined,
    kindLabel: ref.type === 'area' ? 'Area' : 'Barangay',
  };
};

const exploreStarts = [
  { label: 'City starting points', href: '#places-to-start', icon: Map },
  { label: 'Understand Makati', href: '#city-context', icon: Landmark },
  { label: 'Live discovery', href: '#live-discovery', icon: CalendarDays },
  { label: 'Getting around', href: '/mobility', icon: Bus },
  { label: 'Makati Calendar', href: '/calendar', icon: CalendarDays },
];

const exploreLayers = [
  {
    label: 'Areas & districts',
    href: '/estates',
    description:
      'See Makati CBD, Ayala Center, Rockwell, Century City, Circuit and named villages as city areas.',
    icon: Map,
  },
  {
    label: 'Barangays',
    href: '/barangays',
    description:
      'Move from a destination into the barangay that governs and serves the surrounding community.',
    icon: Map,
  },
  {
    label: 'Heritage',
    href: '/heritage',
    description:
      'Connect churches, markers, museums and historic landscapes to the places you are seeing.',
    icon: Landmark,
  },
  {
    label: 'History',
    href: '/history',
    description:
      'Follow Makati from San Pedro Macati through urbanization, cityhood and the modern city.',
    icon: Landmark,
  },
  {
    label: 'Getting around',
    href: '/mobility',
    description:
      'Use canonical transport systems, terminals, routes and live directions to move between places.',
    icon: Bus,
  },
  {
    label: 'Makati Calendar',
    href: '/calendar',
    description:
      'Connect places to civic dates, deadlines, meetings, publications and historical milestones.',
    icon: CalendarDays,
  },
];

const VisitorExperienceCard = ({
  experience,
}: {
  experience: VisitorExperience;
}) => {
  const identity =
    experience.kind === 'canonical-destination'
      ? visitorRefView(experience.identityRef)
      : {
          label: experience.name,
          href: visitorRefView(experience.anchorRefs[0]).href,
          mapQuery: experience.mapsQuery,
          address: undefined,
          kindLabel: 'Recurring experience',
        };

  const contextRefs =
    experience.kind === 'recurring-experience'
      ? experience.anchorRefs
      : experience.contextRefs ?? [];

  const primarySource = visitorCurationSourceById.get(experience.sourceIds[0]);

  return (
    <article
      id={'explore-' + experience.id}
      className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
    >
      <div className="flex flex-wrap gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em]">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
          {identity.kindLabel}
        </span>
        <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-800">
          {experience.category}
        </span>
      </div>

      <h3 className="mt-4 break-words text-xl font-extrabold text-gray-950">
        {identity.label}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {experience.summary}
      </p>

      {identity.address && (
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          {identity.address}
        </p>
      )}

      {contextRefs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {contextRefs.map(ref => {
            const context = visitorRefView(ref);
            return (
              <Link
                key={ref.type + ':' + ref.id}
                to={context.href}
                className="rounded-full border border-primary-200 px-2.5 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
              >
                {context.label}
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            to={identity.href}
            className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700"
          >
            Explore context <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={mapsUrl(identity.mapQuery)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700"
          >
            Map <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {(experience.links.length > 0 || primarySource) && (
          <details className="mt-3 border-t border-gray-100 pt-3 text-sm">
            <summary className="cursor-pointer font-bold text-gray-700">
              Current links &amp; source
            </summary>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
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
                  className="inline-flex items-center gap-1 text-gray-600 underline underline-offset-2"
                >
                  Evidence source
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </details>
        )}
      </div>
    </article>
  );
};

export default function VisitMakati() {
  const canonicalStarts = visitorExperiences.filter(
    experience => experience.kind === 'canonical-destination'
  );
  const recurringExperiences = visitorExperiences.filter(
    experience => experience.kind === 'recurring-experience'
  );

  return (
    <>
      <SEO
        title="Explore Makati"
        description="Explore Makati through durable places, districts, barangays, heritage, history, mobility, markets and current activity."
      />

      <section className="border-b border-primary-100 bg-[#fffdf8]">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="section-eyebrow">Explore Makati</div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
                Understand the city as you explore it.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
                Start with a place, district or recurring city experience, then
                follow its barangay, history, heritage, mobility and current
                activity across BetterMakati.
              </p>

              <nav
                className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                aria-label="Explore Makati sections"
              >
                {exploreStarts.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <SharePage title="Explore Makati | BetterMakati" />
                <LastReviewed
                  date="2026-09-28"
                  note="Curated starting points reuse canonical BetterMakati identities where possible; volatile schedules and commercial details remain with current external sources."
                />
              </div>
            </div>

            <PhotoCarousel images={visitImageSet} title="Explore Makati" />
          </div>
        </div>
      </section>

      <Section id="places-to-start" className="bg-white">
        <div className="section-eyebrow">City starting points</div>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            Start with Makati itself.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            These are durable places and city areas BetterMakati can explain
            beyond a map listing. Open one to move into its civic context.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {canonicalStarts.map(experience => (
            <VisitorExperienceCard
              key={experience.id}
              experience={experience}
            />
          ))}
        </div>

        <div className="mt-10 border-t border-gray-200 pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-eyebrow">Recurring experiences</div>
              <h3 className="text-2xl font-extrabold text-gray-950">
                Weekend markets
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600">
              Schedules and temporary locations can change, so current operating
              details stay with the market&apos;s live sources.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {recurringExperiences.map(experience => (
              <VisitorExperienceCard
                key={experience.id}
                experience={experience}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section id="city-context" className="bg-primary-900 text-white">
        <div className="section-eyebrow !text-white/75">
          Follow the connections
        </div>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Explore Makati by layer.
          </h2>
          <p className="mt-3 leading-relaxed text-primary-100">
            A destination makes more sense when you can see the district,
            barangay, history, heritage, transport and current activity around
            it.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exploreLayers.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className="group rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-secondary-500 hover:bg-white/10"
              >
                <Icon className="h-6 w-6 text-secondary-500" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-100">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section id="live-discovery" className="bg-[#f5f8f2]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="section-eyebrow">Live discovery</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              Looking for something specific?
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-gray-600">
              Restaurants, cafés, shops and nightlife change quickly. Use live
              place discovery for those, while BetterMakati keeps the durable
              city context around them.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                to="/cinemas"
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-primary-200 bg-white px-4 py-3 font-bold text-primary-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Film className="h-4 w-4" aria-hidden="true" />
                  Cinemas &amp; showtimes
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/mobility"
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-primary-200 bg-white px-4 py-3 font-bold text-primary-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Bus className="h-4 w-4" aria-hidden="true" />
                  Plan how to get there
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <PlacesExplorer />
          </div>
        </div>
      </Section>

      <Section id="resources" className="bg-[#fffdf8]">
        <div className="section-eyebrow">External resources</div>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-extrabold text-gray-950">
            Go to the source for current visitor information.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            BetterMakati provides the city context; these first-party and
            official resources are better for changing destination information.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visitorResources.map(resource => {
            const areas = (resource.areaRefs ?? []).map(areaId =>
              resolveDistrictReference({ type: 'area', id: areaId })
            );

            return (
              <article
                key={resource.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                  {resource.role === 'official-city'
                    ? 'Official city'
                    : 'First-party guide'}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                  {resource.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
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
                  className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Open resource <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
