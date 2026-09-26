import { accountabilityEntries } from './accountability';
import {
  actualFiscalHistory,
  annualBudgetDocuments,
  budgetSources,
} from './budget2025';
import { cityMonitorSources } from './cityMonitor';
import {
  cityIndicators,
  cityIndicatorSources,
} from './cityIndicators';
import {
  integrityGraphNodes,
  integrityRelationshipSources,
} from './integrityRelationships';
import {
  localLegislationRecords,
  localLegislationSources,
} from './localLegislation';
import { reports } from './reports';
import { election2025Sources } from './election2025';
import { electionCivicSources } from './electionCivic';
import {
  barangayResultSource2025,
  makatiMayoralHistory,
} from './electionHistory';
import { makatiHistory } from './makatiHistory';
import {
  barangays,
  makatiBarangayBoundaryMap,
  makatiBarangayClusterMap,
  makatiBarangayDirectory,
  makatiCitizenCharterSource,
  philHealthYakapClinics2026Source,
  psaBarangaySource,
} from './barangays';
import { serviceDirectory } from './serviceDirectory';
import { serviceGuideDetails } from './serviceGuideDetails';

export type PublicRecordCategory =
  | 'Budget & fiscal'
  | 'Procurement & projects'
  | 'Audit'
  | 'Elections'
  | 'Legislation & law'
  | 'Statistics'
  | 'Services & directories'
  | 'Barangays & maps'
  | 'History & legal records'
  | 'Official notices & monitoring'
  | 'Commitments & outcomes';

export type PublicRecordSourceClass =
  | 'City government'
  | 'National government'
  | 'Court / statute'
  | 'Public institution'
  | 'Research / institutional'
  | 'Media / secondary';

export interface PublicRecordContext {
  label: string;
  href: string;
}

export interface PublicRecordItem {
  id: string;
  title: string;
  url: string;
  publisher: string;
  category: PublicRecordCategory;
  sourceClass: PublicRecordSourceClass;
  official: boolean;
  format: 'PDF' | 'Web page' | 'Data portal' | 'Archive';
  period?: string;
  description: string;
  relatedHref?: string;
  usedBy: string[];
  contexts: PublicRecordContext[];
}

export interface PublicRecordCoverageArea {
  category: PublicRecordCategory;
  count: number;
  included: string;
  limit: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

const formatFor = (url: string): PublicRecordItem['format'] => {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'PDF';
  if (
    lower.includes('openstat') ||
    lower.includes('electionresults') ||
    lower.includes('philgeps') ||
    lower.includes('electiondata')
  ) {
    return 'Data portal';
  }
  if (
    lower.includes('/reports/annual-audit-reports') ||
    lower.includes('/resolutions-and-ordinances/')
  ) {
    return 'Archive';
  }
  return 'Web page';
};

const sourceClassFor = (
  url: string,
  publisher: string
): PublicRecordSourceClass => {
  const lower = (url + ' ' + publisher).toLowerCase();

  if (
    lower.includes('makati.gov.ph') ||
    lower.includes('makati-eboss.ph') ||
    lower.includes('city government of makati')
  ) {
    return 'City government';
  }

  if (lower.includes('lawphil.net')) return 'Court / statute';

  if (
    lower.includes('.gov.ph') ||
    lower.includes('commission on audit') ||
    lower.includes('department of budget') ||
    lower.includes('bureau of local government finance') ||
    lower.includes('philippine statistics authority') ||
    lower.includes('commission on elections') ||
    lower.includes('comelec') ||
    lower.includes('philhealth') ||
    lower.includes('philgeps') ||
    lower.includes('department of education') ||
    lower.includes('deped') ||
    lower.includes('department of social welfare') ||
    lower.includes('tesda') ||
    lower.includes('philippine national police') ||
    lower.includes('government procurement policy board') ||
    lower.includes('philippine information agency') ||
    lower.includes('philippine news agency')
  ) {
    return 'National government';
  }

  if (
    lower.includes('depedncr.com.ph') ||
    lower.includes('up cids') ||
    lower.includes('university of the philippines')
  ) {
    return 'Public institution';
  }

  if (
    lower.includes('journals.gmu.edu') ||
    lower.includes('filipinaslibrary.org.ph') ||
    lower.includes('makatimed.net.ph')
  ) {
    return 'Research / institutional';
  }

  return 'Media / secondary';
};

const categoryForAccountability = (
  type: (typeof accountabilityEntries)[number]['type']
): PublicRecordCategory => {
  if (type === 'fiscal') return 'Budget & fiscal';
  if (type === 'project') return 'Procurement & projects';
  if (type === 'audit') return 'Audit';
  if (type === 'service') return 'Services & directories';
  return 'Commitments & outcomes';
};

const map = new Map<string, PublicRecordItem>();

const add = (input: {
  title: string;
  url: string;
  publisher: string;
  category: PublicRecordCategory;
  period?: string;
  description: string;
  relatedHref?: string;
  usedBy?: string;
  context?: PublicRecordContext;
  sourceClass?: PublicRecordSourceClass;
}) => {
  if (!input.url) return;
  const existing = map.get(input.url);
  const context =
    input.context ??
    (input.relatedHref
      ? {
          label: input.usedBy ?? 'Related BetterMakati page',
          href: input.relatedHref,
        }
      : undefined);

  if (existing) {
    if (input.usedBy && !existing.usedBy.includes(input.usedBy)) {
      existing.usedBy.push(input.usedBy);
    }
    if (!existing.period && input.period) existing.period = input.period;
    if (!existing.relatedHref && input.relatedHref) {
      existing.relatedHref = input.relatedHref;
    }
    if (
      context &&
      !existing.contexts.some(
        item => item.href === context.href && item.label === context.label
      )
    ) {
      existing.contexts.push(context);
    }
    return;
  }

  const sourceClass =
    input.sourceClass ?? sourceClassFor(input.url, input.publisher);

  map.set(input.url, {
    id: slugify(input.title + '-' + input.url),
    title: input.title,
    url: input.url,
    publisher: input.publisher,
    category: input.category,
    sourceClass,
    official:
      sourceClass === 'City government' ||
      sourceClass === 'National government' ||
      sourceClass === 'Court / statute' ||
      sourceClass === 'Public institution',
    format: formatFor(input.url),
    period: input.period,
    description: input.description,
    relatedHref: input.relatedHref,
    usedBy: input.usedBy ? [input.usedBy] : [],
    contexts: context ? [context] : [],
  });
};

for (const document of annualBudgetDocuments) {
  add({
    title: `Makati Annual Budget ${document.year}`,
    url: document.href,
    publisher: 'City Government of Makati',
    category: 'Budget & fiscal',
    period: String(document.year),
    description: 'Original annual city budget document.',
    relatedHref: '/projects-budget',
    usedBy: 'Projects & Budget',
  });
}

for (const item of actualFiscalHistory) {
  add({
    title: `Makati fiscal statement ${item.year}`,
    url: item.href,
    publisher: 'Department of Budget and Management / BLGF',
    category: 'Budget & fiscal',
    period: String(item.year),
    description:
      'DBM/BLGF statement used for the reported Makati receipts and expenditures series.',
    relatedHref: '/projects-budget',
    usedBy: 'Projects & Budget',
  });
}

for (const entry of accountabilityEntries) {
  for (const source of entry.sources) {
    add({
      title: source.label,
      url: source.url,
      publisher: source.publisher,
      category: categoryForAccountability(entry.type),
      period: source.publishedOrPeriod ?? entry.period,
      description: `Evidence source linked to “${entry.title}”.`,
      relatedHref: entry.relatedHref ?? '/accountability',
      usedBy: 'Accountability Ledger',
    });
  }
}

for (const service of serviceDirectory) {
  add({
    title: `${service.agency}: source for ${service.title}`,
    url: service.sourceUrl,
    publisher: service.agency,
    category: 'Services & directories',
    description: `Public source used by the BetterMakati guide for ${service.title}.`,
    relatedHref: `/services/guide/${service.id}`,
    usedBy: 'Services',
  });
}

for (const [serviceId, detail] of Object.entries(serviceGuideDetails)) {
  add({
    title: detail.sourceLabel,
    url: detail.sourceUrl,
    publisher: 'Issuing public body',
    category: 'Services & directories',
    period: detail.lastVerified,
    description: 'Source used for a structured BetterMakati transaction guide.',
    relatedHref: `/services/guide/${serviceId}`,
    usedBy: 'Services',
  });
}

for (const source of cityMonitorSources) {
  add({
    title: source.label,
    url: source.url,
    publisher: source.publisher,
    category: 'Official notices & monitoring',
    description: source.monitoringNote,
    relatedHref: '/city-monitor',
    usedBy: 'City Monitor',
  });
}


const indicatorsBySourceId = new Map<string, string[]>();
for (const indicator of cityIndicators) {
  for (const sourceId of indicator.provenance.sourceIds) {
    const current = indicatorsBySourceId.get(sourceId) ?? [];
    current.push(indicator.title);
    indicatorsBySourceId.set(sourceId, current);
  }
}

for (const source of Object.values(cityIndicatorSources)) {
  const usedByIndicators = indicatorsBySourceId.get(source.id) ?? [];
  add({
    title: source.label,
    url: source.url,
    publisher: source.publisher,
    category: 'Statistics',
    description:
      usedByIndicators.length > 0
        ? 'Primary or supporting source used by BetterMakati Statistics: ' +
          usedByIndicators.join(' · ')
        : 'Source registered in the BetterMakati Statistics evidence layer.',
    relatedHref: '/statistics',
    usedBy: 'Statistics',
    context: {
      label: 'Statistics',
      href: '/statistics',
    },
  });
}

const legislationSourceById = new Map(
  Object.values(localLegislationSources).map(source => [source.id, source] as const)
);

for (const record of localLegislationRecords) {
  const sourceIds = new Set<string>([
    ...record.reference.sourceIds,
    ...record.provenance.sourceIds,
    ...record.documents.flatMap(document => document.sourceIds),
    ...record.lifecycle.flatMap(event => event.sourceIds),
    ...record.sessionEvidence.flatMap(evidence => evidence.sourceIds),
    ...record.relationships.flatMap(relationship => relationship.sourceIds),
  ]);

  for (const sourceId of sourceIds) {
    const source = legislationSourceById.get(sourceId);
    if (!source) continue;
    add({
      title: source.label,
      url: source.url,
      publisher: source.publisher,
      category: 'Legislation & law',
      description:
        source.note ??
        'Official source used by the canonical BetterMakati legislation record.',
      relatedHref:
        '/legislation?record=' + encodeURIComponent(record.id),
      usedBy: 'Legislation',
      context: {
        label: record.reference.display,
        href: '/legislation?record=' + encodeURIComponent(record.id),
      },
    });
  }

  for (const document of record.documents) {
    add({
      title: document.label,
      url: document.url,
      publisher: document.publisher,
      category: 'Legislation & law',
      description:
        document.note ??
        'Document attached to the canonical BetterMakati legislation record.',
      relatedHref:
        '/legislation?record=' + encodeURIComponent(record.id),
      usedBy: 'Legislation',
      context: {
        label: record.reference.display,
        href: '/legislation?record=' + encodeURIComponent(record.id),
      },
    });
  }
}

const integritySectionForRecordType = (recordType: string) =>
  recordType === 'procurement-award' || recordType === 'entity'
    ? '/integrity#procurement'
    : recordType === 'disclosure'
      ? '/integrity#disclosures'
      : '/integrity#audits';

for (const source of integrityRelationshipSources) {
  const relatedNodes = integrityGraphNodes.filter(node =>
    node.sourceIds.includes(source.id)
  );
  const integrityCategory: PublicRecordCategory =
    relatedNodes.some(node =>
      ['audit-finding', 'audit-action', 'audit-resolution-trail'].includes(
        node.ref.recordType
      )
    )
      ? 'Audit'
      : 'Procurement & projects';

  if (relatedNodes.length === 0) {
    add({
      title: source.label,
      url: source.url,
      publisher: source.publisher,
      category: integrityCategory,
      period: source.publishedOrPeriod,
      description: 'Source registered in the BetterMakati Integrity evidence layer.',
      relatedHref: '/integrity',
      usedBy: 'Integrity',
      context: { label: 'Integrity', href: '/integrity' },
    });
    continue;
  }

  for (const node of relatedNodes) {
    const href = integritySectionForRecordType(node.ref.recordType);
    add({
      title: source.label,
      url: source.url,
      publisher: source.publisher,
      category: integrityCategory,
      period: source.publishedOrPeriod,
      description: 'Source used by the BetterMakati Integrity evidence layer.',
      relatedHref: href,
      usedBy: 'Integrity',
      context: {
        label: node.label,
        href,
      },
    });
  }
}

const reportCategory = (slug: string): PublicRecordCategory => {
  if (slug.includes('audit')) return 'Audit';
  if (slug.includes('population')) return 'Statistics';
  return 'Budget & fiscal';
};

for (const report of reports) {
  for (const source of report.sources) {
    if (
      source.sourceKind === 'canonical-internal' ||
      !/^https?:\/\//.test(source.href)
    ) {
      continue;
    }

    add({
      title: source.label,
      url: source.href,
      publisher: source.publisher ?? 'Published source',
      category: reportCategory(report.slug),
      period: source.publishedOrPeriod,
      description:
        source.note ??
        'External source cited by a BetterMakati Featured Report.',
      relatedHref: '/reports/' + report.slug,
      usedBy: 'Featured Reports',
      context: {
        label: report.headline,
        href: '/reports/' + report.slug,
      },
    });
  }
}

add({
  title: 'COMELEC 2025 election results portal',
  url: election2025Sources.officialResults,
  publisher: 'Commission on Elections',
  category: 'Elections',
  period: '2025',
  description: 'Official 2025 election results portal.',
  relatedHref: '/elections',
  usedBy: 'Elections',
});
add({
  title: 'Makati 2025 official candidate list',
  url: election2025Sources.candidateList,
  publisher: 'Commission on Elections',
  category: 'Elections',
  period: '2025',
  description: 'Official Makati candidate list for the 2025 national and local elections.',
  relatedHref: '/elections',
  usedBy: 'Elections',
});
add({
  title: 'Makati 2025 local election result table',
  url: election2025Sources.localResults,
  publisher: 'Rappler / COMELEC Media Server',
  category: 'Elections',
  period: '2025',
  description: 'Published local-race table used to cross-check 2025 Makati results.',
  relatedHref: '/elections',
  usedBy: 'Elections',
});
for (const [key, source] of Object.entries(electionCivicSources)) {
  const meta: Record<string, { title: string; publisher: string; period: string; description: string; sourceClass?: PublicRecordSourceClass }> = {
    bskeCalendar: {
      title: 'COMELEC 2026 BSKE calendar',
      publisher: 'Commission on Elections',
      period: '2026',
      description: 'Official calendar of activities for the November 2, 2026 Barangay and Sangguniang Kabataan Elections.',
    },
    registrationRules: {
      title: 'COMELEC 2026 BSKE voter-registration rules',
      publisher: 'Commission on Elections',
      period: '2025–2026',
      description: 'Official rules governing the continuing registration period for the 2026 BSKE.',
    },
    filingRules: {
      title: 'COMELEC 2026 BSKE certificate-of-candidacy filing rules',
      publisher: 'Commission on Elections',
      period: '2026',
      description: 'Official amended filing rules for certificates of candidacy in the 2026 BSKE.',
    },
    termLaw: {
      title: 'Republic Act No. 12232',
      publisher: 'Republic of the Philippines / Lawphil',
      period: '2025',
      description: 'Statute setting four-year barangay and SK terms and the November 2026 election schedule.',
      sourceClass: 'Court / statute',
    },
    termRules: {
      title: 'COMELEC Resolution No. 11207',
      publisher: 'Commission on Elections',
      period: '2026',
      description: 'COMELEC implementing rules for Republic Act No. 12232, including the 2026 transition.',
    },
    precinctFinder: {
      title: 'COMELEC Precinct Finder',
      publisher: 'Commission on Elections',
      period: 'Current',
      description: 'Official voter-status, precinct and voting-center lookup tool.',
    },
    comelec: {
      title: 'COMELEC official website',
      publisher: 'Commission on Elections',
      period: 'Current',
      description: 'Primary election-authority portal for resolutions, candidate records and late changes.',
    },
  };
  const item = meta[key];
  if (!item) continue;
  add({
    title: item.title,
    url: source,
    publisher: item.publisher,
    category: 'Elections',
    period: item.period,
    description: item.description,
    relatedHref: '/elections',
    usedBy: 'Elections',
    sourceClass: item.sourceClass,
  });
}

add({
  title: 'PSA Makati barangay population classification',
  url: election2025Sources.population,
  publisher: 'Philippine Statistics Authority',
  category: 'Statistics',
  period: '2024',
  description: 'PSGC/PSA source for Makati barangay population and classification.',
  relatedHref: '/statistics',
  usedBy: 'Statistics',
});

for (const race of makatiMayoralHistory) {
  add({
    title: race.sourceLabel,
    url: race.sourceUrl,
    publisher:
      race.sourceQuality === 'academic'
        ? 'UP CIDS'
        : race.sourceQuality === 'official'
          ? 'Commission on Elections'
          : 'Published election source',
    category: 'Elections',
    period: String(race.year),
    description: `Source used for the ${race.year} Makati mayoral result series.`,
    relatedHref: '/elections',
    usedBy: 'Election history',
    sourceClass:
      race.sourceQuality === 'academic'
        ? 'Public institution'
        : race.sourceQuality === 'official'
          ? 'National government'
          : race.sourceQuality === 'mixed'
            ? sourceClassFor(race.sourceUrl, race.sourceLabel)
            : 'Media / secondary',
  });
}

add({
  title: barangayResultSource2025.label,
  url: barangayResultSource2025.url,
  publisher: 'Published election reporting',
  category: 'Elections',
  period: '2025',
  description: barangayResultSource2025.note,
  relatedHref: '/elections',
  usedBy: 'Barangay election context',
});

for (const event of makatiHistory) {
  add({
    title: event.source.label,
    url: event.source.url,
    publisher:
      event.source.kind === 'Legal record'
        ? 'Public legal record'
        : event.source.kind === 'Scholarly account'
          ? 'Research publication'
          : 'Institutional source',
    category:
      event.source.kind === 'Legal record'
        ? 'History & legal records'
        : 'History & legal records',
    period: event.date,
    description: `Source used in the Makati chronology for “${event.title}”.`,
    relatedHref: '/history',
    usedBy: 'History',
    sourceClass:
      event.source.kind === 'Legal record'
        ? sourceClassFor(event.source.url, event.source.label)
        : event.source.kind === 'Scholarly account'
          ? 'Research / institutional'
          : sourceClassFor(event.source.url, event.source.label),
  });
}

add({
  title: 'Makati resolutions and ordinances archive',
  url: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
  publisher: 'City Government of Makati',
  category: 'Legislation & law',
  description: 'Official city archive for Makati resolutions and ordinances.',
  relatedHref: '/legislation',
  usedBy: 'Legislation',
});
add({
  title: 'Republic Act No. 7854 — Makati City Charter',
  url: 'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html',
  publisher: 'Lawphil / Supreme Court E-Library ecosystem',
  category: 'Legislation & law',
  period: '1995',
  description: 'Statutory city charter of Makati.',
  relatedHref: '/legislation',
  usedBy: 'Legislation',
  sourceClass: 'Court / statute',
});

add({
  title: 'PSA OpenSTAT Makati population table',
  url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0211A6DAPG0.px/',
  publisher: 'Philippine Statistics Authority',
  category: 'Statistics',
  period: '2010–2024',
  description: 'Comparable population series used by BetterMakati.',
  relatedHref: '/statistics',
  usedBy: 'Statistics',
});
add({
  title: 'PSA 2024 provincial and HUC economic performance',
  url: 'https://psa.gov.ph/content/2024-economic-performance-provinces-and-highly-urbanized-cities-philippines-capita-gross',
  publisher: 'Philippine Statistics Authority',
  category: 'Statistics',
  period: '2024',
  description: 'Source for Makati economic-output indicators.',
  relatedHref: '/statistics',
  usedBy: 'Statistics',
});

const barangayCoreSources = [
  {
    title: 'Makati barangay directory',
    url: makatiBarangayDirectory,
    publisher: 'City Government of Makati',
    description: 'Official Makati barangay directory.',
  },
  {
    title: 'PSA Makati barangay classification',
    url: psaBarangaySource,
    publisher: 'Philippine Statistics Authority',
    description: 'PSGC source for Makati barangays and population.',
  },
  {
    title: 'Makati Citizen’s Charter 2023',
    url: makatiCitizenCharterSource,
    publisher: 'City Government of Makati',
    description: 'Citizen’s Charter used for common barangay and city transactions.',
  },
  {
    title: 'PhilHealth YAKAP accredited facilities list',
    url: philHealthYakapClinics2026Source,
    publisher: 'PhilHealth',
    description: 'Accreditation list used to verify Makati government YAKAP clinics.',
  },
  {
    title: 'Makati Barangay Boundary Map',
    url: makatiBarangayBoundaryMap,
    publisher: 'City Government of Makati',
    description: 'Official city barangay boundary map.',
  },
  {
    title: 'Makati Barangay Cluster Map',
    url: makatiBarangayClusterMap,
    publisher: 'City Government of Makati',
    description: 'Official city barangay cluster map.',
  },
];

for (const source of barangayCoreSources) {
  add({
    ...source,
    category: 'Barangays & maps',
    relatedHref: '/barangays',
    usedBy: 'BetterBarangay',
  });
}

for (const barangay of barangays) {
  if (barangay.officialPageUrl) {
    add({
      title: `Barangay ${barangay.name} official city page`,
      url: barangay.officialPageUrl,
      publisher: 'City Government of Makati',
      category: 'Barangays & maps',
      description: `Official city profile/page for Barangay ${barangay.name}.`,
      relatedHref: `/barangays/${barangay.slug}`,
      usedBy: 'BetterBarangay',
    });
  }
  if (barangay.hallSource) {
    add({
      title: barangay.hallSourceLabel ?? `Barangay ${barangay.name} hall source`,
      url: barangay.hallSource,
      publisher: 'Barangay / City Government of Makati',
      category: 'Barangays & maps',
      description: `Source used for Barangay ${barangay.name} hall contact information.`,
      relatedHref: `/barangays/${barangay.slug}`,
      usedBy: 'BetterBarangay',
    });
  }
  if (barangay.officials?.source) {
    add({
      title:
        barangay.officials.sourceLabel ??
        `Barangay ${barangay.name} officials source`,
      url: barangay.officials.source,
      publisher: 'Barangay / City Government of Makati',
      category: 'Barangays & maps',
      period: barangay.officials.term,
      description: `Source used for Barangay ${barangay.name} officials.`,
      relatedHref: `/barangays/${barangay.slug}`,
      usedBy: 'BetterBarangay',
    });
  }
  if (barangay.officials?.statusSource) {
    add({
      title:
        barangay.officials.statusSourceLabel ??
        `Barangay ${barangay.name} officials status source`,
      url: barangay.officials.statusSource,
      publisher: 'Public source',
      category: 'Barangays & maps',
      period: barangay.officials.lastVerified,
      description: `Additional status source for Barangay ${barangay.name} officials.`,
      relatedHref: `/barangays/${barangay.slug}`,
      usedBy: 'BetterBarangay',
    });
  }
}

add({
  title: 'Makati official portal',
  url: 'https://www.makati.gov.ph/',
  publisher: 'City Government of Makati',
  category: 'Official notices & monitoring',
  description: 'Primary city portal and source-discovery entry point.',
  relatedHref: '/records',
  usedBy: 'Public Records',
});
add({
  title: 'Commission on Audit annual audit reports',
  url: budgetSources.audit,
  publisher: 'Commission on Audit',
  category: 'Audit',
  description: 'National audit archive used for Makati annual audit research.',
  relatedHref: '/integrity',
  usedBy: 'Integrity & Audit',
});
add({
  title: 'PhilGEPS procurement notices',
  url: budgetSources.procurement,
  publisher: 'Philippine Government Electronic Procurement System',
  category: 'Procurement & projects',
  description: 'National procurement portal for public procurement notices and records.',
  relatedHref: '/projects-budget',
  usedBy: 'Projects & Budget',
});

export const publicRecordsReviewed = '26 September 2026';

export const publicRecords = [...map.values()].sort((a, b) => {
  if (a.official !== b.official) return a.official ? -1 : 1;
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  const periodCompare = (b.period ?? '').localeCompare(a.period ?? '');
  if (periodCompare !== 0) return periodCompare;
  return a.title.localeCompare(b.title);
});

export const publicRecordById = new Map(
  publicRecords.map(record => [record.id, record] as const)
);

export const publicRecordByUrl = new Map(
  publicRecords.map(record => [record.url, record] as const)
);

export const publicRecordCategories: PublicRecordCategory[] = [
  'Budget & fiscal',
  'Procurement & projects',
  'Audit',
  'Elections',
  'Legislation & law',
  'Statistics',
  'Services & directories',
  'Barangays & maps',
  'History & legal records',
  'Official notices & monitoring',
  'Commitments & outcomes',
];

const coverageNotes: Record<
  PublicRecordCategory,
  { included: string; limit: string }
> = {
  'Budget & fiscal': {
    included:
      'Annual budgets from 2014–2026, DBM/BLGF fiscal statements from 2019–2025, dedicated-fund and SEF evidence linked elsewhere in BetterMakati.',
    limit:
      'Not every department-level budget sheet or quarterly utilization schedule has been normalized into a separate catalog row.',
  },
  'Procurement & projects': {
    included:
      'PhilGEPS, structured Makati bid-result disclosures and project-linked evidence already used by Projects & Budget and Accountability.',
    limit:
      'Contracts, notices to proceed, implementation and completion documents remain incomplete for many awards.',
  },
  Audit: {
    included:
      'COA annual-report archive, selected Makati audit records and the 2024 SEF compliance-audit landing record.',
    limit:
      'Finding-level coverage and later resolution status are not yet exhaustive.',
  },
  Elections: {
    included:
      'COMELEC 2025 results/candidate sources plus the source trail used for Makati mayoral history.',
    limit:
      'Older elections rely partly on academic or archival-secondary result tables when a stable official machine-readable source is not available.',
  },
  'Legislation & law': {
    included:
      'Official Makati resolutions/ordinances archive, 11,355 canonical local measure identities searchable through BetterMakati, and the Makati City Charter.',
    limit:
      'Public Records keeps source documents at source level. Individual measures resolve to the canonical Legislation record, and a direct official-document link is shown only when the official archive exposes one.',
  },
  Statistics: {
    included:
      'PSA population, PSGC and economic-output sources used by the Statistics and election-context pages.',
    limit:
      'This catalog indexes datasets BetterMakati currently uses; it is not a full catalog of every PSA table containing Makati.',
  },
  'Services & directories': {
    included:
      'Source documents and agency pages used by the 151-service directory and structured transaction guides.',
    limit:
      'Long-tail services may point to an agency portal or broad charter rather than a transaction-specific current document.',
  },
  'Barangays & maps': {
    included:
      'City/PSA barangay directories, boundary maps, Citizen’s Charter, YAKAP facility list and source-backed barangay contact/official records.',
    limit:
      'Barangay-level budgets, procurement, ordinances, resolutions and project files are still uneven across the 23 barangays.',
  },
  'History & legal records': {
    included:
      'Legal, institutional and scholarly sources cited in the Makati chronology.',
    limit:
      'Historical research is intentionally source-led and does not claim exhaustive archival coverage.',
  },
  'Official notices & monitoring': {
    included:
      'Official city news, events, publications, legislation and procurement discovery sources watched by City Monitor.',
    limit:
      'A monitored collection page is a discovery source; a detected change still needs human review before it becomes a substantive record.',
  },
  'Commitments & outcomes': {
    included:
      'Public sources used to substantiate selected commitments and later delivery evidence.',
    limit:
      'This remains a selective evidence trail rather than a comprehensive inventory of every public promise.',
  },
};

export const publicRecordCoverage: PublicRecordCoverageArea[] =
  publicRecordCategories.map(category => ({
    category,
    count: publicRecords.filter(record => record.category === category).length,
    ...coverageNotes[category],
  }));

export const publicRecordOfficialCount = publicRecords.filter(
  record => record.official
).length;

export const publicRecordSecondaryCount =
  publicRecords.length - publicRecordOfficialCount;
