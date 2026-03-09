import { notFound } from 'next/navigation';

import { AccessPanel } from '@/src/components/onsen/AccessPanel';
import { DetailHero } from '@/src/components/onsen/DetailHero';
import { NearbyPanel } from '@/src/components/onsen/NearbyPanel';
import { OnsenShowcaseCard } from '@/src/components/onsen/OnsenShowcaseCard';
import { OnsenSpotsPanel } from '@/src/components/onsen/OnsenSpotsPanel';
import { PhotoGallery } from '@/src/components/onsen/PhotoGallery';
import { SpringQualityPanel } from '@/src/components/onsen/SpringQualityPanel';
import { StorySection } from '@/src/components/onsen/StorySection';
import { Pill } from '@/src/components/shared/Pill';
import { getOnsen, getRelatedOnsens } from '@/src/features/onsen';

export async function generateStaticParams() {
  const { getOnsens } = await import('@/src/features/onsen');
  const onsens = await getOnsens();
  return onsens.map((onsen) => ({ slug: onsen.identity.slug }));
}

function buildGallery(onsen: NonNullable<Awaited<ReturnType<typeof getOnsen>>>) {
  const seen = new Set<string>();
  return [onsen.images.hero, ...onsen.images.gallery].filter((asset) => {
    if (asset.focus === 'area') return false;
    const key = asset.remoteUrl || asset.localPath || asset.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function OnsenDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const onsen = await getOnsen(slug);

  if (!onsen) {
    notFound();
  }

  const relatedOnsens = await getRelatedOnsens(onsen);
  const galleryImages = buildGallery(onsen);

  return (
    <>
      <DetailHero onsen={onsen} />
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">旅の要点</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-fog)]">{onsen.summary.shortDescription}</p>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            {onsen.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Stay Profile</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">どんな旅に向いているか</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-fog)]">{onsen.stay.style}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {onsen.stay.bestFor.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">日帰り施設</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-fog)]">
                {(onsen.stay.dayTripFacilities ?? ['現地で要確認']).map((facility) => (
                  <li key={facility}>• {facility}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">滞在の特徴</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-fog)]">
                {onsen.stay.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-4 md:px-8 md:pb-20">
        {galleryImages.length > 0 ? <PhotoGallery title={`${onsen.identity.name} の写真体験`} images={galleryImages} /> : null}
        <div className="grid gap-6 lg:grid-cols-2">
          <SpringQualityPanel onsen={onsen} />
          <AccessPanel onsen={onsen} />
        </div>
        <OnsenSpotsPanel onsen={onsen} />
        <StorySection onsen={onsen} />
        <NearbyPanel onsen={onsen} />
        <section>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Keep Exploring</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">この温泉が好きなら、次はここへ。</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {relatedOnsens.map((entry) => (
              <OnsenShowcaseCard key={entry.identity.slug} onsen={entry} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
