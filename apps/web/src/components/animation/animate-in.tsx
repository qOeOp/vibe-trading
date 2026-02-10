"use client";

import { motion } from "motion/react";
import type { Variants, Transition } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode, CSSProperties } from "react";

type AnimationDirection = "up" | "down" | "left" | "right" | "none";

interface AnimateInProps {
  children: ReactNode;
  /** Delay index for staggered animations (0 = first, 1 = second, etc.) */
  delay?: number;
  baseDelay?: number;
  staggerInterval?: number;
  from?: AnimationDirection;
  distance?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

function getInitialPosition(
  from: AnimationDirection,
  distance: number
): { x: number; y: number } {
  switch (from) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "none":
    default:
      return { x: 0, y: 0 };
  }
}

export function AnimateIn({
  children,
  delay = 0,
  baseDelay = 0.05,
  staggerInterval = 0.08,
  from = "up",
  distance = 16,
  duration = 0.4,
  className,
  style,
}: AnimateInProps) {
  const pathname = usePathname();
  const calculatedDelay = baseDelay + delay * staggerInterval;
  const initial = getInitialPosition(from, distance);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: initial.x,
      y: initial.y,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
  };

  const transition: Transition = {
    duration,
    delay: calculatedDelay,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.div
      key={`${pathname}-${delay}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface AnimateHeavyProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function AnimateHeavy({
  children,
  delay = 0.3,
  duration = 0.5,
  className,
  style,
}: AnimateHeavyProps) {
  const pathname = usePathname();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.995,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
  };

  const transition: Transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.div
      key={`heavy-${pathname}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
