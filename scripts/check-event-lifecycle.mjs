import { readFile } from 'node:fs/promises';

const [registry, lifecycle, packageJson] = await Promise.all([
  readFile('src/data/eventRegistry.ts', 'utf8'),
  readFile('src/data/eventLifecycle.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  'export const manilaDateKey',
  "timeZone: 'Asia/Manila'",
  'export const effectiveEventStatus',
  "if (event.status === 'ended') return 'ended';",
  "event.status === 'cancelled' || event.status === 'postponed'",
  'export const isCurrentEvent',
  'export const currentEventFeed',
  'export const archivedEventFeed',
  'export const normalizeEventIdentityText',
  'export const eventDuplicateSignals',
  'export const findEventDuplicateCandidates',
  'titleMatch && dateOverlap && locationMatch',
]) {
  if (!lifecycle.includes(marker)) {
    problems.push('W5-7c lifecycle marker missing: ' + marker);
  }
}

for (const marker of [
  "currentRank: Record<EventEffectiveStatus, number>",
  'ongoing: 0',
  'postponed: 1',
  'cancelled: 2',
  'scheduled: 3',
  "filter(item => item.effectiveStatus !== 'ended')",
  "filter(item => item.effectiveStatus === 'ended')",
]) {
  if (!lifecycle.includes(marker)) {
    problems.push('W5-7c feed ordering/archive marker missing: ' + marker);
  }
}

for (const marker of [
  'if (current < start) return \'scheduled\';',
  "return current === start ? 'ongoing' : 'ended';",
  'if (today < start) return \'scheduled\';',
  "if (today <= end) return 'ongoing';",
]) {
  if (!lifecycle.includes(marker)) {
    problems.push('W5-7c expiry rule missing: ' + marker);
  }
}

for (const marker of [
  'const titleMatch = setsIntersect',
  'const dateOverlap = dateWindowsOverlap',
  'const placeMatch =',
  'const areaMatch =',
  'const venueLabelMatch =',
  'const locationMatch = placeMatch || areaMatch || venueLabelMatch',
]) {
  if (!lifecycle.includes(marker)) {
    problems.push('W5-7c duplicate-signal marker missing: ' + marker);
  }
}

if (
  !registry.includes(
    'W5-7c selectors live in eventLifecycle.ts and keep ended'
  )
) {
  problems.push('Event registry comment does not acknowledge W5-7c selectors.');
}

if ((packageJson.match(/npm run check:event-lifecycle/g) ?? []).length < 2) {
  problems.push(
    'Event lifecycle guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7c event lifecycle check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7c event lifecycle check passed: Manila-aware current/archive selectors, conservative exact-time expiry, explicit cancelled/postponed handling, deterministic current ordering, and title+date+location duplicate-candidate signals.'
);
