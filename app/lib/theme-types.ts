/**
 * Theme Schema Type Definitions
 * 
 * This file defines the common type structure that any theme must follow.
 * Theme-specific extensions (like OnsenSpot for the onsen-kanto theme) should
 * be defined separately and extend these base types.
 * 
 * @module theme-types
 */

// ==========================================
// TEXTS SCHEMA - Common UI Text Structure
// ==========================================

/**
 * Navigation-related text labels
 * Used for back links, pagination, and navigation elements
 */
export interface TextsNavigation {
  mainMenu?: {
    home: string;
    docs: string;
    blog: string;
    features: string;
    contact: string;
    [key: string]: string; // Allow additional menu items
  };
  backLinks: {
    home: string;
    docs: string;
    blog: string;
    [key: string]: string; // Allow additional back link types
  };
  pagination: {
    previous: string;
    next: string;
  };
}

/**
 * Page-specific text labels
 * Each key represents a page or section that needs localized text
 */
export interface TextsPages {
  onsenGuide?: {
    title: string;
    description: string;
    defaultSubtitle: string;
  };
  contact?: {
    title: string;
  };
  [key: string]: any; // Allow theme-specific page text
}

/**
 * Button labels used throughout the theme
 */
export interface TextsButtons {
  learnMore: string;
  readStory: string;
  learnMoreEn: string;
  submit: string;
  [key: string]: string; // Allow additional button labels
}

/**
 * Form-related text labels and placeholders
 */
export interface TextsForm {
  labels: {
    name: string;
    email: string;
    message: string;
    [key: string]: string; // Allow additional form labels
  };
  placeholders: {
    name: string;
    email: string;
    message: string;
    [key: string]: string; // Allow additional placeholders
  };
  fields: {
    email: {
      label: string;
    };
    office: {
      label: string;
    };
    [key: string]: any; // Allow additional field definitions
  };
}

/**
 * Message text for various states (errors, not found, etc.)
 */
export interface TextsMessages {
  notFound: {
    docs: string;
    blog: string;
    blogContent: string;
    features: string;
    contact: string;
    [key: string]: string; // Allow additional not found messages
  };
  [key: string]: any; // Allow additional message categories
}

/**
 * UI element labels
 */
export interface TextsUI {
  labels: {
    tableOfContents: string;
    documentation: string;
    readyToDeploy: string;
    interactiveDemoLoading: string;
    [key: string]: string; // Allow additional UI labels
  };
}

/**
 * Footer text labels
 */
export interface TextsFooter {
  tagline: string;
  copyright: string;
  sections?: {
    navigation?: string;
    about?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Complete texts configuration
 * This should be present in every theme's texts.json
 */
export interface TextsConfig {
  nav: TextsNavigation;
  pages: TextsPages;
  buttons: TextsButtons;
  form: TextsForm;
  messages: TextsMessages;
  ui: TextsUI;
  footer: TextsFooter;
}

// ==========================================
// SITE SCHEMA - Site-wide Configuration
// ==========================================

/**
 * Site logo configuration
 */
export interface SiteLogo {
  text: string;
  icon: string;
}

/**
 * Site metadata for SEO
 */
export interface SiteMetadata {
  title: string;
  description: string;
}

/**
 * Site-wide configuration
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  logo: SiteLogo;
  metadata: SiteMetadata;
}

// ==========================================
// NAVIGATION SCHEMA
// ==========================================

/**
 * Navigation submenu item
 */
export interface NavigationSubmenuItem {
  label: string;
  href: string;
}

/**
 * Navigation menu item
 */
export interface NavigationItem {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  submenu?: NavigationSubmenuItem[];
}

// ==========================================
// IMAGE REFERENCE SCHEMA
// ==========================================

/**
 * Image reference - can be a URL string or an object with key/keywords
 * This allows flexibility in how images are specified in content.json
 */
export type ImageReference = 
  | string // Direct URL or image key
  | {
      key?: string; // Image key to look up
      keywords?: string; // Search keywords for image fetching
    };

// ==========================================
// HOME PAGE SCHEMA
// ==========================================

/**
 * Action button in hero section
 */
export interface HeroAction {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/**
 * Badge/Tag item for hero section
 */
export interface HeroBadge {
  label: string;
  variant?: 'default' | 'primary' | 'secondary';
}

/**
 * Hero slide item for multi-slide hero
 */
export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription?: string;
  badges?: HeroBadge[];
  imageKey: string; // Image key for this slide (e.g., "starry_night", "snow", "autumn_leaves")
  season?: string; // Optional season label (e.g., "春", "夏", "秋", "冬")
  area?: string; // Optional area label (e.g., "箱根", "草津")
}

/**
 * Home page hero section (raw, before image resolution)
 */
export interface HomeHeroRaw {
  type: string; // e.g., "cinematic", "simple", "gradient"
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription?: string; // Optional additional description line
  badges?: HeroBadge[]; // Optional badges/tags to display
  bgImage: ImageReference; // Legacy single image (used if slides not provided)
  slides?: HeroSlide[]; // Optional multi-slide array for cinematic hero
  overlay: string; // e.g., "dark", "light", "gradient"
  actions: HeroAction[];
}

/**
 * Hero slide item (after image resolution)
 */
export interface HeroSlideResolved extends HeroSlide {
  bgImage: string; // Resolved to actual URL
  // imageKey is kept for metadata lookup
}

/**
 * Home page hero section (after image resolution)
 */
export interface HomeHero extends Omit<HomeHeroRaw, 'bgImage' | 'slides'> {
  bgImage: string; // Resolved to actual URL (legacy, used if slides not provided)
  slides?: HeroSlideResolved[]; // Optional multi-slide array with resolved images
}

/**
 * Base interface for all home page sections
 */
export interface HomeSection {
  id: string;
  type: string;
  [key: string]: any; // Allow additional properties per section type
}

/**
 * Split feature section (image + content side by side)
 */
export interface SplitFeatureSection extends HomeSection {
  type: 'split-feature';
  layout: 'image-left' | 'image-right';
  chapter?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string; // Resolved image URL
  stats?: Array<{ value: string; label: string }>;
  quote?: { text: string; author: string };
  link?: { text: string; href: string };
}

/**
 * Grid gallery item
 */
export interface GridGalleryItem {
  title: string;
  description: string;
  image: string; // Resolved image URL
  href: string;
}

/**
 * Grid gallery section
 */
export interface GridGallerySection extends HomeSection {
  type: 'grid-gallery';
  title: string;
  subtitle?: string;
  description: string;
  items: GridGalleryItem[];
}

/**
 * Testimonial item
 */
export interface TestimonialItem {
  content: string;
  author: string;
  role: string;
  avatar: string; // URL
}

/**
 * Testimonials section
 */
export interface TestimonialsSection extends HomeSection {
  type: 'testimonials';
  title: string;
  items: TestimonialItem[];
}

/**
 * Call-to-action section
 */
export interface CtaSection extends HomeSection {
  type: 'cta-fullscreen';
  title: string;
  description: string;
  bgImage: string; // Resolved image URL
  action: {
    label: string;
    href: string;
  };
}

/**
 * Step item for steps section
 */
export interface StepItem {
  number: string; // e.g., "01", "STEP 1"
  title: string;
  description: string;
  icon?: string; // Optional icon identifier
}

/**
 * Steps section (e.g., "How to choose" guide)
 */
export interface StepsSection extends HomeSection {
  type: 'steps';
  title: string;
  subtitle?: string;
  description?: string;
  items: StepItem[];
}

/**
 * Home page configuration
 */
export interface HomePage {
  hero: HomeHero;
  sections: HomeSection[];
}

// ==========================================
// DOC PAGE SCHEMA
// ==========================================

/**
 * Documentation page (raw, before image resolution)
 */
export interface DocPageRaw<TExtension = any> {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: ImageReference;
  content: string; // Markdown content
  related?: string[]; // Related doc slugs
  // Extension point for theme-specific data
  // For example, onsen theme adds: onsen?: OnsenSpot
  [key: string]: any;
}

/**
 * Documentation page (after image resolution)
 */
export interface DocPage<TExtension = any> extends Omit<DocPageRaw<TExtension>, 'image'> {
  image: string; // Resolved to actual URL
}

// ==========================================
// BLOG SCHEMA
// ==========================================

/**
 * Blog post (raw, before image resolution)
 */
export interface BlogPostRaw {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // Display date
  readTime: string;
  category: string;
  author: string;
  image: ImageReference;
  content: string; // Markdown content
}

/**
 * Blog post (after image resolution)
 */
export interface BlogPost extends Omit<BlogPostRaw, 'image'> {
  image: string; // Resolved to actual URL
}

/**
 * Blog configuration
 */
export interface BlogConfig {
  title: string;
  description: string;
  posts: BlogPost[];
}

// ==========================================
// FEATURES PAGE SCHEMA
// ==========================================

/**
 * Features page hero
 */
export interface FeaturesHero {
  title: string;
  subtitle: string;
  description: string;
  image: string; // Resolved image URL
}

/**
 * Feature item
 */
export interface FeatureItem {
  title: string;
  description: string;
  icon: string; // Icon name or identifier
  image: string; // Resolved image URL
}

/**
 * Features page configuration
 */
export interface FeaturesConfig {
  title: string;
  description: string;
  hero: FeaturesHero;
  items: FeatureItem[];
}

// ==========================================
// CONTACT PAGE SCHEMA
// ==========================================

/**
 * Contact page configuration
 */
export interface ContactConfig {
  title: string;
  email: string;
  office: string;
  description?: string;
}

// ==========================================
// PAGES SCHEMA - All Pages Combined
// ==========================================

/**
 * All pages configuration (raw, before image resolution)
 */
export interface PagesConfigRaw {
  home: {
    hero: HomeHeroRaw;
    sections: Array<any>; // Sections before processing
  };
  docs?: DocPageRaw[];
  blog?: {
    title: string;
    description: string;
    posts: BlogPostRaw[];
  };
  features?: {
    title: string;
    description: string;
    hero: {
      title: string;
      subtitle: string;
      description: string;
      image: ImageReference;
    };
    items: Array<{
      title: string;
      description: string;
      icon: string;
      image: ImageReference;
    }>;
  };
  contact?: ContactConfig;
}

/**
 * All pages configuration (after image resolution)
 */
export interface PagesConfig {
  home: HomePage;
  docs?: DocPage[];
  blog?: BlogConfig;
  features?: FeaturesConfig;
  contact?: ContactConfig;
}

// ==========================================
// MAIN CONTENT SCHEMA
// ==========================================

/**
 * Complete content configuration (raw, before image resolution)
 * This is the structure of content.json before processing
 */
export interface ContentConfigRaw {
  site: SiteConfig;
  navigation: NavigationItem[];
  pages: PagesConfigRaw;
}

/**
 * Complete content configuration (after processing)
 * This includes resolved images and loaded texts
 */
export interface ContentConfig {
  site: SiteConfig;
  navigation: NavigationItem[];
  pages: PagesConfig;
  texts: TextsConfig;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Extract theme-specific extension type from DocPage
 * Usage: type OnsenDoc = DocPage<OnsenSpot>
 */
export type DocPageWithExtension<T> = DocPage<T> & {
  [K in keyof T]: T[K];
};

/**
 * Type guard to check if a section is of a specific type
 */
export function isSectionType<T extends HomeSection>(
  section: HomeSection,
  type: T['type']
): section is T {
  return section.type === type;
}

/**
 * Type guard for split feature section
 */
export function isSplitFeature(section: HomeSection): section is SplitFeatureSection {
  return section.type === 'split-feature';
}

/**
 * Type guard for grid gallery section
 */
export function isGridGallery(section: HomeSection): section is GridGallerySection {
  return section.type === 'grid-gallery';
}

/**
 * Type guard for testimonials section
 */
export function isTestimonials(section: HomeSection): section is TestimonialsSection {
  return section.type === 'testimonials';
}

/**
 * Type guard for CTA section
 */
export function isCta(section: HomeSection): section is CtaSection {
  return section.type === 'cta-fullscreen';
}
