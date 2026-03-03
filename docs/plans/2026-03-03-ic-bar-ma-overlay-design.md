# IC Bar + MA Overlay 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有 IC 滚动均线纯线图增强为 IC 柱状图 + MA 叠加线。每根 bar = 单期 IC 值（原始信号颗粒感），MA 线 = 平滑趋势。吸收已删除的累计 IC section 的功能。

**Architecture:** 改造现有 `ICTimeSeriesSection` / `ICRollingMAChart`，在 LineChart 基础上叠加 bar 层。可能需要扩展 ngx-charts LineChart 支持 bar+line 混合，或改用 ComboChart 方案。

**Tech Stack:** React 19, TypeScript, ngx-charts (LineChart or custom ComboChart), Framer Motion, PanelSection

---

## 1. 布局结构

```
┌─ PanelSection ─────────────────────────────────┐
│                                                 │
│  IC ROLLING AVERAGE   ▊20D ─60D ─120D ┈阈值    │  header + legend
│                                                 │
│  0.06─┬──────────────────────────────────────── │
│       │  ▊ ▊▊   ▊▊▊  ▊▊▊ ▊▊▊   ▊▊  ▊▊  ▊▊   │  bar: 单期 IC
│  0.03─┤──╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌── │  虚线: 阈值
│       │    ╱─╲    ╱──╲  ╱─╲  ╱─╲        ╱╲    │  MA 线: 平滑趋势
│  0.00─┤╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌── │  零线: mine-border 虚线
│       │                          ▊▊ ▊          │  负 IC bar: 绿色
│ -0.03─┘──────────────────────────────────────── │
│                                                 │
└─────────────────────────────────────────────────┘
```

**设计理由:**
- **Bar 在底层**: 半透明柱状图在最底层，MA 线在上层，不互相遮挡
- **颗粒感**: 交易员可以直接看到每一期 IC 值的分布，连续几根 bar 在零线附近 = 因子失效信号。比纯 MA 线更灵敏
- **吸收累计 IC**: IC bar 的"持续在零线上方" 等价于累计 IC 曲线上升

---

## 2. 视觉规格

### IC Bar 层

- 数据: `factor.icTimeSeries`（240 点日频）
- Bar 宽度: 自适应（容器宽度 / 数据点数 - 1px gap）
- 颜色:
  - IC > 0: `market-up-medium`（红=好，A 股惯例）
  - IC ≤ 0: `market-down-medium`（绿=差）
- **Opacity 密度梯度**: 不是固定 opacity，根据 bar 高度动态调整
  - 短 bar（靠近零线）: opacity 0.12
  - 高 bar: opacity 0.28
  - 公式: `opacity = 0.12 + 0.16 * (|IC| / maxAbsIC)`
- **Bar 内部渐变**: 每根 bar 用 `<linearGradient>` 从顶部实色渐变到底部 fade out，模拟"从零线生长"效果
- 圆角: `rx="0.5"` 微圆角，消除像素锯齿感
- Y 轴起点: 0（bar 从零线向上/向下延伸）
- 层级: 最底层

### MA 线层（Highlight + Fade 策略）

**核心原则**: 只高亮一条主力 MA，其余退为背景层，消除多线交叉的"面条化"问题。

| 线 | 角色 | 颜色 | 宽度 | Opacity | 备注 |
|----|------|------|------|---------|------|
| 20D MA | **主力焦点** | `mine-accent-teal` (#26a69a) | 1.5px | 1.0 | 唯一实线，最短周期最灵敏 |
| 60D MA | 背景参考 | `#6366f1` (indigo) | 0.8px | 0.3 | 淡到背景里，只提供参考 |
| 120D MA | 趋势通道 | `#8b5cf6` (purple) | 无线条 | — | 只画 area fill，不画线 |

**120D Area Fill 双层渐变**:
- 底层: 从 MA 曲线到零线，opacity 0.03（大面积淡色）
- 顶层: 靠近 MA 线的 20px 窄带，opacity 0.12（模拟光源从线条向下衰减）
- 实现: 两个 `<path>` 叠加，顶层用 `<linearGradient>` 从 MA 线位置 opacity 0.12 → 向下 20px 处 opacity 0

**MA 线平滑**: `d3.curveMonotoneX`（monotone cubic 插值），消除折线锯齿转角。MA 本身是平滑趋势，视觉上也应该丝滑

**亚像素描边**: 配合 `shape-rendering="geometricPrecision"` 抗锯齿

**圆润末端**: `stroke-linecap="round"`

**端点标记**: 20D MA 最右端（最新值）加 3px 实心 teal 圆 + 外圈 6px teal ring（opacity 0.2）

### 参考线

- 零线: `mine-border` 色，0.5px 虚线（`strokeDasharray: 4,3`），opacity 极低不抢视觉权重
- 阈值线 (IC = 0.01): `market-up-medium` 色，0.5px 虚线
- **背景微纹理**: 2-3 条极淡水平参考线（opacity 0.03-0.04），对应 Y 轴 25%/50%/75% 位置，给空间以深度

### 图例

- 位置: header 行右侧
- 内容: `─ 20D  ─ 60D  ▓ 120D  ┈ 阈值`
  - 20D: teal 色 1.5px 线段
  - 60D: indigo 色 30% opacity 线段
  - 120D: purple 色 area 小色块（暗示"面积"而非"线"）

### 图表尺寸与呼吸感

- 高度: `h-[150px]`
- **内边距大方**: margin 比默认多 30-50%，数据不贴边框
- **Y 轴标签退远**: 标签和图表区域间留 8-12px gap，字号 8px，weight 300，muted 40% opacity
- X 轴: 隐藏
- Y 轴: overlay 模式

---

## 3. 实现方案

### 方案评估

现有 ngx-charts `LineChart` 不支持 bar+line 混合。两种实现路径：

**方案 A: 扩展 LineChart**
- 在 LineChart render fn 内，先渲染 bar 层（SVG `<rect>`），再渲染 line 层
- 优点: 复用现有 Y 轴、tooltip、animation 体系
- 缺点: 需要给 LineChart 加 `barData` prop，改动 ngx-charts 内部

**方案 B: 自定义 ComboChart**
- 新建 `ICBarMAChart` 组件，用 `BaseChart` + `useXChart` 直接组合 bar + line
- 优点: 不修改 ngx-charts 通用组件，专用组件更灵活
- 缺点: 不能复用 LineChart 的系列渲染逻辑

**推荐方案 B**: 这是一个特化图表，bar+line 组合在 ngx-charts 体系中没有通用需求。用 `BaseChart` + `useXChart` 直接构建，代码量不大。

### 组件结构

```tsx
// 新建: ic-bar-ma-chart.tsx (feature 级组件)

function ICBarMAChart({ icSeries }: { icSeries: number[] }) {
  // 1. BaseChart 提供容器和 ResizeObserver
  // 2. useXChart 提供 xScale, yScale, dims
  // 3. Bar 层: <rect> 逐点渲染，颜色按 IC 正负
  // 4. MA 线层: <motion.path> 三条 MA 线
  // 5. 参考线: 零线 + 阈值线
  // 6. Y 轴: 复用 ngx-charts YAxis 组件
}
```

---

## 4. 数据

### 现有数据（无需变更）

```ts
factor.icTimeSeries: number[]  // 240 点日频 IC 值
```

### MA 计算（现有 util）

```ts
import { computeRollingMA } from '@/features/library/utils/compute-ic-stats';
// computeRollingMA(data, window) → (number | null)[]
```

---

## 5. PanelSection 标题

- 从 `"IC 滚动均线"` 改为 `"IC ROLLING AVERAGE"`（英文大写，统一风格）
- 使用 PanelSection `title` prop

---

## 6. 组件规范

- `data-slot="ic-bar-ma-section"`
- 接受 `className` prop，用 `cn()` 合并
- 命名导出
- 替换现有 `ICTimeSeriesSection` export

---

## 7. 任务顺序

1. **新建 ICBarMAChart** — BaseChart + useXChart 实现 bar + line 混合图表
2. **Bar 层** — SVG rect 逐点渲染，IC 正负着色
3. **MA 线层** — 三条 motion.path MA 线（20D teal, 60D indigo, 120D purple+area）
4. **参考线** — 零线 + 阈值线虚线
5. **改造 ICTimeSeriesSection** — 替换 LineChart 为 ICBarMAChart，更新图例
6. **删除 ic-cumulative.tsx** — 累计 IC section 被吸收
