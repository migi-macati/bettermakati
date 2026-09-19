import type {
  CoverageGap,
  ParticipationOpportunity,
} from './civicTypes';

export const participationReviewed = '19 September 2026';

export const openParticipationOpportunities: ParticipationOpportunity[] = [];

export const documentedParticipation: ParticipationOpportunity[] = [
  {
    id: 'ra10121-local-drrm-consultation-2024',
    title: 'RA 10121 consultations with local DRRM actors',
    status: 'closed',
    kind: 'consultation',
    scope: 'Disaster risk reduction policy',
    summary:
      'Makati City and partner organizations convened local DRRM stakeholders to identify gaps and proposed improvements to the Philippine DRRM law.',
    dates: '16–17 December 2024',
    decisionOwner:
      'Consultation convened by the City Government of Makati with partner organizations; proposed amendments were intended for regional/national policy processes.',
    outcome:
      'The official account identifies proposals including a Magna Carta for DRRM workers, standardized competencies, improved data sharing and Local DRRM Fund provisions.',
    source: {
      label: 'RA 10121 Consultations with Local DRRM Actors',
      url: 'https://resilient.makati.gov.ph/mod/page/view.php?forceview=1&id=30',
      publisher: 'Makati Disaster Risk Reduction and Management Office',
      publishedOrPeriod: '17 December 2024',
    },
  },
];

export const participationCoverageGaps: CoverageGap[] = [
  {
    id: 'current-consultation-calendar',
    title: 'No complete current citywide public-consultation calendar is indexed yet',
    description:
      'BetterMakati has not located a single authoritative source that provides a complete current schedule of Makati public hearings, consultations and barangay assemblies.',
    whyItMatters:
      'People cannot participate before a decision if the opportunity is difficult to discover.',
    checkedSources: [
      {
        label: 'Makati City events',
        url: 'https://www.makati.gov.ph/content/events',
        publisher: 'City Government of Makati',
      },
      {
        label: 'Makati City Comprehensive Development Plan 2015–2023',
        url: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1580795672692.pdf',
        publisher: 'City Government of Makati',
        note:
          'The plan states that barangay assemblies were used to solicit feedback, but it is not a current assembly schedule.',
      },
    ],
    lastChecked: participationReviewed,
  },
  {
    id: 'participation-outcomes',
    title: 'Consultation → decision → response links are not consistently public',
    description:
      'A consultation notice alone does not show which inputs were received, how they were considered or what changed afterward.',
    whyItMatters:
      'Radical participation requires a visible feedback loop, not merely an invitation to comment.',
    lastChecked: participationReviewed,
  },
];
