'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { CtaSection } from '../../lib/content';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  data: CtaSection;
}

export function CtaFullscreen({ data }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  // Background animation (subtle zoom/fade)
  const bgVariants = {
    initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: 'easeOut' }
    }
  };

  // Content animation (slide up)
  const contentVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 32 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
      {/* Background with subtle animation */}
      <motion.div 
        className="absolute inset-0"
        variants={bgVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <Image
          src={data.bgImage}
          alt="CTA Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-primary-900/60 to-dark-950/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 max-w-4xl mx-auto py-24">
        {/* Title */}
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight"
          variants={contentVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ delay: 0.2 }}
        >
          {data.title}
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          variants={contentVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ delay: 0.3 }}
        >
          {data.description}
        </motion.p>

        {/* Button */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ delay: 0.4 }}
        >
          <Link href={data.action.href}>
            <Button 
              size="xl" 
              className="bg-white text-dark-950 hover:bg-gray-100 min-w-[200px] sm:min-w-[240px] font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-white/20"
            >
              {data.action.label}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
