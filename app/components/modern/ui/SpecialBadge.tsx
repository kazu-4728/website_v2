'use client';

import { motion } from 'framer-motion';

interface SpecialBadgeProps {
  label: string;
  variant?: 'ocean' | 'sky' | 'sunset';
  position?: 'top-left' | 'top-right';
  delay?: number;
  className?: string;
}

export function SpecialBadge({
  label,
  variant = 'ocean',
  position = 'top-right',
  delay = 0,
  className = '',
}: SpecialBadgeProps) {
  const variantStyles = {
    ocean: 'bg-ocean-blue/10 text-ocean-blue',
    sky: 'bg-sky-blue/10 text-sky-blue',
    sunset: 'bg-amber-500/10 text-amber-700',
  };

  const positionClasses = {
    'top-left': 'top-4 md:top-6 left-4 md:left-6',
    'top-right': 'top-4 md:top-6 right-4 md:right-6',
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} ${variantStyles[variant]} px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold md:backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {label}
    </motion.div>
  );
}


