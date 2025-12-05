import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { SplitFeatureSection } from '../../lib/content';
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../lib/images';

interface Props {
  data: SplitFeatureSection;
}

export function SplitFeature({ data }: Props) {
  const isRight = data.layout === 'image-right';
  
  // 画像のメタデータを取得（著作権情報）
  // セクションIDから画像のメタデータを取得
  const imageMetadata = getImageMetadata('sections', data.id);

  return (
    <section className="relative py-24 overflow-hidden bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isRight ? '' : 'lg:flex-row-reverse'}`}>
          
          {/* Content Side */}
          <div className="flex-1 space-y-6">
            {data.chapter && (
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl sm:text-6xl font-bold text-dark-800/40 select-none">
                  {data.chapter}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-dark-800 to-transparent" />
              </div>
            )}
            
            <div>
              {data.subtitle && (
                <p className="text-primary-400 font-semibold tracking-wider uppercase mb-3 text-sm">
                  {data.subtitle}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                {data.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
                {data.description}
              </p>
            </div>

            {data.stats && (
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-dark-800/60">
                {data.stats.map((stat, i) => (
                  <div key={i} className="group">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors duration-300">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {data.quote && (
              <blockquote className="border-l-4 border-primary-500 pl-6 py-3 italic text-gray-300 bg-dark-900/30 rounded-r-lg">
                <p className="text-base sm:text-lg">"{data.quote.text}"</p>
                <footer className="text-sm text-primary-400 mt-3 font-normal not-italic">
                  — {data.quote.author}
                </footer>
              </blockquote>
            )}

            {data.link && (
              <Link href={data.link.href} className="inline-block group mt-2">
                <span className="text-primary-400 hover:text-primary-300 font-medium text-base sm:text-lg transition-colors duration-300 flex items-center">
                  {data.link.text}
                  <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </div>

          {/* Image Side */}
          <div className="flex-1 relative w-full aspect-[4/3] lg:aspect-[4/5]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 group">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
              {/* 画像のクレジット表示 */}
              <ImageCredit metadata={imageMetadata} position="bottom-right" />
            </div>
            
            {/* Decorative Element */}
            <div className={`absolute -bottom-6 ${isRight ? '-left-6' : '-right-6'} w-24 h-24 bg-primary-500/10 rounded-full blur-3xl pointer-events-none`} />
          </div>
        </div>
      </div>
    </section>
  );
}
