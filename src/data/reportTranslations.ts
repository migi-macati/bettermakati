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
  'makati-political-dynasties-election-record': {
    headline: 'Ang Political Dynasty sa Makati: Ano Talaga ang Ipinapakita ng Election Record',
    subheadline:
      'Limang miyembro ng Binay family ang nanalo bilang mayor ng Makati mula 1988. Makikita sa record ang succession across terms at mga panahong sabay na nasa local o national office ang magkakamag-anak—pero hindi nito awtomatikong pinapatunayan kung bakit sila pinili ng voters o kung ano ang sanhi ng isang policy outcome.',
    synthesis:
      'Dokumentadong family continuity ang modern mayoral history ng Makati: nanalo ang isang miyembro ng Binay family sa bawat regular mayoral election na nasa city record mula 1988 hanggang 2025. Kasama rito ang direct succession, pagbalik matapos ang term limit, sabay na paghawak ng magkakaibang offices at dalawang recent contests sa pagitan ng relatives. Nasusukat ang political relationships na ito; hiwalay na ebidensya ang kailangan para humusga sa performance, voter motives o legal disqualification.',
    sections: [
      {
        id: 'definition-and-law',
        heading: 'Constitutional category ang “political dynasty,” pero wala pang statutory definition',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Inaatasan ng Article II, Section 26 ng 1987 Constitution ang State na tiyakin ang equal access sa public service at ipagbawal ang political dynasties “as may be defined by law.” Noong 26 August 2026, sinabi ng Supreme Court na mandatory constitutional duty ng Congress na ipasa ang batas na iyon. Hindi mismong Court ang nagtakda kung aling relatives, offices o succession patterns ang bawal, at hindi nito inatasan ang COMELEC na mag-disqualify ng candidates nang walang batas na naglalatag ng rules.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text:
              'Kaya descriptive ang gamit ng report sa “dynasty,” hindi current ground for disqualification. Dalawang observable pattern ang nire-record nito: relatives na nasa elected office sa parehong period, at relatives na nagsusunod sa magkakaibang election terms.',
            evidence: { sourceIds: ['2', '8'] },
          },
        ],
      },
      {
        id: 'family-and-offices',
        heading: 'Limang miyembro ng pamilya ang nagsilbing mayor ng Makati',
        blocks: [
          {
            kind: 'table',
            title: 'Dokumentadong offices sa Binay family network',
            caption:
              'Ang years ay para sa offices na relevant sa political succession ng Makati. Hindi nito sinasabing tuloy-tuloy ang service kung may acting mayor o legal interruption.',
            columns: [
              { key: 'person', label: 'Tao' },
              { key: 'relationship', label: 'Relasyon sa pamilya' },
              { key: 'offices', label: 'Selected elected offices' },
            ],
            rows: [
              {
                person: 'Jejomar C. Binay',
                relationship: 'Asawa ni Elenita; ama nina Nancy, Abby at Junjun',
                offices: 'Makati mayor, 1988–1998 at 2001–2010; Vice President, 2010–2016',
              },
              {
                person: 'Elenita S. Binay',
                relationship: 'Asawa ni Jejomar',
                offices: 'Makati mayor, 1998–2001',
              },
              {
                person: 'Jejomar Erwin “Junjun” S. Binay Jr.',
                relationship: 'Anak nina Jejomar at Elenita',
                offices: 'Makati mayor, 2010–2015; dating city councilor',
              },
              {
                person: 'Mar-len Abigail “Abby” S. Binay-Campos',
                relationship: 'Anak nina Jejomar at Elenita; asawa ni Luis Campos Jr.',
                offices: 'Makati 2nd District representative, 2007–2016; Makati mayor, 2016–2025',
              },
              {
                person: 'Maria Lourdes Nancy S. Binay',
                relationship: 'Anak nina Jejomar at Elenita',
                offices: 'Senator, 2013–2025; Makati mayor, 2025–present',
              },
              {
                person: 'Luis Campos Jr.',
                relationship: 'Asawa ni Abby Binay',
                offices: 'Makati 2nd District representative, 2016–2025',
              },
            ],
            evidence: { sourceIds: ['3', '5', '6', '7', '8', '9'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Parehong vertical at horizontal ang sequence. Makikita ang vertical continuity kapag kamag-anak ang sumunod sa susunod na term: Jejomar kay Elenita noong 1998, Elenita pabalik kay Jejomar noong 2001, Jejomar kay Junjun noong 2010, at Abby kay Nancy noong 2025. Makikita naman ang horizontal overlap kapag sabay na may hawak na magkakaibang offices ang relatives, kabilang ang 2007–2010 na mayor si Jejomar, representative si Abby at councilor si Junjun, at ang mga sumunod na overlap sa local, House at Senate posts.',
            evidence: { sourceIds: ['3', '6', '8'] },
          },
        ],
      },
      {
        id: 'mayoral-election-record',
        heading: 'Continuous ang regular mayoral record, pero hindi uniform ang competition',
        blocks: [
          {
            kind: 'stat',
            label: 'Regular mayoral elections na napanalunan ng Binay family member',
            value: '10 sa 10',
            detail:
              'Sakop ng candidate-level series ng BetterMakati ang bawat regular Makati mayoral election mula 1998 hanggang 2025. Tinutukoy rin ng city historical record si Jejomar Binay bilang winner noong 1988, na sinundan ng reelections noong 1992 at 1995.',
            evidence: { sourceIds: ['3', '4'] },
          },
          {
            kind: 'table',
            title: 'Makati mayoral winners, 1998–2025',
            caption:
              'Current 23-barangay Makati geography ang sakop ng 2025 result; kasama pa sa earlier results ang 10 barangays na kalaunang nailipat sa Taguig.',
            columns: [
              { key: 'year', label: 'Election' },
              { key: 'winner', label: 'Winner' },
              { key: 'runnerUp', label: 'Second place' },
              { key: 'margin', label: 'Vote margin', align: 'right' },
            ],
            rows: [
              { year: '1998', winner: 'Elenita Binay', runnerUp: 'Toro Yabut', margin: '54,918' },
              { year: '2001', winner: 'Jejomar Binay', runnerUp: 'Edu Manzano', margin: '65,963' },
              { year: '2004', winner: 'Jejomar Binay', runnerUp: 'Oscar Ibay', margin: '136,137' },
              { year: '2007', winner: 'Jejomar Binay', runnerUp: 'Lito Lapid', margin: '176,353' },
              { year: '2010', winner: 'Junjun Binay', runnerUp: 'Ernesto Mercado', margin: '45,513' },
              { year: '2013', winner: 'Junjun Binay', runnerUp: 'Rene Bondal', margin: '182,957' },
              { year: '2016', winner: 'Abby Binay', runnerUp: 'Kid Peña', margin: '18,063' },
              { year: '2019', winner: 'Abby Binay', runnerUp: 'Junjun Binay', margin: '80,869' },
              { year: '2022', winner: 'Abby Binay', runnerUp: 'Joel Hernandez', margin: '322,179' },
              { year: '2025', winner: 'Nancy Binay', runnerUp: 'Luis Campos Jr.', margin: '29,234' },
            ],
            evidence: {
              sourceIds: ['4'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Hindi nawala ang competition sa loob mismo ng family. Tinalo ni Abby Binay ang kapatid niyang si Junjun sa 2019 mayoral election. Noong 2025, tinalo ni Nancy Binay ang brother-in-law niyang si Luis Campos Jr. Kaya magkalaban ang members ng parehong family network sa dalawang recent mayoral contests.',
            evidence: { sourceIds: ['4', '9'] },
          },
        ],
      },
      {
        id: 'what-the-record-can-show',
        heading: 'Ano ang pinapatunayan ng record—at ano ang hindi',
        blocks: [
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Isang narrow conclusion ang suportado ng evidence: unusually durable ang family continuity sa Makati mayoralty, at sa iba’t ibang panahon ay sinabayan ito ng relatives sa council, House, Senate at vice presidency. Hiwalay na tinukoy ng isang University of the Philippines study sa Metro Manila elections mula 1988 hanggang 2013 ang simultaneous at inter-term Binay linkages, habang nilinaw na measure ng family connections in office ang dynasty index, hindi finding tungkol sa policy performance.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Hindi kayang patunayan ng election results lang kung bakit pinili ng bawat voter ang isang candidate, kung family continuity ang sanhi ng isang public-service outcome, o kung dapat legal na ma-bar ang sinumang candidate. Kailangan ng voter research, policy evaluation o statutory rule para sa mga tanong na iyon—at wala pang ganitong national rule sa 5 October 2026 cutoff ng report. Kaya hindi nagso-score ng candidates, nag-i-infer ng motives o tumatrato sa family membership bilang proof of misconduct ang report.',
            evidence: { sourceIds: ['2', '4', '8'] },
          },
        ],
      },
    ],
    methodology: {
      title: 'Scope at definition',
      text:
        'Limitado ang family network sa relationships na suportado ng cited biographies at profiles. Galing sa existing candidate-level mayoral series ng BetterMakati ang election counts. Descriptive ang “dynasty” para sa simultaneous o successive elected service ng relatives; hindi ito ginagamit bilang legal disqualification, performance rating o evidence of wrongdoing.',
      evidence: { sourceIds: ['2', '4', '6', '7', '8'] },
    },
  },
  'makati-subway-from-promise-to-stalled-project': {
    headline:
      'Makati Subway: Mula sa 10-Station Promise Hanggang sa Natigil na Project',
    subheadline:
      'Ang dating US$3.5-billion, 10-station intra-city railway ay umabot sa joint venture, engineering contracts at limited site works. Pero binago ng EMBO boundary ruling ang route economics, umatras ang original private partner, at wala pang publicly confirmed construction restart.',
    synthesis:
      'Hindi simpleng “drawing” lang ang Makati Subway: may signed joint venture, notice to proceed, contractors, land arrangements at limited works sa Station 3. Pero hindi rin ito active railway build ngayon. Nasa Taguig na ang planned depot at dalawang eastern stations, idineklara ng Infradev na hindi na feasible ang original project, at nauwi sa arbitration at settlement ang joint venture. May assets at studies na maaaring magamit sa future project, pero hiwalay iyon sa proof na may funded, approved at running replacement subway na.',
    sections: [
      {
        id: 'promise-and-contract',
        heading:
          'May kontrata at preparatory works, pero hindi umabot sa rail construction',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Noong 2018, pinili ng Makati ang consortium na pinangungunahan ng IRC Properties, na kalaunan ay naging Philippine Infradev Holdings. Nilagdaan ng city at Infradev ang joint venture noong 30 July 2019. Natanggap ng proponent ang notice to proceed noong 18 February 2020 para sa project na tinatayang US$3.5 billion at limang taon ang completion period.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'table',
            title: 'Mga documented milestone ng original project',
            columns: [
              { key: 'date', label: 'Petsa' },
              { key: 'milestone', label: 'Milestone' },
              { key: 'whatItProves', label: 'Ano ang pinapatunayan' },
            ],
            rows: [
              {
                date: '23 Oct 2018',
                milestone: 'Notice of Award',
                whatItProves: 'Napili ang Infradev-led consortium',
              },
              {
                date: '30 Jul 2019',
                milestone: 'Joint venture signed',
                whatItProves: 'Naging binding city–private partner project',
              },
              {
                date: '18 Feb 2020',
                milestone: 'Notice to proceed',
                whatItProves: 'Pinayagan ang implementation stage',
              },
              {
                date: '8 Sep 2020',
                milestone: 'US$1.21B EPC contracts',
                whatItProves: 'May civil at systems contractors',
              },
              {
                date: 'By Apr 2025 filing',
                milestone: 'Station 3 early works recorded',
                whatItProves:
                  'May excavation, shoring at mat foundations; hindi pa operating railway',
              },
              {
                date: '2 May 2025',
                milestone: 'Infradev declared project infeasible',
                whatItProves:
                  'Tinapos ng original partner ang continuation path at nagsimula ng arbitration',
              },
            ],
            evidence: { sourceIds: ['2', '3'] },
          },
        ],
      },
      {
        id: 'route-and-embo',
        heading:
          'Ang eastern end ng route ang direktang tinamaan ng EMBO transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Ang public project description ay 10 underground stations sa humigit-kumulang 10–11 kilometro, mula Ayala–EDSA papunta sa eastern Makati/EMBO side. Kasama sa reported key locations ang Ayala Triangle, Makati City Hall, University of Makati at Ospital ng Makati. Sa company filing, ang Station 3 ay nasa Gil Puyat–Dela Rosa–Urban area at ang Station 5 ay nasa J.P. Rizal sa old City Hall.',
            evidence: { sourceIds: ['2', '4', '5'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Pagkatapos maging final ang Makati–Taguig boundary ruling, nasa Taguig na ang planned depot at dalawang station sites. Tinukoy ng public reporting ang University of Makati sa West Rembo at Ospital ng Makati sa Pembo bilang apektadong stations. Para sa isang intra-city line na nakadepende sa full route at associated developments, material change iyon sa jurisdiction at project economics.',
            evidence: { sourceIds: ['3', '6', '7'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Hindi ibig sabihin ng boundary ruling na teknikal na imposibleng magkaroon ng rail line across Makati at Taguig. Ang pinatunayan nito ay hindi na maipagpapatuloy nang pareho ang original Makati-only joint venture. Kailangan ng bagong intergovernmental, contractual, route at financing arrangement para sa anumang cross-boundary replacement.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'exit-arbitration-settlement',
        heading:
          'Umatras ang original partner; settlement ang sumunod, hindi construction restart',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Noong 2 May 2025, sinabi ng Infradev board sa PSE na hindi na economically at operationally feasible ang continuation sa ilalim ng 2019 joint venture at nagsimula ito ng arbitration sa Singapore International Arbitration Centre. Ito ang pinakalinaw na primary-source break sa original implementation path.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Noong January 2026, nag-authorize at nag-ratify ang Makati City Council ng bagong settlement framework sa pamamagitan ng Resolutions 2026-008 at 2026-011. Iniulat na kapalit ng settlement ang transfer ng project company at related assets sa city. Pero noong 18 February 2026, sinabi ng Infradev na pending pa sa SIAC ang case at confidential ang proceedings at negotiations; hindi nito kinumpirma sa publiko ang detailed commercial terms.',
            evidence: { sourceIds: ['8', '9'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Kaya dapat paghiwalayin ang tatlong bagay: settlement ng dating joint venture, ownership ng company/assets, at actual revival ng railway. Maaaring ma-preserve ng settlement ang lupa, studies o corporate vehicle, pero hindi iyon kapalit ng bagong feasibility case, appropriation o financing, route approval, permits, contractors at construction schedule.',
            evidence: { sourceIds: ['8', '9'] },
          },
        ],
      },
      {
        id: 'current-status',
        heading:
          'Sa 5 October 2026 cutoff, stalled ang railway at hindi pa may confirmed replacement build',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Nakalista pa rin ng PPP Center ang Makati City Subway System Project sa database nito bilang pre-construction, habang ang 2025 Infradev disclosure ay nagsasabing no longer feasible ang continuation ng original JVA. Ang magkaibang labels ay hindi proof na nag-restart ang construction; mas maingat na basahin ang registry bilang administrative listing na hindi pa fully reconciled sa later arbitration at settlement record.',
            evidence: { sourceIds: ['3', '10'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Ang credible restart ay mangangailangan ng bagong public record: sino ang implementing entity at operator, ano ang revised alignment at station list, paano tatawirin ang Taguig jurisdiction, magkano ang updated cost, saan manggagaling ang pondo, at ano ang procurement at construction timetable. Hangga’t wala ang mga iyon, dapat ilarawan ang Makati Subway bilang stalled former PPP with retained assets and an unresolved revival path—not as an operating, under-construction or fully cancelled idea that can never return.',
            evidence: { sourceIds: ['3', '8', '9', '10'] },
          },
        ],
      },
    ],
    methodology: {
      title: 'Status at uncertainty note',
      text: 'Priority ang company disclosures, government PPP records at official court-boundary record. Ginagamit ang strong secondary reporting para sa station names at January 2026 settlement events na wala pang complete official text sa accessible city portal. Hindi tinatrato ang settlement, asset transfer o database label bilang proof ng construction restart.',
      evidence: { sourceIds: ['2', '3', '6', '8', '9', '10'] },
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
