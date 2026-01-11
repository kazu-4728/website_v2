/**
 * Features Layer: Onsen Repository
 * 
 * 温泉カタログデータの読み込み（server-only）
 * UIコンポーネントからは直接呼び出さず、Queries層を経由すること
 */

import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { OnsenCatalog, OnsenCatalogEntry } from '../../domain/onsen/types';
import { normalizeOnsenEntry, normalizeOnsenCatalog } from '../../domain/onsen/normalize';
import { validateOnsenCatalog, formatValidationErrors } from '../../domain/onsen/validate';
import { OnsenSpot } from '../../domain/onsen/types';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'onsen-catalog.json');

let cachedCatalog: OnsenCatalog | null = null;
let cachedNormalized: OnsenSpot[] | null = null;

/**
 * カタログJSONファイルを読み込む（server-only）
 */
async function readCatalogFile(): Promise<OnsenCatalog> {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  try {
    const fileContent = await fs.readFile(CATALOG_PATH, 'utf-8');
    const catalog = JSON.parse(fileContent) as OnsenCatalog;
    
    // 検証を実行（ビルド時にエラーを検出）
    const validation = validateOnsenCatalog(catalog);
    if (!validation.isValid) {
      const errorMessage = formatValidationErrors(validation.errors, validation.warnings);
      console.error('❌ Catalog validation failed:\n', errorMessage);
      throw new Error('Catalog validation failed. See errors above.');
    }

    if (validation.warnings.length > 0) {
      const warningMessage = formatValidationErrors([], validation.warnings);
      console.warn('⚠️  Catalog validation warnings:\n', warningMessage);
    }

    cachedCatalog = catalog;
    return catalog;
  } catch (error) {
    if (error instanceof Error && error.message.includes('validation failed')) {
      throw error;
    }
    console.error('Failed to read catalog file:', error);
    throw new Error(`Failed to read catalog file: ${CATALOG_PATH}`);
  }
}

/**
 * カタログ全体を読み込む（正規化済み）
 */
export async function readCatalog(): Promise<OnsenSpot[]> {
  if (cachedNormalized) {
    return cachedNormalized;
  }

  const catalog = await readCatalogFile();
  const normalized = normalizeOnsenCatalog(catalog);
  cachedNormalized = normalized;
  return normalized;
}

/**
 * スラッグで温泉を取得
 */
export async function getOnsenBySlug(slug: string): Promise<OnsenSpot | null> {
  const catalog = await readCatalogFile();
  const entry = Object.values(catalog).find((e) => e.slug === slug);
  return entry ? normalizeOnsenEntry(entry) : null;
}

/**
 * IDで温泉を取得
 */
export async function getOnsenById(id: string): Promise<OnsenSpot | null> {
  const catalog = await readCatalogFile();
  const entry = catalog[id];
  return entry ? normalizeOnsenEntry(entry) : null;
}

/**
 * 全温泉を取得（正規化済み）
 */
export async function getAllOnsens(): Promise<OnsenSpot[]> {
  return readCatalog();
}

/**
 * 生のカタログエントリを取得（検証・正規化前）
 * 通常は使用しない。デバッグ用途のみ。
 */
export async function getRawCatalogEntry(id: string): Promise<OnsenCatalogEntry | null> {
  const catalog = await readCatalogFile();
  return catalog[id] || null;
}
