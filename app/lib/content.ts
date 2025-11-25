import { promises as fs } from 'fs';
import path from 'path';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ContentConfig {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: {
      text: string;
      icon: string;
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
        icon: string; // SVG icon name or identifier
        image: string;
      }>;
    };
    contact?: {
      title: string;
      description: string;
      email: string;
      office: string;
    };
  };
}

// --- Home Types ---
export interface HomeHero {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  overlay: string;
  actions: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export type HomeSection = 
  | SplitFeatureSection
  | GridGallerySection
  | TestimonialsSection
  | CtaSection;

export interface BaseSection {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface SplitFeatureSection extends BaseSection {
  type: 'split-feature';
  layout: 'image-left' | 'image-right';
  chapter?: string;
  image: string;
  stats?: Array<{ value: string; label: string }>;
  quote?: { text: string; author: string };
  link?: { text: string; href: string };
}

export interface GridGallerySection extends BaseSection {
  type: 'grid-gallery';
  items: Array<{
    title: string;
    description: string;
    image: string;
    href: string;
  }>;
}

export interface TestimonialsSection extends BaseSection {
  type: 'testimonials';
  items: Array<{
    content: string;
    author: string;
    role: string;
    avatar: string;
  }>;
}

export interface CtaSection extends BaseSection {
  type: 'cta-fullscreen';
  bgImage: string;
  action: { label: string; href: string };
}

// --- Doc Types ---
export interface DocPage {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  content: string; // Markdown
  related?: string[];
}

// --- Blog Types ---
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
}

// ==========================================
// DATA LOADER
// ==========================================

let cachedContent: ContentConfig | null = null;

/**
 * Load theme content from JSON using static import to ensure bundling
 */
export async function loadContent(): Promise<ContentConfig> {
  if (cachedContent) return cachedContent;

  const themeName = process.env.NEXT_PUBLIC_THEME || 'github-docs';
  
  try {
    // Static import for themes to ensure they are bundled by Webpack/Next.js
    let contentModule;
    
    if (themeName === 'portfolio') {
        contentModule = await import('../../themes/portfolio/content.json');
    } else {
        // Default to github-docs theme
        contentModule = await import('../../themes/github-docs/content.json');
    }

    cachedContent = contentModule.default as ContentConfig;
    return cachedContent;
  } catch (error) {
    console.error(`Failed to load theme content for ${themeName}:`, error);
    return fallbackContent;
  }
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
 * Get specific blog post
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

const fallbackContent: ContentConfig = {
  site: {
    name: "Error Loading Theme",
    tagline: "Configuration Error",
    description: "Please check your theme configuration.",
    logo: { text: "Error", icon: "alert" }
  },
  navigation: [],
  pages: {
    home: {
      hero: {
        type: "cinematic",
        title: "Error",
        subtitle: "Theme Not Found",
        description: "Could not load content.json",
        bgImage: "",
        overlay: "dark",
        actions: []
      },
      sections: []
    }
  }
};
