'use client';

import { motion } from 'framer-motion';
import { PremiumCard } from '../Cards/PremiumCard';

interface GridSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  cards: Array<{
    title: string;
    description: string;
    image: string;
    href: string;
    category?: string;
  }>;
  variant?: 'ocean' | 'sky' | 'sunset';
}

export function GridSection({
  title,
  subtitle,
  description,
  cards,
  variant = 'ocean',
}: GridSectionProps) {
  const variantStyles = {
    ocean: {
      bg: 'bg-gradient-to-b from-cloud-white via-sky-50 to-cloud-white',
      accent: 'text-ocean-blue',
    },
    sky: {
      bg: 'bg-gradient-to-b from-sky-50 via-blue-50 to-sky-50',
      accent: 'text-sky-blue',
    },
    sunset: {
      bg: 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50',
      accent: 'text-amber-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={`${styles.bg} py-32 md:py-40`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* セクションヘッダー */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <p className={`text-sm md:text-base font-bold tracking-[0.2em] mb-4 ${styles.accent}`}>
              {subtitle}
            </p>
          )}

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PremiumCard
                title={card.title}
                description={card.description}
                image={card.image}
                href={card.href}
                category={card.category}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
