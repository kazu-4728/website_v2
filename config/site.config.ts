/**
 * サイト設定ファイル
 * このファイルを編集することでサイト全体の設定を変更できます
 */

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  theme: string;
  author: {
    name: string;
    url?: string;
  };
  nav: {
    title: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: 'GitHub Docs 完全マニュアル',
  description: '初心者でも分かるGitHubの使い方を学ぶ',
  url: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ogImage: '/images/og-image.png',
  theme: 'github-docs',
  author: {
    name: 'Your Name',
    url: 'https://github.com/kazu-4728',
  },
  nav: [
    { title: 'ホーム', href: '/' },
    { title: 'ガイド', href: '/guides/' },
    { title: '参考資料', href: '/sources/' },
    { title: 'FAQ', href: '/faq/' },
  ],
};
