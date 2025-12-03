import { promises as fs } from 'fs';
import path from 'path';
import { getThemeImage, getOnsenImage, optimizeImageUrl } from './images';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

// ==========================================
// TEXTS CONFIG TYPE DEFINITIONS
// ==========================================

export interface TextsConfig {
  nav: {
    backLinks: {
      home: string;
      docs: string;
      blog: string;
    };
    pagination: {
      previous: string;
      next: string;
    };
  };
  pages: {
    onsenGuide: {
      title: string;
      description: string;
      defaultSubtitle: string;
    };
    contact: {
      title: string;
    };
  };
  buttons: {
    learnMore: string;
    readStory: string;
    learnMoreEn: string;
    submit: string;
  };
  form: {
    labels: {
      name: string;
      email: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      message: string;
    };
    fields: {
      email: {
        label: string;
      };
      office: {
        label: string;
      };
    };
  };
  messages: {
    notFound: {
      docs: string;
      blog: string;
      blogContent: string;
      features: string;
      contact: string;
    };
  };
  ui: {
    labels: {
      tableOfContents: string;
      documentation: string;
      readyToDeploy: string;
      interactiveDemoLoading: string;
    };
  };
}

interface ContentConfigRaw {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: {
      text: string;
      icon: string;
    };
    metadata: {
      title: string;
      description: string;
    };
  };
  navigation: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
    submenu?: Array<{ label: string; href: string }>;
  }>;
  pages: {
    home: {
      hero: HomeHeroRaw;
      sections: Array<any>;
    };
    docs?: Array<DocPageRaw>;
    blog?: {
      title: string;
      description: string;
      posts: Array<BlogPostRaw>;
    };
    features?: {
      title: string;
      description: string;
      hero: {
        title: string;
        subtitle: string;
        description: string;
        image: string | { key?: string; keywords?: string };
      };
      items: Array<{
        title: string;
        description: string;
        icon: string;
        image: string | { key?: string; keywords?: string };
      }>;
    };
    contact?: {
      title: string;
      email: string;
      office: string;
    };
  };
}

export interface ContentConfig {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: {
      text: string;
      icon: string;
    };
    metadata: {
      title: string;
      description: string;
    };
  };
  navigation: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
    submenu?: Array<{ label: string; href: string }>;
  }>;
  pages: {
    home: {
      hero: HomeHero;
      sections: Array<HomeSection>;
    };
    docs?: Array<DocPage>;
    blog?: {
      title: string;
      description: string;
      posts: Array<BlogPost>;
    };
    features?: {
      title: string;
      description: string;
      hero: {
        title: string;
        subtitle: string;
        description: string;
        image: string;
      };
      items: Array<{
        title: string;
        description: string;
        icon: string;
        image: string;
      }>;
    };
    contact?: {
      title: string;
      email: string;
      office: string;
    };
  };
  texts: TextsConfig;
}

interface HomeHero {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string; // 解決後は常に文字列
  overlay: string;
  actions: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

interface HomeHeroRaw {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string | { key?: string; keywords?: string }; // 解決前はキーまたはURL
  overlay: string;
  actions: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export interface HomeSection {
  id: string;
  type: string;
  [key: string]: any;
}

export interface SplitFeatureSection extends HomeSection {
  type: 'split-feature';
  layout: 'image-left' | 'image-right';
  chapter?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  stats?: Array<{ value: string; label: string }>;
  quote?: { text: string; author: string };
  link?: { text: string; href: string };
}

export interface GridGallerySection extends HomeSection {
  type: 'grid-gallery';
  title: string;
  subtitle?: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    image: string;
    href: string;
  }>;
}

export interface TestimonialsSection extends HomeSection {
  type: 'testimonials';
  title: string;
  items: Array<{
    content: string;
    author: string;
    role: string;
    avatar: string;
  }>;
}

export interface CtaSection extends HomeSection {
  type: 'cta-fullscreen';
  title: string;
  description: string;
  bgImage: string;
  action: {
    label: string;
    href: string;
  };
}

// ==========================================
// ONSEN DATA MODEL TYPE DEFINITIONS
// ==========================================

/**
 * 温泉地の地域情報
 */
export interface OnsenRegion {
  prefecture: string;
  area: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * 温泉情報
 */
export interface OnsenInfo {
  springTypes: string[];
  ph?: number;
  temperature?: number;
  flowRate?: string;
  effects: string[];
  characteristics: string[];
}

/**
 * アクセス情報
 */
export interface OnsenAccess {
  nearestStation?: {
    name: string;
    line: string;
    walkingTime?: number;
  };
  fromTokyo: {
    byTrain?: {
      time: number;
      description: string;
    };
    byCar?: {
      time: number;
      distance: number;
      description: string;
    };
  };
  parking?: {
    available: boolean;
    fee?: string;
  };
}

/**
 * 宿泊・施設情報
 */
export interface OnsenAccommodation {
  dayTripAvailable: boolean;
  dayTripFacilities?: string[];
  representativeRyokan?: Array<{
    name: string;
    features: string[];
    priceRange?: string;
    officialUrl?: string; // 旅館の公式サイトURL
    mapsUrl?: string; // 旅館のGoogleマップURL
  }>;
  features: string[];
}

/**
 * コンテンツ情報
 */
export interface OnsenContent {
  shortDescription: string;
  longDescription: string;
  highlights?: string[];
  seasons?: {
    spring?: string;
    summer?: string;
    autumn?: string;
    winter?: string;
  };
}

/**
 * 画像情報
 */
export interface OnsenImages {
  main: string;
  thumbnail: string;
  gallery?: string[];
  credit?: string;
}

/**
 * メタ情報
 */
export interface OnsenMeta {
  priority: number;
  tags: string[];
  related: string[];
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * 完全な温泉地データモデル
 * 既存のDocPageに紐づく形で、各docにonsenフィールドとして追加可能
 * 
 * 設計方針：
 * - 既存のpages.docs[]配列を維持しつつ、各docにonsenフィールドをoptionalで追加
 * - 独立したonsenSpots配列を作らず、既存の構造を活用することで段階的な移行が可能
 * - 既存のtitle, subtitle, description, image, contentフィールドは維持（後方互換性）
 */
export interface OnsenSpot {
  id: string;
  slug: string;
  name: string;
  nameKana: string;
  nameEn: string;
  region: OnsenRegion;
  onsen: OnsenInfo;
  access: OnsenAccess;
  accommodation: OnsenAccommodation;
  content: OnsenContent;
  images: OnsenImages;
  metadata: OnsenMeta;
  mapsUrl?: string; // 温泉エリア全体のGoogleマップURL
}

interface DocPage {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string; // 解決後は常に文字列
  content: string;
  related?: string[];
  // 新規追加：温泉地の詳細情報（optional）
  onsen?: OnsenSpot;
}

interface DocPageRaw {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string | { key?: string; keywords?: string }; // 解決前はキーまたはURL
  content: string;
  related?: string[];
  // 新規追加：温泉地の詳細情報（optional）
  onsen?: OnsenSpot;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string; // 解決後は常に文字列
  content: string;
}

interface BlogPostRaw {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string | { key?: string; keywords?: string }; // 解決前はキーまたはURL
  content: string;
}

// ==========================================
// CONTENT LOADING
// ==========================================

let cachedContent: ContentConfig | null = null;
let cachedTexts: TextsConfig | null = null;

/**
 * Load theme texts from JSON
 */
export async function loadTexts(): Promise<TextsConfig> {
  if (cachedTexts) return cachedTexts;

  const themeName = process.env.NEXT_PUBLIC_THEME || 'onsen-kanto';
  
  try {
    let textsModule;
    
    switch (themeName) {
      case 'onsen-kanto':
        textsModule = await import('../../themes/onsen-kanto/texts.json');
        break;
      case 'github-docs':
        // Fallback to onsen-kanto texts if theme doesn't have texts.json
        textsModule = await import('../../themes/onsen-kanto/texts.json');
        break;
      default:
        textsModule = await import('../../themes/onsen-kanto/texts.json');
    }

    cachedTexts = textsModule.default as TextsConfig;
    return cachedTexts;
  } catch (error) {
    console.error(`Failed to load theme texts for ${themeName}:`, error);
    // Return fallback texts
    return fallbackTexts;
  }
}

/**
 * Load theme content from JSON using static import to ensure bundling
 */
export async function loadContent(): Promise<ContentConfig> {
  if (cachedContent) return cachedContent;

  const themeName = process.env.NEXT_PUBLIC_THEME || 'onsen-kanto';
  
  try {
    // Static import for themes to ensure they are bundled by Webpack/Next.js
    // When adding a new theme, add a new case to load it
    let contentModule;
    
    switch (themeName) {
      case 'onsen-kanto':
        contentModule = await import('../../themes/onsen-kanto/content.json');
        break;
      case 'github-docs':
        contentModule = await import('../../themes/github-docs/content.json');
        break;
      default:
        // Fall back to onsen-kanto theme if theme not found
        console.warn(`Theme "${themeName}" not found, falling back to onsen-kanto`);
        contentModule = await import('../../themes/onsen-kanto/content.json');
    }

    const rawContent = contentModule.default as ContentConfigRaw;
    
    // Load texts
    const texts = await loadTexts();
    
    // 画像URLを解決（キーからURLに変換）
    const resolvedContent = resolveImageUrls(rawContent);
    cachedContent = {
      ...resolvedContent,
      texts,
    };
    return cachedContent;
  } catch (error) {
    console.error(`Failed to load theme content for ${themeName}:`, error);
    return {
      ...fallbackContent,
      texts: fallbackTexts,
    };
  }
}

/**
 * 画像URLを解決（キーからURLに変換）
 * 注意: textsフィールドは含まない。loadContent内で後から追加される。
 */
function resolveImageUrls(content: ContentConfigRaw): Omit<ContentConfig, 'texts'> {
  // ヒーロー画像を解決
  const heroBgImage = resolveImageUrl(
    content.pages.home.hero.bgImage,
    'hero',
    'main',
    'onsen,hot spring,japan'
  );

  const resolved: Omit<ContentConfig, 'texts'> = {
    ...content,
    pages: {
      ...content.pages,
      home: {
        ...content.pages.home,
        hero: {
          ...content.pages.home.hero,
          bgImage: heroBgImage,
        },
        sections: content.pages.home.sections.map(section => {
          const resolvedSection: any = { ...section };
          
          if (section.type === 'split-feature' && section.image) {
            resolvedSection.image = resolveImageUrl(
              section.image,
              'sections',
              section.id,
              'onsen,hot spring,japan'
            );
          }
          
          if (section.type === 'cta-fullscreen' && section.bgImage) {
            resolvedSection.bgImage = resolveImageUrl(
              section.bgImage,
              'cta',
              'default',
              'onsen,hot spring,japan'
            );
          }
          
          if (section.type === 'grid-gallery' && section.items) {
            resolvedSection.items = section.items.map((item: any) => ({
              ...item,
              image: resolveImageUrl(
                item.image,
                'onsen',
                item.href?.replace('/docs/', '') || 'default',
                'onsen,hot spring,japan'
              ),
            }));
          }
          
          return resolvedSection;
        }),
      },
      docs: content.pages.docs?.map(doc => ({
        ...doc,
        image: resolveImageUrl(
          doc.image,
          'onsen',
          doc.slug,
          `onsen,${doc.slug},japan`
        ),
      })),
      blog: content.pages.blog ? {
        ...content.pages.blog,
        posts: content.pages.blog.posts.map(post => ({
          ...post,
          image: resolveImageUrl(
            post.image,
            'blog',
            post.slug,
            'onsen,hot spring,japan'
          ),
        })),
      } : undefined,
      features: content.pages.features ? {
        ...content.pages.features,
        hero: {
          ...content.pages.features.hero,
          image: resolveImageUrl(
            content.pages.features.hero.image,
            'features',
            'hero',
            'onsen,hot spring,japan'
          ),
        },
        items: content.pages.features.items.map(item => ({
          ...item,
          image: resolveImageUrl(
            item.image,
            'features',
            item.title.toLowerCase().replace(/\s+/g, '-'),
            'onsen,hot spring,japan'
          ),
        })),
      } : undefined,
    },
  };

  return resolved;
}

/**
 * 画像URLを解決（キーまたはURLから最適化されたURLに変換）
 */
function resolveImageUrl(
  image: string | { key?: string; keywords?: string },
  category: string,
  key: string,
  defaultKeywords?: string
): string {
  // オブジェクト形式の場合
  if (typeof image === 'object' && image !== null) {
    if (image.key) {
      // キーが指定されている場合はそれを使用
      const url = getThemeImage(category, image.key, image.keywords || defaultKeywords);
      return optimizeImageUrl(url);
    }
    if (image.keywords) {
      // キーワードが指定されている場合はそれを使用
      const url = getThemeImage(category, key, image.keywords);
      return optimizeImageUrl(url);
    }
  }

  // 文字列の場合
  if (typeof image === 'string') {
    // 既にURLの場合はそのまま返す（最適化）
    if (image.startsWith('http')) {
      return optimizeImageUrl(image);
    }
    // キーの場合は解決
    // 温泉カテゴリの場合は、getOnsenImage()を使用してwikimedia-images.jsonから取得
    if (category === 'onsen') {
      return optimizeImageUrl(getOnsenImage(image));
    }
    const url = getThemeImage(category, image, defaultKeywords);
    return optimizeImageUrl(url);
  }

  // フォールバック
  // 温泉カテゴリの場合は、getOnsenImage()を使用
  if (category === 'onsen') {
    return optimizeImageUrl(getOnsenImage(key));
  }
  const url = getThemeImage(category, key, defaultKeywords);
  return optimizeImageUrl(url);
}

/**
 * Get specific doc page
 */
export async function getDocPage(slug: string): Promise<DocPage | undefined> {
  const content = await loadContent();
  return content.pages.docs?.find(page => page.slug === slug);
}

/**
 * Get all doc slugs
 */
export async function getAllDocSlugs(): Promise<string[]> {
  const content = await loadContent();
  return content.pages.docs?.map(page => page.slug) || [];
}

/**
 * Get blog post
 */
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const content = await loadContent();
  return content.pages.blog?.posts.find(post => post.slug === slug);
}

/**
 * Get all blog slugs
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const content = await loadContent();
  return content.pages.blog?.posts.map(post => post.slug) || [];
}

// ==========================================
// FALLBACK DATA
// ==========================================

const fallbackTexts: TextsConfig = {
  nav: {
    backLinks: {
      home: "ホームに戻る",
      docs: "温泉ガイド一覧に戻る",
      blog: "特集記事一覧に戻る",
    },
    pagination: {
      previous: "前の温泉地",
      next: "次の温泉地",
    },
  },
  pages: {
    onsenGuide: {
      title: "温泉ガイド",
      description: "関東エリアの名湯・秘湯を徹底ガイド。各温泉地の特徴、効能、アクセス情報から、おすすめの宿泊施設まで、温泉旅行に役立つ情報を網羅しています。",
      defaultSubtitle: "Documentation",
    },
    contact: {
      title: "お問い合わせ",
    },
  },
  buttons: {
    learnMore: "詳しく見る",
    readStory: "Read Story",
    learnMoreEn: "Learn more",
    submit: "送信する",
  },
  form: {
    labels: {
      name: "お名前",
      email: "メールアドレス",
      message: "メッセージ",
    },
    placeholders: {
      name: "山田 太郎",
      email: "example@email.com",
      message: "お問い合わせ内容をご記入ください...",
    },
    fields: {
      email: {
        label: "Email",
      },
      office: {
        label: "Office",
      },
    },
  },
  messages: {
    notFound: {
      docs: "温泉ガイドが見つかりませんでした。",
      blog: "No posts found.",
      blogContent: "Blog content not found.",
      features: "Features content not found.",
      contact: "Contact content not found.",
    },
  },
  ui: {
    labels: {
      tableOfContents: "Table of Contents",
      documentation: "Documentation",
      readyToDeploy: "Ready to Deploy?",
      interactiveDemoLoading: "Interactive Demo Module Loading...",
    },
  },
};

const fallbackContent: ContentConfig = {
  site: {
    name: "Error Loading Theme",
    tagline: "Configuration Error",
    description: "Please check your theme configuration.",
    logo: { text: "Error", icon: "alert" },
    metadata: {
      title: "Error Loading Theme",
      description: "Please check your theme configuration."
    }
  },
  navigation: [],
  pages: {
    home: {
      hero: {
        type: "cinematic",
        title: "Error",
        subtitle: "Error",
        description: "Failed to load content.",
        bgImage: "",
        overlay: "dark",
        actions: []
      },
      sections: []
    }
  },
  texts: fallbackTexts,
};
