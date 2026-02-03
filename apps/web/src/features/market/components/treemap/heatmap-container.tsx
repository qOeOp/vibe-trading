"use client";

import {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import type { TreemapNode } from "../../types";
import {
  useTreemap,
  calculateRippleLayout,
  getTargetSize,
  type TileLayout,
} from "../../hooks/use-treemap";
import { HeatMapTile } from "./heatmap-tile";
import {
  Breadcrumb,
  createInitialBreadcrumb,
  addBreadcrumbItem,
  navigateToBreadcrumb,
  type BreadcrumbItem,
} from "./breadcrumb";
import { SearchBox, filterBySearch } from "./search-box";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoResultsState,
} from "./states";
import { COLOR_RAMP } from "../../utils/treemap-colors";
import { ANIMATION } from "../../constants";

// ============ Types ============

interface HeatMapContainerProps {
  /** Initial data to display (Level 1 sectors) */
  data: TreemapNode[];
  /** Callback when a tile is clicked for drill-down */
  onDrillDown?: (node: TreemapNode, level: number) => void;
  /** Callback when navigating back via breadcrumb */
  onDrillUp?: (level: number) => void;
  /** Custom loading state */
  isLoading?: boolean;
  /** Custom error message */
  error?: string | null;
  /** Callback for retry action */
  onRetry?: () => void;
  /** Optional className */
  className?: string;
}

// ============ Component ============

export const HeatMapContainer = memo(function HeatMapContainer({
  data,
  onDrillDown,
  onDrillUp,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: HeatMapContainerProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHoverRef = useRef<number>(-1);

  // State
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentData, setCurrentData] = useState<TreemapNode[]>(data);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>(
    createInitialBreadcrumb()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(-1);
  const [showSparklineIndex, setShowSparklineIndex] = useState<number>(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync external data
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Measure container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Filter data by search query
  const filteredData = useMemo(() => {
    return filterBySearch(currentData, searchQuery);
  }, [currentData, searchQuery]);

  // Calculate base treemap layout
  const { layout: baseLayout, splitLineStructure } = useTreemap(
    filteredData,
    dimensions.width,
    dimensions.height
  );

  // Calculate target size for hover expansion
  const { targetW, targetH } = useMemo(() => {
    return getTargetSize(dimensions.width, dimensions.height, filteredData.length);
  }, [dimensions.width, dimensions.height, filteredData.length]);

  // Calculate min/max areas for adaptive styles
  const { maxArea, minArea } = useMemo(() => {
    if (baseLayout.length === 0) return { maxArea: 0, minArea: 0 };
    const areas = baseLayout.map((t) => t.width * t.height);
    return {
      maxArea: Math.max(...areas),
      minArea: Math.min(...areas),
    };
  }, [baseLayout]);

  // Calculate expanded layout when hovering
  const expandedLayout = useMemo(() => {
    if (activeHoverIndex < 0 || !splitLineStructure || baseLayout.length === 0) {
      return baseLayout;
    }

    const hoveredTile = baseLayout[activeHoverIndex];
    const minDim = Math.min(hoveredTile.width, hoveredTile.height);
    const needsExpand = minDim < Math.min(targetW, targetH);

    if (!needsExpand) {
      return baseLayout;
    }

    return calculateRippleLayout(
      baseLayout,
      splitLineStructure,
      activeHoverIndex,
      dimensions.width,
      dimensions.height,
      targetW,
      targetH
    );
  }, [baseLayout, splitLineStructure, activeHoverIndex, dimensions.width, dimensions.height, targetW, targetH]);

  // Handlers
  const handleTileClick = useCallback(
    (node: TreemapNode, index: number) => {
      // Check if node has children for drill-down
      if (!node.children || node.children.length === 0) {
        // Leaf node - no drill down
        return;
      }

      setIsTransitioning(true);

      // Add to breadcrumb with current data snapshot for back-navigation
      const newItem: BreadcrumbItem = {
        id: node.name,
        name: node.name,
        level: breadcrumb.length + 1,
        data: currentData, // Store snapshot for navigation back
      };
      setBreadcrumb((prev) => addBreadcrumbItem(prev, newItem));

      // Update current data to children
      setCurrentData(node.children);
      setSearchQuery("");
      setActiveHoverIndex(-1);
      setShowSparklineIndex(-1);

      // Notify parent
      onDrillDown?.(node, newItem.level);

      // End transition
      setTimeout(() => setIsTransitioning(false), ANIMATION.treemapDuration);
    },
    [breadcrumb, currentData, onDrillDown]
  );

  const handleBreadcrumbNavigate = useCallback(
    (item: BreadcrumbItem, index: number) => {
      if (index === breadcrumb.length - 1) {
        // Already at current level
        return;
      }

      setIsTransitioning(true);

      // Navigate back
      setBreadcrumb((prev) => navigateToBreadcrumb(prev, index));

      // Restore data from breadcrumb snapshot, or use initial data for root
      if (index === 0) {
        setCurrentData(data);
      } else {
        // Get data from the NEXT breadcrumb item (which stored this level's data)
        const nextItem = breadcrumb[index + 1];
        if (nextItem?.data) {
          setCurrentData(nextItem.data as TreemapNode[]);
        }
      }

      setSearchQuery("");
      setActiveHoverIndex(-1);
      setShowSparklineIndex(-1);

      // Notify parent
      onDrillUp?.(item.level);

      setTimeout(() => setIsTransitioning(false), ANIMATION.treemapDuration);
    },
    [breadcrumb, data, onDrillUp]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setActiveHoverIndex(-1);
    setShowSparklineIndex(-1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Tile级别的hover处理 - 延迟确认防抖动
  const handleTileMouseEnter = useCallback(
    (index: number) => {
      // 记录pending hover
      pendingHoverRef.current = index;

      // 清除之前的延迟
      if (hoverDelayRef.current) {
        clearTimeout(hoverDelayRef.current);
      }

      // 延迟后确认hover
      hoverDelayRef.current = setTimeout(() => {
        // 检查鼠标是否还在这个tile上
        if (pendingHoverRef.current !== index) {
          return;
        }

        // 确认hover
        if (sparklineTimerRef.current) {
          clearTimeout(sparklineTimerRef.current);
        }
        setShowSparklineIndex(-1);
        setActiveHoverIndex(index);

        const tile = baseLayout[index];
        if (!tile) return;
        const needsExpand = tile.width < targetW || tile.height < targetH;
        sparklineTimerRef.current = setTimeout(
          () => setShowSparklineIndex(index),
          needsExpand ? ANIMATION.sparklineDelay : 50
        );
      }, ANIMATION.hoverDelay);
    },
    [baseLayout, targetW, targetH]
  );

  const handleTileMouseLeave = useCallback((index: number) => {
    // 清除这个tile的pending
    if (pendingHoverRef.current === index) {
      pendingHoverRef.current = -1;
    }

    // 清除延迟
    if (hoverDelayRef.current) {
      clearTimeout(hoverDelayRef.current);
      hoverDelayRef.current = null;
    }

    // 延迟重置hover状态，给相邻tile的mouseEnter机会取消
    setTimeout(() => {
      // 如果没有新的pending hover，重置状态
      if (pendingHoverRef.current === -1) {
        if (sparklineTimerRef.current) {
          clearTimeout(sparklineTimerRef.current);
          sparklineTimerRef.current = null;
        }
        setShowSparklineIndex(-1);
        setActiveHoverIndex(-1);
      }
    }, 50);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (sparklineTimerRef.current) {
        clearTimeout(sparklineTimerRef.current);
      }
      if (hoverDelayRef.current) {
        clearTimeout(hoverDelayRef.current);
      }
    };
  }, []);

  // Render states
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Header
          breadcrumb={breadcrumb}
          onBreadcrumbNavigate={handleBreadcrumbNavigate}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          dataCount={0}
        />
        <div
          className="flex-1 flex items-center justify-center rounded-2xl bg-mine-card min-h-[400px]"
        >
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Header
          breadcrumb={breadcrumb}
          onBreadcrumbNavigate={handleBreadcrumbNavigate}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          dataCount={0}
        />
        <div
          className="flex-1 flex items-center justify-center rounded-2xl bg-mine-card min-h-[400px]"
        >
          <ErrorState message={error} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  if (currentData.length === 0) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Header
          breadcrumb={breadcrumb}
          onBreadcrumbNavigate={handleBreadcrumbNavigate}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          dataCount={0}
        />
        <div
          className="flex-1 flex items-center justify-center rounded-2xl bg-mine-card min-h-[400px]"
        >
          <EmptyState title="暂无数据" message="当前级别没有可显示的数据" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Header - 分离的圆角元素 */}
      <Header
        breadcrumb={breadcrumb}
        onBreadcrumbNavigate={handleBreadcrumbNavigate}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        dataCount={filteredData.length}
      />

      {/* Treemap Container - 白色圆角背景 */}
      <div
        ref={containerRef}
        className="flex-1 relative rounded-2xl overflow-hidden bg-mine-card min-h-[400px]"
      >
        {/* No search results */}
        {searchQuery && filteredData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <NoResultsState query={searchQuery} onClear={handleSearchClear} />
          </div>
        ) : (
          /* Tiles - 使用延迟确认防止抖动 */
          expandedLayout.map((tile, index) => (
            <HeatMapTile
              key={tile.data.name}
              node={tile.data}
              x={tile.x}
              y={tile.y}
              width={tile.width}
              height={tile.height}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
              maxArea={maxArea}
              minArea={minArea}
              isHovered={activeHoverIndex === index}
              showSparkline={showSparklineIndex === index}
              onClick={() => handleTileClick(tile.data, index)}
              onMouseEnter={() => handleTileMouseEnter(index)}
              onMouseLeave={() => handleTileMouseLeave(index)}
            />
          ))
        )}
      </div>

      {/* Legend - 分离的圆角元素 */}
      <ColorLegend />
    </div>
  );
});

// ============ Sub-Components ============

interface HeaderProps {
  breadcrumb: BreadcrumbItem[];
  onBreadcrumbNavigate: (item: BreadcrumbItem, index: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dataCount: number;
}

const Header = memo(function Header({
  breadcrumb,
  onBreadcrumbNavigate,
  searchQuery,
  onSearchChange,
  dataCount,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      {/* 左侧：标题和面包屑，各自独立圆角白底 */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1.5 text-sm font-semibold text-mine-text bg-white rounded-full shadow-sm">
          板块热力图
        </span>
        <div className="px-3 py-1.5 bg-white rounded-full shadow-sm">
          <Breadcrumb items={breadcrumb} onNavigate={onBreadcrumbNavigate} />
        </div>
        <span className="px-2.5 py-1 text-xs text-mine-muted bg-white rounded-full shadow-sm">
          {dataCount} 项
        </span>
      </div>

      {/* 右侧：搜索框固定宽度 */}
      <SearchBox
        value={searchQuery}
        onChange={onSearchChange}
        className="w-52 shrink-0"
      />
    </div>
  );
});

const ColorLegend = memo(function ColorLegend() {
  const items = [
    { label: "跌 >5%", color: COLOR_RAMP[0].bg },
    { label: "跌 2-5%", color: COLOR_RAMP[1].bg },
    { label: "跌 0.5-2%", color: COLOR_RAMP[2].bg },
    { label: "平盘", color: COLOR_RAMP[3].bg },
    { label: "涨 0.5-2%", color: COLOR_RAMP[4].bg },
    { label: "涨 2-5%", color: COLOR_RAMP[5].bg },
    { label: "涨 >5%", color: COLOR_RAMP[6].bg },
  ];

  return (
    <div className="flex items-center justify-center gap-3 px-3 py-1.5">
      {items.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-mine-muted bg-white rounded-full shadow-sm"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
});
