import type { MetadataRoute } from 'next';
import { getArticles, getOnsenSpots, getSiteData } from './lib/onsen-site';

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
    { path: '/docs', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/features', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticRouteDefinitions.map((route) => ({
    url: `${baseUrl}${route.path === '/' ? '/' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const onsenRoutes: MetadataRoute.Sitemap = getOnsenSpots().map((spot) => ({
    url: `${baseUrl}/docs/${spot.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getArticles().map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticRoutes, ...onsenRoutes, ...articleRoutes];
}
