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
    id: 'project-tracker',
    name: 'Project Tracker',
    summary: 'Track publicly funded projects using city disclosure records.',
    status: 'Researching',
    priority: 2,
    href: '/projects-budget#projects',
    icon: 'HardHat',
  },
  {
    id: 'commute-guide',
    name: 'Commute Guide',
    summary: 'Routes, terminals, transport links and service advisories.',
    status: 'Planned',
    priority: 3,
    icon: 'Bus',
  },
  {
    id: 'opportunities-hub',
    name: 'Opportunities Hub',
    summary: 'Jobs, scholarships, training, internships and volunteer opportunities.',
    status: 'Planned',
    priority: 4,
    icon: 'BriefcaseBusiness',
  },
  {
    id: 'waste-guide',
    name: 'Waste & Collection Guide',
    summary: 'Waste rules, collection information and reporting channels.',
    status: 'Planned',
    priority: 5,
    icon: 'Recycle',
  },
];
