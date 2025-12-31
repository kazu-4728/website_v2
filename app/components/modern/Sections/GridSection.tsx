'use client';

import { motion } from 'framer-motion';
import { PremiumCard } from '../Cards/PremiumCard';
import { SectionHeader } from '../ui/SectionHeader';

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
    <section className={`${styles.bg} py-16 md:py-24 lg:py-32`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* セクションヘッダー */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          variant={variant}
          titleSize="medium"
        />

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
