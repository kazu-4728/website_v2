'use client';

import { motion } from 'framer-motion';
import { Container } from './Container';
import { cn } from '../../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  className?: string;
}

export function PageHeader({ title, description, backgroundImage, className }: PageHeaderProps) {
  return (
    <div className={cn('relative py-20 md:py-32 overflow-hidden', className)}>
      {/* Background */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/90 to-dark-950" />
        </>
      )}
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient">{title}</span>
          </h1>
          {description && (
            <p className="text-xl md:text-2xl text-dark-300 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
