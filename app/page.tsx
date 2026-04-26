import Image from 'next/image';
import Link from 'next/link';
import {
  getAreaForOnsen,
  getAreas,
  getArticleImage,
  getArticles,
  getFeaturedAreas,
  getFeaturedOnsens,
  getOnsensByArea,
  getPurposes,
  getSiteData,
} from './lib/onsen-site';
import { AreaCard } from './components/site/AreaCard';
import { OnsenCard } from './components/site/OnsenCard';
import { ArticleCard } from './components/site/ArticleCard';
import { ImageCredit } from './components/site/ImageCredit';

export default function Page() {
  const data = getSiteData();
  const areas = getAreas();
  const featuredAreas = getFeaturedAreas();
  const featuredOnsens = getFeaturedOnsens();
  const purposes = getPurposes();
  const articles = getArticles();
  const heroImage = featuredAreas[0].image;

  return (
    <main>
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0">
          <Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/20" />
        </div>
        <div className="relative mx-auto grid min-h-[76vh] max-w-7xl items-end gap-10 px-5 pb-14 pt-24 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-20">
          <div>
            <p className="text-sm font-bold tracking-[0.32em] text-amber-200">{data.home.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-5xl font-serif text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {data.home.hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-stone-100 md:text-lg">{data.home.hero.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={data.home.hero.primaryAction.href} className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-bold text-stone-950 transition-transform hover:-translate-y-0.5">
                {data.home.hero.primaryAction.label}
              </Link>
              <Link href={data.home.hero.secondaryAction.href} className="rounded-full border border-white/40 px-7 py-3.5 text-center text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10">
                {data.home.hero.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold tracking-[0.28em] text-amber-200">QUICK FILTERS</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {purposes.map((purpose) => (
                <Link key={purpose.id} href={`/purposes/${purpose.slug}`} className="rounded-2xl bg-black/25 p-4 transition-colors hover:bg-black/40">
                  <p className="font-serif text-xl font-bold">{purpose.shortLabel}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-300">{purpose.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <ImageCredit image={heroImage} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">AREA DIRECTORY</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 md:text-6xl">エリアから温泉を絞る</h2>
            </div>
            <p className="text-base leading-8 text-stone-600 md:text-lg">
              温泉地を個別に眺める前に、移動距離と旅の目的が合うエリアを選びます。エリア内の温泉候補は公式サイト導線付きで比較できます。
            </p>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            {featuredAreas.map((area, index) => (
              <AreaCard key={area.id} area={area} onsens={getOnsensByArea(area.id)} priority={index < 2} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/areas" className="inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white">すべてのエリアを見る</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">OFFICIAL LINKS</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 md:text-6xl">公式サイトへ進める温泉候補</h2>
              <p className="mt-5 text-base leading-8 text-stone-600 md:text-lg">営業時間・料金・休館日は変わります。候補を絞った後は、各カードの公式サイトで確認します。</p>
            </div>
            <Link href="/onsens" className="rounded-full bg-stone-950 px-6 py-3 text-center text-sm font-bold text-white">温泉一覧へ</Link>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredOnsens.map((onsen, index) => (
              <OnsenCard key={onsen.slug} onsen={onsen} area={getAreaForOnsen(onsen)} purposes={purposes} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.24em] text-amber-200">PURPOSE GUIDE</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">目的から探す</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {purposes.map((purpose) => (
              <Link key={purpose.id} href={`/purposes/${purpose.slug}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                <h3 className="font-serif text-2xl font-bold">{purpose.shortLabel}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{purpose.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">ARTICLES</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950 md:text-6xl">選び方と確認ポイント</h2>
            </div>
            <Link href="/articles" className="rounded-full bg-stone-950 px-6 py-3 text-center text-sm font-bold text-white">記事一覧へ</Link>
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
