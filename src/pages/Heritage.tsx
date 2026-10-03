import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ExternalLink,
  Footprints,
  Layers3,
  MapPin,
  Route,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { heritageSites } from '../data/visitMakati';
import {
  heritageCollections,
  heritagePlaceCollections,
  heritageWalkingRoutes,
} from '../data/heritageCollections';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { placeRegistryById } from '../data/placeRegistry';
import HeritageMap from '../components/heritage/HeritageMap';

const mapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    lat + ',' + lng
  )}`;

const routeStop = (placeId: string) => {
  const place = placeRegistryById.get(placeId);
  if (!place) return null;
  if (place.location.point) {
    return place.location.point.lat + ',' + place.location.point.lng;
  }
  return place.name + ', Makati City, Philippines';
};

const directionsUrl = (placeIds: string[]) => {
  const stops = placeIds.flatMap(placeId => {
    const stop = routeStop(placeId);
    return stop ? [stop] : [];
  });

  if (stops.length < 2) return '/heritage';

  const [origin, ...rest] = stops;
  const destination = rest.at(-1) || origin;
  const waypoints = rest.slice(0, -1);
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'walking',
  });
  if (waypoints.length) {
    params.set('waypoints', waypoints.join('|'));
  }
  return 'https://www.google.com/maps/dir/?' + params.toString();
};


export default function Heritage() {
  const { t } = useTranslation();
  const [mapSelection, setMapSelection] = useState('all');
  const selectedCollection = heritageCollections.find(
    collection => collection.id === mapSelection
  );
  const mapPlaceIds =
    selectedCollection?.placeIds ?? heritageSites.map(site => site.placeId);
  const mapPathPlaceIds =
    selectedCollection?.kind === 'walking-route'
      ? selectedCollection.placeIds
      : [];

  return (
    <>
      <SEO
        title={t('corePages.heritage.seoTitle')}
        description={t('corePages.heritage.seoDescription')}
      />
      <Section className="bm-heritage-page">
        <div className="section-eyebrow">{t('corePages.heritage.eyebrow')}</div>
        <div className="bm-heritage-intro flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{t('corePages.heritage.title')}</Heading>
            <p className="max-w-3xl text-gray-600">
              {t('corePages.heritage.intro')}
            </p>
          </div>
          <SharePage title={t('corePages.heritage.shareTitle')} />
        </div>
        <LastReviewed
          date="2026-09-27"
          note={t('corePages.heritage.reviewNote')}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/visit" className="brand-btn-primary">
            {t('corePages.heritage.explore')}
          </Link>
          <Link to="/mobility" className="brand-btn-secondary">
            {t('corePages.heritage.mobility')}
          </Link>
        </div>

        <div className="bm-heritage-sites mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {heritageSites.map(site => {
            const place = placeRegistryById.get(site.placeId);
            if (!place) return null;

            const primarySource = place.provenance.sources.find(
              source => source.kind !== 'reference-map'
            );
            const primaryMedia = place.media?.[0];

            return (
              <article
                key={place.id}
                className="bm-heritage-place-card overflow-hidden rounded-2xl border"
              >
                {primaryMedia && (
                  <figure className="bm-heritage-media border-b">
                    <img
                      src={primaryMedia.src}
                      alt={primaryMedia.alt}
                      width={1400}
                      height={933}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="aspect-[16/9] w-full object-cover"
                      style={{ objectPosition: primaryMedia.objectPosition ?? '50% 50%' }}
                    />
                    <figcaption className="bm-heritage-caption flex flex-wrap gap-x-2 gap-y-1 px-4 py-2 text-[11px] leading-relaxed text-gray-500">
                      <span>{primaryMedia.date}</span>
                      <a
                        href={primaryMedia.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary-700 underline underline-offset-2"
                      >
                        {primaryMedia.credit}
                      </a>
                      <a
                        href={primaryMedia.licenseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {primaryMedia.license}
                      </a>
                    </figcaption>
                  </figure>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      {site.category}
                    </span>
                    <span className="text-right text-sm font-bold text-secondary-900">
                      {site.period}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-extrabold text-gray-950">
                    {place.name}
                  </h2>
                  {place.location.address && (
                    <p className="mt-1 text-sm text-gray-500">
                      {place.location.address}
                    </p>
                  )}
                  {(place.aliases?.length ?? 0) > 0 && (
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">
                      {t('corePages.heritage.alsoListed')}: {place.aliases?.map(alias => alias.name).join(' · ')}
                    </p>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    {site.context}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    {place.location.point && (
                      <a
                        href={mapsUrl(place.location.point.lat, place.location.point.lng)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700"
                      >
                        <MapPin className="h-4 w-4" /> {t('corePages.heritage.map')}
                      </a>
                    )}
                    <Link
                      to={'/civic-map/' + place.id}
                      className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700"
                    >
                      {t('corePages.heritage.placeDetails')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    {primarySource && (
                      <a
                        href={primarySource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 text-gray-500 underline underline-offset-2"
                      >
                        {primarySource.label}{' '}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bm-heritage-map-band" id="heritage-map">
        <div className="section-eyebrow">{t('corePages.heritage.mapEyebrow')}</div>
        <div className="bm-heritage-map-layout grid gap-6 xl:grid-cols-[0.68fr_1.32fr] xl:items-start">
          <div>
            <Heading level={2}>{t('corePages.heritage.mapTitle')}</Heading>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
              {t('corePages.heritage.mapIntro')}
            </p>

            <div
              className="mt-5 flex max-h-[360px] flex-wrap gap-2 overflow-y-auto"
              role="group"
              aria-label={t('corePages.heritage.mapView')}
            >
              <button
                type="button"
                onClick={() => setMapSelection('all')}
                aria-pressed={mapSelection === 'all'}
                className={
                  mapSelection === 'all'
                    ? 'min-h-11 rounded-full bg-primary-800 px-3 py-2 text-xs font-bold text-white'
                    : 'min-h-11 rounded-full border border-primary-200 bg-white px-3 py-2 text-xs font-bold text-primary-800 hover:border-primary-400'
                }
              >
                {t('corePages.heritage.allPlaces')}
              </button>
              {heritageCollections.map(collection => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => setMapSelection(collection.id)}
                  aria-pressed={mapSelection === collection.id}
                  className={
                    mapSelection === collection.id
                      ? 'min-h-11 rounded-full bg-primary-800 px-3 py-2 text-xs font-bold text-white'
                      : 'min-h-11 rounded-full border border-primary-200 bg-white px-3 py-2 text-xs font-bold text-primary-800 hover:border-primary-400'
                  }
                >
                  {collection.name}
                </button>
              ))}
            </div>

            {selectedCollection && (
              <div className="bm-heritage-map-context mt-5 rounded-xl border p-4">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
                  {selectedCollection.kind === 'walking-route'
                    ? t('corePages.heritage.walkingRoute')
                    : t('corePages.heritage.thematicCollection')}
                </div>
                <div className="mt-1 font-extrabold text-gray-950">
                  {selectedCollection.name}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {selectedCollection.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
                  <a
                    href={'#collection-' + selectedCollection.id}
                    className="inline-flex min-h-11 items-center text-primary-700 underline underline-offset-2"
                  >
                    {t('corePages.heritage.viewCollection')}
                  </a>
                  <Link
                    to={'/history?collection=' + selectedCollection.id}
                    className="inline-flex min-h-11 items-center text-primary-700 underline underline-offset-2"
                  >
                    {t('corePages.heritage.relatedHistory')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <HeritageMap
            placeIds={mapPlaceIds}
            pathPlaceIds={mapPathPlaceIds}
            title={
              selectedCollection
                ? selectedCollection.name + ' heritage map'
                : t('corePages.heritage.makatiMap')
            }
          />
        </div>
      </Section>

      <Section className="bm-heritage-collections">
        <div className="section-eyebrow">{t('corePages.heritage.collections')}</div>
        <Heading level={2}>{t('corePages.heritage.byTheme')}</Heading>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {heritagePlaceCollections.map(collection => {
            const places = collection.placeIds.flatMap(placeId => {
              const place = placeRegistryById.get(placeId);
              return place ? [place] : [];
            });

            return (
              <article
                key={collection.id}
                id={'collection-' + collection.id}
                className="bm-heritage-collection-card scroll-mt-24 rounded-2xl border p-6"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  <Layers3 className="h-5 w-5" />
                  {t('corePages.heritage.thematicCollection')}
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-gray-950">
                  {collection.name}
                </h3>
                <p className="mt-2 text-sm font-bold leading-relaxed text-secondary-800">
                  {collection.theme}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {collection.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {places.map(place => (
                    <Link
                      key={place.id}
                      to={'/civic-map/' + place.id}
                      className="inline-flex min-h-11 items-center rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-bold text-primary-800 hover:border-primary-400"
                    >
                      {place.name}
                    </Link>
                  ))}
                </div>
                <Link
                  to={'/history?collection=' + collection.id}
                  className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
                >
                  {t('corePages.heritage.relatedHistory')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bm-heritage-routes">
        <div className="section-eyebrow">{t('corePages.heritage.routes')}</div>
        <Heading level={2}>{t('corePages.heritage.routesTitle')}</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          {t('corePages.heritage.routesIntro')}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {heritageWalkingRoutes.map(route => {
            const stops = route.placeIds.flatMap(placeId => {
              const place = placeRegistryById.get(placeId);
              return place ? [{ id: place.id, name: place.name }] : [];
            });

            return (
              <article
                key={route.id}
                id={'collection-' + route.id}
                className="bm-heritage-route-card scroll-mt-24 rounded-2xl border p-6"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  <Footprints className="h-5 w-5" />
                  {t('corePages.heritage.walkingRoute')}
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-gray-950">
                  {route.name}
                </h3>
                <p className="mt-2 text-sm font-bold leading-relaxed text-secondary-800">
                  {route.theme}
                </p>
                <p className="mt-2 text-sm text-gray-600">{route.description}</p>
                <ol className="mt-5 space-y-3">
                  {stops.map((stop, index) => (
                    <li key={stop.id} className="flex items-start gap-3 text-sm">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-50 font-extrabold text-primary-800">
                        {index + 1}
                      </span>
                      <Link
                        to={'/civic-map/' + stop.id}
                        className="inline-flex min-h-11 items-center font-semibold text-gray-800 hover:text-primary-700"
                      >
                        {stop.name}
                      </Link>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={directionsUrl(route.placeIds)}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-primary"
                  >
                    <Route className="h-4 w-4" /> {t('corePages.heritage.openRoute')}
                  </a>
                  <Link
                    to={'/history?collection=' + route.id}
                    className="brand-btn-secondary"
                  >
                    {t('corePages.heritage.relatedHistory')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bm-heritage-handoff-band">
        <div className="bm-heritage-handoff flex flex-col gap-5 rounded-2xl border p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <div className="section-eyebrow">{t('corePages.heritage.deeper')}</div>
            <h2 className="text-2xl font-extrabold text-gray-950">
              {t('corePages.heritage.deeperTitle')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              {t('corePages.heritage.deeperIntro')}
            </p>
          </div>
          <Link to="/history" className="brand-btn-secondary shrink-0">
            {t('corePages.heritage.openHistory')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
