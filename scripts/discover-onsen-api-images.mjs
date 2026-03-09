import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.join(process.cwd(), 'data', 'api-image-candidates.json');
const catalog = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'onsen-catalog.json'), 'utf8'));

function loadEnv() {
  for (const file of ['.env', '.env.local', '.env.production']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    for (const rawLine of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || !line.includes('=')) continue;
      const [key, ...rest] = line.split('=');
      if (process.env[key]) continue;
      process.env[key] = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

function parseArgs() {
  const args = { limit: null };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--limit=')) args.limit = Number(arg.split('=')[1]);
  }
  return args;
}

function buildQueries(entry) {
  const jp = [entry.name, entry.location, entry.region?.area || entry.region || ''].filter(Boolean).join(' ');
  const en = [entry.nameEn, 'onsen', entry.location].filter(Boolean).join(' ');
  return [
    `${jp} 温泉`,
    `${jp} 露天風呂`,
    `${en}`,
  ];
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': 'OnsenApiDiscovery/1.0', ...headers } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function searchUnsplash(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY) return [];
  const data = await fetchJson(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`, {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
  });
  return (data.results || []).map((image) => ({
    provider: 'unsplash',
    id: image.id,
    url: image.urls.regular,
    pageUrl: image.links.html,
    credit: image.user?.name || 'Unknown',
    license: 'Unsplash License',
    title: image.alt_description || query,
  }));
}

async function searchPexels(query) {
  if (!process.env.PEXELS_API_KEY) return [];
  const data = await fetchJson(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`, {
    Authorization: process.env.PEXELS_API_KEY,
  });
  return (data.photos || []).map((image) => ({
    provider: 'pexels',
    id: String(image.id),
    url: image.src?.large2x,
    pageUrl: image.url,
    credit: image.photographer || 'Unknown',
    license: 'Pexels License',
    title: image.alt || query,
  })).filter((image) => image.url);
}

async function searchPixabay(query) {
  if (!process.env.PIXABAY_API_KEY) return [];
  const data = await fetchJson(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);
  return (data.hits || []).map((image) => ({
    provider: 'pixabay',
    id: String(image.id),
    url: image.largeImageURL,
    pageUrl: image.pageURL,
    credit: image.user || 'Unknown',
    license: 'Pixabay License',
    title: image.tags || query,
  })).filter((image) => image.url);
}

async function main() {
  loadEnv();
  const args = parseArgs();
  const entries = Object.values(catalog).slice(0, args.limit || undefined);
  const output = {};

  for (const entry of entries) {
    const queries = buildQueries(entry);
    output[entry.slug] = [];
    for (const query of queries) {
      const [unsplash, pexels, pixabay] = await Promise.allSettled([
        searchUnsplash(query),
        searchPexels(query),
        searchPixabay(query),
      ]);

      for (const result of [unsplash, pexels, pixabay]) {
        if (result.status !== 'fulfilled') continue;
        output[entry.slug].push(...result.value);
      }
    }

    const seen = new Set();
    output[entry.slug] = output[entry.slug].filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    }).slice(0, 9);
    console.log(`Discovered ${output[entry.slug].length} candidates for ${entry.slug}`);
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
