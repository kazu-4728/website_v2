/**
 * @deprecated This component is not currently used.
 * It may be used in the future if content.json sections are rendered dynamically.
 */

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { ActionButton } from '../ui/ActionButton';

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
    },
    sky: {
      bg: 'bg-gradient-to-b from-cloud-white via-mist to-cloud-white',
      accent: 'text-sky-blue',
    },
    sunset: {
      bg: 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50',
      accent: 'text-amber-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={`${styles.bg} py-16 md:py-24 lg:py-32`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className={`grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
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
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
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
            <div className="space-y-6">
              {subtitle && (
                <p className={`text-xs md:text-sm lg:text-base font-bold tracking-[0.2em] mb-4 ${styles.accent}`}>
                  {subtitle}
                </p>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
                {title}
              </h2>

              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                {description}
              </p>

              {action && (
                <ActionButton
                  label={action.label}
                  href={action.href}
                  variant={variant}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
