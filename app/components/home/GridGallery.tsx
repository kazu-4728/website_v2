import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GridGallerySection } from '../../lib/content';

interface Props {
  data: GridGallerySection;
}

export function GridGallery({ data }: Props) {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h2>
          <p className="text-xl text-gray-400">{data.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl block"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.description}
                </p>
                <div className="flex items-center text-primary-400 text-sm font-medium opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100">
                  Learn more <ArrowUpRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
