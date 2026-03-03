# IC Statistics 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 合并 IC 直方图、IC 统计详情、鲁棒性检验为统一的 IC Statistics section。增强直方图（正态拟合线 + 偏离 hatching）。不使用折叠。

**Architecture:** 新建 `ICStatisticsSection`，合并三个现有组件的内容。增强 IC 直方图添加正态拟合曲线和 SVG hatching。删除原 `ICStatsCollapsible`、`RobustnessSection`、`ICHistogramSection` 独立组件。

**Tech Stack:** React 19, TypeScript, ngx-charts BarVertical (或自定义 SVG), SVG pattern hatching, PanelSection, PanelKV

---

## 1. 布局结构

```
┌─ PanelSection title="IC STATISTICS" ───────────┐
│                                                  │
│  ┌─ Enhanced Histogram ─────────────────────┐   │
│  │  ▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊▊  ← bar 实心     │   │
│  │  ▧▧    ╱──────────╲    ▧▧  ← 正态拟合线  │   │
│  │       ╱            ╲       ← hatching 偏离│   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌─ IC KV Grid (2 列) ─────────────────────┐   │
│  │ IC均值   +0.0352   │ IC标准差   0.0184   │   │
│  │ 偏度     0.34      │ 峰度       3.21     │   │
│  │ 正值次数 156       │ 负值次数   84       │   │
│  │ 显著比例 42.5%     │ 正显著     35.0%    │   │
│  │ P值      <0.001    │ IC半衰期   T+12     │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Robustness Tests ──────────────────────┐    │
│  │ Rank Test   rank(X) 保留率   72% 逻辑扎实│    │
│  │ Binary Test sign(X) 保留率   58% 中等    │    │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**设计理由:**
- **合并三个验证性组件**: IC 直方图、统计详情、鲁棒性检验都是因子有效性的验证信息，属于同一主题
- **不折叠**: 放在面板最底部本身就是优先级排序，不需要额外隐藏
- **正态拟合 + hatching**: 替代删除的 QQ Plot，一眼看出 IC 分布偏离正态的方向和程度

---

## 2. Enhanced Histogram 视觉规格

### 直方图 Bar

- 保留现有 20-bin BarVertical
- 颜色: 保留现有 teal 梯度（中心浅、尾部深）
- 高度: `h-[130px]`（略缩小，为 KV 和 robustness 留空间）

### 正态拟合曲线

- 参数: `mean = icDistribution.icMean`, `std = icDistribution.icStd`
- 渲染: SVG `<path>` 叠加在 bar 上方
- 颜色: `mine-muted`, 1px, opacity 0.6
- 计算: 高斯 PDF 曲线，归一化到与直方图同一 Y 轴

```ts
function normalPDF(x: number, mean: number, std: number): number {
  const exp = -0.5 * ((x - mean) / std) ** 2;
  return Math.exp(exp) / (std * Math.sqrt(2 * Math.PI));
}
```

### 偏离 Hatching

- 定义: bar 高度超出正态曲线的部分
- 实现: SVG `<pattern>` 45° 斜线填充
  - Pattern: `<line x1="0" y1="4" x2="4" y2="0" stroke="currentColor" stroke-width="0.5" />`
  - 颜色: `mine-muted` opacity 0.3
- 技术方案: 每个 bar 分两层渲染
  1. 实心层: min(barHeight, normalHeight) — 实心 teal
  2. Hatching 层: max(0, barHeight - normalHeight) — hatching 填充
- **如果实现复杂度过高**: Phase 1 可以只渲染正态曲线 overlay，hatching 留到 Phase 2

### 实现方案评估

现有 BarVertical (ngx-charts) 不支持 per-bar 双层渲染。两种路径：

**方案 A: 自定义 SVG 直方图**
- 不用 BarVertical，直接用 `BaseChart` + `useXChart` 渲染 `<rect>` + `<pattern>` + `<path>`
- 优点: 完全控制双层 bar + 正态曲线 overlay
- 缺点: 丢失 BarVertical 的 tooltip 和 animation

**方案 B: BarVertical + SVG overlay**
- 保留 BarVertical，在其上方叠加一层绝对定位的 SVG（正态曲线）
- 优点: 保留 animation
- 缺点: 坐标对齐困难，hatching 无法实现

**推荐方案 A**: 验证性图表不需要 tooltip 和 animation，直接控制 SVG 更灵活。

---

## 3. IC KV Grid 视觉规格

- 布局: `grid grid-cols-2 gap-x-4 gap-y-0`（保留现有 ICStatsCollapsible 的布局）
- 容器: `mt-3 pt-3 border-t border-mine-border/40`
- 每项: `PanelKV`（现有组件）
- 标题: `panel-hint mb-2` — "分布统计"

### 指标列表

| Label | Value | 颜色 |
|-------|-------|------|
| IC均值 | `+0.0352` | 正=positive, 负=negative |
| IC标准差 | `0.0184` | — |
| 偏度 | `0.34` | — |
| 峰度 | `3.21` | — |
| 正值次数 | `156` | — |
| 负值次数 | `84` | — |
| 显著比例 | `42.5%` | — |
| 正显著比例 | `35.0%` | — |
| P值 | `<0.001` | <0.05=positive, ≥0.05=negative |
| IC半衰期 | `T+12` | — |

---

## 4. Robustness Tests 视觉规格

- 容器: `mt-3 pt-3 border-t border-mine-border/40`
- 标题: `panel-hint mb-2` — "鲁棒性检验"
- 保留现有 `RobustnessSection` 的行布局和颜色逻辑

### 行格式

```
[Test Name]  [description]              [value]  [badge]
Rank Test    rank(X) 保留率              72%      逻辑扎实
Binary Test  sign(X) 保留率              58%      中等
```

### 颜色逻辑（保留现有）

- ≥70%: `text-market-down-medium` + `bg-market-down-medium/8` — "逻辑扎实"（绿=好）
- 30-70%: `text-market-flat` + `bg-market-flat/8` — "中等"
- <30%: `text-market-up-medium` + `bg-market-up-medium/8` — "过拟合风险"（红=差）

注意: 这里的颜色逻辑和市场色相反（高保留率=好=绿，不是红），因为这不是收益而是稳定性指标。

---

## 5. 删除清单

| 删除项 | 文件 | 说明 |
|--------|------|------|
| `ICStatsCollapsible` | `ic-stats-collapsible.tsx` | 合并入 ICStatisticsSection |
| `RobustnessSection` | `robustness-section.tsx` | 合并入 ICStatisticsSection |
| `ICHistogramSection` | `charts/ic-histogram.tsx` | 替换为增强版直方图 |
| 三个组件引用 | `factor-detail-panel.tsx` | 替换为单个 ICStatisticsSection |

---

## 6. 组件规范

- `data-slot="ic-statistics-section"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 7. 任务顺序

1. **新建增强版直方图** — 自定义 SVG 渲染，20-bin bar + 正态拟合曲线 + hatching
2. **IC KV Grid** — 从 ICStatsCollapsible 迁移，去掉折叠，直接显示
3. **Robustness Tests** — 从 RobustnessSection 迁移，保留行布局和颜色
4. **组合 ICStatisticsSection** — 三部分合并为一个 PanelSection
5. **集成到 factor-detail-panel** — 替换三个旧组件
6. **删除旧组件** — ICStatsCollapsible + RobustnessSection + ICHistogramSection
