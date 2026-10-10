import type { FeaturedReportModule } from '../reportTypes';

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'makati-subway-from-promise-to-stalled-project',
    date: '5 October 2026',
    headline:
      'The Makati Subway: From a 10-Station Promise to a Stalled Project',
    subheadline:
      'The proposed US$3.5-billion, 10-station intra-city railway reached a joint venture, engineering contracts and limited site works. The EMBO boundary ruling then changed the route economics, the original private partner exited, and no construction restart has been publicly confirmed.',
    synthesis:
      'The Makati Subway was more than a drawing: it had a signed joint venture, a notice to proceed, contractors, land arrangements and limited works around Station 3. It is also not an active railway build today. The planned depot and two eastern stations are now in Taguig, Infradev declared the original project infeasible, and the joint venture moved into arbitration and settlement. Assets and studies may support a future project, but that is different from evidence of a funded, approved and active replacement subway.',
    sections: [
      {
        id: 'promise-and-contract',
        heading:
          'The project reached contracts and preparatory works, but not rail construction',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In 2018, Makati selected a consortium led by IRC Properties, later renamed Philippine Infradev Holdings. The city and Infradev signed their joint venture on 30 July 2019. The proponent received a notice to proceed on 18 February 2020 for a project estimated at US$3.5 billion with a five-year completion period.',
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'legislation',
                  id: 'ordinance-2019-a-020',
                  href: '/legislation?record=ordinance-2019-a-020',
                },
              ],
            },
          },
          {
            kind: 'table',
            title: 'Documented milestones of the original project',
            columns: [
              { key: 'milestoneDate', label: 'Date' },
              { key: 'milestone', label: 'Milestone' },
              { key: 'whatItProves', label: 'What it establishes' },
            ],
            rows: [
              {
                milestoneDate: '23 Oct 2018',
                milestone: 'Notice of Award',
                whatItProves: 'Infradev-led consortium selected',
              },
              {
                milestoneDate: '30 Jul 2019',
                milestone: 'Joint venture signed',
                whatItProves: 'Binding city–private partner project',
              },
              {
                milestoneDate: '18 Feb 2020',
                milestone: 'Notice to proceed',
                whatItProves: 'Implementation stage authorized',
              },
              {
                milestoneDate: '8 Sep 2020',
                milestone: 'US$1.21B EPC contracts',
                whatItProves: 'Civil and systems contractors engaged',
              },
              {
                milestoneDate: 'By Apr 2025 filing',
                milestone: 'Station 3 early works recorded',
                whatItProves:
                  'Excavation, shoring and mat foundations; not an operating railway',
              },
              {
                milestoneDate: '2 May 2025',
                milestone: 'Infradev declared project infeasible',
                whatItProves:
                  'Original continuation path ended and arbitration began',
              },
            ],
            evidence: { sourceIds: ['2', '3'] },
          },
        ],
      },
      {
        id: 'route-and-embo',
        heading:
          'The eastern end of the route was directly affected by the EMBO transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The public project description was for 10 underground stations over roughly 10–11 kilometres, running from Ayala–EDSA toward eastern Makati and the EMBO area. Reported key locations included Ayala Triangle, Makati City Hall, the University of Makati and Ospital ng Makati. The company filing places Station 3 around Gil Puyat–Dela Rosa–Urban and Station 5 along J.P. Rizal at the old City Hall.',
            evidence: {
              sourceIds: ['2', '4', '5'],
              records: [
                {
                  recordType: 'place',
                  id: 'makati-city-hall',
                  href: '/civic-map/makati-city-hall',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'After the Makati–Taguig boundary judgment became final, the planned depot and two station sites were in Taguig. Public reporting identified the affected stations as the University of Makati in West Rembo and Ospital ng Makati in Pembo. For an intra-city line whose economics depended on the full alignment and associated development, that was a material change in jurisdiction and project viability.',
            evidence: { sourceIds: ['3', '6', '7'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The boundary ruling did not make a railway across Makati and Taguig technically impossible. It did mean the original Makati-only joint venture could not continue unchanged. Any cross-boundary replacement would need a new intergovernmental, contractual, route and financing arrangement.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'exit-arbitration-settlement',
        heading:
          'The original partner exited; settlement followed, not a construction restart',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'On 2 May 2025, Infradev told the Philippine Stock Exchange that its board had found continuation under the 2019 joint venture no longer economically and operationally feasible and had commenced arbitration at the Singapore International Arbitration Centre. This is the clearest primary-source break in the original implementation path.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In January 2026, the Makati City Council authorized and ratified a new settlement framework through Resolutions 2026-008 and 2026-011. The reported exchange would transfer the project company and related assets to the city. The city archive title for Resolution 2026-011 refers to authorization under Resolution 2026-007, while Ordinance 2026-015 cross-references Resolutions 2026-008 and 2026-011; BetterMakati preserves that unresolved discrepancy rather than silently choosing one reference. On 18 February 2026, Infradev said the SIAC case remained pending and that the proceedings and negotiations were confidential; it did not publicly confirm the detailed commercial terms.',
            evidence: {
              sourceIds: ['8', '9'],
              records: [
                {
                  recordType: 'legislation',
                  id: 'resolution-2026-008',
                  href: '/legislation?record=resolution-2026-008',
                },
                {
                  recordType: 'legislation',
                  id: 'resolution-2026-011',
                  href: '/legislation?record=resolution-2026-011',
                },
                {
                  recordType: 'legislation',
                  id: 'ordinance-2026-015',
                  href: '/legislation?record=ordinance-2026-015',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Three matters therefore need to be separated: settlement of the former joint venture, ownership of the company and assets, and actual revival of the railway. A settlement may preserve land, studies or the corporate vehicle, but it is not a substitute for a new feasibility case, appropriation or financing, route approval, permits, contractors and construction timetable.',
            evidence: { sourceIds: ['8', '9'] },
          },
        ],
      },
      {
        id: 'current-status',
        heading:
          'At the 5 October 2026 cutoff, the railway is stalled and no replacement build is confirmed',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The PPP Center still lists the Makati City Subway System Project in its database as pre-construction, while Infradev’s 2025 disclosure says continuation of the original joint venture was no longer feasible. Those different labels do not establish that work restarted; the safer reading is that the administrative registry has not been fully reconciled with the later arbitration and settlement record.',
            evidence: { sourceIds: ['3', '10'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'A credible restart would require a new public record: the implementing entity and operator, the revised alignment and station list, the arrangement for Taguig jurisdiction, updated cost and financing, approvals, procurement and a construction timetable. Until those exist, the Makati Subway is best described as a stalled former PPP with retained assets and an unresolved revival path—not as operating, under active construction, or an idea proven incapable of returning.',
            evidence: { sourceIds: ['3', '8', '9', '10'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati LGU and Infradev sign subway joint venture',
        href: 'https://ppp.gov.ph/in_the_news/makati-lgu-ph-infradev-holdings-ink-joint-venture-for-citys-subway-project/',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        publishedOrPeriod: '31 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '2',
        label: 'Philippine Infradev 2025 definitive information statement',
        href: 'https://www.infra.com.ph/wp-content/uploads/2025/08/Philippine-Infradev-Holdings-Inc.-Definitive-Information-Statement-2025.pdf',
        sourceKind: 'official-external',
        publisher: 'Philippine Infradev Holdings / PSE filing',
        publishedOrPeriod: '2025 filing; project events through April 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '3',
        label:
          'Arbitration proceedings relating to the Makati City Subway Project',
        href: 'https://edge.pse.com.ph/downloadHtml.do?file_id=1757337',
        sourceKind: 'official-external',
        publisher: 'Philippine Stock Exchange EDGE / Philippine Infradev',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '4',
        label: 'Makati signs US$3.5-billion, 10-station subway joint venture',
        href: 'https://www.pna.gov.ph/articles/1076520',
        sourceKind: 'official-external',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '30 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '5',
        label: 'Original route and key-station description',
        href: 'https://www.gmanetwork.com/news/topstories/metro/944779/abby-binay-makati-in-talks-with-new-domestic-partner-for-intra-city-railway-project/story/',
        sourceKind: 'secondary',
        publisher: 'GMA Integrated News',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '6',
        label: 'Makati–Taguig boundary decision and EMBO transition report',
        href: '/reports/embo-makati-taguig-transition',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod:
          'Boundary and transition record through 3 October 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '7',
        label: 'The case of the Makati Intra-city Subway project',
        href: 'https://pidswebs.pids.gov.ph/CDN/document/pidsdps2443.pdf',
        sourceKind: 'secondary',
        publisher: 'Philippine Institute for Development Studies',
        publishedOrPeriod: 'December 2024 discussion paper',
        checkedOn: '5 October 2026',
      },
      {
        id: '8',
        label: 'Makati–Infradev settlement and council resolutions',
        href: 'https://www.philippine-resources.com/articles/2026/6/makati-gains-control-of-subway-project-following-infradev-settlement',
        sourceKind: 'secondary',
        publisher: 'Philippine Resources Journal',
        publishedOrPeriod: '4 June 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '9',
        label: 'Infradev declines to disclose settlement details',
        href: 'https://context.ph/2026/02/19/infradev-declines-to-disclose-subway-settlement-details/',
        sourceKind: 'secondary',
        publisher: 'Context.ph',
        publishedOrPeriod: '19 February 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '10',
        label: 'Makati City Subway System Project database record',
        href: 'https://ppp.gov.ph/project-database/?project_sector=1768&search=true',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        checkedOn: '5 October 2026',
      },
    ],
    methodology: {
      title: 'Status and uncertainty note',
      text: 'Company disclosures, government PPP records and the official boundary record take priority. Strong secondary reporting is used for station names and January 2026 settlement events whose complete official text is not accessible on the city portal. A settlement, asset transfer or database label is not treated as proof of a construction restart.',
      evidence: { sourceIds: ['2', '3', '6', '8', '9', '10'] },
    },
  },
  fil: {
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
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'legislation',
                  id: 'ordinance-2019-a-020',
                  href: '/legislation?record=ordinance-2019-a-020',
                },
              ],
            },
          },
          {
            kind: 'table',
            title: 'Mga documented milestone ng original project',
            columns: [
              { key: 'milestoneDate', label: 'Petsa' },
              { key: 'milestone', label: 'Milestone' },
              { key: 'whatItProves', label: 'Ano ang pinapatunayan' },
            ],
            rows: [
              {
                milestoneDate: '23 Oct 2018',
                milestone: 'Notice of Award',
                whatItProves: 'Napili ang Infradev-led consortium',
              },
              {
                milestoneDate: '30 Jul 2019',
                milestone: 'Joint venture signed',
                whatItProves: 'Naging binding city–private partner project',
              },
              {
                milestoneDate: '18 Feb 2020',
                milestone: 'Notice to proceed',
                whatItProves: 'Pinayagan ang implementation stage',
              },
              {
                milestoneDate: '8 Sep 2020',
                milestone: 'US$1.21B EPC contracts',
                whatItProves: 'May civil at systems contractors',
              },
              {
                milestoneDate: 'By Apr 2025 filing',
                milestone: 'Station 3 early works recorded',
                whatItProves:
                  'May excavation, shoring at mat foundations; hindi pa operating railway',
              },
              {
                milestoneDate: '2 May 2025',
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
            text: 'Noong January 2026, nag-authorize at nag-ratify ang Makati City Council ng bagong settlement framework sa pamamagitan ng Resolutions 2026-008 at 2026-011. Iniulat na kapalit ng settlement ang transfer ng project company at related assets sa city. Sa title ng Resolution 2026-011 sa city archive, Resolution 2026-007 ang nakalagay na authorization; pero Resolutions 2026-008 at 2026-011 ang cross-reference ng Ordinance 2026-015. Pinapanatili ng BetterMakati ang unresolved discrepancy na ito sa halip na pumili nang walang sapat na record. Pero noong 18 February 2026, sinabi ng Infradev na pending pa sa SIAC ang case at confidential ang proceedings at negotiations; hindi nito kinumpirma sa publiko ang detailed commercial terms.',
            evidence: {
              sourceIds: ['8', '9'],
              records: [
                {
                  recordType: 'legislation',
                  id: 'resolution-2026-008',
                  href: '/legislation?record=resolution-2026-008',
                },
                {
                  recordType: 'legislation',
                  id: 'resolution-2026-011',
                  href: '/legislation?record=resolution-2026-011',
                },
                {
                  recordType: 'legislation',
                  id: 'ordinance-2026-015',
                  href: '/legislation?record=ordinance-2026-015',
                },
              ],
            },
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

export default reportModule;
