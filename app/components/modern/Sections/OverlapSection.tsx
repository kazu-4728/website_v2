'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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
  image,
  typography,
  action,
}: OverlapSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    layout.imagePosition === 'left' ? ['-4%', '4%'] : ['4%', '-4%']
  );

  return (
    <section ref={ref} className="overflow-hidden px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.95fr,1.05fr] md:items-center">
        <motion.div
          className={`${layout.imagePosition === 'right' ? 'md:order-2' : ''} relative min-h-[520px] overflow-hidden rounded-[36px] shadow-[0_28px_90px_rgba(31,21,15,0.16)]`}
          style={{ x: imageX }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,15,11,0.08),rgba(22,15,11,0.38))]" />
        </motion.div>

        <motion.div
          className={`${layout.imagePosition === 'right' ? 'md:order-1' : ''} paper-panel onsen-grain relative rounded-[36px] p-8 sm:p-10 md:p-12`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && <p className="section-kicker mb-4">{subtitle}</p>}
          <h2
            className={`${typography?.titleSize || 'text-4xl sm:text-5xl lg:text-6xl'} leading-[1.12] text-[#2f241c]`}
            style={{ fontFamily: typography?.font === 'serif' ? 'var(--font-heading)' : 'inherit' }}
          >
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-base leading-8 text-[#5f4a3b] sm:text-lg">{description}</p>

          {action && (
            <div className="mt-10">
              <Link href={action.href} className="btn-premium inline-flex px-8 py-4 text-sm uppercase tracking-[0.22em]">
                {action.label}
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
