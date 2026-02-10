'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { ScalePoint, ScaleLinear } from 'd3-scale';

import { ViewDimensions } from '../../types';
import { useChartTooltip } from '../../common/tooltip/tooltip-context';
import type { BandDataPoint, AuxiliaryLine } from '../hooks';

export interface BandTooltipAreaProps {
  dims: ViewDimensions;
  data: BandDataPoint[];
  xScale: ScalePoint<string>;
  yScale: ScaleLinear<number, number>;
  auxiliaryLines?: AuxiliaryLine[];
  tooltipDisabled?: boolean;
  tooltipTemplate?: (info: BandTooltipInfo) => ReactNode;
  onHoverStrategy?: (id: string | null) => void;
  /** Called with tooltip info on hover, null on leave. Use to render info externally (e.g. in header). */
  onHoverInfo?: (info: BandTooltipInfo | null) => void;
}

export interface BandTooltipInfo {
  date: string;
  band: BandDataPoint;
  closestStrategy: { id: string; value: number } | null;
}

/**
 * Binary search to find the closest point index by X position.
 */
function findClosestPointIndex(
  xPos: number,
  data: BandDataPoint[],
  xScale: ScalePoint<string>
): number {
  let minDiff = Number.MAX_VALUE;
  let closestIndex = 0;

  // With scalePoint, domain points are evenly spaced, so we can estimate
  const step = xScale.step();
  if (step > 0) {
    const estimated = Math.round(xPos / step);
    const clamped = Math.max(0, Math.min(data.length - 1, estimated));
    // Check neighbors for the true closest
    for (let i = Math.max(0, clamped - 1); i <= Math.min(data.length - 1, clamped + 1); i++) {
      const px = xScale(data[i].name) ?? 0;
      const diff = Math.abs(px - xPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  // Fallback: linear scan
  for (let i = 0; i < data.length; i++) {
    const px = xScale(data[i].name) ?? 0;
    const diff = Math.abs(px - xPos);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
}

/**
 * Default tooltip template for band chart.
 */
function DefaultBandTooltip({ info }: { info: BandTooltipInfo }) {
  return (
    <div
      className="backdrop-blur-xl bg-white/75 border border-mine-border/50 rounded-xl px-3 py-2.5 text-xs shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      style={{ minWidth: 140, pointerEvents: 'none' }}
    >
      <div className="text-mine-muted font-mono tabular-nums text-[10px] mb-1.5">{info.date}</div>

      {info.closestStrategy && (
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-mine-border/40">
          <span className="text-mine-text font-medium">{info.closestStrategy.id}</span>
          <span className={`font-mono tabular-nums text-right ${info.closestStrategy.value >= 0 ? 'text-[#CF304A]' : 'text-[#0B8C5F]'}`}>
            {info.closestStrategy.value > 0 ? '+' : ''}{info.closestStrategy.value.toFixed(1)}%
          </span>
        </div>
      )}

      <div className="space-y-0.5">
        <BandRow label="Max" value={info.band.max} />
        <BandRow label="Q3" value={info.band.q3} accent />
        <BandRow label="Med" value={info.band.median} accent highlight />
        <BandRow label="Q1" value={info.band.q1} accent />
        <BandRow label="Min" value={info.band.min} />
      </div>
    </div>
  );
}

function BandRow({ label, value, accent, highlight }: {
  label: string; value: number; accent?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${highlight ? 'text-mine-text font-medium' : ''}`}>
      <span className={`w-7 text-[10px] ${accent ? 'text-mine-text/70' : 'text-mine-muted'}`}>{label}</span>
      <span className={`font-mono tabular-nums text-right ${value >= 0 ? 'text-[#CF304A]' : 'text-[#0B8C5F]'}`}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    </div>
  );
}

export function BandTooltipArea({
  dims,
  data,
  xScale,
  yScale,
  auxiliaryLines,
  tooltipDisabled = false,
  tooltipTemplate,
  onHoverStrategy,
  onHoverInfo,
}: BandTooltipAreaProps) {
  const [anchorOpacity, setAnchorOpacity] = useState(0);
  const [anchorPos, setAnchorPos] = useState(-1);
  const [anchorYPos, setAnchorYPos] = useState(-1);
  const anchorRef = useRef<SVGLineElement>(null);
  const lastAnchorPosRef = useRef(-1);

  const { showTooltip, hideTooltip } = useChartTooltip();

  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (data.length === 0) return;

      const target = event.target as SVGRectElement;
      const rect = target.getBoundingClientRect();
      const xPos = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const closestIndex = findClosestPointIndex(xPos, data, xScale);
      const bp = data[closestIndex];

      let newAnchorPos = xScale(bp.name) ?? 0;
      newAnchorPos = Math.max(0, Math.min(dims.width, newAnchorPos));

      // Find closest strategy line by Y proximity
      let closestStrategy: { id: string; value: number } | null = null;
      if (auxiliaryLines && auxiliaryLines.length > 0) {
        let closestDist = Infinity;
        for (const aux of auxiliaryLines) {
          const pt = aux.series.find((p) => p.name === bp.name);
          if (!pt) continue;
          const lineY = yScale(pt.value);
          const dist = Math.abs(mouseY - lineY);
          if (dist < closestDist) {
            closestDist = dist;
            closestStrategy = { id: aux.id, value: pt.value };
          }
        }
        // Only report if within 30px
        if (closestDist > 30) {
          onHoverStrategy?.(null);
        } else {
          onHoverStrategy?.(closestStrategy?.id ?? null);
        }
      }

      setAnchorPos(newAnchorPos);
      setAnchorYPos(Math.max(0, Math.min(dims.height, mouseY)));
      setAnchorOpacity(0.7);

      const info: BandTooltipInfo = {
        date: bp.name,
        band: bp,
        closestStrategy,
      };

      // Notify parent for external rendering (e.g. header)
      onHoverInfo?.(info);

      // Show floating tooltip (unless disabled)
      if (anchorRef.current && !tooltipDisabled) {
        const content = tooltipTemplate
          ? tooltipTemplate(info)
          : <DefaultBandTooltip info={info} />;

        showTooltip({
          content,
          host: anchorRef.current as unknown as HTMLElement,
          placement: 'right',
          type: 'tooltip',
          showCaret: false,
          positionKey: newAnchorPos,
        });
      }

      lastAnchorPosRef.current = newAnchorPos;
    },
    [data, xScale, yScale, dims, auxiliaryLines, tooltipDisabled, tooltipTemplate, showTooltip, onHoverStrategy, onHoverInfo]
  );

  const handleMouseLeave = useCallback(() => {
    setAnchorOpacity(0);
    hideTooltip();
    lastAnchorPosRef.current = -1;
    onHoverStrategy?.(null);
    onHoverInfo?.(null);
  }, [hideTooltip, onHoverStrategy, onHoverInfo]);

  const anchorStyle = useMemo(
    () => ({
      opacity: anchorOpacity,
      pointerEvents: 'none' as const,
      transition: 'opacity 250ms ease-in-out',
    }),
    [anchorOpacity]
  );

  return (
    <g>
      {/* Invisible area for mouse detection */}
      <rect
        className="tooltip-area"
        x={0}
        y={0}
        width={dims.width}
        height={dims.height}
        style={{ opacity: 0, cursor: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Crosshair — standard ngx-charts style */}
      <g style={anchorStyle}>
        {/* Vertical dashed line */}
        <line
          ref={anchorRef}
          className="tooltip-anchor"
          x1={anchorPos}
          y1={0}
          x2={anchorPos}
          y2={dims.height}
          stroke="#1a1a1a"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        {/* Horizontal dashed line */}
        {anchorYPos >= 0 && (
          <line
            x1={0}
            y1={anchorYPos}
            x2={dims.width}
            y2={anchorYPos}
            stroke="#1a1a1a"
            strokeWidth={1}
            strokeDasharray="6 4"
          />
        )}
        {/* Center circle at intersection */}
        {anchorYPos >= 0 && (
          <circle
            cx={anchorPos}
            cy={anchorYPos}
            r={4}
            fill="white"
            stroke="#1a1a1a"
            strokeWidth={1.5}
          />
        )}
      </g>
    </g>
  );
}
