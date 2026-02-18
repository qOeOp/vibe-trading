import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailSectionProps {
  /** 区块标题（不传则无标题行） */
  title?: string
  /** 标题右侧内容（数值后缀、"更多"链接等） */
  suffix?: React.ReactNode
  /** 是否隐藏底部分隔线（最后一个 section 自动隐藏） */
  noBorder?: boolean
  /** 额外 className */
  className?: string
  children: React.ReactNode
}

/**
 * DetailSection — 详情面板的区块单元
 *
 * 每个 Section 拥有统一的 padding、底部分隔线、标题行。
 * 是详情面板中所有内容区块的标准容器。
 *
 * 区块类型通过 children 自由组合：
 * - KPI 网格 → DetailStatGrid
 * - 键值对列表 → DetailKV
 * - 图表区域 → DetailChartBox
 * - 自由内容 → 直接放 children
 *
 * ```tsx
 * <DetailSection title="统计指标" suffix="20D 窗口">
 *   <DetailStatGrid columns={3}>
 *     <DetailStatItem label="IC" value="+0.022" color="up" />
 *   </DetailStatGrid>
 * </DetailSection>
 * ```
 */
function DetailSection({
  title,
  suffix,
  noBorder = false,
  className,
  children,
}: DetailSectionProps) {
  return (
    <div
      data-slot="detail-section"
      className={cn(
        "px-4 py-3",
        !noBorder && "border-b border-mine-border/50 last:border-b-0",
        className,
      )}
    >
      {/* Section header */}
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">
            {title}
          </span>
          {suffix && (
            <span className="text-[10px] text-mine-muted">{suffix}</span>
          )}
        </div>
      )}

      {/* Section content */}
      {children}
    </div>
  )
}

export { DetailSection }
