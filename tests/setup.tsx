import '@testing-library/jest-dom/vitest';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import { vi } from 'vitest';

// IntersectionObserver のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;

type Href = string | URL | { pathname?: string } | undefined;
type MockLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { href?: Href }>;

const resolveHref = (href: Href) => {
  if (!href) {
    return '#';
  }

  if (typeof href === 'string') {
    return href;
  }

  if (href instanceof URL) {
    return href.toString();
  }

  return href.pathname ?? '#';
};

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: MockLinkProps) => (
    <a href={resolveHref(href)} {...rest}>
      {children}
    </a>
  ),
}));
