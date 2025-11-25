'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketIcon } from '../icons';

// Note: Ideally this would be fetched from content.json as well, 
// but for client component interactivity, we'll keep the structure similar 
// to what was loaded, or pass props from a server component.
// For now, let's define a safe fallback navigation that matches content.json's intent.

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Journey', 
    href: '/docs',
    submenu: [
      { name: 'Getting Started', href: '/docs/getting-started' },
      { name: 'Collaboration', href: '/docs/collaboration' },
      { name: 'Automation', href: '/docs/actions' },
    ]
  },
  { name: 'Blog', href: '/blog' },
  { name: 'Showcase', href: '/features' },
];

export function Header() {
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
            <RocketIcon className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-white tracking-tight">Code Voyage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium uppercase tracking-wider">
                      {item.name} 
                      <span className="text-xs opacity-50 group-hover:rotate-180 transition-transform">▼</span>
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 overflow-hidden">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                          >
                            {subitem.name}
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
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                )}
              </div>
            ))}
            
            <Link href="/contact">
               <button className="px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors shadow-lg shadow-primary-900/20">
                 Join Us
               </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            aria-label="Menu"
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
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="w-full text-left px-4 py-4 text-2xl font-light text-white border-b border-white/5 flex items-center justify-between"
                      >
                        {item.name}
                        <span className={`transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''} text-sm`}>▼</span>
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-8 py-4 text-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                              >
                                {subitem.name}
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
                      className="block px-4 py-4 text-2xl font-light text-white border-b border-white/5 hover:pl-6 transition-all"
                    >
                      {item.name}
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
