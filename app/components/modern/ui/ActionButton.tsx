'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  label: string;
  href: string;
  variant?: 'ocean' | 'sky' | 'sunset';
  className?: string;
}

export function ActionButton({
  label,
  href,
  variant = 'ocean',
  className = '',
}: ActionButtonProps) {
  const variantStyles = {
    ocean: 'bg-ocean-blue hover:bg-ocean-blue/90',
    sky: 'bg-sky-blue hover:bg-sky-blue/90',
    sunset: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
  };

  return (
    <Link href={href} className={`min-h-[44px] min-w-[44px] inline-block ${className}`}>
      <motion.button
        className={`${variantStyles[variant]} text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-full font-bold text-base md:text-lg shadow-lg md:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)' }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{label}</span>
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </Link>
  );
}


