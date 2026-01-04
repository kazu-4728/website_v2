/**
 * テーマごとの画像管理システム
 * 厳格に管理された画像ストック（onsen-image-stock.json）から画像を取得する
 * JSON First原則に基づき、ハードコーディングを排除。
 */

import { getOnsenSpot, getAllOnsenIds } from './onsen-data';
import { withBasePath } from './base-path';
import stockDataRaw from '../../data/onsen-image-stock.json';

// 型定義
export type ThemeName = 'onsen-kanto' | 'github-docs';

const stockData = stockDataRaw as Record<string, StockImage[]>;

export interface StockImage {
  url: string;
  credit: string;
  roles: string[];
}

export interface ImageMetadata {
  url: string;
  photographer: string;
  photographerUrl?: string;
  source: 'unsplash' | 'wikimedia' | 'pixabay' | 'pexels' | 'catalog' | 'other' | 'stock';
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  description?: string;
  skipCredit?: boolean;
}

// Helper to convert stock image to metadata
function convertStockImage(img: StockImage, description: string): ImageMetadata {
  return {
    url: img.url,
    photographer: img.credit || 'Unknown',
    photographerUrl: '',
    source: 'stock',
    description: description,
    license: 'Unknown',
    skipCredit: false
  };
}

// Fallback Image (No Image) - withBasePathでPages対応
const FALLBACK_IMAGE_PATH = '/images/placeholder/onsen.svg';
const FALLBACK_IMAGE = withBasePath(FALLBACK_IMAGE_PATH);

/**
 * 汎用画像取得関数 (Core)
 * KeyとRoleを指定して、最適な画像を1枚取得する
 */
export function getImage(key: string, role: string = 'hero'): string {
  if (!key) return FALLBACK_IMAGE;

  const images = stockData[key];
  if (!images || images.length === 0) {
    // ストックにない場合はカタログ、それもなければフォールバック
    return FALLBACK_IMAGE;
  }

  // ロールが一致するものを探す
  let selectedUrl = images[0].url; // Default to first
  const match = images.find(img => img.roles.includes(role));
  if (match) selectedUrl = match.url;

  // 厳格なローカルパスチェック: http/httpsで始まるものは強制的にFallback
  if (selectedUrl.startsWith('http')) {
    // console.warn(`External URL blocked by policy: ${selectedUrl}`);
    return FALLBACK_IMAGE;
  }

  // ローカルパスにbasePathを付与してPages対応
  return withBasePath(selectedUrl);
}

/**
 * 温泉スラグから画像を取得
 * 旧API互換用。基本的には getImage(slug, 'hero') と同じ。
 */
export function getOnsenImage(slug: string): string {
  // カタログのエントリ確認 (存在チェックとしての利用)
  const entry = getOnsenSpot(slug);

  // ストックから優先的に取得
  const stockUrl = getImage(slug, 'hero');
  if (stockUrl !== FALLBACK_IMAGE) {
    return stockUrl;
  }

  // ストックになく、カタログのエントリがある場合 (現状カタログのimagesは空だが、将来用)
  if (entry && (entry as any).images && (entry as any).images.length > 0) {
    return (entry as any).images[0].url;
  }

  return FALLBACK_IMAGE;
}

/**
 * 温泉スラグからランダムな画像メタデータを取得
 */
export async function getOnsenImageMetadata(slug: string): Promise<ImageMetadata | null> {
  const images = stockData[slug];
  if (images && images.length > 0) {
    const img = images[Math.floor(Math.random() * images.length)];
    const entry = getOnsenSpot(slug);
    const name = entry ? entry.name : slug;
    return convertStockImage(img, `${name}`);
  }
  return null;
}

/**
 * ランダムに温泉画像を取得（ヒーロー用など）
 */
export async function fetchRandomOnsenImage(): Promise<ImageMetadata | null> {
  const keys = Object.keys(stockData);
  if (keys.length === 0) return null;

  // ランダムに5回トライ
  for (let i = 0; i < 5; i++) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    const images = stockData[key];
    if (images && images.length > 0) {
      const img = images[Math.floor(Math.random() * images.length)];
      return convertStockImage(img, `Recommended: ${key}`);
    }
  }
  return null;
}

// 互換性のためのエクスポート
export const fetchRandomOnsenImagePixabay = fetchRandomOnsenImage;
export const fetchRandomOnsenImagePexels = fetchRandomOnsenImage;

// テーマシステム用（既存互換）
export function getThemeImage(category: string, key: string, keywords?: string): string {
  if (category === 'onsen' || category === 'hero') {
    return getImage(key, 'hero');
  }
  // その他のカテゴリもキーがあれば引く
  return getImage(key, category);
}

export function getImageMetadata(category: string, key: string): ImageMetadata | null {
  const images = stockData[key];
  if (images && images.length > 0) {
    return convertStockImage(images[0], key);
  }
  return null;
}

export function getOnsenImageFromMaster(slug: string, type: string = 'hero'): string {
  return getImage(slug, type);
}

// Async wrapper just calling sync
export async function getOnsenImageAsync(
  onsenSlug: string
): Promise<string> {
  return getImage(onsenSlug, 'hero');
}

// Legacy helpers - 全て新しい getImage に委譲
export function getHeroImage(key: string = 'main'): string {
  return getImage(key, 'hero'); // key='main' -> stock['main'] (なければfallback)
}

export function getSectionImage(sectionId: string, keywords?: string): string {
  return getImage(sectionId, 'section_bg');
}

export function getCtaImage(): string {
  return getImage('common', 'cta');
}

export function getBlogImage(slug: string): string {
  return getImage(slug, 'hero');
}

export function getFeatureImage(key: string): string {
  return getImage(key, 'feature');
}

export function optimizeImageUrl(url: string): string {
  if (!url) return FALLBACK_IMAGE;

  // 外部URLのみ最適化処理を行う（ローカルパスはスキップ）
  if (url.startsWith('http')) {
    // ストックされているURLは既に最適化済みパラメータがついている前提だが、念のため
    if (url.includes('unsplash.com') && !url.includes('auto=format')) {
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('fit', 'crop');
        return urlObj.toString();
      } catch (e) {
        return url;
      }
    }
  }
  return url;
}

// Legacy Compat
export const IMAGES = {
  topics: {},
  backgrounds: {}
};
export function getTopicImage(topicId: string): string { return getImage(topicId, 'topic'); }
export function getBackgroundImage(key: any): string { return getImage(key, 'background'); }

