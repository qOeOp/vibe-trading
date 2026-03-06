# V-Score + Radar 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **上游约束:** `docs/plans/2026-03-03-factor-data-architecture.md` §2.2, §2.3

**Goal:** 改造现有 OverviewSection，V-Score 居中叠加在 Radar 中心，全宽展示，响应 Global Selector 上下文切换。归一化方式从硬编码阈值改为基于量化实践的分段线性校准。

**Architecture:** 重构现有 `overview-section.tsx`，VScoreIndicator 改为 absolute 居中叠加。RadarChart 保持现有 ngx-charts 实现。computeRadarScores 改为校准归一化。

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
│ │     │   回测值   │   ← 数据来源标签        │ │
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
      colorClass
    )}>
      {vScore >= 0 ? '+' : ''}{vScore.toFixed(2)}
    </span>
    <span className={cn(
      "text-[9px] font-semibold px-1.5 py-0.5 rounded mt-0.5",
      bgClass, colorClass
    )}>
      {label}
    </span>
    <span className="text-[8px] text-mine-muted mt-0.5">
      {sourceLabel}
    </span>
  </div>
</div>
```

### 样式规格

- 外层: `relative`（已有 RadarChart 容器）
- V-Score 叠加层: `absolute inset-0 flex flex-col items-center justify-center pointer-events-none`
- "V-Score" 标签: `text-[10px] text-mine-muted font-medium`
- 数值: `text-base font-bold font-mono tabular-nums`（16px）
- Tier badge: `text-[9px] font-semibold px-1.5 py-0.5 rounded mt-0.5`
- 颜色三档:
  - vScore < -1: `text-blue-500 bg-blue-500/8` — "低估"
  - vScore > 1: `text-mine-accent-yellow bg-mine-accent-yellow/8` — "拥挤风险"
  - else: `text-mine-muted bg-mine-muted/6` — "正常"

### 数据来源标签

V-Score 下方显示数据来源，与生命周期阶段关联（见 factor-data-architecture §2.3）：

| 生命周期 | 标签 | 含义 |
|---------|------|------|
| INCUBATING | "回测值" | 部分维度（收益/风险）基于回测快照 |
| PAPER_TEST | "模拟盘" | 全维度活数据 |
| LIVE_ACTIVE | "实盘" | 全维度活数据 |
| PROBATION | 取最后活跃阶段的标签 | |

- 标签样式: `text-[8px] text-mine-muted mt-0.5`
- 标签旁加 ⓘ tooltip，解释含义

---

## 3. Radar Chart

### 保留不变

- 组件: `RadarChart` (`@/lib/ngx-charts/radar-chart`)
- 7 维度: 预测力、稳定性、衰减、收益、风险控制、覆盖度、容量
- fillColor: `#26a69a` (mine-accent-teal), fillOpacity: 0.18
- strokeColor: `#26a69a`

### 改动

- `size` prop: 从固定 `320` 改为容器自适应
- 移除外层 `mt-3`（VScoreIndicator 不再独立占行）

### 溢出标注

当某个维度的原始值超过归一化上限（score > 1.0）时：

- 雷达图该维度画到 1.0 位置（不畸变）
- 维度标签变为 teal 色 + 显示实际值: `预测力 ★0.09`
- 正常维度标签: `mine-muted` 色，无数值

### INCUBATING 阶段缺失维度

INCUBATING 阶段只有信号指标（预测力、稳定性、衰减、覆盖度），缺少组合指标（收益、风险控制、容量）。

- 缺失维度的雷达多边形边用 **灰色虚线**（`stroke-dasharray: 4 3`, `stroke: mine-border`）画到 0 位置
- 有数据的维度正常实线 teal 填充
- 维度标签保留，缺失维度标签后追加"待评估"（灰色虚线标注）
- V-Score 计算时剔除缺失维度，剩余权重归一化。例如 INCUBATING 因子有 4/7 维度（predictive, stability, decay, coverage），权重和约 0.6，归一化后满分仍是 100。UI 标注"基于 N/7 维度"。Radar 图缺失维度的轴仍然画出但用灰色虚线标注"待评估"
- 当因子进入 PAPER_TEST 后组合指标就绪，虚线自动消失，V-Score 切换为全 7 维度计算

---

## 4. 归一化方法：分段线性校准

### 设计原则

- **基于 A 股量化实践的学术/业界基准**，不是拍脑袋
- **分段线性映射**，在"及格线"附近区分度最高
- **不封顶**：超过上限的维度 score > 1.0，雷达图 clamp 到 1.0 但标注实际值
- **库内 percentile 作为辅助标注**（维度标签 tooltip 里显示 `库内排名 Top 15%`）

### 7 维度校准基准（A 股日频因子）

```ts
interface DimensionCalibration {
  poor: number;     // score = 0.2
  average: number;  // score = 0.5
  good: number;     // score = 0.8
  // 超过 good 继续线性外推，不封顶
}

const CALIBRATIONS: Record<string, DimensionCalibration> = {
  predictive: { poor: 0.01, average: 0.025, good: 0.05 },    // IC
  stability:  { poor: 0.3,  average: 0.5,   good: 1.0 },     // ICIR (业内: ≥0.5 合格, ≥1.0 优秀)
  decay:      { poor: 3,    average: 7,     good: 15 },       // IC 半衰期 (天)
  return:     { poor: 5,    average: 12,    good: 20 },       // 年化收益 (%)
  risk:       { poor: 25,   average: 15,    good: 8 },        // 最大回撤 (%, 反转)
  coverage:   { poor: 0.3,  average: 0.6,   good: 0.85 },    // 覆盖率 // 注: 此为全 A 基准，后续支持 per-pool 差异化阈值
  capacity:   { poor: 2000, average: 8000,  good: 50000 },    // 容量 (万元)
};
```

### 归一化函数

```ts
/**
 * 分段线性校准归一化 — 升序维度 (值越大越好)
 * 用于: predictive, stability, decay, return, coverage, capacity
 */
function calibratedNormalize(
  value: number,
  cal: DimensionCalibration
): number {
  if (value <= cal.poor) return 0.2 * (value / cal.poor);
  if (value <= cal.average) return 0.2 + 0.3 * ((value - cal.poor) / (cal.average - cal.poor));
  if (value <= cal.good) return 0.5 + 0.3 * ((value - cal.average) / (cal.good - cal.average));
  const slope = 0.3 / (cal.good - cal.average);
  return 0.8 + slope * 0.5 * (value - cal.good);  // 半速外推，不封顶
}

/**
 * 分段线性校准归一化 — 降序维度 (值越小越好)
 * 用于: risk (最大回撤, 取绝对值后越小越好)
 * 校准基准: poor=25%(大回撤=差), average=15%, good=8%(小回撤=好)
 */
function calibratedNormalizeDesc(
  value: number,
  cal: DimensionCalibration  // poor > average > good (降序)
): number {
  const v = Math.abs(value);  // MaxDD 是负数，取绝对值
  if (v >= cal.poor) return 0.2 * (cal.poor / v);  // 比 poor 还差
  if (v >= cal.average) return 0.2 + 0.3 * ((cal.poor - v) / (cal.poor - cal.average));
  if (v >= cal.good) return 0.5 + 0.3 * ((cal.average - v) / (cal.average - cal.good));
  // 比 good 还好（回撤非常小）
  const slope = 0.3 / (cal.average - cal.good);
  return 0.8 + slope * 0.5 * (cal.good - v);  // 半速外推，不封顶
}
```

### 校准基准来源说明

| 维度 | 基准依据 |
|------|---------|
| IC 0.025 及格 | A 股日频因子 IC 中位数约 0.02-0.03，学术文献常用 0.03 作为"有效因子"阈值 |
| ICIR 0.6 及格 | ICIR = IC_mean / IC_std，0.5 以上认为信号稳定，>1.0 为优质 |
| 半衰期 7D 及格 | 日频因子 5-10D 半衰期常见，<3D 衰减太快难以交易 |
| 年化 12% 及格 | A 股多空组合年化 10-15% 为中等水平 |
| 回撤 15% 及格 | 最大回撤 10-20% 为可接受范围 |
| 覆盖率 60% 及格 | 覆盖 >50% 的股票池才有实操意义 |
| 容量 8000万 及格 | 中小盘因子容量约 5000万-2亿 |

**这些基准值应写入 Settings 模块的全局配置，允许交易员根据自己的标准调整。**

#### Settings UI 交互方式

校准基准用**三把手 Range Slider** 调整，不用数字输入框：

```
预测力 (IC)
弱        合格        优秀
├────●────────●────────●──────────┤
   0.01     0.025     0.05
```

- 每个维度一条滑轨，3 个可拖动把手（poor / average / good）
- 拖动时实时显示当前数值
- 把手间有最小间距约束
- 滑轨分色：poor 左侧灰 → poor-average 琥珀 → average-good 红 → good 右侧深红
- 可选：在滑轨上用竖线标注当前选中因子的值，直观显示"因子在哪个区间"

V-Score 权重用**联动滑块**：7 个滑块总和约束 = 1.0，拖大一个时其余等比缩小。

---

## 5. V-Score 计算

### 公式

V-Score = 7 个维度归一化分数的加权平均 × 100

```ts
const WEIGHTS = {
  predictive: 0.25,  // 预测力最重要
  stability:  0.20,  // 稳定性次之
  decay:      0.10,
  return:     0.15,
  risk:       0.15,
  coverage:   0.05,
  capacity:   0.10,
};

function computeVScore(scores: RadarScores): number {
  let sum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    sum += Math.min(scores[key], 1.0) * weight;  // clamp to 1.0 for V-Score calculation
  }
  return sum * 100;  // 0-100 scale
}
```

### 权重说明

- 预测力 (0.25) + 稳定性 (0.20) = 0.45 — 信号质量占近一半，因子的核心价值
- 收益 (0.15) + 风险 (0.15) = 0.30 — 组合表现
- 衰减 (0.10) + 容量 (0.10) + 覆盖 (0.05) = 0.25 — 实操约束

**权重也应写入 Settings 全局配置。**

---

## 6. 库内 Percentile（辅助标注）

### 数据来源（BLOCKED_BY: 后台服务）

后端维护因子库各指标的分布统计（min, max, percentiles），每次入库/更新后重算。

### 展示方式

不在雷达图上直接显示。在维度标签的 **tooltip** 里展示：

```
预测力 (IC)
当前值: 0.042
校准得分: 0.72
库内排名: Top 23% (8/35)
```

---

## 7. PanelSection 标题

- 从 `"综合概览"` 改为 `"OVERVIEW"`
- 使用 PanelSection `title` prop（英文大写）

---

## 8. Global Selector 响应

### 当前数据层

Radar 的 7 维度分数从 `computeRadarScores(factor)` 计算，使用 factor 的顶层字段（ic, ir, icTstat, turnover 等）。

### Multi-config 数据层就绪后

OverviewSection 需要：
1. 从 `useLibraryStore` 读取 `selectedPool` + `selectedHorizon`
2. 用当前 config 的数据切片调用 `computeRadarScores()`
3. V-Score 也跟随切换
4. 数据来源标签跟随生命周期阶段

### Phase 1（本次实现）

先骨架对接——从 store 读取 pool/horizon，但数据仍取 factor 顶层字段（mock 数据只有一套值）。切换时数据不变，但代码路径已准备好。

---

## 9. 上游依赖

| 依赖项 | 阻塞模块 | 说明 |
|--------|----------|------|
| 维度原始指标 | Backtest | 入库时产出 IC, ICIR, 半衰期, 收益, 回撤, 覆盖率, 容量 |
| 库内分布统计 | 后台服务 | percentile 辅助标注需要全库分布数据 |
| 校准基准配置 | Settings | 7 维度的 poor/average/good 阈值可全局调整 |
| 权重配置 | Settings | V-Score 的 7 维度权重可全局调整 |

---

## 10. 任务顺序

1. **归一化重构** — `compute-radar-scores.ts` 改为分段线性校准，引入 CALIBRATIONS 常量
2. **V-Score 计算** — 加权平均公式，引入 WEIGHTS 常量
3. **VScoreIndicator 改造** — 从 pill 样式改为 absolute 居中叠加 + 数据来源标签
4. **溢出标注** — RadarChart 维度标签支持 teal 色 + 实际值显示
5. **OverviewSection 重构** — relative 容器 + V-Score 叠加 + 移除上方 pill
6. **PanelSection title** — 改为 `"OVERVIEW"`
7. **Store 对接骨架** — 从 useLibraryStore 读取 pool/horizon（数据暂不切换）
8. **Tooltip** — 维度标签 tooltip 显示当前值 + 校准得分 + 库内排名（排名先 stub）
