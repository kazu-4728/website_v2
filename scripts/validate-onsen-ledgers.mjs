import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const fail = (message) => errors.push(message);
const errors = [];

const siteData = readJson('data/directory-site.json');
const imageManifest = readJson('data/onsen-image-manifest.json');
const coveragePolicy = readJson('data/onsen-coverage-policy.json');
const candidateRegistry = readJson('data/onsen-coverage-candidates.json');
const coverageLedger = readJson('data/onsen-coverage-ledger.json');
const onsenBySlug = new Map(siteData.onsens.map((onsen) => [onsen.slug, onsen]));
const validImageStatuses = new Set(['approved', 'needs-source', 'permission-requested', 'rejected', 'retired']);
const validImageRoles = new Set(['hero', 'gallery']);

if (imageManifest.schemaVersion !== 1 || !Array.isArray(imageManifest.assets)) {
  fail('image manifest must use schemaVersion 1 and contain an assets array');
}

const imageIds = new Set();
const approvedHeroes = new Set();
for (const asset of imageManifest.assets ?? []) {
  const base = `image asset ${asset.id ?? '(missing id)'}`;
  if (typeof asset.id !== 'string' || !asset.id) fail(`${base}: id is required`);
  if (imageIds.has(asset.id)) fail(`${base}: id must be unique`);
  imageIds.add(asset.id);
  if (!onsenBySlug.has(asset.onsenSlug)) fail(`${base}: onsenSlug does not exist`);
  if (!validImageRoles.has(asset.role)) fail(`${base}: role must be hero or gallery`);
  if (!validImageStatuses.has(asset.status)) fail(`${base}: invalid status`);
  for (const key of ['subject', 'sourceUrl', 'license', 'reviewedAt', 'note']) {
    if (typeof asset[key] !== 'string' || !asset[key].trim()) fail(`${base}: ${key} is required`);
  }
  if (!String(asset.sourceUrl).startsWith('https://')) fail(`${base}: sourceUrl must use HTTPS`);
  if (Object.hasOwn(asset, 'localPath')) fail(`${base}: localPath is prohibited; images must be externally delivered`);
  if (asset.status === 'approved') {
    if (typeof asset.credit !== 'string' || !asset.credit.trim()) fail(`${base}: approved assets require credit`);
    if (typeof asset.deliveryUrl !== 'string' || !asset.deliveryUrl.startsWith('https://')) fail(`${base}: approved assets require an HTTPS deliveryUrl`);
    if (asset.role === 'hero') {
      const heroKey = `${asset.onsenSlug}:${asset.role}`;
      if (approvedHeroes.has(heroKey)) fail(`${base}: only one approved hero is allowed per onsen`);
      approvedHeroes.add(heroKey);
    }
  } else if (asset.deliveryUrl) {
    fail(`${base}: only approved assets may define deliveryUrl`);
  }
}

for (const onsen of siteData.onsens.filter((item) => item.imageVerified === false)) {
  const hasManifestEntry = imageManifest.assets.some((asset) => asset.onsenSlug === onsen.slug && asset.role === 'hero');
  if (!hasManifestEntry) fail(`${onsen.slug}: imageVerified=false requires a hero entry in the image manifest`);
}

if (coveragePolicy.schemaVersion !== 1 || !coveragePolicy.prefectures) {
  fail('coverage policy must use schemaVersion 1 and include prefectures');
}
if (candidateRegistry.schemaVersion !== 1 || !Array.isArray(candidateRegistry.candidates)) {
  fail('coverage candidate registry must use schemaVersion 1 and include a candidates array');
}
const candidateIds = new Set();
for (const candidate of candidateRegistry.candidates ?? []) {
  const base = `coverage candidate ${candidate.id ?? '(missing id)'}`;
  if (typeof candidate.id !== 'string' || !candidate.id) fail(`${base}: id is required`);
  if (candidateIds.has(candidate.id)) fail(`${base}: id must be unique`);
  candidateIds.add(candidate.id);
  for (const key of ['name', 'prefecture', 'classification', 'status', 'sourceName', 'sourceUrl', 'sourcePublishedName', 'reviewNote']) {
    if (typeof candidate[key] !== 'string' || !candidate[key].trim()) fail(`${base}: ${key} is required`);
  }
  if (!coveragePolicy.prefectures[candidate.prefecture]) fail(`${base}: prefecture must be in coverage policy`);
  if (candidate.classification !== 'onsen-place') fail(`${base}: classification must be onsen-place`);
  if (candidate.status !== 'candidate') fail(`${base}: status must be candidate until a primary or public source review is complete`);
  if (!candidate.sourceUrl.startsWith('https://')) fail(`${base}: sourceUrl must use HTTPS`);
  if (siteData.onsens.some((onsen) => onsen.prefecture === candidate.prefecture && onsen.name === candidate.name)) fail(`${base}: name already has a published record; resolve the alias before retaining it as a candidate`);
}
if (coverageLedger.schemaVersion !== 1 || !Array.isArray(coverageLedger.entries) || !Array.isArray(coverageLedger.summary) || !Array.isArray(coverageLedger.candidates)) {
  fail('coverage ledger must use schemaVersion 1 and include entries and summary arrays');
}
const ledgerSlugs = new Set(coverageLedger.entries.map((entry) => entry.siteSlug));
for (const onsen of siteData.onsens) {
  if (!ledgerSlugs.has(onsen.slug)) fail(`${onsen.slug}: missing from coverage ledger`);
}
for (const entry of coverageLedger.entries) {
  if (!onsenBySlug.has(entry.siteSlug)) fail(`coverage ledger contains unknown slug ${entry.siteSlug}`);
}
for (const [prefecture, values] of Object.entries(coveragePolicy.prefectures)) {
  const row = coverageLedger.summary.find((item) => item.prefecture === prefecture);
  if (!row) fail(`coverage ledger is missing summary row for ${prefecture}`);
  if (row.officialOnsenPlaceCount !== values.officialOnsenPlaceCount) fail(`coverage ledger has incorrect official count for ${prefecture}`);
}
if (coverageLedger.candidates.length !== candidateRegistry.candidates.length) fail('coverage ledger candidate count does not match candidate registry');
for (const candidate of candidateRegistry.candidates) {
  if (!coverageLedger.candidates.some((item) => item.id === candidate.id)) fail(`coverage ledger is missing candidate ${candidate.id}`);
}

if (errors.length) {
  console.error('Onsen ledger validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Onsen ledger validation passed: ${imageManifest.assets.length} image assets, ${coverageLedger.entries.length} coverage entries.`);
