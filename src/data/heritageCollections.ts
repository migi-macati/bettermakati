export type HeritageCollectionKind = 'walking-route' | 'place-collection';

export interface HeritageCollection {
  id: string;
  name: string;
  kind: HeritageCollectionKind;
  theme: string;
  description: string;
  placeIds: string[];
  travelMode?: 'walking';
  sourceNote?: string;
}

export const heritageCollections: HeritageCollection[] = [
  {
    id: 'old-makati-to-ayala',
    name: 'Old Makati to Ayala',
    kind: 'walking-route',
    theme: 'Old town, civic heritage and the rise of the modern business district',
    description:
      'A cross-city route linking the old civic and parish core of San Pedro Macati with Nielson Tower and Ayala Museum.',
    placeIds: [
      'museo-ng-makati',
      'plaza-cristo-rey',
      'sts-peter-and-paul-parish-church',
      'nielson-tower',
      'ayala-museum',
    ],
    travelMode: 'walking',
    sourceNote:
      'Curated by BetterMakati from canonical heritage places. Stop order is editorial and does not claim to reproduce a historical route.',
  },
  {
    id: 'guadalupe-to-tejeros',
    name: 'Guadalupe to Tejeros',
    kind: 'walking-route',
    theme: 'Religious heritage along the Pasig-side historic corridor',
    description:
      'A longer route connecting two marked religious heritage sites in Guadalupe Viejo and Tejeros.',
    placeIds: [
      'nuestra-senora-de-gracia-church',
      'dambana-ng-banal-na-krus',
    ],
    travelMode: 'walking',
    sourceNote:
      'Curated by BetterMakati from canonical heritage places. Check current pedestrian conditions before using the route.',
  },
];

export const heritageWalkingRoutes = heritageCollections.filter(
  collection => collection.kind === 'walking-route'
);
