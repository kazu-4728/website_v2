'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { RecommendedOnsenSection } from '../../../lib/content';

interface RecommendedOnsenProps {
  data: RecommendedOnsenSection;
}

export function RecommendedOnsen({ data }: RecommendedOnsenProps) {
  const layout = data.layout || 'gallery';

  if (layout === 'gallery') {
    return (
      <section className="py-20 px-4 bg-dark-900">
        <div className="container mx-auto max-w-7xl">
        {/* Header - 大胆なタイポグラフィ */}
        <div className="text-center mb-20">
          {data.subtitle && (
            <motion.p 
              className="text-primary-400 text-base md:text-lg uppercase tracking-[0.3em] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {data.subtitle}
            </motion.p>
          )}
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {data.title}
          </motion.h2>
          {data.description && (
            <motion.p 
              className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {data.description}
            </motion.p>
          )}
        </div>

          {/* Gallery Grid - 大胆な画像配置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((item, index) => (
              <motion.div
                key={item.link}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.link.startsWith('/') ? item.link : `/${item.link.replace(/^\//, '')}`}>
                  <motion.div
                    className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl"
                    whileHover={{ scale: 1.08, y: -12, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
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

                    {/* Content - 大胆なタイポグラフィ */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <motion.h3 
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        {item.title}
                      </motion.h3>
                      {item.description && (
                        <motion.p 
                          className="text-gray-200 text-base md:text-lg leading-relaxed"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        >
                          {item.description}
                        </motion.p>
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
    <section className="py-32 px-4 bg-dark-900">
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
