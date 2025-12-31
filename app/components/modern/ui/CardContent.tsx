'use client';

import { motion } from 'framer-motion';

interface CardContentProps {
  title: string;
  description: string;
  learnMoreText: string;
  className?: string;
}

export function CardContent({
  title,
  description,
  learnMoreText,
  className = '',
}: CardContentProps) {
  return (
    <motion.div
      className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent md:backdrop-blur-md ${className}`}
      initial={{ y: 20 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h3
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 font-serif"
        style={{
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {title}
      </h3>

      <motion.p
        className="text-white/95 text-base md:text-lg leading-relaxed"
        style={{
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
        }}
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
      >
        {description}
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
        <span>{learnMoreText}</span>
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
  );
}

