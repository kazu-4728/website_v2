import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-image-manifest.json'), 'utf8'));
const outputPath = path.join(root, 'data/openverse-onsen-candidates.json');
const requestedSlugs = process.argv.slice(2);
const areaById = new Map(site.areas.map((area) => [area.id, area]));
const directSlugs = new Set((manifest.assets ?? []).filter((asset) => asset.status === 'approved' && asset.role === 'hero').map((asset) => asset.onsenSlug));
const records = site.onsens.filter((onsen) => !directSlugs.has(onsen.slug) && (!requestedSlugs.length || requestedSlugs.includes(onsen.slug)));
const API = 'https://api.openverse.org/v1/images/';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function toCandidate(item, query, contextual) {
  return {
    query,
    contextual,
    id: item.id,
    title: item.title ?? '',
    creator: item.creator ?? '',
    creatorUrl: item.creator_url ?? '',
    license: item.license ?? '',
    licenseVersion: item.license_version ?? '',
    licenseUrl: item.license_url ?? '',
    source: item.source ?? '',
    landingUrl: item.foreign_landing_url ?? '',
    thumbnail: item.thumbnail ?? '',
    url: item.url ?? '',
    width: item.width ?? null,
    height: item.height ?? null,
    tags: (item.tags ?? []).map((tag) => tag.name).filter(Boolean),
  };
}

async function search(query, contextual) {
  const params = new URLSearchParams({ q: query, license_type: 'commercial', extension: 'jpg,jpeg,png', filter_dead: 'true', mature: 'false', page_size: '3' });
  const response = await fetch(`${API}?${params}`, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-discovery)' } });
  if (!response.ok) throw new Error(`Openverse ${response.status}`);
  const payload = await response.json();
  return (payload.results ?? []).map((item) => toCandidate(item, query, contextual));
}

const results = [];
for (const [index, onsen] of records.entries()) {
  const area = areaById.get(onsen.areaId);
  const queries = [
    { query: `${onsen.name} ${onsen.prefecture}`, contextual: false },
    { query: `${onsen.name} 温泉`, contextual: false },
    { query: `${area?.name ?? onsen.prefecture} ${onsen.prefecture} landscape`, contextual: true },
  ];
  const candidates = [];
  let error = '';
  for (const item of queries) {
    try {
      const found = await search(item.query, item.contextual);
      candidates.push(...found);
      if (found.length && !item.contextual) break;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }
    await pause(500);
  }
  const unique = [...new Map(candidates.filter((candidate) => candidate.url && candidate.licenseUrl && candidate.landingUrl).map((candidate) => [candidate.id, candidate])).values()];
  results.push({ slug: onsen.slug, name: onsen.name, prefecture: onsen.prefecture, areaId: onsen.areaId, candidates: unique, ...(error ? { error } : {}) });
  console.log(`${index + 1}/${records.length}: ${onsen.slug} (${unique.length} candidates)`);
  await pause(750);
}
fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, collectedAt: '2026-08-17', source: API, records: results }, null, 2)}\n`);
const withCandidates = results.filter((item) => item.candidates.length).length;
console.log(`Collected Openverse candidates for ${records.length} records; ${withCandidates} have candidates.`);
