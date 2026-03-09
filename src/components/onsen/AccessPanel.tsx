import { MapPinned } from 'lucide-react';

import type { LoadedOnsen } from '@/src/content/loaders/onsen';
import { formatMinutes } from '@/src/lib/utils';

export function AccessPanel({ onsen }: { onsen: LoadedOnsen }) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Access</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">東京からの行き方</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {onsen.access.fromTokyo.byTrain ? (
            <article className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <h3 className="text-lg font-semibold text-white">電車</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-fog)]">{onsen.access.fromTokyo.byTrain.description}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{formatMinutes(onsen.access.fromTokyo.byTrain.time)}</p>
            </article>
          ) : null}
          {onsen.access.fromTokyo.byCar ? (
            <article className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <h3 className="text-lg font-semibold text-white">車</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-fog)]">{onsen.access.fromTokyo.byCar.description}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{formatMinutes(onsen.access.fromTokyo.byCar.time)}</p>
            </article>
          ) : null}
          {onsen.access.fromTokyo.byBus ? (
            <article className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <h3 className="text-lg font-semibold text-white">高速バス</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-fog)]">{onsen.access.fromTokyo.byBus.description}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{formatMinutes(onsen.access.fromTokyo.byBus.time)}</p>
            </article>
          ) : null}
        </div>
        {onsen.access.nearestStation ? (
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-[var(--color-fog)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">最寄り駅</p>
            <p className="mt-2 text-lg font-semibold text-white">{onsen.access.nearestStation.name} / {onsen.access.nearestStation.line}</p>
            {onsen.access.nearestStation.walkingTime !== undefined ? <p>徒歩 {onsen.access.nearestStation.walkingTime} 分</p> : null}
            {onsen.access.nearestStation.busTime !== undefined ? <p>バス {onsen.access.nearestStation.busTime} 分</p> : null}
            {onsen.access.parking?.notes ? <p className="mt-3 text-[var(--color-muted)]">{onsen.access.parking.notes}</p> : null}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {onsen.access.areaMapUrl ? (
            <a
              href={onsen.access.areaMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <MapPinned className="h-4 w-4" />
              温泉地マップを開く
            </a>
          ) : null}
          {(onsen.access.officialLinks || []).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
