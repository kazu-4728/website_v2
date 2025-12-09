/**
 * 複数の無料画像APIを使用して温泉画像を取得するスクリプト
 * 
 * 対応API:
 * 1. Wikimedia Commons API (無料、登録不要)
 * 2. Pixabay API (無料、登録必要)
 * 3. Pexels API (無料、登録必要)
 * 4. Unsplash API (無料、登録必要)
 * 
 * 使用方法: 
 *   node scripts/fetch-onsen-images-multi-api.js
 * 
 * 環境変数（オプション）:
 *   PIXABAY_API_KEY - Pixabay APIキー
 *   PEXELS_API_KEY - Pexels APIキー
 *   UNSPLASH_ACCESS_KEY - Unsplash APIキー
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード（複数の検索パターンを定義）
// 【重要】「rotenburo」「露天風呂」「bath」「浴場」などの、実際に温泉が写っていることを示すキーワードを含める
const onsenSearchTerms = {
  hakone: [
    'Hakone Onsen rotenburo 箱根温泉 露天風呂',
    'Hakone Gora Onsen rotenburo 箱根強羅 露天風呂',
    'Hakone Ashinoyu Onsen 箱根芦ノ湯 露天風呂',
    'Hakone Onsen bath 箱根温泉 浴場',
    'Hakone hot spring rotenburo 箱根 露天風呂',
    '箱根温泉 露天風呂 湯船',
    'Hakone Onsen outdoor bath 箱根 露天風呂'
  ],
  'hakone-yunohana': [
    'Hakone Yunohana Onsen rotenburo 箱根湯本 温泉 露天風呂',
    'Yunohana Onsen bath 湯本 浴場',
    '箱根湯本温泉 露天風呂 湯船',
    'Hakone Yunohana Onsen outdoor bath 箱根湯本'
  ],
  'hakone-gora': [
    'Hakone Gora Onsen rotenburo 強羅 温泉 露天風呂',
    'Gora Onsen bath 強羅 浴場',
    '強羅温泉 露天風呂',
    'Hakone Gora Onsen outdoor bath 強羅'
  ],
  'hakone-sengokuhara': [
    'Hakone Sengokuhara Onsen rotenburo 仙石原 温泉 露天風呂',
    'Sengokuhara Onsen bath 仙石原 浴場',
    '仙石原温泉 露天風呂 箱根',
    'Hakone Sengokuhara Onsen outdoor bath 仙石原'
  ],
  kusatsu: [
    'Kusatsu Onsen Yubatake 草津温泉 湯畑',
    'Kusatsu Yubatake 草津 湯畑',
    '草津温泉 湯畑',
    'Kusatsu Onsen Yubatake hot spring 草津 湯畑'
  ],
  'kusatsu-yubatake': [
    'Kusatsu Yubatake 草津 湯畑 温泉',
    'Kusatsu Yubatake hot water field 草津 湯畑',
    '草津湯畑',
    'Kusatsu Onsen Yubatake 草津 湯畑'
  ],
  'kusatsu-sainokawara': [
    'Kusatsu Sainokawara Onsen rotenburo 草津 西の河原 露天風呂',
    'Sainokawara Onsen outdoor bath 草津温泉 露天風呂',
    '草津西の河原露天風呂',
    'Kusatsu Sainokawara rotenburo 西の河原'
  ],
  kinugawa: [
    'Kinugawa Onsen rotenburo 鬼怒川温泉 露天風呂',
    'Kinugawa Kogen Onsen 鬼怒川高原 露天風呂',
    'Kinugawa Onsen bath 鬼怒川 浴場',
    '鬼怒川温泉 露天風呂',
    'Kinugawa Onsen outdoor bath 鬼怒川',
    'Kinugawa hot spring 鬼怒川 温泉'
  ],
  ikaho: [
    'Ikaho Onsen rotenburo 伊香保温泉 露天風呂',
    'Ikaho Onsen bath 伊香保 浴場',
    '伊香保温泉 露天風呂',
    'Ikaho Onsen outdoor bath 伊香保'
  ],
  nasu: [
    'Nasu Onsen rotenburo 那須温泉 露天風呂',
    'Nasu Kogen Onsen 那須高原 露天風呂',
    'Nasu Onsen bath 那須 浴場',
    '那須温泉 露天風呂',
    'Nasu Onsen outdoor bath 那須',
    'Nasu hot spring 那須 温泉'
  ],
  minakami: [
    'Minakami Onsen rotenburo 水上温泉 露天風呂',
    'Minakami Onsen bath 水上 浴場',
    '水上温泉 露天風呂 群馬',
    'Minakami Onsen outdoor bath 水上'
  ],
  shima: [
    'Shima Onsen rotenburo 四万温泉 露天風呂',
    'Shima Onsen bath 四万 浴場',
    '四万温泉 露天風呂',
    'Shima Onsen outdoor bath 四万'
  ],
  nikko: [
    'Nikko Yumoto Onsen rotenburo 日光湯元温泉 露天風呂',
    'Nikko Yumoto Onsen bath 日光湯元 浴場',
    '日光湯元温泉 露天風呂',
    'Nikko Yumoto Onsen outdoor bath 日光'
  ],
  shiobara: [
    'Shiobara Onsen rotenburo 塩原温泉 露天風呂',
    'Shiobara Onsen bath 塩原 浴場',
    '塩原温泉 露天風呂',
    'Shiobara Onsen outdoor bath 塩原'
  ],
  atami: [
    'Atami Onsen rotenburo 熱海温泉 露天風呂',
    'Atami Onsen ocean view 熱海 海の見える 露天風呂',
    'Atami Onsen bath 熱海 浴場',
    '熱海温泉 露天風呂',
    'Atami Onsen outdoor bath 熱海',
    'Atami hot spring 熱海 温泉'
  ],
  ito: [
    'Ito Onsen rotenburo 伊東温泉 露天風呂',
    'Ito Onsen bath 伊東 浴場',
    '伊東温泉 露天風呂',
    'Ito Onsen outdoor bath 伊東'
  ],
  shuzenji: [
    'Shuzenji Onsen rotenburo 修善寺温泉 露天風呂',
    'Shuzenji Onsen bath 修善寺 浴場',
    '修善寺温泉 露天風呂',
    'Shuzenji Onsen outdoor bath 修善寺'
  ],
  shimoda: [
    'Shimoda Onsen rotenburo 下田温泉 露天風呂',
    'Shimoda Onsen bath 下田 浴場',
    '下田温泉 露天風呂',
    'Shimoda Onsen outdoor bath 下田'
  ],
  yugawara: [
    'Yugawara Onsen rotenburo 湯河原温泉 露天風呂',
    'Yugawara Onsen bath 湯河原 浴場',
    '湯河原温泉 露天風呂',
    'Yugawara Onsen outdoor bath 湯河原'
  ],
  okutama: [
    'Okutama Onsen rotenburo 奥多摩温泉 露天風呂',
    'Okutama Onsen bath 奥多摩 浴場',
    '奥多摩温泉 露天風呂 東京',
    'Okutama Onsen outdoor bath 奥多摩'
  ],
  chichibu: [
    'Chichibu Onsen rotenburo 秩父温泉 露天風呂',
    'Chichibu Onsen bath 秩父 浴場',
    '秩父温泉 露天風呂',
    'Chichibu Onsen outdoor bath 秩父'
  ],
};

/**
 * Wikimedia Commons APIで画像を検索
 */
async function searchWikimediaCommons(searchTerm, limit = 10) {
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
    let bestImage = null;
    let bestPriority = 0;

    for (const pageId in pages) {
      const page = pages[pageId];
      const imageInfo = page.imageinfo?.[0];
      const extMetadata = imageInfo?.extmetadata || {};

      if (!imageInfo?.url) continue;

      const license = extMetadata.LicenseShortName?.value || 'Unknown';
      const licenseUrl = extMetadata.LicenseUrl?.value || '';
      const author = extMetadata.Artist?.value || extMetadata.Creator?.value || 'Unknown';
      const titleLower = page.title.toLowerCase();

      // 【重要】温泉が実際に写っていることを示す必須キーワード
      const requiredOnsenKeywords = [
        'rotenburo', 'rotemburo', '露天風呂', '露天',
        'yubatake', '湯畑',
        'bath', '浴場', '風呂', '湯船',
        'hot spring', 'onsen', '温泉',
        'steam', '湯気', '蒸気',
        'spring water', '源泉',
      ];
      const hasRequiredKeyword = requiredOnsenKeywords.some(keyword => titleLower.includes(keyword));

      // 除外キーワード
      const excludeKeywords = [
        'entrance', 'gate', 'door', '入口', '門', 'building', '建物', 'facility', '施設',
        'post office', '郵便局', 'hospital', '病院', 'center', 'センター', 'station', '駅',
        'railway', 'railroad', 'train', '鉄道', '橋', 'bridge',
        'city', 'town', '市', '町', 'street', '道路', 'view', '景色', 'landscape', '風景',
        'bust', 'statue', '銅像', 'monument', '記念碑', 'person', '人物', 'people', '人々',
        'raccoon', 'animal', 'wildlife', '動物', '野生',
        'hotel', 'ryokan', '旅館', '宿', 'ホテル',
        'map', '地図', 'sign', '看板', 'temple', 'shrine', '寺', '神社',
        'restaurant', 'レストラン', 'cafe', 'カフェ',
      ];
      const shouldExclude = excludeKeywords.some(keyword => titleLower.includes(keyword));

      // 画像ファイルの拡張子を確認
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const isImageFile = imageExtensions.some(ext => titleLower.endsWith(ext));
      
      if (!isImageFile) continue;

      // ライセンス確認
      const isValidLicense = 
        license.toLowerCase().includes('cc') || 
        license.toLowerCase().includes('public domain') ||
        license.toLowerCase().includes('pd-');
      
      if (!isValidLicense) continue;

      // 温泉関連の画像のみを選択
      if (hasRequiredKeyword && !shouldExclude) {
        // 優先度を計算
        let priority = 0;
        if (titleLower.includes('rotenburo') || titleLower.includes('rotemburo') || titleLower.includes('露天風呂')) {
          priority += 10;
        }
        if (titleLower.includes('yubatake') || titleLower.includes('湯畑')) {
          priority += 10;
        }
        if (titleLower.includes('bath') || titleLower.includes('浴場') || titleLower.includes('風呂') || titleLower.includes('湯船')) {
          priority += 8;
        }
        if (titleLower.includes('steam') || titleLower.includes('湯気') || titleLower.includes('蒸気')) {
          priority += 5;
        }

        if (!bestImage || priority > bestPriority) {
          bestImage = {
            url: imageInfo.url,
            author,
            license,
            licenseUrl,
            title: page.title,
            source: 'wikimedia',
            priority,
          };
          bestPriority = priority;
        }
      }
    }

    return bestImage;
  } catch (error) {
    console.error(`Error searching Wikimedia Commons:`, error);
    return null;
  }
}

/**
 * Pixabay APIで画像を検索
 */
async function searchPixabay(searchTerm) {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    return null; // APIキーがない場合はスキップ
  }

  try {
    // 英語キーワードに変換
    const englishQuery = searchTerm
      .replace(/箱根/g, 'Hakone')
      .replace(/草津/g, 'Kusatsu')
      .replace(/温泉/g, 'onsen')
      .replace(/露天風呂/g, 'rotenburo')
      .replace(/浴場/g, 'bath')
      .replace(/湯畑/g, 'yubatake');

    const apiUrl = `https://pixabay.com/api/?` +
      `key=${apiKey}&` +
      `q=${encodeURIComponent(englishQuery + ' onsen rotenburo')}&` +
      `image_type=photo&` +
      `category=places&` +
      `safesearch=true&` +
      `per_page=20`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.hits || data.hits.length === 0) {
      return null;
    }

    // 最も関連性の高い画像を選択
    for (const hit of data.hits) {
      const tags = hit.tags.toLowerCase();
      if (tags.includes('onsen') || tags.includes('hot spring') || tags.includes('rotenburo') || tags.includes('bath')) {
        return {
          url: hit.largeImageURL || hit.webformatURL,
          author: hit.user,
          license: 'Pixabay License',
          licenseUrl: 'https://pixabay.com/service/license/',
          title: hit.tags,
          source: 'pixabay',
          photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
        };
      }
    }

    // 見つからない場合は最初の画像を使用
    const hit = data.hits[0];
    return {
      url: hit.largeImageURL || hit.webformatURL,
      author: hit.user,
      license: 'Pixabay License',
      licenseUrl: 'https://pixabay.com/service/license/',
      title: hit.tags,
      source: 'pixabay',
      photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
    };
  } catch (error) {
    console.error(`Error searching Pixabay:`, error);
    return null;
  }
}

/**
 * Pexels APIで画像を検索
 */
async function searchPexels(searchTerm) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return null; // APIキーがない場合はスキップ
  }

  try {
    // 英語キーワードに変換
    const englishQuery = searchTerm
      .replace(/箱根/g, 'Hakone')
      .replace(/草津/g, 'Kusatsu')
      .replace(/温泉/g, 'onsen')
      .replace(/露天風呂/g, 'rotenburo')
      .replace(/浴場/g, 'bath');

    const apiUrl = `https://api.pexels.com/v1/search?` +
      `query=${encodeURIComponent(englishQuery + ' onsen rotenburo')}&` +
      `per_page=20`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': apiKey,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
      return null;
    }

    // 最も関連性の高い画像を選択
    for (const photo of data.photos) {
      const alt = (photo.alt || '').toLowerCase();
      if (alt.includes('onsen') || alt.includes('hot spring') || alt.includes('rotenburo') || alt.includes('bath')) {
        return {
          url: photo.src.large || photo.src.medium,
          author: photo.photographer,
          license: 'Pexels License',
          licenseUrl: 'https://www.pexels.com/license/',
          title: photo.alt || 'Pexels Photo',
          source: 'pexels',
          photographerUrl: photo.photographer_url,
        };
      }
    }

    // 見つからない場合は最初の画像を使用
    const photo = data.photos[0];
    return {
      url: photo.src.large || photo.src.medium,
      author: photo.photographer,
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
      title: photo.alt || 'Pexels Photo',
      source: 'pexels',
      photographerUrl: photo.photographer_url,
    };
  } catch (error) {
    console.error(`Error searching Pexels:`, error);
    return null;
  }
}

/**
 * Unsplash APIで画像を検索
 */
async function searchUnsplash(searchTerm) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return null; // APIキーがない場合はスキップ
  }

  try {
    // 英語キーワードに変換
    const englishQuery = searchTerm
      .replace(/箱根/g, 'Hakone')
      .replace(/草津/g, 'Kusatsu')
      .replace(/温泉/g, 'onsen')
      .replace(/露天風呂/g, 'rotenburo')
      .replace(/浴場/g, 'bath');

    const apiUrl = `https://api.unsplash.com/search/photos?` +
      `query=${encodeURIComponent(englishQuery + ' onsen rotenburo')}&` +
      `per_page=20`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }

    // 最も関連性の高い画像を選択
    for (const photo of data.results) {
      const description = (photo.description || photo.alt_description || '').toLowerCase();
      const tags = (photo.tags || []).map(t => t.title.toLowerCase()).join(' ');
      const combined = description + ' ' + tags;
      
      if (combined.includes('onsen') || combined.includes('hot spring') || combined.includes('rotenburo') || combined.includes('bath')) {
        return {
          url: photo.urls.regular || photo.urls.small,
          author: photo.user.name,
          license: 'Unsplash License',
          licenseUrl: 'https://unsplash.com/license',
          title: photo.description || photo.alt_description || 'Unsplash Photo',
          source: 'unsplash',
          photographerUrl: photo.user.links.html,
        };
      }
    }

    // 見つからない場合は最初の画像を使用
    const photo = data.results[0];
    return {
      url: photo.urls.regular || photo.urls.small,
      author: photo.user.name,
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
      title: photo.description || photo.alt_description || 'Unsplash Photo',
      source: 'unsplash',
      photographerUrl: photo.user.links.html,
    };
  } catch (error) {
    console.error(`Error searching Unsplash:`, error);
    return null;
  }
}

/**
 * 複数のAPIを順番に試して画像を取得
 */
async function searchImageMultiAPI(onsenName, searchTerms) {
  // 1. Wikimedia Commons（無料、登録不要、最優先）
  for (const searchTerm of searchTerms) {
    const result = await searchWikimediaCommons(searchTerm, 20);
    if (result && !usedImageUrls.has(result.url)) {
      usedImageUrls.add(result.url); // 使用した画像URLを記録
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 300)); // API制限を避ける
  }

  // 2. Pixabay（無料、登録必要）
  if (process.env.PIXABAY_API_KEY) {
    for (const searchTerm of searchTerms.slice(0, 2)) { // 最初の2つだけ試す
      const result = await searchPixabay(searchTerm);
      if (result && !usedImageUrls.has(result.url)) {
        usedImageUrls.add(result.url); // 使用した画像URLを記録
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 3. Pexels（無料、登録必要）
  if (process.env.PEXELS_API_KEY) {
    for (const searchTerm of searchTerms.slice(0, 2)) {
      const result = await searchPexels(searchTerm);
      if (result && !usedImageUrls.has(result.url)) {
        usedImageUrls.add(result.url); // 使用した画像URLを記録
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 4. Unsplash（無料、登録必要、レート制限が厳しい）
  if (process.env.UNSPLASH_ACCESS_KEY) {
    const result = await searchUnsplash(searchTerms[0]);
    if (result && !usedImageUrls.has(result.url)) {
      usedImageUrls.add(result.url); // 使用した画像URLを記録
      return result;
    }
  }

  return null;
}

/**
 * メイン処理
 */
async function fetchAllImages() {
  console.log('Fetching images from multiple free APIs...\n');
  console.log('Available APIs:');
  console.log(`  - Wikimedia Commons: ✓ (always available)`);
  console.log(`  - Pixabay: ${process.env.PIXABAY_API_KEY ? '✓' : '✗ (set PIXABAY_API_KEY)'}`);
  console.log(`  - Pexels: ${process.env.PEXELS_API_KEY ? '✓' : '✗ (set PEXELS_API_KEY)'}`);
  console.log(`  - Unsplash: ${process.env.UNSPLASH_ACCESS_KEY ? '✓' : '✗ (set UNSPLASH_ACCESS_KEY)'}`);
  console.log('');
  
  const results = {};
  
  for (const [onsenName, searchTerms] of Object.entries(onsenSearchTerms)) {
    console.log(`Fetching image for ${onsenName}...`);
    
    const image = await searchImageMultiAPI(onsenName, searchTerms);
    
    if (image) {
      results[onsenName] = {
        url: image.url,
        author: image.author,
        license: image.license,
        licenseUrl: image.licenseUrl || '',
        title: image.title,
        source: image.source,
      };
      console.log(`  ✓ Found (${image.source}): ${image.title}`);
      console.log(`    License: ${image.license}`);
      console.log(`    Author: ${image.author}\n`);
    } else {
      console.log(`  ✗ No suitable onsen image found\n`);
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
