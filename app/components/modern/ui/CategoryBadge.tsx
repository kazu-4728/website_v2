'use client';

import { motion } from 'framer-motion';

interface CategoryBadgeProps {
  label: string;
  variant?: 'ocean' | 'sky' | 'sunset';
  position?: 'top-left' | 'top-right';
  className?: string;
}

export function CategoryBadge({
  label,
  variant = 'ocean',
  position = 'top-left',
  className = '',
}: CategoryBadgeProps) {
  const variantStyles = {
    ocean: 'bg-sky-blue/90',
    sky: 'bg-ocean-blue/90',
    sunset: 'bg-gradient-to-r from-amber-500 to-orange-500',
  };

  const positionClasses = {
    'top-left': 'top-4 md:top-6 left-4 md:left-6',
    'top-right': 'top-4 md:top-6 right-4 md:right-6',
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} ${variantStyles[variant]} text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg md:backdrop-blur-sm ${className}`}
      whileHover={{ y: -4, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.div>
  );
}

