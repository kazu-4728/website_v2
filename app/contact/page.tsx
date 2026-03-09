import { ButtonLink } from '@/src/components/shared/ButtonLink';
import { SectionHeading } from '@/src/components/shared/SectionHeading';
import { loadSiteConfig } from '@/src/content/loaders/site';

export default async function ContactPage() {
  const site = await loadSiteConfig();
  const contact = site.contactPage;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-6 md:p-8">
          <SectionHeading eyebrow={contact.eyebrow} title={contact.title} description={contact.description} />
          <ul className="mt-8 space-y-3 text-sm leading-7 text-[var(--color-fog)]">
            {contact.highlights.map((item: string) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(201,167,92,0.14),rgba(17,29,31,0.92))] p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Contact</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">旅の条件を送る</h2>
            </div>
            <div className="space-y-3 text-sm leading-7 text-[var(--color-fog)]">
              <p>メール: <a href={`mailto:${contact.email}`} className="text-[var(--color-accent)]">{contact.email}</a></p>
              <p>拠点: {contact.office}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-5 text-sm leading-7 text-[var(--color-fog)]">
              <p>送ってほしい情報</p>
              <ul className="mt-3 space-y-2">
                <li>・出発地と使える移動時間</li>
                <li>・日帰りか宿泊か</li>
                <li>・好きな景色、泉質、旅館の雰囲気</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${contact.email}`}>メールで相談する</ButtonLink>
              <ButtonLink href="/onsen" variant="secondary">先に一覧を見る</ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
