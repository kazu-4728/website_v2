import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'data/onsen-image-manifest.json');
const regionalPath = path.join(root, 'data/regional-wikimedia-candidates.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const regional = JSON.parse(fs.readFileSync(regionalPath, 'utf8'));
const reviewedAt = '2026-08-17';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const selected = [
  { areaId: 'chiba-boso', candidateIndex: 0, label: '鋸山・房総の景観', subject: '房総・九十九里エリアにある鋸山周辺の景観' },
  { areaId: 'saitama-west', candidateIndex: 3, label: '秩父の景観', subject: '秩父・羊山公園から望む秩父市街の景観' },
  { areaId: 'ibaraki-onsen', candidateIndex: 0, label: '五浦海岸の景観', subject: '茨城・奥久慈エリアにある五浦海岸の景観' },
  { areaId: 'tokyo-islands', candidateIndex: 3, label: '奥多摩の景観', subject: '東京・奥多摩エリアの景観' },
  { areaId: 'gunma-minakami', candidateIndex: 4, label: 'みなかみの景観', subject: '群馬・みなかみエリアにある湯檜曽周辺の景観' },
  { areaId: 'tochigi-nasu', candidateIndex: 7, label: '那須高原の景観', subject: '那須・板室エリアにある那須高原の景観' },
];

function extension(url) {
  const value = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(value) ? value : '.jpg';
}

function validLicense(license) {
  return license === 'Public domain' || license === 'CC0' || license.startsWith('CC BY');
}

manifest.areaFallbacks ??= [];
for (const selection of selected) {
  const region = regional.regions.find((item) => item.id === selection.areaId);
  const candidate = region?.candidates?.[selection.candidateIndex];
  if (!candidate || !validLicense(candidate.license) || !candidate.originalUrl || !candidate.descriptionUrl || !candidate.credit) {
    throw new Error(`Invalid regional media selection: ${selection.areaId}`);
  }

  const fileExtension = extension(candidate.originalUrl);
  const publicPath = `/images/regions/${selection.areaId}/primary${fileExtension}`;
  const localPath = path.join(root, 'public', publicPath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  if (!fs.existsSync(localPath)) {
    let response;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      response = await fetch(candidate.originalUrl, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-regional-media-sync)' } });
      if (response.ok) break;
      if (response.status !== 429 || attempt === 3) throw new Error(`${selection.areaId}: image download failed (${response.status})`);
      await delay(attempt * 3000);
    }
    fs.writeFileSync(localPath, Buffer.from(await response.arrayBuffer()));
    await delay(1500);
  }

  const fallback = {
    id: `area-${selection.areaId}-hero`,
    areaId: selection.areaId,
    status: 'approved',
    role: 'hero',
    label: selection.label,
    subject: selection.subject,
    sourceUrl: candidate.descriptionUrl,
    license: candidate.license,
    credit: candidate.credit,
    localPath: publicPath,
    reviewedAt,
    note: `温泉地・施設写真ではなく、${selection.label}として表示する周辺・地域景観。元ファイル: ${candidate.title}`,
  };
  const index = manifest.areaFallbacks.findIndex((item) => item.id === fallback.id);
  if (index >= 0) manifest.areaFallbacks[index] = fallback;
  else manifest.areaFallbacks.push(fallback);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Approved regional fallback: ${selection.areaId}`);
}

// Existing approved media can serve as a precise regional fallback without copying files.
const reuse = [
  { areaId: 'hakone-yugawara', sourceSlug: 'hakone-yumoto', label: '箱根湯本温泉の景観', subject: '箱根・湯河原エリアにある箱根湯本温泉の景観' },
  { areaId: 'gunma-meito', sourceSlug: 'ikaho', label: '伊香保温泉の景観', subject: '群馬名湯エリアにある伊香保温泉の景観' },
  { areaId: 'nikko-nasu', sourceSlug: 'kinugawa', label: '鬼怒川温泉の景観', subject: '栃木・日光那須エリアにある鬼怒川温泉の景観' },
  { areaId: 'tokyo-urban-onsen', sourceSlug: 'togoshiginza-onsen', label: '戸越銀座の夜景', subject: '東京23区・多摩エリアにある戸越銀座の夜景' },
];
for (const entry of reuse) {
  const source = manifest.assets.find((asset) => asset.onsenSlug === entry.sourceSlug && asset.role === 'hero' && asset.status === 'approved');
  if (!source) throw new Error(`No approved source asset found for ${entry.sourceSlug}`);
  const fallback = { id: `area-${entry.areaId}-hero`, areaId: entry.areaId, status: 'approved', role: 'hero', label: entry.label, subject: entry.subject, sourceUrl: source.sourceUrl, license: source.license, credit: source.credit, localPath: source.localPath, reviewedAt, note: `温泉地・施設写真ではなく、${entry.label}として表示する周辺・地域景観。` };
  const index = manifest.areaFallbacks.findIndex((item) => item.id === fallback.id);
  if (index >= 0) manifest.areaFallbacks[index] = fallback;
  else manifest.areaFallbacks.push(fallback);
}

// 東京近郊・埼玉は都県により、誤認しない地域景観を使い分ける。
const tokyoSource = manifest.assets.find((asset) => asset.onsenSlug === 'togoshiginza-onsen' && asset.role === 'hero' && asset.status === 'approved');
const saitamaFallback = manifest.areaFallbacks.find((item) => item.areaId === 'saitama-west');
manifest.areaFallbacks = manifest.areaFallbacks.filter((item) => item.id !== 'area-tokyo-saitama-tokyo-hero' && item.id !== 'area-tokyo-saitama-saitama-hero');
manifest.areaFallbacks.push(
  { id: 'area-tokyo-saitama-tokyo-hero', areaId: 'tokyo-saitama', prefecture: '東京都', status: 'approved', role: 'hero', label: '戸越銀座の夜景', subject: '東京近郊・埼玉エリアのうち東京都にある戸越銀座の夜景', sourceUrl: tokyoSource.sourceUrl, license: tokyoSource.license, credit: tokyoSource.credit, localPath: tokyoSource.localPath, reviewedAt, note: '東京都の温泉ページで表示する地域景観。施設写真ではない。' },
  { id: 'area-tokyo-saitama-saitama-hero', areaId: 'tokyo-saitama', prefecture: '埼玉県', status: 'approved', role: 'hero', label: saitamaFallback.label, subject: saitamaFallback.subject, sourceUrl: saitamaFallback.sourceUrl, license: saitamaFallback.license, credit: saitamaFallback.credit, localPath: saitamaFallback.localPath, reviewedAt, note: '埼玉県の温泉ページで表示する地域景観。施設写真ではない。' },
);
manifest.lastReviewed = reviewedAt;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Approved ${manifest.areaFallbacks.length} regional fallback assets.`);
