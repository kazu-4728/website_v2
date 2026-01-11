/**
 * UI Layer: Footer Component
 * 
 * サイトフッター（既存のPremiumFooterをラップ）
 */

import { PremiumFooter } from '../../../app/components/modern/Footer/PremiumFooter';

interface FooterProps {
  siteName: string;
  siteDescription: string;
  navigation: Array<{
    label: string;
    href: string;
  }>;
}

export function Footer({ siteName, siteDescription, navigation }: FooterProps) {
  return (
    <PremiumFooter
      siteName={siteName}
      siteDescription={siteDescription}
      navigation={navigation}
    />
  );
}
