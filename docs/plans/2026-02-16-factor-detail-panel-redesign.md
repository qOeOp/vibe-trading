# Factor Detail Panel — 全面重新设计

> 日期: 2026-02-16
> 状态: 已确认，待实现

## 背景

因子库详情面板 (`features/library/components/factor-detail-panel.tsx`) 当前 891 行单文件，8 个 section 平铺，存在以下问题：

1. **信息架构**：8 个 section 无优先级，用户要滚很长才能判断"因子能不能用"
2. **代码结构**：单文件 891 行，8 个 sub-component 全部内联
3. **颜色硬编码**：30+ 处 hex 颜色（`#2EBD85`, `#F6465D`, `#76808E`），未用设计系统 token
4. **图表手搓**：IC 衰减、IC 时序、分位 bar 都是手写 SVG，未用 ngx-charts
5. **缺失功能**：blueprint 定义的 IC 分布直方图、多空净值曲线未实现
6. **未用原语**：未使用 DetailPanel/DetailSection 等共享组件

## 信息架构重组

核心场景：用户在因子库表格点选因子，右侧弹出详情，30 秒内判断"值得深入 / 跳过 / 需要关注"。

### 当前 → 新架构

```
当前（平铺）:                    新（分层）:
1. Identity                     Header: 身份卡（精简，表达式折叠）
2. Statistics                   Layer 1: V-Score + 雷达图（一眼判断）
3. Fitness                      Layer 2: 3×3 KPI 网格 + 分位 bar
4. Radar          →             Layer 3: IC 时序 / IC 直方图(新) / 多空净值(新) / IC 衰减
5. Robustness                   Layer 4: 多池适用性 / 鲁棒性 / IC 统计详情 / 状态变更
6. IC Decay
7. IC Series
8. Actions
```

关键变化：
- 雷达图上移到 Layer 1（直觉判断层）
- IC 三窗口合并到 KPI 网格第一行
- 新增 IC 分布直方图 + 多空净值曲线（blueprint C2/C3）
- 多池适用性和鲁棒性降级到 Layer 4

## 文件架构

```
features/library/components/factor-detail/
├── index.ts                    # barrel export
├── factor-detail-panel.tsx     # 主面板（DetailPanel 原语 + section 组合）
├── identity-header.tsx         # Header: 身份卡
├── overview-section.tsx        # Layer 1: V-Score + 雷达图
├── statistics-section.tsx      # Layer 2: KPI 网格 + 分位 bar
├── charts/
│   ├── ic-time-series.tsx      # IC 时序（ngx-charts line）
│   ├── ic-histogram.tsx        # IC 分布直方图（新建）
│   ├── long-short-equity.tsx   # 多空净值曲线（新建）
│   ├── ic-decay-profile.tsx    # IC 衰减剖面（ngx-charts bar）
│   └── quantile-bar.tsx        # 分位收益 bar
├── fitness-section.tsx         # Layer 4: 多池适用性
├── robustness-section.tsx      # Layer 4: 鲁棒性检验
├── ic-stats-collapsible.tsx    # Layer 4: IC 统计详情折叠
└── status-actions.tsx          # Layer 4: 状态变更
```

## 视觉设计决策

### Header
- 表达式默认收起，ChevronRight 旋转展开
- 生命周期时间线保持 LifecycleTimeline 组件

### Layer 1: V-Score + 雷达图
- 同一个 DetailSection，V-Score 在上雷达图在下
- 雷达图 7 维 → 5 维（收益力/稳定性/效率/容量/鲜度）

### Layer 2: 核心指标
- DetailStatGrid 3×3:
  - Row 1: IC(20D) / IC(60D) / IC(120D)
  - Row 2: IR / t-stat / 胜率
  - Row 3: 换手 / 容量 / IC半衰期
- 基准配置 → section suffix
- 分位收益 Q1-Q5 bar（ngx-charts）

### Layer 3: 图表区
- IC 时序: 三层（灰日值 + 蓝 MA + 红阈值）
- IC 分布直方图: 20-bin + 正态叠加 + 参考线
- 多空净值曲线: indigo 线 + MaxDD 红区 + 底部 4 KPI
- IC 衰减: T+1~T+20 bar

### Layer 4: 补充信息
- 多池适用性表格紧凑化
- 鲁棒性 Rank/Binary 两行
- IC 统计详情折叠，用 DetailKV
- 状态变更按钮 + StatusChangeDialog

### 动效
- 面板入场: AnimateIn from="right"
- 因子切换: AnimatePresence + key={factor.id}
- 图表: ngx-charts path morph
- 折叠: ChevronRight 旋转 + height transition

## 数据变更

types.ts 新增 6 个 MVP 字段：
- `icHalfLife: number` — IC 半衰期
- `coverageRate: number` — 因子覆盖率
- `longShortReturn: number` — 多空年化收益
- `longShortEquityCurve: number[]` — 多空累计净值曲线
- `longSideReturnRatio: number` — 多头收益占比
- `icHistogramBins: number[]` — IC 分布直方图 bins

## 实现步骤

1. types.ts 新增字段 + mock-library.ts 补充 mock 数据
2. 创建 factor-detail/ 目录结构 + barrel export
3. 实现 identity-header.tsx（用 DetailHeader）
4. 实现 overview-section.tsx（V-Score + 5 维雷达图）
5. 实现 statistics-section.tsx（3×3 KPI + 分位 bar）
6. 实现 charts/（4 个图表组件）
7. 实现 Layer 4 sections（fitness/robustness/ic-stats/actions）
8. 组装 factor-detail-panel.tsx（主面板 + 动效）
9. 更新 library-page.tsx import 路径
10. 验证编译 + 视觉检查
