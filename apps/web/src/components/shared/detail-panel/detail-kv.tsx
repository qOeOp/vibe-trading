import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailKVProps {
  /** 键名（标签） */
  label: string
  /** 值 */
  value: React.ReactNode
  /** 值的颜色语义 */
  color?: "up" | "down" | "flat" | "positive" | "negative" | "muted"
  /** 额外 className */
  className?: string
}

const COLOR_MAP: Record<NonNullable<DetailKVProps["color"]>, string> = {
  up: "text-market-up-medium",
  down: "text-market-down-medium",
  flat: "text-market-flat",
  positive: "text-market-down",       // 绿=好（中国惯例：涨为红但"好指标"为绿）
  negative: "text-market-up-medium",   // 红=差
  muted: "text-mine-muted",
}

/**
 * DetailKV — 键值对行
 *
 * 左标签 + 右数值的标准行布局，用于统计详情、参数展示等。
 * 多个 KV 堆叠时自动形成紧凑列表。
 *
 * ```tsx
 * <DetailKV label="IC均值" value="+0.0198" color="positive" />
 * <DetailKV label="P值" value="<0.001" color="positive" />
 * <DetailKV label="偏度" value="-0.23" />
 * ```
 */
function DetailKV({ label, value, color, className }: DetailKVProps) {
  return (
    <div
      data-slot="detail-kv"
      className={cn(
        "flex items-center justify-between py-1",
        className,
      )}
    >
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span
        className={cn(
          "text-[11px] font-mono tabular-nums",
          color ? COLOR_MAP[color] : "text-mine-text",
        )}
      >
        {value}
      </span>
    </div>
  )
}

export { DetailKV }
