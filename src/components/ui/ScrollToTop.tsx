import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const routeChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    let observer: MutationObserver | undefined;

    const focusHashTarget = () => {
      if (!hash) return false;

      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* Keep malformed fragments harmless. */
      }

      const target = document.getElementById(id);
      if (!(target instanceof HTMLElement)) return false;

      target.scrollIntoView({ block: 'start' });
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

      return true;
    };

    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        if (focusHashTarget()) return;

        const main = document.getElementById('main-content');
        if (!main) return;

        observer = new MutationObserver(() => {
          if (focusHashTarget()) observer?.disconnect();
        });
        observer.observe(main, { childList: true, subtree: true });
        return;
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      if (routeChanged) {
        document
          .getElementById('main-content')
          ?.focus({ preventScroll: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname, hash]);

  return null;
}
