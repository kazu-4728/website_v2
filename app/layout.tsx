import './globals.css';
import { Header } from './components/navigation/Header';
import { Footer } from './components/layouts/Footer';
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
        <Header logo={content.site.logo} navigation={content.navigation} />
        <main className="pt-16">{children}</main>
        <Footer siteName={content.site.name} logo={content.site.logo} texts={content.texts} />
      </body>
    </html>
  );
}
