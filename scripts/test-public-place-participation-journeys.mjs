import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import civicHandler from '../api/civic.js';
import observationHandler from '../api/civic-observation.js';
import auditHandler from '../api/civic-audit.js';

const originalFetch = globalThis.fetch;
const originalGithubToken = process.env.BETTERMAKATI_GITHUB_TOKEN;
const originalRepo = process.env.BETTERMAKATI_GITHUB_REPO;

process.env.BETTERMAKATI_GITHUB_TOKEN = 'test-token';
process.env.BETTERMAKATI_GITHUB_REPO = 'migi-macati/bettermakati';

let ipCounter = 100;
const requestFor = (method, body = {}, query = {}) => {
  ipCounter += 1;
  const address = '198.51.100.' + ipCounter;
  return {
    method,
    body,
    query,
    headers: { 'x-forwarded-for': address },
    socket: { remoteAddress: address },
  };
};

const responseMock = () => ({
  statusCode: 200,
  body: null,
  headers: {},
  setHeader(name, value) {
    this.headers[name] = value;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(value) {
    this.body = value;
    return this;
  },
  end() {
    return this;
  },
});

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  async json() {
    return body;
  },
});

const civicMetaFromBody = body => {
  const match = String(body || '').match(
    /<!--\s*civic-meta\s+({[\s\S]*?})\s*-->/
  );
  return match ? JSON.parse(match[1]) : null;
};

const taggedBody = (marker, value) =>
  '<!-- ' + marker + ' ' + JSON.stringify(value) + ' -->';

const matchedPlacePayload = {
  action: 'create',
  kind: 'report',
  entityId: 'poblacion-park',
  entityKind: 'segment',
  locationMode: 'matched-entity',
  assetId: 'poblacion-park',
  assetTitle: 'Incorrect client title',
  assetType: 'public-office',
  category: 'litter',
  subject: 'Litter near park entrance',
  details: 'Loose litter is visible beside the entrance.',
  location: 'Makati Poblacion Park',
  locationLabel: 'Makati Poblacion Park',
  lat: 14.5673,
  lng: 121.03373,
  severity: 'normal',
  preferredChannel: '',
  alias: '',
  evidenceUrl: '',
  forceNew: false,
  website: '',
};

try {
  let createdCivicIssue = null;

  // Nearby report -> canonical place match -> native public case.
  {
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';
      calls.push({ target, method });

      if (target.includes('/issues?state=all&per_page=100')) {
        return jsonResponse([]);
      }
      if (target.endsWith('/issues') && method === 'POST') {
        createdCivicIssue = JSON.parse(options.body);
        return jsonResponse(
          {
            number: 902,
            html_url:
              'https://github.com/migi-macati/bettermakati/issues/902',
          },
          201
        );
      }
      throw new Error('Unexpected civic create fetch: ' + method + ' ' + target);
    };

    const res = responseMock();
    await civicHandler(requestFor('POST', matchedPlacePayload), res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body?.ok, true);
    assert.equal(res.body?.reference, 902);
    assert.equal(res.body?.status, 'unverified');
    assert.equal(res.body?.forwarded, false);
    assert.deepEqual(calls.map(call => call.method), ['GET', 'POST']);

    const meta = civicMetaFromBody(createdCivicIssue?.body);
    assert.ok(meta);
    assert.equal(meta.entityId, 'poblacion-park');
    assert.equal(meta.entityKind, 'place');
    assert.equal(meta.placeId, 'poblacion-park');
    assert.equal(meta.assetId, 'poblacion-park');
    assert.equal(meta.assetType, 'park');
    assert.equal(meta.locationMode, 'matched-entity');
    assert.equal(meta.category, 'litter');
    assert.equal(meta.lat, 14.5673);
    assert.equal(meta.lng, 121.0337);
    assert.match(
      createdCivicIssue?.body || '',
      /not an official government case unless a separate referral is recorded/
    );
  }

  // Same canonical entity + category + nearby point -> duplicate instead of new case.
  {
    const existing = {
      number: 902,
      state: 'open',
      title: createdCivicIssue.title,
      body: createdCivicIssue.body,
      html_url:
        'https://github.com/migi-macati/bettermakati/issues/902',
      created_at: '2026-09-26T03:05:00Z',
      updated_at: '2026-09-26T03:05:00Z',
      comments: 0,
    };
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ target: String(url), method: options.method || 'GET' });
      return jsonResponse([existing]);
    };

    const res = responseMock();
    await civicHandler(requestFor('POST', matchedPlacePayload), res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body?.duplicates?.length, 1);
    assert.equal(res.body?.duplicates?.[0]?.number, 902);
    assert.ok(res.body?.duplicates?.[0]?.distanceMeters <= 75);
    assert.equal(calls.length, 1);
  }

  // Duplicate flow can add a confirmation to the existing case.
  {
    const issue = {
      number: 902,
      state: 'open',
      title: createdCivicIssue.title,
      body: createdCivicIssue.body,
      html_url:
        'https://github.com/migi-macati/bettermakati/issues/902',
      created_at: '2026-09-26T03:05:00Z',
      updated_at: '2026-09-26T03:05:00Z',
      comments: 0,
    };
    let savedComment = null;

    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';
      if (target.endsWith('/issues/902') && method === 'GET') {
        return jsonResponse(issue);
      }
      if (target.endsWith('/issues/902/comments') && method === 'POST') {
        savedComment = JSON.parse(options.body);
        return jsonResponse(
          {
            id: 7001,
            html_url:
              'https://github.com/migi-macati/bettermakati/issues/902#issuecomment-7001',
          },
          201
        );
      }
      throw new Error(
        'Unexpected duplicate-confirm fetch: ' + method + ' ' + target
      );
    };

    const res = responseMock();
    await civicHandler(
      requestFor('POST', {
        action: 'comment',
        issueNumber: 902,
        commentType: 'confirm',
        details: 'I can confirm this issue is present.',
        alias: '',
      }),
      res
    );

    assert.equal(res.statusCode, 201);
    assert.equal(res.body?.ok, true);
    assert.match(savedComment?.body || '', /I can confirm this issue/);
    assert.match(savedComment?.body || '', /"commentType":"confirm"/);
  }

  // Case lifecycle: community signals remain separate while official evidence
  // advances only through civic-admin events.
  {
    const issue = {
      number: 902,
      state: 'open',
      title: createdCivicIssue.title,
      body: createdCivicIssue.body,
      html_url:
        'https://github.com/migi-macati/bettermakati/issues/902',
      created_at: '2026-09-26T03:05:00Z',
      updated_at: '2026-09-26T03:30:00Z',
      comments: 6,
    };
    const comments = [
      {
        id: 1,
        author_association: 'NONE',
        created_at: '2026-09-26T03:10:00Z',
        updated_at: '2026-09-26T03:10:00Z',
        html_url: 'https://example.test/comment/1',
        body: taggedBody('civic-comment', {
          version: 1,
          kind: 'comment',
          commentType: 'confirm',
          parentCommentId: null,
        }),
      },
      {
        id: 2,
        author_association: 'NONE',
        created_at: '2026-09-26T03:11:00Z',
        updated_at: '2026-09-26T03:11:00Z',
        html_url: 'https://example.test/comment/2',
        body: taggedBody('civic-comment', {
          version: 1,
          kind: 'comment',
          commentType: 'confirm',
          parentCommentId: null,
        }),
      },
      {
        id: 3,
        author_association: 'NONE',
        created_at: '2026-09-26T03:12:00Z',
        updated_at: '2026-09-26T03:12:00Z',
        html_url: 'https://example.test/comment/3',
        body: taggedBody('civic-comment', {
          version: 1,
          kind: 'comment',
          commentType: 'resolved',
          parentCommentId: null,
        }),
      },
      {
        id: 4,
        author_association: 'OWNER',
        created_at: '2026-09-26T03:15:00Z',
        updated_at: '2026-09-26T03:15:00Z',
        html_url: 'https://example.test/comment/4',
        body: taggedBody('civic-admin', {
          version: 1,
          status: 'reviewed',
          authority: '',
          channel: '',
          externalReference: '',
          recordedAt: '2026-09-26T03:15:00Z',
        }),
      },
      {
        id: 5,
        author_association: 'OWNER',
        created_at: '2026-09-26T03:20:00Z',
        updated_at: '2026-09-26T03:20:00Z',
        html_url: 'https://example.test/comment/5',
        body: taggedBody('civic-admin', {
          version: 1,
          status: 'forwarded',
          authority: 'Makati Department of Environmental Services',
          channel: 'official referral',
          externalReference: 'BM-902',
          recordedAt: '2026-09-26T03:20:00Z',
        }),
      },
      {
        id: 6,
        author_association: 'OWNER',
        created_at: '2026-09-26T03:30:00Z',
        updated_at: '2026-09-26T03:30:00Z',
        html_url: 'https://example.test/comment/6',
        body: taggedBody('civic-admin', {
          version: 1,
          status: 'acknowledged',
          authority: 'Makati Department of Environmental Services',
          channel: 'official referral',
          externalReference: 'BM-902',
          recordedAt: '2026-09-26T03:30:00Z',
        }),
      },
    ];

    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';
      if (target.endsWith('/issues/902') && method === 'GET') {
        return jsonResponse(issue);
      }
      if (
        target.endsWith('/issues/902/comments?per_page=100') &&
        method === 'GET'
      ) {
        return jsonResponse(comments);
      }
      throw new Error('Unexpected lifecycle fetch: ' + method + ' ' + target);
    };

    const res = responseMock();
    await civicHandler(requestFor('GET', {}, { issue: '902' }), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.lifecycle?.status, 'acknowledged');
    assert.equal(
      res.body?.lifecycle?.label,
      'Authority acknowledged'
    );
    assert.equal(res.body?.lifecycle?.confirmationCount, 2);
    assert.equal(res.body?.lifecycle?.adminEvents?.length, 3);
    assert.equal(
      res.body?.lifecycle?.adminEvents?.[2]?.authority,
      'Makati Department of Environmental Services'
    );
    assert.notEqual(
      res.body?.lifecycle?.status,
      'community-verified-resolved',
      'An ordinary appears-resolved signal must not promote official lifecycle.'
    );
  }

  const observationOne = {
    schemaVersion: 1,
    entityId: 'poblacion-park',
    entityKind: 'place',
    familyId: 'park-public-space',
    questionSetId: 'park-public-space-v1',
    observedAt: '2026-09-26T03:00:00.000Z',
    timeContext: 'morning',
    weatherContext: 'dry',
    answers: [
      { questionId: 'entrance-access', value: 'present-and-usable' },
      {
        questionId: 'step-free-access',
        value: 'continuous-step-free-route',
      },
      { questionId: 'seating', value: 'present-and-usable' },
      { questionId: 'toilets', value: 'present-and-usable' },
    ],
    overallNote: '',
    evidenceUrl: '',
    publicAlias: '',
  };

  const observationTwo = {
    ...observationOne,
    observedAt: '2026-09-26T03:20:00.000Z',
    answers: [
      { questionId: 'entrance-access', value: 'present-and-usable' },
      {
        questionId: 'step-free-access',
        value: 'partial-step-free-route',
      },
      { questionId: 'seating', value: 'present-and-usable' },
      { questionId: 'toilets', value: 'present-but-not-usable' },
    ],
  };

  const observationThread = {
    number: 950,
    title: '[Civic Observations] Makati Poblacion Park',
    html_url:
      'https://github.com/migi-macati/bettermakati/issues/950',
    body: taggedBody('civic-observation-thread', {
      version: 1,
      entityId: 'poblacion-park',
      entityKind: 'place',
      entityCategory: 'park',
      familyId: 'park-public-space',
      createdVia: 'bettermakati-structured-observations',
    }),
  };

  const observationComments = [
    {
      id: 8001,
      created_at: '2026-09-26T03:02:00Z',
      html_url: 'https://example.test/observation/8001',
      body: taggedBody('civic-observation', observationOne),
    },
    {
      id: 8002,
      created_at: '2026-09-26T03:22:00Z',
      html_url: 'https://example.test/observation/8002',
      body: taggedBody('civic-observation', observationTwo),
    },
    {
      id: 8003,
      created_at: '2026-09-25T03:02:00Z',
      html_url: 'https://example.test/observation/8003',
      body: taggedBody('civic-observation', {
        ...observationOne,
        observedAt: '2026-09-25T03:00:00.000Z',
      }),
    },
  ];

  // Structured observation submission normalizes the civic entity and writes
  // into the entity's observation thread.
  {
    let createdThreadBody = null;
    let createdObservationBody = null;

    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';

      if (target.startsWith('https://api.github.com/search/issues?')) {
        return jsonResponse({ items: [] });
      }
      if (target.endsWith('/issues') && method === 'POST') {
        const input = JSON.parse(options.body);
        createdThreadBody = input.body;
        return jsonResponse(
          {
            number: 950,
            html_url:
              'https://github.com/migi-macati/bettermakati/issues/950',
            title: input.title,
            body: input.body,
          },
          201
        );
      }
      if (target.endsWith('/issues/950/comments') && method === 'POST') {
        const input = JSON.parse(options.body);
        createdObservationBody = input.body;
        return jsonResponse(
          {
            id: 8001,
            created_at: '2026-09-26T03:02:00Z',
            html_url: 'https://example.test/observation/8001',
          },
          201
        );
      }
      throw new Error(
        'Unexpected observation submit fetch: ' + method + ' ' + target
      );
    };

    const res = responseMock();
    await observationHandler(
      requestFor('POST', {
        entityId: 'poblacion-park',
        entityName: 'Wrong client name',
        entityKind: 'route',
        entityCategory: 'public-office',
        familyId: 'park-public-space',
        questionSetId: 'park-public-space-v1',
        observedAt: observationOne.observedAt,
        timeContext: 'morning',
        weatherContext: 'dry',
        answers: observationOne.answers,
        overallNote: '',
        alias: '',
        evidenceUrl: '',
        website: '',
      }),
      res
    );

    assert.equal(res.statusCode, 201);
    assert.equal(res.body?.ok, true);
    assert.match(createdThreadBody || '', /Makati Poblacion Park/);
    assert.match(createdThreadBody || '', /"entityCategory":"park"/);
    assert.match(createdObservationBody || '', /"entityKind":"place"/);
    assert.match(createdObservationBody || '', /"familyId":"park-public-space"/);
  }

  // Structured observation read returns dated evidence and freshness inputs.
  {
    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';

      if (target.startsWith('https://api.github.com/search/issues?')) {
        return jsonResponse({ items: [observationThread] });
      }
      if (
        target.endsWith('/issues/950/comments?per_page=100') &&
        method === 'GET'
      ) {
        return jsonResponse(observationComments.slice(0, 2));
      }
      throw new Error(
        'Unexpected observation read fetch: ' + method + ' ' + target
      );
    };

    const res = responseMock();
    await observationHandler(
      requestFor('GET', {}, { entityId: 'poblacion-park' }),
      res
    );

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.entityId, 'poblacion-park');
    assert.equal(res.body?.observations?.length, 2);
    assert.equal(
      res.body?.observations?.[0]?.observedAt,
      observationTwo.observedAt
    );
    assert.equal(res.body?.freshness?.familyId, 'park-public-space');
    assert.equal(res.body?.freshness?.observationCount, 2);
    assert.equal(res.body?.freshness?.recentWindowDays, 30);
    assert.equal(
      res.body?.freshness?.latestObservedAt,
      observationTwo.observedAt
    );
  }

  // Pilot audit reads the same structured observations, applies the frozen
  // campaign window/target set, and emits raw coverage inputs without scoring.
  {
    globalThis.fetch = async (url, options = {}) => {
      const target = String(url);
      const method = options.method || 'GET';

      if (target.startsWith('https://api.github.com/search/issues?')) {
        return jsonResponse({ items: [observationThread] });
      }
      if (
        target.endsWith('/issues/950/comments?per_page=100') &&
        method === 'GET'
      ) {
        return jsonResponse(observationComments);
      }
      throw new Error('Unexpected audit fetch: ' + method + ' ' + target);
    };

    const res = responseMock();
    await auditHandler(
      requestFor('GET', {}, {
        campaign: 'makati-public-park-accessibility-2026-pilot',
      }),
      res
    );

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.dataAvailable, true);
    assert.equal(res.body?.targetCount, 13);
    assert.equal(res.body?.inventoryClaim, 'complete-for-declared-scope');
    assert.equal(res.body?.observationCount, 2);
    assert.equal(res.body?.observedEntities, 1);
    assert.equal(res.body?.completeEntities, 1);

    const poblacion = res.body?.entities?.find(
      entity => entity.entityId === 'poblacion-park'
    );
    assert.equal(poblacion?.observationCount, 2);
    assert.equal(poblacion?.requiredQuestionCount, 4);
    assert.equal(poblacion?.substantiveQuestionCount, 4);
    assert.equal(poblacion?.isComplete, true);

    const entrance = res.body?.questions?.find(
      question => question.questionId === 'entrance-access'
    );
    assert.equal(entrance?.sampleCount, 2);

    assert.deepEqual(
      res.body?.metricInputs?.metrics?.['audit-observed-entity-coverage'],
      { numerator: 1, denominator: 13 }
    );
    assert.deepEqual(
      res.body?.metricInputs?.metrics?.['audit-complete-entity-coverage'],
      { numerator: 1, denominator: 13 }
    );
    assert.equal(
      Object.prototype.hasOwnProperty.call(res.body || {}, 'overallScore'),
      false
    );
  }

  // Client handoffs required for the tested public-place journeys.
  const [
    nearbyPage,
    nearbyForm,
    discussion,
    observationForm,
    auditPilotPage,
    auditResultsPage,
  ] = await Promise.all([
    readFile('src/pages/CivicNearbyReport.tsx', 'utf8'),
    readFile('src/components/civic/CivicNearbyReportForm.tsx', 'utf8'),
    readFile('src/components/civic/CivicDiscussion.tsx', 'utf8'),
    readFile('src/components/civic/CivicObservationForm.tsx', 'utf8'),
    readFile('src/pages/CivicAuditPilot.tsx', 'utf8'),
    readFile('src/pages/CivicAuditResults.tsx', 'utf8'),
  ]);

  for (const marker of [
    'nearbyVerifiedPlaces(location.point',
    'None of these — report this location',
    'Search the civic registry',
    'Choose the location manually',
    '<CivicNearbyReportForm',
  ]) {
    assert.ok(
      nearbyPage.includes(marker),
      'Nearby reporting handoff missing: ' + marker
    );
  }

  for (const marker of [
    "entityId: entity?.id ?? ''",
    "locationMode",
    'Confirm this issue',
    'createSeparate',
    'Submitted to BetterMakati. This is not yet an official government case or referral.',
  ]) {
    assert.ok(
      nearbyForm.includes(marker),
      'Nearby report form journey marker missing: ' + marker
    );
  }

  for (const marker of [
    'authority?: string',
    'event.authority || event.destination',
    'Authority acknowledged',
    'Step {lifecycleStep(lifecycle.status)} of 6',
  ]) {
    assert.ok(
      discussion.includes(marker),
      'Civic lifecycle display marker missing: ' + marker
    );
  }

  for (const marker of [
    "fetch('/api/civic-observation'",
    'questionIds?: readonly string[]',
    'Record what you directly observed. Skip anything you did not check.',
  ]) {
    assert.ok(
      observationForm.includes(marker),
      'Observation form journey marker missing: ' + marker
    );
  }

  for (const marker of [
    "'?campaign=' +",
    'civicAuditPilot.id',
    "'#observe'",
    'Record conditions',
  ]) {
    assert.ok(
      auditPilotPage.includes(marker),
      'Pilot audit journey marker missing: ' + marker
    );
  }

  for (const marker of [
    'const targetCount = data?.targetCount ?? civicAuditPilot.targetEntityIds.length',
    "(data?.observedEntities ?? 0) + '/' + targetCount",
    "(data?.completeEntities ?? 0) + '/' + targetCount",
    '{targetCount} frozen target parks',
  ]) {
    assert.ok(
      auditResultsPage.includes(marker),
      'Pilot results target-count marker missing: ' + marker
    );
  }

  console.log(
    'Public-place participation journeys passed: canonical nearby case creation, duplicate confirmation, lifecycle evidence, structured observation storage/readback, and frozen pilot-audit coverage inputs.'
  );
} finally {
  globalThis.fetch = originalFetch;

  if (originalGithubToken === undefined) {
    delete process.env.BETTERMAKATI_GITHUB_TOKEN;
  } else {
    process.env.BETTERMAKATI_GITHUB_TOKEN = originalGithubToken;
  }

  if (originalRepo === undefined) {
    delete process.env.BETTERMAKATI_GITHUB_REPO;
  } else {
    process.env.BETTERMAKATI_GITHUB_REPO = originalRepo;
  }
}
