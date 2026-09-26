import { useEffect, useState } from 'react';

/** Keep manual pause, hover, keyboard focus and reduced motion independent. */
export default function useCarousel(
  count: number,
  interval: number,
  startPaused = true
) {
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(startPaused);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const index = count ? position % count : 0;
  const rotating =
    count > 1 && !paused && !hovered && !focused && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setPosition(current => (current + 1) % count),
      interval
    );
    return () => window.clearInterval(timer);
  }, [count, interval, rotating]);

  const move = (direction: number) => {
    setPaused(true);
    if (count) setPosition(current => (current + direction + count) % count);
  };

  const goTo = (nextIndex: number) => {
    setPaused(true);
    if (count) setPosition(((nextIndex % count) + count) % count);
  };

  return {
    index,
    paused,
    reducedMotion,
    rotating,
    move,
    goTo,
    setPaused,
    interactions: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: React.FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      },
    },
  };
}
