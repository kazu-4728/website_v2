'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '../../lib/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating,
  className,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8',
        'hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300',
        className
      )}
    >
      {/* Rating */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-primary-500' : 'text-dark-600'}>
              ★
            </span>
          ))}
        </div>
      )}
      
      {/* Quote */}
      <blockquote className="text-lg text-dark-200 mb-6 leading-relaxed">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center gap-4">
        {avatar && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={avatar} alt={author} fill className="object-cover" />
          </div>
        )}
        <div>
          <div className="font-semibold text-white">{author}</div>
          <div className="text-sm text-dark-400">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}
