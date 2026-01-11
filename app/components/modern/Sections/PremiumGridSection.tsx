/**
 * @deprecated This component is defined in content.json but not currently rendered.
 * It may be used in the future if content.json sections are rendered dynamically.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CategoryBadge } from '../ui/CategoryBadge';
import { SpecialBadge } from '../ui/SpecialBadge';
import { CardContent } from '../ui/CardContent';
import { SectionHeader } from '../ui/SectionHeader';

interface PremiumGridSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  layout: {
    type: string;
    columns: number;
    gap: string;
    cardHeight: string;
  };
  variant: 'ocean' | 'sky' | 'sunset';
  overlay?: {
    type: string;
    gradient: string;
  };
  items: Array<{
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
      focus?: string;
      overlay?: {
        type: string;
        opacity: number;
      };
    };
    link: string;
    category?: string;
    badge?: string;
    animation?: {
      hover: string;
      scroll: string;
    };
  }>;
  learnMoreText?: string;
}

export function PremiumGridSection({
  title,
  subtitle,
  description,
  layout,
  variant,
  overlay,
  items,
  learnMoreText = '詳しく見る',
}: PremiumGridSectionProps) {

  const variantStyles = {
    ocean: {
      bg: 'from-cloud-white via-mist to-cloud-white',
      accent: 'text-ocean-blue',
      badge: 'bg-ocean-blue/10 text-ocean-blue',
      categoryBg: 'bg-sky-blue/90',
    },
    sky: {
      bg: 'from-sky-50 via-blue-50 to-sky-50',
      accent: 'text-sky-blue',
      badge: 'bg-sky-blue/10 text-sky-blue',
      categoryBg: 'bg-ocean-blue/90',
    },
    sunset: {
      bg: 'from-amber-50 via-orange-50 to-amber-50',
      accent: 'text-amber-600',
      badge: 'bg-amber-500/10 text-amber-700',
      categoryBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={`bg-gradient-to-b ${styles.bg} py-16 md:py-24 lg:py-32 xl:py-48 relative`}>
      {/* セクションヘッダー */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12 md:mb-16 lg:mb-20">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          variant={variant}
          titleSize="large"
        />
      </div>

      {/* カードグリッド - マイクロインタラクション強化 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            layout.columns === 3 ? 'lg:grid-cols-3' : layout.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
          } ${layout.gap === 'large' ? 'gap-4 sm:gap-6 md:gap-8' : 'gap-4 sm:gap-6 md:gap-8'}`}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.link}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link href={item.link} className="group block min-h-[44px]">
                <motion.div
                  className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.03, rotateY: 2 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* 画像 - ズーム＆回転効果 + フォーカス位置制御 */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      objectPosition: item.image.focus || 'center center',
                    }}
                    whileHover={{ scale: 1.15, rotate: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: item.image.focus || 'center center',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={85}
                      unoptimized={false}
                    />
                  </motion.div>

                  {/* オーバーレイ - JSON制御の質感（霧、湯気、光の反射） */}
                  {item.image.overlay && (
                    <motion.div
                      className={`absolute inset-0 ${
                        item.image.overlay.type === 'steam'
                          ? 'bg-gradient-to-t from-white/60 via-blue-100/30 to-transparent'
                          : item.image.overlay.type === 'mist'
                          ? 'bg-gradient-to-b from-sky-200/40 via-transparent to-transparent'
                          : item.image.overlay.type === 'light-reflection'
                          ? 'bg-gradient-to-br from-amber-200/30 via-transparent to-transparent'
                          : 'bg-gradient-to-t from-gray-200/30 via-transparent to-transparent'
                      }`}
                      style={{
                        opacity: item.image.overlay.opacity || 0.3,
                      }}
                      whileHover={{ opacity: (item.image.overlay.opacity || 0.3) * 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* グラデーションオーバーレイ - ホバーで変化 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"
                    whileHover={{ opacity: 0.7 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* カテゴリバッジ */}
                  {item.category && (
                    <CategoryBadge
                      label={item.category}
                      variant={variant}
                      position="top-left"
                    />
                  )}

                  {/* 特別バッジ */}
                  {item.badge && (
                    <SpecialBadge
                      label={item.badge}
                      variant={variant}
                      position="top-right"
                      delay={index * 0.1 + 0.5}
                    />
                  )}

                  {/* コンテンツ */}
                  <CardContent
                    title={item.title}
                    description={item.description}
                    learnMoreText={learnMoreText}
                  />

                  {/* 金色のボーダー - ホバー時に表示 */}
                  <motion.div
                    className="absolute inset-0 border-4 border-amber-400 rounded-3xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
