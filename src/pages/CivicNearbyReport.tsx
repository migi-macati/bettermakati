import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Crosshair,
  MapPin,
  Search,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CivicNearbyReportForm from '../components/civic/CivicNearbyReportForm';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssetTypeLabels,
  placeRegistry,
  placesWithinDistance,
  type PlacePoint,
  type PlaceRegistryRecord,
} from '../data/placeRegistry';

type GeolocationState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable';

type LocationSource = 'device' | 'manual-pin' | 'place-search' | 'none';
type EntityMatchState = 'confirmed-entity' | 'location-only' | 'unresolved';

interface ReportLocationState {
  source: LocationSource;
  point: PlacePoint | null;
  accuracyMeters: number | null;
}

const eligibleNearbyPlaces = placeRegistry.filter(place => {
  if (place.entityKind !== 'place') return false;
  if (place.verification.status !== 'verified') return false;
  if (!entity.location.point) return false;
  if (place.lifecycle.status === 'closed' || place.lifecycle.status === 'future') return false;
  if (place.location.relationToMakati === 'serves-makati-outside') return false;
  return true;
});

const searchablePlaces = placeRegistry
  .filter(place =>
    place.entityKind === 'place'
      ? place.verification.status === 'verified'
      : place.verification.status !== 'needs-verification'
  )
  .filter(place => place.lifecycle.status !== 'closed' && place.lifecycle.status !== 'future')
  .filter(place => place.location.relationToMakati !== 'serves-makati-outside')
  .sort((a, b) => a.name.localeCompare(b.name));

const normalizeSearch = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase('en-PH')
    .replace(/\s+/g, ' ');

const searchTextForPlace = (place: PlaceRegistryRecord) =>
  normalizeSearch(
    [
      place.name,
      place.summary,
      ...place.location.barangays,
      place.location.address,
      ...(place.aliases?.map(alias => alias.name) ?? []),
      ...(place.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
  );

const distanceLabel = (distanceKm: number) => {
  const meters = distanceKm * 1000;
  if (meters < 100) return 'about ' + Math.max(10, Math.round(meters / 10) * 10) + ' m away';
  return 'about ' + Math.round(meters / 50) * 50 + ' m away';
};

const pointLabel = (point: PlacePoint | null) => {
  if (!point) return '';
  return point.lat.toFixed(5) + ', ' + point.lng.toFixed(5);
};

export default function CivicNearbyReport() {
  const [geoState, setGeoState] = useState<GeolocationState>('idle');
  const [location, setLocation] = useState<ReportLocationState>({
    source: 'none',
    point: null,
    accuracyMeters: null,
  });
  const [matchState, setMatchState] = useState<EntityMatchState>('unresolved');
  const [selectedEntity, setSelectedEntity] = useState<PlaceRegistryRecord | null>(null);
  const [query, setQuery] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [manualError, setManualError] = useState('');
  const { barangaySlug, isExplicitScope } = useBarangayScope();
  const mapHref = withBarangayScope(
    '/civic-map',
    isExplicitScope ? barangaySlug : undefined
  );

  const nearbyCandidates = useMemo(() => {
    if (!location.point) return [];

    const initial = placesWithinDistance(
      location.point,
      0.25,
      eligibleNearbyPlaces
    );
    const matches =
      initial.length > 0
        ? initial
        : placesWithinDistance(location.point, 0.5, eligibleNearbyPlaces);

    return matches.slice(0, 5);
  }, [location.point]);

  const searchResults = useMemo(() => {
    const needle = normalizeSearch(query);
    if (!needle) return [];

    return searchablePlaces
      .filter(place => searchTextForPlace(place).includes(needle))
      .slice(0, 8);
  }, [query]);

  const resetMatch = () => {
    setSelectedEntity(null);
    setMatchState('unresolved');
  };

  const useCurrentLocation = () => {
    resetMatch();
    setManualError('');

    if (!('geolocation' in navigator)) {
      setGeoState('unavailable');
      return;
    }

    setGeoState('requesting');
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          source: 'device',
          point: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            role: 'representative',
          },
          accuracyMeters: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
        });
        setGeoState('granted');
      },
      error => {
        setGeoState(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const useManualCoordinates = () => {
    resetMatch();
    const lat = Number(manualLat);
    const lng = Number(manualLng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setManualError('Enter valid latitude and longitude coordinates.');
      return;
    }

    setLocation({
      source: 'manual-pin',
      point: { lat, lng, role: 'representative' },
      accuracyMeters: null,
    });
    setManualError('');
  };

  const chooseEntity = (entity: PlaceRegistryRecord) => {
    setSelectedEntity(entity);
    setMatchState('confirmed-entity');
    setLocation(current => ({
      source: current.source === 'none' ? 'place-search' : current.source,
      point: current.point ?? entity.location.point ?? null,
      accuracyMeters: current.accuracyMeters,
    }));
  };

  const chooseLocationOnly = () => {
    setSelectedEntity(null);
    setMatchState('location-only');
  };

  const accuracyMessage =
    location.accuracyMeters === null
      ? null
      : location.accuracyMeters > 250
        ? 'Your location is broad. Treat nearby places as suggestions and use search or manual coordinates if needed.'
        : location.accuracyMeters > 100
          ? 'Your location is approximate. Confirm the affected place before continuing.'
          : null;

  return (
    <>
      <SEO
        title="Report something near me | Civic Map"
        description="Use your location or search BetterMakati places, infrastructure segments or routes to identify where a non-emergency civic problem is happening."
        keywords="Makati report problem near me, civic issue location, Makati place finder"
      />

      <Section className="bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-7"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Civic Map', href: mapHref },
            {
              label: 'Report something near me',
              href: withBarangayScope(
                '/civic-map/report',
                isExplicitScope ? barangaySlug : undefined
              ),
            },
          ]}
        />

        <div className="max-w-4xl">
          <div className="section-eyebrow">Civic Map</div>
          <Heading>Where is the problem?</Heading>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-700">
            Use your location, search the civic registry or enter a location manually. Nearby suggestions are limited to verified physical places; segments and routes must be selected deliberately from search.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={geoState === 'requesting'}
            className="rounded-2xl border border-primary-200 bg-white p-5 text-left transition hover:border-primary-400 disabled:cursor-wait disabled:opacity-70"
          >
            <Crosshair className="h-6 w-6 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Use my current location</div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              Your browser asks for location only after you tap this button.
            </p>
          </button>

          <a
            href="#search-place"
            className="rounded-2xl border border-primary-200 bg-white p-5 transition hover:border-primary-400"
          >
            <Search className="h-6 w-6 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Search the civic registry</div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              Find a place, street segment or route without sharing device location.
            </p>
          </a>

          <a
            href="#manual-location"
            className="rounded-2xl border border-primary-200 bg-white p-5 transition hover:border-primary-400"
          >
            <MapPin className="h-6 w-6 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">Choose the location manually</div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              Enter a map coordinate when current location is unavailable or inaccurate.
            </p>
          </a>
        </div>

        {geoState === 'requesting' && (
          <p role="status" className="mt-4 text-sm text-gray-600">
            Getting your location…
          </p>
        )}
        {(geoState === 'denied' || geoState === 'unavailable') && (
          <div className="mt-4 flex gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              {geoState === 'denied'
                ? 'Location permission was not granted. Search for a place or choose the location manually instead.'
                : 'Current location is unavailable. Search for a place or choose the location manually instead.'}
            </p>
          </div>
        )}
        {accuracyMessage && (
          <div className="mt-4 flex gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{accuracyMessage}</p>
          </div>
        )}
      </Section>

      {location.point && (
        <Section className="bg-[#f5f8f2]">
          <div className="section-eyebrow">Nearby places</div>
          <Heading level={2}>Is it one of these physical places?</Heading>
          <p className="mt-2 text-sm text-gray-600">
            Location: {pointLabel(location.point)}
            {location.accuracyMeters !== null
              ? ' · accuracy about ' + Math.round(location.accuracyMeters) + ' m'
              : ''}
          </p>

          {nearbyCandidates.length > 0 ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {nearbyCandidates.map(({ place, distanceKm }) => {
                const selected = selectedEntity?.id === entity.id;
                return (
                  <button
                    key={entity.id}
                    type="button"
                    onClick={() => chooseEntity(place)}
                    className={
                      selected
                        ? 'rounded-2xl border border-primary-500 bg-primary-50 p-5 text-left ring-2 ring-primary-100'
                        : 'rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-primary-300'
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {civicAssetTypeLabels[place.primaryCategory]}
                      </span>
                      {selected && <CheckCircle2 className="h-5 w-5 text-primary-700" />}
                    </div>
                    <div className="mt-2 font-extrabold text-gray-950">{place.name}</div>
                    <div className="mt-1 text-xs text-gray-500">{distanceLabel(distanceKm)}</div>
                    {place.location.barangays.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {place.location.barangays.join(' · ')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
              No verified BetterMakati place was found within 500 m of this point.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={chooseLocationOnly}
              className={
                matchState === 'location-only'
                  ? 'brand-btn-primary'
                  : 'brand-btn-secondary'
              }
            >
              None of these — report this location
            </button>
            <a href="#search-place" className="brand-btn-secondary">
              Search another place
            </a>
          </div>
        </Section>
      )}

      <Section className="bg-white" id="search-place">
        <div className="section-eyebrow">Place search</div>
        <Heading level={2}>Search for a place or street</Heading>

        <label className="relative mt-5 block max-w-3xl">
          <span className="sr-only">Search verified places</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              resetMatch();
            }}
            placeholder="e.g., Poblacion Health Center, Makati Avenue, park"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4"
          />
        </label>

        {query.trim() && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {searchResults.map(place => {
              const selected = selectedEntity?.id === entity.id;
              return (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => chooseEntity(place)}
                  className={
                    selected
                      ? 'rounded-xl border border-primary-500 bg-primary-50 p-4 text-left ring-2 ring-primary-100'
                      : 'rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary-300'
                  }
                >
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {civicAssetTypeLabels[place.primaryCategory]}
                  </div>
                  <div className="mt-1 font-extrabold text-gray-950">{place.name}</div>
                  {place.location.barangays.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600">
                      {place.location.barangays.join(' · ')}
                    </div>
                  )}
                </button>
              );
            })}
            {searchResults.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600 md:col-span-2">
                No verified place matches that search.
              </div>
            )}
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]" id="manual-location">
        <div className="section-eyebrow">Manual location</div>
        <Heading level={2}>Enter a map coordinate</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          This is useful when device location is unavailable or when you need to identify a different point.
        </p>

        <div className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2">
          <label className="form-field">
            <span>Latitude</span>
            <input
              inputMode="decimal"
              value={manualLat}
              onChange={event => setManualLat(event.target.value)}
              placeholder="14.5652"
            />
          </label>
          <label className="form-field">
            <span>Longitude</span>
            <input
              inputMode="decimal"
              value={manualLng}
              onChange={event => setManualLng(event.target.value)}
              placeholder="121.0278"
            />
          </label>
        </div>

        {manualError && (
          <p role="alert" className="mt-3 text-sm font-semibold text-error-700">
            {manualError}
          </p>
        )}

        <button
          type="button"
          onClick={useManualCoordinates}
          className="brand-btn-primary mt-4"
        >
          Find nearby places
        </button>
      </Section>

      {matchState !== 'unresolved' && location.point && (
        <Section className="bg-white" id="report-details">
          <div className="mb-6 max-w-3xl rounded-2xl border border-primary-200 bg-primary-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary-700" />
              <div>
                <div className="font-extrabold text-gray-950">Location selected</div>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {matchState === 'confirmed-entity' && selectedEntity
                    ? selectedEntity.name
                    : 'Location only — no canonical place selected.'}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl">
            <CivicNearbyReportForm
              key={(selectedEntity?.id ?? 'location-only') + ':' + pointLabel(location.point)}
              entity={matchState === 'confirmed-entity' ? selectedEntity : null}
              point={location.point}
            />
          </div>

          <Link to={mapHref} className="mt-5 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2">
            Back to Civic Map
          </Link>
        </Section>
      )}
    </>
  );
}
