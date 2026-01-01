'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Mail } from 'lucide-react';

interface PremiumFooterProps {
  siteName: string;
  siteDescription: string;
  navigation: Array<{
    label: string;
    href: string;
  }>;
}

export function PremiumFooter({
  siteName,
  siteDescription,
  navigation,
}: PremiumFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-sky-900 via-ocean-blue to-gray-900 text-white">
      {/* 波のSVGデコレーション */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,60 350,0 600,50 C850,100 1050,40 1200,80 L1200,0 L0,0 Z"
            className="fill-cloud-white"
          />
        </svg>
      </div>

      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* ロゴ・サイト情報 */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{siteName}</div>
                  <div className="text-sm text-sky-200">Kanto Onsen Journey</div>
                </div>
              </Link>
              <p className="text-sky-100 leading-relaxed max-w-md">
                {siteDescription}
              </p>
            </motion.div>

            {/* ナビゲーション */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-bold mb-4 text-amber-300">ナビゲーション</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sky-100 hover:text-amber-300 transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-300" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ニュースレター */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-4 text-amber-300">最新情報をお届け</h3>
              <p className="text-sky-100 text-sm mb-4">
                新着温泉情報やお得なプランをメールでお知らせします。
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-sky-300 focus:outline-none focus:border-amber-300 transition-colors duration-300"
                />
                <button
                  className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors duration-300 shadow-lg"
                  aria-label="ニュースレターに登録"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* コピーライト */}
          <motion.div
            className="pt-8 border-t border-white/10 text-center text-sky-200 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>© {currentYear} {siteName}. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
