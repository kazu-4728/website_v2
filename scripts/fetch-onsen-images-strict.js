/**
 * 温泉画像を厳格に検索するスクリプト
 * 実際に温泉（湯船、露天風呂、浴場）が写っている画像のみを取得
 * 
 * 使用方法: 
 *   node scripts/fetch-onsen-images-strict.js
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード（温泉画像に特化）
const onsenSearchTerms = {
  hakone: [
    'Hakone Onsen rotenburo 箱根温泉 露天風呂',
    'Hakone Yunohana Onsen bath 箱根湯本 浴場',
    'Hakone Gora Onsen outdoor bath 箱根強羅 露天風呂',
  ],
  kusatsu: [
    'Kusatsu Onsen Yubatake 草津温泉 湯畑',
    'Kusatsu Yubatake hot spring 草津 湯畑',
  ],
  kinugawa: [
    'Kinugawa Onsen rotenburo 鬼怒川温泉 露天風呂',
    'Kinugawa Onsen bath 鬼怒川 浴場',
  ],
  ikaho: [
    'Ikaho Onsen rotenburo 伊香保温泉 露天風呂',
    'Ikaho Onsen bath 伊香保 浴場',
  ],
  nasu: [
    'Nasu Onsen rotenburo 那須温泉 露天風呂',
    'Nasu Onsen bath 那須 浴場',
  ],
  manza: [
    'Manza Onsen rotenburo 万座温泉 露天風呂',
    'Manza Onsen bath 万座 浴場',
  ],
  shima: [
    'Shima Onsen rotenburo 四万温泉 露天風呂',
    'Shima Onsen bath 四万 浴場',
  ],
  kamogawa: [
    'Kamogawa Onsen rotenburo 鴨川温泉 露天風呂',
    'Kamogawa Onsen bath 鴨川 浴場',
  ],
  chichibu: [
    'Chichibu Onsen rotenburo 秩父温泉 露天風呂',
    'Chichibu Onsen bath 秩父 浴場',
  ],
  yugawara: [
    'Yugawara Onsen rotenburo 湯河原温泉 露天風呂',
    'Yugawara Onsen bath 湯河原 浴場',
  ],
  takaragawa: [
    'Takaragawa Onsen rotenburo 宝川温泉 露天風呂',
    'Takaragawa Onsen bath 宝川 浴場',
  ],
  'nikko-yumoto': [
    'Nikko Yumoto Onsen rotenburo 日光湯元温泉 露天風呂',
    'Nikko Yumoto Onsen bath 日光湯元 浴場',
  ],
  yorokeikoku: [
    'Yorokeikoku Onsen rotenburo 養老渓谷温泉 露天風呂',
    'Yorokeikoku Onsen bath 養老渓谷 浴場',
  ],
  seotonoyu: [
    'Seotonoyu Onsen rotenburo 瀬音の湯 露天風呂',
    'Seotonoyu Onsen bath 瀬音の湯 浴場',
  ],
  fukuroda: [
    'Fukuroda Onsen rotenburo 袋田温泉 露天風呂',
    'Fukuroda Onsen bath 袋田 浴場',
  ],
  shiriyaki: [
    'Shiriyaki Onsen rotenburo 尻焼温泉 露天風呂',
    'Shiriyaki Onsen bath 尻焼 浴場',
  ],
  shiobara: [
    'Shiobara Onsen rotenburo 塩原温泉 露天風呂',
    'Shiobara Onsen bath 塩原 浴場',
  ],
  gora: [
    'Hakone Gora Onsen rotenburo 強羅温泉 露天風呂',
    'Gora Onsen bath 強羅 浴場',
  ],
  chuzenji: [
    'Chuzenji Onsen rotenburo 中禅寺温泉 露天風呂',
    'Chuzenji Onsen bath 中禅寺 浴場',
  ],
  katsuura: [
    'Katsuura Onsen rotenburo 勝浦温泉 露天風呂',
    'Katsuura Onsen bath 勝浦 浴場',
  ],
  yunishigawa: [
    'Yunishigawa Onsen rotenburo 湯西川温泉 露天風呂',
    'Yunishigawa Onsen bath 湯西川 浴場',
  ],
  nanasawa: [
    'Nanasawa Onsen rotenburo 七沢温泉 露天風呂',
    'Nanasawa Onsen bath 七沢 浴場',
  ],
  oarai: [
    'Oarai Onsen rotenburo 大洗温泉 露天風呂',
    'Oarai Onsen bath 大洗 浴場',
  ],
  kamikawa: [
    'Kamikawa Onsen rotenburo 神川温泉 露天風呂',
    'Kamikawa Onsen bath 神川 浴場',
  ],
  okutama: [
    'Okutama Onsen rotenburo 奥多摩温泉 露天風呂',
    'Okutama Onsen bath 奥多摩 浴場',
  ],
  kawaji: [
    'Kawaji Onsen rotenburo 川治温泉 露天風呂',
    'Kawaji Onsen bath 川治 浴場',
  ],
  sengokuhara: [
    'Hakone Sengokuhara Onsen rotenburo 仙石原温泉 露天風呂',
    'Sengokuhara Onsen bath 仙石原 浴場',
  ],
  oigami: [
    'Oigami Onsen rotenburo 老神温泉 露天風呂',
    'Oigami Onsen bath 老神 浴場',
  ],
  shirahama: [
    'Shirahama Onsen rotenburo 白浜温泉 露天風呂',
    'Shirahama Onsen bath 白浜 浴場',
  ],
  kawarayu: [
    'Kawarayu Onsen rotenburo 川原湯温泉 露天風呂',
    'Kawarayu Onsen bath 川原湯 浴場',
  ],
  atami: [
    'Atami Onsen rotenburo 熱海温泉 露天風呂',
    'Atami Onsen bath 熱海 浴場',
  ],
  minakami: [
    'Minakami Onsen rotenburo 水上温泉 露天風呂',
    'Minakami Onsen bath 水上 浴場',
  ],
};

/**
 * Wikimedia Commons APIで画像を検索（温泉画像に特化）
 */
async function searchWikimediaCommons(searchTerm, limit = 20) {
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `list=search&` +
      `srsearch=${encodeURIComponent(searchTerm)}&` +
      `srnamespace=6&` +
      `srlimit=${limit}&` +
      `origin=*`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'OnsenImageFetcher/1.0 (https://github.com/kazu-4728/website_v2)',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.query?.search || data.query.search.length === 0) {
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

    const infoResponse = await fetch(imageInfoUrl, {
      headers: {
        'User-Agent': 'OnsenImageFetcher/1.0 (https://github.com/kazu-4728/website_v2)',
      },
    });
    
    if (!infoResponse.ok) {
      return null;
    }
    
    const infoData = await infoResponse.json();
    const pages = infoData.query?.pages || {};
    
    // 温泉関連の画像を優先的に探す
    const onsenKeywords = ['onsen', 'rotenburo', '露天風呂', 'bath', '浴場', 'hot spring', '温泉', '湯船', 'yubatake', '湯畑'];
    
    for (const pageId in pages) {
      const page = pages[pageId];
      if (!page.imageinfo || page.imageinfo.length === 0) continue;
      
      const imageInfo = page.imageinfo[0];
      const title = page.title || '';
      const description = imageInfo.extmetadata?.ImageDescription?.value || '';
      const categories = imageInfo.extmetadata?.Categories?.value || '';
      
      const combinedText = (title + ' ' + description + ' ' + categories).toLowerCase();
      
      // 温泉関連のキーワードが含まれているか確認
      const hasOnsenKeyword = onsenKeywords.some(keyword => 
        combinedText.includes(keyword.toLowerCase())
      );
      
      if (hasOnsenKeyword && imageInfo.url) {
        // ライセンス情報を取得
        const license = imageInfo.extmetadata?.LicenseShortName?.value || 
                       imageInfo.extmetadata?.License?.value || 
                       'Unknown';
        const licenseUrl = imageInfo.extmetadata?.LicenseUrl?.value || '';
        const author = imageInfo.extmetadata?.Artist?.value || 
                      imageInfo.extmetadata?.Author?.value || 
                      'Unknown';
        
        return {
          url: imageInfo.url,
          author: author.replace(/<[^>]*>/g, '').trim() || 'Unknown',
          license: license,
          licenseUrl: licenseUrl,
          title: title,
          source: 'wikimedia',
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching Wikimedia Commons:`, error);
    return null;
  }
}

/**
 * 複数の検索キーワードで画像を検索
 */
async function searchImageMultiTerms(onsenName, searchTerms) {
  for (const searchTerm of searchTerms) {
    const result = await searchWikimediaCommons(searchTerm);
    if (result) {
      return result;
    }
    // API制限を避ける
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return null;
}

/**
 * メイン処理
 */
async function fetchAllImages() {
  console.log('Fetching onsen images strictly (only actual onsen images)...\n');
  
  const results = {};
  const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/onsen-image-master.json'), 'utf-8'));
  
  for (const [onsenName, searchTerms] of Object.entries(onsenSearchTerms)) {
    console.log(`Fetching onsen image for ${onsenName}...`);
    
    const image = await searchImageMultiTerms(onsenName, searchTerms);
    
    if (image) {
      // マスターデータを更新
      if (masterData[onsenName]) {
        masterData[onsenName].hero.url = image.url;
        masterData[onsenName].hero.author = image.author;
        masterData[onsenName].hero.license = image.license;
        masterData[onsenName].hero.licenseUrl = image.licenseUrl;
        masterData[onsenName].hero.alt = `${onsenName}温泉の露天風呂`;
        
        // thumbnailも更新（URLを変換）
        const thumbnailUrl = image.url.replace('/commons/', '/commons/thumb/').replace(/\/([^/]+)$/, '/800px-$1');
        masterData[onsenName].thumbnail.url = thumbnailUrl;
        masterData[onsenName].thumbnail.author = image.author;
        masterData[onsenName].thumbnail.license = image.license;
        masterData[onsenName].thumbnail.licenseUrl = image.licenseUrl;
        
        console.log(`  ✓ Updated: ${image.title}`);
      } else {
        // 新規追加
        masterData[onsenName] = {
          hero: {
            url: image.url,
            alt: `${onsenName}温泉の露天風呂`,
            source: 'wikimedia',
            quality: 'high',
            aspectRatio: '16:9',
            author: image.author,
            license: image.license,
            licenseUrl: image.licenseUrl,
          },
          thumbnail: {
            url: image.url.replace('/commons/', '/commons/thumb/').replace(/\/([^/]+)$/, '/800px-$1'),
            alt: `${onsenName}温泉のサムネイル`,
            source: 'wikimedia',
            quality: 'medium',
          },
        };
        console.log(`  ✓ Added: ${image.title}`);
      }
    } else {
      console.log(`  ✗ No suitable onsen image found for ${onsenName}`);
    }
    
    // API制限を避けるため、少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // マスターデータを保存
  const outputPath = path.join(__dirname, '../data/onsen-image-master.json');
  fs.writeFileSync(outputPath, JSON.stringify(masterData, null, 2));
  
  console.log(`\nMaster data updated: ${outputPath}`);
  console.log(`Updated ${Object.keys(results).length} images.`);
}

// 実行
fetchAllImages().catch(console.error);

