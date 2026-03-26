'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
  const navOpacity = useTransform(scrollY, [0, 120], [0.78, 0.96]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/35 transition-all duration-300 ${
        isScrolled ? 'py-3 shadow-[0_18px_50px_rgba(33,24,18,0.12)]' : 'py-5'
      }`}
      style={{
        backgroundColor: `rgba(250, 244, 234, ${navOpacity.get()})`,
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b9956f]/35 bg-white/70 text-lg text-[#6a4c39] shadow-[0_8px_30px_rgba(53,37,27,0.1)] transition-transform duration-300 group-hover:scale-105">
              <span aria-hidden="true">{logo?.icon || '湯'}</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xl font-semibold tracking-[0.08em] text-[#2c2018]">
                {logo?.text || '温泉紀行'}
              </div>
              <div className="text-[0.65rem] uppercase tracking-[0.35em] text-[#9f7753]">
                Kanto Onsen Journey
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {items.map((item, index) => {
              if (item.variant === 'primary' || item.variant === 'secondary') {
                return (
                  <Link key={index} href={item.href} className="btn-premium px-6 py-3 text-sm tracking-[0.18em] uppercase">
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative text-sm font-medium tracking-[0.2em] uppercase text-[#5f4a3b] transition-colors duration-300 hover:text-[#8e6231]"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[#bf8748] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden rounded-full border border-[#c8ac8b]/50 bg-white/75 p-3 text-[#4e392b] transition-colors hover:bg-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-5 overflow-hidden rounded-[28px] border border-[#d9c6af] bg-[#fbf7f0]/95 p-4 shadow-[0_24px_80px_rgba(53,37,27,0.12)]"
          >
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`rounded-full px-5 py-3 text-sm tracking-[0.16em] uppercase transition-colors ${
                    item.variant === 'primary' || item.variant === 'secondary'
                      ? 'btn-premium text-center'
                      : 'text-[#5f4a3b] hover:bg-[#f1e7d7]'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
