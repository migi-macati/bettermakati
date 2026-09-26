import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://www.makati.gov.ph';
const uiUrl = origin + '/content/resolutions-and-ordinances/author';
const capturedAt = new Date().toISOString();
const snapshotDate = capturedAt.slice(0, 10);
const snapshotPath =
  process.env.ARCHIVE_SNAPSHOT_PATH ||
  `data/makati-legislation-archive-${snapshotDate}.json`;

await mkdir('data', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36 BetterMakatiArchiveEnumerator/1.0',
});

const page = await context.newPage();
await page.goto(uiUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});

const calls = [];

async function getJson(path, { required = false } = {}) {
  const url = origin + path;
  const response = await context.request.get(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      referer: uiUrl,
    },
    timeout: 60_000,
  });

  const status = response.status();
  let json = null;
  let parseError = null;
  try {
    json = await response.json();
  } catch (error) {
    parseError = String(error);
  }

  calls.push({
    path,
    url,
    status,
    ok: response.ok(),
    rowCount: Array.isArray(json) ? json.length : null,
    parseError,
  });

  if (required && (!response.ok() || !Array.isArray(json))) {
    throw new Error(
      `Required Makati ROMS endpoint failed: ${path} status=${status} array=${Array.isArray(json)}`
    );
  }

  return { url, status, ok: response.ok(), json };
}

const allResult = await getJson('/api/ROMS/Legislation/List/ByType/all');
const resolutionResult = await getJson(
  '/api/ROMS/Legislation/List/ByType/resolution'
);
const ordinanceResult = await getJson(
  '/api/ROMS/Legislation/List/ByType/ordinance'
);
const authorResult = await getJson('/api/ROMS/Author/List/ByType/all', {
  required: true,
});
const categoryResult = await getJson('/api/ROMS/Category/List/ByType/all');

let rawRows = Array.isArray(allResult.json) ? allResult.json : [];
let enumerationMethod = 'global-by-type-all';

if (!rawRows.length) {
  enumerationMethod = 'author-union-fallback';
  const byId = new Map();

  for (const author of authorResult.json) {
    if (!author?.memberId) continue;
    const result = await getJson(
      '/api/ROMS/Legislation/List/ByMember/' +
        encodeURIComponent(author.memberId)
    );
    if (!Array.isArray(result.json)) continue;
    for (const row of result.json) {
      const key = row?.legislationId || JSON.stringify(row);
      if (!byId.has(key)) byId.set(key, row);
    }
  }

  rawRows = [...byId.values()];
}

if (!rawRows.length) {
  throw new Error('Official Makati archive enumeration returned zero legislation rows.');
}

const validTypes = new Set(['RESOLUTION', 'ORDINANCE']);
const idGroups = new Map();
const referenceGroups = new Map();

for (let index = 0; index < rawRows.length; index += 1) {
  const row = rawRows[index] || {};
  const id = typeof row.legislationId === 'string' ? row.legislationId.trim() : '';
  const type = typeof row.type === 'string' ? row.type.trim().toUpperCase() : '';
  const code = typeof row.code === 'string' ? row.code.trim() : '';

  if (id) {
    if (!idGroups.has(id)) idGroups.set(id, []);
    idGroups.get(id).push(index);
  }

  if (type && code) {
    const key = type + '::' + code;
    if (!referenceGroups.has(key)) referenceGroups.set(key, []);
    referenceGroups.get(key).push(index);
  }
}

const duplicateIdGroups = [...idGroups.entries()]
  .filter(([, indexes]) => indexes.length > 1)
  .map(([legislationId, indexes]) => ({ legislationId, indexes }));

const duplicateReferenceGroups = [...referenceGroups.entries()]
  .filter(([, indexes]) => {
    const ids = new Set(
      indexes.map(index => rawRows[index]?.legislationId).filter(Boolean)
    );
    return ids.size > 1;
  })
  .map(([key, indexes]) => {
    const [type, code] = key.split('::');
    return {
      type,
      code,
      indexes,
      legislationIds: [
        ...new Set(indexes.map(index => rawRows[index]?.legislationId).filter(Boolean)),
      ],
    };
  });

const duplicateIdIndexes = new Set(
  duplicateIdGroups.flatMap(group => group.indexes)
);
const duplicateReferenceIndexes = new Set(
  duplicateReferenceGroups.flatMap(group => group.indexes)
);

const dispositions = rawRows.map((row, index) => {
  const reasons = [];
  const id =
    typeof row?.legislationId === 'string' ? row.legislationId.trim() : '';
  const type = typeof row?.type === 'string' ? row.type.trim().toUpperCase() : '';
  const code = typeof row?.code === 'string' ? row.code.trim() : '';
  const title = typeof row?.title === 'string' ? row.title.trim() : '';

  if (!id) reasons.push('missing-legislation-id');
  if (!validTypes.has(type)) reasons.push('unrecognized-measure-type');
  if (!code) reasons.push('missing-official-code');
  if (!title) reasons.push('missing-title');

  let status = 'canonical-candidate';
  if (reasons.length) status = 'unresolved';
  else if (duplicateIdIndexes.has(index)) status = 'duplicate-legislation-id';
  else if (duplicateReferenceIndexes.has(index)) status = 'duplicate-reference';

  return {
    index,
    legislationId: id || null,
    type: type || null,
    code: code || null,
    status,
    reasons,
  };
});

const countByType = rawRows.reduce((acc, row) => {
  const type =
    typeof row?.type === 'string' ? row.type.trim().toUpperCase() : 'UNKNOWN';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const countByYear = rawRows.reduce((acc, row) => {
  const code = typeof row?.code === 'string' ? row.code.trim() : '';
  const match = code.match(/^(\d{4})/);
  const year = match ? match[1] : 'unknown';
  acc[year] = (acc[year] || 0) + 1;
  return acc;
}, {});

function uniqueIds(rows) {
  return new Set(
    (Array.isArray(rows) ? rows : [])
      .map(row => row?.legislationId)
      .filter(Boolean)
  );
}

const allIds = uniqueIds(rawRows);
const resolutionIds = uniqueIds(resolutionResult.json);
const ordinanceIds = uniqueIds(ordinanceResult.json);
const filterUnion = new Set([...resolutionIds, ...ordinanceIds]);

const filterVerification = {
  resolutionEndpointAvailable:
    resolutionResult.ok && Array.isArray(resolutionResult.json),
  ordinanceEndpointAvailable:
    ordinanceResult.ok && Array.isArray(ordinanceResult.json),
  resolutionCount: Array.isArray(resolutionResult.json)
    ? resolutionResult.json.length
    : null,
  ordinanceCount: Array.isArray(ordinanceResult.json)
    ? ordinanceResult.json.length
    : null,
  unionUniqueIdCount:
    resolutionIds.size || ordinanceIds.size ? filterUnion.size : null,
  allUniqueIdCount: allIds.size,
  exactIdSetMatch:
    resolutionIds.size || ordinanceIds.size
      ? allIds.size === filterUnion.size &&
        [...allIds].every(id => filterUnion.has(id))
      : null,
};

if (
  filterVerification.resolutionEndpointAvailable &&
  filterVerification.ordinanceEndpointAvailable &&
  filterVerification.exactIdSetMatch === false
) {
  throw new Error(
    'Official All filter does not match the exact union of Resolution and Ordinance filter IDs.'
  );
}

const dispositionCounts = dispositions.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, {});

const snapshot = {
  schemaVersion: 1,
  capturedAt,
  workstream: 'W4-2e2a — Resolve and enumerate dynamic legislation archive',
  source: {
    publisher: 'City Government of Makati',
    uiUrl,
    apiNamespace: origin + '/api/ROMS/',
    enumerationEndpoint:
      enumerationMethod === 'global-by-type-all'
        ? allResult.url
        : 'author union via /api/ROMS/Legislation/List/ByMember/{memberId}',
    note:
      'Raw official API fields are preserved below. BetterMakati does not infer missing approval dates, authorship, lifecycle status, or legal effect from these rows.',
  },
  enumeration: {
    method: enumerationMethod,
    retrievableEntryTotal: rawRows.length,
    uniqueLegislationIdTotal: allIds.size,
    countByType,
    countByYear,
    authorIndexCount: authorResult.json.length,
    categoryIndexCount: Array.isArray(categoryResult.json)
      ? categoryResult.json.length
      : null,
    filterVerification,
    duplicateLegislationIdGroupCount: duplicateIdGroups.length,
    duplicateReferenceGroupCount: duplicateReferenceGroups.length,
    dispositionCounts,
    apiCalls: calls,
  },
  duplicateLegislationIds: duplicateIdGroups,
  duplicateReferences: duplicateReferenceGroups,
  dispositions,
  rows: rawRows,
};

await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

console.log(
  JSON.stringify(
    {
      snapshotPath,
      capturedAt,
      enumerationMethod,
      retrievableEntryTotal: rawRows.length,
      uniqueLegislationIdTotal: allIds.size,
      countByType,
      authorIndexCount: snapshot.enumeration.authorIndexCount,
      categoryIndexCount: snapshot.enumeration.categoryIndexCount,
      filterVerification,
      duplicateLegislationIdGroupCount: duplicateIdGroups.length,
      duplicateReferenceGroupCount: duplicateReferenceGroups.length,
      dispositionCounts,
      calls,
    },
    null,
    2
  )
);

await browser.close();
