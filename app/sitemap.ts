import { MetadataRoute } from 'next';
import { loadContent } from './lib/content';

export const dynamic = 'force-static';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await loadContent();
  
  // 固定ページ
  const staticRoutes = [
    '',
    '/contact',
    '/blog',
    '/features',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 動的ドキュメントページ（温泉地詳細ページ）
  const docRoutes = (content.pages.docs || []).map((doc) => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 動的ブログ記事ページ
  const blogRoutes = (content.pages.home.blog?.posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...docRoutes, ...blogRoutes];
}
