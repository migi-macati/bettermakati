export type DoctrineStatus =
  | 'implemented'
  | 'partial'
  | 'early'
  | 'institution-dependent';

export interface DoctrinePrinciple {
  id: string;
  name: string;
  verb: string;
  promise: string;
  description: string;
  href: string;
  status: DoctrineStatus;
  evidence: string[];
  gaps: string[];
}

export interface DoctrineFoundation {
  id: string;
  name: string;
  description: string;
  status: DoctrineStatus;
  evidence: string[];
  gaps: string[];
}

export interface OecdProvisionAudit {
  number: number;
  title: string;
  status: DoctrineStatus;
  betterMakatiRole: string;
  institutionalDependency: string;
}

export const doctrineReviewed = '19 September 2026';

export const doctrineSources = [
  {
    label: 'OECD Recommendation on Open Government implementation report',
    url: 'https://www.oecd.org/en/publications/open-government-for-stronger-democracies_5478db5b-en/full-report/component-4.html',
    note:
      'OECD frames open government around transparency, integrity, accountability and stakeholder participation and organizes its Recommendation into 10 provisions.',
  },
  {
    label: 'OGP Foundations for Open Government',
    url: 'https://www.opengovpartnership.org/national-handbook/foundations/',
    note:
      'OGP centers transparency, citizen participation and public accountability, with government and civil society working together.',
  },
  {
    label: 'OGP Participation and Co-Creation Standards',
    url: 'https://www.opengovpartnership.org/national-handbook/standards/',
    note:
      'OGP operationalizes ongoing dialogue, accessible information, inclusive participation, reasoned response and implementation monitoring.',
  },
];

export const doctrinePrinciples: DoctrinePrinciple[] = [
  {
    id: 'transparency',
    name: 'Radical Transparency',
    verb: 'See the state',
    promise:
      'Every public fact should be discoverable, understandable, traceable and reusable.',
    description:
      'BetterMakati should connect citizen-facing explanations to the original public record, show time and definition context, publish machine-readable data where practical, preserve change history, and make important information gaps visible.',
    href: '/records',
    status: 'implemented',
    evidence: [
      'Public Records index and primary-source links',
      'Structured budget, election, statistics and history datasets',
      'CSV/JSON exports',
      'Weekly source-change history pipeline',
      'Explicit coverage gaps and last-reviewed cues',
    ],
    gaps: [
      'The citywide public-record corpus remains incomplete',
      'Many official records still exist only as PDFs or external archives',
      'Full legislation, meeting, procurement and barangay normalization remains unfinished',
    ],
  },
  {
    id: 'accountability',
    name: 'Radical Accountability',
    verb: 'Follow the state',
    promise:
      'Every trackable commitment should connect responsibility, resources, progress and outcome.',
    description:
      'BetterMakati should expose who or which public body is responsible where the source establishes it, what was planned, what resources were attached, what later evidence reports, what changed, and what remains unknown.',
    href: '/accountability',
    status: 'partial',
    evidence: [
      'Accountability Ledger',
      'Plan-versus-actual fiscal separation',
      'Project progress records with evidence links',
      'Published accountability coverage gaps',
      'No political scoring or unsupported attribution',
    ],
    gaps: [
      'Project → procurement → award → contract → amendment → completion linkage is incomplete',
      'COA finding → management response → corrective action follow-through is not yet normalized',
      'BetterMakati cannot compel an official explanation, remedy or sanction',
    ],
  },
  {
    id: 'participation',
    name: 'Radical Participation',
    verb: 'Shape the state',
    promise:
      'People should be able to participate before decisions, understand trade-offs and see what happened to their input.',
    description:
      'BetterMakati should help people discover participation opportunities, understand what is being decided, submit structured civic input where appropriate, and close the loop wherever BetterMakati controls the process.',
    href: '/participate',
    status: 'partial',
    evidence: [
      'Participation Hub',
      'Official-government vs BetterMakati participation clearly separated',
      'Trackable BetterMakati proposals, corrections and source submissions',
      'Structured proposal prompts',
      'Published participation coverage gaps',
    ],
    gaps: [
      'No complete authoritative current Makati consultation calendar has been located',
      'Government reasoned responses to citizen input are not consistently available',
      'Representative deliberation, participatory budgeting and civic monitoring are not yet implemented',
    ],
  },
  {
    id: 'presence',
    name: 'Radical Presence',
    verb: 'Reach the state',
    promise:
      'Civic information should meet people in the place, time, language and channel where it becomes useful.',
    description:
      'BetterMakati should reduce the effort required to find relevant information by bringing locality, live context, offline resilience and practical service navigation forward without demanding unnecessary personal data.',
    href: '/today',
    status: 'partial',
    evidence: [
      'Today in Makati / My Makati locality preference',
      'No account or precise GPS required',
      'Live weather, news, events and advisory entry points',
      'Barangay-context links',
      'PWA/offline fallback with emergency access',
    ],
    gaps: [
      'Follow/subscribe notifications are not yet live',
      'Filipino/Taglish and broader multilingual coverage is incomplete',
      'Offline functionality is intentionally limited for time-sensitive information',
    ],
  },
  {
    id: 'integrity',
    name: 'Radical Integrity',
    verb: 'Trust the process',
    promise:
      'Public-interest decisions, money, relationships and ethical obligations should be open to factual scrutiny without insinuation or partisan interpretation.',
    description:
      'BetterMakati should expose applicable ethics rules, procurement and audit evidence, supplier and beneficial-ownership information where legally public, and documented conflicts or corrective actions only when supported by reliable records.',
    href: '/integrity',
    status: 'early',
    evidence: [
      'Neutral sourcing and no-invented-gaps editorial rules',
      'Procurement and audit source links',
      'Public-interest and ethics-law references',
      'Integrity-specific coverage gaps',
    ],
    gaps: [
      'Supplier/contractor records are not yet normalized citywide',
      'Beneficial ownership is not yet linked to Makati procurement records',
      'Conflict-of-interest, recusal and disclosure records are not yet systematically indexed',
      'Integrity monitoring must avoid guilt-by-association or unsupported allegations',
    ],
  },
];

export const doctrineFoundations: DoctrineFoundation[] = [
  {
    id: 'inclusion',
    name: 'Inclusion',
    description:
      'Open government should work for people with different abilities, connectivity, languages, levels of civic knowledge and access to technology.',
    status: 'partial',
    evidence: [
      'Mobile-first design',
      'No account required for core use',
      'Saan Ako Lalapit? reduces institutional knowledge requirements',
      'Accessible semantic patterns and offline fallback',
    ],
    gaps: [
      'No complete Filipino/Taglish content layer',
      'No formal user research program across underserved groups',
      'No non-digital participation channel operated by BetterMakati',
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy',
    description:
      'Openness about government should not require unnecessary surveillance of citizens.',
    status: 'implemented',
    evidence: [
      'My Makati uses device-local barangay preference',
      'No precise GPS required',
      'No account required for ordinary browsing',
      'Privacy notice distinguishes third-party services and public submissions',
    ],
    gaps: [
      'Any future analytics, notification or account feature will require renewed privacy review',
    ],
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    description:
      'Public-interest information should be perceivable, operable and understandable by people using assistive technologies and different devices.',
    status: 'partial',
    evidence: [
      'Skip link, semantic breadcrumbs and navigation states',
      'Improved chart/search accessibility labels',
      'Large mobile targets and reduced-motion support',
    ],
    gaps: [
      'A complete recurring browser/axe accessibility test suite is not yet enforced in CI',
      'Formal usability testing with disabled users has not yet been documented',
    ],
  },
  {
    id: 'evidence',
    name: 'Evidence',
    description:
      'Claims should distinguish source-backed fact, interpretation, uncertainty and absence of evidence.',
    status: 'implemented',
    evidence: [
      'Primary-source-first policy',
      'Last-reviewed cues',
      'Explicit uncertainty and coverage-gap language',
      'No unsupported political scoring or causal attribution',
    ],
    gaps: [
      'Evidence quality metadata is not yet standardized across every content type',
    ],
  },
  {
    id: 'open-data',
    name: 'Open data',
    description:
      'Where source material and rights allow, structured civic information should be reusable rather than trapped only in page interfaces.',
    status: 'partial',
    evidence: [
      'Accountability CSV export',
      'Population CSV export',
      'Source-watch JSON export',
      'Structured election, budget and history datasets in the codebase',
    ],
    gaps: [
      'No unified public data catalog/API yet',
      'Licensing and schema metadata are not standardized for every dataset',
    ],
  },
  {
    id: 'civic-space',
    name: 'Civic space',
    description:
      'Participation requires room for people and civil society to organize, question, propose, monitor and respond safely.',
    status: 'partial',
    evidence: [
      'Public contribution and participation workflows',
      'Open-source repository and change history',
      'No endorsement requirement to participate',
    ],
    gaps: [
      'No standing multi-stakeholder forum',
      'No formal moderation/governance charter for large-scale deliberation',
    ],
  },
  {
    id: 'institutionalization',
    name: 'Institutionalization',
    description:
      'Open government becomes durable when disclosure, participation, response and evaluation are embedded in official rules, roles and systems rather than depending on one civic project.',
    status: 'institution-dependent',
    evidence: [
      'BetterMakati provides a reference implementation of citizen-facing open-government patterns',
    ],
    gaps: [
      'BetterMakati cannot enact ordinances, executive rules or department mandates',
      'Official APIs, response obligations and publication standards require government adoption',
    ],
  },
  {
    id: 'evaluation',
    name: 'Evaluation',
    description:
      'Open-government initiatives should publish whether they are working, for whom, and where they are falling short.',
    status: 'partial',
    evidence: [
      'Living doctrine audit',
      'Public BetterMakati Status page',
      'Source-watch history',
      'Public project workflow',
      'Published list of performance measures not yet collected',
    ],
    gaps: [
      'No outcome measures for participation, search success, correction time or coverage completeness yet',
    ],
  },
];

export const oecdProvisionAudit: OecdProvisionAudit[] = [
  {
    number: 1,
    title: 'Open-government strategy and leadership commitment',
    status: 'institution-dependent',
    betterMakatiRole:
      'Publishes a doctrine and can prototype measurable commitments and citizen-facing interfaces.',
    institutionalDependency:
      'A citywide official strategy and leadership commitment must be adopted by public institutions themselves.',
  },
  {
    number: 2,
    title: 'Legal and regulatory framework with oversight',
    status: 'institution-dependent',
    betterMakatiRole:
      'Can index and explain existing laws, ordinances, rules and oversight mechanisms.',
    institutionalDependency:
      'Only competent public bodies can enact disclosure, participation, records, ethics and response requirements.',
  },
  {
    number: 3,
    title: 'Mandates, resources and open-government literacy',
    status: 'institution-dependent',
    betterMakatiRole:
      'Can publish reusable patterns, documentation and civic explainers.',
    institutionalDependency:
      'Official roles, budgets, staffing and training require government action.',
  },
  {
    number: 4,
    title: 'Coordination across government',
    status: 'institution-dependent',
    betterMakatiRole:
      'Can connect otherwise fragmented public records into one citizen-facing graph.',
    institutionalDependency:
      'Inter-office data standards, APIs and coordinated workflows require official cooperation.',
  },
  {
    number: 5,
    title: 'Monitoring, evaluation and learning',
    status: 'partial',
    betterMakatiRole:
      'Source monitoring, the living doctrine audit and a public BetterMakati Status page provide an initial public learning loop.',
    institutionalDependency:
      'Government program outcomes and official reform evaluation require access to institutional performance evidence.',
  },
  {
    number: 6,
    title: 'Public communication',
    status: 'partial',
    betterMakatiRole:
      'Translates difficult public records into citizen-facing tools, navigation and context.',
    institutionalDependency:
      'BetterMakati is independent and cannot substitute for official notices or accountable government communication.',
  },
  {
    number: 7,
    title: 'Proactive disclosure and usable public information',
    status: 'partial',
    betterMakatiRole:
      'Strong source, data, records and change-history architecture already exists.',
    institutionalDependency:
      'Completeness and timeliness ultimately depend on what public bodies publish and how consistently they publish it.',
  },
  {
    number: 8,
    title: 'Stakeholder participation across the policy cycle',
    status: 'partial',
    betterMakatiRole:
      'Participation Hub and public community workflow support discovery and civic input.',
    institutionalDependency:
      'Only official decision-makers can guarantee formal standing, reasoned responses and influence over public decisions.',
  },
  {
    number: 9,
    title: 'Innovative digital tools and open-government practices',
    status: 'implemented',
    betterMakatiRole:
      'Search, structured records, open-source code, locality context, offline support and public tracking demonstrate reusable civic-tech patterns.',
    institutionalDependency:
      'Official integration would improve reach, completeness and durability.',
  },
  {
    number: 10,
    title: 'Toward an Open State across institutions and levels',
    status: 'institution-dependent',
    betterMakatiRole:
      'Can model connections among city, barangay, legislative, electoral, audit and national sources.',
    institutionalDependency:
      'A true Open State requires sustained cooperation across branches, levels and autonomous institutions.',
  },
];

export const doctrineStatusLabel: Record<DoctrineStatus, string> = {
  implemented: 'Implemented foundation',
  partial: 'Partial / growing',
  early: 'Early stage',
  'institution-dependent': 'Requires institutional adoption',
};
