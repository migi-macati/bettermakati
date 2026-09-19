export type CityComparisonRow = {
  city: string;
  region: string;
  gdpPerPerson: number;
  isMakati?: boolean;
};

/**
 * PSA's national top ten economies by GDP per person for 2024.
 * Values are in Philippine pesos at constant 2018 prices.
 */
export const cityComparisonRows: CityComparisonRow[] = [
  { city: 'Makati', region: 'NCR', gdpPerPerson: 3889202, isMakati: true },
  { city: 'Pasay', region: 'NCR', gdpPerPerson: 792368 },
  { city: 'Mandaluyong', region: 'NCR', gdpPerPerson: 687756 },
  { city: 'San Juan', region: 'NCR', gdpPerPerson: 687469 },
  { city: 'Pasig', region: 'NCR', gdpPerPerson: 601653 },
  { city: 'Manila', region: 'NCR', gdpPerPerson: 546412 },
  { city: 'Parañaque', region: 'NCR', gdpPerPerson: 521065 },
  { city: 'Taguig', region: 'NCR', gdpPerPerson: 501732 },
  { city: 'Muntinlupa', region: 'NCR', gdpPerPerson: 494566 },
  { city: 'Baguio', region: 'CAR', gdpPerPerson: 485433 },
];

export const cityComparisonSource =
  'https://psa.gov.ph/content/2024-economic-performance-provinces-and-highly-urbanized-cities-philippines-capita-gross';

export const cityComparisonPdf =
  'https://psa.gov.ph/system/files/sead/Signed_SR_2024PPA_PerCapita_rev.pdf';
