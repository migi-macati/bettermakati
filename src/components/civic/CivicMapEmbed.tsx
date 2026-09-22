import { ExternalLink, MapPinned } from 'lucide-react';

export default function CivicMapEmbed({
  lat,
  lng,
  title,
  zoom = 16,
}: {
  lat: number;
  lng: number;
  title: string;
  zoom?: number;
}) {
  const delta = zoom >= 16 ? 0.006 : zoom >= 14 ? 0.018 : 0.045;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',');
  const src =
    'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent(bbox) +
    '&layer=mapnik&marker=' +
    encodeURIComponent(lat + ',' + lng);
  const open =
    'https://www.openstreetmap.org/?mlat=' +
    encodeURIComponent(lat) +
    '&mlon=' +
    encodeURIComponent(lng) +
    '#map=' +
    zoom +
    '/' +
    encodeURIComponent(lat) +
    '/' +
    encodeURIComponent(lng);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <iframe
        title={'Map: ' + title}
        src={src}
        className="h-[320px] w-full border-0 md:h-[400px]"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <p className="px-4 pt-3 text-xs text-gray-600">If the map does not display, open the full map. You can use the reporting form without it.</p>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPinned className="h-4 w-4 text-primary-700" />
          Location map · reports and ratings are separate community records
        </span>
        <a
          href={open}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
        >
          Open full map <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
