import Link from 'next/link';

import { Pill } from '@/src/components/shared/Pill';
import type { ImageAsset } from '@/src/content/schema/site';
import { getImageSrc } from '@/src/lib/images/resolve';

export interface OnsenCardViewModel {
  identity: {
    slug: string;
    name: string;
    prefecture: string;
  };
  summary: {
    shortDescription: string;
  };
  spring: {
    springTypes: string[];
  };
  metrics: {
    bestTravelLabel: string;
    dayTripLabel: string;
  };
  images: {
    hero: ImageAsset;
  };
}

function focusLabel(focus: ImageAsset['focus']) {
  if (focus === 'bath') return '湯船写真';
  if (focus === 'onsen-area') return '温泉地の実景';
  return '温泉写真を収集中';
}

export function OnsenShowcaseCard({ onsen, priority = false }: { onsen: OnsenCardViewModel; priority?: boolean }) {
  const showImage = onsen.images.hero.focus !== 'area';

  return (
    <Link href={`/onsen/${onsen.identity.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/8 bg-[var(--color-panel)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative">
        {showImage ? (
          <img src={getImageSrc(onsen.images.hero)} alt={onsen.images.hero.alt} className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-80" fetchPriority={priority ? 'high' : 'auto'} />
        ) : (
          <div className="flex h-72 w-full items-end bg-[radial-gradient(circle_at_top,rgba(210,167,93,0.18),transparent_45%),linear-gradient(180deg,rgba(20,22,23,0.9),rgba(9,10,11,1))] p-5 md:h-80">
            <p className="max-w-xs text-sm leading-7 text-[var(--color-fog)]">紹介地と確実に結び付く温泉写真だけを表示するため、このカードでは施設写真を準備中です。</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,6,7,0.92)] via-[rgba(5,6,7,0.15)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5">
          <Pill>{onsen.identity.prefecture}</Pill>
          <Pill>{onsen.metrics.bestTravelLabel}</Pill>
          <Pill>{onsen.metrics.dayTripLabel}</Pill>
          <Pill className="text-[var(--color-accent)]">{focusLabel(onsen.images.hero.focus)}</Pill>
        </div>
      </div>
      <div className="space-y-4 p-5 md:p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">{onsen.identity.name}</h3>
          <p className="text-sm leading-7 text-[var(--color-muted)]">{onsen.summary.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onsen.spring.springTypes.slice(0, 3).map((spring) => (
            <Pill key={spring} className="text-[var(--color-accent)]">{spring}</Pill>
          ))}
        </div>
      </div>
    </Link>
  );
}
