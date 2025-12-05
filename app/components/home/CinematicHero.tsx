'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../lib/images';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    secondaryDescription?: string;
    badges?: Array<{
      label: string;
      variant?: 'default' | 'primary' | 'secondary';
    }>;
    bgImage: string;
    actions: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
  };
}

export function CinematicHero({ data }: HeroProps) {
  // 画像のメタデータを取得（著作権情報）
  const imageMetadata = getImageMetadata('hero', 'hero-night');
  
  // Check if user prefers reduced motion
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const bgVariants = {
    initial: { scale: shouldReduceMotion ? 1 : 1.1 },
    animate: { 
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut' }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with slow zoom */}
      <motion.div 
        className="absolute inset-0 z-0"
        variants={bgVariants}
        initial="initial"
        animate="animate"
      >
        <Image
          src={data.bgImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Darker, more dramatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-950" />
        {/* 画像のクレジット表示 */}
        <ImageCredit metadata={imageMetadata} position="bottom-right" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center text-white py-32">
        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl font-light tracking-[0.3em] text-primary-400 mb-8 uppercase"
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0 }}
        >
          {data.subtitle}
        </motion.p>

        {/* Title */}
        <motion.h1 
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-10 leading-[1.1]"
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          {data.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </motion.h1>

        {/* Main Description */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed"
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          {data.description}
        </motion.p>

        {/* Secondary Description */}
        {data.secondaryDescription && (
          <motion.p 
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.25 }}
          >
            {data.secondaryDescription}
          </motion.p>
        )}

        {/* Badges */}
        {data.badges && data.badges.length > 0 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            {data.badges.map((badge, index) => (
              <motion.span
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  badge.variant === 'primary' 
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30' 
                    : 'bg-white/10 text-white border border-white/20'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                {badge.label}
              </motion.span>
            ))}
          </motion.div>
        )}
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 sm:gap-6"
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          {data.actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
            >
              <Link href={action.href}>
                <Button 
                  variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                  size="xl"
                  className="min-w-[180px] sm:min-w-[220px] text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {action.label}
                  {action.variant === 'primary' && <ArrowRightIcon className="ml-2 w-5 h-5" />}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
      </div>
    </section>
  );
}
