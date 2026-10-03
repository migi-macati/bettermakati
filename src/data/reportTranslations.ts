import type { FeaturedReportV2, ReportMethodologyNote, ReportSectionV2 } from './reportTypes';

export interface LocalizedReportCopy {
  headline: string;
  subheadline: string;
  synthesis: string;
  sections: [ReportSectionV2, ...ReportSectionV2[]];
  methodology?: ReportMethodologyNote;
}

const filipinoReportCopy: Record<string, LocalizedReportCopy> = {
  'embo-makati-taguig-transition': {
    headline: 'Ang EMBO Shift: Paano Nabawasan ng 10 Barangay ang Makati, at Ano ang Nagbago',
    subheadline:
      'Inilipat ng Supreme Court boundary ruling ang 10 barangay mula Makati patungong Taguig. Nauna ang final court decision; sumunod ang magkakahiwalay na transition sa schools, elections, budgets at public services.',
    synthesis:
      'Isang territorial judgment ang EMBO transfer, pero magkakahiwalay na administrative transitions ang sumunod: settled na ang city boundary, habang sa magkakaibang legal at operational track nagbago ang schools, electoral representation, public services, fiscal records at possession ng ilang public facilities.',
    sections: [
      {
        id: 'boundary-and-scale',
        heading: 'Nauna ang pagbabago sa legal boundary',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Sa 1 December 2021 decision sa G.R. No. 235316, ibinalik ng Supreme Court, with modification, ang trial-court ruling na bahagi ng Taguig ang Parcels 3 at 4 ng Fort Bonifacio Military Reservation. Denied with finality noong 28 September 2022 ang motion for reconsideration ng Makati. Noong June 2023, hindi rin pinayagan ng Court ang paghahain ng second motion for reconsideration.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Sumunod ang official geographic coding. Sa third-quarter 2023 Philippine Standard Geographic Code update, inilipat ng Philippine Statistics Authority sa Taguig ang Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Northside, Post Proper Southside, Rizal, South Cembo at West Rembo.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'table',
            title: 'Ang 10 transferred barangays sa 2024 POPCEN',
            columns: [
              { key: 'barangay', label: 'Barangay' },
              { key: 'population', label: '2024 population', align: 'right' },
            ],
            rows: [
              { barangay: 'Cembo', population: '25,468' },
              { barangay: 'Comembo', population: '16,299' },
              { barangay: 'East Rembo', population: '26,884' },
              { barangay: 'Pembo', population: '47,030' },
              { barangay: 'Pitogo', population: '16,244' },
              { barangay: 'Post Proper Northside', population: '62,277' },
              { barangay: 'Post Proper Southside', population: '68,388' },
              { barangay: 'Rizal', population: '46,061' },
              { barangay: 'South Cembo', population: '15,458' },
              { barangay: 'West Rembo', population: '30,157' },
              { barangay: 'Total', population: '354,266' },
            ],
            evidence: { sourceIds: ['4'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'May statistical break dahil sa transfer. Ayon sa PSA, 309,770 ang residents ng natitirang 23 Makati barangays noong 2024. Kung ikukumpara iyon diretso sa dating citywide 2020 total na parang hindi nagbago ang geography, mali ang magiging picture ng demographic change. Kailangang hiwalay ang current-boundary at former-boundary series.',
            evidence: { sourceIds: ['4', '5'] },
          },
        ],
      },
      {
        id: 'schools-and-health',
        heading: 'Magkahiwalay ang timeline ng schools at health services',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Pansamantalang inilagay ng DepEd ang 14 affected public schools sa direct supervision ng Office of the Secretary. Sa Makati–Taguig–DepEd agreement na ipinatupad sa DepEd Order No. 001, s. 2024, inako ng Schools Division of Taguig City and Pateros ang management at operation simula 1 January 2024. Nanatili sa proper authorities ang final determination sa magkaibang claims ng mga city sa ownership ng school land, buildings, facilities at equipment.',
            evidence: { sourceIds: ['6'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Sa current health directory ng Taguig, may barangay health centers sa siyam sa sampung transferred barangays: Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Southside, Rizal, South Cembo at West Rembo. May isa rin sa apat na 24/7 Super Health Centers ng Taguig sa East Rembo. Walang nakalistang Post Proper Northside barangay health center sa directory na na-check para sa report na ito; limitation iyon ng listahan, hindi proof na walang health-service access ang residents.',
            evidence: { sourceIds: ['7'] },
          },
        ],
      },
      {
        id: 'elections',
        heading: 'Kinailangan ding ayusin ang electoral representation',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Para sa 2025 elections, inilagay ng COMELEC Resolution No. 11069 ang Comembo, Pembo at Rizal sa first legislative and councilor district ng Taguig. Ang Cembo, East Rembo, Pitogo, Post Proper Northside, Post Proper Southside, South Cembo at West Rembo naman ay inilagay sa second. Naglaan din ang resolution ng 12 councilor seats sa bawat district.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Kaya pinananatili ng BetterMakati sa historical Makati record ang pre-transfer EMBO election results, pero hindi na isinasama ang post-transfer EMBO results sa current Makati barangay totals.',
            evidence: { sourceIds: ['3', '8'] },
          },
        ],
      },
      {
        id: 'fiscal',
        heading: 'Totoo ang fiscal effect, pero hindi ito simpleng money transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Inatasan ng DBM ang national agencies na isaalang-alang ang final Makati–Taguig decision sa budget matters na may kinalaman sa transferred barangays, at isinama sa final FY2024 National Tax Allotment process ang boundary changes. Sa 2024 city receipts table ng DBM, ₱1.006 billion ang NTA receipts ng Makati at ₱3.149 billion ang sa Taguig.',
            evidence: { sourceIds: ['9', '10', '11'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Tumaas ang recorded NTA receipts ng Taguig mula ₱2.487 billion noong 2023 tungong ₱3.149 billion noong 2024, increase na humigit-kumulang ₱662 million o 26.6%. Sa parehong 2024 DBM table, ₱18.903 billion ang local-source receipts ng Makati at ₱16.146 billion ang sa Taguig.',
            evidence: { sourceIds: ['11', '12'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Hindi dapat ipakita ang mga figures bilang peso-for-peso transfer mula Makati papuntang Taguig. Nagbago ang national allotments sa iba’t ibang LGU at bahagi lang ito ng city finances. Mas eksaktong conclusion: binago ng boundary adjustment ang allocation basis, habang malaki ang itinaas ng recorded NTA receipts ng Taguig sa unang full fiscal year pagkatapos ng transfer.',
            evidence: { sourceIds: ['9', '10', '11', '12'] },
          },
        ],
      },
      {
        id: 'facilities',
        heading: 'Magkaiba ang jurisdiction, operation at ownership',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Na-settle ng boundary ruling kung saang city kabilang ang 10 barangay. Hindi nito awtomatikong napagdesisyunan kung sino ang may-ari ng bawat school, health center, park o ibang facility na itinayo o dating pinatatakbo ng Makati. Noong January 2024, nagbukas muli ang West Rembo Fire Station sa ilalim ng transition arrangement na nagpahintulot sa Bureau of Fire Protection na gamitin ito habang pinag-uusapan pa ang ibang issues.',
            evidence: { sourceIds: ['1', '13'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Noong 22 May 2025, nag-grant ang Taguig RTC Branch 153 ng writ of preliminary injunction na sumasakop sa health centers, covered courts, day care centers at iba pang essential facilities. Pinayagan nito ang continued access at control ng Taguig habang nagpapatuloy ang trial sa better right of possession. Provisional remedy ito, hindi final judgment sa ownership.',
            evidence: { sourceIds: ['14'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Ang dating Makati Park and Garden ay kasalukuyang ino-operate ng Taguig bilang TLC People’s Park sa West Rembo at nakalista bilang public recreational facility. Patunay iyon ng present administration at use, hindi final judicial determination ng title.',
            evidence: { sourceIds: ['15'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Sa 3 October 2026 research cutoff ng report, walang nahanap na mas bagong publicly verifiable final merits decision na nagresolba sa broader facility-possession o ownership case. Kaya tatlong hiwalay na statements ang suportado ng current record: settled na ang Taguig jurisdiction; may court-backed operational control ang Taguig sa facilities na sakop ng preliminary injunction; at unresolved pa sa public record na nahanap para sa report ang final ownership o better right of possession.',
            evidence: { sourceIds: ['14'] },
          },
        ],
      },
    ],
    methodology: {
      title: 'Note sa boundary at legal status',
      text:
        'Ginagamit ng population comparisons ang current official 23-barangay Makati geography at 2024 POPCEN para sa transferred barangays. Inilalarawan lang ang legal status hanggang sa level na established ng cited judgments o interim orders. Hindi tinatrato ang preliminary injunction sa facility access at possession bilang final ruling sa title.',
      evidence: { sourceIds: ['1', '3', '4', '5', '14'] },
    },
  },
};

export const localizedReportCopy = (
  report: FeaturedReportV2,
  language?: string
): LocalizedReportCopy => {
  const translated =
    language?.toLowerCase().startsWith('fil')
      ? filipinoReportCopy[report.slug]
      : undefined;

  return (
    translated ?? {
      headline: report.headline,
      subheadline: report.subheadline,
      synthesis: report.synthesis,
      sections: report.sections,
      methodology: report.methodology,
    }
  );
};
