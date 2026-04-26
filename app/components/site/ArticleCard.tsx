import Image from 'next/image';
import Link from 'next/link';
import type { Article, SiteImage } from '../../lib/onsen-site';

interface ArticleCardProps {
  article: Article;
  image: SiteImage;
}

export function ArticleCard({ article, image }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group grid overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-[0.85fr_1fr]"
    >
      <div className="relative min-h-64 overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-black/0" />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.18em] text-stone-500">
          <span>{article.category}</span>
          <span>{article.date}</span>
        </div>
        <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-950 md:text-4xl">{article.title}</h3>
        <p className="mt-4 text-sm leading-7 text-stone-600">{article.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-stone-950">
          記事を読む <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
