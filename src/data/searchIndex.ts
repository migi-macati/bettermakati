export type SearchGroup =
  | 'Service'
  | 'Government'
  | 'Barangay'
  | 'Record'
  | 'Tool'
  | 'Contact';

export interface SearchItem {
  title: string;
  group: SearchGroup;
  category: string;
  description: string;
  href: string;
  keywords: string;
  featured?: boolean;
}

const barangays = [
  'Bangkal',
  'Bel-Air',
  'Carmona',
  'Dasmariñas',
  'Forbes Park',
  'Guadalupe Nuevo',
  'Guadalupe Viejo',
  'Kasilawan',
  'La Paz',
  'Magallanes',
  'Olympia',
  'Palanan',
  'Pinagkaisahan',
  'Pio Del Pilar',
  'Poblacion',
  'San Antonio',
  'San Isidro',
  'San Lorenzo',
  'Santa Cruz',
  'Singkamas',
  'Tejeros',
  'Urdaneta',
  'Valenzuela',
];

const serviceItems: SearchItem[] = [
  {
    title: 'Apply for a new business permit',
    group: 'Service',
    category: 'Business',
    description: 'Requirements and application form for a new Makati business permit.',
    href: '/services/business/new-business-permit',
    keywords: 'business permit new mayor mayors licensing bplo trade company enterprise registration',
    featured: true,
  },
  {
    title: 'Renew a business permit',
    group: 'Service',
    category: 'Business',
    description: 'Renewal requirements for an existing Makati business permit.',
    href: '/services/business/renew-business-permit',
    keywords: 'business permit renewal renew mayor mayors licensing bplo tax',
  },
  {
    title: 'Makati Health Plus / Yellow Card',
    group: 'Service',
    category: 'Health',
    description: 'Application information and supporting documents.',
    href: '/services/health-services/makati-health-plus',
    keywords: 'yellow card health plus medical hospital patient healthcare benefit',
    featured: true,
  },
  {
    title: 'Get emergency assistance',
    group: 'Service',
    category: 'Health',
    description: 'Emergency contacts and reporting information.',
    href: '/services/health-services/emergency-assistance',
    keywords: 'emergency 911 rescue medical drrmo disaster fire police ambulance',
  },
  {
    title: 'Apply to the University of Makati',
    group: 'Service',
    category: 'Education',
    description: 'University of Makati admissions and application information.',
    href: '/services/education/umak-admissions',
    keywords: 'umak university admission college school enrollment student',
  },
  {
    title: 'University of Makati scholarships and grants',
    group: 'Service',
    category: 'Education',
    description: 'Scholarship guidelines and application information.',
    href: '/services/education/umak-scholarships',
    keywords: 'umak scholarship education grant tuition student financial assistance',
  },
  {
    title: 'Contact the Makati Action Center',
    group: 'Service',
    category: 'Social',
    description: 'Citizen concerns, feedback and service coordination.',
    href: '/services/social-welfare/makati-action-center',
    keywords: 'complaint concern feedback action center help assistance mac mayor city hall',
    featured: true,
  },
  {
    title: 'Senior citizen Blu Card services',
    group: 'Service',
    category: 'Social',
    description: 'Blu Card information for Makati senior citizens.',
    href: '/services/social-welfare/senior-citizen-blu-card',
    keywords: 'senior citizen blue blu card elderly benefits social welfare',
  },
  {
    title: 'Pay real property tax',
    group: 'Service',
    category: 'Property',
    description: 'Requirements for Makati real property tax payment.',
    href: '/services/housing-land-use/real-property-tax-payment',
    keywords: 'property tax real estate rpta payment assessment treasurer land house',
    featured: true,
  },
  {
    title: 'Secure locational clearance and building permit',
    group: 'Service',
    category: 'Property',
    description: 'Locational clearance and building-permit requirements.',
    href: '/services/housing-land-use/locational-clearance-building-permit',
    keywords: 'building permit zoning locational clearance construction land development occupancy',
  },
];

const governmentItems: SearchItem[] = [
  {
    title: 'City leadership',
    group: 'Government',
    category: 'Government',
    description: 'Mayor and Vice Mayor.',
    href: '/government#leadership',
    keywords: 'mayor vice mayor leadership executive city hall official',
    featured: true,
  },
  {
    title: 'City Council',
    group: 'Government',
    category: 'Government',
    description: 'Sangguniang Panlungsod.',
    href: '/government#council',
    keywords: 'council councilor legislative sanggunian vice mayor ordinance',
  },
  {
    title: 'City offices',
    group: 'Government',
    category: 'Government',
    description: 'Departments and offices of the City Government of Makati.',
    href: '/government#offices',
    keywords: 'office department city hall government engineering health social welfare environment budget finance',
    featured: true,
  },
  {
    title: 'Makati statistics',
    group: 'Government',
    category: 'Government',
    description: 'Population and basic city figures.',
    href: '/statistics',
    keywords: 'statistics population demographic income class data city profile',
  },
  {
    title: 'Legislation',
    group: 'Government',
    category: 'Government',
    description: 'Resolutions, ordinances and the Makati City Charter.',
    href: '/legislation',
    keywords: 'legislation ordinance resolution law charter council',
  },
  {
    title: 'News & events',
    group: 'Government',
    category: 'Government',
    description: 'Official city news and event listings.',
    href: '/news',
    keywords: 'news announcement events city government update',
  },
];

const recordItems: SearchItem[] = [
  {
    title: 'Projects & Budget',
    group: 'Record',
    category: 'Records',
    description: 'Budget, project disclosures, procurement and audit records.',
    href: '/projects-budget',
    keywords: 'budget spending projects procurement audit public records transparency contract',
    featured: true,
  },
  {
    title: 'CY 2025 Annual Budget',
    group: 'Record',
    category: 'Records',
    description: 'City annual budget document.',
    href: '/projects-budget#budget',
    keywords: 'annual budget 2025 appropriation spending finance',
  },
  {
    title: 'Project disclosures',
    group: 'Record',
    category: 'Records',
    description: 'Development-fund programs and projects.',
    href: '/projects-budget#projects',
    keywords: 'project tracker infrastructure nta development project status',
  },
  {
    title: 'Procurement',
    group: 'Record',
    category: 'Records',
    description: 'Procurement and award notices.',
    href: '/projects-budget#procurement',
    keywords: 'procurement bidding award supplier contractor philgeps purchase',
  },
  {
    title: 'Audit reports',
    group: 'Record',
    category: 'Records',
    description: 'Commission on Audit reports.',
    href: '/projects-budget#audit',
    keywords: 'audit coa report financial compliance',
  },
];

const toolItems: SearchItem[] = [
  {
    title: 'Saan Ako Lalapit?',
    group: 'Tool',
    category: 'Tools',
    description: 'Find the right Makati office, service or channel for your concern.',
    href: '/community-tools/saan-ako-lalapit',
    keywords: 'where office concern help which department saan ako lalapit finder',
    featured: true,
  },
  {
    title: 'Project Tracker',
    group: 'Tool',
    category: 'Tools',
    description: 'Public-project records and development disclosures.',
    href: '/projects-budget#projects',
    keywords: 'project tracker infrastructure public works development project status',
  },
  {
    title: 'Commute Guide',
    group: 'Tool',
    category: 'Tools',
    description: 'Planned routes, terminals and transport information tool.',
    href: '/get-involved?type=idea&tool=commute-guide#submission',
    keywords: 'commute transport route bus jeep terminal traffic fare',
  },
  {
    title: 'Opportunities Hub',
    group: 'Tool',
    category: 'Tools',
    description: 'Planned jobs, scholarships, training and volunteer opportunities tool.',
    href: '/get-involved?type=idea&tool=opportunities-hub#submission',
    keywords: 'jobs scholarship training internship volunteer opportunities employment',
  },
  {
    title: 'Waste & Collection Guide',
    group: 'Tool',
    category: 'Tools',
    description: 'Planned waste rules and collection information tool.',
    href: '/get-involved?type=idea&tool=waste-guide#submission',
    keywords: 'waste garbage trash collection recycling environment schedule',
  },
];

const contactItems: SearchItem[] = [
  {
    title: 'Hotlines & emergency contacts',
    group: 'Contact',
    category: 'Government',
    description: '911, City Hall, Makati Action Center and essential contacts.',
    href: '/hotlines',
    keywords: 'hotline phone emergency 911 city hall drrmo action center contact',
    featured: true,
  },
  {
    title: 'Contact BetterMakati',
    group: 'Contact',
    category: 'Tools',
    description: 'Contact the project or report a correction.',
    href: '/contact',
    keywords: 'contact bettemakati correction github issue feedback',
  },
];

const barangayItems: SearchItem[] = barangays.map(name => ({
  title: `Barangay ${name}`,
  group: 'Barangay',
  category: 'Barangays',
  description: 'Barangay directory and population.',
  href: `/barangays#${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  keywords: `${name} barangay hall local neighborhood population`,
}));

export const searchIndex: SearchItem[] = [
  ...serviceItems,
  ...governmentItems,
  ...recordItems,
  ...toolItems,
  ...contactItems,
  ...barangayItems,
];
