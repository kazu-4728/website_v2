import Link from 'next/link';

interface SiteHeaderProps {
  navigation: Array<{ label: string; href: string }>;
  siteName: string;
}

export function SiteHeader({ navigation, siteName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[color:rgba(10,15,17,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-[0.12em] text-white md:text-xl">
          {siteName}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-[var(--color-fog)] md:gap-6 md:text-base">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
