import type { LoadedOnsen } from '@/src/content/loaders/onsen';

export function StorySection({ onsen }: { onsen: LoadedOnsen }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Story</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">この温泉が旅として成立する理由</h2>
        <p className="mt-6 text-base leading-8 text-[var(--color-fog)]">{onsen.story.intro}</p>
        <div className="mt-8 space-y-8">
          {onsen.story.sections.map((section) => (
            <article key={section.title} className="space-y-3">
              <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
              <div className="space-y-3 text-base leading-8 text-[var(--color-muted)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Seasonal Notes</p>
          <div className="mt-5 space-y-4">
            {onsen.story.seasonalNotes.map((note) => (
              <article key={note.season} className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{note.season}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{note.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-fog)]">{note.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Model Course</p>
          <ol className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-fog)]">
            {onsen.story.modelCourse.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-ink)]">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
