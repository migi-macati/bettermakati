export interface OpenCongressMakatiRecord {
  bill: string;
  congress: string;
  filed: string;
  title: string;
  recordUrl: string;
  pdfUrl: string;
  upstreamUrl: string;
}

export const openCongressMakati = {
  source: 'BetterGov Open Congress',
  api: 'https://open-congress-api.bettergov.ph/',
  upstreamRepository: 'https://github.com/bettergovph/open-congress-data',
  upstreamCommit: '6e853ee027790427c5b5961c6318ff907cf717d5',
  verifiedAt: '2026-09-25',
  selectionRule:
    'Reviewed House bills whose published title directly names Makati. Status is intentionally not cached here.',
  records: [
    {
      bill: 'HB 1293',
      congress: '19th Congress',
      filed: 'July 6, 2022',
      title: 'An Act Converting the Makati City into a Special City',
      recordUrl:
        'https://ldr.senate.gov.ph/bills/house-bill-no-1293-19th-congress',
      pdfUrl:
        'https://docs.congress.hrep.online/legisdocs/basic_19/HB01293.pdf',
      upstreamUrl:
        'https://github.com/bettergovph/open-congress-data/blob/6e853ee027790427c5b5961c6318ff907cf717d5/data/document/hb/19/01K6D89C4S8D2KYJJRKTQRGAQX.toml',
    },
    {
      bill: 'HB 1294',
      congress: '19th Congress',
      filed: 'July 6, 2022',
      title:
        'An Act Converting the Makati West High School into Makati Science High School and Appropriating Funds Therefor',
      recordUrl:
        'https://ldr.senate.gov.ph/bills/house-bill-no-1294-19th-congress',
      pdfUrl:
        'https://docs.congress.hrep.online/legisdocs/basic_19/HB01294.pdf',
      upstreamUrl:
        'https://github.com/bettergovph/open-congress-data/blob/6e853ee027790427c5b5961c6318ff907cf717d5/data/document/hb/19/01K6D89C4S8D2KYJJRKTQRGAQY.toml',
    },
    {
      bill: 'HB 6100',
      congress: '19th Congress',
      filed: 'November 14, 2022',
      title:
        'An Act Establishing a TESDA Training and Assessment Center in Barangay Sta. Cruz, Makati City',
      recordUrl:
        'https://ldr.senate.gov.ph/bills/house-bill-no-6100-19th-congress',
      pdfUrl:
        'https://docs.congress.hrep.online/legisdocs/basic_19/HB06100.pdf',
      upstreamUrl:
        'https://github.com/bettergovph/open-congress-data/blob/6e853ee027790427c5b5961c6318ff907cf717d5/data/document/hb/19/01K6D89D2ZM1B69D8JRFWX1MPY.toml',
    },
  ] satisfies OpenCongressMakatiRecord[],
} as const;

export const openCongressMakatiRecords = openCongressMakati.records;
