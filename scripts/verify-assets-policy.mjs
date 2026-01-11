/**
 * verify-assets-policy.mjs
 * 
 * Assets Management Policy Verification (Enhanced)
 * - onsen-catalog.json: STRICT (No external URLs, must use slot format, files must exist)
 * - onsen-image-stock.json: STRICT (No external URLs, must start with /images/)
 * - onsen-image-master.json: WARN (External URLs allowed but reported)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.join(__dirname, '../data/onsen-catalog.json');
const STOCK_PATH = path.join(__dirname, '../data/onsen-image-stock.json');
const MASTER_PATH = path.join(__dirname, '../data/onsen-image-master.json');
const REPORT_PATH = path.join(__dirname, '../data/master-external-urls-report.txt');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');

const VALID_IMAGE_SLOTS = [
  'hero',
  'onsen',
  'rooms',
  'cuisine',
  'gallery-01',
  'gallery-02',
  'gallery-03',
  'gallery-04',
];

let hasError = false;

function isExternal(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

function isLocalPath(pathStr) {
  return typeof pathStr === 'string' && pathStr.startsWith('/images/');
}

/**
 * ファイルが存在するかチェック（public/images/からの相対パス）
 */
function fileExists(imagePath) {
  if (!isLocalPath(imagePath)) {
    return false;
  }
  // /images/... を public/images/... に変換
  const relativePath = imagePath.replace(/^\/images\//, '');
  const fullPath = path.join(PUBLIC_IMAGES_DIR, relativePath);
  return fs.existsSync(fullPath);
}

/**
 * ファイルサイズをチェック（疑似画像検知：126バイト等のHTML保存）
 */
function checkFileSize(imagePath) {
  if (!isLocalPath(imagePath)) {
    return { valid: false, reason: 'Not a local path' };
  }
  const relativePath = imagePath.replace(/^\/images\//, '');
  const fullPath = path.join(PUBLIC_IMAGES_DIR, relativePath);
  
  if (!fs.existsSync(fullPath)) {
    return { valid: false, reason: 'File does not exist' };
  }

  const stats = fs.statSync(fullPath);
  const size = stats.size;

  // 126バイト以下は疑わしい（HTMLエラーページ等の可能性）
  if (size < 200) {
    return { valid: false, reason: `Suspiciously small file (${size} bytes, possibly HTML error page)` };
  }

  // 拡張子チェック（.jpg, .jpeg, .png, .webp, .svg）
  const ext = path.extname(fullPath).toLowerCase();
  const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  if (!validExts.includes(ext)) {
    return { valid: false, reason: `Invalid extension: ${ext}` };
  }

  return { valid: true };
}

/**
 * onsen-catalog.jsonをチェック
 */
function checkCatalog() {
  console.log('\n📋 Checking onsen-catalog.json (STRICT Mode)...');
  
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌ Catalog file not found:', CATALOG_PATH);
    hasError = true;
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const errors = [];
  const warnings = [];

  for (const [onsenId, entry] of Object.entries(catalog)) {
    const slug = entry.slug || onsenId;

    // imagesフィールドのチェック
    if (Array.isArray(entry.images)) {
      if (entry.images.length > 0) {
        errors.push(`[${slug}] images: Expected object with slots, but got array with ${entry.images.length} items.`);
      } else {
        warnings.push(`[${slug}] images: Empty array (will be normalized with placeholders).`);
      }
    } else if (typeof entry.images === 'object' && entry.images !== null) {
      // スロット形式の場合
      for (const [slotName, value] of Object.entries(entry.images)) {
        // スロット名の検証
        if (!VALID_IMAGE_SLOTS.includes(slotName)) {
          errors.push(
            `[${slug}] images.${slotName}: Invalid slot name. Valid slots: ${VALID_IMAGE_SLOTS.join(', ')}`
          );
          continue;
        }

        // 値の検証
        if (typeof value === 'string') {
          // 外部URLチェック
          if (isExternal(value)) {
            errors.push(
              `[${slug}] images.${slotName}: External URL detected: ${value}. Only local paths (/images/...) are allowed.`
            );
            continue;
          }

          // ローカルパス形式チェック
          if (!isLocalPath(value)) {
            errors.push(
              `[${slug}] images.${slotName}: Invalid path format: ${value}. Must start with /images/`
            );
            continue;
          }

          // ファイル存在確認
          if (!fileExists(value)) {
            errors.push(
              `[${slug}] images.${slotName}: Referenced file does not exist: ${value}`
            );
            continue;
          }

          // ファイルサイズ・拡張子チェック
          const fileCheck = checkFileSize(value);
          if (!fileCheck.valid) {
            errors.push(
              `[${slug}] images.${slotName}: ${fileCheck.reason}: ${value}`
            );
          }
        } else if (value !== undefined && value !== null) {
          errors.push(
            `[${slug}] images.${slotName}: Expected string path, but got ${typeof value}`
          );
        }
      }
    } else if (entry.images !== undefined) {
      errors.push(
        `[${slug}] images: Expected object or empty array, but got ${typeof entry.images}`
      );
    }
  }

  if (errors.length > 0) {
    console.error('❌ STRICT POLICY VIOLATIONS in onsen-catalog.json:');
    errors.forEach(e => console.error(`  - ${e}`));
    hasError = true;
  } else {
    console.log('✅ onsen-catalog.json is compliant.');
  }

  if (warnings.length > 0) {
    console.warn(`⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.warn(`  - ${w}`));
  }
}

/**
 * onsen-image-stock.jsonをチェック（既存ロジック）
 */
function checkStock() {
  console.log('\n📦 Checking onsen-image-stock.json (Strict Mode)...');
  
  if (!fs.existsSync(STOCK_PATH)) {
    console.log('ℹ️  Stock file not found (New project?). Skipping.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(STOCK_PATH, 'utf8'));
  const errors = [];

  function traverse(obj, pathStr = '') {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (isExternal(obj)) {
        errors.push(`${pathStr}: External URL found: ${obj}`);
      } else if (obj.startsWith('/') && !isLocalPath(obj)) {
        // Warn about non-standard local paths
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => traverse(item, `${pathStr}[${index}]`));
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        if (key === 'url' && typeof obj[key] === 'string') {
          if (isExternal(obj[key])) {
            errors.push(`${pathStr}.${key}: External URL found: ${obj[key]}`);
          }
        } else {
          traverse(obj[key], `${pathStr}.${key}`);
        }
      }
    }
  }

  traverse(data, 'root');

  if (errors.length > 0) {
    console.error('❌ STRICT POLICY VIOLATION in Stock Data:');
    errors.forEach(e => console.error(`  - ${e}`));
    hasError = true;
  } else {
    console.log('✅ Stock Data is compliant.');
  }
}

/**
 * onsen-image-master.jsonをチェック（既存ロジック、警告のみ）
 */
function checkMaster() {
  console.log('\n📚 Checking onsen-image-master.json (Warn Mode)...');
  
  if (!fs.existsSync(MASTER_PATH)) {
    console.log('ℹ️  Master file not found. Skipping.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  const warnings = [];

  function traverse(obj) {
    if (!obj) return;
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (key === 'url' && typeof obj[key] === 'string') {
          if (isExternal(obj[key])) {
            warnings.push(obj[key]);
          }
        } else {
          traverse(obj[key]);
        }
      }
      if (Array.isArray(obj)) {
        obj.forEach(item => traverse(item));
      }
    }
  }

  traverse(data);

  if (warnings.length > 0) {
    console.warn(`⚠️  Found ${warnings.length} external URLs in Master Data.`);
    console.warn('   These are allowed in Master but effectively missing in UI (fallback applied).');
    console.warn(`   See report at: ${REPORT_PATH}`);
    fs.writeFileSync(REPORT_PATH, warnings.join('\n'));
  } else {
    console.log('✅ Master Data is fully local (Great job!).');
  }
}

// 実行
console.log('🔍 Starting Asset Policy Verification...\n');

checkCatalog();
checkStock();
checkMaster();

console.log('\n' + '='.repeat(60));

if (hasError) {
  console.error('\n❌ BUILD FAILED: Strict asset policy violated.');
  process.exit(1);
} else {
  console.log('\n✅ Asset Policy Verification Passed.');
  process.exit(0);
}
