import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GridGallerySection, loadContent } from '../../../lib/content';

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
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-cloud-white via-mist to-cloud-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(30, 64, 175, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          {data.subtitle && (
            <p className="text-primary-600 font-semibold tracking-wider uppercase mb-3 text-sm">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">{data.title}</h2>
          <div className="bg-white/90 md:backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-md inline-block">
            <p className="text-base md:text-lg lg:text-xl text-gray-900 font-medium leading-relaxed tracking-wide">{data.description}</p>
          </div>
        </div>

        <div className={`grid ${gridCols} gap-4 sm:gap-6 md:gap-8 lg:gap-10`}>
          {data.items.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="group relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl block shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:shadow-primary-900/20 hover:-translate-y-3 min-h-[44px]"
            >
              {/* Image with enhanced zoom effect */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15]"
                />
                {/* Enhanced gradient overlay with light effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 transition-all duration-500 group-hover:from-black/98 group-hover:via-black/60" />
                {/* Subtle light overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 w-full transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors duration-300 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2 sm:line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center text-primary-400 text-sm font-semibold transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary-300 min-h-[44px]">
                  {texts.buttons.learnMoreEn} <ArrowUpRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              
              {/* Border glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500/30 transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
