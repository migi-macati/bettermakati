import { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Crosshair, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import {
  civicAssetTypeLabels,
  nearbyVerifiedPlaces,
  type PlacePoint,
} from '../../data/placeRegistry';

type GeolocationState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable';

interface NearMePlacesProps {
  title?: string;
  description?: string;
  limit?: number;
  initialDistanceKm?: number;
  fallbackDistanceKm?: number;
  linkForPlace?: (placeId: string) => string;
  className?: string;
}

const distanceLabel = (distanceKm: number) => {
  const meters = distanceKm * 1000;
  if (meters < 100) {
    return 'about ' + Math.max(10, Math.round(meters / 10) * 10) + ' m away';
  }
  return 'about ' + Math.round(meters / 50) * 50 + ' m away';
};

export default function NearMePlaces({
  title = 'Find civic places near me',
  description = 'Use your device location to see verified BetterMakati places nearby.',
  limit = 5,
  initialDistanceKm = 0.25,
  fallbackDistanceKm = 0.5,
  linkForPlace = placeId => '/civic-map/' + placeId,
  className = '',
}: NearMePlacesProps) {
  const [geoState, setGeoState] = useState<GeolocationState>('idle');
  const [point, setPoint] = useState<PlacePoint | null>(null);
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(null);

  const results = useMemo(
    () =>
      point
        ? nearbyVerifiedPlaces(point, {
            initialDistanceKm,
            fallbackDistanceKm,
            limit,
          })
        : [],
    [point, initialDistanceKm, fallbackDistanceKm, limit]
  );

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoState('unavailable');
      return;
    }

    setGeoState('requesting');
    navigator.geolocation.getCurrentPosition(
      position => {
        setPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          role: 'representative',
        });
        setAccuracyMeters(
          Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null
        );
        setGeoState('granted');
      },
      error => {
        setPoint(null);
        setAccuracyMeters(null);
        setGeoState(
          error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return (
    <div
      className={
        'rounded-2xl border border-primary-100 bg-white p-5 md:p-6 ' + className
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            <MapPin className="h-4 w-4" />
            Near me
          </div>
          <h3 className="mt-2 text-xl font-extrabold text-gray-950">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Location is requested only when you tap the button. It is used in your browser to find nearby registry records.
          </p>
        </div>

        <button
          type="button"
          onClick={locate}
          disabled={geoState === 'requesting'}
          className="brand-btn-primary shrink-0 disabled:cursor-wait disabled:opacity-70"
        >
          <Crosshair className="h-4 w-4" />
          {geoState === 'requesting'
            ? 'Finding places…'
            : point
              ? 'Refresh my location'
              : 'Use my location'}
        </button>
      </div>

      {(geoState === 'denied' || geoState === 'unavailable') && (
        <div className="mt-4 flex gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-950">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            {geoState === 'denied'
              ? 'Location permission was not granted. You can still browse or search the civic registry.'
              : 'Current location is unavailable. You can still browse or search the civic registry.'}
          </p>
        </div>
      )}

      {point && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-gray-500">
            {accuracyMeters !== null
              ? 'Device accuracy: about ' + Math.round(accuracyMeters) + ' m'
              : 'Device location received'}
          </div>

          {results.length > 0 ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {results.map(({ place, distanceKm }) => (
                <Link
                  key={place.id}
                  to={linkForPlace(place.id)}
                  className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300 hover:shadow-sm"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {civicAssetTypeLabels[place.primaryCategory]}
                  </div>
                  <div className="mt-1 font-extrabold text-gray-950">
                    {place.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {distanceLabel(distanceKm)}
                  </div>
                  {place.location.barangays.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {place.location.barangays.join(' · ')}
                    </div>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                    Open place <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 text-sm text-gray-600">
              No verified BetterMakati place was found within {Math.round(
                fallbackDistanceKm * 1000
              )} m of this point.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
