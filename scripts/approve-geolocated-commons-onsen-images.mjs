import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const manifest = readJson('data/onsen-image-manifest.json');
const collected = readJson('data/geolocated-commons-onsen-candidates.json');
const requestedSlugs = new Set(process.argv.slice(2));
const reviewedAt = '2026-08-17';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function normalized(value) {
  return value.normalize('NFKC').replace(/[\s　・ー\-–—()（）]/g, '').replace(/(天然|日帰り|温泉郷|温泉|スパ|spa|the|of|の|と|や|処|館|湯|施設|店)/gi, '');
}

function isLocationRelated(record) {
  if (!record.location) return false;
  if (record.location.match === 'exact-title') return true;
  const onsen = normalized(record.name);
  const location = normalized(record.location.title);
  if (onsen.length < 2 || location.length < 2) return false;
  for (let length = Math.min(onsen.length, 6); length >= 2; length -= 1) {
    for (let start = 0; start + length <= onsen.length; start += 1) {
      if (location.includes(onsen.slice(start, start + length))) return true;
    }
  }
  return false;
}

function safeExtension(url) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(extension) ? extension : '.jpg';
}

function clean(value) {
  return value.replace(/\s+/g, ' ').trim() || 'Wikimedia Commons';
}

function subjectFor(record, candidate) {
  const distance = Math.round(candidate.distanceMeters);
  return `「${candidate.title}」— ${record.location.title}の座標から約${distance}mにある周辺写真（温泉施設そのものではない場合があります）`;
}

const eligible = collected.records.filter((record) => isLocationRelated(record) && record.candidates?.length && (!requestedSlugs.size || requestedSlugs.has(record.slug)));
if (!eligible.length) throw new Error('No prefecture-verified, geographically-related candidates were selected.');

for (const [index, record] of eligible.entries()) {
  const candidate = record.candidates[0];
  if (!candidate.thumbnailUrl || !candidate.descriptionUrl || !candidate.license || !candidate.credit) {
    throw new Error(`${record.slug}: candidate is missing reuse metadata.`);
  }
  if (!['Public domain', 'CC0'].includes(candidate.license) && !candidate.license.startsWith('CC BY')) {
    throw new Error(`${record.slug}: unsupported license ${candidate.license}.`);
  }
  const extension = safeExtension(candidate.thumbnailUrl);
  const publicRelativePath = `/images/onsens/${record.slug}/primary${extension}`;
  const localPath = path.join(root, 'public', publicRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });

  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(candidate.thumbnailUrl, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-sync; contact@example.invalid)' } });
    if (response.ok) break;
    if (response.status !== 429 || attempt === 4) throw new Error(`${record.slug}: thumbnail download failed (${response.status}).`);
    await pause(2500 * attempt);
  }
  fs.writeFileSync(localPath, Buffer.from(await response.arrayBuffer()));

  const asset = {
    id: `${record.slug}-hero`,
    onsenSlug: record.slug,
    role: 'hero',
    status: 'approved',
    subject: subjectFor(record, candidate),
    sourceUrl: candidate.descriptionUrl,
    license: candidate.license,
    credit: clean(candidate.credit),
    localPath: publicRelativePath,
    reviewedAt,
    note: `Wikimedia Commonsの再利用可能ライセンスを確認。${record.location.title}（${record.prefecture}）の座標近傍${Math.round(candidate.distanceMeters)}mで撮影された「${candidate.title}」を周辺写真として掲載する。`,
  };
  const existingIndex = manifest.assets.findIndex((assetItem) => assetItem.onsenSlug === record.slug && assetItem.role === 'hero');
  if (existingIndex >= 0) manifest.assets[existingIndex] = asset;
  else manifest.assets.push(asset);
  manifest.lastReviewed = reviewedAt;
  writeJson('data/onsen-image-manifest.json', manifest);
  console.log(`${index + 1}/${eligible.length}: ${record.slug} ← ${candidate.title} (${Math.round(candidate.distanceMeters)}m)`);
  await pause(900);
}
manifest.lastReviewed = reviewedAt;
writeJson('data/onsen-image-manifest.json', manifest);
console.log(`Approved ${eligible.length} individual or explicitly-nearby Commons images.`);
