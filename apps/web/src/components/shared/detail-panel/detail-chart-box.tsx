import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailChartBoxProps {
  /** 额外 className */
  className?: string
  children: React.ReactNode
}

/**
 * DetailChartBox — 面板内嵌图表容器
 *
 * 为 SVG/Canvas 图表提供统一的圆角浅色背景容器。
 * 确保所有面板内图表的视觉一致性。
 *
 * ```tsx
 * <DetailChartBox>
 *   <ICDecayChart data={factor.icDecayProfile} />
 * </DetailChartBox>
 * ```
 */
function DetailChartBox({ className, children }: DetailChartBoxProps) {
  return (
    <div
      data-slot="detail-chart-box"
      className={cn("bg-mine-bg rounded-md p-1", className)}
    >
      {children}
    </div>
  )
}

export { DetailChartBox }
