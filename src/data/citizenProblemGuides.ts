/** Curated, first-action help routes. This is a small VERIFIED subset of the
 * internal research catalogue, not an exhaustive legal advice engine.
 * Never send sensitive descriptions to public map/reporting tools.
 */
export interface CitizenText { en: string; fil: string }
export interface CitizenChannel {
  name: string;
  href: string;
  source: string;
  detail: CitizenText;
}
export interface CitizenGuide {
  id: string;
  title: CitizenText;
  intro: CitizenText;
  steps: CitizenText[];
  caution: CitizenText;
  channels: CitizenChannel[];
  expressions: RegExp[];
  placeRelated: boolean;
}
export const citizenText = (en: string, fil: string): CitizenText => ({ en, fil });
const officialHotlines = 'https://www.makati.gov.ph/content/makati-hotlines';
const sanitationCode = 'https://www.makati.gov.ph/assets/uploads/downloads/2/181/pdf/Makati%20City%20Ordinance%202019-A-102.pdf';
const dswdPagAbot = 'https://www.dswd.gov.ph/dswd-urges-public-to-help-families-individuals-get-off-streets-thru-pag-abot-hotlines/';
const meralcoOutages = 'https://www.meralco.com.ph/residential/help-support/frequently-asked-questions/outages-and-brownouts';
const makatiOffices = 'https://www.makati.gov.ph/city';

export const citizenGuides: CitizenGuide[] = [
  {
    id: 'neighborhood-noise',
    title: citizenText('Noisy neighbor', 'Maingay na kapitbahay'),
    intro: citizenText(
      'For recurring karaoke, loud music and similar disturbance near homes.',
      'Para sa paulit-ulit na karaoke, malakas na music, o ibang ingay sa mga bahay.'
    ),
    steps: [
      citizenText('If it feels safe, ask the neighbor or building administrator to lower the noise.', 'Kung safe, kausapin ang kapitbahay o building administrator tungkol sa ingay.'),
      citizenText('Note the dates, times and type of disturbance. Do not share recordings of people publicly.', 'Itala ang petsa, oras at uri ng ingay. Huwag mag-post ng recordings ng mga tao.'),
      citizenText('For a recurring neighborhood nuisance, ask your barangay for assistance or contact Makati Health Department for an assessment.', 'Kung paulit-ulit, lumapit sa barangay o Makati Health Department para ma-assess ang nuisance.'),
    ],
    caution: citizenText(
      'Section 159 of Makati Ordinance 2019-A-102 mentions excessive noise including karaoke. The exact permitted hours are not confirmed here; do not assume a universal karaoke curfew.',
      'Nasa Section 159 ng Makati Ordinance 2019-A-102 ang sobrang ingay, kabilang ang karaoke. Hindi pa verified dito ang eksaktong oras ng curfew.'
    ),
    channels: [
      { name: 'Makati Health Department', href: 'tel:+63288701607', source: officialHotlines,
        detail: citizenText('Sanitation and nuisance enquiries · (02) 8870-1607', 'Sanitation at nuisance concerns · (02) 8870-1607') },
      { name: 'Applicable city ordinance', href: sanitationCode, source: sanitationCode,
        detail: citizenText('Read Section 159–160 of the city code', 'Basahin ang Sections 159–160 ng city code') },
    ],
    expressions: [/karaoke|videoke|nagkakaraoke|kantahan|kumakanta|singing/i,
      /loud music|loud neighbor|loud neighbour|noisy neighbo|maingay na kapitbahay|ingay ng kapitbahay|sobrang ingay|sound system/i],
    placeRelated: false,
  },
  {
    id: 'obstructive-parking',
    title: citizenText('Vehicles blocking streets or sidewalks', 'Sasakyang nakaharang sa kalye o sidewalk'),
    intro: citizenText(
      'Parking rules depend on the actual street, signs, road authority and nature of the obstruction.',
      'Depende sa mismong kalye, signage, road authority at obstruction kung bawal ang parking.'
    ),
    steps: [
      citizenText('Record the street, nearest intersection, time and what access is blocked. Photograph the obstruction safely.', 'Itala ang street, pinakamalapit na kanto, oras at kung ano ang nahaharangan. Kunan ng litrato kung safe.'),
      citizenText('Ask the Makati Action Center or Public Safety Department which rules and enforcement authority apply to that particular road.', 'I-check sa Makati Action Center o Public Safety Department kung anong rule at authority ang sakop ng kalyeng iyon.'),
      citizenText('Do not move, clamp or damage a vehicle yourself. Keep license plates out of public accusations.', 'Huwag ikaw ang mag-move, clamp o manira ng sasakyan. Huwag mag-post ng public accusations gamit ang plate number.'),
    ],
    caution: citizenText(
      'A parked car is not automatically illegally parked. Private roads and roads managed by MMDA or DPWH may have different enforcement arrangements.',
      'Hindi lahat ng naka-park ay illegally parked. Iba-iba ang enforcement sa private roads at roads na sakop ng MMDA o DPWH.'
    ),
    channels: [
      { name: 'Makati Action Center', href: 'tel:+63288701436', source: officialHotlines,
        detail: citizenText('Clamping/towing enquiries · (02) 8870-1436', 'Clamping/towing concerns · (02) 8870-1436') },
      { name: 'Makati Public Safety Department', href: 'tel:+63288193270', source: officialHotlines,
        detail: citizenText('Traffic concerns · (02) 8819-3270', 'Traffic concerns · (02) 8819-3270') },
    ],
    expressions: [/parked car|parked vehicle|illegal park|parking|nakapark|naka park|nagpapark|nagpa park|naka-park|double parked|no parking/i,
      /cars? blocking|vehicles? blocking|sasakyang nakaharang|nakaharang.*sasakyan|blocked sidewalk|blocked driveway|sidewalk.*car|bangketa.*kotse|cars?.*sidewalk/i],
    placeRelated: true,
  },
  {
    id: 'street-intimidation',
    title: citizenText('Intimidation or aggressive solicitation in public', 'Pananakot o agresibong paghingi ng pera sa public place'),
    intro: citizenText(
      'Threatening conduct and requests for social assistance are different issues and may need different responders.',
      'Magkaiba ang pananakot at pangangailangan ng social assistance; maaaring magkaiba rin ang responders.'
    ),
    steps: [
      citizenText('If someone threatens, follows or physically blocks you, move to a safe place and seek police help. For danger happening now, call 911.', 'Kung may nananakot, sumusunod o humaharang sa iyo, lumipat sa ligtas na lugar at humingi ng police assistance. Kung may immediate danger, tumawag sa 911.'),
      citizenText('Report observed conduct, location and time privately. Do not confront or publicly identify a person based only on their appearance or poverty.', 'I-report nang private ang aktwal na ginawa, lugar at oras. Huwag mangkompronta o magpakilala ng tao publicly dahil lang sa itsura o kahirapan.'),
      citizenText('If someone in a street situation needs social assistance, contact Makati Social Welfare or the DSWD Pag-abot outreach program separately.', 'Kung may taong nasa street situation na nangangailangan ng tulong, hiwalay na lumapit sa Makati Social Welfare o DSWD Pag-abot.'),
    ],
    caution: citizenText(
      'Soliciting or being unhoused alone does not establish that a person is dangerous. Avoid publishing images or identifying details, especially of children.',
      'Hindi awtomatikong delikado ang taong nanghihingi ng tulong o walang tirahan. Huwag mag-post ng larawan o personal details, lalo na ng bata.'
    ),
    channels: [
      { name: 'Makati Police Department', href: 'tel:+63288871798', source: officialHotlines,
        detail: citizenText('Police assistance · (02) 8887-1798', 'Police assistance · (02) 8887-1798') },
      { name: 'Makati Social Welfare Department', href: 'tel:+63288701639', source: officialHotlines,
        detail: citizenText('Welfare referral · (02) 8870-1639', 'Welfare referral · (02) 8870-1639') },
      { name: 'DSWD Pag-abot', href: 'tel:+63289319141', source: dswdPagAbot,
        detail: citizenText('Street outreach · (02) 8931-9141, weekdays', 'Street outreach · (02) 8931-9141, weekdays') },
    ],
    expressions: [/begg|solicit|mendicant|limos|namamalimos|nanlilimos|nanlilimos|pulubi/i,
      /harass|nanghaharass|nang-ha-harass|nanakot|nananakot|pananakot|intimidat|demand money|aggressive|pester|hinaharang.*pera/i],
    placeRelated: false,
  },
  {
    id: 'garbage',
    title: citizenText('Uncollected rubbish or illegal dumping', 'Hindi nakokolektang basura o illegal dumping'),
    intro: citizenText('For public garbage accumulation and missed collection.', 'Para sa naipong basura at hindi nasusunod na koleksyon.'),
    steps: [
      citizenText('Check the posted collection schedule or ask the barangay if pickup arrangements changed.', 'I-check ang collection schedule o itanong sa barangay kung may pagbabago.'),
      citizenText('Record the precise public location, collection dates missed and any immediate sanitation hazards.', 'Itala ang lokasyon, mga petsang hindi nakolekta at posibleng sanitation hazard.'),
      citizenText('Contact the Makati Department of Environmental Services; seek Makati Health Department assistance if there is a significant sanitation risk.', 'Kontakin ang Makati Department of Environmental Services; lumapit sa Makati Health kung may seryosong sanitation concern.'),
    ],
    caution: citizenText('Avoid handling suspected hazardous or medical waste.', 'Huwag hawakan ang posibleng hazardous o medical waste.'),
    channels: [
      { name: 'Makati Department of Environmental Services', href: 'tel:+63288999057', source: officialHotlines,
        detail: citizenText('Garbage collection · (02) 8899-9057', 'Garbage collection · (02) 8899-9057') },
    ],
    expressions: [/garbage|basura|rubbish|trash|illegal dump|nagtatapon|nagtapon|waste collection|koleksyon|hakot/i],
    placeRelated: true,
  },
  {
    id: 'streetlight',
    title: citizenText('Streetlight not working', 'Sirang streetlight'),
    intro: citizenText('Streetlights may be controlled by Meralco, city government, a private estate or another asset owner.', 'Maaaring Meralco, city government, private estate o ibang owner ang namamahala sa streetlight.'),
    steps: [
      citizenText('Note the pole or lamp identifier if visible, nearest intersection and whether the light is out, flickering or damaged.', 'Itala ang pole/lamp identifier kung visible, pinakamalapit na kanto, at kung patay, kumikislap o sira.'),
      citizenText('Meralco accepts some streetlight reports through its outage/incident channels, including a guest website form; other lamps require referral to their actual owner.', 'Tumatanggap ang Meralco ng ilang streetlight reports sa incident channels nito, kasama ang guest form; para sa iba, kailangan ang tamang owner.'),
      citizenText('For city-managed lighting, ask Makati Action Center to identify the correct city maintenance unit.', 'Para sa city-managed lights, itanong sa Makati Action Center ang tamang maintenance unit.'),
    ],
    caution: citizenText('If a live wire or sparking fixture is present, stay back and call emergency responders.', 'Kung may exposed live wire o sparks, lumayo at tumawag sa emergency responders.'),
    channels: [
      { name: 'Meralco incidents and outages', href: meralcoOutages, source: meralcoOutages,
        detail: citizenText('Official website instructions and guest reporting route', 'Official instructions at guest-reporting route') },
      { name: 'Makati Action Center', href: 'tel:+63288701436', source: officialHotlines,
        detail: citizenText('City asset routing · (02) 8870-1436', 'City asset routing · (02) 8870-1436') },
    ],
    expressions: [/street.?light|poste.*ilaw|ilaw.*poste|poste.*sira|madilim.*kalsada|broken.*light/i],
    placeRelated: true,
  },
  {
    id: 'brownout',
    title: citizenText('Brownout or electricity outage', 'Brownout o nawalan ng kuryente'),
    intro: citizenText('Start with Meralco for an outage affecting your home, building or block.', 'Meralco muna para sa power outage sa bahay, building o street.'),
    steps: [
      citizenText('Check whether only your unit, your building or the whole block has lost power. Do not touch damaged wires or poles.', 'Tingnan kung unit, buong building o buong block ang apektado. Huwag hawakan ang sirang wires o poste.'),
      citizenText('Check Meralco’s outage map and report an outage not already listed. The official website permits guest reporting.', 'I-check ang Meralco outage map at i-report kung wala pa ang brownout. May guest reporting sa official site.'),
      citizenText('Keep the official report confirmation so you can check its status with Meralco.', 'Itabi ang official report confirmation para ma-follow up sa Meralco.'),
    ],
    caution: citizenText('If there is a downed live wire, sparks, fire or an injured person, keep your distance and call 911.', 'Kung may live wire, sparks, sunog o nasaktan, lumayo at tumawag sa 911.'),
    channels: [
      { name: 'Meralco outage reporting', href: meralcoOutages, source: meralcoOutages,
        detail: citizenText('Official outage map, guest form and tracking', 'Official outage map, guest form at tracking') },
    ],
    expressions: [/brownout|blackout|power outage|walang kuryente|nawalan ng kuryente|no electricity|power interruption/i],
    placeRelated: false,
  },
  {
    id: 'unpaid-wages',
    title: citizenText('Unpaid salary or labor dispute', 'Hindi binayarang sahod o labor dispute'),
    intro: citizenText('Employment complaints generally begin with the employer and the appropriate labor dispute process.', 'Karaniwang nagsisimula sa employer at naaangkop na labor dispute process ang employment concerns.'),
    steps: [
      citizenText('Keep your employment contract, payslips, timesheets and written communications privately.', 'Itabi nang private ang kontrata, payslips, timesheets at written communications.'),
      citizenText('Ask your employer for an explanation or correction when safe and practical.', 'Humingi ng explanation o correction sa employer kung safe at praktikal.'),
      citizenText('DOLE’s online ARMS system accepts Single Entry Approach requests for assistance from eligible workers, including kasambahays.', 'Tumatanggap ang DOLE ARMS ng Single Entry Approach requests for assistance mula sa mga qualified worker, kabilang ang kasambahay.'),
    ],
    caution: citizenText('Different cases follow different labor processes; do not assume every dispute has the same forum or deadline.', 'Iba-iba ang proseso depende sa labor dispute; hindi pare-pareho ang forum o deadline.'),
    channels: [
      { name: 'DOLE ARMS', href: 'https://arms.dole.gov.ph/', source: 'https://arms.dole.gov.ph/',
        detail: citizenText('Official SEnA Request for Assistance and tracking', 'Official SEnA Request for Assistance at tracking') },
    ],
    expressions: [/unpaid.*(salary|wage|pay)|salary.*(late|withheld)|unpaid wages|sahod.*(kulang|hindi|di|wala)|hindi.*(sumahod|sinahuran)|withheld wages|labor dispute/i],
    placeRelated: false,
  },
  {
    id: 'flooding',
    title: citizenText('Flooding or blocked drainage', 'Baha o baradong drainage'),
    intro: citizenText('For recurring non-emergency street flooding and public drains.', 'Para sa paulit-ulit na hindi emergency na baha o public drainage.'),
    steps: [
      citizenText('If anyone is trapped or floodwater is immediately dangerous, call 911 or Makati C3; do not enter moving floodwater.', 'Kung may na-trap o delikado na ang baha, tumawag sa 911 o Makati C3. Huwag lumusong sa malakas na agos.'),
      citizenText('For recurring non-emergency flooding, note the location, dates, severity and whether drains appear obstructed.', 'Kung paulit-ulit ngunit hindi emergency, itala ang lugar, petsa, tindi at kung barado ang drainage.'),
      citizenText('Contact Makati’s Department of Engineering and Public Works for city drainage; ownership may differ for waterways and private developments.', 'Kontakin ang Makati Engineering and Public Works para sa city drainage; maaaring iba ang owner ng waterways at private developments.'),
    ],
    caution: citizenText('Public drains, water networks and flood-control works may belong to different agencies. Do not enter drains or attempt hazardous clearing.', 'Maaaring iba-iba ang ahensyang may hawak ng drains at flood works. Huwag pumasok sa drainage o maglinis kung hazardous.'),
    channels: [
      { name: 'Makati Engineering and Public Works', href: 'tel:+63288998881', source: makatiOffices,
        detail: citizenText('City engineering · (02) 8899-8881', 'City engineering · (02) 8899-8881') },
      { name: 'Makati C3 emergency response', href: 'tel:168', source: officialHotlines,
        detail: citizenText('Local emergency response · 168', 'Local emergency response · 168') },
    ],
    expressions: [/baha|binabaha|flood|flooding|clogged drain|blocked drain|drainage|kanal.*barado|baradong kanal|umaapaw.*kanal/i],
    placeRelated: true,
  },
];

export const findCitizenGuides = (query: string): CitizenGuide[] => {
  const value = query.toLowerCase().trim().slice(0, 500);
  if (value.length < 3) return [];
  return citizenGuides
    .map(guide => ({
      guide,
      score: guide.expressions.reduce(
        (count, pattern) => count + (pattern.test(value) ? 1 : 0),
        0
      ),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(result => result.guide);
};

/** Emergency intent is deliberately narrow; all paths separately show 911. */
export const isImmediateDanger = (query: string): boolean =>
  /(?:\b(?:fire in progress|house is on fire|being attacked|being assaulted|trying to kill|gunshot|someone is bleeding heavily|electrocuted|trapped in floodwater)\b)|(?:\b(?:may sunog|nasusunog|may baril|sinusuntok ako|sinasaksak|may nasaksak|may binabaril|nilulunod)\b)/i.test(query);
