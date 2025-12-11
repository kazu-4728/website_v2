'use client';

import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  change?: string;
  className?: string;
}

export function StatCard({ value, label, icon, change, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6',
        'hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl font-bold text-gradient">{value}</div>
        {icon && <div className="text-primary-400">{icon}</div>}
      </div>
      <div className="text-dark-300 text-sm">{label}</div>
      {change && (
        <div className="mt-2 text-xs text-green-400">
          {change}
        </div>
      )}
    </motion.div>
  );
}
