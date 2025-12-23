import Image from 'next/image';
import { TestimonialsSection } from '../../../lib/content';

interface Props {
  data: TestimonialsSection;
}

export function Testimonials({ data }: Props) {
  return (
    <section className="py-24 bg-gradient-to-b from-mist to-cloud-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 tracking-tight">
          {data.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {data.items.map((item, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-gray-200 relative hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-500/10 text-7xl font-serif leading-none group-hover:text-primary-500/20 transition-colors duration-300">
                "
              </div>
              
              <p className="text-base sm:text-lg text-gray-700 mb-8 relative z-10 leading-relaxed">
                {item.content}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg">{item.author}</div>
                  <div className="text-sm text-gray-600">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
