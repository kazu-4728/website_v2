'use client';

import { useSearchParams } from 'next/navigation';

import { FilterSidebar } from '@/src/components/onsen/QuickFilterPanel';
import { OnsenShowcaseCard, type OnsenCardViewModel } from '@/src/components/onsen/OnsenShowcaseCard';

interface OnsenDirectoryItem extends OnsenCardViewModel {
  identity: OnsenCardViewModel['identity'] & { area: string };
  spring: OnsenCardViewModel['spring'] & { effects: string[] };
  stay: { dayTripAvailable: boolean };
  metrics: OnsenCardViewModel['metrics'] & { bestTravelTime: number | null };
}

export function OnsenDirectory({
  onsens,
  options,
}: {
  onsens: OnsenDirectoryItem[];
  options: { areas: string[]; springs: string[]; effects: string[] };
}) {
  const searchParams = useSearchParams();
  const current = {
    area: searchParams.get('area') ?? undefined,
    spring: searchParams.get('spring') ?? undefined,
    effect: searchParams.get('effect') ?? undefined,
    dayTrip: searchParams.get('dayTrip') ?? undefined,
    travel: searchParams.get('travel') ?? undefined,
  };

  const filtered = onsens.filter((onsen) => {
    const areaFilter = current.area;
    const springFilter = current.spring;
    const effectFilter = current.effect;
    const travelFilter = current.travel;

    if (areaFilter && onsen.identity.area !== areaFilter) return false;
    if (springFilter && !onsen.spring.springTypes.some((spring) => spring.includes(springFilter))) return false;
    if (effectFilter && !onsen.spring.effects.some((effect) => effect.includes(effectFilter))) return false;
    if (current.dayTrip === 'yes' && !onsen.stay.dayTripAvailable) return false;
    if (travelFilter && onsen.metrics.bestTravelTime && onsen.metrics.bestTravelTime > Number(travelFilter)) return false;
    return true;
  });

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
      <FilterSidebar areas={options.areas} springs={options.springs} effects={options.effects} current={current} />
      <div className="space-y-5">
        <p className="text-sm text-[var(--color-muted)]">{filtered.length} 件の温泉地が見つかりました。</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((onsen) => (
            <OnsenShowcaseCard key={onsen.identity.slug} onsen={onsen} />
          ))}
        </div>
      </div>
    </div>
  );
}
