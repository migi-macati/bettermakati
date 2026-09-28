import { access, readFile } from 'node:fs/promises';

const [timeline, ownershipRaw, packageJson] = await Promise.all([
  readFile('src/data/civicTimeline.ts', 'utf8'),
  readFile('data/wave5-civic-time-ownership-matrix.json', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const ownership = JSON.parse(ownershipRaw);
const problems = [];

for (const marker of [
  "export const civicTimelineTimeZone = 'Asia/Manila'",
  'export type CivicTimelineKind',
  'export type CivicTimelineTemporalSemantic',
  'export type CivicTimelineExcludedTemporalSemantic',
  'export type CivicTimelineCanonicalRef',
  'export type CivicTimelineGeography',
  'export interface CivicTimelineTemporalOrigin',
  'export type CivicTimelineTemporal',
  'export interface CivicTimelineProjectionInput',
  'export interface CivicTimelineItem',
  'export const civicTimelineKindSemantics',
  'export const manilaDateKey',
  'export const validateCivicTimelineProjectionInput',
  'export const projectCivicTimelineItem',
]) {
  if (!timeline.includes(marker)) {
    problems.push('Civic Timeline schema marker missing: ' + marker);
  }
}

for (const semantic of [
  "'occurrence'",
  "'deadline'",
  "'effective-change'",
  "'publication-release'",
  "'target-milestone'",
]) {
  if (!timeline.includes(semantic)) {
    problems.push('Allowed Civic Timeline semantic missing: ' + semantic);
  }
}

for (const excluded of [
  "'observation-period'",
  "'source-period-label'",
  "'verification-review'",
  "'status-as-of'",
]) {
  if (!timeline.includes(excluded)) {
    problems.push('Excluded temporal semantic documentation missing: ' + excluded);
  }
}

const publicTemporalBlock =
  timeline
    .split('export type CivicTimelineTemporal =')[1]
    ?.split('export interface CivicTimelineAction')[0] ?? '';

for (const forbidden of [
  'observation-period',
  'source-period-label',
  'verification-review',
  'status-as-of',
]) {
  if (publicTemporalBlock.includes(forbidden)) {
    problems.push(
      'Excluded temporal semantic leaked into public CivicTimelineTemporal: ' +
        forbidden
    );
  }
}

for (const field of [
  "'checkedOn'",
  "'checkedAt'",
  "'reviewedOn'",
  "'lastReviewed'",
  "'lastVerified'",
  "'reconciledOn'",
  "'statusAsOf'",
  "'period'",
  "'asOf'",
]) {
  if (!timeline.includes(field)) {
    problems.push('Forbidden source-date field guard missing: ' + field);
  }
}

for (const owner of [
  "owner: 'city-monitor'",
  "owner: 'legislation'",
  "owner: 'elections'",
  "owner: 'accountability'",
  "owner: 'reports'",
  "owner: 'statistics'",
  "owner: 'public-records'",
  "owner: 'services'",
  "owner: 'barangays'",
  "owner: 'mobility'",
]) {
  if (!timeline.includes(owner)) {
    problems.push('Canonical owner contract missing: ' + owner);
  }
}

for (const marker of [
  "scope: 'citywide'",
  "scope: 'scoped'",
  'barangaySlugs?: string[]',
  'areaIds?: string[]',
  'placeIds?: string[]',
  'routeIds?: string[]',
  'segmentIds?: string[]',
]) {
  if (!timeline.includes(marker)) {
    problems.push('Civic Timeline geography marker missing: ' + marker);
  }
}

for (const marker of [
  "'action-required'",
  "'participation-opportunity'",
  "'service-impact'",
  "'information-only'",
  "'rescheduled'",
  "'cancelled'",
  "'postponed'",
  "'superseded'",
  'supersedesTimelineItemId?: string',
]) {
  if (!timeline.includes(marker)) {
    problems.push('Civic Timeline action/update marker missing: ' + marker);
  }
}

for (const marker of [
  'must be an explicit Asia/Manila datetime ending in +08:00',
  'Timeline range ends before it starts',
  'Scoped Civic Timeline geography requires at least one canonical geography reference',
  'cannot project maintenance/observation field',
  'Civic Timeline primary source is missing from sourceRefs',
  'Unresolved Civic Timeline canonical owner',
]) {
  if (!timeline.includes(marker)) {
    problems.push('Civic Timeline validation invariant missing: ' + marker);
  }
}

if (
  ownership.dateSemantics?.filter(
    semantic => semantic.publicTimelineEligible === true
  ).length !== 4 ||
  !ownership.dateSemantics?.some(
    semantic =>
      semantic.id === 'target-milestone' &&
      semantic.publicTimelineEligible === 'conditional'
  )
) {
  problems.push(
    'Ownership matrix no longer matches the R2 five-semantic public projection policy.'
  );
}

for (const obsoletePath of [
  'src/data/eventRegistry.ts',
  'src/data/eventLifecycle.ts',
  'scripts/check-event-registry.mjs',
  'scripts/check-event-lifecycle.mjs',
]) {
  try {
    await access(obsoletePath);
    problems.push('Obsolete generic event runtime still exists: ' + obsoletePath);
  } catch {
    // Expected after W5-7R2 retirement.
  }
}

for (const obsoleteScript of [
  'check:event-registry',
  'check:event-lifecycle',
]) {
  if (packageJson.includes(obsoleteScript)) {
    problems.push('Obsolete generic event package gate remains: ' + obsoleteScript);
  }
}

if ((packageJson.match(/npm run check:civic-timeline-schema/g) ?? []).length < 2) {
  problems.push(
    'Civic Timeline schema gate is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R2 Civic Timeline schema check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7R2 Civic Timeline schema check passed: canonical-owner projection contract, five public temporal semantics, maintenance/observation-field rejection, Manila datetime precision, geography/actionability/update state, and generic event runtime retired.'
);
