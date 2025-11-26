'use client';

import { Header } from '../navigation/Header';

interface NavigationItem {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  submenu?: Array<{ label: string; href: string }>;
}

interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  logo: {
    text: string;
    icon: string;
  };
}

interface ClientLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  site: SiteInfo;
}

export function ClientLayout({ children, navigation, site }: ClientLayoutProps) {
  return (
    <>
      <Header navigation={navigation} site={site} />
      <main className="pt-16">{children}</main>
    </>
  );
}
