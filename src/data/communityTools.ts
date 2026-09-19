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
    id: 'today-in-makati',
    name: 'Today in Makati',
    summary: 'A personalized daily starting point using your selected barangay, live city sources and current civic information.',
    status: 'Live',
    priority: 1,
    href: '/today',
    icon: 'SunMedium',
  },
  {
    id: 'accountability-ledger',
    name: 'Accountability Ledger',
    summary: 'Trace public plans, responsible bodies, later evidence and published information gaps.',
    status: 'Live',
    priority: 2,
    href: '/accountability',
    icon: 'ClipboardCheck',
  },
  {
    id: 'participation-hub',
    name: 'Participation Hub',
    summary: 'Find participation opportunities and follow BetterMakati community input publicly.',
    status: 'Live',
    priority: 3,
    href: '/participate',
    icon: 'MessagesSquare',
  },
  {
    id: 'public-records',
    name: 'Public Records',
    summary: 'Find structured Makati records and open the primary source behind them.',
    status: 'Live',
    priority: 4,
    href: '/records',
    icon: 'Files',
  },
  {
    id: 'saan-ako-lalapit',
    name: 'Saan Ako Lalapit?',
    summary: 'Find the right Makati office, service or channel for your concern.',
    status: 'Live',
    priority: 5,
    href: '/community-tools/saan-ako-lalapit',
    icon: 'Waypoints',
  },
  {
    id: 'live-makati',
    name: 'Live Makati',
    summary: 'Weather, air quality, utility status and advisory sources.',
    status: 'Live',
    priority: 6,
    href: '/live',
    icon: 'Radio',
  },
  {
    id: 'commute-guide',
    name: 'Getting Around',
    summary: 'Directions, public transport and ride-hailing links.',
    status: 'Live',
    priority: 7,
    href: '/mobility',
    icon: 'Bus',
  },
  {
    id: 'parking-finder',
    name: 'Parking Finder',
    summary: 'Find parking near destinations in Makati.',
    status: 'Live',
    priority: 8,
    href: '/parking',
    icon: 'ParkingCircle',
  },
  {
    id: 'whats-on',
    name: 'What’s On',
    summary: 'Event and entertainment sources across Makati.',
    status: 'Live',
    priority: 9,
    href: '/whats-on',
    icon: 'CalendarDays',
  },
  {
    id: 'project-tracker',
    name: 'Project Tracker',
    summary: 'Track publicly funded projects using city disclosure records and the Accountability Ledger.',
    status: 'Live',
    priority: 10,
    href: '/projects-budget#projects',
    icon: 'HardHat',
  },
  {
    id: 'opportunities-hub',
    name: 'Opportunities Hub',
    summary: 'Jobs, scholarships, training, internships and volunteer opportunities.',
    status: 'Planned',
    priority: 11,
    icon: 'BriefcaseBusiness',
  },
  {
    id: 'waste-guide',
    name: 'Waste & Collection Guide',
    summary: 'Waste rules, collection information and reporting channels.',
    status: 'Planned',
    priority: 12,
    icon: 'Recycle',
  },
];
