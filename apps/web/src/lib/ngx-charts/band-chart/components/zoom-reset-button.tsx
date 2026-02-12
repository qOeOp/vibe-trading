'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ZoomResetButtonProps {
  x: number;
  y: number;
  visible: boolean;
  onReset: () => void;
}

/** Knockout stroke — matches page background (--color-mine-bg) for visual gap effect */
const KNOCKOUT_COLOR = '#f5f3ef';

// Reference SVG is 256x256 viewBox. Button diameter matches DataZoom bar width (20px), so r=10.
// Icon renders at 13x13 inside, scale factor: 13/256 ≈ 0.0508. Center in original coords: ~128, ~143.
const ICON_SIZE = 13;
const SCALE = ICON_SIZE / 256;
const BUTTON_R = 10;

export function ZoomResetButton({ x, y, visible, onReset }: ZoomResetButtonProps) {
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setSpinning(false);
      onReset();
    }, 350);
  }, [spinning, onReset]);

  // Translate so the icon's visual center (~128, 143) lands on (x, y)
  const tx = x - 128 * SCALE;
  const ty = y - 143 * SCALE;

  return (
    <AnimatePresence>
      {visible && (
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          <motion.g
            animate={{ rotate: spinning ? 360 : 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          >
            {/* Background circle — diameter matches DataZoom bar width (20px) */}
            <circle
              cx={x}
              cy={y}
              r={BUTTON_R}
              fill={KNOCKOUT_COLOR}
              stroke="#e0ddd8"
              strokeWidth={1}
            />
            {/* Reset icon — open circular arrow with center dot */}
            <g transform={`translate(${tx}, ${ty}) scale(${SCALE})`}>
              <path
                fill="#8a8a8a"
                d="M128,39.5V10L74.9,56.9l53.1,46.9V72.1c39,0,70.6,31.6,70.6,70.6c0,39-31.6,70.6-70.6,70.6c-39,0-70.6-31.6-70.6-70.6c0-9.4,1.8-18.3,5.2-26.5l-30.8-11.1c-4.6,11.7-7.1,24.4-7.1,37.6C24.7,199.8,71,246,128,246c57.1,0,103.3-46.2,103.3-103.3C231.3,85.7,185.1,39.5,128,39.5z"
              />
              <circle fill="#8a8a8a" cx="126.9" cy="144.6" r="21" />
            </g>
          </motion.g>
        </motion.g>
      )}
    </AnimatePresence>
  );
}
