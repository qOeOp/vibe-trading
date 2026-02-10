/**
 * @fileoverview Legend Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/legend/legend.component.ts
 *
 * @description
 * Main legend component that displays a list of legend entries with colors.
 * Supports horizontal and vertical layouts, active entry highlighting,
 * and various interaction callbacks.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback } from 'react';
import type { ColorHelper} from '@/lib/ngx-charts/utils';
import { formatLabel } from '@/lib/ngx-charts/utils';
import { LegendEntry } from './legend-entry';

/** Legend entry data structure */
export interface LegendEntryData {
  color: string;
  formattedLabel: string;
  label: string;
}

/** Active entry structure */
export interface ActiveEntry {
  name: string;
}

export interface LegendProps {
  /** Array of label strings for the legend */
  data: string[];
  /** Optional title displayed above the legend */
  title?: string;
  /** ColorHelper instance for color mapping */
  colors: ColorHelper;
  /** Height of the legend container */
  height?: number;
  /** Width of the legend container */
  width?: number;
  /** Array of currently active/highlighted entries */
  activeEntries?: ActiveEntry[];
  /** Whether to display the legend horizontally */
  horizontal?: boolean;
  /** Callback when a label is clicked */
  onLabelClick?: (label: string) => void;
  /** Callback when a label is activated (hovered) */
  onLabelActivate?: (item: { name: string }) => void;
  /** Callback when a label is deactivated */
  onLabelDeactivate?: (item: { name: string }) => void;
}

/**
 * Legend component for displaying chart data labels with colors
 */
export function Legend({
  data,
  title,
  colors,
  height,
  width,
  activeEntries,
  horizontal = false,
  onLabelClick,
  onLabelActivate,
  onLabelDeactivate,
}: LegendProps) {
  const legendEntries = useMemo((): LegendEntryData[] => {
    const items: LegendEntryData[] = [];

    for (const label of data) {
      const formattedLabel = formatLabel(label);
      const exists = items.some((item) => item.label === formattedLabel);

      if (!exists) {
        items.push({
          label,
          formattedLabel,
          color: colors.getColor(label),
        });
      }
    }

    return items;
  }, [data, colors]);

  const isActive = useCallback(
    (entry: LegendEntryData): boolean => {
      if (!activeEntries || activeEntries.length === 0) {
        return false;
      }
      return activeEntries.some((d) => entry.label === d.name);
    },
    [activeEntries]
  );

  const maxHeight = height ? height - 45 : undefined;

  return (
    <div className="chart-legend">
      <div style={width ? { width } : undefined}>
        {title && title.length > 0 && (
          <header className="legend-title">
            <span className="legend-title-text">
              {title}
            </span>
          </header>
        )}
        <div className="legend-wrap">
          <ul
            className={`legend-labels ${horizontal ? 'horizontal-legend' : ''}`}
            style={maxHeight ? { maxHeight } : undefined}
          >
            {legendEntries.map((entry) => (
              <li
                key={entry.label}
                className={`legend-label ${isActive(entry) ? 'active' : ''}`}
                style={horizontal ? { display: 'inline-block' } : undefined}
              >
                <LegendEntry
                  label={entry.label}
                  formattedLabel={entry.formattedLabel}
                  color={entry.color}
                  isActive={isActive(entry)}
                  onSelect={onLabelClick}
                  onActivate={onLabelActivate}
                  onDeactivate={onLabelDeactivate}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
