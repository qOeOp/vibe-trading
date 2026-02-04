/**
 * Market Data Formatters
 * 统一的数据格式化工具函数
 */

// ============ Number Formatters ============

const zhNumberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const zhIntFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 0,
});

/**
 * 格式化数字，添加千分位分隔符
 * @example formatNumber(3245.67) → "3,245.67"
 */
export function formatNumber(n: number, decimals = 2): string {
  if (decimals === 0) return zhIntFormatter.format(n);
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
}

/**
 * 格式化大数字（自动添加"万"/"亿"单位）
 * @example formatCompactNumber(12500000) → "1,250万"
 * @example formatCompactNumber(125000000) → "1.25亿"
 */
export function formatCompactNumber(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (abs >= 1e8) {
    return `${sign}${formatNumber(abs / 1e8, 2)}亿`;
  }
  if (abs >= 1e4) {
    return `${sign}${formatNumber(abs / 1e4, 0)}万`;
  }
  return formatNumber(n);
}

// ============ Percent Formatters ============

/**
 * 格式化百分比，带符号
 * @example formatPercent(1.21) → "+1.21%"
 * @example formatPercent(-0.62) → "-0.62%"
 */
export function formatPercent(n: number, decimals = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(decimals)}%`;
}

/**
 * 格式化百分比，不带符号
 * @example formatPercentAbs(1.21) → "1.21%"
 */
export function formatPercentAbs(n: number, decimals = 2): string {
  return `${Math.abs(n).toFixed(decimals)}%`;
}

// ============ Financial Formatters ============

/**
 * 格式化资金流向（亿元），带符号
 * @example formatFlow(145.8) → "+145.8亿"
 * @example formatFlow(-8.3) → "-8.3亿"
 */
export function formatFlow(n: number, decimals = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(decimals)}亿`;
}

/**
 * 格式化资金流向，不带符号
 * @example formatFlowAbs(-8.3) → "8.3亿"
 */
export function formatFlowAbs(n: number, decimals = 1): string {
  return `${Math.abs(n).toFixed(decimals)}亿`;
}

/**
 * 格式化成交量/成交额
 * @example formatVolume(3842) → "3,842亿"
 */
export function formatVolume(n: number): string {
  return `${zhNumberFormatter.format(n)}亿`;
}

/**
 * 格式化价格
 * @example formatPrice(23.45) → "23.45"
 */
export function formatPrice(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

// ============ Time Formatters ============

/**
 * 格式化时间为 HH:mm
 * @example formatTime(new Date()) → "14:30"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * 格式化日期为 MM-DD
 * @example formatDate(new Date()) → "12-25"
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// ============ Utility Formatters ============

/**
 * 截断文本并添加省略号
 * @example truncateText("这是一段很长的文字", 5) → "这是一段很..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
