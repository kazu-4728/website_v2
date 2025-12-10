'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { AreaSelectionSection } from '../../lib/content';

interface AreaSelectionProps {
  data: AreaSelectionSection;
}

export function AreaSelection({ data }: AreaSelectionProps) {
  const columns = data.columns || 3;
  const hoverEffect = data.hoverEffect || 'zoom-lift';

  return (
    <section className="py-20 px-4 bg-dark-950">
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

        {/* Grid */}
        <div
          className={`grid gap-6 ${
            columns === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : columns === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {data.items.map((item, index) => (
            <motion.div
              key={item.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.link}>
                <motion.div
                  className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
                  whileHover={
                    hoverEffect === 'zoom-lift'
                      ? { scale: 1.05, y: -8 }
                      : hoverEffect === 'zoom'
                      ? { scale: 1.05 }
                      : { y: -8 }
                  }
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
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Shadow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
