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
  typography,
  animation,
}: ImmersiveStorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${(animation?.scrollSpeed || 0.18) * 100}%`]
  );

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.15fr,0.85fr] md:items-end">
        <motion.div
          className="relative min-h-[520px] overflow-hidden rounded-[36px] shadow-[0_28px_90px_rgba(31,21,15,0.16)]"
          style={{ y: imageY }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            style={{ objectPosition: image.position || 'center center' }}
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,18,13,0.08),rgba(26,18,13,0.35))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1f1510]/80 to-transparent" />
        </motion.div>

        <motion.div
          className="paper-panel onsen-grain relative rounded-[36px] p-8 sm:p-10 md:-ml-20 md:p-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9 }}
        >
          {subtitle && <p className="section-kicker mb-4">{subtitle}</p>}
          <h2
            className={`${typography?.titleSize || 'text-4xl sm:text-5xl lg:text-6xl'} max-w-xl leading-[1.12] text-[#2f241c]`}
            style={{ fontFamily: typography?.font === 'serif' ? 'var(--font-heading)' : 'inherit' }}
          >
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-base leading-8 text-[#5f4a3b] sm:text-lg">{description}</p>
          <div className="mt-8 h-px w-24 bg-gradient-to-r from-[#bf8748] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
