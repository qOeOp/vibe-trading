import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailKPIRowProps {
  /** 行标签前缀 */
  label: string
  /** 额外 className */
  className?: string
  children: React.ReactNode
}

/**
 * DetailKPIRow — 水平指标行
 *
 * 标签 + 多个行内指标的水平布局，用于紧凑的多维度行展示。
 * 例如 "IC滚动: 60D +0.025  120D +0.020"
 *
 * ```tsx
 * <DetailKPIRow label="IC滚动:">
 *   <span className="text-mine-muted">60D</span>
 *   <span className="font-semibold tabular-nums text-market-down-medium">+0.025</span>
 *   <span className="text-mine-muted">120D</span>
 *   <span className="font-semibold tabular-nums text-market-down-medium">+0.020</span>
 * </DetailKPIRow>
 * ```
 */
function DetailKPIRow({ label, className, children }: DetailKPIRowProps) {
  return (
    <div
      data-slot="detail-kpi-row"
      className={cn("flex items-center gap-3 text-[10px]", className)}
    >
      <span className="text-mine-muted shrink-0">{label}</span>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  )
}

export { DetailKPIRow }
