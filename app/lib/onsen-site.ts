import siteDataJson from '../../data/onsen-site.json';

export interface SiteImage {
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface SiteAction {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface OnsenSpot {
  slug: string;
  name: string;
  prefecture: string;
  area: string;
  catchcopy: string;
  summary: string;
  image: SiteImage;
  tags: string[];
  springTypes: string[];
  bestFor: string[];
  access: string;
  stayStyle: string;
  season: string;
}

export interface PurposeGuide {
  id: string;
  title: string;
  description: string;
  recommendedSlugs: string[];
}

export interface HomeSection {
  id: string;
  label: string;
  title: string;
  description: string;
  spotSlugs: string[];
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSlug: string;
  sections: ArticleSection[];
}

export interface OnsenSiteData {
  site: {
    name: string;
    tagline: string;
    description: string;
    baseUrl: string;
    keywords: string[];
  };
  navigation: NavigationItem[];
  home: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryAction: SiteAction;
      secondaryAction: SiteAction;
      image: SiteImage;
    };
    editorial: {
      title: string;
      description: string;
      points: string[];
    };
    sections: HomeSection[];
  };
  purposes: PurposeGuide[];
  onsenSpots: OnsenSpot[];
  articles: Article[];
}

const data = siteDataJson as OnsenSiteData;

export function getSiteData(): OnsenSiteData {
  return data;
}

export function getOnsenSpots(): OnsenSpot[] {
  return data.onsenSpots;
}

export function getOnsenSpot(slug: string): OnsenSpot | undefined {
  return data.onsenSpots.find((spot) => spot.slug === slug);
}

export function getRelatedSpots(currentSlug: string, limit = 3): OnsenSpot[] {
  const current = getOnsenSpot(currentSlug);
  if (!current) return data.onsenSpots.slice(0, limit);

  return data.onsenSpots
    .filter((spot) => spot.slug !== currentSlug)
    .map((spot) => {
      const sameArea = spot.area === current.area ? 3 : 0;
      const samePrefecture = spot.prefecture === current.prefecture ? 2 : 0;
      const tagOverlap = spot.tags.filter((tag) => current.tags.includes(tag)).length;
      return { spot, score: sameArea + samePrefecture + tagOverlap };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ spot }) => spot);
}

export function getHomeSectionSpots(section: HomeSection): OnsenSpot[] {
  return section.spotSlugs
    .map((slug) => getOnsenSpot(slug))
    .filter((spot): spot is OnsenSpot => Boolean(spot));
}

export function getPurposeSpots(purpose: PurposeGuide): OnsenSpot[] {
  return purpose.recommendedSlugs
    .map((slug) => getOnsenSpot(slug))
    .filter((spot): spot is OnsenSpot => Boolean(spot));
}

export function getArticles(): Article[] {
  return data.articles;
}

export function getArticle(slug: string): Article | undefined {
  return data.articles.find((article) => article.slug === slug);
}

export function getArticleImage(article: Article): SiteImage {
  return getOnsenSpot(article.imageSlug)?.image ?? data.home.hero.image;
}

export function getCanonicalUrl(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${data.site.baseUrl}${normalized === '/' ? '/' : normalized}`;
}
