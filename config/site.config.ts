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
  name: '関東温泉紀行',
  description: '関東エリアの名湯・秘湯を巡る旅。歴史ある温泉地から隠れた名所まで、心と体を癒す至福の湯を徹底ガイド。',
  url: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ogImage: '/images/og-image.png',
  theme: 'onsen-kanto',
  author: {
    name: 'Your Name',
    url: 'https://github.com/kazu-4728',
  },
  nav: [
    { title: 'ホーム', href: '/' },
    { title: '温泉ガイド', href: '/docs' },
    { title: '特集記事', href: '/blog' },
    { title: 'おすすめプラン', href: '/features' },
    { title: 'お問い合わせ', href: '/contact' },
  ],
};
