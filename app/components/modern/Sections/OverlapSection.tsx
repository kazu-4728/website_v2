/**
 * @deprecated This component is defined in content.json but not currently rendered.
 * It may be used in the future if content.json sections are rendered dynamically.
 */

'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ActionButton } from '../ui/ActionButton';

interface OverlapSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  layout: {
    type: string;
    imagePosition: 'left' | 'right';
    overlap: string;
  };
  variant: 'ocean' | 'sky' | 'sunset';
  image: {
    url: string;
    alt: string;
    mask?: string;
  };
  typography?: {
    titleOrientation?: string;
    titleSize?: string;
    font?: string;
  };
  action?: {
    label: string;
    href: string;
    style?: string;
  };
  animation?: {
    type: string;
    scrollReveal?: boolean;
  };
}

export function OverlapSection({
  title,
  subtitle,
  description,
  layout,
  variant,
  image,
  typography,
  action,
  animation,
}: OverlapSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    layout.imagePosition === 'left' ? ['-10%', '5%'] : ['10%', '-5%']
  );
  const contentX = useTransform(
    scrollYProgress,
    [0, 1],
    layout.imagePosition === 'left' ? ['10%', '-5%'] : ['-10%', '5%']
  );

  const variantStyles = {
    ocean: {
      bg: 'bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100',
      accent: 'text-ocean-blue',
      button: 'bg-ocean-blue hover:bg-ocean-blue/90',
    },
    sky: {
      bg: 'bg-gradient-to-br from-cloud-white via-mist to-sky-50',
      accent: 'text-sky-blue',
      button: 'bg-sky-blue hover:bg-sky-blue/90',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100',
      accent: 'text-amber-600',
      button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    },
  };

  const styles = variantStyles[variant];
  const isVertical = typography?.titleOrientation === 'vertical-right';

  return (
    <section
      ref={ref}
      className={`${styles.bg} py-16 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative">
          {/* 画像側 - オーバーラップ配置（レスポンシブ最適化） */}
          <motion.div
            className={`relative ${
              layout.imagePosition === 'left' 
                ? 'md:float-left md:mr-[-20%]' 
                : 'md:float-right md:ml-[-20%]'
            } w-full md:w-[55%] mb-8 md:mb-0`}
            style={{ x: imageX }}
          >
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
                loading="lazy"
                quality={85}
                unoptimized={false}
              />
              
              {/* 波形対角マスク */}
              {image.mask === 'wave-diagonal' && (
                <svg
                  className={`absolute ${
                    layout.imagePosition === 'left' ? 'right-0' : 'left-0'
                  } top-0 h-full w-32`}
                  viewBox="0 0 100 800"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,0 Q50,400 0,800 L100,800 L100,0 Z"
                    fill="white"
                  />
                </svg>
              )}
              
              {/* グラデーションオーバーレイ */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                variant === 'sunset'
                  ? 'from-amber/30'
                  : variant === 'ocean'
                    ? 'from-ocean-blue/30'
                    : 'from-sky-blue/30'
              } via-transparent to-transparent`} />
            </div>
          </motion.div>

          {/* テキスト側 - オーバーラップ + 透明化 */}
          <motion.div
            className={`relative ${
              layout.imagePosition === 'left'
                ? 'md:pl-[45%]'
                : 'md:pr-[45%]'
            } ${isVertical ? 'flex flex-col items-end' : ''}`}
            style={{ x: contentX }}
          >
            <div className={`bg-white/70 md:backdrop-blur-2xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 shadow-2xl border border-white/40 ${
              layout.imagePosition === 'left' ? 'md:ml-[-10%]' : 'md:mr-[-10%]'
            }`}>
              {subtitle && (
                <motion.p
                  className={`text-xs md:text-sm lg:text-base font-bold tracking-[0.3em] mb-4 ${styles.accent} [text-shadow:1px_1px_3px_rgba(255,255,255,0.8)]`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {subtitle}
                </motion.p>
              )}

              <motion.h2
                className={`${typography?.titleSize || 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl'} font-bold mb-6 text-gray-900 leading-tight tracking-tight ${typography?.font === 'serif' ? 'font-heading' : ''} [text-shadow:2px_2px_4px_rgba(255,255,255,0.5)]`}
                style={{
                  writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
                  textOrientation: isVertical ? 'upright' : 'mixed',
                } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {title.split('\n').map((line, i) => (
                  <span key={i} className={isVertical ? 'inline-block mx-4' : 'block'}>
                    {line}
                  </span>
                ))}
              </motion.h2>

              <motion.p
                className="text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed mb-8 [text-shadow:1px_1px_2px_rgba(255,255,255,0.5)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {description}
              </motion.p>

              {action && (
                <ActionButton
                  label={action.label}
                  href={action.href}
                  variant={variant}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
