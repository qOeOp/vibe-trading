import type { ColorRampEntry } from "../types";

/**
 * 7-stop color ramp (Binance-style)
 * Chinese convention: Red = 涨 (positive), Green = 跌 (negative)
 */
export const COLOR_RAMP: ColorRampEntry[] = [
  { bg: "#0B8C5F", badge: "#2EBD85" },   // 0: deep green (< -5%)
  { bg: "#2EBD85", badge: "#2EBD85" },   // 1: medium green (-2% ~ -5%)
  { bg: "#58CEAA", badge: "#2EBD85" },   // 2: light green (-0.5% ~ -2%)
  { bg: "#76808E", badge: "rgba(255,255,255,0.6)" }, // 3: gray (±0.5%)
  { bg: "#E8626F", badge: "#F6465D" },   // 4: light red (+0.5% ~ +2%)
  { bg: "#F6465D", badge: "#F6465D" },   // 5: medium red (+2% ~ +5%)
  { bg: "#CF304A", badge: "#F6465D" },   // 6: deep red (> +5%)
];

export function getColorIndex(changePercent: number): number {
  if (changePercent <= -5) return 0;
  if (changePercent <= -2) return 1;
  if (changePercent <= -0.5) return 2;
  if (changePercent < 0.5) return 3;
  if (changePercent < 2) return 4;
  if (changePercent < 5) return 5;
  return 6;
}

export function getTileColor(changePercent: number): string {
  return COLOR_RAMP[getColorIndex(changePercent)].bg;
}

export function getBadgeColor(changePercent: number): string {
  return COLOR_RAMP[getColorIndex(changePercent)].badge;
}
