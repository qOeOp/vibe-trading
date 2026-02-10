/**
 * @fileoverview Pie Series Component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/pie-chart/pie-series.component.ts
 *
 * @description
 * Renders a series of pie arcs with optional labels and tooltips.
 * Handles arc generation, label positioning, and interaction events.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, type ReactNode } from 'react';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { max } from 'd3-array';
import { PieArc } from './pie-arc';
import { PieLabel } from './pie-label';
import { useChartTooltip } from '../../common/tooltip';
import type { DataItem } from '../../types';
import { ColorHelper, trimLabel } from '../../utils';

/** Arc data with position for label */
export interface ArcWithPosition {
  data: DataItem;
  startAngle: number;
  endAngle: number;
  padAngle: number;
  value: number;
  index: number;
  pos: [number, number];
}

export interface PieSeriesProps {
  /** Color helper for color mapping */
  colors: ColorHelper;
  /** Series data */
  series: DataItem[];
  /** Inner radius (0 for pie, >0 for doughnut) */
  innerRadius?: number;
  /** Outer radius */
  outerRadius?: number;
  /** Explode slices outward */
  explodeSlices?: boolean;
  /** Show labels */
  showLabels?: boolean;
  /** Use gradient fills */
  gradient?: boolean;
  /** Active/highlighted entries */
  activeEntries?: DataItem[];
  /** Custom label formatting function */
  labelFormatting?: (name: string) => string;
  /** Trim long labels */
  trimLabels?: boolean;
  /** Maximum label length */
  maxLabelLength?: number;
  /** Custom tooltip text function */
  tooltipText?: (arc: ArcWithPosition) => string;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Custom tooltip template */
  tooltipTemplate?: ReactNode;
  /** Enable animations */
  animations?: boolean;
  /** Callback when arc is selected */
  onSelect?: (data: DataItem) => void;
  /** Callback when arc is activated */
  onActivate?: (data: DataItem) => void;
  /** Callback when arc is deactivated */
  onDeactivate?: (data: DataItem) => void;
  /** Callback when arc is double-clicked */
  onDblClick?: (event: { data: DataItem; nativeEvent: React.MouseEvent }) => void;
}

/**
 * Formats a label for display
 */
function formatLabel(label: unknown): string {
  if (label instanceof Date) {
    return label.toLocaleDateString();
  }
  if (label === null || label === undefined) {
    return '';
  }
  return String(label);
}

/**
 * Escapes HTML entities in a string
 */
function escapeLabel(label: string): string {
  return label
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Pie series component that renders arcs and labels
 */
export function PieSeries({
  colors,
  series,
  innerRadius = 60,
  outerRadius = 80,
  explodeSlices = false,
  showLabels = false,
  gradient = false,
  activeEntries = [],
  labelFormatting,
  trimLabels = true,
  maxLabelLength = 10,
  tooltipText,
  tooltipDisabled = false,
  tooltipTemplate,
  animations = true,
  onSelect,
  onActivate,
  onDeactivate,
  onDblClick,
}: PieSeriesProps) {
  // Calculate arcs with position data
  const { arcs, maxValue } = useMemo(() => {
    // Create pie generator
    const pieGenerator = d3Pie<DataItem>()
      .value((d) => d.value)
      .sort(null);

    // Generate arc data
    const arcData = pieGenerator(series);

    // Calculate max value
    const max_ = max(arcData, (d) => d.value) ?? 0;

    // Calculate label positions
    const factor = 1.5;
    const outerArcGen = d3Arc()
      .innerRadius(outerRadius * factor)
      .outerRadius(outerRadius * factor);

    // Calculate mid angle helper
    const getMidAngle = (d: { startAngle: number; endAngle: number }) =>
      d.startAngle + (d.endAngle - d.startAngle) / 2;

    // Process arcs with positions
    const processedArcs: ArcWithPosition[] = arcData.map((d, index) => {
      const pos = outerArcGen.centroid({
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        innerRadius: outerRadius * factor,
        outerRadius: outerRadius * factor,
      }) as [number, number];

      // Adjust x position to sides
      pos[0] = factor * outerRadius * (getMidAngle(d) < Math.PI ? 1 : -1);

      return {
        data: d.data,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        padAngle: d.padAngle ?? 0,
        value: d.value,
        index,
        pos,
      };
    });

    // Adjust label positions to avoid overlap
    if (showLabels) {
      const minDistance = 10;
      for (let i = 0; i < processedArcs.length - 1; i++) {
        const a = processedArcs[i];
        if (!labelVisible(a)) continue;

        for (let j = i + 1; j < processedArcs.length; j++) {
          const b = processedArcs[j];
          if (!labelVisible(b)) continue;

          // If they're on the same side
          if (b.pos[0] * a.pos[0] > 0) {
            // If they're overlapping
            const o = minDistance - Math.abs(b.pos[1] - a.pos[1]);
            if (o > 0) {
              // Push the second up or down
              b.pos[1] += Math.sign(b.pos[0]) * o;
            }
          }
        }
      }
    }

    return { arcs: processedArcs, maxValue: max_ };
  }, [series, outerRadius, showLabels]);

  // Check if label is visible (arc is large enough)
  function labelVisible(arcItem: ArcWithPosition): boolean {
    return showLabels && arcItem.endAngle - arcItem.startAngle > Math.PI / 30;
  }

  // Get label text
  const getLabelText = useCallback(
    (arcItem: ArcWithPosition): string => {
      const name = formatLabel(arcItem.data.name);
      if (labelFormatting) {
        return labelFormatting(name);
      }
      return name;
    },
    [labelFormatting]
  );

  // Get color for arc
  const getColor = useCallback(
    (arcItem: ArcWithPosition): string => {
      const name = formatLabel(arcItem.data.name);
      return colors.getColor(name);
    },
    [colors]
  );

  // Default tooltip text generator
  const defaultTooltipText = useCallback((arcItem: ArcWithPosition): string => {
    const label = formatLabel(arcItem.data.name);
    const val = formatLabel(arcItem.data.value);
    return `
      <span class="tooltip-label">${escapeLabel(label)}</span>
      <span class="tooltip-val">${val}</span>
    `;
  }, []);

  // Get tooltip title
  const getTooltipTitle = useCallback(
    (arcItem: ArcWithPosition): string => {
      if (tooltipTemplate) return '';
      const getText = tooltipText || defaultTooltipText;
      return getText(arcItem);
    },
    [tooltipText, tooltipTemplate, defaultTooltipText]
  );

  // Check if entry is active
  const isActive = useCallback(
    (entry: DataItem): boolean => {
      if (!activeEntries || activeEntries.length === 0) return false;
      // Compare by name only - pie charts don't have series grouping
      return activeEntries.some((d) => entry.name === d.name);
    },
    [activeEntries]
  );

  // Global tooltip context - like Angular's TooltipService with destroyAll()
  const { showTooltip, hideTooltip } = useChartTooltip();

  // Tooltip handlers using global context (only ONE tooltip visible at a time)
  const handleArcMouseEnter = useCallback(
    (arcItem: ArcWithPosition, event: React.MouseEvent<SVGGElement>) => {
      if (tooltipDisabled) return;

      const target = event.currentTarget;
      showTooltip({
        title: getTooltipTitle(arcItem),
        host: target,
        placement: 'top',
        type: 'tooltip',
        showCaret: true,
      });
    },
    [tooltipDisabled, showTooltip, getTooltipTitle]
  );

  const handleArcMouseLeave = useCallback(() => {
    if (tooltipDisabled) return;
    hideTooltip();
  }, [tooltipDisabled, hideTooltip]);

  return (
    <g className="pie-series">
      {arcs.map((arcItem) => {
        const arcColor = getColor(arcItem);
        return (
          <g
            key={`arc-${arcItem.index}`}
            onMouseEnter={(e) => handleArcMouseEnter(arcItem, e)}
            onMouseLeave={handleArcMouseLeave}
          >
            {/* Label (rendered first so it's behind the arc) */}
            {labelVisible(arcItem) && (
              <PieLabel
                data={{
                  startAngle: arcItem.startAngle,
                  endAngle: arcItem.endAngle,
                  pos: arcItem.pos,
                }}
                radius={outerRadius}
                color={arcColor}
                label={getLabelText(arcItem)}
                max={maxValue}
                value={arcItem.value}
                explodeSlices={explodeSlices}
                animations={animations}
                labelTrim={trimLabels}
                labelTrimSize={maxLabelLength}
              />
            )}

            {/* Arc */}
            <PieArc
              startAngle={arcItem.startAngle}
              endAngle={arcItem.endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill={arcColor}
              value={arcItem.value}
              gradient={gradient}
              data={arcItem.data}
              max={maxValue}
              explodeSlices={explodeSlices}
              isActive={isActive(arcItem.data)}
              animate={animations}
              onSelect={onSelect}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              onDblClick={onDblClick}
            />
          </g>
        );
      })}
    </g>
  );
}
