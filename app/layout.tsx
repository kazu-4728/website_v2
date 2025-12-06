import './globals.css';
import { Header } from './components/navigation/Header';
import { Footer } from './components/layouts/Footer';
import { loadContent } from './lib/content';
import type { Metadata } from 'next';

// サイトのベースURL（本番環境用）
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kazu-4728.github.io/website_v2';

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadContent();
  
  // OG画像のURL（ヒーロー画像を使用）
  const ogImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg';
  
  return {
    title: {
      default: content.site.metadata.title,
      template: `%s | ${content.site.name}`,
    },
    description: content.site.metadata.description,
    keywords: ['温泉', '関東', '箱根', '草津', '鬼怒川', '伊香保', '那須', '旅行', '日帰り温泉', '露天風呂'],
    authors: [{ name: content.site.name }],
    creator: content.site.name,
    publisher: content.site.name,
    metadataBase: new URL(siteUrl),
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: siteUrl,
      siteName: content.site.name,
      title: content.site.metadata.title,
      description: content.site.metadata.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${content.site.name} - ${content.site.tagline}`,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: content.site.metadata.title,
      description: content.site.metadata.description,
      images: [ogImageUrl],
    },
    
    // その他のメタデータ
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // アイコン設定
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
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
