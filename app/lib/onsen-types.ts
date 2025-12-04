/**
 * Onsen Theme Extension Types
 * 
 * This file defines theme-specific types for the onsen-kanto theme.
 * These types extend the base theme schema defined in theme-types.ts
 * 
 * @module onsen-types
 */

import { DocPage } from './theme-types';

// ==========================================
// ONSEN DATA MODEL - Theme-Specific Extension
// ==========================================

/**
 * 温泉地の地域情報
 * Regional information for an onsen location
 */
export interface OnsenRegion {
  /** 都道府県名 (Prefecture name) */
  prefecture: string;
  /** エリア名 (Area name) */
  area: string;
  /** 座標 (Geographic coordinates) */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * 温泉情報
 * Hot spring water information
 */
export interface OnsenInfo {
  /** 泉質の種類 (Spring types) */
  springTypes: string[];
  /** pH値 (pH level) */
  ph?: number;
  /** 温度（℃） (Temperature in Celsius) */
  temperature?: number;
  /** 湧出量 (Flow rate description) */
  flowRate?: string;
  /** 効能 (Health benefits/effects) */
  effects: string[];
  /** 特徴 (Characteristics) */
  characteristics: string[];
}

/**
 * アクセス情報
 * Access information to the onsen
 */
export interface OnsenAccess {
  /** 最寄り駅情報 (Nearest station) */
  nearestStation?: {
    name: string;
    line: string;
    walkingTime?: number; // minutes
  };
  /** 東京からのアクセス (Access from Tokyo) */
  fromTokyo: {
    /** 電車でのアクセス (By train) */
    byTrain?: {
      time: number; // minutes
      description: string;
    };
    /** 車でのアクセス (By car) */
    byCar?: {
      time: number; // minutes
      distance: number; // km
      description: string;
    };
  };
  /** 駐車場情報 (Parking information) */
  parking?: {
    available: boolean;
    fee?: string;
  };
}

/**
 * 宿泊・施設情報
 * Accommodation and facility information
 */
export interface OnsenAccommodation {
  /** 日帰り入浴可能か (Day trip available) */
  dayTripAvailable: boolean;
  /** 日帰り施設リスト (Day trip facilities) */
  dayTripFacilities?: string[];
  /** 代表的な旅館 (Representative ryokan/hotels) */
  representativeRyokan?: Array<{
    name: string;
    features: string[];
    priceRange?: string;
    officialUrl?: string; // Official website URL
    mapsUrl?: string; // Google Maps URL
  }>;
  /** 施設の特徴 (Facility features) */
  features: string[];
}

/**
 * コンテンツ情報
 * Content information for display
 */
export interface OnsenContent {
  /** 短い説明文 (Short description) */
  shortDescription: string;
  /** 詳細説明文（Markdown形式） (Long description in Markdown) */
  longDescription: string;
  /** ハイライト（箇条書き） (Highlights/key points) */
  highlights?: string[];
  /** 季節ごとの楽しみ方 (Seasonal attractions) */
  seasons?: {
    spring?: string;
    summer?: string;
    autumn?: string;
    winter?: string;
  };
}

/**
 * 画像情報
 * Image references for the onsen
 */
export interface OnsenImages {
  /** メイン画像 (Main image key) */
  main: string;
  /** サムネイル画像 (Thumbnail image key) */
  thumbnail: string;
  /** ギャラリー画像 (Gallery image keys) */
  gallery?: string[];
  /** クレジット表記用キー (Credit information key) */
  credit?: string;
}

/**
 * メタ情報
 * Metadata for sorting, filtering, and relations
 */
export interface OnsenMeta {
  /** 優先度（数値が大きいほど上位表示） (Priority for sorting) */
  priority: number;
  /** タグ (Tags for filtering) */
  tags: string[];
  /** 関連温泉地のスラッグ (Related onsen slugs) */
  related: string[];
  /** 公開日 (Published date in ISO 8601) */
  publishedAt: string;
  /** 更新日 (Last updated date in ISO 8601) */
  updatedAt: string;
}

/**
 * 完全な温泉地データモデル
 * Complete onsen spot data model
 * 
 * This is added to DocPage as an optional 'onsen' field:
 * interface OnsenDocPage extends DocPage {
 *   onsen?: OnsenSpot;
 * }
 * 
 * Design principle:
 * - Extends existing DocPage structure without breaking compatibility
 * - Can be added incrementally to doc pages
 * - Maintains backward compatibility with non-onsen doc pages
 */
export interface OnsenSpot {
  /** 温泉地ID (Unique identifier) */
  id: string;
  /** URLスラッグ (URL slug, should match DocPage.slug) */
  slug: string;
  /** 温泉地名 (Name) */
  name: string;
  /** ふりがな (Name in kana) */
  nameKana: string;
  /** 英語名 (English name) */
  nameEn: string;
  /** 地域情報 (Regional information) */
  region: OnsenRegion;
  /** 温泉情報 (Hot spring information) */
  onsen: OnsenInfo;
  /** アクセス情報 (Access information) */
  access: OnsenAccess;
  /** 宿泊・施設情報 (Accommodation information) */
  accommodation: OnsenAccommodation;
  /** コンテンツ情報 (Content information) */
  content: OnsenContent;
  /** 画像情報 (Image information) */
  images: OnsenImages;
  /** メタ情報 (Metadata) */
  metadata: OnsenMeta;
  /** GoogleマップURL (Google Maps URL for the area) */
  mapsUrl?: string;
}

/**
 * Doc page with onsen extension
 * This is what the onsen-kanto theme uses for doc pages
 */
export interface OnsenDocPage extends DocPage {
  onsen?: OnsenSpot;
}

/**
 * Type guard to check if a doc page has onsen data
 */
export function isOnsenDoc(doc: DocPage): doc is OnsenDocPage {
  return 'onsen' in doc && doc.onsen !== undefined;
}

/**
 * Helper to extract onsen data from a doc page
 */
export function getOnsenData(doc: DocPage): OnsenSpot | undefined {
  if (isOnsenDoc(doc)) {
    return doc.onsen;
  }
  return undefined;
}
