'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface BandAreaProps {
  path: string;
  startingPath?: string;
  fill: string;
  opacity?: number;
  animated?: boolean;
  className?: string;
}

export function BandArea({
  path,
  startingPath,
  fill,
  opacity = 1,
  animated = true,
  className,
}: BandAreaProps) {
  const variants = useMemo(() => ({
    initial: animated && startingPath ? { d: startingPath, opacity: 0 } : { d: path, opacity },
    animate: { d: path, opacity },
    exit: animated && startingPath ? { d: startingPath, opacity: 0 } : { opacity: 0 },
  }), [path, startingPath, animated, opacity]);

  const transition = {
    d: { duration: animated ? 0.75 : 0, ease: 'easeInOut' as const },
    opacity: { duration: animated ? 0.3 : 0 },
  };

  if (!path) return null;

  return (
    <motion.path
      className={className}
      d={path}
      fill={fill}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={transition}
      style={{ pointerEvents: 'none', opacity }}
    />
  );
}
