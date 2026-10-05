export type CouncilSessionType =
  | 'regular-session'
  | 'special-session'
  | 'committee-hearing'
  | 'public-hearing'
  | 'other-official-session';

export type CouncilTranscriptKind =
  | 'official'
  | 'bettermakati-automated'
  | 'bettermakati-reviewed';

export type CouncilTranscriptStatus =
  | 'planned'
  | 'queued'
  | 'processing'
  | 'available'
  | 'reviewed'
  | 'blocked';

export interface CouncilSessionSeed {
  id: string;
  date: string;
  publishedDate?: string;
  sessionType: CouncilSessionType;
  titleAsPublished: string;
  sourceId: 'makati-council-videos';
  discoveryUrl: string;
  recording: {
    discoveryStatus: 'listed-on-official-portal';
    stableUrlStatus: 'pending-resolution' | 'resolved';
    url?: string;
    note?: string;
  };
  transcript: {
    kind: CouncilTranscriptKind;
    status: CouncilTranscriptStatus;
    sourceRecordingStatus:
      | 'awaiting-stable-video-url'
      | 'ready'
      | 'unavailable';
    generatedAt?: string;
    model?: string;
    segmentsUrl?: string;
    textUrl?: string;
    reviewedAt?: string;
    note: string;
  };
}

export const officialCouncilVideoDiscoveryUrl =
  'https://www.makati.gov.ph/content/makati-videos';

export const councilSessionTranscriptPolicy = {
  canonicalSessionKey:
    'session type + official session date; one City Monitor record per official session',
  previousSessionBackfill:
    'Backfill identifiable official session recordings from the Makati portal/MyMakati. Preserve a stable official recording URL before transcription.',
  newSessionIngestion:
    'Detect newly listed official council sessions, deduplicate by canonical session key, preserve the official recording URL, then queue transcription.',
  transcriptArtifact:
    'Store timestamped segments plus searchable text with source video URL, generation time, transcription model/version and transcript kind.',
  publicationLabel:
    'Machine-generated text is always labeled BetterMakati automated transcript and never official.',
  reviewUpgrade:
    'Human-reviewed text may be relabeled BetterMakati reviewed transcript; the original source recording remains authoritative.',
  speakerRule:
    'Automated diarization may use generic speaker labels. Do not attach a councilor/person identity without explicit evidence or human review.',
  measureRule:
    'Detected ordinance/resolution mentions are candidate links only. A lifecycle/session action becomes canonical only after exact timestamp/source review or corroborating official agenda/minutes/measure text.',
  storageRule:
    'Do not commit raw audio/video to the Git repository. Store transcript artifacts separately and keep stable provenance metadata in the repository.',
} as const;

const regularSession = (
  date: string,
  titleAsPublished: string,
  note?: string,
  url?: string,
  publishedDate?: string
): CouncilSessionSeed => ({
  id: 'council-session-' + date,
  date,
  publishedDate,
  sessionType: 'regular-session',
  titleAsPublished,
  sourceId: 'makati-council-videos',
  discoveryUrl: officialCouncilVideoDiscoveryUrl,
  recording: {
    discoveryStatus: 'listed-on-official-portal',
    stableUrlStatus: url ? 'resolved' : 'pending-resolution',
    url,
    note:
      note ??
      (url
        ? 'The official Makati portal lists this session and the item-specific MyMakatiVerified recording URL is preserved.'
        : 'The official Makati portal lists this session video. Preserve the item-specific official recording URL before transcription.'),
  },
  transcript: {
    kind: 'bettermakati-automated',
    status: 'planned',
    sourceRecordingStatus: url ? 'ready' : 'awaiting-stable-video-url',
    note: url
      ? 'Stable official recording preserved. Any generated transcript must remain labeled non-official until reviewed.'
      : 'Backfill queue entry. Transcription starts only after the stable official recording URL is preserved; generated text must remain labeled non-official until reviewed.',
  },
});

export const currentCouncilSessionSeeds: CouncilSessionSeed[] = [
  regularSession(
    '2026-10-05',
    'Makati City Regular Council Session (October 05, 2026)',
    'The official MyMakatiVerified account listed this regular session on 5 October 2026. Preserve the item-specific official recording URL before transcription; no agenda item, measure, vote or outcome is inferred from the session title.'
  ),
  regularSession(
    '2026-09-28',
    'Makati City Regular Council Session (September 28, 2026)',
    undefined,
    'https://www.facebook.com/MyMakatiVerified/videos/1062955702870515/',
    '2026-09-28'
  ),
  regularSession(
    '2026-09-21',
    'Makati City Regular Council Session (September 21, 2026)'
  ),
  regularSession(
    '2026-09-14',
    'Makati City Regular Council Session (September 14, 2026)'
  ),
  regularSession(
    '2026-09-07',
    'Makati City Regular Council Session (September 07, 2026)',
    'The portal listing observed during the 26 September 2026 audit carried a September 07 title while the adjacent listing date appeared as September 01. The session date is taken from the official title; preserve the item record before treating listing metadata as corrected.'
  ),
  regularSession(
    '2026-09-01',
    'Makati City Regular Council Session (September 01, 2026)'
  ),
  regularSession(
    '2026-08-24',
    'Makati City Regular Council Session (August 24, 2026)'
  ),
  regularSession(
    '2026-08-17',
    'Makati City Regular Council Session (August 17, 2026)'
  ),
  regularSession(
    '2026-08-11',
    'Makati City Regular Council Session (August 11, 2026)'
  ),
  regularSession(
    '2026-08-03',
    'Makati City Regular Council Session (August 03, 2026)'
  ),
  regularSession(
    '2026-07-27',
    'Makati City Regular Council Session (July 27, 2026)'
  ),
];

export const councilSessionBackfillQueue = currentCouncilSessionSeeds.filter(
  session => session.transcript.status === 'planned'
);

export const councilSessionBackfillCount = councilSessionBackfillQueue.length;

export const councilSessionIngestionState = {
  reviewedAt: '2026-10-05',
  discoverySource: 'makati-council-videos',
  discoveredCurrentSessions: currentCouncilSessionSeeds.length,
  transcriptsAvailable: currentCouncilSessionSeeds.filter(
    session =>
      session.transcript.status === 'available' ||
      session.transcript.status === 'reviewed'
  ).length,
  backfillPending: councilSessionBackfillCount,
  newSessionMode:
    'event-driven after official session discovery; transcription waits for a stable official recording URL',
} as const;
