"use client";

import { memo, useMemo, CSSProperties, useRef, useEffect, useState } from "react";
import type { TreemapNode } from "../../types";
import { getTileColor } from "../../utils/treemap-colors";
import { formatPercent, formatFlow } from "../../utils/formatters";
import { getAdaptiveStyles, getBorderRadius } from "../../hooks/use-treemap";
import {
  CandlestickSparkline,
  generateMockCandles,
  type CandleData,
} from "./candlestick-sparkline";
import { cn } from "@/lib/utils";

// ============ Types ============

interface HeatMapTileProps {
  node: TreemapNode;
  x: number;
  y: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  maxArea: number;
  minArea: number;
  isHovered?: boolean;
  showSparkline?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// ============ Component ============

export const HeatMapTile = memo(function HeatMapTile({
  node,
  x,
  y,
  width,
  height,
  containerWidth,
  containerHeight,
  maxArea,
  minArea,
  isHovered = false,
  showSparkline = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HeatMapTileProps) {
  const sparklineRef = useRef<HTMLDivElement>(null);
  const [sparklineDimensions, setSparklineDimensions] = useState({ width: 0, height: 0 });

  // Calculate adaptive styles based on dimensions
  const styles = useMemo(
    () => getAdaptiveStyles(width, height, node.name, maxArea, minArea),
    [width, height, node.name, maxArea, minArea]
  );

  // Generate candlestick data (memoized per node)
  const candleData = useMemo<CandleData[]>(() => {
    return generateMockCandles(node.changePercent, 60);
  }, [node.changePercent]);

  // Border radius based on container position (Binance-style)
  const borderRadius = useMemo(
    () => getBorderRadius(x, y, width, height, containerWidth, containerHeight),
    [x, y, width, height, containerWidth, containerHeight]
  );

  // Background color
  const bgColor = getTileColor(node.changePercent);

  // Measure sparkline container
  useEffect(() => {
    if (!sparklineRef.current || !showSparkline) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          setSparklineDimensions({ width: w, height: h });
        }
      }
    });

    observer.observe(sparklineRef.current);
    return () => observer.disconnect();
  }, [showSparkline]);

  // Format value text
  const flowSign = node.capitalFlow > 0 ? "+" : "";
  const fullValueText = `${flowSign}${node.capitalFlow}亿`;
  const changeSign = node.changePercent > 0 ? "+" : "";

  // Dynamic styles only - static styles are in globals.css .tile class
  const tileStyle: CSSProperties = {
    left: x,
    top: y,
    width,
    height,
    background: bgColor,
    borderRadius,
    zIndex: isHovered ? 10 : 1,
  };

  // CSS variables for adaptive sizing
  const contentStyle: CSSProperties = {
    "--tile-pad": `${styles.pad.toFixed(1)}px`,
    "--tile-name-size": `${styles.nameSize.toFixed(1)}px`,
    "--tile-name-weight": styles.nameWeight,
    "--tile-value-size": `${styles.valueSize.toFixed(1)}px`,
    "--tile-badge-size": `${styles.badgeSize.toFixed(1)}px`,
    "--badge-bg-alpha": styles.badgeBgAlpha.toFixed(3),
    "--badge-border-alpha": styles.badgeBorderAlpha.toFixed(3),
    "--badge-shadow-alpha": styles.badgeShadowAlpha.toFixed(3),
    "--badge-pad": `${styles.badgePadV.toFixed(1)}px ${styles.badgePadH.toFixed(1)}px`,
    padding: "var(--tile-pad, 16px)",
  } as CSSProperties;

  return (
    <div
      style={tileStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${node.name}: ${formatPercent(node.changePercent)}, 资金流 ${formatFlow(node.capitalFlow)}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      className={cn(
        "tile",
        styles.isVertical && "vertical-text",
        styles.hideValue && "hide-value",
        styles.hideBadge && "hide-badge",
        showSparkline ? "show-sparkline" : "hide-sparkline"
      )}
    >
      <div className="tile-content" style={contentStyle}>
        {/* Header row: name (left) + value (right) */}
        <div className="tile-header">
          <div className="tile-name">{node.name}</div>
          <span className="tile-value">{fullValueText}</span>
        </div>

        {/* Sparkline frame (middle area, edge-to-edge horizontal) */}
        <div
          ref={sparklineRef}
          className="tile-sparkline"
          style={{ margin: `4px calc(-1 * var(--tile-pad, 16px)) 4px` }}
        >
          {showSparkline && sparklineDimensions.width > 0 && sparklineDimensions.height > 0 && (
            <CandlestickSparkline
              candles={candleData}
              width={sparklineDimensions.width}
              height={sparklineDimensions.height}
            />
          )}
        </div>

        {/* Badge: bottom-right in flex flow */}
        <span className="tile-badge">
          {changeSign}{node.changePercent}%
        </span>
      </div>
    </div>
  );
});

// ============ Skeleton Tile ============

interface SkeletonTileProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SkeletonTile = memo(function SkeletonTile({
  x,
  y,
  width,
  height,
}: SkeletonTileProps) {
  return (
    <div
      className="absolute rounded bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] motion-reduce:animate-none"
      style={{ left: x, top: y, width, height }}
    />
  );
});
