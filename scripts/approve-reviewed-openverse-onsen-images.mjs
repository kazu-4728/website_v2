import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const manifest = readJson('data/onsen-image-manifest.json');
const candidateSets = new Map(readJson('data/openverse-onsen-candidates.json').records.map((record) => [record.slug, record]));
const reviewedAt = '2026-08-17';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Each pattern was manually screened against the candidate title and its Commons/Flickr landing page.
// Only photographs that identify the target onsen, a named target facility, or a uniquely associated landmark are included.
const selections = {
  isohara: '磯原温泉としまや月浜の湯',
  'isohara-onsen': '磯原温泉としまや月浜の湯',
  'isobe-onsen': '磯部温泉 日本最古の温泉記号',
  oigami: 'Oigami-Onsen Autumn',
  'ときがわ温泉': '玉川温泉 埼玉県ときがわ町',
  'minano-onsen': '秩父温泉 満願の湯 埼玉県秩父郡皆野町',
  'kawarayu-onsen': 'Kawarayuonsen Ouyu',
  '倉渕温泉': '倉渕 相間川温泉',
  chichibu: 'Seibu-Chichibu Ekimae Onsen',
  ryokami: '道の駅両神温泉薬師の湯',
  '7沢温泉': 'Seirakuen in Nanasawa onsen',
  'hakone-motohakone': 'Ashinoyu onsen - Hakone',
  kamogawa: 'Tanjo-ji Ashiyu',
  'kodai-no-yu': '東京天然温泉 古代の湯',
  kazuma: '檜原温泉センター 数馬の湯',
  'hinohara-onsen': 'Hinohara Onsen Center 檜原温泉センター 数馬の湯',
  yunishigawa: '湯西川温泉かまくら祭',
  '矢板温泉': '20100322矢板温泉城の湯',
};

function licenseLabel(candidate) {
  if (candidate.license === 'cc0') return 'CC0';
  if (candidate.license === 'pdm') return 'Public domain';
  const base = candidate.license === 'by-sa' ? 'CC BY-SA' : 'CC BY';
  return candidate.licenseVersion ? `${base} ${candidate.licenseVersion}` : base;
}

function safeExtension(url) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(extension) ? extension : '.jpg';
}

async function download(candidate, destination) {
  const sources = [candidate.url, candidate.thumbnail].filter(Boolean);
  let lastError = '';
  for (const source of sources) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await fetch(source, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-media-sync; contact@example.invalid)' } });
      if (response.ok) {
        fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
        return;
      }
      lastError = `${response.status} ${source}`;
      if (response.status !== 429) break;
      await pause(2500 * attempt);
    }
  }
  throw new Error(`Image download failed: ${lastError}`);
}

for (const [slug, titleFragment] of Object.entries(selections)) {
  const record = candidateSets.get(slug);
  const candidate = record?.candidates?.find((item) => item.title.includes(titleFragment));
  if (!candidate) throw new Error(`${slug}: reviewed candidate not found (${titleFragment}).`);
  if (!['by', 'by-sa', 'cc0', 'pdm'].includes(candidate.license)) throw new Error(`${slug}: invalid reuse license ${candidate.license}.`);
  if (!candidate.url || !candidate.landingUrl || !candidate.creator) throw new Error(`${slug}: incomplete attribution data.`);

  const extension = safeExtension(candidate.url);
  const publicRelativePath = `/images/onsens/${slug}/primary${extension}`;
  const localPath = path.join(root, 'public', publicRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  await download(candidate, localPath);

  const asset = {
    id: `${slug}-hero`,
    onsenSlug: slug,
    role: 'hero',
    status: 'approved',
    subject: `${record.name}に関係する「${candidate.title}」`,
    sourceUrl: candidate.landingUrl,
    license: licenseLabel(candidate),
    credit: candidate.creator,
    localPath: publicRelativePath,
    reviewedAt,
    note: `Openverseの再利用可能ライセンスを確認し、対象温泉名・対象施設名または固有の関連地名がタイトルに明記された写真として採用。元写真タイトル: ${candidate.title}`,
  };
  const existingIndex = manifest.assets.findIndex((item) => item.onsenSlug === slug && item.role === 'hero');
  if (existingIndex >= 0) manifest.assets[existingIndex] = asset;
  else manifest.assets.push(asset);
  manifest.lastReviewed = reviewedAt;
  writeJson('data/onsen-image-manifest.json', manifest);
  console.log(`Approved ${slug}: ${candidate.title}`);
  await pause(900);
}
console.log(`Approved ${Object.keys(selections).length} manually reviewed Openverse images.`);
