import './globals.css';
import type { ReactNode } from 'react';
import { SiteShell } from './components/site/SiteShell';
import { getAreas, getSiteData } from './lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  const heroImage = getAreas()[0].image;

  return {
    title: {
      default: `${data.site.name} | ${data.site.tagline}`,
      template: `%s | ${data.site.name}`,
    },
    description: data.site.description,
    keywords: data.site.keywords,
    metadataBase: new URL(data.site.baseUrl),
    openGraph: {
      title: `${data.site.name} | ${data.site.tagline}`,
      description: data.site.description,
      url: data.site.baseUrl,
      siteName: data.site.name,
      locale: 'ja_JP',
      type: 'website',
      images: [
        {
          url: heroImage.src,
          width: 1200,
          height: 630,
          alt: heroImage.alt,
        },
      ],
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const data = getSiteData();

  return (
    <html lang="ja">
      <body>
        <SiteShell siteName={data.site.name} tagline={data.site.tagline} navigation={data.navigation}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
