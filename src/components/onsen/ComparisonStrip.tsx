import { Pill } from '@/src/components/shared/Pill';
import { SectionHeading } from '@/src/components/shared/SectionHeading';
import type { LoadedOnsen } from '@/src/content/loaders/onsen';

interface ComparisonStripProps {
  eyebrow: string;
  title: string;
  description: string;
  onsens: LoadedOnsen[];
}

export function ComparisonStrip({ eyebrow, title, description, onsens }: ComparisonStripProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {onsens.map((onsen) => (
          <div key={onsen.identity.slug} className="rounded-[1.75rem] border border-white/8 bg-[var(--color-panel)] p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">{onsen.identity.area}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{onsen.identity.name}</h3>
                </div>
                <Pill>{onsen.metrics.bestTravelLabel}</Pill>
              </div>
              <p className="text-sm leading-7 text-[var(--color-muted)]">{onsen.summary.catchcopy}</p>
              <dl className="space-y-3 text-sm text-[var(--color-fog)]">
                <div>
                  <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">泉質</dt>
                  <dd className="mt-1">{onsen.spring.springTypes.slice(0, 2).join(' / ')}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">効能</dt>
                  <dd className="mt-1">{onsen.spring.effects.slice(0, 2).join(' / ')}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">滞在向き</dt>
                  <dd className="mt-1">{onsen.stay.bestFor[0]}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
