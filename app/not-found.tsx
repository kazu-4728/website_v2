'use client';

import Link from 'next/link';
import { Button } from './components/ui/Button';
import { HomeIcon, SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// 静的エクスポートのため、texts.jsonの内容を直接使用
const notFoundTexts = {
  title: "ページが見つかりません",
  subtitle: "404 - Page Not Found",
  description: "お探しのページは存在しないか、移動した可能性があります。",
  backHome: "ホームに戻る",
  searchOnsen: "温泉を探す",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        {/* 湯気のような背景パターン */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} 
          />
        </div>
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-dark-950" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 大きな数字 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <span className="text-[150px] sm:text-[200px] font-bold text-primary-500/20 leading-none select-none">
            404
          </span>
        </motion.div>

        {/* サブタイトル */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-primary-400 font-mono text-sm uppercase tracking-widest mb-4"
        >
          {notFoundTexts.subtitle}
        </motion.p>

        {/* タイトル */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
        >
          {notFoundTexts.title}
        </motion.h1>

        {/* 説明 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-gray-400 mb-12 leading-relaxed"
        >
          {notFoundTexts.description}
        </motion.p>

        {/* ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button variant="primary" size="lg" className="min-w-[180px]">
              <HomeIcon className="w-5 h-5 mr-2" />
              {notFoundTexts.backHome}
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="secondary" size="lg" className="min-w-[180px]">
              <SearchIcon className="w-5 h-5 mr-2" />
              {notFoundTexts.searchOnsen}
            </Button>
          </Link>
        </motion.div>

        {/* 温泉アイコン装飾 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-primary-500/30"
        >
          <svg
            className="w-16 h-16 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* 温泉の湯気 */}
            <path
              d="M8 6c0-1.5.5-3 2-4M12 6c0-1.5.5-3 2-4M16 6c0-1.5.5-3 2-4"
              strokeLinecap="round"
              className="animate-pulse"
            />
            {/* 湯船 */}
            <path
              d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </main>
  );
}
