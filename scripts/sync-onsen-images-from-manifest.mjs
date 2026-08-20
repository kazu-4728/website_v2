import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const site = readJson('data/directory-site.json');
const manifest = readJson('data/onsen-image-manifest.json');
const directBySlug = new Map(manifest.assets.filter((asset) => asset.status === 'approved' && asset.role === 'hero').map((asset) => [asset.onsenSlug, asset]));

for (const onsen of site.onsens) {
  const asset = directBySlug.get(onsen.slug);
  if (!asset?.deliveryUrl?.startsWith('https://') || !asset.credit) throw new Error(`${onsen.slug}: approved direct hero requires an HTTPS deliveryUrl and credit.`);
  const image = { src: asset.deliveryUrl, alt: asset.subject, credit: asset.credit, license: asset.license, sourceUrl: asset.sourceUrl };
  onsen.image = image;
  onsen.gallery = [image, { ...image }];
  onsen.imageVerified = true;
}
writeJson('data/directory-site.json', site);
console.log(`Synchronized ${site.onsens.length} records with approved individual image assets.`);
