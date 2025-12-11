'use client';

import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { cn } from '../../../lib/utils';

interface ContentSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
};

export function ContentSection({
  children,
  title,
  subtitle,
  description,
  centered = false,
  size = 'md',
  className,
}: ContentSectionProps) {
  return (
    <section className={cn(sizeClasses[size], className)}>
      <Container>
        {(title || subtitle || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('mb-12 md:mb-16', centered && 'text-center')}
          >
            {subtitle && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 text-sm font-semibold border border-primary-500/30 mb-4">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gradient">{title}</span>
              </h2>
            )}
            {description && (
              <p className={cn(
                'text-xl text-dark-300 leading-relaxed',
                centered && 'max-w-3xl mx-auto'
              )}>
                {description}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </Container>
    </section>
  );
}
