import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

const dataDir = 'data';
const outputDir = 'public/data';
const normalizedPattern =
  /^makati-legislation-normalized-(\d{4}-\d{2}-\d{2})\.json$/;

const normalizedFiles = (await readdir(dataDir))
  .filter(name => normalizedPattern.test(name))
  .sort();

if (!normalizedFiles.length) {
  throw new Error('No normalized Makati legislation archive found.');
}

const sourceFile = normalizedFiles.at(-1);
const sourceDate = sourceFile.match(normalizedPattern)?.[1];

if (!sourceDate) {
  throw new Error('Unable to derive normalized archive date from ' + sourceFile);
}

const sourcePath = dataDir + '/' + sourceFile;
const normalized = JSON.parse(await readFile(sourcePath, 'utf8'));
const records = Array.isArray(normalized.records) ? normalized.records : [];

if (!records.length) {
  throw new Error('Normalized legislation archive contains zero records.');
}

if (
  normalized.enumeration?.canonicalRecordTotal &&
  records.length !== normalized.enumeration.canonicalRecordTotal
) {
  throw new Error(
    'Browser index record count does not match normalized archive: ' +
      records.length +
      ' != ' +
      normalized.enumeration.canonicalRecordTotal
  );
}

const archiveSource = Object.values(normalized.sources || {})[0] || {};
const years = [
  ...new Set(
    records
      .map(record => record.reference?.seriesYear)
      .filter(year => Number.isInteger(year))
  ),
].sort((a, b) => b - a);

const browserIndex = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceDate,
  sourceSnapshot: normalized.scope?.sourceSnapshot || null,
  archiveUrl: archiveSource.archiveUrl || null,
  total: records.length,
  countByType: normalized.enumeration?.countByType || {},
  years,
  records: records.map(record => ({
    id: record.id,
    archiveLegislationId: record.archiveLegislationId,
    measureType: record.measureType,
    officialNumber: record.reference?.officialNumber || '',
    display: record.reference?.display || record.reference?.officialNumber || '',
    seriesYear: record.reference?.seriesYear || null,
    title: record.title,
    officialDocumentUrl: record.officialDocument?.url || null,
    officialDocumentStatus: record.officialDocument?.status || null,
  })),
};

await mkdir(outputDir, { recursive: true });
const outputPath = outputDir + '/makati-legislation-index.json';
await writeFile(outputPath, JSON.stringify(browserIndex) + '\n', 'utf8');

console.log(
  JSON.stringify(
    {
      outputPath,
      sourcePath,
      total: browserIndex.total,
      years: browserIndex.years.length,
      countByType: browserIndex.countByType,
    },
    null,
    2
  )
);
