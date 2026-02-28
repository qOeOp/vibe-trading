'use client';

import { type PropsWithChildren } from 'react';
import { motion, type MotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Animated line entry — adapted from MagicUI Terminal.
 * Fades in + slides up when mounted. Used for each new terminal output line.
 */
type AnimatedSpanProps = PropsWithChildren<
  MotionProps & {
    className?: string;
  }
>;

function AnimatedSpan({ children, className, ...props }: AnimatedSpanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'grid font-mono text-[13px] leading-tight tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { AnimatedSpan };
