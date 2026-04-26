import Link from 'next/link';
import { getOnsenSpot, getPurposeSpots, getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '旅の選び方',
    description: '温泉地を写真・目的・滞在スタイルから選ぶためのガイドです。',
    openGraph: {
      title: `旅の選び方 | ${data.site.name}`,
      description: '温泉地を写真・目的・滞在スタイルから選ぶためのガイドです。',
    },
  };
}

export default function FeaturesPage() {
  const data = getSiteData();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">
            ← トップへ戻る
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">HOW TO CHOOSE</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">
              温泉地は、目的から逆算して選ぶ。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              写真で惹かれることは大事です。ただし、満足度は「誰と行くか」「何時間滞在するか」「宿で過ごすか街を歩くか」で変わります。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-7 md:grid-cols-3">
            {data.purposes.map((purpose, index) => {
              const spots = getPurposeSpots(purpose);
              return (
                <section key={purpose.id} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-8">
                  <p className="text-sm font-bold tracking-[0.2em] text-stone-400">0{index + 1}</p>
                  <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-950">{purpose.title}</h2>
                  <p className="mt-5 text-sm leading-8 text-stone-600">{purpose.description}</p>
                  <div className="mt-7 space-y-3">
                    {spots.map((spot) => (
                      <Link key={spot.slug} href={`/docs/${spot.slug}`} className="block rounded-2xl bg-[#f7f3ec] p-4 transition-colors hover:bg-[#efe7da]">
                        <p className="text-xs font-bold text-stone-500">{spot.prefecture} / {spot.area}</p>
                        <p className="mt-1 font-serif text-xl font-bold text-stone-950">{spot.name}</p>
                        <p className="mt-2 text-xs leading-5 text-stone-600">{spot.catchcopy}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <p className="text-sm font-bold tracking-[0.24em] text-amber-200">DECISION FLOW</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">迷った時の判断順</h2>
          </div>
          <ol className="grid gap-4">
            {[
              ['移動時間を決める', '日帰りなら片道90分前後、宿泊なら片道2〜3時間までを目安にします。'],
              ['宿時間か街歩きかを決める', '宿で過ごすなら静かな温泉郷、街歩きなら草津・伊香保・熱海のような温泉街が向きます。'],
              ['写真で最後に絞る', '条件が合った候補の中から、風景や湯の印象で決めると外しにくくなります。'],
            ].map(([title, body], index) => (
              <li key={title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-bold text-amber-200">STEP {index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
