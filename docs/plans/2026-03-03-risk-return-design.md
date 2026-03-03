# Risk-Return 组件设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 新建 Risk-Return section，展示因子的风险收益特征。2 个并排 Hero Card（Sharpe + MaxDD）+ 4 个 sub-metric 组成的 2×2 grid。

**Architecture:** 新建 `RiskReturnSection` 组件，复用 #5 Predictive Power 定义的 `HeroMetricCard`。Sub-metrics 用 `PanelStatGrid` + `PanelStatItem`。从 StatisticsSection 迁移换手率和容量指标。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, PanelSection, HeroMetricCard, PanelStatGrid

---

## 1. 布局结构

```
┌─ PanelSection title="RISK-RETURN" ────────────┐
│                                                 │
│ ┌─ Sharpe Card ──────┐ ┌─ MaxDD Card ────────┐ │
│ │ Sharpe              │ │ 最大回撤             │ │
│ │ 2.14  优秀          │ │ -12.3%  合格         │ │
│ │ █████████░░ bar     │ │ ██████░░░░ bar       │ │
│ └─────────────────────┘ └──────────────────────┘ │
│                                                 │
│ ┌──────────┐ ┌──────────┐                       │
│ │ ARR      │ │ Calmar   │                       │
│ │ +18.6%   │ │ 1.51     │                       │
│ ├──────────┤ ├──────────┤                       │
│ │ 换手率   │ │ 容量      │                       │
│ │ 23%      │ │ 2.3亿    │                       │
│ └──────────┘ └──────────┘                       │
└─────────────────────────────────────────────────┘
```

**设计理由:**
- **Hero row**: Sharpe 和 MaxDD 是风险收益的两个最重要维度。Sharpe 衡量风险调整收益，MaxDD 衡量极端风险
- **Sub-metrics 2×2**: ARR/Calmar/换手率/容量是补充性实用指标，不需要 hero 级别展示
- **Hero Card 无 mini chart**: 风险收益指标不像 IC/ICIR 有日频时序，不适合 sparkline。保持简洁
- **Calmar 新增**: ARR/MaxDD 的比值，综合衡量收益与风险的效率

---

## 2. Hero Cards 视觉规格

### 复用 HeroMetricCard

与 #5 Predictive Power 定义的 HeroMetricCard 完全相同的组件，只是：
- **无 sub-metrics 区域**: Sharpe 和 MaxDD 没有附属指标
- **无 mini chart**: 无日频时序数据
- 组件通过 props 控制有无这些区域

### Sharpe Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `factor.sharpeRatio` | `2.14`（2位小数） |
| Tier badge | `getThresholdTier(sharpe, [1.0, 2.0])` | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.sharpe` | domain [-1, 4] |

### MaxDD Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `factor.maxDrawdown` | `-12.3%`（百分比 1 位小数） |
| Tier badge | `getThresholdTier(maxDD, [-0.2, -0.1])` | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.maxDrawdown` | domain [-0.5, 0] |

### 颜色逻辑

- Sharpe: 越高越好 → good=red badge, ok=amber, poor=gray
- MaxDD: 越小越好（绝对值越小越好）→ good=red（回撤小=好）, poor=gray（回撤大=差）

---

## 3. Sub-metrics Grid 视觉规格

- 容器: `mt-2.5`
- 布局: `PanelStatGrid columns={2}`
- 4 个 `PanelStatItem`:

| 指标 | 数据来源 | 格式 | 颜色逻辑 |
|------|----------|------|----------|
| ARR | `factor.annualReturn` | `+18.6%`（±符号 + 百分比） | >0 → up, <0 → down |
| Calmar | `factor.annualReturn / abs(factor.maxDrawdown)` | `1.51`（2位小数） | ≥1.5 → up, ≥0.5 → flat, <0.5 → down |
| 换手率 | `factor.turnover` | `23%` | flat（中性指标） |
| 容量 | `factor.capacity` | `2.3亿` / `5000万` | flat（中性指标） |

---

## 4. 数据模型变更

### 字段提升为 required

```ts
// types.ts — Factor 接口变更
interface Factor {
  // 从 optional 提升为 required
  annualReturn: number;     // 年化收益率 (小数，如 0.186 = 18.6%)
  sharpeRatio: number;      // Sharpe ratio
  maxDrawdown: number;      // 最大回撤 (负数，如 -0.123 = -12.3%)
}
```

### Mock 数据生成

```ts
// mock-library.ts — 所有因子生成这些字段
annualReturn: baseIC * 400 + noise,      // IC 正相关，带噪声
sharpeRatio: annualReturn / volatility,  // 从收益和波动率推导
maxDrawdown: -Math.abs(volatility * 2 + noise),  // 波动率正相关
```

### Calmar 计算（前端）

```ts
const calmarRatio = factor.maxDrawdown !== 0
  ? factor.annualReturn / Math.abs(factor.maxDrawdown)
  : 0;
```

### METRIC_CONFIGS 扩展

需要新增 `calmar` 配置:

```ts
calmar: {
  label: 'Calmar',
  domain: [0, 5],
  thresholds: [0.5, 1.5],
  higherIsBetter: true,
  fmt: 'decimal2',
}
```

---

## 5. 组件结构

```tsx
interface RiskReturnSectionProps {
  factor: Factor;
  className?: string;
}

function RiskReturnSection({ factor, className, ...props }: RiskReturnSectionProps) {
  const calmar = factor.maxDrawdown !== 0
    ? factor.annualReturn / Math.abs(factor.maxDrawdown)
    : 0;

  return (
    <PanelSection title="RISK-RETURN" className={cn(className)} {...props}>
      {/* Hero row: 2 cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <HeroMetricCard label="Sharpe" value={factor.sharpeRatio} metricKey="sharpe" />
        <HeroMetricCard label="最大回撤" value={factor.maxDrawdown} metricKey="maxDrawdown" />
      </div>
      {/* Sub-metrics 2×2 */}
      <PanelStatGrid columns={2} className="mt-2.5">
        <PanelStatItem label="ARR" value={fmtPercent(factor.annualReturn)} color={arrColor(factor.annualReturn)} />
        <PanelStatItem label="Calmar" value={calmar.toFixed(2)} color={calmarColor(calmar)} />
        <PanelStatItem label="换手率" value={`${factor.turnover}%`} />
        <PanelStatItem label="容量" value={fmtCapacity(factor.capacity)} />
      </PanelStatGrid>
    </PanelSection>
  );
}
```

### 组件规范

- `data-slot="risk-return-section"`
- 接受 `className` prop，用 `cn()` 合并
- spread `...props`
- 命名导出

---

## 6. StatisticsSection 变更

从 StatisticsSection 移除所有指标后，StatisticsSection 剩余内容：
- FactorMetricGrid（6 指标 vs 因子库分布）→ 迁移到 #12 IC Statistics 或保留为独立 section
- QuantileBar → 已由 QuantileGauge 替代（另有 design doc）

**StatisticsSection 可能被完全删除**，其内容全部分散到 #5 Predictive Power + #6 Risk-Return + #7 QuantileGauge + #12 IC Statistics。

---

## 7. 任务顺序

1. **数据模型变更** — `annualReturn`/`sharpeRatio`/`maxDrawdown` 提升为 required，mock 数据全部生成
2. **METRIC_CONFIGS 扩展** — 新增 `calmar` 配置
3. **新建 RiskReturnSection** — 2 hero cards + 2×2 sub-metrics grid
4. **集成到 factor-detail-panel** — 插入到 Predictive Power 下方
5. **StatisticsSection 清理** — 移除已迁移指标，评估是否完全删除
