import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { barangays, findBarangay } from '../data/barangays';

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
  const barangaySlug = isValidBarangay(explicitSlug) ? explicitSlug ?? '' : '';

  const barangay = useMemo(
    () => findBarangay(barangaySlug),
    [barangaySlug]
  );

  const setBarangay = (slug: string) => {
    const next = new URLSearchParams(params);
    if (isValidBarangay(slug)) {
      next.set('barangay', slug);
    } else {
      next.delete('barangay');
    }
    setParams(next, { replace: true });
  };

  return {
    barangay,
    barangaySlug,
    isBarangayScoped: Boolean(barangay),
    isExplicitScope: Boolean(barangay),
    setBarangay,
  };
}
