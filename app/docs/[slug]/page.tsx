import { getDocPage, getAllDocSlugs, loadContent } from '../../lib/content';
import { MarkdownRenderer } from '../../components/ui/MarkdownRenderer';
import { TableOfContents } from '../../components/ui/TableOfContents';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = await getDocPage(slug);
  
  // 全記事を取得して前後のナビゲーションを計算
  const content = await loadContent();
  const allDocs = content.pages.docs || [];
  const currentIndex = allDocs.findIndex(p => p.slug === slug);
  const nextDoc = currentIndex >= 0 && currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;

  if (!page) {
    notFound();
  }

  return (
    <main className="bg-dark-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] flex items-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={page.image}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/30" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Link href="/docs" className="inline-flex items-center text-primary-400 mb-8 hover:text-primary-300 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Journey
          </Link>
          
          {page.subtitle && (
            <p className="text-primary-500 font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
              {page.subtitle}
            </p>
          )}
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up delay-100 leading-tight">
            {page.title}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up delay-200 border-l-2 border-primary-500 pl-6">
            {page.description}
          </p>
        </div>
      </div>

      {/* Content Wrapper with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* Mobile Table of Contents */}
            <div className="lg:hidden mb-8">
              <details className="card-glass rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between p-4 font-bold text-white cursor-pointer bg-white/5 hover:bg-white/10 transition-colors list-none">
                  <span>Table of Contents</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 border-t border-white/10">
                  <TableOfContents content={page.content} />
                </div>
              </details>
            </div>

            <div className="card-glass rounded-2xl p-8 md:p-12 bg-dark-900/50">
              <MarkdownRenderer content={page.content} />
            </div>

            {/* Navigation (Next/Prev) */}
            <div className="mt-16 flex flex-col md:flex-row justify-between gap-8">
              {prevDoc ? (
                 <Link href={`/docs/${prevDoc.slug}`} className="group flex-1">
                   <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Previous Chapter</div>
                   <div className="card-glass p-6 rounded-xl group-hover:bg-white/5 transition-colors flex items-center gap-4">
                     <ArrowLeftIcon className="w-5 h-5 text-primary-500 group-hover:-translate-x-1 transition-transform" />
                     <div>
                       <div className="text-white font-bold text-lg">{prevDoc.title}</div>
                     </div>
                   </div>
                 </Link>
              ) : <div className="flex-1" />}

              {nextDoc ? (
                 <Link href={`/docs/${nextDoc.slug}`} className="group flex-1 text-right">
                   <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Next Chapter</div>
                   <div className="card-glass p-6 rounded-xl group-hover:bg-white/5 transition-colors flex items-center justify-end gap-4">
                     <div>
                       <div className="text-white font-bold text-lg">{nextDoc.title}</div>
                     </div>
                     <ArrowRightIcon className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </Link>
              ) : <div className="flex-1" />}
            </div>
          </div>

          {/* Desktop Sidebar Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24">
               <div className="card-glass rounded-xl p-6 bg-dark-900/50">
                 <TableOfContents content={page.content} />
               </div>
             </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
