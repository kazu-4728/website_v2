'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  variant?: 'default' | 'primary' | 'secondary';
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export function MobileMenu({ isOpen, onClose, items }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // フォーカストラップ: 最初のフォーカス可能な要素を取得
      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        firstFocusableRef.current = focusableElements[0] as HTMLElement;
        firstFocusableRef.current?.focus();
      }

      // Esc キーで閉じる
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      // フォーカストラップ: タブキーでメニュー内を循環
      const handleTab = (e: KeyboardEvent) => {
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab: 逆方向
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: 順方向
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleEsc);
      document.addEventListener('keydown', handleTab);

      // body のスクロールを無効化
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
            aria-hidden="true"
          />

          {/* メニュー本体 */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-white lg:hidden overflow-y-auto"
            aria-expanded={isOpen}
            aria-label="モバイルメニュー"
            role="navigation"
          >
            <div className="flex flex-col h-full">
              {/* メニュー内容 */}
              <div className="flex flex-col space-y-4 p-6 pt-24">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`text-lg font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center ${
                      item.variant === 'primary' || item.variant === 'secondary'
                        ? 'btn-premium w-full text-center py-3 rounded-full justify-center'
                        : 'text-gray-700 hover:text-ocean-blue py-2'
                    }`}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

