export interface CityImage {
  src: string;
  alt: string;
  title: string;
  sourceUrl?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  objectPosition?: string;
}

const commonsImage = (file: string, width = 1400) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' +
  encodeURIComponent(file) +
  '?width=' +
  width;

const userImage = (file: string) => '/images/makati/user/' + file;

export const cityImages: Record<string, CityImage> = {
  userNightCourtyard: {
    src: userImage('night-courtyard.jpg'),
    alt: 'People gathered in an open-air Makati courtyard at night under string lights, with a small live music performance.',
    title: 'Makati after dark',
    objectPosition: '50% 52%',
  },
  userNightSkyline: {
    src: userImage('poblacion-night-skyline.jpg'),
    alt: 'Makati skyline illuminated at night beyond a lower-rise neighborhood.',
    title: 'Makati at night',
    objectPosition: '50% 50%',
  },
  userUrbanPark: {
    src: userImage('urban-park.jpg'),
    alt: 'A landscaped urban park in Makati framed by mature trees and high-rise buildings.',
    title: 'Green space in the city',
    objectPosition: '50% 54%',
  },
  userCbdStreet: {
    src: userImage('cbd-street.jpg'),
    alt: 'A busy Makati business district street framed by glass office towers.',
    title: 'Street life in the CBD',
    objectPosition: '50% 58%',
  },
  userSkylineClouds: {
    src: userImage('poblacion-skyline-clouds.jpg'),
    alt: 'A wide Makati skyline under dramatic afternoon clouds.',
    title: 'Makati skyline',
    objectPosition: '50% 50%',
  },
  userPasigRiverNight: {
    src: userImage('pasig-river-night.jpg'),
    alt: 'Night view across the Pasig River with city lights reflected on the water.',
    title: 'Makati by the Pasig River',
    objectPosition: '50% 55%',
  },
  userTreeLinedPark: {
    src: userImage('tree-lined-park.jpg'),
    alt: 'A tree-lined paved path through a landscaped Makati park.',
    title: 'A greener Makati',
    objectPosition: '50% 48%',
  },
  userUrbanGreenery: {
    src: userImage('urban-greenery.jpg'),
    alt: 'Red flowering tree and dense greenery framed by high-rise buildings in Makati.',
    title: 'Nature between towers',
    objectPosition: '50% 45%',
  },
  userMuseo: {
    src: userImage('museo-ng-makati.jpg'),
    alt: 'Facade of Museo ng Makati under a blue sky.',
    title: 'Museo ng Makati',
    objectPosition: '50% 42%',
  },
  userSkylineDay: {
    src: userImage('poblacion-skyline-day.jpg'),
    alt: 'Daytime view across dense low-rise neighborhoods toward Makati’s high-rise skyline.',
    title: 'Makati from above',
    objectPosition: '50% 45%',
  },
  userOpenLotMonument: {
    src: userImage('open-lot-monument.jpg'),
    alt: 'A sculptural monument in a Makati streetscape with towers, open space and overhead utility lines behind it.',
    title: 'A Makati streetscape',
    objectPosition: '50% 54%',
  },
  userRiverDay: {
    src: userImage('pasig-river-day.jpg'),
    alt: 'Daytime view across the Pasig River toward Makati buildings, seen from close to the water.',
    title: 'Along the Pasig River',
    objectPosition: '50% 45%',
  },
  userRiverChurchNight: {
    src: userImage('river-church-night.jpg'),
    alt: 'Church, high-rise buildings and their lights reflected across the river at night.',
    title: 'Poblacion by the river at night',
    objectPosition: '50% 52%',
  },
  userUrbanCourtyard: {
    src: userImage('urban-courtyard.jpg'),
    alt: 'Multi-level Makati commercial courtyard with a landscaped water feature and pedestrian walkways.',
    title: 'Urban spaces in Makati',
    objectPosition: '50% 57%',
  },
  userTrafficStreet: {
    src: userImage('traffic-street.jpg'),
    alt: 'Dense evening traffic, pedestrians and overhead utility lines on a narrow Makati street.',
    title: 'Moving through a busy street',
    objectPosition: '50% 64%',
  },
  userPoblacionNightStreet: {
    src: userImage('poblacion-night-street.jpg'),
    alt: 'Busy Makati nightlife street with neon signs, motorcycles, cars and dense overhead utility lines.',
    title: 'Poblacion at night',
    objectPosition: '50% 60%',
  },
  userCarFreeCbd: {
    src: userImage('car-free-cbd.jpg'),
    alt: 'Runners and walkers using a broad car-free avenue in Makati’s business district.',
    title: 'Car-free morning in the CBD',
    objectPosition: '50% 67%',
  },
  userWarriorMonument: {
    src: userImage('warrior-monument.jpg'),
    alt: 'Bronze warrior monument framed by Makati office buildings and construction cranes.',
    title: 'Monument in the business district',
    objectPosition: '50% 54%',
  },
  userSunsetMonument: {
    src: userImage('sunset-monument.jpg'),
    alt: 'Monument silhouetted against a warm sunset between high-rise office buildings in Makati.',
    title: 'Sunset in the CBD',
    objectPosition: '50% 58%',
  },
  userNightSidewalk: {
    src: userImage('night-sidewalk.jpg'),
    alt: 'Makati sidewalk at night with palm trees, hotel signs, traffic lights and a pedestrian.',
    title: 'Walking through Makati at night',
    objectPosition: '50% 66%',
  },

  userTreeLinedSidewalk: {
    src: userImage('tree-lined-sidewalk.jpg'),
    alt: 'Tree-lined Makati sidewalk framed by office towers, with sunlight filtering through the canopy.',
    title: 'A shaded walk through the CBD',
    objectPosition: '50% 58%',
  },
  userCbdMonumentCrossing: {
    src: userImage('cbd-monument-crossing.jpg'),
    alt: 'Pedestrians crossing a Makati business district street beside a monument and glass office towers.',
    title: 'Crossing the business district',
    objectPosition: '50% 57%',
  },
  userBacklitCbdTree: {
    src: userImage('backlit-cbd-tree.jpg'),
    alt: 'Large tree backlit by the sun between office buildings along a Makati street.',
    title: 'Trees between towers',
    objectPosition: '50% 56%',
  },
  userDuskParkPath: {
    src: userImage('dusk-park-path.jpg'),
    alt: 'Lit pedestrian path through a landscaped Makati park at dusk.',
    title: 'A park at dusk',
    objectPosition: '50% 57%',
  },
  userEscalatorCity: {
    src: userImage('escalator-city.jpg'),
    alt: 'Outdoor escalator rising through a glass canopy with Makati buildings visible beyond.',
    title: 'Moving through the city',
    objectPosition: '50% 52%',
  },
  userHazySkyline: {
    src: userImage('hazy-skyline.jpg'),
    alt: 'Hazy daytime view across lower-rise Makati neighborhoods toward larger office and residential buildings.',
    title: 'Makati across the neighborhoods',
    objectPosition: '50% 46%',
  },
  userParkCanopy: {
    src: userImage('park-canopy.jpg'),
    alt: 'Landscaped Makati park with mature tree canopy, paved paths and a shaded pavilion.',
    title: 'Under the trees',
    objectPosition: '50% 54%',
  },
  userWideNightSkyline: {
    src: userImage('wide-night-skyline.jpg'),
    alt: 'Wide nighttime view of Makati neighborhoods and illuminated skyline.',
    title: 'Makati after sunset',
    objectPosition: '50% 61%',
  },
  userCityHallSkyline: {
    src: userImage('city-hall-skyline.jpg'),
    alt: 'Makati City Hall tower seen across surrounding neighborhoods under an overcast sky.',
    title: 'City Hall across Makati',
    objectPosition: '50% 43%',
  },
  userUrbanUndercroft: {
    src: userImage('urban-undercroft.jpg'),
    alt: 'Covered Makati pedestrian and vehicle space framed by a sculptural concrete column and landscaped street beyond.',
    title: 'Layers of the city',
    objectPosition: '50% 56%',
  },

  skyline: {
    src: commonsImage('Makati City Skyline from Guadalupe, Apr 2025.jpg'),
    alt: 'Makati skyline rising beyond trees and lower-rise neighborhoods, viewed from Guadalupe.',
    title: 'Makati from Guadalupe',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Makati_City_Skyline_from_Guadalupe,_Apr_2025.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    objectPosition: '50% 58%',
  },
  cityHall: {
    src: commonsImage('Makati City Hall, Oct 2023.jpg'),
    alt: 'Makati City Hall seen from Poblacion.',
    title: 'Makati City Hall',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Makati_City_Hall,_Oct_2023.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  museo: {
    src: commonsImage('Museo ng Makati, Oct 2023.jpg'),
    alt: 'Museo ng Makati in Poblacion.',
    title: 'Museo ng Makati',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Museo_ng_Makati,_Oct_2023.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  poblacionPark: {
    src: commonsImage('Makati Poblacion Park, Oct 2023.jpg'),
    alt: 'Makati Poblacion Park with neighborhood buildings around it.',
    title: 'Poblacion Park',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Makati_Poblacion_Park,_Oct_2023.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  sanPedro: {
    src: commonsImage('San Pedro Macati Church, Makati City.jpg'),
    alt: 'Historic San Pedro Macati Church in Poblacion, Makati.',
    title: 'San Pedro Macati Church',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:San_Pedro_Macati_Church,_Makati_City.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  estrellaBridge: {
    src: commonsImage('View of Estrella-Pantaleon Bridge from Makati side.jpg'),
    alt: 'Estrella–Pantaleon Bridge crossing the Pasig River from the Makati side.',
    title: 'Makati and the Pasig River',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:View_of_Estrella-Pantaleon_Bridge_from_Makati_side.jpg',
    credit: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  jeepney: {
    src: commonsImage('202403 A jeepney in Makati, Manila.jpg'),
    alt: 'A traditional jeepney on a Makati street in 2024.',
    title: 'Moving through Makati',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:202403_A_jeepney_in_Makati,_Manila.jpg',
    credit: 'Jonashtand',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    objectPosition: '50% 55%',
  },
  jupiter: {
    src: commonsImage('09236jfJupiter Street Bel-Air Poblacion Makati Cityfvf 10.jpg'),
    alt: 'Street-level view along Jupiter Street near Bel-Air and Poblacion.',
    title: 'Jupiter Street',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:09236jfJupiter_Street_Bel-Air_Poblacion_Makati_Cityfvf_10.jpg',
    credit: 'Judgefloro',
    license: 'Public domain',
    objectPosition: '50% 50%',
  },
};

export const homeImageSet = [
  cityImages.userSkylineClouds,
  cityImages.userWideNightSkyline,
  cityImages.userBacklitCbdTree,
  cityImages.userDuskParkPath,
  cityImages.userCbdMonumentCrossing,
  cityImages.userNightCourtyard,
  cityImages.userRiverChurchNight,
  cityImages.userTreeLinedSidewalk,
];

export const visitImageSet = [
  cityImages.userNightCourtyard,
  cityImages.userDuskParkPath,
  cityImages.userParkCanopy,
  cityImages.userUrbanCourtyard,
  cityImages.userPoblacionNightStreet,
  cityImages.userRiverDay,
  cityImages.userMuseo,
  cityImages.userBacklitCbdTree,
  cityImages.userPasigRiverNight,
];

export const governmentImageSet = [
  cityImages.cityHall,
  cityImages.userCityHallSkyline,
  cityImages.userCbdMonumentCrossing,
  cityImages.userWarriorMonument,
  cityImages.userSunsetMonument,
  cityImages.userCbdStreet,
];

export const barangayImageSet = [
  cityImages.userWideNightSkyline,
  cityImages.userNightSkyline,
  cityImages.userPoblacionNightStreet,
  cityImages.userRiverChurchNight,
  cityImages.userSkylineDay,
  cityImages.userParkCanopy,
  cityImages.userHazySkyline,
];

export const historyImageSet = [
  cityImages.userMuseo,
  cityImages.userCbdMonumentCrossing,
  cityImages.userWarriorMonument,
  cityImages.userSunsetMonument,
  cityImages.userCityHallSkyline,
  cityImages.sanPedro,
];

export const mobilityImageSet = [
  cityImages.userCarFreeCbd,
  cityImages.userTreeLinedSidewalk,
  cityImages.userEscalatorCity,
  cityImages.userUrbanUndercroft,
  cityImages.userTrafficStreet,
  cityImages.userCbdStreet,
  cityImages.userNightSidewalk,
];

export const servicesImageSet = [
  cityImages.userCbdStreet,
  cityImages.userUrbanUndercroft,
  cityImages.cityHall,
  cityImages.userUrbanPark,
  cityImages.userNightCourtyard,
];
