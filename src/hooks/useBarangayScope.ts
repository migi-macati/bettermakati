import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { barangays, findBarangay } from '../data/barangays';

const rememberedBarangayKey = 'bettermakati:barangay-scope';

export const barangaySliceablePaths = new Set([
  '/services',
  '/projects-budget',
  '/accountability',
  '/participate',
  '/statistics',
  '/civic-map',
]);

export const isBarangaySliceableHref = (href: string) => {
  const path = href.split('#')[0].split('?')[0];
  return barangaySliceablePaths.has(path);
};

const isValidBarangay = (slug?: string | null) =>
  Boolean(slug && barangays.some(item => item.slug === slug));

const readRememberedBarangay = () => {
  if (typeof window === 'undefined') return '';
  const stored = window.localStorage.getItem(rememberedBarangayKey);
  return isValidBarangay(stored) ? stored ?? '' : '';
};

export const withBarangayScope = (href: string, slug?: string | null) => {
  if (!slug) return href;
  const [base, hash = ''] = href.split('#');
  const params = new URLSearchParams(base.includes('?') ? base.split('?')[1] : '');
  params.set('barangay', slug);
  const pathname = base.split('?')[0];
  const query = params.toString();
  return pathname + (query ? '?' + query : '') + (hash ? '#' + hash : '');
};

export function useBarangayScope() {
  const [params, setParams] = useSearchParams();
  const explicitSlug = params.get('barangay');
  const barangaySlug = isValidBarangay(explicitSlug) ? explicitSlug ?? '' : '';
  const [rememberedBarangaySlug, setRememberedBarangaySlug] = useState(
    readRememberedBarangay
  );

  const rememberBarangay = (slug: string) => {
    const validSlug = isValidBarangay(slug) ? slug : '';
    setRememberedBarangaySlug(validSlug);

    if (typeof window !== 'undefined') {
      if (validSlug) {
        window.localStorage.setItem(rememberedBarangayKey, validSlug);
      } else {
        window.localStorage.removeItem(rememberedBarangayKey);
      }
    }
  };

  useEffect(() => {
    if (barangaySlug && barangaySlug !== rememberedBarangaySlug) {
      rememberBarangay(barangaySlug);
    }
  }, [barangaySlug]);

  const barangay = useMemo(
    () => findBarangay(barangaySlug),
    [barangaySlug]
  );

  const preferredBarangay = useMemo(
    () => findBarangay(barangaySlug || rememberedBarangaySlug),
    [barangaySlug, rememberedBarangaySlug]
  );

  const setBarangay = (slug: string) => {
    const next = new URLSearchParams(params);
    if (isValidBarangay(slug)) {
      next.set('barangay', slug);
      rememberBarangay(slug);
    } else {
      next.delete('barangay');
      rememberBarangay('');
    }
    setParams(next, { replace: true });
  };

  return {
    barangay,
    barangaySlug,
    preferredBarangay,
    rememberedBarangaySlug,
    isBarangayScoped: Boolean(barangay),
    isExplicitScope: Boolean(barangay),
    setBarangay,
    rememberBarangay,
  };
}
