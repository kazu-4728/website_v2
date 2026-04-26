import Link from 'next/link';
import { OnsenCard } from '../components/site/OnsenCard';
import { getAreaForOnsen, getOnsens, getPurposes, getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '温泉一覧',
    description: '関東近郊の温泉候補を、公式サイト導線、目的タグ、泉質、エリアから比較できます。',
    openGraph: {
      title: `温泉一覧 | ${data.site.name}`,
      description: '関東近郊の温泉候補を公式サイト導線付きで比較できます。',
    },
  };
}

export default function OnsensPage() {
  const onsens = getOnsens();
  const purposes = getPurposes();
  const prefectures = Array.from(new Set(onsens.map((onsen) => onsen.prefecture)));
  const tags = Array.from(new Set(onsens.flatMap((onsen) => onsen.tags))).slice(0, 12);

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">← トップへ戻る</Link>
          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_0.75fr] md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">ONSEN DIRECTORY</p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">公式情報へ進める温泉候補。</h1>
            </div>
            <p className="text-base leading-8 text-stone-600 md:text-lg">
              公式サイト、情報確認日、画像クレジットを持つ温泉候補だけを一覧化します。最終判断は各カードの公式サイトで確認してください。
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {prefectures.map((prefecture) => <span key={prefecture} className="rounded-full bg-[#f7f3ec] px-4 py-2 text-sm font-bold text-stone-700 ring-1 ring-stone-200">{prefecture}</span>)}
            {tags.map((tag) => <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">{tag}</span>)}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-8">
          {onsens.map((onsen, index) => (
            <OnsenCard key={onsen.slug} onsen={onsen} area={getAreaForOnsen(onsen)} purposes={purposes} priority={index < 3} />
          ))}
        </div>
      </section>
    </main>
  );
}
