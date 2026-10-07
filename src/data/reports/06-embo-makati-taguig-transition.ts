import type { FeaturedReportModule } from '../reportTypes';

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'embo-makati-taguig-transition',
    date: '3 October 2026',
    headline:
      'The EMBO Shift: How Makati Lost 10 Barangays, and What Changed After',
    subheadline:
      'A Supreme Court boundary ruling moved 10 barangays from Makati to Taguig. The legal case ended first; the transition in schools, elections, budgets and public services unfolded afterward.',
    synthesis:
      'The EMBO transfer was one territorial judgment followed by several different administrative transitions: the city boundary is settled, while schools, electoral representation, public services, fiscal records and the possession of some public facilities changed on separate legal and operational tracks.',
    sections: [
      {
        id: 'boundary-and-scale',
        heading: 'The legal boundary changed first',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In its 1 December 2021 decision in G.R. No. 235316, the Supreme Court reinstated with modification the trial-court ruling confirming Parcels 3 and 4 of the Fort Bonifacio Military Reservation as part of Taguig. Makati’s motion for reconsideration was denied with finality on 28 September 2022. In June 2023, the Court also denied Makati leave to file a second motion for reconsideration.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The Philippine Statistics Authority then transferred Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Northside, Post Proper Southside, Rizal, South Cembo and West Rembo from Makati to Taguig in the third-quarter 2023 Philippine Standard Geographic Code update.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'table',
            title: 'The 10 transferred barangays in the 2024 POPCEN',
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
            text: 'The transfer creates a statistical break. PSA counts 309,770 residents in Makati’s remaining 23 barangays in 2024. Comparing that figure directly with Makati’s old citywide 2020 total as though the geography were unchanged would misstate demographic change; current-boundary and former-boundary series must be distinguished.',
            evidence: {
              sourceIds: ['4', '5'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'schools-and-health',
        heading: 'Schools and health services moved on their own timelines',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'DepEd initially placed 14 affected public schools under direct supervision of the Office of the Secretary. Under the later Makati–Taguig–DepEd agreement implemented through DepEd Order No. 001, s. 2024, the Schools Division of Taguig City and Pateros assumed management and operation effective 1 January 2024. The agreement preserved the cities’ conflicting positions on ownership of school land, buildings, facilities and equipment for determination by the proper authorities.',
            evidence: { sourceIds: ['6'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Taguig’s current health directory lists barangay health centers in nine of the ten transferred barangays: Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Southside, Rizal, South Cembo and West Rembo. East Rembo also has one of Taguig’s four 24/7 Super Health Centers. The directory checked for this report does not list a Post Proper Northside barangay health center; that is a limitation of the directory, not proof that residents have no health-service access.',
            evidence: { sourceIds: ['7'] },
          },
        ],
      },
      {
        id: 'elections',
        heading: 'Electoral representation required another adjustment',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'For the 2025 elections, COMELEC Resolution No. 11069 placed Comembo, Pembo and Rizal in Taguig’s first legislative and councilor district, and Cembo, East Rembo, Pitogo, Post Proper Northside, Post Proper Southside, South Cembo and West Rembo in the second. It also provided for 12 councilor seats in each district.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'BetterMakati therefore keeps pre-transfer EMBO election results in Makati’s historical record but does not add post-transfer EMBO results to current Makati barangay totals.',
            evidence: { sourceIds: ['3', '8'] },
          },
        ],
      },
      {
        id: 'fiscal',
        heading:
          'The fiscal effect was real, but it was not a simple transfer of money',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'DBM directed national agencies to take the final Makati–Taguig decision into account in budget matters involving the transferred barangays, and its final FY2024 National Tax Allotment process incorporated boundary changes. DBM’s 2024 city receipts table records Makati NTA receipts of ₱1.006 billion and Taguig NTA receipts of ₱3.149 billion.',
            evidence: { sourceIds: ['9', '10', '11'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Taguig’s recorded NTA receipts rose from ₱2.487 billion in 2023 to ₱3.149 billion in 2024, an increase of about ₱662 million or 26.6%. The same 2024 table records local-source receipts of ₱18.903 billion for Makati and ₱16.146 billion for Taguig.',
            evidence: { sourceIds: ['11', '12'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Those figures should not be presented as a peso-for-peso transfer from Makati to Taguig. National allotments changed across LGUs and are only one part of each city’s finances. The defensible conclusion is that the boundary adjustment changed the allocation basis while Taguig’s recorded NTA receipts rose substantially in the first full fiscal year after the transfer.',
            evidence: { sourceIds: ['9', '10', '11', '12'] },
          },
        ],
      },
      {
        id: 'facilities',
        heading:
          'Jurisdiction, operation and ownership are different questions',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The boundary ruling settled which city the 10 barangays belong to. It did not by itself decide ownership of every school, health center, park or other facility Makati had built or operated there. In January 2024, the West Rembo Fire Station reopened under a transition arrangement that allowed Bureau of Fire Protection personnel to use it while other issues remained under discussion.',
            evidence: { sourceIds: ['1', '13'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'On 22 May 2025, Taguig RTC Branch 153 granted Taguig a writ of preliminary injunction covering health centers, covered courts, day care centers and other essential facilities. The writ allowed Taguig continued access and control while trial proceeded on the better right of possession. It was a provisional remedy, not a final judgment on ownership.',
            evidence: { sourceIds: ['14'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The former Makati Park and Garden is now operated by Taguig as TLC People’s Park in West Rembo and is listed by the city as a public recreational facility. That establishes present administration and use, not a final judicial determination of title.',
            evidence: { sourceIds: ['15'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'As of this report’s 3 October 2026 research cutoff, no later publicly verifiable final merits decision resolving the broader facility-possession or ownership case was located. The current record therefore supports three separate statements: Taguig jurisdiction is settled; Taguig has court-backed operational control over facilities covered by the preliminary injunction; final ownership or better right of possession remains unresolved in the public record located for this report.',
            evidence: { sourceIds: ['14'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'SC Writes Finis to Makati City-Taguig City Land Dispute',
        href: 'https://sc.judiciary.gov.ph/sc-writes-finis-to-makati-city-taguig-city-land-dispute/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '4 April 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '2',
        label:
          'SC Denies Makati’s Motion for Leave to Admit Second Motion for Reconsideration',
        href: 'https://sc.judiciary.gov.ph/sc-denies-makatis-motion-for-leave-to-admit-second-motion-for-reconsideration-in-makati-taguig-territorial-dispute/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '29 June 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '3',
        label: 'Third Quarter 2023 PSGC Updates',
        href: 'https://psa.gov.ph/content/third-quarter-2023-psgc-updates-conversion-new-city-merging-44-barangays-renaming-five',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '24 October 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '4',
        label: 'City of Taguig — PSGC / 2024 POPCEN',
        href: 'https://psa.gov.ph/classification/psgc/barangays/1381500000',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2024 POPCEN',
        checkedOn: '3 October 2026',
      },
      {
        id: '5',
        label: 'City of Makati — PSGC / 2024 POPCEN',
        href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2024 POPCEN',
        checkedOn: '3 October 2026',
      },
      {
        id: '6',
        label: 'DepEd Order No. 001, s. 2024',
        href: 'https://www.deped.gov.ph/wp-content/uploads/DO_s2024_001.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Education',
        publishedOrPeriod: '15 January 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '7',
        label: 'Taguig hospitals and health centers',
        href: 'https://www.taguig.gov.ph/health/hospitals-and-centers/',
        sourceKind: 'official-external',
        publisher: 'City Government of Taguig',
        checkedOn: '3 October 2026',
      },
      {
        id: '8',
        label: 'COMELEC 2025 NLE Resolutions — Resolution No. 11069',
        href: 'https://www.comelec.gov.ph/?r=2025NLE/Resolutions',
        sourceKind: 'official-external',
        publisher: 'Commission on Elections',
        publishedOrPeriod: '25 September 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '9',
        label: 'DBM Circular Letter No. 2023-12',
        href: 'https://www.dbm.gov.ph/index.php/dbm-issuances/circular-letters?catid=37&id=2308%3Acircular-letter-no-2023-12&view=article',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '15 September 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '10',
        label: 'Local Budget Memorandum No. 87-A — Final FY2024 NTA shares',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/Issuances/2023/Local-Budget-Memorandum/LOCAL-BUDGET-MEMORANDUM-NO-87-A-DATED-DECEMBER-28-2023.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '28 December 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '11',
        label:
          'BESF 2026 Table F.13 — Statement of Receipts and Expenditures by Cities, 2024',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2026/F13.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '12',
        label:
          'BESF 2025 Table F.13 — Statement of Receipts and Expenditures by Cities, 2023',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2025/F13.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '13',
        label: 'DILG — West Rembo Fire Station transition',
        href: 'https://calabarzon.dilg.gov.ph/through-constructive-dialogues-abalos-optimistic-makati-taguig-territorial-issue-will-be-resolved-soon/',
        sourceKind: 'official-external',
        publisher: 'Department of the Interior and Local Government',
        publishedOrPeriod: '8 January 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '14',
        label:
          'Court extends Taguig control over government facilities in EMBOs',
        href: 'https://www.pna.gov.ph/articles/1250718',
        sourceKind: 'secondary',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '23 May 2025',
        checkedOn: '3 October 2026',
      },
      {
        id: '15',
        label: 'Taguig parks and playgrounds — TLC People’s Park',
        href: 'https://www.taguig.gov.ph/parks-and-playgrounds/',
        sourceKind: 'official-external',
        publisher: 'City Government of Taguig',
        checkedOn: '3 October 2026',
      },
    ],
    methodology: {
      title: 'Boundary and legal-status note',
      text: 'Population comparisons use the current official 23-barangay Makati geography and the 2024 POPCEN for the transferred barangays. Legal status is stated only to the level established by the cited judgments or interim orders. A preliminary injunction over facility access and possession is not treated as a final ruling on title.',
      evidence: { sourceIds: ['1', '3', '4', '5', '14'] },
    },
  },
  fil: {
    headline:
      'Ang EMBO Shift: Paano Nabawasan ng 10 Barangay ang Makati, at Ano ang Nagbago',
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
            text: 'Sa 1 December 2021 decision sa G.R. No. 235316, ibinalik ng Supreme Court, with modification, ang trial-court ruling na bahagi ng Taguig ang Parcels 3 at 4 ng Fort Bonifacio Military Reservation. Denied with finality noong 28 September 2022 ang motion for reconsideration ng Makati. Noong June 2023, hindi rin pinayagan ng Court ang paghahain ng second motion for reconsideration.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Sumunod ang official geographic coding. Sa third-quarter 2023 Philippine Standard Geographic Code update, inilipat ng Philippine Statistics Authority sa Taguig ang Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Northside, Post Proper Southside, Rizal, South Cembo at West Rembo.',
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
            text: 'May statistical break dahil sa transfer. Ayon sa PSA, 309,770 ang residents ng natitirang 23 Makati barangays noong 2024. Kung ikukumpara iyon diretso sa dating citywide 2020 total na parang hindi nagbago ang geography, mali ang magiging picture ng demographic change. Kailangang hiwalay ang current-boundary at former-boundary series.',
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
            text: 'Pansamantalang inilagay ng DepEd ang 14 affected public schools sa direct supervision ng Office of the Secretary. Sa Makati–Taguig–DepEd agreement na ipinatupad sa DepEd Order No. 001, s. 2024, inako ng Schools Division of Taguig City and Pateros ang management at operation simula 1 January 2024. Nanatili sa proper authorities ang final determination sa magkaibang claims ng mga city sa ownership ng school land, buildings, facilities at equipment.',
            evidence: { sourceIds: ['6'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Sa current health directory ng Taguig, may barangay health centers sa siyam sa sampung transferred barangays: Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Southside, Rizal, South Cembo at West Rembo. May isa rin sa apat na 24/7 Super Health Centers ng Taguig sa East Rembo. Walang nakalistang Post Proper Northside barangay health center sa directory na na-check para sa report na ito; limitation iyon ng listahan, hindi proof na walang health-service access ang residents.',
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
            text: 'Para sa 2025 elections, inilagay ng COMELEC Resolution No. 11069 ang Comembo, Pembo at Rizal sa first legislative and councilor district ng Taguig. Ang Cembo, East Rembo, Pitogo, Post Proper Northside, Post Proper Southside, South Cembo at West Rembo naman ay inilagay sa second. Naglaan din ang resolution ng 12 councilor seats sa bawat district.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Kaya pinananatili ng BetterMakati sa historical Makati record ang pre-transfer EMBO election results, pero hindi na isinasama ang post-transfer EMBO results sa current Makati barangay totals.',
            evidence: { sourceIds: ['3', '8'] },
          },
        ],
      },
      {
        id: 'fiscal',
        heading:
          'Totoo ang fiscal effect, pero hindi ito simpleng money transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Inatasan ng DBM ang national agencies na isaalang-alang ang final Makati–Taguig decision sa budget matters na may kinalaman sa transferred barangays, at isinama sa final FY2024 National Tax Allotment process ang boundary changes. Sa 2024 city receipts table ng DBM, ₱1.006 billion ang NTA receipts ng Makati at ₱3.149 billion ang sa Taguig.',
            evidence: { sourceIds: ['9', '10', '11'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Tumaas ang recorded NTA receipts ng Taguig mula ₱2.487 billion noong 2023 tungong ₱3.149 billion noong 2024, increase na humigit-kumulang ₱662 million o 26.6%. Sa parehong 2024 DBM table, ₱18.903 billion ang local-source receipts ng Makati at ₱16.146 billion ang sa Taguig.',
            evidence: { sourceIds: ['11', '12'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Hindi dapat ipakita ang mga figures bilang peso-for-peso transfer mula Makati papuntang Taguig. Nagbago ang national allotments sa iba’t ibang LGU at bahagi lang ito ng city finances. Mas eksaktong conclusion: binago ng boundary adjustment ang allocation basis, habang malaki ang itinaas ng recorded NTA receipts ng Taguig sa unang full fiscal year pagkatapos ng transfer.',
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
            text: 'Na-settle ng boundary ruling kung saang city kabilang ang 10 barangay. Hindi nito awtomatikong napagdesisyunan kung sino ang may-ari ng bawat school, health center, park o ibang facility na itinayo o dating pinatatakbo ng Makati. Noong January 2024, nagbukas muli ang West Rembo Fire Station sa ilalim ng transition arrangement na nagpahintulot sa Bureau of Fire Protection na gamitin ito habang pinag-uusapan pa ang ibang issues.',
            evidence: { sourceIds: ['1', '13'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Noong 22 May 2025, nag-grant ang Taguig RTC Branch 153 ng writ of preliminary injunction na sumasakop sa health centers, covered courts, day care centers at iba pang essential facilities. Pinayagan nito ang continued access at control ng Taguig habang nagpapatuloy ang trial sa better right of possession. Provisional remedy ito, hindi final judgment sa ownership.',
            evidence: { sourceIds: ['14'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Ang dating Makati Park and Garden ay kasalukuyang ino-operate ng Taguig bilang TLC People’s Park sa West Rembo at nakalista bilang public recreational facility. Patunay iyon ng present administration at use, hindi final judicial determination ng title.',
            evidence: { sourceIds: ['15'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Sa 3 October 2026 research cutoff ng report, walang nahanap na mas bagong publicly verifiable final merits decision na nagresolba sa broader facility-possession o ownership case. Kaya tatlong hiwalay na statements ang suportado ng current record: settled na ang Taguig jurisdiction; may court-backed operational control ang Taguig sa facilities na sakop ng preliminary injunction; at unresolved pa sa public record na nahanap para sa report ang final ownership o better right of possession.',
            evidence: { sourceIds: ['14'] },
          },
        ],
      },
    ],
    methodology: {
      title: 'Note sa boundary at legal status',
      text: 'Ginagamit ng population comparisons ang current official 23-barangay Makati geography at 2024 POPCEN para sa transferred barangays. Inilalarawan lang ang legal status hanggang sa level na established ng cited judgments o interim orders. Hindi tinatrato ang preliminary injunction sa facility access at possession bilang final ruling sa title.',
      evidence: { sourceIds: ['1', '3', '4', '5', '14'] },
    },
  },
};

export default reportModule;
