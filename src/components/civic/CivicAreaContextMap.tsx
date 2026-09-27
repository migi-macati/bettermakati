import { useMemo, useState } from 'react';
import { Layers3, MapPinned, Train } from 'lucide-react';
import { Link } from 'react-router';
import {
  boundsForAreaGeometry,
  civicAreaGeometryArtifacts,
  type CivicAreaRenderableGeometry,
  type GeoPosition,
} from '../../data/areaGeometry';
import { civicAreaById } from '../../data/areaOrganizationRegistry';
import {
  boundsForMobilityRouteGeometry,
  mobilityRouteGeometryArtifacts,
  type MobilityGeometryPosition,
  type MobilityRenderableRouteGeometry,
} from '../../data/mobilityRouteGeometry';
import { mobilityServiceById } from '../../data/mobilitySystems';
import { placeRegistryById } from '../../data/placeRegistry';

interface MapBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

const mercatorY = (lat: number) => {
  const radians = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
};

const paddedBounds = (bounds: MapBounds): MapBounds => {
  const width = bounds.east - bounds.west;
  const height = bounds.north - bounds.south;
  const lngPad = Math.max(width * 0.12, 0.0018);
  const latPad = Math.max(height * 0.12, 0.0018);

  return {
    west: bounds.west - lngPad,
    south: bounds.south - latPad,
    east: bounds.east + lngPad,
    north: bounds.north + latPad,
  };
};

const combinedGeometryBounds = () => {
  const areaBounds = civicAreaGeometryArtifacts
    .map(artifact => boundsForAreaGeometry(artifact.geometry))
    .filter((item): item is MapBounds => Boolean(item));
  const mobilityBounds = mobilityRouteGeometryArtifacts
    .map(artifact => boundsForMobilityRouteGeometry(artifact.geometry))
    .filter((item): item is MapBounds => Boolean(item));
  const bounds = [...areaBounds, ...mobilityBounds];

  if (!bounds.length) return undefined;

  return paddedBounds({
    west: Math.min(...bounds.map(item => item.west)),
    south: Math.min(...bounds.map(item => item.south)),
    east: Math.max(...bounds.map(item => item.east)),
    north: Math.max(...bounds.map(item => item.north)),
  });
};

const projectPosition = (
  [lng, lat]: GeoPosition | MobilityGeometryPosition,
  bounds: MapBounds
): [number, number] => {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 1000;
  const mercatorNorth = mercatorY(bounds.north);
  const mercatorSouth = mercatorY(bounds.south);
  const y =
    ((mercatorNorth - mercatorY(lat)) /
      (mercatorNorth - mercatorSouth)) *
    1000;

  return [x, y];
};

const geometryPath = (
  geometry: CivicAreaRenderableGeometry,
  bounds: MapBounds
) => {
  const polygons =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.coordinates;

  return polygons
    .flatMap(polygon =>
      polygon.map(ring => {
        const projected = ring.map(position =>
          projectPosition(position, bounds)
        );
        if (!projected.length) return '';

        const [firstX, firstY] = projected[0];
        return (
          'M ' +
          firstX.toFixed(2) +
          ' ' +
          firstY.toFixed(2) +
          ' ' +
          projected
            .slice(1)
            .map(
              ([x, y]) => 'L ' + x.toFixed(2) + ' ' + y.toFixed(2)
            )
            .join(' ') +
          ' Z'
        );
      })
    )
    .join(' ');
};

const lineGeometryPath = (
  geometry: MobilityRenderableRouteGeometry,
  bounds: MapBounds
) => {
  const lines =
    geometry.type === 'LineString'
      ? [geometry.coordinates]
      : geometry.coordinates;

  return lines
    .map(line => {
      const projected = line.map(position =>
        projectPosition(position, bounds)
      );
      if (!projected.length) return '';

      const [firstX, firstY] = projected[0];
      return (
        'M ' +
        firstX.toFixed(2) +
        ' ' +
        firstY.toFixed(2) +
        ' ' +
        projected
          .slice(1)
          .map(([x, y]) => 'L ' + x.toFixed(2) + ' ' + y.toFixed(2))
          .join(' ')
      );
    })
    .join(' ');
};

export default function CivicAreaContextMap() {
  const [showAreas, setShowAreas] = useState(true);
  const [showMobility, setShowMobility] = useState(true);

  const mappedAreas = useMemo(
    () =>
      civicAreaGeometryArtifacts.flatMap(artifact => {
        const area = civicAreaById.get(artifact.areaId);
        return area ? [{ artifact, area }] : [];
      }),
    []
  );

  const mappedMobility = useMemo(
    () =>
      mobilityRouteGeometryArtifacts.flatMap(artifact => {
        if (artifact.ownerType !== 'service') return [];
        const service = mobilityServiceById.get(artifact.ownerId);
        if (!service) return [];
        return [{ artifact, service }];
      }),
    []
  );

  const bounds = useMemo(() => combinedGeometryBounds(), []);

  if (!bounds || (!mappedAreas.length && !mappedMobility.length)) return null;

  const bbox = [
    bounds.west,
    bounds.south,
    bounds.east,
    bounds.north,
  ].join(',');
  const src =
    'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent(bbox) +
    '&layer=mapnik';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
            Map context
          </div>
          <div className="mt-0.5 font-extrabold text-gray-950">
            Civic layers
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Civic Map context layers"
        >
          <button
            type="button"
            onClick={() => setShowAreas(value => !value)}
            aria-pressed={showAreas}
            className={
              showAreas
                ? 'inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-bold text-white'
                : 'inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700'
            }
          >
            <Layers3 className="h-4 w-4" aria-hidden="true" />
            Districts &amp; estates
          </button>
          <button
            type="button"
            onClick={() => setShowMobility(value => !value)}
            aria-pressed={showMobility}
            className={
              showMobility
                ? 'inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary-500 px-4 py-2 text-sm font-bold text-primary-950'
                : 'inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700'
            }
          >
            <Train className="h-4 w-4" aria-hidden="true" />
            MRT-3 alignment
          </button>
        </div>
      </div>

      <div className="relative">
        <iframe
          title="Makati Civic Map context"
          src={src}
          className="h-[360px] w-full border-0 md:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-[360px] w-full md:h-[420px]"
          aria-label="Sourced civic context layers"
          role="img"
        >
          {showAreas &&
            mappedAreas.map(({ artifact, area }) => (
              <path
                key={artifact.id}
                d={geometryPath(artifact.geometry, bounds)}
                fillRule="evenodd"
                className="fill-primary-500/15 stroke-primary-800"
                strokeWidth="3"
                strokeDasharray={
                  artifact.kind === 'approximate-boundary'
                    ? '10 7'
                    : undefined
                }
                vectorEffect="non-scaling-stroke"
                aria-label={area.name + ' approximate boundary'}
              />
            ))}

          {showMobility &&
            mappedMobility.map(({ artifact, service }) => (
              <path
                key={artifact.id}
                d={lineGeometryPath(artifact.geometry, bounds)}
                fill="none"
                className="stroke-secondary-600"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                aria-label={service.name + ' mapped reference alignment'}
              />
            ))}
        </svg>
      </div>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600">
          {mappedAreas.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
              <span
                className="h-2.5 w-5 rounded-sm border border-dashed border-primary-800 bg-primary-100"
                aria-hidden="true"
              />
              Approximate boundary
            </span>
          )}
          {mappedMobility.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-900">
              <span
                className="h-1 w-5 rounded-full bg-secondary-600"
                aria-hidden="true"
              />
              Mapped reference alignment
            </span>
          )}
        </div>

        {mappedAreas.length > 0 && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {mappedAreas.map(({ artifact, area }) => (
              <Link
                key={artifact.id}
                to={'/estates#area-' + area.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] px-3 py-3 transition hover:border-primary-300"
              >
                <span>
                  <span className="block font-bold text-gray-950">
                    {area.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-600">
                    Approximate boundary
                  </span>
                </span>
                <MapPinned
                  className="h-4 w-4 shrink-0 text-primary-700"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        )}

        {mappedMobility.map(({ artifact, service }) => {
          const stationConnections = service.placeConnections.flatMap(
            connection => {
              if (connection.role !== 'station') return [];
              const place = placeRegistryById.get(connection.placeId);
              return place ? [{ connection, place }] : [];
            }
          );

          return (
            <div
              key={artifact.id}
              className="mt-3 rounded-xl border border-secondary-200 bg-secondary-50/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-secondary-900">
                    Mapped reference alignment
                  </div>
                  <div className="mt-1 font-extrabold text-gray-950">
                    {service.name} in Makati
                  </div>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-600">
                    {artifact.precisionNote}
                  </p>
                </div>
                <Link
                  to="/mobility#transport-anchors"
                  className="inline-flex min-h-11 items-center rounded-xl border border-secondary-300 bg-white px-3 py-2 text-sm font-bold text-primary-800 transition hover:border-secondary-500"
                >
                  MRT-3 context
                </Link>
              </div>

              {stationConnections.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {stationConnections.map(({ connection, place }) => (
                    <Link
                      key={connection.placeId}
                      to={'/civic-map/' + connection.placeId}
                      className="rounded-full border border-secondary-200 bg-white px-3 py-1.5 text-xs font-bold text-primary-800 transition hover:border-secondary-500"
                    >
                      {place.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Areas without sourced geometry are not drawn. Unmapped mobility
          services without published geometry are not drawn either. Geometry-less
          jeepney, bus and UV records remain searchable in the registry without
          invented map lines.
        </p>
      </div>
    </div>
  );
}
