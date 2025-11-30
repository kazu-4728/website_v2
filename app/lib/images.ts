/**
 * テーマごとの画像管理システム
 * キーワードベースで画像を取得し、テーマに応じた画像を返す
 */

// テーマ名の型定義
export type ThemeName = 'onsen-kanto' | 'github-docs';

// Unsplash Source APIを使用したキーワードベースの画像取得
// 注意: Unsplash Source APIはランダムな画像を返すため、特定の画像を保証できない
// より確実な方法として、事前に定義された画像マッピングも提供

/**
 * Unsplash Source APIを使用してキーワードから画像URLを生成
 * @param keywords 検索キーワード（カンマ区切り）
 * @param width 画像幅
 * @param height 画像高さ
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
 * 温泉テーマ用の画像マッピング
 * 各温泉地に適した画像を事前に定義
 */
const ONSEN_KANTO_IMAGES = {
  // ヒーロー画像 - 温泉の湯気と風景
  hero: {
    main: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 温泉の湯気と風景
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop',
  },
  // 温泉地別の画像マッピング - 各温泉地に適した画像
  onsen: {
    hakone: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 箱根の温泉と富士山
    'hakone-yunohana': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 箱根湯本の温泉街
    'hakone-gora': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 強羅の高級温泉
    'hakone-sengokuhara': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920&auto=format&fit=crop', // 仙石原のススキ草原
    kusatsu: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 草津の湯畑
    'kusatsu-yubatake': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 湯畑のライトアップ
    'kusatsu-sainokawara': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 西の河原の露天風呂
    kinugawa: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920&auto=format&fit=crop', // 鬼怒川の渓谷と温泉
    ikaho: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920&auto=format&fit=crop', // 伊香保の石段街
    nasu: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1920&auto=format&fit=crop', // 那須の高原と温泉
    minakami: 'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?q=80&w=1920&auto=format&fit=crop', // 水上の渓流と温泉
    shima: 'https://images.unsplash.com/photo-1515191107209-c28698631303?q=80&w=1920&auto=format&fit=crop', // 四万の山と温泉
    nikko: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop', // 日光の自然と温泉
    shiobara: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1920&auto=format&fit=crop', // 塩原の紅葉と温泉
    atami: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=1920&auto=format&fit=crop', // 熱海の海と温泉
    ito: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1920&auto=format&fit=crop', // 伊東の海岸と温泉
    shuzenji: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1920&auto=format&fit=crop', // 修善寺の竹林と温泉
    shimoda: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop', // 下田の海と温泉
    yugawara: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1920&auto=format&fit=crop', // 湯河原の温泉
    okutama: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop', // 奥多摩の山と温泉
    chichibu: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 秩父の山と温泉
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // デフォルト（温泉の湯気）
  },
  // セクション画像
  sections: {
    'hakone-intro': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 箱根紹介
    'kusatsu-intro': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 草津紹介
    'featured-onsen': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 人気の温泉地
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop',
  },
  // CTA画像
  cta: {
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 温泉の湯気
  },
  // ブログ画像
  blog: {
    'onsen-manner': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 温泉マナー
    'onsen-effects': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // 温泉効能
    'seasonal-onsen': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920&auto=format&fit=crop', // 季節の温泉
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop',
  },
  // フィーチャー画像
  features: {
    hero: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // フィーチャーヒーロー
    'day-trip': 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1920&auto=format&fit=crop', // 日帰りプラン
    'couple': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop', // カップルプラン
    'family': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920&auto=format&fit=crop', // ファミリープラン
    default: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1920&auto=format&fit=crop',
  },
};

/**
 * GitHub Docsテーマ用の画像マッピング（既存）
 */
const GITHUB_DOCS_IMAGES = {
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
      return categoryImages[key];
    }
    
    // デフォルトが存在する場合はそれを返す
    if (categoryImages.default) {
      return categoryImages.default;
    }
  }

  // キーワードが指定されている場合はUnsplash Source APIを使用
  if (keywords) {
    return getUnsplashImageByKeywords(keywords);
  }

  // フォールバック: テーマのデフォルト画像
  if (themeImages.hero?.default) {
    return themeImages.hero.default;
  }

  // 最終フォールバック
  return 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1920&auto=format&fit=crop';
}

/**
 * 温泉地の画像を取得
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 */
export function getOnsenImage(onsenSlug: string): string {
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
