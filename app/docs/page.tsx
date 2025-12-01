import { loadContent } from '../lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ArrowRightIcon, BookOpenIcon, ArrowLeftIcon } from 'lucide-react';

export default async function DocsIndexPage() {
  const content = await loadContent();
  const docs = content.pages.docs || [];
  const texts = content.texts;

  return (
    <main className="bg-dark-950 min-h-screen">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {texts.nav.backLinks.home}
        </Link>
      </div>

      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            温泉ガイド
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            関東エリアの名湯・秘湯を徹底ガイド。各温泉地の特徴、効能、アクセス情報から、おすすめの宿泊施設まで、温泉旅行に役立つ情報を網羅しています。
          </p>
        </div>
      </section>

      {/* Docs List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid gap-8 md:gap-12">
          {docs.map((doc, index) => (
            <Link 
              key={doc.slug} 
              href={`/docs/${doc.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-dark-900 border border-dark-800 hover:border-primary-500/50 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark-900/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-primary-400 mb-4 text-sm font-medium uppercase tracking-wider">
                    <BookOpenIcon className="w-4 h-4" />
                    <span>{doc.subtitle || 'Documentation'}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                    {doc.title}
                  </h2>
                  
                  <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl">
                    {doc.description}
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    詳しく見る
                    <ArrowRightIcon className="ml-2 w-5 h-5 text-primary-500" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {docs.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            温泉ガイドが見つかりませんでした。
          </div>
        )}
      </section>
    </main>
  );
}
