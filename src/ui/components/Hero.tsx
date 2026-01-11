/**
 * UI Layer: Hero Component
 * 
 * ヒーローセクション（メインビジュアル）
 */

import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '../../../app/lib/base-path';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaLabel,
  ctaHref,
}: HeroProps) {
  const bgImage = backgroundImage || '/images/mvp/hero.jpg';

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={withBasePath(bgImage)}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {subtitle && (
          <h2 className="text-xl md:text-2xl text-white/90 mb-4 tracking-[0.2em] uppercase font-light">
            {subtitle}
          </h2>
        )}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {description}
          </p>
        )}

        {ctaLabel && ctaHref && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ctaHref}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 font-medium"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
