'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { NavigationItem } from '../../lib/onsen-site';

interface SiteShellProps {
  children: ReactNode;
  siteName: string;
  tagline: string;
  navigation: NavigationItem[];
}

export function SiteShell({ children, siteName, tagline, navigation }: SiteShellProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-stone-950">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="group inline-flex min-w-0 flex-col leading-none" onClick={closeMenu}>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-950 md:text-3xl">{siteName}</span>
            <span className="mt-1 truncate text-[10px] font-medium tracking-[0.2em] text-stone-500 sm:text-xs">{tagline}</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="主要ナビゲーション">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold tracking-wide transition-colors hover:text-stone-950 ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'text-stone-950' : 'text-stone-700'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/onsens" className="hidden rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex">
              温泉を探す
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition-colors hover:bg-stone-200 md:hidden"
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="sr-only">{isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}</span>
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 block h-px w-5 bg-current transition-transform ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-2 block h-px w-5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 top-4 block h-px w-5 bg-current transition-transform ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        <div id="mobile-navigation" className={`${isMenuOpen ? 'block' : 'hidden'} border-t border-stone-200/80 bg-[#f7f3ec] md:hidden`}>
          <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4" aria-label="モバイルナビゲーション">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-stone-200 ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'bg-stone-200 text-stone-950' : 'text-stone-700'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/onsens" onClick={closeMenu} className="mt-2 rounded-xl bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
              温泉を探す
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-stone-200 bg-stone-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
          <div>
            <p className="font-serif text-3xl font-bold">{siteName}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              関東近郊の温泉候補を、エリア・目的・公式サイト導線・画像クレジット付きで比較できるJSON駆動型ディレクトリです。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-stone-300 hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/sitemap.xml" className="text-stone-300 hover:text-white">サイトマップ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

