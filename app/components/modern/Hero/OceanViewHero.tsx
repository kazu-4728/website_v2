'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface OceanViewHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
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
  backgroundImage,
  actions = [],
}: OceanViewHeroProps) {
  const { scrollY } = useScroll();
  
  // パララックス効果: 背景画像がゆっくり動く
  const imageY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-screen min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          unoptimized={false}
        />
        {/* Light Overlay with温泉 & Sky Theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 via-blue-100/30 to-white/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-50/60 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center"
        style={{ y: contentY, opacity }}
      >
        {/* Subtitle as h2 - 温泉テーマカラー（視認性最優先）*/}
        {subtitle && (
          <motion.h2
            className="text-sm md:text-base font-bold tracking-[0.2em] mb-4 text-amber-900 drop-shadow-[0_1px_2px_rgba(255,255,255,1)]"
            style={{
              textShadow: '1px 1px 3px rgba(255, 255, 255, 0.95), -1px -1px 3px rgba(255, 255, 255, 0.95)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.h2>
        )}

        {/* Main Title as h1 - 温泉 & Sky カラー（視認性最優先 - 濃色）*/}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.15] tracking-tight"
          style={{
            color: '#1a1a1a',
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9), -1px -1px 3px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, type: 'spring', stiffness: 100 }}
        >
          {title.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        {/* Description - 温泉 & Sky テーマ（視認性最優先）*/}
        {description && (
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-900 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed font-semibold md:backdrop-blur-md bg-white/90 px-4 md:px-8 py-4 md:py-5 rounded-2xl border border-sky-300/60 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {description}
          </motion.p>
        )}

        {/* Action Buttons */}
        {actions.length > 0 && (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {actions.map((action, index) => (
              <Link key={index} href={action.href} className="min-h-[44px] min-w-[44px]">
                <motion.button
                  className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 ${
                    action.variant === 'primary'
                      ? 'btn-premium shadow-2xl'
                      : 'btn-accent shadow-2xl'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.label}
                </motion.button>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-gray-900 text-sm font-bold mb-2 group-hover:text-amber-800 transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,1)]">
            スクロール
          </span>
          <ChevronDown className="w-6 h-6 text-gray-900 group-hover:text-amber-800 transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,1)]" />
        </motion.div>
      </motion.div>

      {/* Decorative Wave at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="#fef3c7"
            fillOpacity="0.9"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,117.3C672,117,768,139,864,133.3C960,128,1056,96,1152,80C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </section>
  );
}
