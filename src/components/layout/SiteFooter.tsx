import { ButtonLink } from '@/src/components/shared/ButtonLink';
import type { SiteConfig } from '@/src/content/schema/site';

export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t border-white/8 bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.5fr_1fr] md:px-8">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Footer</p>
          <h2 className="max-w-2xl text-3xl font-semibold text-white md:text-4xl">{site.footer.headline}</h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">{site.footer.description}</p>
        </div>
        <div className="space-y-5 rounded-[2rem] border border-white/8 bg-white/4 p-6">
          <p className="text-sm leading-7 text-[var(--color-fog)]">{site.footer.note}</p>
          <ButtonLink href="/contact">旅の相談をする</ButtonLink>
        </div>
      </div>
    </footer>
  );
}
