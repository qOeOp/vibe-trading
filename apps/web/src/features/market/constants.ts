/**
 * Market Feature Constants
 * 统一管理市场模块的所有常量配置
 */

// ============ Layout ============
export const LAYOUT = {
  /** AI Chat 面板宽度 */
  AI_PANEL_WIDTH: 280,
  /** 详情面板宽度 */
  DETAIL_PANEL_WIDTH: 360,
  /** 左侧图标栏宽度 */
  ICON_SIDEBAR_WIDTH: 52,
  /** 最小页面宽度 */
  MIN_PAGE_WIDTH: 1440,
} as const;

// ============ Treemap ============
export const TREEMAP = {
  /** Y轴拉伸比例（优化宽高比） */
  Y_STRETCH_FACTOR: 1.35,
  /** 边框宽度 */
  BORDER_WIDTH: 2,
  /** 瓷砖间隙 */
  TILE_GAP: 2,
  /** 最小高度 */
  MIN_HEIGHT: 300,
  /** 动画时长 (ms) */
  ANIMATION_DURATION: 400,
  /** 扩展时收缩比例 */
  SHRINK_RATIO: 0.92,
  /** 推开系数 */
  PUSH_FACTOR: 0.3,
} as const;

// ============ Colors ============
// 颜色统一使用 CSS 变量（定义在 globals.css）
// 市场颜色：var(--market-up), var(--market-up-medium), var(--market-down-medium), etc.
// UI 颜色：var(--color-mine-bg), var(--color-mine-card), var(--color-mine-text), etc.
// Tailwind 类：text-market-up-medium, bg-mine-bg, text-mine-text, etc.

/** CSS 变量名常量（用于 JS 中需要读取变量的场景） */
export const CSS_VARS = {
  market: {
    up: "--market-up",
    upMedium: "--market-up-medium",
    upLight: "--market-up-light",
    flat: "--market-flat",
    downLight: "--market-down-light",
    downMedium: "--market-down-medium",
    down: "--market-down",
  },
  ui: {
    bg: "--color-mine-bg",
    card: "--color-mine-card",
    text: "--color-mine-text",
    muted: "--color-mine-muted",
    border: "--color-mine-border",
    accent: "--color-mine-accent-teal",
  },
} as const;

// ============ Thresholds ============
export const THRESHOLDS = {
  /** 涨跌幅阈值 (%) */
  change: {
    strong: 5,
    medium: 2,
    light: 0.5,
  },
  /** 资金流阈值 (亿) */
  capitalFlow: {
    large: 100,
    medium: 50,
    small: 10,
  },
} as const;

// ============ News Types ============
export const NEWS_TYPES = {
  flash: { label: "快讯", color: "text-amber-500" },
  news: { label: "新闻", color: "text-blue-500" },
  announcement: { label: "公告", color: "text-purple-500" },
  research: { label: "研报", color: "text-green-500" },
} as const;

export type NewsType = keyof typeof NEWS_TYPES;

// ============ Importance Levels ============
export const IMPORTANCE_LEVELS = {
  high: { label: "重要", priority: 1 },
  medium: { label: "一般", priority: 2 },
  low: { label: "普通", priority: 3 },
} as const;

export type ImportanceLevel = keyof typeof IMPORTANCE_LEVELS;

// ============ Animation ============
export const ANIMATION = {
  /** Tape 滚动速度 (秒) */
  tapeScrollDuration: 30,
  /** 过渡动画缓动函数 */
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  /** Treemap 动画缓动函数 */
  treemapEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** 默认过渡时长 (ms) */
  defaultDuration: 200,
  /** Treemap 过渡时长 (ms) */
  treemapDuration: 400,
  /** Sparkline 显示延迟 (ms) */
  sparklineDelay: 420,
  /** Hover 防抖延迟 (ms) */
  hoverDelay: 150,
} as const;

// ============ API (Future) ============
export const API = {
  /** 刷新间隔 (ms) */
  refreshInterval: 5000,
  /** 新闻获取数量 */
  newsLimit: 12,
  /** 概念获取数量 */
  conceptsLimit: 8,
} as const;
