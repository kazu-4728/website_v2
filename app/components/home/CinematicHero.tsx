'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../lib/images';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { HomeHero } from '../../lib/content';

interface HeroProps {
  data: HomeHero;
}

export function CinematicHero({ data }: HeroProps) {
  // Check if user prefers reduced motion
  const shouldReduceMotion = useReducedMotion();
  
  // マルチスライド対応: slidesがある場合はスライドショー、ない場合は従来の単一画像
  const slides = data.slides || [];
  const hasSlides = slides.length > 0;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = hasSlides ? slides[currentSlideIndex] : null;
  
  // スライド自動切り替え（5秒ごと）
  useEffect(() => {
    if (!hasSlides || shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [hasSlides, slides.length, shouldReduceMotion]);

  // 使用する画像とメタデータ
  const bgImage = hasSlides ? currentSlide?.bgImage || data.bgImage : data.bgImage;
  const imageMetadata = getImageMetadata('hero', hasSlides ? currentSlide?.imageKey || 'main' : 'main');
  
  // 表示するコンテンツ（スライドがある場合はスライドの内容、ない場合は従来のdata）
  const displayData = hasSlides && currentSlide ? {
    title: currentSlide.title,
    subtitle: currentSlide.subtitle,
    description: currentSlide.description,
    secondaryDescription: currentSlide.secondaryDescription,
    badges: currentSlide.badges,
    actions: data.actions,
  } : {
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    secondaryDescription: data.secondaryDescription,
    badges: data.badges,
    actions: data.actions,
  };

  // Animation variants
  const bgVariants = {
    initial: { scale: shouldReduceMotion ? 1 : 1.1 },
    animate: { 
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut' }
    }
  };

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
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
      {/* Background Image with slow zoom and crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={hasSlides ? currentSlideIndex : 'single'}
            className="absolute inset-0"
            variants={bgVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={bgImage}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </motion.div>
            {/* Darker, more dramatic overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-950" />
            {/* 画像のクレジット表示 */}
            <ImageCredit metadata={imageMetadata} position="bottom-right" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center text-white py-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={hasSlides ? currentSlideIndex : 'single'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl font-light tracking-[0.3em] text-primary-400 mb-8 uppercase"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0 }}
            >
              {displayData.subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1 
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-10 leading-[1.1]"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              {displayData.title.split('\n').map((line, i) => (
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
              {displayData.description}
            </motion.p>

            {/* Secondary Description */}
            {displayData.secondaryDescription && (
              <motion.p 
                className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.25 }}
              >
                {displayData.secondaryDescription}
              </motion.p>
            )}

            {/* Badges */}
            {displayData.badges && displayData.badges.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-12"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
              >
                {displayData.badges.map((badge, index) => (
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
              {displayData.actions.map((action, index) => (
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators (only shown when slides exist) */}
      {hasSlides && slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'bg-primary-400 w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block z-20">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
      </div>
    </section>
  );
}
