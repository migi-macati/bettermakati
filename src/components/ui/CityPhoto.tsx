import { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';

const source =
  'https://commons.wikimedia.org/wiki/File:Makati_City_Skyline_from_Guadalupe,_Apr_2025.jpg';
const image =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Makati_City_Skyline_from_Guadalupe%2C_Apr_2025.jpg/960px-Makati_City_Skyline_from_Guadalupe%2C_Apr_2025.jpg';

/** A real city photograph, with attribution retained beside every use. */
export default function CityPhoto({
  priority = false,
}: {
  priority?: boolean;
}) {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
      {unavailable ? (
        <div className="flex aspect-[2.4] items-center justify-center gap-3 bg-primary-50 text-primary-800">
          <Camera aria-hidden="true" className="h-6 w-6" />
          <a
            href={source}
            className="font-semibold underline underline-offset-4"
          >
            View Makati from Guadalupe
          </a>
        </div>
      ) : (
        <img
          src={image}
          alt="Makati’s towers rising above trees and low-rise neighborhoods, viewed from Guadalupe in April 2025."
          width={960}
          height={723}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setUnavailable(true)}
          className="aspect-[2.4] w-full object-cover object-[50%_58%]"
        />
      )}
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-xs leading-relaxed text-gray-600">
        <span className="inline-flex items-center gap-1.5 font-semibold text-primary-800">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Makati from
          Guadalupe · 2025
        </span>
        <span>
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Ralff Nestor Nacor
          </a>{' '}
          ·{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            CC BY-SA 4.0
          </a>{' '}
          · cropped
        </span>
      </figcaption>
    </figure>
  );
}
