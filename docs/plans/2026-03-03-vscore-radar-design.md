# V-Score + Radar 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 改造现有 OverviewSection，V-Score 居中叠加在 Radar 中心，全宽展示，响应 Global Selector 上下文切换。

**Architecture:** 重构现有 `overview-section.tsx`，VScoreIndicator 改为 absolute 居中叠加。RadarChart 保持现有 ngx-charts 实现。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, RadarChart (ngx-charts), PanelSection

---

## 1. 布局结构

```
┌─ PanelSection title="OVERVIEW" ──────────────┐
│                                               │
│ ┌─ chart container (relative) ─────────────┐ │
│ │                                           │ │
│ │          ╱ ╲                               │ │
│ │        ╱     ╲       ← radar polygon      │ │
│ │      ╱  V-Score ╲                          │ │
│ │     │    72.4    │   ← 居中叠加大字        │ │
│ │     │   STRONG   │   ← tier badge          │ │
│ │      ╲         ╱                            │ │
│ │        ╲     ╱                              │ │
│ │          ╲ ╱                                │ │
│ │                                           │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

---

## 2. V-Score 居中叠加

### 现有实现

VScoreIndicator 是 pill 样式 (`flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-xxx/8`)，放在 radar 上方。

### 改造后

VScoreIndicator 改为绝对定位居中，叠在 radar 中心空白区域：

```tsx
<div className="relative">
  <RadarChart ... />
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <span className="text-[10px] text-mine-muted font-medium">V-Score</span>
    <span className={cn(
      "text-base font-bold font-mono tabular-nums",
      colorClass  // text-blue-500 / text-mine-accent-yellow / text-mine-muted
    )}>
      {vScore >= 0 ? '+' : ''}{vScore.toFixed(2)}
    </span>
    <span className={cn(
      "text-[9px] font-semibold px-1.5 py-0.5 rounded mt-0.5",
      bgClass, colorClass
    )}>
      {label}
    </span>
  </div>
</div>
```

### 样式规格

- 外层: `relative`（已有 RadarChart 容器）
- V-Score 叠加层: `absolute inset-0 flex flex-col items-center justify-center pointer-events-none`
- "V-Score" 标签: `text-[10px] text-mine-muted font-medium`
- 数值: `text-base font-bold font-mono tabular-nums`（16px，比现有 11px 大）
- Tier badge: `text-[9px] font-semibold px-1.5 py-0.5 rounded mt-0.5`
- 颜色三档:
  - vScore < -1: `text-blue-500 bg-blue-500/8` — "低估"
  - vScore > 1: `text-mine-accent-yellow bg-mine-accent-yellow/8` — "拥挤风险"
  - else: `text-mine-muted bg-mine-muted/6` — "正常"

---

## 3. Radar Chart

### 保留不变

- 组件: `RadarChart` (`@/lib/ngx-charts/radar-chart`)
- 7 维度: 预测力、稳定性、衰减、收益、风险控制、覆盖度、容量
- fillColor: `#26a69a` (mine-accent-teal), fillOpacity: 0.18
- strokeColor: `#26a69a`

### 改动

- `size` prop: 从固定 `320` 改为容器自适应（或保持 320，侧栏宽度 320-420px 足够）
- 移除外层 `mt-3`（VScoreIndicator 不再独立占行）

---

## 4. PanelSection 标题

- 从 `"综合概览"` 改为 `"OVERVIEW"`
- 使用 PanelSection `title` prop（英文大写）

---

## 5. Global Selector 响应

### 当前状态

Radar 的 7 维度分数从 `computeRadarScores(factor)` 计算，使用 factor 的顶层字段（ic, ir, icTstat, turnover 等）。这些字段目前是固定值，不区分 pool/horizon。

### 未来数据层扩展

当 Factor 数据模型支持 multi-config 数据后：

```ts
// 未来的数据结构
factor.configResults[pool][horizon] = {
  ic, ir, icTstat, winRate, turnover, capacity, ...
}
```

OverviewSection 需要：
1. 从 `useLibraryStore` 读取 `selectedPool` + `selectedHorizon`
2. 用当前 config 的数据切片调用 `computeRadarScores()`
3. V-Score 也跟随切换

### Phase 1（本次实现）

先骨架对接——从 store 读取 pool/horizon，但数据仍取 factor 顶层字段（mock 数据只有一套值）。切换时数据不变，但代码路径已准备好。

---

## 6. 数据计算 (computeRadarScores)

### 现有实现

```ts
// compute-radar-scores.ts
export function computeRadarScores(factor: Factor): RadarScores {
  return {
    predictive: clamp(factor.ic / 0.08),      // IC 绝对值 → 0-1
    stability: clamp(factor.ir / 2),            // IR → 0-1
    decay: clamp(factor.icHalfLife / 20),       // 半衰期 → 0-1
    return: clamp(factor.longShortReturn / 30), // 年化收益 → 0-1
    risk: clamp(1 - factor.maxDrawdown / 0.3),  // 回撤 → 0-1 (反转)
    coverage: factor.coverageRate,              // 已经是 0-1
    capacity: clamp(factor.capacity / 50000),   // 容量(万) → 0-1
  };
}
```

### 未来改进方向

- Radar 分数应该是 **percentile rank**（相对因子库全体），而不是硬编码阈值归一化
- 需要因子库级别的统计分布数据来计算 percentile
- 这是数据层任务，不在本次 UI 设计范围内

---

## 7. 任务顺序

1. **VScoreIndicator 改造** — 从 pill 样式改为 absolute 居中叠加
2. **OverviewSection 重构** — relative 容器 + V-Score 叠加 + 移除上方 pill
3. **PanelSection title** — 改为 `"OVERVIEW"`
4. **Store 对接骨架** — 从 useLibraryStore 读取 pool/horizon（数据暂不切换）
5. **测试** — 视觉验证 V-Score 在 radar 中心的对齐和可读性
