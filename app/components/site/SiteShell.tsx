import Link from 'next/link';
import type { ReactNode } from 'react';
import type { NavigationItem } from '../../lib/onsen-site';

interface SiteShellProps {
  children: ReactNode;
  siteName: string;
  tagline: string;
  navigation: NavigationItem[];
}

export function SiteShell({ children, siteName, tagline, navigation }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-stone-950">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="group inline-flex flex-col leading-none">
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-950 md:text-3xl">{siteName}</span>
            <span className="mt-1 text-xs font-medium tracking-[0.24em] text-stone-500">{tagline}</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="主要ナビゲーション">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold tracking-wide text-stone-700 transition-colors hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/onsens" className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 md:inline-flex">
            温泉を探す
          </Link>
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
