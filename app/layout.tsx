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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayout navigation={content.navigation} site={content.site}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
