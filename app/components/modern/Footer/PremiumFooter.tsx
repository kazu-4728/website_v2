'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, MapPinned } from 'lucide-react';

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
    <footer className="relative mt-24 overflow-hidden border-t border-[#dbc6af] bg-[linear-gradient(180deg,#f4ecdf_0%,#eadbc8_100%)] text-[#2f241c]">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr,1fr,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-4 group mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a177]/40 bg-white/70 text-[#8e6231] shadow-[0_8px_24px_rgba(53,37,27,0.1)] transition-transform group-hover:scale-105">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-[0.08em]">{siteName}</div>
                <div className="text-xs uppercase tracking-[0.35em] text-[#9f7753]">Kanto Onsen Journey</div>
              </div>
            </Link>
            <p className="max-w-xl text-[15px] leading-8 text-[#68564a]">
              {siteDescription}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="section-kicker mb-4">Guide</div>
            <ul className="space-y-3 text-sm tracking-[0.12em] uppercase text-[#5f4a3b]">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-[#8e6231]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="section-kicker mb-4">Essence</div>
            <div className="rounded-[28px] border border-white/55 bg-white/45 p-6 shadow-[0_20px_60px_rgba(53,37,27,0.08)]">
              <div className="mb-3 flex items-center gap-3 text-[#8e6231]">
                <MapPinned className="w-5 h-5" />
                <span className="text-sm uppercase tracking-[0.22em]">Curated Onsen</span>
              </div>
              <p className="text-sm leading-7 text-[#68564a]">
                温泉そのものの表情が伝わる写真と、静かな余白感を大切にしたガイドサイトを目指しています。
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 border-t border-[#dbc6af] pt-6 text-sm text-[#7a6657]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>© {currentYear} {siteName}. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
