"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatPercent } from "../../utils/formatters";

export interface ChangeIndicatorProps {
  value: number;
  showSign?: boolean;
  size?: "xs" | "sm" | "base";
  bold?: boolean;
  className?: string;
}

const SIZE_STYLES: Record<"xs" | "sm" | "base", string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  base: "text-sm",
};

export const ChangeIndicator = memo(function ChangeIndicator({
  value,
  showSign = true,
  size = "sm",
  bold = false,
  className,
}: ChangeIndicatorProps) {
  const isUp = value > 0;
  const isDown = value < 0;

  let colorClass = "text-market-flat";
  if (isUp) colorClass = "text-market-up-medium";
  else if (isDown) colorClass = "text-market-down-medium";

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
