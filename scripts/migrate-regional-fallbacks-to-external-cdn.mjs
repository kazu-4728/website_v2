import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'data/onsen-image-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const fallbacks = (manifest.areaFallbacks ?? []).filter((asset) => asset.status === 'approved' && asset.role === 'hero');
const titles = fallbacks.map((asset) => {
  const match = new URL(asset.sourceUrl).pathname.match(/\/wiki\/(File:.+)$/);
  if (!match) throw new Error(`Unsupported Commons URL: ${asset.sourceUrl}`);
  return decodeURIComponent(match[1]);
});
const params = new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url', iiurlwidth: '1920', titles: [...new Set(titles)].join('|') });
const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-migration; contact@example.invalid)' } });
if (!response.ok) throw new Error(`Commons API returned ${response.status}`);
const body = await response.json();
const urls = new Map();
for (const page of Object.values(body.query?.pages ?? {})) {
  const imageInfo = page.imageinfo?.[0];
  if (!imageInfo?.thumburl && !imageInfo?.url) continue;
  const url = imageInfo.thumburl ?? imageInfo.url;
  urls.set(page.title, url);
  urls.set(page.title.replace(/ /g, '_'), url);
}
for (const asset of fallbacks) {
  const title = decodeURIComponent(new URL(asset.sourceUrl).pathname.match(/\/wiki\/(File:.+)$/)[1]);
  const deliveryUrl = urls.get(title);
  if (!deliveryUrl) throw new Error(`No delivery URL returned for ${asset.id}`);
  asset.deliveryUrl = deliveryUrl;
  delete asset.localPath;
  asset.note = `${asset.note} 外部配信URLへ移行: ${new URL(deliveryUrl).hostname}。画像バイナリはGitリポジトリに保存しない。`;
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Migrated ${fallbacks.length} regional fallback images to external delivery URLs.`);
