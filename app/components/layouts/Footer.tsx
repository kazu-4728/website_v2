import Link from 'next/link';
import { getIconComponent } from '../icons';

interface FooterProps {
  siteName: string;
  logo: {
    text: string;
    icon: string;
  };
  texts: {
    footer: {
      tagline: string;
      copyright: string;
      sections?: {
        navigation?: string;
        about?: string;
      };
    };
    nav: {
      mainMenu?: {
        home: string;
        docs: string;
        blog: string;
        features: string;
        contact: string;
      };
    };
  };
}

export function Footer({ siteName, logo, texts }: FooterProps) {
  const LogoIcon = getIconComponent(logo.icon);

  const menuItems = texts.nav.mainMenu
    ? [
        { label: texts.nav.mainMenu.home, href: '/' },
        { label: texts.nav.mainMenu.docs, href: '/docs' },
        { label: texts.nav.mainMenu.blog, href: '/blog' },
        { label: texts.nav.mainMenu.features, href: '/features' },
        { label: texts.nav.mainMenu.contact, href: '/contact' },
      ]
    : [];

  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: Logo and Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="text-primary-500 group-hover:text-primary-400 transition-colors">
                <LogoIcon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {logo.text}
                </div>
                <div className="text-sm text-gray-400">
                  {texts.footer.tagline}
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div>
            {texts.footer.sections?.navigation && (
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {texts.footer.sections.navigation}
              </h3>
            )}
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Site Name */}
          <div>
            {texts.footer.sections?.about && (
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {texts.footer.sections.about}
              </h3>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">
              {siteName}
            </p>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="pt-8 border-t border-dark-800">
          <p className="text-center text-gray-500 text-sm">
            {texts.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
