import Link from 'next/link';
import { getArticleImage, getArticles, getSiteData } from '../lib/onsen-site';
import { ArticleCard } from '../components/site/ArticleCard';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: '特集記事',
    description: '温泉地選び、1泊2日の組み立て方、写真から選ぶ旅の考え方をまとめた特集記事です。',
    openGraph: {
      title: `特集記事 | ${data.site.name}`,
      description: '温泉地選び、1泊2日の組み立て方、写真から選ぶ旅の考え方をまとめた特集記事です。',
    },
  };
}

export default function BlogPage() {
  const articles = getArticles();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">
            ← トップへ戻る
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">FEATURE ARTICLES</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">
              温泉旅を組み立てるための記事。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              温泉地の選び方、1泊2日の時間配分、写真だけで判断しないための軸を整理します。
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
