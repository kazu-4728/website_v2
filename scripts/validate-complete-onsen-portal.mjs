import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-image-manifest.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-detailed-guides.json'), 'utf8'));
const links = JSON.parse(fs.readFileSync(path.join(root, 'data/onsen-link-audit.json'), 'utf8'));
const errors = [];

const guideFields = ['summary', 'planning', 'onArrival', 'enjoyment', 'caution', 'seasonalGuide'];
const directHeroSlugs = new Set((manifest.assets ?? []).filter((asset) => asset.status === 'approved' && asset.role === 'hero').map((asset) => asset.onsenSlug));
const fallbackByArea = new Map();
for (const asset of manifest.areaFallbacks ?? []) {
  if (asset.status !== 'approved' || asset.role !== 'hero') continue;
  const key = `${asset.areaId}:${asset.prefecture ?? '*'}`;
  fallbackByArea.set(key, asset);
  if (!asset.deliveryUrl || !asset.deliveryUrl.startsWith('https://')) errors.push(`${asset.id}: approved regional image delivery URL is missing`);
  if (asset.localPath) errors.push(`${asset.id}: approved regional image must not retain a repository localPath`);
  if (!asset.subject || !asset.credit || !asset.license || !asset.sourceUrl) errors.push(`${asset.id}: regional image attribution is incomplete`);
}
for (const asset of manifest.assets ?? []) {
  if (asset.status !== 'approved') continue;
  if (!asset.deliveryUrl || !asset.deliveryUrl.startsWith('https://')) errors.push(`${asset.id}: approved direct image delivery URL is missing`);
  if (asset.localPath) errors.push(`${asset.id}: approved direct image must not retain a repository localPath`);
  if (!asset.subject || !asset.credit || !asset.license || !asset.sourceUrl) errors.push(`${asset.id}: direct image attribution is incomplete`);
}

for (const onsen of data.onsens) {
  if (!directHeroSlugs.has(onsen.slug)) errors.push(`${onsen.slug}: no approved individual or explicitly-nearby direct image`);
  const guide = guides.guides?.[onsen.slug];
  if (!guide) errors.push(`${onsen.slug}: missing detailed guide`);
  else {
    for (const field of guideFields) {
      if (typeof guide[field] !== 'string' || guide[field].trim().length < 50) errors.push(`${onsen.slug}: detailed guide.${field} is missing or too short`);
      if (/placeholder|確認・差し替え中/i.test(guide[field] ?? '')) errors.push(`${onsen.slug}: detailed guide.${field} contains placeholder wording`);
    }
  }
}

for (const outcome of links.outcomes ?? []) {
  if (outcome.classification === 'broken') errors.push(`broken link: ${outcome.url}`);
}
if ((links.counts?.broken ?? 0) !== 0) errors.push(`link audit reports ${links.counts.broken} broken links`);

if (errors.length) {
  console.error('Portal completion validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Portal completion validation passed: ${data.onsens.length} pages, ${directHeroSlugs.size} approved individual images, ${links.uniqueUrlCount} checked links, 0 broken links.`);
