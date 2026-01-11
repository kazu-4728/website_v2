/**
 * Domain Layer: Onsen Validation
 * 
 * 温泉カタログデータの検証ロジック
 * 外部URL禁止、スロット規約チェック等
 */

import { OnsenCatalog, OnsenCatalogEntry, ImageSlotName, VALID_IMAGE_SLOTS } from './types';

/**
 * 外部URLかどうかを判定
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * ローカルパスかどうかを判定（/images/で始まる）
 */
function isLocalPath(path: string): boolean {
  return path.startsWith('/images/');
}

/**
 * 画像スロットの値が有効かチェック
 */
function validateImageSlotValue(value: string, slotName: string, onsenSlug: string): string[] {
  const errors: string[] = [];

  if (isExternalUrl(value)) {
    errors.push(
      `[${onsenSlug}] images.${slotName}: External URL detected: ${value}. Only local paths (/images/...) are allowed.`
    );
  } else if (!isLocalPath(value)) {
    errors.push(
      `[${onsenSlug}] images.${slotName}: Invalid path format: ${value}. Must start with /images/`
    );
  }

  return errors;
}

/**
 * 画像スロット名が有効かチェック
 */
function isValidSlotName(slotName: string): slotName is ImageSlotName {
  return VALID_IMAGE_SLOTS.includes(slotName as ImageSlotName);
}

/**
 * 単一の温泉エントリを検証
 */
function validateOnsenEntry(
  entry: OnsenCatalogEntry,
  onsenId: string
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // imagesフィールドの検証
  if (Array.isArray(entry.images)) {
    // 空配列の場合は警告（後で正規化で補完される）
    if (entry.images.length > 0) {
      errors.push(
        `[${onsenId}] images: Expected object with slots, but got array with ${entry.images.length} items.`
      );
    } else {
      warnings.push(`[${onsenId}] images: Empty array (will be normalized with placeholders).`);
    }
  } else if (typeof entry.images === 'object' && entry.images !== null) {
    // スロット形式の場合、各スロットを検証
    for (const [slotName, value] of Object.entries(entry.images)) {
      if (!isValidSlotName(slotName)) {
        errors.push(
          `[${onsenId}] images.${slotName}: Invalid slot name. Valid slots: ${VALID_IMAGE_SLOTS.join(', ')}`
        );
        continue;
      }

      if (typeof value === 'string') {
        const slotErrors = validateImageSlotValue(value, slotName, entry.slug);
        errors.push(...slotErrors);
      } else if (value !== undefined && value !== null) {
        errors.push(
          `[${onsenId}] images.${slotName}: Expected string path, but got ${typeof value}`
        );
      }
    }
  } else {
    errors.push(`[${onsenId}] images: Expected object or empty array, but got ${typeof entry.images}`);
  }

  // 必須フィールドの検証
  if (!entry.id) errors.push(`[${onsenId}]: Missing required field 'id'`);
  if (!entry.slug) errors.push(`[${onsenId}]: Missing required field 'slug'`);
  if (!entry.name) errors.push(`[${onsenId}]: Missing required field 'name'`);
  if (!entry.region) errors.push(`[${onsenId}]: Missing required field 'region'`);
  if (!entry.onsen) errors.push(`[${onsenId}]: Missing required field 'onsen'`);
  if (!entry.access) errors.push(`[${onsenId}]: Missing required field 'access'`);
  if (!entry.accommodation) errors.push(`[${onsenId}]: Missing required field 'accommodation'`);
  if (!entry.content) errors.push(`[${onsenId}]: Missing required field 'content'`);

  return { errors, warnings };
}

/**
 * カタログ全体を検証
 * 
 * @param catalog 検証対象のカタログ
 * @returns エラーと警告のリスト
 */
export function validateOnsenCatalog(catalog: OnsenCatalog): {
  errors: string[];
  warnings: string[];
  isValid: boolean;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!catalog || typeof catalog !== 'object') {
    return {
      errors: ['Catalog is not a valid object'],
      warnings: [],
      isValid: false,
    };
  }

  const entries = Object.entries(catalog);
  if (entries.length === 0) {
    warnings.push('Catalog is empty');
  }

  for (const [onsenId, entry] of entries) {
    const result = validateOnsenEntry(entry, onsenId);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}

/**
 * 検証エラーをフォーマットして出力
 */
export function formatValidationErrors(errors: string[], warnings: string[]): string {
  const lines: string[] = [];

  if (errors.length > 0) {
    lines.push(`❌ Validation Errors (${errors.length}):`);
    errors.forEach((err) => lines.push(`  - ${err}`));
  }

  if (warnings.length > 0) {
    lines.push(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach((warn) => lines.push(`  - ${warn}`));
  }

  return lines.join('\n');
}
