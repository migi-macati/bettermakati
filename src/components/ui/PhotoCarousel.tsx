import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Pause, Play } from 'lucide-react';
import useCarousel from '../../hooks/useCarousel';
import type { CityImage } from '../../data/cityImages';

export default function PhotoCarousel({
  images,
  title,
  className = '',
  compact = false,
  priority = false,
  autoRotate = false,
}: {
  images: CityImage[];
  title?: string;
  className?: string;
  compact?: boolean;
  priority?: boolean;
  autoRotate?: boolean;
}) {
  const carousel = useCarousel(images.length, 6500, !autoRotate);
  const { index } = carousel;
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  if (!images.length) return null;

  const image = images[index];
  const previous = () => carousel.move(-1);
  const next = () => carousel.move(1);
  const hasAttribution = Boolean(image.sourceUrl && image.credit && image.license);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) next();
    else previous();
  };

  return (
    <figure
      className={
        'photo-frame overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ' +
        className
      }
      aria-label={title || 'Makati photographs'}
      aria-roledescription="carousel"
      {...carousel.interactions}
    >
      <div
        className={
          'relative overflow-hidden bg-gray-100 ' +
          (compact ? 'aspect-[2.25/1]' : 'aspect-[16/9]')
        }
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {failed[image.src] ? (
          <div className="grid h-full place-items-center text-gray-500">
            <div className="text-center">
              <Camera className="mx-auto h-7 w-7" />
              {image.sourceUrl ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm font-bold text-primary-700 underline underline-offset-2"
                >
                  View photo
                </a>
              ) : (
                <span className="mt-2 block text-sm font-semibold">Photo unavailable</span>
              )}
            </div>
          </div>
        ) : (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={1400}
            height={933}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() =>
              setFailed(current => ({ ...current, [image.src]: true }))
            }
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
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 pb-4 pt-10 text-white">
          {title && (
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-white/75">
              {title}
            </div>
          )}
          <div className="font-extrabold">{image.title}</div>
        </div>
      </div>

      {(hasAttribution || images.length > 1) && (
        <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 text-xs leading-relaxed text-gray-500">
          {hasAttribution && (
            <span className="mr-auto px-1">
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
          )}

          {images.length > 1 && (
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1">
              <div className="flex items-center" aria-label="Choose photo">
                {images.map((item, photoIndex) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => carousel.goTo(photoIndex)}
                    aria-label={'Show photo ' + (photoIndex + 1) + ' of ' + images.length}
                    aria-current={photoIndex === index ? 'true' : undefined}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-50"
                  >
                    <span
                      className={
                        'block h-2.5 w-2.5 rounded-full transition ' +
                        (photoIndex === index
                          ? 'bg-primary-700'
                          : 'bg-gray-300 hover:bg-primary-300')
                      }
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              <span className="px-1" aria-live={carousel.rotating ? 'off' : 'polite'}>
                {index + 1} / {images.length}
              </span>

              {!carousel.reducedMotion && (
                <button
                  type="button"
                  onClick={() => carousel.setPaused(!carousel.paused)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-semibold text-primary-800 hover:bg-primary-50"
                >
                  {carousel.paused ? (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  )}
                  {carousel.paused ? 'Play photos' : 'Pause photos'}
                </button>
              )}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
