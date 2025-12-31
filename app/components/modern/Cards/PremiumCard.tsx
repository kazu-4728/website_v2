'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface PremiumCardProps {
  title: string;
  description?: string;
  image: string;
  href: string;
  category?: string;
  height?: 'normal' | 'tall' | 'extra-tall';
  learnMoreText?: string;
}

export function PremiumCard({
  title,
  description,
  image,
  href,
  category,
  height = 'normal',
  learnMoreText = '詳しく見る',
}: PremiumCardProps) {
  const heightClasses = {
    normal: 'h-[500px]',
    tall: 'h-[600px]',
    'extra-tall': 'h-[700px] md:h-[800px]',
  };

  return (
    <Link href={href}>
      <motion.div
        className={`relative ${heightClasses[height]} rounded-3xl overflow-hidden group cursor-pointer shadow-xl`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 via-ocean-dark/40 to-transparent group-hover:from-ocean-dark/95 transition-colors duration-500" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
          {/* Category Badge */}
          {category && (
            <motion.span
              className="inline-block mb-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-ocean-blue text-sm font-semibold tracking-wide uppercase w-fit"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {category}
            </motion.span>
          )}

          {/* Title */}
          <motion.h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-gold-light transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          {description && (
            <motion.p
              className="text-base md:text-lg text-white/90 mb-6 line-clamp-2 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}

          {/* Read More Link */}
          <motion.div
            className="flex items-center text-white font-semibold group/link"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="mr-2">{learnMoreText}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-2" />
          </motion.div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gold-light/50 transition-all duration-500 pointer-events-none" />

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
}
