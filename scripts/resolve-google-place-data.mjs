import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENV_FILES = ['.env', '.env.local', '.env.production'].map((file) => path.join(ROOT, file));
const CONTENT_DIR = path.join(ROOT, 'content', 'onsen');
const API_KEY = loadEnv('GOOGLE_MAPS_API_KEY') || loadEnv('GOOGLE_PLACES_API_KEY');

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

async function searchPlace(textQuery) {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.photos',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'ja',
      regionCode: 'JP',
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.places?.[0] ?? null;
}

async function main() {
  if (!API_KEY) {
    console.log('GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY is not configured. Skipping place sync.');
    return;
  }

  let updatedSpots = 0;
  let verifiedSpots = 0;

  for (const filePath of listContentFiles()) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    for (const spot of content.onsenSpots || []) {
      if (!spot.placeQuery) {
        spot.placeQuery = [spot.name, content.identity.name, content.identity.prefecture].filter(Boolean).join(' ');
      }
      if (spot.placeId && spot.googleMapsUri && spot.imageSourceType !== 'pending') {
        continue;
      }

      const place = await searchPlace(spot.placeQuery);
      if (!place?.id) {
        continue;
      }

      spot.placeId = place.id;
      spot.googleMapsUri = place.googleMapsUri || spot.googleMapsUri;
      spot.websiteUri = place.websiteUri || spot.websiteUri;
      if (!spot.officialUrl && place.websiteUri) {
        spot.officialUrl = place.websiteUri;
      }
      if (Array.isArray(place.photos) && place.photos.length > 0) {
        spot.placePhotoName = place.photos[0].name || spot.placePhotoName;
        spot.photoStatus = spot.photoUrl ? 'verified' : 'pending';
        spot.imageSourceType = 'google-place';
        verifiedSpots += 1;
      } else if (spot.photoStatus !== 'verified') {
        spot.photoStatus = 'missing';
      }

      updatedSpots += 1;
      changed = true;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (changed) {
      fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
    }
  }

  console.log(`Updated ${updatedSpots} spots. Verified photo candidates: ${verifiedSpots}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


