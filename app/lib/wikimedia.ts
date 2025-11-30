/**
 * Wikimedia Commons APIを使用した画像自動取得システム
 * 各温泉地の画像を自動的に取得し、適切なクレジット情報を管理
 */

import { ImageMetadata } from './images';

/**
 * Wikimedia Commons APIから画像を検索
 * @param searchTerm 検索キーワード（例: "Hakone Onsen", "Kusatsu hot spring"）
 * @param limit 取得件数（デフォルト: 10）
 */
export async function searchWikimediaImages(
  searchTerm: string,
  limit: number = 10
): Promise<Array<{
  title: string;
  url: string;
  thumbnail: string;
  author: string;
  license: string;
  licenseUrl: string;
}>> {
  try {
    // Wikimedia Commons APIを使用して画像を検索
    const apiUrl = `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `list=search&` +
      `srsearch=${encodeURIComponent(searchTerm)}&` +
      `srnamespace=6&` + // File namespace
      `srlimit=${limit}&` +
      `origin=*`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.query?.search) {
      return [];
    }

    // 画像の詳細情報を取得
    const imageTitles = data.query.search.map((item: any) => item.title);
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
    const results = [];

    for (const pageId in pages) {
      const page = pages[pageId];
      const imageInfo = page.imageinfo?.[0];
      const extMetadata = imageInfo?.extmetadata || {};

      if (!imageInfo?.url) continue;

      // ライセンス情報を取得
      const license = extMetadata.LicenseShortName?.value || 'Unknown';
      const licenseUrl = extMetadata.LicenseUrl?.value || '';
      const author = extMetadata.Artist?.value || extMetadata.Creator?.value || 'Unknown';

      results.push({
        title: page.title,
        url: imageInfo.url,
        thumbnail: imageInfo.thumburl || imageInfo.url,
        author,
        license,
        licenseUrl,
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching Wikimedia images:', error);
    return [];
  }
}

/**
 * 特定の温泉地の画像を取得
 * @param onsenName 温泉地名（例: "hakone", "kusatsu"）
 */
export async function getOnsenImageFromWikimedia(
  onsenName: string
): Promise<ImageMetadata | null> {
  // 温泉地名を日本語と英語の検索キーワードに変換
  const searchTerms: Record<string, string> = {
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

  const searchTerm = searchTerms[onsenName] || `${onsenName} Onsen`;
  const images = await searchWikimediaImages(searchTerm, 5);

  if (images.length === 0) {
    return null;
  }

  // 最初の画像を選択（より良い選択ロジックを実装可能）
  const image = images[0];

  // パブリックドメインかどうかを判定
  const isPublicDomain = 
    image.license.toLowerCase().includes('public domain') ||
    image.license.toLowerCase().includes('pd-');

  return {
    url: image.url,
    photographer: image.author,
    photographerUrl: image.author !== 'Unknown' ? 
      `https://commons.wikimedia.org/wiki/User:${encodeURIComponent(image.author)}` : 
      undefined,
    source: 'wikimedia',
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.title)}`,
    license: image.license,
    licenseUrl: image.licenseUrl || undefined,
    description: `${onsenName} hot spring`,
    // パブリックドメインの場合はクレジット表示を省略可能
    ...(isPublicDomain && { skipCredit: true }),
  };
}

/**
 * 事前に取得した画像データを読み込む（ビルド時に使用）
 * scripts/fetch-wikimedia-images.jsで取得した画像データを使用
 */
let cachedImageData: Record<string, {
  url: string;
  author: string;
  license: string;
  licenseUrl: string;
  title: string;
  isPlaceholder?: boolean;
}> | null = null;

async function loadCachedImageData(): Promise<Record<string, {
  url: string;
  author: string;
  license: string;
  licenseUrl: string;
  title: string;
  isPlaceholder?: boolean;
}>> {
  if (cachedImageData) {
    return cachedImageData;
  }

  try {
    // ビルド時にdata/wikimedia-images.jsonを読み込む
    const fs = await import('fs');
    const path = await import('path');
    const jsonPath = path.join(process.cwd(), 'data', 'wikimedia-images.json');
    
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      cachedImageData = JSON.parse(fileContent);
      return cachedImageData!;
    }
  } catch (error) {
    console.warn('Failed to load cached Wikimedia images:', error);
  }

  return {};
}

/**
 * キャッシュ付きで画像を取得（ビルド時に使用）
 * 事前に取得したwikimedia-images.jsonから読み込む
 */
export async function getCachedOnsenImage(
  onsenName: string
): Promise<ImageMetadata | null> {
  const imageData = await loadCachedImageData();
  const cachedImage = imageData[onsenName];

  if (cachedImage) {
    // プレースホルダー（準備中）画像かどうかを判定
    const isPlaceholder = cachedImage.title?.toLowerCase().includes('準備中') || 
                          cachedImage.title?.toLowerCase().includes('取得中') ||
                          cachedImage.isPlaceholder === true;

    // パブリックドメインかどうかを判定
    const isPublicDomain = 
      cachedImage.license.toLowerCase().includes('public domain') ||
      cachedImage.license.toLowerCase().includes('pd-') ||
      cachedImage.license.toLowerCase().includes('cc0');

    // HTMLタグを除去してauthor名を取得
    const authorMatch = cachedImage.author.match(/>([^<]+)</);
    const authorName = authorMatch ? authorMatch[1] : cachedImage.author.replace(/<[^>]*>/g, '').trim();

    return {
      url: cachedImage.url,
      photographer: authorName || 'Unknown',
      photographerUrl: cachedImage.author.includes('User:') ? 
        `https://commons.wikimedia.org/wiki/${cachedImage.author.match(/User:[^"<]+/)?.[0] || ''}` : 
        undefined,
      source: 'wikimedia',
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(cachedImage.title.replace(/^File:/, ''))}`,
      license: cachedImage.license,
      licenseUrl: cachedImage.licenseUrl || undefined,
      description: isPlaceholder ? `${onsenName} hot spring (準備中)` : `${onsenName} hot spring`,
      // パブリックドメインまたはプレースホルダーの場合はクレジット表示を省略可能
      ...((isPublicDomain || isPlaceholder) && { skipCredit: true }),
    };
  }

  // キャッシュにない場合は、APIから取得を試みる（フォールバック）
  return await getOnsenImageFromWikimedia(onsenName);
}
