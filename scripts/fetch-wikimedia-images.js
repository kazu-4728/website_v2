/**
 * ビルド前にWikimedia Commonsから画像を取得して
 * images.tsに反映するスクリプト
 * 
 * 使用方法: node scripts/fetch-wikimedia-images.js
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード
const onsenSearchTerms = {
  hakone: 'Hakone Onsen',
  'hakone-yunohana': 'Hakone Yunohana Onsen',
  'hakone-gora': 'Hakone Gora Onsen',
  'hakone-sengokuhara': 'Hakone Sengokuhara',
  kusatsu: 'Kusatsu Onsen Yubatake',
  'kusatsu-yubatake': 'Kusatsu Yubatake',
  'kusatsu-sainokawara': 'Kusatsu Sainokawara',
  kinugawa: 'Kinugawa Onsen',
  ikaho: 'Ikaho Onsen',
  nasu: 'Nasu Onsen',
  minakami: 'Minakami Onsen',
  shima: 'Shima Onsen',
  nikko: 'Nikko Yumoto Onsen',
  shiobara: 'Shiobara Onsen',
  atami: 'Atami Onsen',
  ito: 'Ito Onsen',
  shuzenji: 'Shuzenji Onsen',
  shimoda: 'Shimoda Onsen',
  yugawara: 'Yugawara Onsen',
  okutama: 'Okutama Onsen',
  chichibu: 'Chichibu Onsen',
};

async function searchWikimediaImages(searchTerm) {
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `list=search&` +
      `srsearch=${encodeURIComponent(searchTerm)}&` +
      `srnamespace=6&` +
      `srlimit=5&` +
      `origin=*`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.query?.search) {
      return null;
    }

    const imageTitles = data.query.search.map(item => item.title);
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `titles=${imageTitles.join('|')}&` +
      `prop=imageinfo&` +
      `iiprop=url|extmetadata&` +
      `origin=*`;

    const infoResponse = await fetch(imageInfoUrl);
    const infoData = await infoResponse.json();

    const pages = infoData.query?.pages || {};
    
    for (const pageId in pages) {
      const page = pages[pageId];
      const imageInfo = page.imageinfo?.[0];
      const extMetadata = imageInfo?.extmetadata || {};

      if (!imageInfo?.url) continue;

      const license = extMetadata.LicenseShortName?.value || 'Unknown';
      const licenseUrl = extMetadata.LicenseUrl?.value || '';
      const author = extMetadata.Artist?.value || extMetadata.Creator?.value || 'Unknown';

      // CCライセンスまたはパブリックドメインの画像を優先
      if (license.toLowerCase().includes('cc') || 
          license.toLowerCase().includes('public domain') ||
          license.toLowerCase().includes('pd-')) {
        return {
          url: imageInfo.url,
          author,
          license,
          licenseUrl,
          title: page.title,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching image for ${searchTerm}:`, error);
    return null;
  }
}

async function fetchAllImages() {
  console.log('Fetching images from Wikimedia Commons...\n');
  
  const results = {};
  
  for (const [onsenName, searchTerm] of Object.entries(onsenSearchTerms)) {
    console.log(`Fetching image for ${onsenName}...`);
    const image = await searchWikimediaImages(searchTerm);
    
    if (image) {
      results[onsenName] = image;
      console.log(`  ✓ Found: ${image.title}`);
      console.log(`    License: ${image.license}`);
      console.log(`    Author: ${image.author}\n`);
    } else {
      console.log(`  ✗ No suitable image found\n`);
    }
    
    // API制限を避けるため、少し待機
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 結果をJSONファイルに保存
  const outputPath = path.join(__dirname, '../data/wikimedia-images.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\nResults saved to ${outputPath}`);
  console.log(`Found ${Object.keys(results).length} images out of ${Object.keys(onsenSearchTerms).length} onsen locations.`);
}

// 実行
fetchAllImages().catch(console.error);
