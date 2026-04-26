import type { MetadataRoute } from 'next';
import { getAreas, getArticles, getOnsens, getPurposes, getSiteData } from './lib/onsen-site';

export const dynamic = 'force-static';

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly';
};

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getSiteData();
  const baseUrl = data.site.baseUrl;
  const now = new Date();

  const staticRouteDefinitions: StaticRoute[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/areas', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/onsens', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/purposes', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/articles', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/docs', priority: 0.35, changeFrequency: 'monthly' },
    { path: '/features', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.2, changeFrequency: 'monthly' },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticRouteDefinitions.map((route) => ({
    url: `${baseUrl}${route.path === '/' ? '/' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const areaRoutes: MetadataRoute.Sitemap = getAreas().map((area) => ({
    url: `${baseUrl}/areas/${area.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const onsenRoutes: MetadataRoute.Sitemap = getOnsens().flatMap((onsen) => [
    {
      url: `${baseUrl}/onsens/${onsen.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs/${onsen.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.35,
    },
  ]);

  const purposeRoutes: MetadataRoute.Sitemap = getPurposes().map((purpose) => ({
    url: `${baseUrl}/purposes/${purpose.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getArticles().flatMap((article) => [
    {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]);

  return [...staticRoutes, ...areaRoutes, ...onsenRoutes, ...purposeRoutes, ...articleRoutes];
}
