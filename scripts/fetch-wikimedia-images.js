/**
 * ビルド前にWikimedia Commonsから画像を取得して
 * images.tsに反映するスクリプト
 * 
 * 使用方法: node scripts/fetch-wikimedia-images.js
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード（より具体的に温泉画像を検索）
const onsenSearchTerms = {
  hakone: 'Hakone Onsen hot spring 温泉',
  'hakone-yunohana': 'Hakone Yunohana Onsen 箱根湯本 温泉',
  'hakone-gora': 'Hakone Gora Onsen 強羅 温泉 露天風呂',
  'hakone-sengokuhara': 'Hakone Sengokuhara Onsen 仙石原 温泉',
  kusatsu: 'Kusatsu Onsen Yubatake 草津温泉 湯畑',
  'kusatsu-yubatake': 'Kusatsu Yubatake 草津 湯畑 温泉',
  'kusatsu-sainokawara': 'Kusatsu Sainokawara Onsen 西の河原 露天風呂',
  kinugawa: 'Kinugawa Onsen 鬼怒川温泉 露天風呂',
  ikaho: 'Ikaho Onsen 伊香保温泉 石段',
  nasu: 'Nasu Onsen 那須温泉 露天風呂',
  minakami: 'Minakami Onsen 水上温泉 露天風呂',
  shima: 'Shima Onsen 四万温泉 露天風呂',
  nikko: 'Nikko Yumoto Onsen 日光湯元温泉',
  shiobara: 'Shiobara Onsen 塩原温泉 露天風呂',
  atami: 'Atami Onsen 熱海温泉 露天風呂',
  ito: 'Ito Onsen 伊東温泉 露天風呂',
  shuzenji: 'Shuzenji Onsen 修善寺温泉 露天風呂',
  shimoda: 'Shimoda Onsen 下田温泉 露天風呂',
  yugawara: 'Yugawara Onsen 湯河原温泉 露天風呂',
  okutama: 'Okutama Onsen 奥多摩温泉 露天風呂',
  chichibu: 'Chichibu Onsen 秩父温泉 露天風呂',
};

async function searchWikimediaImages(searchTerm) {
  try {
    // まず通常の検索を試す
    let apiUrl = `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `list=search&` +
      `srsearch=${encodeURIComponent(searchTerm)}&` +
      `srnamespace=6&` +
      `srlimit=20&` +
      `origin=*`;

    let response = await fetch(apiUrl);
    let data = await response.json();

    // 検索結果が少ない場合は、カテゴリ検索も試す
    if (!data.query?.search || data.query.search.length < 5) {
      // カテゴリ検索を試す（例: "Category:Hakone Onsen"）
      const categorySearch = searchTerm.replace(/Onsen|温泉/g, '').trim() + ' Onsen';
      apiUrl = `https://commons.wikimedia.org/w/api.php?` +
        `action=query&` +
        `format=json&` +
        `list=categorymembers&` +
        `cmtitle=Category:${encodeURIComponent(categorySearch)}&` +
        `cmnamespace=6&` +
        `cmlimit=20&` +
        `origin=*`;
      
      response = await fetch(apiUrl);
      data = await response.json();
      
      if (data.query?.categorymembers) {
        // カテゴリメンバーを検索結果形式に変換
        data.query.search = data.query.categorymembers.map((item) => ({ title: item.title }));
      }
    }

    if (!data.query?.search || data.query.search.length === 0) {
      return null;
    }

    const imageTitles = data.query.search.map((item) => item.title);
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
    
    // 温泉関連の画像を優先的に探す
    let onsenImage = null;
    let fallbackImage = null;

    for (const pageId in pages) {
      const page = pages[pageId];
      const imageInfo = page.imageinfo?.[0];
      const extMetadata = imageInfo?.extmetadata || {};

      if (!imageInfo?.url) continue;

      const license = extMetadata.LicenseShortName?.value || 'Unknown';
      const licenseUrl = extMetadata.LicenseUrl?.value || '';
      const author = extMetadata.Artist?.value || extMetadata.Creator?.value || 'Unknown';

      // タイトルに「onsen」「hot spring」「温泉」「露天風呂」「rotemburo」が含まれる画像を優先
      const titleLower = page.title.toLowerCase();
      const isOnsenRelated = 
        titleLower.includes('onsen') ||
        titleLower.includes('hot spring') ||
        titleLower.includes('温泉') ||
        titleLower.includes('露天風呂') ||
        titleLower.includes('rotemburo') ||
        titleLower.includes('yubatake') ||
        titleLower.includes('湯畑') ||
        titleLower.includes('rotemburo') ||
        titleLower.includes('rotenburo');

      // 除外するキーワード（鉄道、駅、市街地など）
      const excludeKeywords = [
        'railway', 'railroad', 'train', 'station', '駅',
        'city', 'town', '市', '町', 'street', '道路',
        'bust', 'statue', '銅像', 'monument', '記念碑'
      ];
      const shouldExclude = excludeKeywords.some(keyword => titleLower.includes(keyword));

      // CCライセンスまたはパブリックドメインの画像を優先
      if (!shouldExclude && 
          (license.toLowerCase().includes('cc') || 
          license.toLowerCase().includes('public domain') ||
          license.toLowerCase().includes('pd-'))) {
        const imageData = {
          url: imageInfo.url,
          author,
          license,
          licenseUrl,
          title: page.title,
        };

        // 温泉関連の画像を優先
        if (isOnsenRelated) {
          onsenImage = imageData;
        } else if (!fallbackImage) {
          // フォールバック画像（温泉関連でないが、除外キーワードも含まない）
          fallbackImage = imageData;
        }
      }
    }

    // 温泉関連の画像を優先的に返す
    // 見つからない場合は、フォールバック画像も使用（除外キーワードを含まない限り）
    if (onsenImage) {
      return onsenImage;
    }
    
    // フォールバック画像がある場合は使用
    if (fallbackImage) {
      console.warn(`  ⚠ Using fallback image (not explicitly onsen-related): ${fallbackImage.title}`);
      return fallbackImage;
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
