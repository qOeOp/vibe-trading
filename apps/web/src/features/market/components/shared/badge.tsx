"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "up" | "down" | "warning" | "info";

export interface BadgeProps {
  /** 显示文本 */
  children: React.ReactNode;
  /** 样式变体 */
  variant?: BadgeVariant;
  /** 尺寸 */
  size?: "xs" | "sm";
  /** 自定义类名 */
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-mine-muted/10 text-mine-muted",
  up: "bg-market-up-medium/10 text-market-up-medium",
  down: "bg-market-down-medium/10 text-market-down-medium",
  warning: "bg-amber-500/10 text-amber-600",
  info: "bg-mine-accent-teal/10 text-mine-accent-teal",
};

const SIZE_STYLES: Record<"xs" | "sm", string> = {
  xs: "text-[9px] px-1 py-0.5",
  sm: "text-[10px] px-1.5 py-0.5",
};

/**
 * 通用徽章组件
 */
export const Badge = memo(function Badge({
  children,
  variant = "default",
  size = "xs",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-medium",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </span>
  );
});
