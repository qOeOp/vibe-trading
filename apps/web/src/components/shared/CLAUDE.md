# L2: Shared Components

业务无关但有组合逻辑的组件。用 L1 原语组装而成。

## Layer Rule

**L2 可引用 L0 + L1，禁止引用 L3**。

允许：

- `from '@/components/ui/'` — L1 原语
- `from '@/lib/'` — L0 工具
- `from '@/hooks/'` — 全局 hooks
- 同级 L2（`from '@/components/layout/'`、`from '@/components/animation/'`）

**禁止**：

- `from '@/features/'` — L3 feature 模块

## 当前模块

### Panel System（35 import sites）

统一的因子详情面板系统：PanelFrame → PanelSection → PanelStatGrid / PanelKV / PanelChartBox。
所有面板用这套组件，不要自建面板布局。

### Factor Metrics（2 import sites）

因子质量指标展示：FactorMetricGrid、DistributionBar、ThresholdBar。

## 提升为 L2 的标准

当一个 L3 组件被 **2+ 个 feature** 引用时，应提升到 L2。
提升步骤：

1. 移到 `components/shared/` 或 `components/layout/`
2. 去除 feature 业务耦合
3. 在 registry.ts 更新 layer 和 path
4. 所有消费者改为 `@/components/` 引用
