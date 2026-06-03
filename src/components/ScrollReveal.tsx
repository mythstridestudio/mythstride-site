'use client';

import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 700,
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useFramerReducedMotion();

  const offset = () => {
    if (prefersReducedMotion || direction === 'none') {
      return {};
    }

    switch (direction) {
      case 'up':
        return { y: 34 };
      case 'down':
        return { y: -34 };
      case 'left':
        return { x: -34 };
      case 'right':
        return { x: 34 };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, ...offset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.16, margin: '0px 0px -70px 0px' }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration / 1000,
        delay: prefersReducedMotion ? 0 : delay / 1000,
        ease: [0.25, 0.4, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function useReducedMotion(): boolean {
  return Boolean(useFramerReducedMotion());
}
