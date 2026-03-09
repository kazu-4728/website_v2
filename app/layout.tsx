import './globals.css';

import type { Metadata } from 'next';

import { SiteShell } from '@/src/components/layout/SiteShell';
import { loadSiteConfig } from '@/src/content/loaders/site';

export async function generateMetadata(): Promise<Metadata> {
  const site = await loadSiteConfig();

  return {
    title: site.metadata.title,
    description: site.metadata.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
