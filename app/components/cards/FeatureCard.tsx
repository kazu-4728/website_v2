'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8',
        'hover:bg-white/10 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/20',
        'transition-all duration-300',
        className
      )}
    >
      <div className="mb-6 inline-flex p-4 rounded-xl bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-dark-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}
