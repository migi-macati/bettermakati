import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import type { CityImage } from '../../data/cityImages';

export default function PhotoCarousel({
  images,
  title,
  className = '',
  compact = false,
}: {
  images: CityImage[];
  title?: string;
  className?: string;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (paused || images.length < 2) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const timer = window.setInterval(
      () => setIndex(current => (current + 1) % images.length),
      6500
    );
    return () => window.clearInterval(timer);
  }, [images.length, paused]);

  if (!images.length) return null;

  const image = images[index];
  const previous = () =>
    setIndex(current => (current - 1 + images.length) % images.length);
  const next = () => setIndex(current => (current + 1) % images.length);

  return (
    <figure
      className={'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ' + className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className={'relative overflow-hidden bg-gray-100 ' + (compact ? 'aspect-[2.25/1]' : 'aspect-[16/9]')}>
        {failed[index] ? (
          <div className="grid h-full place-items-center text-gray-500">
            <div className="text-center">
              <Camera className="mx-auto h-7 w-7" />
              <a
                href={image.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-sm font-bold text-primary-700 underline underline-offset-2"
              >
                View photo
              </a>
            </div>
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(current => ({ ...current, [index]: true }))}
            className="h-full w-full object-cover transition-opacity duration-300"
            style={{ objectPosition: image.objectPosition ?? '50% 50%' }}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 pb-4 pt-10 text-white">
          {title && <div className="text-xs font-bold uppercase tracking-[0.08em] text-white/75">{title}</div>}
          <div className="font-extrabold">{image.title}</div>
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-[11px] leading-relaxed text-gray-500">
        <span>
          <a
            href={image.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary-700 underline underline-offset-2"
          >
            {image.credit}
          </a>
          {' · '}
          {image.licenseUrl ? (
            <a
              href={image.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              {image.license}
            </a>
          ) : (
            image.license
          )}
          {' · cropped'}
        </span>
        {images.length > 1 && (
          <span>{index + 1} / {images.length}</span>
        )}
      </figcaption>
    </figure>
  );
}
