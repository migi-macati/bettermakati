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
  cityImages.userNightCourtyard,
  cityImages.userTreeLinedPark,
  cityImages.userNightSkyline,
  cityImages.userMuseo,
  cityImages.userPasigRiverNight,
  cityImages.userSkylineDay,
];

export const visitImageSet = [
  cityImages.userNightCourtyard,
  cityImages.userUrbanPark,
  cityImages.userTreeLinedPark,
  cityImages.userMuseo,
  cityImages.userPasigRiverNight,
  cityImages.userUrbanGreenery,
  cityImages.sanPedro,
];

export const governmentImageSet = [
  cityImages.cityHall,
  cityImages.userCbdStreet,
  cityImages.userSkylineClouds,
  cityImages.userMuseo,
];

export const barangayImageSet = [
  cityImages.userNightSkyline,
  cityImages.userSkylineDay,
  cityImages.userUrbanPark,
  cityImages.userPasigRiverNight,
  cityImages.userMuseo,
];

export const historyImageSet = [
  cityImages.userMuseo,
  cityImages.sanPedro,
  cityImages.cityHall,
  cityImages.userSkylineDay,
];

export const mobilityImageSet = [
  cityImages.userCbdStreet,
  cityImages.jeepney,
  cityImages.userNightCourtyard,
  cityImages.userPasigRiverNight,
  cityImages.userSkylineClouds,
];

export const servicesImageSet = [
  cityImages.userCbdStreet,
  cityImages.cityHall,
  cityImages.userUrbanPark,
  cityImages.userNightCourtyard,
];
