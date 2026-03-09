import { MapPinned } from 'lucide-react';

import type { LoadedOnsen } from '@/src/content/loaders/onsen';

export function NearbyPanel({ onsen }: { onsen: LoadedOnsen }) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Nearby</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">立ち寄り先で旅を完成させる</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {onsen.nearby.map((spot) => (
          <article key={spot.name} className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{spot.type}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{spot.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-fog)]">{spot.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {spot.mapUrl ? (
                <a
                  href={spot.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <MapPinned className="h-3.5 w-3.5" />
                  地図
                </a>
              ) : null}
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
          </article>
        ))}
      </div>
    </section>
  );
}
