#!/usr/bin/env node
/**
 * 画像重複チェックツール
 * 
 * 目的: 
 * - 同一の画像URLが、異なる意味的なコンテキスト（例: 箱根と草津）で使用されていないかチェックする。
 * - 意図しない画像の使い回しを防ぐ。
 */

const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../themes');
const themeName = process.env.NEXT_PUBLIC_THEME || 'onsen-kanto';
const contentPath = path.join(themesDir, themeName, 'content.json');
const imagesDataPath = path.join(__dirname, '../data/wikimedia-images.json');

// 画像データの読み込み
let imageData = {};
try {
  if (fs.existsSync(imagesDataPath)) {
    imageData = JSON.parse(fs.readFileSync(imagesDataPath, 'utf-8'));
  }
} catch (e) {
  console.error('Failed to load image data:', e);
  process.exit(1);
}

// URLからキーへの逆引きマップ
const urlToKeys = {};
Object.entries(imageData).forEach(([key, data]) => {
  if (data.url) {
    if (!urlToKeys[data.url]) urlToKeys[data.url] = [];
    urlToKeys[data.url].push(key);
  }
});

// コンテンツの使用状況を収集
const usageMap = {}; // url -> { contexts: Set<string> }

function scanContent(obj, context = 'root') {
  if (!obj) return;

  if (typeof obj === 'string') {
    // 画像キーっぽい文字列かチェック（簡易的）
    // 本来はキー名で判断すべきだが、content.jsonの構造に依存する
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanContent(item, `${context}[${i}]`));
    return;
  }

  if (typeof obj === 'object') {
    // 画像キーが指定されている箇所を探す
    // パターン1: "image": "key"
    if (obj.image && typeof obj.image === 'string') {
      registerUsage(obj.image, context);
    }
    // パターン2: "imageKey": "key"
    if (obj.imageKey && typeof obj.imageKey === 'string') {
      registerUsage(obj.imageKey, context);
    }
    // パターン3: "bgImage": { "key": "key" }
    if (obj.bgImage && obj.bgImage.key) {
      registerUsage(obj.bgImage.key, context);
    }
    // パターン4: "images": { "main": "key", ... }
    if (obj.images) {
      Object.entries(obj.images).forEach(([k, v]) => {
        if (typeof v === 'string') registerUsage(v, `${context}.images.${k}`);
        else if (Array.isArray(v)) v.forEach((vv, i) => registerUsage(vv, `${context}.images.${k}[${i}]`));
      });
    }

    // 再帰探索
    Object.entries(obj).forEach(([k, v]) => {
      if (k !== 'image' && k !== 'imageKey' && k !== 'bgImage' && k !== 'images') {
        scanContent(v, `${context}.${k}`);
      }
    });
  }
}

function registerUsage(imageKey, context) {
  // 画像キーからURLを特定
  const data = imageData[imageKey];
  if (!data || !data.url) return; // 定義されていない、またはURLがない場合はスキップ

  const url = data.url;
  if (!usageMap[url]) usageMap[url] = new Set();
  
  // コンテキストを「エリア」レベルで丸める
  // 例: root.pages.docs[0](hakone).images.main -> hakone
  let areaContext = 'general';
  
  // 文脈からエリアを推測
  if (context.includes('hakone')) areaContext = 'hakone';
  else if (context.includes('kusatsu')) areaContext = 'kusatsu';
  else if (context.includes('kinugawa')) areaContext = 'kinugawa';
  else if (context.includes('ikaho')) areaContext = 'ikaho';
  else if (context.includes('nasu')) areaContext = 'nasu';
  else if (context.includes('nikko')) areaContext = 'nikko';
  // ... 他のエリアも必要なら追加
  
  // 明示的なエリア名が含まれていない場合、パスの上位を見る
  // content.jsonの構造依存: pages.docs[index] の slug を参照できればベストだが、
  // ここでは簡易的にパス文字列から判断
  
  usageMap[url].add({ context, area: areaContext });
}

// メイン処理
try {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
  scanContent(content);
} catch (e) {
  console.error('Failed to parse content.json:', e);
  process.exit(1);
}

// 重複チェックと報告
console.log('🔍 画像重複チェックを開始...\n');
let hasError = false;

Object.entries(usageMap).forEach(([url, usages]) => {
  const usageArray = Array.from(usages);
  if (usageArray.length <= 1) return;

  // 異なるエリアで使用されているかチェック
  const areas = new Set(usageArray.map(u => u.area).filter(a => a !== 'general'));
  
  if (areas.size > 1) {
    console.error(`❌ 不適切な重複の可能性: 以下の画像が複数のエリアで使用されています`);
    console.error(`   URL: ${url}`);
    console.error(`   使用箇所:`);
    usageArray.forEach(u => console.error(`    - ${u.context} (Area: ${u.area})`));
    console.error('');
    hasError = true;
  }
});

if (!hasError) {
  console.log('✅ 不適切な画像重複は見つかりませんでした。');
} else {
  console.log('⚠️ 画像の割り当てを確認してください。');
  // エラーにはせず警告にとどめる（CIを止めないため）
  // process.exit(1); 
}
