/**
 * @fileoverview Card component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/number-card/card.component.ts
 *
 * @description
 * Individual card in a number card chart with animated count-up.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { GridData } from './types';
import { trimLabel, escapeLabel, roundedRect } from '../utils';

export interface CardProps {
  color: string;
  bandColor?: string;
  textColor?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  data: GridData;
  medianSize?: number;
  valueFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  labelFormatting?: (card: { label: string; data: GridData; value: number }) => string;
  animated?: boolean;
  onSelect?: (data: GridData) => void;
}

/**
 * Shades an RGB color by a percentage
 * Matches Angular: shadeRGBColor
 */
function shadeRGBColor(r: number, g: number, b: number, percent: number): string {
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? -percent : percent;

  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Inverts a color for text contrast
 * Matches Angular: invertColor from color-utils.ts
 * Uses YIQ formula and shades the color instead of returning black/white
 */
function invertColor(value: string): string {
  if (!value) return '#000';

  // Parse color - handle hex, rgb, etc.
  let r: number, g: number, b: number;

  if (value.startsWith('#')) {
    let hex = value.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (value.startsWith('rgb')) {
    const match = value.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    } else {
      return '#000';
    }
  } else {
    return '#000';
  }

  // YIQ formula - matches Angular exactly
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  const depth = yiq >= 128 ? -0.8 : 0.8;

  return shadeRGBColor(r, g, b, depth);
}

export function Card({
  color,
  bandColor,
  textColor: propTextColor,
  x,
  y,
  width,
  height,
  label: propLabel,
  data,
  medianSize,
  valueFormatting,
  labelFormatting,
  animated = true,
  onSelect,
}: CardProps) {
  const textElRef = useRef<SVGTextElement>(null);
  const lastAnimatedValueRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Match Angular initial values
  const [textFontSize, setTextFontSize] = useState(12);
  const [labelFontSize, setLabelFontSize] = useState(15);
  const [textPadding, setTextPadding] = useState<number[]>([10, 20, 5, 20]);
  const [value, setValue] = useState('');

  const bandHeight = 10;
  const cardWidth = Math.max(0, width);
  const cardHeight = Math.max(0, height);

  const label = propLabel || (data.name as string);
  const hasValue = data && typeof data.value !== 'undefined' && data.value !== null;

  // Format functions - match Angular exactly
  const valueFormat = useCallback(
    (card: { label: string; data: GridData; value: number }) => {
      if (valueFormatting) return valueFormatting(card);
      return card.value?.toLocaleString() || '';
    },
    [valueFormatting]
  );

  const labelFormat = useCallback(
    (card: { label: string; data: GridData; value: number }) => {
      if (labelFormatting) return labelFormatting(card);
      return escapeLabel(trimLabel(card.label, 55));
    },
    [labelFormatting]
  );

  const cardData = useMemo(
    () => ({ label, data, value: data.value }),
    [label, data]
  );

  const formattedLabel = useMemo(() => labelFormat(cardData), [labelFormat, cardData]);

  const textColor = propTextColor || invertColor(color);

  const transform = `translate(${x}, ${y})`;
  const transformBand = `translate(0, ${cardHeight - bandHeight})`;

  // Band path with rounded bottom corners
  const bandPath = useMemo(() => {
    return roundedRect(0, 0, cardWidth, bandHeight, 3, [false, false, true, true]);
  }, [cardWidth]);

  // Pad value for consistent width during animation - match Angular paddedValue
  const paddedValue = useCallback(
    (val: string): string => {
      if (medianSize && medianSize > val.length) {
        return val + '\u2007'.repeat(medianSize - val.length);
      }
      return val;
    },
    [medianSize]
  );

  // Set padding - match Angular setPadding exactly
  const setPaddingValues = useCallback(() => {
    const newPadding = [...textPadding];
    newPadding[1] = newPadding[3] = cardWidth / 8;
    const padding = cardHeight / 2;
    newPadding[0] = padding - textFontSize - labelFontSize / 2;
    newPadding[2] = padding - labelFontSize;
    setTextPadding(newPadding);
  }, [cardWidth, cardHeight, textFontSize, labelFontSize]);

  // Update - match Angular update() method
  useLayoutEffect(() => {
    if (!hasValue) {
      setValue('');
      return;
    }

    const formattedValue = valueFormat(cardData);
    setValue(paddedValue(formattedValue));
    setPaddingValues();

    // Scale text after a small delay (match Angular setTimeout)
    const scaleTimeout = setTimeout(() => {
      if (textElRef.current) {
        // Angular uses getBoundingClientRect() which gives rendered size
        // This is different from getBBox() which gives SVG native size
        const rect = textElRef.current.getBoundingClientRect();
        const { width, height } = rect;
        if (width > 0 && height > 0) {
          const textPad = cardWidth / 8;
          const availableWidth = cardWidth - 2 * textPad;
          const availableHeight = cardHeight / 3;

          const resizeScale = Math.min(availableWidth / width, availableHeight / height);
          const newTextFontSize = Math.floor(textFontSize * resizeScale);
          const newLabelFontSize = Math.min(newTextFontSize, 15);

          setTextFontSize(newTextFontSize);
          setLabelFontSize(newLabelFontSize);
        }
      }

      // Set final value (non-padded)
      setValue(valueFormat(cardData));

      // Start count animation if needed
      if (hasValue && !initializedRef.current && animated) {
        startCountAnimation();
      }
    }, 8);

    return () => clearTimeout(scaleTimeout);
  }, [cardWidth, cardHeight, hasValue, cardData, valueFormat, paddedValue, setPaddingValues, animated]);

  // Update padding when font sizes change
  useEffect(() => {
    setPaddingValues();
  }, [textFontSize, labelFontSize, setPaddingValues]);

  // Count animation - match Angular startCount
  const startCountAnimation = useCallback(() => {
    if (initializedRef.current || !animated) return;

    // Skip if already animated this value
    if (lastAnimatedValueRef.current === data.value) return;

    const targetValue = data.value;
    const duration = 1000;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = targetValue * easeProgress;

      const formatted = valueFormat({ ...cardData, value: currentValue });
      setValue(progress < 1 ? paddedValue(formatted) : valueFormat(cardData));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    initializedRef.current = true;
    lastAnimatedValueRef.current = data.value;

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [data.value, animated, cardData, valueFormat, paddedValue]);

  const handleClick = useCallback(() => {
    onSelect?.(data);
  }, [data, onSelect]);

  const textWidth = cardWidth - textPadding[1] - textPadding[3];

  return (
    <g transform={transform} className="cell" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <motion.rect
        className="card"
        fill={color}
        width={cardWidth}
        height={cardHeight}
        rx={3}
        ry={3}
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      />

      {/* Band - show if bandColor exists and differs from card color */}
      {bandColor && bandColor !== color && (
        <path
          className="card-band"
          fill={bandColor}
          transform={transformBand}
          stroke="none"
          d={bandPath}
        />
      )}

      <title>{label}</title>

      {/* Label at bottom */}
      <foreignObject
        className="trimmed-label"
        x={textPadding[3]}
        y={cardHeight - textPadding[2]}
        width={Math.max(0, textWidth)}
        height={labelFontSize + textPadding[2]}
        style={{ pointerEvents: 'none' }}
      >
        <p
          style={{
            color: textColor,
            fontSize: `${labelFontSize}px`,
            lineHeight: `${labelFontSize}px`,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          dangerouslySetInnerHTML={{ __html: formattedLabel }}
        />
      </foreignObject>

      {/* Value at top */}
      <text
        ref={textElRef}
        className="value-text"
        x={textPadding[3]}
        y={textPadding[0]}
        fill={textColor}
        textAnchor="start"
        alignmentBaseline="hanging"
        style={{ fontSize: `${textFontSize}pt` }}
      >
        {value}
      </text>
    </g>
  );
}
