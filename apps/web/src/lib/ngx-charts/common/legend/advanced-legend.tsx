/**
 * @fileoverview Advanced Legend Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/legend/advanced-legend.component.ts
 *
 * @description
 * Advanced legend component that displays totals, percentages, and values.
 * Commonly used with pie charts to show detailed breakdown of data.
 * Supports animations, custom formatting, and interactive highlighting.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ColorHelper} from '@/lib/ngx-charts/utils';
import { trimLabel, formatLabel } from '@/lib/ngx-charts/utils';
import type { DataItem, StringOrNumberOrDate } from '@/lib/ngx-charts/types';

/** Advanced legend item data structure */
export interface AdvancedLegendItem {
  value: StringOrNumberOrDate;
  _value: StringOrNumberOrDate;
  color: string;
  data: DataItem;
  label: string;
  displayLabel: string;
  originalLabel: StringOrNumberOrDate;
  percentage: string;
}

export interface AdvancedLegendProps {
  /** Width of the legend container */
  width?: number;
  /** Array of data items to display */
  data: DataItem[];
  /** ColorHelper instance for color mapping */
  colors: ColorHelper;
  /** Label displayed above the total */
  label?: string;
  /** Whether to animate value changes */
  animations?: boolean;
  /** Whether to round percentages to ensure they sum to 100% */
  roundPercentages?: boolean;
  /** Custom value formatting function */
  valueFormatting?: (value: StringOrNumberOrDate) => string;
  /** Custom label formatting function */
  labelFormatting?: (value: string) => string;
  /** Custom percentage formatting function */
  percentageFormatting?: (value: number) => number;
  /** Callback when an item is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when an item is activated (hovered) */
  onActivate?: (data: DataItem) => void;
  /** Callback when an item is deactivated */
  onDeactivate?: (data: DataItem) => void;
}

/**
 * Default value formatting function
 */
function defaultValueFormatting(value: StringOrNumberOrDate): string {
  if (value === null || value === undefined) {
    return '';
  }
  return value.toLocaleString();
}

/**
 * Rounds percentages using the largest remainder method
 * to ensure they sum to 100%
 */
function roundPercentagesWithDecimals(values: number[], decimals = 2): number[] {
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return values.map(() => 0);

  const scale = Math.pow(10, decimals + 2);
  const rawUnits = values.map((v) => (v / total) * scale);
  const floored = rawUnits.map((u) => Math.floor(u));
  const remainders = rawUnits.map((u, i) => ({ i, rem: u - floored[i] }));

  const sumFloored = floored.reduce((a, b) => a + b, 0);
  const diff = scale - sumFloored;

  if (diff > 0) {
    remainders.sort((a, b) => b.rem - a.rem);
    for (let k = 0; k < diff; k++) {
      floored[remainders[k].i] += 1;
    }
  } else if (diff < 0) {
    remainders.sort((a, b) => a.rem - b.rem);
    for (let k = 0; k < -diff; k++) {
      floored[remainders[k].i] -= 1;
    }
  }

  return floored.map((u) => u / 100);
}

/**
 * Advanced legend component for detailed data display
 */
export function AdvancedLegend({
  width,
  data,
  colors,
  label = 'Total',
  animations = true,
  roundPercentages = true,
  valueFormatting,
  labelFormatting = (l) => l,
  percentageFormatting = (p) => p,
  onSelect,
  onActivate,
  onDeactivate,
}: AdvancedLegendProps) {
  const total = useMemo(() => {
    return data.map((d) => Number(d.value)).reduce((sum, d) => sum + d, 0);
  }, [data]);

  const getPercentage = useCallback(
    (value: number): number => {
      return total > 0 ? (value / total) * 100 : 0;
    },
    [total]
  );

  const legendItems = useMemo((): AdvancedLegendItem[] => {
    const values = data.map((d) => Number(d.value));
    const percentages = roundPercentages
      ? roundPercentagesWithDecimals(values)
      : values.map((v) => getPercentage(v));

    return data.map((d, index) => {
      const itemLabel = formatLabel(d.name);
      const color = colors.getColor(itemLabel);
      const percentage = roundPercentages ? percentages[index] : getPercentage(values[index]);
      const formattedLabel = labelFormatting(itemLabel);

      return {
        _value: d.value,
        data: d,
        value: d.value,
        color,
        label: formattedLabel,
        displayLabel: trimLabel(formattedLabel, 20),
        originalLabel: d.name,
        percentage: String(
          percentageFormatting ? percentageFormatting(parseFloat(percentage.toLocaleString())) : percentage
        ),
      };
    });
  }, [data, colors, roundPercentages, labelFormatting, percentageFormatting, getPercentage]);

  const handleItemClick = useCallback(
    (item: AdvancedLegendItem) => {
      onSelect?.(item.data);
    },
    [onSelect]
  );

  const handleItemMouseEnter = useCallback(
    (item: AdvancedLegendItem) => {
      onActivate?.(item.data);
    },
    [onActivate]
  );

  const handleItemMouseLeave = useCallback(
    (item: AdvancedLegendItem) => {
      onDeactivate?.(item.data);
    },
    [onDeactivate]
  );

  const formatValue = valueFormatting || defaultValueFormatting;

  return (
    <div
      className="advanced-pie-legend"
      style={{
        float: 'left',
        position: 'relative',
        top: '50%',
        transform: 'translate(0, -50%)',
        width: width ?? 'auto',
      }}
    >
      <div
        className="total-value"
        style={{
          fontSize: '36px',
        }}
      >
        {animations ? (
          <motion.span
            key={total}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatValue(total)}
          </motion.span>
        ) : (
          formatValue(total)
        )}
      </div>

      <div
        className="total-label"
        style={{
          fontSize: '24px',
          marginBottom: '19px',
        }}
      >
        {label}
      </div>

      <div
        className="legend-items-container"
        style={{
          width: '100%',
        }}
      >
        <div
          className="legend-items"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'auto',
          }}
        >
          {legendItems.map((item) => (
            <div
              key={item.label}
              tabIndex={-1}
              className="legend-item"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemMouseEnter(item)}
              onMouseLeave={() => handleItemMouseLeave(item)}
              style={{
                marginRight: '20px',
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              <div
                className="item-color"
                style={{
                  borderLeft: `4px solid ${item.color}`,
                  width: '4px',
                  height: '42px',
                  float: 'left',
                  marginRight: '7px',
                }}
              />

              <div
                className="item-value"
                style={{
                  fontSize: '24px',
                  marginTop: '-6px',
                  marginLeft: '11px',
                }}
              >
                {animations ? (
                  <motion.span
                    key={String(item.value)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatValue(item.value)}
                  </motion.span>
                ) : (
                  formatValue(item.value)
                )}
              </div>

              <div
                className="item-label"
                style={{
                  fontSize: '14px',
                  opacity: 0.7,
                  marginLeft: '11px',
                  marginTop: '-6px',
                }}
              >
                {item.displayLabel}
              </div>

              <div
                className="item-percent"
                style={{
                  fontSize: '24px',
                  opacity: 0.7,
                  marginLeft: '11px',
                }}
              >
                {animations ? (
                  <motion.span
                    key={item.percentage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.percentage}%
                  </motion.span>
                ) : (
                  `${item.percentage}%`
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
