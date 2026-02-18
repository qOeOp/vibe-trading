// ─── Formatters ──────────────────────────────────────────

export function formatIC(v: number | null | undefined): string {
  if (v == null) return "";
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
}

export function formatNum2(v: number | null | undefined): string {
  if (v == null) return "";
  return v.toFixed(2);
}

export function formatPct(v: number | null | undefined): string {
  if (v == null) return "";
  return `${Math.round(v)}%`;
}

export function formatCapacity(v: number | null | undefined): string {
  if (v == null) return "";
  if (v >= 10000) return `${(v / 10000).toFixed(0)}亿`;
  return `${v.toFixed(0)}万`;
}
