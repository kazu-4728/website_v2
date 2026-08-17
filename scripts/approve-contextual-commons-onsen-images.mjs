import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const manifest = readJson('data/onsen-image-manifest.json');
const candidatesFile = readJson('data/contextual-commons-onsen-candidates.json');
const reviewedAt = '2026-08-17';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const blockedTitle = /\b(map|logo|flag|diagram|icon|coat of arms|route map|signboard)\b/i;

function safeExtension(url) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(extension) ? extension : '.jpg';
}
function clean(value) {
  return value.replace(/\s+/g, ' ').trim() || 'Wikimedia Commons';
}
function chooseCandidate(record) {
  return record.candidates.find((candidate) => !blockedTitle.test(candidate.title)) ?? record.candidates[0];
}
async function download(candidate, destination) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(candidate.thumbnailUrl, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-sync; contact@example.invalid)' } });
    if (response.ok) {
      fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (response.status !== 429 || attempt === 4) throw new Error(`download failed (${response.status})`);
    await pause(2500 * attempt);
  }
}

for (const [index, record] of candidatesFile.records.entries()) {
  const candidate = chooseCandidate(record);
  if (!record.location || !candidate?.thumbnailUrl || !candidate.descriptionUrl || !candidate.license || !candidate.credit) {
    throw new Error(`${record.slug}: incomplete contextual candidate metadata.`);
  }
  if (!['Public domain', 'CC0'].includes(candidate.license) && !candidate.license.startsWith('CC BY')) {
    throw new Error(`${record.slug}: unsupported license ${candidate.license}.`);
  }
  const extension = safeExtension(candidate.thumbnailUrl);
  const publicRelativePath = `/images/onsens/${record.slug}/primary${extension}`;
  const localPath = path.join(root, 'public', publicRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  await download(candidate, localPath);

  const distance = Math.round(candidate.distanceMeters);
  const asset = {
    id: `${record.slug}-hero`,
    onsenSlug: record.slug,
    role: 'hero',
    status: 'approved',
    subject: `「${candidate.title}」— ${record.context.label}にある写真（${record.location.title}の照合地点から約${distance}m）`,
    sourceUrl: candidate.descriptionUrl,
    license: candidate.license,
    credit: clean(candidate.credit),
    localPath: publicRelativePath,
    reviewedAt,
    note: `温泉施設そのものではない場合があるため、${record.context.label}の周辺写真として明示して掲載。日本語Wikipediaで${record.prefecture}内の${record.location.title}を座標照合し、Wikimedia Commonsで距離${distance}mの再利用可能ライセンス写真を確認した。`,
  };
  const existingIndex = manifest.assets.findIndex((item) => item.onsenSlug === record.slug && item.role === 'hero');
  if (existingIndex >= 0) manifest.assets[existingIndex] = asset;
  else manifest.assets.push(asset);
  manifest.lastReviewed = reviewedAt;
  writeJson('data/onsen-image-manifest.json', manifest);
  console.log(`${index + 1}/${candidatesFile.records.length}: ${record.slug} ← ${candidate.title} (${distance}m)`);
  await pause(900);
}
console.log(`Approved ${candidatesFile.records.length} contextual Commons images.`);
