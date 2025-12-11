'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import { cn } from '../../../lib/utils';

interface ContentCardProps {
  title: string;
  description: string;
  image?: string;
  href: string;
  badge?: string;
  meta?: { icon: React.ReactNode; text: string }[];
  className?: string;
}

export function ContentCard({
  title,
  description,
  image,
  href,
  badge,
  meta,
  className,
}: ContentCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden',
          'hover:bg-white/10 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/20',
          'transition-all duration-300',
          className
        )}
      >
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
            {badge && (
              <div className="absolute top-4 right-4">
                <Badge variant="primary">{badge}</Badge>
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
            {title}
          </h3>
          <p className="text-dark-300 mb-4 leading-relaxed">{description}</p>
          
          {/* Meta */}
          {meta && meta.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm text-dark-400">
              {meta.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary-400">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
