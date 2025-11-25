import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { SplitFeatureSection } from '../../lib/content';

interface Props {
  data: SplitFeatureSection;
}

export function SplitFeature({ data }: Props) {
  const isRight = data.layout === 'image-right';

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${isRight ? '' : 'lg:flex-row-reverse'}`}>
          
          {/* Content Side */}
          <div className="flex-1 space-y-8">
            {data.chapter && (
              <div className="flex items-center gap-4">
                <span className="text-6xl font-bold text-dark-800 opacity-50 select-none">
                  {data.chapter}
                </span>
                <div className="h-[1px] flex-1 bg-dark-800" />
              </div>
            )}
            
            <div>
              <p className="text-primary-400 font-medium tracking-wider uppercase mb-2">
                {data.subtitle}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                {data.title}
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                {data.description}
              </p>
            </div>

            {data.stats && (
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-dark-800">
                {data.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {data.quote && (
              <blockquote className="border-l-4 border-primary-500 pl-6 py-2 italic text-gray-300 bg-dark-900/50 rounded-r-lg">
                "{data.quote.text}"
                <footer className="text-sm text-primary-400 mt-2 font-normal not-italic">
                  — {data.quote.author}
                </footer>
              </blockquote>
            )}

            {data.link && (
              <Link href={data.link.href} className="inline-block">
                <Button variant="ghost" className="group text-lg px-0 hover:bg-transparent hover:text-primary-400">
                  {data.link.text}
                  <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>

          {/* Image Side */}
          <div className="flex-1 relative w-full aspect-[4/5] lg:aspect-square">
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/20">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Decorative Element */}
            <div className={`absolute -bottom-8 ${isRight ? '-left-8' : '-right-8'} w-32 h-32 bg-primary-600/10 rounded-full blur-2xl`} />
          </div>
        </div>
      </div>
    </section>
  );
}
