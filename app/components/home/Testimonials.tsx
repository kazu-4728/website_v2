import Image from 'next/image';
import { TestimonialsSection } from '../../lib/content';

interface Props {
  data: TestimonialsSection;
}

export function Testimonials({ data }: Props) {
  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          {data.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {data.items.map((item, index) => (
            <div 
              key={index}
              className="bg-dark-800 p-8 rounded-2xl border border-dark-700 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-dark-600 text-6xl font-serif leading-none opacity-20">
                "
              </div>
              
              <p className="text-lg text-gray-300 mb-8 relative z-10">
                {item.content}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-dark-600">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-white">{item.author}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
