import { ComparisonStrip } from '@/src/components/onsen/ComparisonStrip';
import { HeroCarousel } from '@/src/components/onsen/HeroCarousel';
import { OnsenShowcaseCard } from '@/src/components/onsen/OnsenShowcaseCard';
import { QuickFilterPanel } from '@/src/components/onsen/QuickFilterPanel';
import { JournalCard } from '@/src/components/journal/JournalCard';
import { ButtonLink } from '@/src/components/shared/ButtonLink';
import { SectionHeading } from '@/src/components/shared/SectionHeading';
import { HomeConfig } from '@/src/content/schema/site';
import { loadHomeConfig } from '@/src/content/loaders/site';
import { getJournalEntries } from '@/src/features/journal';
import { getComparisonOnsens, getFeaturedOnsens, getOnsens } from '@/src/features/onsen';
import { getImageSrc } from '@/src/lib/images/resolve';

export default async function HomePage() {
  const [home, featuredOnsens, comparisonOnsens, allOnsens, journalEntries] = await Promise.all([
    loadHomeConfig(),
    getFeaturedOnsens(),
    getComparisonOnsens(),
    getOnsens(),
    getJournalEntries(),
  ]);

  const heroSlides = home.hero.slides.map((slide: HomeConfig['hero']['slides'][number]) => {
    const onsen = featuredOnsens.concat(allOnsens).find((entry) => entry.identity.slug === slide.slug);
    if (!onsen) {
      throw new Error(`Missing featured onsen for slide ${slide.slug}`);
    }

    return {
      ...slide,
      image: onsen.images.hero,
    };
  });

  return (
    <>
      <HeroCarousel
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        description={home.hero.description}
        primaryCta={home.hero.primaryCta}
        secondaryCta={home.hero.secondaryCta}
        slides={heroSlides}
      />

      <section className="mx-auto max-w-7xl space-y-6 px-5 py-16 md:px-8">
        <SectionHeading
          eyebrow="Quick Filters"
          title="今日の気分から、次の一湯へ。"
          description="近さ、日帰り、泉質、美肌感。条件から探し始めたい人のためのショートカット。"
        />
        <QuickFilterPanel filters={home.quickFilters} />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">
        <SectionHeading
          eyebrow="Area Highlights"
          title="まずは、写真で惹かれたエリアから。"
          description="関東の中でも性格が分かりやすいエリアを先に眺めると、自分が欲しい旅の輪郭が見えやすくなります。"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {home.areaHighlights.map((area: HomeConfig['areaHighlights'][number]) => {
            const onsen = allOnsens.find((entry) => entry.identity.slug === area.slug);
            if (!onsen) return null;

            return (
              <a key={area.slug} href={`/onsen/${area.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/8 bg-[var(--color-panel)]">
                <div className="relative">
                  <img src={getImageSrc(onsen.images.hero)} alt={onsen.images.hero.alt} className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,9,10,0.88)] via-transparent to-transparent" />
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-3xl font-semibold text-white">{area.name}</h3>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">{area.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">
        <SectionHeading
          eyebrow="Featured Stays"
          title="実写の強さで選びたい、今見てほしい温泉地。"
          description="まずは印象の強い3つから。景色、湯の個性、旅の組み立てやすさを兼ね備えた代表選手です。"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredOnsens.map((onsen, index) => (
            <OnsenShowcaseCard key={onsen.identity.slug} onsen={onsen} priority={index === 0} />
          ))}
        </div>
      </section>

      <ComparisonStrip
        eyebrow={home.comparison.eyebrow}
        title={home.comparison.title}
        description={home.comparison.description}
        onsens={comparisonOnsens}
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">
        <SectionHeading eyebrow={home.journal.eyebrow} title={home.journal.title} description={home.journal.description} />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {journalEntries.map((article) => (
            <JournalCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(201,167,92,0.16),rgba(18,29,31,0.94))] p-8 md:p-12">
          <SectionHeading eyebrow={home.contactCta.eyebrow} title={home.contactCta.title} description={home.contactCta.description} />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={home.contactCta.action.href}>{home.contactCta.action.label}</ButtonLink>
            <ButtonLink href="/onsen" variant="secondary">一覧から自分で探す</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
