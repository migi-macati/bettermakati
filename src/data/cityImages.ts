export interface CityImage {
  src: string;
  alt: string;
  title: string;
  sourceUrl: string;
  credit: string;
  license: string;
  licenseUrl?: string;
  objectPosition?: string;
}

const commonsImage = (file: string, width = 1400) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' +
  encodeURIComponent(file) +
  '?width=' +
  width;

export const cityImages: Record<string, CityImage> = {
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
  cityImages.poblacionPark,
  cityImages.jeepney,
  cityImages.cityHall,
  cityImages.estrellaBridge,
  cityImages.museo,
  cityImages.skyline,
];

export const visitImageSet = [
  cityImages.poblacionPark,
  cityImages.museo,
  cityImages.sanPedro,
  cityImages.estrellaBridge,
  cityImages.jupiter,
  cityImages.skyline,
];

export const governmentImageSet = [
  cityImages.cityHall,
  cityImages.poblacionPark,
  cityImages.museo,
];

export const barangayImageSet = [
  cityImages.poblacionPark,
  cityImages.jupiter,
  cityImages.estrellaBridge,
  cityImages.sanPedro,
];

export const historyImageSet = [
  cityImages.sanPedro,
  cityImages.museo,
  cityImages.cityHall,
  cityImages.estrellaBridge,
];

export const mobilityImageSet = [
  cityImages.jeepney,
  cityImages.jupiter,
  cityImages.estrellaBridge,
  cityImages.skyline,
];

export const servicesImageSet = [
  cityImages.cityHall,
  cityImages.poblacionPark,
  cityImages.jupiter,
];
