import { Pill } from '@/src/components/shared/Pill';
import type { LoadedOnsen } from '@/src/content/loaders/onsen';

export function SpringQualityPanel({ onsen }: { onsen: LoadedOnsen }) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Spring Profile</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">泉質と体感</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {onsen.spring.springTypes.map((spring) => (
            <Pill key={spring} className="text-[var(--color-accent)]">{spring}</Pill>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">pH</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">{onsen.spring.ph ?? '—'}</dd>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">温度</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">{onsen.spring.temperature ? `${onsen.spring.temperature}℃` : '—'}</dd>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">日帰り</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">{onsen.stay.dayTripAvailable ? 'OK' : 'Stay'}</dd>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">効能</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {onsen.spring.effects.map((effect) => (
                <li key={effect}><Pill>{effect}</Pill></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">特徴</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-fog)]">
              {onsen.spring.characteristics.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
