import { notFound } from 'next/navigation';
import { MapPinned } from 'lucide-react';

import { Pill } from '@/src/components/shared/Pill';
import { SiteLink } from '@/src/components/shared/SiteLink';
import { getOnsenSpot, getOnsens } from '@/src/features/onsen';
import { getImageSrc } from '@/src/lib/images/resolve';
import { withBasePath } from '@/src/lib/base-path';

function typeLabel(type: string) {
  if (type === 'day-trip') return '日帰り候補';
  if (type === 'onsen-landmark') return '湯めぐり候補';
  return 'エリア基点';
}

function photoStatusLabel(status: string) {
  if (status === 'verified') return '施設写真あり';
  if (status === 'area-only') return 'エリア写真のみ';
  if (status === 'pending') return '写真候補を確認中';
  return '施設写真を収集中';
}

export async function generateStaticParams() {
  const onsens = await getOnsens();
  return onsens.flatMap((onsen) => onsen.onsenSpots.map((spot) => ({ slug: onsen.identity.slug, spot: spot.slug })));
}

export default async function OnsenSpotPage({ params }: { params: Promise<{ slug: string; spot: string }> }) {
  const { slug, spot } = await params;
  const entry = await getOnsenSpot(slug, spot);

  if (!entry) {
    notFound();
  }

  const parent = entry.parent;
  const showParentImage = parent.images.hero.focus !== 'area';

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/8">
        {entry.photoUrl ? (
          <img src={withBasePath(entry.photoUrl)} alt={entry.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : showParentImage ? (
          <img src={getImageSrc(parent.images.hero)} alt={parent.images.hero.alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className={(entry.photoUrl || showParentImage) ? 'absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,10,0.22),rgba(7,9,10,0.94))]' : 'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,167,93,0.16),transparent_45%),linear-gradient(180deg,rgba(17,19,20,0.88),rgba(7,9,10,0.98))]'} />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SiteLink href={`/onsen/${parent.identity.slug}`} className="text-sm text-[var(--color-accent)] hover:text-white">
            ← {parent.identity.name} に戻る
          </SiteLink>
          <div className="mt-8 flex flex-wrap gap-2">
            <Pill>{parent.identity.prefecture}</Pill>
            <Pill>{parent.identity.area}</Pill>
            <Pill className="text-[var(--color-accent)]">{typeLabel(entry.type)}</Pill>
            <Pill>{photoStatusLabel(entry.photoStatus)}</Pill>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-white md:text-6xl">{entry.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-fog)]">{entry.description}</p>
          {!entry.photoUrl ? <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">紹介地と確実に結び付く温泉写真だけを表示するため、このスポットでも施設写真を収集中です。</p> : null}
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[1fr_0.92fr]">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Spot Guide</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">訪問前に押さえておきたいこと</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-fog)]">{entry.bookingHint || '営業時間や立ち寄り可否は変動しやすいため、直前に現地案内を確認するのがおすすめです。'}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={entry.googleMapsUri || entry.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <MapPinned className="h-4 w-4" />
              地図を開く
            </a>
            {entry.officialUrl ? (
              <a
                href={entry.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                公式案内
              </a>
            ) : null}
          </div>
          {entry.placeQuery ? <p className="mt-6 text-xs leading-6 text-[var(--color-muted)]">検索クエリ: {entry.placeQuery}</p> : null}
        </section>
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Parent Area</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{parent.identity.name} 全体も合わせて確認する</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-fog)]">{parent.summary.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {parent.spring.springTypes.slice(0, 4).map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-sm text-[var(--color-fog)]">
            {parent.onsenSpots.slice(0, 4).map((spotEntry) => (
              <SiteLink
                key={spotEntry.slug}
                href={`/onsen/${parent.identity.slug}/spots/${spotEntry.slug}`}
                className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:border-[var(--color-accent)] hover:text-white"
              >
                {spotEntry.name}
              </SiteLink>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
