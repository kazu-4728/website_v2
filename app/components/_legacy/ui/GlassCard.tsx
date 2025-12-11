'use client';

import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = true, glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -8, scale: 1.02 } : undefined}
      className={cn(
        'bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8',
        hover && 'hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300',
        glow && 'hover:shadow-2xl hover:shadow-primary-500/20',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
