'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { RecommendedOnsenSection } from '../../lib/content';

interface RecommendedOnsenProps {
  data: RecommendedOnsenSection;
}

export function RecommendedOnsen({ data }: RecommendedOnsenProps) {
  const layout = data.layout || 'gallery';

  if (layout === 'gallery') {
    return (
      <section className="py-20 px-4 bg-dark-900">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            {data.subtitle && (
              <p className="text-primary-400 text-sm uppercase tracking-wider mb-2">
                {data.subtitle}
              </p>
            )}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {data.title}
            </h2>
            {data.description && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {data.description}
              </p>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item, index) => (
              <motion.div
                key={item.link}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.link}>
                  <motion.div
                    className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/50 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-300 text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid layout fallback
  return (
    <section className="py-20 px-4 bg-dark-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {data.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <Link key={item.link} href={item.link}>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
