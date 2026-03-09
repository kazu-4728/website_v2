import { notFound } from 'next/navigation';

import { JournalArticleView } from '@/src/components/journal/JournalArticleView';
import { OnsenShowcaseCard } from '@/src/components/onsen/OnsenShowcaseCard';
import { Pill } from '@/src/components/shared/Pill';
import { getJournalEntry, getJournalEntries } from '@/src/features/journal';
import { getOnsen, getOnsens } from '@/src/features/onsen';
import { getImageSrc } from '@/src/lib/images/resolve';

export async function generateStaticParams() {
  const entries = await getJournalEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getJournalEntry(slug);

  if (!article) {
    notFound();
  }

  const [coverOnsen, onsens] = await Promise.all([
    getOnsen(article.coverSlug),
    getOnsens(),
  ]);

  const relatedOnsens = article.relatedSlugs.map((relatedSlug) => onsens.find((onsen) => onsen.identity.slug === relatedSlug)).filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/8">
        {coverOnsen ? <img src={getImageSrc(coverOnsen.images.hero)} alt={coverOnsen.images.hero.alt} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,10,0.2),rgba(7,9,10,0.92))]" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-5xl flex-col justify-end gap-5 px-5 py-16 md:px-8">
          <Pill className="w-fit text-[var(--color-accent)]">{article.category}</Pill>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-tight text-white md:text-6xl">{article.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--color-fog)]">{article.excerpt}</p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-10 md:px-8 md:py-16">
        <JournalArticleView article={article} />
        <section className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Related Onsen</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">記事で触れた温泉地</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedOnsens.map((onsen) => onsen ? <OnsenShowcaseCard key={onsen.identity.slug} onsen={onsen} /> : null)}
          </div>
        </section>
      </div>
    </>
  );
}
