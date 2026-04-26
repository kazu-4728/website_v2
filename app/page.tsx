import Image from 'next/image';
import Link from 'next/link';
import {
  getArticleImage,
  getArticles,
  getHomeSectionSpots,
  getPurposeSpots,
  getSiteData,
} from './lib/onsen-site';
import { OnsenCard } from './components/site/OnsenCard';
import { ArticleCard } from './components/site/ArticleCard';
import { ImageCredit } from './components/site/ImageCredit';

export default function Page() {
  const data = getSiteData();
  const { hero, editorial, sections } = data.home;
  const featuredSpots = getHomeSectionSpots(sections[0]).slice(0, 4);
  const articles = getArticles();

  return (
    <main>
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-end gap-10 px-5 pb-16 pt-24 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-24">
          <div>
            <p className="text-sm font-bold tracking-[0.32em] text-amber-200">{hero.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-stone-100 md:text-lg">
              {hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero.primaryAction.href}
                className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-bold text-stone-950 transition-transform hover:-translate-y-0.5"
              >
                {hero.primaryAction.label}
              </Link>
              <Link
                href={hero.secondaryAction.href}
                className="rounded-full border border-white/40 px-7 py-3.5 text-center text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                {hero.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold tracking-[0.28em] text-amber-200">CURATED LIST</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {featuredSpots.map((spot) => (
                <Link key={spot.slug} href={`/docs/${spot.slug}`} className="group rounded-2xl bg-black/25 p-4 transition-colors hover:bg-black/40">
                  <p className="text-xs text-stone-300">{spot.prefecture}</p>
                  <p className="mt-2 font-serif text-xl font-bold">{spot.name}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-300">{spot.catchcopy}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <ImageCredit image={hero.image} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[0.85fr_1.15fr] md:px-8">
          <div>
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">SITE CONCEPT</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 md:text-6xl">
              {editorial.title}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-9 text-stone-700">{editorial.description}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {editorial.points.map((point, index) => (
                <div key={point} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                  <span className="text-sm font-bold text-stone-400">0{index + 1}</span>
                  <p className="mt-4 font-semibold leading-7 text-stone-900">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {sections.map((section, sectionIndex) => {
        const spots = getHomeSectionSpots(section);
        return (
          <section key={section.id} id={section.id} className={sectionIndex % 2 === 0 ? 'bg-white py-20 md:py-28' : 'bg-[#efe7da] py-20 md:py-28'}>
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <div className="mb-12 max-w-3xl">
                <p className="text-sm font-bold tracking-[0.24em] text-stone-500">{section.label}</p>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 md:text-6xl">
                  {section.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-stone-600 md:text-lg">{section.description}</p>
              </div>
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
                {spots.map((spot, index) => (
                  <OnsenCard key={spot.slug} spot={spot} priority={sectionIndex === 0 && index < 2} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-stone-950 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.24em] text-amber-200">TRIP PURPOSE</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">目的から温泉地を選ぶ</h2>
            <p className="mt-5 text-base leading-8 text-stone-300 md:text-lg">
              写真で気になった温泉を、旅の目的からもう一度絞り込みます。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {data.purposes.map((purpose) => {
              const spots = getPurposeSpots(purpose);
              return (
                <div key={purpose.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h3 className="font-serif text-3xl font-bold">{purpose.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{purpose.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {spots.map((spot) => (
                      <Link key={spot.slug} href={`/docs/${spot.slug}`} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
                        {spot.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">FEATURE ARTICLES</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 md:text-6xl">旅の組み立て方</h2>
            </div>
            <Link href="/blog" className="rounded-full bg-stone-950 px-6 py-3 text-center text-sm font-bold text-white">
              特集一覧へ
            </Link>
          </div>
          <div className="grid gap-7">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} image={getArticleImage(article)} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
