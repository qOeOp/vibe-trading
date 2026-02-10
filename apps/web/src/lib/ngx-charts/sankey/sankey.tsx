/**
 * @fileoverview Sankey component
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/sankey/sankey.component.ts
 *
 * @description
 * Sankey diagram for flow visualization.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

'use client';

import { useMemo, useCallback, useRef, useState } from 'react';
import { sankey, sankeyLeft, sankeyLinkHorizontal } from 'd3-sankey';
import type { ColorScheme, ViewDimensions } from '../types';
import { ScaleType } from '../types';
import { ColorHelper, calculateViewDimensions, useStableId, trimLabel, escapeLabel } from '../utils';
import { BaseChart, useChartDimensions } from '../common';

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyProps {
  /** Link data */
  data: SankeyLink[];
  /** Fixed width */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Color scheme */
  colorScheme?: string | ColorScheme;
  /** Custom colors */
  colors?: Array<{ name: string; value: string }>;
  /** Show node labels */
  showLabels?: boolean;
  /** Enable gradient fills */
  gradient?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Disable tooltips */
  tooltipDisabled?: boolean;
  /** Label formatting function */
  labelFormatting?: (label: string) => string;
  /** Truncate labels */
  truncateLabels?: boolean;
  /** Selection callback */
  onSelect?: (data: unknown) => void;
  /** Activation callback */
  onActivate?: (data: unknown) => void;
  /** Deactivation callback */
  onDeactivate?: (data: unknown) => void;
  /** Custom class name */
  className?: string;
}

interface SankeyNodeData {
  name: string;
  value: number;
}

interface RectItem {
  fill: string;
  height: number;
  width: number;
  x: number;
  y: number;
  label: string;
  labelAnchor: string;
  tooltip: string;
  transform: string;
  data: SankeyNodeData;
  originalLabel: string;
  node?: unknown;
  active?: boolean;
}

/** Represents a d3-sankey computed node with layout positions */
interface SankeyComputedNode {
  name: string;
  value: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  layer?: number;
}

interface LinkPath {
  path: string;
  strokeWidth: number;
  tooltip: string;
  id: string;
  gradientFill: string;
  source: SankeyComputedNode;
  target: SankeyComputedNode;
  startColor: string;
  endColor: string;
  data: { source: string; target: string; value: number };
  active?: boolean;
}

export function Sankey({
  data,
  width: fixedWidth,
  height: fixedHeight,
  colorScheme = 'cool',
  colors: customColors,
  showLabels = true,
  animated = true,
  tooltipDisabled = false,
  labelFormatting,
  truncateLabels = true,
  onSelect,
  onActivate,
  onDeactivate,
  className = '',
}: SankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(
    containerRef as React.RefObject<HTMLElement>,
    fixedWidth,
    fixedHeight
  );

  const [activeLink, setActiveLink] = useState<LinkPath | null>(null);
  const [activeNode, setActiveNode] = useState<RectItem | null>(null);

  const gradientIdBase = useStableId('grad');

  const margin = useMemo<[number, number, number, number]>(() => [10, 10, 10, 10], []);

  const dims: ViewDimensions = useMemo(() => {
    return calculateViewDimensions({
      width,
      height,
      margins: margin,
    });
  }, [width, height, margin]);

  const nodeDefs = useMemo(() => {
    if (!data || data.length === 0) return [];

    const nodeNames = Array.from(new Set(data.flatMap((l) => [l.source, l.target])));
    return nodeNames.map((name) => ({
      name,
      value: data.filter((l) => l.source === name).reduce((acc, l) => acc + l.value, 0),
    }));
  }, [data]);

  const domain = useMemo(() => {
    return nodeDefs.map((n) => n.name);
  }, [nodeDefs]);

  const colorHelper = useMemo(() => {
    return new ColorHelper({
      scheme: colorScheme,
      scaleType: ScaleType.Ordinal,
      domain,
      customColors,
    });
  }, [colorScheme, domain, customColors]);

  const { nodeRects, linkPaths } = useMemo(() => {
    if (!data || data.length === 0 || dims.width <= 0 || dims.height <= 0) {
      return { nodeRects: [], linkPaths: [] };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- d3-sankey generic parameters require flexible typing for node/link data
    const sankeyGenerator = sankey<any, any>()
      .nodeId((d: SankeyNodeData) => d.name)
      .nodeAlign(sankeyLeft)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [dims.width - 1, dims.height - 5],
      ]);

    const sankeyData = sankeyGenerator({
      nodes: nodeDefs.map((d) => ({ ...d })),
      links: data.map((d) => ({ ...d })),
    });

    const rects: RectItem[] = sankeyData.nodes.map((node) => {
      const n = node as unknown as SankeyComputedNode;
      const label = labelFormatting ? labelFormatting(n.name) : n.name;
      return {
        x: n.x0,
        y: n.y0,
        height: n.y1 - n.y0,
        width: n.x1 - n.x0,
        fill: colorHelper.getColor(n.name),
        tooltip: `<span class="tooltip-label">${escapeLabel(n.name)}</span><span class="tooltip-val">${n.value.toLocaleString()}</span>`,
        label: truncateLabels ? trimLabel(label, 20) : label,
        originalLabel: n.name,
        node: n,
        data: { name: n.name, value: n.value },
        transform: `translate(${n.x0},${n.y0})`,
        labelAnchor: n.layer === 0 ? 'start' : 'end',
        active: false,
      };
    });

    const links: LinkPath[] = sankeyData.links.map((link, index: number) => {
      const src = link.source as unknown as SankeyComputedNode;
      const tgt = link.target as unknown as SankeyComputedNode;
      const gradientId = `${gradientIdBase}-${index}`;
      return {
        path: sankeyLinkHorizontal()(link) || '',
        strokeWidth: Math.max(1, (link as unknown as { width: number }).width),
        tooltip: `<span class="tooltip-label">${escapeLabel(src.name)} \u2192 ${escapeLabel(tgt.name)}</span><span class="tooltip-val">${link.value.toLocaleString()}</span>`,
        id: gradientId,
        gradientFill: `url(#${gradientId})`,
        source: src,
        target: tgt,
        startColor: colorHelper.getColor(src.name),
        endColor: colorHelper.getColor(tgt.name),
        data: { source: src.name, target: tgt.name, value: link.value },
        active: false,
      };
    });

    return { nodeRects: rects, linkPaths: links };
  }, [data, dims, nodeDefs, colorHelper, labelFormatting, truncateLabels, gradientIdBase]);

  const hasActive = activeLink !== null || activeNode !== null;

  const handleLinkEnter = useCallback(
    (link: LinkPath) => {
      setActiveLink(link);
      setActiveNode(null);
      onActivate?.(link.data);
    },
    [onActivate]
  );

  const handleLinkLeave = useCallback(
    (link: LinkPath) => {
      setActiveLink(null);
      onDeactivate?.(link.data);
    },
    [onDeactivate]
  );

  const handleNodeEnter = useCallback(
    (rect: RectItem) => {
      setActiveNode(rect);
      setActiveLink(null);
      onActivate?.(rect.data);
    },
    [onActivate]
  );

  const handleNodeLeave = useCallback(
    (rect: RectItem) => {
      setActiveNode(null);
      onDeactivate?.(rect.data);
    },
    [onDeactivate]
  );

  const isNodeActive = useCallback(
    (rect: RectItem) => {
      if (activeNode?.data.name === rect.data.name) return true;
      if (activeLink) {
        return (
          rect.data.name === activeLink.source.name || rect.data.name === activeLink.target.name
        );
      }
      return false;
    },
    [activeNode, activeLink]
  );

  const isLinkActive = useCallback(
    (link: LinkPath) => {
      if (activeLink?.id === link.id) return true;
      if (activeNode) {
        return (
          link.source.name === activeNode.data.name || link.target.name === activeNode.data.name
        );
      }
      return false;
    },
    [activeNode, activeLink]
  );

  const transform = `translate(${dims.xOffset || margin[3]}, ${margin[0]})`;

  return (
    <BaseChart
      ref={containerRef}
      width={fixedWidth}
      height={fixedHeight}
      animated={animated}
      className={`ngx-charts-sankey ${className}`}
    >
      <svg width={width} height={height} className="ngx-charts" style={{ overflow: 'visible', fontFamily: 'var(--font-chart, Roboto, sans-serif)' }}>
        <g transform={transform} className="sankey chart">
          {/* Links */}
          {linkPaths.map((link) => {
            const active = isLinkActive(link);
            return (
              <g key={link.id} className="link">
                <defs>
                  <linearGradient
                    id={link.id}
                    gradientUnits="userSpaceOnUse"
                    x1={link.source.x1}
                    x2={link.target.x0}
                  >
                    <stop offset="0%" stopColor={link.startColor} />
                    <stop offset="100%" stopColor={link.endColor} />
                  </linearGradient>
                </defs>
                <path
                  d={link.path}
                  stroke={link.gradientFill}
                  strokeWidth={link.strokeWidth}
                  strokeOpacity={active ? 0.5 : hasActive ? 0.1 : 0.5}
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect?.(link.data)}
                  onMouseEnter={() => handleLinkEnter(link)}
                  onMouseLeave={() => handleLinkLeave(link)}
                >
                  {!tooltipDisabled && <title dangerouslySetInnerHTML={{ __html: link.tooltip }} />}
                </path>
              </g>
            );
          })}

          {/* Nodes */}
          {nodeRects.map((rect, index) => {
            const active = isNodeActive(rect);
            return (
              <g key={`node-${index}-${rect.originalLabel}`} transform={rect.transform} className="node">
                <rect
                  x={0}
                  y={0}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.fill}
                  fillOpacity={active ? 1 : hasActive ? 0.3 : 1}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect?.(rect.data)}
                  onMouseEnter={() => handleNodeEnter(rect)}
                  onMouseLeave={() => handleNodeLeave(rect)}
                >
                  {!tooltipDisabled && <title dangerouslySetInnerHTML={{ __html: rect.tooltip }} />}
                </rect>
              </g>
            );
          })}

          {/* Labels */}
          {showLabels &&
            nodeRects.map((rect, index) => {
              if (rect.height <= 15) return null;
              const active = isNodeActive(rect);
              return (
                <g key={`label-${index}-${rect.originalLabel}`} transform={rect.transform}>
                  <text
                    className="label"
                    x={rect.width + 5}
                    y={rect.height / 2}
                    fillOpacity={active ? 1 : hasActive ? 0.3 : 1}
                    textAnchor={rect.labelAnchor as 'start' | 'middle' | 'end'}
                    dy="0.35em"
                    dx={rect.labelAnchor === 'end' ? -25 : 0}
                    style={{ fontSize: '12px' }}
                  >
                    {rect.label}
                  </text>
                </g>
              );
            })}
        </g>
      </svg>
    </BaseChart>
  );
}
