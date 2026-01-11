/**
 * UI Layer: Page Container
 * 
 * ページ共通のコンテナ（最大幅・パディング等）
 */

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function PageContainer({
  children,
  className = '',
  maxWidth = '7xl',
}: PageContainerProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
