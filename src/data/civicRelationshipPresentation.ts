export const civicRelationshipOwnerLabel = (owner: string) => {
  switch (owner) {
    case 'statistics':
      return 'Statistics';
    case 'legislation':
      return 'Legislation';
    case 'integrity':
      return 'Integrity';
    case 'reports':
      return 'Report';
    case 'place-registry':
      return 'Place';
    case 'area-registry':
      return 'Area';
    case 'barangays':
      return 'Barangay';
    case 'services':
      return 'Service';
    case 'accountability':
      return 'Accountability';
    case 'city-monitor':
      return 'City Monitor';
    case 'public-records':
      return 'Public record';
    case 'budgets':
      return 'Budget';
    case 'officials':
      return 'Official';
    case 'elections':
      return 'Election record';
    case 'timeline':
      return 'Calendar entry';
    case 'ecosystem':
      return 'External civic resource';
    default:
      return 'Related record';
  }
};
