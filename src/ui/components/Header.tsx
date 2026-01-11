/**
 * UI Layer: Header Component
 * 
 * サイトヘッダー（既存のPremiumNavをラップ）
 */

import { PremiumNav } from '../../../app/components/modern/Navigation/PremiumNav';

interface NavItem {
  label: string;
  href: string;
  variant?: 'default' | 'primary' | 'secondary';
}

interface HeaderProps {
  logo?: {
    text: string;
    icon?: string;
  };
  items: NavItem[];
}

export function Header({ logo, items }: HeaderProps) {
  return <PremiumNav logo={logo} items={items} />;
}
