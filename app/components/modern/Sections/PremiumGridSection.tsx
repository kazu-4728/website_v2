'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface PremiumGridSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  layout: {
    type: string;
    columns: number;
    gap: string;
    cardHeight: string;
  };
  variant: 'ocean' | 'sky' | 'sunset';
  overlay?: {
    type: string;
    gradient: string;
  };
  items: Array<{
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
      focus?: string;
      overlay?: {
        type: string;
        opacity: number;
      };
    };
    link: string;
    category?: string;
    badge?: string;
    animation?: {
      hover: string;
      scroll: string;
    };
  }>;
}

export function PremiumGridSection({
  title,
  subtitle,
  description,
  layout,
  items,
}: PremiumGridSectionProps) {
  return (
    <section className="px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {subtitle && <p className="section-kicker mb-4">{subtitle}</p>}
          <h2 className="text-4xl leading-[1.12] text-[#2f241c] sm:text-5xl lg:text-6xl">
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          {description && <p className="mt-6 max-w-2xl text-base leading-8 text-[#68564a] sm:text-lg">{description}</p>}
        </motion.div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            layout.columns === 3 ? 'lg:grid-cols-3' : layout.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
          } ${layout.gap === 'large' ? 'gap-8' : 'gap-6'}`}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.link}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Link href={item.link} className="group block h-full">
                <article className="overflow-hidden rounded-[32px] border border-[#dac7b1] bg-[#fcf8f1] shadow-[0_20px_60px_rgba(53,37,27,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: item.image.focus || 'center center' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,12,9,0.04),rgba(17,12,9,0.42))]" />

                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      {item.category && (
                        <span className="rounded-full border border-white/25 bg-[#2b1c14]/55 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}
                      {item.badge && (
                        <span className="rounded-full border border-[#f0d1a6]/35 bg-[#c8914f]/82 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-[#fff8ef]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3 className="text-2xl leading-tight text-[#2f241c] sm:text-[1.9rem]">{item.title}</h3>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d6bea1] bg-white text-[#8e6231] transition-colors group-hover:bg-[#8e6231] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-[15px] leading-7 text-[#68564a]">{item.description}</p>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
