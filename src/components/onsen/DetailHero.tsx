import { Pill } from '@/src/components/shared/Pill';
import type { LoadedOnsen } from '@/src/content/loaders/onsen';
import { getImageSrc } from '@/src/lib/images/resolve';

function focusLabel(focus: LoadedOnsen['images']['hero']['focus']) {
  if (focus === 'bath') return '湯船・浴場写真';
  if (focus === 'onsen-area') return '温泉地の実景';
  return '温泉写真を収集中';
}

export function DetailHero({ onsen }: { onsen: LoadedOnsen }) {
  const showImage = onsen.images.hero.focus !== 'area';

  return (
    <section className="relative overflow-hidden border-b border-white/8">
      {showImage ? <img src={getImageSrc(onsen.images.hero)} alt={onsen.images.hero.alt} className="absolute inset-0 h-full w-full object-cover" /> : null}
      <div className={showImage ? 'absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,10,0.18),rgba(7,9,10,0.92))]' : 'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,167,93,0.16),transparent_45%),linear-gradient(180deg,rgba(17,19,20,0.88),rgba(7,9,10,0.98))]'} />
      <div className="relative mx-auto flex min-h-[68vh] max-w-7xl flex-col justify-end gap-6 px-5 py-16 md:px-8 md:py-20 lg:min-h-[76vh]">
        <div className="flex flex-wrap gap-2">
          <Pill>{onsen.identity.prefecture}</Pill>
          <Pill>{onsen.metrics.bestTravelLabel}</Pill>
          <Pill>{onsen.metrics.dayTripLabel}</Pill>
          <Pill className="text-[var(--color-accent)]">{focusLabel(onsen.images.hero.focus)}</Pill>
        </div>
        <div className="max-w-4xl space-y-5">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-accent)]">{onsen.identity.area}</p>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] text-white md:text-7xl">{onsen.identity.name}</h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--color-fog)]">{onsen.summary.catchcopy}</p>
          <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)]">{onsen.summary.lead}</p>
          {!showImage ? <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">このページでは、紹介地と確実に結び付けられる温泉写真だけを表示します。現在は施設写真を収集中です。</p> : null}
        </div>
      </div>
    </section>
  );
}
