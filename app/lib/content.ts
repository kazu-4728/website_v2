import { promises as fs } from 'fs';
import path from 'path';
import { getThemeImage, getOnsenImage, optimizeImageUrl } from './images';
import { resolveWeeklyRotation } from './weekly-rotation';
import onsenImageStock from '../../data/onsen-image-stock.json';
import unsplashOnsenData from '../../data/unsplash-onsen-images.json';

// Import common theme types
import type {
  TextsConfig,
  ContentConfig,
  ContentConfigRaw,
  HomeHero,
  HomeHeroRaw,
  HeroSlideResolved,
  HomeSection,
  SplitFeatureSection,
  GridGallerySection,
  TestimonialsSection,
  CtaSection,
  StepsSection,
  AreaSelectionSection,
  RecommendedOnsenSection,
  OnsenListSection,
  DocPage,
  DocPageRaw,
  BlogPost,
  BlogPostRaw,
  ImageReference,
} from './theme-types';

// Import onsen-specific types
import type {
  OnsenSpot,
  OnsenRegion,
  OnsenInfo,
  OnsenAccess,
  OnsenAccommodation,
  OnsenContent,
  OnsenImages,
  OnsenMeta,
  OnsenDocPage,
} from './onsen-types';

// Re-export types for backward compatibility
export type {
  TextsConfig,
  ContentConfig,
  HomeHero,
  HomeSection,
  SplitFeatureSection,
  GridGallerySection,
  TestimonialsSection,
  CtaSection,
  StepsSection,
  AreaSelectionSection,
  RecommendedOnsenSection,
  OnsenListSection,
  DocPage,
  BlogPost,
  // Onsen-specific types
  OnsenSpot,
  OnsenRegion,
  OnsenInfo,
  OnsenAccess,
  OnsenAccommodation,
  OnsenContent,
  OnsenImages,
  OnsenMeta,
  OnsenDocPage,
};

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
/**
 * 画像参照を解決（onsenKey + imageIndex → URL）
 */
function resolveImageReferences(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveImageReferences(item));
  }

  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    
    // bgImageRefを解決
    if (key === 'bgImageRef' && typeof value === 'object' && value.onsenKey !== undefined) {
      const imageUrl = resolveOnsenImageUrl(value.onsenKey, value.imageIndex || 0);
      result['bgImage'] = imageUrl;
    }
    // imageオブジェクトでonsenKeyがある場合、urlを解決
    else if (key === 'image' && typeof value === 'object' && value.onsenKey !== undefined) {
      const imageUrl = resolveOnsenImageUrl(value.onsenKey, value.imageIndex || 0);
      result[key] = {
        ...value,
        url: imageUrl,
      };
      delete result[key].onsenKey;
      delete result[key].imageIndex;
    }
    // ネストされたオブジェクトを再帰的に処理
    else {
      result[key] = resolveImageReferences(value);
    }
  }
  
  return result;
}

/**
 * onsenKeyとimageIndexから画像URLを解決
 */
function resolveOnsenImageUrl(onsenKey: string, imageIndex: number = 0): string {
  try {
    // onsen-image-stock.jsonから画像を取得
    const images = onsenImageStock.onsenPages[onsenKey as keyof typeof onsenImageStock.onsenPages];
    
    if (!images || images.length === 0) {
      console.warn(`No images found for onsen: ${onsenKey}`);
      // フォールバック画像を返す
      return 'https://images.unsplash.com/photo-1596205838031-643501178619?auto=format&fit=crop&q=80&w=1000';
    }

    const image = images[imageIndex] || images[0];
    return image.url || 'https://images.unsplash.com/photo-1596205838031-643501178619?auto=format&fit=crop&q=80&w=1000';
  } catch (error) {
    console.error(`Failed to resolve onsen image: ${onsenKey}[${imageIndex}]`, error);
    // エラー時のフォールバック画像
    return 'https://images.unsplash.com/photo-1596205838031-643501178619?auto=format&fit=crop&q=80&w=1000';
  }
}

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
    
    // 週替わりブログローテーションを適用
    if (rawContent.pages?.home?.blog?.posts) {
      rawContent.pages.home.blog.posts = resolveWeeklyRotation(rawContent.pages.home.blog.posts);
    }
    
    // 30箇所の温泉データを pages.docs に自動追加
    if (unsplashOnsenData && unsplashOnsenData.images) {
      // 既存のdocsページを保持
      const existingDocs = rawContent.pages?.docs || [];
      const existingSlugs = new Set(existingDocs.map((doc: any) => doc.slug));
      
      // 30箇所の温泉データをdocsページに変換
      const generatedDocs = unsplashOnsenData.images.map((onsen: any) => ({
        slug: onsen.slug,
        title: onsen.name,
        subtitle: onsen.location,
        description: onsen.description,
        category: '温泉地',
        image: onsen.imgUrl,
        content: `## ${onsen.name}について\n\n${onsen.description}\n\n※ 詳細情報は準備中です。`,
        // 基本的な温泉情報（オプション）
        onsen: undefined, // 詳細情報が必要な場合はここに追加
      }));
      
      // 既存のdocsと生成されたdocsをマージ（重複を避ける）
      const mergedDocs = [
        ...existingDocs,
        ...generatedDocs.filter((doc: any) => !existingSlugs.has(doc.slug)),
      ];
      
      // rawContentを更新
      if (!rawContent.pages) rawContent.pages = { home: { hero: {}, sections: [] } as any };
      rawContent.pages.docs = mergedDocs;
    }
    
    // 画像参照を解決（onsenKey + imageIndex → URL）
    const contentWithResolvedImages = resolveImageReferences(rawContent);
    
    // 画像URLを解決（キーからURLに変換）
    const resolvedContent = resolveImageUrls(contentWithResolvedImages);
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

  // ヒーロースライドの画像を解決（マルチスライド対応）
  const heroSlides: HeroSlideResolved[] | undefined = content.pages.home.hero.slides?.map(slide => ({
    ...slide,
    bgImage: resolveImageUrl(
      { key: slide.imageKey },
      'hero',
      slide.imageKey,
      `onsen,hot spring,japan,${slide.season || ''},${slide.area || ''}`
    ),
  }));

  const resolved: Omit<ContentConfig, 'texts'> = {
    ...content,
    pages: {
      ...content.pages,
      home: {
        ...content.pages.home,
        hero: {
          ...content.pages.home.hero,
          bgImage: heroBgImage,
          slides: heroSlides,
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
          
          if (section.type === 'area-selection' && section.items) {
            resolvedSection.items = section.items.map((item: any) => ({
              ...item,
              image: resolveImageUrl(
                item.image,
                'onsen',
                item.link?.replace('/', '') || 'default',
                'onsen,hot spring,japan'
              ),
            }));
          }
          
          if (section.type === 'recommended-onsen' && section.items) {
            resolvedSection.items = section.items.map((item: any) => ({
              ...item,
              image: resolveImageUrl(
                item.image,
                'onsen',
                item.link?.replace('/', '') || 'default',
                'onsen,hot spring,japan'
              ),
            }));
          }
          
          // onsen-list は items を持たず、pages.onsen.items から動的に生成される
          
          return resolvedSection;
        }),
        blog: content.pages.home.blog ? {
          ...content.pages.home.blog,
          posts: content.pages.home.blog.posts.map(post => ({
            ...post,
            image: post.image ? (typeof post.image === 'string' ? post.image : resolveImageUrl(
              post.image,
              'blog',
              post.slug,
              'onsen,hot spring,japan'
            )) : undefined,
          })),
        } : undefined,
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
    },
  };

  return resolved;
}

/**
 * 画像URLを解決（キーまたはURLから最適化されたURLに変換）
 */
function resolveImageUrl(
  image: ImageReference,
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
  return content.pages.home.blog?.posts.find(post => post.slug === slug);
}

/**
 * Get all blog slugs
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const content = await loadContent();
  return content.pages.home.blog?.posts.map(post => post.slug) || [];
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
  footer: {
    tagline: "関東エリアの名湯・秘湯を巡る旅",
    copyright: "© 2025 関東温泉紀行. All rights reserved.",
    sections: {
      navigation: "ナビゲーション",
      about: "サイトについて",
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
