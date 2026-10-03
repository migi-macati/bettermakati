import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRightLeft,
  Bike,
  Building2,
  Bus,
  Car,
  ExternalLink,
  MapPin,
  Navigation,
  Plane,
  Search,
  Ship,
  Train,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { mobilityImageSet } from '../data/cityImages';
import {
  placeRegistryById,
  placesByCategory,
  type PlaceRegistryRecord,
} from '../data/placeRegistry';
import {
  resolveDistrictReference,
  type DistrictReference,
} from '../data/districtReferences';
import { civicAreaById } from '../data/areaOrganizationRegistry';
import {
  mobilityServices,
  mobilitySources,
  type MobilityServiceRecord,
} from '../data/mobilitySystems';
import {
  currentBusRoutes,
  currentOrSuccessorJeepneyCorridors,
  currentUvExpressRoutes,
  mobilityRouteSources,
  unresolvedJeepneyRows,
  type MobilityCurrentServiceRouteRecord,
  type MobilityHistoricalRouteRecord,
  type MobilityRouteCorridorRecord,
} from '../data/mobilityRoutes';
import { mobilityExternalResources } from '../data/mobilityExternalResources';
import {
  mobilityNetworkRelationships,
  mobilityNetworkSources,
  type MobilityNetworkNodeRef,
  type MobilityNetworkRelationship,
} from '../data/mobilityNetwork';

const verifiedTransportPlaces = [
  ...placesByCategory('transport-stop'),
  ...placesByCategory('transport-terminal'),
]
  .filter(place => place.verification.status === 'verified')
  .sort((a, b) => {
    const rank = (place: PlaceRegistryRecord) => {
      if (place.tags.includes('MRT-3')) return 0;
      if (place.tags.includes('EDSA Busway')) return 1;
      if (place.tags.includes('Pasig River Ferry')) return 2;
      if (place.primaryCategory === 'transport-terminal') return 3;
      return 4;
    };

    return rank(a) - rank(b) || a.name.localeCompare(b.name);
  });

const transportPlaceKind = (place: PlaceRegistryRecord) => {
  if (place.tags.includes('MRT-3')) return 'MRT-3 station';
  if (place.tags.includes('EDSA Busway')) return 'EDSA Busway station';
  if (place.tags.includes('Pasig River Ferry')) return 'Pasig River Ferry station';
  if (place.primaryCategory === 'transport-terminal') return 'Transport terminal';
  return 'Public transport stop';
};

const primaryTransportSource = (place: PlaceRegistryRecord) =>
  place.provenance.sources.find(source => source.kind !== 'reference-map') ??
  place.provenance.sources[0];

const publicMobilityServices = mobilityServices.filter(
  service => service.governance === 'public'
);

const privateMobilityServices = mobilityServices.filter(
  service => service.governance === 'private'
);

const oneAyala = placeRegistryById.get('one-ayala-terminal');

const mobilityServiceKind = (service: MobilityServiceRecord) => {
  if (service.serviceClass === 'public-ferry') return 'Public ferry service';
  if (service.serviceClass === 'private-estate-shuttle') {
    return 'Private estate shuttle';
  }
  return 'Public transport system';
};

const mobilityServiceIcon = (service: MobilityServiceRecord) => {
  if (service.mode === 'rail') return Train;
  if (service.mode === 'ferry') return Ship;
  return Bus;
};

const preferredMobilityServiceLink = (service: MobilityServiceRecord) =>
  service.links.find(link => link.kind === 'official-site') ??
  service.links.find(link => link.kind === 'current-service-info') ??
  service.links.find(link => link.kind === 'route-schedule') ??
  service.links[0];

const mobilityRouteSourceById = new Map(
  mobilityRouteSources.map(source => [source.id, source])
);

type MobilityRouteView = 'bus' | 'uv-express' | 'jeepney' | 'unresolved';

const routeViews: {
  id: MobilityRouteView;
  label: string;
  count: number;
}[] = [
  { id: 'bus', label: 'Bus & P2P', count: currentBusRoutes.length },
  { id: 'uv-express', label: 'UV Express', count: currentUvExpressRoutes.length },
  {
    id: 'jeepney',
    label: 'Jeepney corridors',
    count: currentOrSuccessorJeepneyCorridors.length,
  },
  {
    id: 'unresolved',
    label: 'Unresolved',
    count: unresolvedJeepneyRows.length,
  },
];

const currentRouteClassLabel = (
  route: MobilityCurrentServiceRouteRecord
) => {
  if (route.currentService.serviceClass === 'p2p-bus') return 'P2P bus';
  if (route.currentService.serviceClass === 'uv-express') return 'UV Express';
  return 'City / intercity bus';
};

const jeepneyDispositionLabel = (
  route: MobilityHistoricalRouteRecord
) =>
  route.disposition === 'successor-corridor'
    ? 'Successor corridor'
    : route.disposition === 'current-corridor'
      ? 'Current corridor'
      : 'Current status unresolved';

const routeEvidenceSources = (
  route: MobilityCurrentServiceRouteRecord | MobilityHistoricalRouteRecord
) =>
  route.currentEvidenceSourceIds
    .map(sourceId => mobilityRouteSourceById.get(sourceId))
    .filter(source => source !== undefined);

const historicalSourceFor = (route: MobilityHistoricalRouteRecord) =>
  mobilityRouteSourceById.get(route.historical.sourceId);

const routeDisplayLimit = 12;

const mobilityRouteMatchesQuery = (
  route: MobilityRouteCorridorRecord,
  query: string
) => {
  if (!query) return true;

  const haystack =
    route.recordKind === 'current-service'
      ? [
          route.id,
          route.mode,
          route.currentService.routeLabel,
          route.currentService.originLabel,
          route.currentService.destinationLabel,
          route.currentService.serviceClass,
        ]
      : [
          route.id,
          route.mode,
          route.historical.from,
          route.historical.to,
          route.historical.associationLabel,
          route.disposition,
          route.reconciliationStatus,
          route.note,
        ];

  return haystack.join(' ').toLowerCase().includes(query);
};

const mobilityServiceById = new Map(
  mobilityServices.map(service => [service.id, service])
);

const mobilitySystemSourceById = new Map(
  mobilitySources.map(source => [source.id, source])
);

const mobilityNetworkSourceById = new Map(
  mobilityNetworkSources.map(source => [source.id, source])
);

const transferRelationships = mobilityNetworkRelationships.filter(
  relationship => relationship.kind === 'transfer'
);

const serviceHubRelationships = mobilityNetworkRelationships.filter(
  relationship => relationship.kind === 'service-connected-hub'
);

const mobilityNetworkNodeLabel = (node: MobilityNetworkNodeRef) => {
  if (node.type === 'place') {
    return placeRegistryById.get(node.id)?.name ?? node.id;
  }
  if (node.type === 'service') {
    return mobilityServiceById.get(node.id)?.name ?? node.id;
  }
  return node.id;
};

const networkEvidenceSources = (
  relationship: MobilityNetworkRelationship
) =>
  relationship.sourceRefs
    .map(sourceRef => {
      if (sourceRef.registry === 'network') {
        return mobilityNetworkSourceById.get(sourceRef.sourceId);
      }
      if (sourceRef.registry === 'system') {
        return mobilitySystemSourceById.get(sourceRef.sourceId);
      }
      return mobilityRouteSourceById.get(sourceRef.sourceId);
    })
    .filter(source => source !== undefined);

const transferPlaceIds = new Set(
  transferRelationships.flatMap(relationship => [
    relationship.from.id,
    relationship.to.id,
  ])
);

const serviceHasInterchange = (service: MobilityServiceRecord) =>
  serviceHubRelationships.some(
    relationship =>
      relationship.from.type === 'service' &&
      relationship.from.id === service.id
  ) ||
  service.placeConnections.some(connection =>
    transferPlaceIds.has(connection.placeId)
  );

type TripEndpoint =
  | DistrictReference
  | { type: 'external'; label: string; mapQuery: string };

const resolveTripEndpoint = (endpoint: TripEndpoint) =>
  endpoint.type === 'external'
    ? endpoint
    : resolveDistrictReference(endpoint);

const commonTrips = [
  {
    origin: { type: 'area', id: 'ayala-center' } as DistrictReference,
    destination: { type: 'barangay', id: 'poblacion' } as DistrictReference,
    icon: Bus,
  },
  {
    origin: { type: 'area', id: 'makati-cbd' } as DistrictReference,
    destination: { type: 'area', id: 'rockwell-center' } as DistrictReference,
    icon: Navigation,
  },
  {
    origin: { type: 'area', id: 'circuit-makati' } as DistrictReference,
    destination: { type: 'area', id: 'ayala-center' } as DistrictReference,
    icon: Bus,
  },
  {
    origin: { type: 'area', id: 'makati-cbd' } as DistrictReference,
    destination: {
      type: 'external',
      label: 'NAIA Terminal 3',
      mapQuery: 'NAIA Terminal 3, Pasay City, Metro Manila, Philippines',
    } as const,
    icon: Plane,
  },
].map(trip => {
  const origin = resolveTripEndpoint(trip.origin);
  const destination = resolveTripEndpoint(trip.destination);
  return {
    ...trip,
    origin,
    destination,
    label: origin.label + ' → ' + destination.label,
  };
});

const mapsDirections = (
  destination: string,
  mode: string,
  origin?: string,
  qualifyAsMakati = true
) => {
  const qualify = (query: string) =>
    qualifyAsMakati && !query.toLowerCase().includes('makati')
      ? query + ', Makati City, Metro Manila, Philippines'
      : query;

  const params = new URLSearchParams({
    api: '1',
    destination: qualify(destination),
    travelmode: mode,
  });
  if (origin) {
    params.set('origin', qualify(origin));
  }
  return 'https://www.google.com/maps/dir/?' + params.toString();
};

export default function Mobility() {
  const { t } = useTranslation();
  const [destination, setDestination] = useState('Ayala Triangle Gardens');
  const [mode, setMode] = useState('transit');
  const [routeView, setRouteView] = useState<MobilityRouteView>('bus');
  const [routeQuery, setRouteQuery] = useState('');
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  const normalizedRouteQuery = routeQuery.trim().toLowerCase();

  const filteredCurrentRoutes = (
    routeView === 'bus' ? currentBusRoutes : currentUvExpressRoutes
  ).filter(route => mobilityRouteMatchesQuery(route, normalizedRouteQuery));

  const filteredJeepneyRoutes = currentOrSuccessorJeepneyCorridors.filter(
    route => mobilityRouteMatchesQuery(route, normalizedRouteQuery)
  );

  const filteredUnresolvedRoutes = unresolvedJeepneyRows.filter(route =>
    mobilityRouteMatchesQuery(route, normalizedRouteQuery)
  );

  const activeRouteCount =
    routeView === 'bus' || routeView === 'uv-express'
      ? filteredCurrentRoutes.length
      : routeView === 'jeepney'
        ? filteredJeepneyRoutes.length
        : filteredUnresolvedRoutes.length;

  const visibleCurrentRoutes = showAllRoutes
    ? filteredCurrentRoutes
    : filteredCurrentRoutes.slice(0, routeDisplayLimit);

  const visibleJeepneyRoutes = showAllRoutes
    ? filteredJeepneyRoutes
    : filteredJeepneyRoutes.slice(0, routeDisplayLimit);

  const visibleUnresolvedRoutes = showAllRoutes
    ? filteredUnresolvedRoutes
    : filteredUnresolvedRoutes.slice(0, routeDisplayLimit);

  return (
    <>
      <SEO
        title={t('corePages.mobility.seoTitle')}
        description={t('corePages.mobility.seoDescription')}
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Explore Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{t('corePages.mobility.title')}</Heading>
            <p className="max-w-3xl text-gray-600">
              Plan a trip, find major transport anchors and jump to current
              operator or mapping information.
            </p>
          </div>
          <SharePage title={`${t('corePages.mobility.share')} | BetterMakati`} />
        </div>
        <LastReviewed
          date="2026-09-28"
          note="System identity and Makati transport anchors come from canonical BetterMakati records. Schedules, fares and live routing remain with the linked operator or map."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/visit" className="brand-btn-primary">
            Explore Makati
          </Link>
          <Link to="/estates" className="brand-btn-secondary">
            Areas &amp; districts
          </Link>
        </div>
        <PhotoCarousel
          images={mobilityImageSet}
          title={t('corePages.mobility.street')}
          compact
          className="mt-7"
        />

        <nav
          className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          aria-label={t('corePages.mobility.sections')}
        >
          <a
            href="#transport-anchors"
            className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
          >
            Stations &amp; terminals
          </a>
          <a
            href="#interchanges"
            className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
          >
            Transfers
          </a>
          <a
            href="#routes"
            className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
          >
            Routes
          </a>
          <Link
            to="/civic-map"
            className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
          >
            Civic Map
          </Link>
          <Link
            to="/search?q=transport"
            className="brand-chip min-h-11 shrink-0 whitespace-nowrap"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search transport
          </Link>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 font-bold text-gray-950">
              <Navigation className="h-5 w-5 text-primary-700" />
              Plan a trip
            </div>

            <label className="form-field mt-5">
              <span>{t('corePages.mobility.destination')}</span>
              <input
                value={destination}
                onChange={event => setDestination(event.target.value)}
                placeholder="e.g., Power Plant Mall"
              />
            </label>

            <div
              className="mt-4 flex flex-wrap gap-2"
              role="group"
              aria-label={t('corePages.mobility.mode')}
            >
              {[
                ['transit', 'Public transport'],
                ['walking', 'Walk'],
                ['bicycling', 'Bike'],
                ['driving', 'Drive'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={
                    mode === value
                      ? 'brand-chip !bg-primary-800 !text-white'
                      : 'brand-chip'
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <a
              href={mapsDirections(destination, mode)}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-primary mt-5"
            >
              Get directions <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div>
            <div className="section-eyebrow">Public transport</div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {publicMobilityServices.map(service => {
                const Icon = mobilityServiceIcon(service);
                const currentLink = preferredMobilityServiceLink(service);

                return (
                  <article
                    key={service.id}
                    id={'system-' + service.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                          {mobilityServiceKind(service)}
                        </div>
                        <h2 className="mt-2 text-lg font-extrabold text-gray-950">
                          {service.name}
                        </h2>
                      </div>
                      <Icon
                        className="h-6 w-6 shrink-0 text-primary-700"
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {service.summary}
                    </p>
                    <p className="mt-3 text-xs font-bold text-gray-500">
                      {service.placeConnections.length} Makati connection
                      {service.placeConnections.length === 1 ? '' : 's'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href="#transport-anchors"
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Stations and terminals
                      </a>
                      {serviceHasInterchange(service) && (
                        <a
                          href="#interchanges"
                          className="text-sm font-bold text-primary-700 underline underline-offset-2"
                        >
                          Transfers
                        </a>
                      )}
                      <Link
                        to={'/search?q=' + encodeURIComponent(service.name)}
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Search this system
                      </Link>
                      {currentLink && (
                        <a
                          href={currentLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                        >
                          Current service info
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {oneAyala && (
            <article className="rounded-2xl border border-secondary-200 bg-secondary-50/40 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-secondary-900">
                Intermodal hub
              </div>
              <h2 className="mt-2 text-lg font-extrabold text-gray-950">
                {oneAyala.name}
              </h2>
              {oneAyala.summary && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {oneAyala.summary}
                </p>
              )}
              {oneAyala.location.address && (
                <p className="mt-3 text-sm text-gray-600">
                  {oneAyala.location.address}
                </p>
              )}
              <Link
                to={'/civic-map/' + oneAyala.id}
                className="mt-4 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2"
              >
                Open One Ayala place record
              </Link>
            </article>
          )}

          {privateMobilityServices.map(service => {
            const Icon = mobilityServiceIcon(service);
            const currentLink = preferredMobilityServiceLink(service);

            return (
              <article
                key={service.id}
                    id={'system-' + service.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                      {mobilityServiceKind(service)}
                    </div>
                    <h2 className="mt-2 text-lg font-extrabold text-gray-950">
                      {service.name}
                    </h2>
                  </div>
                  <Icon
                    className="h-6 w-6 shrink-0 text-primary-700"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {service.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {(service.relatedAreaIds ?? []).map(areaId => {
                    const area = civicAreaById.get(areaId);
                    return area ? (
                      <Link
                        key={areaId}
                        to={'/estates#area-' + areaId}
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        {area.name}
                      </Link>
                    ) : null;
                  })}
                  <Link
                    to={'/search?q=' + encodeURIComponent(service.name)}
                    className="text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Search this service
                  </Link>
                  {currentLink && (
                    <a
                      href={currentLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Current route and schedule
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="transport-anchors" className="bg-white">
        <div className="section-eyebrow">Transport anchors</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Heading level={2}>{t('corePages.mobility.stations')}</Heading>
            <p className="max-w-3xl text-sm text-gray-600">
              Verified MRT-3, EDSA Busway, Pasig River Ferry and intermodal locations.
            </p>
          </div>
          <Link
            to="/civic-map"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
          >
            Open Civic Map <MapPin className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {verifiedTransportPlaces.map(place => {
            const source = primaryTransportSource(place);
            const Icon = place.tags.includes('rail') ? Train : Bus;

            return (
              <article
                key={place.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {transportPlaceKind(place)}
                  </div>
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-gray-950">{place.name}</h3>
                {place.summary && (
                  <p className="mt-1 text-sm text-gray-600">{place.summary}</p>
                )}
                {place.location.address && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {place.location.address}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={'/civic-map/' + place.id}
                    className="text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Place details
                  </Link>
                  {source && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="interchanges" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Interchanges</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>{t('corePages.mobility.transfers')}</Heading>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              These connections come from the canonical mobility network. They
              are documented relationships, not transfers inferred from nearby
              map points.
            </p>
          </div>
          <div className="text-sm font-bold text-gray-600">
            {transferRelationships.length} transfers ·{' '}
            {serviceHubRelationships.length} system–hub connections
          </div>
        </div>

        <div className="mt-7">
          <h3 className="text-lg font-extrabold text-gray-950">
            Transfer points
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {transferRelationships.map(relationship => {
              const fromPlace = placeRegistryById.get(relationship.from.id);
              const toPlace = placeRegistryById.get(relationship.to.id);
              const sources = networkEvidenceSources(relationship);

              return (
                <article
                  key={relationship.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                      {relationship.evidenceStrength === 'direct'
                        ? 'Directly documented'
                        : 'Corroborated'}
                    </div>
                    <ArrowRightLeft
                      className="h-5 w-5 shrink-0 text-primary-700"
                      aria-hidden="true"
                    />
                  </div>

                  <h4 className="mt-2 text-lg font-extrabold text-gray-950">
                    {mobilityNetworkNodeLabel(relationship.from)} ↔{' '}
                    {mobilityNetworkNodeLabel(relationship.to)}
                  </h4>

                  {relationship.note && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {relationship.note}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {fromPlace && (
                      <Link
                        to={'/civic-map/' + fromPlace.id}
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        {fromPlace.name}
                      </Link>
                    )}
                    {toPlace && (
                      <Link
                        to={'/civic-map/' + toPlace.id}
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        {toPlace.name}
                      </Link>
                    )}
                    {sources.map((source, index) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Evidence
                        {sources.length > 1 ? ' ' + (index + 1) : ''}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-extrabold text-gray-950">
            One Ayala system connections
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {serviceHubRelationships.map(relationship => {
              const hub = placeRegistryById.get(relationship.to.id);
              const sources = networkEvidenceSources(relationship);

              return (
                <article
                  key={relationship.id}
                  className="rounded-2xl border border-secondary-200 bg-white p-5"
                >
                  <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-secondary-900">
                    System–hub connection
                  </div>
                  <h4 className="mt-2 text-lg font-extrabold text-gray-950">
                    {mobilityNetworkNodeLabel(relationship.from)} ↔{' '}
                    {mobilityNetworkNodeLabel(relationship.to)}
                  </h4>

                  {relationship.note && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {relationship.note}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {hub && (
                      <Link
                        to={'/civic-map/' + hub.id}
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Open {hub.name}
                      </Link>
                    )}
                    {sources.map(source => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Evidence
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Section>

      <Section id="routes" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Route registry</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>{t('corePages.mobility.routes')}</Heading>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              Browse current One Ayala bus and UV services alongside reconciled
              Makati jeepney corridors. Route records without sourced geometry
              remain listable here without invented map lines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm font-bold text-gray-600">
              {routeViews.reduce((total, view) => total + view.count, 0)} canonical
              route records
            </div>
            <Link
              to="/search?q=route"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Search route records
              <Search className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="group"
          aria-label={t('corePages.mobility.registry')}
        >
          {routeViews.map(view => (
            <button
              key={view.id}
              type="button"
              onClick={() => {
                setRouteView(view.id);
                setShowAllRoutes(false);
              }}
              aria-pressed={routeView === view.id}
              className={
                routeView === view.id
                  ? 'brand-chip min-h-11 shrink-0 whitespace-nowrap !bg-primary-800 !text-white'
                  : 'brand-chip min-h-11 shrink-0 whitespace-nowrap'
              }
            >
              {view.label} ({view.count})
            </button>
          ))}
        </div>

        <div className="mt-4 max-w-xl">
          <label
            htmlFor="mobility-route-filter"
            className="text-sm font-bold text-gray-700"
          >
            Filter this route list
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500"
              aria-hidden="true"
            />
            <input
              id="mobility-route-filter"
              value={routeQuery}
              onChange={event => {
                setRouteQuery(event.target.value);
                setShowAllRoutes(false);
              }}
              placeholder="e.g., Bicutan, Guadalupe, PRC"
              className="min-h-11 w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-20 text-sm text-gray-950"
            />
            {routeQuery && (
              <button
                type="button"
                onClick={() => {
                  setRouteQuery('');
                  setShowAllRoutes(false);
                }}
                className="absolute right-1 top-0 min-h-11 rounded-lg px-3 text-xs font-bold text-primary-700 hover:bg-primary-50"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {activeRouteCount} matching record
            {activeRouteCount === 1 ? '' : 's'} in this view.
          </p>
        </div>

        {(routeView === 'bus' || routeView === 'uv-express') && (
          <div className="mt-6">
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              These current route identities are corroborated by two independent
              2026 One Ayala terminal rosters. Operator, fare, schedule, gate
              and complete stop sequence are not frozen here.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCurrentRoutes.map(route => {
                if (route.recordKind !== 'current-service') return null;
                const evidenceSources = routeEvidenceSources(route);

                return (
                  <article
                    key={route.id}
                    className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                      {currentRouteClassLabel(route)}
                    </div>
                    <h3 className="mt-2 break-words text-lg font-extrabold text-gray-950">
                      {route.currentService.routeLabel}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      From {route.currentService.originLabel}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to="/civic-map/one-ayala-terminal"
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        One Ayala terminal
                      </Link>
                    </div>

                    <details className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
                      <summary className="flex min-h-11 cursor-pointer items-center font-bold text-primary-700">
                        Evidence &amp; limits
                      </summary>
                      <p className="mt-2 leading-relaxed">
                        Route identity is corroborated by two 2026 terminal
                        rosters. Operator, fare, schedule, gate and complete stop
                        sequence remain live information.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {evidenceSources.map((source, index) => (
                          <a
                            key={source.id}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                          >
                            Source {index + 1}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {routeView === 'jeepney' && (
          <div className="mt-6">
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              These records reconcile Makati's 2020 city inventory with later
              route evidence. Historical association labels are retained as
              lineage and are not treated as verified current operators.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {visibleJeepneyRoutes.map(route => {
                if (route.recordKind !== 'historical-reconciliation') return null;
                const evidenceSources = routeEvidenceSources(route);

                return (
                  <article
                    key={route.id}
                    className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
                        {jeepneyDispositionLabel(route)}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        2020 city row {route.historical.publishedNo}
                      </span>
                    </div>
                    <h3 className="mt-2 break-words text-lg font-extrabold text-gray-950">
                      {route.historical.from} ↔ {route.historical.to}
                    </h3>
                    <details className="mt-3 text-sm text-gray-600">
                      <summary className="flex min-h-11 cursor-pointer items-center font-bold text-primary-700">
                        Evidence note
                      </summary>
                      <p className="mt-2 leading-relaxed">{route.note}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {evidenceSources.map((source, index) => (
                          <a
                            key={source.id}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                          >
                            Current evidence
                            {evidenceSources.length > 1 ? ' ' + (index + 1) : ''}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {routeView === 'unresolved' && (
          <div className="mt-6">
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              These three 2020 city rows remain in the registry because an exact
              current route match has not been verified. They are not presented
              as current services.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {visibleUnresolvedRoutes.map(route => {
                if (route.recordKind !== 'historical-reconciliation') return null;
                const historicalSource = historicalSourceFor(route);

                return (
                  <article
                    key={route.id}
                    className="min-w-0 rounded-2xl border border-amber-200 bg-white p-5"
                  >
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-amber-800">
                      Current status unresolved
                    </div>
                    <h3 className="mt-2 break-words text-lg font-extrabold text-gray-950">
                      {route.historical.from} ↔ {route.historical.to}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {route.note}
                    </p>
                    <p className="mt-3 text-xs font-bold text-gray-500">
                      2020 city row {route.historical.publishedNo}
                    </p>
                    {historicalSource && (
                      <a
                        href={historicalSource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Historical city source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {activeRouteCount === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            No route record in this view matches “{routeQuery}”.
          </div>
        )}

        {activeRouteCount > routeDisplayLimit && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAllRoutes(value => !value)}
              className="brand-btn-secondary min-h-11"
            >
              {showAllRoutes
                ? 'Show fewer'
                : 'Show all ' + activeRouteCount + ' records'}
            </button>
            <span className="text-sm text-gray-500">
              Showing {showAllRoutes ? activeRouteCount : routeDisplayLimit} of{' '}
              {activeRouteCount}
            </span>
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Common trips</div>
        <Heading level={2}>{t('corePages.mobility.pairs')}</Heading>
        <p className="max-w-3xl text-sm text-gray-600">
          These links open live directions rather than prescribing a fixed route,
          so current traffic and available modes can be considered.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commonTrips.map(trip => {
            const Icon = trip.icon;
            return (
              <a
                key={trip.label}
                href={mapsDirections(
                  trip.destination.mapQuery,
                  'transit',
                  trip.origin.mapQuery,
                  false
                )}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <Icon className="h-5 w-5 text-primary-700" />
                <h3 className="mt-3 font-extrabold text-gray-950">{trip.label}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Live directions <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Ride-hailing</div>
        <Heading level={2}>{t('corePages.mobility.ride')}</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
          {mobilityExternalResources.map(resource => (
            <a
              key={resource.id}
              href={resource.primaryUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <Car className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">
                {resource.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-gray-700">
                {resource.displayType}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {resource.summary}
              </p>
            </a>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.google.com/maps/search/?api=1&query=bike%20parking%20in%20Makati%20City"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <Bike className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Cycling</h2>
            <p className="text-sm text-gray-600 mt-1">Find bike parking and cycling destinations.</p>
          </a>
          <Link
            to="/estates"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <Building2 className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Areas &amp; districts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Put transport connections in the context of Makati&apos;s districts, estates and villages.
            </p>
          </Link>
          <a
            href="#transport-anchors"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <MapPin className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Transport terminals</h2>
            <p className="text-sm text-gray-600 mt-1">Browse verified stations and terminals already indexed by BetterMakati.</p>
          </a>
        </div>
      </Section>
    </>
  );
}
