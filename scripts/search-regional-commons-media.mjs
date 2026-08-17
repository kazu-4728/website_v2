import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'data/regional-wikimedia-candidates.json');
const regions = [
  { id: 'chiba-boso', query: 'Nokogiri Chiba', label: '房総・九十九里' },
  { id: 'saitama-west', query: 'Chichibu Saitama', label: '埼玉・奥武蔵秩父' },
  { id: 'ibaraki-onsen', query: '五浦 海岸', label: '茨城・奥久慈' },
  { id: 'tokyo-islands', query: 'Okutama Tokyo', label: '東京・奥多摩・島しょ' },
  { id: 'gunma-minakami', query: 'Minakami Gunma', label: '群馬・みなかみ' },
  { id: 'tochigi-nasu', query: 'Nasu Tochigi landscape', label: '那須・板室' },
];

function text(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.value === 'string') return value.value;
  return '';
}
function clean(value) { return text(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function reusable(license) { return license === 'Public domain' || license === 'CC0' || license.startsWith('CC BY'); }

async function search(region) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', generator: 'search',
    gsrsearch: region.query, gsrnamespace: '6', gsrlimit: '10',
    prop: 'imageinfo|info', inprop: 'url', iiprop: 'url|size|extmetadata',
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': 'KantoOnsenPortal/1.0 (regional-media-research)' } });
  if (!response.ok) throw new Error(`${region.id}: Commons ${response.status}`);
  const pages = (await response.json()).query?.pages ?? [];
  return {
    ...region,
    candidates: pages.map((page) => {
      const info = page.imageinfo?.[0] ?? {};
      const meta = info.extmetadata ?? {};
      const license = text(meta.LicenseShortName);
      return { title: page.title, descriptionUrl: page.canonicalurl ?? '', originalUrl: info.url ?? '', license, credit: clean(meta.Artist), imageDescription: clean(meta.ImageDescription), reusable: reusable(license) };
    }).filter((candidate) => candidate.reusable && candidate.descriptionUrl && candidate.originalUrl),
  };
}

const results = [];
for (const region of regions) results.push(await search(region));
fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, collectedAt: '2026-08-17', source: 'Wikimedia Commons', regions: results }, null, 2)}\n`);
console.log(`Collected regional candidates for ${results.length} areas.`);
