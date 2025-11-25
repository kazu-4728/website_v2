'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  backgroundImage?: string;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <div className={cn('relative min-h-[80vh] flex items-center overflow-hidden', className)}>
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-dark-950/80 to-dark-950" />
        </>
      )}
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 text-sm font-semibold border border-primary-500/30">
                {subtitle}
              </span>
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-dark-300 mb-10 leading-relaxed"
          >
            {description}
          </motion.p>
          
          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button variant="primary" size="lg">
                    {primaryCta.text}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button variant="secondary" size="lg">
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </Container>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
