import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const contexts = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-nearby-contexts.json'), 'utf8')).contexts;
const outputPath = path.join(root, 'data/contextual-commons-onsen-candidates.json');
const requestedSlugs = new Set(process.argv.slice(2));
const records = site.onsens.filter((onsen) => contexts[onsen.slug] && (!requestedSlugs.size || requestedSlugs.has(onsen.slug)));
const UA = 'KantoOnsenPortal/1.0 (licensed-media-discovery; contact@example.invalid)';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function json(url) {
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}
function wikiUrl(params) {
  return `https://ja.wikipedia.org/w/api.php?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`;
}
function commonsUrl(params) {
  return `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`;
}
function pageMatchesPrefecture(page, prefecture) {
  const categories = (page.categories ?? []).map((category) => category.title ?? '').join(' ');
  return `${categories} ${page.extract ?? ''}`.includes(prefecture);
}
async function coordinateFor(place, prefecture) {
  const initial = await json(wikiUrl({ action: 'query', prop: 'coordinates|categories|extracts', cllimit: 'max', exintro: '1', explaintext: '1', titles: place }));
  const direct = initial.query?.pages?.[0];
  if (direct?.coordinates?.[0] && pageMatchesPrefecture(direct, prefecture)) return { title: direct.title, coordinate: direct.coordinates[0] };
  const found = await json(wikiUrl({ action: 'query', list: 'search', srsearch: `${place} ${prefecture}`, srnamespace: '0', srlimit: '8' }));
  const ids = (found.query?.search ?? []).map((item) => item.pageid).join('|');
  if (!ids) return null;
  const searched = await json(wikiUrl({ action: 'query', prop: 'coordinates|categories|extracts', cllimit: 'max', exintro: '1', explaintext: '1', pageids: ids }));
  const page = (searched.query?.pages ?? []).find((item) => item.coordinates?.[0] && pageMatchesPrefecture(item, prefecture));
  return page?.coordinates?.[0] ? { title: page.title, coordinate: page.coordinates[0] } : null;
}
function value(metadata, key) {
  return (metadata?.[key]?.value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
async function imagesNear(coordinate) {
  const nearby = await json(commonsUrl({ action: 'query', list: 'geosearch', gsnamespace: '6', gscoord: `${coordinate.lat}|${coordinate.lon}`, gsradius: '10000', gslimit: '20' }));
  const files = nearby.query?.geosearch ?? [];
  if (!files.length) return [];
  const details = await json(commonsUrl({ action: 'query', prop: 'imageinfo', titles: files.map((file) => file.title).join('|'), iiprop: 'url|size|extmetadata', iiurlwidth: '1600' }));
  const lookup = new Map((details.query?.pages ?? []).map((page) => [page.title, page.imageinfo?.[0]]));
  return files.map((file) => {
    const info = lookup.get(file.title);
    const metadata = info?.extmetadata ?? {};
    const license = value(metadata, 'LicenseShortName');
    const title = file.title.replace(/^File:/, '');
    const viable = Boolean(info?.thumburl && (license === 'Public domain' || license === 'CC0' || license.startsWith('CC BY')));
    return { title, descriptionUrl: `https://commons.wikimedia.org/?curid=${file.pageid}`, thumbnailUrl: info?.thumburl ?? '', license, credit: value(metadata, 'Artist') || 'Wikimedia Commons', distanceMeters: file.dist, viable };
  }).filter((candidate) => candidate.viable).sort((left, right) => left.distanceMeters - right.distanceMeters).slice(0, 12);
}

const output = [];
for (const [index, onsen] of records.entries()) {
  const context = contexts[onsen.slug];
  let location = null;
  let candidates = [];
  let error = '';
  try {
    location = await coordinateFor(context.place, onsen.prefecture);
    if (location) candidates = await imagesNear(location.coordinate);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }
  output.push({ slug: onsen.slug, name: onsen.name, prefecture: onsen.prefecture, context, location, candidates, ...(error ? { error } : {}) });
  console.log(`${index + 1}/${records.length}: ${onsen.slug} (${location?.title ?? 'no coordinate'}, ${candidates.length} candidates)`);
  await pause(600);
}
fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, collectedAt: '2026-08-17', source: 'curated nearby-context ledger + Japanese Wikipedia coordinates + Wikimedia Commons geosearch', records: output }, null, 2)}\n`);
console.log(`Saved ${output.length} contextual candidate sets.`);
