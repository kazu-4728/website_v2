import type { JournalArticle } from '@/src/content/schema/site';

export function JournalArticleView({ article }: { article: JournalArticle }) {
  return (
    <article className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
      <div className="space-y-8">
        {article.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-3xl font-semibold text-white">{section.title}</h2>
            <div className="space-y-3 text-base leading-8 text-[var(--color-muted)]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
