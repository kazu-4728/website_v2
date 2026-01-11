/**
 * UI Layer: Onsen Card Component
 * 
 * 温泉カード（画像+名称+地域+タグ）
 */

import Link from 'next/link';
import Image from 'next/image';
import { OnsenSpot } from '../../../src/domain/onsen/types';
import { withBasePath } from '../../../app/lib/base-path';

interface OnsenCardProps {
  onsen: OnsenSpot;
  className?: string;
}

export function OnsenCard({ onsen, className = '' }: OnsenCardProps) {
  const imageUrl = onsen.images.hero || onsen.images.onsen || '/images/placeholders/hero.jpg';

  return (
    <Link
      href={`/onsen/${onsen.slug}`}
      className={`group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white ${className}`}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={withBasePath(imageUrl)}
          alt={onsen.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {onsen.name}
        </h3>
        <p className="text-gray-600 mb-3">{onsen.location}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {onsen.description}
        </p>
        {onsen.seoTags && onsen.seoTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {onsen.seoTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
