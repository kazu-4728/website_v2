import Link from 'next/link';
import { ArticleCard } from '../components/site/ArticleCard';
import { getArticleImage, getArticles, getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '記事',
    description: '温泉候補の選び方、公式サイトで確認すべき項目、日帰り・宿泊の判断軸を整理した記事です。',
    openGraph: {
      title: `記事 | ${data.site.name}`,
      description: '温泉候補の選び方と確認ポイントを整理した記事です。',
    },
  };
}

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">← トップへ戻る</Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">ARTICLES</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">温泉選びの確認ポイント。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              候補を選ぶ前に決める条件と、公式サイトで最後に確認すべき項目を整理します。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} image={getArticleImage(article)} />
          ))}
        </div>
      </section>
    </main>
  );
}
