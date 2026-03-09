import Link from 'next/link';
import { MapPinned } from 'lucide-react';

import type { LoadedOnsen } from '@/src/content/loaders/onsen';
import { withBasePath } from '@/src/lib/base-path';

function typeLabel(type: string) {
  if (type === 'day-trip') return '日帰り候補';
  if (type === 'onsen-landmark') return '湯めぐり候補';
  return 'エリア基点';
}

function photoStatusLabel(status: LoadedOnsen['onsenSpots'][number]['photoStatus']) {
  if (status === 'verified') return '施設写真あり';
  if (status === 'area-only') return 'エリア写真のみ';
  if (status === 'pending') return '写真候補を確認中';
  return '施設写真を収集中';
}

export function OnsenSpotsPanel({ onsen }: { onsen: LoadedOnsen }) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Spot Directory</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">温泉地の中をさらに深掘りする</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-fog)]">
        主要温泉地の中でも、実際に立ち寄る候補になりやすい浴場や日帰り施設を分けて掲載しています。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {onsen.onsenSpots.map((spot) => (
          <article key={spot.slug} className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/4">
            {spot.photoUrl ? <img src={withBasePath(spot.photoUrl)} alt={spot.name} className="h-40 w-full object-cover" /> : null}
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{typeLabel(spot.type)}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{spot.name}</h3>
              <p className="mt-2 text-xs text-[var(--color-accent)]">{photoStatusLabel(spot.photoStatus)}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-fog)]">{spot.description}</p>
              {spot.bookingHint ? <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">{spot.bookingHint}</p> : null}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/onsen/${onsen.identity.slug}/spots/${spot.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  詳細ページ
                </Link>
                <a
                  href={spot.googleMapsUri || spot.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <MapPinned className="h-3.5 w-3.5" />
                  地図
                </a>
                {spot.officialUrl ? (
                  <a
                    href={spot.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    公式案内
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
