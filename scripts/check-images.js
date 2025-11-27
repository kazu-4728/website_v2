#!/usr/bin/env node
/**
 * 厳格な画像チェッカー
 * - ローカル画像の存在確認
 * - 外部画像のHTTPステータス確認 (HEADリクエスト)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const appDir = path.join(__dirname, '../app');
const themesDir = path.join(__dirname, '../themes');
const publicDir = path.join(__dirname, '../public');

const errors = [];
const warnings = [];

// URLの有効性チェック
function checkUrl(url) {
  return new Promise((resolve) => {
    // Unsplash等の最適化URLパラメータを除去してベースURLでチェック（オプション）
    // 今回はそのままチェックする
    
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// ファイル探索
function findFiles(dir, ext) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      files.push(...findFiles(fullPath, ext));
    } else if (item.isFile() && item.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

// 画像パス抽出
function extractImages(content) {
  const images = new Set();
  // src="..." / src={...} / url(...)
  const patterns = [
    /src=["']([^"']+)["']/g,
    /src=\{["']([^"']+)["']\}/g,
    /url\(["']?([^"'\)]+)["']?\)/g,
    /"image":\s*"([^"]+)"/g, // JSON content
    /"bgImage":\s*"([^"]+)"/g // JSON content
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const img = match[1];
      if (img && !img.startsWith('data:')) {
        images.add(img);
      }
    }
  });
  
  return Array.from(images);
}

async function main() {
  console.log('🔍 厳格な画像チェックを開始...\n');

  // 1. ソースコードからの抽出
  const tsxFiles = findFiles(appDir, '.tsx');
  const jsonFiles = findFiles(themesDir, '.json');
  const allFiles = [...tsxFiles, ...jsonFiles];

  const imageMap = new Map(); // url -> [files]

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const images = extractImages(content);
    const relPath = path.relative(process.cwd(), file);

    for (const img of images) {
      if (!imageMap.has(img)) {
        imageMap.set(img, []);
      }
      imageMap.get(img).push(relPath);
    }
  }

  // 2. 検証
  const total = imageMap.size;
  let current = 0;
  
  for (const [img, files] of imageMap) {
    current++;
    // 進捗表示（簡易）
    if (current % 10 === 0) process.stdout.write(`\rChecking ${current}/${total}...`);

    if (img.startsWith('http://') || img.startsWith('https://')) {
      // 外部URLチェック
      const isValid = await checkUrl(img);
      if (!isValid) {
        errors.push({ image: img, files, type: 'BROKEN_EXTERNAL_LINK' });
      }
    } else if (img.startsWith('/')) {
      // ローカルファイルチェック
      const localPath = path.join(publicDir, img);
      if (!fs.existsSync(localPath)) {
        errors.push({ image: img, files, type: 'FILE_NOT_FOUND' });
      }
    }
  }
  process.stdout.write('\n\n');

  if (errors.length > 0) {
    console.error('❌ 画像エラーが見つかりました:\n');
    errors.forEach(e => {
      console.error(`  🖼️ ${e.image} (${e.type})`);
      console.error(`     参照元: ${e.files.join(', ')}`);
    });
    process.exit(1);
  }

  console.log('✅ すべての画像が有効です');
}

main();
