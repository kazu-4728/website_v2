import './globals.css';
import { PremiumNav } from './components/modern/Navigation/PremiumNav';
import { PremiumFooter } from './components/modern/Footer/PremiumFooter';
import { loadContent } from './lib/content';

export async function generateMetadata() {
  const content = await loadContent();
  return {
    title: content.site.metadata.title,
    description: content.site.metadata.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await loadContent();
  
  return (
    <html lang="ja">
      <body>
        <PremiumNav logo={content.site.logo} items={content.navigation} />
        {children}
        <PremiumFooter 
          siteName={content.site.name} 
          siteDescription={content.site.description}
          navigation={content.navigation}
        />
      </body>
    </html>
  );
}
