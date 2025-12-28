import Image from 'next/image';
import { TestimonialsSection } from '../../../lib/content';

interface Props {
  data: TestimonialsSection;
}

export function Testimonials({ data }: Props) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-mist to-cloud-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 md:mb-16 tracking-tight">
          {data.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {data.items.map((item, index) => (
            <div 
              key={index}
              className="bg-white/95 md:backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl border border-gray-200 relative hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 text-primary-500/10 text-5xl md:text-7xl font-serif leading-none group-hover:text-primary-500/20 transition-colors duration-300">
                "
              </div>
              
              <p className="text-sm md:text-base lg:text-lg text-gray-900 font-medium mb-6 md:mb-8 relative z-10 leading-relaxed tracking-wide">
                {item.content}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300 min-w-[44px] min-h-[44px]">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm md:text-base lg:text-lg">{item.author}</div>
                  <div className="text-xs md:text-sm text-gray-800 font-semibold">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
