/**
 * 画像のクレジット表示コンポーネント
 * Unsplash、Wikimedia Commonsなどの画像に著作権情報を表示
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
  // クレジット表示が不要な場合は表示しない
  if (!metadata || metadata.skipCredit) return null;

  const positionClasses = {
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
  };

  const sourceName = metadata.source === 'unsplash' ? 'Unsplash' : 
                     metadata.source === 'wikimedia' ? 'Wikimedia Commons' : 
                     metadata.source || 'Source';

  return (
    <div 
      className={`absolute ${positionClasses[position]} z-10 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white/80 hover:text-white transition-colors ${className}`}
    >
      <span className="opacity-70">Photo by </span>
      {metadata.photographerUrl ? (
        <Link 
          href={metadata.photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-400 transition-colors underline"
        >
          {metadata.photographer}
        </Link>
      ) : (
        <span>{metadata.photographer}</span>
      )}
      {metadata.sourceUrl && (
        <>
          <span className="opacity-70"> on </span>
          <Link 
            href={metadata.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-400 transition-colors underline"
          >
            {sourceName}
          </Link>
        </>
      )}
      {metadata.licenseUrl && (
        <>
          <span className="opacity-70"> (</span>
          <Link 
            href={metadata.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-400 transition-colors underline"
          >
            {metadata.license || 'License'}
          </Link>
          <span className="opacity-70">)</span>
        </>
      )}
    </div>
  );
}
