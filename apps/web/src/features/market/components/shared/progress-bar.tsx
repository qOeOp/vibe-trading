"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 进度值 (0-100) */
  value: number;
  /** 高度类名 */
  height?: string;
  /** 背景色类名 */
  bgClass?: string;
  /** 填充色类名 */
  fillClass?: string;
  /** 是否显示动画 */
  animated?: boolean;
}

/**
 * 通用进度条组件
 */
export const ProgressBar = memo(function ProgressBar({
  value,
  height = "h-1.5",
  bgClass = "bg-mine-muted/20",
  fillClass = "bg-mine-accent-teal",
  animated = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("rounded-full overflow-hidden", height, bgClass)}>
      <div
        className={cn(
          "h-full rounded-full",
          fillClass,
          animated && "transition-[width] duration-300 motion-reduce:transition-none"
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
});
