import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOnsenSpot, getOnsenSpots, getRelatedSpots, getSiteData } from '../../lib/onsen-site';
import { ImageCredit } from '../../components/site/ImageCredit';
import { OnsenCard } from '../../components/site/OnsenCard';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getOnsenSpots().map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const spot = getOnsenSpot(slug);
  const data = getSiteData();

  if (!spot) {
    return {
      title: '温泉地が見つかりません',
    };
  }

  return {
    title: `${spot.name}ガイド`,
    description: spot.summary,
    openGraph: {
      title: `${spot.name}ガイド | ${data.site.name}`,
      description: spot.summary,
      images: [
        {
          url: spot.image.src,
          width: 1200,
          height: 630,
          alt: spot.image.alt,
        },
      ],
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const spot = getOnsenSpot(slug);

  if (!spot) {
    notFound();
  }

  const related = getRelatedSpots(spot.slug, 3);

  return (
    <main className="bg-[#f7f3ec]">
      <section className="relative min-h-[72vh] overflow-hidden bg-stone-950 text-white">
        <Image
          src={spot.image.src}
          alt={spot.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-stone-950 to-transparent" />

        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:px-8 md:pb-20">
          <Link href="/docs" className="mb-10 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20">
            ← 温泉地一覧へ
          </Link>
          <p className="text-sm font-bold tracking-[0.28em] text-amber-200">{spot.prefecture} / {spot.area}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            {spot.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-stone-100">
            {spot.catchcopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <ImageCredit image={spot.image} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">BASIC DATA</p>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-bold text-stone-500">都道府県</dt>
                  <dd className="mt-1 text-lg font-semibold text-stone-950">{spot.prefecture}</dd>
                </div>
                <div>
                  <dt className="font-bold text-stone-500">エリア</dt>
                  <dd className="mt-1 text-lg font-semibold text-stone-950">{spot.area}</dd>
                </div>
                <div>
                  <dt className="font-bold text-stone-500">泉質</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {spot.springTypes.map((type) => (
                      <span key={type} className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs font-bold text-stone-700">
                        {type}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] bg-stone-950 p-6 text-white shadow-sm">
              <p className="text-sm font-bold tracking-[0.2em] text-amber-200">BEST FOR</p>
              <ul className="mt-5 space-y-3">
                {spot.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-stone-200">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-10">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">OVERVIEW</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950">温泉地の特徴</h2>
              <p className="mt-6 text-lg leading-9 text-stone-700">{spot.summary}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200">
                <p className="text-sm font-bold tracking-[0.2em] text-stone-500">ACCESS</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">アクセス</h2>
                <p className="mt-5 text-sm leading-8 text-stone-700">{spot.access}</p>
              </div>
              <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200">
                <p className="text-sm font-bold tracking-[0.2em] text-stone-500">STAY</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">過ごし方</h2>
                <p className="mt-5 text-sm leading-8 text-stone-700">{spot.stayStyle}</p>
              </div>
            </section>

            <section className="rounded-[2rem] bg-[#efe7da] p-7 shadow-sm ring-1 ring-stone-200 md:p-10">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">SEASON</p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">おすすめの季節</h2>
              <p className="mt-5 text-base leading-8 text-stone-700">{spot.season}</p>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">RELATED ONSEN</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950 md:text-5xl">近い条件の温泉地</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((relatedSpot) => (
              <OnsenCard key={relatedSpot.slug} spot={relatedSpot} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
