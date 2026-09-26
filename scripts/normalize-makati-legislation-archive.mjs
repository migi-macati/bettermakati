import { readFile, readdir, writeFile } from 'node:fs/promises';

const dataDir = 'data';
const snapshotPattern = /^makati-legislation-archive-(\d{4}-\d{2}-\d{2})\.json$/;

const snapshotFiles = (await readdir(dataDir))
  .filter(name => snapshotPattern.test(name))
  .sort();

if (!snapshotFiles.length) {
  throw new Error('No dated Makati legislation archive snapshot found.');
}

const snapshotFile = snapshotFiles.at(-1);
const snapshotPath = dataDir + '/' + snapshotFile;
const snapshotDate = snapshotFile.match(snapshotPattern)?.[1];

if (!snapshotDate) {
  throw new Error('Unable to derive snapshot date from ' + snapshotFile);
}

const outputPath =
  process.env.LEGISLATION_NORMALIZED_PATH ||
  dataDir + '/makati-legislation-normalized-' + snapshotDate + '.json';

const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
const seedSource = await readFile('src/data/localLegislation.ts', 'utf8');

const rawRows = Array.isArray(snapshot.rows) ? snapshot.rows : [];
const rawDispositions = Array.isArray(snapshot.dispositions)
  ? snapshot.dispositions
  : [];

if (!rawRows.length) {
  throw new Error('Archive snapshot contains zero rows: ' + snapshotPath);
}

if (rawDispositions.length && rawDispositions.length !== rawRows.length) {
  throw new Error(
    'Archive disposition count does not match raw row count: ' +
      rawDispositions.length +
      ' != ' +
      rawRows.length
  );
}

const archiveSourceId = 'makati-roms-archive-' + snapshotDate;
const archiveUrl =
  snapshot.source?.uiUrl ||
  'https://www.makati.gov.ph/content/resolutions-and-ordinances/author';
const apiNamespace =
  snapshot.source?.apiNamespace || 'https://www.makati.gov.ph/api/ROMS/';

const cleanText = value =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

const slugPart = value =>
  cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const seedByKey = new Map();
for (const [measureType, regex] of [
  ['ordinance', /ordinanceFromAnnex\(\s*'([^']+)'/g],
  ['resolution', /resolutionFromAnnex\(\s*'([^']+)'/g],
]) {
  for (const match of seedSource.matchAll(regex)) {
    const officialNumber = cleanText(match[1]);
    const key = measureType.toUpperCase() + '::' + officialNumber;
    const id = measureType + '-' + slugPart(officialNumber);
    if (seedByKey.has(key)) {
      throw new Error('Duplicate existing seed reference: ' + key);
    }
    seedByKey.set(key, id);
  }
}

const rawDispositionByIndex = new Map(
  rawDispositions.map(item => [item.index, item])
);

const records = [];
const unresolved = [];
const matchedSeedKeys = new Set();

for (let index = 0; index < rawRows.length; index += 1) {
  const row = rawRows[index] || {};
  const disposition = rawDispositionByIndex.get(index);
  const officialType = cleanText(row.type).toUpperCase();
  const officialNumber = cleanText(row.code);
  const title = cleanText(row.title);
  const archiveLegislationId = cleanText(row.legislationId);

  const reasons = [];
  if (!['ORDINANCE', 'RESOLUTION'].includes(officialType)) {
    reasons.push('unrecognized-measure-type');
  }
  if (!officialNumber) reasons.push('missing-official-number');
  if (!title) reasons.push('missing-title');
  if (!archiveLegislationId) reasons.push('missing-archive-legislation-id');

  if (disposition && disposition.status !== 'canonical-candidate') {
    reasons.push('raw-disposition-' + disposition.status);
    for (const reason of disposition.reasons || []) {
      if (!reasons.includes(reason)) reasons.push(reason);
    }
  }

  if (reasons.length) {
    unresolved.push({
      rawIndex: index,
      archiveLegislationId: archiveLegislationId || null,
      type: officialType || null,
      officialNumber: officialNumber || null,
      reasons,
    });
    continue;
  }

  const measureType = officialType.toLowerCase();
  const key = officialType + '::' + officialNumber;
  const generatedId = measureType + '-' + slugPart(officialNumber);
  const seedRecordId = seedByKey.get(key) || null;

  if (seedRecordId && seedRecordId !== generatedId) {
    throw new Error(
      'Seed ID does not match normalized archive ID for ' +
        key +
        ': ' +
        seedRecordId +
        ' != ' +
        generatedId
    );
  }
  if (seedRecordId) matchedSeedKeys.add(key);

  const yearMatch = officialNumber.match(/^(\d{4})(?:-|$)/);
  const sequenceMatch = officialNumber.match(/^\d{4}-(.+)$/);

  const reference = {
    officialNumber,
    display:
      'City ' +
      (measureType === 'ordinance' ? 'Ordinance' : 'Resolution') +
      ' No. ' +
      officialNumber,
  };
  if (yearMatch) reference.seriesYear = Number(yearMatch[1]);
  if (sequenceMatch?.[1]) reference.sequence = sequenceMatch[1];

  records.push({
    id: generatedId,
    archiveLegislationId,
    measureType,
    reference,
    title,
    sourceIds: [archiveSourceId],
    officialDocument: {
      url: null,
      status: 'not-exposed-by-enumerated-archive-row',
    },
    ...(seedRecordId
      ? {
          seedReconciliation: {
            status: 'matched-existing-seed',
            seedRecordId,
          },
        }
      : {}),
  });
}

const missingSeedKeys = [...seedByKey.keys()].filter(
  key => !matchedSeedKeys.has(key)
);

if (missingSeedKeys.length) {
  throw new Error(
    'Existing local-legislation seed records missing from archive: ' +
      missingSeedKeys.join(', ')
  );
}

if (records.length + unresolved.length !== rawRows.length) {
  throw new Error(
    'Not every archive row received a canonical or unresolved disposition.'
  );
}

const duplicateValues = values => {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    else seen.add(value);
  }
  return [...duplicates];
};

const duplicateIds = duplicateValues(records.map(record => record.id));
const duplicateArchiveIds = duplicateValues(
  records.map(record => record.archiveLegislationId)
);
const duplicateReferences = duplicateValues(
  records.map(
    record =>
      record.measureType.toUpperCase() +
      '::' +
      record.reference.officialNumber
  )
);

if (
  duplicateIds.length ||
  duplicateArchiveIds.length ||
  duplicateReferences.length
) {
  throw new Error(
    'Normalized archive uniqueness failure: ids=' +
      duplicateIds.length +
      ', archiveIds=' +
      duplicateArchiveIds.length +
      ', references=' +
      duplicateReferences.length
  );
}

const countByType = records.reduce((acc, record) => {
  acc[record.measureType] = (acc[record.measureType] || 0) + 1;
  return acc;
}, {});

const countByYear = records.reduce((acc, record) => {
  const year = record.reference.seriesYear
    ? String(record.reference.seriesYear)
    : 'unknown';
  acc[year] = (acc[year] || 0) + 1;
  return acc;
}, {});

const normalized = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  workstream:
    'W4-2e2b — Normalize enumerated archive rows and reconcile seed registry',
  scope: {
    sourceSnapshot: snapshotPath,
    sourceCapturedAt: snapshot.capturedAt || null,
    rule:
      'One normalized identity per retrievable official archive row. Completeness applies to this enumerated official archive result set, not to Makati legislative history outside the archive.',
    nonGoals: [
      'topic tagging',
      'summaries',
      'lifecycle inference',
      'speaker or author inference',
      'page redesign',
    ],
  },
  sources: {
    [archiveSourceId]: {
      id: archiveSourceId,
      publisher: snapshot.source?.publisher || 'City Government of Makati',
      archiveUrl,
      apiNamespace,
      sourceClass: 'city-legislation-archive',
      role: 'identity',
      note:
        'The enumerated archive row exposes the archive UUID, type, reference and title. A measure-specific official document URL is left null when the enumerated row does not expose one.',
    },
  },
  enumeration: {
    inputRowTotal: rawRows.length,
    canonicalRecordTotal: records.length,
    unresolvedTotal: unresolved.length,
    countByType,
    countByYear,
    uniqueCanonicalIdTotal: records.length,
    uniqueArchiveLegislationIdTotal: records.length,
    uniqueTypeReferenceTotal: records.length,
  },
  seedReconciliation: {
    existingSeedCount: seedByKey.size,
    matchedSeedCount: matchedSeedKeys.size,
    missingSeedCount: missingSeedKeys.length,
    missingSeedKeys,
    archiveOnlyCount: records.length - matchedSeedKeys.size,
  },
  records,
  unresolved,
};

await writeFile(outputPath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');

console.log(
  JSON.stringify(
    {
      outputPath,
      sourceSnapshot: snapshotPath,
      inputRowTotal: rawRows.length,
      canonicalRecordTotal: records.length,
      unresolvedTotal: unresolved.length,
      countByType,
      seedReconciliation: normalized.seedReconciliation,
    },
    null,
    2
  )
);
