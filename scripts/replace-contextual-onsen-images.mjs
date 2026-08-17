import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const manifest = readJson('data/onsen-image-manifest.json');
const candidates = new Map(readJson('data/contextual-commons-onsen-candidates.json').records.map((record) => [record.slug, record]));
const reviewedAt = '2026-08-17';
const choices = {
  '湯の網温泉': 'Futatsu Island, Kitaibaraki 2012.jpg',
  'hirakata-onsen': '磯原温泉としまや月浜の湯20260725-P1085952.jpg',
  kitaibaraki: 'Futatsu Island, Kitaibaraki 2012.jpg',
};
function extension(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
}
for (const [slug, title] of Object.entries(choices)) {
  const record = candidates.get(slug);
  const candidate = record?.candidates.find((item) => item.title === title);
  if (!record?.location || !candidate?.thumbnailUrl) throw new Error(`${slug}: selected replacement was not found.`);
  const publicPath = `/images/onsens/${slug}/primary${extension(candidate.thumbnailUrl)}`;
  const localPath = path.join(root, 'public', publicPath.replace(/^\//, ''));
  const response = await fetch(candidate.thumbnailUrl, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-sync; contact@example.invalid)' } });
  if (!response.ok) throw new Error(`${slug}: download failed (${response.status}).`);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, Buffer.from(await response.arrayBuffer()));
  const asset = {
    id: `${slug}-hero`, onsenSlug: slug, role: 'hero', status: 'approved',
    subject: `「${candidate.title}」— ${record.context.label}にある周辺景観写真（${record.location.title}の照合地点から約${Math.round(candidate.distanceMeters)}m）`,
    sourceUrl: candidate.descriptionUrl, license: candidate.license, credit: candidate.credit,
    localPath: publicPath, reviewedAt,
    note: `災害映像の静止画を除外し、${record.context.label}の景観または温泉施設を写す再利用可能ライセンス写真へ差し替え。座標照合地点: ${record.location.title}、距離: ${Math.round(candidate.distanceMeters)}m。`,
  };
  const index = manifest.assets.findIndex((item) => item.onsenSlug === slug && item.role === 'hero');
  if (index >= 0) manifest.assets[index] = asset;
  else manifest.assets.push(asset);
  console.log(`Replaced ${slug} with ${candidate.title}`);
}
manifest.lastReviewed = reviewedAt;
writeJson('data/onsen-image-manifest.json', manifest);
