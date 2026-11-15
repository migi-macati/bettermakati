import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const workerSource = readFileSync(
  new URL('../public/sw.js', import.meta.url),
  'utf8'
);

function createWorker() {
  const handlers = new Map();
  const stores = new Map();
  const networkRequests = [];
  let offline = false;

  const fetch = async request => {
    if (offline) throw new Error('Network unavailable');
    const rawUrl = typeof request === 'string' ? request : request.url;
    const path = new URL(rawUrl, 'https://bettermakati.org').pathname;
    networkRequests.push(path);
    return { ok: true, path, clone() { return this; } };
  };

  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async add(path) {
          store.set(path, await fetch(path));
        },
        async put(request, response) {
          store.set(typeof request === 'string' ? request : request.url, response);
        },
      };
    },
    async match(path) {
      for (const store of stores.values()) {
        if (store.has(path)) return store.get(path);
      }
      return undefined;
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
  };
  const self = {
    location: { origin: 'https://bettermakati.org' },
    clients: { claim() {} },
    skipWaiting() {},
    addEventListener(type, callback) {
      handlers.set(type, callback);
    },
  };
  runInNewContext(workerSource, { caches, fetch, Promise, self, URL });

  return {
    networkRequests,
    setOffline(value) {
      offline = value;
    },
    async install() {
      const tasks = [];
      handlers.get('install')({ waitUntil(promise) { tasks.push(promise); } });
      await Promise.all(tasks);
    },
    async request(path, destination = 'document') {
      let response;
      const request = {
        method: 'GET',
        mode: destination === 'document' ? 'navigate' : 'cors',
        destination,
        url: 'https://bettermakati.org' + path,
      };
      handlers.get('fetch')({
        request,
        respondWith(promise) { response = promise; },
      });
      return response;
    },
  };
}

test('installation precaches one SPA shell and the offline fallback only', async () => {
  const worker = createWorker();
  await worker.install();
  assert.deepEqual(worker.networkRequests, ['/', '/offline.html']);
});

test('offline deep links reuse the cached SPA shell without a new request', async () => {
  const worker = createWorker();
  await worker.install();
  worker.setOffline(true);
  assert.equal((await worker.request('/barangays/poblacion')).path, '/');
  assert.equal((await worker.request('/city-monitor')).path, '/');
  assert.deepEqual(worker.networkRequests, ['/', '/offline.html']);
});

test('online navigations remain network-first and static assets are cached', async () => {
  const worker = createWorker();
  await worker.install();
  assert.equal((await worker.request('/today')).path, '/today');
  await worker.request('/assets/app.js', 'script');
  await worker.request('/assets/app.js', 'script');
  assert.deepEqual(worker.networkRequests, [
    '/',
    '/offline.html',
    '/today',
    '/assets/app.js',
  ]);
});
