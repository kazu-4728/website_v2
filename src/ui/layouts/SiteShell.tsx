/**
 * UI Layer: Site Shell Layout
 * 
 * サイト全体のレイアウト（Header + Footer + Container）
 */

import { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SiteShellProps {
  children: ReactNode;
  logo?: {
    text: string;
    icon?: string;
  };
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  siteName?: string;
  siteDescription?: string;
}

export function SiteShell({
  children,
  logo,
  navigation = [],
  siteName = '関東温泉紀行',
  siteDescription = '関東エリアの名湯・秘湯を巡る旅',
}: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={logo} items={navigation} />
      <main className="flex-1 pt-20">{children}</main>
      <Footer
        siteName={siteName}
        siteDescription={siteDescription}
        navigation={navigation}
      />
    </div>
  );
}
