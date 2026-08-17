import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const reviewedAt = '2026-08-17';

const defaultSelected = [
  'hakone-yumoto',
  'hakone-gora',
  'kusatsu',
  'ikaho',
  'shima',
  'kinugawa',
  'nikko-yumoto',
  'shiobara',
  'jindaiji-yumorinosato',
  'toshimaen-niwanoyu',
  'heiwajima-onsen',
];
const requestedSlugs = process.argv.slice(2);
const selected = requestedSlugs.length ? requestedSlugs : defaultSelected;

const candidatesBySlug = new Map(readJson('data/wikimedia-image-candidates.json').records.map((record) => [record.slug, record]));
const manifest = readJson('data/onsen-image-manifest.json');
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function safeExtension(originalUrl) {
  const pathname = new URL(originalUrl).pathname;
  const extension = path.extname(pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(extension) ? extension : '.jpg';
}

function cleanCredit(credit) {
  return credit.replace(/\s+/g, ' ').trim() || 'Wikimedia Commons';
}

for (const slug of selected) {
  const record = candidatesBySlug.get(slug);
  const candidate = record?.candidates?.[0];
  if (!candidate?.originalUrl || !candidate?.descriptionUrl || !candidate?.license) {
    throw new Error(`${slug}: no usable Wikimedia Commons candidate was found.`);
  }
  if (!['Public domain', 'CC0'].includes(candidate.license) && !candidate.license.startsWith('CC BY')) {
    throw new Error(`${slug}: unsupported reuse license ${candidate.license}.`);
  }

  const extension = safeExtension(candidate.originalUrl);
  const publicRelativePath = `/images/onsens/${slug}/primary${extension}`;
  const localPath = path.join(root, 'public', publicRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });

  const existingAsset = manifest.assets.find((item) => item.onsenSlug === slug && item.role === 'hero' && item.status === 'approved');
  const hasCurrentLocalAsset = fs.existsSync(localPath) || (existingAsset?.localPath === publicRelativePath && fs.existsSync(localPath));
  if (!hasCurrentLocalAsset) {
    let response;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      response = await fetch(candidate.originalUrl, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-sync)' } });
      if (response.ok) break;
      if (response.status !== 429 || attempt === 3) throw new Error(`${slug}: failed to download image (${response.status}).`);
      await delay(2000 * attempt);
    }
    fs.writeFileSync(localPath, Buffer.from(await response.arrayBuffer()));
    await delay(1000);
  }

  const asset = {
    id: `${slug}-hero`,
    onsenSlug: slug,
    role: 'hero',
    status: 'approved',
    subject: candidate.imageDescription || `${record.name}の景観`,
    sourceUrl: candidate.descriptionUrl,
    license: candidate.license,
    credit: cleanCredit(candidate.credit),
    localPath: publicRelativePath,
    reviewedAt,
    note: `Wikimedia Commonsの説明文とライセンスを確認して採用。元ファイル: ${candidate.title}`,
  };
  const existingIndex = manifest.assets.findIndex((item) => item.onsenSlug === slug && item.role === 'hero');
  if (existingIndex >= 0) manifest.assets[existingIndex] = asset;
  else manifest.assets.push(asset);
  manifest.lastReviewed = reviewedAt;
  writeJson('data/onsen-image-manifest.json', manifest);
  console.log(`Approved and saved ${slug}: ${candidate.title}`);
}

manifest.lastReviewed = reviewedAt;
writeJson('data/onsen-image-manifest.json', manifest);
console.log(`Approved ${selected.length} Commons images.`);
