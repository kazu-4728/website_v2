import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENV_FILES = ['.env', '.env.local', '.env.production'].map((file) => path.join(ROOT, file));
const CONTENT_DIR = path.join(ROOT, 'content', 'onsen');
const API_KEY = loadEnv('GOOGLE_MAPS_API_KEY') || loadEnv('GOOGLE_PLACES_API_KEY');
const MAX_PARENTS = Number(process.env.DISCOVER_MAX_PARENTS ?? 8);
const TARGET_SPOTS_PER_PARENT = Number(process.env.DISCOVER_TARGET_SPOTS ?? 4);
const PRIORITY_SLUGS = (process.env.DISCOVER_ONSEN_SLUGS ?? '').split(',').map((value) => value.trim()).filter(Boolean);

function loadEnv(target) {
  if (process.env[target]) return process.env[target];
  for (const envFile of ENV_FILES) {
    if (!fs.existsSync(envFile)) continue;
    const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (key === target) {
        const normalized = value.replace(/^['"]|['"]$/g, '');
        process.env[key] = normalized;
        return normalized;
      }
    }
  }
  return '';
}

function listContentFiles() {
  return fs.readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.json') && file !== 'index.json')
    .map((file) => path.join(CONTENT_DIR, file));
}

function slugify(value) {
  return value
    .normalize('NFKC')
    .replace(/\s+/g, '-')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function hasOnsenLikeName(name) {
  return /(温泉|の湯|湯|旅館|ホテル|浴場|スパ|露天)/.test(name);
}

async function searchPlaces(textQuery) {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.photos,places.primaryType,places.types',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'ja',
      regionCode: 'JP',
      pageSize: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.places ?? [];
}

function buildCandidateQueries(content) {
  return [
    `${content.identity.name} 日帰り温泉 ${content.identity.prefecture}`,
    `${content.identity.name} 共同浴場 ${content.identity.prefecture}`,
    `${content.identity.name} 露天風呂 ${content.identity.prefecture}`,
  ];
}

function toSpot(content, place) {
  const name = place.displayName?.text?.trim();
  if (!name) return null;
  return {
    slug: slugify(name),
    name,
    type: /(共同浴場|足湯|露天|の湯|温泉)/.test(name) ? 'day-trip' : 'onsen-landmark',
    description: `${content.identity.name} の中でも ${name} は、現地で温泉体験の中心になりやすい実在スポットです。写真と地図を頼りに立ち寄り計画を組みやすい候補として追加しています。`,
    mapUrl: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${content.identity.prefecture}`)}`,
    bookingHint: '営業時間や立ち寄り可否は変動するため、訪問前に施設案内の確認がおすすめです。',
    placeQuery: `${name} ${content.identity.prefecture}`,
    placeId: place.id,
    googleMapsUri: place.googleMapsUri,
    websiteUri: place.websiteUri,
    officialUrl: place.websiteUri,
    placePhotoName: Array.isArray(place.photos) && place.photos[0] ? place.photos[0].name : undefined,
    photoStatus: Array.isArray(place.photos) && place.photos[0] ? 'pending' : 'missing',
    imageSourceType: Array.isArray(place.photos) && place.photos[0] ? 'google-place' : 'pending',
  };
}

async function main() {
  if (!API_KEY) {
    console.log('GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY is not configured. Skipping discovery.');
    return;
  }

  const files = listContentFiles();
  const rankedTargets = files
    .map((filePath) => ({ filePath, content: JSON.parse(fs.readFileSync(filePath, 'utf8')) }))
    .filter(({ content }) => (content.onsenSpots || []).length < TARGET_SPOTS_PER_PARENT)
    .sort((a, b) => {
      const aSpots = (a.content.onsenSpots || []).length;
      const bSpots = (b.content.onsenSpots || []).length;
      if (aSpots !== bSpots) return aSpots - bSpots;
      const aVerified = (a.content.onsenSpots || []).filter((spot) => spot.photoStatus === 'verified').length;
      const bVerified = (b.content.onsenSpots || []).filter((spot) => spot.photoStatus === 'verified').length;
      if (aVerified !== bVerified) return aVerified - bVerified;
      return a.content.identity.slug.localeCompare(b.content.identity.slug);
    });
  const targets = (PRIORITY_SLUGS.length > 0
    ? rankedTargets.filter(({ content }) => PRIORITY_SLUGS.includes(content.identity.slug))
    : rankedTargets
  ).slice(0, MAX_PARENTS);
  let added = 0;
  let touched = 0;

  for (const target of targets) {
    const { filePath } = target;
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const spots = content.onsenSpots || [];
    if (spots.length >= TARGET_SPOTS_PER_PARENT) continue;

    const existingNames = new Set(spots.map((spot) => spot.name));
    const existingPlaceIds = new Set(spots.map((spot) => spot.placeId).filter(Boolean));
    const needed = TARGET_SPOTS_PER_PARENT - spots.length;
    const discovered = [];

    for (const query of buildCandidateQueries(content)) {
      const places = await searchPlaces(query);
      for (const place of places) {
        const name = place.displayName?.text?.trim();
        if (!name || !hasOnsenLikeName(name)) continue;
        if (existingNames.has(name) || existingPlaceIds.has(place.id)) continue;
        const spot = toSpot(content, place);
        if (!spot) continue;
        discovered.push(spot);
        existingNames.add(name);
        if (place.id) existingPlaceIds.add(place.id);
        if (discovered.length >= needed) break;
      }
      if (discovered.length >= needed) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (discovered.length > 0) {
      content.onsenSpots = [...spots, ...discovered];
      fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
      added += discovered.length;
      touched += 1;
    }
  }

  console.log(`Added ${added} spots across ${touched} parents.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
