'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type ParallaxDirection = 'up' | 'down' | 'left' | 'right';

interface ParallaxLayerProps {
  children?: ReactNode;
  className?: string;
  direction?: ParallaxDirection;
  intensity?: number;
  mobileScale?: number;
  style?: CSSProperties;
}

export default function ParallaxLayer({
  children,
  className,
  direction = 'up',
  intensity = 40,
  mobileScale = 0.5,
  style,
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: layerRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(mediaQuery.matches);

    updateMobile();
    mediaQuery.addEventListener('change', updateMobile);
    return () => mediaQuery.removeEventListener('change', updateMobile);
  }, []);

  const travel = prefersReducedMotion ? 0 : intensity * (isMobile ? mobileScale : 1);
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'up' || direction === 'left' ? -1 : 1;
  const movement = useTransform(scrollYProgress, [0, 1], [-travel * sign, travel * sign]);

  return (
    <motion.div
      ref={layerRef}
      className={className}
      style={{ ...style, [axis]: movement }}
    >
      {children}
    </motion.div>
  );
}
