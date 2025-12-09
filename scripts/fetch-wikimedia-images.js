/**
 * ビルド前にWikimedia Commonsから画像を取得して
 * images.tsに反映するスクリプト
 * 
 * 使用方法: node scripts/fetch-wikimedia-images.js
 */

const fs = require('fs');
const path = require('path');

// 各温泉地の検索キーワード（複数の検索パターンを定義）
// 【重要】「rotenburo」「露天風呂」「bath」「浴場」などの、実際に温泉が写っていることを示すキーワードを含める
const onsenSearchTerms = {
  hakone: [
    'Hakone Onsen rotenburo 箱根温泉 露天風呂',
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
    'Kinugawa Onsen bath 鬼怒川 浴場',
    '鬼怒川温泉 露天風呂',
    'Kinugawa Onsen outdoor bath 鬼怒川'
  ],
  ikaho: [
    'Ikaho Onsen rotenburo 伊香保温泉 露天風呂',
    'Ikaho Onsen bath 伊香保 浴場',
    '伊香保温泉 露天風呂',
    'Ikaho Onsen outdoor bath 伊香保'
  ],
  nasu: [
    'Nasu Onsen rotenburo 那須温泉 露天風呂',
    'Nasu Onsen bath 那須 浴場',
    '那須温泉 露天風呂',
    'Nasu Onsen outdoor bath 那須'
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
    'Atami Onsen bath 熱海 浴場',
    '熱海温泉 露天風呂',
    'Atami Onsen outdoor bath 熱海'
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
      
      // 【重要】温泉が実際に写っていることを示す必須キーワード
      // これらのキーワードのいずれかが含まれている必要がある
      const requiredOnsenKeywords = [
        'rotenburo', 'rotemburo', '露天風呂', '露天', // 露天風呂
        'yubatake', '湯畑', // 湯畑
        'bath', '浴場', '風呂', '湯船', // 浴場・湯船
        'hot spring', 'onsen', '温泉', // 温泉そのもの
        'steam', '湯気', '蒸気', // 湯気（温泉の証拠）
        'spring water', '源泉', // 源泉
      ];
      const hasRequiredOnsenKeyword = requiredOnsenKeywords.some(keyword => titleLower.includes(keyword));
      
      // 【重要】除外キーワード（温泉そのものが写っていない画像を除外）
      const excludeKeywords = [
        // 建物・施設（温泉そのものではない）
        'entrance', 'gate', 'door', '入口', '門', 'building', '建物', 'facility', '施設',
        'post office', '郵便局', 'hospital', '病院', 'center', 'センター', 'station', '駅',
        'railway', 'railroad', 'train', '鉄道', '橋', 'bridge',
        // 風景・街並み（温泉そのものが写っていない）
        'city', 'town', '市', '町', 'street', '道路', 'view', '景色', 'landscape', '風景',
        'mountain', '山', 'lake', '湖', 'river', '川', 'valley', '谷',
        // 人物・動物（温泉そのものが写っていない）
        'bust', 'statue', '銅像', 'monument', '記念碑', 'person', '人物', 'people', '人々',
        'raccoon', 'animal', 'wildlife', '動物', '野生',
        // その他
        'upstream', 'downstream', '上流', '下流',
        'pond', '池', 'postcard', '絵葉書', 'card', 'はがき',
        'tanker', 'hauling', 'vehicle', 'truck', '車両',
        '.pdf', '.doc', '.xls', '.ppt', // ドキュメントファイル
        'map', '地図', 'diagram', '図', 'chart', 'グラフ', // 地図・図表
        'sign', '看板', 'board', 'plate', '標識', // 看板
        'temple', 'shrine', '寺', '神社', 'shrine', // 寺社（温泉そのものではない）
        'restaurant', 'restaurant', 'レストラン', 'cafe', 'カフェ', // レストラン
        'hotel', 'ryokan', '旅館', '宿', 'ホテル', // 宿泊施設（温泉そのものではない）
      ];
      const shouldExclude = excludeKeywords.some(keyword => titleLower.includes(keyword));
      
      // 温泉関連の画像であることを確認（より厳格な条件）
      const isOnsenRelated = 
        hasRequiredOnsenKeyword && // 【必須】温泉が写っていることを示すキーワードが含まれている
        hasLocationInTitle && // 場所名も含まれていることを確認
        !shouldExclude; // 除外キーワードを含まない

      // 画像ファイルの拡張子を確認
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const isImageFile = imageExtensions.some(ext => titleLower.endsWith(ext));
      
      // PDFやその他のファイルを除外
      if (!isImageFile) {
        continue;
      }

      // CCライセンスまたはパブリックドメインの画像のみを対象
      const isValidLicense = 
        license.toLowerCase().includes('cc') || 
        license.toLowerCase().includes('public domain') ||
        license.toLowerCase().includes('pd-');
      
      if (!isValidLicense) {
        continue;
      }

      // 画像の優先度を計算（より確実に温泉が写っている画像を優先）
      let priority = 0;
      
      // 優先度1: 露天風呂・湯畑・浴場などの明確なキーワード
      if (titleLower.includes('rotenburo') || titleLower.includes('rotemburo') || titleLower.includes('露天風呂')) {
        priority += 10;
      }
      if (titleLower.includes('yubatake') || titleLower.includes('湯畑')) {
        priority += 10;
      }
      if (titleLower.includes('bath') || titleLower.includes('浴場') || titleLower.includes('風呂') || titleLower.includes('湯船')) {
        priority += 8;
      }
      
      // 優先度2: 湯気・蒸気（温泉の証拠）
      if (titleLower.includes('steam') || titleLower.includes('湯気') || titleLower.includes('蒸気')) {
        priority += 5;
      }
      
      // 優先度3: 源泉
      if (titleLower.includes('spring water') || titleLower.includes('源泉')) {
        priority += 5;
      }
      
      // 優先度4: 場所名が含まれている
      if (hasLocationInTitle) {
        priority += 3;
      }
      
      const imageData = {
        url: imageInfo.url,
        author,
        license,
        licenseUrl,
        title: page.title,
        priority, // 優先度を追加
      };

      // 温泉関連の画像のみを選択（フォールバック画像は使用しない）
      if (isOnsenRelated) {
        // より優先度の高い画像を選択
        if (!onsenImage || priority > (onsenImage.priority || 0)) {
          onsenImage = imageData;
        }
      }
    }

    // 温泉関連の画像のみを返す（フォールバック画像は使用しない）
    if (onsenImage) {
      return onsenImage;
    }
    
    // 温泉関連の画像が見つからない場合はnullを返す（フォールバック画像は使用しない）
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
// フォールバック画像の検索は削除（温泉が写っている画像のみを使用）
// 見つからない場合はnullを返す
async function searchFallbackOnsenImage() {
  // フォールバック画像は使用しない（精度を上げるため）
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
      console.log(`    Author: ${image.author}`);
      if (image.priority) {
        console.log(`    Priority: ${image.priority}`);
      }
      console.log('');
    } else {
      console.log(`  ✗ No suitable onsen image found (温泉が写っている画像が見つかりませんでした)`);
      console.log(`    → より具体的な検索キーワードを試すか、手動で画像を追加してください\n`);
      // フォールバック画像は使用しない（精度を上げるため）
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
