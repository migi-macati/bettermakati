import type { FeaturedReportModule } from '../reportTypes';

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'makati-consumer-bazaar-history-2026',
    date: '17 October 2026',
    headline: 'Makati’s Consumer Bazaar Is Older Than Its 2026 Partnership',
    subheadline: 'Five earlier editions are documented since 2022. The 2026 change is participation by partner LGUs, not the launch of the bazaar itself.',
    synthesis: 'Makati advertised Consumer Bazaars in November 2022, twice in 2023, February 2024 and October 2025. Its October 2026 edition is described as the first featuring products from partner local governments. The change broadens the market beyond Makati vendors, but announcements alone cannot establish sales, consumer savings or lasting producer benefits.',
    sections: [
      {
        id: 'documented-history',
        heading: 'The editions already on record',
        blocks: [
          {
            kind: 'table',
            title: 'Dated Consumer Bazaar announcements',
            caption: 'These are documented editions, not a complete inventory of all bazaars. Announcements do not independently establish attendance or sales.',
            columns: [
              { key: 'dates', label: 'Event dates' },
              { key: 'evidence', label: 'Documented activity' },
            ],
            rows: [
              { dates: '17–18 November 2022', evidence: 'City and EEMO bazaar at City Hall Quadrangle.' },
              { dates: '18–19 May 2023', evidence: 'Consumer Bazaar with DA and DTI cooperation.' },
              { dates: '18–19 October 2023', evidence: 'Separate Consumer Bazaar at City Hall Quadrangle.' },
              { dates: '22–23 February 2024', evidence: 'EEMO affordable-goods Consumer Bazaar.' },
              { dates: '16–17 October 2025', evidence: 'City events listing for Consumer Bazaar.' },
              { dates: '14–15 October 2026', evidence: 'First announced edition featuring partner-LGU products.' },
            ],
            evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct', 'pia2024', 'city2025', 'city2026', 'report2026'], records: [{ recordType: 'place', id: 'makati-city-hall', href: '/civic-map/makati-city-hall' }] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Two separately announced editions in 2023 show that the event was not necessarily annual. The earliest documented edition in this review is November 2022, which does not establish the original start date.',
            evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct'] },
          },
        ],
      },
      {
        id: '2026-expansion',
        heading: 'What changed in October 2026',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The city described its 2026 Consumer Bazaar as the first featuring local products from partner LGUs. Contemporary reporting names Alfonso Lista in Ifugao; Mapandan and Alaminos City in Pangasinan; Kabayan in Benguet; Vigan City in Ilocos Sur; and Taal in Batangas. KPKK and Makati MSMEs also participated.',
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The reported bazaar ran October 14–15 at Makati City Hall Quadrangle. Kadiwa ng Pangulo also offered subsidized rice at the venue on October 15. That was a separate initiative; its rice prices are not a Consumer Bazaar outcome.',
            evidence: { sourceIds: ['report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Inviting regional producers can expand exposure to Makati consumers. The event announcement does not establish subsequent orders, sustained market access or higher producer income.',
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
        ],
      },
      {
        id: 'results-to-measure',
        heading: 'What would show whether the expansion worked?',
        blocks: [
          {
            kind: 'table',
            title: 'Evidence needed to assess outcomes',
            columns: [
              { key: 'question', label: 'Question' },
              { key: 'evidence', label: 'Record needed' },
            ],
            rows: [
              { question: 'Did households save?', evidence: 'Comparable item prices, quantities and quality before and during the bazaar.' },
              { question: 'Did producers benefit?', evidence: 'Vendor counts, sales, costs, repeat orders and post-event transactions by participating LGU.' },
              { question: 'What did the city spend?', evidence: 'Event appropriations, contracts, logistics and staffing costs, plus partner contributions.' },
              { question: 'Was participation fair?', evidence: 'Vendor selection rules, stall allocations and feedback.' },
            ],
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Participation is a documented output. Claims of lower household costs, sustained producer income or positive public return remain unverified without comparable prices, sales and event-cost records.',
          },
        ],
      },
    ],
    sources: [
      { id: 'pia2022', label: 'PIA: Consumer Bazaar, 17–18 November 2022', href: 'https://mirror.pia.gov.ph/news/2022/11/15/de-kalidad-murang-produkto-mabibili-sa-consumer-bazaar-sa-makati', sourceKind: 'official-external', publisher: 'Philippine Information Agency', publishedOrPeriod: '15 November 2022', checkedOn: '16 October 2026' },
      { id: 'pia2023may', label: 'PIA: Consumer Bazaar, 18–19 May 2023', href: 'https://mirror.pia.gov.ph/news/2023/05/16/publiko-inaanyayahan-sa-isasagawang-consumer-bazaar-sa-makati', sourceKind: 'official-external', publisher: 'Philippine Information Agency', publishedOrPeriod: '16 May 2023', checkedOn: '16 October 2026' },
      { id: 'pia2023oct', label: 'PIA: Consumer Bazaar, 18–19 October 2023', href: 'https://pia.gov.ph/news/consumer-bazaar-isasagawa-sa-makati-city-hall-quadrangle/', sourceKind: 'official-external', publisher: 'Philippine Information Agency', publishedOrPeriod: '17 October 2023', checkedOn: '16 October 2026' },
      { id: 'pia2024', label: 'PIA: Consumer Bazaar, 22–23 February 2024', href: 'https://pia.gov.ph/news/consumer-bazaar-sa-makati-gaganapin-sa-peb-22-23/', sourceKind: 'official-external', publisher: 'Philippine Information Agency', publishedOrPeriod: '14 February 2024', checkedOn: '16 October 2026' },
      { id: 'city2025', label: 'Makati events: Consumer Bazaar, 16–17 October 2025', href: 'https://www.makati.gov.ph/content/events/128676', sourceKind: 'official-external', publisher: 'City Government of Makati', publishedOrPeriod: '13 October 2025', checkedOn: '16 October 2026' },
      { id: 'city2026', label: 'Makati news index: first Consumer Bazaar featuring partner LGUs', href: 'https://www.makati.gov.ph/content/news', sourceKind: 'official-external', publisher: 'City Government of Makati', publishedOrPeriod: '14 October 2026', checkedOn: '16 October 2026', note: 'The index headline establishes the city’s claimed first partner-LGU format; details corroborated separately.' },
      { id: 'report2026', label: 'Metro News Central: Makati opens Consumer Bazaar 2026', href: 'https://mail.metronewscentral.net/makati/metro-cities/makati-opens-consumer-bazaar-2026', sourceKind: 'secondary', publisher: 'Metro News Central', publishedOrPeriod: 'October 2026', checkedOn: '16 October 2026' },
    ],
    methodology: {
      title: 'Scope of the comparison',
      text: 'The chronology counts individually dated Consumer Bazaar announcements from the Makati City Government and Philippine Information Agency. It is a documented minimum, not an exhaustive history. Related Kadiwa and Diskwento Caravan events are excluded. Sales, public cost and consumer savings have not been independently verified.',
      evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct', 'pia2024', 'city2025', 'city2026', 'report2026'] },
    },
  },
  fil: {
    headline: 'Mas Matagal Na ang Consumer Bazaar ng Makati Kaysa sa 2026 LGU Partnership',
    subheadline: 'May limang dokumentadong edisyon bago ang 2026. Ang bago ngayong taon ay ang pagsali ng partner LGUs, hindi ang pagsisimula ng bazaar.',
    synthesis: 'May mga Consumer Bazaar na inanunsyo ang Makati noong November 2022, dalawang beses noong 2023, February 2024, at October 2025. Ang October 2026 edition ang unang inilalarawang may produkto mula sa partner LGUs. Mas malawak ang market na maaaring maabot ng mga producer, pero hindi sapat ang event announcements para masabing tumaas ang sales, nakatipid ang consumers, o may pangmatagalang benepisyo ang mga vendor.',
    sections: [
      {
        id: 'documented-history',
        heading: 'Mga naunang edisyong may dokumentasyon',
        blocks: [
          {
            kind: 'table',
            title: 'Mga petsang nasa official announcements',
            caption: 'Mga dokumentadong edisyon ito, hindi kumpletong listahan ng lahat ng bazaar. Hindi rin patunay ng attendance o sales ang announcement.',
            columns: [
              { key: 'dates', label: 'Petsa ng event' },
              { key: 'evidence', label: 'Ano ang dokumentado' },
            ],
            rows: [
              { dates: '17–18 November 2022', evidence: 'Bazaar ng City Government at EEMO sa City Hall Quadrangle.' },
              { dates: '18–19 May 2023', evidence: 'Consumer Bazaar sa pakikipagtulungan ng DA at DTI.' },
              { dates: '18–19 October 2023', evidence: 'Hiwalay na Consumer Bazaar sa City Hall Quadrangle.' },
              { dates: '22–23 February 2024', evidence: 'Consumer Bazaar ng EEMO para sa abot-kayang bilihin.' },
              { dates: '16–17 October 2025', evidence: 'Consumer Bazaar sa official city events listing.' },
              { dates: '14–15 October 2026', evidence: 'Unang inanunsyong edisyon na may mga produkto ng partner LGUs.' },
            ],
            evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct', 'pia2024', 'city2025', 'city2026', 'report2026'], records: [{ recordType: 'place', id: 'makati-city-hall', href: '/civic-map/makati-city-hall' }] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Dahil may dalawang magkaibang edisyon noong 2023, hindi kailangang taun-taon lang ang event. November 2022 ang pinakamaagang edisyong nahanap sa review na ito; hindi ibig sabihin na doon nagsimula ang Consumer Bazaar.',
            evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct'] },
          },
        ],
      },
      {
        id: '2026-expansion',
        heading: 'Ano ang nagbago noong October 2026?',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Ayon sa city announcement, ito ang unang Consumer Bazaar na may local products mula sa partner LGUs. Pinangalanan sa contemporaneous report ang Alfonso Lista, Ifugao; Mapandan at Alaminos City, Pangasinan; Kabayan, Benguet; Vigan City, Ilocos Sur; at Taal, Batangas. Kasama rin ang KPKK at mga Makati MSME.',
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'Ginanap ang bazaar noong October 14–15 sa Makati City Hall Quadrangle, ayon sa event report. May Kadiwa ng Pangulo rin sa venue noong October 15 na nag-alok ng subsidized rice. Hiwalay itong programa; hindi dapat ibilang ang presyo ng bigas bilang resulta ng Consumer Bazaar.',
            evidence: { sourceIds: ['report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Maaaring makatulong ang pagsali ng regional producers para mas makilala ang kanilang produkto sa Makati. Pero hindi pa nito pinatutunayan na may repeat orders, tuloy-tuloy na market access, o mas mataas na kita pagkatapos ng event.',
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
        ],
      },
      {
        id: 'results-to-measure',
        heading: 'Paano malalaman kung naging epektibo ang expansion?',
        blocks: [
          {
            kind: 'table',
            title: 'Mga record na kailangan para masukat ang resulta',
            columns: [
              { key: 'question', label: 'Tanong' },
              { key: 'evidence', label: 'Kailangang ebidensya' },
            ],
            rows: [
              { question: 'Nakatipid ba ang households?', evidence: 'Presyo, dami at kalidad ng parehong produkto bago at habang may bazaar.' },
              { question: 'Nakinabang ba ang producers?', evidence: 'Bilang ng vendors, sales, gastos, repeat orders at transactions pagkatapos ng event, ayon sa LGU.' },
              { question: 'Magkano ang ginastos ng city?', evidence: 'Event budget, contracts, logistics at staffing costs, pati ambag ng partners.' },
              { question: 'Patas ba ang participation?', evidence: 'Vendor selection rules, stall assignments at feedback.' },
            ],
            evidence: { sourceIds: ['city2026', 'report2026'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Dokumentado ang participation. Hindi pa verified ang claims tungkol sa household savings, pangmatagalang kita ng producers, o positibong public return kung walang maihahambing na presyo, sales at event-cost records.',
          },
        ],
      },
    ],
    methodology: {
      title: 'Saklaw ng comparison',
      text: 'Binilang ang magkakahiwalay na Consumer Bazaar announcements na may petsa mula sa Makati City Government at Philippine Information Agency. Minimum na dokumentadong history ito, hindi exhaustive list. Hindi kasama ang hiwalay na Kadiwa at Diskwento Caravan events. Hindi pa independently verified ang sales, public costs at consumer savings.',
      evidence: { sourceIds: ['pia2022', 'pia2023may', 'pia2023oct', 'pia2024', 'city2025', 'city2026', 'report2026'] },
    },
  },
};

export default reportModule;