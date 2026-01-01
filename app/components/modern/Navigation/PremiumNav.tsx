'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

interface NavItem {
  label: string;
  href: string;
  variant?: 'default' | 'primary' | 'secondary';
}

interface PremiumNavProps {
  logo?: {
    text: string;
    icon?: string;
  };
  items: NavItem[];
}

export function PremiumNav({ logo, items }: PremiumNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // ナビゲーションの背景透明度をスクロールに応じて変更
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${isScrolled ? 'py-4 shadow-lg' : 'py-6'
        }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${navOpacity.get()})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {logo?.icon && (
              <div className="w-10 h-10 bg-ocean-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 group-hover:scale-110">
                {logo.icon}
              </div>
            )}
            <span className="text-2xl font-bold text-gradient-ocean tracking-tight">
              {logo?.text || 'Premium'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {items.map((item, index) => {
              if (item.variant === 'primary' || item.variant === 'secondary') {
                return (
                  <Link key={index} href={item.href}>
                    <motion.div
                      className="btn-premium px-8 py-3 rounded-full cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className="relative text-gray-700 hover:text-ocean-blue font-medium text-base transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ocean-gradient group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - リンターの誤検知(動的ARIA属性)を抑制 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            // eslint-disable-next-line
            aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
            // eslint-disable-next-line
            aria-expanded={isOpen ? "true" : "false"}
            // eslint-disable-next-line
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - 独立コンポーネント */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
      />

      {/* Bottom border with gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean-light to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'
        }`} />
    </motion.nav>
  );
}
