'use client';

import { motion } from 'framer-motion';

interface CardContentProps {
  title: string;
  description: string;
  learnMoreText: string;
  className?: string;
  image?: string;
}

export function CardContent({
  title,
  description,
  learnMoreText,
  className = '',
  image,
}: CardContentProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      initial={{ y: 20 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
        </div>
      )}
      <div className={`relative z-10 p-4 md:p-6 lg:p-8 ${!image ? 'bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent md:backdrop-blur-md' : ''}`}>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 font-serif [text-shadow:2px_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)]">
          {title}
        </h3>

        <motion.p
          className="text-white/95 text-base md:text-lg leading-relaxed [text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>

        {/* ホバー時の矢印アイコン */}
        <motion.div
          className="mt-4 flex items-center gap-2 text-white font-bold [text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]"
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
      </div>
    </motion.div>
  );
}


