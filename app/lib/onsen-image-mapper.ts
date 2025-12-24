/**
 * 温泉画像マッパー - JSON Firstの完全実装
 * 
 * data/onsen-image-stock.jsonから画像を自動選択し、
 * 各温泉地に固有の画像を割り当てる
 */

import onsenImageStock from '../../data/onsen-image-stock.json';

export interface OnsenImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  hasOnsen: boolean;
  features?: string[];
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  recommended?: boolean;
}

// 使用済み画像のトラッキング（重複防止）
const usedImages = new Set<string>();

/**
 * 温泉地名から画像を取得（ユニークチェック付き）
 */
export function getOnsenImage(onsenKey: string): OnsenImage | null {
  const images = (onsenImageStock.onsenPages as Record<string, OnsenImage[]>)[onsenKey];
  
  if (!images || images.length === 0) {
    console.warn(`No images found for onsen: ${onsenKey}`);
    return null;
  }

  // 未使用の画像を探す
  const unusedImage = images.find(img => !usedImages.has(img.url));
  
  if (unusedImage) {
    usedImages.add(unusedImage.url);
    return unusedImage;
  }

  // すべて使用済みの場合は警告
  console.warn(`All images for ${onsenKey} are already used. Returning first image.`);
  return images[0];
}

/**
 * 温泉地名のマッピング（複数の表現に対応）
 */
const onsenNameMapping: Record<string, string> = {
  '箱根温泉郷': 'hakone',
  '箱根': 'hakone',
  '草津温泉': 'kusatsu',
  '草津': 'kusatsu',
  '鬼怒川温泉': 'kusatsu', // フォールバック: 鬼怒川のストックがないため草津パノラマを使用
  '鬼怒川': 'kusatsu',
  '伊香保温泉': 'ikaho',
  '伊香保': 'ikaho',
  '那須温泉郷': 'nasu',
  '那須': 'nasu',
  '水上温泉郷': 'atami', // フォールバック: 水上のストックがないため熱海を使用
  '水上': 'atami',
  '熱海温泉': 'atami',
  '熱海': 'atami',
  '伊東温泉': 'atami', // フォールバック
  '伊東': 'atami',
  '修善寺温泉': 'hakone', // フォールバック
  '修善寺': 'hakone',
  '下田温泉': 'atami', // フォールバック
  '下田': 'atami',
  '湯河原温泉': 'atami', // フォールバック
  '湯河原': 'atami',
};

/**
 * 温泉地名から画像を自動選択
 */
export function getImageByOnsenName(name: string): OnsenImage | null {
  const onsenKey = onsenNameMapping[name] || name.toLowerCase();
  return getOnsenImage(onsenKey);
}

/**
 * 使用済み画像をリセット（テスト用）
 */
export function resetUsedImages(): void {
  usedImages.clear();
}

/**
 * 使用済み画像のリストを取得
 */
export function getUsedImages(): string[] {
  return Array.from(usedImages);
}

/**
 * 画像がユニークかチェック
 */
export function isImageUnique(url: string): boolean {
  return !usedImages.has(url);
}

/**
 * すべての利用可能な温泉地を取得
 */
export function getAvailableOnsens(): string[] {
  return Object.keys(onsenImageStock.onsenPages);
}

/**
 * 温泉地の画像数を取得
 */
export function getImageCount(onsenKey: string): number {
  const images = (onsenImageStock.onsenPages as Record<string, OnsenImage[]>)[onsenKey];
  return images ? images.length : 0;
}
