export type ParkingSourceKind =
  | 'official-primary'
  | 'operator-primary'
  | 'property-primary'
  | 'mapping-reference'
  | 'secondary-reporting'
  | 'other';

export type ParkingEvidenceStrength = 'direct' | 'corroborated' | 'inferred';
export type ParkingFieldState = 'verified' | 'reported' | 'stale' | 'unknown';

export type ParkingFacilityKind =
  | 'public-off-street'
  | 'commercial-mall'
  | 'office-commercial'
  | 'hotel'
  | 'mixed-use-estate'
  | 'street-parking'
  | 'other';

export type ParkingLifecycleStatus =
  | 'operating'
  | 'temporarily-closed'
  | 'closed'
  | 'unknown';

export type ParkingAccessClass =
  | 'public'
  | 'customers-only'
  | 'tenants-guests'
  | 'permit-restricted'
  | 'unknown';

export type ParkingVehicleType = 'car' | 'motorcycle' | 'bicycle' | 'ev';

export interface ParkingRegistrySource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn: string;
  kind: ParkingSourceKind;
}

export interface ParkingSourcedValue<T> {
  state: ParkingFieldState;
  value?: T;
  sourceIds: string[];
  checkedOn?: string;
  note?: string;
}

export interface ParkingPoint {
  lat: number;
  lng: number;
  role: 'entrance' | 'facility' | 'representative';
}

export interface ParkingHoursRule {
  days: string;
  hours: string;
  note?: string;
}

export interface ParkingRateRule {
  label: string;
  amountPhp?: number;
  unit?:
    | 'flat'
    | 'per-hour'
    | 'first-block'
    | 'succeeding-hour'
    | 'overnight'
    | 'other';
  note?: string;
}

export interface ParkingEvCharging {
  available: boolean;
  connectorNote?: string;
}

export interface ParkingFacilityLink {
  label: string;
  url: string;
  kind:
    | 'official-page'
    | 'parking-info'
    | 'directions'
    | 'operator-page'
    | 'other';
  sourceIds: string[];
}

export interface ParkingAssertion {
  fieldPaths: string[];
  sourceIds: string[];
  evidenceStrength: ParkingEvidenceStrength;
  note?: string;
}

export interface ParkingFacilityRecord {
  id: string;
  name: string;
  aliases?: string[];
  facilityKind: ParkingFacilityKind;
  summary?: string;
  location: {
    address: ParkingSourcedValue<string>;
    point: ParkingSourcedValue<ParkingPoint>;
    barangaySlugs: string[];
  };
  operator: ParkingSourcedValue<string>;
  lifecycle: ParkingSourcedValue<ParkingLifecycleStatus>;
  access: ParkingSourcedValue<ParkingAccessClass>;
  vehicleTypes: ParkingSourcedValue<ParkingVehicleType[]>;
  hours: ParkingSourcedValue<ParkingHoursRule[]>;
  rates: ParkingSourcedValue<ParkingRateRule[]>;
  capacity: ParkingSourcedValue<number>;
  evCharging: ParkingSourcedValue<ParkingEvCharging>;
  areaIds: string[];
  destinationPlaceIds: string[];
  links: ParkingFacilityLink[];
  provenance: { assertions: ParkingAssertion[] };
  tags: string[];
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const validateUrl = (value: string, owner: string) => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('Invalid parking URL for ' + owner + ': ' + value);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Unsupported parking URL protocol for ' + owner + ': ' + value);
  }
};

const validateDate = (value: string | undefined, owner: string) => {
  if (!value || !datePattern.test(value)) {
    throw new Error('Parking evidence date must use YYYY-MM-DD for ' + owner + '.');
  }
};

const validateSourcedValue = <T>(
  field: ParkingSourcedValue<T>,
  owner: string,
  sourceIds: Set<string>
) => {
  if (field.state === 'unknown') {
    if (field.value !== undefined) {
      throw new Error('Unknown parking field must not carry a value: ' + owner);
    }
    if (field.sourceIds.length) {
      throw new Error('Unknown parking field must not imply supporting evidence: ' + owner);
    }
    return;
  }

  if (field.value === undefined) {
    throw new Error('Known parking field must carry a value: ' + owner);
  }
  if (!field.sourceIds.length) {
    throw new Error('Known parking field must cite at least one source: ' + owner);
  }

  validateDate(field.checkedOn, owner);
  for (const sourceId of field.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      throw new Error('Parking field cites missing source ' + sourceId + ': ' + owner);
    }
  }
};

export const parkingRegistryReviewedOn = '2026-09-28';

/**
 * W5-5a establishes the canonical parking architecture only.
 * Facilities are added in W5-5b after current-source verification.
 */
export const parkingSources: ParkingRegistrySource[] = [];
export const parkingFacilities: ParkingFacilityRecord[] = [];

export const validateParkingRegistry = ({
  sources,
  facilities,
}: {
  sources: readonly ParkingRegistrySource[];
  facilities: readonly ParkingFacilityRecord[];
}) => {
  const sourceIds = new Set<string>();
  const facilityIds = new Set<string>();

  for (const source of sources) {
    if (!source.id.trim() || !source.label.trim()) {
      throw new Error('Parking source ID/label must not be empty.');
    }
    if (sourceIds.has(source.id)) {
      throw new Error('Duplicate parking source ID: ' + source.id);
    }
    sourceIds.add(source.id);
    validateUrl(source.url, 'source ' + source.id);
    validateDate(source.checkedOn, 'source ' + source.id);
  }

  for (const facility of facilities) {
    if (!facility.id.trim() || !facility.name.trim()) {
      throw new Error('Parking facility ID/name must not be empty.');
    }
    if (facilityIds.has(facility.id)) {
      throw new Error('Duplicate parking facility ID: ' + facility.id);
    }
    facilityIds.add(facility.id);

    const fields: Array<[ParkingSourcedValue<unknown>, string]> = [
      [facility.location.address, 'location.address'],
      [facility.location.point, 'location.point'],
      [facility.operator, 'operator'],
      [facility.lifecycle, 'lifecycle'],
      [facility.access, 'access'],
      [facility.vehicleTypes, 'vehicleTypes'],
      [facility.hours, 'hours'],
      [facility.rates, 'rates'],
      [facility.capacity, 'capacity'],
      [facility.evCharging, 'evCharging'],
    ];
    for (const [field, fieldName] of fields) {
      validateSourcedValue(field, facility.id + '.' + fieldName, sourceIds);
    }

    if (
      facility.location.address.state === 'unknown' &&
      facility.location.point.state === 'unknown'
    ) {
      throw new Error(
        'Parking facility requires a sourced address or point: ' + facility.id
      );
    }

    const point = facility.location.point.value;
    if (
      point &&
      (point.lng < 120.9 ||
        point.lng > 121.2 ||
        point.lat < 14.45 ||
        point.lat > 14.7)
    ) {
      throw new Error(
        'Parking point is outside the Metro Manila validation envelope: ' +
          facility.id
      );
    }

    for (const assertion of facility.provenance.assertions) {
      if (!assertion.fieldPaths.length || !assertion.sourceIds.length) {
        throw new Error(
          'Parking assertion must name fields and sources: ' + facility.id
        );
      }
      for (const sourceId of assertion.sourceIds) {
        if (!sourceIds.has(sourceId)) {
          throw new Error(
            'Parking assertion cites missing source ' +
              sourceId +
              ': ' +
              facility.id
          );
        }
      }
    }

    if (
      !facility.provenance.assertions.some(assertion =>
        assertion.fieldPaths.includes('name')
      )
    ) {
      throw new Error('Parking facility identity must have provenance: ' + facility.id);
    }

    for (const link of facility.links) {
      if (!link.label.trim()) {
        throw new Error('Parking facility link label must not be empty: ' + facility.id);
      }
      validateUrl(link.url, facility.id + ' link');
      if (!link.sourceIds.length) {
        throw new Error('Parking facility link must cite a source: ' + facility.id);
      }
      for (const sourceId of link.sourceIds) {
        if (!sourceIds.has(sourceId)) {
          throw new Error(
            'Parking facility link cites missing source ' +
              sourceId +
              ': ' +
              facility.id
          );
        }
      }
    }
  }

  return true;
};

validateParkingRegistry({ sources: parkingSources, facilities: parkingFacilities });

export const parkingFacilityById = new Map(
  parkingFacilities.map(facility => [facility.id, facility])
);
