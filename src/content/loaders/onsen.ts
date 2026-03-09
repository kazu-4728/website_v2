import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';

import {
  imageManifestSchema,
  onsenDetailSchema,
  onsenIndexSchema,
  type ImageAsset,
  type ImageManifest,
  type OnsenDetail,
  type OnsenIndexConfig,
} from '@/src/content/schema/site';
import { readJsonFile } from '@/src/content/loaders/json';
import { formatMinutes } from '@/src/lib/utils';

export type LoadedOnsen = OnsenDetail & {
  images: {
    hero: ImageAsset;
    gallery: ImageAsset[];
    stay?: ImageAsset;
    food?: ImageAsset;
    townscape?: ImageAsset;
  };
  metrics: {
    bestTravelTime: number | null;
    bestTravelLabel: string;
    dayTripLabel: string;
  };
};

export type LoadedOnsenSpot = LoadedOnsen['onsenSpots'][number] & {
  parent: LoadedOnsen;
};

let cachedIndex: OnsenIndexConfig | null = null;
let cachedManifest: ImageManifest | null = null;
let cachedOnsens: LoadedOnsen[] | null = null;

async function loadOnsenIndexConfig() {
  if (cachedIndex) return cachedIndex;
  cachedIndex = await readJsonFile('content/onsen/index.json', onsenIndexSchema);
  return cachedIndex;
}

async function loadImageManifest() {
  if (cachedManifest) return cachedManifest;
  cachedManifest = await readJsonFile('content/images/onsen-images.json', imageManifestSchema);
  return cachedManifest;
}

async function loadOnsenDetails() {
  const dirPath = path.join(process.cwd(), 'content', 'onsen');
  const files = (await fs.readdir(dirPath)).filter((file) => file.endsWith('.json') && file !== 'index.json').sort();
  return Promise.all(files.map((file) => readJsonFile(path.join('content/onsen', file), onsenDetailSchema)));
}

function getAssetById(manifest: ImageManifest, assetId?: string) {
  if (!assetId) return undefined;
  return manifest.assets.find((asset) => asset.id === assetId);
}

function getBestTravelTime(detail: OnsenDetail) {
  const candidates = [
    detail.access.fromTokyo.byTrain?.time,
    detail.access.fromTokyo.byCar?.time,
    detail.access.fromTokyo.byBus?.time,
  ].filter((value): value is number => typeof value === 'number');

  if (candidates.length === 0) return null;
  return Math.min(...candidates);
}

function uniqueAssets(assets: Array<ImageAsset | undefined>) {
  const seen = new Set<string>();
  const unique: ImageAsset[] = [];

  for (const asset of assets) {
    if (!asset) continue;
    const key = asset.remoteUrl || asset.localPath || asset.id;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(asset);
  }

  return unique;
}

function buildSpotPhotoAssets(detail: OnsenDetail) {
  return uniqueAssets(
    detail.onsenSpots
      .filter((spot) => spot.photoStatus === 'verified' && Boolean(spot.photoUrl))
      .map((spot) => ({
        id: `${detail.identity.slug}-spot-${spot.slug}`,
        type: 'photo' as const,
        alt: `${detail.identity.name} の代表施設 ${spot.name}`,
        remoteUrl: spot.photoUrl,
        source: 'Google Place Photos',
        credit: 'Google Maps contributors',
        license: 'Google Maps Place Photos',
        sourceUrl: spot.googleMapsUri || spot.mapUrl,
        capturedSubject: spot.name,
        verifiedRealWorld: true as const,
        focus: 'bath' as const,
      }))
  );
}

function attachImages(detail: OnsenDetail, manifest: ImageManifest): LoadedOnsen {
  const imageRefs = manifest.onsens[detail.identity.slug];
  if (!imageRefs) {
    throw new Error(`Missing image mapping for ${detail.identity.slug}`);
  }

  const manifestHero = getAssetById(manifest, imageRefs.hero);
  if (!manifestHero) {
    throw new Error(`Missing hero image for ${detail.identity.slug}`);
  }

  const spotPhotoAssets = buildSpotPhotoAssets(detail);
  const hero = manifestHero.focus === 'area' && spotPhotoAssets.length > 0 ? spotPhotoAssets[0] : manifestHero;
  const gallery = uniqueAssets([
    ...imageRefs.gallery.map((assetId) => getAssetById(manifest, assetId)),
    ...spotPhotoAssets,
    hero,
  ]);
  const bestTravelTime = getBestTravelTime(detail);

  return {
    ...detail,
    images: {
      hero,
      gallery,
      stay: getAssetById(manifest, imageRefs.stay),
      food: getAssetById(manifest, imageRefs.food),
      townscape: getAssetById(manifest, imageRefs.townscape),
    },
    metrics: {
      bestTravelTime,
      bestTravelLabel: formatMinutes(bestTravelTime) ?? '要確認',
      dayTripLabel: detail.stay.dayTripAvailable ? '日帰り可' : '宿泊向け',
    },
  };
}

export async function loadAllOnsens() {
  if (cachedOnsens) return cachedOnsens;

  const [indexConfig, manifest, onsenDetails] = await Promise.all([
    loadOnsenIndexConfig(),
    loadImageManifest(),
    loadOnsenDetails(),
  ]);

  const onsenMap = new Map(onsenDetails.map((detail) => [detail.identity.slug, detail]));

  cachedOnsens = indexConfig.publishedSlugs.map((slug) => {
    const detail = onsenMap.get(slug);
    if (!detail) {
      throw new Error(`Missing onsen JSON for published slug: ${slug}`);
    }

    return attachImages(detail, manifest);
  });

  return cachedOnsens;
}

export async function loadOnsenBySlug(slug: string) {
  const onsens = await loadAllOnsens();
  return onsens.find((onsen) => onsen.identity.slug === slug) ?? null;
}

export async function loadAllOnsenSpots() {
  const onsens = await loadAllOnsens();
  return onsens.flatMap((onsen) => onsen.onsenSpots.map((spot) => ({ ...spot, parent: onsen })));
}

export async function loadOnsenSpot(parentSlug: string, spotSlug: string) {
  const onsen = await loadOnsenBySlug(parentSlug);
  if (!onsen) return null;
  const spot = onsen.onsenSpots.find((entry) => entry.slug === spotSlug);
  if (!spot) return null;
  return { ...spot, parent: onsen };
}

export async function loadFeaturedOnsens() {
  const [indexConfig, onsens] = await Promise.all([loadOnsenIndexConfig(), loadAllOnsens()]);
  return indexConfig.featuredSlugs
    .map((slug) => onsens.find((onsen) => onsen.identity.slug === slug))
    .filter((onsen): onsen is LoadedOnsen => Boolean(onsen));
}

export async function loadComparisonOnsens() {
  const [indexConfig, onsens] = await Promise.all([loadOnsenIndexConfig(), loadAllOnsens()]);
  return indexConfig.comparisonSlugs
    .map((slug) => onsens.find((onsen) => onsen.identity.slug === slug))
    .filter((onsen): onsen is LoadedOnsen => Boolean(onsen));
}
