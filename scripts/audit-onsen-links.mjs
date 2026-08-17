import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const outputPath = path.join(root, 'data/onsen-link-audit.json');
const CONCURRENCY = 8;
const TIMEOUT_MS = 12_000;

const references = [];
for (const onsen of data.onsens) {
  references.push({ slug: onsen.slug, name: onsen.name, field: 'officialUrl', url: onsen.officialUrl });
  for (const facility of onsen.facilities ?? []) references.push({ slug: onsen.slug, name: onsen.name, field: `facility:${facility.name}`, url: facility.url });
  if (onsen.dayTrip?.officialInfoUrl) references.push({ slug: onsen.slug, name: onsen.name, field: 'dayTrip:officialInfoUrl', url: onsen.dayTrip.officialInfoUrl });
}

const urlMap = new Map();
for (const reference of references) {
  if (!reference.url?.startsWith('http://') && !reference.url?.startsWith('https://')) continue;
  const entries = urlMap.get(reference.url) ?? [];
  entries.push(reference);
  urlMap.set(reference.url, entries);
}

async function checkUrl(url) {
  const headers = { 'User-Agent': 'KantoOnsenPortal/1.0 (link-integrity-audit)', Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8' };
  const request = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(url, { method, redirect: 'follow', headers, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    let response = await request('HEAD');
    if ([405, 501].includes(response.status)) response = await request('GET');
    const status = response.status;
    const finalUrl = response.url;
    const classification = status >= 200 && status < 400 ? 'reachable' : [401, 403, 429].includes(status) ? 'restricted' : status === 404 || status === 410 ? 'broken' : status >= 500 ? 'server-error' : 'unknown';
    return { url, status, finalUrl, classification };
  } catch (error) {
    return { url, status: null, finalUrl: null, classification: 'network-error', error: error.name === 'AbortError' ? 'timeout' : String(error.message ?? error) };
  }
}

const urls = [...urlMap.keys()];
const outcomes = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const index = cursor++;
    const outcome = await checkUrl(urls[index]);
    outcomes[index] = { ...outcome, references: urlMap.get(urls[index]) };
    if ((index + 1) % 25 === 0) console.log(`Checked ${index + 1}/${urls.length} unique URLs.`);
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
const counts = outcomes.reduce((accumulator, item) => {
  accumulator[item.classification] = (accumulator[item.classification] ?? 0) + 1;
  return accumulator;
}, {});
fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, checkedAt: '2026-08-17', uniqueUrlCount: urls.length, counts, outcomes }, null, 2)}\n`);
console.log(JSON.stringify({ uniqueUrlCount: urls.length, counts }, null, 2));
if ((counts.broken ?? 0) > 0) process.exitCode = 2;
