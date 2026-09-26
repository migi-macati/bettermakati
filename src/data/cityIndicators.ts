import { currentMakatiPopulation2024 } from './barangays';
import {
  cityComparisonRows,
  cityComparisonSource,
} from './cityComparison';

export type CityIndicatorTopic =
  | 'population-demographics'
  | 'economy-business'
  | 'finance'
  | 'services'
  | 'land-infrastructure'
  | 'environment'
  | 'mobility'
  | 'health'
  | 'education'
  | 'other';

export type IndicatorBoundaryBasis =
  | 'makati-current-23'
  | 'makati-historical-33'
  | 'canonical-barangay'
  | 'as-published'
  | 'other';

export type IndicatorPeriodKind =
  | 'year'
  | 'census-year'
  | 'fiscal-year'
  | 'quarter'
  | 'month'
  | 'date'
  | 'as-of'
  | 'range'
  | 'current';

export interface CityIndicatorPeriod {
  kind: IndicatorPeriodKind;
  label: string;
  year?: number;
  start?: string;
  end?: string;
  asOf?: string;
}

export interface CityIndicatorGeography {
  type: 'city' | 'barangay' | 'comparison-area' | 'other';
  id: string;
  label: string;
  boundaryBasis: IndicatorBoundaryBasis;
  barangaySlug?: string;
  note?: string;
}

export interface CityIndicatorObservation {
  value: number | string | boolean;
  period: CityIndicatorPeriod;
  geography: CityIndicatorGeography;
  sourceIds: string[];
  dimensions?: Record<string, string>;
  status?: 'published' | 'provisional' | 'revised' | 'estimated';
  note?: string;
}

export interface CityIndicatorDimension {
  id: string;
  label: string;
  description?: string;
}

export interface CityIndicatorSource {
  id: string;
  label: string;
  publisher: string;
  url: string;
  sourceClass:
    | 'city-government'
    | 'national-government'
    | 'public-institution'
    | 'other';
  role: 'primary-data' | 'definition' | 'methodology' | 'cross-check';
  checkedAt: string;
  matrix?: string;
}

export type CityIndicatorData =
  | {
      kind: 'inline-observations';
      observations: CityIndicatorObservation[];
      note?: string;
    }
  | {
      kind: 'canonical-reference';
      owner:
        | 'barangays'
        | 'city-comparison'
        | 'budget-finance'
        | 'place-registry'
        | 'services'
        | 'accountability'
        | 'city-monitor'
        | 'public-records'
        | 'elections'
        | 'other';
      module: string;
      exportName: string;
      field?: string;
      selector?: string;
      note?: string;
    }
  | {
      kind: 'source-table-reference';
      sourceId: string;
      matrix?: string;
      table?: string;
      selectors?: Record<string, string | string[]>;
      materializationStatus: 'source-bound' | 'partially-materialized';
      materializedObservations?: CityIndicatorObservation[];
      note?: string;
    }
  | {
      kind: 'derived';
      dependencies: string[];
      method:
        | 'sum'
        | 'difference'
        | 'ratio'
        | 'percentage-share'
        | 'percentage-change'
        | 'per-capita'
        | 'custom';
      description: string;
      note?: string;
    };

export interface CityIndicatorRecord {
  id: string;
  title: string;
  shortLabel?: string;
  topic: CityIndicatorTopic;
  definition: {
    measure: string;
    description: string;
    basis: string;
    interpretation?: string;
    caveat?: string;
  };
  unit: {
    kind:
      | 'count'
      | 'currency'
      | 'percentage'
      | 'rate'
      | 'ratio'
      | 'area'
      | 'classification'
      | 'text'
      | 'index'
      | 'custom';
    code: string;
    symbol?: string;
    scale?: number;
    per?: string;
    decimalPlaces?: number;
  };
  dimensions?: CityIndicatorDimension[];
  data: CityIndicatorData;
  provenance: {
    sourceIds: string[];
    note?: string;
  };
  revision: {
    schemaVersion: number;
    lastReviewed: string;
    status: 'verified' | 'provisional' | 'needs-review' | 'retired';
    note?: string;
  };
  comparability: {
    status:
      | 'comparable'
      | 'series-break'
      | 'limited'
      | 'not-comparable'
      | 'not-applicable';
    geographyBasis:
      | IndicatorBoundaryBasis
      | 'mixed'
      | 'not-applicable';
    note?: string;
  };
  relationships: Array<{
    kind:
      | 'applies-to'
      | 'breakdown-of'
      | 'derived-from'
      | 'related-indicator'
      | 'place-context'
      | 'service-context'
      | 'project-context'
      | 'accountability-context'
      | 'city-monitor-context'
      | 'public-record-source'
      | 'report-analysis'
      | 'legislation-context'
      | 'integrity-context'
      | 'ecosystem-context';
    targetType:
      | 'indicator'
      | 'barangay'
      | 'place'
      | 'segment'
      | 'route'
      | 'service'
      | 'project'
      | 'accountability-record'
      | 'city-monitor-record'
      | 'public-record'
      | 'report'
      | 'legislation-record'
      | 'integrity-entity'
      | 'ecosystem-resource';
    targetId: string;
    note?: string;
  }>;
  tags: string[];
}

const checkedAt = '2026-09-26';

export const cityIndicatorSources: Record<string, CityIndicatorSource> = {
  'psa-openstat-population-growth-2024': {
    id: 'psa-openstat-population-growth-2024',
    label:
      'Population and Annual Population Growth Rate based on the 2010, 2015, 2020 and 2024 censuses',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0211A6DAPG0.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '1A6DAPG0',
  },
  'psa-openstat-households-ncr-2024': {
    id: 'psa-openstat-households-ncr-2024',
    label:
      'Total Population, Household Population, and Number of Households by Province, City, Municipality, and Barangay as of 01 July 2024 — NCR',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0171A6DTHP6.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '1A6DTHP6',
  },
  'psa-openstat-household-size-2024': {
    id: 'psa-openstat-household-size-2024',
    label:
      'Total Population, Household Population, Number of Households and Average Household Size by Region, Province, and Highly Urbanized City: Philippines, 2024',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0191A6DTHP8.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '1A6DTHP8',
  },
  'psa-openstat-age-sex-2024': {
    id: 'psa-openstat-age-sex-2024',
    label:
      'Household Population by Age-Group, Region, Province, and Highly Urbanized City: Philippines, 2024 Census of Population',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0201A6DPAG0.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '1A6DPAG0',
  },
  'psa-openstat-density-2024': {
    id: 'psa-openstat-density-2024',
    label:
      'Population, Land Area, Population Density, and Percent Change in Population Density: 2015, 2020, and 2024',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0221A6DLPD0.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '1A6DLPD0',
  },
  'psa-ppa-gdp-level-matrix': {
    id: 'psa-ppa-gdp-level-matrix',
    label: 'Gross Domestic Product by Province and HUC',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0012A5FPPA0.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '2A5FPPA0',
  },
  'psa-ppa-gdp-growth-matrix': {
    id: 'psa-ppa-gdp-growth-matrix',
    label: 'Gross Domestic Product by Province and HUC, Growth Rates',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0032A5FPPA2.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '2A5FPPA2',
  },
  'psa-ppa-2025-release': {
    id: 'psa-ppa-2025-release',
    label:
      'PSA Releases the 2025 Economic Performance of the 82 Provinces and 33 Highly Urbanized Cities',
    publisher: 'Philippine Statistics Authority',
    url: 'https://psa.gov.ph/content/psa-releases-2025-economic-performance-82-provinces-and-33-highly-urbanized-cities',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
  },
  'psa-ppa-regional-share-matrix': {
    id: 'psa-ppa-regional-share-matrix',
    label: 'Gross Domestic Product Percent Share by Province and HUC',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0052A5FPPA4.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '2A5FPPA4',
  },
  'psa-ppa-industry-gva-matrix': {
    id: 'psa-ppa-industry-gva-matrix',
    label: 'Gross Domestic Product by Industry, Province and HUC',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0022A5FPPA1.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '2A5FPPA1',
  },
  'psa-ppa-industry-growth-matrix': {
    id: 'psa-ppa-industry-growth-matrix',
    label: 'Gross Domestic Product Growth Rates by Industry, Province and HUC',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
  },
  'psa-ppa-per-capita-matrix': {
    id: 'psa-ppa-per-capita-matrix',
    label: 'Per Capita Gross Domestic Product by Province and HUC',
    publisher: 'Philippine Statistics Authority',
    url: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2A__PPA/0092A5FPPA8.px/',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
    matrix: '2A5FPPA8',
  },
  'psa-ppa-makati-2024-release': {
    id: 'psa-ppa-makati-2024-release',
    label:
      'The City of Makati Posts 7.3 Percent Economic Growth in 2024, Tops Nation in Per Capita GDP',
    publisher: 'Philippine Statistics Authority — NCR',
    url: cityComparisonSource,
    sourceClass: 'national-government',
    role: 'cross-check',
    checkedAt,
  },
  'psa-lfs-ncr-2025-huc': {
    id: 'psa-lfs-ncr-2025-huc',
    label: 'Highlights of the Labor Force Survey in the National Capital Region, 2025',
    publisher: 'Philippine Statistics Authority — NCR',
    url: 'https://rssoncr.psa.gov.ph/content/number-underemployed-persons-national-capital-region-decreased-384-thousand-filipinos-aged',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
  },
  'makati-elccap-2024-2054': {
    id: 'makati-elccap-2024-2054',
    label: 'Enhanced Local Climate Change Action Plan for the City of Makati 2024–2054',
    publisher: 'City Government of Makati',
    url: 'https://www.makati.gov.ph/assets/uploads/downloads/2/841/842/pdf/Makati%20eLCCAP%202024-2054.pdf',
    sourceClass: 'city-government',
    role: 'primary-data',
    checkedAt,
  },
  'makati-basic-facts-2023': {
    id: 'makati-basic-facts-2023',
    label: 'Makati City Basic Facts and Figures 2023',
    publisher: 'City Government of Makati — Urban Development Department',
    url: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1720150266681.pdf',
    sourceClass: 'city-government',
    role: 'primary-data',
    checkedAt,
  },
  'deped-national-inventory-dashboard-makati-2026': {
    id: 'deped-national-inventory-dashboard-makati-2026',
    label: 'Makati City, NCR — Schools — National Inventory Dashboard',
    publisher: 'Department of Education',
    url: 'https://nid.deped.gov.ph/public-dashboard/region/NCR/division/Makati%20City',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
  },
  'philhealth-yakap-gamot-2026-07': {
    id: 'philhealth-yakap-gamot-2026-07',
    label: 'List of Accredited YAKAP Clinics with Available GAMOT Prescription for CY 2026',
    publisher: 'Philippine Health Insurance Corporation',
    url: 'https://www.philhealth.gov.ph/partners/providers/facilities/accredited/YAKAP.pdf',
    sourceClass: 'national-government',
    role: 'primary-data',
    checkedAt,
  },
};

export const currentMakatiPopulation = currentMakatiPopulation2024;

const makati2024Comparison = cityComparisonRows.find(row => row.isMakati);
if (!makati2024Comparison) {
  throw new Error('Makati is missing from the canonical 2024 city comparison.');
}

export const makati2024GdpPerPerson = makati2024Comparison.gdpPerPerson;

const currentMakati: CityIndicatorGeography = {
  type: 'city',
  id: 'makati-current-23',
  label: 'Makati City',
  boundaryBasis: 'makati-current-23',
};

const makatiAsPublished: CityIndicatorGeography = {
  type: 'city',
  id: 'makati-as-published',
  label: 'Makati City',
  boundaryBasis: 'as-published',
};

const censusYear = (year: number): CityIndicatorPeriod => ({
  kind: 'census-year',
  label: String(year),
  year,
});

const year = (value: number): CityIndicatorPeriod => ({
  kind: 'year',
  label: String(value),
  year: value,
});

const range = (label: string): CityIndicatorPeriod => ({
  kind: 'range',
  label,
});

const asOf = (date: string): CityIndicatorPeriod => ({
  kind: 'as-of',
  label: date,
  asOf: date,
});

const sourceBound = (
  sourceId: string,
  options: {
    matrix?: string;
    table?: string;
    selectors?: Record<string, string | string[]>;
    materializedObservations?: CityIndicatorObservation[];
    note?: string;
  } = {}
): CityIndicatorData => ({
  kind: 'source-table-reference',
  sourceId,
  matrix: options.matrix,
  table: options.table,
  selectors: options.selectors,
  materializationStatus: options.materializedObservations
    ? 'partially-materialized'
    : 'source-bound',
  materializedObservations: options.materializedObservations,
  note: options.note,
});

const indicator = (
  id: string,
  record: Omit<CityIndicatorRecord, 'id'>
): CityIndicatorRecord => ({ id, ...record });

const verifiedRevision = {
  schemaVersion: 1,
  lastReviewed: checkedAt,
  status: 'verified' as const,
};

export const cityIndicators: CityIndicatorRecord[] = [
  indicator('population-total', {
    title: 'Makati population',
    shortLabel: 'Population',
    topic: 'population-demographics',
    definition: {
      measure: 'Resident population',
      description:
        'Population of Makati on the current 23-barangay boundary for the stated census/POPCEN year.',
      basis:
        'PSA comparable city population series; the 2024 observation is reconciled to the sum of the 23 canonical barangay records.',
    },
    unit: { kind: 'count', code: 'person', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 263683,
          period: censusYear(2010),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
        {
          value: 280150,
          period: censusYear(2015),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
        {
          value: 292743,
          period: censusYear(2020),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
        {
          value: currentMakatiPopulation,
          period: censusYear(2024),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
          note:
            'Resolved from the canonical 23 barangay population records; current sum must remain 309,770 unless the canonical source is revised.',
        },
      ],
    },
    provenance: {
      sourceIds: ['psa-openstat-population-growth-2024'],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
      note:
        'The PSA series explicitly excludes the 10 barangays transferred to Taguig.',
    },
    relationships: [],
    tags: ['population', 'demographics'],
  }),

  indicator('population-growth-rate', {
    title: 'Average annual population growth',
    shortLabel: 'Population growth',
    topic: 'population-demographics',
    definition: {
      measure: 'Average annual population growth rate',
      description:
        'PSA-reported average annual rate of change between consecutive census/POPCEN observations.',
      basis:
        'Use the PSA published rate rather than recomputing a simple calendar-year CAGR.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 2 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 1.16,
          period: range('2010–2015'),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
        {
          value: 0.93,
          period: range('2015–2020'),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
        {
          value: 1.37,
          period: range('2020–2024'),
          geography: currentMakati,
          sourceIds: ['psa-openstat-population-growth-2024'],
        },
      ],
    },
    provenance: { sourceIds: ['psa-openstat-population-growth-2024'] },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'population-total' }],
    tags: ['population', 'growth'],
  }),

  indicator('household-population', {
    title: 'Household population',
    topic: 'population-demographics',
    definition: {
      measure: 'Household population',
      description:
        'Population living in households for the stated current Makati geography.',
      basis: 'PSA 2024 Census of Population household table.',
    },
    unit: { kind: 'count', code: 'person', decimalPlaces: 0 },
    data: sourceBound('psa-openstat-households-ncr-2024', {
      matrix: '1A6DTHP6',
      selectors: {
        geography: ['Makati City', 'current Makati barangays'],
        measure: 'Household Population',
        period: '2024',
      },
      note:
        'Source-bound until the complete city/barangay table is safely materialized; do not infer missing barangay values from a city total.',
    }),
    provenance: {
      sourceIds: [
        'psa-openstat-households-ncr-2024',
        'psa-openstat-household-size-2024',
      ],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [],
    tags: ['population', 'households'],
  }),

  indicator('number-of-households', {
    title: 'Number of households',
    topic: 'population-demographics',
    definition: {
      measure: 'Households',
      description: 'Number of households on the stated current Makati geography.',
      basis: 'PSA 2024 Census of Population household table.',
    },
    unit: { kind: 'count', code: 'household', decimalPlaces: 0 },
    data: sourceBound('psa-openstat-households-ncr-2024', {
      matrix: '1A6DTHP6',
      selectors: {
        geography: ['Makati City', 'current Makati barangays'],
        measure: 'Number of Households',
        period: '2024',
      },
    }),
    provenance: {
      sourceIds: [
        'psa-openstat-households-ncr-2024',
        'psa-openstat-household-size-2024',
      ],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [],
    tags: ['households'],
  }),

  indicator('average-household-size', {
    title: 'Average household size',
    topic: 'population-demographics',
    definition: {
      measure: 'Average household size',
      description: 'Average household population per household.',
      basis:
        'Use the published PSA city value. Barangay values may be derived only from matching household-population and household-count observations.',
    },
    unit: { kind: 'rate', code: 'persons-per-household', per: 'household', decimalPlaces: 2 },
    data: sourceBound('psa-openstat-household-size-2024', {
      matrix: '1A6DTHP8',
      selectors: {
        geography: 'Makati City',
        measure: 'Average Household Size',
        period: '2024',
      },
    }),
    provenance: {
      sourceIds: [
        'psa-openstat-household-size-2024',
        'psa-openstat-households-ncr-2024',
      ],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [
      { kind: 'related-indicator', targetType: 'indicator', targetId: 'household-population' },
      { kind: 'related-indicator', targetType: 'indicator', targetId: 'number-of-households' },
    ],
    tags: ['households'],
  }),

  indicator('age-group-population', {
    title: 'Household population by age group',
    topic: 'population-demographics',
    definition: {
      measure: 'Household population by age group',
      description: '2024 household population distributed by PSA age group.',
      basis: 'PSA 2024 Census of Population HUC age/sex table.',
      caveat: 'This official table is city/HUC-level; no barangay age profile is inferred.',
    },
    unit: { kind: 'count', code: 'person', decimalPlaces: 0 },
    dimensions: [{ id: 'age-group', label: 'Age group' }],
    data: sourceBound('psa-openstat-age-sex-2024', {
      matrix: '1A6DPAG0',
      selectors: {
        geography: 'Makati City',
        measure: 'Household Population',
        breakdown: 'Age Group',
        period: '2024',
      },
    }),
    provenance: { sourceIds: ['psa-openstat-age-sex-2024'] },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [],
    tags: ['population', 'age'],
  }),

  indicator('sex-distribution', {
    title: 'Household population by sex',
    topic: 'population-demographics',
    definition: {
      measure: 'Household population by sex',
      description: '2024 household population distributed by sex in the PSA table.',
      basis: 'PSA 2024 Census of Population HUC age/sex table.',
      caveat: 'This official table is city/HUC-level; no barangay sex distribution is inferred.',
    },
    unit: { kind: 'count', code: 'person', decimalPlaces: 0 },
    dimensions: [{ id: 'sex', label: 'Sex' }],
    data: sourceBound('psa-openstat-age-sex-2024', {
      matrix: '1A6DPAG0',
      selectors: {
        geography: 'Makati City',
        measure: 'Household Population',
        breakdown: 'Sex',
        period: '2024',
      },
    }),
    provenance: { sourceIds: ['psa-openstat-age-sex-2024'] },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [],
    tags: ['population', 'sex'],
  }),

  indicator('population-density', {
    title: 'Population density',
    topic: 'population-demographics',
    definition: {
      measure: 'Population density',
      description: 'Population per square kilometre on the PSA current-boundary land-area basis.',
      basis: 'PSA 2015, 2020 and 2024 density table.',
    },
    unit: { kind: 'rate', code: 'persons-per-square-kilometre', per: 'km²', decimalPlaces: 0 },
    data: sourceBound('psa-openstat-density-2024', {
      matrix: '1A6DLPD0',
      selectors: {
        geography: 'Makati City',
        measure: 'Population Density',
        period: ['2015', '2020', '2024'],
      },
    }),
    provenance: { sourceIds: ['psa-openstat-density-2024'] },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [
      { kind: 'related-indicator', targetType: 'indicator', targetId: 'land-area-current-boundary' },
    ],
    tags: ['population', 'density'],
  }),

  indicator('land-area-current-boundary', {
    title: 'PSA current-boundary land area',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Land area',
      description: 'Land area used by PSA for the current-boundary Makati density series.',
      basis: 'PSA density table; kept separate from the city eLCCAP mapped land-use total.',
    },
    unit: { kind: 'area', code: 'km2', symbol: 'km²', decimalPlaces: 3 },
    data: sourceBound('psa-openstat-density-2024', {
      matrix: '1A6DLPD0',
      selectors: {
        geography: 'Makati City',
        measure: 'Land Area',
      },
    }),
    provenance: { sourceIds: ['psa-openstat-density-2024'] },
    revision: verifiedRevision,
    comparability: {
      status: 'comparable',
      geographyBasis: 'makati-current-23',
    },
    relationships: [
      { kind: 'related-indicator', targetType: 'indicator', targetId: 'mapped-city-land-area' },
    ],
    tags: ['land', 'geography'],
  }),

  indicator('real-gdp-level', {
    title: 'Real gross domestic product',
    shortLabel: 'Real GDP',
    topic: 'economy-business',
    definition: {
      measure: 'Gross domestic product at constant 2018 prices',
      description: 'Real economic output produced within Makati.',
      basis: 'PSA Provincial Product Accounts production approach.',
      interpretation: 'Measures economic output, not city-government revenue or household income.',
    },
    unit: { kind: 'currency', code: 'PHP', symbol: '₱' },
    data: sourceBound('psa-ppa-gdp-level-matrix', {
      matrix: '2A5FPPA0',
      selectors: {
        geography: 'City of Makati',
        valuation: 'constant 2018 prices',
        period: ['2022', '2023', '2024', '2025'],
      },
      note:
        'Use 2022–2025 as the clean current-boundary series; pre-2022 Makati values require historical-geography treatment.',
    }),
    provenance: { sourceIds: ['psa-ppa-gdp-level-matrix'] },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
      note: 'PSA PPA footnotes exclude the transferred Embo barangays starting in 2022.',
    },
    relationships: [],
    tags: ['gdp', 'economy'],
  }),

  indicator('real-gdp-growth', {
    title: 'Real GDP growth',
    topic: 'economy-business',
    definition: {
      measure: 'Year-on-year real GDP growth',
      description: 'Annual percentage change in Makati GDP at constant 2018 prices.',
      basis: 'PSA Provincial Product Accounts growth-rate table.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 2 },
    data: sourceBound('psa-ppa-gdp-growth-matrix', {
      matrix: '2A5FPPA2',
      selectors: {
        geography: 'City of Makati',
        valuation: 'constant 2018 prices',
        period: ['2022–2023', '2023–2024', '2024–2025'],
      },
    }),
    provenance: { sourceIds: ['psa-ppa-gdp-growth-matrix'] },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
      note: 'The clean current-boundary growth sequence begins after the 2022 geography break.',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'real-gdp-level' }],
    tags: ['gdp', 'growth'],
  }),

  indicator('gdp-national-share', {
    title: 'Share of national GDP',
    topic: 'economy-business',
    definition: {
      measure: 'Makati share of national GDP',
      description: 'Makati real GDP as a percentage of Philippine GDP.',
      basis: 'PSA 2025 Provincial Product Accounts release.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 1 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 5.5,
          period: year(2025),
          geography: currentMakati,
          sourceIds: ['psa-ppa-2025-release'],
        },
      ],
    },
    provenance: { sourceIds: ['psa-ppa-2025-release'] },
    revision: verifiedRevision,
    comparability: {
      status: 'limited',
      geographyBasis: 'makati-current-23',
      note: 'Currently materialized as the 2025 PSA headline snapshot.',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'real-gdp-level' }],
    tags: ['gdp', 'national-comparison'],
  }),

  indicator('gdp-ncr-share', {
    title: 'Share of NCR GDP',
    topic: 'economy-business',
    definition: {
      measure: 'Makati share of NCR GDP',
      description: 'Makati GDP as a percentage of NCR GDP.',
      basis: 'PSA Provincial Product Accounts regional-share table.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 2 },
    data: sourceBound('psa-ppa-regional-share-matrix', {
      matrix: '2A5FPPA4',
      selectors: {
        geography: 'City of Makati',
        region: 'NCR',
        period: ['2022', '2023', '2024', '2025'],
      },
    }),
    provenance: { sourceIds: ['psa-ppa-regional-share-matrix'] },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'real-gdp-level' }],
    tags: ['gdp', 'ncr'],
  }),

  indicator('industry-gva', {
    title: 'Gross value added by industry',
    topic: 'economy-business',
    definition: {
      measure: 'Industry gross value added',
      description: 'Real GVA generated by each PSA production industry in Makati.',
      basis: 'PSA Provincial Product Accounts industry table at constant 2018 prices.',
    },
    unit: { kind: 'currency', code: 'PHP', symbol: '₱' },
    dimensions: [{ id: 'industry', label: 'Industry' }],
    data: sourceBound('psa-ppa-industry-gva-matrix', {
      matrix: '2A5FPPA1',
      selectors: {
        geography: 'City of Makati',
        valuation: 'constant 2018 prices',
        period: ['2022', '2023', '2024', '2025'],
        breakdown: 'industry',
      },
      note: 'Suppressed source cells remain unavailable and are never converted to zero.',
    }),
    provenance: { sourceIds: ['psa-ppa-industry-gva-matrix'] },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
    },
    relationships: [],
    tags: ['economy', 'industry'],
  }),

  indicator('industry-growth-rate', {
    title: 'Industry GVA growth',
    topic: 'economy-business',
    definition: {
      measure: 'Year-on-year real GVA growth by industry',
      description: 'Annual growth rate for each Makati production industry.',
      basis: 'PSA Provincial Product Accounts industry growth table.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 2 },
    dimensions: [{ id: 'industry', label: 'Industry' }],
    data: sourceBound('psa-ppa-industry-growth-matrix', {
      selectors: {
        geography: 'City of Makati',
        valuation: 'constant 2018 prices',
        period: ['2022–2023', '2023–2024', '2024–2025'],
        breakdown: 'industry',
      },
    }),
    provenance: { sourceIds: ['psa-ppa-industry-growth-matrix'] },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'industry-gva' }],
    tags: ['economy', 'industry', 'growth'],
  }),

  indicator('industry-share-of-makati-gdp', {
    title: 'Industry share of Makati GDP',
    topic: 'economy-business',
    definition: {
      measure: 'Industry share of city GDP',
      description: 'Each industry’s GVA divided by Makati total GDP for the same year and valuation basis.',
      basis:
        'Derived from the canonical industry-GVA and real-GDP indicators; this is not PSA’s separate regional-industry-share measure.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 2 },
    dimensions: [{ id: 'industry', label: 'Industry' }],
    data: {
      kind: 'derived',
      dependencies: ['industry-gva', 'real-gdp-level'],
      method: 'percentage-share',
      description: 'industry GVA / Makati real GDP × 100 for the same period',
    },
    provenance: {
      sourceIds: ['psa-ppa-industry-gva-matrix', 'psa-ppa-gdp-level-matrix'],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'series-break',
      geographyBasis: 'makati-current-23',
    },
    relationships: [
      { kind: 'derived-from', targetType: 'indicator', targetId: 'industry-gva' },
      { kind: 'derived-from', targetType: 'indicator', targetId: 'real-gdp-level' },
    ],
    tags: ['economy', 'industry', 'structure'],
  }),

  indicator('gdp-per-capita', {
    title: 'GDP per person',
    topic: 'economy-business',
    definition: {
      measure: 'Per-capita GDP',
      description: 'Makati GDP divided by the population denominator used by the PSA release/table.',
      basis: 'PSA Provincial Product Accounts per-capita series.',
      interpretation: 'Economic output per resident; not income, salary or wealth.',
      caveat:
        'Keep the 2024 census-based benchmark distinct from later projection-based denominator versions.',
    },
    unit: { kind: 'currency', code: 'PHP', symbol: '₱', decimalPlaces: 0 },
    data: sourceBound('psa-ppa-per-capita-matrix', {
      matrix: '2A5FPPA8',
      selectors: {
        geography: 'City of Makati',
        period: ['2022', '2023', '2024', '2025'],
      },
      materializedObservations: [
        {
          value: makati2024GdpPerPerson,
          period: year(2024),
          geography: currentMakati,
          sourceIds: ['psa-ppa-makati-2024-release'],
          note:
            'Resolved from the existing canonical 2024 city-comparison row rather than duplicated as a formatted page string.',
        },
      ],
    }),
    provenance: {
      sourceIds: ['psa-ppa-per-capita-matrix', 'psa-ppa-makati-2024-release'],
    },
    revision: verifiedRevision,
    comparability: {
      status: 'limited',
      geographyBasis: 'makati-current-23',
      note: 'Denominator basis must be retained for each per-capita observation.',
    },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'real-gdp-level' }],
    tags: ['gdp', 'per-capita'],
  }),

  indicator('resident-labor-force-participation-rate', {
    title: 'Resident labor-force participation rate',
    topic: 'economy-business',
    definition: {
      measure: 'Labor-force participation rate',
      description: 'Share of Makati residents age 15+ who are in the labor force.',
      basis: 'PSA NCR 2025 HUC Labor Force Survey release.',
      caveat: 'Resident-based rate; it is not a count of jobs physically located in Makati.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 1 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 67.1, period: year(2025), geography: currentMakati, sourceIds: ['psa-lfs-ncr-2025-huc'] }],
    },
    provenance: { sourceIds: ['psa-lfs-ncr-2025-huc'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Current 2025 HUC estimate.' },
    relationships: [],
    tags: ['labor', 'residents'],
  }),

  indicator('resident-employment-rate', {
    title: 'Resident employment rate',
    topic: 'economy-business',
    definition: {
      measure: 'Employment rate',
      description: 'Share of the Makati labor force that is employed.',
      basis: 'PSA NCR 2025 HUC Labor Force Survey release.',
      caveat: 'Resident-based rate; it is not workplace employment in Makati establishments.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 1 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 95.0, period: year(2025), geography: currentMakati, sourceIds: ['psa-lfs-ncr-2025-huc'] }],
    },
    provenance: { sourceIds: ['psa-lfs-ncr-2025-huc'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Current 2025 HUC estimate.' },
    relationships: [],
    tags: ['labor', 'employment', 'residents'],
  }),

  indicator('resident-unemployment-rate', {
    title: 'Resident unemployment rate',
    topic: 'economy-business',
    definition: {
      measure: 'Unemployment rate',
      description: 'Share of the Makati labor force that is unemployed.',
      basis: 'PSA NCR 2025 HUC Labor Force Survey release.',
      caveat: 'Resident-based rate; it is not a measure of vacant jobs or establishment staffing.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 1 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 5.0, period: year(2025), geography: currentMakati, sourceIds: ['psa-lfs-ncr-2025-huc'] }],
    },
    provenance: { sourceIds: ['psa-lfs-ncr-2025-huc'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Current 2025 HUC estimate.' },
    relationships: [],
    tags: ['labor', 'unemployment', 'residents'],
  }),

  indicator('resident-underemployment-rate', {
    title: 'Resident underemployment rate',
    topic: 'economy-business',
    definition: {
      measure: 'Underemployment rate',
      description:
        'Share of employed Makati residents who want additional hours or additional/new work with longer hours.',
      basis: 'PSA NCR 2025 HUC Labor Force Survey release.',
      caveat: 'Resident-based rate; it is not workplace underemployment in Makati establishments.',
    },
    unit: { kind: 'percentage', code: 'percent', symbol: '%', decimalPlaces: 1 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 2.2, period: year(2025), geography: currentMakati, sourceIds: ['psa-lfs-ncr-2025-huc'] }],
    },
    provenance: { sourceIds: ['psa-lfs-ncr-2025-huc'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Current 2025 HUC estimate.' },
    relationships: [],
    tags: ['labor', 'underemployment', 'residents'],
  }),

  indicator('existing-land-use-distribution', {
    title: 'Existing land-use distribution',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Existing land use by category',
      description: 'Area and share of the city mapped to each official existing-land-use category.',
      basis: 'Makati eLCCAP existing-land-use table for 2022 on the 23-barangay boundary.',
    },
    unit: { kind: 'custom', code: 'land-use-area-and-share' },
    dimensions: [{ id: 'land-use-category', label: 'Land-use category' }],
    data: sourceBound('makati-elccap-2024-2054', {
      table: 'Existing Land Use, 2022',
      selectors: {
        geography: '23 barangays, excluding the 10 EMBO barangays',
        period: '2022',
        measures: ['area in square metres', 'percent share'],
      },
      note:
        'Source-bound to preserve the complete official category distribution; do not construct a partial 100% chart from only the currently extracted headline categories.',
    }),
    provenance: { sourceIds: ['makati-elccap-2024-2054'] },
    revision: verifiedRevision,
    comparability: { status: 'comparable', geographyBasis: 'makati-current-23' },
    relationships: [],
    tags: ['land-use', 'planning'],
  }),

  indicator('mapped-city-land-area', {
    title: 'Mapped existing-land-use area',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Mapped city area',
      description: 'Total area represented by the 2022 current-boundary existing-land-use table.',
      basis: 'Makati eLCCAP existing-land-use table.',
      caveat: 'Keep distinct from PSA land-area metadata if the measurement bases differ.',
    },
    unit: { kind: 'area', code: 'm2', symbol: 'm²', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 18168300,
          period: year(2022),
          geography: currentMakati,
          sourceIds: ['makati-elccap-2024-2054'],
        },
      ],
    },
    provenance: { sourceIds: ['makati-elccap-2024-2054'] },
    revision: verifiedRevision,
    comparability: { status: 'comparable', geographyBasis: 'makati-current-23' },
    relationships: [{ kind: 'related-indicator', targetType: 'indicator', targetId: 'land-area-current-boundary' }],
    tags: ['land', 'planning'],
  }),

  indicator('public-parks-administrative-count', {
    title: 'Public parks reported by the city',
    shortLabel: 'Public parks',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Public-park administrative count',
      description: 'Public parks reported by the City Government environmental-management inventory.',
      basis: 'Makati City Basic Facts and Figures 2023, excluding the 10 transferred barangays.',
      caveat:
        'This official denominator is not the same as the current 13-park civic-audit target set.',
    },
    unit: { kind: 'count', code: 'park', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 15, period: year(2023), geography: currentMakati, sourceIds: ['makati-basic-facts-2023'] }],
    },
    provenance: { sourceIds: ['makati-basic-facts-2023'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Dated 2023 administrative snapshot.' },
    relationships: [],
    tags: ['parks', 'public-space'],
  }),

  indicator('road-surface-length-concreted', {
    title: 'Concreted road length',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Concreted road length',
      description: 'Length of concreted roads reported by Makati DEPW.',
      basis: 'Makati City Basic Facts and Figures 2023.',
      caveat: 'Aggregate network measure; it does not assign surface type to individual Place Registry segments.',
    },
    unit: { kind: 'custom', code: 'km', symbol: 'km', decimalPlaces: 3 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 176.615, period: year(2023), geography: currentMakati, sourceIds: ['makati-basic-facts-2023'] }],
    },
    provenance: { sourceIds: ['makati-basic-facts-2023'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Dated 2023 administrative snapshot.' },
    relationships: [],
    tags: ['roads', 'infrastructure'],
  }),

  indicator('road-surface-length-asphalt', {
    title: 'Asphalt road length',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Asphalt road length',
      description: 'Length of asphalt roads reported by Makati DEPW.',
      basis: 'Makati City Basic Facts and Figures 2023.',
      caveat: 'Aggregate network measure; it does not assign surface type to individual Place Registry segments.',
    },
    unit: { kind: 'custom', code: 'km', symbol: 'km', decimalPlaces: 3 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 105.264, period: year(2023), geography: currentMakati, sourceIds: ['makati-basic-facts-2023'] }],
    },
    provenance: { sourceIds: ['makati-basic-facts-2023'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Dated 2023 administrative snapshot.' },
    relationships: [],
    tags: ['roads', 'infrastructure'],
  }),

  indicator('improved-drainage-length', {
    title: 'Improved drainage length',
    topic: 'land-infrastructure',
    definition: {
      measure: 'Improved drainage length',
      description: 'Length of improved drainage reported by Makati DEPW.',
      basis: 'Makati City Basic Facts and Figures 2023.',
      caveat: 'A citywide network total; individual drainage segments require separate exact source relationships.',
    },
    unit: { kind: 'custom', code: 'km', symbol: 'km', decimalPlaces: 3 },
    data: {
      kind: 'inline-observations',
      observations: [{ value: 478.014, period: year(2023), geography: currentMakati, sourceIds: ['makati-basic-facts-2023'] }],
    },
    provenance: { sourceIds: ['makati-basic-facts-2023'] },
    revision: verifiedRevision,
    comparability: { status: 'limited', geographyBasis: 'makati-current-23', note: 'Dated 2023 administrative snapshot.' },
    relationships: [],
    tags: ['drainage', 'infrastructure'],
  }),

  indicator('public-schools-current', {
    title: 'Current public schools',
    topic: 'education',
    definition: {
      measure: 'Distinct public schools',
      description: 'Distinct schools in the DepEd Makati City National Inventory Dashboard.',
      basis: 'DepEd National Inventory Dashboard for the current Schools Division of Makati City.',
      caveat: 'Distinct schools are not the same as overlapping school-level/program counts or infrastructure projects.',
    },
    unit: { kind: 'count', code: 'school', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 23,
          period: asOf('2026-09-11'),
          geography: makatiAsPublished,
          sourceIds: ['deped-national-inventory-dashboard-makati-2026'],
        },
      ],
    },
    provenance: { sourceIds: ['deped-national-inventory-dashboard-makati-2026'] },
    revision: verifiedRevision,
    comparability: {
      status: 'limited',
      geographyBasis: 'as-published',
      note: 'Current Schools Division snapshot after transfer of affected schools.',
    },
    relationships: [],
    tags: ['education', 'schools'],
  }),

  indicator('yakap-gamot-providers-makati', {
    title: 'YAKAP clinics with available GAMOT prescription',
    topic: 'health',
    definition: {
      measure: 'Listed YAKAP/GAMOT providers',
      description:
        'Makati City provider entries in PhilHealth’s list of accredited YAKAP clinics with available GAMOT prescription.',
      basis: 'PhilHealth provider list updated 31 July 2026.',
      caveat: 'This is not a count of all health facilities in Makati.',
    },
    unit: { kind: 'count', code: 'provider-entry', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 24,
          period: asOf('2026-07-31'),
          geography: makatiAsPublished,
          sourceIds: ['philhealth-yakap-gamot-2026-07'],
        },
      ],
    },
    provenance: { sourceIds: ['philhealth-yakap-gamot-2026-07'] },
    revision: verifiedRevision,
    comparability: {
      status: 'limited',
      geographyBasis: 'as-published',
      note: 'Provider-list snapshot; accreditation/availability status may change.',
    },
    relationships: [],
    tags: ['health', 'yakap', 'gamot'],
  }),

  indicator('yakap-gamot-city-government-health-centers', {
    title: 'City government health centers in YAKAP/GAMOT list',
    topic: 'health',
    definition: {
      measure: 'Named city health centers in the YAKAP/GAMOT provider list',
      description:
        'Named City Government of Makati health-center entries in PhilHealth’s YAKAP/GAMOT provider list.',
      basis: 'PhilHealth provider list updated 31 July 2026.',
      caveat:
        'The government-provider total is 17 entries because Makati Health Department is listed separately; this indicator counts the 16 named health centers only.',
    },
    unit: { kind: 'count', code: 'health-center', decimalPlaces: 0 },
    data: {
      kind: 'inline-observations',
      observations: [
        {
          value: 16,
          period: asOf('2026-07-31'),
          geography: makatiAsPublished,
          sourceIds: ['philhealth-yakap-gamot-2026-07'],
        },
      ],
    },
    provenance: { sourceIds: ['philhealth-yakap-gamot-2026-07'] },
    revision: verifiedRevision,
    comparability: {
      status: 'limited',
      geographyBasis: 'as-published',
      note: 'Provider-list snapshot; accreditation/availability status may change.',
    },
    relationships: [
      { kind: 'breakdown-of', targetType: 'indicator', targetId: 'yakap-gamot-providers-makati' },
    ],
    tags: ['health', 'health-centers', 'yakap', 'gamot'],
  }),
];

export const cityIndicatorById = new Map(
  cityIndicators.map(item => [item.id, item] as const)
);

export const cityIndicatorsByTopic = (topic: CityIndicatorTopic) =>
  cityIndicators.filter(item => item.topic === topic);

export const cityIndicatorObservations = (
  indicatorId: string
): CityIndicatorObservation[] => {
  const record = cityIndicatorById.get(indicatorId);
  if (!record) return [];

  if (record.data.kind === 'inline-observations') {
    return record.data.observations;
  }

  if (record.data.kind === 'source-table-reference') {
    return record.data.materializedObservations ?? [];
  }

  return [];
};

export const latestCityIndicatorObservation = (indicatorId: string) => {
  const observations = cityIndicatorObservations(indicatorId);
  return observations.at(-1) ?? null;
};

export const materializedCityIndicatorIds = cityIndicators
  .filter(item => cityIndicatorObservations(item.id).length > 0)
  .map(item => item.id);

export const sourceBoundCityIndicatorIds = cityIndicators
  .filter(
    item =>
      item.data.kind === 'source-table-reference' &&
      item.data.materializationStatus === 'source-bound'
  )
  .map(item => item.id);
