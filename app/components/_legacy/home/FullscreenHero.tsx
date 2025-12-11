'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../../lib/images';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { HomeHero } from '../../../lib/content';

interface FullscreenHeroProps {
  data: HomeHero;
}

/**
 * FullscreenHero - 「あえの風」レベルのフルスクリーンHero
 * 
 * 特徴:
 * - 画面全体（100vh）を使用
 * - 複数画像のスライダー（自動切り替え、手動切り替え）
 * - 洗練されたオーバーレイテキスト（グラデーション、タイポグラフィ）
 * - パララックス効果
 * - スムーズなアニメーション
 */
export function FullscreenHero({ data }: FullscreenHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const slides = data.slides || [];
  const hasSlides = slides.length > 0;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = hasSlides ? slides[currentSlideIndex] : null;
  
  const autoplay = data.autoplay !== false;
  const interval = data.interval || 3000;
  
  useEffect(() => {
    if (!hasSlides || slides.length <= 1 || shouldReduceMotion || !autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [hasSlides, slides.length, shouldReduceMotion, autoplay, interval]);

  const bgImage = hasSlides && currentSlide ? currentSlide.bgImage : data.bgImage;
  const imageMetadata = getImageMetadata('hero', hasSlides && currentSlide ? currentSlide.imageKey : 'main');
  
  const displayData = {
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    secondaryDescription: data.secondaryDescription,
    badges: data.badges,
    actions: data.actions,
  };

  // Overlay設定の処理
  const overlayConfig = typeof data.overlay === 'object' ? data.overlay : { gradient: undefined, position: 'bottom' };
  const overlayGradient = overlayConfig.gradient || 'from-dark-950/90 via-dark-950/70 to-transparent';
  const overlayPosition = overlayConfig.position || 'bottom';

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image - 画面全体を使用 */}
      <motion.div 
        className="absolute inset-0 z-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={hasSlides ? currentSlideIndex : 'single'}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: shouldReduceMotion ? 0 : 2, ease: 'easeInOut' }}
          >
            <Image
              src={bgImage}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
            
            {/* 洗練されたオーバーレイグラデーション */}
            <div className={`absolute inset-0 bg-gradient-to-${overlayPosition === 'top' ? 'b' : overlayPosition === 'center' ? 't' : 't'} ${overlayGradient}`} />
            
            {/* 画像のクレジット表示 */}
            <ImageCredit metadata={imageMetadata} position="bottom-right" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content - 画面中央に配置、大胆なタイポグラフィ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          {/* Subtitle - 洗練されたタイポグラフィ */}
          <motion.p 
            className="text-xl md:text-2xl font-light tracking-[0.4em] text-primary-300 mb-8 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            {displayData.subtitle}
          </motion.p>

          {/* Title - 大胆なタイポグラフィ */}
          <motion.h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tight mb-12 leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          >
            {displayData.title.split('\n').map((line, i) => (
              <motion.span 
                key={i} 
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          {/* Main Description - 洗練されたタイポグラフィ */}
          <motion.p 
            className="text-2xl md:text-3xl lg:text-4xl text-gray-100 max-w-4xl mx-auto mb-8 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          >
            {displayData.description}
          </motion.p>

          {/* Secondary Description */}
          {displayData.secondaryDescription && (
            <motion.p 
              className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
            >
              {displayData.secondaryDescription}
            </motion.p>
          )}

          {/* Badges - 洗練されたデザイン */}
          {displayData.badges && displayData.badges.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
            >
              {displayData.badges.map((badge, index) => (
                <motion.span
                  key={index}
                  className={`px-6 py-3 rounded-full text-base font-medium backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                    badge.variant === 'primary' 
                      ? 'bg-primary-500/30 text-primary-200 border-2 border-primary-400/50' 
                      : 'bg-white/15 text-white border-2 border-white/30'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>
          )}
          
          {/* Action Buttons - 大胆なデザイン */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
          >
            {displayData.actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={action.href}>
                  <Button 
                    variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                    size="xl"
                    className="min-w-[240px] text-lg sm:text-xl px-8 py-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/50"
                  >
                    {action.label}
                    {action.variant === 'primary' && <ArrowRightIcon className="ml-3 w-6 h-6" />}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Slide Indicators - 洗練されたデザイン */}
      {hasSlides && slides.length > 1 && !shouldReduceMotion && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlideIndex
                  ? 'bg-primary-400 w-12 shadow-lg shadow-primary-400/50'
                  : 'bg-white/40 hover:bg-white/60 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator - 洗練されたデザイン */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-[2px] h-20 bg-gradient-to-b from-transparent via-white/80 to-transparent" />
      </motion.div>
    </section>
  );
}
