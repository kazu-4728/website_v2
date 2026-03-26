import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { withBasePath } from '@/src/lib/base-path';

function normalizeHref(href: string) {
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] ?? href;
  const suffix = match?.[2] ?? '';

  if (!pathname || pathname === '/') {
    return `${pathname}${suffix}`;
  }

  if (pathname.endsWith('/') || pathname.split('/').pop()?.includes('.')) {
    return `${pathname}${suffix}`;
  }

  return `${pathname}/${suffix}`;
}

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  return (
    <a href={withBasePath(normalizeHref(href))} {...props}>
      {children}
    </a>
  );
}