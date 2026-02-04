"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition wrapper that triggers re-mount on route change.
 * The actual animations are handled by AnimateIn/AnimateHeavy components
 * inside each page, which use pathname as key to restart animations.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Key change forces React to unmount/remount children,
  // which resets all AnimateIn/AnimateHeavy animations
  return (
    <div key={pathname} className="flex-1 flex gap-4 overflow-hidden">
      {children}
    </div>
  );
}
