import { ButtonLink } from '@/src/components/shared/ButtonLink';
import { Pill } from '@/src/components/shared/Pill';

interface QuickFilterPanelProps {
  filters: Array<{ label: string; href: string }>;
}

export function QuickFilterPanel({ filters }: QuickFilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <ButtonLink key={filter.href} href={filter.href} variant="secondary" className="bg-white/5">
          {filter.label}
        </ButtonLink>
      ))}
    </div>
  );
}

interface FilterSidebarProps {
  areas: string[];
  springs: string[];
  effects: string[];
  current: {
    area?: string;
    spring?: string;
    effect?: string;
    dayTrip?: string;
    travel?: string;
  };
}

export function FilterSidebar({ areas, springs, effects, current }: FilterSidebarProps) {
  return (
    <aside className="rounded-[1.75rem] border border-white/8 bg-[var(--color-panel)] p-6">
      <form action="/onsen" className="space-y-6">
        <div className="space-y-2">
          <Pill className="text-[var(--color-accent)]">Search Filters</Pill>
          <p className="text-sm leading-6 text-[var(--color-muted)]">条件を掛け合わせて、週末の気分に合う一湯まで絞り込めます。</p>
        </div>

        <label className="block space-y-2 text-sm text-[var(--color-fog)]">
          <span>エリア</span>
          <select name="area" defaultValue={current.area ?? ''} className="w-full rounded-2xl border border-white/10 bg-[var(--color-page)] px-4 py-3 text-white outline-none">
            <option value="">すべて</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-[var(--color-fog)]">
          <span>泉質</span>
          <select name="spring" defaultValue={current.spring ?? ''} className="w-full rounded-2xl border border-white/10 bg-[var(--color-page)] px-4 py-3 text-white outline-none">
            <option value="">すべて</option>
            {springs.map((spring) => (
              <option key={spring} value={spring}>{spring}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-[var(--color-fog)]">
          <span>効能</span>
          <select name="effect" defaultValue={current.effect ?? ''} className="w-full rounded-2xl border border-white/10 bg-[var(--color-page)] px-4 py-3 text-white outline-none">
            <option value="">すべて</option>
            {effects.map((effect) => (
              <option key={effect} value={effect}>{effect}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-[var(--color-fog)]">
          <span>東京からの目安</span>
          <select name="travel" defaultValue={current.travel ?? ''} className="w-full rounded-2xl border border-white/10 bg-[var(--color-page)] px-4 py-3 text-white outline-none">
            <option value="">指定なし</option>
            <option value="90">90分以内</option>
            <option value="120">120分以内</option>
            <option value="180">180分以内</option>
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--color-fog)]">
          <input type="checkbox" name="dayTrip" value="yes" defaultChecked={current.dayTrip === 'yes'} className="h-4 w-4 accent-[var(--color-accent)]" />
          日帰り可能な温泉だけを見る
        </label>

        <div className="flex gap-3">
          <button type="submit" className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]">
            絞り込む
          </button>
          <ButtonLink href="/onsen" variant="ghost" className="px-0">
            リセット
          </ButtonLink>
        </div>
      </form>
    </aside>
  );
}
