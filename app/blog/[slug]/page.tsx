import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticleImage, getArticles, getSiteData } from '../../lib/onsen-site';
import { ImageCredit } from '../../components/site/ImageCredit';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  const data = getSiteData();

  if (!article) {
    return { title: '記事が見つかりません' };
  }

  const image = getArticleImage(article);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | ${data.site.name}`,
      description: article.excerpt,
      images: [
        {
          url: image.src,
          width: 1200,
          height: 630,
          alt: image.alt,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const image = getArticleImage(article);

  return (
    <main className="bg-[#f7f3ec]">
      <article>
        <section className="relative min-h-[62vh] overflow-hidden bg-stone-950 text-white">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/20" />
          <div className="relative mx-auto flex min-h-[62vh] max-w-5xl flex-col justify-end px-5 pb-14 pt-24 md:px-8 md:pb-20">
            <Link href="/blog" className="mb-10 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20">
              ← 特集一覧へ
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.18em] text-amber-200">
              <span>{article.category}</span>
              <span>{article.date}</span>
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-100">{article.excerpt}</p>
            <div className="mt-8">
              <ImageCredit image={image} />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <div className="space-y-12 rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-12">
              {article.sections.map((section, index) => (
                <section key={section.heading}>
                  <p className="text-sm font-bold tracking-[0.2em] text-stone-400">0{index + 1}</p>
                  <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
                    {section.heading}
                  </h2>
                  <p className="mt-5 text-base leading-9 text-stone-700 md:text-lg">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
