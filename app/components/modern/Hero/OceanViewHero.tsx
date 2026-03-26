'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface OceanViewHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  secondaryDescription?: string;
  backgroundImage: string;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'primary' | 'secondary';
  }>;
  actions?: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
  }>;
}

export function OceanViewHero({
  title,
  subtitle,
  description,
  secondaryDescription,
  backgroundImage,
  badges = [],
  actions = [],
}: OceanViewHeroProps) {
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.08]);
  const contentY = useTransform(scrollY, [0, 500], [0, 70]);
  const contentOpacity = useTransform(scrollY, [0, 260], [1, 0.2]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#1b140f] text-white">
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src={backgroundImage}
          alt="温泉風景"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 steam-veil" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#120c08] via-[#120c08]/70 to-transparent" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-20 pt-32 sm:px-8 md:pb-24"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-4xl">
          {subtitle && (
            <motion.p
              className="mb-5 text-sm font-semibold uppercase tracking-[0.34em] text-[#f1d8ba]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            className="max-w-4xl text-5xl leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.8rem]"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.35)' }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          {description && (
            <motion.div
              className="mt-8 max-w-2xl rounded-[30px] border border-white/18 bg-[linear-gradient(180deg,rgba(40,28,20,0.44),rgba(23,16,12,0.58))] p-6 backdrop-blur-md sm:p-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <p className="text-base leading-8 text-[#f8f1e8] sm:text-lg">{description}</p>
              {secondaryDescription && (
                <p className="mt-4 border-t border-white/12 pt-4 text-sm uppercase tracking-[0.22em] text-[#e4c29a] sm:text-[0.82rem]">
                  {secondaryDescription}
                </p>
              )}
            </motion.div>
          )}

          {badges.length > 0 && (
            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur-sm ${
                    badge.variant === 'primary'
                      ? 'border-[#e8c59d]/50 bg-[#d7aa73]/18 text-[#fff2de]'
                      : 'border-white/20 bg-white/8 text-white/86'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </motion.div>
          )}

          {actions.length > 0 && (
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              {actions.map((action, index) => (
                <Link key={index} href={action.href} className={action.variant === 'primary' ? 'btn-premium px-8 py-4 text-sm uppercase tracking-[0.22em]' : 'btn-accent px-8 py-4 text-sm uppercase tracking-[0.22em]'}>
                  {action.label}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-[#f0dcc4]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[0.7rem] uppercase tracking-[0.34em]">Scroll</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
