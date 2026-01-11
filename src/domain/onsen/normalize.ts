/**
 * Domain Layer: Onsen Normalization
 * 
 * JSONデータを内部表現に正規化
 * - 空配列のimagesをスロット形式に変換
 * - 欠損画像をプレースホルダで補完
 */

import { OnsenCatalogEntry, OnsenSpot, OnsenImageSlots, ImageSlotName, VALID_IMAGE_SLOTS } from './types';

/**
 * プレースホルダ画像のパスを生成
 */
function getPlaceholderPath(slotName: ImageSlotName): string {
  return `/images/placeholders/${slotName}.jpg`;
}

/**
 * 画像スロットを正規化
 * 空配列の場合は全スロットをプレースホルダで初期化
 * オブジェクトの場合は欠損スロットをプレースホルダで補完
 */
function normalizeImageSlots(
  images: OnsenImageSlots | [],
  slug: string
): OnsenImageSlots {
  // 空配列の場合は全スロットをプレースホルダで初期化
  if (Array.isArray(images)) {
    const normalized: OnsenImageSlots = {};
    for (const slot of VALID_IMAGE_SLOTS) {
      normalized[slot] = getPlaceholderPath(slot);
    }
    return normalized;
  }

  // オブジェクトの場合、欠損スロットをプレースホルダで補完
  const normalized: OnsenImageSlots = { ...images };
  for (const slot of VALID_IMAGE_SLOTS) {
    if (!normalized[slot] || normalized[slot] === '') {
      normalized[slot] = getPlaceholderPath(slot);
    }
  }

  return normalized;
}

/**
 * 単一の温泉エントリを正規化
 */
export function normalizeOnsenEntry(entry: OnsenCatalogEntry): OnsenSpot {
  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.name,
    nameEn: entry.nameEn,
    location: entry.location,
    description: entry.description,
    seoTags: entry.seoTags || [],
    images: normalizeImageSlots(entry.images, entry.slug),
    region: entry.region,
    onsen: entry.onsen,
    access: entry.access,
    accommodation: entry.accommodation,
    content: entry.content,
  };
}

/**
 * カタログ全体を正規化
 */
export function normalizeOnsenCatalog(
  catalog: Record<string, OnsenCatalogEntry>
): OnsenSpot[] {
  return Object.values(catalog).map(normalizeOnsenEntry);
}

/**
 * スラッグで正規化済みエントリを取得
 */
export function getNormalizedOnsenBySlug(
  catalog: Record<string, OnsenCatalogEntry>,
  slug: string
): OnsenSpot | null {
  const entry = Object.values(catalog).find((e) => e.slug === slug);
  return entry ? normalizeOnsenEntry(entry) : null;
}

/**
 * IDで正規化済みエントリを取得
 */
export function getNormalizedOnsenById(
  catalog: Record<string, OnsenCatalogEntry>,
  id: string
): OnsenSpot | null {
  const entry = catalog[id];
  return entry ? normalizeOnsenEntry(entry) : null;
}
