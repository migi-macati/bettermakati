import { readFile } from 'node:fs/promises';

const [registry, packageJson] = await Promise.all([
  readFile('src/data/eventRegistry.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  'export type EventLifecycleStatus',
  "'scheduled'",
  "'ongoing'",
  "'postponed'",
  "'cancelled'",
  "'ended'",
  'export type EventDatePrecision',
  'export interface EventRegistryRecord',
  "timezone: 'Asia/Manila'",
  'placeId?: string',
  'venueLabel?: string',
  'areaIds: string[]',
  'barangaySlugs: string[]',
  'visitorExperienceIds?: string[]',
  'export const eventSources',
  'export const eventRegistry',
  'validateEventRegistry',
  'eventRegistryById',
]) {
  if (!registry.includes(marker)) {
    problems.push('Event registry marker missing: ' + marker);
  }
}

const eventBlock =
  registry
    .split('export const eventRegistry: EventRegistryRecord[] = [')[1]
    ?.split('\n];\n\nconst sourceById')[0] ?? '';

const recordCount = (
  eventBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const ongoingCount = (
  eventBlock.match(/status: 'ongoing'/g) ?? []
).length;
const endedCount = (
  eventBlock.match(/status: 'ended'/g) ?? []
).length;

if (recordCount !== 4 || ongoingCount !== 1 || endedCount !== 3) {
  problems.push(
    'W5-7b pilot must contain 4 event records = 1 ongoing + 3 ended evidence records.'
  );
}

for (const marker of [
  "id: 'lifestyles-done-rockwell-2026'",
  "startsAt: '2026-09-25'",
  "endsAt: '2026-10-25'",
  "areaIds: ['rockwell-center']",
  "id: 'card-expo-ph-century-city-2026'",
  "id: 'comedy-nights-century-city-2026-09-26'",
  "areaIds: ['century-city']",
  "id: 'makati-bike-for-me-11-2026'",
  "placeId: 'makati-city-hall'",
]) {
  if (!eventBlock.includes(marker)) {
    problems.push('W5-7b pilot evidence marker missing: ' + marker);
  }
}

for (const invariant of [
  'Event requires a canonical Place or sourced venue label',
  'Unknown event Place reference',
  'Unknown event Area reference',
  'Unknown event Barangay reference',
  'Event must cite at least one source',
  'Event primary source missing from sourceIds',
  'Ongoing event does not span the registry review date',
  'Ended pilot event must end before the registry review date',
]) {
  if (!registry.includes(invariant)) {
    problems.push('Event registry invariant missing: ' + invariant);
  }
}

if (
  !registry.includes(
    'No event is promoted from a title-only listing or an undated source.'
  )
) {
  problems.push(
    'W5-7b must preserve the bounded item-level evidence rule.'
  );
}

if ((packageJson.match(/npm run check:event-registry/g) ?? []).length < 2) {
  problems.push(
    'Event registry guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7b event registry check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7b event registry check passed: 4 source-backed pilot records, one ongoing + three ended evidence records, canonical Place/Area/Barangay validation, Asia/Manila date handling, and no title-only/undated promotion.'
);
