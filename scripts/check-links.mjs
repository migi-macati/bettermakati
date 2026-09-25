import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const roots = ['src', 'content', 'data'];
const extensions = new Set(['.ts', '.tsx', '.md', '.yaml', '.yml', '.json']);
const files = [];

const walk = async dir => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
};
for (const root of roots) await walk(root);

const ecosystemManifest = JSON.parse(
  await readFile('data/ecosystem-link-watch.json', 'utf8')
);
const ecosystemLinks = Array.isArray(ecosystemManifest.links)
  ? ecosystemManifest.links
  : [];
const criticalUrls = new Set(ecosystemLinks.map(item => item.url));

const urls = new Set(criticalUrls);
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>\])}]+/g)) {
    const cleaned = match[0].replace(/[.,;:]$/, '');
    if (!cleaned.includes('{') && !cleaned.includes('$')) urls.add(cleaned);
  }
}

const list = [...urls];
let failures = 0;
const worker = async url => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'BetterMakati-link-check/1.0' },
    });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'BetterMakati-link-check/1.0' },
      });
    }
    if (response.status >= 400 && response.status !== 403 && response.status !== 429) {
      failures += 1;
      console.error(response.status + ' ' + url);
    }
  } catch (error) {
    const message = 'CHECK FAILED ' + url + ' (' + (error?.name || 'error') + ')';
    if (criticalUrls.has(url)) {
      failures += 1;
      console.error(message);
    } else {
      console.warn(message);
    }
  } finally {
    clearTimeout(timer);
  }
};

for (let i = 0; i < list.length; i += 8) {
  await Promise.all(list.slice(i, i + 8).map(worker));
}
console.log(
  'Checked ' +
    list.length +
    ' external URLs (' +
    criticalUrls.size +
    ' critical ecosystem links); hard failures: ' +
    failures
);
if (failures > 0) process.exit(1);
