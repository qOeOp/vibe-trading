'use client';

import { useRef, useCallback, useEffect } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface ZoomRange {
  start: number;
  end: number;
}

export interface UseAnimateZoomResult {
  animateZoom: (
    current: ZoomRange,
    target: ZoomRange,
    setter: (val: ZoomRange) => void,
    duration?: number,
    onComplete?: () => void,
  ) => void;
  isAnimating: boolean;
  cancelAnimation: () => void;
}

export function useAnimateZoom(): UseAnimateZoomResult {
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const animateZoom = useCallback(
    (
      current: ZoomRange,
      target: ZoomRange,
      setter: (val: ZoomRange) => void,
      duration = 350,
      onComplete?: () => void,
    ) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      const startTime = performance.now();
      const fromStart = current.start;
      const fromEnd = current.end;
      const deltaStart = target.start - fromStart;
      const deltaEnd = target.end - fromEnd;

      isAnimatingRef.current = true;

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        setter({
          start: fromStart + deltaStart * eased,
          end: fromEnd + deltaEnd * eased,
        });

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          isAnimatingRef.current = false;
          onComplete?.();
        }
      }

      rafRef.current = requestAnimationFrame(step);
    },
    [],
  );

  return { animateZoom, isAnimating: isAnimatingRef.current, cancelAnimation };
}
