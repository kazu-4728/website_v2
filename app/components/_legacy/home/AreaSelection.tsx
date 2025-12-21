'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { AreaSelectionSection } from '../../../lib/content';

interface AreaSelectionProps {
  data: AreaSelectionSection;
}

export function AreaSelection({ data }: AreaSelectionProps) {
  const columns = data.columns || 3;
  const hoverEffect = data.hoverEffect || 'zoom-lift';

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-cream via-warm-beige to-sand">
      <div className="container mx-auto max-w-7xl">
        {/* Header - 大胆なタイポグラフィ */}
        <div className="text-center mb-20">
          {data.subtitle && (
            <motion.p 
              className="text-warm-orange text-base md:text-lg uppercase tracking-[0.3em] mb-4 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {data.subtitle}
            </motion.p>
          )}
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-cyan mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {data.title}
          </motion.h2>
          {data.description && (
            <motion.p 
              className="text-deep-indigo text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {data.description}
            </motion.p>
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
              <Link href={item.link.startsWith('/') ? item.link : `/${item.link.replace(/^\//, '')}`}>
                <motion.div
                  className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border-4 border-white/50"
                  whileHover={
                    hoverEffect === 'zoom-lift'
                      ? { scale: 1.08, y: -12, boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.4)' }
                      : hoverEffect === 'zoom'
                      ? { scale: 1.08, boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.4)' }
                      : { y: -12, boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.4)' }
                  }
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

                  {/* Overlay - 明るく調整 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/30 to-transparent" />

                  {/* 和風装飾 - 金色の枠 */}
                  <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500 rounded-3xl" />

                  {/* Content - 大胆なタイポグラフィ */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <motion.h3 
                      className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-gradient-cyan drop-shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.title}
                    </motion.h3>
                    {item.description && (
                      <motion.p 
                        className="text-white text-base md:text-lg line-clamp-3 leading-relaxed backdrop-blur-sm bg-deep-indigo/20 p-3 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        {item.description}
                      </motion.p>
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
