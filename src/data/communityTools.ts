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
    id: 'barangay-hub',
    name: 'Barangay Hub',
    summary: 'Find barangay population and basic local information.',
    status: 'Live',
    priority: 2,
    href: '/barangays',
    icon: 'MapPin',
  },
  {
    id: 'budget-records',
    name: 'Budget & Public Records',
    summary: 'Open city budget, legislation, procurement and audit records.',
    status: 'Live',
    priority: 3,
    href: '/projects-budget',
    icon: 'FileBarChart',
  },
  {
    id: 'emergency-guide',
    name: 'Emergency Guide',
    summary: 'Reach 911, Makati Action Center and essential city contacts.',
    status: 'Live',
    priority: 4,
    href: '/hotlines',
    icon: 'Siren',
  },
  {
    id: 'project-tracker',
    name: 'Project Tracker',
    summary: 'Track publicly funded projects using city disclosure records.',
    status: 'Researching',
    priority: 5,
    href: '/projects-budget#projects',
    icon: 'HardHat',
  },
  {
    id: 'commute-guide',
    name: 'Commute Guide',
    summary: 'Routes, terminals, transport links and service advisories.',
    status: 'Planned',
    priority: 6,
    icon: 'Bus',
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
