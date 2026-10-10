import type { FeaturedReportModule } from '../reportTypes';

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'makati-political-dynasties-election-record',
    date: '5 October 2026',
    headline:
      'Makati’s Political Dynasty: What the Election Record Actually Shows',
    subheadline:
      'Five members of the Binay family have won Makati’s mayoralty since 1988. The record shows both succession across terms and relatives holding local or national office at the same time—but it does not, by itself, prove why voters chose them or what caused particular policy outcomes.',
    synthesis:
      'Makati’s modern mayoral history is a documented case of family continuity: a Binay family member won every regular mayoral election in the city record from 1988 through 2025. That continuity includes direct succession, returns after term limits, simultaneous service in different offices and two recent contests between relatives. These are measurable political relationships; judgments about performance, voter motives or legal disqualification require separate evidence.',
    sections: [
      {
        id: 'definition-and-law',
        heading:
          '“Political dynasty” is a constitutional category still awaiting a statutory definition',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Article II, Section 26 of the 1987 Constitution directs the State to guarantee equal access to public service and prohibit political dynasties “as may be defined by law.” On 26 August 2026, the Supreme Court held that Congress has a mandatory constitutional duty to enact that law. The Court did not itself define which relatives, offices or succession patterns are prohibited, and it declined to direct COMELEC to disqualify candidates without legislation supplying those rules.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text: 'This report therefore uses “dynasty” descriptively, not as a present ground for disqualification. It records two observable patterns used in research: relatives serving in elected office during the same period, and relatives succeeding one another across election terms.',
            evidence: { sourceIds: ['2', '8'] },
          },
        ],
      },
      {
        id: 'family-and-offices',
        heading: 'Five family members have served as Makati mayor',
        blocks: [
          {
            kind: 'table',
            title: 'Documented offices in the Binay family network',
            caption:
              'Years describe the offices relevant to Makati’s political succession. They do not imply uninterrupted service where an acting mayor or legal interruption occurred.',
            columns: [
              { key: 'person', label: 'Person' },
              { key: 'relationship', label: 'Family relationship' },
              { key: 'offices', label: 'Selected elected offices' },
            ],
            rows: [
              {
                person: 'Jejomar C. Binay',
                relationship:
                  'Spouse of Elenita; father of Nancy, Abby and Junjun',
                offices:
                  'Makati mayor, 1988–1998 and 2001–2010; Vice President, 2010–2016',
              },
              {
                person: 'Elenita S. Binay',
                relationship: 'Spouse of Jejomar',
                offices: 'Makati mayor, 1998–2001',
              },
              {
                person: 'Jejomar Erwin “Junjun” S. Binay Jr.',
                relationship: 'Son of Jejomar and Elenita',
                offices: 'Makati mayor, 2010–2015; earlier city councilor',
              },
              {
                person: 'Mar-len Abigail “Abby” S. Binay-Campos',
                relationship:
                  'Daughter of Jejomar and Elenita; spouse of Luis Campos Jr.',
                offices:
                  'Makati 2nd District representative, 2007–2016; Makati mayor, 2016–2025',
              },
              {
                person: 'Maria Lourdes Nancy S. Binay',
                relationship: 'Daughter of Jejomar and Elenita',
                offices: 'Senator, 2013–2025; Makati mayor, 2025–present',
              },
              {
                person: 'Luis Campos Jr.',
                relationship: 'Spouse of Abby Binay',
                offices: 'Makati 2nd District representative, 2016–2025',
              },
            ],
            evidence: { sourceIds: ['3', '5', '6', '7', '8', '9'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The sequence is both vertical and horizontal. Vertical continuity appears when one relative follows another across terms: Jejomar to Elenita in 1998, Elenita back to Jejomar in 2001, Jejomar to Junjun in 2010, and Abby to Nancy in 2025. Horizontal overlap appears when relatives hold different offices during the same period, including the 2007–2010 overlap of Jejomar as mayor, Abby as representative and Junjun as councilor, and later overlaps among local, House and Senate positions.',
            evidence: { sourceIds: ['3', '6', '8'] },
          },
        ],
      },
      {
        id: 'mayoral-election-record',
        heading:
          'The regular mayoral election record is continuous, but not politically uniform',
        blocks: [
          {
            kind: 'stat',
            label: 'Regular mayoral elections won by a Binay family member',
            value: '10 of 10',
            detail:
              'BetterMakati’s candidate-level series covers every regular Makati mayoral election from 1998 through 2025. The city’s historical record also identifies Jejomar Binay as the winner in 1988, followed by reelections in 1992 and 1995.',
            evidence: { sourceIds: ['3', '4'] },
          },
          {
            kind: 'table',
            title: 'Makati mayoral winners, 1998–2025',
            caption:
              'The 2025 result covers Makati’s current 23-barangay geography; earlier results included the 10 barangays later transferred to Taguig.',
            columns: [
              { key: 'year', label: 'Election' },
              { key: 'winner', label: 'Winner' },
              { key: 'runnerUp', label: 'Second place' },
              { key: 'margin', label: 'Vote margin', align: 'right' },
            ],
            rows: [
              {
                year: '1998',
                winner: 'Elenita Binay',
                runnerUp: 'Toro Yabut',
                margin: '54,918',
              },
              {
                year: '2001',
                winner: 'Jejomar Binay',
                runnerUp: 'Edu Manzano',
                margin: '65,963',
              },
              {
                year: '2004',
                winner: 'Jejomar Binay',
                runnerUp: 'Oscar Ibay',
                margin: '136,137',
              },
              {
                year: '2007',
                winner: 'Jejomar Binay',
                runnerUp: 'Lito Lapid',
                margin: '176,353',
              },
              {
                year: '2010',
                winner: 'Junjun Binay',
                runnerUp: 'Ernesto Mercado',
                margin: '45,513',
              },
              {
                year: '2013',
                winner: 'Junjun Binay',
                runnerUp: 'Rene Bondal',
                margin: '182,957',
              },
              {
                year: '2016',
                winner: 'Abby Binay',
                runnerUp: 'Kid Peña',
                margin: '18,063',
              },
              {
                year: '2019',
                winner: 'Abby Binay',
                runnerUp: 'Junjun Binay',
                margin: '80,869',
              },
              {
                year: '2022',
                winner: 'Abby Binay',
                runnerUp: 'Joel Hernandez',
                margin: '322,179',
              },
              {
                year: '2025',
                winner: 'Nancy Binay',
                runnerUp: 'Luis Campos Jr.',
                margin: '29,234',
              },
            ],
            evidence: {
              sourceIds: ['4'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
                {
                  recordType: 'election-record',
                  id: 'mayoral-history',
                  href: '/elections#mayoral-history',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Family continuity did not eliminate competition within the family. Abby Binay defeated her brother Junjun in the 2019 mayoral election. In 2025, Nancy Binay defeated her brother-in-law Luis Campos Jr. The same family network therefore appeared on opposing sides of two recent mayoral contests.',
            evidence: { sourceIds: ['4', '9'] },
          },
        ],
      },
      {
        id: 'what-the-record-can-show',
        heading: 'What the record establishes—and what it does not',
        blocks: [
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The evidence supports a narrow conclusion: Makati has experienced unusually durable family continuity in its mayoralty, reinforced at different times by relatives in the council, House, Senate and vice presidency. A University of the Philippines study of Metro Manila elections from 1988 to 2013 separately identified both simultaneous and inter-term Binay linkages, while cautioning that a dynasty index is a measure of family connections in office, not a finding about policy performance.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Election results alone cannot establish why individual voters chose a candidate, whether family continuity caused a specific public-service outcome, or whether any candidate should be legally barred. Those questions require voter research, policy evaluation or a statutory rule that did not exist at this report’s 5 October 2026 cutoff. The report therefore does not score candidates, infer motives or treat shared family membership as proof of misconduct.',
            evidence: { sourceIds: ['2', '4', '8'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: '1987 Philippine Constitution — Article II, Section 26',
        href: 'https://lawphil.net/consti/cons1987.html',
        sourceKind: 'official-external',
        publisher: 'LawPhil Project / Supreme Court E-Library',
        publishedOrPeriod: '1987 Constitution',
        checkedOn: '5 October 2026',
      },
      {
        id: '2',
        label: 'Press Briefer — consolidated political-dynasty cases',
        href: 'https://sc.judiciary.gov.ph/press-briefer-september-16-2026/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '16 September 2026; decision dated 26 August 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '3',
        label: 'Makati city historical profile',
        href: 'https://www.makati.gov.ph/cms/the-city/city-profile/76?content=797',
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        checkedOn: '5 October 2026',
      },
      {
        id: '4',
        label: 'BetterMakati mayoral election history, 1998–2025',
        href: '/elections#mayoral-history',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod: 'Regular mayoral elections, 1998–2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '5',
        label: 'Nancy Binay — current Makati elected-official record',
        href: '/officials/nancy-binay',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod: '2025–2028 term',
        checkedOn: '5 October 2026',
      },
      {
        id: '6',
        label: 'Mar-len Abigail “Abby” Binay — 2025 candidate profile',
        href: 'https://verafiles.org/articles/mar-len-abigail-abby-binay',
        sourceKind: 'secondary',
        publisher: 'VERA Files',
        publishedOrPeriod: '10 February 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '7',
        label: 'Maria Lourdes Nancy S. Binay — Senate biography',
        href: 'https://issuances-library.senate.gov.ph/senator/binay-maria-lourdes-nancy-s',
        sourceKind: 'official-external',
        publisher: 'Senate of the Philippines',
        publishedOrPeriod: 'Senate service, 2013–2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '8',
        label: 'Measuring political dynasties in Metro Manila',
        href: 'https://pre.econ.upd.edu.ph/index.php/pre/article/download/952/853',
        sourceKind: 'secondary',
        publisher:
          'The Philippine Review of Economics, University of the Philippines',
        publishedOrPeriod: 'June 2017',
        checkedOn: '5 October 2026',
      },
      {
        id: '9',
        label: 'How Philippine regions voted in 2025',
        href: 'https://pcij.org/2025/05/19/how-philippine-regions-voted-few-victories-versus-dynasties-but-reform-hopes-rise-for-2028-presidential-campaign/',
        sourceKind: 'secondary',
        publisher: 'Philippine Center for Investigative Journalism',
        publishedOrPeriod: '19 May 2025',
        checkedOn: '5 October 2026',
      },
    ],
    methodology: {
      title: 'Scope and definition',
      text: 'The family network is limited to relationships supported by the cited biographies and profiles. Election counts use BetterMakati’s existing candidate-level mayoral series. “Dynasty” describes simultaneous or successive elected service by relatives; it is not used here as a legal disqualification, a performance rating or evidence of wrongdoing.',
      evidence: { sourceIds: ['2', '4', '6', '7', '8'] },
    },
  },
  fil: {
    headline:
      'Ang Political Dynasty sa Makati: Ano Talaga ang Ipinapakita ng Election Record',
    subheadline:
      'Limang miyembro ng Binay family ang nanalo bilang mayor ng Makati mula 1988. Makikita sa record ang succession across terms at mga panahong sabay na nasa local o national office ang magkakamag-anak—pero hindi nito awtomatikong pinapatunayan kung bakit sila pinili ng voters o kung ano ang sanhi ng isang policy outcome.',
    synthesis:
      'Dokumentadong family continuity ang modern mayoral history ng Makati: nanalo ang isang miyembro ng Binay family sa bawat regular mayoral election na nasa city record mula 1988 hanggang 2025. Kasama rito ang direct succession, pagbalik matapos ang term limit, sabay na paghawak ng magkakaibang offices at dalawang recent contests sa pagitan ng relatives. Nasusukat ang political relationships na ito; hiwalay na ebidensya ang kailangan para humusga sa performance, voter motives o legal disqualification.',
    sections: [
      {
        id: 'definition-and-law',
        heading:
          'Constitutional category ang “political dynasty,” pero wala pang statutory definition',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Inaatasan ng Article II, Section 26 ng 1987 Constitution ang State na tiyakin ang equal access sa public service at ipagbawal ang political dynasties “as may be defined by law.” Noong 26 August 2026, sinabi ng Supreme Court na mandatory constitutional duty ng Congress na ipasa ang batas na iyon. Hindi mismong Court ang nagtakda kung aling relatives, offices o succession patterns ang bawal, at hindi nito inatasan ang COMELEC na mag-disqualify ng candidates nang walang batas na naglalatag ng rules.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text: 'Kaya descriptive ang gamit ng report sa “dynasty,” hindi current ground for disqualification. Dalawang observable pattern ang nire-record nito: relatives na nasa elected office sa parehong period, at relatives na nagsusunod sa magkakaibang election terms.',
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
                relationship:
                  'Asawa ni Elenita; ama nina Nancy, Abby at Junjun',
                offices:
                  'Makati mayor, 1988–1998 at 2001–2010; Vice President, 2010–2016',
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
                relationship:
                  'Anak nina Jejomar at Elenita; asawa ni Luis Campos Jr.',
                offices:
                  'Makati 2nd District representative, 2007–2016; Makati mayor, 2016–2025',
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
            text: 'Parehong vertical at horizontal ang sequence. Makikita ang vertical continuity kapag kamag-anak ang sumunod sa susunod na term: Jejomar kay Elenita noong 1998, Elenita pabalik kay Jejomar noong 2001, Jejomar kay Junjun noong 2010, at Abby kay Nancy noong 2025. Makikita naman ang horizontal overlap kapag sabay na may hawak na magkakaibang offices ang relatives, kabilang ang 2007–2010 na mayor si Jejomar, representative si Abby at councilor si Junjun, at ang mga sumunod na overlap sa local, House at Senate posts.',
            evidence: { sourceIds: ['3', '6', '8'] },
          },
        ],
      },
      {
        id: 'mayoral-election-record',
        heading:
          'Continuous ang regular mayoral record, pero hindi uniform ang competition',
        blocks: [
          {
            kind: 'stat',
            label:
              'Regular mayoral elections na napanalunan ng Binay family member',
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
              {
                year: '1998',
                winner: 'Elenita Binay',
                runnerUp: 'Toro Yabut',
                margin: '54,918',
              },
              {
                year: '2001',
                winner: 'Jejomar Binay',
                runnerUp: 'Edu Manzano',
                margin: '65,963',
              },
              {
                year: '2004',
                winner: 'Jejomar Binay',
                runnerUp: 'Oscar Ibay',
                margin: '136,137',
              },
              {
                year: '2007',
                winner: 'Jejomar Binay',
                runnerUp: 'Lito Lapid',
                margin: '176,353',
              },
              {
                year: '2010',
                winner: 'Junjun Binay',
                runnerUp: 'Ernesto Mercado',
                margin: '45,513',
              },
              {
                year: '2013',
                winner: 'Junjun Binay',
                runnerUp: 'Rene Bondal',
                margin: '182,957',
              },
              {
                year: '2016',
                winner: 'Abby Binay',
                runnerUp: 'Kid Peña',
                margin: '18,063',
              },
              {
                year: '2019',
                winner: 'Abby Binay',
                runnerUp: 'Junjun Binay',
                margin: '80,869',
              },
              {
                year: '2022',
                winner: 'Abby Binay',
                runnerUp: 'Joel Hernandez',
                margin: '322,179',
              },
              {
                year: '2025',
                winner: 'Nancy Binay',
                runnerUp: 'Luis Campos Jr.',
                margin: '29,234',
              },
            ],
            evidence: {
              sourceIds: ['4'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
                {
                  recordType: 'election-record',
                  id: 'mayoral-history',
                  href: '/elections#mayoral-history',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Hindi nawala ang competition sa loob mismo ng family. Tinalo ni Abby Binay ang kapatid niyang si Junjun sa 2019 mayoral election. Noong 2025, tinalo ni Nancy Binay ang brother-in-law niyang si Luis Campos Jr. Kaya magkalaban ang members ng parehong family network sa dalawang recent mayoral contests.',
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
            text: 'Isang narrow conclusion ang suportado ng evidence: unusually durable ang family continuity sa Makati mayoralty, at sa iba’t ibang panahon ay sinabayan ito ng relatives sa council, House, Senate at vice presidency. Hiwalay na tinukoy ng isang University of the Philippines study sa Metro Manila elections mula 1988 hanggang 2013 ang simultaneous at inter-term Binay linkages, habang nilinaw na measure ng family connections in office ang dynasty index, hindi finding tungkol sa policy performance.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Hindi kayang patunayan ng election results lang kung bakit pinili ng bawat voter ang isang candidate, kung family continuity ang sanhi ng isang public-service outcome, o kung dapat legal na ma-bar ang sinumang candidate. Kailangan ng voter research, policy evaluation o statutory rule para sa mga tanong na iyon—at wala pang ganitong national rule sa 5 October 2026 cutoff ng report. Kaya hindi nagso-score ng candidates, nag-i-infer ng motives o tumatrato sa family membership bilang proof of misconduct ang report.',
            evidence: { sourceIds: ['2', '4', '8'] },
          },
        ],
      },
    ],
    methodology: {
      title: 'Scope at definition',
      text: 'Limitado ang family network sa relationships na suportado ng cited biographies at profiles. Galing sa existing candidate-level mayoral series ng BetterMakati ang election counts. Descriptive ang “dynasty” para sa simultaneous o successive elected service ng relatives; hindi ito ginagamit bilang legal disqualification, performance rating o evidence of wrongdoing.',
      evidence: { sourceIds: ['2', '4', '6', '7', '8'] },
    },
  },
};

export default reportModule;
