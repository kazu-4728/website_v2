import { loadSiteConfig } from '@/src/content/loaders/site';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const site = await loadSiteConfig();

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-white">
      <SiteHeader navigation={site.navigation} siteName={site.name} />
      <main>{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}
