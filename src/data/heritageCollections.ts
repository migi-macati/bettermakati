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
  {
    id: 'old-san-pedro-macati',
    name: 'Old San Pedro Macati',
    kind: 'place-collection',
    theme: 'Civic and parish core of old Makati',
    description:
      'Three surviving places that anchor the historic Poblacion core: the old Presidencia, Plaza Cristo Rey and the parish church of San Pedro Macati.',
    placeIds: [
      'museo-ng-makati',
      'plaza-cristo-rey',
      'sts-peter-and-paul-parish-church',
    ],
    sourceNote:
      'A BetterMakati thematic collection assembled from canonical place records; it does not imply that the three sites share one construction period.',
  },
  {
    id: 'religious-heritage',
    name: 'Religious heritage',
    kind: 'place-collection',
    theme: 'Marked churches and shrines across Makati',
    description:
      'Historic religious sites in Guadalupe Viejo, Poblacion and Tejeros with distinct foundation, rebuilding and parish histories.',
    placeIds: [
      'nuestra-senora-de-gracia-church',
      'sts-peter-and-paul-parish-church',
      'dambana-ng-banal-na-krus',
    ],
    sourceNote:
      'The collection groups canonical places by heritage theme; chronology and designation details remain attached to each place.',
  },
  {
    id: 'nielson-and-modern-makati',
    name: 'Nielson and modern Makati',
    kind: 'place-collection',
    theme: 'From the former airfield landscape to the modern CBD',
    description:
      'Use Nielson Tower, Ayala Triangle Gardens and Ayala Museum to orient the former airport site and the later business and cultural district that developed around it.',
    placeIds: [
      'nielson-tower',
      'ayala-triangle-gardens',
      'ayala-museum',
    ],
    sourceNote:
      'This is an interpretive orientation collection, not a claim that every included place is itself a designated aviation heritage property.',
  },
  {
    id: 'museums-and-cultural-institutions',
    name: 'Museums and cultural institutions',
    kind: 'place-collection',
    theme: 'Places for Makati and Philippine history, art and culture',
    description:
      'Makati’s city museum in the Old Presidencia and Ayala Museum in the modern cultural district.',
    placeIds: [
      'museo-ng-makati',
      'ayala-museum',
    ],
    sourceNote:
      'The collection groups cultural institutions; heritage status belongs to the individual canonical place record.',
  },
]; 

export const heritageWalkingRoutes = heritageCollections.filter(
  collection => collection.kind === 'walking-route'
);

export const heritagePlaceCollections = heritageCollections.filter(
  collection => collection.kind === 'place-collection'
);
