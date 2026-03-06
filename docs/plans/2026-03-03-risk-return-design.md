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

## 2. 数据来源

### 多维度数据对接

所有数据通过 `useFactorSlice()` hook 获取当前 pool×horizon 的组合数据切片：

| 元素 | 旧数据源 | 新数据源 |
|------|---------|---------|
| Sharpe | `factor.sharpeRatio` | `portfolioSlice.sharpe` |
| MaxDD | `factor.maxDrawdown` | `portfolioSlice.maxDrawdown` |
| ARR | `factor.annualReturn` | `portfolioSlice.annualReturn` |
| 换手率 | `factor.turnover` | `portfolioSlice.turnover` |
| 容量 | `factor.capacity` | `portfolioSlice.capacity` |

见 `factor-data-architecture.md` §2.5。

### 数据来源标签

组合指标在 INCUBATING 阶段是回测快照，PAPER_TEST 起是活数据。Section title 旁显示数据来源标签：

| 阶段 | 标签 | 含义 |
|------|------|------|
| INCUBATING | "回测值" | 入库时回测的静态快照，不随日更新变化 |
| PAPER_TEST | "模拟盘" | 模拟盘每日更新 |
| LIVE_ACTIVE | "实盘" | 实盘每日更新 |

- 标签样式: `text-[8px] text-mine-muted`，放在 section title 右侧
- 旁加 ⓘ tooltip 解释含义（复用 V-Score 的 tooltip 文案）

### 入库时全算

入库时 16 组 pool×horizon 的组合指标全部后台异步计算（约 30-60 分钟）。用户切换 tab 时所有 section 都有数据，体验一致。

---

## 3. Hero Cards 视觉规格

### 复用 HeroMetricCard

与 #5 Predictive Power 定义的 HeroMetricCard 完全相同的组件，只是：
- **无 sub-metrics 区域**: Sharpe 和 MaxDD 没有附属指标
- **无 mini chart**: 无日频时序数据
- 组件通过 props 控制有无这些区域

### Sharpe Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `portfolioSlice.sharpe` | `2.14`（2位小数） |
| Tier badge | `getThresholdTier(sharpe, [0.8, 1.5])` | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.sharpe` | domain [-1, 4] |

**Sharpe 计算公式:**

```
Sharpe = (年化收益率 - 无风险利率) / 年化波动率
```

- **无风险利率**: 默认 3%（中国 10 年期国债收益率中枢），写入 Settings 全局配置允许调整
- **年化**: 波动率 × √252（A 股年交易日约 252 天）
- **业界对标**: 聚宽、米筐、Wind 均使用同一公式，无风险利率参数通常 2-4%
- **阈值**: ≥1.5 优秀, ≥0.8 合格 — 单因子多空组合标准（区别于完整策略的 ≥2.0 优秀）

### MaxDD Card

| 元素 | 数据来源 | 格式 |
|------|----------|------|
| Hero value | `portfolioSlice.maxDrawdown` | `-12.3%`（百分比 1 位小数） |
| Tier badge | `getThresholdTier(maxDD, [-0.2, -0.1])` | 优秀/合格/低于合格线 |
| Threshold bar | `METRIC_CONFIGS.maxDrawdown` | domain [-0.5, 0] |

### Tier Badge 与颜色逻辑

Sharpe 没有对应的 Radar 校准维度（Radar 将其拆为 return + risk 两个独立维度），保留业界标准硬编码阈值。MaxDD 使用 Radar risk 维度的校准基准（score 分档）。

- **Sharpe**: 单因子多空组合标准 — ≥1.5 优秀(红), ≥0.8 合格(琥珀), <0.8 低于合格线(灰)
- **MaxDD**: 基于 risk 维度 `calibratedNormalize` score — score≥0.8 优秀(红), score≥0.5 合格(琥珀), score<0.5 低于合格线(灰)
- 颜色语义: good=`market-up-medium`(红=好), ok=`amber-500`, poor=`mine-muted`

---

## 4. Sub-metrics Grid 视觉规格

- 容器: `mt-2.5`
- 布局: `PanelStatGrid columns={2}`
- 4 个 `PanelStatItem`:

| 指标 | 数据来源 | 格式 | 颜色逻辑 |
|------|----------|------|----------|
| ARR | `portfolioSlice.annualReturn` | `+18.6%`（±符号 + 百分比） | >0 → up, <0 → down |
| Calmar | `portfolioSlice.calmar` | `1.51`（2位小数） | ≥2.0 → up, ≥1.0 → flat, <1.0 → down |
| 换手率 | `portfolioSlice.turnover` | `23%` | flat（中性指标） |
| 容量 | `portfolioSlice.capacity` | `2.3亿` / `5000万` | flat（中性指标） |

---

## 5. 数据模型变更

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
const calmarRatio = portfolioSlice.maxDrawdown !== 0
  ? portfolioSlice.annualReturn / Math.abs(portfolioSlice.maxDrawdown)
  : 0;
```

**Calmar 计算说明:**

- **公式**: Calmar = ARR / |MaxDD|，标准定义不扣无风险利率（区别于 Sharpe）
- **时间窗口**: 原始定义用 36 个月滚动窗口（Young, 1991），但因子回测结果使用**全回测区间**，与 A 股量化平台惯例一致（聚宽、米筐均默认全区间）
- **阈值**: ≥2.0 优秀, ≥1.0 合格 — 结合 A 股因子回测实践设定

### METRIC_CONFIGS 扩展

需要新增 `calmar` 配置:

```ts
calmar: {
  label: 'Calmar',
  domain: [0, 5],
  thresholds: [1.0, 2.0],
  higherIsBetter: true,
  fmt: 'decimal2',
}
```

---

## 6. 组件结构

```tsx
interface RiskReturnSectionProps {
  factor: Factor;
  className?: string;
}

function RiskReturnSection({ factor, className, ...props }: RiskReturnSectionProps) {
  const slice = useFactorSlice();

  return (
    <PanelSection title="RISK-RETURN" className={cn(className)} {...props}>
      {/* Hero row: 2 cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <HeroMetricCard label="Sharpe" value={slice.sharpe} metricKey="sharpe" />
        <HeroMetricCard label="最大回撤" value={slice.maxDrawdown} metricKey="maxDrawdown" />
      </div>
      {/* Sub-metrics 2×2 */}
      <PanelStatGrid columns={2} className="mt-2.5">
        <PanelStatItem label="ARR" value={fmtPercent(slice.annualReturn)} color={arrColor(slice.annualReturn)} />
        <PanelStatItem label="Calmar" value={slice.calmar.toFixed(2)} color={calmarColor(slice.calmar)} />
        <PanelStatItem label="换手率" value={`${slice.turnover}%`} />
        <PanelStatItem label="容量" value={fmtCapacity(slice.capacity)} />
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

## 7. StatisticsSection 变更

从 StatisticsSection 移除所有指标后，StatisticsSection 剩余内容：
- FactorMetricGrid（6 指标 vs 因子库分布）→ 迁移到 #12 IC Statistics 或保留为独立 section
- QuantileBar → 已由 QuantileGauge 替代（另有 design doc）

**StatisticsSection 可能被完全删除**，其内容全部分散到 #5 Predictive Power + #6 Risk-Return + #7 QuantileGauge + #12 IC Statistics。

---

## 8. 任务顺序

1. **数据模型变更** — `annualReturn`/`sharpeRatio`/`maxDrawdown` 提升为 required，mock 数据全部生成
2. **METRIC_CONFIGS 扩展** — 新增 `calmar` 配置
3. **新建 RiskReturnSection** — 2 hero cards + 2×2 sub-metrics grid
4. **集成到 factor-detail-panel** — 插入到 Predictive Power 下方
5. **StatisticsSection 清理** — 移除已迁移指标，评估是否完全删除
