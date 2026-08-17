import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteData = JSON.parse(fs.readFileSync(path.join(root, 'data/directory-site.json'), 'utf8'));
const outputPath = path.join(root, 'data/wikimedia-image-candidates.json');
const requestedSlugs = process.argv.slice(2);
const records = requestedSlugs.length
  ? siteData.onsens.filter((onsen) => requestedSlugs.includes(onsen.slug))
  : siteData.onsens;

if (!records.length) {
  throw new Error('No matching onsen records were found.');
}

const apiBase = 'https://commons.wikimedia.org/w/api.php';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function firstValue(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.value === 'string') return value.value;
  return '';
}

async function collectForOnsen(onsen) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrsearch: onsen.name,
    gsrnamespace: '6',
    gsrlimit: '6',
    prop: 'imageinfo|info',
    inprop: 'url',
    iiprop: 'url|size|extmetadata',
  });
  const response = await fetch(`${apiBase}?${params}`, {
    headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (licensed-image-audit)' },
  });
  if (!response.ok) throw new Error(`${onsen.slug}: Commons API returned ${response.status}`);
  const payload = await response.json();
  const pages = payload.query?.pages ?? [];
  return {
    slug: onsen.slug,
    name: onsen.name,
    prefecture: onsen.prefecture,
    candidates: pages.map((page) => {
      const info = page.imageinfo?.[0] ?? {};
      const metadata = info.extmetadata ?? {};
      return {
        title: page.title,
        descriptionUrl: page.canonicalurl ?? '',
        originalUrl: info.url ?? '',
        width: info.width ?? null,
        height: info.height ?? null,
        license: firstValue(metadata.LicenseShortName),
        usageTerms: firstValue(metadata.UsageTerms),
        credit: firstValue(metadata.Artist).replace(/<[^>]*>/g, '').trim(),
        imageDescription: firstValue(metadata.ImageDescription).replace(/<[^>]*>/g, '').trim(),
      };
    }),
  };
}

const results = [];
for (const [index, onsen] of records.entries()) {
  try {
    results.push(await collectForOnsen(onsen));
  } catch (error) {
    results.push({ slug: onsen.slug, name: onsen.name, prefecture: onsen.prefecture, candidates: [], error: error.message });
  }
  if (index < records.length - 1) await delay(150);
}

fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, collectedAt: '2026-08-17', source: apiBase, records: results }, null, 2)}\n`);
const withCandidates = results.filter((result) => result.candidates.length).length;
console.log(`Collected Commons candidates for ${records.length} records; ${withCandidates} records returned at least one candidate.`);
