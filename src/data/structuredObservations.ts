import type { PlaceCategory, PlaceRegistryRecord } from './placeRegistry';

export type ObservationFamilyId =
  | 'street-public-realm'
  | 'park-public-space'
  | 'public-facility'
  | 'transport-stop-terminal'
  | 'transport-route';

export type ObservationTimeContext =
  | 'early-morning'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'evening'
  | 'late-night'
  | 'unknown';

export type ObservationWeatherContext =
  | 'dry'
  | 'raining'
  | 'recent-rain'
  | 'unknown'
  | 'not-relevant';

export type ObservationResponseType =
  | 'availability'
  | 'accessContinuity'
  | 'condition'
  | 'cleanliness'
  | 'lighting'
  | 'shade'
  | 'crowding'
  | 'information'
  | 'stepFreeAccess'
  | 'drainage'
  | 'waitMinutes'
  | 'yesNoObserved';

export interface ObservationQuestion {
  id: string;
  label: string;
  prompt: string;
  responseType: ObservationResponseType;
  appliesTo?: PlaceCategory[];
  optional?: boolean;
}

export interface ObservationQuestionSet {
  id: string;
  familyId: ObservationFamilyId;
  label: string;
  questions: ObservationQuestion[];
}

export interface ObservationAnswer {
  questionId: string;
  value: string | number;
  note?: string;
}

const responseChoices: Record<
  Exclude<ObservationResponseType, 'waitMinutes'>,
  Array<{ value: string; label: string }>
> = {
  availability: [
    { value: 'present-and-usable', label: 'Present and usable' },
    { value: 'present-but-not-usable', label: 'Present but not usable' },
    { value: 'not-present', label: 'Not present' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  accessContinuity: [
    { value: 'continuous', label: 'Continuous / clear' },
    { value: 'partly-interrupted', label: 'Partly interrupted' },
    { value: 'blocked-or-not-usable', label: 'Blocked or not usable' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  condition: [
    { value: 'usable', label: 'Usable' },
    { value: 'usable-with-visible-issues', label: 'Usable with visible issues' },
    { value: 'not-usable', label: 'Not usable' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  cleanliness: [
    { value: 'clear', label: 'Clear' },
    { value: 'minor-litter-or-dirt', label: 'Minor litter or dirt' },
    { value: 'significant-litter-or-dirt', label: 'Significant litter or dirt' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  lighting: [
    { value: 'adequate-at-observed-time', label: 'Adequate at observed time' },
    { value: 'patchy-at-observed-time', label: 'Patchy at observed time' },
    { value: 'inadequate-at-observed-time', label: 'Inadequate at observed time' },
    { value: 'not-observed-after-dark', label: 'Not observed after dark' },
  ],
  shade: [
    { value: 'substantial', label: 'Substantial' },
    { value: 'partial', label: 'Partial' },
    { value: 'little-or-none', label: 'Little or none' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  crowding: [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  information: [
    { value: 'present-and-clear', label: 'Present and clear' },
    { value: 'present-but-incomplete-or-unclear', label: 'Present but incomplete or unclear' },
    { value: 'not-found', label: 'Not found' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  stepFreeAccess: [
    { value: 'continuous-step-free-route', label: 'Continuous step-free route' },
    { value: 'partial-step-free-route', label: 'Partial step-free route' },
    { value: 'no-usable-step-free-route', label: 'No usable step-free route' },
    { value: 'not-observed', label: 'Not observed' },
  ],
  drainage: [
    { value: 'no-standing-water-observed', label: 'No standing water observed' },
    { value: 'minor-standing-water', label: 'Minor standing water' },
    {
      value: 'significant-standing-water-or-flooding',
      label: 'Significant standing water or flooding',
    },
    {
      value: 'not-observed-during-or-after-rain',
      label: 'Not observed during or after rain',
    },
  ],
  yesNoObserved: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'not-observed', label: 'Not observed' },
  ],
};

export const observationResponseChoices = (
  type: ObservationResponseType
): Array<{ value: string; label: string }> =>
  type === 'waitMinutes' ? [] : responseChoices[type];

const streetCategories: PlaceCategory[] = [
  'street-segment',
  'sidewalk-segment',
  'crossing',
  'bike-lane',
  'bridge',
  'drainage',
];
const facilityCategories: PlaceCategory[] = [
  'public-office',
  'health-center',
  'community-center',
  'public-market',
  'public-toilet',
  'heritage-site',
];

export const observationFamilyForCategory = (
  category: PlaceCategory
): ObservationFamilyId => {
  if (streetCategories.includes(category)) return 'street-public-realm';
  if (category === 'park') return 'park-public-space';
  if (facilityCategories.includes(category)) return 'public-facility';
  if (['transport-stop', 'transport-terminal'].includes(category)) {
    return 'transport-stop-terminal';
  }
  return 'transport-route';
};

const questionSets: Record<ObservationFamilyId, ObservationQuestionSet> = {
  'street-public-realm': {
    id: 'street-public-realm-v1',
    familyId: 'street-public-realm',
    label: 'Street & public-realm snapshot',
    questions: [
      { id: 'pedestrian-path', label: 'Pedestrian path', prompt: 'Was there a continuous usable pedestrian path?', responseType: 'accessContinuity', appliesTo: ['street-segment', 'sidewalk-segment', 'bridge'] },
      { id: 'surface', label: 'Surface condition', prompt: 'Was the walking or travel surface usable?', responseType: 'condition', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane', 'bridge'] },
      { id: 'crossing-access', label: 'Crossing access', prompt: 'Was the crossing clear and usable?', responseType: 'accessContinuity', appliesTo: ['street-segment', 'crossing'] },
      { id: 'step-free-access', label: 'Step-free access', prompt: 'Was there a continuous usable step-free route?', responseType: 'stepFreeAccess', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing', 'bridge'] },
      { id: 'lighting', label: 'Lighting', prompt: 'At the observed time, was public lighting adequate?', responseType: 'lighting' },
      { id: 'shade', label: 'Shade', prompt: 'How much useful shade was available along the observed section?', responseType: 'shade', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane'] },
      { id: 'cleanliness', label: 'Cleanliness', prompt: 'How much litter or visible dirt was present?', responseType: 'cleanliness' },
      { id: 'drainage', label: 'Drainage', prompt: 'Was standing water or flooding visible?', responseType: 'drainage', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing', 'drainage', 'bridge'] },
      { id: 'obstruction', label: 'Obstruction', prompt: 'Was the intended path blocked by vehicles, construction, objects or queues?', responseType: 'yesNoObserved' },
    ],
  },
  'park-public-space': {
    id: 'park-public-space-v1',
    familyId: 'park-public-space',
    label: 'Park & public-space snapshot',
    questions: [
      { id: 'entrance-access', label: 'Entrance access', prompt: 'Was at least one public entrance open and usable?', responseType: 'availability' },
      { id: 'step-free-access', label: 'Step-free access', prompt: 'Was there a usable step-free route into and through the main public area?', responseType: 'stepFreeAccess' },
      { id: 'seating', label: 'Seating', prompt: 'Was usable public seating available?', responseType: 'availability' },
      { id: 'shade', label: 'Shade', prompt: 'How much useful shade was available in occupied areas?', responseType: 'shade' },
      { id: 'cleanliness', label: 'Cleanliness', prompt: 'How much litter or visible dirt was present?', responseType: 'cleanliness' },
      { id: 'lighting', label: 'Lighting', prompt: 'At the observed time, was public lighting adequate?', responseType: 'lighting' },
      { id: 'toilets', label: 'Toilets', prompt: 'Were public toilets present and usable?', responseType: 'availability' },
      { id: 'equipment', label: 'Public equipment', prompt: 'Were benches, play equipment or other visible public fixtures usable?', responseType: 'condition' },
    ],
  },
  'public-facility': {
    id: 'public-facility-v1',
    familyId: 'public-facility',
    label: 'Public facility snapshot',
    questions: [
      { id: 'entrance-open', label: 'Public entrance', prompt: 'Was the public entrance open and usable during the observed time?', responseType: 'availability' },
      { id: 'step-free-access', label: 'Step-free access', prompt: 'Was there a usable step-free route from entrance to the public service area?', responseType: 'stepFreeAccess' },
      { id: 'wayfinding', label: 'Wayfinding', prompt: 'Could the relevant entrance, counter or public area be identified from posted signs?', responseType: 'information' },
      { id: 'service-information', label: 'Service information', prompt: 'Were relevant public instructions, schedules or requirements posted clearly?', responseType: 'information' },
      { id: 'waiting-seating', label: 'Waiting seating', prompt: 'Was usable seating available in the public waiting area?', responseType: 'availability' },
      { id: 'toilets', label: 'Toilets', prompt: 'Were public/user toilets present and usable?', responseType: 'availability' },
      { id: 'cleanliness', label: 'Cleanliness', prompt: 'How much litter or visible dirt was present in the public area?', responseType: 'cleanliness' },
      { id: 'crowding', label: 'Crowding', prompt: 'How crowded was the public waiting/service area at the observed time?', responseType: 'crowding' },
    ],
  },
  'transport-stop-terminal': {
    id: 'transport-stop-terminal-v1',
    familyId: 'transport-stop-terminal',
    label: 'Transport stop & terminal snapshot',
    questions: [
      { id: 'boarding-area', label: 'Boarding area', prompt: 'Was the boarding/alighting area clear and usable?', responseType: 'accessContinuity' },
      { id: 'step-free-access', label: 'Step-free access', prompt: 'Was there a usable step-free route to the boarding area?', responseType: 'stepFreeAccess' },
      { id: 'route-information', label: 'Route information', prompt: 'Were route/stop details present and clear?', responseType: 'information' },
      { id: 'fare-information', label: 'Fare information', prompt: 'Was fare information present and clear where applicable?', responseType: 'information' },
      { id: 'shelter', label: 'Shelter', prompt: 'Was weather shelter present and usable?', responseType: 'availability' },
      { id: 'seating', label: 'Seating', prompt: 'Was waiting seating present and usable?', responseType: 'availability' },
      { id: 'lighting', label: 'Lighting', prompt: 'At the observed time, was lighting adequate?', responseType: 'lighting' },
      { id: 'crowding', label: 'Crowding', prompt: 'How crowded was the boarding or waiting area?', responseType: 'crowding' },
      { id: 'observed-wait-minutes', label: 'Observed wait', prompt: 'How many minutes passed before an applicable service arrived?', responseType: 'waitMinutes', optional: true },
    ],
  },
  'transport-route': {
    id: 'transport-route-v1',
    familyId: 'transport-route',
    label: 'Transport route trip snapshot',
    questions: [
      { id: 'service-ran', label: 'Service operated', prompt: 'Did the observed trip/service operate?', responseType: 'yesNoObserved' },
      { id: 'observed-wait-minutes', label: 'Observed wait', prompt: 'How many minutes did you wait before boarding?', responseType: 'waitMinutes', optional: true },
      { id: 'route-information', label: 'Route information', prompt: 'Was route/destination information present and consistent with the trip?', responseType: 'information' },
      { id: 'fare-information', label: 'Fare information', prompt: 'Was fare information available and consistent with the fare charged?', responseType: 'information' },
      { id: 'boarding', label: 'Boarding', prompt: 'Was boarding/alighting usable at the observed points?', responseType: 'accessContinuity' },
      { id: 'crowding', label: 'Crowding', prompt: 'How crowded was the vehicle/service during the observed trip?', responseType: 'crowding' },
      { id: 'step-free-access', label: 'Step-free access', prompt: 'Could a passenger using a step-free route board and alight at the observed points?', responseType: 'stepFreeAccess' },
    ],
  },
};

export const observationQuestionSetForPlace = (
  place: PlaceRegistryRecord
): ObservationQuestionSet => {
  const familyId = observationFamilyForCategory(place.primaryCategory);
  const set = questionSets[familyId];
  return {
    ...set,
    questions: set.questions.filter(
      question =>
        !question.appliesTo || question.appliesTo.includes(place.primaryCategory)
    ),
  };
};

export const observationQuestionSets = questionSets;
