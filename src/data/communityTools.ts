export type CommunityToolStatus = 'Live' | 'Researching' | 'Planned';

export interface CommunityTool {
  id: string;
  name: string;
  summary: string;
  status: CommunityToolStatus;
  priority: number;
  href?: string;
  icon: string;
}

export const communityTools: CommunityTool[] = [
  {
    id: 'saan-ako-lalapit',
    name: 'Saan Ako Lalapit?',
    summary: 'Find the right Makati office, service or channel for your concern.',
    status: 'Live',
    priority: 1,
    href: '/community-tools/saan-ako-lalapit',
    icon: 'Waypoints',
  },
  {
    id: 'live-makati',
    name: 'Live Makati',
    summary: 'Weather, air quality, utility status and advisory sources.',
    status: 'Live',
    priority: 2,
    href: '/live',
    icon: 'Radio',
  },
  {
    id: 'commute-guide',
    name: 'Getting Around',
    summary: 'Directions, public transport and ride-hailing links.',
    status: 'Live',
    priority: 3,
    href: '/mobility',
    icon: 'Bus',
  },
  {
    id: 'parking-finder',
    name: 'Parking Finder',
    summary: 'Find parking near destinations in Makati.',
    status: 'Live',
    priority: 4,
    href: '/parking',
    icon: 'ParkingCircle',
  },
  {
    id: 'whats-on',
    name: 'What’s On',
    summary: 'Event and entertainment sources across Makati.',
    status: 'Live',
    priority: 5,
    href: '/whats-on',
    icon: 'CalendarDays',
  },
  {
    id: 'project-tracker',
    name: 'Project Tracker',
    summary: 'Track publicly funded projects using city disclosure records.',
    status: 'Researching',
    priority: 6,
    href: '/projects-budget#projects',
    icon: 'HardHat',
  },
  {
    id: 'opportunities-hub',
    name: 'Opportunities Hub',
    summary: 'Jobs, scholarships, training, internships and volunteer opportunities.',
    status: 'Planned',
    priority: 7,
    icon: 'BriefcaseBusiness',
  },
  {
    id: 'waste-guide',
    name: 'Waste & Collection Guide',
    summary: 'Waste rules, collection information and reporting channels.',
    status: 'Planned',
    priority: 8,
    icon: 'Recycle',
  },
];
