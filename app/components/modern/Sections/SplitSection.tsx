'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SplitSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  action?: {
    label: string;
    href: string;
  };
  variant?: 'ocean' | 'sky' | 'sunset';
}

export function SplitSection({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  imagePosition = 'left',
  action,
  variant = 'ocean',
}: SplitSectionProps) {
  const variantStyles = {
    ocean: {
      bg: 'bg-gradient-to-b from-sky-50 via-blue-50 to-sky-50',
      accent: 'text-ocean-blue',
      button: 'bg-ocean-blue hover:bg-ocean-blue/90',
    },
    sky: {
      bg: 'bg-gradient-to-b from-cloud-white via-mist to-cloud-white',
      accent: 'text-sky-blue',
      button: 'bg-sky-blue hover:bg-sky-blue/90',
    },
    sunset: {
      bg: 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50',
      accent: 'text-amber-600',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={`${styles.bg} py-32 md:py-40`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div
          className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center ${
            imagePosition === 'right' ? 'md:flex-row-reverse' : ''
          }`}
        >
          {/* 画像側 */}
          <motion.div
            className={`relative ${imagePosition === 'right' ? 'md:order-2' : ''}`}
            initial={{ opacity: 0, x: imagePosition === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Ocean & Sky オーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-blue/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* テキスト側 */}
          <motion.div
            className={imagePosition === 'right' ? 'md:order-1' : ''}
            initial={{ opacity: 0, x: imagePosition === 'left' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle && (
              <p className={`text-sm md:text-base font-bold tracking-[0.2em] mb-4 ${styles.accent}`}>
                {subtitle}
              </p>
            )}

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
              {title}
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              {description}
            </p>

            {action && (
              <Link href={action.href}>
                <motion.button
                  className={`${styles.button} text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.label}
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
