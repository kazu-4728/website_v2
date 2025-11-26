import './globals.css';
import { loadContent } from './lib/content';
import { ClientLayout } from './components/layouts/ClientLayout';

export async function generateMetadata() {
  const content = await loadContent();
  return {
    title: content.site.name,
    description: content.site.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await loadContent();
  
  return (
    <html lang="ja">
      <body>
        <ClientLayout navigation={content.navigation} site={content.site}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
