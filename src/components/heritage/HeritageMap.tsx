import { ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { placeRegistryById } from '../../data/placeRegistry';

const mercatorY = (lat: number) => {
  const radians = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
};

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

          return (
            <Link
              key={place.id}
              to={'/civic-map/' + place.id}
              aria-label={'Open ' + place.name}
              className="group absolute grid h-11 min-w-11 -translate-x-1/2 -translate-y-full place-items-end"
              style={{ left: position.x + '%', top: position.y + '%' }}
            >
              <span className="grid h-8 min-w-8 place-items-center rounded-full border-2 border-white bg-primary-800 px-2 text-xs font-extrabold text-white shadow-md transition group-hover:bg-secondary-600">
                {routeIndex >= 0 ? routeIndex + 1 : <MapPin className="h-4 w-4" aria-hidden="true" />}
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden max-w-44 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-950/90 px-2 py-1 text-[11px] font-bold text-white shadow-sm group-hover:block group-focus:block">
                {place.name}
              </span>
            </Link>
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
