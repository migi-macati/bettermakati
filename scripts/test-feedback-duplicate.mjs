import assert from 'node:assert/strict';
import handler from '../api/feedback.js';

const originalFetch = globalThis.fetch;
const originalToken = process.env.BETTERMAKATI_GITHUB_TOKEN;
const originalRepo = process.env.BETTERMAKATI_GITHUB_REPO;

process.env.BETTERMAKATI_GITHUB_TOKEN = 'test-token';
process.env.BETTERMAKATI_GITHUB_REPO = 'migi-macati/bettermakati';

const responseMock = () => {
  const result = {
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
  };
  return result;
};

const requestFor = body => ({
  method: 'POST',
  body,
  headers: { 'x-forwarded-for': '203.0.113.42' },
  socket: { remoteAddress: '203.0.113.42' },
});

const duplicatePayload = {
  type: 'correction',
  subject: 'Incorrect City Hall telephone number',
  details: 'The listed trunkline is outdated. The official city page now shows a different number.',
  sourceUrl: 'https://www.makati.gov.ph/contact',
  barangay: 'Bel-Air',
  tool: '',
  website: '',
};

const matchingIssue = {
  number: 321,
  state: 'open',
  title: '[Correction] Incorrect City Hall telephone number',
  html_url: 'https://github.com/migi-macati/bettermakati/issues/321',
  body: [
    '_Submitted through the BetterMakati website._',
    '',
    '**Barangay / area:** Bel-Air',
    '**Source / URL:** https://www.makati.gov.ph/contact',
    '',
    'The listed trunkline is outdated. The official city page now shows a different number.',
  ].join('\n'),
};

try {
  {
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), method: options.method || 'GET' });
      return {
        ok: true,
        status: 200,
        async json() {
          return [matchingIssue];
        },
      };
    };

    const res = responseMock();
    await handler(requestFor(duplicatePayload), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body?.ok, true);
    assert.equal(res.body?.duplicate, true);
    assert.equal(res.body?.reference, 321);
    assert.equal(
      res.body?.url,
      'https://github.com/migi-macati/bettermakati/issues/321'
    );
    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, 'GET');
  }

  {
    const calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), method: options.method || 'GET' });
      if (!options.method || options.method === 'GET') {
        return {
          ok: true,
          status: 200,
          async json() {
            return [
              {
                ...matchingIssue,
                body: matchingIssue.body.replace(
                  'https://www.makati.gov.ph/contact',
                  'https://www.makati.gov.ph/another-page'
                ),
              },
            ];
          },
        };
      }

      return {
        ok: true,
        status: 201,
        async json() {
          return {
            number: 322,
            html_url: 'https://github.com/migi-macati/bettermakati/issues/322',
          };
        },
      };
    };

    const res = responseMock();
    await handler(requestFor(duplicatePayload), res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body?.ok, true);
    assert.equal(res.body?.duplicate, undefined);
    assert.equal(res.body?.reference, 322);
    assert.deepEqual(
      calls.map(call => call.method),
      ['GET', 'POST']
    );
  }

  console.log(
    'Feedback duplicate regression passed: strong open matches are reused; near-matches still create a new issue.'
  );
} finally {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.BETTERMAKATI_GITHUB_TOKEN;
  else process.env.BETTERMAKATI_GITHUB_TOKEN = originalToken;
  if (originalRepo === undefined) delete process.env.BETTERMAKATI_GITHUB_REPO;
  else process.env.BETTERMAKATI_GITHUB_REPO = originalRepo;
}
