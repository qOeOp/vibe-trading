# Predictive Power 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 从现有 StatisticsSection 中提取 IC 和 ICIR 相关指标，重组为 2 个并排 Hero Card，展示因子预测力核心数据。

**Architecture:** 新建 `PredictivePowerSection` 组件，内含 2 个 `HeroMetricCard` 并排。复用现有 `ThresholdBar` 组件。从 StatisticsSection 中移除对应指标。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, PanelSection, ThresholdBar, SVG mini bar chart

---

## 1. 布局结构

```
┌─ PanelSection title="PREDICTIVE POWER" ───────┐
│                                                 │
│ ┌─ IC Card ──────────┐ ┌─ ICIR Card ─────────┐ │
│ │ IC                  │ │ ICIR                 │ │
│ │ +0.042  优秀        │ │ 1.82  优秀           │ │
│ │ ████████░░░ bar     │ │ ███████░░░ bar       │ │
│ │ ─────────────────── │ │ ──────────────────── │ │
│ │ t-stat    95% CI    │ │ 胜率                  │ │
│ │ 3.21   [.031,.053]  │ │ 62%                  │ │
│ │ ▊▊▊▊▊▊▊▊▊▊▊▊ mini │ │ ▊▊▊▊▊▊▊▊▊▊▊▊ mini  │ │
│ └─────────────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**设计理由:**
- **并排 2 列**: IC 和 ICIR 是因子预测力的两个核心维度，并排便于直观对比
- **从 StatisticsSection 拆出**: 原 3×3 grid 混合了预测力、风险、实用指标，拆分后主题更聚焦
- **Hero Card 模式**: 大数字 + tier badge + threshold bar + sub-metrics + mini chart，信息层次清晰

---

## 2. Hero Metric Card 视觉规格

### 卡片容器

- 布局: `grid grid-cols-2 gap-2.5`
- 单卡片: `border border-mine-border rounded-[10px] p-3`
- 无背景色（继承 PanelSection 背景）
- 无 shadow

### Hero 区域

- Label: `text-[9px] text-mine-muted font-medium uppercase tracking-wide`
- 数值行: `flex items-baseline gap-1.5 mt-1`
  - 大数字: `text-xl font-bold font-mono tabular-nums text-mine-text`（20px）
  - Tier badge: `text-[9px] font-semibold px-1.5 py-[1px] rounded`
    - 基于 `calibratedNormalize` score 分档（与 Radar 校准基准一致，Settings 可调）
    - score ≥ 0.8 (good+): `text-market-up-medium bg-market-up-medium/[0.06]` — "优秀"
    - score 0.5-0.8 (average-good): `text-amber-500 bg-amber-500/[0.06]` — "合格"
    - score < 0.5: `text-mine-muted bg-mine-muted/[0.06]` — "低于合格线"
    - IC Card 用 predictive 校准，ICIR Card 用 stability 校准

### Threshold Bar

- 复用现有 `ThresholdBar` 组件（`@/components/shared/factor-metrics/threshold-bar`）
- 高度: 4px
- margin-top: `mt-2`
- 刻度线对齐校准基准: poor / average / good 三个位置各一条 1px 竖线，高度 8px
- 填充分色: poor 左侧灰 → poor-average 琥珀渐变 → average-good 红渐变 → good 右侧深红
- Domain 收窄: IC `[-0.02, 0.08]`，ICIR `[-0.5, 2.5]`（让校准刻度线位置清晰）
- 刻度线不标数字（bar 太紧凑），hover 时 tooltip 显示值

### Sub-metrics 区域

- 分隔线: `mt-2.5 pt-2 border-t border-mine-border/[0.04]`
- 布局: `flex justify-between`（IC card 2 项）或单项（ICIR card）
- Label: `text-[8px] text-mine-muted uppercase`
- Value: `text-[11px] font-semibold font-mono tabular-nums`
- Value 颜色:
  - t-stat ≥ 2: `text-market-up-medium`（显著）
  - t-stat < 2: `text-mine-muted`（不显著）
  - CI / 胜率: `text-mine-text`（默认）

### Mini Bar Chart

- 容器: `mt-2 h-7 bg-mine-bg rounded`（28px 高）
- 数据: 90D Rolling IC/ICIR 日值
- 柱宽: 3px，间距 1px
- 正值: `rgba(207,48,74,0.3)` (红=正 IC=好)
- 负值: `rgba(11,140,95,0.3)` (绿=负 IC=差)
- 无轴线、无标签（纯 sparkline）
- 实现: 内联 SVG（复用 FactorMetricItem 中已有的 MiniBarChart 逻辑）

---

## 3. 指标分配

### IC Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `factor.ic` | `+0.042`（±符号 + 3位小数） |
| Tier badge | `calibratedNormalize(value, calibrations[key])` → score ≥ 0.8 优秀(红), score ≥ 0.5 合格(琥珀), < 0.5 低(灰)。阈值从 Settings 校准基准派生，不硬编码。 | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.ic` | domain [-0.08, 0.12] |
| t-stat | `factor.icTstat` | `3.21`（2位小数） |
| 95% CI | Bootstrap CI（新增字段或从现有数据计算） | `[.031, .053]` |
| Mini chart | `factor.icTimeSeries` 最近 90 个值 | sparkline |

### ICIR Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `factor.ir` | `1.82`（2位小数） |
| Tier badge | `calibratedNormalize(value, calibrations[key])` → score ≥ 0.8 优秀(红), score ≥ 0.5 合格(琥珀), < 0.5 低(灰)。阈值从 Settings 校准基准派生，不硬编码。 | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.icir` | domain [-1, 3] |
| 胜率 | `signalSlice.positiveIcRatio` (tooltip: IC 方向正确的交易日占比) | `62%` |
| Mini chart | 从 `factor.icTimeSeries` 计算 90D rolling ICIR | sparkline |

---

## 4. 数据来源

### 多维度数据对接

所有数据通过 `useFactorSlice()` hook 获取当前 pool×horizon 的信号数据切片，不直接读 factor 扁平字段：

| 元素 | 旧数据源 | 新数据源 |
|------|---------|---------|
| IC value | `factor.ic` | `signalSlice.ic` |
| ICIR value | `factor.ir` | `signalSlice.ir` |
| t-stat | `factor.icTstat` | `signalSlice.icTstat` |
| 胜率 | `factor.winRate` | `signalSlice.positiveIcRatio` |
| Mini chart (IC) | `factor.icTimeSeries` | `signalSlice.icTimeSeries` |
| Mini chart (ICIR) | 从 `factor.icTimeSeries` 计算 | 从 `signalSlice.icTimeSeries` 计算 |
| Bootstrap CI | 从 `factor.icTimeSeries` 计算 | 从 `signalSlice.icTimeSeries` 计算 |

见 `factor-data-architecture.md` §2.5。

### 数据模型变更

### Bootstrap CI

**Bootstrap CI 优先从 `signalSlice.bootstrapCI` 读取（后端预算，1000 次 percentile 法，确定性结果）。仅在后端数据不可用时 fallback 到前端计算（需使用 seeded PRNG 保证确定性）。**

**Fallback: 前端 Bootstrap 计算**

```ts
function bootstrapCI(series: number[], iterations = 1000): [number, number] {
  const n = series.length;
  const means: number[] = [];
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += series[Math.floor(Math.random() * n)];
    }
    means.push(sum / n);
  }
  means.sort((a, b) => a - b);
  return [means[Math.floor(iterations * 0.025)], means[Math.floor(iterations * 0.975)]];
}
```

- 数据源: `signalSlice.icTimeSeries`（当前 pool×horizon 的 IC 序列）
- 计算量: 240 数据点 × 1000 次重采样 ≈ 几十毫秒，前端可承受
- Sub-metric label: `95% CI (240D)` — 标注数据窗口长度
- ⓘ tooltip: "通过 1000 次自助采样计算的 IC 均值 95% 置信区间。区间不含 0 = IC 显著。"

### Rolling ICIR 计算

```ts
function computeRollingICIR(icSeries: number[], window = 20): number[] {
  // 从 icTimeSeries 滑窗计算 mean(IC)/std(IC)
  return icSeries.slice(window - 1).map((_, i) => {
    const slice = icSeries.slice(i, i + window);
    const mean = slice.reduce((a, b) => a + b, 0) / window;
    const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / window);
    return std === 0 ? 0 : mean / std;
  });
}
```

---

## 5. 组件结构

```tsx
interface PredictivePowerSectionProps {
  factor: Factor;
  className?: string;
}
```

### HeroMetricCard 子组件

可提取为通用 shared 组件（#6 Risk-Return 也用同样模式）:

```tsx
interface HeroMetricCardProps {
  label: string;
  value: number;
  metricKey: MetricKey;
  subMetrics: Array<{ label: string; value: string; color?: string }>;
  miniChartData?: number[];
  className?: string;
}
```

### 组件规范

- `data-slot="predictive-power-section"`
- HeroMetricCard: `data-slot="hero-metric-card"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 6. StatisticsSection 变更

从 StatisticsSection 的 3×3 PanelStatGrid 中移除以下指标（已迁移到 PredictivePowerSection）：

- IC（当前 horizon）— → IC Card hero（由 Global Selector 的 horizon tab 决定展示哪个）
- 其余 3 个 horizon 的 IC — 删除（Global Selector 切 horizon 即可）
- IR — → ICIR Card hero
- t-stat — → IC Card sub-metric
- 胜率 — → ICIR Card sub-metric

StatisticsSection 剩余指标（换手、容量、IC半衰期）迁移到 #6 Risk-Return 或删除（IC半衰期在 Radar 中已有）。

StatisticsSection 中的 FactorMetricGrid（6 指标 vs 因子库分布）保留与否待定——可能合并到 #12 IC Statistics。

---

## 7. 任务顺序

1. **新建 HeroMetricCard** — 通用 hero card 子组件（大数字 + tier + bar + sub-metrics + mini chart）
2. **新建 PredictivePowerSection** — 2 列并排 IC card + ICIR card
3. **Bootstrap CI 计算** — 前端 percentile 近似，从 icTimeSeries 计算
4. **Rolling ICIR 计算** — 从 icTimeSeries 滑窗计算 mini chart 数据
5. **集成到 factor-detail-panel** — 插入到 IC Sensitivity Grid 下方
6. **StatisticsSection 瘦身** — 移除已迁移指标
