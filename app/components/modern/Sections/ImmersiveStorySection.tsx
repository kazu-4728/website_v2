'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ImmersiveStorySectionProps {
  title: string;
  subtitle?: string;
  description: string;
  image: {
    url: string;
    alt: string;
    position?: string;
    scale?: string;
  };
  overlay?: {
    type: string;
    gradient: string;
  };
  typography?: {
    titleSize?: string;
    orientation?: string;
    font?: string;
  };
  animation?: {
    type: string;
    scrollSpeed?: number;
    fadeIn?: boolean;
  };
}

export function ImmersiveStorySection({
  title,
  subtitle,
  description,
  image,
  overlay,
  typography,
  animation,
}: ImmersiveStorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 深いパララックス効果
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${(animation?.scrollSpeed || 0.5) * 100}%`]
  );
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景画像 - 深いパララックス */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
        
        {/* 波形マスク付きオーバーレイ */}
        {overlay?.type === 'wave-mask' && (
          <>
            <div className={`absolute inset-0 bg-gradient-to-b ${overlay.gradient}`} />
            <svg
              className="absolute bottom-0 left-0 w-full h-48"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,0 C300,80 600,40 900,80 C1050,100 1150,60 1200,80 L1200,120 L0,120 Z"
                fill="white"
                opacity="0.3"
              />
              <path
                d="M0,20 C300,100 600,60 900,100 C1050,120 1150,80 1200,100 L1200,120 L0,120 Z"
                fill="white"
                opacity="0.5"
              />
              <path
                d="M0,40 C300,120 600,80 900,120 C1050,140 1150,100 1200,120 L1200,120 L0,120 Z"
                fill="white"
              />
            </svg>
          </>
        )}
      </motion.div>

      {/* コンテンツ - 明朝体縦書き対応 */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8"
        style={{ y: contentY, opacity }}
      >
        {subtitle && (
          <motion.p
            className="text-sm md:text-base font-bold tracking-[0.3em] mb-6 text-white/90 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h2
          className={`${typography?.titleSize || 'text-6xl md:text-8xl lg:text-9xl'} font-bold mb-8 leading-[1.1] tracking-tight text-white text-center`}
          style={{
            fontFamily: typography?.font === 'serif' ? 'var(--font-heading)' : 'inherit',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
            writingMode: typography?.orientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {title.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed text-center"
          style={{
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* スクロールインジケーター - 優雅なアニメーション */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/70 text-sm tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
