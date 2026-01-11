/**
 * Domain Layer: Onsen Types
 * 
 * 温泉データのドメインモデル定義
 * JSON-Firstアーキテクチャにおける型定義（SSOT: data/onsen-catalog.json）
 */

/**
 * 画像スロット形式
 * 各温泉地の画像は以下のスロットで管理される
 */
export interface OnsenImageSlots {
  /** ヒーロー画像（メイン画像） */
  hero?: string;
  /** 温泉画像 */
  onsen?: string;
  /** 客室画像 */
  rooms?: string;
  /** 料理画像 */
  cuisine?: string;
  /** ギャラリー画像1 */
  'gallery-01'?: string;
  /** ギャラリー画像2 */
  'gallery-02'?: string;
  /** ギャラリー画像3 */
  'gallery-03'?: string;
  /** ギャラリー画像4 */
  'gallery-04'?: string;
}

/**
 * 地域情報
 */
export interface OnsenRegion {
  prefecture: string;
  area: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * 温泉情報
 */
export interface OnsenInfo {
  springTypes: string[];
  ph?: number;
  temperature?: number;
  flowRate?: string;
  effects: string[];
  contraindications?: string[];
  characteristics: string[];
  waterQuality?: string;
}

/**
 * アクセス情報
 */
export interface OnsenAccess {
  nearestStation?: {
    name: string;
    line: string;
    walkingTime?: number;
    busTime?: number;
    busName?: string;
  };
  fromTokyo: {
    byTrain?: {
      time: number;
      route: string[];
      description: string;
      cost?: number;
    };
    byCar?: {
      time: number;
      distance: number;
      icName?: string;
      description: string;
    };
    byBus?: {
      time: number;
      terminal: string;
      description: string;
    };
  };
  parking?: {
    available: boolean;
    fee?: string;
    capacity?: number;
    notes?: string;
  };
}

/**
 * 宿泊・施設情報
 */
export interface OnsenAccommodation {
  dayTripAvailable: boolean;
  dayTripFacilities?: string[];
  features: string[];
}

/**
 * コンテンツ情報
 */
export interface OnsenContent {
  shortDescription: string;
  longDescription: string;
  highlights?: string[];
}

/**
 * 温泉地データ（JSONからの生データ）
 * imagesフィールドは空配列またはスロット形式のオブジェクト
 */
export interface OnsenCatalogEntry {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  location: string;
  description: string;
  seoTags?: string[];
  images: OnsenImageSlots | []; // 空配列またはスロット形式
  region: OnsenRegion;
  onsen: OnsenInfo;
  access: OnsenAccess;
  accommodation: OnsenAccommodation;
  content: OnsenContent;
}

/**
 * 正規化後の温泉地データ（内部表現）
 * imagesは必ずスロット形式で、欠損はプレースホルダで補完される
 */
export interface OnsenSpot {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  location: string;
  description: string;
  seoTags: string[];
  images: OnsenImageSlots; // 必ずスロット形式（欠損はプレースホルダ）
  region: OnsenRegion;
  onsen: OnsenInfo;
  access: OnsenAccess;
  accommodation: OnsenAccommodation;
  content: OnsenContent;
}

/**
 * カタログ全体の型
 */
export type OnsenCatalog = Record<string, OnsenCatalogEntry>;

/**
 * 有効な画像スロット名のリスト
 */
export const VALID_IMAGE_SLOTS = [
  'hero',
  'onsen',
  'rooms',
  'cuisine',
  'gallery-01',
  'gallery-02',
  'gallery-03',
  'gallery-04',
] as const;

export type ImageSlotName = typeof VALID_IMAGE_SLOTS[number];
