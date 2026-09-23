import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { barangays, findBarangay } from '../data/barangays';

const STORAGE_KEY = 'bettermakati:barangay';

const isValidBarangay = (slug?: string | null) =>
  Boolean(slug && barangays.some(item => item.slug === slug));

export const withBarangayScope = (href: string, slug?: string | null) => {
  if (!slug) return href;
  const [base, hash = ''] = href.split('#');
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}barangay=${encodeURIComponent(slug)}${hash ? '#' + hash : ''}`;
};

export function useBarangayScope() {
  const [params, setParams] = useSearchParams();
  const explicitSlug = params.get('barangay');
  const [savedSlug, setSavedSlug] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isValidBarangay(saved) ? saved ?? '' : '';
  });

  const barangaySlug = isValidBarangay(explicitSlug)
    ? explicitSlug ?? ''
    : savedSlug;

  const barangay = useMemo(
    () => findBarangay(barangaySlug),
    [barangaySlug]
  );

  useEffect(() => {
    if (!isValidBarangay(explicitSlug)) return;
    window.localStorage.setItem(STORAGE_KEY, explicitSlug as string);
    setSavedSlug(explicitSlug as string);
  }, [explicitSlug]);

  const setBarangay = (slug: string) => {
    const next = new URLSearchParams(params);
    if (isValidBarangay(slug)) {
      next.set('barangay', slug);
      window.localStorage.setItem(STORAGE_KEY, slug);
      setSavedSlug(slug);
    } else {
      next.delete('barangay');
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedSlug('');
    }
    setParams(next, { replace: true });
  };

  return {
    barangay,
    barangaySlug,
    isBarangayScoped: Boolean(barangay),
    isExplicitScope: isValidBarangay(explicitSlug),
    setBarangay,
  };
}
