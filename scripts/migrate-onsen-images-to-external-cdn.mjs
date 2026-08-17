import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const manifest = readJson('data/onsen-image-manifest.json');
const openverse = readJson('data/openverse-onsen-candidates.json');
const userAgent = 'KantoOnsenPortal/1.0 (licensed-media-migration; contact@example.invalid)';

const flickrUrls = new Map();
for (const record of openverse.records ?? []) {
  for (const candidate of record.candidates ?? []) {
    if (candidate.landingUrl?.includes('flickr.com') && candidate.url?.includes('live.staticflickr.com') && !flickrUrls.has(candidate.landingUrl)) {
      flickrUrls.set(candidate.landingUrl, candidate.url);
    }
  }
}

const commonsAssets = (manifest.assets ?? []).filter((asset) => asset.status === 'approved' && asset.role === 'hero' && asset.sourceUrl.includes('commons.wikimedia.org'));
const pagesByAsset = new Map();
const pagesBySource = new Map();
for (const asset of commonsAssets) {
  const source = new URL(asset.sourceUrl);
  const pageid = source.searchParams.get('curid');
  const filePath = source.pathname.match(/\/wiki\/(File:.+)$/)?.[1];
  if (pageid) pagesByAsset.set(asset.onsenSlug, { pageid });
  else if (filePath) pagesByAsset.set(asset.onsenSlug, { title: decodeURIComponent(filePath) });
  else throw new Error(`Unsupported Commons source URL: ${asset.sourceUrl}`);
}

async function getCommonsUrls(queryKey, values) {
  const result = new Map();
  for (let offset = 0; offset < values.length; offset += 50) {
    const chunk = values.slice(offset, offset + 50);
    const params = new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url', iiurlwidth: '1920', [queryKey]: chunk.join('|') });
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': userAgent } });
    if (!response.ok) throw new Error(`Commons API returned ${response.status} for ${queryKey} batch ${offset / 50 + 1}`);
    const body = await response.json();
    for (const page of Object.values(body.query?.pages ?? {})) {
      const imageInfo = page.imageinfo?.[0];
      if (!imageInfo?.thumburl && !imageInfo?.url) continue;
      const url = imageInfo.thumburl ?? imageInfo.url;
      result.set(String(page.pageid), url);
      result.set(page.title, url);
      result.set(page.title.replace(/ /g, '_'), url);
    }
  }
  return result;
}

const pageIds = [...new Set([...pagesByAsset.values()].flatMap((value) => value.pageid ? [value.pageid] : []))];
const titles = [...new Set([...pagesByAsset.values()].flatMap((value) => value.title ? [value.title] : []))];
const [byPageId, byTitle] = await Promise.all([getCommonsUrls('pageids', pageIds), getCommonsUrls('titles', titles)]);
const failures = [];
let migrated = 0;

for (const asset of manifest.assets ?? []) {
  if (asset.status !== 'approved' || asset.role !== 'hero') continue;
  let deliveryUrl;
  if (asset.sourceUrl.includes('commons.wikimedia.org')) {
    const key = pagesByAsset.get(asset.onsenSlug);
    deliveryUrl = key?.pageid ? byPageId.get(String(key.pageid)) : byTitle.get(key?.title);
  } else if (asset.sourceUrl.includes('flickr.com')) {
    deliveryUrl = flickrUrls.get(asset.sourceUrl);
  }
  if (!deliveryUrl) {
    failures.push({ onsenSlug: asset.onsenSlug, sourceUrl: asset.sourceUrl, error: '外部配信用URLを取得できませんでした。' });
    continue;
  }
  asset.deliveryUrl = deliveryUrl;
  delete asset.localPath;
  asset.note = `${asset.note} 外部配信URLへ移行: ${new URL(deliveryUrl).hostname}。画像バイナリはGitリポジトリに保存しない。`;
  migrated += 1;
}

if (failures.length) {
  writeJson('data/onsen-external-image-migration-failures.json', { generatedAt: new Date().toISOString(), failures });
  throw new Error(`External image migration failed for ${failures.length} assets.`);
}
manifest.lastReviewed = '2026-08-17';
writeJson('data/onsen-image-manifest.json', manifest);
console.log(`Migrated ${migrated} approved hero images to external delivery URLs.`);
