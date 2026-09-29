import { Fragment } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { placeRegistryById } from '../../data/placeRegistry';

const mercatorY = (lat: number) => {
  const radians = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
};

const denseMarkerOffsetById: Record<string, { x: number; y: number }> = {
  'museo-ng-makati': { x: 0, y: -30 },
  'plaza-cristo-rey': { x: -30, y: 22 },
  'sts-peter-and-paul-parish-church': { x: 30, y: 22 },
};

const denseMarkerIds = Object.keys(denseMarkerOffsetById);

export default function HeritageMap({
  placeIds,
  pathPlaceIds = [],
  title = 'Makati heritage map',
}: {
  placeIds: string[];
  pathPlaceIds?: string[];
  title?: string;
}) {
  const places = placeIds.flatMap(placeId => {
    const place = placeRegistryById.get(placeId);
    return place?.location.point ? [place] : [];
  });

  if (!places.length) return null;

  const lngs = places.map(place => place.location.point!.lng);
  const ys = places.map(place => mercatorY(place.location.point!.lat));
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const lngSpan = Math.max(maxLng - minLng, 0.004);
  const ySpan = Math.max(maxY - minY, 0.004 * Math.PI / 180);
  const paddedMinLng = minLng - lngSpan * 0.14;
  const paddedMaxLng = maxLng + lngSpan * 0.14;
  const paddedMinY = minY - ySpan * 0.14;
  const paddedMaxY = maxY + ySpan * 0.14;

  const inverseMercatorY = (y: number) =>
    (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180 / Math.PI;

  const south = inverseMercatorY(paddedMinY);
  const north = inverseMercatorY(paddedMaxY);
  const bbox = [paddedMinLng, south, paddedMaxLng, north].join(',');
  const mapSrc =
    'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent(bbox) +
    '&layer=mapnik';

  const centerLat = (south + north) / 2;
  const centerLng = (paddedMinLng + paddedMaxLng) / 2;
  const openMap =
    'https://www.openstreetmap.org/#map=14/' +
    encodeURIComponent(centerLat.toFixed(5)) +
    '/' +
    encodeURIComponent(centerLng.toFixed(5));

  const positionFor = (placeId: string) => {
    const place = placeRegistryById.get(placeId);
    const point = place?.location.point;
    if (!point) return null;

    const x =
      ((point.lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * 100;
    const y =
      100 -
      ((mercatorY(point.lat) - paddedMinY) / (paddedMaxY - paddedMinY)) * 100;

    return { x, y, place };
  };

  const pathPoints = pathPlaceIds.flatMap(placeId => {
    const position = positionFor(placeId);
    return position ? [position] : [];
  });

  const denseMarkerPositions = denseMarkerIds.flatMap(placeId => {
    const position = positionFor(placeId);
    return position ? [{ placeId, x: position.x, y: position.y }] : [];
  });
  const useDenseMarkerOffsets = denseMarkerPositions.some((left, index) =>
    denseMarkerPositions.slice(index + 1).some(
      right =>
        Math.abs(left.x - right.x) < 6 &&
        Math.abs(left.y - right.y) < 6
    )
  );

  return (
    <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
      <div className="relative aspect-[16/9] min-h-[320px] overflow-hidden bg-gray-100">
        <iframe
          title={title}
          src={mapSrc}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          aria-hidden="true"
        />

        {pathPoints.length > 1 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={pathPoints.map(point => point.x + ',' + point.y).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              className="text-secondary-600"
            />
          </svg>
        )}

        {places.map(place => {
          const position = positionFor(place.id);
          if (!position) return null;
          const routeIndex = pathPlaceIds.indexOf(place.id);
          const markerOffset =
            useDenseMarkerOffsets && denseMarkerOffsetById[place.id]
              ? denseMarkerOffsetById[place.id]
              : { x: 0, y: 0 };
          const isOffset = markerOffset.x !== 0 || markerOffset.y !== 0;
          const leaderLength = Math.hypot(markerOffset.x, markerOffset.y);
          const leaderAngle =
            Math.atan2(markerOffset.y, markerOffset.x) * 180 / Math.PI;

          return (
            <Fragment key={place.id}>
              {isOffset && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 h-px bg-primary-800/50"
                    style={{
                      left: position.x + '%',
                      top: position.y + '%',
                      width: leaderLength,
                      transform: 'rotate(' + leaderAngle + 'deg)',
                      transformOrigin: '0 50%',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-primary-800 shadow-sm"
                    style={{ left: position.x + '%', top: position.y + '%' }}
                  />
                </>
              )}
              <Link
                to={'/civic-map/' + place.id}
                aria-label={'Open ' + place.name}
                className="group absolute z-20 grid h-11 w-11 place-items-center"
                style={{
                  left: position.x + '%',
                  top: position.y + '%',
                  transform:
                    'translate(calc(-50% + ' +
                    markerOffset.x +
                    'px), calc(-50% + ' +
                    markerOffset.y +
                    'px))',
                }}
              >
                <span className="grid h-8 min-w-8 place-items-center rounded-full border-2 border-white bg-primary-800 px-2 text-xs font-extrabold text-white shadow-md transition group-hover:bg-secondary-600">
                  {routeIndex >= 0 ? routeIndex + 1 : <MapPin className="h-4 w-4" aria-hidden="true" />}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden max-w-44 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-950/90 px-2 py-1 text-[11px] font-bold text-white shadow-sm group-hover:block group-focus:block">
                  {place.name}
                </span>
              </Link>
            </Fragment>
          );
        })}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-xs text-gray-600">
        <span>
          {places.length} canonical heritage place{places.length === 1 ? '' : 's'}
          {pathPoints.length > 1 ? ' · numbered in route order' : ''}
        </span>
        <a
          href={openMap}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
        >
          Open full map <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </figcaption>
    </figure>
  );
}
