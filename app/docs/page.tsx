import { loadContent } from '../lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';

export default async function DocsIndexPage() {
  const content = await loadContent();
  const docs = content.pages.docs || [];
  const texts = content.texts;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f3ea_0%,#f0e4d2_100%)] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <Link href="/" className="inline-flex items-center text-sm uppercase tracking-[0.22em] text-[#8e6231] transition-colors hover:text-[#5f4a3b]">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {texts.nav.backLinks.home}
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl pb-12">
          <p className="section-kicker mb-4">Onsen Guide</p>
          <h1 className="text-5xl md:text-6xl text-[#2f241c] mb-6 tracking-tight">
            {texts.pages.onsenGuide?.title || '温泉ガイド'}
          </h1>
          <p className="text-lg md:text-xl text-[#68564a] leading-8">
            {texts.pages.onsenGuide?.description || '関東エリアの温泉地をご紹介'}
          </p>
        </div>

        <div className="grid gap-8 md:gap-10">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group overflow-hidden rounded-[34px] border border-[#dac7b1] bg-[#fbf7f0] shadow-[0_20px_60px_rgba(53,37,27,0.08)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="grid md:grid-cols-[0.95fr,1.05fr]">
                <div className="relative min-h-[280px] overflow-hidden md:min-h-[340px]">
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,9,0.04),rgba(18,12,9,0.38))]" />
                </div>

                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="section-kicker mb-4 text-[0.68rem]">
                    {doc.subtitle || texts.ui.labels.documentation}
                  </div>
                  <h2 className="text-3xl md:text-4xl text-[#2f241c] mb-4 leading-tight">
                    {doc.title}
                  </h2>
                  <p className="text-[#68564a] mb-8 leading-8 max-w-2xl">{doc.description}</p>
                  <div className="inline-flex items-center text-sm uppercase tracking-[0.22em] text-[#8e6231] group-hover:text-[#5f4a3b]">
                    {texts.buttons.learnMore}
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {docs.length === 0 && <div className="py-12 text-center text-[#7d6a5b]">{texts.messages.notFound.docs}</div>}
      </section>
    </main>
  );
}


