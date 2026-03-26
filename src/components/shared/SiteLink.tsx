import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { withBasePath } from '@/src/lib/base-path';

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  return (
    <a href={withBasePath(href)} {...props}>
      {children}
    </a>
  );
}
