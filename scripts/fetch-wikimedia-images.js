/**
 * ビルド前にWikimedia Commonsから画像を取得して
 * images.tsに反映するスクリプト
 * 
 * 使用方法: node scripts/fetch-wikimedia-images.js
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード（複数の検索パターンを定義）
const onsenSearchTerms = {
  hakone: [
    'Hakone Onsen hot spring 温泉',
    'Hakone Onsen 箱根温泉',
    'Hakone hot spring japan',
    '箱根温泉 露天風呂'
  ],
  'hakone-yunohana': [
    'Hakone Yunohana Onsen 箱根湯本 温泉',
    'Yunohana Onsen Hakone 湯本',
    '箱根湯本温泉 湯本',
    'Hakone Yunohana Onsen japan'
  ],
  'hakone-gora': [
    'Hakone Gora Onsen 強羅 温泉 露天風呂',
    'Gora Onsen Hakone',
    '強羅温泉',
    'Hakone Onsen rotenburo'
  ],
  'hakone-sengokuhara': [
    'Hakone Sengokuhara Onsen 仙石原 温泉',
    'Sengokuhara Onsen Hakone 仙石原',
    '仙石原温泉 箱根',
    'Hakone Sengokuhara Onsen japan'
  ],
  kusatsu: [
    'Kusatsu Onsen Yubatake 草津温泉 湯畑',
    'Kusatsu Yubatake 草津 湯畑',
    '草津温泉',
    'Kusatsu hot spring japan'
  ],
  'kusatsu-yubatake': [
    'Kusatsu Yubatake 草津 湯畑 温泉',
    'Kusatsu Yubatake',
    '草津湯畑',
    'Kusatsu Onsen'
  ],
  'kusatsu-sainokawara': [
    'Kusatsu Sainokawara Onsen 草津 西の河原 露天風呂',
    'Sainokawara Onsen Kusatsu 草津温泉',
    '草津西の河原露天風呂',
    'Kusatsu Sainokawara rotenburo'
  ],
  kinugawa: [
    'Kinugawa Onsen 鬼怒川温泉 露天風呂',
    'Kinugawa hot spring',
    '鬼怒川温泉',
    'Kinugawa Onsen japan'
  ],
  ikaho: [
    'Ikaho Onsen 伊香保温泉 石段',
    'Ikaho Onsen stone steps',
    '伊香保温泉',
    'Ikaho hot spring'
  ],
  nasu: [
    'Nasu Onsen 那須温泉 露天風呂',
    'Nasu hot spring',
    '那須温泉',
    'Nasu Onsen japan'
  ],
  minakami: [
    'Minakami Onsen 水上温泉 露天風呂',
    'Minakami Onsen Gunma 水上温泉',
    '水上温泉 群馬',
    'Minakami Onsen japan Gunma'
  ],
  shima: [
    'Shima Onsen 四万温泉 露天風呂',
    'Shima hot spring',
    '四万温泉',
    'Shima Onsen japan'
  ],
  nikko: [
    'Nikko Yumoto Onsen 日光湯元温泉',
    'Nikko Yumoto hot spring',
    '日光湯元温泉',
    'Nikko Onsen'
  ],
  shiobara: [
    'Shiobara Onsen 塩原温泉 露天風呂',
    'Shiobara hot spring',
    '塩原温泉',
    'Shiobara Onsen japan'
  ],
  atami: [
    'Atami Onsen 熱海温泉 露天風呂',
    'Atami Onsen hot spring 熱海',
    '熱海温泉 温泉',
    'Atami Onsen japan hot spring'
  ],
  ito: [
    'Ito Onsen 伊東温泉 露天風呂',
    'Ito hot spring',
    '伊東温泉',
    'Ito Onsen japan'
  ],
  shuzenji: [
    'Shuzenji Onsen 修善寺温泉 露天風呂',
    'Shuzenji hot spring',
    '修善寺温泉',
    'Shuzenji Onsen japan'
  ],
  shimoda: [
    'Shimoda Onsen 下田温泉 露天風呂',
    'Shimoda hot spring',
    '下田温泉',
    'Shimoda Onsen japan'
  ],
  yugawara: [
    'Yugawara Onsen 湯河原温泉 露天風呂',
    'Yugawara hot spring',
    '湯河原温泉',
    'Yugawara Onsen japan'
  ],
  okutama: [
    'Okutama Onsen 奥多摩温泉 露天風呂',
    'Okutama Onsen Tokyo 奥多摩',
    '奥多摩温泉 東京',
    'Okutama Onsen japan Tokyo'
  ],
  chichibu: [
    'Chichibu Onsen 秩父温泉 露天風呂',
    'Chichibu hot spring',
    '秩父温泉',
    'Chichibu Onsen japan'
  ],
};

/**
 * 複数の検索キーワードで画像を検索
 * @param searchTerms 検索キーワードの配列
 */
async function searchWikimediaImagesWithMultipleTerms(searchTerms) {
  // 各検索キーワードを順番に試す
  for (const searchTerm of searchTerms) {
    const result = await searchWikimediaImages(searchTerm);
    if (result) {
      return result;
    }
    // API制限を避けるため、少し待機
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return null;
}

/**
 * 単一の検索キーワードで画像を検索
 */
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

    let response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'OnsenImageFetcher/1.0 (https://github.com/kazu-4728/website_v2)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      // HTMLが返された場合（エラーページなど）
      if (text.includes('<!DOCTYPE')) {
        return null;
      }
      throw error;
    }

    // 検索結果が少ない場合は、カテゴリ検索も試す
    if (!data.query?.search || data.query.search.length < 5) {
      // カテゴリ検索を試す（例: "Category:Hakone Onsen"）
      const categoryTerms = [
        searchTerm.replace(/Onsen|温泉|hot spring/gi, '').trim() + ' Onsen',
        searchTerm.replace(/Onsen|温泉|hot spring/gi, '').trim() + ' 温泉',
        'Hot springs in Japan',
        'Onsen in Japan'
      ];
      
      for (const categoryTerm of categoryTerms) {
        try {
          apiUrl = `https://commons.wikimedia.org/w/api.php?` +
            `action=query&` +
            `format=json&` +
            `list=categorymembers&` +
            `cmtitle=Category:${encodeURIComponent(categoryTerm)}&` +
            `cmnamespace=6&` +
            `cmlimit=20&` +
            `origin=*`;
          
          response = await fetch(apiUrl, {
            headers: {
              'User-Agent': 'OnsenImageFetcher/1.0 (https://github.com/kazu-4728/website_v2)',
            },
          });
          
          if (!response.ok) {
            continue;
          }
          
          const categoryText = await response.text();
          try {
            data = JSON.parse(categoryText);
          } catch (error) {
            if (categoryText.includes('<!DOCTYPE')) {
              continue;
            }
            throw error;
          }
          
          if (data.query?.categorymembers && data.query.categorymembers.length > 0) {
            // カテゴリメンバーを検索結果形式に変換
            data.query.search = data.query.categorymembers.map((item) => ({ title: item.title }));
            break;
          }
        } catch (error) {
          // カテゴリが見つからない場合は次を試す
          continue;
        }
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

    const infoResponse = await fetch(imageInfoUrl, {
      headers: {
        'User-Agent': 'OnsenImageFetcher/1.0 (https://github.com/kazu-4728/website_v2)',
      },
    });
    
    if (!infoResponse.ok) {
      return null;
    }
    
    const infoText = await infoResponse.text();
    let infoData;
    try {
      infoData = JSON.parse(infoText);
    } catch (error) {
      if (infoText.includes('<!DOCTYPE')) {
        return null;
      }
      throw error;
    }

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
      const searchTermLower = searchTerm.toLowerCase();
      
      // 検索キーワードに含まれる場所名をチェック
      const locationKeywords = [
        'hakone', '箱根', 'yunohana', '湯本', 'gora', '強羅', 'sengokuhara', '仙石原',
        'kusatsu', '草津', 'yubatake', '湯畑', 'sainokawara', '西の河原',
        'kinugawa', '鬼怒川', 'ikaho', '伊香保', 'nasu', '那須',
        'minakami', '水上', 'shima', '四万', 'nikko', '日光', 'yumoto', '湯元',
        'shiobara', '塩原', 'atami', '熱海', 'ito', '伊東',
        'shuzenji', '修善寺', 'shimoda', '下田', 'yugawara', '湯河原',
        'okutama', '奥多摩', 'chichibu', '秩父'
      ];
      const hasLocationInTitle = locationKeywords.some(keyword => titleLower.includes(keyword.toLowerCase()));
      
      const isOnsenRelated = 
        (titleLower.includes('onsen') ||
        titleLower.includes('hot spring') ||
        titleLower.includes('温泉') ||
        titleLower.includes('露天風呂') ||
        titleLower.includes('rotemburo') ||
        titleLower.includes('rotenburo') ||
        titleLower.includes('yubatake') ||
        titleLower.includes('湯畑') ||
        titleLower.includes('warm spring') ||
        titleLower.includes('warmwaterbronnen') ||
        titleLower.includes('湯') ||
        titleLower.includes('風呂') ||
        titleLower.includes('浴場') ||
        titleLower.includes('源泉')) &&
        hasLocationInTitle && // 場所名も含まれていることを確認
        !titleLower.includes('entrance') && // 入口は除外
        !titleLower.includes('gate') && // 門は除外
        !titleLower.includes('bridge') && // 橋は除外
        !titleLower.includes('post office') && // 郵便局は除外
        !titleLower.includes('hospital') && // 病院は除外
        !titleLower.includes('center') && // センターは除外
        !titleLower.includes('upstream') && // 上流は除外
        !titleLower.includes('downstream'); // 下流は除外

      // 画像ファイルの拡張子を確認
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const isImageFile = imageExtensions.some(ext => titleLower.endsWith(ext));
      
      // PDFやその他のファイルを除外
      if (!isImageFile) {
        continue;
      }
      
      // 除外するキーワード（鉄道、駅、市街地、入口、橋など）
      const excludeKeywords = [
        'railway', 'railroad', 'train', 'station', '駅',
        'city', 'town', '市', '町', 'street', '道路',
        'bust', 'statue', '銅像', 'monument', '記念碑',
        '.pdf', '.doc', '.xls', '.ppt', // ドキュメントファイル
        'tanker', 'hauling', 'vehicle', 'truck', // 車両関連
        'raccoon', 'animal', 'wildlife', // 動物関連
        'entrance', 'gate', 'door', '入口', '門', // 入口関連（温泉そのものではない）
        'bridge', '橋', 'upstream', 'downstream', // 橋や川の上流・下流（温泉そのものではない）
        'post office', '郵便局', 'hospital', '病院', 'center', 'センター' // 施設（温泉そのものではない）
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

/**
 * フォールバック画像を検索（一般的な温泉画像）
 * より厳格なフィルタリングで適切な温泉画像のみを取得
 */
async function searchFallbackOnsenImage() {
  const fallbackTerms = [
    'Japanese onsen hot spring 日本の温泉 露天風呂',
    'Onsen japan 温泉 露天風呂',
    'Hot spring japan rotenburo',
    'Japanese hot spring rotenburo 露天風呂',
    'Onsen rotenburo japan',
    'Hot spring bath japan'
  ];
  
  for (const term of fallbackTerms) {
    const result = await searchWikimediaImages(term);
    if (result) {
      // フォールバック画像も温泉関連であることを確認
      const titleLower = result.title.toLowerCase();
      const isOnsenRelated = 
        titleLower.includes('onsen') ||
        titleLower.includes('hot spring') ||
        titleLower.includes('温泉') ||
        titleLower.includes('露天風呂') ||
        titleLower.includes('rotemburo') ||
        titleLower.includes('rotenburo') ||
        titleLower.includes('yubatake') ||
        titleLower.includes('湯畑');
      
      // 動物や不適切な画像を除外
      const excludeKeywords = [
        'raccoon', 'animal', 'wildlife', 'tree', 'forest',
        'アライグマ', '動物', '野生', '森', '木',
        '入之波', 'hishino', '菱野', '赤沢' // 特定の場所名を除外
      ];
      const shouldExclude = excludeKeywords.some(keyword => titleLower.includes(keyword));
      
      if (isOnsenRelated && !shouldExclude) {
        return result;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return null;
}

async function fetchAllImages() {
  console.log('Fetching images from Wikimedia Commons...\n');
  
  const results = {};
  let fallbackImage = null;
  
  for (const [onsenName, searchTerms] of Object.entries(onsenSearchTerms)) {
    console.log(`Fetching image for ${onsenName}...`);
    
    // 複数の検索キーワードで試す
    const image = await searchWikimediaImagesWithMultipleTerms(searchTerms);
    
    if (image) {
      results[onsenName] = image;
      console.log(`  ✓ Found: ${image.title}`);
      console.log(`    License: ${image.license}`);
      console.log(`    Author: ${image.author}\n`);
    } else {
      console.log(`  ✗ No suitable image found`);
      
      // フォールバック画像を取得（初回のみ）
      if (!fallbackImage) {
        console.log(`  🔍 Searching for fallback onsen image...`);
        fallbackImage = await searchFallbackOnsenImage();
        if (fallbackImage) {
          console.log(`  ✓ Found fallback: ${fallbackImage.title}\n`);
        }
      }
      
      // フォールバック画像を使用
      if (fallbackImage) {
        results[onsenName] = {
          ...fallbackImage,
          title: `Fallback: ${fallbackImage.title} (used for ${onsenName})`,
        };
        console.log(`  ⚠ Using fallback image\n`);
      } else {
        console.log(`  ✗ No fallback image available\n`);
      }
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
