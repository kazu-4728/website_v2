import directoryDataJson from '../../data/directory-site.json';

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

export interface Area {
  id: string;
  slug: string;
  name: string;
  prefectures: string[];
  summary: string;
  image: SiteImage;
  onsenSlugs: string[];
}

export interface Onsen {
  slug: string;
  name: string;
  kind: string;
  areaId: string;
  prefecture: string;
  officialName: string;
  officialUrl: string;
  verifiedAt: string;
  summary: string;
  catchcopy: string;
  tags: string[];
  springTypes: string[];
  useCases: string[];
  access: string;
  image: SiteImage;
}

export interface PurposeGuide {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  recommendedSlugs: string[];
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

export interface DirectorySiteData {
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
    };
    featuredAreaIds: string[];
    featuredOnsenSlugs: string[];
  };
  purposes: PurposeGuide[];
  areas: Area[];
  onsens: Onsen[];
  articles: Article[];
}

const data = directoryDataJson as DirectorySiteData;

export function getSiteData(): DirectorySiteData {
  return data;
}

export function getAreas(): Area[] {
  return data.areas;
}

export function getArea(slugOrId: string): Area | undefined {
  return data.areas.find((area) => area.slug === slugOrId || area.id === slugOrId);
}

export function getFeaturedAreas(): Area[] {
  return data.home.featuredAreaIds
    .map((id) => getArea(id))
    .filter((area): area is Area => Boolean(area));
}

export function getOnsens(): Onsen[] {
  return data.onsens;
}

export function getOnsen(slug: string): Onsen | undefined {
  return data.onsens.find((onsen) => onsen.slug === slug);
}

export function getFeaturedOnsens(): Onsen[] {
  return data.home.featuredOnsenSlugs
    .map((slug) => getOnsen(slug))
    .filter((onsen): onsen is Onsen => Boolean(onsen));
}

export function getOnsensByArea(areaId: string): Onsen[] {
  return data.onsens.filter((onsen) => onsen.areaId === areaId);
}

export function getOnsensByPurpose(purposeId: string): Onsen[] {
  return data.onsens.filter((onsen) => onsen.useCases.includes(purposeId));
}

export function getRelatedOnsens(currentSlug: string, limit = 3): Onsen[] {
  const current = getOnsen(currentSlug);
  if (!current) return data.onsens.slice(0, limit);

  return data.onsens
    .filter((onsen) => onsen.slug !== currentSlug)
    .map((onsen) => {
      const sameArea = onsen.areaId === current.areaId ? 4 : 0;
      const samePurpose = onsen.useCases.filter((purpose) => current.useCases.includes(purpose)).length * 2;
      const tagOverlap = onsen.tags.filter((tag) => current.tags.includes(tag)).length;
      return { onsen, score: sameArea + samePurpose + tagOverlap };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ onsen }) => onsen);
}

export function getPurposes(): PurposeGuide[] {
  return data.purposes;
}

export function getPurpose(slugOrId: string): PurposeGuide | undefined {
  return data.purposes.find((purpose) => purpose.slug === slugOrId || purpose.id === slugOrId);
}

export function getPurposeOnsens(purpose: PurposeGuide): Onsen[] {
  const recommended = purpose.recommendedSlugs
    .map((slug) => getOnsen(slug))
    .filter((onsen): onsen is Onsen => Boolean(onsen));
  const fallback = getOnsensByPurpose(purpose.id).filter((onsen) => !recommended.some((item) => item.slug === onsen.slug));
  return [...recommended, ...fallback];
}

export function getArticles(): Article[] {
  return data.articles;
}

export function getArticle(slug: string): Article | undefined {
  return data.articles.find((article) => article.slug === slug);
}

export function getArticleImage(article: Article): SiteImage {
  return getOnsen(article.imageSlug)?.image ?? data.areas[0].image;
}

export function getAreaForOnsen(onsen: Onsen): Area | undefined {
  return getArea(onsen.areaId);
}

export function getCanonicalUrl(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${data.site.baseUrl}${normalized === '/' ? '/' : normalized}`;
}
