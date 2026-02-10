/**
 * @fileoverview Legend Entry Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/legend/legend-entry.component.ts
 *
 * @description
 * Individual legend entry component displaying a color swatch and label.
 * Supports click, toggle, activate, and deactivate interactions.
 * Migrated from Angular ngx-charts library to React.
 *
 * @license MIT
 */

'use client';

import { useCallback } from 'react';

export interface LegendEntryProps {
  /** Color for the legend entry swatch */
  color: string;
  /** Original label value */
  label: string;
  /** Formatted label for display */
  formattedLabel: string;
  /** Whether this entry is currently active/highlighted */
  isActive?: boolean;
  /** Callback when the entry is selected (clicked) */
  onSelect?: (label: string) => void;
  /** Callback when the entry is activated (mouse enter) */
  onActivate?: (item: { name: string }) => void;
  /** Callback when the entry is deactivated (mouse leave) */
  onDeactivate?: (item: { name: string }) => void;
  /** Callback when the color swatch is toggled */
  onToggle?: (label: string) => void;
}

/**
 * Legend entry component for displaying a single legend item
 */
export function LegendEntry({
  color,
  label,
  formattedLabel,
  isActive = false,
  onSelect,
  onActivate,
  onDeactivate,
  onToggle,
}: LegendEntryProps) {
  const trimmedLabel = formattedLabel || '(empty)';

  const handleClick = useCallback(() => {
    onSelect?.(formattedLabel);
  }, [formattedLabel, onSelect]);

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggle?.(formattedLabel);
    },
    [formattedLabel, onToggle]
  );

  const handleMouseEnter = useCallback(() => {
    onActivate?.({ name: label });
  }, [label, onActivate]);

  const handleMouseLeave = useCallback(() => {
    onDeactivate?.({ name: label });
  }, [label, onDeactivate]);

  return (
    <span
      title={formattedLabel}
      tabIndex={-1}
      className={`legend-label-entry ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className="legend-label-color"
        onClick={handleToggle}
        style={{ backgroundColor: color }}
      />
      <span className="legend-label-text">
        {trimmedLabel}
      </span>
    </span>
  );
}
