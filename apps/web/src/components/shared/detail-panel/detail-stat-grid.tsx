import * as React from "react"
import { cn } from "@/lib/utils"

// ─── StatItem ────────────────────────────────────────────

export interface DetailStatItemProps {
  /** 指标标签 */
  label: string
  /** 指标值（已格式化的字符串） */
  value: string
  /** 值的颜色语义 */
  color?: "up" | "down" | "flat" | "muted"
  /** 额外 className */
  className?: string
}

const STAT_COLOR_MAP: Record<NonNullable<DetailStatItemProps["color"]>, string> = {
  up: "text-market-up-medium",
  down: "text-market-down-medium",
  flat: "text-market-flat",
  muted: "text-mine-muted",
}

/**
 * DetailStatItem — 居中的单指标展示
 *
 * 大数值 + 小标签的纵向布局，用于 KPI 网格。
 *
 * ```tsx
 * <DetailStatItem label="IC (20D)" value="+0.022" color="down" />
 * ```
 */
function DetailStatItem({ label, value, color, className }: DetailStatItemProps) {
  return (
    <div
      data-slot="detail-stat-item"
      className={cn("flex flex-col items-center gap-0.5", className)}
    >
      <span
        className={cn(
          "text-sm font-bold font-mono tabular-nums",
          color ? STAT_COLOR_MAP[color] : "text-mine-text",
        )}
      >
        {value}
      </span>
      <span className="text-[9px] text-mine-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

// ─── StatGrid ────────────────────────────────────────────

export interface DetailStatGridProps {
  /** 列数（默认 3） */
  columns?: 2 | 3 | 4
  /** 额外 className */
  className?: string
  children: React.ReactNode
}

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

/**
 * DetailStatGrid — KPI 指标网格
 *
 * 将多个 DetailStatItem 排列为等宽网格。
 * 标准 2×3 或 1×4 布局。
 *
 * ```tsx
 * <DetailStatGrid columns={3}>
 *   <DetailStatItem label="IC" value="+0.022" color="down" />
 *   <DetailStatItem label="IR" value="0.78" />
 *   <DetailStatItem label="t-stat" value="1.75" color="up" />
 * </DetailStatGrid>
 * ```
 */
function DetailStatGrid({
  columns = 3,
  className,
  children,
}: DetailStatGridProps) {
  return (
    <div
      data-slot="detail-stat-grid"
      className={cn("grid gap-3", GRID_COLS[columns], className)}
    >
      {children}
    </div>
  )
}

export { DetailStatGrid, DetailStatItem }
