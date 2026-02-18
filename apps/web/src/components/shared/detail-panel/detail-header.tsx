import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailHeaderProps {
  /** 额外 className */
  className?: string
  children: React.ReactNode
}

/**
 * DetailHeader — 详情面板的身份区块
 *
 * 用于面板顶部的"身份卡"区域（名称、版本、状态、标签、表达式等）。
 * 区别于普通 DetailSection：无标题行，padding 更紧凑，背景可定制。
 *
 * ```tsx
 * <DetailHeader>
 *   <div className="flex items-center gap-2">
 *     <h3 className="text-sm font-bold text-mine-text">Mom_60D</h3>
 *     <span className="text-[10px] text-mine-muted font-mono">v1.0</span>
 *   </div>
 *   ...
 * </DetailHeader>
 * ```
 */
function DetailHeader({ className, children }: DetailHeaderProps) {
  return (
    <div
      data-slot="detail-header"
      className={cn(
        "px-4 py-3 border-b border-mine-border/50",
        className,
      )}
    >
      {children}
    </div>
  )
}

export { DetailHeader }
