/**
 * 画像のクレジット表示コンポーネント
 * Unsplashの画像に著作権情報を表示
 */

import Link from 'next/link';
import { ImageMetadata } from '../../lib/images';

interface ImageCreditProps {
  metadata: ImageMetadata | null;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export function ImageCredit({ 
  metadata, 
  position = 'bottom-right',
  className = '' 
}: ImageCreditProps) {
  if (!metadata) return null;

  const positionClasses = {
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} z-10 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white/80 hover:text-white transition-colors ${className}`}
    >
      <span className="opacity-70">Photo by </span>
      <Link 
        href={metadata.photographerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary-400 transition-colors underline"
      >
        {metadata.photographer}
      </Link>
      <span className="opacity-70"> on </span>
      <Link 
        href={metadata.unsplashUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary-400 transition-colors underline"
      >
        Unsplash
      </Link>
    </div>
  );
}
