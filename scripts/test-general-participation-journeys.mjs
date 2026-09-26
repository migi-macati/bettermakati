import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import handler from '../api/feedback.js';

const originalFetch = globalThis.fetch;
const originalToken = process.env.BETTERMAKATI_GITHUB_TOKEN;
const originalRepo = process.env.BETTERMAKATI_GITHUB_REPO;

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

let ipCounter = 60;
const requestFor = body => {
  ipCounter += 1;
  const address = '203.0.113.' + ipCounter;
  return {
    method: 'POST',
    body,
    headers: { 'x-forwarded-for': address },
    socket: { remoteAddress: address },
  };
};

const payload = {
  type: 'source',
  tool: 'accountability-ledger',
  subject: 'Poblacion public record',
  details: 'Please add this source to the local public-record coverage.',
  sourceUrl: 'https://www.makati.gov.ph/example-record',
  barangay: 'Poblacion',
  website: '',
};

const expectedIssueTitle = '[Source] Poblacion public record';
const expectedIssueBody = [
  '_Submitted through the BetterMakati website._',
  '**Community tool:** accountability-ledger',
  '**Barangay / area:** Poblacion',
  '**Source / URL:** https://www.makati.gov.ph/example-record',
  'Please add this source to the local public-record coverage.',
].join('\n');

try {
  process.env.BETTERMAKATI_GITHUB_TOKEN = 'test-token';
  process.env.BETTERMAKATI_GITHUB_REPO = 'migi-macati/bettermakati';

  // Native submission: preserve barangay context and return a tracking URL.
  let createdIssue = null;
  {
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), method: options.method || 'GET' });

      if (!options.method || options.method === 'GET') {
        return {
          ok: true,
          status: 200,
          async json() {
            return [];
          },
        };
      }

      createdIssue = JSON.parse(options.body);
      return {
        ok: true,
        status: 201,
        async json() {
          return {
            number: 901,
            html_url: 'https://github.com/migi-macati/bettermakati/issues/901',
          };
        },
      };
    };

    const res = responseMock();
    await handler(requestFor(payload), res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body?.ok, true);
    assert.equal(res.body?.reference, 901);
    assert.equal(
      res.body?.url,
      'https://github.com/migi-macati/bettermakati/issues/901'
    );
    assert.deepEqual(calls.map(call => call.method), ['GET', 'POST']);
    assert.equal(createdIssue?.title, expectedIssueTitle);
    assert.equal(createdIssue?.body, expectedIssueBody);
  }

  // Duplicate journey: an exact open item is reused and no second POST occurs.
  {
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), method: options.method || 'GET' });
      return {
        ok: true,
        status: 200,
        async json() {
          return [
            {
              number: 901,
              state: 'open',
              title: expectedIssueTitle,
              html_url:
                'https://github.com/migi-macati/bettermakati/issues/901',
              body: expectedIssueBody,
            },
          ];
        },
      };
    };

    const res = responseMock();
    await handler(requestFor(payload), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.ok, true);
    assert.equal(res.body?.duplicate, true);
    assert.equal(res.body?.reference, 901);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, 'GET');
  }

  // Fallback journey: missing native storage returns a prefilled GitHub issue
  // without losing barangay/tool/source context.
  let fallbackIssue = null;
  {
    delete process.env.BETTERMAKATI_GITHUB_TOKEN;
    globalThis.fetch = async () => {
      throw new Error('Fallback must not call GitHub API without a token');
    };

    const res = responseMock();
    await handler(requestFor(payload), res);

    assert.equal(res.statusCode, 503);
    assert.equal(
      res.body?.error,
      'Native submission storage is not configured yet.'
    );
    assert.ok(res.body?.fallbackUrl);

    const fallbackUrl = new URL(res.body.fallbackUrl);
    assert.equal(fallbackUrl.hostname, 'github.com');
    assert.equal(
      fallbackUrl.pathname,
      '/migi-macati/bettermakati/issues/new'
    );
    assert.equal(fallbackUrl.searchParams.get('title'), expectedIssueTitle);
    assert.equal(fallbackUrl.searchParams.get('body'), expectedIssueBody);

    fallbackIssue = {
      number: 902,
      state: 'open',
      title: fallbackUrl.searchParams.get('title'),
      html_url:
        'https://github.com/migi-macati/bettermakati/issues/902',
      body: fallbackUrl.searchParams.get('body'),
    };
  }

  // A fallback-created public issue must also be recognizable as a duplicate
  // if native submission later becomes available.
  {
    process.env.BETTERMAKATI_GITHUB_TOKEN = 'test-token';
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), method: options.method || 'GET' });
      return {
        ok: true,
        status: 200,
        async json() {
          return [fallbackIssue];
        },
      };
    };

    const res = responseMock();
    await handler(requestFor(payload), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.duplicate, true);
    assert.equal(res.body?.reference, 902);
    assert.equal(calls.length, 1);
  }

  // UI handoff: barangay slug -> canonical name -> API payload -> public links.
  const getInvolvedSource = await readFile('src/pages/GetInvolved.tsx', 'utf8');
  const barangayProfileSource = await readFile(
    'src/pages/BarangayProfile.tsx',
    'utf8'
  );

  for (const marker of [
    "findBarangay(searchParams.get('barangay') || undefined)?.name || ''",
    'body: JSON.stringify({',
    'barangay,',
    "setTrackingUrl(data.url || '')",
    'Track this publicly',
    'Open existing item',
    'Continue on GitHub',
    'Your text is still here',
  ]) {
    assert.ok(
      getInvolvedSource.includes(marker),
      'Get Involved journey marker missing: ' + marker
    );
  }

  assert.ok(
    barangayProfileSource.includes(
      "'/get-involved?type=source&barangay=' + encodeURIComponent(barangay.slug) + '#submission'"
    ),
    'Barangay profile no longer carries barangay slug into Get Involved.'
  );

  console.log(
    'General participation journeys passed: native submission, barangay context, tracking, duplicate reuse, fallback handoff, and fallback/native duplicate continuity.'
  );
} finally {
  globalThis.fetch = originalFetch;

  if (originalToken === undefined) {
    delete process.env.BETTERMAKATI_GITHUB_TOKEN;
  } else {
    process.env.BETTERMAKATI_GITHUB_TOKEN = originalToken;
  }

  if (originalRepo === undefined) {
    delete process.env.BETTERMAKATI_GITHUB_REPO;
  } else {
    process.env.BETTERMAKATI_GITHUB_REPO = originalRepo;
  }
}
