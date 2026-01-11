'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  variant?: 'ocean' | 'sky' | 'sunset';
  titleSize?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  variant = 'ocean',
  titleSize = 'medium',
  className = '',
}: SectionHeaderProps) {
  const variantStyles = {
    ocean: 'text-ocean-blue',
    sky: 'text-sky-blue',
    sunset: 'text-amber-600',
  };

  const titleSizeClasses = {
    small: 'text-3xl md:text-4xl lg:text-5xl',
    medium: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    large: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl',
    xlarge: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
  };

  return (
    <motion.div
      className={`text-center mb-12 md:mb-16 lg:mb-20 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {subtitle && (
        <p className={`text-xs md:text-sm lg:text-base font-bold tracking-[0.2em] md:tracking-[0.3em] mb-4 ${variantStyles[variant]}`}>
          {subtitle}
        </p>
      )}

      <h2 className={`${titleSizeClasses[titleSize]} font-bold mb-6 text-gray-900 leading-tight tracking-tight font-serif`}>
        {title}
      </h2>

      {description && (
        <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}


