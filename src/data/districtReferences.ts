import { civicAreaById } from './areaOrganizationRegistry';
import { findBarangay } from './barangays';

export type DistrictReference =
  | { type: 'area'; id: string }
  | { type: 'barangay'; id: string };

export interface ResolvedDistrictReference {
  ref: DistrictReference;
  label: string;
  href: string;
  mapQuery: string;
}

export const resolveDistrictReference = (
  ref: DistrictReference
): ResolvedDistrictReference => {
  if (ref.type === 'area') {
    const area = civicAreaById.get(ref.id);
    if (!area) {
      throw new Error('Unknown canonical area reference: ' + ref.id);
    }

    return {
      ref,
      label: area.name,
      href: '/estates#area-' + area.id,
      mapQuery: area.name + ', Makati City, Metro Manila, Philippines',
    };
  }

  const barangay = findBarangay(ref.id);
  if (!barangay) {
    throw new Error('Unknown canonical barangay reference: ' + ref.id);
  }

  return {
    ref,
    label: barangay.name,
    href: '/barangays/' + barangay.slug,
    mapQuery:
      'Barangay ' +
      barangay.name +
      ', Makati City, Metro Manila, Philippines',
  };
};

export const resolveDistrictReferences = (
  refs: readonly DistrictReference[]
) => refs.map(resolveDistrictReference);
