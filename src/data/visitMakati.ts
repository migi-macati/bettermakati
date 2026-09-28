export interface HeritageSite {
  placeId: string;
  category: 'Historic marker' | 'Historic landscape' | 'Museum & culture';
  period: string;
  context: string;
}

export const heritageSites: HeritageSite[] = [
  {
    placeId: 'nuestra-senora-de-gracia-church',
    category: 'Historic marker',
    period: '1601–1629',
    context:
      'An early Augustinian religious complex on Guadalupe’s high ground, with the NHCP marker and surviving institutional records documenting its long history.',
  },
  {
    placeId: 'sts-peter-and-paul-parish-church',
    category: 'Historic marker',
    period: '1607 foundation · later rebuilding',
    context:
      'The historic parish church of San Pedro Macati. Its history includes multiple construction and rebuilding phases, so BetterMakati keeps foundation, later fabric and the surviving church distinct.',
  },
  {
    placeId: 'nielson-tower',
    category: 'Historic marker',
    period: '1937',
    context:
      'The surviving terminal and control building of Nielson Airport, later reused after the airfield closed and Makati’s business district grew around it.',
  },
  {
    placeId: 'dambana-ng-banal-na-krus',
    category: 'Historic marker',
    period: '1882 chapel tradition',
    context:
      'The Holy Cross shrine and parish church in Tejeros, recognized by an NHCP historical marker.',
  },
  {
    placeId: 'museo-ng-makati',
    category: 'Museum & culture',
    period: '1918 Presidencia',
    context:
      'Makati’s city museum occupies the Old Presidencia of San Pedro Macati, a registered Important Cultural Property.',
  },
  {
    placeId: 'ayala-museum',
    category: 'Museum & culture',
    period: 'Contemporary museum',
    context:
      'A museum of Philippine history, art, archaeology and culture, and the present home of the Filipinas Heritage Library.',
  },
  {
    placeId: 'plaza-cristo-rey',
    category: 'Historic landscape',
    period: 'Historic Poblacion landscape',
    context:
      'A public heritage plaza beside Sts. Peter and Paul Parish Church, included in Makati’s cultural planning record as part of the historic Poblacion setting.',
  },
];
