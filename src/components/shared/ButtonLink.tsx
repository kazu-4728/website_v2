import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

const buttonLinkStyles = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-accent)] text-[var(--color-ink)] shadow-[0_16px_40px_rgba(201,167,92,0.25)]',
        secondary: 'border border-white/20 bg-white/6 text-white hover:bg-white/10',
        ghost: 'text-[var(--color-accent)] hover:text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof buttonLinkStyles>;

export function ButtonLink({ href, children, className, variant }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonLinkStyles({ variant }), className)}>
      {children}
    </Link>
  );
}
