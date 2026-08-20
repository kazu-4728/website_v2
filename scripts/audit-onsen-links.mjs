import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const outputPath = path.join(root, 'data/onsen-link-audit.json');
const checkedAt = new Date().toISOString();
const concurrency = 2;
const delayMs = 350;
const timeoutMs = 35_000;

const referencesByUrl = new Map();
function register(url, reference) {
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
    throw new Error(`${reference.slug}: HTTP or HTTPS URL is required for ${reference.field}`);
  }
  const entries = referencesByUrl.get(url) ?? [];
  entries.push({ ...reference, url });
  referencesByUrl.set(url, entries);
}

for (const onsen of site.onsens) {
  register(onsen.officialUrl, { slug: onsen.slug, name: onsen.name, field: 'officialUrl' });
  register(onsen.mapUrl, { slug: onsen.slug, name: onsen.name, field: 'mapUrl' });
  for (const facility of onsen.facilities ?? []) {
    register(facility.url, { slug: onsen.slug, name: onsen.name, field: `facility:${facility.name}:guide` });
    register(facility.mapUrl, { slug: onsen.slug, name: onsen.name, field: `facility:${facility.name}:map` });
  }
  if (onsen.dayTrip?.officialInfoUrl) {
    register(onsen.dayTrip.officialInfoUrl, { slug: onsen.slug, name: onsen.name, field: 'dayTrip:officialInfoUrl' });
  }
}

const urls = [...referencesByUrl.keys()].sort();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function inspect(url) {
  if (url.startsWith('https://www.google.com/maps/search/?api=1&query=')) {
    return { url, status: null, finalUrl: url, classification: 'generated-map', checkedAt };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KantoOnsenPortalLinkAudit/1.0; +https://kazu-4728.github.io/website_v2/)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    await response.body?.cancel();
    const classification = response.status >= 200 && response.status < 400
      ? 'reachable'
      : response.status === 401 || response.status === 403 || response.status === 429
        ? 'restricted'
        : response.status === 404 || response.status === 410
          ? 'broken'
          : response.status >= 500
            ? 'server-error'
            : 'unknown';
    return { url, status: response.status, finalUrl: response.url, classification, checkedAt };
  } catch (error) {
    return {
      url,
      status: null,
      finalUrl: null,
      classification: 'network-error',
      error: error instanceof Error ? error.message : String(error),
      checkedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

const outcomes = [];
for (let offset = 0; offset < urls.length; offset += concurrency) {
  const batch = urls.slice(offset, offset + concurrency);
  outcomes.push(...await Promise.all(batch.map(inspect)));
  if (offset + concurrency < urls.length) await sleep(delayMs);
}

for (const outcome of outcomes) outcome.references = referencesByUrl.get(outcome.url);
const counts = outcomes.reduce((result, outcome) => {
  result[outcome.classification] = (result[outcome.classification] ?? 0) + 1;
  return result;
}, {});

fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 2, checkedAt, uniqueUrlCount: urls.length, counts, outcomes }, null, 2)}\n`);
console.log(`Audited ${urls.length} URLs: ${JSON.stringify(counts)}`);
if ((counts.broken ?? 0) > 0 || (counts['server-error'] ?? 0) > 0 || (counts['network-error'] ?? 0) > 0) process.exitCode = 2;
