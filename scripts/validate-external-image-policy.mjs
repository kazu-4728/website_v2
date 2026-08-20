import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (message) => errors.push(message);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(absolutePath);
    return [absolutePath];
  });
}

for (const relativeDirectory of ['public/images', 'static/images', 'assets/images']) {
  const localFiles = filesUnder(path.join(root, relativeDirectory));
  if (localFiles.length > 0) {
    fail(`${relativeDirectory} must not contain image binaries or other files: ${localFiles.map((file) => path.relative(root, file)).join(', ')}`);
  }
}

const manifest = readJson('data/onsen-image-manifest.json');
const allAssets = [...(manifest.assets ?? []), ...(manifest.areaFallbacks ?? [])];
for (const asset of allAssets) {
  const base = `image asset ${asset.id ?? '(missing id)'}`;
  if (Object.hasOwn(asset, 'localPath')) fail(`${base}: localPath is prohibited`);
  if (asset.status === 'approved' && (!asset.deliveryUrl || !String(asset.deliveryUrl).startsWith('https://'))) {
    fail(`${base}: approved asset requires an HTTPS deliveryUrl`);
  }
}

const siteData = readJson('data/directory-site.json');
for (const onsen of siteData.onsens ?? []) {
  for (const [kind, image] of [['image', onsen.image], ...((onsen.gallery ?? []).map((entry) => ['gallery', entry]) )]) {
    if (!image || typeof image.src !== 'string' || !image.src.startsWith('https://')) {
      fail(`${onsen.slug}: ${kind} must use an external HTTPS image URL`);
    }
    if (typeof image?.src === 'string' && /^\/(?:public\/)?images\//.test(image.src)) {
      fail(`${onsen.slug}: ${kind} must not reference a local image path`);
    }
  }
}

if (errors.length > 0) {
  console.error('External image policy validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`External image policy validation passed: ${allAssets.length} approved-or-tracked assets and no local image files.`);
