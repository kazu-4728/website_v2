import Link from 'next/link';
import { getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '運営方針',
    description: '関東湯旅案内の運営方針、公式サイト導線、画像利用、データ確認方針について。',
    openGraph: {
      title: `運営方針 | ${data.site.name}`,
      description: '公式情報と画像利用方針を明確にした温泉ディレクトリの運営方針です。',
    },
  };
}

export default function AboutPage() {
  const data = getSiteData();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">← トップへ戻る</Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">EDITORIAL POLICY</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">公式情報に辿れる温泉ディレクトリ。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              {data.site.name} は、温泉地や施設の画像を無断転載せず、利用可能な画像と公式サイト導線を分けて管理する方針です。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 md:grid-cols-3 md:px-8">
          {[
            ['公式サイトは確認導線', '営業時間、料金、休館日、アクセスは変動します。各カードには公式サイトへの導線を置き、最終確認を促します。'],
            ['画像は許諾・ライセンス重視', '公式サイト画像を無断転載せず、Wikimedia Commonsなど出典とライセンスを確認できる画像だけを掲載します。'],
            ['JSONで量産できる構成', 'エリア、目的、温泉候補、記事をJSONで分け、ページ追加と更新を安定して進められる構造にします。'],
          ].map(([title, body], index) => (
            <section key={title} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-8">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-400">0{index + 1}</p>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-950">{title}</h2>
              <p className="mt-5 text-sm leading-8 text-stone-600">{body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
