'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105',
        secondary:
          'bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-primary-500/50 text-white',
        ghost: 'text-dark-300 hover:text-white hover:bg-white/5',
        outline:
          'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
      },
      size: {
        sm: 'text-sm px-6 py-2.5',
        md: 'text-base px-8 py-4',
        lg: 'text-lg px-10 py-5',
        xl: 'text-xl px-12 py-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
