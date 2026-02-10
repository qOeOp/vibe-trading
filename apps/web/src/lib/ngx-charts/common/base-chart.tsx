/**
 * @fileoverview Base chart component and hooks
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/base-chart.component.ts
 *
 * @description
 * Base chart wrapper component providing container sizing, animations, and common functionality.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ColorScheme, ScaleType, ViewDimensions } from '../types';
import { ColorHelper } from '../utils';
import { ChartTooltipProvider } from './tooltip';

export interface BaseChartProps {
  /** Fixed width (optional, defaults to container width) */
  width?: number;
  /** Fixed height (optional, defaults to container height) */
  height?: number;
  /** Color scheme name or custom scheme */
  colorScheme?: string | ColorScheme;
  /** Scale type for color mapping */
  scaleType?: ScaleType;
  /** Custom color mapping */
  colors?: ((value: unknown) => string) | Array<{ name: string; value: string }>;
  /** Enable/disable animations */
  animated?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: CSSProperties;
  /** Children render function or elements */
  children?: ReactNode | ((dimensions: ChartDimensions) => ReactNode);
}

export interface ChartDimensions {
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Default chart dimensions when container size cannot be determined
 */
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

/**
 * Base chart container component
 * Handles responsive sizing and animation context
 */
export const BaseChart = forwardRef<HTMLDivElement, BaseChartProps>(function BaseChart(
  {
    width: fixedWidth,
    height: fixedHeight,
    colorScheme = 'cool',
    scaleType = ScaleType.Ordinal,
    colors,
    animated = true,
    className = '',
    style,
    children,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: fixedWidth || DEFAULT_WIDTH,
    height: fixedHeight || DEFAULT_HEIGHT,
    containerWidth: fixedWidth || DEFAULT_WIDTH,
    containerHeight: fixedHeight || DEFAULT_HEIGHT,
  });

  // Update dimensions based on container size
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width || DEFAULT_WIDTH;
      const containerHeight = rect.height || DEFAULT_HEIGHT;

      setDimensions({
        width: fixedWidth || containerWidth,
        height: fixedHeight || containerHeight,
        containerWidth,
        containerHeight,
      });
    }
  }, [fixedWidth, fixedHeight]);

  // Set up resize observer
  useEffect(() => {
    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions]);

  // Handle fixed dimensions changes
  useEffect(() => {
    if (fixedWidth !== undefined || fixedHeight !== undefined) {
      setDimensions((prev) => ({
        ...prev,
        width: fixedWidth || prev.containerWidth,
        height: fixedHeight || prev.containerHeight,
      }));
    }
  }, [fixedWidth, fixedHeight]);

  const containerStyle: CSSProperties = {
    width: fixedWidth ? `${fixedWidth}px` : '100%',
    height: fixedHeight ? `${fixedHeight}px` : '100%',
    ...style,
  };

  return (
    <ChartTooltipProvider>
      <div
        ref={(node) => {
          // Handle both refs
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`ngx-charts-container ${className}`}
        style={containerStyle}
      >
        <AnimatePresence mode="wait">
          {animated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%', height: '100%' }}
            >
              {typeof children === 'function' ? children(dimensions) : children}
            </motion.div>
          ) : (
            <div style={{ width: '100%', height: '100%' }}>
              {typeof children === 'function' ? children(dimensions) : children}
            </div>
          )}
        </AnimatePresence>
      </div>
    </ChartTooltipProvider>
  );
});

/**
 * Hook for managing chart dimensions with responsive sizing
 */
export function useChartDimensions(
  containerRef: React.RefObject<HTMLElement>,
  fixedWidth?: number,
  fixedHeight?: number
): ChartDimensions {
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: fixedWidth || DEFAULT_WIDTH,
    height: fixedHeight || DEFAULT_HEIGHT,
    containerWidth: fixedWidth || DEFAULT_WIDTH,
    containerHeight: fixedHeight || DEFAULT_HEIGHT,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width || DEFAULT_WIDTH;
        const containerHeight = rect.height || DEFAULT_HEIGHT;

        setDimensions({
          width: fixedWidth || containerWidth,
          height: fixedHeight || containerHeight,
          containerWidth,
          containerHeight,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, fixedWidth, fixedHeight]);

  return dimensions;
}

/**
 * Hook for creating a color helper instance
 */
export function useChartColors(
  colorScheme: string | ColorScheme,
  scaleType: ScaleType,
  domain: string[] | number[],
  customColors?: ((value: unknown) => string) | Array<{ name: string; value: string }>
): ColorHelper {
  const [colorHelper, setColorHelper] = useState<ColorHelper>(() =>
    new ColorHelper({
      scheme: colorScheme,
      scaleType,
      domain,
      customColors,
    })
  );

  useEffect(() => {
    setColorHelper(
      new ColorHelper({
        scheme: colorScheme,
        scaleType,
        domain,
        customColors,
      })
    );
  }, [colorScheme, scaleType, domain, customColors]);

  return colorHelper;
}

/**
 * Hook for managing chart animation state
 */
export function useChartAnimation(animated: boolean = true) {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    // After first render, mark as not initial
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, []);

  return {
    isInitialRender,
    shouldAnimate: animated && isInitialRender,
    variants: {
      initial: animated ? { opacity: 0 } : { opacity: 1 },
      animate: { opacity: 1 },
      exit: animated ? { opacity: 0 } : { opacity: 1 },
    },
    transition: {
      duration: animated ? 0.6 : 0,
    },
  };
}

/**
 * Clones chart data to prevent mutation
 */
export function cloneChartData<T>(data: T[]): T[] {
  if (!data) return [];

  return data.map((item) => {
    const copy: Record<string, unknown> = {};

    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;

      if (obj.name !== undefined) copy.name = obj.name;
      if (obj.value !== undefined) copy.value = obj.value;

      if (Array.isArray(obj.series)) {
        copy.series = obj.series.map((seriesItem) => ({ ...seriesItem }));
      }

      if (obj.extra !== undefined) {
        copy.extra = JSON.parse(JSON.stringify(obj.extra));
      }

      if (obj.source !== undefined) copy.source = obj.source;
      if (obj.target !== undefined) copy.target = obj.target;
    }

    return copy as T;
  });
}
