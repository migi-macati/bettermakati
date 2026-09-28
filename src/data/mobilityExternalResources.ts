export type MobilityExternalResourceKind =
  | 'app-car-taxi'
  | 'app-motorcycle'
  | 'app-multimode';

export interface MobilityExternalResource {
  id: string;
  name: string;
  kind: MobilityExternalResourceKind;
  displayType: string;
  summary: string;
  primaryUrl: string;
  officialSourceUrls: string[];
  reviewedOn: string;
  volatilityNote: string;
}

export const mobilityExternalResourcesReviewedOn = '2026-09-27';

export const mobilityExternalResources: MobilityExternalResource[] = [
  {
    id: 'grab-ph',
    name: 'Grab',
    kind: 'app-car-taxi',
    displayType: 'Car & taxi',
    summary:
      'External app-based car and taxi mobility service. Availability and fare remain app-determined.',
    primaryUrl: 'https://www.grab.com/ph/download/',
    officialSourceUrls: [
      'https://www.grab.com/ph/transport/',
      'https://www.grab.com/ph/download/',
    ],
    reviewedOn: mobilityExternalResourcesReviewedOn,
    volatilityNote:
      'Do not freeze availability, fare or trip-specific service coverage into BetterMakati.',
  },
  {
    id: 'angkas',
    name: 'Angkas',
    kind: 'app-motorcycle',
    displayType: 'Motorcycle taxi',
    summary:
      'External app-based motorcycle transport service. Booking availability remains app-determined.',
    primaryUrl: 'https://www.angkas.com/consumer',
    officialSourceUrls: ['https://www.angkas.com/consumer'],
    reviewedOn: mobilityExternalResourcesReviewedOn,
    volatilityNote:
      'Do not freeze availability, fare or trip-specific service coverage into BetterMakati.',
  },
  {
    id: 'joyride-ph',
    name: 'JoyRide',
    kind: 'app-multimode',
    displayType: 'Car, taxi & motorcycle',
    summary:
      'External app-based multi-mode mobility service. Availability and fare remain app-determined.',
    primaryUrl: 'https://joyride.com.ph/',
    officialSourceUrls: ['https://joyride.com.ph/'],
    reviewedOn: mobilityExternalResourcesReviewedOn,
    volatilityNote:
      'Do not freeze availability, fare or trip-specific service coverage into BetterMakati.',
  },
  {
    id: 'move-it-ph',
    name: 'MOVE IT',
    kind: 'app-motorcycle',
    displayType: 'Motorcycle taxi',
    summary:
      'External app-based motorcycle taxi service. Booking availability remains app-determined.',
    primaryUrl: 'https://moveit.com.ph/how-it-works/',
    officialSourceUrls: [
      'https://moveit.com.ph/how-it-works/',
      'https://moveit.com.ph/home',
    ],
    reviewedOn: mobilityExternalResourcesReviewedOn,
    volatilityNote:
      'Do not treat older service-area pages as proof of permanent Makati coverage; booking availability remains app-determined.',
  },
];

const validateUrl = (value: string, owner: string) => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('Invalid mobility external-resource URL for ' + owner);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Unsupported mobility external-resource URL for ' + owner);
  }
};

export const validateMobilityExternalResources = (
  resources: readonly MobilityExternalResource[]
) => {
  const ids = new Set<string>();

  for (const resource of resources) {
    if (!resource.id.trim() || !resource.name.trim()) {
      throw new Error('Mobility external-resource ID/name must not be empty.');
    }
    if (ids.has(resource.id)) {
      throw new Error('Duplicate mobility external-resource ID: ' + resource.id);
    }
    ids.add(resource.id);

    validateUrl(resource.primaryUrl, resource.id);

    if (!resource.officialSourceUrls.length) {
      throw new Error(
        'Mobility external resource must retain an official source: ' +
          resource.id
      );
    }
    resource.officialSourceUrls.forEach(url =>
      validateUrl(url, resource.id)
    );

    if (!resource.volatilityNote.trim()) {
      throw new Error(
        'Mobility external resource must state volatility limits: ' +
          resource.id
      );
    }
  }

  return true;
};

validateMobilityExternalResources(mobilityExternalResources);
