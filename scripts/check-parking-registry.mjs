import { readFile } from 'node:fs/promises';

const [registry, page, pkg] = await Promise.all([
  readFile('src/data/parkingRegistry.ts', 'utf8'),
  readFile('src/pages/Parking.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const required = [
  'ParkingFieldState',
  'ParkingFacilityRecord',
  'ParkingSourcedValue',
  'parkingSources',
  'parkingFacilities',
  'validateParkingRegistry',
  'parkingFacilityById',
  'vehicleTypes',
  'hours',
  'rates',
  'capacity',
  'evCharging',
  'areaIds',
  'destinationPlaceIds',
];

const missing = required.filter(marker => !registry.includes(marker));

if (!registry.includes("field.state === 'unknown'")) {
  missing.push('unknown-field guard');
}

if (!registry.includes('Known parking field must cite at least one source')) {
  missing.push('source-required guard');
}

if (!page.includes('Rates, access and operating hours remain with each parking facility.')) {
  missing.push('conservative page copy');
}

if ((pkg.match(/npm run check:parking-registry/g) ?? []).length < 2) {
  missing.push('build and quality gates');
}

if (missing.length) {
  console.error('Parking schema check failed: ' + missing.join(', '));
  process.exit(1);
}

console.log('Parking schema check passed.');
