import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const routeChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        let id = hash.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {
          /* Keep malformed fragments harmless. */
        }

        const target = document.getElementById(id);
        target?.scrollIntoView({ block: 'start' });

        if (routeChanged && target instanceof HTMLElement) {
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });

          if (!hadTabIndex) {
            target.addEventListener(
              'blur',
              () => target.removeAttribute('tabindex'),
              { once: true }
            );
          }
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (routeChanged)
          document
            .getElementById('main-content')
            ?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
