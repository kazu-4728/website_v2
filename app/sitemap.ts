import { MetadataRoute } from 'next';

import { getJournalEntries } from '@/src/features/journal';
import { getOnsens } from '@/src/features/onsen';

export const dynamic = 'force-static';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [onsens, articles] = await Promise.all([getOnsens(), getJournalEntries()]);

  const staticRoutes = ['', '/onsen', '/journal', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const onsenRoutes = onsens.map((onsen) => ({
    url: `${baseUrl}/onsen/${onsen.identity.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const onsenSpotRoutes = onsens.flatMap((onsen) =>
    onsen.onsenSpots.map((spot) => ({
      url: `${baseUrl}/onsen/${onsen.identity.slug}/spots/${spot.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  );

  const journalRoutes = articles.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...onsenRoutes, ...onsenSpotRoutes, ...journalRoutes];
}
