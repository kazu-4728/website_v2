import Link from 'next/link';
import { getOnsenSpots, getSiteData } from '../lib/onsen-site';
import { OnsenCard } from '../components/site/OnsenCard';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '温泉地一覧',
    description: '関東近郊の温泉地を写真・泉質・アクセス・過ごし方から比較できます。',
    openGraph: {
      title: `温泉地一覧 | ${data.site.name}`,
      description: '関東近郊の温泉地を写真・泉質・アクセス・過ごし方から比較できます。',
    },
  };
}

export default function DocsIndexPage() {
  const spots = getOnsenSpots();
  const prefectures = Array.from(new Set(spots.map((spot) => spot.prefecture)));
  const springTypes = Array.from(new Set(spots.flatMap((spot) => spot.springTypes)));

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">
            ← トップへ戻る
          </Link>
          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_0.75fr] md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">ONSEN DIRECTORY</p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">
                写真と条件で選ぶ、関東近郊の温泉地。
              </h1>
            </div>
            <p className="text-base leading-8 text-stone-600 md:text-lg">
              ここでは、ページ量産の軸になる温泉地データを一覧化しています。今後はこのJSONに温泉地を追加するだけで、一覧・詳細・関連記事の導線を増やせます。
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-[#f7f3ec] p-6 ring-1 ring-stone-200">
              <p className="text-sm font-bold text-stone-500">掲載温泉地</p>
              <p className="mt-2 font-serif text-5xl font-bold text-stone-950">{spots.length}</p>
            </div>
            <div className="rounded-3xl bg-[#f7f3ec] p-6 ring-1 ring-stone-200">
              <p className="text-sm font-bold text-stone-500">都県</p>
              <p className="mt-2 font-serif text-5xl font-bold text-stone-950">{prefectures.length}</p>
            </div>
            <div className="rounded-3xl bg-[#f7f3ec] p-6 ring-1 ring-stone-200">
              <p className="text-sm font-bold text-stone-500">泉質カテゴリ</p>
              <p className="mt-2 font-serif text-5xl font-bold text-stone-950">{springTypes.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap gap-2">
            {prefectures.map((prefecture) => (
              <span key={prefecture} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-200">
                {prefecture}
              </span>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {spots.map((spot, index) => (
              <OnsenCard key={spot.slug} spot={spot} priority={index < 3} size="large" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
