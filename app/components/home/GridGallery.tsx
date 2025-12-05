import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GridGallerySection, loadContent } from '../../lib/content';

interface Props {
  data: GridGallerySection;
}

export async function GridGallery({ data }: Props) {
  const content = await loadContent();
  const texts = content.texts;
  
  // Determine grid columns based on number of items
  const itemCount = data.items.length;
  const gridCols = itemCount === 4 
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
    : itemCount === 6 
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
    : 'grid-cols-1 md:grid-cols-3';
  
  return (
    <section className="py-24 bg-dark-950 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {data.subtitle && (
            <p className="text-primary-400 font-semibold tracking-wider uppercase mb-3 text-sm">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{data.title}</h2>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">{data.description}</p>
        </div>

        <div className={`grid ${gridCols} gap-6 sm:gap-8`}>
          {data.items.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl block shadow-xl shadow-black/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/30"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black" />
              
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
                <div className="flex items-center text-primary-400 text-sm font-semibold transition-all duration-300 group-hover:translate-x-1">
                  {texts.buttons.learnMoreEn} <ArrowUpRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
