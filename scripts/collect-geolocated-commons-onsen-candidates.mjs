import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-image-manifest.json'), 'utf8'));
const outputPath = path.join(root, 'data/geolocated-commons-onsen-candidates.json');
const requestedSlugs = new Set(process.argv.slice(2));
const direct = new Set((manifest.assets ?? []).filter((asset) => asset.status === 'approved' && asset.role === 'hero').map((asset) => asset.onsenSlug));
const records = site.onsens.filter((onsen) => !direct.has(onsen.slug) && (!requestedSlugs.size || requestedSlugs.has(onsen.slug)));
const UA = 'KantoOnsenPortal/1.0 (licensed-media-discovery; contact@example.invalid)';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const validLicenses = new Set(['CC0', 'Public domain']);
const blockedTitle = /\b(map|logo|flag|diagram|icon|coat of arms|route map|bus|train|station|signboard)\b/i;

async function json(url) {
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function wikiUrl(params) {
  const search = new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params });
  return `https://ja.wikipedia.org/w/api.php?${search}`;
}

function commonsUrl(params) {
  const search = new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params });
  return `https://commons.wikimedia.org/w/api.php?${search}`;
}

function pageMatchesPrefecture(page, prefecture) {
  const categories = (page.categories ?? []).map((category) => category.title ?? '').join(' ');
  const extract = page.extract ?? '';
  return `${categories} ${extract}`.includes(prefecture);
}

async function coordinatesFor(title, prefecture) {
  const props = 'coordinates|categories|extracts';
  const exact = await json(wikiUrl({ action: 'query', prop: props, cllimit: 'max', exintro: '1', explaintext: '1', titles: title }));
  const page = exact.query?.pages?.[0];
  if (page?.coordinates?.[0] && pageMatchesPrefecture(page, prefecture)) {
    return { title: page.title, coordinate: page.coordinates[0], match: 'exact-title' };
  }

  const found = await json(wikiUrl({ action: 'query', list: 'search', srsearch: `${title} ${prefecture}`, srnamespace: '0', srlimit: '8' }));
  const ids = (found.query?.search ?? []).map((item) => item.pageid).join('|');
  if (!ids) return null;
  const searched = await json(wikiUrl({ action: 'query', prop: props, cllimit: 'max', exintro: '1', explaintext: '1', pageids: ids }));
  const withCoordinate = (searched.query?.pages ?? []).find((candidate) => candidate.coordinates?.[0] && pageMatchesPrefecture(candidate, prefecture));
  return withCoordinate?.coordinates?.[0] ? { title: withCoordinate.title, coordinate: withCoordinate.coordinates[0], match: 'search-result' } : null;
}

function metadataValue(metadata, key) {
  const value = metadata?.[key]?.value ?? '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function nearbyImages(coordinate) {
  const location = `${coordinate.lat}|${coordinate.lon}`;
  const nearby = await json(commonsUrl({ action: 'query', list: 'geosearch', gsnamespace: '6', gscoord: location, gsradius: '10000', gslimit: '20' }));
  const files = nearby.query?.geosearch ?? [];
  if (!files.length) return [];
  const titles = files.map((file) => file.title).join('|');
  const details = await json(commonsUrl({ action: 'query', prop: 'imageinfo', titles, iiprop: 'url|size|extmetadata', iiurlwidth: '1600' }));
  const infoByTitle = new Map((details.query?.pages ?? []).map((page) => [page.title, page.imageinfo?.[0]]));
  return files.map((file) => {
    const info = infoByTitle.get(file.title);
    const metadata = info?.extmetadata ?? {};
    const license = metadataValue(metadata, 'LicenseShortName');
    const title = file.title.replace(/^File:/, '');
    return {
      pageId: file.pageid,
      title,
      descriptionUrl: `https://commons.wikimedia.org/?curid=${file.pageid}`,
      originalUrl: info?.url ?? '',
      thumbnailUrl: info?.thumburl ?? '',
      width: info?.width ?? null,
      height: info?.height ?? null,
      license,
      licenseUrl: metadataValue(metadata, 'LicenseUrl'),
      credit: metadataValue(metadata, 'Artist') || 'Wikimedia Commons',
      imageDescription: metadataValue(metadata, 'ImageDescription') || title,
      distanceMeters: file.dist,
      viable: Boolean(info?.url && (validLicenses.has(license) || license.startsWith('CC BY')) && !blockedTitle.test(title)),
    };
  }).filter((candidate) => candidate.viable).sort((a, b) => a.distanceMeters - b.distanceMeters);
}

const output = [];
for (const [index, onsen] of records.entries()) {
  let location = null;
  let candidates = [];
  let error = '';
  try {
    location = await coordinatesFor(onsen.name, onsen.prefecture);
    if (location) candidates = await nearbyImages(location.coordinate);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }
  output.push({
    slug: onsen.slug,
    name: onsen.name,
    prefecture: onsen.prefecture,
    location: location ? { title: location.title, lat: location.coordinate.lat, lon: location.coordinate.lon, match: location.match } : null,
    candidates: candidates.slice(0, 12),
    ...(error ? { error } : {}),
  });
  console.log(`${index + 1}/${records.length}: ${onsen.slug} (${location?.title ?? 'no coordinate'}, ${candidates.length} candidates)`);
  await pause(500);
}
fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, collectedAt: '2026-08-17', source: 'Japanese Wikipedia coordinates + Wikimedia Commons geosearch', records: output }, null, 2)}\n`);
console.log(`Saved ${output.length} coordinate-based candidate sets.`);
