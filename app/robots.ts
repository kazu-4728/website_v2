import type { MetadataRoute } from 'next';
import { getSiteData } from './lib/onsen-site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const data = getSiteData();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
    ],
    sitemap: `${data.site.baseUrl}/sitemap.xml`,
    host: data.site.baseUrl,
  };
}
