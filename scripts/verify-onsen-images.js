/**
 * 温泉画像の内容を確認するスクリプト
 * 実際の画像が温泉の画像かどうかを判定
 */

const fs = require('fs');
const path = require('path');

const imageData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/wikimedia-images.json'), 'utf-8'));

console.log('🔍 温泉画像の内容確認\n');
console.log('='.repeat(80));

// 温泉関連のキーワード
const onsenKeywords = [
  'onsen', 'hot spring', '温泉', '露天風呂', 'rotemburo', 'rotenburo',
  'yubatake', '湯畑', 'warm spring', 'warmwaterbronnen',
  '湯', '風呂', '浴場', '源泉', '湯元'
];

// 温泉ではない可能性のあるキーワード
const nonOnsenKeywords = [
  'entrance', 'station', 'railway', 'city', 'town', 'street', 'building',
  'hotel', 'resort', 'pool', 'プール', 'リゾート', 'ホテル', '駅', '入口',
  'gate', 'door', 'road', 'bridge', 'temple', 'shrine', '寺', '神社',
  'railroad', 'train', 'bus', 'vehicle', 'car', 'truck'
];

let onsenCount = 0;
let nonOnsenCount = 0;
let ambiguousCount = 0;

Object.entries(imageData).forEach(([slug, item]) => {
  const title = item.title || '';
  const titleLower = title.toLowerCase();
  
  const hasOnsenKeyword = onsenKeywords.some(kw => titleLower.includes(kw));
  const hasNonOnsenKeyword = nonOnsenKeywords.some(kw => titleLower.includes(kw));
  
  let imageType = '不明';
  if (hasOnsenKeyword && !hasNonOnsenKeyword) {
    imageType = '✓ 温泉';
    onsenCount++;
  } else if (hasNonOnsenKeyword && !hasOnsenKeyword) {
    imageType = '✗ 非温泉';
    nonOnsenCount++;
  } else if (hasOnsenKeyword && hasNonOnsenKeyword) {
    imageType = '⚠ 曖昧';
    ambiguousCount++;
  } else {
    imageType = '? 不明';
    ambiguousCount++;
  }
  
  if (imageType !== '✓ 温泉') {
    console.log(`${slug.padEnd(25)}: ${imageType.padEnd(10)} ${title.substring(0, 60)}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`温泉画像: ${onsenCount}個`);
console.log(`非温泉画像: ${nonOnsenCount}個`);
console.log(`曖昧/不明: ${ambiguousCount}個`);
console.log(`合計: ${Object.keys(imageData).length}個`);

if (nonOnsenCount > 0 || ambiguousCount > Object.keys(imageData).length * 0.3) {
  console.log('\n⚠ 警告: 非温泉画像または不明な画像が多すぎます。');
  console.log('画像を再取得することをお勧めします。');
  process.exit(1);
} else {
  console.log('\n✓ すべての画像が適切な温泉画像です。');
  process.exit(0);
}
