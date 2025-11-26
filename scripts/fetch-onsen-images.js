#!/usr/bin/env node
/**
 * 温泉地の実際の画像を取得するスクリプト
 * 
 * Wikimedia Commons APIを使用して、各温泉地に関連する実際の画像を取得します。
 * 取得した画像URLはcontent.jsonを更新するために使用できます。
 * 
 * 使用方法:
 *   node scripts/fetch-onsen-images.js
 *   node scripts/fetch-onsen-images.js --update  # content.jsonを直接更新
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 温泉地と検索クエリのマッピング
const onsenSearchQueries = {
  'hakone': '箱根温泉',
  'hakone-yunohana': '箱根湯本',
  'hakone-gora': '強羅温泉',
  'hakone-sengokuhara': '仙石原',
  'kusatsu': '草津温泉 湯畑',
  'kusatsu-yubatake': '草津温泉 湯畑',
  'kusatsu-sainokawara': '西の河原 草津',
  'kinugawa': '鬼怒川温泉',
  'ikaho': '伊香保温泉 石段',
  'nasu': '那須温泉郷',
  'minakami': '水上温泉',
  'shima': '四万温泉',
  'nikko': '日光湯元温泉',
  'shiobara': '塩原温泉',
  'atami': '熱海温泉',
  'ito': '伊東温泉',
  'shuzenji': '修善寺温泉',
  'shimoda': '下田温泉',
  'yugawara': '湯河原温泉',
  'okutama': '奥多摩温泉',
  'chichibu': '秩父温泉',
};

// Wikimedia Commons APIで画像を検索
function searchWikimediaImages(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&srnamespace=6&srlimit=5&format=json`;
    
    https.get(url, { headers: { 'User-Agent': 'OnsenImageFetcher/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const titles = result.query?.search?.map(item => item.title) || [];
          resolve(titles);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ファイル名から画像情報を取得
function getImageInfo(title) {
  return new Promise((resolve, reject) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url|mime|size&format=json`;
    
    https.get(url, { headers: { 'User-Agent': 'OnsenImageFetcher/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const pages = result.query?.pages || {};
          const page = Object.values(pages)[0];
          const imageInfo = page?.imageinfo?.[0];
          
          if (imageInfo && imageInfo.mime?.startsWith('image/')) {
            resolve({
              url: imageInfo.url,
              width: imageInfo.width,
              height: imageInfo.height,
              title: title,
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// メイン処理
async function main() {
  const updateMode = process.argv.includes('--update');
  const results = {};
  
  console.log('🔍 温泉地の画像を検索中...\n');
  
  for (const [slug, query] of Object.entries(onsenSearchQueries)) {
    process.stdout.write(`  ${slug}: `);
    
    try {
      const titles = await searchWikimediaImages(query);
      
      if (titles.length === 0) {
        console.log('❌ 画像が見つかりませんでした');
        results[slug] = null;
        continue;
      }
      
      // 最初の有効な画像を取得
      let foundImage = null;
      for (const title of titles) {
        const info = await getImageInfo(title);
        if (info && info.width >= 800) { // 最低幅800px
          foundImage = info;
          break;
        }
      }
      
      if (foundImage) {
        console.log(`✅ ${foundImage.title.substring(0, 50)}...`);
        results[slug] = foundImage.url;
      } else {
        console.log('⚠️ 適切なサイズの画像が見つかりませんでした');
        results[slug] = null;
      }
      
      // API制限対策のため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`❌ エラー: ${error.message}`);
      results[slug] = null;
    }
  }
  
  console.log('\n📋 取得結果:');
  console.log('=' .repeat(60));
  
  let foundCount = 0;
  for (const [slug, url] of Object.entries(results)) {
    if (url) {
      console.log(`\n${slug}:`);
      console.log(`  ${url}`);
      foundCount++;
    }
  }
  
  console.log(`\n✅ ${foundCount}/${Object.keys(results).length} 件の画像を取得しました`);
  
  if (updateMode) {
    console.log('\n📝 content.jsonを更新中...');
    
    const contentPath = path.join(__dirname, '../themes/onsen-kanto/content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    
    let updatedCount = 0;
    if (content.pages?.docs) {
      for (const doc of content.pages.docs) {
        if (results[doc.slug]) {
          doc.image = results[doc.slug];
          updatedCount++;
        }
      }
    }
    
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`✅ ${updatedCount} 件の画像URLを更新しました`);
  } else {
    console.log('\n💡 content.jsonを更新するには --update オプションを使用してください:');
    console.log('   node scripts/fetch-onsen-images.js --update');
  }
  
  // JSONファイルとして結果を保存
  const outputPath = path.join(__dirname, '../.cache/onsen-images.json');
  const cacheDir = path.dirname(outputPath);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 結果を保存しました: ${outputPath}`);
}

main().catch(console.error);
