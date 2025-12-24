'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
}

export function PremiumGridSection({
  title,
  subtitle,
  description,
  layout,
  variant,
  overlay,
  items,
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
    <section className={`bg-gradient-to-b ${styles.bg} py-32 md:py-48 relative`}>
      {/* セクションヘッダー */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <p className={`text-sm md:text-base font-bold tracking-[0.3em] mb-4 ${styles.accent}`}>
              {subtitle}
            </p>
          )}

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight tracking-tight font-serif">
            {title}
          </h2>

          {description && (
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      {/* カードグリッド - マイクロインタラクション強化 */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            layout.columns === 3 ? 'lg:grid-cols-3' : layout.columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
          } ${layout.gap === 'large' ? 'gap-8' : 'gap-6'}`}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.link}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link href={item.link} className="group block">
                <motion.div
                  className="relative h-[600px] rounded-3xl overflow-hidden shadow-xl"
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

                  {/* カテゴリバッジ - 浮き上がり効果 */}
                  {item.category && (
                    <motion.div
                      className={`absolute top-6 left-6 ${styles.categoryBg} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm`}
                      whileHover={{ y: -4, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.category}
                    </motion.div>
                  )}

                  {/* 特別バッジ */}
                  {item.badge && (
                    <motion.div
                      className={`absolute top-6 right-6 ${styles.badge} px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                    >
                      {item.badge}
                    </motion.div>
                  )}

                  {/* コンテンツ - スライドアップ効果 + 透明化＋ドロップシャドウ */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent backdrop-blur-md"
                    initial={{ y: 20 }}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 font-serif"
                      style={{
                        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {item.title}
                    </h3>
                    
                    <motion.p
                      className="text-white/95 text-lg leading-relaxed"
                      style={{
                        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
                      }}
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {item.description}
                    </motion.p>

                    {/* ホバー時の矢印アイコン */}
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-white font-bold"
                      style={{
                        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
                      }}
                      initial={{ x: 0, opacity: 0 }}
                      whileHover={{ x: 10, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span>詳しく見る</span>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

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
