import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DetailPanelProps {
  /** 面板标题 */
  title: string
  /** 关闭回调 */
  onClose?: () => void
  /** 面板宽度（默认 360px） */
  width?: number
  /** 额外 className */
  className?: string
  /** 标题右侧额外操作区 */
  headerActions?: React.ReactNode
  children: React.ReactNode
}

/**
 * DetailPanel — 详情面板根容器
 *
 * 提供统一的面板外壳：白底卡片 + 固定 header + 可滚动内容区。
 * 内部使用 DetailSection 组织各个区块。
 *
 * ```tsx
 * <DetailPanel title="因子详情" onClose={handleClose}>
 *   <DetailSection title="统计指标">
 *     ...
 *   </DetailSection>
 *   <DetailSection title="雷达图">
 *     ...
 *   </DetailSection>
 * </DetailPanel>
 * ```
 */
function DetailPanel({
  title,
  onClose,
  width,
  className,
  headerActions,
  children,
}: DetailPanelProps) {
  return (
    <div
      data-slot="detail-panel"
      className={cn(
        "flex flex-col overflow-hidden h-full",
        "bg-white shadow-sm border border-mine-border rounded-xl",
        className,
      )}
      style={width ? { width } : undefined}
    >
      {/* Header — 固定在顶部 */}
      <div
        data-slot="detail-panel-header"
        className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50 shrink-0"
      >
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {headerActions}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-mine-muted hover:text-mine-text transition-colors"
              title="关闭"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content — 可滚动区域 */}
      <div
        data-slot="detail-panel-content"
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {children}
      </div>
    </div>
  )
}

export { DetailPanel }
