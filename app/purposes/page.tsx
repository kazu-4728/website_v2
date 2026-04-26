import Link from 'next/link';
import { getPurposeOnsens, getPurposes, getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '目的別に探す',
    description: '日帰り、宿泊、温泉街、静養、家族旅行など、目的から関東の温泉候補を探せます。',
    openGraph: {
      title: `目的別に探す | ${data.site.name}`,
      description: '目的から関東の温泉候補を探せます。',
    },
  };
}

export default function PurposesPage() {
  const purposes = getPurposes();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">← トップへ戻る</Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">PURPOSE GUIDE</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">目的から温泉を選ぶ。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">温泉地名から探す前に、日帰り・宿泊・街歩き・静養など目的を決めると候補が絞れます。</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-8">
          {purposes.map((purpose) => {
            const onsens = getPurposeOnsens(purpose);
            return (
              <Link key={purpose.id} href={`/purposes/${purpose.slug}`} className="group rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-1 hover:shadow-xl">
                <p className="text-sm font-bold tracking-[0.2em] text-stone-400">{purpose.shortLabel}</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">{purpose.name}</h2>
                <p className="mt-4 text-sm leading-7 text-stone-600">{purpose.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {onsens.slice(0, 4).map((onsen) => (
                    <span key={onsen.slug} className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs font-bold text-stone-700">{onsen.name}</span>
                  ))}
                </div>
                <span className="mt-7 inline-flex text-sm font-bold text-stone-950">候補を見る →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
