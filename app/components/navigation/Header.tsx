'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Rocket } from 'lucide-react';

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

interface HeaderProps {
  navigation?: NavigationItem[];
  site?: SiteInfo;
}

// フォールバック用のデフォルトナビゲーション
const defaultNavigation: NavigationItem[] = [
  { label: 'ホーム', href: '/' },
  { label: '温泉ガイド', href: '/docs' },
  { label: '特集記事', href: '/blog' },
  { label: 'おすすめプラン', href: '/features' },
  { label: 'お問い合わせ', href: '/contact', variant: 'primary' },
];

const defaultSite: SiteInfo = {
  name: '関東温泉紀行',
  tagline: 'Kanto Onsen Journey',
  description: '',
  logo: { text: '温泉紀行', icon: 'flame' },
};

// アイコンの動的取得
function getIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case 'flame':
      return <Flame className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />;
    case 'rocket':
    default:
      return <Rocket className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />;
  }
}

export function Header({ navigation = defaultNavigation, site = defaultSite }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2' : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {getIcon(site.logo.icon)}
            <span className="text-xl font-bold text-white tracking-tight">{site.logo.text}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.filter(item => item.variant !== 'primary').map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium uppercase tracking-wider">
                      {item.label} 
                      <span className="text-xs opacity-50 group-hover:rotate-180 transition-transform">▼</span>
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 overflow-hidden">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.label}
                            href={subitem.href}
                            className="block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                )}
              </div>
            ))}
            
            {/* Primary CTA Button */}
            {navigation.filter(item => item.variant === 'primary').map((item) => (
              <Link key={item.label} href={item.href}>
                <button className="px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors shadow-lg shadow-primary-900/20">
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            aria-label="メニュー"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white origin-left"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-white"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white origin-left"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto z-40"
          >
            <div className="px-4 py-8 space-y-4">
              {navigation.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                        className="w-full text-left px-4 py-4 text-2xl font-light text-white border-b border-white/5 flex items-center justify-between"
                      >
                        {item.label}
                        <span className={`transition-transform ${openSubmenu === item.label ? 'rotate-180' : ''} text-sm`}>▼</span>
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.label}
                                href={subitem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-8 py-4 text-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-4 text-2xl font-light border-b border-white/5 hover:pl-6 transition-all ${
                        item.variant === 'primary' ? 'text-primary-400' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
