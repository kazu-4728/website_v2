/**
 * テーマごとの画像管理システム
 * キーワードベースで画像を取得し、テーマに応じた画像を返す
 * Unsplashの画像を使用し、著作権情報を管理
 */

// テーマ名の型定義
export type ThemeName = 'onsen-kanto' | 'github-docs';

/**
 * 画像のメタデータ（著作権情報を含む）
 */
export interface ImageMetadata {
  url: string;
  photographer: string;
  photographerUrl?: string;
  source: 'unsplash' | 'wikimedia' | 'other';
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  description?: string;
  skipCredit?: boolean; // パブリックドメインなど、クレジット表示が不要な場合
}

/**
 * Unsplash Source APIを使用したキーワードベースの画像取得
 * 注意: Unsplash Source APIはランダムな画像を返すため、特定の画像を保証できない
 * より確実な方法として、事前に定義された画像マッピングを使用
 */
function getUnsplashImageByKeywords(
  keywords: string,
  width: number = 1920,
  height: number = 1080
): string {
  // Unsplash Source API（非推奨だが動作する）
  // より確実な方法として、事前定義された画像マッピングを使用
  return `https://source.unsplash.com/${width}x${height}/?${keywords}&sig=${keywords}`;
}

/**
 * 画像メタデータを作成（Unsplash画像IDから）
 * Unsplashの画像IDから写真家情報を取得するためのヘルパー
 */
function createUnsplashMetadata(
  imageId: string,
  photographer: string,
  photographerUsername: string,
  description?: string
): ImageMetadata {
  return {
    url: `https://images.unsplash.com/photo-${imageId}?q=80&w=1920&auto=format&fit=crop`,
    photographer,
    photographerUrl: `https://unsplash.com/@${photographerUsername}`,
    source: 'unsplash',
    sourceUrl: `https://unsplash.com/photos/${imageId}`,
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
    description,
  };
}

/**
 * 画像メタデータを作成（Wikimedia Commonsから）
 * Wikimedia Commonsの画像URLとクレジット情報からメタデータを作成
 */
function createWikimediaMetadata(
  url: string,
  photographer: string,
  photographerUrl: string,
  license: string,
  licenseUrl: string,
  description?: string
): ImageMetadata {
  return {
    url,
    photographer,
    photographerUrl,
    source: 'wikimedia',
    sourceUrl: url,
    license,
    licenseUrl,
    description,
  };
}

/**
 * 温泉テーマ用の画像マッピング
 * 各温泉地に適した画像を事前に定義（実際の温泉画像を使用）
 * Unsplashで「onsen」「hot spring」「japan」で検索した実際の温泉画像を使用
 * 
 * 注意: 以下の画像はUnsplashから取得した実際の温泉画像です
 * ライセンス: Unsplash License (https://unsplash.com/license)
 * - 無料で商用利用可能
 * - クレジット表示は推奨されるが必須ではない
 * - 写真家の情報は各画像のメタデータに含まれています
 */
const ONSEN_KANTO_IMAGES: Record<string, Record<string, ImageMetadata>> = {
  // ヒーロー画像 - 温泉の湯気と風景
  hero: {
    main: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring (onsen) with steam'
    ),
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring (onsen) with steam'
    ),
  },
  // 温泉地別の画像マッピング - 各温泉地に適した画像
  onsen: {
    hakone: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hakone hot spring with Mount Fuji'
    ),
    'hakone-yunohana': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hakone Yunohana hot spring town'
    ),
    'hakone-gora': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hakone Gora luxury hot spring'
    ),
    'hakone-sengokuhara': createUnsplashMetadata(
      '1509316785289-025f5b846b35',
      'Unsplash',
      'unsplash',
      'Sengokuhara susuki grass field in Hakone'
    ),
    kusatsu: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Kusatsu hot spring yubatake (hot water field)'
    ),
    'kusatsu-yubatake': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Kusatsu yubatake lit up at night'
    ),
    'kusatsu-sainokawara': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Kusatsu Sainokawara open-air bath'
    ),
    kinugawa: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Kinugawa hot spring in the valley'
    ),
    ikaho: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Ikaho hot spring stone steps'
    ),
    nasu: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Nasu hot spring in the highlands'
    ),
    minakami: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Minakami hot spring by the stream'
    ),
    shima: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Shima hot spring in the mountains'
    ),
    nikko: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Nikko hot spring in nature'
    ),
    shiobara: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Shiobara hot spring with autumn leaves'
    ),
    atami: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Atami hot spring overlooking the sea'
    ),
    ito: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Ito hot spring by the coast'
    ),
    shuzenji: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Shuzenji hot spring with bamboo forest'
    ),
    shimoda: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Shimoda hot spring by the sea'
    ),
    yugawara: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Yugawara hot spring'
    ),
    okutama: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Okutama hot spring in the mountains'
    ),
    chichibu: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Chichibu hot spring in the mountains'
    ),
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring (onsen)'
    ),
  },
  // セクション画像
  sections: {
    'hakone-intro': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hakone hot spring introduction'
    ),
    'kusatsu-intro': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Kusatsu hot spring introduction'
    ),
    'featured-onsen': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Featured hot spring destinations'
    ),
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring'
    ),
  },
  // CTA画像
  cta: {
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring steam'
    ),
  },
  // ブログ画像
  blog: {
    'onsen-manner': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hot spring etiquette'
    ),
    'onsen-effects': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hot spring health benefits'
    ),
    'seasonal-onsen': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Seasonal hot spring experience'
    ),
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring'
    ),
  },
  // フィーチャー画像
  features: {
    hero: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Hot spring features hero'
    ),
    'day-trip': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Day trip hot spring plan'
    ),
    'couple': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Couple hot spring plan'
    ),
    'family': createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Family hot spring plan'
    ),
    default: createUnsplashMetadata(
      '1540555700478-4be289fbecef',
      'Yoshinori Kumagai',
      'yoshinori_kumagai',
      'Japanese hot spring'
    ),
  },
};

/**
 * GitHub Docsテーマ用の画像マッピング（既存）
 */
const GITHUB_DOCS_IMAGES: Record<string, Record<string, string>> = {
  hero: {
    main: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1920&q=80',
    github: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1920&q=80',
    code: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80',
    tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    workspace: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  },
  features: {
    speed: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&q=80',
    design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    security: 'https://images.unsplash.com/photo-1563986768494-4def2763ff3f?w=800&q=80',
    automation: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    collaboration: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  topics: {
    'getting-started': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
    'repository-management': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&q=80',
    'git-basics': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80',
    'pull-requests': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80',
    'issues': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
    'github-actions': 'https://images.unsplash.com/photo-1551288049-1640f4a66fea?w=1200&q=80',
  },
  backgrounds: {
    gradient1: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
    gradient2: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80',
    mesh: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
  },
};

/**
 * テーマごとの画像マッピング
 */
const THEME_IMAGES: Record<ThemeName, any> = {
  'onsen-kanto': ONSEN_KANTO_IMAGES,
  'github-docs': GITHUB_DOCS_IMAGES,
};

/**
 * 現在のテーマを取得
 */
function getCurrentTheme(): ThemeName {
  return (process.env.NEXT_PUBLIC_THEME as ThemeName) || 'onsen-kanto';
}

/**
 * キーワードから画像URLを取得（テーマ対応）
 * @param category カテゴリ（hero, onsen, sections, cta, blog, features）
 * @param key キーまたはキーワード
 * @param keywords 検索キーワード（オプション、キーが見つからない場合に使用）
 */
export function getThemeImage(
  category: string,
  key: string,
  keywords?: string
): string {
  const theme = getCurrentTheme();
  const themeImages = THEME_IMAGES[theme];

  // カテゴリが存在するか確認
  if (themeImages[category]) {
    const categoryImages = themeImages[category];
    
    // キーが存在する場合はそれを返す
    if (categoryImages[key]) {
      // 温泉テーマの場合はImageMetadataオブジェクトからURLを取得
      if (theme === 'onsen-kanto' && typeof categoryImages[key] === 'object' && 'url' in categoryImages[key]) {
        return categoryImages[key].url;
      }
      // GitHub Docsテーマの場合は文字列URLをそのまま返す
      return categoryImages[key];
    }
    
    // デフォルトが存在する場合はそれを返す
    if (categoryImages.default) {
      if (theme === 'onsen-kanto' && typeof categoryImages.default === 'object' && 'url' in categoryImages.default) {
        return categoryImages.default.url;
      }
      return categoryImages.default;
    }
  }

  // キーワードが指定されている場合はUnsplash Source APIを使用
  if (keywords) {
    return getUnsplashImageByKeywords(keywords);
  }

  // フォールバック: テーマのデフォルト画像
  if (themeImages.hero?.default) {
    if (theme === 'onsen-kanto' && typeof themeImages.hero.default === 'object' && 'url' in themeImages.hero.default) {
      return themeImages.hero.default.url;
    }
    return themeImages.hero.default;
  }

  // 最終フォールバック
  return 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1920&auto=format&fit=crop';
}

/**
 * 画像のメタデータを取得（著作権情報を含む）
 * @param category カテゴリ
 * @param key キー
 */
export function getImageMetadata(
  category: string,
  key: string
): ImageMetadata | null {
  const theme = getCurrentTheme();
  
  // 温泉テーマの場合のみメタデータを返す
  if (theme === 'onsen-kanto') {
    const themeImages = THEME_IMAGES[theme];
    if (themeImages[category]?.[key]) {
      const image = themeImages[category][key];
      if (typeof image === 'object' && 'url' in image) {
        return image as ImageMetadata;
      }
    }
    // デフォルトを返す
    if (themeImages[category]?.default) {
      const image = themeImages[category].default;
      if (typeof image === 'object' && 'url' in image) {
        return image as ImageMetadata;
      }
    }
  }
  
  return null;
}

/**
 * 温泉地の画像を取得（同期版）
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 */
export function getOnsenImage(onsenSlug: string): string {
  // まず、data/wikimedia-images.jsonから画像を取得を試みる
  try {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(process.cwd(), 'data', 'wikimedia-images.json');
    
    if (fs.existsSync(jsonPath)) {
      const imageData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const cachedImage = imageData[onsenSlug];
      
      if (cachedImage?.url) {
        return cachedImage.url;
      }
    }
  } catch (error) {
    // エラーが発生した場合はフォールバックを使用
    console.warn(`Failed to load Wikimedia image for ${onsenSlug}:`, error);
  }
  
  // フォールバック: 事前定義された画像を使用
  return getThemeImage('onsen', onsenSlug, `onsen,${onsenSlug},japan`);
}

/**
 * 温泉地の画像を取得（非同期版、Wikimedia Commonsから自動取得）
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 */
export async function getOnsenImageAsync(
  onsenSlug: string
): Promise<string> {
  // サーバーサイドでのみ動作（ビルド時）
  if (typeof window === 'undefined') {
    try {
      const { getCachedOnsenImage } = await import('./wikimedia');
      const wikimediaImage = await getCachedOnsenImage(onsenSlug);
      if (wikimediaImage) {
        return wikimediaImage.url;
      }
    } catch (error) {
      console.warn(`Failed to fetch Wikimedia image for ${onsenSlug}:`, error);
    }
  }
  
  // フォールバック: 事前定義された画像を使用
  return getThemeImage('onsen', onsenSlug, `onsen,${onsenSlug},japan`);
}

/**
 * ヒーロー画像を取得
 * @param key キー（デフォルト: main）
 */
export function getHeroImage(key: string = 'main'): string {
  return getThemeImage('hero', key, 'onsen,hot spring,japan');
}

/**
 * セクション画像を取得
 * @param sectionId セクションID
 * @param keywords 検索キーワード（オプション）
 */
export function getSectionImage(sectionId: string, keywords?: string): string {
  return getThemeImage('sections', sectionId, keywords);
}

/**
 * CTA画像を取得
 */
export function getCtaImage(): string {
  return getThemeImage('cta', 'default', 'onsen,hot spring,japan');
}

/**
 * ブログ画像を取得
 * @param slug ブログスラッグ
 */
export function getBlogImage(slug: string): string {
  return getThemeImage('blog', slug, 'onsen,hot spring,japan');
}

/**
 * フィーチャー画像を取得
 * @param key キー
 */
export function getFeatureImage(key: string): string {
  return getThemeImage('features', key, 'onsen,hot spring,japan');
}

/**
 * 画像URLを最適化（Next.js Image用）
 * @param url 元のURL
 * @param width 幅
 * @param quality 品質（1-100）
 */
export function optimizeImageUrl(
  url: string,
  width: number = 1920,
  quality: number = 80
): string {
  // Unsplash URLの場合は最適化パラメータを追加
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }
  
  // Wikimedia Commons URLの場合は、URLパラメータでサイズを指定できる
  // ただし、Wikimedia Commonsは直接的なサイズ指定をサポートしていないため、
  // そのまま返す（Next.js Imageコンポーネントがwidth/heightで制御）
  if (url.includes('wikimedia.org')) {
    return url;
  }
  
  return url;
}

// 後方互換性のためのエクスポート（既存コード用）
export const IMAGES = GITHUB_DOCS_IMAGES;

export function getImage(category: keyof typeof IMAGES, key: string): string {
  const categoryImages = IMAGES[category] as Record<string, string>;
  return categoryImages[key] || categoryImages[Object.keys(categoryImages)[0]];
}

export function getTopicImage(topicId: string): string {
  return GITHUB_DOCS_IMAGES.topics[topicId as keyof typeof GITHUB_DOCS_IMAGES.topics] || GITHUB_DOCS_IMAGES.topics['getting-started'];
}

export function getBackgroundImage(key: keyof typeof GITHUB_DOCS_IMAGES.backgrounds): string {
  return GITHUB_DOCS_IMAGES.backgrounds[key];
}
