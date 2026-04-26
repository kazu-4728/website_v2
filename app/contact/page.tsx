import Link from 'next/link';
import { getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '運営方針',
    description: '関東湯旅案内の運営方針、画像・データ整備方針、今後の拡張方針を掲載しています。',
    openGraph: {
      title: `運営方針 | ${data.site.name}`,
      description: '関東湯旅案内の運営方針、画像・データ整備方針、今後の拡張方針を掲載しています。',
    },
  };
}

export default function ContactPage() {
  const data = getSiteData();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">
            ← トップへ戻る
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">EDITORIAL POLICY</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">
              まだ問い合わせ窓口より、サイトの核を整える段階です。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              {data.site.name} は、温泉地データ・画像出典・記事をJSONで管理し、温泉紹介ページを安定して量産するためのサイト基盤として再構築中です。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 md:grid-cols-3 md:px-8">
          {[
            {
              title: '画像を重視する',
              body: '温泉紹介サイトでは写真が入口になります。仮画像で埋めるのではなく、出典・ライセンス・altを持つ画像データをJSONに含めて管理します。',
            },
            {
              title: 'データからページを作る',
              body: '温泉地を追加するたびにページを手作業で作るのではなく、slug、説明、泉質、アクセス、画像を追加すれば一覧と詳細に反映される構成にします。',
            },
            {
              title: '旧UIに戻らない',
              body: '既存のlegacyコンポーネントを使い回さず、温泉メディア用のsiteコンポーネントへ統一します。問い合わせ機能は必要になってから実装します。',
            },
          ].map((item, index) => (
            <section key={item.title} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-8">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-400">0{index + 1}</p>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-950">{item.title}</h2>
              <p className="mt-5 text-sm leading-8 text-stone-600">{item.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
