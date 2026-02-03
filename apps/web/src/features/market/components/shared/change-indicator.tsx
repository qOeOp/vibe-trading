"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatPercent } from "../../utils/formatters";

export interface ChangeIndicatorProps {
  /** 涨跌幅百分比 */
  value: number;
  /** 是否显示符号 */
  showSign?: boolean;
  /** 尺寸 */
  size?: "xs" | "sm" | "base";
  /** 是否加粗 */
  bold?: boolean;
  /** 自定义类名 */
  className?: string;
}

const SIZE_STYLES: Record<"xs" | "sm" | "base", string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  base: "text-sm",
};

/**
 * 涨跌幅指示器
 * 根据值自动显示红涨绿跌颜色
 */
export const ChangeIndicator = memo(function ChangeIndicator({
  value,
  showSign = true,
  size = "sm",
  bold = false,
  className,
}: ChangeIndicatorProps) {
  const isUp = value > 0;
  const isDown = value < 0;

  const colorClass = isUp
    ? "text-market-up-medium"
    : isDown
      ? "text-market-down-medium"
      : "text-market-flat";

  const displayValue = showSign ? formatPercent(value) : `${Math.abs(value).toFixed(2)}%`;

  return (
    <span
      className={cn(
        colorClass,
        SIZE_STYLES[size],
        bold && "font-semibold",
        className
      )}
    >
      {displayValue}
    </span>
  );
});
