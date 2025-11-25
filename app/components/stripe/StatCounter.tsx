'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.div className="text-5xl md:text-6xl font-bold mb-2">
        <span className="text-gradient">
          {prefix}
          <motion.span>{rounded}</motion.span>
          {suffix}
        </span>
      </motion.div>
      <div className="text-dark-300 text-lg">{label}</div>
    </div>
  );
}
