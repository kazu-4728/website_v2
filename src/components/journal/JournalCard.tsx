import Link from 'next/link';

import { Pill } from '@/src/components/shared/Pill';
import type { JournalArticle } from '@/src/content/schema/site';

export function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="space-y-4">
        <Pill className="text-[var(--color-accent)]">{article.category}</Pill>
        <div>
          <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-[var(--color-accent)]">{article.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{article.excerpt}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--color-fog)]">
          <span>{article.readTime}</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}
